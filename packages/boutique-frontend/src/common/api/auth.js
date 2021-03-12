import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/users',
  login: () => `${urls.root}/login`,
  logout: () => `${urls.root}/logout`,
  forgotPassword: () => `${urls.root}/forgotPassword`,
  resetPassword: () => `${urls.root}/resetPassword`
};

function login(credentials) {
  return request.base.post(urls.login(), credentials)
    .then(extractData)
    .then(({ token, user }) => {
      request.auth.token = token;
      return user;
    });
}

function logout() {
  request.post(urls.logout()).then(() => {
    request.auth.token = null;
  });
}

function forgotPassword(email) {
  return request.post(urls.forgotPassword(), { email });
}

function resetPassword(body) {
  return request.post(urls.resetPassword(), body);
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword
};
