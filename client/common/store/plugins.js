const auth = (mutationType, storageKey = 'APP_USER') => {
  return store => {
    store.subscribe((mutation, store) => {
      if (mutation.type !== mutationType) return;
      window.localStorage.setItem(storageKey, JSON.stringify(store.auth.user));
    });
  };
};

export { auth };
