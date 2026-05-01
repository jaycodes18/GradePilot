import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function FuturePage() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        {/* Header */}
        <div className="mb-14">
          <div className="neo-label text-xs mb-3">FUTURE PLANS</div>
          <h1 className="neo-display text-[clamp(2.6rem,6vw,5rem)] max-w-[22ch] mb-5">
            Where Lexicon goes after the hackathon.
          </h1>
          <p className="font-bold text-lg text-black/70 max-w-[80ch] leading-relaxed">
            The MVP proves the core loop: upload, scan, act. The next phase is making
            Lexicon collaborative, auditable, and tailored to your company's specific
            contract playbook.
          </p>
        </div>

        {/* Roadmap phases */}
        <div className="mb-14 space-y-4">
          {PHASES.map((phase, i) => (
            <div
              key={phase.name}
              className={`border-4 border-black grid grid-cols-1 md:grid-cols-[200px_1fr] shadow-neo-xs ${
                i === 0 ? "bg-neo-accent text-white" : i === 1 ? "bg-neo-secondary" : "bg-white"
              }`}
            >
              <div className={`p-6 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-black`}>
                <div className="neo-label text-[10px] opacity-70 mb-2">{phase.status}</div>
                <div className="font-bold text-2xl">{phase.name}</div>
                <div className="neo-label text-xs mt-3">{phase.timeline}</div>
              </div>
              <div className="p-6">
                <p className={`font-bold text-sm leading-relaxed mb-5 ${i === 0 ? "text-white/80" : "text-black/70"}`}>
                  {phase.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {phase.features.map((f) => (
                    <div
                      key={f}
                      className={`border-2 px-3 py-1 font-bold text-xs ${
                        i === 0 ? "border-white/60 bg-white/10" : "border-black bg-neo-bg"
                      }`}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business model */}
        <div className="mb-12 border-4 border-black p-10 bg-neo-black text-white shadow-neo-lg neo-dots">
          <div className="neo-label text-xs mb-4 text-white/50">BUSINESS MODEL</div>
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-5 max-w-[24ch]">
            Per-seat plus usage, scaling from founder to legal ops.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Individual", desc: "Solo founder or freelancer reviewing occasional agreements." },
              { name: "Team", desc: "Startups with legal ops needs, multiple seats, reusable playbooks." },
              { name: "Enterprise", desc: "Compliance teams, audit trails, custom integrations, on-prem option." },
            ].map((tier) => (
              <div key={tier.name} className="border-4 border-white/20 p-5">
                <div className="font-bold text-lg mb-2">{tier.name}</div>
                <p className="font-bold text-sm text-white/60 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link href="/pricing" className="neo-btn bg-neo-secondary text-black px-7 py-3 text-sm gap-2">
              View Pricing <ArrowRight strokeWidth={3} size={15} />
            </Link>
            <Link href="/app" className="neo-btn bg-transparent text-white border-white px-7 py-3 text-sm">
              Try Demo
            </Link>
          </div>
        </div>

        {/* Market opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-white p-8 shadow-neo-xs">
            <div className="neo-label text-xs mb-4">MARKET OPPORTUNITY</div>
            <h3 className="font-bold text-xl mb-4">Who needs Lexicon</h3>
            <ul className="space-y-2">
              {[
                "Early-stage startups (pre-Series A) without in-house legal",
                "Small businesses signing vendor and customer contracts",
                "Founders reviewing employment offers or equity agreements",
                "Freelancers and consultants reviewing SOW and service agreements",
                "Non-technical founders who cannot parse dense legalese",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-neo-accent flex-shrink-0 mt-2" />
                  <span className="font-bold text-sm text-black/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-4 border-black bg-neo-muted/30 p-8 shadow-neo-xs">
            <div className="neo-label text-xs mb-4">COMPETITIVE MOAT</div>
            <h3 className="font-bold text-xl mb-4">Why Lexicon wins long-term</h3>
            <ul className="space-y-2">
              {[
                "Focus on decisions, not summaries - what to DO, not just what it says",
                "Negotiation-ready output with side-by-side clause edits",
                "Severity-ranked warnings with plain-English translations",
                "Demo mode that works in any pitch environment",
                "Customizable playbooks aligned to each company's preferred terms",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-neo-black flex-shrink-0 mt-2" />
                  <span className="font-bold text-sm text-black/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const PHASES = [
  {
    name: "Phase 1",
    status: "LIVE NOW - MAY 2026",
    timeline: "May 2026",
    desc: "Core analysis loop: upload a contract, get risk flags with severity, plain-English explanations, suggested edits, missing clause detection, and precautionary actions. Demo mode with three built-in scenarios. BYO API key for live analysis.",
    features: ["Risk analysis", "Demo mode", "3 scenarios", "BYO API key", "Plain-English output"],
  },
  {
    name: "Phase 2",
    status: "NEXT - Q4 2026",
    timeline: "Q4 2026",
    desc: "Persistent workspace with matter management. Upload multiple contracts per matter. Reusable clause library. Side-by-side version comparison. PDF export with full analysis memo. Team seats and basic collaboration.",
    features: ["Matter management", "Clause library", "PDF export", "Team seats", "Version compare"],
  },
  {
    name: "Phase 3",
    status: "PLANNED - 2027",
    timeline: "2027",
    desc: "Enterprise features: custom playbooks aligned to your preferred terms, audit trail with full decision history, integration with Google Drive and DocuSign, GDPR/CCPA data processing addendum, on-premise deployment for regulated industries.",
    features: ["Custom playbooks", "Audit trail", "DocuSign integration", "GDPR DPA", "On-prem option"],
  },
];
