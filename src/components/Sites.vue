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

            <el-tree :props="siteTreeProps" @node-click="handleNodeClick"
            :lazy="true" :load="loadNode"></el-tree>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            siteTreeProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf'
            }
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

        async getTunnels(resolve) {
            try {
                const tokenStr = window.sessionStorage.getItem('token');
                const result = await this.$http.get('sites/tunnels', { headers: { Authorization: `Bearer ${tokenStr}` } });

                console.log(result);

                if (result.data.code === 200) {
                    const tunnels = result.data.data.tunnels;
                    if (tunnels) {
                        const tunnelsData = tunnels.map((tunnel) => {
                            return { label: tunnel, leaf: false };
                        });

                        resolve(tunnelsData);
                    }
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (err) {
                return this.$message.error(err.response.data.msg);
            }
        },

        async getLocations(node, resolve) {
            const tunnel = node.data.label;
            console.log(tunnel);

            try {
                const tokenStr = window.sessionStorage.getItem('token');
                const result = await this.$http.get(`sites/tunnels/${tunnel}/locations`, { headers: { Authorization: `Bearer ${tokenStr}` } });

                console.log(result);

                if (result.data.code === 200) {
                    const locations = result.data.data.locations;
                    if (locations) {
                        const locationsData = locations.map((location) => {
                            return { label: location, leaf: false, father: tunnel };
                        });

                        resolve(locationsData);
                    }
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (err) {
                return this.$message.error(err.response.data.msg);
            }
        },

        async getSites(node, resolve) {
            const location = node.data.label;
            console.log(location);
            const tunnel = node.data.father;
            console.log(tunnel);

            try {
                const tokenStr = window.sessionStorage.getItem('token');
                const result = await this.$http.get(`sites/tunnels/${tunnel}/locations/${location}`, { headers: { Authorization: `Bearer ${tokenStr}` } });

                console.log(result);

                if (result.data.code === 200) {
                    const sites = result.data.data.sites;
                    if (sites) {
                        const sitesData = sites.map((site) => {
                            return { label: site.siteName, siteId: site.siteId, siteUUID: site.id, leaf: true };
                        });

                        resolve(sitesData);
                    }
                } else {
                    this.$message.error(result.data.msg);
                }
            } catch (err) {
                return this.$message.error(err.response.data.msg);
            }
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
        }
    },
    created() {
        // this.getTunnels();
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
