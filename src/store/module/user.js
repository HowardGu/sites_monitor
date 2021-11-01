import storageService from '@/service/storageService';
import userService from '@/service/userService';

const userModule = {
    namespaced: true,
    state: {
        token: storageService.get(storageService.USER_TOKEN),
        userInfo: storageService.get(storageService.USER_INFO) ? JSON.parse(storageService.get(storageService.USER_INFO)) : null, // eslint-disable-line
    },

    mutations: {
        SET_TOKEN(state, token) {
            storageService.set(storageService.USER_TOKEN, token);
            state.token = token;
        },
        SET_USERINFO(state, userInfo) {
            storageService.set(storageService.USER_INFO, JSON.stringify(userInfo));
            state.userInfo = userInfo;
        }
    },

    actions: {
        login(context, { userName, password }) {
            return new Promise((resolve, reject) => {
                userService.login({ userName, password }).then((res) => {
                    context.commit('SET_TOKEN', res.data.data.token);
                    // console.log(res.data.data.token);
                    return userService.info();
                }).then((res) => {
                    context.commit('SET_USERINFO', res.data.data.user);
                    // console.log(res.data.data.user.userId);
                    // console.log(res.data.data.user.userName);
                    // console.log(res.data.data.user.userGroup);
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        logout(context) {
            context.commit('SET_TOKEN', '');
            storageService.set(storageService.USER_TOKEN, '');
            context.commit('SET_USERINFO', '');
            storageService.set(storageService.USER_INFO, '');
            window.location.reload();
        }
    }
};

export default userModule;
