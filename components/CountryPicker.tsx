"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

const MAX_SUGGESTIONS = 8;

// Same interaction pattern as PersonPicker (typed text + filtered
// suggestions, keyboard nav, click-outside) but against a plain static
// list — no photos, no Supabase lookup needed.
export default function CountryPicker({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const query = value.trim().toLowerCase();
  const matches = (query ? COUNTRIES.filter((c) => c.toLowerCase().includes(query)) : COUNTRIES).slice(0, MAX_SUGGESTIONS);

  function select(country: string) {
    onChange(country);
    setOpen(false);
  }

  return (
    <div className="person-picker" style={{ position: "relative" }} ref={wrapRef}>
      <input
        id={id}
        className="field-input"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || matches.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && matches[activeIndex]) {
            e.preventDefault();
            select(matches[activeIndex]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
      />
      {open && matches.length > 0 && (
        <div
          className="person-picker-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            maxHeight: 240,
            overflowY: "auto",
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-hover)",
            padding: 6,
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {matches.map((country, i) => (
            <button
              type="button"
              key={country}
              className={`person-picker-option${i === activeIndex ? " person-picker-option-active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                textAlign: "left",
                font: "inherit",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(country)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
