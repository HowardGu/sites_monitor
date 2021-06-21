import request from '@/utils/request';

const show = (siteUUID, axiosParams) => {
    return request.get(`alerts/sites/${siteUUID}`, { params: axiosParams });
};

const showAll = (axiosParams) => {
    return request.get('alerts', { params: axiosParams });
};

export default {
    show,
    showAll
}
