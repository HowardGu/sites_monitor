import request from '@/utils/request';

const login = (userParams) => {
    return request.post('auth/login', userParams);
};

const info = () => {
    return request.get('auth/info');
};

const create = (userParams) => {
    return request.post('users', userParams);
};

const update = (userParams) => {
    return request.put(`users/${userParams.userId}`, userParams);
};

const show = (userId) => {
    return request.get(`users/${userId}`);
};

const remove = (userId) => {
    return request.delete(`users/${userId}`);
};

const showAll = (axiosParams) => {
    return request.get('users', { params: axiosParams });
};

const updateConf = (userConfParams) => {
    return request.put(`userconf/${userConfParams.userId}`, userConfParams);
};

const showConf = (userConfParams) => {
    return request.post(`userconf/${userConfParams.userId}`, userConfParams);
};

export default {
    login,
    info,
    create,
    update,
    show,
    remove,
    showAll,
    updateConf,
    showConf
};
