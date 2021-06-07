<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时地图</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="realtimeMap-card-header">
                <span>实时地图</span>
            </div>

            <baidu-map :style="{width:map.width,height:map.height}" class="map" :scroll-wheel-zoom="true"
                center="厦门" @ready="mapHandler" ak="ak">
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>

                <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>

                <bm-marker v-for="marker of markers" :key="marker.siteId" :position="{lng: marker.longitude, lat: marker.latitude}" @click="openInfoWindow(marker)">
                    <bm-info-window :show="showInfoWindow" @close="closeInfoWindow"></bm-info-window>
                </bm-marker>
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
                    description: 'test site 1'
                }
            ],

            showInfoWindow: false
        };
    },
    methods: {
        mapHandler({ BMap, map }) {
            this.map.height = document.body.clientHeight - 160 + 'px';
        },

        openInfoWindow(marker) {
            this.showInfoWindow = true;
            console.log(marker);
        },

        closeInfoWindow() {
            this.showInfoWindow = false;
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
</style>
