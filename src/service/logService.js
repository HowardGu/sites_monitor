import request from '@/utils/request';

const show = (siteId) => {
    return request.get(`logs/sites/${siteId}`);
};

const showAll = (axiosParams) => {
    return request.get('logs', { params: axiosParams });
};

const showHistory = (siteId, historyParams) => {
    return request.get(`history/sites/${siteId}`, historyParams);
};

export default {
    show,
    showAll,
    showHistory
}
