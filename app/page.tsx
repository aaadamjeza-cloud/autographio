import Link from "next/link";
import Header from "@/components/Header";
import PersonAvatar from "@/components/PersonAvatar";
import { CATEGORY_LABELS, CATEGORY_COLORS, MOCK_PERSONS } from "@/lib/mockData/persons";

export default function Home() {
  return (
    <>
      <Header />

      <main className="page-content">
        <section className="hero-wrap">
          <div className="hero-grid">
            <div>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                Zdarma pro sběratele
              </span>
              <h1 className="hero-title">
                Sbírka autogramů, <span>konečně</span> na jednom místě
              </h1>
              <p className="hero-sub">
                Zapisuj si kusy, které máš, sleduj odeslané žádosti o podpis a zjisti, jak dlouho se u které osobnosti
                obvykle čeká — díky statistikám od ostatních sběratelů.
              </p>
              <div className="hero-stats">
                <span>
                  <b>{MOCK_PERSONS.length}+</b> osobností v katalogu
                </span>
                <span>Sledování žádostí o podpis</span>
                <span>Soukromá sbírka, veřejné jen to, co chceš</span>
              </div>
              <div className="hero-ctas">
                <Link href="/prihlaseni" className="btn btn-primary hero-cta-primary">
                  Začít sbírat
                </Link>
                <Link href="/osobnosti" className="btn hero-cta-primary">
                  Projít katalog
                </Link>
              </div>
            </div>

            <div className="showcase-card">
              <div className="showcase-head">
                <PersonAvatar name="Zdeněk Svěrák" category="herec" size={52} />
                <div>
                  <p className="showcase-title">Podpis — Zdeněk Svěrák</p>
                  <p className="showcase-subtitle">Fotka · osobně získáno</p>
                </div>
              </div>
              <div className="showcase-rows">
                <div className="showcase-row">
                  <span className="showcase-row-label">Kupní cena</span>
                  <span className="showcase-row-value">400 Kč</span>
                </div>
                <div className="showcase-row">
                  <span className="showcase-row-label">Odhad hodnoty</span>
                  <span className="showcase-row-value">650 Kč</span>
                </div>
                <div className="showcase-row">
                  <span className="showcase-row-label">Zisk / ztráta</span>
                  <span className="showcase-row-value positive">+250 Kč</span>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <span className="showcase-badge">Ukázka — bez přihlášení</span>
              </div>
            </div>
          </div>
        </section>

        <section className="strip-section">
          <p className="strip-label">Osobnosti v katalogu</p>
          <div className="strip-row">
            {MOCK_PERSONS.map((p) => (
              <Link key={p.slug} href={`/osobnosti/${p.slug}`} className="person-card strip-card">
                <PersonAvatar name={p.name} category={p.category} size={56} />
                <div>
                  <p className="person-card-name" style={{ fontSize: 13 }}>
                    {p.name}
                  </p>
                  <p className="person-card-years">
                    {p.birthYear}
                    {p.deathYear ? `–${p.deathYear}` : ""}
                  </p>
                </div>
                <span className="person-badge" style={{ background: CATEGORY_COLORS[p.category] }}>
                  {CATEGORY_LABELS[p.category]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
