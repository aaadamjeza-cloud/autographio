import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import FilmPoster from "@/components/FilmPoster";
import { findMockFilm } from "@/lib/mockData/films";
import { MOCK_PERSONS } from "@/lib/mockData/persons";
import t from "@/lib/i18n";

export default async function FilmDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = findMockFilm(slug);
  if (!film) notFound();

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div className="film-detail-head">
          <div className="film-poster-wide">
            <FilmPoster slug={film.slug} title={film.title} year={film.year} topCast={film.cast.slice(0, 3).map((c) => c.name)} />
          </div>
          <div>
            <p className="person-detail-meta" style={{ marginBottom: 6 }}>
              {t.films.year}: {film.year}
            </p>
            <h1 className="person-title" style={{ marginBottom: 8 }}>
              {film.title}
            </h1>
            <p className="person-detail-meta">
              {t.films.director}: {film.director} · {t.films.writers}: {film.writers}
            </p>
          </div>
        </div>

        <p className="person-section-text" style={{ marginBottom: 24 }}>
          {film.summary}
        </p>

        {film.note && (
          <p className="person-section-text" style={{ fontStyle: "italic", color: "var(--ink-3)", marginBottom: 24 }}>
            {film.note}
          </p>
        )}

        {film.production && (
          <section style={{ marginBottom: 32 }}>
            <h2 className="person-section-title">{t.films.production}</h2>
            <p className="person-section-text">{film.production}</p>
          </section>
        )}

        {film.funFact && (
          <section style={{ marginBottom: 32 }}>
            <h2 className="person-section-title">{t.films.funFact}</h2>
            <p className="person-section-text">{film.funFact}</p>
          </section>
        )}

        <section>
          <h2 className="person-section-title">
            {t.films.cast} <span style={{ color: "var(--ink-muted)", fontWeight: 600 }}>({film.cast.length})</span>
          </h2>
          <ul className="film-cast-list">
            {film.cast.map((member) => {
              const person = MOCK_PERSONS.find((p) => p.name === member.name);
              return (
                <li key={member.name} className="film-cast-item">
                  {person ? (
                    <Link href={`/osobnosti/${person.slug}`} className="film-cast-link">
                      {member.name}
                    </Link>
                  ) : (
                    <span className="film-cast-name">{member.name}</span>
                  )}
                  {member.role && <span className="film-cast-role">{member.role}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
