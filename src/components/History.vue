<template>
    <div>
        <el-card v-loading="loading" :element-loading-text="loadingText">
            <div slot="header" class="history-card-header">
                <h2 align="center">历史记录</h2>
                <div>
                    <el-button type="primary" icon="el-icon-share" @click="exportToCSV">导出曲线</el-button>
                    <el-button type="primary" icon="el-icon-document" @click="showHistoryTextDisplayDialog">文本显示</el-button>
                </div>
            </div>

            <div class="history-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>

                <el-date-picker v-model="dateTimeRange" type="datetimerange" :picker-options="pickerOptions" class="history-search-bar-datepicker" :unlink-panels="true"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                <el-button class="history-search-bar-button" icon="el-icon-search" @click="getSiteHistory()">刷新曲线</el-button>
            </div>

            <div id="incidentPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="reflectedPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="pushPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="inputPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="ratedPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="electricCurrentChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="temperatureChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="supplyVoltageChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="standingWaveRatioChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
        </el-card>

        <el-dialog title="历史记录" :visible.sync="historyTextDisplayDialogVisible" width="70%" :close-on-click-modal="false" @close="resetPageNum">
            <el-table :data="logList.slice((logListQueryInfo.pageNum - 1) * logListQueryInfo.pageSize, logListQueryInfo.pageNum * logListQueryInfo.pageSize)" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="dateTime" label="时间"></el-table-column>
                <el-table-column prop="incidentPower" label="入射功率"></el-table-column>
                <el-table-column prop="reflectedPower" label="反射功率"></el-table-column>
                <el-table-column prop="pushPower" label="推动功率"></el-table-column>
                <el-table-column prop="inputPower" label="输入功率"></el-table-column>
                <el-table-column prop="ratedPower" label="额定功率"></el-table-column>
                <el-table-column prop="electricCurrent" label="功放电流"></el-table-column>
                <el-table-column prop="temperature" label="功放温度"></el-table-column>
                <el-table-column prop="supplyVoltage" label="电源电压"></el-table-column>
                <el-table-column prop="standingWaveRatio" label="驻波比"></el-table-column>
            </el-table>

            <el-pagination
                @current-change="handleCurrentPageChange"
                :current-page="logListQueryInfo.pageNum"
                :page-size="logListQueryInfo.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="logList.length"
                class="history-pagination">
            </el-pagination>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="historyTextDisplayDialogVisible=false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import logService from '@/service/logService';
import siteService from '@/service/siteService';
import * as echarts from 'echarts'
import CsvExportor from 'csv-exportor'

export default {
    data() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        return {
            loading: false,

            historyTextDisplayDialogVisible: false,

            loadingText: '',

            siteId: 2,

            dateTimeRange: [start, end],

            pickerOptions: {
                shortcuts: [{
                    text: '24小时',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '一月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            queryInfo: {
                startTime: '',
                endTime: ''
            },

            logList: [],

            logListQueryInfo: {
                pageNum: 1,
                pageSize: 0
            },

            siteList: [],

            selectedSiteUUID: '',

            incidentPowerChart: null,

            reflectedPowerChart: null,

            pushPowerChart: null,

            inputPowerChart: null,

            ratedPowerChart: null,

            electricCurrentChart: null,

            temperatureChart: null,

            supplyVoltageChart: null,

            standingWaveRatioChart: null,

            dataTypes: []
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
                        inputPower: log.inputPower,
                        ratedPower: log.ratedPower,
                        electricCurrent: log.electricCurrent,
                        temperature: log.temperature,
                        supplyVoltage: log.supplyVoltage,
                        standingWaveRatio: log.standingWaveRatio
                    };
                });
                const header = ['时间'];
                this.dataTypes.forEach((dataType) => {
                    header.push(dataType.label);
                });
                CsvExportor.downloadCsv(csvData, { header }, 'history.csv');

                this.loading = false;
            } else {
                this.$message.warning('请先点击刷新曲线获取站点数据');
            }
        },

        showHistoryTextDisplayDialog() {
            if (this.logList.length > 0) {
                this.historyTextDisplayDialogVisible = true;
            } else {
                this.$message.warning('请先点击刷新曲线获取站点数据');
            }
        },

        handleCurrentPageChange(newPage) {
            this.logListQueryInfo.pageNum = newPage;
        },

        resetPageNum() {
            this.logListQueryInfo.pageNum = 1;
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
                        this.$message('该站点在此时间段内没有日志');
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
                        siteUUID: site.siteUUID
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

            const inputPowerValueList = this.logList.map((item) => {
                return item.inputPower;
            });

            const ratedPowerValueList = this.logList.map((item) => {
                return item.ratedPower;
            });

            const electricCurrentList = this.logList.map((item) => {
                return item.electricCurrent;
            });

            const temperatureList = this.logList.map((item) => {
                return item.temperature;
            });

            const supplyVoltageList = this.logList.map((item) => {
                return item.supplyVoltage;
            });

            const standingWaveRatioList = this.logList.map((item) => {
                return item.standingWaveRatio;
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

            this.inputPowerChart.clear();
            this.inputPowerChart.setOption(commonChartOption);
            this.inputPowerChart.setOption({ title: { text: '输入功率' }, series: [{ data: inputPowerValueList }] });

            this.ratedPowerChart.clear();
            this.ratedPowerChart.setOption(commonChartOption);
            this.ratedPowerChart.setOption({ title: { text: '额定功率' }, series: [{ data: ratedPowerValueList }] });

            this.electricCurrentChart.clear();
            this.electricCurrentChart.setOption(commonChartOption);
            this.electricCurrentChart.setOption({ title: { text: '功放电流' }, series: [{ data: electricCurrentList }] });

            this.temperatureChart.clear();
            this.temperatureChart.setOption(commonChartOption);
            this.temperatureChart.setOption({ title: { text: '功放温度' }, series: [{ data: temperatureList }] });

            this.supplyVoltageChart.clear();
            this.supplyVoltageChart.setOption(commonChartOption);
            this.supplyVoltageChart.setOption({ title: { text: '电源电压' }, series: [{ data: supplyVoltageList }] });

            this.standingWaveRatioChart.clear();
            this.standingWaveRatioChart.setOption(commonChartOption);
            this.standingWaveRatioChart.setOption({ title: { text: '驻波比' }, series: [{ data: standingWaveRatioList }] });
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

            this.inputPowerChart.clear();
            this.inputPowerChart.setOption(commonChartOption);
            this.inputPowerChart.setOption({ title: { text: '输入功率' } });

            this.ratedPowerChart.clear();
            this.ratedPowerChart.setOption(commonChartOption);
            this.ratedPowerChart.setOption({ title: { text: '额定功率' } });

            this.electricCurrentChart.clear();
            this.electricCurrentChart.setOption(commonChartOption);
            this.electricCurrentChart.setOption({ title: { text: '功放电流' } });

            this.temperatureChart.clear();
            this.temperatureChart.setOption(commonChartOption);
            this.temperatureChart.setOption({ title: { text: '功放温度' } });

            this.supplyVoltageChart.clear();
            this.supplyVoltageChart.setOption(commonChartOption);
            this.supplyVoltageChart.setOption({ title: { text: '电源电压' } });

            this.standingWaveRatioChart.clear();
            this.standingWaveRatioChart.setOption(commonChartOption);
            this.standingWaveRatioChart.setOption({ title: { text: '驻波比' } });
        },

        initCharts() {
            this.incidentPowerChart = echarts.init(document.getElementById('incidentPowerChart'));
            this.reflectedPowerChart = echarts.init(document.getElementById('reflectedPowerChart'));
            this.pushPowerChart = echarts.init(document.getElementById('pushPowerChart'));
            this.inputPowerChart = echarts.init(document.getElementById('inputPowerChart'));
            this.ratedPowerChart = echarts.init(document.getElementById('ratedPowerChart'));
            this.electricCurrentChart = echarts.init(document.getElementById('electricCurrentChart'));
            this.temperatureChart = echarts.init(document.getElementById('temperatureChart'));
            this.supplyVoltageChart = echarts.init(document.getElementById('supplyVoltageChart'));
            this.standingWaveRatioChart = echarts.init(document.getElementById('standingWaveRatioChart'));
        }
    },
    mounted() {
        this.initCharts();
        this.resetCharts();
    },
    created() {
        this.logListQueryInfo.pageSize = this.$customConfig.HISTORY_PAGE_SIZE;
        this.dataTypes = this.$customConfig.COMMON_DATA_TYPES.analog;
    },
    activated() {
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

.history-pagination {
    margin-top: 15px;
}
</style>
