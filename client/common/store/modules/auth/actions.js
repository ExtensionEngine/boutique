import auth from '../../../api/auth';

export const login = ({ commit }, credentials) => {
  return auth.login(credentials)
    .then(user => commit('login', user));
};

export const logout = () => {
  return auth.logout()
    .then(() => setTimeout(() => {
      window.localStorage.removeItem('LMS_USER');
      window.location.reload();
    }, 0));
};

export const forgotPassword = (context, { email }) => {
  return auth.forgotPassword(email);
};

export const resetPassword = (context, { email }) => {
  return auth.forgotPassword(email);
};
