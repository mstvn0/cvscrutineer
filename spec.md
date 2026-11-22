# CVScrutineer — AI Spec

Product-friendly overview of how the AI analysis works, how the system is put together, and how data moves through the product.

This document describes **what is implemented today**. Where behavior depends on the model following instructions (for example Fix-it wording), that is called out as a **prompt rule**, not as a hard guarantee enforced after the fact. **Recruiter Boolean exact-term matching** is an exception: the server re-checks query terms against the resume after the model responds.

**Diagrams in Cursor:** the built-in Markdown **Open Preview** tab has a limited Mermaid engine. For reliable flowchart/sequence rendering, install the **Markdown Preview Mermaid Support** extension (`bierner.markdown-mermaid`), open the `.md` **Source** tab, then run **Markdown: Open Preview to the Side** (`Cmd+K` then `V`). GitHub also renders these blocks natively.

---

## 1. What problem does the AI solve?

Recruiters and job seekers often don’t know **why** a resume never reaches a human. Filters can reject people for missing keywords, weak seniority language, or unrelated experience that “dilutes” the match.

CVScrutineer’s AI looks at:

1. The **resume** (pasted as text)
2. The **job description** (pasted as text)

…and explains what an ATS / recruiter search would likely flag—and what the candidate could change.

It is **designed not** to invent fake skills, fake metrics, or a made-up “match percentage” (via prompt + output contract; see §6).

---

## 2. What the user gets back

| Area | In plain English | Where it appears |
| --- | --- | --- |
| **Gate classification** | Overall status: likely rejected, at risk, or pass | Scoreboard (beside executive diagnosis on wide layouts; above it when stacked) |
| **Executive diagnosis** | Summary of the main pass/fail reason (prompt asks for two sentences; app does not re-check length) | Scoreboard (beside gate on wide layouts; under gate when stacked) |
| **ATS parse summary** | Detected title, relevant years, seniority, parser warnings | Scoreboard (full width under gate + diagnosis) |
| **Knockout rules** | Must-have JD requirements: met, warning, or failed | **Knockout Filters** tab |
| **Vector drift** | Which resume sections help vs. hurt the match | **Vector Drift Map** tab |
| **Recruiter Boolean search** | Sample searches and Would Match vs Filtered Out (exact terms only; e.g. TypeScript ≠ TS) | **Recruiter Search Test** tab |
| **Fix-it tips** | Advice + optional copy-ready suggestion | Under failed/warning knockouts and Diluting Vector rows |

---

## 3. System architecture (big picture)

The product has three layers:

1. **Browser (UI)** — paste inputs, show loading, show the forensics dashboard  
2. **App server (analysis API)** — checks input, calls the AI, applies the final grade  
3. **AI provider (xAI)** — reads resume + JD and returns structured findings  

```mermaid
graph TB
  subgraph Browser
    Input[Input workspace]
    Dash[Results dashboard]
  end
  subgraph Server
    API[Analyze API]
    Check[Input checks]
    Grade[Fixed grading rules]
  end
  subgraph Provider
    Model[Language model]
  end
  Input -->|Scrutinize| API
  API --> Check
  Check -->|OK| Model
  Model -->|Findings| Grade
  Grade -->|Merged response| API
  API -->|Full result via client| Dash
  API -->|Error via client| Input
```
### Trust boundary (simple)

```mermaid
graph LR
  U[User text] --> B[Browser]
  B -->|JSON request| S[Our server]
  S -->|API key stays here| AI[AI provider]
  AI -->|Structured findings| S
  S -->|Graded result or error| B
```

- The AI API key never goes to the browser.
- The Scrutinize button stays disabled until each field has at least **50** characters. Textareas also cap paste length at **9,500** characters in the UI.
- The server re-validates both fields at **50–10,000** characters before calling the AI.
- The final Pass / At Risk / Rejected label is calculated **on our server**, not by the model.

---

## 4. Module design

Think of the AI path as a few cooperating modules. Each has one job.

```mermaid
graph TB
  subgraph UI
    IW[Input workspace]
    HS[Scrutinize controller]
    RD[Results dashboard]
  end
  subgraph Core
    CL[Analyze client]
    AP[Analyze API]
    VL[Request validator]
    PR[AI instructions]
    SC[Findings contract]
    VD[Verdict grading engine]
  end
  IW --> HS
  HS --> CL
  CL -->|POST| AP
  AP --> VL
  VL -->|OK| AP
  AP --> ModelCall[AI call]
  PR --> ModelCall
  SC --> ModelCall
  ModelCall --> VD
  VD -->|Merge into response| AP
  AP -->|HTTP response| CL
  CL --> HS
  HS --> RD
```

| Module | What it does (plain English) | Why it exists |
| --- | --- | --- |
| **Input workspace** | Collects resume + JD text; sample load / clear; shows API errors | Keeps input separate from results |
| **Scrutinize controller** | Starts analysis, rotates loading messages, tracks success/error; aborts an in-flight request if a new run starts or results are cleared | Owns the “run analysis” experience |
| **Analyze client** | Sends the request to the server and checks the reply looks valid | Protects the UI from broken payloads |
| **Analyze API** | Server entry point for one analysis run | Single place for secrets and AI calls |
| **Request validator** | Confirms both texts exist and are within size limits | Avoids wasted AI calls and bad input |
| **AI instructions** | Rules the model must follow (grounding, Fix-it format, no fake scores) | Keeps AI behavior consistent |
| **Findings contract** | Defines the exact fields the AI must return | Makes results predictable for the UI |
| **Verdict / grading engine** | Reconciles Boolean exact-term hits against the resume, then turns findings into PASS / AT_RISK / LIKELY_REJECTED plus counts | Repeatable, explainable final status (Boolean flags are not trusted from the model alone) |
| **Results dashboard** | Shows scoreboard + knockout / drift / recruiter tabs | Turns findings into something humans can use |

**Note:** Loading stage messages (knockouts → drift → Boolean) are **cosmetic progress text**. They rotate while waiting; they are not separate AI steps.

### What the AI produces vs. what the app adds

| Produced by AI | Added by app (not AI) |
| --- | --- |
| Executive diagnosis | Final gate status (`knockoutStatus`) |
| ATS parse profile | Metric counts + classification sentence (`verdictBreakdown`) |
| Knockout rules + Fix-its (failed and warning near-misses) | — |
| Drift audit + Fix-its (when diluting) | — |
| Recruiter Boolean query strings | Exact-term reconcile (`wouldMatch` / `missingExactTerm`; e.g. TypeScript ≠ TS) |

---

## 5. Core flows

### 5.1 Happy path — “Scrutinize Resume”

```mermaid
sequenceDiagram
  participant User
  participant UI
  participant API
  participant AI
  participant Grade

  User->>UI: Paste resume and JD, click Scrutinize
  Note over UI: Button needs 50 chars per field
  UI->>UI: Show loading skeleton
  UI->>API: Send both texts
  API->>API: Validate again
  API->>AI: Ask for structured findings
  AI-->>API: Findings without final grade
  API->>Grade: Reconcile Boolean exact terms vs resume
  Grade->>Grade: Apply fixed status rules
  Grade-->>API: PASS, AT_RISK, or LIKELY_REJECTED
  API-->>UI: Full result
  UI->>User: Show dashboard
```

### 5.2 Error path (as implemented)

```mermaid
graph TD
  A[User tries to Scrutinize] --> B{Each field has 50+ chars?}
  B -->|No| C[Button stays disabled]
  B -->|Yes| D[Call Analyze API]
  D --> E{Server validation OK?}
  E -->|No| F[Show error under inputs]
  E -->|Yes| G[Call AI]
  G --> H{AI or network OK?}
  H -->|429| I[Error message: rate limited]
  H -->|No valid object| J[Error message: shorten or clarify]
  H -->|Other 400 or 500| K[Error message from API]
  H -->|OK| L[Grade and show dashboard]
  I --> F
  J --> F
  K --> F
```

On error, the results pane shows the empty-state CTA again; the error string from the API (or a client fallback) appears under the input fields. There is no separate Cancel control during loading.

### 5.3 Two-step design (AI finds → app grades)

```mermaid
graph TD
  IN[Resume and job description] --> AI[AI extracts findings]
  AI --> Bool[App reconciles Boolean exact terms]
  Bool --> Grade[App grading engine]
  Grade --> C{Any hard knockout failed?}
  C -->|Yes| R[LIKELY_REJECTED]
  C -->|No| D{Warnings, diluting, or Boolean misses?}
  D -->|Yes| A[AT_RISK]
  D -->|No| P[PASS]
  R --> UI[Dashboard]
  A --> UI
  P --> UI
```

Boolean reconcile and the decision diamonds above are **server rules**, not choices made by the language model.

| Status | Meaning |
| --- | --- |
| **LIKELY_REJECTED** | At least one hard “must-have” failed |
| **AT_RISK** | No hard fails, but warnings, diluting sections, and/or Boolean misses |
| **PASS** | No hard fails, no warnings, no diluting sections, and every Boolean query would match |

**Why separate AI and grading?**

- AI is strong at reading and explaining text.
- Fixed rules make the final status consistent and easy to defend in reviews.

---

## 6. How the AI is supposed to behave

Most grounding rules are enforced by the **system prompt** and **output contract**. One exception is **recruiter Boolean coverage**: after the model returns queries, the server re-checks each required term against the resume with **exact** matching (so `TypeScript` does not match `TS` / `JS/TS`, and the reverse). Fix-it wording is still a prompt rule, not a post-hoc rewrite of every suggestion.

### Always (prompt / contract intent)

- Base answers on the pasted resume and job description
- Point to real evidence (or clear gaps)
- Keep suggestions grounded in what the candidate already wrote
- Treat Boolean terms as exact strings (prompt); the server re-verifies them

### Never (prompt / contract intent)

- Invent employers, tools, numbers, or experience that aren’t on the resume
- Invent a score like “87% match”
- Decide the final Pass / At Risk / Rejected label by itself
- Treat near-miss acronyms as Boolean hits (e.g. `TS` for `TypeScript`)

---

## 7. Fix-it suggestions

Each Fix-it has two parts in the data model:

1. **Advice** — short explanation of what to change and why  
2. **Suggestion (`draftText`)** — optional paste-ready text; set to **`null`** when the tip is advice-only (e.g. remove / collapse)

**UI behavior (implemented):**

- Renders a Fix-it block when the row qualifies (failed or warning knockout, or Diluting Vector) and advice is non-empty
- Shows a **Suggestions** box + **Copy** only when `draftText` is a non-empty string
- Under **Suggestions**, shows a short caveat: paste only if it matches work you have actually done
- **Copy** pastes the suggestion text, not the advice

**How the AI should write suggestions (prompt rules, not a separate app branch):**

```mermaid
graph TD
  Note[Prompt instructions only - not app code paths]
  Note --> F[Failed/warning knockout or Diluting Vector]
  F --> T{What kind of fix?}
  T -->|Keyword gap| K[Swap only that token; coach-style what/where/why]
  T -->|Warning near-miss| N[Invite exact JD term if uploader decides it fits]
  T -->|Needs reword, placement clear| W[Rewrite or add bullet under that title]
  T -->|Needs reword, placement unclear| U[Fix-it still; user chooses which experience]
  T -->|Nothing salvageable| R[Advice only, draftText null]
```

These branches describe **how the model is instructed to write Fix-its**, not separate code paths in the app.

### Keyword swaps (example: `TS` → `TypeScript`)

- Keep the original resume line
- Change **only** that word/acronym
- Do **not** rewrite the rest of the sentence
- Advice should sound like natural coaching (what/where/why), not a disclaimer template; the UI caveat covers “paste only if true”

### Bigger edits

- Still based on a real resume section (prefer skills line, bullet, or summary)
- Keep the same employer / role / facts
- Prefer JD-relevant language already on the resume
- Do **not** rewrite Title — Company headers by stuffing JD jargon into the title (e.g. avoid “Product Manager (0-1 Growth Initiatives) — Northstar Commerce”)
- If scope/domain wording belongs with a role and placement is clear, put it in a suggested bullet under that title (rewrite an existing bullet or draft a new one grounded in facts already evidenced for that role)
- Write advice as a helpful coach for the uploader: short, direct, concrete—no mid-sentence “e.g. …” hedges, no rigid “If you have…, add… to…” formula, no “leave it as is” endings
- Missing / near-miss skill example: “Spell out TypeScript on your Skills line—recruiters search the full word, not JS/TS.”
- Near-miss framing with a cue: “Your new checkout upsell module bullet is close to what they call 0-to-1. Check if 0-to-1 actually suits your experience, and if you decide that it does, rewrite it with that term and keep all the other facts the same.”
- Placement unclear: “Check which experience truly fits 0-to-1 for you; if one does, rewrite that bullet to include the term while keeping your facts.”
- Read resume text deeply for near-miss cues (“new product release” / “checkout upsell” ↔ “0-to-1”); the uploader decides applicability—never invent experience
- Suggest removal only when the section can’t be salvaged

---

## 8. Dashboard information architecture

After a successful run, layout is:

```mermaid
graph TB
  subgraph TopRow
    G[Gate classification]
    E[Executive diagnosis]
  end
  A[What the ATS Bot Parsed]
  subgraph Results
    TBAR[Tab bar]
    LIST[Scrollable results]
  end
  TopRow --> A
  A --> Results
  G --- E
  TBAR --> LIST
```

Also implemented:

- Non-zero gate metric tiles jump to the matching tab with a filter banner (Clear resets the filter).
- **Met knockouts** and **High Signal sections** stay collapsed by default.
- When the results list overflows, a “Scroll for more” cue can appear.

---

## 9. Privacy & trust

- Pasted text is sent for analysis to the AI provider
- There is **no** automatic “scrub personal info” step today
- Users should avoid pasting secrets or data they shouldn’t share
- The product is designed **not** to invent candidate achievements (via prompt/contract)
- API credentials stay on the server only

---

## 10. What this AI module is *not*

- Not a file/PDF uploader (text paste only)
- Not a guarantee of getting hired or passing every ATS
- Not a numeric ranking score
- Not a history of past analyses (no accounts / saved runs yet)
- Not a post-hoc validator that diffs every Fix-it suggestion against the resume byte-for-byte (Boolean exact-term reconcile is the exception)

---

## 11. Success criteria

Manual quality bar for reviewing AI runs (not automated checks in the app):

**Good run**

- Names the main reason the resume is at risk or rejected
- Lists real JD must-haves with clear pass / warn / fail
- Calls out diluting sections honestly
- Offers Fix-its a candidate could paste without inventing experience (including warning near-misses where the uploader must decide if a JD term fits)
- For simple keyword fixes, changes only the missing word
- Boolean Would Match / Filtered Out follows exact terms typed in the query (TypeScript ≠ TS)

**Bad run**

- Invents skills or metrics
- Shows a fake percentage score
- Suggests a rewrite that no longer matches the original resume facts
- Marks Boolean Would Match when only a near-miss acronym is on the resume

---

## 12. Related docs

- **README.md** — how to use the product and run it locally
- Implementation lives in the codebase (API route, schemas, grading logic, UI)
