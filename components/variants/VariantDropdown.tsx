"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { variants } from "@/data/mockData";

export default function VariantDropdown() {
  const open = useStore((s) => s.variantDropdownOpen);
  const setOpen = useStore((s) => s.setVariantDropdownOpen);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          key="dropdown"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-full left-0 mt-2 w-[280px] bg-paper border border-solid border-hairline rounded-sm z-50 py-1"
          style={{ boxShadow: "0 4px 24px rgba(10,10,10,0.08)" }}
        >
          {variants.map((v) => (
            <div
              key={v.id}
              className={`flex items-start justify-between px-4 py-3 gap-3 ${
                v.active ? "cursor-default" : "cursor-default opacity-40"
              }`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className={`font-sans text-meta leading-snug ${
                    v.active ? "text-ink font-medium" : "text-muted"
                  }`}
                >
                  {v.label}
                </span>
                <span className="font-sans text-meta text-muted-light leading-snug">
                  {v.description}
                </span>
              </div>
              {v.active && (
                <span className="font-sans text-meta text-accent shrink-0 mt-0.5">✓</span>
              )}
            </div>
          ))}

          <div className="border-t border-solid border-hairline mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); router.push("/onboarding"); }}
              className="w-full text-left px-4 py-2.5 bg-transparent border-none cursor-pointer hover:bg-[#F5F3EF] transition-colors duration-150"
            >
              <span className="font-sans italic text-meta text-muted-light hover:text-muted">
                + build your own
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
