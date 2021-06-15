<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时地图</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card v-loading="loading" element-loading-text="地图加载中">
            <div slot="header" class="realtimeMap-card-header">
                <span>实时地图</span>
            </div>

            <baidu-map :style="{width:map.width,height:map.height}" class="map" :scroll-wheel-zoom="true"
                center="厦门" @ready="mapHandler" @load="loading = false" ak="ak">
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>

                <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>

                <bm-point-collection :points="goodPoints" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_HUGE" @click="showMarkerInfo"></bm-point-collection>
                <bm-point-collection :points="badPoints" shape="BMAP_POINT_SHAPE_CIRCLE" color="green" size="BMAP_POINT_SIZE_BIG" @click="showMarkerInfo"></bm-point-collection>

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
                data: {
                    siteId: 0,
                    tunnel: '',
                    location: '',
                    siteName: '',
                    uuid: ''
                }
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
                return this.$message.error(err.response.data.msg);
            })
        }
    }
}
</script>

<style lang="less" scoped>
.realtimeMap-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map {
    width: 100%;
    height: 600px;
}

.infoWindow-row {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 12;
}
</style>
