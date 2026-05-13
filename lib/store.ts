import { create } from "zustand";
import { cards as initialCards, journal as initialJournal } from "@/data/mockData";
import type { Card, Journal } from "@/data/mockData";

interface AppState {
  cards: Card[];
  journal: Journal;
  variantDropdownOpen: boolean;
  journalOpen: boolean;
  pushBackActive: string | null;
  hasPlayedChime: boolean;
  compositionTriggered: boolean;

  updateCardWithPushBack: (cardId: string, response: string) => void;
  addJournalQuestion: (question: string) => void;
  updateJournalThesis: (newThesis: string) => void;
  setPushBackActive: (cardId: string | null) => void;
  setVariantDropdownOpen: (open: boolean) => void;
  setJournalOpen: (open: boolean) => void;
  setHasPlayedChime: () => void;
  resetAll: () => void;
}

export const useStore = create<AppState>((set) => ({
  cards: initialCards,
  journal: initialJournal,
  variantDropdownOpen: false,
  journalOpen: false,
  pushBackActive: null,
  hasPlayedChime: false,
  compositionTriggered: false,

  updateCardWithPushBack: (cardId, response) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId ? { ...card, pushBackResponse: response } : card
      ),
    })),

  addJournalQuestion: (question) =>
    set((state) => ({
      journal: {
        ...state.journal,
        figuringOut: [...state.journal.figuringOut, { text: question }],
      },
    })),

  updateJournalThesis: (newThesis) =>
    set((state) => ({
      journal: { ...state.journal, thesis: newThesis },
    })),

  setPushBackActive: (cardId) => set({ pushBackActive: cardId }),
  setVariantDropdownOpen: (open) => set({ variantDropdownOpen: open }),
  setJournalOpen: (open) => set({ journalOpen: open }),
  setHasPlayedChime: () => set({ hasPlayedChime: true }),

  resetAll: () =>
    set({
      cards: initialCards,
      journal: initialJournal,
      variantDropdownOpen: false,
      journalOpen: false,
      pushBackActive: null,
      hasPlayedChime: false,
      compositionTriggered: true,
    }),
}));
