"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { CATEGORY_LABELS, type FilmographyEntry, type PersonCategory } from "@/lib/mockData/persons";
import { APP_CATEGORY_TO_DB, slugifyName } from "@/lib/dbPerson";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as PersonCategory[];

// Postgres unique_violation — here it always means the generated slug is
// taken, either by a live catalog entry or by someone else's pending
// submission (which RLS won't let this user read, so a lookup first
// wouldn't have caught it anyway).
const UNIQUE_VIOLATION = "23505";
const MAX_SLUG_ATTEMPTS = 5;

type SaleDraft = { price: string; sourceName: string; sourceUrl: string; soldAt: string };

// One film per pasted line: a leading 4-digit year, then the title, then an
// optional "(note)" — e.g. "1994 Nebožtíci" or "1981 Buď zdráv, šampióne!
// (TV seriál)". Lets someone paste a whole filmography in one go instead of
// adding each film through its own row of fields. A line that doesn't start
// with a year is silently dropped rather than rejecting the paste outright.
function parseFilmographyText(text: string): FilmographyEntry[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const match = line.match(/^(\d{4})\s+(.+?)(?:\s*\(([^)]+)\))?$/);
      if (!match) return [];
      const [, yearStr, title, note] = match;
      return [{ year: Number(yearStr), title: title.trim(), ...(note ? { note: note.trim() } : {}) }];
    });
}

// Writes straight to persons as status = 'pending' — the RLS insert check
// added in 0011_person_submissions.sql forces that, so nothing typed here
// can reach a public catalog page before a human approves it in /nevyrizene.
// Any sales added below land in price_reports the same way (each its own
// pending row, see 0009/0012) — approving the person doesn't approve them,
// they show up as their own items in /nevyrizene's price-report queue.
export default function SuggestPersonForm({ userId }: { userId: string }) {
  const t = useTranslation();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PersonCategory>("herec");
  const [gender, setGender] = useState<"m" | "f">("m");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [nationality, setNationality] = useState("Česko");
  const [bio, setBio] = useState("");
  const [funFact, setFunFact] = useState("");
  const [estimateMin, setEstimateMin] = useState("");
  const [estimateMax, setEstimateMax] = useState("");
  const [sales, setSales] = useState<SaleDraft[]>([]);
  const [filmographyText, setFilmographyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <h2 className="person-section-title">{t.suggestPerson.successTitle}</h2>
        <p className="person-section-text">{t.suggestPerson.successText}</p>
      </div>
    );
  }

  function addSale() {
    setSales((prev) => [...prev, { price: "", sourceName: "", sourceUrl: "", soldAt: "" }]);
  }
  function updateSale(index: number, patch: Partial<SaleDraft>) {
    setSales((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function removeSale(index: number) {
    setSales((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const baseSlug = slugifyName(trimmedName);
    if (!trimmedName || !baseSlug || !birthYear) return;

    setSubmitting(true);
    setError(null);

    // A sale row missing a required field (price/source) is just dropped
    // rather than blocking the whole submission — an unfinished extra row
    // shouldn't stop the core suggestion from going in. Same idea for a
    // pasted filmography line that doesn't match the expected format (see
    // parseFilmographyText).
    const validFilms = parseFilmographyText(filmographyText);
    const validSales = sales.filter((s) => s.price.trim() && s.sourceName.trim() && s.sourceUrl.trim());

    const row = {
      name: trimmedName,
      category: APP_CATEGORY_TO_DB[category],
      gender,
      birth_year: Number(birthYear),
      death_year: deathYear ? Number(deathYear) : null,
      nationality: nationality.trim() || null,
      bio: bio.trim() || null,
      fun_fact: funFact.trim() || null,
      filmography: validFilms.length > 0 ? validFilms : null,
      market_price_min: estimateMin ? Number(estimateMin) : null,
      market_price_max: estimateMax ? Number(estimateMax) : null,
      status: "pending" as const,
      created_by: userId,
    };

    for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
      const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
      const { data: inserted, error: insertError } = await supabase.from("persons").insert({ ...row, slug }).select("id").single();

      if (!insertError && inserted) {
        if (validSales.length > 0) {
          await Promise.all(
            validSales.map((s) =>
              supabase.from("price_reports").insert({
                person_id: inserted.id,
                reported_by: userId,
                item_type: "autograph",
                authentication: "unverified",
                price: Number(s.price),
                currency: "CZK",
                sold_at: s.soldAt || null,
                source_name: s.sourceName.trim(),
                source_url: s.sourceUrl.trim(),
                status: "pending",
              })
            )
          );
        }
        setSubmitting(false);
        setDone(true);
        return;
      }
      if (insertError && insertError.code !== UNIQUE_VIOLATION) {
        setSubmitting(false);
        setError(t.suggestPerson.createError);
        return;
      }
    }

    setSubmitting(false);
    setError(t.suggestPerson.duplicateError);
  }

  return (
    <form onSubmit={handleSubmit} className="card form-grid" style={{ padding: 24 }}>
      <div className="form-field">
        <label className="field-label" htmlFor="suggest-name">
          {t.suggestPerson.nameLabel}
        </label>
        <input id="suggest-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="field-label" htmlFor="suggest-category">
            {t.suggestPerson.categoryLabel}
          </label>
          <select
            id="suggest-category"
            className="field-input"
            value={category}
            onChange={(e) => setCategory(e.target.value as PersonCategory)}
          >
            {CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor="suggest-gender">
            {t.suggestPerson.genderLabel}
          </label>
          <select id="suggest-gender" className="field-input" value={gender} onChange={(e) => setGender(e.target.value as "m" | "f")}>
            <option value="m">{t.suggestPerson.genderMale}</option>
            <option value="f">{t.suggestPerson.genderFemale}</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="field-label" htmlFor="suggest-birth-year">
            {t.suggestPerson.birthYearLabel}
          </label>
          <input
            id="suggest-birth-year"
            type="number"
            min={1700}
            max={new Date().getFullYear()}
            className="field-input"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label className="field-label" htmlFor="suggest-death-year">
            {t.suggestPerson.deathYearLabel}
          </label>
          <input
            id="suggest-death-year"
            type="number"
            min={1700}
            max={new Date().getFullYear()}
            className="field-input"
            value={deathYear}
            onChange={(e) => setDeathYear(e.target.value)}
            placeholder={t.suggestPerson.deathYearHint}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="suggest-nationality">
          {t.suggestPerson.nationalityLabel}
        </label>
        <input id="suggest-nationality" className="field-input" value={nationality} onChange={(e) => setNationality(e.target.value)} />
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="suggest-bio">
          {t.suggestPerson.bioLabel}
        </label>
        <textarea
          id="suggest-bio"
          className="field-input"
          style={{ minHeight: 120, resize: "vertical" }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="suggest-fun-fact">
          {t.suggestPerson.funFactLabel}
        </label>
        <textarea
          id="suggest-fun-fact"
          className="field-input"
          style={{ minHeight: 72, resize: "vertical" }}
          value={funFact}
          onChange={(e) => setFunFact(e.target.value)}
        />
      </div>

      {/* Doložené prodeje — each row becomes its own price_reports insert
          on submit, not a column on persons itself. */}
      <div className="form-field">
        <p className="field-label" style={{ marginBottom: 2 }}>
          {t.suggestPerson.salesTitle}
        </p>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 10 }}>{t.suggestPerson.salesHint}</p>

        {sales.map((sale, i) => (
          <div key={i} className="card" style={{ padding: 14, marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label" htmlFor={`sale-price-${i}`}>
                  {t.suggestPerson.salePriceLabel}
                </label>
                <input
                  id={`sale-price-${i}`}
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="field-input"
                  value={sale.price}
                  onChange={(e) => updateSale(i, { price: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="field-label" htmlFor={`sale-sold-at-${i}`}>
                  {t.suggestPerson.saleSoldAtLabel}
                </label>
                <input
                  id={`sale-sold-at-${i}`}
                  type="date"
                  className="field-input"
                  value={sale.soldAt}
                  onChange={(e) => updateSale(i, { soldAt: e.target.value })}
                />
              </div>
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor={`sale-source-name-${i}`}>
                {t.suggestPerson.saleSourceNameLabel}
              </label>
              <input
                id={`sale-source-name-${i}`}
                className="field-input"
                value={sale.sourceName}
                onChange={(e) => updateSale(i, { sourceName: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor={`sale-source-url-${i}`}>
                {t.suggestPerson.saleSourceUrlLabel}
              </label>
              <input
                id={`sale-source-url-${i}`}
                type="url"
                className="field-input"
                value={sale.sourceUrl}
                onChange={(e) => updateSale(i, { sourceUrl: e.target.value })}
              />
            </div>
            <button type="button" className="btn" style={{ alignSelf: "flex-start" }} onClick={() => removeSale(i)}>
              {t.suggestPerson.removeSale}
            </button>
          </div>
        ))}

        <button type="button" className="btn" style={{ alignSelf: "flex-start" }} onClick={addSale}>
          {t.suggestPerson.addSale}
        </button>
      </div>

      {/* Orientační cena — only meaningful as a fallback when there's no
          doložený prodej above to price the person off of instead. */}
      <div className="form-field">
        <p className="field-label" style={{ marginBottom: 2 }}>
          {t.suggestPerson.estimateTitle}
        </p>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 10 }}>{t.suggestPerson.estimateHint}</p>
        <div className="form-row">
          <div className="form-field">
            <label className="field-label" htmlFor="suggest-estimate-min">
              {t.suggestPerson.estimateMinLabel}
            </label>
            <input
              id="suggest-estimate-min"
              type="number"
              min={0}
              inputMode="decimal"
              className="field-input"
              value={estimateMin}
              onChange={(e) => setEstimateMin(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label" htmlFor="suggest-estimate-max">
              {t.suggestPerson.estimateMaxLabel}
            </label>
            <input
              id="suggest-estimate-max"
              type="number"
              min={0}
              inputMode="decimal"
              className="field-input"
              value={estimateMax}
              onChange={(e) => setEstimateMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="suggest-filmography" style={{ marginBottom: 2 }}>
          {t.suggestPerson.filmographyTitle}
        </label>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 10 }}>{t.suggestPerson.filmographyHint}</p>
        <textarea
          id="suggest-filmography"
          className="field-input"
          style={{ minHeight: 140, resize: "vertical", fontFamily: "monospace" }}
          placeholder={t.suggestPerson.filmographyPlaceholder}
          value={filmographyText}
          onChange={(e) => setFilmographyText(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: "flex-start" }}>
        {submitting ? t.common.loading : t.suggestPerson.submit}
      </button>
    </form>
  );
}
