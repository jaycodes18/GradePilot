"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import {
  DEMOS,
  demoOutput,
  type DemoId,
  type LexiconAnalysis,
  type Warning,
} from "@/lib/demo";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  CopyCheck,
  Info,
  XCircle,
} from "lucide-react";

type Mode = "demo" | "live";

const SCAN_STATUSES = [
  "Initializing document parser...",
  "Tokenizing clause structure...",
  "Extracting key provisions...",
  "Analyzing liability terms...",
  "Detecting indemnification clauses...",
  "Scanning data rights provisions...",
  "Flagging unusual restrictions...",
  "Evaluating termination rights...",
  "Cross-referencing risk patterns...",
  "Scoring clause severity...",
  "Compiling negotiation suggestions...",
  "Generating risk report...",
];

const DOC_LINE_WIDTHS = [92, 78, 85, 64, 90, 72, 88, 55, 95, 80, 66, 83, 70, 89, 75, 92, 60, 86, 73, 91, 65, 80, 58, 88, 76];

export default function AppPage() {
  const [mode, setMode] = useState<Mode>("demo");
  const [demoId, setDemoId] = useState<DemoId>("vendor-msa");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedLines, setScannedLines] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LexiconAnalysis | null>(null);
  const [showToast, setShowToast] = useState(false);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDemo = useMemo(() => DEMOS.find((d) => d.id === demoId)!, [demoId]);

  useEffect(() => {
    const saved = localStorage.getItem("lexicon:apiKey");
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    if (mode === "demo") {
      setText(currentDemo.sampleContract);
      setResult(null);
      setError(null);
    }
  }, [demoId, mode, currentDemo.sampleContract]);

  // Keyboard shortcuts: 1/2/3 switch demo, D=demo mode, L=live mode
  useEffect(() => {
    const DEMO_KEYS: Record<string, DemoId> = {
      "1": "clean-nda",
      "2": "vendor-msa",
      "3": "employment-trap",
    };
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      // Ignore when typing in inputs/textareas
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (DEMO_KEYS[e.key]) {
        setMode("demo");
        setDemoId(DEMO_KEYS[e.key]);
      }
      if (e.key === "d" || e.key === "D") setMode("demo");
      if (e.key === "l" || e.key === "L") setMode("live");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const stopScan = useCallback(() => {
    if (scanInterval.current) clearInterval(scanInterval.current);
    if (lineInterval.current) clearInterval(lineInterval.current);
    scanInterval.current = null;
    lineInterval.current = null;
  }, []);

  const startScan = useCallback(() => {
    setScanStatus(0);
    setScanProgress(0);
    setScannedLines(new Set());

    const totalMs = 3200;
    const statusDelay = totalMs / SCAN_STATUSES.length;

    let statusIdx = 0;
    scanInterval.current = setInterval(() => {
      statusIdx++;
      setScanStatus(statusIdx);
      setScanProgress(Math.min(100, Math.round((statusIdx / SCAN_STATUSES.length) * 100)));
      if (statusIdx >= SCAN_STATUSES.length) stopScan();
    }, statusDelay);

    let lineIdx = 0;
    lineInterval.current = setInterval(() => {
      setScannedLines((prev) => new Set([...prev, lineIdx]));
      lineIdx++;
      if (lineIdx >= DOC_LINE_WIDTHS.length) {
        if (lineInterval.current) clearInterval(lineInterval.current);
      }
    }, totalMs / DOC_LINE_WIDTHS.length);
  }, [stopScan]);

  async function analyze() {
    setError(null);
    setResult(null);
    setLoading(true);
    startScan();

    const minWait = new Promise<void>((r) => setTimeout(r, 3400));

    try {
      let analysis: LexiconAnalysis;
      if (mode === "demo") {
        analysis = demoOutput(demoId);
      } else {
        localStorage.setItem("lexicon:apiKey", apiKey);
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "live", apiKey, model, text }),
        });
        const data = (await res.json()) as { ok: boolean; result?: LexiconAnalysis; error?: string };
        if (!data.ok || !data.result) throw new Error(data.error || "Analysis failed.");
        analysis = data.result;
      }

      await minWait;
      setResult(analysis);
      setShowToast(true);
    } catch (e) {
      await minWait;
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      stopScan();
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <Toast
        show={showToast}
        message="Analysis complete"
        sub={result ? `${result.warnings.length} issues found · ${result.riskLevel.toUpperCase()} RISK` : undefined}
        onClose={() => setShowToast(false)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-16">
        {/* Page header */}
        <div className="mb-8">
          <div className="neo-label text-xs mb-2">LEXICON APP</div>
          <h1 className="neo-display text-[clamp(2rem,4vw,3rem)] mb-2">
            Contract Analysis Workstation
          </h1>
          <p className="font-bold text-sm text-black/60 max-w-[80ch]">
            Choose Demo mode to try one of three built-in contracts instantly, or switch to Live
            mode and paste your own API key to analyze any real agreement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-5 items-start">
          {/* ---- INPUT PANEL ---- */}
          <div className="border-4 border-black bg-white shadow-neo">
            {/* Panel header */}
            <div className="border-b-4 border-black px-5 py-3 flex items-center justify-between bg-neo-bg">
              <span className="neo-label text-xs">INPUT</span>
              <ModeToggle mode={mode} setMode={setMode} />
            </div>

            <div className="p-5 space-y-4">
              {/* Demo selectors */}
              {mode === "demo" && (
                <div>
                  <div className="neo-label text-xs mb-3">SCENARIO</div>
                  <div className="space-y-2">
                    {DEMOS.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDemoId(d.id)}
                        className={`w-full flex items-center justify-between border-4 px-4 py-3 transition-all duration-100 text-left ${
                          demoId === d.id
                            ? "border-black bg-neo-black text-white shadow-neo-sm"
                            : "border-black bg-white hover:bg-neo-secondary hover:shadow-neo-xs"
                        }`}
                      >
                        <span className="font-bold text-sm">{d.label}</span>
                        <RiskChip level={d.riskColor} label={d.riskLabel} inverted={demoId === d.id} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 border-4 border-neo-muted bg-neo-muted/20 px-4 py-3">
                    <p className="font-bold text-xs text-black/70">{currentDemo.subtitle}</p>
                  </div>
                  {/* Keyboard shortcuts hint */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="neo-label text-[9px] text-black/40">KEYBOARD:</span>
                    {["1","2","3"].map((k, i) => (
                      <span key={k} className="flex items-center gap-1">
                        <kbd className="border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_#000]">{k}</kbd>
                        <span className="neo-label text-[9px] text-black/40">{DEMOS[i].riskLabel}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live mode API key */}
              {mode === "live" && (
                <div className="space-y-3">
                  <div>
                    <div className="neo-label text-xs mb-2">API KEY (saved in browser)</div>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="neo-input w-full px-4 py-3 text-sm"
                    />
                    <p className="font-bold text-xs text-black/50 mt-2">
                      Hackathon prototype: key is stored locally, never sent to our servers.
                    </p>
                  </div>
                  <div>
                    <div className="neo-label text-xs mb-2">MODEL</div>
                    <input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="neo-input w-full px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Document area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="neo-label text-xs">CONTRACT TEXT</div>
                  {mode === "demo" && (
                    <span className="neo-label text-[10px] text-black/50">
                      {currentDemo.docTitle}
                    </span>
                  )}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={18}
                  className="neo-input w-full px-4 py-3 text-xs leading-relaxed font-mono resize-none"
                  placeholder="Paste your contract text here..."
                  spellCheck={false}
                />
              </div>

              {/* Action row */}
              <div className="flex gap-3">
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="neo-btn bg-neo-accent text-white px-6 py-3 text-sm gap-2 flex-1 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">+</span> Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Contract <ArrowRight strokeWidth={3} size={15} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setResult(null); setError(null); setText(""); }}
                  className="neo-btn bg-white border-black px-4 py-3 text-sm"
                >
                  Clear
                </button>
              </div>

              {error && (
                <div className="border-4 border-neo-accent bg-neo-accent/10 px-4 py-3">
                  <div className="font-bold text-sm">Error: {error}</div>
                </div>
              )}
            </div>
          </div>

          {/* ---- OUTPUT PANEL ---- */}
          <div className="border-4 border-black bg-white shadow-neo min-h-[600px]">
            <div className="border-b-4 border-black px-5 py-3 flex items-center justify-between bg-neo-bg">
              <span className="neo-label text-xs">OUTPUT</span>
              {result && (
                <RiskChip
                  level={result.riskLevel === "low" ? "green" : result.riskLevel === "medium" ? "yellow" : "red"}
                  label={`${result.riskLevel.toUpperCase()} RISK`}
                />
              )}
            </div>

            {loading ? (
              <ScanningAnimation
                status={SCAN_STATUSES[Math.min(scanStatus, SCAN_STATUSES.length - 1)]}
                progress={scanProgress}
                scannedLines={scannedLines}
                docTitle={mode === "demo" ? currentDemo.docTitle : "YOUR CONTRACT"}
              />
            ) : result ? (
              <AnalysisOutput result={result} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---- SCANNING ANIMATION ---- */
function ScanningAnimation({
  status,
  progress,
  scannedLines,
  docTitle,
}: {
  status: string;
  progress: number;
  scannedLines: Set<number>;
  docTitle: string;
}) {
  return (
    <div className="p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-3 rounded-full bg-neo-accent animate-blink" />
        <span className="font-bold text-sm uppercase tracking-wide">SCANNING IN PROGRESS</span>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        {/* Document preview with scan beam */}
        <div className="border-4 border-black relative overflow-hidden bg-white" style={{ minHeight: 360 }}>
          {/* Doc header bar */}
          <div className="border-b-4 border-black bg-neo-bg px-3 py-2">
            <span className="neo-label text-[9px]">{docTitle}</span>
          </div>

          {/* Scan beam */}
          <div className="scan-beam" />

          {/* Document lines */}
          <div className="p-3 space-y-2 pt-3">
            {DOC_LINE_WIDTHS.map((w, i) => (
              <div
                key={i}
                className={`h-2.5 transition-colors duration-100 ${
                  scannedLines.has(i) ? "doc-line-scanned" : "bg-black/10"
                }`}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>

          {/* Overlay gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* Status column */}
        <div className="flex flex-col gap-3 min-w-[160px]">
          <div className="neo-label text-[10px] text-black/50">DETECTION</div>
          {[
            "Document structure",
            "Key provisions",
            "Liability terms",
            "Data rights",
            "Risk patterns",
          ].map((check, i) => {
            const done = progress > (i + 1) * 18;
            return (
              <div key={check} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 border-2 border-black flex items-center justify-center flex-shrink-0 ${
                    done ? "bg-neo-accent" : "bg-white"
                  }`}
                >
                  {done && <span className="text-white text-[9px] leading-none font-bold">+</span>}
                </div>
                <span className={`font-bold text-xs ${done ? "text-black" : "text-black/40"}`}>
                  {check}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status + progress */}
      <div className="mt-5 border-4 border-black bg-neo-bg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-xs text-black/70">{status}</span>
          <span className="neo-label text-xs font-bold">{progress}%</span>
        </div>
        <div className="h-3 bg-black/10 border-2 border-black overflow-hidden">
          <div
            className="h-full bg-neo-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---- ANALYSIS OUTPUT ---- */
function AnalysisOutput({ result }: { result: LexiconAnalysis }) {
  return (
    <div className="divide-y-4 divide-black">
      {/* Verdict + summary */}
      <div className="p-5">
        <div className="border-4 border-black p-4 bg-neo-secondary/30 mb-4">
          <div className="neo-label text-xs mb-2">LEXICON VERDICT</div>
          <p className="font-bold text-sm leading-relaxed">{result.verdict}</p>
        </div>
        <div className="neo-label text-xs mb-2">FULL SUMMARY</div>
        <p className="font-bold text-sm text-black/80 leading-relaxed">{result.summary}</p>
      </div>

      {/* Risk gauge */}
      <div className="p-5 border-b-4 border-black">
        <RiskGauge riskLevel={result.riskLevel} confidence={result.confidence} topRisk={result.topRisk} />
      </div>

      {/* Plain English */}
      <div className="p-5 bg-neo-muted/20">
        <div className="neo-label text-xs mb-2">PLAIN ENGLISH</div>
        <p className="font-bold text-sm leading-relaxed">{result.plainEnglish}</p>
      </div>

      {/* Warnings */}
      <Accordion
        title={`Warnings (${result.warnings.length})`}
        badge={result.warnings.filter((w) => w.severity === "critical").length + " CRITICAL"}
        badgeColor="bg-neo-accent"
        defaultOpen
      >
        <div className="space-y-4">
          {result.warnings.map((w, i) => (
            <WarningCard key={i} warning={w} />
          ))}
        </div>
      </Accordion>

      {/* Precautions */}
      <Accordion title={`Precautionary Actions (${result.precautions.length})`} badgeColor="bg-neo-secondary">
        <div className="space-y-3">
          {result.precautions.map((p, i) => (
            <div key={i} className="border-4 border-black p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-bold text-sm">{p.title}</div>
                <span
                  className={`neo-label text-[9px] px-2 py-1 border-2 border-black flex-shrink-0 ${
                    p.urgency === "immediate"
                      ? "bg-neo-accent text-white"
                      : p.urgency === "before-signing"
                        ? "bg-neo-secondary"
                        : "bg-neo-muted/50"
                  }`}
                >
                  {p.urgency.replace("-", " ").toUpperCase()}
                </span>
              </div>
              <p className="font-bold text-xs text-black/70 leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>
      </Accordion>

      {/* Suggested edits */}
      <Accordion title={`Suggested Edits (${result.suggestedEdits.length})`} badgeColor="bg-neo-muted">
        <div className="space-y-4">
          {result.suggestedEdits.map((s, i) => (
            <SuggestedEditCard key={i} edit={s} />
          ))}
        </div>
      </Accordion>

      {/* Missing clauses */}
      <Accordion
        title={`Missing Clauses (${result.missingClauses.length})`}
        badgeColor="bg-neo-secondary"
      >
        <div className="space-y-2">
          {result.missingClauses.map((clause, i) => (
            <div key={i} className="flex items-start gap-3 border-4 border-black px-4 py-3 bg-white">
              <XCircle strokeWidth={3} size={14} className="text-neo-accent flex-shrink-0 mt-0.5" />
              <span className="font-bold text-sm">{clause}</span>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  );
}

function WarningCard({ warning }: { warning: Warning }) {
  const [expanded, setExpanded] = useState(true);
  const sevConfig = {
    critical: { icon: <XCircle strokeWidth={3} size={16} />, bg: "bg-neo-accent", label: "CRITICAL", textCls: "text-white" },
    warn: { icon: <AlertTriangle strokeWidth={3} size={16} />, bg: "bg-neo-secondary", label: "WARNING", textCls: "text-black" },
    info: { icon: <Info strokeWidth={3} size={16} />, bg: "bg-neo-muted", label: "INFO", textCls: "text-black" },
  }[warning.severity];

  return (
    <div className="border-4 border-black overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-neo-bg border-b-4 border-black hover:bg-neo-secondary/30 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-6 h-6 ${sevConfig.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={sevConfig.textCls}>{sevConfig.icon}</span>
        </div>
        <span className="font-bold text-sm flex-1">{warning.title}</span>
        <div className={`${sevConfig.bg} border-2 border-black px-2 py-0.5 flex-shrink-0`}>
          <span className={`neo-label text-[9px] ${sevConfig.textCls}`}>{sevConfig.label}</span>
        </div>
        {expanded ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
      </button>
      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <div className="neo-label text-[10px] mb-1 text-black/50">DETAIL</div>
            <p className="font-bold text-xs text-black/80 leading-relaxed">{warning.detail}</p>
          </div>
          <div className="border-4 border-black bg-neo-bg p-3">
            <div className="neo-label text-[10px] mb-1">WHAT THIS MEANS FOR YOU</div>
            <p className="font-bold text-xs leading-relaxed">{warning.whatItMeans}</p>
          </div>
          <div className="border-4 border-neo-muted bg-neo-muted/20 p-3">
            <div className="neo-label text-[10px] mb-1 text-black/70">WHAT TO DO</div>
            <p className="font-bold text-xs leading-relaxed">{warning.whatToDo}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({
  title,
  badge,
  badgeColor,
  children,
  defaultOpen = false,
}: {
  title: string;
  badge?: string;
  badgeColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-neo-bg border-b-4 border-black hover:bg-neo-secondary/30 transition-colors text-left"
      >
        <span className="font-bold text-sm flex-1">{title}</span>
        {badge && (
          <span className={`${badgeColor} border-2 border-black px-2 py-0.5`}>
            <span className="neo-label text-[9px]">{badge}</span>
          </span>
        )}
        {open ? <ChevronUp strokeWidth={3} size={14} /> : <ChevronDown strokeWidth={3} size={14} />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-10 flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="w-20 h-20 border-4 border-black bg-neo-bg flex items-center justify-center mb-6 shadow-neo rotate-3">
        <Clipboard strokeWidth={2.5} size={32} />
      </div>
      <h3 className="font-bold text-xl mb-2 text-center">Ready to analyze</h3>
      <p className="font-bold text-sm text-black/60 text-center max-w-[36ch] leading-relaxed">
        Choose a demo scenario or paste your own contract text, then click Analyze Contract.
      </p>
    </div>
  );
}

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="flex border-4 border-black">
      {(["demo", "live"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`neo-label text-[10px] px-4 py-2 transition-colors ${
            mode === m ? "bg-neo-black text-white" : "bg-white hover:bg-neo-secondary"
          }`}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function RiskChip({
  level,
  label,
  inverted = false,
}: {
  level: "green" | "yellow" | "red";
  label: string;
  inverted?: boolean;
}) {
  const map = {
    green: inverted ? "bg-neo-muted border-white" : "bg-neo-muted border-black",
    yellow: inverted ? "bg-neo-secondary border-white" : "bg-neo-secondary border-black",
    red: inverted ? "bg-neo-accent border-white" : "bg-neo-accent border-black",
  };
  return (
    <div className={`border-2 ${map[level]} px-2 py-0.5`}>
      <span className={`neo-label text-[9px] ${level === "red" ? "text-white" : "text-black"}`}>{label}</span>
    </div>
  );
}

function RiskGauge({
  riskLevel,
  confidence,
  topRisk,
}: {
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  topRisk: string;
}) {
  const cfg = {
    low: { color: "bg-neo-muted", pct: 28, label: "LOW RISK" },
    medium: { color: "bg-neo-secondary", pct: 62, label: "MEDIUM RISK" },
    high: { color: "bg-neo-accent", pct: 94, label: "HIGH RISK" },
  }[riskLevel];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="neo-label text-xs">RISK GAUGE</div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xs text-black/60">
            Confidence: {Math.round(confidence * 100)}%
          </span>
          <div className={`border-4 border-black px-3 py-1 ${cfg.color}`}>
            <span className="neo-label text-[10px]">{cfg.label}</span>
          </div>
        </div>
      </div>
      {/* Main gauge bar */}
      <div className="h-6 border-4 border-black bg-white overflow-hidden shadow-neo-xs">
        <div
          className={`h-full ${cfg.color} transition-all duration-1000 ease-out`}
          style={{ width: `${cfg.pct}%` }}
        />
      </div>
      {/* Confidence bar */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="neo-label text-[9px] mb-1 text-black/50">CONFIDENCE</div>
          <div className="h-3 border-2 border-black bg-white overflow-hidden">
            <div
              className="h-full bg-neo-black transition-all duration-1000 ease-out"
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="neo-label text-[9px] mb-1 text-black/50">TOP RISK</div>
          <p className="font-bold text-xs text-black/80 leading-snug">{topRisk}</p>
        </div>
      </div>
    </div>
  );
}

function SuggestedEditCard({
  edit,
}: {
  edit: { clause: string; current: string; suggested: string; reason: string };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(edit.suggested);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="border-4 border-black overflow-hidden">
      <div className="border-b-4 border-black px-4 py-2 bg-neo-bg flex items-center justify-between gap-3">
        <span className="font-bold text-xs">{edit.clause}</span>
        <button
          onClick={handleCopy}
          title="Copy suggested language"
          className="flex items-center gap-1.5 border-2 border-black px-2 py-1 hover:bg-neo-secondary transition-colors active:translate-x-[2px] active:translate-y-[2px]"
        >
          {copied ? (
            <CopyCheck strokeWidth={3} size={12} className="text-neo-accent" />
          ) : (
            <Copy strokeWidth={3} size={12} />
          )}
          <span className="neo-label text-[9px]">{copied ? "COPIED!" : "COPY EDIT"}</span>
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="neo-label text-[9px] mb-1 text-black/50">CURRENT LANGUAGE</div>
          <div className="border-l-4 border-neo-accent pl-3 font-mono text-xs text-black/70 leading-relaxed bg-neo-accent/5 py-2 pr-2">
            {edit.current}
          </div>
        </div>
        <div>
          <div className="neo-label text-[9px] mb-1 text-black/50">SUGGESTED REPLACEMENT</div>
          <div className="border-l-4 border-neo-muted pl-3 font-mono text-xs leading-relaxed bg-neo-muted/20 py-2 pr-2">
            {edit.suggested}
          </div>
        </div>
        <p className="font-bold text-xs text-black/60 leading-relaxed">{edit.reason}</p>
      </div>
    </div>
  );
}
