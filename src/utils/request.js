import axios from 'axios';
import storageService from '../service/storageService';

const service = axios.create({
    baseURL: 'http://' + location.hostname + ':1016/v1/',
    timeout: 1000 * 5
});

service.interceptors.request.use((config) => {
    // Do something before request is sent
    Object.assign(config.headers, { Authorization: `Bearer ${storageService.get(storageService.USER_TOKEN)}` });
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

export default service;
