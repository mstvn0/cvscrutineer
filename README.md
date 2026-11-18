# CVScrutineer

**Stop letting robot filters trash your resume before a human ever sees it.**

CVScrutineer shows why ATS and recruiter search pipelines pass or reject a resume—knockout rules, semantic drift, and Boolean gaps—so you can fix the real blockers.

> See why the resume robot rejected you—and fix it.

## Live Demo

**[Add your deployed URL here]** — e.g. `https://cvscrutineer.vercel.app`

## Key Features

- **Knockout Rule Extractor** — Pulls hidden pass/fail requirements from the job description (experience, core tech, ownership, logistics) and checks each against resume evidence as met, warning, or failed.
- **Semantic Vector Drift Map** — Audits every role and section for High Signal, Neutral, or Diluting Vector labels so unrelated fluff stops dragging down ATS relevance.
- **Recruiter Boolean Search Simulator** — Runs realistic sourcer-style Boolean queries and flags Page 1 Match vs Filtered Out, including the exact missing term to copy.

Classification is deterministic: **LIKELY_REJECTED** (any hard knockout failed), **AT_RISK** (warnings, diluting sections, or Boolean misses), or **PASS** (all gates clear)—no invented percentage scores.

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

Open [http://localhost:3000](http://localhost:3000). Use the sample presets or paste your own resume + job description, then click **Scrutinize Resume**.

### Useful scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Privacy Notes

- Resume and job-description text you submit are sent to the CVScrutineer API and onward to xAI for analysis.
- There is **no client-side PII scrubber**—assume anything you paste may leave your machine.
- Do not paste secrets, passwords, government IDs, or confidential employer data you are not allowed to share with a third-party model provider.
- Prefer redacting or omitting sensitive contact details yourself before scrutinizing if that matters for your use case.
- API keys stay server-side via `XAI_API_KEY` in `.env.local` (never commit `.env.local`).

## License

Private project — all rights reserved unless otherwise noted.
