import auth from '@/common/api/auth';
import { navigateTo } from '@/common/navigation';

export const login = ({ commit }, credentials) => {
  return auth.login(credentials)
    .then(user => commit('login', user) || user);
};

export const logout = () => {
  return auth.logout()
    .then(() => navigateTo('/'));
};

export const forgotPassword = (_, { email }) => {
  return auth.forgotPassword(email);
};

export const resetPassword = (_, payload) => {
  return auth.resetPassword(payload);
};

export const fetchUserInfo = ({ commit }) => {
  return auth.getUserInfo()
    .then(({ user }) => commit('login', user))
    .catch(() => commit('logout'));
};
