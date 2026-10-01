"use client";

import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const MONTHS = [
  "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
  "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)}.${Number(m)}.${y}`;
}

// Accepts d.m.yyyy or dd.mm.yyyy, rejects anything that isn't a real
// calendar date (e.g. 31.2.2026).
function displayToIso(display: string): string | null {
  const match = display.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (!match) return null;
  const d = Number(match[1]);
  const m = Number(match[2]);
  const y = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return toIso(y, m, d);
}

// Styled replacement for <input type="date"> — the native control's
// per-segment click-and-type UI doesn't match the rest of the design and
// can't be restyled past its calendar-icon color. This is directly typable
// (primary path — type "27.9.2026" and tab/click away) with an optional
// popup month-grid for picking a date by click instead.
export default function DateField({
  id,
  value,
  onChange,
  required,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  required?: boolean;
}) {
  // `text` is a local edit buffer, not mirrored from `value` after mount —
  // every path that changes `value` (typing + blur/Enter, or picking a day)
  // already sets `text` itself at the same time, so there's nothing external
  // left to sync. A caller that needs to reset this field to a new `value`
  // from outside (not from this component's own onChange) should remount it
  // with a `key`, same as any other lazily-initialized form field.
  const [text, setText] = useState(value ? isoToDisplay(value) : "");
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (value ? Number(value.slice(0, 4)) : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? Number(value.slice(5, 7)) - 1 : new Date().getMonth()));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function commitText(raw: string) {
    if (raw.trim() === "") {
      onChange("");
      return;
    }
    const iso = displayToIso(raw);
    if (iso) {
      onChange(iso);
      setText(isoToDisplay(iso));
    } else {
      // Not a real date — revert rather than silently keep invalid text.
      setText(value ? isoToDisplay(value) : "");
    }
  }

  function openCalendar() {
    const base = value ? new Date(`${value}T00:00:00`) : new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setOpen(true);
  }

  function shiftMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
  const todayIso = toIso(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          className="field-input"
          style={{ paddingRight: 44 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitText(text);
            }
          }}
          placeholder="dd.mm.rrrr"
          required={required}
          autoComplete="off"
          inputMode="numeric"
        />
        <button
          type="button"
          aria-label="Otevřít kalendář"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => (open ? setOpen(false) : openCalendar())}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "none",
            borderRadius: 8,
            cursor: "pointer",
            color: "var(--ink-3)",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 30,
            width: 260,
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-hover)",
            padding: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Předchozí měsíc"
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--ink-3)", padding: 4 }}
            >
              ‹
            </button>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Následující měsíc"
              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--ink-3)", padding: 4 }}
            >
              ›
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {WEEKDAYS.map((w) => (
              <span key={w} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-muted)", textAlign: "center", padding: "4px 0" }}>
                {w}
              </span>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = toIso(viewYear, viewMonth + 1, day);
              const selected = iso === value;
              const isToday = iso === todayIso;
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => {
                    onChange(iso);
                    setText(isoToDisplay(iso));
                    setOpen(false);
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    margin: "1px auto",
                    borderRadius: "50%",
                    border: isToday && !selected ? "1px solid var(--accent)" : "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: selected ? 800 : 500,
                    background: selected ? "var(--accent)" : "transparent",
                    color: selected ? "#fff" : "var(--ink)",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
