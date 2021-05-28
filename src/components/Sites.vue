<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="sites-card-header">
                <span>站点列表</span>
                <el-button type="primary">刷新</el-button>
            </div>

            <el-tree :data="siteTree" :props="siteTreeProps" @node-click="handleNodeClick"></el-tree>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            siteTree: [
                {
                    label: '仙岳路隧道',
                    children: [
                        {
                            label: '横洞',
                            children: [
                                {
                                    label: 'FM远端机1',
                                    siteId: 18
                                },
                                {
                                    label: 'FM远端机2',
                                    siteId: 19
                                }
                            ]
                        }
                    ]
                }
            ],

            siteTreeProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods: {
        handleNodeClick(data) {
            if (data.siteId) {
                this.$router.push({
                    path: '/siteInfo',
                    query: {
                        siteId: data.siteId
                    }
                });
            }
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
