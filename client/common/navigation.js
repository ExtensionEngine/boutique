import join from 'url-join';

export function navigateTo(path) {
  return window.location.replace(join(window.location.origin, `/${path}/`));
}

export function RouterCloak(el, _, { context }) {
  if (!context.$router || !context.$router.onReady) return;
  el.setAttribute('v-router-cloak', '');
  const cb = () => el.removeAttribute('v-router-cloak');
  context.$router.onReady(cb, cb);
}
