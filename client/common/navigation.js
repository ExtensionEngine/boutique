import join from 'url-join';

export function navigateTo(path) {
  return window.location.replace(join(window.location.origin, `/${path}/`));
}
