<template>
    <el-container class="home-container">
        <el-header id="home-header">
            <h2 class="home-header-title">{{ title }}</h2>
            <!-- <el-dropdown size="medium" :split-button="true" type="info" @command="logout">
                你好，{{ userName }}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-unlock">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
            <h2>{{ currentTime }}</h2>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? 'auto' : '180px'">
                <div class="home-toggle-button" @click="toggleCollapse()">|||</div>
                <el-menu background-color="#EAEDF1" text-color="#FFF" active-text-color="#409EFF" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath.substring(1)">
                    <el-menu-item index="realtimeMap">
                        <i class="el-icon-map-location"></i>
                        <span slot="title">实时地图</span>
                    </el-menu-item>
                    <el-menu-item index="sites">
                        <i class="el-icon-notebook-1"></i>
                        <span slot="title">站点列表</span>
                    </el-menu-item>
                    <el-menu-item index="siteInfo">
                        <i class="el-icon-zoom-in"></i>
                        <span slot="title">站点详情</span>
                    </el-menu-item>
                    <el-menu-item index="siteManagement" v-if="userGroup === 'admin' || userGroup === 'manager'">
                        <i class="el-icon-menu"></i>
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
                    <el-menu-item index="realtimeChart1">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">实时数据1</span>
                    </el-menu-item>
                    <el-menu-item index="realtimeChart2">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">实时数据2</span>
                    </el-menu-item>
                    <el-menu-item index="realtimeChart3">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">实时数据3</span>
                    </el-menu-item>
                    <el-menu-item index="realtimeChartConfig">
                        <i class="el-icon-setting"></i>
                        <span slot="title">实时配置</span>
                    </el-menu-item>
                    <el-menu-item index="help">
                        <i class="el-icon-document"></i>
                        <span slot="title">帮助手册</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
        <el-footer id="home-footer">&copy; {{ year + copyright }}</el-footer>
    </el-container>
</template>

<script>
import { mapActions } from 'vuex';
import storageService from '@/service/storageService';
export default {
    data() {
        return {
            userName: '',

            userGroup: '',

            activePath: '/realtimeMap',

            year: new Date().getFullYear(),

            copyright: '上海东方明珠信息技术有限公司',

            title: '',

            isCollapse: true,

            currentTime: ''
        };
    },
    methods: {
        ...mapActions('userModule', { userlogout: 'logout' }),
        logout() {
            this.userlogout();
        },

        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },

        setCurrentTime() {
            const curDate = new Date();
            const year = curDate.getFullYear();
            const month = curDate.getMonth() + 1 < 10 ? '0' + (curDate.getMonth() + 1) : curDate.getMonth() + 1;
            const date = curDate.getDate() < 10 ? '0' + curDate.getDate() : curDate.getDate();
            const hh = curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours();
            const mm = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes();
            const ss = curDate.getSeconds() < 10 ? '0' + curDate.getSeconds() : curDate.getSeconds();
            this.currentTime = year + '年' + month + '月' + date + '日' + ' ' + hh + ':' + mm + ':' + ss;
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userName = user.userName;
        this.userGroup = user.userGroup;
        this.title = this.$customConfig.HOME_TITLE;

        window.setInterval(this.setCurrentTime, 1000);
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
    background-color: #EAEDF1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333744;
}

.el-aside {
    background-color: #EAEDF1;
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
    background-color: #EAEDF1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333744;
    font-size: 12px;
}

.home-toggle-button {
    background-color: #EAEDF1;
    line-height: 24px;
    color: #333744;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor: pointer;
}

.home-header-title {
    padding-left: 50%;
}
</style>
