import request from '@/utils/request';

const create = (siteParams) => {
    return request.post('sites', siteParams);
};

const update = (siteParams) => {
    return request.put(`sites/${siteParams.id}`, siteParams);
};

const ignoreAlert = (siteParams) => {
    return request.put(`sites/${siteParams.id}/alert`, { ignore: siteParams.ignoreAlert });
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

const showTunnels = () => {
    return request.get('sites/tunnels');
};

const showLocations = (tunnel) => {
    return request.get(`sites/tunnels/${tunnel}/locations`);
};

const showSites = (tunnel, location) => {
    return request.get(`sites/tunnels/${tunnel}/locations/${location}`);
};

const getUUID = (siteId) => {
    return request.get(`sites/${siteId}/UUID`);
};

export default {
    create,
    update,
    ignoreAlert,
    show,
    remove,
    showAll,
    showTunnels,
    showLocations,
    showSites,
    getUUID
};
