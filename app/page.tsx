import Link from "next/link";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";
import PersonStrip from "@/components/PersonStrip";
import CarouselSection from "@/components/CarouselSection";
import SignatureMark from "@/components/SignatureMark";
import HeroCard, { type HeroCardData } from "@/components/HeroCard";
import CountUp from "@/components/CountUp";
import { MOCK_PERSONS, CATEGORY_LABELS, findMockPerson, type MockPerson, type PersonCategory } from "@/lib/mockData/persons";
import { getServerTranslation } from "@/lib/i18n/server";
import PersonAvatar from "@/components/PersonAvatar";

// A strip is a teaser, not the full catalog — the rest lives behind "Projít
// katalog". At the strip card's width (see .strip-card), about 4–5 fit in
// view at once; with the arrow buttons gone (native scroll/swipe only, see
// CarouselSection) a longer strip gives people more to actually scroll
// through instead of running out after one swipe. Sorted by top estimated
// price so each strip leads with its most eye-catching names rather than
// array order.
const STRIP_SIZE = 12;
function topByPrice(persons: MockPerson[]) {
  return [...persons].sort((a, b) => (b.marketPriceMax ?? 0) - (a.marketPriceMax ?? 0)).slice(0, STRIP_SIZE);
}

// The homepage shows at most 3 collections total (the general one below,
// plus these two curated ones) with no person repeated across them — each
// curated list is filtered against everyone already placed in an earlier
// list before it's sorted and capped. Other curated angles (Četníci, Čeští
// sportovci) are cut from the landing page for now; sportovci are still
// reachable via "Procházet podle kategorie" below, though Četníci isn't its
// own category and has no direct equivalent link yet.
function topByPriceExcluding(persons: MockPerson[], usedSlugs: Set<string>) {
  return topByPrice(persons.filter((p) => !usedSlugs.has(p.slug)));
}

const GENERAL_STRIP = topByPrice(MOCK_PERSONS);
const usedSlugs = new Set(GENERAL_STRIP.map((p) => p.slug));

const CURATED_STRIPS = [
  {
    slug: "ceske-legendy",
    label: "České legendy",
    persons: topByPriceExcluding(
      MOCK_PERSONS.filter((p) => p.category === "herec" && p.nationality === "Česko" && p.deathYear != null),
      usedSlugs
    ),
  },
  {
    slug: "francouzske-komedie",
    label: "Francouzské komedie",
    persons: topByPriceExcluding(
      MOCK_PERSONS.filter((p) => p.category === "herec" && p.nationality === "Francie"),
      usedSlugs
    ),
  },
].filter((strip) => strip.persons.length > 0);
CURATED_STRIPS.forEach((strip) => strip.persons.forEach((p) => usedSlugs.add(p.slug)));

const TOTAL_VERIFIED_SALES = MOCK_PERSONS.reduce((sum, p) => sum + (p.saleListings?.length ?? 0), 0);

function latestSale(person: MockPerson | undefined) {
  if (!person?.priceHistory?.length) return null;
  return person.priceHistory.reduce((latest, cur) => (cur.year > latest.year ? cur : latest));
}

function sourceFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.includes("aukro")) return "Aukro";
  if (url.includes("ebay")) return "eBay";
  return null;
}

// Louis de Funès specifically — his latest verified sale (32 000 Kč, 2024)
// falls inside his own estimated range (32 000–40 000 Kč), so the demo
// card's "Orientační cena" and "Poslední prodej" don't contradict each
// other (see AGENTS note on the redesign: pick a demo where the data
// actually agrees).
const HERO_CARD_PERSON = findMockPerson("louis-de-funes");
const HERO_CARD_LAST_SALE = latestSale(HERO_CARD_PERSON);

// Most recent verified sale across the whole catalog, for the header's
// live "poslední prodej" pill (see components/Header.tsx).
const LATEST_SALE_OVERALL = MOCK_PERSONS.flatMap((p) => (p.priceHistory ?? []).map((h) => ({ name: p.name, year: h.year, price: h.price }))).reduce(
  (latest, cur) => (cur.year > latest.year ? cur : latest)
);

// A few random (not necessarily the highest-price) faces from a category,
// so the tile doesn't always lead with the same handful of names — falls
// back to fewer than 3 if that category doesn't have three people with a
// sourced photo yet.
function pickRandomWithPortrait(persons: MockPerson[], count: number): MockPerson[] {
  const withPortrait = persons.filter((p) => p.portrait);
  const shuffled = [...withPortrait].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const CATEGORY_COUNTS = (Object.keys(CATEGORY_LABELS) as PersonCategory[])
  .map((key) => {
    const inCategory = MOCK_PERSONS.filter((p) => p.category === key);
    return {
      key,
      label: CATEGORY_LABELS[key],
      count: inCategory.length,
      photoPersons: pickRandomWithPortrait(inCategory, 3),
    };
  })
  .filter((c) => c.count > 0);

export default async function Home() {
  const t = await getServerTranslation();

  const FEATURES = [
    { title: t.home.featureCollectionTitle, text: t.home.featureCollectionText },
    { title: t.home.featureCatalogTitle, text: t.home.featureCatalogText(MOCK_PERSONS.length) },
    { title: t.home.featureRequestsTitle, text: t.home.featureRequestsText },
    { title: t.home.featureRequestStatsTitle, text: t.home.featureRequestStatsText, isNew: true },
    { title: t.home.featureCommunityPricesTitle, text: t.home.featureCommunityPricesText, isNew: true },
    { title: t.home.featurePrivacyTitle, text: t.home.featurePrivacyText },
  ];

  const heroCardData: HeroCardData | null = HERO_CARD_PERSON
    ? {
        name: HERO_CARD_PERSON.name,
        categoryLabel: CATEGORY_LABELS[HERO_CARD_PERSON.category],
        birthYear: HERO_CARD_PERSON.birthYear,
        photoUrl: HERO_CARD_PERSON.portrait?.url ?? null,
        photoAlt: `Portrét — ${HERO_CARD_PERSON.name}`,
        href: `/osobnosti/${HERO_CARD_PERSON.slug}#prodeje`,
        priceMin: HERO_CARD_PERSON.marketPriceMin ?? 0,
        priceMax: HERO_CARD_PERSON.marketPriceMax ?? 0,
        lastSale: HERO_CARD_LAST_SALE
          ? { ...HERO_CARD_LAST_SALE, source: sourceFromUrl(HERO_CARD_PERSON.saleListings?.[0]?.url) }
          : null,
        priceHistory: HERO_CARD_PERSON.priceHistory ?? [],
      }
    : null;

  return (
    <>
      <Header latestSale={LATEST_SALE_OVERALL} />
      <ScrollReveal />

      <main className="page-content page-content-has-sticky-cta">
        <section className="hero-wrap">
          <div className="hero-split">
            <div className="hero-text">
              <h1 className="hero-title">{t.hero.title}</h1>
              <p className="hero-sub">{t.hero.subtitle}</p>
              <div className="hero-stats-grid">
                <div className="hero-stat">
                  <p className="hero-stat-value">
                    <CountUp to={MOCK_PERSONS.length} />+
                  </p>
                  <p className="hero-stat-label">{t.hero.statPersonsLabel}</p>
                </div>
                <div className="hero-stat">
                  <p className="hero-stat-value">
                    <CountUp to={TOTAL_VERIFIED_SALES} />
                  </p>
                  <p className="hero-stat-label">{t.hero.statSalesLabel}</p>
                </div>
              </div>
              <div className="hero-actions">
                <Link href="/osobnosti" className="btn btn-primary hero-cta-primary">
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </div>

            {heroCardData && <HeroCard data={heroCardData} />}
          </div>
        </section>

        <section className="strip-section">
          <CarouselSection title="Osobnosti v katalogu" viewAllHref="/osobnosti">
            <PersonStrip persons={GENERAL_STRIP} />
          </CarouselSection>
        </section>

        <section className="features-section">
          <div className="page-container">
            <div className="section-head">
              <h2 className="section-title">{t.home.featuresTitle}</h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="feature-card">
                  <span className="feature-card-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="feature-card-heading">
                    <h3 className="feature-card-title">{f.title}</h3>
                    {f.isNew && <span className="feature-card-badge">{t.home.featureNewBadge}</span>}
                  </div>
                  <p className="feature-card-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {CURATED_STRIPS.map((strip) => (
          <section key={strip.label} id={strip.slug} className="strip-section">
            <CarouselSection title={strip.label} viewAllHref="/osobnosti">
              <PersonStrip persons={strip.persons} />
            </CarouselSection>
          </section>
        ))}

        <section className="strip-section">
          <div className="section-head">
            <h2 className="section-title">Procházet podle kategorie</h2>
          </div>
          <div className="category-grid">
            {CATEGORY_COUNTS.map((c) => (
              <Link key={c.key} href={`/osobnosti?kategorie=${c.key}`} className="category-tile">
                <span className="category-tile-avatars" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, i) => {
                    const p = c.photoPersons[i];
                    return p?.portrait ? (
                      // eslint-disable-next-line @next/next/no-img-element -- hotlinked Wikimedia Commons URL, not a locally optimizable asset
                      <img key={p.slug} src={p.portrait.url} alt="" className="category-tile-avatar-img" />
                    ) : (
                      <PersonAvatar key={i} name="" category={c.key} gender={i % 2 === 0 ? "m" : "f"} size={28} />
                    );
                  })}
                </span>
                <span className="category-tile-label">{c.label}</span>
                <span className="category-tile-count">
                  {c.count} osobností
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="how-section">
          <div className="section-head">
            <h2 className="section-title">Jak to funguje</h2>
          </div>
          <div className="how-grid">
            <div className="how-step reveal">
              <p className="how-step-num">01</p>
              {/* TODO: replace with a real screenshot of /moje-sbirka once we
                  have one worth showing — this mock reuses the actual card
                  classes so it stays visually honest in the meantime. */}
              <div className="how-mock">
                <div className="how-mock-card">
                  <span className="how-mock-avatar" aria-hidden="true">
                    ZS
                  </span>
                  <div>
                    <p className="how-mock-name">Zdeněk Svěrák</p>
                    <p className="how-mock-sub">Koupeno za 250 Kč</p>
                  </div>
                  <span className="person-badge" style={{ background: "var(--accent)", marginLeft: "auto" }}>
                    +100 Kč
                  </span>
                </div>
              </div>
              <h3 className="how-step-title">Přidej do sbírky</h3>
              <p className="how-step-text">Zapiš, co máš a za kolik jsi to koupil/a. Odhad hodnoty a zisk vidíš hned.</p>
            </div>

            <div className="how-step reveal">
              <p className="how-step-num">02</p>
              {/* TODO: replace with a real screenshot of /moje-zadosti once we have one worth showing. */}
              <div className="how-mock">
                <div className="how-mock-card">
                  <span className="how-mock-avatar" aria-hidden="true">
                    ✉
                  </span>
                  <div>
                    <p className="how-mock-name">Žádost odeslána</p>
                    <p className="how-mock-sub">čekáš 14 dní</p>
                  </div>
                </div>
              </div>
              <h3 className="how-step-title">Pošli žádost o podpis</h3>
              <p className="how-step-text">Zapiš, komu jsi psal/a — appka hlídá, jak dlouho už čekáš, a ukáže, jak dlouho čekají ostatní.</p>
            </div>

            <div className="how-step reveal">
              <p className="how-step-num">03</p>
              {/* TODO: replace with a real screenshot of a person detail page's sales chart once we have one worth showing. */}
              <div className="how-mock">
                <div className="how-mock-card how-mock-card-price">
                  <span className="how-mock-price">32 000 Kč</span>
                  <svg viewBox="0 0 80 28" width="80" height="28" fill="none" aria-hidden="true">
                    <polyline
                      points="2,22 18,16 34,20 50,8 66,10 78,4"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="how-step-title">Sleduj cenu</h3>
              <p className="how-step-text">Doložené prodeje z Aukra a eBaye i ceny nahlášené komunitou — vidíš, kam se trh hýbe.</p>
            </div>
          </div>
        </section>

        <section className="faq-section reveal">
          <div className="section-head">
            <h2 className="section-title">Časté otázky</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Je to opravdu zdarma?</summary>
              <p>Ano. Evidence sbírky, žádosti o podpis i katalog cen jsou zdarma.</p>
            </details>
            <details className="faq-item">
              <summary>Jak se ověřují doložené prodeje?</summary>
              <p>Každý doložený prodej odkazuje na konkrétní inzerát na Aukru nebo eBay, ne na odhad od oka.</p>
            </details>
            <details className="faq-item">
              <summary>Odkud jsou ceny osobností v katalogu?</summary>
              <p>Z doložených prodejů (Aukro, eBay) a z cen, které nahlásí ostatní sběratelé — ne z jednoho zdroje.</p>
            </details>
            <details className="faq-item">
              <summary>Vidí moji sbírku někdo jiný?</summary>
              <p>Ne, sbírka i žádosti o podpis jsou soukromé. Veřejné je jen to, co sám zapneš.</p>
            </details>
            <details className="faq-item">
              <summary>Musím se registrovat, abych mohl/a procházet katalog?</summary>
              <p>Ne, katalog osobností si projdeš bez účtu. Registrace se hodí, až si budeš chtít založit vlastní sbírku.</p>
            </details>
            <details className="faq-item">
              <summary>Jak dlouho se čeká na odpověď na žádost o podpis?</summary>
              <p>Liší se osobnost od osobnosti — proto appka sbírá anonymní statistiku čekání od komunity, ne jedno univerzální číslo.</p>
            </details>
          </div>
        </section>

        <section className="cta-band reveal">
          <h2 className="cta-band-title">Založ si sbírku ještě dnes</h2>
          <p className="cta-band-sub">Zdarma, bez závazků — a vidíš hned, jestli se ti sbírka vyplácí.</p>
          <SignatureMark className="cta-band-signature" />
          <Link href="/prihlaseni" className="btn btn-primary hero-cta-primary">
            Začít sbírat
          </Link>
        </section>
      </main>

      <div className="mobile-sticky-cta">
        <Link href="/prihlaseni" className="btn btn-primary mobile-sticky-cta-btn">
          Začít sbírat zdarma
        </Link>
      </div>
    </>
  );
}
