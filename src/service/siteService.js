import request from '@/utils/request';

const create = (siteParams) => {
    return request.post('sites', siteParams);
};

const update = (siteParams) => {
    return request.put(`sites/${siteParams.siteUUID}`, siteParams);
};

const show = (siteUUID) => {
    return request.get(`sites/${siteUUID}`);
};

const remove = (siteUUID) => {
    return request.delete(`sites/${siteUUID}`);
};

const showAll = (axiosParams) => {
    return request.get('sites', { params: axiosParams });
};

const showAllWithAlert = () => {
    return request.get('realtime/sites');
};

const showTunnels = () => {
    return request.get('sites/tunnels');
};

const showLocations = (tunnel) => {
    return request.put('sites/locations', { tunnel: tunnel });
};

const showSites = (tunnel, location) => {
    return request.put('sites', { tunnel: tunnel, location: location });
};

const getUUID = (siteId) => {
    return request.get(`sites/${siteId}/UUID`);
};

const ignoreAlert = (siteParams) => {
    return request.put(`sites/${siteParams.siteUUID}/alert`, { ignore: siteParams.ignoreAlert });
};

const updateAlertState = (alertParams) => {
    return request.put(`sites/${alertParams.siteUUID}/alertEnable`, alertParams);
}

const updateAlertLimit = (alertParams) => {
    return request.put(`sites/${alertParams.siteUUID}/alertThreshold`, alertParams);
}

const alertConf = (siteUUID) => {
    return request.get(`sites/${siteUUID}/alertConf`);
};

const sendCtrlMsg = (ctrlMsgParams) => {
    return request.post(`/ctrlmsg/sites/${ctrlMsgParams.siteUUID}`, ctrlMsgParams);
}

export default {
    create,
    update,
    show,
    remove,
    showAll,
    showAllWithAlert,
    showTunnels,
    showLocations,
    showSites,
    getUUID,
    ignoreAlert,
    updateAlertState,
    updateAlertLimit,
    alertConf,
    sendCtrlMsg
};
