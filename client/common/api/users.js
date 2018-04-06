import request from './request';

const url = {
  users: '/users'
};

function list() {
  return request.get(url.users)
    .then(res => res.data.data);
}

export default {
  list
};
