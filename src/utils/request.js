import axios from 'axios';
import router from '../router';
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

service.interceptors.response.use((response) => {
    // Do something after response is received
    return Promise.resolve(response)
}, (error) => {
    // Do something with response error
    console.log(error)
    if (error.response) {
        switch (error.response.status) {
        case 401:
            storageService.set(storageService.USER_TOKEN, '');
            storageService.set(storageService.USER_INFO, '');
            router.replace({
                path: '/login'
            });
            break;
        default:
            break;
        }
    }

    return Promise.reject(error);
});

export default service;
