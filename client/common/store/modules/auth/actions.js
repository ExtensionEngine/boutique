import auth from '../../../api/auth';

export const login = ({ commit, state }, credentials) => {
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

export const forgotPassword = ({ commit }, { email }) => {
  return auth.forgotPassword(email);
};

export const resetPassword = ({ commit }, { email }) => {
  return auth.forgotPassword(email);
};
