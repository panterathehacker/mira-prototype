export interface Sentence {
  text: string;
  accent?: boolean;
}

export interface AlmostSaid {
  text: string;
  reason: string;
}

export interface Card {
  id: string;
  title: string;
  sentences: Sentence[];
  footer: string;
  actions: string[];
  almostSaid: AlmostSaid | null;
  pushBackResponse?: string;
  actionResponses?: Record<string, string>;
  dismissActions?: string[];
}

export interface VoicePhrase {
  phrase: string;
  note: string;
  source: string;
}

export interface FiguringOutItem {
  text: string;
  userNote?: string;
}

export interface Journal {
  thesis: string;
  voicePhrases: VoicePhrase[];
  figuringOut: FiguringOutItem[];
}

export interface Variant {
  id: string;
  label: string;
  active: boolean;
}

export const userProfile = {
  name: "David",
  thesis: "Consumer apps in the age of AI.",
  revealedThesis:
    "Products where AI deepens a personal ritual the user already has — journaling, taste-making, social signaling.",
  portfolio: ["Lore", "Cluely", "Cazz", "Wren AI", "Frame", "Topology"],
  voicePhrases: [
    {
      phrase: "worth pressing on",
      note: "flags skepticism",
      source: "from your Lore memo, March 12",
    },
    {
      phrase: "wedge",
      note: "preferred 3:1 over 'moat'",
      source: "across 47 deal notes",
    },
    {
      phrase: "the version of you that…",
      note: "recurring decision frame",
      source: "your Q1 review doc",
    },
    {
      phrase: "shipped pull",
      note: "shorthand for organic traction",
      source: "from your Cluely memo",
    },
    {
      phrase: "feels like a feature, not a company",
      note: "your most common pass reason",
      source: "across 11 passes this year",
    },
    {
      phrase: "ritual products",
      note: "category you've referenced 4× this month",
      source: "recent calls and Slack",
    },
  ],
};

export const cards: Card[] = [
  {
    id: "pattern",
    title: "I think your pass filter has drifted from what actually worked.",
    sentences: [
      {
        text: "You've passed on four consumer AI deals this quarter: Halo, Verse, Ember, and the one you saw Monday.",
      },
      {
        text: "Each note in your CRM was a version of \"feels like a feature, not a company.\"",
      },
      { text: "Lore and Cluely looked like features at seed too." },
      {
        text: "You wrote about Lore that \"the behavioral data moat isn't visible yet but the founder is building toward it.\"",
      },
      {
        text: "The heuristic you're using on the new ones isn't the heuristic you used on the ones that worked.",
        accent: true,
      },
      {
        text: "You're being more conservative this quarter than the version of you that made your best calls. Worth fixing before the next one comes in.",
      },
    ],
    footer: "Tracking since March.",
    actions: ["Show me the reasoning", "Push back", "Snooze"],
    actionResponses: {
      "Show me the reasoning": "Four passes this quarter: Halo, Verse, Ember, and Monday's. Each note in your CRM uses \"feels like a feature, not a company.\" You wrote the same phrase before writing checks into Lore (seed, $4M post) and Cluely (seed, $6M post). In both cases it was accurate — they were features at the time — but the founders had a behavioral wedge that made them companies eventually.\n\nThe filter isn't wrong. The question is whether you're applying it too early, before the wedge is visible.",
    },
    dismissActions: ["Snooze"],
    almostSaid: {
      text: "I think two of these passes were Bryan's call, not yours.",
      reason: "I don't have evidence, so I'm not making the claim in the main card.",
    },
  },
  {
    id: "loop",
    title: "Resonance may have just proved your consumer monetization prior wrong.",
    sentences: [
      {
        text: "Remember Sana at Resonance? You met her in November, passed because you didn't believe consumers would pay for AI-native journaling.",
      },
      {
        text: "Resonance crossed $1M ARR at $4 ACV last week. 250K paying users in nine months.",
      },
      {
        text: "Your \"consumers won't pay\" prior is wrong for ritual products.",
        accent: true,
      },
      {
        text: "Update it before the next deal that triggers it, because two of the four passes I flagged in Card 1 probably failed against that same prior.",
      },
    ],
    footer: "Surfaced because Resonance crossed a threshold I'd been watching.",
    actions: ["Draft a note to Sana", "Update my thesis", "Disagree"],
    actionResponses: {
      "Draft a note to Sana": "Hi Sana,\n\nCongratulations on $1M ARR — Resonance is the clearest data point I've seen on consumer willingness to pay for ritual products. I passed when you were raising and you were right.\n\nWould love 30 minutes to hear what you've learned about the category. No agenda.\n\n—David",
      "Update my thesis": "Updated prior: consumers will pay meaningful prices for products that deepen a ritual they already practice, if the product makes the ritual feel more personal rather than more efficient. The resistance is to productivity framing, not to paying. Resonance at $4 ACV and 250K users in nine months is the cleanest proof point I have.",
    },
    dismissActions: [],
    almostSaid: {
      text: "She'll raise a Series A at $30M post within the next twelve months.",
      reason: "I'm 60% on this. Felt unfair to put in the main card.",
    },
  },
  {
    id: "drift",
    title: "Your public thesis might be too vague to attract the right founders.",
    sentences: [
      {
        text: "You tell people your thesis is \"consumer apps in the age of AI.\"",
      },
      {
        text: "Your last twenty conversations and six checks tell a sharper story: products where AI deepens a personal ritual the user already has. Journaling, taste-making, social signaling.",
      },
      {
        text: "Five of six checks fit. The sixth was Cazz, which was a founder bet, not a thesis bet, and you'd say that on a call if pressed.",
      },
      {
        text: "Your stated thesis is too broad and it's costing you on inbound.",
        accent: true,
      },
      {
        text: "Founders pitching real ritual products are framing themselves as productivity tools because that's what your bio implies you want. Let me draft a sharper intro line.",
      },
    ],
    footer: "Drafted from your last 47 days of activity.",
    actions: ["Show the draft", "Not yet"],
    actionResponses: {
      "Show the draft": "Draft (for bio / LinkedIn / cold inbound):\n\n\"I invest in products that deepen a ritual the user already has — journaling, taste-making, social signaling — using AI to make the user more themselves, not more efficient. If you're building something that fits that description, I want to hear from you.\"",
    },
    dismissActions: ["Not yet"],
    almostSaid: {
      text: "Your Twitter bio still says \"investing in the future of work,\" which is at least two theses old.",
      reason: "Felt nitpicky. Mentioning it here in case it changes the priority.",
    },
  },
  {
    id: "portfolio",
    title: "Is Zehra holding something back? Your Lore check-in is probably overdue.",
    sentences: [
      { text: "Lore hired Sasha Demers as Head of Growth." },
      {
        text: "She was #3 PM on Substack reader-side and ran the 2024 recommendation algo rebuild.",
      },
      {
        text: "This is the hire Zehra promised you when she said \"I'll bring on a real growth lead before Q4.\" Nine weeks ahead of that timeline.",
        accent: true,
      },
      {
        text: "Zehra also tweeted Thursday that they hit profitability in October. She didn't mention this on your last call, which is either modesty or she's holding it for the next raise. Either way, check-in note is overdue.",
      },
    ],
    footer: "Pulled from LinkedIn, Twitter, and your call notes.",
    actions: ["Draft check-in", "Skip"],
    actionResponses: {
      "Draft check-in": "Hi Zehra,\n\nSaw the Sasha Demers hire and the profitability tweet — congrats on both. Would love 20 minutes to hear what you're thinking about next year before you go into fundraising mode. Happy to be useful ahead of it.\n\n—David",
    },
    dismissActions: ["Skip"],
    almostSaid: null,
  },
  {
    id: "deal",
    title: "Salt might be worth 30 minutes — it's triggering three of your own heuristics.",
    sentences: [
      {
        text: "Priya Mehta (ex-Pinterest, ex-Poolsuite) is raising $2M for Salt, a taste journal.",
      },
      {
        text: "Log what you watched, ate, wore, read; AI builds a private map of your taste; share specific slices with friends (\"here's the version of me that's a movie person\").",
      },
      {
        text: "This is the version of you that wrote the Lore check, not the version that passed on Modal.",
        accent: true,
      },
      { text: "Same behavioral data moat thesis, same wedge." },
      {
        text: "Two reasons to look: she shipped something close to this at Poolsuite in 2022 and it had real organic pull, and the unbundling angle is real because taste data is leaving Instagram and has nowhere new to live.",
      },
      {
        text: "Two reasons to push: it could be a feature inside Letterboxd or Beli, and she hasn't talked publicly about a moat thesis, which on a $15M post is the first question to ask.",
      },
      {
        text: "Take the meeting. It's a 30-minute call and the downside is you learn something about a wedge you already believe in.",
      },
    ],
    footer:
      "Flagged because it triggered three of your stated heuristics simultaneously, which has happened twice before in your history. Both times you wrote the check.",
    actions: ["Set up 30 min", "Tell me more", "Pass"],
    actionResponses: {
      "Set up 30 min": "Done. I'll send you a prep note the morning of the call with the questions worth asking.",
      "Tell me more": "Priya built a private taste log at Poolsuite in 2022 — 40K users, no marketing budget, killed in a pivot. She has real evidence for the behavioral wedge she's describing.\n\nTwo things worth probing on the call: where she thinks taste data goes after Instagram, and why this moment versus 18 months ago. The $15M post valuation is aggressive for a pre-launch raise, which is the one real reason to pressure-test the thesis before writing.",
    },
    dismissActions: ["Pass"],
    almostSaid: {
      text: "Priya's co-founder, who isn't on the deck, was the actual product lead at Poolsuite.",
      reason:
        "I haven't verified this and it would be a big claim to make without verification.",
    },
  },
];

export const journal: Journal = {
  thesis:
    "Your real thesis is narrower than what you say publicly. You're betting on products that deepen a ritual the user already practices: journaling, taste-making, sharing. AI that makes the user more themselves, not more efficient. You pass on pure efficiency plays consistently, even when the numbers look good. You're drawn to founders who can articulate a behavioral wedge, even if the moat isn't visible yet.",
  voicePhrases: userProfile.voicePhrases,
  figuringOut: [
    {
      text: "Whether the B2B gap is an active choice or a sourcing issue. You've referenced enterprise twice on calls but every check this year has been consumer.",
    },
    {
      text: "Why you use \"ritual\" and \"wedge\" interchangeably sometimes but not others. There's a distinction in there I'm still mapping.",
    },
    {
      text: "Whether your pass on Verse was a thesis pass or a founder pass. The note says thesis but the language is uncharacteristically curt.",
    },
  ],
};

export const variants: Variant[] = [
  { id: "investments", label: "Mira / Investments", active: true },
  { id: "product", label: "Mira / Product", active: false },
  { id: "founder", label: "Mira / Founder", active: false },
  { id: "editorial", label: "Mira / Editorial", active: false },
  { id: "research", label: "Mira / Research", active: false },
];
