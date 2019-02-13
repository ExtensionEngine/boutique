import clone from 'lodash/cloneDeep';
import get from 'lodash/get';
import { navigateTo } from '@/common/navigation';
import set from 'lodash/set';

export const auth = ({ actions, path, key, storage }) => store => {
  key = key || 'USER';
  storage = window.localStorage;
  path = path || 'auth.user';
  const { login, logout } = Object.assign({
    login: 'auth/login',
    logout: 'auth/logout'
  }, actions);

  // Hydrate state using specified storage/key.
  const data = JSON.parse(storage.getItem(key));
  const initialState = set(clone(store.state), path, data);
  store.replaceState(initialState);
  // Subscribe to login mutation.
  store.subscribe(({ type }, state) => {
    if (type !== login) return;
    const data = JSON.stringify(get(state, path));
    storage.setItem(key, data);
  });
  // Subscribe to logout action.
  store.subscribeAction(({ type }) => {
    if (type !== logout) return;
    storage.removeItem(key);
    navigateTo('/');
  });
};
