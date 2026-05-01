import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        {/* Header */}
        <div className="mb-14">
          <div className="neo-label text-xs mb-3">INSPIRATION</div>
          <h1 className="neo-display text-[clamp(2.6rem,6vw,5rem)] max-w-[20ch] mb-5">
            The ideas behind Lexicon.
          </h1>
          <p className="font-bold text-lg text-black/70 max-w-[80ch] leading-relaxed">
            Every product decision in Lexicon was driven by a specific founder pain point,
            a gap in the existing market, or a design principle we were not willing to
            compromise on.
          </p>
        </div>

        {/* Origin story */}
        <div className="border-4 border-black bg-neo-black text-white p-10 md:p-14 mb-10 shadow-neo-xl relative overflow-hidden neo-dots">
          <div className="relative z-10">
            <div className="neo-label text-xs mb-4 text-white/50">ORIGIN</div>
            <h2 className="neo-display text-[clamp(1.8rem,4vw,3.2rem)] mb-6 max-w-[28ch]">
              A founder signed a vendor agreement and spent $31,000 fixing a clause they did not understand.
            </h2>
            <p className="font-bold text-base text-white/80 leading-relaxed max-w-[90ch]">
              The indemnification clause required them to defend the vendor against any claim
              arising from use of the platform. When the vendor was sued by a third party over
              IP, the founder's startup was dragged into litigation they could not afford.
              Lexicon exists so this does not happen to the next founder.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 text-9xl font-bold text-white/5 select-none" aria-hidden>
            LEX
          </div>
        </div>

        {/* Design decisions */}
        <div className="mb-12">
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-8">Design decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DESIGN_DECISIONS.map((d, i) => (
              <div
                key={d.title}
                className={`border-4 border-black p-7 shadow-neo-xs ${
                  i % 4 === 0 ? "bg-neo-secondary/40" : i % 4 === 1 ? "bg-neo-muted/30" : i % 4 === 2 ? "bg-neo-accent/10" : "bg-white"
                }`}
              >
                <div className="neo-label text-xs mb-3 text-black/50">{d.category}</div>
                <h3 className="font-bold text-lg mb-3">{d.title}</h3>
                <p className="font-bold text-sm text-black/70 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive comparison */}
        <div className="border-4 border-black bg-neo-secondary p-10 mb-10 shadow-neo-lg">
          <div className="neo-label text-xs mb-4">MARKET RESEARCH</div>
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-6 max-w-[26ch]">
            What the existing tools get wrong.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MARKET_GAPS.map((g) => (
              <div key={g.tool} className="border-4 border-black bg-white p-6">
                <div className="font-bold text-lg mb-1">{g.tool}</div>
                <div className="neo-label text-[10px] text-black/50 mb-3">{g.type}</div>
                <p className="font-bold text-sm text-black/70 leading-relaxed">{g.gap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-4 border-black p-10 bg-white shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="neo-label text-xs mb-3">TRY IT NOW</div>
            <h2 className="neo-display text-[clamp(1.6rem,3vw,2.6rem)] max-w-[24ch]">
              See the difference in 60 seconds.
            </h2>
          </div>
          <Link href="/app" className="neo-btn bg-neo-accent text-white px-8 py-4 text-sm gap-3 flex-shrink-0">
            Open Demo <ArrowRight strokeWidth={3} size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const DESIGN_DECISIONS = [
  {
    category: "OUTPUT DESIGN",
    title: "We optimize for next actions, not summaries",
    desc: "Every other tool tells you what the contract says. We focus on what you should DO: negotiate this, remove this, add this, sign as-is. The output is decision support, not a transcript.",
  },
  {
    category: "TRUST DESIGN",
    title: "Severity labels instead of vague warnings",
    desc: "CRITICAL, WARN, and INFO give founders an instant priority stack. You immediately know what needs to be fixed before signing and what is just worth knowing.",
  },
  {
    category: "PITCH DESIGN",
    title: "Demo mode built for live presentations",
    desc: "Every hackathon pitch involves live demos. Demo mode lets you switch between three different risk levels - low, medium, high - instantly and reliably, without needing an internet connection or API key.",
  },
  {
    category: "ACCESSIBILITY",
    title: "Plain English is not optional",
    desc: "Every warning includes three layers: what the clause says (detail), what it means for you specifically (whatItMeans), and what to do about it (whatToDo). No legal jargon without immediate translation.",
  },
  {
    category: "DEVELOPER DESIGN",
    title: "BYO API key for real analysis",
    desc: "For founders who want to analyze their own real contracts during the demo, we support any OpenAI-compatible model via a user-supplied API key, stored locally in the browser.",
  },
  {
    category: "BUSINESS DESIGN",
    title: "Placeholder pricing that communicates the model",
    desc: "The pricing page is not functional - it is a communication tool. It shows judges and potential users that we understand how to monetize: per-seat plus usage, with team and enterprise tiers.",
  },
];

const MARKET_GAPS = [
  {
    tool: "Law firms",
    type: "Traditional legal",
    gap: "3 to 7 days turnaround, $300 to $800 per hour. Completely inaccessible for early-stage founders reviewing a routine vendor agreement. A $2,000 legal review on a $5,000 contract is not viable.",
  },
  {
    tool: "LegalZoom / Rocket Lawyer",
    type: "Document tools",
    gap: "These tools generate and store documents. They do not analyze them. There is no risk detection, no warning system, no negotiation output. Founders still cannot tell if what they are signing is dangerous.",
  },
  {
    tool: "Generic AI (ChatGPT)",
    type: "General AI",
    gap: "Unstructured output that varies every time. No severity ranking, no specific edits, no urgency structure. Requires significant prompting expertise from the founder to get useful output.",
  },
];
