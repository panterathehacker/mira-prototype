# Mira — Product Requirements & Technical Design Document

> A vibe-coded prototype for the Google AI Studio MTS take-home assignment.
> Author: David Amir Pantera
> Last updated: May 11, 2026

---

## Part 1 — Background & Context

### 1.1 The interview situation

The author (David) is interviewing for a **PM role on the Google AI Studio team**. This document is for the second-round take-home assignment, which follows a successful first-round conversation with the product lead.

In the first conversation, David pitched a strategic product bet called **AGY API** (described below). The lead liked it. The take-home is the next step.

### 1.2 What Google AI Studio is

Google AI Studio (aistudio.google.com) is the **browser-based developer playground for Gemini**. It is Google's developer-facing surface, sitting between the Gemini consumer app (for end users) and Vertex AI (for enterprise GCP deployments).

**As of mid-2026, AI Studio has evolved into three things in one product:**
1. A prompt sandbox for testing Gemini models
2. A vibe-coding environment ("Build mode") powered by the Antigravity coding agent, with built-in Firebase backend and one-click Cloud Run deployment
3. A gateway to the paid Gemini API for production use

**The Antigravity harness** is the agent runtime that wraps Gemini: tool-calling loop, sandboxed code execution, file management, planning logic, verified execution, multi-step memory. It is what turns a raw model into an agent that can do real work. Today it powers Build mode internally and runs the standalone Antigravity desktop IDE, but it is **not exposed to developers as an API**.

### 1.3 The strategic gap (the AGY API pitch)

The strategic problem David identified in the first conversation:

- The Gemini API today is **commoditized**. It is OpenAI-compatible by design, which means developers can swap Gemini for GPT in one line. Google competes on price per token, which is a losing game.
- Anthropic does not have this problem because **Claude is bundled with Claude Code's harness**. Enterprises buy the bundle, not the model. That bundle is defensible because it raises switching costs at the runtime layer, not the model layer.
- Google has no equivalent. AI Studio's Build mode uses the Antigravity harness internally, but developers who want to **embed a Google-powered agent inside their own product** have two bad options: build a harness on top of raw Gemini themselves, or leave for Claude's Agent SDK or OpenAI's Responses API.

**The proposed product: AGY API.** Ship the Antigravity harness itself as a stateful, hosted API surfaced through AI Studio. Developers call `agy.run(task)` and get back an agent with:

- **Sandboxed code execution** (Python and JS, persistent across calls)
- **Persistent sessions** with state, file system, and memory that survive across days/weeks/months
- **Tool registration** for MCP servers, custom functions, and external APIs
- **Background execution** triggered by external signals (webhooks, schedules), not just user prompts
- **Verified execution and observability** (the agent's reasoning trail is queryable)

**The three-layer strategic argument:**

1. **Lock-in.** Today Gemini is one-line swappable. AGY API moves the integration point from the model layer to the runtime layer. Developers wire their tools, state, and observability into Google's infrastructure. Switching to Anthropic stops being an API key change and becomes a multi-week re-architecture.
2. **Performance moat.** Gemini 3 and 3.1 were post-trained specifically against the Antigravity harness. Developers running Gemini through LangGraph or OpenAI Agents SDK get a generic experience. Developers on AGY API get the version of Gemini that was actually optimized in training.
3. **Closes the developer momentum gap.** Anthropic has Claude Code. OpenAI has Codex. Google has a chat playground and a desktop IDE. AGY API is Google's equivalent agent-platform play for developers who want to embed agents in their own products rather than live inside an IDE.

### 1.4 The take-home prompt

David is responding to **Option 3** of the take-home assignment:

> **Agents and continuity.** Currently, AI tools feel transactional: you get a one-shot app, and you leave. We must move from disposable interactions to an "enduring partnership." The product must feel like a partner that accumulates knowledge, visualizes its agentic reasoning, and proactively iterates on your behalf.
>
> Vibe code a prototype that moves beyond the standard "chat canvas." Show us an interface where a user manages an autonomous agent, visualizes its thinking/tool execution (e.g., searching the web, reading files), or interacts with a "Homescreen" of active, evolving projects. How does this UI build trust with the user, and how does this shift create a defensible moat for Google AI Studio?

The take-home evaluates **product taste, strategic intuition, and execution**. Specific taste criteria called out:

- Refusing AI slop (LLM-default outputs)
- Originality over mimicry
- Knowing when *not* to use AI (use buttons/sliders when AI would be worse)
- Restraint and curation (one problem solved beautifully > ten features done generically)
- Sweating microcopy and using realistic contextual data
- Self-aware critique of what's still clunky

### 1.5 How the prototype connects to the strategic bet

The prototype is an **end-user application** (per the brief). It is not a developer tool. It is a finished consumer/prosumer product that demonstrates what becomes possible when AGY API exists.

**The pitch arc the prototype enables:**

1. Demo the end-user product. It feels like a real, finished, opinionated consumer product.
2. Answer the strategic question (trust + moat).
3. Reveal: "This product cannot exist on today's Gemini API. Walk through the technical requirements. Each one is an AGY API primitive."
4. Generalize: one runtime, a thousand variants of this product across domains.
5. Three-layer strategic argument (lock-in, performance moat, momentum gap).

The prototype is the **proof**. The pitch is the **bet**.

### 1.6 The product: Mira

**Mira is an enduring-partnership agent for an early-stage consumer investor.** She watches her user's decisions, conversations, and writing over months. She accumulates a model of him. She does background work between sessions. She surfaces observations with judgment, including observations the user did not ask for.

**She is not:**
- A chatbot
- A deal flow feed
- A CRM
- A research tool with memory

**She is:**
- A junior partner who has been watching the user make decisions for a year
- A second brain that has opinions about the user's judgment
- A relationship, not a session

**The user we are demoing for:** an early-stage angel investor whose stated thesis is *"consumer apps in the age of AI."* His revealed thesis (which Mira has noticed) is narrower: *"products where AI deepens a personal ritual the user already has."* He has a portfolio that includes companies like Lore (fandom) and Cluely. He uses words like "wedge," "ritual," "worth pressing on," and "shipped pull."

This is intentionally close to the author's real-life situation (Stanford GSB MBA, a16z scout, angel investor) without being literal. The data is fake but tonally realistic.

### 1.7 Why Mira cannot exist on today's Gemini API (the technical justification)

Every behavior Mira exhibits maps to an AGY API primitive that does not exist in the current Gemini API:

| Mira behavior | Required runtime capability |
|---|---|
| Watches decisions over months | Persistent session state across an unbounded time horizon |
| Notices a founder she passed on six months ago got a customer | Background execution triggered by external signals, not user prompts |
| Reads notes, tweets, decks, calendar entries | Tool registration that persists across runs |
| Compiles reasoning trails users can audit | Verified execution with full traceability |
| Updates her model of the user when corrected | Mutable, queryable session memory |
| Generates draft notes, comparison artifacts | Sandboxed code execution |
| Calibrates her voice to mirror the user over time | Long-lived memory of writing samples |

This table is the spine of the pitch reveal. The prototype must visibly demonstrate each of these behaviors so the reveal lands.

---

## Part 2 — Build Phases (Milestones)

This section is a sequenced wrapper around the detailed component spec in Part 3. Each phase is a runnable, demoable milestone. Do not skip ahead.

### Phase 0: Project setup (target: ~45 min)

- Initialize Next.js 15 (App Router) + TypeScript + Tailwind project
- Install dependencies: `framer-motion`, `lucide-react` (for the one or two icons we allow ourselves), `@radix-ui/react-dialog` (for slide-in panel), `clsx`, `tailwind-merge`, `zustand`
- Set up Tailwind config with custom font families, accent color, and spacing tokens (see §3.2)
- Add `Source Serif 4` and `Inter` via `next/font/google`
- Create `/data/mockData.ts` (see §3.7) with all fake data
- Verify: `npm run dev` shows a blank styled page
- **Initialize Git repository:** `git init`, create a `.gitignore` that includes `node_modules/`, `.next/`, `.env*.local`
- **Create the GitHub repo:** Walk David through creating a new private repo on GitHub called `mira-prototype` (or similar). Set it up with the `gh` CLI if available, otherwise give him copy-paste instructions to create on github.com and link via `git remote add origin`.
- **First commit:** `git add . && git commit -m "Phase 0: Project setup"` and push to `main`
- **Create the documentation files** (see §3.0 below):
  - `BUILD_LOG.md` — running log of build sessions, one entry per session
  - `BUILD_SUMMARY.md` — placeholder for now; populated at the end of the build
  - `README.md` — minimal: project name, what it is, how to run locally

**Phase 0 done when:** the project runs locally with fonts loaded, the GitHub repo exists with one initial commit pushed, and the three doc files are in place.

### Phase 1: Static home screen (target: ~3 hours)

- Build the home screen layout: centered single column, max-width 720px
- Header: "Mira" on left (serif, pulsing), date on right (sans, muted)
- Sub-header: "Five things since Friday" (serif, italic, muted)
- Render all five cards as static components, fully populated from mock data
- Each card: title, body prose (serif), timestamp footer (sans, italic, muted), three button affordances (sans, text-only)
- Accent color used once per card on the single most important sentence
- No animations yet. No interactivity yet. Just typography, spacing, color.

**Phase 1 done when:** you can scroll the home screen, the five cards render correctly, the typography reads beautifully, and the visual hierarchy is correct.

### Phase 2: Animations & composition cadence (target: ~3 hours)

- Mira pulse animation in the header (subtle, continuous)
- Cards compose sentence-by-sentence on initial page load (slow, deliberate)
- Italicized phrases appear with a slight delay after their surrounding sentence
- Hover state on cards: 2px lift, faint shadow, reveal "What I almost said but cut" italic line at the bottom
- Single warm chime on the first card's first sentence appearing (use a soft sound, see §3.6)
- Buttons get a subtle hover state (underline grows from left)

**Phase 2 done when:** the home screen feels alive. The page load feels like Mira is composing in real time. Hovering cards feels like opening a private note.

### Phase 3: Push Back interaction (target: ~3 hours)

- Click "Push Back" on a card → input field slides up from the bottom
- As user types, sentences in the card they're contesting get a faint underline (heuristic: highlight the first claim sentence, or use keyword matching on the input)
- User submits → card re-renders with Mira's response inline, prefaced with "Updated:" in the accent color
- Mira's response is keyed to common Push Back inputs with a generic fallback (see §3.8)
- The push-back response should also briefly add a new line to the Journal's "What I'm still figuring out" section (state update)

**Phase 3 done when:** the user can disagree with Card 1, Mira updates, and the change persists.

### Phase 4: Mira's Journal (target: ~3 hours)

- Slide-in panel from right, 400ms eased transition (Framer Motion)
- Triggered by clicking the "Mira" word in the header (which opens the dropdown, see Phase 5) OR by a dedicated "Journal" button in the header
- Three sections: "How I see your thesis" (editable prose), "Your voice" (phrase grid with hover-to-source), "What I'm still figuring out" (self-directed questions with optional "weigh in")
- All content from mock data
- Editing thesis paragraph: inline contenteditable, with a "Updated. I'll factor this in." confirmation that appears briefly
- Hover on voice phrases: small tooltip with source citation
- "Weigh in" on Journal questions: small input field opens inline, accepts input, shows "Got it" confirmation

**Phase 4 done when:** the Journal opens, closes, and feels like Mira's private working notes that the user is being allowed to read.

### Phase 5: Mira variant dropdown (target: ~1 hour)

- Click "Mira" in the header → dropdown opens with six options (see §3.9)
- "Mira / Investments" is active (checkmark or weight differentiation)
- Other variants are visible but not clickable (subtly greyed)
- "+ build your own" at the bottom in muted sans
- Dropdown is purely demonstrative in the prototype. Clicking the others does nothing.

**Phase 5 done when:** the dropdown opens, shows the variants, and closes cleanly.

### Phase 6: Onboarding flow (target: ~3 hours)

- Route: `/onboarding`
- Screen 1: "Hey there, I'm Mira." centered, large serif. After 1.5s, the input prompt fades in below. Single textarea, "Continue →" button.
- Screen 2: Decision question, same layout pattern. Textarea, button.
- Screen 3: Loading state with pulsing Mira name (~6-8 seconds), then transitions to the partially-filled Journal in a centered card layout. Single "Let's start →" button at the bottom.
- Clicking "Let's start" routes to `/` (home screen)
- The home screen entry point on first load can be the onboarding, but a "skip to home" affordance should exist for demo replay (see §3.10)

**Phase 6 done when:** the full e2e onboarding → home screen flow works.

### Phase 7: Polish pass (target: ~3 hours)

- Tune all timings (animations, delays, fades) by feel
- Verify accent color usage: exactly one sentence per card, no more
- Verify typography: serif for Mira's voice, sans for chrome. No mixing.
- Verify no emojis, no avatars, no icons in cards, no gradients
- Run through the full demo flow three times. Fix anything that breaks the spell.
- Add a small `/reset` route or button (hidden in dev) to clear local state for demo replay

**Phase 7 done when:** you can walk through the demo three times in a row without flinching.

### Phase 8: Deploy & finalize documentation (target: ~1.5 hours)

**Step 1 — Final commit and push:**
- Ensure all work is committed and pushed to GitHub `main`

**Step 2 — Write `BUILD_SUMMARY.md`:**

This is the most important Phase 8 deliverable. Claude Code should generate this document after the build is done. It is the source-of-truth handoff for David to write the pitch script from.

The structure must be:

```markdown
# Build Summary

## What we built
[One-paragraph plain-English description of the final prototype, including which phases were completed]

## What changed from the PRD
[Bulleted list of every deviation from the PRD: features cut, features added, features modified, scope changes. Be specific. "Phase 3 (Push Back) — implemented the interaction but the keyword-highlight heuristic was simplified to highlight the first claim sentence only, since regex matching against card content was unreliable."]

## Taste choices made during the build
[Decisions that weren't fully specified in the PRD. For each one: what the choice was, what the alternatives were, why this one. Include both successful choices and ones that were tried and reverted. Examples might include: animation timings, exact accent color tuning, hover delay duration, font weight choices, microcopy tweaks.]

## What's still clunky
[Self-aware critique. List 3-7 specific things that aren't right yet, with an explanation of why. This is what David will use for the "self-aware critique" portion of the pitch.]

## What we'd build next
[2-4 features that were intentionally scoped out but would be the obvious next moves.]

## Vibe coding reflections
[For the pitch's "how we vibe coded this" section. What did Claude Code struggle with? What choices had to be forced (e.g., "the model kept defaulting to gradient backgrounds and emoji buttons, had to repeatedly enforce the anti-slop rules")? What was the AI good at? What was it bad at?]

## Demo replay instructions
[Specific keyboard shortcuts, URL paths, and steps for David to demo the prototype cleanly during the pitch video recording.]
```

**Step 3 — Final BUILD_LOG.md entry:**
- Add a final session entry summarizing the deployment session

**Step 4 — Deploy to Vercel:**

Claude Code should walk David through this step interactively, since some of it requires David's accounts and authentication:

1. Verify the project builds cleanly with `npm run build`. Fix any TypeScript or build errors.
2. Push final commit to GitHub
3. Install the Vercel CLI if not present: `npm i -g vercel`
4. Run `vercel login` (David authenticates with his Google or GitHub account)
5. From the project root, run `vercel` to deploy. Accept the defaults for a Next.js project.
6. After the first deploy, run `vercel --prod` to promote to a production URL
7. Alternative path: connect the GitHub repo directly in the Vercel dashboard (vercel.com/new) for auto-deploys on every push to main. This is the cleaner long-term setup.
8. Verify the deployed version matches local. Test the keyboard shortcuts on the deployed version.
9. Note the production URL. This is the link that goes in the submission.

**Step 5 — Set up custom domain (optional, only if time allows):**
- Vercel auto-generates a URL like `mira-prototype-davidpantera.vercel.app`. This is fine.
- If David wants a cleaner URL like `mira.davidpantera.com`, walk him through adding a custom domain in Vercel's dashboard. Skip if short on time.

**Step 6 — Tag the submission commit:**
- `git tag -a v1.0-submission -m "Final submission build"`
- `git push origin v1.0-submission`
- This gives David a stable reference point in case the lead asks to see "the exact version you submitted."

**Phase 8 done when:**
- BUILD_SUMMARY.md is committed to the repo, populated with every section above
- BUILD_LOG.md has a final entry
- Production deployment is live at a stable Vercel URL
- David has tested the deployed version end-to-end
- Submission commit is tagged in Git

---

## Part 3 — Component-by-Component Technical Spec

### 3.0 Documentation files and version control discipline

This prototype is being built as a take-home submission, which means the *process* of building it matters almost as much as the result. The take-home prompt explicitly asks the candidate to describe how they vibe coded it, what the AI struggled with, and what choices they had to force. To make those questions answerable later, three documentation files must be maintained throughout the build, and a strict commit discipline must be followed.

**The three documentation files:**

1. **`README.md`** — minimal. Project name, one-paragraph description, instructions to run locally (`npm install && npm run dev`), link to the live deployed URL once it exists.

2. **`BUILD_LOG.md`** — a running log, one entry per build session. Claude Code should append to this file at the end of every working session, before David ends the session or steps away. Each entry must include:

   ```markdown
   ## Session N — [date]
   **Worked on:** [phases/features attempted]
   **Built:** [what got shipped this session]
   **Stuck on / had to force:** [anywhere the AI struggled, defaulted to slop, ignored constraints, or required repeated correction]
   **Decisions made:** [any judgment calls not specified in the PRD]
   **Carrying forward:** [open threads for the next session]
   ```

   This log is what David will draw on to write the pitch's "how we vibe coded this" section. Be specific. "The model kept generating gradient backgrounds despite the anti-slop rules; had to add explicit `bg-paper` to every container" is useful. "Built the cards" is not.

3. **`BUILD_SUMMARY.md`** — placeholder during the build, fully written in Phase 8. Final format specified in Phase 8 above. Claude Code may stub the file during Phase 0 with just the section headers and a note that it will be filled in at the end.

**Commit discipline:**

- **Commit at the end of every session.** Even if the work is partial. Commit messages should reference the phase: `"Phase 2: cards composing sentence-by-sentence, chime still TODO"`.
- **Commit at the end of every phase.** Phase commits get a clean message like `"Phase 4 complete: Journal panel fully working"`. These are the rollback points if a later phase breaks something.
- **Push to GitHub at the end of every session.** Don't let local-only commits accumulate. The remote repo is the backup.
- **Never commit `node_modules/`, `.next/`, or `.env*.local`.** Verify the `.gitignore` is correct in Phase 0 and never touch it again.
- **No force-pushes to main.** If something is broken, fix forward.

**Why this matters:** David is going to write a pitch video at the end of this. The pitch needs concrete, specific examples of what the AI was good at, what it was bad at, and what taste choices got made along the way. Memory will fail. The logs will not. Claude Code should treat the documentation as a first-class deliverable, not a chore tacked on at the end.

### 3.1 Project structure

```
/                         # repo root
  README.md               # project intro + live URL
  BUILD_LOG.md            # session-by-session log
  BUILD_SUMMARY.md        # final handoff doc (written in Phase 8)
  MIRA_PRD.md             # this document
  .gitignore
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.js
/app
  /onboarding
    page.tsx              # /onboarding route
    components/
      Step1.tsx
      Step2.tsx
      Step3Reveal.tsx
  layout.tsx              # Root layout, fonts, providers
  page.tsx                # / route (home screen)
  globals.css             # Tailwind, custom CSS variables
/components
  /home
    Header.tsx            # "Mira" + date + variant dropdown
    SubHeader.tsx         # "Five things since Friday"
    CardColumn.tsx        # The 5-card column
    Card.tsx              # Single card component
    CardComposition.tsx   # Sentence-by-sentence reveal logic
    PushBack.tsx          # Push Back input + update flow
    AlmostSaid.tsx        # Hover-reveal "what I almost said but cut"
  /journal
    JournalPanel.tsx      # Slide-in panel container
    ThesisSection.tsx     # Editable prose
    VoiceSection.tsx      # Phrase grid + source tooltips
    FiguringOutSection.tsx # Self-directed questions
  /variants
    VariantDropdown.tsx
  /ui
    Button.tsx
    Tooltip.tsx
    [shadcn components as needed]
/data
  mockData.ts             # All fake data
  pushBackResponses.ts    # Push Back response map
/lib
  cn.ts                   # clsx + tailwind-merge utility
  store.ts                # Lightweight client state (Zustand or React context)
/public
  /sounds
    chime.mp3             # The single chime sound
```

### 3.2 Design tokens

In `tailwind.config.ts`:

```ts
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-source-serif)', 'serif'],
      sans: ['var(--font-inter)', 'sans-serif'],
    },
    colors: {
      ink: '#0A0A0A',              // body text
      paper: '#FAFAF8',            // background (slightly off-white, warmer than #FFFFFF)
      muted: {
        DEFAULT: '#6B6B68',        // timestamps, secondary text
        light: '#9C9C98',          // tertiary, "still figuring this out"
      },
      accent: {
        DEFAULT: '#C26B4A',        // desaturated terracotta
        hover: '#A85838',
      },
      hairline: '#E8E6E0',         // borders, dividers
    },
    spacing: {
      'col': '720px',              // max content width
    },
    fontSize: {
      // Mira's voice should feel substantial. Body type is bigger than typical web.
      'body': ['18px', { lineHeight: '1.55' }],
      'card-title': ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      'header-mira': ['32px', { lineHeight: '1', letterSpacing: '-0.02em' }],
      'subhead': ['16px', { lineHeight: '1.4' }],
      'meta': ['13px', { lineHeight: '1.4' }],
    },
  },
}
```

In `globals.css`, set the body background to `paper` and base text to `ink`. Default font is `serif`.

### 3.3 Header component

```tsx
// components/home/Header.tsx
```

**Layout:** flex row, space-between, padding `py-8 px-6`, max-width 720px centered.

**Left:** the word "Mira" in serif, size `header-mira`, weight 500. Clickable. Has a continuous pulse animation: opacity goes from 1.0 → 0.65 → 1.0 over 2.5s, infinite, eased. Use Framer Motion `animate` prop with `repeat: Infinity`.

**Right:** the current date, formatted as "Tuesday, May 11" (long weekday, abbreviated month + day, no year). Sans, size `meta`, color `muted`.

**Behavior:** clicking "Mira" toggles the variant dropdown (see §3.9).

### 3.4 Sub-header

Single line: *"Five things since Friday."*

Serif, italic, size `subhead`, color `muted.DEFAULT`. Centered under header. Margin-top `mt-1`, margin-bottom `mb-12`.

In the demo, this line is deliberately specific. "Since Friday" implies time has passed, work has accumulated, and there's a defined window.

### 3.5 Card component

```tsx
// components/home/Card.tsx
```

**Structure:**
```
<article>
  <h3>{title}</h3>                  // serif, card-title size
  <div className="body">
    {sentences.map(sentence => ...)}  // each sentence streams in
  </div>
  <p className="meta">{footer}</p>  // sans, italic, muted, meta size, "Tracking since March."
  <div className="actions">
    {buttons.map(button => ...)}    // sans, text-only buttons
  </div>
  {almostSaid && <AlmostSaid text={almostSaid.text} reason={almostSaid.reason} />}
</article>
```

**Visual:**
- Padding: `py-10`, no horizontal padding (lets text run full column width)
- Border-bottom: 1px solid `hairline`
- Last card has no border
- Hover state: card `translates-y -2px`, gains a soft shadow (subtle, like `0 4px 24px rgba(0,0,0,0.04)`), and the AlmostSaid line fades in at the bottom (200ms)

**Title (h3):**
- Format: "The Pattern", "The Loop", "The Drift", "The Portfolio Check-in", "The Deal"
- Note: each title is two or three words, definite article ("The"). This is a deliberate craft choice. Mira names each observation.
- Color: `ink`. Weight: 500. Spacing: `mb-4`.

**Body:**
- Serif, `body` size, color `ink`
- Each paragraph separated by `mb-4`
- Italicized phrases (quoted phrases, "version of you that..." etc.) use `<em>` and inherit color
- One sentence per card is wrapped in `<span className="text-accent">` for the accent color highlight. This is specified in mock data per card.

**Footer:**
- Sans, italic, `meta` size, color `muted.DEFAULT`
- Examples: *"Tracking since March."* / *"Drafted from your last 47 days of activity."* / *"Flagged because it triggered three of your stated heuristics simultaneously."*
- Spacing: `mt-6`

**Actions:**
- Three buttons max, text-only, sans, no borders, no background
- Format: `[Show me the reasoning]` (brackets are visual)
- Default color: `muted.DEFAULT`. Hover: `ink` with `underline-offset-4` and an animated underline (left-to-right)
- Spacing: `mt-4`, gap between buttons: `gap-6`
- One button per card is "Push Back" → triggers the Push Back interaction (see §3.8)

### 3.6 Sentence-by-sentence composition

This is one of the highest-craft elements. Get it right.

**Behavior:**
- On first page load, cards appear in sequence, top to bottom
- Within each card, sentences appear one at a time
- Italicized phrases within a sentence appear with an additional small delay, as if Mira is finding the word

**Timings (tune by feel in Phase 7):**
- 600ms gap between sentences within a card
- 1200ms gap between cards
- 200ms additional delay for italicized phrases
- First sentence of the first card triggers the chime sound (250ms after appearing, low volume ~30%)

**Implementation:**
```tsx
// components/home/CardComposition.tsx
// Take sentences as an array of { text: string, accent?: boolean, italicAfterMs?: number }
// Use Framer Motion's stagger or a custom hook with setTimeout
// Each sentence fades in (opacity 0 → 1) over 400ms
```

**Important:** if the user scrolls or navigates while composition is happening, complete all remaining sentences immediately. Don't make the user wait if they've moved on.

**Replay:** add a hidden keyboard shortcut (`cmd+r` or `r`) to reset and re-trigger the composition for demo replays.

### 3.7 Mock data

```ts
// data/mockData.ts

export const userProfile = {
  name: "David",
  thesis: "Consumer apps in the age of AI.",
  revealedThesis: "Products where AI deepens a personal ritual the user already has — journaling, taste-making, social signaling.",
  portfolio: ["Lore", "Cluely", "Cazz", "Wren AI", "Frame", "Topology"],
  voicePhrases: [
    { phrase: "worth pressing on", note: "flags skepticism", source: "from your Lore memo, March 12" },
    { phrase: "wedge", note: "preferred 3:1 over 'moat'", source: "across 47 deal notes" },
    { phrase: "the version of you that…", note: "recurring decision frame", source: "your Q1 review doc" },
    { phrase: "shipped pull", note: "shorthand for organic traction", source: "from your Cluely memo" },
    { phrase: "feels like a feature, not a company", note: "your most common pass reason", source: "across 11 passes this year" },
    { phrase: "ritual products", note: "category you've referenced 4× this month", source: "recent calls and Slack" },
  ],
};

export const cards = [
  {
    id: "pattern",
    title: "The Pattern",
    sentences: [
      { text: "You've passed on four consumer AI deals this quarter: Halo, Verse, Ember, and the one you saw Monday." },
      { text: "Each note in your CRM was a version of \"feels like a feature, not a company.\"" },
      { text: "Lore and Cluely looked like features at seed too." },
      { text: "You wrote about Lore that \"the behavioral data moat isn't visible yet but the founder is building toward it.\"" },
      { text: "The heuristic you're using on the new ones isn't the heuristic you used on the ones that worked.", accent: true },
      { text: "You're being more conservative this quarter than the version of you that made your best calls. Worth fixing before the next one comes in." },
    ],
    footer: "Tracking since March.",
    actions: ["Show me the reasoning", "Push back", "Snooze"],
    almostSaid: {
      text: "I think two of these passes were Bryan's call, not yours.",
      reason: "I don't have evidence, so I'm not making the claim in the main card.",
    },
  },
  {
    id: "loop",
    title: "The Loop",
    sentences: [
      { text: "Remember Sana at Resonance? You met her in November, passed because you didn't believe consumers would pay for AI-native journaling." },
      { text: "Resonance crossed $1M ARR at $4 ACV last week. 250K paying users in nine months." },
      { text: "Your \"consumers won't pay\" prior is wrong for ritual products.", accent: true },
      { text: "Update it before the next deal that triggers it, because two of the four passes I flagged in Card 1 probably failed against that same prior." },
    ],
    footer: "Surfaced because Resonance crossed a threshold I'd been watching.",
    actions: ["Draft a note to Sana", "Update my thesis", "Disagree"],
    almostSaid: {
      text: "She'll raise a Series A at $30M post within the next twelve months.",
      reason: "I'm 60% on this. Felt unfair to put in the main card.",
    },
  },
  {
    id: "drift",
    title: "The Drift",
    sentences: [
      { text: "You tell people your thesis is \"consumer apps in the age of AI.\"" },
      { text: "Your last twenty conversations and six checks tell a sharper story: products where AI deepens a personal ritual the user already has. Journaling, taste-making, social signaling." },
      { text: "Five of six checks fit. The sixth was Cazz, which was a founder bet, not a thesis bet, and you'd say that on a call if pressed." },
      { text: "Your stated thesis is too broad and it's costing you on inbound.", accent: true },
      { text: "Founders pitching real ritual products are framing themselves as productivity tools because that's what your bio implies you want. Let me draft a sharper intro line." },
    ],
    footer: "Drafted from your last 47 days of activity.",
    actions: ["Show the draft", "Not yet"],
    almostSaid: {
      text: "Your Twitter bio still says \"investing in the future of work,\" which is at least two theses old.",
      reason: "Felt nitpicky. Mentioning it here in case it changes the priority.",
    },
  },
  {
    id: "portfolio",
    title: "The Portfolio Check-in",
    sentences: [
      { text: "Lore hired Sasha Demers as Head of Growth." },
      { text: "She was #3 PM on Substack reader-side and ran the 2024 recommendation algo rebuild." },
      { text: "This is the hire Zehra promised you when she said \"I'll bring on a real growth lead before Q4.\" Nine weeks ahead of that timeline.", accent: true },
      { text: "Zehra also tweeted Thursday that they hit profitability in October. She didn't mention this on your last call, which is either modesty or she's holding it for the next raise. Either way, check-in note is overdue." },
    ],
    footer: "Pulled from LinkedIn, Twitter, and your call notes.",
    actions: ["Draft check-in", "Skip"],
    almostSaid: null,
  },
  {
    id: "deal",
    title: "The Deal",
    sentences: [
      { text: "Priya Mehta (ex-Pinterest, ex-Poolsuite) is raising $2M for Salt, a taste journal." },
      { text: "Log what you watched, ate, wore, read; AI builds a private map of your taste; share specific slices with friends (\"here's the version of me that's a movie person\")." },
      { text: "This is the version of you that wrote the Lore check, not the version that passed on Modal.", accent: true },
      { text: "Same behavioral data moat thesis, same wedge." },
      { text: "Two reasons to look: she shipped something close to this at Poolsuite in 2022 and it had real organic pull, and the unbundling angle is real because taste data is leaving Instagram and has nowhere new to live." },
      { text: "Two reasons to push: it could be a feature inside Letterboxd or Beli, and she hasn't talked publicly about a moat thesis, which on a $15M post is the first question to ask." },
      { text: "Take the meeting. It's a 30-minute call and the downside is you learn something about a wedge you already believe in." },
    ],
    footer: "Flagged because it triggered three of your stated heuristics simultaneously, which has happened twice before in your history. Both times you wrote the check.",
    actions: ["Set up 30 min", "Tell me more", "Pass"],
    almostSaid: {
      text: "Priya's co-founder, who isn't on the deck, was the actual product lead at Poolsuite.",
      reason: "I haven't verified this and it would be a big claim to make without verification.",
    },
  },
];

export const journal = {
  thesis: "David is building a portfolio around a narrower thesis than he describes publicly. His real bet is on products that deepen a pre-existing ritual the user already practices — journaling, taste-making, sharing — using AI to make the user more themselves, not more efficient. He's skeptical of pure efficiency plays and consistently passes on them, even when the numbers look good. He's drawn to founders who can articulate a behavioral wedge, even if the moat isn't visible yet.",
  voicePhrases: userProfile.voicePhrases,
  figuringOut: [
    {
      text: "Whether the B2B gap is an active choice or a sourcing issue. He's referenced enterprise twice on calls but every check this year has been consumer.",
    },
    {
      text: "Why he uses \"ritual\" and \"wedge\" interchangeably sometimes but not others. There's a distinction in there I'm missing.",
    },
    {
      text: "Whether his pass on Verse was a thesis pass or a founder pass. The note says thesis but the language is uncharacteristically curt.",
    },
  ],
};

export const variants = [
  { id: "investments", label: "Mira / Investments", active: true },
  { id: "product", label: "Mira / Product", active: false },
  { id: "founder", label: "Mira / Founder", active: false },
  { id: "editorial", label: "Mira / Editorial", active: false },
  { id: "research", label: "Mira / Research", active: false },
];
```

### 3.8 Push Back interaction

**Behavior:**
1. User clicks "Push back" or "Disagree" on a card
2. An input field slides up from below the card's actions row (250ms ease-out)
3. Placeholder text: *"Tell me where I'm wrong."*
4. As the user types, sentences in the card body get a faint left-border underline animation (use a simple keyword-match heuristic: highlight the first claim sentence by default; if input contains specific portfolio company names or thesis terms, highlight matching sentences)
5. User presses Enter or clicks "Send"
6. The input collapses and a new block appears at the bottom of the card body, prefixed with `Updated:` in the accent color, followed by Mira's response in serif body text.
7. The Journal's "What I'm still figuring out" section gets a new entry appended.

**Response map (`/data/pushBackResponses.ts`):**

```ts
export const pushBackResponses: { match: RegExp | string, response: string }[] = [
  {
    match: /bryan|team|sourc/i,
    response: "Fair. If two of those were Bryan's calls, the pattern is half as strong as I made it sound. I'll adjust the threshold for flagging this kind of drift in the future.",
  },
  {
    match: /context|wrong|didn't know/i,
    response: "Noted. I was reading the CRM notes literally. If there's context I'm missing on those passes, tell me which ones and I'll mark them as exceptions to the pattern.",
  },
  {
    match: /timing|market/i,
    response: "That's a different read than mine. I was framing it as a heuristic drift, you're framing it as a timing call. I'll add the timing dimension to my model and re-evaluate.",
  },
  {
    match: /.*/,  // fallback
    response: "Okay. I'm updating my model. If you want to give me more context I'll incorporate it.",
  },
];
```

The fallback ensures every input gets a graceful response, even ones we didn't anticipate.

### 3.9 Mira variant dropdown

**Trigger:** clicking the "Mira" word in the header.

**Visual:** small dropdown panel, white background, hairline border, subtle shadow, opens directly below the "Mira" header. Width ~240px. Padding `py-2`.

**Content:** five rows + one footer row.

```
Mira / Investments      ✓
Mira / Product
Mira / Founder
Mira / Editorial
Mira / Research
─────────────────
+ build your own
```

**Styling:**
- "Investments" row: bold, accent checkmark
- Other rows: muted, not clickable (cursor: default)
- "+ build your own": sans, muted, italic, separated by a hairline border
- Hover on active row: subtle background `paper` to slight grey

**Behavior:** purely demonstrative. Clicking other rows does nothing (or a console.log). The dropdown closes on outside click.

### 3.10 Mira's Journal

**Container:** slide-in panel from the right.

**Trigger:** a small "Journal" link in the header (sans, meta size, muted, to the right of the date). Clicking opens the panel.

**Dimensions:**
- Width: 480px on desktop
- Full height
- Slide animation: 400ms ease-out from x: 100% to x: 0
- Backdrop: semi-transparent dark overlay (`bg-ink/20`), clickable to close

**Structure:**
```
─────────────────────────────────
Mira's Journal                  ✕
─────────────────────────────────

How I see your thesis
[paragraph, editable on click]

─────────────────────────────────

Your voice
[grid of phrase tags]

─────────────────────────────────

What I'm still figuring out
[3 self-directed questions, each with "weigh in" affordance]

─────────────────────────────────
```

**Header:** "Mira's Journal" in serif, weight 500. Close button (×) top right.

**Section 1 — Thesis:**
- Section title in sans, meta size, uppercase letter-spacing wider, color muted
- Body: serif, body size, color ink
- Hover: cursor changes to text, subtle background `paper` highlight
- Click: becomes a `contenteditable` div with a subtle ring
- On blur: shows "Updated. I'll factor this in." in accent color for 2 seconds, then disappears
- Edit persists in local state for the session

**Section 2 — Voice:**
- Section title (same style as above)
- A flex-wrap grid of phrase tags
- Each tag: serif italic, body size, padding `px-3 py-1.5`, border `1px solid hairline`, rounded `rounded-full`
- Hover: tooltip appears showing the source citation (sans, meta size)
- Use `@radix-ui/react-tooltip` for accessibility

**Section 3 — What I'm still figuring out:**
- Section title (same style)
- Each question: serif italic, body size, indented with a small em-dash prefix
- Below each question, a small "weigh in" link in sans, meta size, color muted
- Clicking "weigh in" opens a small input field directly below the question
- On submit: replaces the input with "Got it. I'll factor this in." in accent color

### 3.11 Onboarding

**Route:** `/onboarding`

**Visual approach:** Apple-style. One question at a time. Each screen is the entire viewport, centered content, no chrome.

**Screen 1:**
```
[Empty viewport]

  Hey there, I'm Mira.

  [appears after 1.5s, fade-in]
  Before we work together, I want to learn how you think.

  Paste a memo, deal note, or essay you've written in the last year.
  Anything will do, as long as it's yours.

  [large textarea, ~600px wide, 240px tall, serif body, ink color]

  Continue →
```

The "Continue →" button is sans, ink color, hover state shows underline. Disabled when textarea is empty.

**Screen 2:**
```
  One more.

  What's a decision from the last year you're still thinking about?
  Win or loss, doesn't matter. A sentence is fine; a paragraph is better.

  [large textarea]

  Continue →
```

**Screen 3 (loading):**
```
  Got it. Give me a few seconds.

  [pulse animation on a placeholder dot or on the word "Mira" itself, 6-8 seconds]
```

After the timer, transition to:

**Screen 3 (reveal):**
```
  Here's what I've got so far. I'll keep working on it as we go.

  [Show a slimmer version of the Journal's three sections,
   pre-populated from mock data, NOT editable in this view]

  Let's start →
```

Clicking "Let's start" navigates to `/`.

**Important:** in production we'd actually parse the user's inputs. For the prototype, the reveal is the same regardless of input. That's fine. The point is taste, not LLM accuracy.

### 3.12 State management

Use Zustand for simple global state. Single store:

```ts
// lib/store.ts
import { create } from 'zustand';

interface AppState {
  cards: Card[];
  journal: Journal;
  variantDropdownOpen: boolean;
  journalOpen: boolean;
  pushBackActive: string | null;  // card id if active
  hasPlayedChime: boolean;

  updateCardWithPushBack: (cardId: string, response: string) => void;
  addJournalQuestion: (question: string) => void;
  updateJournalThesis: (newThesis: string) => void;
  // ...
}
```

Persist nothing to localStorage. Refreshing the page resets state. This is intentional for demo replays.

### 3.13 Sound

One sound file: `/public/sounds/chime.mp3`.

- Pick a warm, soft, non-electronic tone (felt mallet, soft wood, single piano note around C5)
- Suggested: download a free CC0 sound from Freesound.org. Search for "soft chime" or "wood mallet."
- Volume: 30%
- Plays exactly once per page load, 250ms after the first sentence of Card 1 appears
- Implementation: standard `Audio` API, with a `useEffect` that fires once on mount and a state flag in the store to prevent re-plays on hot reload

### 3.14 Hover behavior: "What I almost said but cut"

**Trigger:** hovering over any card with an `almostSaid` field in the data.

**Visual:**
- After 600ms hover delay (so it doesn't trigger on accidental brushes), a new block fades in at the bottom of the card body, above the actions
- Block has a small italic prefix: *"What I almost said but cut:"* in sans, meta size, color muted
- Followed by the `almostSaid.text` in serif body
- Followed by a smaller line: *"({reason})"* in sans, meta size, color muted

**Implementation:** Framer Motion `AnimatePresence` with opacity + small y-translate transition.

### 3.15 Replay affordances for demo

The lead will probably watch the demo more than once and may want to see specific moments. Build these affordances now:

- **Keyboard shortcut `R`** while on `/`: resets all state, re-triggers card composition with sentence-by-sentence reveal, replays chime
- **Keyboard shortcut `O`** anywhere: navigates to `/onboarding`
- **Keyboard shortcut `J`** while on `/`: toggles the Journal open/closed
- **Keyboard shortcut `V`** while on `/`: toggles the variant dropdown

None of these are visible in the UI. They are demo-author shortcuts.

---

## Part 4 — Taste & Anti-Slop Rules

These are not negotiable. They are the spine of the submission.

### 4.1 What's in

- Serif typeface for Mira's voice (Source Serif 4)
- Sans for system chrome (Inter)
- White/cream background, black text, one terracotta accent
- Single warm chime, played once, ever
- Sentence-by-sentence composition with italics that pause
- Subtle pulse on the word "Mira" in the header
- Hover-revealed "What I almost said but cut" with reasoning
- The Journal as Mira's working notes, slide-in from right
- Self-directed questions ("What I'm still figuring out") rather than direct user prompts
- Realistic, specific, fake data (real company names from the user's "portfolio," real-feeling founder names, real-feeling metrics)

### 4.2 What's out (explicit)

- No emojis, anywhere
- No avatars or character illustrations for Mira
- No icons inside cards (we'll use one or two icons in the Journal section dividers if needed, max)
- No gradients, no glassmorphism, no neumorphism
- No streaks, badges, notifications counts, gamification
- No "Mira is thinking..." spinners
- No chat bubbles
- No "AI" branding anywhere visible (the word "AI" should not appear in the UI)
- No "powered by Gemini" or any model attribution
- No tooltips that explain what the buttons do (the copy itself is the explanation)
- No settings page
- No dark mode toggle in the prototype (we can add it as a stretch goal, but not as a feature)
- No voice interface
- No "Mira" as a chat assistant the user can type to freely (Push Back is the only input, and it's scoped)

### 4.3 Copy rules

- No hedges from Mira ("I think," "I'm not sure," "maybe," "perhaps")
- No flattery from Mira ("Great question," "That's interesting")
- No closing pleasantries from Mira ("Let me know if I can help")
- Short sentences. Mira composes like someone who has been edited.
- Specific numbers and names always. Never "a few" or "some." Always "four" and "Halo, Verse, Ember."
- Mira uses contractions sparingly. "She's" yes; "I'm" yes; "It's" yes. But "do not" rather than "don't" when she's being serious.

---

## Part 5 — Open Questions for the Builder

These are flagged for Claude Code to either resolve or surface to David during the build:

1. **Sound file:** the spec calls for `/public/sounds/chime.mp3` but the file doesn't exist yet. Claude Code should flag this and David will source one separately before deployment.

2. **Animation timing:** all timings are starting points. Plan to tune in Phase 7 by feel. If anything feels rushed or sluggish during the demo run-through, adjust by 100-200ms.

3. **Push Back input keyword highlighting:** the heuristic is simple. If you can implement it cleanly with a regex match against card sentence content, great. If it's getting complex, just highlight the first claim sentence on any input and call it good. Don't over-engineer.

4. **Font loading:** use `next/font/google` for Source Serif 4 and Inter. Set `display: swap` to prevent FOIT. The serif should be available with weights 400 and 500. Inter with 400 and 500.

5. **Edge case — onboarding skip:** include a small "skip" link in the bottom-right of the onboarding screens (sans, muted, meta size) so David can bypass the flow during demo prep.

---

## Part 6 — Submission Checklist

Before considering this done:

**Product:**
- [ ] All five cards render with correct typography and accent placement
- [ ] Sentence-by-sentence composition feels deliberate, not jittery
- [ ] Chime plays exactly once per session, at the right moment
- [ ] Hovering each card with an `almostSaid` reveals the "What I almost said but cut" block with reasoning
- [ ] Push Back on Card 1 works end-to-end, including the Journal update
- [ ] The Journal slides in cleanly and contains all three sections
- [ ] Thesis paragraph is editable inline
- [ ] Voice phrases show source on hover
- [ ] "What I'm still figuring out" questions allow optional weigh-in
- [ ] Variant dropdown opens on header click, shows six options, closes on outside click
- [ ] Onboarding flow works from `/onboarding`, two questions, then reveal
- [ ] Keyboard shortcuts (R, O, J, V) work for demo replay
- [ ] No emojis, no avatars, no icons in cards (verify by eyeballing the whole app)
- [ ] All copy follows the rules in §4.3

**Repo and documentation:**
- [ ] GitHub repo exists with all work committed and pushed to `main`
- [ ] `BUILD_LOG.md` has an entry for every working session
- [ ] `BUILD_SUMMARY.md` is fully populated with all sections specified in Phase 8
- [ ] `README.md` includes the live URL and run instructions
- [ ] Submission commit is tagged `v1.0-submission`

**Deployment:**
- [ ] Deployed to Vercel with a working production URL
- [ ] Live URL added to `README.md`
- [ ] Tested in Chrome on a 1440p display (the resolution the lead will likely use)
- [ ] All keyboard shortcuts verified to work on the deployed version
- [ ] No console errors on the deployed version

---

End of document.
