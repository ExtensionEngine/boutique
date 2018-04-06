import users from '@/common/api/users';

export const getUsers = ({ commit }) => {
  return users.list()
    .then(users => commit('setUsers', users));
};
