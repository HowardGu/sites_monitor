<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时地图</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card v-loading="loading" element-loading-text="地图加载中" class="realtimeMap-card">
            <div slot="header" class="realtimeMap-card-header">
                <h2 align="center">实时地图</h2>
            </div>

            <el-collapse class="sites-collapse">
                <el-collapse-item>
                    <template slot="title"><h3 align="center" class="sites-collapse-item-bad-title">报警站点({{ badPoints.length }})</h3></template>
                    <div v-for="badPoint of badPoints" :key="badPoint.siteUUID" class="sites-collapse-item-container" @click="showMarkerInfo2(badPoint)" >
                        <el-divider></el-divider>
                        <h3 class="sites-collapse-item-content">站点号：{{ badPoint.siteId }}</h3>
                        <span class="sites-collapse-item-content">{{ badPoint.tunnel + ' - ' + badPoint.location + ' - ' + badPoint.siteName}}</span>
                    </div>
                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title"><h3 align="center" class="sites-collapse-item-good-title">正常站点({{ goodPoints.length }})</h3></template>
                    <div class="sites-collapse-item-container">
                        <div v-for="goodPoint of goodPoints" :key="goodPoint.siteUUID" class="sites-collapse-item-content" @click="showMarkerInfo2(goodPoint)">
                            <el-divider></el-divider>
                            <h3>站点号：{{ goodPoint.siteId }}</h3>
                            <span>{{ goodPoint.tunnel + ' - ' + goodPoint.location + ' - ' + goodPoint.siteName}}</span>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <baidu-map :style="{width:map.width,height:map.height}" :scroll-wheel-zoom="true"
                :center="mapCenter" @ready="mapHandler" @load="loading = false" ak="ak">
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>

                <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>

                <bm-point-collection :points="badPoints" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_HUGE" @click="showMarkerInfo"></bm-point-collection>
                <bm-point-collection :points="goodPoints" shape="BMAP_POINT_SHAPE_CIRCLE" color="green" size="BMAP_POINT_SIZE_BIG" @click="showMarkerInfo"></bm-point-collection>

                <bm-info-window :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen" :width="400" :height="100" :autoPan="true" :position="{lng: infoWindow.longitude, lat: infoWindow.latitude}">
                    <el-row  class="infoWindow-row">
                        <el-col :span="8"><span>站点号：{{ infoWindow.data.siteId }}</span></el-col>
                    </el-row>
                    <el-row class="infoWindow-row">
                        <el-col :span="8"><span>{{ infoWindow.data.tunnel }}</span></el-col>
                        <el-col :span="8"> <span>{{ infoWindow.data.location }}</span></el-col>
                        <el-col :span="8"><span>{{ infoWindow.data.siteName }}</span></el-col>
                    </el-row>
                    <el-row class="infoWindow-row">
                        <el-col :span="10"><el-link type="primary" @click="showSiteInfo">查看详细信息</el-link></el-col>
                    </el-row>
                </bm-info-window>
            </baidu-map>
        </el-card>
    </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmScale from 'vue-baidu-map/components/controls/Scale'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
import BmPointCollection from 'vue-baidu-map/components/overlays/PointCollection'
import siteService from '@/service/siteService';
export default {
    components: {
        BaiduMap,
        BmScale,
        BmNavigation,
        BmInfoWindow,
        BmPointCollection
    },
    data() {
        return {
            loading: true,

            ak: this.$baiduMapAK,

            mapCenter: process.env.VUE_APP_REALTIMEMAP_MAP_CENTER,

            map: {
                width: '100%',
                height: '600px'
            },

            goodPoints: [],

            badPoints: [],

            infoWindow: {
                show: false,
                longitude: 0,
                latitude: 0,
                data: {}
            }
        };
    },
    methods: {
        showSiteInfo() {
            this.$router.push({
                path: '/siteInfo',
                query: {
                    siteId: this.infoWindow.data.siteId,
                    siteUUID: this.infoWindow.data.siteUUID
                }
            });
        },

        mapHandler({ BMap, map }) {
            this.map.height = document.body.clientHeight - 160 + 'px';
            this.getSites();
        },

        showMarkerInfo(e) {
            this.infoWindow.data = e.point;
            this.infoWindow.longitude = e.point.lng;
            this.infoWindow.latitude = e.point.lat;
            this.infoWindow.show = true;
        },

        showMarkerInfo2(point) {
            this.infoWindow.data = point;
            this.infoWindow.longitude = point.lng;
            this.infoWindow.latitude = point.lat;
            this.infoWindow.show = true;
        },

        infoWindowClose(e) {
            this.infoWindow.show = false
        },

        infoWindowOpen(e) {
            this.infoWindow.show = true
        },

        getSites() {
            siteService.showAll(this.queryInfo).then((res) => {
                console.log(res);
                const points = res.data.data.sites.map((site) => {
                    return {
                        description: site.description,
                        siteUUID: site.id,
                        lat: site.latitude,
                        lng: site.longitude,
                        location: site.location,
                        siteId: site.siteId,
                        siteName: site.siteName,
                        tunnel: site.tunnel,
                        hasAlert: site.siteId === 1
                    };
                });

                this.goodPoints = points.filter((point) => {
                    return !point.hasAlert;
                });

                this.badPoints = points.filter((point) => {
                    return point.hasAlert;
                });
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        }
    }
}
</script>

<style lang="less" scoped>
.realtimeMap-card {
    position: relative;
}

.realtimeMap-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.infoWindow-row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 12;
}

.sites-collapse {
    position: absolute;
    z-index: 999;
    width: 300px;
}

.el-collapse {
    margin-top: 10px;
    margin-left: 10px;
}

.sites-collapse-item-bad-title {
    margin-left: 10px;
    color: #FF4136;
}

.sites-collapse-item-good-title {
    margin-left: 10px;
    color: #3D9970;
}

.sites-collapse-item-title {
    margin-left: 10px;
}

.sites-collapse-item-content {
    &:hover {
        background-color: #fafafa;
        cursor: pointer;
    }
    padding-left: 10px;
}

.sites-collapse-item-container {
    max-height: 800px;
    overflow-y: auto;
}

.el-divider {
    margin: 0;
}
</style>
