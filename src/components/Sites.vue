<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="sites-card-header">
                <span>站点列表</span>
            </div>

            <el-input placeholder="输入站点信息进行搜索" v-model="searchText"></el-input>

            <el-tree :props="siteTreeProps" @node-click="handleNodeClick" :lazy="true" :load="loadNode"
            ref="siteTreeRef" :filter-node-method="filterNode" class="site-tree"></el-tree>
        </el-card>
    </div>
</template>

<script>
import siteService from '@/service/siteService';
export default {
    data() {
        return {
            siteTreeProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf'
            },

            searchText: ''
        };
    },
    methods: {
        handleNodeClick(data) {
            if (data.siteId) {
                this.$router.push({
                    path: '/siteInfo',
                    query: {
                        siteId: data.siteId,
                        siteUUID: data.siteUUID
                    }
                });
            }
        },

        getTunnels(resolve) {
            siteService.showTunnels().then((res) => {
                console.log(res);
                const tunnels = res.data.data.tunnels;
                if (tunnels) {
                    const tunnelsData = tunnels.map((tunnel) => {
                        return { label: tunnel, leaf: false };
                    });

                    resolve(tunnelsData);
                }
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getLocations(node, resolve) {
            const tunnel = node.data.label;
            console.log(tunnel);

            siteService.showLocations(tunnel).then((res) => {
                console.log(res);
                const locations = res.data.data.locations;
                if (locations) {
                    const locationsData = locations.map((location) => {
                        return { label: location, leaf: false, father: tunnel };
                    });

                    resolve(locationsData);
                }
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getSites(node, resolve) {
            const location = node.data.label;
            console.log(location);
            const tunnel = node.data.father;
            console.log(tunnel);

            siteService.showSites(tunnel, location).then((res) => {
                console.log(res);
                const sites = res.data.data.sites;
                if (sites) {
                    const sitesData = sites.map((site) => {
                        return { label: site.siteName, siteId: site.siteId, siteUUID: site.id, leaf: true };
                    });

                    resolve(sitesData);
                }
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        loadNode(node, resolve) {
            if (node.level === 0) {
                this.getTunnels(resolve);
            }

            if (node.level === 1) {
                this.getLocations(node, resolve);
            }

            if (node.level === 2) {
                this.getSites(node, resolve);
            }
        },

        filterNode(value, data) {
            if (!value) {
                return true;
            }

            return data.label.indexOf(value) !== -1;
        }
    },
    watch: {
        searchText(val) {
            this.$refs.siteTreeRef.filter(val);
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

.site-tree {
    margin-top: 10px;
}
</style>
