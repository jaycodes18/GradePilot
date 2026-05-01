import { NextRequest } from "next/server";
import { demoOutput, type DemoId, type LexiconAnalysis } from "@/lib/demo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  text?: string;
  mode?: "demo" | "live";
  demoId?: DemoId;
  apiKey?: string;
  model?: string;
};

type ApiResponse =
  | { ok: true; mode: "demo" | "live"; result: LexiconAnalysis }
  | { ok: false; error: string };

const VALID_DEMO_IDS: DemoId[] = ["clean-nda", "vendor-msa", "employment-trap"];

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const mode = body.mode ?? "demo";

  if (mode === "demo") {
    const raw = body.demoId ?? "vendor-msa";
    const demoId: DemoId = VALID_DEMO_IDS.includes(raw as DemoId)
      ? (raw as DemoId)
      : "vendor-msa";
    const result = demoOutput(demoId);
    return Response.json({ ok: true, mode: "demo", result } satisfies ApiResponse);
  }

  const apiKey = (body.apiKey ?? "").trim();
  const text = (body.text ?? "").trim();
  const model = (body.model ?? "gpt-4o-mini").trim();

  if (!apiKey) {
    return Response.json(
      { ok: false, error: "Missing API key. Use demo mode or provide an OpenAI API key." } satisfies ApiResponse,
      { status: 400 },
    );
  }
  if (!text || text.length < 40) {
    return Response.json(
      { ok: false, error: "Please paste more contract text for analysis (minimum 40 characters)." } satisfies ApiResponse,
      { status: 400 },
    );
  }

  try {
    const result = await analyzeWithOpenAI({ apiKey, text, model });
    return Response.json({ ok: true, mode: "live", result } satisfies ApiResponse);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ ok: false, error: msg } satisfies ApiResponse, { status: 500 });
  }
}

async function analyzeWithOpenAI({
  apiKey,
  text,
  model,
}: {
  apiKey: string;
  text: string;
  model: string;
}): Promise<LexiconAnalysis> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.15,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Lexicon, an AI legal contract analyzer for startups and small businesses.
Analyze the provided contract text and return ONLY a valid JSON object with this exact schema:
{
  "summary": string,
  "riskLevel": "low" | "medium" | "high",
  "confidence": number (0 to 1),
  "topRisk": string (one-sentence description of the biggest risk),
  "verdict": string (one sentence: safe/negotiate/do not sign),
  "warnings": [
    {
      "title": string,
      "detail": string (what the clause says and why it's flagged),
      "whatItMeans": string (plain-English impact on the user specifically),
      "whatToDo": string (concrete next step or negotiation suggestion),
      "severity": "info" | "warn" | "critical"
    }
  ],
  "precautions": [
    {
      "title": string,
      "detail": string,
      "urgency": "immediate" | "before-signing" | "monitor"
    }
  ],
  "suggestedEdits": [
    {
      "clause": string (section name),
      "current": string (what it currently says, or a summary),
      "suggested": string (your proposed replacement language),
      "reason": string (why this change matters)
    }
  ],
  "missingClauses": string[],
  "plainEnglish": string (2-4 sentences, founder-friendly summary)
}

Be specific and detailed. Focus on practical risks, not theoretical ones.
Do not add any text outside the JSON object.`,
        },
        {
          role: "user",
          content: `Analyze this contract:\n\n${text.slice(0, 16000)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenAI request failed (${res.status}): ${t.slice(0, 300)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Model returned an empty response. Please try again.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Model did not return valid JSON. Try again or use demo mode.");
  }

  return normalizeAnalysis(parsed);
}

function normalizeAnalysis(x: unknown): LexiconAnalysis {
  const o = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
  const risk = str(o.riskLevel as string);
  const safeRisk: "low" | "medium" | "high" =
    risk === "low" || risk === "medium" || risk === "high" ? risk : "medium";

  return {
    summary: str(o.summary) || "No summary produced.",
    riskLevel: safeRisk,
    confidence: clamp01(num(o.confidence, 0.7)),
    topRisk: str(o.topRisk) || "See warnings below.",
    verdict: str(o.verdict) || "Review carefully before signing.",
    warnings: arr(o.warnings).map((w) => {
      const sev = str(w.severity);
      return {
        title: str(w.title) || "Warning",
        detail: str(w.detail) || "",
        whatItMeans: str(w.whatItMeans) || str(w.detail) || "",
        whatToDo: str(w.whatToDo) || "Consult legal counsel.",
        severity:
          sev === "info" || sev === "warn" || sev === "critical" ? sev : ("warn" as const),
      };
    }),
    precautions: arr(o.precautions).map((p) => {
      const urg = str(p.urgency);
      return {
        title: str(p.title) || "Precaution",
        detail: str(p.detail) || "",
        urgency:
          urg === "immediate" || urg === "before-signing" || urg === "monitor"
            ? urg
            : ("before-signing" as const),
      };
    }),
    suggestedEdits: arr(o.suggestedEdits).map((s) => ({
      clause: str(s.clause) || "Clause",
      current: str(s.current) || str(s.suggestion) || "",
      suggested: str(s.suggested) || str(s.suggestion) || "",
      reason: str(s.reason) || "",
    })),
    missingClauses: arr(o.missingClauses)
      .map((c) => (typeof c === "string" ? c : str(c)))
      .filter(Boolean),
    plainEnglish: str(o.plainEnglish) || str(o.summary) || "",
  };
}

function str(v: unknown) {
  return typeof v === "string" ? v : "";
}
function num(v: unknown, fallback: number) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function arr(v: unknown): any[] {
  return Array.isArray(v) ? v : [];
}
