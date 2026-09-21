// Czech UI strings — the only locale actually shown today. Keep every
// user-facing label here (never hardcode text in components) so a future
// locale switch only means adding en.ts and a lookup, not touching the UI.
import type { Dictionary } from "./types";

const cs: Dictionary = {
  common: {
    save: "Uložit",
    cancel: "Zrušit",
    delete: "Smazat",
    edit: "Upravit",
    add: "Přidat",
    back: "Zpět",
    loading: "Načítání…",
    close: "Zavřít",
  },
  auth: {
    login: "Přihlásit se",
    loginTitle: "Přihlásit se",
    loginSubtitle: "Vítej zpět v Autografiu.",
    continueWithGoogle: "Pokračovat s Google",
    logout: "Odhlásit se",
  },
  onboarding: {
    displayNameTitle: "Jak tě mají ostatní vidět?",
    displayNameHint:
      "Tato přezdívka se bude zobrazovat u tvých veřejných fotek. E-mail ani jméno z Google účtu se nikdy nezveřejní.",
    displayNamePlaceholder: "Např. Petr S.",
    continue: "Pokračovat",
  },
  collection: {
    title: "Moje sbírka",
    empty: "Zatím tu nemáš žádné kusy.",
    totalItems: "Počet kusů",
    totalInvested: "Celková investice",
    totalEstimated: "Celkový odhad",
    profitLoss: "Zisk / ztráta",
    addItem: "Přidat kus",
  },
  itemType: {
    autograph: "Podpis",
    photo: "Fotka",
    card: "Karta",
    jersey: "Dres",
    letter: "Dopis",
    other: "Jiné",
  },
  authentication: {
    certificate: "Certifikát",
    inPerson: "Osobně získáno",
    unverified: "Neověřeno",
  },
  persons: {
    title: "Osobnosti",
    search: "Hledat osobnost…",
    requestSent: "Poslal jsem žádost",
  },
  requests: {
    title: "Moje žádosti",
    status: {
      waiting: "Čeká se",
      received: "Dorazilo",
      returned: "Vrátilo se bez podpisu",
      no_response: "Bez odpovědi",
    },
    daysWaiting: "dní čeká",
    markReceived: "Dorazilo",
    markReturned: "Vrátilo se bez podpisu",
    markNoResponse: "Bez odpovědi",
  },
  settings: {
    title: "Nastavení profilu",
    displayName: "Zobrazované jméno",
    showNameOnPhotos: "Zobrazovat jméno u veřejných fotek",
    deleteAccount: "Smazat účet",
    deleteAccountWarning: "Tato akce nevratně smaže účet, sbírku i nahrané fotky.",
  },
};

export default cs;
