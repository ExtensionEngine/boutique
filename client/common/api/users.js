import request from './request';

const url = {
  users: '/users'
};

function getUsers() {
  return request.get(url.users)
    .then(res => res.data.data);
}

export default {
  getUsers
};
