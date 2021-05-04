import { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import axios from 'axios';

const baseURL = process.env.API_PATH || '/api/v1/';

const config = {
  baseURL,
  withCredentials: true
};

// Instance of axios to be used for all API requests.
const client = axios.create(config);

Object.defineProperty(client, 'base', {
  get() {
    if (!this.base_) this.base_ = axios.create(config);
    return this.base_;
  }
});

const isAuthError = err => [FORBIDDEN, UNAUTHORIZED].includes(err.response?.status);

client.interceptors.response.use(res => res, err => {
  if (isAuthError(err)) return window.location.reload();
  throw err;
});

export default client;
