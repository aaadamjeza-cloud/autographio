import Header from "@/components/Header";
import PhotoPicker from "@/components/PhotoPicker";
import t from "@/lib/i18n";

// Preview of the photo-handling step of "Add item" — the rest of the form
// (person picker, prices, authentication) isn't built yet. This route sits
// under /moje-sbirka on purpose: proxy.ts already gates that prefix behind
// login, it just can't enforce it until a Supabase project exists.
export default function AddItemPage() {
  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 8 }}>
          {t.collection.addItem}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 28 }}>
          Ukázka jen fotek — vyber si libovolnou fotku z počítače, uvidíš přesně to zmenšení a náhled, co půjde do
          appky. Zatím se nikam trvale neukládá (chybí Supabase Storage).
        </p>

        <div className="card" style={{ padding: 24 }}>
          <p className="field-label" style={{ marginBottom: 12, display: "block" }}>
            Fotky kusu
          </p>
          <PhotoPicker />
        </div>
      </main>
    </>
  );
}
