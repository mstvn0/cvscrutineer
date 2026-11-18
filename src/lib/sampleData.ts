/**
 * One-click demo scenarios that surface common ATS failure modes so users
 * and recruiters can evaluate CVScrutineer without uploading a real resume.
 */

export type SampleScenario = {
  id: string;
  label: string;
  tagline: string;
  trapFocus: string;
  resume: string;
  jobDescription: string;
};

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'senior-frontend-vector-drift',
    label: 'Sample 1: Senior Frontend Engineer (Vector Drift Trap)',
    tagline: 'Strong React/Next.js signal drowned by retail + WordPress fluff',
    trapFocus:
      'Lengthy unrelated retail management, freelance WordPress gigs, passive verbs, and "JS/TS" instead of "TypeScript" dilute semantic relevance and fail seniority knockouts.',
    resume: `Jordan Hale
jordan.hale@email.com | (415) 555-0187 | linkedin.com/in/jordanhale | github.com/jhale-dev | jordanhale.dev
San Francisco, CA 94107 | 1842 Market Street, Apt 6B

SUMMARY
Frontend engineer who has helped with modern web apps and assisted in shipping product features. Comfortable with JS/TS, React, and design systems. Looking for a senior role where I can continue growing.

EXPERIENCE

Senior Frontend Engineer — NovaLedger (Fintech SaaS) | Jan 2021 – Present
- Helped with migrating the customer dashboard from a legacy jQuery stack to React 18 and Next.js App Router
- Assisted in building a shared component library used across 4 product surfaces
- Worked on payment settings UI; helped reduce support tickets related to billing confusion
- Collaborated with design on accessibility improvements for the transaction history table
- Mentored two junior engineers on code review habits
- Stack: JS/TS, React, Next.js, Tailwind, GraphQL, Jest, Playwright

Frontend Engineer — BrightPath Analytics | Mar 2018 – Dec 2020
- Helped with rewriting marketing site landing pages in React
- Assisted in implementing chart widgets for the analytics console
- Worked on responsive layouts and cross-browser fixes
- Contributed to CI linting rules for the frontend monorepo
- Stack: JS/TS, React, Redux, Webpack, Cypress

Freelance Web Developer — Independent | 2016 – 2018 (overlapping weekends)
- Built 12+ WordPress brochure sites for local restaurants, dentists, and yoga studios
- Customized Elementor/WooCommerce themes, installed plugins, and handled hosting migrations
- Wrote PHP snippets for contact forms and Google Maps embeds
- Managed client retainers for content updates, SEO plugin tweaks, and banner rotations
- Delivered logo refresh mockups in Canva for three boutique retail clients

Store Manager — Harbor & Pine Outfitters (Retail) | Jun 2012 – Feb 2018
- Managed a 22-person team across floor sales, stockroom, and seasonal hires
- Owned weekly merchandising plans, visual displays, and loss-prevention audits
- Helped with inventory forecasting; reduced overstock on outerwear by coordinating vendor returns
- Assisted in opening two new store locations including hiring and training schedules
- Ran daily standup huddles, handled customer escalations, and closed the register
- Exceeded quarterly sales targets 7 of 8 consecutive quarters in FY2016–FY2017
- Coordinated community pop-up events and loyalty-program enrollment drives
- Maintained vendor relationships with 15+ apparel and outdoor brands

PROJECTS
- Personal portfolio rebuild on WordPress with a custom theme (2019)
- Side freelance: Shopify theme tweaks for a candle brand

EDUCATION
B.S. Computer Science — State University | 2014

SKILLS
JS/TS, React, Next.js, HTML/CSS, WordPress, WooCommerce, Shopify, retail operations, team leadership, merchandising, customer service, GraphQL, Jest`,
    jobDescription: `Senior Frontend Engineer — Payments Platform

About the role
We are hiring a Senior Frontend Engineer to own customer-facing payment and billing experiences in a high-compliance fintech environment. You will partner with Product and Design to ship TypeScript-first React/Next.js interfaces that move real money safely.

Must-haves (knockout)
- 5+ years professional frontend engineering experience
- Expert TypeScript (not "JS familiarity") in production React codebases
- Production Next.js experience (App Router preferred)
- Demonstrated ownership of complex product surfaces (not ticket-taker work)
- Experience with design systems / shared component libraries
- Strong testing discipline (unit + e2e)
- Clear, active-voice communication of impact and metrics

Nice-to-haves
- Payments, billing, or fintech domain exposure
- GraphQL clients, accessibility (WCAG), Playwright
- Mentorship of mid/junior engineers

What we screen out
- Pure WordPress / theme-shop freelance as primary signal
- Retail or non-software management as the bulk of the resume
- Passive descriptions ("helped with", "assisted in") without ownership or outcomes
- Acronym-only skill lists that omit TypeScript explicitly

Recruiter Boolean (approx.)
("Senior Frontend" OR "Staff Frontend") AND TypeScript AND (React AND Next.js) AND (payments OR billing OR fintech)`,
  },
  {
    id: 'product-manager-knockout-synonym',
    label: 'Sample 2: Product Manager (Knockout & Synonym Trap)',
    tagline: 'Strong PM story that still misses Boolean knockout phrases',
    trapFocus:
      'Resume describes launching features and analyzing user behavior but omits exact JD knockouts like "0-to-1 product ownership", "SQL", and "A/B experimentation", so recruiter Boolean searches never surface the candidate.',
    resume: `Alex Rivera
alex.rivera@email.com | +1-646-555-0142 | linkedin.com/in/alexriverapm | alexrivera.pm
Brooklyn, NY 11201 | 88 Pierrepont Street

PRODUCT MANAGER
Outcome-oriented PM who partners with engineering and design to ship features users love. Skilled at turning messy customer feedback into prioritized roadmaps.

EXPERIENCE

Product Manager — Northstar Commerce | Apr 2021 – Present
- Led cross-functional delivery of a new checkout upsell module used by 180k monthly shoppers
- Launched three pricing-page experiments in partnership with growth marketing; shared learnings in monthly reviews
- Analyzed user behavior in Amplitude and Mixpanel to identify drop-off in the saved-cart flow; proposed a redesign that improved completion
- Wrote PRDs and success metrics for a merchant onboarding wizard; coordinated rollout across iOS, Android, and web
- Ran discovery interviews with 25 merchants and synthesized themes into a quarterly opportunity brief
- Partnered with data science on funnel dashboards; reviewed weekly charts to decide what to build next
- Negotiated scope cuts that protected the holiday freeze window without slipping the core launch

Associate Product Manager — Brightloop EdTech | Jul 2018 – Mar 2021
- Owned the student assignment submission surface end-to-end with one eng pod and one designer
- Shipped a teacher feedback toolkit after synthesizing NPS comments and support tickets
- Coordinated beta with 12 school districts; tracked adoption in spreadsheets and Looker tiles
- Presented roadmap tradeoffs to directors; built stakeholder alignment across CS and Sales
- Improved activation by clarifying empty states and onboarding copy based on session recordings

Business Analyst — Helio Consulting | Aug 2016 – Jun 2018
- Gathered requirements for internal tooling projects
- Built Excel models for capacity planning
- Facilitated workshops between client ops teams and offshore engineering

EDUCATION
MBA — Metro Business School | 2016
B.A. Economics — Lakeside College | 2014

SKILLS
Roadmapping, PRDs, stakeholder management, Amplitude, Mixpanel, Looker, user interviews, agile delivery, growth collaboration, wireframing in Figma`,
    jobDescription: `Product Manager — 0-to-1 Growth Platform

About the role
We need a Product Manager who has taken ambiguous problems from idea to shipped product ("0-to-1 product ownership") and who is fluent in quantitative discovery.

Knockout requirements (auto-reject if missing)
- Explicit 0-to-1 product ownership (greenfield or new product line, not only iterating existing surfaces)
- Hands-on SQL for self-serve analysis (joins, funnels, cohort pulls) — not solely BI-tool consumption
- A/B experimentation literacy: hypothesis design, guardrails, interpreting statistical results
- 4+ years PM experience in B2B or marketplace environments
- Comfort partnering with data science and engineering on instrumentation

Preferred
- Growth / monetization domain
- Experience with Amplitude or similar + the ability to validate findings in SQL
- Crisp narrative writing for exec stakeholders

How recruiters search our ATS
("Product Manager" OR "PM") AND ("0-to-1" OR "0 to 1" OR "zero to one") AND SQL AND ("A/B" OR "experimentation" OR "AB test")

Candidates who only say "launched features", "analyzed user behavior", or "ran experiments with marketing" without the exact knockout terms above often never appear on page 1 of Boolean results — even when the underlying experience is relevant.`,
  },
];

export function getSampleScenario(id: string): SampleScenario | undefined {
  return SAMPLE_SCENARIOS.find((scenario) => scenario.id === id);
}
