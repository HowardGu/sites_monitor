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

                <bm-marker v-for="marker of markers" :key="marker.siteId" :position="{lng: marker.longitude, lat: marker.latitude}" @click="showMarkerInfo(marker)"></bm-marker>

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
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
export default {
    components: {
        BaiduMap,
        BmScale,
        BmNavigation,
        BmMarker,
        BmInfoWindow
    },
    data() {
        return {
            loading: true,

            ak: this.$baiduMapAK,

            map: {
                width: '100%',
                height: '600px'
            },

            markers: [
                {
                    siteId: 1,
                    longitude: 118.1095150000,
                    latitude: 24.5019670000,
                    tunnel: '仙岳路隧道',
                    location: '横洞',
                    siteName: 'FM远端机1',
                    description: 'test site 1',
                    uuid: ''
                },
                {
                    siteId: 2,
                    longitude: 117.1095150000,
                    latitude: 25.5019670000,
                    tunnel: '仙岳路隧道',
                    location: '横洞',
                    siteName: 'FM远端机1',
                    description: 'test site 1',
                    uuid: ''
                }
            ],

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
        },

        showMarkerInfo(marker) {
            this.infoWindow.data = marker;
            this.infoWindow.longitude = marker.longitude;
            this.infoWindow.latitude = marker.latitude;
            this.infoWindow.show = true;
        },

        infoWindowClose(e) {
            this.infoWindow.show = false
        },

        infoWindowOpen(e) {
            this.infoWindow.show = true
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
