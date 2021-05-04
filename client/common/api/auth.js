import { extractData } from './helpers';
import path from 'path';
import request from './request';

const urls = {
  root: '/users',
  login: () => path.join(urls.root, 'login'),
  logout: () => path.join(urls.root, 'logout'),
  profile: () => path.join(urls.root, 'me'),
  forgotPassword: () => path.join(urls.root, 'forgotPassword'),
  resetPassword: () => path.join(urls.root, 'resetPassword')
};

function login(credentials) {
  return request.base.post(urls.login(), credentials)
    .then(extractData)
    .then(({ user }) => user);
}

function logout() {
  return request.get(urls.logout());
}

function getUserInfo() {
  return request.base.get(urls.profile())
    .then(extractData);
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
  resetPassword,
  getUserInfo
};
