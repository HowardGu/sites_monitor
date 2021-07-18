import axios from 'axios';
import storageService from '../service/storageService';
import config from '../../public/config.js';

const service = axios.create({
    baseURL: config.properties.BASE_URL,
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
