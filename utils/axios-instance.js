const axios = require('axios');
const { GITLAB_API, GITLAB_PT } = require('./constants');

const _instance = axios.create({
    baseURL: GITLAB_API,
    timeout: 5000,
    headers: { 
        'PRIVATE-TOKEN': GITLAB_PT
    }
});

_instance.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response) {
            return Promise.reject(error.response);
        }

        return Promise.reject({
            message: 'Something wrong with the Axios request!'
        });
    }
);

module.exports = _instance;

module.exports.getData = (url, params = {}) => _instance.get(url, { params });

module.exports.postData = (url, params = {}) => _instance.post(url, params);

