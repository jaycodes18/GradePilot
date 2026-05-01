export type DemoId = "clean-nda" | "vendor-msa" | "employment-trap";

export interface DemoScenario {
  id: DemoId;
  label: string;
  riskLabel: string;
  riskColor: "green" | "yellow" | "red";
  subtitle: string;
  docTitle: string;
  parties: string;
  sampleContract: string;
}

export interface Warning {
  title: string;
  detail: string;
  whatItMeans: string;
  whatToDo: string;
  severity: "info" | "warn" | "critical";
}

export interface LexiconAnalysis {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  topRisk: string;
  warnings: Warning[];
  precautions: { title: string; detail: string; urgency: "immediate" | "before-signing" | "monitor" }[];
  suggestedEdits: { clause: string; current: string; suggested: string; reason: string }[];
  missingClauses: string[];
  plainEnglish: string;
  verdict: string;
}

/* ============================================================
   DEMO SCENARIOS
   ============================================================ */

export const DEMOS: DemoScenario[] = [
  {
    id: "clean-nda",
    label: "Demo 1 - Clean NDA",
    riskLabel: "LOW RISK",
    riskColor: "green",
    subtitle: "A balanced mutual NDA with minor improvements. Good baseline for most partnerships.",
    docTitle: "MUTUAL NON-DISCLOSURE AGREEMENT",
    parties: "Alpha Labs Inc. + Northwind Design LLC",
    sampleContract: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of October 14, 2025
("Effective Date") by and between:

Alpha Labs, Inc., a Delaware corporation with its principal place of business at
300 Innovation Drive, San Francisco, CA 94105 ("Company A");

and

Northwind Design LLC, a New York limited liability company with its principal place
of business at 88 Canal Street, Suite 400, New York, NY 10013 ("Company B").

Company A and Company B are each referred to herein as a "Party" and collectively
as the "Parties."

RECITALS

WHEREAS, the Parties desire to explore a potential business relationship involving
collaborative product development and co-marketing initiatives (the "Purpose"); and

WHEREAS, in connection with the Purpose, each Party may disclose to the other certain
confidential and proprietary information; and

WHEREAS, the Parties desire to protect such confidential information from unauthorized
use or disclosure.

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth
herein, the Parties hereby agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

1.1 "Confidential Information" means any and all non-public information, in any form,
disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving
Party"), whether disclosed orally, in writing, electronically, or by any other means,
that is designated as confidential or that reasonably should be understood to be
confidential given the nature of the information and the circumstances of disclosure.
Confidential Information includes, without limitation: trade secrets, technical data,
source code, algorithms, product plans, business strategies, customer lists, financial
projections, marketing plans, and any other information that gives the Disclosing Party
a competitive advantage.

1.2 Confidential Information does not include information that:
   (a) is or becomes publicly known through no act or omission of the Receiving Party;
   (b) was rightfully known by the Receiving Party before disclosure by the Disclosing
       Party, as evidenced by written records predating such disclosure;
   (c) is rightfully received by the Receiving Party from a third party without
       restrictions on disclosure;
   (d) is independently developed by the Receiving Party without use of or reference
       to the Disclosing Party's Confidential Information; or
   (e) is required to be disclosed by applicable law, regulation, or court order,
       provided that the Receiving Party gives the Disclosing Party reasonable prior
       written notice and cooperates with the Disclosing Party in seeking a protective
       order.

2. OBLIGATIONS OF RECEIVING PARTY

2.1 Each Receiving Party agrees to:
   (a) hold all Confidential Information in strict confidence using at least the same
       degree of care it uses to protect its own confidential information, but in no
       event less than reasonable care;
   (b) use Confidential Information solely for the Purpose;
   (c) not disclose Confidential Information to any third party without the prior
       written consent of the Disclosing Party, except to employees, contractors, or
       agents who (i) have a need to know such information for the Purpose, (ii) are
       bound by confidentiality obligations at least as protective as those in this
       Agreement, and (iii) have been informed of the confidential nature of the
       information;
   (d) promptly notify the Disclosing Party upon discovery of any unauthorized use or
       disclosure of Confidential Information.

3. TERM AND SURVIVAL

3.1 This Agreement shall remain in effect for a period of two (2) years from the
Effective Date. Either Party may terminate this Agreement upon thirty (30) days'
written notice to the other Party.

3.2 Notwithstanding the foregoing, the obligations of confidentiality with respect
to any Confidential Information that constitutes a trade secret shall continue for
so long as such information remains a trade secret under applicable law.

4. RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION

4.1 Upon the earlier of: (a) the termination or expiration of this Agreement, or
(b) a written request by the Disclosing Party, the Receiving Party shall promptly
return to the Disclosing Party all tangible materials embodying Confidential
Information or certify in writing that all such materials have been destroyed,
including any copies stored in electronic format. The Receiving Party shall
provide written confirmation of completion within ten (10) business days.

5. NO LICENSE OR INTELLECTUAL PROPERTY RIGHTS

5.1 Nothing in this Agreement shall be construed as granting the Receiving Party
any right, license, or interest in the Confidential Information beyond the limited
right to use it for the Purpose. All Confidential Information remains the exclusive
property of the Disclosing Party.

6. GOVERNING LAW AND DISPUTE RESOLUTION

6.1 This Agreement shall be governed by and construed in accordance with the laws
of the State of Delaware, without regard to its conflict of laws principles.

6.2 Any dispute arising out of or in connection with this Agreement that cannot be
resolved through good-faith negotiation shall be submitted to binding arbitration
in Delaware under the JAMS rules.

7. GENERAL PROVISIONS

7.1 This Agreement constitutes the entire agreement between the Parties with respect
to its subject matter and supersedes all prior agreements and understandings.

7.2 This Agreement may not be amended except by a written instrument signed by
authorized representatives of both Parties.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

ALPHA LABS, INC.                          NORTHWIND DESIGN LLC
By: _______________________               By: _______________________
Name:                                     Name:
Title:                                    Title:
Date:                                     Date:
`,
  },
  {
    id: "vendor-msa",
    label: "Demo 2 - Vendor MSA",
    riskLabel: "MEDIUM RISK",
    riskColor: "yellow",
    subtitle: "A vendor-favorable MSA with several clauses that need negotiation before signing.",
    docTitle: "MASTER SERVICES AGREEMENT",
    parties: "SeedSprint Inc. (Customer) + CloudMetric LLC (Vendor)",
    sampleContract: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("MSA" or "Agreement") is entered into as of
September 1, 2025, between:

SeedSprint, Inc., a Delaware corporation ("Customer"), and
CloudMetric LLC, a California limited liability company ("Vendor").

1. SERVICES

1.1 Scope. Vendor agrees to provide Customer with access to its cloud analytics
platform and associated professional services as described in one or more Statements
of Work ("SOW") executed by the Parties. Each SOW is incorporated herein by reference.

1.2 Changes. Vendor reserves the right to modify, discontinue, or replace any feature
or component of the Services at its sole discretion, provided Vendor gives Customer
seven (7) days' written notice for material changes.

2. FEES AND PAYMENT

2.1 Fees. Customer shall pay the fees specified in each SOW. All fees are non-refundable.

2.2 Invoicing. Vendor shall issue invoices monthly. Payment is due Net 7 days from
the date of invoice. Invoices not disputed in good faith within 5 days of receipt
are deemed accepted.

2.3 Late Payment. Overdue amounts shall accrue interest at the rate of 2.5% per month
(30% per annum), compounded monthly, from the due date until paid in full.

2.4 Suspension. Vendor may suspend access to the Services immediately upon any
payment default exceeding 5 days without notice and without any obligation to
restore access until all outstanding balances are paid in full, including interest.

3. TERM AND TERMINATION

3.1 Term. This Agreement commences on the Effective Date and continues for a period
of twenty-four (24) months, renewing automatically for successive twelve (12) month
periods unless either Party provides written notice of non-renewal at least ninety
(90) days before the end of the then-current term.

3.2 Termination for Convenience. Vendor may terminate this Agreement or any SOW
for its convenience upon seven (7) days' written notice to Customer. Customer may
only terminate for Vendor's uncured material breach, which Vendor shall have thirty
(30) days to cure after receiving written notice.

3.3 Effect of Termination. Upon termination for any reason: (a) all fees owed through
the end of the current term become immediately due and payable; (b) Customer's access
to the Services terminates immediately; (c) Vendor shall delete Customer Data within
thirty (30) days unless applicable law requires otherwise.

4. INTELLECTUAL PROPERTY AND DATA

4.1 Vendor IP. All technology, software, platforms, algorithms, and derivative works
developed by Vendor in connection with the Services remain the exclusive property of
Vendor. No rights are granted to Customer except a limited, non-exclusive, non-
transferable license to use the Services during the term.

4.2 Customer Data. Customer grants Vendor a worldwide, royalty-free, perpetual license
to use, reproduce, modify, and create derivative works from Customer Data for the
purpose of: (a) providing and improving the Services; (b) developing new features
and products; (c) generating aggregated, anonymized analytics and benchmarks that
Vendor may commercialize; and (d) training machine learning models used in Vendor's
platform or other products.

4.3 Data Security. Vendor will implement "commercially reasonable" security measures
to protect Customer Data. Vendor shall notify Customer of any confirmed security breach
within seventy-two (72) hours of Vendor's internal confirmation.

5. INDEMNIFICATION

5.1 Customer Indemnification. Customer shall indemnify, defend, and hold harmless
Vendor, its affiliates, officers, directors, employees, and agents from and against
any and all claims, damages, losses, costs, and expenses (including reasonable
attorneys' fees) arising out of or related to: (a) Customer's use of the Services;
(b) any Customer Data; (c) Customer's breach of this Agreement; or (d) any claim by
a third party arising from Customer's business operations or use of any Vendor output.

5.2 Vendor Indemnification. Vendor shall indemnify Customer solely for direct claims
that the Services, as provided by Vendor, infringe a valid United States patent,
copyright, or trademark, subject to the limitations in Section 6.

6. LIMITATION OF LIABILITY

6.1 Disclaimer. THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
VENDOR EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

6.2 Liability Cap. IN NO EVENT SHALL VENDOR'S TOTAL CUMULATIVE LIABILITY ARISING
OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE FEES PAID BY CUSTOMER IN THE
ONE (1) MONTH IMMEDIATELY PRECEDING THE CLAIM, REGARDLESS OF THE FORM OF ACTION
OR THE THEORY OF LIABILITY.

6.3 Exclusion of Consequential Damages. IN NO EVENT SHALL EITHER PARTY BE LIABLE
FOR INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING
LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION.

7. GOVERNING LAW

7.1 This Agreement is governed by the laws of the State of California. Any disputes
shall be resolved exclusively in the state or federal courts located in San Francisco,
California. Customer waives any objection to venue.

IN WITNESS WHEREOF, the Parties have executed this MSA as of the date first above written.

SEEDSPRINT, INC.                          CLOUDMETRIC LLC
By: _______________________               By: _______________________
Name:                                     Name:
Title:                                    Title:
`,
  },
  {
    id: "employment-trap",
    label: "Demo 3 - Employment Offer",
    riskLabel: "HIGH RISK",
    riskColor: "red",
    subtitle: "An aggressive employment offer with multiple extreme clauses. Do not sign as-is.",
    docTitle: "EMPLOYMENT OFFER LETTER AND AGREEMENT",
    parties: "Acme Ventures LLC + Prospective Employee",
    sampleContract: `EMPLOYMENT OFFER LETTER AND AGREEMENT

October 1, 2025

Re: Offer of Employment - Senior Product Manager

Dear Candidate,

We are pleased to extend this offer of at-will employment with Acme Ventures LLC
("Company") subject to the terms and conditions set forth herein. Please review this
entire document carefully before signing.

1. POSITION AND DUTIES

1.1 You will serve as Senior Product Manager, reporting to the Chief Product Officer.
Your duties may be modified by the Company at any time at the Company's sole discretion
without notice or additional compensation.

1.2 You agree to devote your full business time, attention, and best efforts exclusively
to the Company. You shall not engage in any outside employment, consulting, advisory
work, or business activity, whether or not compensated, without the Company's prior
written approval in each instance.

2. COMPENSATION

2.1 Base Salary. Your starting base salary will be $130,000 per year, payable in
accordance with the Company's standard payroll schedule.

2.2 Bonus. You may be eligible for a performance bonus at the Company's sole and
absolute discretion. The Company reserves the right to modify, reduce, or eliminate
any bonus program at any time without prior notice. No bonus shall be deemed earned
or vested until actually paid.

2.3 Equity. You may be considered for a future equity grant, subject to Board approval,
vesting schedule, and a separate equity agreement. Nothing herein constitutes a
commitment to grant any equity.

3. PROPRIETARY RIGHTS AND INVENTION ASSIGNMENT

3.1 Assignment of Inventions. You hereby irrevocably assign to the Company your entire
right, title, and interest in and to any and all inventions, discoveries, improvements,
ideas, works of authorship, software, algorithms, methodologies, processes, and trade
secrets ("Inventions") that you conceive, develop, or reduce to practice:

   (a) at any time during your employment with the Company;
   (b) within twelve (12) months following the termination of your employment,
       regardless of the reason for termination;
   (c) during any time, whether during or outside working hours, if such Invention
       relates in any way to the Company's actual or contemplated business, research,
       development, products, or services;
   (d) using any Company equipment, facilities, materials, resources, or information
       at any time; or
   (e) that resulted from or was suggested by work performed for the Company.

3.2 Prior Inventions. You represent and warrant that you have no prior inventions,
improvements, or other intellectual property that you wish to exclude from this
assignment. Failure to disclose prior inventions is a material breach of this Agreement.

3.3 Moral Rights. To the fullest extent permitted by law, you waive all moral rights
in the Inventions assigned hereunder.

4. CONFIDENTIALITY

4.1 During your employment and at all times thereafter, you shall maintain in strict
confidence all Confidential Information of the Company. "Confidential Information"
includes any information that has or could have commercial value or other utility to
the Company, including any information whose unauthorized disclosure could be
detrimental to the Company, regardless of whether such information is marked
confidential.

5. NON-COMPETE AND NON-SOLICITATION

5.1 Non-Compete. During your employment and for a period of thirty-six (36) months
following the termination of your employment for any reason, you agree not to, directly
or indirectly, anywhere in the world:
   (a) engage in, own, manage, operate, control, be employed by, participate in, or
       be connected with any business, individual, or entity that competes with the
       Company in any capacity;
   (b) provide services substantially similar to those you provided to the Company
       to any competitor of the Company.

5.2 Non-Solicitation. For a period of thirty-six (36) months following termination,
you shall not, directly or indirectly, solicit, induce, recruit, or encourage any
Company employee, contractor, or advisor to terminate their relationship with the
Company, or solicit any Customer of the Company.

6. AT-WILL EMPLOYMENT AND TERMINATION

6.1 At-Will. Your employment with the Company is at-will, meaning either you or the
Company may terminate the employment relationship at any time, for any reason or no
reason, with or without cause or advance notice.

6.2 No Severance. Upon termination for any reason, you shall receive only your accrued
but unpaid salary through the date of termination. You are not entitled to any
severance pay, bonus, equity acceleration, or other compensation following termination.

6.3 Garden Leave. The Company may, in its sole discretion, place you on "garden leave"
during any notice period, requiring you to stay away from the office while remaining
bound by all obligations herein and receiving no additional compensation.

7. DISPUTE RESOLUTION AND MANDATORY ARBITRATION

7.1 Arbitration. You and the Company agree that any and all disputes, claims, or
controversies arising out of or relating to this Agreement, your employment, or the
termination thereof, including claims of discrimination or harassment, shall be
resolved exclusively by final and binding arbitration before a single arbitrator
under the American Arbitration Association Commercial Arbitration Rules.

7.2 Class Action Waiver. YOU EXPRESSLY WAIVE YOUR RIGHT TO BRING OR PARTICIPATE IN
ANY CLASS ACTION, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING IN ARBITRATION
OR IN COURT.

7.3 Attorneys' Fees. In any arbitration or legal proceeding arising from this Agreement,
the non-prevailing party shall pay all reasonable attorneys' fees and costs of the
prevailing party, regardless of the magnitude of any award.

7.4 Governing Law. This Agreement shall be governed by the laws of the State of
Delaware. You consent to exclusive jurisdiction of courts in Delaware.

8. ACKNOWLEDGMENT

By signing below, you acknowledge that you have read this Agreement in its entirety,
you have had the opportunity to seek independent legal counsel, and you agree to all
terms and conditions set forth herein.

ACCEPTED AND AGREED:

Employee Signature: _______________________
Printed Name:
Date:

On behalf of Acme Ventures LLC:
By: _______________________
Title: Chief People Officer
`,
  },
];

/* ============================================================
   ANALYSIS OUTPUTS
   ============================================================ */

export function demoOutput(id: DemoId): LexiconAnalysis {
  if (id === "clean-nda") return cleanNdaAnalysis();
  if (id === "vendor-msa") return vendorMsaAnalysis();
  return employmentTrapAnalysis();
}

function cleanNdaAnalysis(): LexiconAnalysis {
  return {
    summary:
      "This is a well-drafted mutual NDA that follows standard market practice. The exclusions are clear, the purpose limitation is specific, and the obligations are balanced. There are a few improvements worth making before signing: the 2-year term should carve out trade secrets, the definition of Confidential Information could be tighter, and the arbitration clause removes your right to go to court.",
    riskLevel: "low",
    confidence: 0.87,
    topRisk: "Trade secret protection ends after 2 years",
    verdict: "Acceptable with minor edits. Safe to negotiate and sign.",
    warnings: [
      {
        title: "Confidentiality term expires in 2 years for all information",
        detail:
          "Section 3.2 provides indefinite protection only for trade secrets, but the definition of what qualifies as a trade secret is not specified in this agreement. Standard market practice for technical NDAs is 3-5 years for general confidential information.",
        whatItMeans:
          "After 2 years, anything disclosed under this NDA that is not a trade secret can be freely disclosed by either party. If your product roadmap, customer data, or pricing strategies are shared under this NDA, they lose protection in 2 years.",
        whatToDo:
          "Extend the term to 3 years minimum. Add a definition of 'trade secrets' that explicitly covers source code, customer data, and financial models.",
        severity: "info",
      },
      {
        title: "Confidential Information definition lacks specific examples",
        detail:
          "Section 1.1 uses a broad catch-all definition but does not enumerate the specific types of information most relevant to a tech company. This can create disputes about what was actually covered.",
        whatItMeans:
          "If a dispute arises, the other party may argue that specific information (e.g., an algorithm, a client list) was not covered because it was not explicitly listed. Courts sometimes construe ambiguous definitions narrowly.",
        whatToDo:
          "Add explicit categories: source code, API specifications, customer and user data, financial models, pricing structures, product roadmaps, employee information, and pending patent applications.",
        severity: "info",
      },
      {
        title: "Arbitration clause removes your right to go to court",
        detail:
          "Section 6.2 requires all disputes to go to binding arbitration in Delaware under JAMS rules. JAMS arbitration is expensive (filing fees can exceed $10,000) and typically favors experienced corporate parties.",
        whatItMeans:
          "If the other party violates the NDA, you cannot go to court for emergency injunctive relief without first navigating the arbitration process. This can be slow and costly for a startup.",
        whatToDo:
          "Add a carve-out: either party may seek emergency injunctive or equitable relief in court without first arbitrating. This is a standard addition and should not be controversial.",
        severity: "warn",
      },
    ],
    precautions: [
      {
        title: "Label every sensitive disclosure at the time it is made",
        detail:
          "Operationally, mark emails, decks, and documents shared under this NDA as 'CONFIDENTIAL - PROTECTED UNDER NDA DATED [DATE]'. Keep a simple disclosure log. This evidence is critical if you ever need to enforce the agreement.",
        urgency: "before-signing",
      },
      {
        title: "Confirm return/destruction process is followed",
        detail:
          "When the NDA expires or the relationship ends, formally invoke Section 4.1 in writing. Request written confirmation that all materials including digital copies and backups have been destroyed.",
        urgency: "monitor",
      },
      {
        title: "Get jurisdiction-specific advice if operating outside Delaware",
        detail:
          "If your business is primarily in California, New York, or another state with different trade secret laws, Delaware law may interact unexpectedly with local regulations. A one-hour local attorney consultation is worth it.",
        urgency: "before-signing",
      },
    ],
    suggestedEdits: [
      {
        clause: "Section 3.1 - Term",
        current: "This Agreement shall remain in effect for a period of two (2) years...",
        suggested:
          "This Agreement shall remain in effect for a period of three (3) years from the Effective Date. Notwithstanding the foregoing, confidentiality obligations with respect to Confidential Information that constitutes a trade secret shall continue indefinitely.",
        reason: "3 years is market standard for technology NDAs. Trade secret carve-out is industry best practice.",
      },
      {
        clause: "Section 6.2 - Arbitration",
        current: "Any dispute...shall be submitted to binding arbitration...",
        suggested:
          "Add after arbitration clause: 'Notwithstanding the foregoing, either Party may seek emergency injunctive or other equitable relief from any court of competent jurisdiction to prevent irreparable harm pending arbitration, without waiving the right to arbitrate the underlying dispute.'",
        reason:
          "NDA violations often require immediate court action to stop harm. The current clause blocks this entirely.",
      },
    ],
    missingClauses: [
      "No specific definition of 'trade secret' for purposes of the survival provision",
      "No data breach or security incident notification obligation",
      "No clause addressing what happens if a Party is acquired by a competitor",
      "No clause preventing the other Party from hiring your employees discovered through the NDA process",
    ],
    plainEnglish:
      "This NDA is mostly fine. You can sign it with the edits above. The two things worth fixing before you sign: (1) extend the term to 3 years and add a trade-secret carve-out, and (2) add a court carve-out for emergency injunctions. Everything else is standard. Operationally, label every disclosure and keep a log.",
  };
}

function vendorMsaAnalysis(): LexiconAnalysis {
  return {
    summary:
      "This MSA contains several clauses that are unusually and significantly vendor-favorable. The indemnification is structured backwards (you protect the vendor, not the other way around), termination is heavily one-sided (vendor can leave in 7 days; you cannot leave without cause), the liability cap is dangerously low (1 month of fees), and the data license grants the vendor the right to train AI models on your business data without consent. These are not minor issues. Each one requires negotiation before signing.",
    riskLevel: "medium",
    confidence: 0.82,
    topRisk: "You indemnify the vendor for their own product failures",
    verdict:
      "Do not sign without negotiation. At minimum, fix indemnity, data rights, termination, and the liability cap.",
    warnings: [
      {
        title: "CRITICAL: Indemnification is backwards - you protect the vendor",
        detail:
          "Section 5.1 requires Customer (you) to indemnify and defend Vendor for 'any and all claims arising out of or related to Customer's use of the Services.' This is an extraordinary overreach. A customer should never indemnify a vendor for claims arising from the vendor's own product defects, security failures, or service errors.",
        whatItMeans:
          "If the vendor's platform gets hacked and your customer data is leaked, and a third party sues, you could be required to pay the vendor's legal defense costs and any judgment against them. If the vendor's product causes harm to your business, you still pay their lawyers.",
        whatToDo:
          "Demand mutual indemnification: vendor indemnifies you for IP infringement claims, security breaches of vendor's platform, and vendor's own negligence or willful misconduct. Your indemnification should be limited to your own content and your own breach of the agreement.",
        severity: "critical",
      },
      {
        title: "CRITICAL: Vendor can train AI models on your business data",
        detail:
          "Section 4.2 grants the vendor a 'worldwide, royalty-free, perpetual license' to use your Customer Data to 'train machine learning models used in Vendor's platform or other products.' The license is perpetual, meaning it survives termination of this agreement. There is no opt-out mechanism.",
        whatItMeans:
          "Every piece of data your company uploads to this platform can be used to train AI models that benefit the vendor's other customers and products, indefinitely, even after you stop using the service. Your confidential business data, usage patterns, and content become part of the vendor's AI training dataset forever.",
        whatToDo:
          "Remove AI training rights entirely, or at minimum limit to aggregated, anonymized data only. Add: 'Vendor shall not use Customer Data to train any machine learning or artificial intelligence model without Customer's prior written consent.' Also add a termination right for vendor breach of data obligations.",
        severity: "critical",
      },
      {
        title: "Liability cap is dangerously low - only 1 month of fees",
        detail:
          "Section 6.2 caps the vendor's total liability at fees paid in the preceding 1 month. On a $5,000/month contract, if the vendor destroys your data or causes a major outage, the maximum you can recover is $5,000 regardless of the actual damage caused.",
        whatItMeans:
          "If a data breach exposes your customers' information and you face regulatory fines or lawsuits, the vendor's liability to you is capped at $5,000. Your losses from customer churn, regulatory investigation, and litigation costs could be 100x that amount.",
        whatToDo:
          "Negotiate a cap of at least 12 months of fees. For a serious data breach or IP infringement, insist that these are uncapped (or capped at a much higher amount). This is the most commonly negotiated clause in SaaS MSAs.",
        severity: "critical",
      },
      {
        title: "Termination is heavily one-sided",
        detail:
          "Section 3.2 allows the vendor to terminate for convenience with 7 days' notice. You cannot terminate for convenience at all - only for the vendor's uncured material breach (30-day cure period). Combined with the automatic renewal in Section 3.1 (requiring 90 days' notice of non-renewal), you can be locked in for an extra 12 months if you miss the window.",
        whatItMeans:
          "You could be paying for a service you no longer need for up to 15 months (3 months before end of term + 12-month automatic renewal). The vendor can walk away in a week with no obligation to transition your data.",
        whatToDo:
          "Make termination for convenience mutual (30 days' notice for both sides). Shorten the automatic renewal notice period to 30 days. Add a data transition obligation requiring the vendor to provide your data in exportable format for 60 days after termination.",
        severity: "warn",
      },
      {
        title: "Interest rate on late payments is extremely high",
        detail:
          "Section 2.3 charges 2.5% per month (30% per annum) on overdue amounts. This is significantly above market rates and above usury limits in many states.",
        whatItMeans:
          "A $10,000 invoice that is 2 months late would accrue $500 in interest. Compounded over 6 months, the interest alone could exceed $1,600. In some states, this rate may not be legally enforceable as it violates usury laws.",
        whatToDo:
          "Negotiate down to 1.5% per month (18% per annum) or the lower of 1.5% per month or the maximum rate allowed by applicable law.",
        severity: "warn",
      },
    ],
    precautions: [
      {
        title: "Do not upload sensitive customer data until data rights are renegotiated",
        detail:
          "Under the current agreement, any data you upload is licensed to the vendor for AI training purposes permanently. Before uploading any customer PII, proprietary business data, or trade secrets, either get the data clause renegotiated or ensure you are only uploading anonymized/sanitized data.",
        urgency: "immediate",
      },
      {
        title: "Set a calendar reminder for the auto-renewal window",
        detail:
          "Section 3.1 requires 90 days' notice before the end of the term to avoid automatic renewal. Set a calendar reminder for 4 months before your contract end date so you have time to evaluate and notify the vendor if needed.",
        urgency: "before-signing",
      },
      {
        title: "Request a security and compliance exhibit",
        detail:
          "The current agreement only promises 'commercially reasonable' security. Request a security exhibit specifying: SOC 2 Type II compliance, AES-256 encryption at rest and in transit, maximum breach notification window of 72 hours, and a list of approved subprocessors.",
        urgency: "before-signing",
      },
    ],
    suggestedEdits: [
      {
        clause: "Section 4.2 - Customer Data License",
        current: "Customer grants Vendor a worldwide, royalty-free, perpetual license to...train machine learning models...",
        suggested:
          "Vendor may use Customer Data solely to provide the Services to Customer. Vendor shall not use Customer Data for any other purpose, including to train machine learning or AI models, develop products, or generate benchmarks, without Customer's prior written consent. Vendor's license to Customer Data terminates upon expiration or termination of this Agreement.",
        reason:
          "Perpetual, worldwide AI training license on your business data is not acceptable. Limit data use to service delivery only.",
      },
      {
        clause: "Section 5.1 and 5.2 - Indemnification",
        current: "Customer shall indemnify Vendor for any and all claims arising from Customer's use of the Services...",
        suggested:
          "Each Party shall indemnify and defend the other for third-party claims arising from its own breach of this Agreement or gross negligence. Vendor shall additionally indemnify Customer for claims that the Services infringe third-party IP rights and for any claims arising from Vendor's security failures or data breaches of Vendor's platform.",
        reason: "Mutual indemnification is standard. One-sided indemnification that requires you to defend the vendor's product is not acceptable.",
      },
      {
        clause: "Section 6.2 - Liability Cap",
        current: "...shall not exceed the fees paid by Customer in the one (1) month immediately preceding the claim...",
        suggested:
          "...shall not exceed the fees paid by Customer in the twelve (12) months immediately preceding the claim. Notwithstanding the foregoing, the foregoing limitation shall not apply to: (a) either Party's indemnification obligations; (b) breaches of confidentiality; (c) Vendor's security failures; or (d) either Party's gross negligence or willful misconduct.",
        reason:
          "12-month cap is standard market practice. Security and confidentiality should be uncapped given the data rights being granted.",
      },
    ],
    missingClauses: [
      "No data portability or export obligation upon termination",
      "No SLA (Service Level Agreement) or uptime guarantee",
      "No security standards or compliance certifications requirement (SOC2, ISO 27001)",
      "No subcontractor restrictions or list of approved subprocessors",
      "No data residency or geographic restriction on where Customer Data is stored",
      "No GDPR or CCPA data processing addendum (required if handling personal data)",
    ],
    plainEnglish:
      "This agreement has four serious problems you must fix before signing: (1) the data license lets them train AI on your business data forever, (2) you indemnify them even when their product fails, (3) the 1-month liability cap means they owe you almost nothing if they cause real damage, and (4) they can leave in 7 days but you cannot leave at all. These are not standard terms. A good vendor should accept all four of these changes without significant pushback. If they refuse, treat it as a red flag.",
  };
}

function employmentTrapAnalysis(): LexiconAnalysis {
  return {
    summary:
      "This employment offer contains five provisions that are unusually extreme and potentially unenforceable in many jurisdictions, but dangerous to sign regardless. The invention assignment captures personal projects with no time or subject-matter limit. The non-compete is 36 months, worldwide, which is void in California and heavily restricted elsewhere but can still create legal risk and career disruption. The fee-shifting clause forces you to pay their lawyers if you lose any dispute. The arbitration class waiver removes your right to participate in class actions. Together, these clauses create significant long-term legal and financial exposure. Do not sign this as written.",
    riskLevel: "high",
    confidence: 0.79,
    topRisk: "Worldwide invention assignment captures all your personal projects indefinitely",
    verdict:
      "Do not sign as-is. Redline the invention assignment, non-compete, and fee-shifting clauses before accepting.",
    warnings: [
      {
        title: "CRITICAL: Invention assignment covers ALL inventions, including personal projects",
        detail:
          "Section 3.1 assigns to the Company any invention you create '(a) at any time during your employment; (c) during any time...if such Invention relates in any way to the Company's actual or contemplated business.' The phrase 'contemplated business' is extraordinarily broad. Most tech companies 'contemplate' many possible future businesses.",
        whatItMeans:
          "If you build a weekend side project, open-source contribution, or personal app during your employment, the company can claim they own it. If your app is in any technology area the company has ever discussed internally, this clause could apply. After you leave, the 12-month post-employment tail continues the assignment.",
        whatToDo:
          "Insist on a California-style carve-out (Labor Code 2870) even if you are not in California: inventions created entirely on your own time, without company equipment, resources, or confidential information, and not relating to the company's current business or demonstrably anticipated research, should be excluded. List any prior inventions you want to protect explicitly in Exhibit A.",
        severity: "critical",
      },
      {
        title: "CRITICAL: Worldwide 36-month non-compete is extreme and potentially unenforceable",
        detail:
          "Section 5.1 prohibits you from working in any capacity for any competitor, anywhere in the world, for 36 months after leaving. California prohibits non-competes entirely. Many other states (NY, CO, IL, MA, MN, ND, OK) heavily restrict them. The FTC attempted a nationwide ban in 2024 and continues to scrutinize them. Even where technically enforceable, employers can seek temporary restraining orders that block you from working while litigation proceeds.",
        whatItMeans:
          "Even if this clause would ultimately lose in court, the company can file for an emergency injunction the day after you leave and potentially prevent you from starting a new job for months while litigation resolves. The cost of defending yourself can exceed $50,000 even if you win. A potential future employer may simply not hire you to avoid being named in litigation.",
        whatToDo:
          "Request removal entirely, or at minimum: (1) narrow to direct competitors only (not all businesses in the same sector), (2) reduce to 6 months maximum, (3) limit geographically to regions where you actually worked, (4) add a garden leave provision where the company must pay your full salary during the non-compete period to make it enforceable.",
        severity: "critical",
      },
      {
        title: "CRITICAL: You pay their legal fees if you lose any dispute",
        detail:
          "Section 7.3 requires the losing party to pay all attorneys' fees of the winning party in any arbitration or legal proceeding. Combined with mandatory arbitration (Section 7.1), this creates extreme financial risk for any employment claim you bring, including discrimination or harassment claims.",
        whatItMeans:
          "If you file a claim that the non-compete is unenforceable and lose, you pay their lawyers (often $50,000 to $500,000+). The threat of fee-shifting deters employees from enforcing their own legal rights, including claims for unpaid wages, discrimination, or wrongful termination. This is a calculated deterrent to accountability.",
        whatToDo:
          "Remove fee-shifting entirely, or replace with: 'Attorneys' fees may be awarded in the arbitrator's discretion only upon a finding of bad faith.' Under no circumstances should fee-shifting be automatic or applicable to employment discrimination or harassment claims.",
        severity: "critical",
      },
      {
        title: "No severance, no notice period, immediate termination",
        detail:
          "Section 6.1 and 6.2 together establish: you can be fired at any time, for any reason, with no notice, and receive zero severance. There is no minimum notice period. The 'garden leave' provision (Section 6.3) can force you to stay home, bound by all non-compete obligations, while receiving no pay.",
        whatItMeans:
          "The day after signing, you could be terminated with no notice and no payment. The combination of no severance and a 36-month non-compete means you could be unemployed and restricted from your field for 3 years with no financial cushion from the company.",
        whatToDo:
          "Negotiate a minimum of 3 months written notice or pay-in-lieu-of-notice for termination without cause. Request that the non-compete period be reduced by the length of any notice period actually provided. Alternatively, negotiate severance that equals the length of the non-compete restriction period.",
        severity: "warn",
      },
      {
        title: "Mandatory arbitration removes your right to class actions",
        detail:
          "Section 7.2 contains an explicit class action waiver. Combined with mandatory individual arbitration, this means you cannot join other employees in a collective action for wage theft, discrimination patterns, or other systemic issues.",
        whatItMeans:
          "Individual arbitration typically favors employers. Companies that repeatedly use arbitration develop strategic advantages with arbitrators. Class actions are often the only practical mechanism for employees to collectively address systematic violations. Waiving this right has long-term consequences beyond your individual employment.",
        whatToDo:
          "Request removal of the class action waiver. Some states (including California) prohibit mandatory class action waivers in employment contracts. At minimum, add a carve-out for PAGA (California Private Attorneys General Act) claims if applicable.",
        severity: "warn",
      },
    ],
    precautions: [
      {
        title: "Do not sign until the invention assignment is fixed",
        detail:
          "The invention assignment clause is the single most dangerous long-term provision in this agreement. It can affect intellectual property you create for the rest of your career. Get this fixed before anything else. At minimum, complete and attach an Exhibit A listing every prior invention, side project, and personal IP you want to exclude.",
        urgency: "immediate",
      },
      {
        title: "Consult an employment attorney in your state before signing",
        detail:
          "Non-compete enforceability, invention assignment protections, and fee-shifting rules vary dramatically by state. A one-hour consultation with an employment attorney in your jurisdiction (cost: $200 to $500) could save you from years of legal liability. This is not optional given the terms in this agreement.",
        urgency: "immediate",
      },
      {
        title: "Negotiate the non-compete before you start - not after",
        detail:
          "Once you begin employment and receive benefits, your negotiating leverage decreases significantly. Courts also look more favorably on restrictions that were negotiated at the time of hiring with some consideration. Ask for the non-compete to be removed or substantially narrowed before you accept the offer.",
        urgency: "before-signing",
      },
    ],
    suggestedEdits: [
      {
        clause: "Section 3.1 - Invention Assignment",
        current: "You hereby irrevocably assign...any and all inventions...conceived, developed, or reduced to practice...(a) at any time during your employment...(c) during any time...if such Invention relates in any way to the Company's actual or contemplated business...",
        suggested:
          "Assignment is limited to Inventions that: (a) relate directly to the Company's current, active business operations; (b) were developed using Company resources, facilities, or Confidential Information; AND (c) were developed during normal working hours. Inventions developed entirely on Employee's own time, without use of Company resources, that do not relate to the Company's current business, are excluded from assignment. Employee shall attach a list of Prior Inventions as Exhibit A and such prior inventions are excluded.",
        reason:
          "Overbroad invention assignments that capture unrelated side projects and future businesses are legally suspect in many states and practically devastating for employees. California Labor Code 2870 provides a model carve-out that is widely adopted.",
      },
      {
        clause: "Section 5.1 - Non-Compete",
        current: "...anywhere in the world...for a period of thirty-six (36) months...",
        suggested:
          "Remove the non-compete restriction entirely. Replace with: Employee agrees not to solicit Company customers or employees for a period of twelve (12) months following termination of employment. This restriction is limited to individuals Employee directly worked with during the final 12 months of employment.",
        reason:
          "A 36-month worldwide non-compete is unenforceable in California, Minnesota, North Dakota, and Oklahoma, and is increasingly restricted in many other states. Non-solicitation is the appropriate and enforceable alternative.",
      },
      {
        clause: "Section 7.3 - Attorneys' Fees",
        current: "...the non-prevailing party shall pay all reasonable attorneys' fees and costs of the prevailing party, regardless of the magnitude of any award.",
        suggested:
          "Remove fee-shifting provision entirely. Each Party shall bear its own attorneys' fees and costs, except that a court or arbitrator may award fees and costs to a prevailing party upon a finding that the opposing Party acted in bad faith or brought a claim that was frivolous.",
        reason:
          "Automatic fee-shifting in employment disputes is used to deter employees from asserting their legal rights. It is disproportionate and may be unenforceable for discrimination or harassment claims in many jurisdictions.",
      },
    ],
    missingClauses: [
      "No severance obligation upon termination without cause",
      "No minimum notice period before termination (at-will with zero notice)",
      "No equity vesting acceleration upon change of control or termination without cause",
      "No clear definition of 'material breach' that would allow employee to terminate for cause",
      "No harassment or discrimination policy incorporation by reference",
      "No relocation assistance or remote work terms",
      "No definition of 'Competitors' for non-compete purposes (currently captures any business)",
    ],
    plainEnglish:
      "This offer has three things that must be fixed before you sign: (1) the invention assignment can capture your personal projects and side businesses for your entire employment plus 12 months, (2) the worldwide 36-month non-compete can block you from working in your field for 3 years, and (3) if you challenge anything in arbitration and lose, you pay their lawyers. These are not standard terms. Most normal companies do not include all three of these together. You should negotiate, get an employment attorney's 1-hour opinion, and at minimum complete and attach an Exhibit A listing every prior invention before signing.",
  };
}
