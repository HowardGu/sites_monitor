<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时数据</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card v-loading="loading" :element-loading-text="loadingText">
            <div slot="header" class="realtimeChart-card-header">
                <h2 align="center">实时数据</h2>
            </div>

            <div class="realtimeChart-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>
                <el-button class="realtimeChart-search-bar-button" icon="el-icon-search" @click="startTimeIntervel()">刷新曲线</el-button>
            </div>

            <div id="realtimeChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import logService from '@/service/logService';
import siteService from '@/service/siteService';
import * as echarts from 'echarts'

export default {
    data() {
        return {
            loading: false,

            loadingText: '',

            siteId: 2,

            realtimeData: null,

            siteList: [],

            selectedSiteUUID: '',

            realtimeChart: null,

            refreshInterval: null,

            chartOption: {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['入射功率', '反射功率', '推动功率', '输入功率', '功放电流', '功放温度', '电源电压', '驻波比']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar'
                }]
            }
        };
    },
    methods: {
        startTimeIntervel() {
            if (this.selectedSiteUUID !== '') {
                this.getSiteRealtimeChart();

                if (this.refreshInterval) {
                    window.clearInterval(this.refreshInterval);
                } else {
                    this.refreshInterval = window.setInterval(this.getSiteRealtimeChart, 5000);
                }
            } else {
                this.$message.warning('请选择站点');
            }
        },

        getSiteRealtimeChart() {
            if (this.selectedSiteUUID !== '') {
                this.loading = true;
                this.loadingText = '数据加载中';

                console.log(this.selectedSiteUUID);

                logService.showCurrentInfo(this.selectedSiteUUID).then((res) => {
                    console.log(res);
                    if (res.data.data && res.data.data.state) {
                        this.realtimeData = res.data.data.state;
                        this.renderChart();
                    } else {
                        this.resetChart();
                        this.$message('站点' + this.siteId + '没有日志');
                    }
                    this.loading = false;
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            } else {
                this.$message.warning('请选择站点');
            }
        },

        getSites() {
            siteService.showAll().then((res) => {
                this.siteList = res.data.data.sites.map((site) => {
                    return {
                        siteFullName: site.tunnel + ' - ' + site.location + ' - ' + site.siteName,
                        siteId: site.siteId,
                        siteUUID: site.id
                    }
                });
                console.log(this.siteList);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        renderChart() {
            const xAxisData = [
                this.realtimeData.incidentPower,
                this.realtimeData.reflectedPower,
                this.realtimeData.pushPower,
                this.realtimeData.inputPower,
                this.realtimeData.electricCurrent,
                this.realtimeData.temperature,
                this.realtimeData.supplyVoltage,
                this.realtimeData.standingWaveRatio];

            this.realtimeChart.setOption({ series: [{ data: xAxisData }] });
        },

        resetChart() {
            this.realtimeChart.clear();
            this.realtimeChart.setOption(this.chartOption);
        },

        initChart() {
            this.realtimeChart = echarts.init(document.getElementById('realtimeChart'));
        }
    },
    mounted() {
        this.initChart();
        this.resetChart();
    },
    created() {
        this.getSites();
    },
    destroyed() {
        if (this.refreshInterval) {
            window.clearInterval(this.refreshInterval);
            console.log('RealtimeChart time intervel destroyed');
        }
    }
}
</script>

<style lang="less" scoped>
.realtimeChart-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.realtimeChart-search-bar {
    display: flex;
    align-items: center;
}

.realtimeChart-search-bar-button {
    margin-left: 10px;
}

.realtimeChart-search-bar-datepicker {
    margin-left: 10px;
}

.el-select {
    width: 400px;
}

.realtimeChart-pagination {
    margin-top: 15px;
}
</style>
