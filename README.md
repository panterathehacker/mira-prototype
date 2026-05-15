# Mira

Early-stage investing is fundamentally a judgment game. But judgment degrades when it's exercised in isolation — when you're moving fast across dozens of signals, your heuristics drift without you noticing. You start passing on companies for reasons that don't actually match what worked. You let portfolio relationships go quiet. Your stated thesis stops matching your revealed thesis. No one tells you, because no one is watching closely enough.

Mira is the partner who is watching.

She's an enduring-partnership agent for early-stage investors. Not a chat interface. Not a CRM. Not a research tool with memory bolted on. A persistent agent that accumulates a model of how you think — from your deal notes, your writing, your calls, your decisions — and surfaces observations you didn't know you needed.

---

## What Mira does

**She watches your judgment, not just your activity.**
Every pass, every check, every note goes into her model. She notices when the heuristic you're using today doesn't match the heuristic that made your best calls. She names the drift before it costs you a deal.

**She works between sessions.**
Mira doesn't wait to be asked. She monitors portfolio signals, founder social activity, and market events in the background. When something crosses a threshold that matters to you — a company you passed on hitting a milestone, a founder you backed making a key hire — it's waiting for you when you open the app.

**She knows your voice.**
Over time, Mira maps the language you actually use: the phrases you reach for under conviction, the words that signal skepticism, the framing you use when you're excited versus cautious. She uses this to calibrate how she talks to you, and to notice when your language about a deal doesn't match your language about your best calls.

**She keeps a journal.**
Everything Mira has figured out about you — your revealed thesis, your voice, the questions she's still working through — lives in a private journal you can read and edit. It's her working notes on you. The more you push back and correct her, the sharper it gets.

**She surfaces the thing she almost said.**
Every card Mira surfaces has a shadow version: the observation that was too speculative, the claim she couldn't back up, the thing she thought but wasn't sure enough to put in the main feed. It's there if you want it.

---

## The interface

**Home screen** — Five observations, composed sentence by sentence as you arrive. Each one is a named take: a pattern Mira noticed, a loop she's tracking, a drift she wants to flag, a portfolio signal, a deal worth 30 minutes. Actions on each card are real: draft a note, update your thesis, set up a meeting.

**Push Back** — Disagree with something Mira surfaced. She'll update her model inline and log the tension in her journal as something she's still figuring out.

**The Journal** — A slide-in panel showing Mira's private working notes: how she reads your thesis, the language patterns she's catalogued, the questions she can't resolve yet. Everything is editable. Correcting her is how she gets better.

**Variant switching** — Mira is built for investors, but the same architecture applies to co-founders, researchers, and engineers. The persona shapes what she watches and what she surfaces.

---

## Onboarding

Mira starts by reading how you think. Paste something you've written — a deal memo, an essay, a reflection. Answer one question about a decision you're still thinking about. Connect the data sources she'll watch. She builds an initial model and shows you what she has before you start.

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the home screen, or [http://localhost:3000/onboarding](http://localhost:3000/onboarding) to start from the beginning.

**Demo keyboard shortcuts** (for replaying the experience):

| Key | Action |
|-----|--------|
| `R` | Reset — clears all state and replays the card composition from the beginning |
| `J` | Toggle the Journal panel |
| `V` | Toggle the variant dropdown |
| `O` | Navigate to onboarding |

---

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand · Source Serif 4 · Inter

---

## Live URL

_To be added after deployment._
