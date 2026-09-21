// English scaffold — mirrors cs.ts key-for-key. Not wired up to any UI yet;
// fill in when the site actually opens a second locale.
import type { Dictionary } from "./types";

const en: Dictionary = {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    back: "Back",
    loading: "Loading…",
    close: "Close",
  },
  auth: {
    login: "Log in",
    loginTitle: "Log in",
    loginSubtitle: "Welcome back to Autografio.",
    continueWithGoogle: "Continue with Google",
    logout: "Log out",
  },
  onboarding: {
    displayNameTitle: "How should others see you?",
    displayNameHint:
      "This nickname is shown on your public photos. Your email or Google profile name is never made public.",
    displayNamePlaceholder: "E.g. John S.",
    continue: "Continue",
  },
  collection: {
    title: "My collection",
    empty: "You don't have any items yet.",
    totalItems: "Items",
    totalInvested: "Total invested",
    totalEstimated: "Total estimated value",
    profitLoss: "Profit / loss",
    addItem: "Add item",
  },
  itemType: {
    autograph: "Autograph",
    photo: "Photo",
    card: "Card",
    jersey: "Jersey",
    letter: "Letter",
    other: "Other",
  },
  authentication: {
    certificate: "Certificate",
    inPerson: "Obtained in person",
    unverified: "Unverified",
  },
  persons: {
    title: "Persons",
    search: "Search a person…",
    requestSent: "I sent a request",
  },
  requests: {
    title: "My requests",
    status: {
      waiting: "Waiting",
      received: "Received",
      returned: "Returned unsigned",
      no_response: "No response",
    },
    daysWaiting: "days waiting",
    markReceived: "Received",
    markReturned: "Returned unsigned",
    markNoResponse: "No response",
  },
  settings: {
    title: "Profile settings",
    displayName: "Display name",
    showNameOnPhotos: "Show name on public photos",
    deleteAccount: "Delete account",
    deleteAccountWarning: "This permanently deletes your account, collection, and uploaded photos.",
  },
};

export default en;
