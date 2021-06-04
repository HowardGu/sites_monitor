import request from '@/utils/request';

const create = (siteParams) => {
    return request.post('sites', siteParams);
};

const update = (siteParams) => {
    return request.put(`sites/${siteParams.id}`, siteParams);
};

const show = (siteId) => {
    return request.get(`sites/${siteId}`);
};

const remove = (siteId) => {
    return request.delete(`sites/${siteId}`);
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

export default {
    create,
    update,
    show,
    remove,
    showAll,
    showTunnels,
    showLocations,
    showSites
};
