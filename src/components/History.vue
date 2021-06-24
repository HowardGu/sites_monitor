<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>历史记录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card v-loading="loading" :element-loading-text="loadingText">
            <div slot="header" class="history-card-header">
                <h2 align="center">历史记录</h2>
                <div>
                    <el-button type="primary" icon="el-icon-share" @click="exportToCSV">导出曲线</el-button>
                    <el-button type="primary" icon="el-icon-share">导出报表</el-button>
                </div>
            </div>

            <div class="history-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>

                <el-date-picker v-model="dateTimeRange" type="datetimerange"  class="history-search-bar-datepicker" :unlink-panels="true"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                <el-button class="history-search-bar-button" icon="el-icon-search" @click="getSiteHistory()">刷新曲线</el-button>
            </div>

            <div id="incidentPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="reflectedPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="pushPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="electricCurrentChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="temperatureChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import logService from '@/service/logService';
import siteService from '@/service/siteService';
import * as echarts from 'echarts'
import CsvExportor from 'csv-exportor'

export default {
    data() {
        return {
            loading: false,

            loadingText: '',

            siteId: 2,

            dateTimeRange: '',

            queryInfo: {
                startTime: '',
                endTime: ''
            },

            logList: [],

            siteList: [],

            selectedSiteUUID: '',

            incidentPowerChart: null,

            reflectedPowerChart: null,

            pushPowerChart: null,

            electricCurrentChart: null,

            temperatureChart: null
        };
    },
    methods: {
        exportToCSV() {
            if (this.logList.length > 0) {
                this.loading = true;
                this.loadingText = '数据导出中';

                const csvData = this.logList.map((log) => {
                    return {
                        dateTime: log.dateTime,
                        incidentPower: log.incidentPower,
                        reflectedPower: log.reflectedPower,
                        pushPower: log.pushPower,
                        electricCurrent: log.electricCurrent,
                        temperature: log.temperature
                    };
                });
                const header = ['时间', '入射功率', '反射功率', '推动功率', '功放电流', '功放温度'];
                CsvExportor.downloadCsv(csvData, { header }, 'history.csv');

                this.loading = false;
            } else {
                this.$message.warning('请先点击刷新曲线获取站点数据');
            }
        },

        getSiteHistory() {
            if (this.dateTimeRange !== '' && this.selectedSiteUUID !== '') {
                this.loading = true;
                this.loadingText = '数据加载中';

                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                this.queryInfo.startTime = (new Date(this.dateTimeRange[0] - tzoffset)).toISOString();
                this.queryInfo.endTime = (new Date(this.dateTimeRange[1] - tzoffset)).toISOString();

                logService.showHistory(this.selectedSiteUUID, this.queryInfo).then((res) => {
                    console.log(res);
                    if (res.data.data.logs) {
                        this.logList = res.data.data.logs;
                        this.renderCharts();
                    } else {
                        this.resetCharts();
                        this.$message('站点' + this.siteId + '在此时间段内没有日志');
                    }
                    this.loading = false;
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            } else {
                this.$message.warning('请选择站点和时间');
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

        renderCharts() {
            const dateList = this.logList.map((item) => {
                return item.dateTime;
            });

            const incidentPowerValueList = this.logList.map((item) => {
                return item.incidentPower;
            });

            const reflectedPowerValueList = this.logList.map((item) => {
                return item.reflectedPower;
            });

            const pushPowerValueList = this.logList.map((item) => {
                return item.pushPower;
            });

            const electricCurrentList = this.logList.map((item) => {
                return item.electricCurrent;
            });

            const temperatureList = this.logList.map((item) => {
                return item.temperature;
            });

            const commonChartOption = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: dateList
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'line'
                }]
            };

            this.incidentPowerChart.clear();
            this.incidentPowerChart.setOption(commonChartOption);
            this.incidentPowerChart.setOption({ title: { text: '入射功率' }, series: [{ data: incidentPowerValueList }] });

            this.reflectedPowerChart.clear();
            this.reflectedPowerChart.setOption(commonChartOption);
            this.reflectedPowerChart.setOption({ title: { text: '反射功率' }, series: [{ data: reflectedPowerValueList }] });

            this.pushPowerChart.clear();
            this.pushPowerChart.setOption(commonChartOption);
            this.pushPowerChart.setOption({ title: { text: '推动功率' }, series: [{ data: pushPowerValueList }] });

            this.electricCurrentChart.clear();
            this.electricCurrentChart.setOption(commonChartOption);
            this.electricCurrentChart.setOption({ title: { text: '功放电流' }, series: [{ data: electricCurrentList }] });

            this.temperatureChart.clear();
            this.temperatureChart.setOption(commonChartOption);
            this.temperatureChart.setOption({ title: { text: '功放温度' }, series: [{ data: temperatureList }] });
        },

        resetCharts() {
            const commonChartOption = {
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
                    type: 'line'
                }]
            };

            this.incidentPowerChart.clear();
            this.incidentPowerChart.setOption(commonChartOption);
            this.incidentPowerChart.setOption({ title: { text: '入射功率' } });

            this.reflectedPowerChart.clear();
            this.reflectedPowerChart.setOption(commonChartOption);
            this.reflectedPowerChart.setOption({ title: { text: '反射功率' } });

            this.pushPowerChart.clear();
            this.pushPowerChart.setOption(commonChartOption);
            this.pushPowerChart.setOption({ title: { text: '推动功率' } });

            this.electricCurrentChart.clear();
            this.electricCurrentChart.setOption(commonChartOption);
            this.electricCurrentChart.setOption({ title: { text: '功放电流' } });

            this.temperatureChart.clear();
            this.temperatureChart.setOption(commonChartOption);
            this.temperatureChart.setOption({ title: { text: '功放温度' } });
        },

        initCharts() {
            this.incidentPowerChart = echarts.init(document.getElementById('incidentPowerChart'));
            this.reflectedPowerChart = echarts.init(document.getElementById('reflectedPowerChart'));
            this.pushPowerChart = echarts.init(document.getElementById('pushPowerChart'));
            this.electricCurrentChart = echarts.init(document.getElementById('electricCurrentChart'));
            this.temperatureChart = echarts.init(document.getElementById('temperatureChart'));
        }
    },
    mounted() {
        this.initCharts();
        this.resetCharts();
    },
    created() {
        this.getSites();
    }
}
</script>

<style lang="less" scoped>
.history-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-search-bar {
    display: flex;
    align-items: center;
}

.history-search-bar-button {
    margin-left: 10px;
}

.history-search-bar-datepicker {
    margin-left: 10px;
}

.el-select {
    width: 400px;
}
</style>
