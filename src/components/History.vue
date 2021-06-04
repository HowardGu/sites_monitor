<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>历史记录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="history-card-header">
                <span>历史记录</span>
                <div>
                    <el-button type="primary" icon="el-icon-share" @click="exportToCSV">导出曲线</el-button>
                    <el-button type="primary" icon="el-icon-share">导出报表</el-button>
                </div>
            </div>

            <div class="history-search-bar">
                <el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                <el-date-picker v-model="dateTimeRange" type="datetimerange"  class="history-search-bar-datepicker" :unlink-panels="true"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                <el-button class="history-search-bar-button" icon="el-icon-search" @click="getSiteHistory(siteId)">刷新曲线</el-button>
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
import * as echarts from 'echarts'
import CsvExportor from 'csv-exportor'

export default {
    data() {
        return {
            siteId: 2,

            dateTimeRange: '',

            queryInfo: {
                startTime: '',
                endTime: ''
            },

            logList: [
            ],

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
            } else {
                this.$message('请先点击刷新曲线获取站点数据');
            }
        },

        async getSiteHistory(siteId) {
            this.queryInfo.startTime = (new Date(this.dateTimeRange[0])).toISOString();
            this.queryInfo.endTime = (new Date(this.dateTimeRange[1])).toISOString();
            try {
                logService.showHistory(siteId, this.queryInfo).then((res) => {
                    console.log(res);
                    if (res.data.data.logs) {
                        this.logList = res.data.data.logs;
                        this.renderCharts();
                    } else {
                        this.resetCharts();
                        this.$message('站点' + this.siteId + '在此时间段内没有日志');
                    }
                }).catch((err) => {
                    this.$message.error(err.response.data.msg);
                });
            } catch (err) {
                return this.$message.error(err.response.data.msg);
            }
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
</style>
