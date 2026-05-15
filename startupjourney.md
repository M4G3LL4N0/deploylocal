# Startup Journey: DeployLocal

## 1. Current Snapshot

- **Project name:** DeployLocal
- **Local folder:** `/Users/joshuadavis/startups/deploylocal`
- **Live URL:** https://deploylocal.noaerth.com (portfolio subdomain pattern)
- **Live site status:** HTTP **200**
- **Product:** Fast local-business website launch toolkit with **admin-style lead engine** — builder flow, client areas, generation queue, and Stripe-integrated paths
- **Framework:** Next.js App Router (`app/`), TypeScript, Tailwind 3, Supabase + Stripe
- **Build command:** `pnpm build`
- **Local review command:** `pnpm dev` → http://localhost:3000
- **Current build status:** **PASS** (2026-05-14)
- **GitHub remote:** https://github.com/M4G3LL4N0/deploylocal.git
- **GitHub push status:** Not run this loop
- **Deployment:** **Not run** this loop
- **Last updated:** 2026-05-14

## 2. Portfolio Score

| Dimension | Score (0–10) | Notes |
|-----------|----------------|-------|
| Product clarity | 8 | Launch + leads story is legible |
| MVP reality | 8 | Builder + `/app` consoles + APIs |
| Visual quality | 7 | Utility UI; `SiteHeader` elevates shell |
| Build health | 8 | **PASS** on Next 14 stack |
| Customer urgency | 8 | SMBs still need sites yesterday |
| Market potential | 8 | Local services + agencies overlap |
| Monetization potential | 8 | Stripe artifacts in repo |
| Growth potential | 7 | Channel partners (agencies) plausible |
| Investor story | 7 | “Lead engine + gen” is credible with metrics |
| Local review readiness | 8 | `/builder` → `/app` smoke path |

- **Total score:** **77 / 100**
- **Classification:** **Promising venture** — strong mechanic; needs ruthless onboarding focus
- **Best next loop type:** **Onboarding loop** (builder first-run) + **Ops loop** (API error surfaces)

## 3. 10-Second Startup Explanation

- **What this startup is:** A workflow to spin up local business sites quickly and capture actionable lead pipelines in an operator console.
- **Who it is for:** Solo operators, tiny agencies, and founder-led GTM experiments.
- **What pain it solves:** WordPress thrash and disparate lead spreadsheets.
- **What the user can do:** Use builder/pricing paths, sign in where configured, operate `/app` dashboards.
- **Why it matters:** Speed to live site + lead accountability drives revenue earlier.
- **Primary CTA:** Start builder (`/builder`)

## 4. Founder Thesis

- **Core belief:** “Live fast, iterate offers” beats months of branding theater for local SMB acquisition.
- **Why this should exist:** AI + templates collapse build time; distribution is the new bottleneck.
- **Why now:** Search + maps still reward having a real site; buyers compare links instantly.
- **Market wedge:** Same-day site shell + lead capture opinionation.
- **Expansion path:** Industry templates, white-label for agencies, paid lead scoring.
- **What this can become:** Default micro-CMS + lead CRM for hyperlocal operators.
- **1000x opportunity:** Network effects if cross-merchant benchmarks inform playbooks (opt-in).
- **Biggest strategic risk:** Commoditized “AI website” noise — differentiate with lead outcomes.
- **Next founder decision:** One recorded demo: claim → live preview → first lead test.

## 5. Live Website Diagnosis

Based on live site (HTTP **200**):

- **Status code or load status:** **200**
- **What visitors currently see:** Marketing entry, builder hook, pricing, auth entry points, app surfaces when logged in.
- **Current headline:** Verify live marketing hero on `/`.
- **Current CTA:** Builder / signup / login depending on funnel stage.
- **What works:** **200** live; cohesive `SiteHeader` + layout refresh this loop; multi-route product; build **PASS**.
- **What feels weak:** Complexity — first visitor may not know where to click first.
- **What feels generic:** “Get online fast” claims without quantified proof.
- **What feels confusing:** `/client` vs `/app` naming for different personas — clarify roles in copy.
- **What feels unfinished:** Polished empty states in app sub-areas until data exists.
- **What feels premium:** Preview components if surfaced in builder journey.
- **What is missing:** Public case study with traffic/leads screenshot (even small N).
- **Highest leverage live-site fix:** Above-fold three-step graphic: Build → Publish → Capture lead.

## 6. Local Codebase Diagnosis

- **Framework:** Next.js App Router under `app/`, TypeScript, Tailwind 3
- **App structure:** Marketing + builder + client portal + authenticated `/app/*` operator areas + API routes for generation, Stripe, email, leads
- **Current routes (representative):** `/`, `/builder`, `/pricing`, `/signup`, `/login`, `/dashboard`, `/claim/[token]`, `/sites/[subdomain]`, `/client`, `/client/sites`, `/client/sites/[id]`, `/app`, `/app/generate`, `/app/queue`, `/app/sites`, `/app/sites/[id]`, `/app/leads`, `/app/leads/[id]`
- **Current pages:** Composite per tree — marketing shells, dashboards, previews
- **Current components:** `SiteHeader` (new/updated this loop), `site-preview`, UI primitives (`Button`, `Input`, `Card`, `Badge`)
- **Current data files:** Core types and AI/site generation libs under `lib/`
- **Current styling system:** Tailwind component classes
- **Technical risks:** Many moving API routes — observability gaps if unlogged
- **Build risks:** **PASS** today
- **Env var risks:** Supabase, Stripe, OpenAI keys — must be documented
- **API risks:** Webhook signing, idempotency on generation jobs
- **Mobile risks:** App tables may need responsive reflow — test `/app/leads`
- **GitHub risks:** Remote exists; push not run this loop
- **Local review risks:** Full auth path may require seeded user + env — document

## 7. Company Role Analysis

### CEO / Founder

- **Thesis:** Win on cycle time from idea → paying local lead — not pixel trophies.
- **Wedge:** Builder + lead console in one product surface.
- **Biggest opportunity:** Agency reseller channel with revenue share.
- **Biggest risk:** Support load if generation quality varies by niche.
- **Next decision:** Pick one vertical template to perfect (e.g., trades, clinics, legal).

### Chief Product Officer

- **MVP:** Builder + `/app` operator console + Stripe checkout path.
- **Primary workflow:** Generate site draft → approve → publish subdomain/custom domain path → capture lead.
- **Dashboard:** `/app` indexes for sites, queue, leads.
- **Onboarding:** `/builder` wizard + sample data.
- **Retention loop:** Weekly lead digest email to operator.

### Customer Researcher

- **Buyer:** Owner-operator, micro-agency principal.
- **User:** Person actually clicking “generate” and calling leads back.
- **Pain:** Slow vendor loops; fragmented tools.
- **Alternatives:** Squarespace, Webflow freelancers, bespoke dev.
- **Objections:** “Will SEO be real?” — show checklist + measurable basics.
- **Trust builders:** Live preview + fast edit loop.

### JTBD Strategist

- **Job-to-be-done:** “Get credible online presence before this weekend’s jobs.”
- **Trigger:** New license, seasonal rush, competitor site shame.
- **Desired outcome:** Live URL + working contact/lead pipeline.
- **Old way:** Email a nephew; stall.
- **New way:** Generate, tweak copy, publish, track leads in `/app`.

### UX Designer

- **UX issue:** Persona paths diverge (`/client` vs `/app`) — map clearly.
- **Homepage flow:** Explain both customer stories or pick one primary.
- **App flow:** Queue → generated artifact → publish → lead view.
- **Mobile flow:** `SiteHeader` anchors global nav on marketing pages.
- **Friction removed:** Layout + header unify cross-section navigation this loop.

### Visual Design Director

- **Visual identity:** Pragmatic SaaS — speed cues, not luxury fashion.
- **Type:** Legible dashboard tables and forms.
- **Color:** Strong primary CTA; status colors for lead stages.
- **Motion:** Subtle loading for long AI generations.
- **Component style:** Shared UI kit for app + marketing where possible.

### Brand Strategist

- **Category:** Local launch + lead operations.
- **Enemy:** Tool salad with no accountability for leads.
- **Memorable phrase:** “From blank to booked.”
- **Voice:** Operator-native; numbers-friendly.

### Copy Chief

- **Headline:** Lead with time-to-live + lead capture, not buzzwords.
- **Subheadline:** Who it is for; what stacks it replaces.
- **CTA:** “Open builder” / “View pricing.”
- **Copy rules:** Don’t promise rankings without context; show levers you control.

### Staff Engineer

- **Architecture:** Next + Supabase + Stripe + job-style API routes.
- **Build:** **PASS**
- **Env strategy:** `.env.example` enumerating every route’s needs.
- **Dependency plan:** Pin OpenAI SDK; queue retries with backoff.

### Frontend Engineer

- **Pages:** Marketing, builder, client portal, `/app` dashboard family.
- **Components:** New `SiteHeader` + layout integration this loop.
- **Interactions:** Forms, preview, tables, filters (as implemented).
- **Mobile fixes:** Header navigation; responsive tables.

### Full-Stack Architect

- **Data:** Supabase tables for sites, leads, users — verify schema vs UI.
- **Future database:** Lead scoring history; campaign attribution fields.
- **Future auth:** Role-based routes (operator vs end-client).
- **Future API:** Outbound CRM webhooks (HubSpot).
- **Future billing:** Metered generation + seat model.

### AI Product Architect

- **AI use:** Site generation, outreach drafts — human approves publish.
- **Safe boundaries:** No fabricated licenses/reviews; strict truthfulness prompts.
- **Future plan:** Template-constrained generation per vertical compliance.

### Data Moat Strategist

- **Data loop:** Opt-in anonymized funnel benchmarks by vertical.
- **Feedback loop:** Lead outcome tagging (won/lost/no answer).
- **Benchmark:** Reply speed vs close rate proxies.

### Growth Marketer

- **Hook:** “Your competitor’s site went up in an afternoon — did yours?”
- **SEO:** local business website generator, fastest launch checklist.
- **Distribution:** Plumbing/electrical Facebook groups; agency podcasts.
- **Share loop:** Braggable before/after gallery (with permission).

### Sales Operator

- **Buyer pain:** Losing inbound calls to “no website.”
- **Proof:** Live **200** + screen recording of lead hitting `/app`.
- **Pricing:** `/pricing` truth vs Stripe products.
- **Objections:** Support — publish SLA docs.

### Pricing Strategist

- **Model:** Subscription + usage-based generation overage.
- **Free tier:** Watermarked preview only (if used).
- **Paid tier:** Custom domain, lead export, priority gen.
- **Upgrade trigger:** Lead volume crosses free cap.

### Investor Analyst

- **Venture thesis:** AI collapses web build cost; ops software captures upside.
- **Market:** Huge SMB count; fragmented winners.
- **Expansion:** Vertical playbooks + partner channel.
- **Moat:** Lead workflow depth + integrations.
- **Metrics:** Time-to-first-publish, qualified leads per site, gross margin per gen.

### Competitive Intelligence Analyst

- **Category pattern:** Site builders vs GTM suites.
- **Differentiation:** Combined generation + operator lead console focus.

### Experiment Designer

- **Tests:** Home primary CTA: builder vs pricing.
- **Success metric:** Started generation sessions.
- **Feedback loop:** Drop-off step telemetry in builder.

### QA Engineer

- **Build:** **PASS**
- **Routes:** `/`, `/builder`, `/pricing`, `/login`, `/app/*` smoke.
- **Mobile:** `SiteHeader` coverage on marketing surfaces.
- **Regression:** Stripe webhook handler with mocked events.

### Security / Trust Reviewer

- **Risks:** Tenant isolation in multi-user Supabase setup.
- **Disclaimers:** User content responsibility; copyright on assets.
- **Data handling:** PII in leads — encryption at rest posture review.

### Legal / Policy Framing Reviewer

- **Risk category:** Medium — business claims around performance.
- **Safe framing:** Tooling enables publishing; customer owns legal compliance of copy.
- **Required disclaimers:** AI-generated content review responsibility.

### GitHub Release Operator

- **Remote:** https://github.com/M4G3LL4N0/deploylocal.git
- **Commit / push:** Not run this loop

### Local Review Director

- **Command:** `cd /Users/joshuadavis/startups/deploylocal && pnpm dev`
- **URL:** http://localhost:3000
- **Test flow:** `/` → `/builder` → `/pricing` → `/login` (if env OK) → `/app/leads`

### Speed / Token Efficiency Operator

- **Scope:** `SiteHeader` + layout cohesion; journey documentation.
- **Blockers:** Env-heavy local repro — publish minimal docker compose or script (backlog).

### Taste Reviewer

- **Quality diagnosis:** Utilitarian — good; avoid “grey admin” boredom on marketing.
- **Premium fix:** One bold customer quote with business type + city.

### Contrarian Strategist

- **Angle:** Give builder away free; monetize lead credits only.
- **Wedge:** Exclusive to one metro for network effects lore.

### Community / Ecosystem Builder

- **Community:** Agency Discord sharing vertical prompt packs.
- **Public artifact:** “Local services site rubric” PDF.

### Automation Architect

- **Safe automation:** CI `pnpm build`; contract tests for critical API handlers.
- **Future:** Nightly synthetic journey hitting staging builder.

## 8. Product Strategy

- **MVP definition:** Builder + publish path + `/app` lead visibility + Stripe alignment.
- **Primary workflow:** Generate → edit → publish → work leads.
- **Input:** Business details form; queues for batch operations.
- **Output:** Hosted site artifact + captured lead rows.
- **First aha moment:** Live preview URL in under targeted minutes (state actual SLA when measured).
- **Dashboard purpose:** Operator command center for leads and generation jobs.
- **Retention loop:** New lead notifications; weekly performance email.
- **Monetization path:** Subscriptions + usage + services upsell.

## 9. Roadmap

### Loop 1: Make It Understandable

- Three-step home explainer graphic.

### Loop 2: Make It Real

- `SiteHeader` + layout refresh — **done** this loop.

### Loop 3: Make It Premium

- Polished preview modal and before/after gallery.

### Loop 4: Make It Useful

- Lead stage automation suggestions (templates).

### Loop 5: Make It Monetizable

- Stripe product ↔ UI pricing parity audit.

### Loop 6: Make It Fundable

- Publish core metrics dashboard (internal).

### Loop 7: Make It Compound

- CRM outbound webhooks.

### Loop 8: Make It Defensible

- Vertical-specific generation guardrails proven by data.

### Loop 9: Make It Distributable

- Agency white-label subdomain pattern.

### Loop 10: Make It Operationally Scalable

- Job queue observability + on-call runbooks.

## 10. Work Completed This Loop

### Loop Entry: 2026-05-14

- **Loop type:** Global chrome + navigation
- **Loop goal:** Introduce/improve `components/SiteHeader.tsx` and layout integration across marketing/product shell; maintain **PASS** build
- **Changes made:** `SiteHeader` component and layout wiring for consistent header treatment.
- **Files changed:** `components/SiteHeader.tsx`, `app/layout.tsx` (and related layout files as applicable)
- **Routes added:** none
- **Routes improved:** Cross-site navigation discoverability (`/builder`, `/pricing`, `/login`, `/app` entry contexts)
- **Components added:** `SiteHeader` (or major revision this loop)
- **Components improved:** Layout composition using `SiteHeader`
- **MVP interactions added:** Unified top-of-page navigation pattern
- **Demo data added:** none
- **Copy improved:** none major this loop
- **Design improved:** Header/visual consistency across sections
- **Mobile improved:** Responsive header behavior per implementation
- **Engineering fixed:** Build remains **PASS**
- **Build result:** **PASS**
- **GitHub commit:** Not run
- **GitHub push result:** Not run
- **Deployment:** **Not run**
- **Local review command:** `pnpm dev`
- **Local review URL:** http://localhost:3000
- **What improved:** Wayfinding between builder, pricing, auth, and app areas
- **What still needs work:** Onboarding telemetry; `.env.example`; push to GitHub

## 11. Next Loop Plan

- **Highest leverage next move:** Record Loom demo + add `.env.example` with required keys per route family.
- **Product:** Builder drop-off instrumentation.
- **Design:** Empty state illustrations in `/app` lists.
- **Engineering:** Webhook replay tool for devs.
- **Growth:** Vertical-specific landing stub.
- **Sales:** Pilot offer: “10 sites in 30 days” package copy.
- **Monetization:** Overage UX when generation credits exhaust.
- **Investor story:** Lead capture rate per published site cohort.
- **Trust/safety:** AI content review checklist modal pre-publish.
- **GitHub:** Commit header/layout; push to origin.
- **Biggest risk:** Operational complexity without observability.
- **Suggested next command:** `cd /Users/joshuadavis/startups/deploylocal && pnpm dev`

## 12. 1000x Backlog

### Product

- Multi-site agency accounts; role-based permissions

### Design

- Marketing illustration system; dark mode for `/app` (optional)

### Engineering

- Robust queue worker; idempotent webhooks; integration tests

### Growth

- Partner co-marketing with local SEO agencies

### Sales

- Done-for-you onboarding SKUs

### Monetization

- Lead credits marketplace (careful ethics review)

### Investor Narrative

- “Local GTM OS: site + leads in one loop”

### Data Moat

- Vertical conversion benchmarks (opt-in)

### Automation

- Staging synthetic publish check

### Partnerships

- Hosting/DNS vendors; printers; local ad agencies

### SEO / Content

- Playbooks per vertical (plumber, dentist, boutique)

### User Retention

- Lead digest emails; SMS handoff integrations

### Demo Quality

- One-click sandbox business dataset

### Mobile Experience

- `/app/leads` responsive table → card deck

### Trust and Safety

- Copyright asset scanner on user uploads

### Real API Integrations

- Google Business Profile hints; Meta lead forms

### Enterprise Features

- SSO; audit trails; SLA tier

### Future AI Features

- Auto-generate FAQ from uploaded intake PDF (human approve)

### Community

- Template marketplace with revenue split

### Distribution

- WordPress migration importer

### Templates

- SOP checklist PDF for operators

### Analytics

- Funnel from builder start → publish → first lead

### Internal Tools

- Support impersonation mode (logged)

### Public Artifacts

- Public changelog + uptime page
