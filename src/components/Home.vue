<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span>厦门市 监控中心</span>
            </div>
            <el-button type="info" @click="logout">Exit</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="#333744" text-color="#FFF" active-text-color="#409EFF" :router="true">
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
                    <el-menu-item index="siteManagement">
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
                    <el-menu-item index="help">
                        <i class="el-icon-document"></i>
                        <span slot="title">Help</span>
                    </el-menu-item>
                    <el-menu-item index="userManagement">
                        <i class="el-icon-user"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {

        };
    },
    methods: {
        ...mapActions('userModule', { userlogout: 'logout' }),
        logout() {
            this.userlogout()
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
}
</style>
