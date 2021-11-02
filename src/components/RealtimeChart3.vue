<template>
    <div>
        <el-card v-loading="loading" element-loading-text="数据加载中">
            <div class="realtimeChart-chart-container">
                <div id='realtimeChart0' style="width: 33%;"></div>
                <div id='realtimeChart1' style="width: 33%;"></div>
                <div id='realtimeChart2' style="width: 33%;"></div>
            </div>
            <div class="realtimeChart-chart-container">
                <div id='realtimeChart3' style="width: 33%;"></div>
                <div id='realtimeChart4' style="width: 33%;"></div>
                <div id='realtimeChart5' style="width: 33%;"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import logService from '@/service/logService';
import siteService from '@/service/siteService';
import userService from '@/service/userService';
import storageService from '@/service/storageService';
import * as echarts from 'echarts'

export default {
    data() {
        return {
            loading: true,

            pageId: 2,

            userId: 0,

            realtimeDataQueryInfos: [],

            siteList: [],

            refreshInterval: null,

            chartOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        const siteInfo = this.siteMap.get(params[0].name);
                        if (siteInfo) {
                            return siteInfo.briefInfo;
                        } else {
                            return '-';
                        }
                    }.bind(this)
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'inside'
                    }
                }]
            },

            realtimeCharts: [],

            realtimeChartsConfig: null,

            dataTypes: [],

            chartsPerPage: 6,

            siteMap: null,

            chartHeight: '',

            timeInterval: 0,

            timeIntervalBase: 6
        };
    },
    methods: {
        startTimeIntervel() {
            this.initCharts();
            this.resetCharts();

            this.realtimeDataQueryInfos = [];
            this.realtimeChartsConfig.pages[this.pageId].charts.forEach((chart) => {
                this.realtimeDataQueryInfos.push({
                    siteIds: chart.bars,
                    signalName: chart.dataType
                })
            });

            this.getRealtimeData();

            this.clearInterval();

            this.refreshInterval = window.setInterval(this.getRealtimeData, this.timeInterval);
        },

        getRealtimeData() {
            // console.log('RealtimeChart query infos');
            // console.log(this.realtimeDataQueryInfos);

            this.realtimeDataQueryInfos.forEach((queryInfo, index) => {
                logService.showRealtimeData(queryInfo).then((res) => {
                    if (res.data.data && res.data.data.realtimeData) {
                        // console.log(res.data.data.realtimeData);
                        this.renderChart(index, res.data.data.realtimeData);
                    }
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            });
        },

        renderChart(index, realtimeData) {
            const title = this.realtimeChartsConfig.pages[this.pageId].charts[index].title;
            const subTitle = this.dataTypes.find((dataType) => {
                return dataType.key === this.realtimeChartsConfig.pages[this.pageId].charts[index].dataType;
            }).label;
            const seriesData = realtimeData.map((obj) => {
                return obj.alertState ? { value: obj.data, itemStyle: { color: 'red' } } : { value: obj.data };
            });
            const xAxisData = [];

            this.realtimeChartsConfig.pages[this.pageId].charts[index].bars.forEach((bar, barIndex) => {
                const site = this.siteList.find((site) => {
                    return site.siteUUID === bar;
                });

                if (site) {
                    const barName = site.siteId + '号';
                    this.siteMap.set(barName, { siteUUID: site.siteUUID, siteId: site.siteId, briefInfo: site.tunnelName + '</br>' + site.siteId + '号站点' });
                    xAxisData.push(realtimeData[barIndex].alertState ? { value: barName, textStyle: { color: 'red' } } : { value: barName });
                } else {
                    xAxisData.push('-');
                }
            });

            const yAxisMax = this.realtimeChartsConfig.pages[this.pageId].charts[index].yAxisMax ? this.realtimeChartsConfig.pages[this.pageId].charts[index].yAxisMax : null;

            this.realtimeCharts[index].setOption({ title: { text: title, subtext: subTitle }, xAxis: { data: xAxisData, triggerEvent: true }, yAxis: { max: yAxisMax }, series: [{ data: seriesData }] });

            this.realtimeCharts[index].on('click', function(params) {
                if (params.componentType === 'xAxis') {
                    // console.log(params.value);
                    const siteInfo = this.siteMap.get(params.value);
                    if (siteInfo) {
                        // console.log(siteInfo);
                        this.$router.push({
                            path: '/siteInfo',
                            query: {
                                siteId: siteInfo.siteId,
                                siteUUID: siteInfo.siteUUID
                            }
                        });
                    }
                }
            }.bind(this));
        },

        resetCharts() {
            this.realtimeCharts.forEach((realtimeChart) => {
                realtimeChart.clear();
                realtimeChart.setOption(this.chartOption);
            });
        },

        initCharts() {
            console.log('Init Charts...');
            this.realtimeCharts = [];
            for (let i = 0; i < this.chartsPerPage; i++) {
                const chartDOMId = 'realtimeChart' + i.toString();
                const chartDOM = echarts.getInstanceByDom(document.getElementById(chartDOMId));
                if (chartDOM) {
                    echarts.dispose(document.getElementById(chartDOMId));
                }
            }

            for (let i = 0; i < this.chartsPerPage; i++) {
                const chartDOMId = 'realtimeChart' + i.toString();
                const chartDOM = document.getElementById(chartDOMId);
                chartDOM.style.height = this.chartHeight;
                this.realtimeCharts.push(echarts.init(chartDOM));
            }

            if (this.siteMap) {
                this.siteMap.clear();
            } else {
                this.siteMap = new Map();
            }
        },

        getChartHeight() {
            const homeHeader = document.getElementById('home-header');
            const homeFooter = document.getElementById('home-footer');
            // 80 is the sum of the paddings of el-main and el-card, currently I haven't find a way to eliminate them, so need to decreased by 80
            // then decrease 5 more to eliminate the vertical scrollbar
            this.chartHeight = (document.body.clientHeight - homeHeader.clientHeight - homeFooter.clientHeight - 85) / 2 + 'px';
            console.log('RealtimeMap1 chart height updated');
        },

        clearInterval() {
            if (this.refreshInterval) {
                window.clearInterval(this.refreshInterval);
                console.log('RealtimeChart time intervel destroyed');
            }
        },

        init() {
            // 1.getSites
            siteService.showAll().then((res) => {
                this.siteList = res.data.data.sites.map((site) => {
                    return {
                        siteFullName: site.tunnel + ' - ' + site.location + ' - ' + site.siteName,
                        siteId: site.siteId,
                        siteUUID: site.siteUUID,
                        tunnelName: site.tunnel
                    }
                });
                // console.log(this.siteList);

                // 2.getRealtimeChartsConfig
                const chartsConfigQuertInfo = {
                    userId: this.userId,
                    name: 'realtimeChartsConfig'
                }

                // console.log(chartsConfigQuertInfo);

                userService.showConf(chartsConfigQuertInfo).then((res) => {
                    // console.log(res);
                    if (res.data.data && res.data.data.conf.conf) {
                        console.log('Use RealtimeCharts config from server');
                        this.realtimeChartsConfig = JSON.parse(res.data.data.conf.conf);
                    } else {
                        console.log('Use RealtimeCharts config from local');
                        this.realtimeChartsConfig = this.$customConfig.REALTIMECHART_DEFAULT_CONFIG;
                    }

                    // console.log(this.realtimeChartsConfig);

                    // 3.startTimeIntervel
                    this.startTimeIntervel();

                    this.loading = false;
                }).catch((err) => {
                    return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                })
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        }
    },
    mounted() {
        this.getChartHeight();
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userId = user.userId;

        this.dataTypes = this.$customConfig.COMMON_DATA_TYPES.analog;
        this.timeInterval = this.$customConfig.REALTIMECHART_TIME_INTERVAL * this.timeIntervalBase;
    },
    activated() {
        this.init();

        window.onresize = () => {
            return (() => {
                this.getChartHeight();
            })()
        };
    },
    deactivated() {
        this.clearInterval();
        window.onresize = null;
    },
    destroyed() {
        this.clearInterval();
        window.onresize = null;
    }
}
</script>

<style lang="less" scoped>
.realtimeChart-chart-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
