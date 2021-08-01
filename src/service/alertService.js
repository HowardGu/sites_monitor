import request from '@/utils/request';

const show = (siteUUID, axiosParams, historyParams) => {
    return request.post(`alerts/sites/${siteUUID}`, historyParams, { params: axiosParams });
};

const showAll = (axiosParams, historyParams) => {
    return request.post('alerts', historyParams, { params: axiosParams });
};

export default {
    show,
    showAll
}
