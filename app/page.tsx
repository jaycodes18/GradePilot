import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ArrowRight, Shield, AlertTriangle, FileText, Zap, Search, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <AnimateOnScroll><HowItWorks /></AnimateOnScroll>
        <AnimateOnScroll delay={60}><Features /></AnimateOnScroll>
        <AnimateOnScroll delay={80}><DemoHighlight /></AnimateOnScroll>
        <AnimateOnScroll delay={60}><PricingSnippet /></AnimateOnScroll>
        <AnimateOnScroll delay={80}><FinalCTA /></AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        {/* Left column */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border-4 border-black px-4 py-2 bg-neo-secondary shadow-neo-sm mb-8">
            <div className="w-2 h-2 bg-black rounded-full animate-blink" />
            <span className="neo-label text-xs">AI Contract Analysis for Startups</span>
          </div>

          {/* Headline */}
          <h1 className="font-bold neo-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] mb-6">
            KNOW WHAT
            <br />
            <span className="relative inline-block">
              YOU SIGN.
              <span
                className="absolute bottom-0 left-0 right-0 h-[8px] bg-neo-accent"
                aria-hidden
              />
            </span>
          </h1>

          <p className="font-bold text-xl text-black/80 leading-relaxed max-w-[56ch] mb-8">
            Upload any legal agreement. Get AI-powered risk flags, plain-English explanations,
            and concrete next steps in under 60 seconds. Built for founders, not lawyers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="/app"
              className="neo-btn bg-neo-accent text-white px-8 py-4 text-base gap-3"
            >
              Analyze a Contract
              <ArrowRight strokeWidth={3} size={18} />
            </Link>
            <Link
              href="/app"
              className="neo-btn bg-neo-secondary text-black px-8 py-4 text-base"
            >
              Try Demo (no sign-up)
            </Link>
          </div>

          {/* Trust markers */}
          <div className="flex flex-wrap gap-6">
            {["NDAs", "MSAs", "SOWs", "Employment offers", "Vendor agreements", "Leases"].map(
              (type) => (
                <div key={type} className="flex items-center gap-2">
                  <CheckCircle strokeWidth={3} size={14} />
                  <span className="font-bold text-sm">{type}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right column - preview card */}
        <div className="relative mt-8 lg:mt-0">
          <div className="neo-card bg-white p-0 overflow-hidden rotate-1">
            {/* Card header */}
            <div className="bg-neo-black text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neo-accent" />
                <span className="neo-label text-xs text-white">LEXICON ANALYSIS</span>
              </div>
              <span className="neo-label text-xs text-white/60">VENDOR MSA</span>
            </div>
            {/* Card body */}
            <div className="p-5 space-y-3">
              <RiskPreviewItem
                sev="critical"
                label="Indemnification is backwards"
                desc="You indemnify the vendor, not the other way around."
              />
              <RiskPreviewItem
                sev="critical"
                label="AI model training on your data"
                desc="Vendor has a perpetual license to train AI on all your business data."
              />
              <RiskPreviewItem
                sev="warn"
                label="Liability cap: 1 month of fees"
                desc="If they lose your data, they owe you almost nothing."
              />
              <RiskPreviewItem
                sev="info"
                label="Auto-renewal: 90 day notice required"
                desc="Easy to miss the cancellation window and get locked in."
              />
            </div>
            <div className="border-t-4 border-black px-5 py-3 bg-neo-muted/30">
              <span className="neo-label text-xs">4 ISSUES FOUND - NEGOTIATE BEFORE SIGNING</span>
            </div>
          </div>

          {/* Floating decorative badge */}
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-neo-secondary border-4 border-black shadow-neo rotate-12 flex items-center justify-center">
            <span className="font-bold text-center text-xs uppercase leading-tight">
              Free
              <br />
              Demo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskPreviewItem({
  sev,
  label,
  desc,
}: {
  sev: "critical" | "warn" | "info";
  label: string;
  desc: string;
}) {
  const colors = {
    critical: "bg-neo-accent/20 border-neo-accent",
    warn: "bg-neo-secondary/40 border-neo-secondary",
    info: "bg-neo-muted/30 border-neo-muted",
  };
  const labels = { critical: "CRITICAL", warn: "WARN", info: "INFO" };
  return (
    <div className={`border-4 ${colors[sev]} p-3`}>
      <div className="flex items-start gap-3">
        <span className="neo-label text-[9px] mt-0.5 flex-shrink-0">{labels[sev]}</span>
        <div>
          <div className="font-bold text-sm">{label}</div>
          <div className="font-bold text-xs text-black/60 mt-0.5 leading-snug">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const items = [
    "NDA ANALYSIS",
    "MSA RISK FLAGS",
    "EMPLOYMENT REVIEW",
    "VENDOR AGREEMENTS",
    "NEGOTIATION TIPS",
    "MISSING CLAUSES",
    "PLAIN ENGLISH",
    "60 SECONDS",
  ];
  const repeated = [...items, ...items];
  return (
    <div className="border-y-4 border-black bg-neo-black text-neo-secondary py-4 overflow-hidden">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="neo-label text-sm px-8 flex-shrink-0">
            {item}
            <span className="mx-8 text-neo-accent">+</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="mb-12">
        <div className="neo-label text-xs mb-3">HOW IT WORKS</div>
        <h2 className="neo-display text-[clamp(2rem,5vw,3.8rem)] max-w-[20ch]">
          Three steps to full contract clarity.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black">
        {[
          {
            n: "01",
            icon: <FileText strokeWidth={3} size={28} />,
            title: "Paste or Upload",
            desc: "Paste your contract text directly or use our demo contracts to see Lexicon in action. Supports NDAs, MSAs, employment offers, vendor agreements, leases, and more.",
            bg: "bg-white",
          },
          {
            n: "02",
            icon: <Search strokeWidth={3} size={28} />,
            title: "AI Scans Every Clause",
            desc: "Our AI engine reads every clause in your agreement and flags risks, identifies missing protections, and detects unusual or one-sided terms with full plain-English explanations.",
            bg: "bg-neo-muted/30",
          },
          {
            n: "03",
            icon: <Zap strokeWidth={3} size={28} />,
            title: "Act on Clear Recommendations",
            desc: "Get a risk verdict, specific negotiation suggestions, missing clause checklist, and a plain-English summary that tells you exactly what to do before you sign.",
            bg: "bg-neo-secondary/40",
          },
        ].map((step, i) => (
          <div
            key={step.n}
            className={`${step.bg} p-8 ${i < 2 ? "border-r-4 border-black" : ""}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="neo-label text-4xl font-bold text-black/20">{step.n}</div>
              <div className="w-14 h-14 border-4 border-black bg-neo-bg flex items-center justify-center shadow-neo-sm">
                {step.icon}
              </div>
            </div>
            <h3 className="font-bold text-xl mb-3">{step.title}</h3>
            <p className="font-bold text-sm text-black/70 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-neo-black text-white py-16 md:py-24 border-y-4 border-black neo-dots-dense">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="neo-label text-xs mb-3 text-white/50">WHAT YOU GET</div>
          <h2 className="neo-display text-[clamp(2rem,5vw,3.8rem)] max-w-[22ch] text-white">
            Everything a founder needs to negotiate safely.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <AlertTriangle strokeWidth={3} size={22} />,
              title: "Risk Flags with Severity",
              desc: "Every issue is tagged CRITICAL, WARN, or INFO so you know what to focus on first. No noise, just signal.",
              color: "bg-neo-accent",
            },
            {
              icon: <FileText strokeWidth={3} size={22} />,
              title: "Plain-English Translation",
              desc: "Each clause is explained in language a founder can understand. What it says, what it means, and why it matters.",
              color: "bg-neo-secondary",
            },
            {
              icon: <Shield strokeWidth={3} size={22} />,
              title: "Missing Clause Detection",
              desc: "Know what is not in the contract. Missing data security terms, no severance, no SLA - all surfaced automatically.",
              color: "bg-neo-muted",
            },
            {
              icon: <Zap strokeWidth={3} size={22} />,
              title: "Negotiation Suggestions",
              desc: "Side-by-side before/after edits for every flagged clause. Copy, paste, and send to the other side.",
              color: "bg-neo-secondary",
            },
            {
              icon: <Search strokeWidth={3} size={22} />,
              title: "Precautionary Actions",
              desc: "Ranked by urgency: what to do right now, what to fix before signing, and what to monitor after.",
              color: "bg-neo-accent",
            },
            {
              icon: <CheckCircle strokeWidth={3} size={22} />,
              title: "Risk Verdict",
              desc: "A clear LOW / MEDIUM / HIGH verdict with confidence score and one-line summary of the biggest risk.",
              color: "bg-neo-muted",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border-4 border-white/30 bg-white/5 p-6 hover:bg-white/10 transition-colors duration-200 group"
            >
              <div
                className={`w-12 h-12 ${f.color} border-4 border-white flex items-center justify-center mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="font-bold text-sm text-white/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoHighlight() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="neo-label text-xs mb-3">HACKATHON-READY</div>
          <h2 className="neo-display text-[clamp(2rem,5vw,3.8rem)] mb-5">
            Three demo outcomes, live in the pitch.
          </h2>
          <p className="font-bold text-lg text-black/70 leading-relaxed mb-6">
            Flip between a clean NDA, a risky vendor contract, and a predatory employment
            offer - live during the demo. No API key needed. No setup. Just click and show.
          </p>
          <Link href="/app" className="neo-btn bg-neo-accent text-white px-8 py-4 text-base gap-3">
            Open Demo Mode
            <ArrowRight strokeWidth={3} size={18} />
          </Link>
        </div>

        <div className="space-y-4">
          {[
            { label: "Demo 1 - Clean NDA", risk: "LOW", color: "bg-neo-muted" },
            { label: "Demo 2 - Vendor MSA", risk: "MEDIUM", color: "bg-neo-secondary" },
            { label: "Demo 3 - Employment Offer", risk: "HIGH", color: "bg-neo-accent" },
          ].map((demo) => (
            <Link
              key={demo.label}
              href="/app"
              className="flex items-center justify-between border-4 border-black bg-white shadow-neo hover:-translate-y-1 hover:shadow-neo-md transition-all duration-200 px-5 py-4 group"
            >
              <span className="font-bold text-base">{demo.label}</span>
              <div className={`${demo.color} border-4 border-black px-3 py-1`}>
                <span className="neo-label text-xs">{demo.risk} RISK</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSnippet() {
  return (
    <section className="bg-neo-secondary border-y-4 border-black py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-start justify-between flex-wrap gap-8">
          <div>
            <div className="neo-label text-xs mb-3">BUSINESS MODEL</div>
            <h2 className="neo-display text-[clamp(2rem,5vw,3.5rem)] max-w-[24ch]">
              Plans built for every stage of growth.
            </h2>
          </div>
          <Link href="/pricing" className="neo-btn bg-neo-black text-white px-7 py-4 text-sm gap-3 self-end">
            See All Plans
            <ArrowRight strokeWidth={3} size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black">
          {[
            { name: "Basic", price: "$19", desc: "For early-stage founders reviewing the occasional agreement.", featured: false },
            { name: "Pro", price: "$49", desc: "For startups moving fast with vendors, customers, and hires.", featured: true },
            { name: "Premium", price: "$149", desc: "For teams that need compliance workflows and audit trails.", featured: false },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`p-8 ${i < 2 ? "border-r-4 border-black" : ""} ${
                plan.featured ? "bg-neo-black text-white" : "bg-white"
              }`}
            >
              {plan.featured && (
                <div className="neo-label text-[10px] bg-neo-accent text-white px-3 py-1 inline-block mb-4">
                  MOST POPULAR
                </div>
              )}
              <div className="font-bold text-2xl mb-1">{plan.name}</div>
              <div className="font-bold text-4xl mb-3">
                {plan.price}
                <span className={`text-base ${plan.featured ? "text-white/60" : "text-black/50"}`}>
                  /mo
                </span>
              </div>
              <p className={`font-bold text-sm leading-relaxed ${plan.featured ? "text-white/70" : "text-black/70"}`}>
                {plan.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="border-4 border-black bg-neo-black text-white p-10 md:p-16 relative overflow-hidden neo-dots">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <div className="neo-label text-xs mb-4 text-white/50">READY TO START</div>
            <h2 className="neo-display text-[clamp(2.4rem,6vw,5rem)] max-w-[18ch]">
              Your next contract deserves a second opinion.
            </h2>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link href="/app" className="neo-btn bg-neo-accent text-white px-8 py-4 text-base gap-3">
              Analyze Free
              <ArrowRight strokeWidth={3} size={18} />
            </Link>
            <Link href="/pricing" className="neo-btn bg-transparent text-white border-white px-8 py-4 text-base">
              View Pricing
            </Link>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -bottom-8 -right-8 w-40 h-40 border-8 border-neo-accent/30 rotate-12" aria-hidden />
        <div className="absolute top-8 right-24 text-9xl font-bold text-white/5 select-none" aria-hidden>
          LEX
        </div>
      </div>
    </section>
  );
}
