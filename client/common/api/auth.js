import request from './request';

const url = {
  login: '/users/login',
  logout: '/users/logout',
  forgotPassword: '/users/forgotPassword',
  resetPassword: '/users/resetPassword'
};

function login(credentials) {
  return request.post(url.login, credentials)
    .then(res => res.data.data)
    .then(({ token, user }) => {
      window.localStorage.setItem('LMS_TOKEN', token);
      return user;
    });
}

function logout() {
  return request.post(url.logout)
    .finally(() => window.localStorage.removeItem('LMS_TOKEN'));
}

function forgotPassword(email) {
  return request.post(url.forgotPassword, { email });
}

function resetPassword(body) {
  return request.post(url.resetPassword, body);
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword
};
