# Build Summary

## What we built

Mira is a fully functional browser-based prototype of an enduring-partnership agent for early-stage investors, built in Next.js 16 (App Router) with TypeScript, Tailwind CSS v4, Framer Motion, and Zustand. All eight phases from the PRD were completed across six build sessions. The prototype includes: a full onboarding flow (writing sample upload, decision question, data-source connection, AI analysis loading state, and journal reveal); a home screen with five AI-authored observation cards that compose sentence-by-sentence on load; a Push Back interaction that lets the user contest Mira's reasoning and receive an inline response; a slide-in Journal panel with an editable thesis, voice phrase chips with sourced tooltips, and weigh-in affordances on open questions; a variant switcher showing Mira configured for four personas (Investor, Co-founder, Researcher, Engineer); and a full set of keyboard shortcuts for demo replay. The app is deployed to Vercel at https://mira-prototype-ten.vercel.app with the GitHub repo connected for auto-deploy.

---

## What changed from the PRD

**Card titles — modified significantly**
PRD specified short named takes: "The Pattern", "The Loop", "The Drift", "The Portfolio Check-in", "The Deal." Changed to full-sentence opinionated claims in first person: "I think your pass filter has drifted from what actually worked." This conflicts with §4.3's no-hedges rule (which prohibits "I think" from Mira), but David explicitly wanted the titles to feel like opinions rather than labels. The body copy still follows §4.3.

**AlmostSaid — trigger changed from hover to click**
PRD §3.14 specified a 600ms hover delay revealing the "What I almost said but cut" block. Changed to an explicit "What I almost said" toggle button below each card's actions. Hover was triggering accidentally during reading; the click/toggle is more intentional and also works on mobile.

**Action buttons — visual style changed**
PRD specified text-only buttons with no borders and no background, formatted with brackets: `[Show me the reasoning]`. Changed to soft warm-fill pills (`bg-[#EDEAE4]`) matching the onboarding button style. Brackets removed. The filled style communicates interactivity more clearly without relying on underline animations.

**SubHeader copy — changed**
PRD specified "Five things since Friday." Changed to "Here's what I caught while you were heads-down." The original felt like a feed counter; the new line implies Mira was active while the user was away.

**Background color — iterated away from PRD default**
PRD specified paper (`#FAFAF8`) as the body background. We tried four backgrounds across sessions: cream, warm parchment `#EAE3D0`, slate-blue `#C2CBDA`, then back to warm parchment. Final: `#EAE3D0`. The blue-grey created good card contrast but felt too cool; parchment is warmer and feels more like a personal document.

**Accent color — changed**
PRD specified desaturated terracotta `#C26B4A`. Changed through two iterations: amber-gold `#8B6914` (terracotta read too Claude-like), then slate blue `#5C7A9E` (final). The blue-grey accent pairs well with parchment and is more restrained.

**Onboarding — connect step added (not in PRD)**
Added a fourth onboarding screen between Q2 and the loading state: a data-source connection step (Google, AngelList, LinkedIn, X) with toggle affordances. This addresses the cold-start credibility question — if Mira knows your emails and portfolio from day one, the user needs to understand why.

**Journal panel — editing features more detailed than PRD spec**
PRD described editing in broad strokes. Implemented: `contentEditable` paragraph with Enter-to-confirm (not newline), Escape-to-cancel, "Click to edit" hint that disappears while focused, body-size confirmation message in accent color. Voice phrase chips show note as label and `"phrase" — source` on hover (not just source). Weigh-in responses persist inline below each question with an Update affordance rather than a disappearing toast.

**Variant dropdown — content changed**
PRD specified "Mira / Investments", "Mira / Product", etc. Changed to persona-based labels: Investor, Co-founder, Researcher, Engineer — each with a one-line description of what Mira watches for that persona. "+ build your own" routes to onboarding.

**Routing — `/` redirects to `/onboarding`, home screen at `/home`**
PRD assumed `/` was the home screen with a skip affordance. Changed so the root URL is the correct entry point for demos and the home screen lives at `/home`. This avoids the awkward experience of landing mid-session on the home screen.

**Tailwind CSS v3 → v4**
PRD assumed Tailwind v3 with `tailwind.config.ts`. The scaffold installed v4, which uses `@theme {}` in `globals.css` instead of a config file. All design tokens were adapted to the v4 CSS-first API. No functional impact.

---

## Taste choices made during the build

**Sentence-by-sentence composition with scroll-to-reveal**
The PRD specified sentence-by-sentence reveal but didn't specify what happens when the user scrolls. We added a one-time scroll/touch listener that immediately reveals all remaining sentences. This prevents the experience from feeling like a loading gate if the user wants to read ahead. The chime still plays on the first sentence of the first card regardless.

**Card shadow only on hover**
Cards sit nearly flat against the parchment background at rest (1px shadow at 6% opacity). On hover they lift with a dramatically larger shadow (40px blur, 10% opacity). This makes the hover feel like physically picking up a card rather than a standard UI hover state. Tried: always-visible shadow (looked like a SaaS dashboard), accent-colored shadow (too blue against parchment).

**`rounded-sm` instead of `rounded-md`**
Went through three values. `rounded-xl` felt like a mobile app. `rounded-md` felt like a SaaS dashboard. `rounded-sm` (2px) is barely perceptible — the card reads as a rectangle, not a pill. This alone materially shifted the feel from "app" to "document."

**Mira nameplate at 2.75rem**
Started at 2rem (32px). The word "Mira" is the only persistent brand element and it was too small — it read as a nav logo, not a name. 2.75rem (44px) makes it feel more like a signature or a nameplate. Combined with the opacity pulse animation, it reads as a living identity rather than a header.

**"What I almost said" as a toggle, not a hover**
Hover reveals feel accidental on a reading surface. Cards are text-dense; users brush hover states while reading. The toggle button creates intentionality — you choose to open the shadow version of Mira's observation. It also works on touch devices, which hover does not.

**Copy rules enforced throughout except card titles**
§4.3 prohibits hedges ("I think", "maybe", "probably") from Mira. This was maintained in all body copy, journal content, action responses, and onboarding copy. Card titles deliberately break this rule because the titles are framed as Mira's opinions about the user, and opinion-framing requires hedging. This was a conscious, directed deviation.

**Voice chip design: three passes**
First pass: phrase as chip label, phrase in tooltip (tooltip repeated what was already visible). Second pass: note as chip, source in tooltip (source felt too factual). Third pass: note as chip, `"phrase" — source` in tooltip (e.g., hovering "preferred 3:1 over 'moat'" reveals `"wedge" — across 47 deal notes`). The third version gives you three layers of information across a two-state interaction.

**Loading screen: three lines decreasing in size**
The PRD described a loading state with a pulsing element. Instead: three lines of copy at progressively smaller sizes, each fading in on a stagger. The copy itself does the work: "Hey there, I'm Mira." → "Before we work together, I want to learn how you think." → "Paste something you've written for work lately." This turns the loading state into Mira's introduction rather than a spinner.

**Weigh-in: persistent response, not a toast**
When a user weighs in on a "What I'm still figuring out" question, their response persists inline below the question behind a hairline left border (the same visual language as the push-back response on cards). No disappearing confirmation. The design principle: if Mira heard you, it should look like she heard you.

---

## What's still clunky

**The chime doesn't always play.** Browsers block autoplay audio without a prior user gesture. On fresh page load the chime sometimes fires correctly; sometimes it silently fails. The fix is to trigger audio on first user interaction (click or keypress), not on first sentence render. This would require a small architectural change to the audio initialization.

**Push Back is only wired on Card 1.** The "Push Back" and "Disagree" buttons work on every card, but the response map in `pushBackResponses.ts` was written specifically for Card 1's claims (pass filter drift, Bryan's call, timing). Cards 2–5 receive the generic fallback response ("Okay. I'm updating my model."), which is functional but not tailored.

**The journal thesis doesn't survive a page reload.** Intentional by design (no localStorage, demo replay), but if you edit the thesis, open the journal, close it, and hit R, the edit is gone. First-time viewers won't notice, but anyone who interacts and then resets will lose their changes.

**The variant dropdown is purely decorative.** Clicking Investor (active), Co-founder, Researcher, or Engineer does nothing. The other personas are at 40% opacity to signal they're inactive, but there's no explanation for why. In a real product, selecting a persona would repopulate the home screen cards.

**Mobile is untested.** The layout was built and tested on desktop (1440p Chrome). The sentence-by-sentence timing and hover interactions are likely broken on touch. The Journal panel at 440px is fine on larger screens but would overflow on small phones.

**The "connect" toggles in onboarding don't gate the loading state.** You can connect zero sources and still proceed. In a real product, at least one source would be required. For the prototype it's cosmetic.

---

## What we'd build next

**Real persona switching.** Selecting a variant from the dropdown should repopulate the home screen with a different set of cards appropriate to that persona. The architecture already supports this — mockData could export separate card sets per persona, and the store could hold an `activeVariant` that CardColumn reads from. This is the single highest-leverage demo enhancement.

**Persistent session memory.** The current prototype resets on every page load by design. A real Mira would persist the journal thesis edits, weigh-in responses, and push-back history across sessions. The Zustand store already models this state — it just needs to be written to a backend or encrypted localStorage between sessions.

**Keyword highlighting in Push Back.** The PRD specified that as you type a push-back, the sentences you're contesting get a faint highlight. This was simplified to a static underline on the first claim sentence. A proper implementation would regex-match the input against card sentence content and highlight relevant sentences dynamically.

**Mobile layout.** The Journal panel, card padding, and type scale all need responsive treatment. The core reading experience would translate well to mobile — the sentence-by-sentence reveal is actually more compelling on a phone — but it would require a full responsive pass.

---

## Vibe coding reflections

**Claude Code was excellent at:** scaffolding and architecture decisions, TypeScript interfaces, Framer Motion animation logic, Zustand store design, sequential timing logic (the `computeStartDelay` function for staggered card composition), and content writing — all five card bodies, the journal copy, push-back responses, and onboarding copy were written by Claude Code with minimal iteration.

**Claude Code needed repeated forcing on:** the anti-slop rules. Without explicit reminders, it defaulted to gradient backgrounds, rounded-xl card corners, emoji-adjacent visual cues, and hedging language in card copy. The background color was corrected four times across sessions. Border styles defaulted to boxy outlines before settling on soft warm-fill. The model has a strong prior toward "friendly SaaS" aesthetics that runs directly against what Mira should feel like.

**The most valuable constraint:** writing everything in second person, no em-dashes, no hedges in body copy, no AI branding visible. These rules had to be stated once per session to stay enforced. They're also exactly the rules that made the copy feel considered rather than generated.

**The design iteration that required the most human judgment:** the background color. Claude Code consistently reached for either a dark neutral or a pure white. The warm parchment (`#EAE3D0`) was David's direction, not the model's instinct. Similarly, card titles as opinionated first-person observations ("I think your pass filter has drifted...") required explicit direction — the model's default was shorter, label-style titles.

**What the AI was surprisingly good at:** the Journal panel. The contentEditable thesis interaction, the three-state weigh-in flow, and the voice chip tooltip design were all built in one pass with minimal revision. Complex interaction patterns with multiple state transitions are where Claude Code's output quality is highest.

**The hardest bug:** keyboard shortcuts firing inside the thesis contentEditable. The fix was one line (`t.isContentEditable`), but it required identifying that `HTMLParagraphElement` doesn't match the `instanceof HTMLInputElement` check that the guard was using. The model didn't catch this on initial build — it surfaced only during user testing.

---

## Demo replay instructions

**Starting URL:** https://mira-prototype-ten.vercel.app
(Redirects to `/onboarding` automatically.)

**Full demo flow:**

1. **Onboarding — Q1:** Three lines appear in sequence. Paste or upload any writing sample (a memo, an email, anything). Hit Continue.

2. **Onboarding — Q2:** One decision from the last year. A sentence is fine. Hit Continue.

3. **Onboarding — Connect:** Toggle Google and AngelList on. Hit Continue. (Explain: this is how Mira knows your emails, portfolio signals, and deal notes from day one.)

4. **Loading:** Three lines stagger in as Mira reads the input. 7 seconds. The footer line fades in last: "The longer we work together, the sharper this gets."

5. **Reveal:** Mira's initial model of the user appears: thesis, voice phrases, open questions. Hit "Let's start."

6. **Home screen:** Cards compose sentence by sentence. Let the first card finish. The chime should fire on the first sentence. (If it doesn't, note this as a browser audio autoplay limitation.)

7. **Card 1 — Push Back:** Click "Push back." Type something like "Two of these passes were Bryan's call, not mine." Hit Enter. Mira updates inline. Open the Journal (`J`) — a new item appears in "What I'm still figuring out."

8. **Journal:** Show the thesis. Click to edit. Change a word. Press Enter. "Updated. I'll factor this in." Hover a voice chip to show the sourced rationale. Weigh in on a figuring-out question.

9. **Card 2 — Show reasoning:** Click "Draft a note to Sana." Show the draft email inline. This is Mira doing work, not just surfacing information.

10. **Card 5 — Almost said:** Click "What I almost said." Show the shadow observation about Priya's co-founder. Explain: every card has a version Mira held back. This is the transparency mechanism.

11. **Variant dropdown:** Click "Mira" (or press `V`). Show the four personas. Click "+ build your own" — returns to onboarding. Explain: same runtime, different context, different model of a different user.

**Keyboard shortcuts for demo control:**

| Key | Action |
|-----|--------|
| `R` | Reset all state, replay card composition from the beginning |
| `J` | Toggle Journal panel open/closed |
| `V` | Toggle variant dropdown |
| `O` | Navigate to onboarding |

**To reset between recordings:** Press `R` from the home screen. All state clears, composition replays, chime re-fires.

**To jump directly to the home screen** (skipping onboarding): Navigate to `/home` directly.
