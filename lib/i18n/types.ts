export interface Dictionary {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    back: string;
    loading: string;
    close: string;
  };
  auth: {
    login: string;
    loginTitle: string;
    loginSubtitle: string;
    continueWithGoogle: string;
    logout: string;
    email: string;
    password: string;
    loginError: string;
  };
  onboarding: {
    displayNameTitle: string;
    displayNameHint: string;
    displayNamePlaceholder: string;
    continue: string;
  };
  collection: {
    title: string;
    empty: string;
    totalItems: string;
    totalInvested: string;
    totalEstimated: string;
    profitLoss: string;
    addItem: string;
    personNameLabel: string;
    personNamePlaceholder: string;
    createItemError: string;
  };
  itemType: {
    autograph: string;
    photo: string;
    card: string;
    jersey: string;
    letter: string;
    other: string;
  };
  authentication: {
    certificate: string;
    inPerson: string;
    unverified: string;
  };
  persons: {
    title: string;
    search: string;
    requestSent: string;
    bio: string;
    funFact: string;
    filmography: string;
    photoPlaceholder: string;
    priceHistory: string;
    verifiedSales: string;
    source: string;
  };
  requests: {
    title: string;
    status: {
      waiting: string;
      received: string;
      returned: string;
      no_response: string;
    };
    daysWaiting: string;
    markReceived: string;
    markReturned: string;
    markNoResponse: string;
  };
  settings: {
    title: string;
    displayName: string;
    showNameOnPhotos: string;
    deleteAccount: string;
    deleteAccountWarning: string;
  };
  photoPicker: {
    addPhoto: string;
    changePhoto: string;
    limitHint: string;
    limitReached: string;
    processing: string;
    uploading: string;
    removing: string;
    remove: string;
    tooLarge: string;
    notAnImage: string;
    uploadError: string;
    saveError: string;
    clearCache: string;
    clearCacheConfirm: string;
  };
}
