# CVScrutineer

**Stop letting robot filters trash your resume before a human ever sees it.**

CVScrutineer shows why ATS and recruiter search pipelines pass or reject a resume—knockout rules, semantic drift, and Boolean gaps—so you can fix the real blockers.

> See why the resume robot rejected you—and fix it.

## Live Demo

**[https://cvscrutineer.vercel.app/](https://cvscrutineer.vercel.app/)**

## Key Features

- **Knockout Rule Extractor** — Pulls hidden pass/fail requirements from the job description (experience, core tech, ownership, logistics) and checks each against resume evidence as met, warning, or failed.
- **Semantic Vector Drift Map** — Audits every role and section for High Signal, Neutral, or Diluting Vector labels so unrelated fluff stops dragging down ATS relevance.
- **Recruiter Boolean Search Simulator** — Runs realistic sourcer-style Boolean queries and flags Would Match vs Filtered Out using **exact** resume terms (e.g. `TypeScript` does not match `TS` / `JS/TS`), including the exact missing term to copy.
- **Forensics scoreboard** — Gate classification and executive diagnosis sit side-by-side; **What the ATS Bot Parsed** (detected title, relevant years, seniority tier, parser warnings) sits underneath; then the **Knockout Filters**, **Vector Drift Map**, and **Recruiter Search Test** tabs with scrollable results (and a “Scroll for more” cue when needed).
- **Fix-it suggestions** — On failed/warning knockouts and Diluting Vector rows: coach-style advice (what/where/why) plus a **Suggestions** box with a paste-ready draft of a **real resume entry**. Warning near-misses (e.g. checkout upsell ≈ 0-to-1) invite you to add the exact knockout term only if you decide it fits—never assumed. Keyword swaps (e.g. `JS/TS` → `TypeScript`) change **only** that token; broader rewrites keep the same employer/facts and put role scope in a bullet under that title when clear (never stuffed into the Title — Company header). **Copy** pastes the draft only—use it only when it matches work you have done. No invented skills, metrics, or scores.
- **Severity-first results** — Non-zero Gate metric tiles jump to the matching tab with a filter banner you can **Clear**; the worst open gate opens first; **Met knockouts** and **High Signal sections** stay collapsed by default.

Classification is deterministic on the server (see the one-line Gate legend in the UI):

| Status | Meaning |
| --- | --- |
| **LIKELY_REJECTED** | Hard knockout failed — auto-reject before review |
| **AT_RISK** | Warnings, diluting sections, or Boolean misses |
| **PASS** | All knockouts met; no diluting; Boolean queries matched |

No invented percentage scores.

## How to use

1. Open the [live demo](https://cvscrutineer.vercel.app/) or run the app locally (see Local Setup).
2. Paste **plain text** for your resume and the target job description (file upload is not supported—copy from your editor or PDF and paste). Each field is capped at about **9,500 characters** in the UI. Or use **Sample: Senior Frontend Dev** / **Sample: Product Manager** above the inputs.
3. Click **Scrutinize Resume** (or **Load Sample & Scrutinize** on the empty dashboard) and wait while knockout rules, vector drift, and recruiter Boolean checks run.
4. Read **Gate classification** + the status legend, the **executive diagnosis**, and **What the ATS Bot Parsed**.
5. Click a non-zero gate count (e.g. hard fails) to jump to the filtered results tab; use **Clear** on the filter banner to show the full tab again.
6. Review **Fix-it** under failed/warning knockouts and Diluting Vector rows: read the advice, then **Copy** from the **Suggestions** box only when the rewrite is truthful for you.
7. Expand collapsed **Met knockouts** or **High Signal sections** when you want the full audit.
8. In **Recruiter Search Test**, copy any missing exact term for Boolean coverage (near-miss acronyms do not count as a hit).

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router (React 19, TypeScript) |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/xai` (`grok-3-mini`) |
| Validation | Zod |
| UI | Tailwind CSS 4, lucide-react |
| Tests | Vitest |

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and add your xAI API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
XAI_API_KEY=your_xai_api_key_here
```

Get a key from [xAI](https://console.x.ai/).

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the sample presets or paste your own resume and job-description **text** (not a file), then click **Scrutinize Resume**.

### Useful scripts

```bash
npm run check:lines
npm run typecheck
npm run lint
npm test
npm run build
```

CI on `main` (and PRs to `main`) runs the same checks in order: check:lines → typecheck → lint → test → build.

## Privacy Notes

- Resume and job-description text you submit are sent to the CVScrutineer `/api/analyze` route and onward to xAI for analysis.
- There is **no client-side PII scrubber**—assume anything you paste may leave your machine.
- Do not paste secrets, passwords, government IDs, or confidential employer data you are not allowed to share with a third-party model provider.
- Prefer redacting or omitting sensitive contact details yourself before scrutinizing if that matters for your use case.
- API keys stay server-side via `XAI_API_KEY` in `.env.local` (never commit `.env.local`).

## License

Private project — all rights reserved unless otherwise noted.
