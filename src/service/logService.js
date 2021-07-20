import request from '@/utils/request';

const show = (siteUUID, axiosParams) => {
    return request.get(`logs/sites/${siteUUID}`, { params: axiosParams });
};

const showCurrentInfo = (siteUUID) => {
    return request.get(`logs/sites/${siteUUID}/last`);
};

const showRealtimeData = (realtiemParams) => {
    return request.post('realtime', realtiemParams);
};

const showAll = (axiosParams) => {
    return request.get('logs', { params: axiosParams });
};

const showHistory = (siteUUID, historyParams) => {
    return request.post(`history/sites/${siteUUID}`, historyParams);
};

export default {
    show,
    showCurrentInfo,
    showRealtimeData,
    showAll,
    showHistory
}
