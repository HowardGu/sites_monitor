<template>
    <div>
        <el-card v-loading="loading" element-loading-text="地图加载中" class="realtimeMap-card">
            <el-collapse class="sites-collapse" v-model="activeNames">
                <el-collapse-item name="0">
                    <template slot="title"><h3 align="center" class="sites-collapse-item-bad-title">报警站点({{ badPoints.length }})</h3></template>
                    <div id="sites-collapse-item-container-good-div" class="sites-collapse-item-container">
                        <div v-if="activeNames.includes('0')">
                            <div v-for="badPoint of badPoints" :key="badPoint.siteUUID" class="sites-collapse-item-content" @click="showMarkerInfo2(badPoint)" >
                                <el-divider></el-divider>
                                <h3>站点号：{{ badPoint.siteId }}</h3>
                                <span>{{ badPoint.tunnel + ' - ' + badPoint.location + ' - ' + badPoint.siteName}}</span>
                                <span class="sites-item-alert">{{ badPoint.alertState }}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="1">
                    <template slot="title"><h3 align="center" class="sites-collapse-item-good-title">正常站点({{ goodPoints.length }})</h3></template>
                    <div id="sites-collapse-item-container-bad-div" class="sites-collapse-item-container">
                        <div v-if="activeNames.includes('1')">
                            <div v-for="goodPoint of goodPoints" :key="goodPoint.siteUUID" class="sites-collapse-item-content" @click="showMarkerInfo2(goodPoint)">
                                <el-divider></el-divider>
                                <h3>站点号：{{ goodPoint.siteId }}</h3>
                                <span>{{ goodPoint.tunnel + ' - ' + goodPoint.location + ' - ' + goodPoint.siteName}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <baidu-map :style="{width:map.width,height:map.height}" :scroll-wheel-zoom="true"
                :center="mapCenter" :zoom="mapZoom" @ready="mapHandler" :ak="mapAK">
                <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale>

                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" ></bm-navigation>

                <bm-point-collection :points="badPoints" shape="BMAP_POINT_SHAPE_CIRCLE" color="red" size="BMAP_POINT_SIZE_BIG" @click="showMarkerInfo"></bm-point-collection>
                <bm-point-collection :points="goodPoints" shape="BMAP_POINT_SHAPE_CIRCLE" color="green" size="BMAP_POINT_SIZE_SMALL" @click="showMarkerInfo"></bm-point-collection>

                <bm-info-window :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen" :width="400" :height="140" :autoPan="true" :position="{lng: infoWindow.lng, lat: infoWindow.lat}">
                    <div class="infoWindow-content">
                        <h3>站点号：{{ infoWindow.data.siteId }}</h3>
                        <span>{{ infoWindow.data.tunnel + ' - ' + infoWindow.data.location + ' - ' + infoWindow.data.siteName}}<span class="sites-item-alert">{{ infoWindow.data.alertState }}</span></span>
                        <el-link type="primary" @click="showSiteInfo">查看详细信息</el-link>
                    </div>
                </bm-info-window>

                <bm-polyline v-for="(path, index) in goodPolylinePath" :key="index" :path="path" stroke-color="green" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
                <bm-polyline v-for="(path, index) in badPolylinePath" :key="goodPolylinePath.length ? goodPolylinePath.length : 0  + 1 + index" :path="path" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
            </baidu-map>
        </el-card>
    </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmScale from 'vue-baidu-map/components/controls/Scale';
import BmNavigation from 'vue-baidu-map/components/controls/Navigation';
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow';
import BmPointCollection from 'vue-baidu-map/components/overlays/PointCollection';
import BmPolyline from 'vue-baidu-map/components/overlays/Polyline';
import siteService from '@/service/siteService';
export default {
    components: {
        BaiduMap,
        BmScale,
        BmNavigation,
        BmInfoWindow,
        BmPointCollection,
        BmPolyline
    },
    data() {
        return {
            loading: true,

            mapAK: this.$baiduMapAK,

            mapCenter: {
                lng: 118.144064,
                lat: 24.498119
            },

            mapZoom: 14,

            map: {
                width: '100%',
                height: '600px'
            },

            refreshInterval: null,

            refreshPaused: false,

            goodPoints: [],

            badPoints: [],

            infoWindow: {
                show: false,
                lng: 0,
                lat: 0,
                data: {}
            },

            goodPolylinePath: [],

            badPolylinePath: [],

            activeNames: []
        };
    },
    methods: {
        startTimeIntervel() {
            this.getSitesWithAlert();

            this.clearInterval();

            this.refreshInterval = window.setInterval(this.getSitesWithAlert, 5000);
        },

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
            this.startTimeIntervel();
            this.loading = false;
        },

        showMarkerInfo(e) {
            this.showMarkerInfo2(e.point);
        },

        showMarkerInfo2(point) {
            this.infoWindow.data = point;
            this.infoWindow.lng = point.lng;
            this.infoWindow.lat = point.lat;
            this.infoWindow.show = true;
        },

        infoWindowClose(e) {
            this.infoWindow.show = false;
        },

        infoWindowOpen(e) {
            this.infoWindow.show = true;
        },

        getSitesWithAlert() {
            siteService.showAllWithAlert().then((res) => {
                // console.log(res);
                this.goodPolylinePath = [];
                this.badPolylinePath = [];
                const points = res.data.data.sites.map((site) => {
                    var alertStr;
                    if (site.alertState) {
                        alertStr = ' - ' + site.alertState.slice(0, 2).join(' - ')
                        if (site.alertState.length > 2) {
                            alertStr += ' ...'
                        }
                    }
                    if (this.infoWindow.data && this.infoWindow.data.siteId === site.siteId) {
                        this.infoWindow.data.alertState = alertStr;
                    }
                    if (site.latitude2 !== 0 && site.longitude2 !== 0) {
                        if (site.alertState2) {
                            this.badPolylinePath.push([{ lng: site.longitude, lat: site.latitude }, { lng: site.longitude2, lat: site.latitude2 }]);
                        } else {
                            this.goodPolylinePath.push([{ lng: site.longitude, lat: site.latitude }, { lng: site.longitude2, lat: site.latitude2 }]);
                        }
                    }
                    return {
                        description: site.description,
                        siteUUID: site.siteUUID,
                        lat: site.latitude,
                        lng: site.longitude,
                        lat2: site.latitude2,
                        lng2: site.longitude2,
                        location: site.location,
                        siteId: site.siteId,
                        siteName: site.siteName,
                        tunnel: site.tunnel,
                        alertState: alertStr,
                        alertState2: site.alertState2
                    };
                });

                this.goodPoints = points.filter((point) => {
                    return !point.alertState;
                });

                this.badPoints = points.filter((point) => {
                    return point.alertState;
                });
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        clearInterval() {
            if (this.refreshInterval) {
                window.clearInterval(this.refreshInterval);
                console.log('RealtimeMap intervel destroyed');
            }
        },

        getMapHeight() {
            const homeHeader = document.getElementById('home-header');
            const homeFooter = document.getElementById('home-footer');
            // 80 is the sum of the paddings of el-main and el-card, currently I haven't find a way to eliminate them, so need to decreased by 80
            // then decrease 5 more to eliminate the vertical scrollbar
            const availableHeight = document.body.clientHeight - homeHeader.clientHeight - homeFooter.clientHeight - 85;
            this.map.height = availableHeight + 'px';

            const goodDiv = document.getElementById('sites-collapse-item-container-good-div');
            if (goodDiv && goodDiv.style) {
                goodDiv.style.maxHeight = availableHeight * 0.5 + 'px';
            }

            const badDiv = document.getElementById('sites-collapse-item-container-bad-div');
            if (badDiv && badDiv.style) {
                badDiv.style.maxHeight = availableHeight * 0.5 + 'px';
            }
            console.log('RealtimeMap height updated');
        },

        clearData() {
            this.goodPoints = [];
            this.badPoints = [];
            this.goodPolylinePath = [];
            this.badPolylinePath = [];

            console.log('RealtimeMap data destroyed');
        }
    },
    created() {
        this.mapCenter = this.$customConfig.REALTIMEMAP_MAP_CENTER;
        this.mapZoom = this.$customConfig.REALTIMEMAP_MAP_ZOOM;
        this.mapAK = this.$customConfig.REALTIMEMAP_MAP_AK;
    },
    mounted() {
        this.getMapHeight();
    },
    activated() {
        if (this.refreshPaused) {
            this.startTimeIntervel();
        }

        window.onresize = () => {
            return (() => {
                this.getMapHeight();
            })()
        };
    },
    deactivated() {
        if (this.refreshInterval) {
            this.refreshPaused = true;
        }
        this.clearInterval();
        window.onresize = null;
        this.clearData();
    },
    beforeDestroy() {
        this.clearInterval();
        window.onresize = null;
        this.clearData();
    }
}
</script>

<style lang="less" scoped>
.realtimeMap-card {
    position: relative;
}

.infoWindow-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.sites-collapse {
    position: absolute;
    z-index: 999;
    width: 300px;
    right: 30px;
    bottom: 30px;
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
    overflow-y: auto;
}

.sites-item-alert {
    color: #FF4136;
}

.el-divider {
    margin: 0;
}

.el-link {
    margin-top: 10px;
}
</style>
