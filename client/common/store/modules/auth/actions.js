import auth from '@/common/api/auth';

export const login = ({ commit }, credentials) => {
  return auth.login(credentials)
    .then(user => commit('login', user) || user);
};

export const logout = () => {
  return auth.logout()
    .then(() => setTimeout(() => {
      window.localStorage.removeItem('LMS_USER');
      document.location.replace(document.location.origin);
    }, 0));
};

export const forgotPassword = (context, { email }) => {
  return auth.forgotPassword(email);
};

export const resetPassword = (context, payload) => {
  return auth.resetPassword(payload);
};
