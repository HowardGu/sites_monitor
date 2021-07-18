<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span>{{ title }}</span>
            </div>
            <el-dropdown size="medium" :split-button="true" type="info" @command="logout">
                你好，{{ userName }}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-unlock">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="#333744" text-color="#FFF" active-text-color="#409EFF" :router="true" :default-active="activePath.substring(1)">
                    <el-menu-item index="realtimeMap">
                        <i class="el-icon-map-location"></i>
                        <span slot="title">实时地图</span>
                    </el-menu-item>
                    <el-menu-item index="sites">
                        <i class="el-icon-menu"></i>
                        <span slot="title">站点列表</span>
                    </el-menu-item>
                    <el-menu-item index="siteInfo">
                        <i class="el-icon-document"></i>
                        <span slot="title">站点详情</span>
                    </el-menu-item>
                    <el-menu-item index="siteManagement" v-if="userGroup === 'admin' || userGroup === 'manager'">
                        <i class="el-icon-setting"></i>
                        <span slot="title">站点管理</span>
                    </el-menu-item>
                    <el-menu-item index="history">
                        <i class="el-icon-reading"></i>
                        <span slot="title">历史记录</span>
                    </el-menu-item>
                    <el-menu-item index="logs">
                        <i class="el-icon-bell"></i>
                        <span slot="title">报警日志</span>
                    </el-menu-item>
                    <el-menu-item index="userManagement" v-if="userGroup === 'admin'">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="realtimeChart">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">实时数据</span>
                    </el-menu-item>
                    <el-menu-item index="help">
                        <i class="el-icon-document"></i>
                        <span slot="title">帮助手册</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        <el-footer>&copy; {{ year + copyright }}</el-footer>
    </el-container>
</template>

<script>
import { mapActions } from 'vuex';
import storageService from '@/service/storageService';
import config from '../../public/config.js';
export default {
    data() {
        return {
            userName: '',

            userGroup: '',

            activePath: '/realtimeMap',

            year: new Date().getFullYear(),

            copyright: config.properties.HOME_COPYRIGHT,

            title: config.properties.HOME_TITLE
        };
    },
    methods: {
        ...mapActions('userModule', { userlogout: 'logout' }),
        logout() {
            this.userlogout();
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userName = user.userName;
        this.userGroup = user.userGroup;
    },
    watch: {
        '$route.path': function(newVal, oldVal) {
            console.log('From ' + oldVal + ' to ' + newVal);
            this.activePath = newVal;
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #EAEDF1;
}

.home-container {
    height: 100%;
}

.el-footer {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    font-size: 12px;
}
</style>
