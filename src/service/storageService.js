const PREFIX = 'sites_monitor_';

const USER_PREFIX = `${PREFIX}user_`;
const USER_TOKEN = `${USER_PREFIX}token`;
const USER_INFO = `${USER_PREFIX}info`;

const set = (key, data) => {
    sessionStorage.setItem(key, data);
};

const get = (key) => sessionStorage.getItem(key);

export default {
    set,
    get,
    USER_TOKEN,
    USER_INFO
};
