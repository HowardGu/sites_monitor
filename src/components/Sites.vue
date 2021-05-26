<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="sites-card-header">
                <span>站点列表</span>
                <el-button type="primary" @click="test">刷新</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    methods: {
        test() {
            this.$router.push({
                path: '/siteInfo',
                query: {
                    siteId: 18
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.sites-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
