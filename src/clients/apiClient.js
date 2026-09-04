const axios = require('axios');
const { baseUrl } = require('../config/env');

const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  validateStatus: () => true,
  headers: { Accept: 'application/json' }
});

function request(method, url, options = {}) {
  return apiClient.request({ method, url, ...options });
}

module.exports = {
  request,
  get: (url, config) => request('get', url, config),
  post: (url, data, config) => request('post', url, { ...config, data }),
  put: (url, data, config) => request('put', url, { ...config, data }),
  patch: (url, data, config) => request('patch', url, { ...config, data }),
  delete: (url, config) => request('delete', url, config)
};
