export const auth = ({ actions, key, value, storage }) => store => {
  key = key || 'USER';
  value = value || (state => state.auth.user);
  storage = window.localStorage;
  const { login, logout } = Object.assign({
    login: 'auth/login',
    logout: 'auth/logout'
  }, actions);

  // Subscribe to login mutation.
  store.subscribe(({ type }, state) => {
    if (type !== login) return;
    const data = JSON.stringify(value(state));
    storage.setItem(key, data);
  });
  // Subscribe to logout action.
  store.subscribeAction(({ type }) => {
    if (type !== logout) return;
    storage.removeItem(key);
    window.location.replace(window.location.origin);
  });
};
