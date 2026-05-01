import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CheckCircle, XCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neo-bg">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-20">
        {/* Header */}
        <div className="mb-14">
          <div className="neo-label text-xs mb-3">PRICING</div>
          <h1 className="neo-display text-[clamp(2.6rem,6vw,5rem)] max-w-[20ch] mb-5">
            Plans built for every stage of growth.
          </h1>
          <p className="font-bold text-lg text-black/70 max-w-[72ch] leading-relaxed">
            Placeholder pricing for hackathon purposes. Our business model is per-seat plus
            usage, scaling from solo founders to compliance teams. No subscriptions to hidden
            add-ons. No lawyers required to read our terms.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="border-4 border-black grid grid-cols-1 md:grid-cols-3 shadow-neo-xl mb-16">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} last={i === PLANS.length - 1} />
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mb-16">
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3rem)] mb-8">Full feature comparison</h2>
          <div className="border-4 border-black overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="px-5 py-3 font-bold text-sm text-left bg-neo-bg border-r-4 border-black">
                    FEATURE
                  </th>
                  {PLANS.map((p, i) => (
                    <th
                      key={p.name}
                      className={`px-5 py-3 font-bold text-sm text-center ${
                        p.featured ? "bg-neo-black text-white" : "bg-white"
                      } ${i < PLANS.length - 1 ? "border-r-4 border-black" : ""}`}
                    >
                      {p.name.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, fi) => (
                  <tr
                    key={feature.name}
                    className={`border-b-4 border-black ${fi % 2 === 0 ? "bg-white" : "bg-neo-bg"}`}
                  >
                    <td className="px-5 py-3 font-bold text-sm border-r-4 border-black">
                      {feature.name}
                    </td>
                    {feature.plans.map((v, i) => (
                      <td
                        key={i}
                        className={`px-5 py-3 text-center ${i < feature.plans.length - 1 ? "border-r-4 border-black" : ""}`}
                      >
                        {v === true ? (
                          <CheckCircle className="mx-auto" strokeWidth={3} size={16} />
                        ) : v === false ? (
                          <XCircle className="mx-auto text-black/30" strokeWidth={3} size={16} />
                        ) : (
                          <span className="font-bold text-sm">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Differentiator */}
        <div className="border-4 border-black bg-neo-secondary p-10 md:p-14 shadow-neo-lg">
          <div className="neo-label text-xs mb-4">WHY LEXICON</div>
          <h2 className="neo-display text-[clamp(1.8rem,4vw,3.2rem)] mb-5 max-w-[28ch]">
            We optimize for "what should I do next?" - not "what does this say?"
          </h2>
          <p className="font-bold text-base text-black/80 leading-relaxed max-w-[76ch] mb-8">
            Most tools summarize contracts. Lexicon focuses on warnings, missing protections,
            and concrete negotiation suggestions - so founders can make safer decisions faster.
            Every output includes a severity level, a plain-English translation, and specific
            edits you can send to the other side.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Severity-rated warnings", "Negotiation-ready edits", "Missing clause detection", "Plain-English translation", "Urgency-ranked actions"].map((x) => (
              <div key={x} className="border-4 border-black bg-white px-4 py-2 shadow-neo-xs">
                <span className="font-bold text-sm">{x}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/app" className="neo-btn bg-neo-black text-white px-8 py-4 text-sm">
              Try the App Free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const PLANS = [
  {
    name: "Basic",
    price: "$19",
    period: "per month",
    desc: "For early-stage founders reviewing contracts occasionally.",
    featured: false,
    bullets: [
      "3 analyses per day",
      "Risk flags with severity",
      "Plain-English explanation",
      "Negotiation suggestions",
      "PDF export (basic)",
    ],
    cta: "Start Basic",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "For startups moving fast with vendors, customers, and hires.",
    featured: true,
    bullets: [
      "25 analyses per day",
      "Everything in Basic",
      "Clause library and reusable redlines",
      "Risk scoring and urgency ranking",
      "2 team seats included",
    ],
    cta: "Start Pro",
  },
  {
    name: "Premium",
    price: "$149",
    period: "per month",
    desc: "For compliance teams that need audit trails and workflows.",
    featured: false,
    bullets: [
      "Unlimited analyses",
      "Everything in Pro",
      "Custom compliance playbooks",
      "Audit trail and version history",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
];

const FEATURES = [
  { name: "Analyses per day", plans: ["3", "25", "Unlimited"] },
  { name: "Risk flags with severity", plans: [true, true, true] },
  { name: "Plain-English explanation", plans: [true, true, true] },
  { name: "Suggested negotiation edits", plans: [true, true, true] },
  { name: "Missing clause detection", plans: [true, true, true] },
  { name: "Clause library", plans: [false, true, true] },
  { name: "Team seats", plans: ["1", "2", "Unlimited"] },
  { name: "Custom playbooks", plans: [false, false, true] },
  { name: "Audit trail", plans: [false, false, true] },
  { name: "Priority support", plans: [false, false, true] },
];

function PlanCard({ plan, last }: { plan: (typeof PLANS)[0]; last: boolean }) {
  return (
    <div
      className={`p-8 flex flex-col ${last ? "" : "border-b-4 md:border-b-0 md:border-r-4 border-black"} ${
        plan.featured ? "bg-neo-black text-white" : "bg-white"
      }`}
    >
      {plan.featured && (
        <div className="neo-label text-[10px] bg-neo-accent text-white px-3 py-1 inline-block mb-5 self-start border-2 border-white">
          MOST POPULAR
        </div>
      )}
      <div className="font-bold text-2xl mb-1">{plan.name}</div>
      <div className="font-bold text-5xl mb-1">
        {plan.price}
        <span className={`text-base font-bold ${plan.featured ? "text-white/50" : "text-black/40"}`}>
          /mo
        </span>
      </div>
      <p className={`font-bold text-sm mb-6 leading-relaxed ${plan.featured ? "text-white/70" : "text-black/60"}`}>
        {plan.desc}
      </p>
      <ul className="space-y-2 mb-8 flex-1">
        {plan.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <CheckCircle
              strokeWidth={3}
              size={14}
              className={`flex-shrink-0 mt-0.5 ${plan.featured ? "text-neo-secondary" : ""}`}
            />
            <span className={`font-bold text-sm ${plan.featured ? "text-white/90" : ""}`}>{b}</span>
          </li>
        ))}
      </ul>
      <button
        className={`neo-btn py-3 text-sm ${
          plan.featured
            ? "bg-neo-secondary text-black border-white shadow-neo-white"
            : "bg-neo-bg border-black"
        }`}
      >
        {plan.cta}
      </button>
      <p className={`mt-3 neo-label text-[10px] text-center ${plan.featured ? "text-white/40" : "text-black/40"}`}>
        PLACEHOLDER - DEMO ONLY
      </p>
    </div>
  );
}
