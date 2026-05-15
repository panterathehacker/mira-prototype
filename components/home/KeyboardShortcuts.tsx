"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function KeyboardShortcuts() {
  const router = useRouter();
  const resetAll = useStore((s) => s.resetAll);
  const journalOpen = useStore((s) => s.journalOpen);
  const setJournalOpen = useStore((s) => s.setJournalOpen);
  const variantDropdownOpen = useStore((s) => s.variantDropdownOpen);
  const setVariantDropdownOpen = useStore((s) => s.setVariantDropdownOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable) return;
      switch (e.key.toLowerCase()) {
        case "r":
          resetAll();
          break;
        case "j":
          setJournalOpen(!journalOpen);
          break;
        case "v":
          setVariantDropdownOpen(!variantDropdownOpen);
          break;
        case "o":
          router.push("/onboarding");
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetAll, journalOpen, setJournalOpen, variantDropdownOpen, setVariantDropdownOpen, router]);

  return null;
}
