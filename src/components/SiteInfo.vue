<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div slot="header" class="siteInfo-header">
                <span>站点详情</span>
                <el-button type="primary">刷新</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.siteInfo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
