<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>帮助手册</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="help-card-header">
                <h2 align="center">帮助手册</h2>
            </div>

            <el-link icon="el-icon-download" type="primary" :href="url" target="_blank">下载帮助手册</el-link>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: process.env.VUE_APP_HELP_DOWNLOAD_URL
        };
    }
}
</script>

<style lang="less" scoped>
.help-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
