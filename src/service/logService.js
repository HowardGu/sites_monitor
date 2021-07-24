import request from '@/utils/request';

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
    showRealtimeLog,
    showRealtimeData,
    showHistory
}
