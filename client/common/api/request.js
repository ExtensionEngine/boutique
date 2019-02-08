import axios from 'axios';

const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true
};

// Instance of axios to be used for all API requests.
const client = axios.create(config);

client.interceptors.request.use(config => {
  const token = window.localStorage.getItem('LMS_TOKEN');
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`;
  } else if (!token && config.headers['Authorization']) {
    delete config.headers['Authorization'];
  }
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response.status === 401) {
    window.localStorage.removeItem('LMS_TOKEN');
    window.location.replace(window.location.origin);
  } else {
    throw err;
  }
});

export default client;

const base = axios.create(config);
export { base as client };
