<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时数据</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card v-loading="loading" :element-loading-text="loadingText">
            <div slot="header" class="realtimeChart-card-header">
                <h2 align="center">实时数据</h2>
                <div>
                    <el-button type="primary" icon="el-icon-setting" @click="showRealtimeChartsConfigDialog1()">图表配置</el-button>
                </div>
            </div>

            <div class="realtimeChart-search-bar">
                <el-button class="realtimeChart-search-bar-button" icon="el-icon-search" @click="startTimeIntervel()">刷新曲线</el-button>
            </div>

            <div v-for="line of chartLines" :key="line" class="realtimeChart-chart-container">
                <div :id="'realtimeChart' + ((line - 1) * 2).toString()" style="margin-top: 50px; width: 50%; height:400px;"></div>
                <div :id="'realtimeChart' + ((line - 1) * 2 + 1).toString()" style="margin-top: 50px; width: 50%; height:400px;"></div>
            </div>
        </el-card>

        <el-dialog title="图表数量" :visible.sync="realtimeChartsConfigDialog1Visible" width="50%" :close-on-click-modal="false">
            <el-card class="realtimeChart-inner-card">
                <el-row :gutter="10" class="realtimeChart-row">
                    <el-col :span="6">
                        <span>图表数量：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="realtimeChartsConfigTotalChart" placeholder="请选择图表数量">
                            <el-option v-for="i of maxCharts" :label="i" :value="i" :key="i"></el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row :gutter="10" class="realtimeChart-row">
                    <el-col :span="6">
                        <span>图表数据项数量：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="realtimeChartsConfigBarsPerChart" placeholder="请选择图表数据项数量">
                            <el-option v-for="i of maxBarsPerChart" :label="i" :value="i" :key="i"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onRealtimeChartsConfigDialog1OK()">确定</el-button>
                <el-button @click="realtimeChartsConfigDialog1Visible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="图表内容" :visible.sync="realtimeChartsConfigDialog2Visible" width="50%" top="5vh" :close-on-click-modal="false">
            <el-card class="realtimeChart-inner-card">
                <div class="realtimeChart-row">
                    <el-select v-model="realtimeChartsConfigChartId" placeholder="请选择图表">
                        <el-option v-for="i of realtimeChartsConfig.totalChart" :label="'图表' + i.toString()" :value="i - 1" :key="i - 1"></el-option>
                    </el-select>
                </div>

                <el-divider></el-divider>

                <div class="realtimeChart-row">
                    <el-select v-model="realtimeChartsConfig.charts[realtimeChartsConfigChartId].dataType" placeholder="请选择数据类型">
                        <el-option v-for="dataType of dataTypes" :label="dataType.label" :value="dataType.key" :key="dataType.key"></el-option>
                    </el-select>
                </div>

                <el-divider></el-divider>

                <el-row :gutter="10" class="realtimeChart-row">
                    <el-col :span="3">
                        <span>图表标题：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="realtimeChartsConfig.charts[realtimeChartsConfigChartId].title" placeholder="图表标题"></el-input>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <div class="realtimeChart-dialog-select-container">
                    <span>请选择{{ realtimeChartsConfig.barsPerChart }}个数据项分别对应的站点：</span>

                    <div v-for="i of realtimeChartsConfig.barsPerChart" :key="i" class="realtimeChart-row">
                        <el-select v-model="realtimeChartsConfig.charts[realtimeChartsConfigChartId].bars[i - 1]" :placeholder="'第' + i.toString() + '个数据项'">
                            <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                                <span style="float: left">{{ site.siteFullName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onRealtimeChartsConfigDialog2OK()">确定</el-button>
                <el-button @click="realtimeChartsConfigDialog2Visible = false">取消</el-button>
            </div>
        </el-dialog>
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
            userId: 0,

            loading: false,

            loadingText: '',

            realtimeDataQueryInfos: [],

            siteList: [],

            refreshInterval: null,

            refreshPaused: false,

            chartOption: {
                tooltip: {
                    trigger: 'axis'
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

            chartLines: 0,

            realtimeCharts: [],

            realtimeChartsConfigDialog1Visible: false,

            realtimeChartsConfigDialog2Visible: false,

            realtimeChartsConfig: {
                totalChart: 0,
                barsPerChart: 0,
                charts: [
                    {
                        id: null,
                        title: '',
                        bars: ['', '', '', '', '', '', '', '', '', ''],
                        dataType: ''
                    }
                ]
            },

            realtimeChartsConfigChartId: 0,

            realtimeChartsConfigTotalChart: 0,

            realtimeChartsConfigBarsPerChart: 0,

            realtimeChartsConfigChartBlock: null,

            dataTypes: [],

            maxCharts: 0,

            maxBarsPerChart: 0
        };
    },
    methods: {
        startTimeIntervel() {
            this.initCharts();
            this.resetCharts();

            this.realtimeDataQueryInfos = [];
            this.realtimeChartsConfig.charts.forEach((chart) => {
                this.realtimeDataQueryInfos.push({
                    siteIds: chart.bars,
                    signalName: chart.dataType
                })
            });

            this.getRealtimeData();

            this.clearInterval();

            this.refreshInterval = window.setInterval(this.getRealtimeData, 5000);
        },

        getRealtimeData() {
            this.loading = true;
            this.loadingText = '数据加载中';

            console.log('RealtimeChart query infos');
            console.log(this.realtimeDataQueryInfos);

            this.realtimeDataQueryInfos.forEach((queryInfo, index) => {
                logService.showRealtimeData(queryInfo).then((res) => {
                    if (res.data.data && res.data.data.realtimeData) {
                        this.renderChart(index, res.data.data.realtimeData);
                    } else {
                        this.resetCharts();
                    }
                    this.loading = false;
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            });
        },

        getSites() {
            siteService.showAll().then((res) => {
                this.siteList = res.data.data.sites.map((site) => {
                    return {
                        siteFullName: site.tunnel + ' - ' + site.location + ' - ' + site.siteName,
                        siteId: site.siteId,
                        siteUUID: site.id,
                        tunnelName: site.tunnel
                    }
                });
                console.log(this.siteList);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        renderChart(index, realtimeData) {
            const title = this.realtimeChartsConfig.charts[index].title;
            const subTitle = this.dataTypes.find((dataType) => {
                return dataType.key === this.realtimeChartsConfig.charts[index].dataType;
            }).label;
            const seriesData = realtimeData;
            const xAxisData = []

            this.realtimeChartsConfig.charts[index].bars.forEach((bar) => {
                const site = this.siteList.find((site) => {
                    return site.siteUUID === bar;
                });

                if (site) {
                    xAxisData.push(site.tunnelName + '\n' + site.siteId + '号站点');
                } else {
                    xAxisData.push('-');
                }
            });

            this.realtimeCharts[index].setOption({ title: { text: title, subtext: subTitle }, xAxis: { data: xAxisData }, series: [{ data: seriesData }] });
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
            for (let i = 0; i < this.realtimeChartsConfig.totalChart; i++) {
                const chartDOMId = 'realtimeChart' + i.toString();
                const chartDOM = echarts.getInstanceByDom(document.getElementById(chartDOMId));
                if (chartDOM) {
                    echarts.dispose(document.getElementById(chartDOMId));
                }
            }

            for (let i = 0; i < this.realtimeChartsConfig.totalChart; i++) {
                const chartDOMId = 'realtimeChart' + i.toString();
                this.realtimeCharts.push(echarts.init(document.getElementById(chartDOMId)));
            }
        },

        getRealtimeChartsConfig() {
            const chartsConfigQuertInfo = {
                userId: this.userId,
                name: 'realtimeChartsConfig'
            }

            console.log(chartsConfigQuertInfo);

            userService.showConf(chartsConfigQuertInfo).then((res) => {
                console.log(res);
                if (res.data.data && res.data.data.conf.conf) {
                    console.log('Use config from server');
                    this.realtimeChartsConfig = JSON.parse(res.data.data.conf.conf);
                } else {
                    console.log('Use config from local');
                    this.realtimeChartsConfig = this.$customConfig.REALTIMECHART_DEFAULT_CONFIG;
                }

                console.log(this.realtimeChartsConfig);

                this.chartLines = Math.ceil(this.realtimeChartsConfig.totalChart / 2);
                this.realtimeChartsConfigTotalChart = this.realtimeChartsConfig.totalChart;
                this.realtimeChartsConfigBarsPerChart = this.realtimeChartsConfig.barsPerChart;
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        updateRealtimeChartsConfig() {
            const chartsConfig = {
                userId: this.userId,
                name: 'realtimeChartsConfig',
                conf: JSON.stringify(this.realtimeChartsConfig)
            }

            console.log(chartsConfig);

            userService.updateConf(chartsConfig).then((res) => {
                console.log(res);
                this.$message.success('图表配置更新成功');
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        showRealtimeChartsConfigDialog1() {
            this.clearInterval();
            this.realtimeChartsConfigChartId = 0;
            this.realtimeChartsConfigDialog1Visible = true;
        },

        onRealtimeChartsConfigDialog1OK() {
            console.log('Local: ' + this.realtimeChartsConfigTotalChart + ' ' + this.realtimeChartsConfigBarsPerChart);
            console.log('Server: ' + this.realtimeChartsConfig.totalChart + ' ' + this.realtimeChartsConfig.barsPerChart);

            if (this.realtimeChartsConfigTotalChart !== this.realtimeChartsConfig.totalChart) {
                if (this.realtimeChartsConfigTotalChart < this.realtimeChartsConfig.totalChart) {
                    this.realtimeChartsConfig.charts.splice(this.realtimeChartsConfigTotalChart, this.realtimeChartsConfig.totalChart - this.realtimeChartsConfigTotalChart);
                } else {
                    const chartBarArray = [];
                    for (let i = 0; i < this.realtimeChartsConfigBarsPerChart; i++) {
                        chartBarArray.push('');
                    }

                    for (let i = this.realtimeChartsConfig.totalChart; i < this.realtimeChartsConfigTotalChart; i++) {
                        const chartBlock = JSON.parse(JSON.stringify(this.realtimeChartsConfigChartBlock));
                        chartBlock.id = i;
                        chartBlock.title = '图表' + (i + 1).toString();
                        chartBlock.bars = JSON.parse(JSON.stringify(chartBarArray));
                        chartBlock.dataType = this.dataTypes[0].key;

                        this.realtimeChartsConfig.charts.push(chartBlock);
                    }
                }

                this.realtimeChartsConfig.totalChart = this.realtimeChartsConfigTotalChart;
                this.realtimeChartsConfig.barsPerChart = this.realtimeChartsConfigBarsPerChart;
                this.chartLines = Math.ceil(this.realtimeChartsConfig.totalChart / 2);
            } else if (this.realtimeChartsConfigBarsPerChart !== this.realtimeChartsConfig.barsPerChart) {
                const chartBarArray = [];
                for (let i = 0; i < this.realtimeChartsConfigBarsPerChart; i++) {
                    chartBarArray.push('');
                }

                this.realtimeChartsConfig.charts.forEach((chart) => {
                    chart.bars = JSON.parse(JSON.stringify(chartBarArray));
                });

                this.realtimeChartsConfig.barsPerChart = this.realtimeChartsConfigBarsPerChart;
            }

            this.realtimeChartsConfigDialog1Visible = false;
            this.realtimeChartsConfigDialog2Visible = true;
        },

        onRealtimeChartsConfigDialog2OK() {
            this.realtimeChartsConfigDialog2Visible = false;
            this.updateRealtimeChartsConfig();
        },

        clearInterval() {
            if (this.refreshInterval) {
                window.clearInterval(this.refreshInterval);
                console.log('RealtimeChart time intervel destroyed');
            }
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userId = user.userId;
        this.getRealtimeChartsConfig();

        this.dataTypes = this.$customConfig.COMMON_DATA_TYPES.analog;
        this.realtimeChartsConfigChartBlock = this.$customConfig.REALTIMECHART_CONFIG_CHART_BLOCK;

        this.maxCharts = this.$customConfig.REALTIMECHART_MAX_CHARTS;
        if (this.maxCharts > 20 || this.maxCharts < 1) {
            this.maxCharts = 20;
        }

        this.maxBarsPerChart = this.$customConfig.REALTIMECHART_MAX_BARS_PER_CHART;
        if (this.maxBarsPerChart > 20 || this.maxBarsPerChart < 1) {
            this.maxBarsPerChart = 20;
        }
    },
    activated() {
        this.getSites();
        if (this.refreshPaused) {
            this.startTimeIntervel();
        }
    },
    deactivated() {
        if (this.refreshInterval) {
            this.refreshPaused = true;
        }
        this.clearInterval();
    },
    destroyed() {
        this.clearInterval();
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

.realtimeChart-chart-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.realtimeChart-inner-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.realtimeChart-row {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.realtimeChart-dialog-select-container {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
}
</style>
