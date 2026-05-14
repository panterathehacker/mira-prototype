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
  compositionKey: number;
  bumpCompositionKey: () => void;

  updateCardWithPushBack: (cardId: string, response: string) => void;
  addJournalQuestion: (question: string) => void;
  updateJournalThesis: (newThesis: string) => void;
  weighInOnQuestion: (index: number, note: string) => void;
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
  compositionKey: 0,

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

  weighInOnQuestion: (index, note) =>
    set((state) => ({
      journal: {
        ...state.journal,
        figuringOut: state.journal.figuringOut.map((item, i) =>
          i === index ? { ...item, userNote: note } : item
        ),
      },
    })),

  bumpCompositionKey: () => set((state) => ({ compositionKey: state.compositionKey + 1 })),
  setPushBackActive: (cardId) => set({ pushBackActive: cardId }),
  setVariantDropdownOpen: (open) => set({ variantDropdownOpen: open }),
  setJournalOpen: (open) => set({ journalOpen: open }),
  setHasPlayedChime: () => set({ hasPlayedChime: true }),

  resetAll: () =>
    set((state) => ({
      cards: initialCards,
      journal: initialJournal,
      variantDropdownOpen: false,
      journalOpen: false,
      pushBackActive: null,
      hasPlayedChime: false,
      compositionKey: state.compositionKey + 1,
    })),
}));
