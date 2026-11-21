# CVScrutineer

**Stop letting robot filters trash your resume before a human ever sees it.**

CVScrutineer shows why ATS and recruiter search pipelines pass or reject a resume—knockout rules, semantic drift, and Boolean gaps—so you can fix the real blockers.

> See why the resume robot rejected you—and fix it.

## Live Demo

**[https://cvscrutineer.vercel.app/](https://cvscrutineer.vercel.app/)**

## Key Features

- **Knockout Rule Extractor** — Pulls hidden pass/fail requirements from the job description (experience, core tech, ownership, logistics) and checks each against resume evidence as met, warning, or failed.
- **Semantic Vector Drift Map** — Audits every role and section for High Signal, Neutral, or Diluting Vector labels so unrelated fluff stops dragging down ATS relevance.
- **Recruiter Boolean Search Simulator** — Runs realistic sourcer-style Boolean queries and flags Page 1 Match vs Filtered Out, including the exact missing term to copy.
- **Fix-it suggestions** — Short, grounded tips on failed knockouts and diluting sections (phrase swaps or where to add missing keywords), with one-click copy. No invented skills, metrics, or scores.
- **Severity-first results** — Problem counts in Gate classification jump to the matching tab with a filter; the worst gate opens first; met knockouts and High Signal sections stay collapsed by default.

Classification is deterministic: **LIKELY_REJECTED** (any hard knockout failed), **AT_RISK** (warnings, diluting sections, or Boolean misses), or **PASS** (all gates clear)—no invented percentage scores.

## How to use

1. Open the [live demo](https://cvscrutineer.vercel.app/) or run the app locally (see Local Setup).
2. Paste the **text** for your resume and the target job description into the text boxes (file upload is not supported—copy from your editor or PDF and paste). Or load a sample scenario from the buttons above the inputs.
3. Click **Scrutinize Resume** and wait while knockout rules, vector drift, and recruiter Boolean checks run.
4. Read the **Gate classification** verdict (PASS / AT_RISK / LIKELY_REJECTED) and the executive diagnosis.
5. Click a non-zero gate count (e.g. hard knockouts failed) to jump to the filtered results tab.
6. Review **Fix-it** tips under failed knockouts and Diluting Vector rows; use **Copy** to grab a suggested edit.
7. Expand collapsed **Met knockouts** or **High Signal** sections when you want the full audit.
8. In the Recruiter tab, copy any missing exact term for Boolean coverage.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js App Router (TypeScript) |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/xai` (xAI Grok) |
| Validation | Zod |
| UI | Tailwind CSS, lucide-react |

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

CI on `main` runs the same checks: check:lines → typecheck → lint → test → build.

## Privacy Notes

- Resume and job-description text you submit are sent to the CVScrutineer API and onward to xAI for analysis.
- There is **no client-side PII scrubber**—assume anything you paste may leave your machine.
- Do not paste secrets, passwords, government IDs, or confidential employer data you are not allowed to share with a third-party model provider.
- Prefer redacting or omitting sensitive contact details yourself before scrutinizing if that matters for your use case.
- API keys stay server-side via `XAI_API_KEY` in `.env.local` (never commit `.env.local`).

## License

Private project — all rights reserved unless otherwise noted.
