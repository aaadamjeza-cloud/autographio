import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PersonDetailClient from "@/components/PersonDetailClient";
import { findMockPerson } from "@/lib/mockData/persons";

export default async function PersonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = findMockPerson(slug);
  if (!person) notFound();

  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 24px 80px" }}>
        <PersonDetailClient person={person} />
      </main>
    </>
  );
}
