import users from '@/common/api/users';

export const getUsers = ({ commit }) => {
  return users.getUsers()
    .then(users => commit('setUsers', users));
};
