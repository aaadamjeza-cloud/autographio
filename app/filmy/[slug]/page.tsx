import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
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
        <p className="person-detail-meta" style={{ marginBottom: 6 }}>
          {t.films.year}: {film.year}
        </p>
        <h1 className="person-title" style={{ marginBottom: 8 }}>
          {film.title}
        </h1>
        <p className="person-detail-meta" style={{ marginBottom: 24 }}>
          {t.films.director}: {film.director}
        </p>

        <p className="person-section-text" style={{ marginBottom: 24 }}>
          {film.summary}
        </p>

        {film.note && (
          <p className="person-section-text" style={{ fontStyle: "italic", color: "var(--ink-3)", marginBottom: 24 }}>
            {film.note}
          </p>
        )}

        {film.funFact && (
          <section style={{ marginBottom: 32 }}>
            <h2 className="person-section-title">{t.films.funFact}</h2>
            <p className="person-section-text">{film.funFact}</p>
          </section>
        )}

        <section>
          <h2 className="person-section-title">{t.films.cast}</h2>
          <ul className="person-filmography" style={{ marginTop: 8 }}>
            {film.cast.map((name) => {
              const person = MOCK_PERSONS.find((p) => p.name === name);
              return (
                <li key={name}>
                  {person ? (
                    <Link href={`/osobnosti/${person.slug}`} className="film-cast-link">
                      {name}
                    </Link>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
