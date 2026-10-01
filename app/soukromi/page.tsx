import Header from "@/components/Header";
import { SITE_NAME } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 className="person-title" style={{ marginBottom: 8 }}>
          Soukromí a GDPR
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 32 }}>Naposledy upraveno: září 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 className="person-section-title">Jaká data o tobě máme</h2>
          <p className="person-section-text">
            {SITE_NAME} je vedený jako soukromý projekt pro sběratele autogramů, ne jako firma sbírající data k prodeji. Zpracováváme
            jen to, co appka reálně potřebuje k fungování:
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }} className="person-section-text">
            <li>
              <b>Přihlašovací údaje</b> (e-mail, jméno z Google účtu) spravuje výhradně{" "}
              <a href="https://clerk.com/privacy" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                Clerk
              </a>
              , náš poskytovatel přihlašování. My sami e-mail ani jméno z Google účtu nikde neukládáme a nikdy je nezveřejňujeme.
            </li>
            <li>
              <b>Zobrazované jméno</b>, které si sám zvolíš při registraci — jediné jméno, které se může objevit u tvých veřejných
              fotek. Můžeš ho kdykoliv změnit nebo skrýt v Nastavení.
            </li>
            <li>
              <b>Tvoje sbírka</b> — položky, ceny, fotky a poznámky, co si sám zapíšeš. Vidíš jen ty, nikdo jiný.
            </li>
            <li>
              <b>Žádosti o podpis</b> — komu, kdy a co jsi poslal. Taky vidíš jen ty.
            </li>
            <li>
              <b>Cookie <code>locale</code></b> — pamatuje si jen to, jestli chceš rozhraní česky nebo anglicky. Žádné sledování.
            </li>
            <li>
              <b>Přihlašovací cookies od Clerk</b> — technicky nutné k tomu, aby tě appka poznala jako přihlášeného.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 className="person-section-title">Co neděláme</h2>
          <p className="person-section-text">
            Nemáme na webu žádnou reklamu ani analytické či sledovací nástroje třetích stran (Google Analytics apod.). Tvoje data
            nikomu neprodáváme ani nepředáváme k marketingu.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 className="person-section-title">Fotky</h2>
          <p className="person-section-text">
            Fotky vlastní sbírky nahráváš do soukromého úložiště — přístup k nim má jen tvůj účet. Fotky osobností v katalogu jsou
            naopak veřejné (viditelné pro všechny), protože jde o katalogovou ilustraci osoby, ne o tvoji sbírku.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 className="person-section-title">Tvoje práva</h2>
          <p className="person-section-text">
            Podle GDPR máš právo na přístup ke svým datům, jejich opravu i úplný výmaz. Zobrazované jméno a nastavení viditelnosti
            upravíš v Nastavení; celou sbírku i žádosti vidíš a spravuješ přímo v appce. Smazání účtu v Nastavení je nevratné a
            hned odstraní účet, sbírku i nahrané fotky. Pro cokoliv dalšího (např. export dat mimo appku) nás kontaktuj.
          </p>
        </section>

        <section>
          <h2 className="person-section-title">Kontakt</h2>
          <p className="person-section-text">Otázky ke zpracování dat směřuj na e-mail uvedený u provozovatele webu.</p>
        </section>
      </main>
    </>
  );
}
