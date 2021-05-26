<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时地图</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="realtimeMap-card-header">
                <span>实时地图</span>
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
.realtimeMap-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
