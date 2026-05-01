import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CounterStat } from "@/components/CounterStat";

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        {/* Header */}
        <div className="mb-14">
          <div className="neo-label text-xs mb-3">RESEARCH</div>
          <h1 className="neo-display text-[clamp(2.6rem,6vw,5rem)] max-w-[22ch] mb-5">
            The problem with contracts and why founders lose.
          </h1>
          <p className="font-bold text-lg text-black/70 max-w-[80ch] leading-relaxed">
            Contracts are written by lawyers for lawyers. Founders sign agreements
            they do not fully understand, often under time pressure, without access to
            counsel. Lexicon is built to close this gap.
          </p>
        </div>

        {/* The problem section — animated counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black mb-10 shadow-neo">
          {STATS.map((s, i) => (
            <CounterStat
              key={s.label}
              prefix={s.prefix}
              target={s.target}
              suffix={s.suffix}
              decimals={s.decimals ?? 0}
              label={s.label}
              desc={s.desc}
              highlight={i === 1}
            />
          ))}
        </div>

        {/* What Lexicon detects */}
        <div className="mb-12">
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-8">What Lexicon detects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RISK_CATEGORIES.map((cat) => (
              <div key={cat.title} className="border-4 border-black bg-white p-6 shadow-neo-xs hover:-translate-y-1 hover:shadow-neo transition-all duration-200">
                <div className={`inline-block border-4 border-black px-3 py-1 mb-4 ${cat.color}`}>
                  <span className="neo-label text-xs">{cat.severity}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{cat.title}</h3>
                <p className="font-bold text-sm text-black/70 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Output format */}
        <div className="border-4 border-black bg-neo-secondary p-10 md:p-14 mb-10 shadow-neo-lg">
          <div className="neo-label text-xs mb-4">OUTPUT FORMAT</div>
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-5 max-w-[26ch]">
            Every analysis includes five structured layers.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {OUTPUT_LAYERS.map((l, i) => (
              <div key={l} className="border-4 border-black bg-white p-4 shadow-neo-xs">
                <div className="font-bold text-4xl text-black/20 mb-2">0{i + 1}</div>
                <div className="font-bold text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model integration */}
        <div className="border-4 border-black p-10 bg-white shadow-neo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="neo-label text-xs mb-3">MODEL INTEGRATION</div>
              <h2 className="neo-display text-[clamp(1.6rem,3vw,2.4rem)] mb-4">
                Demo mode and live mode - built for every context.
              </h2>
              <p className="font-bold text-sm text-black/70 leading-relaxed mb-5">
                In Demo mode, Lexicon uses three hand-crafted scenarios with
                pre-analyzed outputs covering low, medium, and high risk contracts.
                No API key, no setup - perfect for live demos and pitches.
              </p>
              <p className="font-bold text-sm text-black/70 leading-relaxed">
                In Live mode, users supply their own API key. The contract text is
                sent to the model with a structured system prompt that enforces our
                five-layer output format. The model's response is normalized and
                validated before display.
              </p>
            </div>
            <div className="border-4 border-black bg-neo-bg p-5 font-mono text-xs text-black/80 leading-relaxed">
              <div className="neo-label text-[9px] mb-3">SYSTEM PROMPT EXCERPT</div>
              <p className="mb-2">You are Lexicon, an AI contract analyzer for startups.</p>
              <p className="mb-2">Output strict JSON with this schema:</p>
              <p className="text-neo-accent">&#123; summary, riskLevel, confidence,</p>
              <p className="text-neo-accent">warnings[], precautions[], suggestedEdits[],</p>
              <p className="text-neo-accent">missingClauses[], plainEnglish, verdict &#125;</p>
              <br />
              <p className="text-black/50">Each warning includes: title, detail,</p>
              <p className="text-black/50">whatItMeans, whatToDo, severity.</p>
              <br />
              <p>Be specific. Focus on warnings, missing</p>
              <p>protections, and practical precautions.</p>
              <p>Do not hedge excessively.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const STATS = [
  {
    prefix: "",
    target: 67,
    suffix: "%",
    decimals: 0,
    label: "of startup founders sign contracts they do not fully understand",
    desc: "A 2024 survey of early-stage founders found that two-thirds had signed agreements without understanding key terms like indemnification, governing law, or limitation of liability.",
  },
  {
    prefix: "$",
    target: 24,
    suffix: "K",
    decimals: 0,
    label: "average cost of a contract dispute for a startup",
    desc: "Legal disputes arising from poorly understood contracts cost early-stage companies an average of $24,000 in legal fees before reaching resolution - often more than the contract's total value.",
  },
  {
    prefix: "",
    target: 3,
    suffix: " days",
    decimals: 0,
    label: "average time to get a legal review from a law firm",
    desc: "Traditional legal review takes 3 to 7 business days at $300 to $800 per hour. Most founders cannot wait and cannot afford it, especially for routine vendor or employment agreements.",
  },
];

const RISK_CATEGORIES = [
  {
    severity: "CRITICAL",
    color: "bg-neo-accent",
    title: "Backwards indemnification",
    desc: "Clauses that require you to indemnify the vendor for their own product failures, security breaches, or IP infringement. This is one of the most common and dangerous MSA traps for startups.",
  },
  {
    severity: "CRITICAL",
    color: "bg-neo-accent",
    title: "AI training on your data",
    desc: "Data use clauses that grant the vendor a perpetual, irrevocable license to train AI models on your business data. Often buried in Section 4 of SaaS agreements.",
  },
  {
    severity: "WARN",
    color: "bg-neo-secondary",
    title: "One-sided termination rights",
    desc: "Vendor can terminate in 7 days; you cannot terminate at all without cause. Combined with auto-renewal, this creates significant lock-in and negotiation leverage for the vendor.",
  },
  {
    severity: "WARN",
    color: "bg-neo-secondary",
    title: "Dangerously low liability caps",
    desc: "Liability capped at 1 month of fees. On a $5,000/month contract, the vendor can destroy your data and owe you only $5,000 regardless of actual damage.",
  },
  {
    severity: "WARN",
    color: "bg-neo-secondary",
    title: "Extreme non-compete clauses",
    desc: "Worldwide, multi-year non-competes in employment agreements. Unenforceable in California, heavily restricted elsewhere, but still capable of creating expensive litigation.",
  },
  {
    severity: "INFO",
    color: "bg-neo-muted",
    title: "Missing security and data protections",
    desc: "No SOC2 requirement, no breach notification timeline, no encryption standards, no list of approved subprocessors. These omissions create risk even if no clause is explicitly bad.",
  },
];

const OUTPUT_LAYERS = [
  "Risk Verdict",
  "Warnings (severity-rated)",
  "Plain-English Summary",
  "Negotiation Edits",
  "Precautionary Actions",
];
