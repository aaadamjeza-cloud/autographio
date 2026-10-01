"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PersonAvatar from "@/components/PersonAvatar";
import type { PersonCategory } from "@/lib/mockData/persons";

const PORTRAITS_BUCKET = "person-portraits";
const MAX_SUGGESTIONS = 8;

export type PersonPickerPerson = {
  id: string;
  name: string;
  slug: string;
  category: PersonCategory;
  gender: "m" | "f";
};

// Styled stand-in for a plain <input list=…><datalist> — same idea (typed
// text with autocomplete suggestions matched against a known catalog), but
// shows each match's photo so picking the right "František" among several
// doesn't rely on the name alone. The catalog persons list is small enough
// (~200 rows) that one batched person_portraits query up front, same as
// app/osobnosti/page.tsx and PersonStrip.tsx, covers every suggestion
// without a query per keystroke.
export default function PersonPicker({
  id,
  persons,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  persons: PersonPickerPerson[];
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const supabase = createClient();
  const [portraitUrls, setPortraitUrls] = useState<Map<string, string>>(new Map());
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("person_portraits").select("slug, storage_path");
      if (cancelled || !data) return;
      const map = new Map<string, string>();
      for (const row of data) {
        const { data: pub } = supabase.storage.from(PORTRAITS_BUCKET).getPublicUrl(row.storage_path);
        map.set(row.slug, pub.publicUrl);
      }
      setPortraitUrls(map);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- supabase client is a stable module-level singleton
  }, []);

  // Same click-outside idiom as Header.tsx's account dropdown.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const query = value.trim().toLowerCase();
  const matches = (query ? persons.filter((p) => p.name.toLowerCase().includes(query)) : persons).slice(0, MAX_SUGGESTIONS);

  function select(person: PersonPickerPerson) {
    onChange(person.name);
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
        required={required}
      />
      {open && matches.length > 0 && (
        <div
          className="person-picker-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            maxHeight: 280,
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
          {matches.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className={`person-picker-option${i === activeIndex ? " person-picker-option-active" : ""}`}
              // Sizing/layout is inlined (not left to the CSS classes above)
              // so this row never depends on globals.css having picked up
              // these rules — an uploaded portrait's own intrinsic size
              // must never leak past the 28px avatar slot.
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
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
              // Fires before the input's onBlur/the click-outside handler,
              // so the click still lands instead of the dropdown closing first.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(p)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {portraitUrls.has(p.slug) ? (
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--panel-2)",
                    display: "block",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- public Storage URL, not an optimizable local asset */}
                  <img
                    src={portraitUrls.get(p.slug)}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </span>
              ) : (
                <PersonAvatar name={p.name} category={p.category} gender={p.gender} size={28} />
              )}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
