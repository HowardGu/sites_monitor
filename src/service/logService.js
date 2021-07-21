import request from '@/utils/request';

const show = (siteUUID, axiosParams) => {
    return request.get(`logs/sites/${siteUUID}`, { params: axiosParams });
};

const showAll = (axiosParams) => {
    return request.get('logs', { params: axiosParams });
};

const showRealtimeLog = (siteUUID) => {
    return request.get(`realtime/sites/${siteUUID}`);
};

const showRealtimeData = (realtimeParams) => {
    return request.post('realtime', realtimeParams);
};

const showHistory = (siteUUID, historyParams) => {
    return request.post(`history/sites/${siteUUID}`, historyParams);
};

export default {
    show,
    showAll,
    showRealtimeLog,
    showRealtimeData,
    showHistory
}
