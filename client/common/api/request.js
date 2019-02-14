import axios from 'axios';
import { EventEmitter } from 'events';

const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true
};

class Auth extends EventEmitter {
  constructor(storage = window.localStorage) {
    super();
    this.storage = storage;
    this.storageKey = 'AUTH_TOKEN';
  }

  get token() {
    return this.storage.getItem(this.storageKey);
  }

  set token(val) {
    if (!val) {
      this.storage.removeItem(this.storageKey);
      return this.emit('token:remove');
    }
    this.storage.setItem(this.storageKey, val);
    this.emit('token:set', val);
  }
}

// Instance of axios to be used for all API requests.
const client = axios.create(config);
client.auth = new Auth();

Object.defineProperty(client, 'base', {
  get() {
    if (!this.base_) this.base_ = axios.create(config);
    return this.base_;
  }
});

client.interceptors.request.use(config => {
  const { token } = client.auth;
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`;
  } else if (!token && config.headers['Authorization']) {
    delete config.headers['Authorization'];
  }
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response.status !== 401) throw err;
  client.auth.token = null;
});

export default client;
