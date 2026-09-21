import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PersonAvatar from "@/components/PersonAvatar";
import { CATEGORY_LABELS, findMockPerson } from "@/lib/mockData/persons";

export default async function PersonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = findMockPerson(slug);
  if (!person) notFound();

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 640, margin: "0 auto", padding: "16px 24px 80px" }}>
        <div className="person-detail-header">
          <PersonAvatar name={person.name} category={person.category} size={112} />
          <h1 className="person-detail-name">{person.name}</h1>
          <p className="person-detail-meta">
            {CATEGORY_LABELS[person.category]} · {person.nationality} · {person.birthYear}
            {person.deathYear ? `–${person.deathYear}` : " – dosud"}
          </p>
        </div>

        <div className="person-stats-placeholder">
          Statistika žádostí o podpis (počet, čekací doba, úspěšnost) se zobrazí, jakmile bude mít tato osobnost
          alespoň 3 zaznamenané žádosti.
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button type="button" className="btn btn-primary" disabled>
            Poslal jsem žádost
          </button>
        </div>
      </main>
    </>
  );
}
