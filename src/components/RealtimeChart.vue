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
                    <el-button type="primary" icon="el-icon-setting" @click="realtimeChartsConfigDialog1Visible = true">图表设置</el-button>
                </div>
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
                            <el-option v-for="i of 10" :label="i" :value="i" :key="i"></el-option>
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
                            <el-option v-for="i of 10" :label="i" :value="i" :key="i"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onRealtimeChartsConfigDialog1OK()">确定</el-button>
                <el-button @click="realtimeChartsConfigDialog1Visible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="图表设置" :visible.sync="realtimeChartsConfigDialog2Visible" width="50%" top="5vh" :close-on-click-modal="false">
            <el-card class="realtimeChart-inner-card">
                <div class="realtimeChart-row">
                    <el-select v-model="realtimeChartsConfigChartId" placeholder="请选择图表">
                        <el-option v-for="i of realtimeChartsConfig.totalChart" :label="'图表' + i.toString()" :value="i - 1" :key="i - 1"></el-option>
                    </el-select>
                </div>

                <el-divider></el-divider>

                <div class="realtimeChart-row">
                    <el-select v-model="realtimeChartsConfig.charts[realtimeChartsConfigChartId].dataType" placeholder="请选择数据类型">
                        <el-option v-for="dataType of dataTypes" :label="dataType.name" :value="dataType.id" :key="dataType.id"></el-option>
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

            realtimeChartsInited: false,

            realtimeChartsConfigChartId: 0,

            realtimeChartsConfigTotalChart: 0,

            realtimeChartsConfigBarsPerChart: 0,

            dataTypes: []
        };
    },
    methods: {
        startTimeIntervel() {
            if (this.selectedSiteUUID !== '') {
                this.initChart();
                this.resetChart();

                this.getRealtimeData();

                if (this.refreshInterval) {
                    window.clearInterval(this.refreshInterval);
                }

                this.refreshInterval = window.setInterval(this.getRealtimeData, 5000);
            } else {
                this.$message.warning('请选择站点');
            }
        },

        getRealtimeData() {
            if (this.selectedSiteUUID !== '') {
                this.loading = true;
                this.loadingText = '数据加载中';

                console.log(this.selectedSiteUUID);

                logService.showRealtimeLog(this.selectedSiteUUID).then((res) => {
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

            this.realtimeCharts[0].setOption({ series: [{ data: xAxisData }] });
        },

        resetChart() {
            this.realtimeCharts.forEach((realtimeChart) => {
                realtimeChart.clear();
                realtimeChart.setOption(this.chartOption);
            });
        },

        initChart() {
            if (!this.realtimeChartsInited) {
                console.log('Init Charts...');
                this.realtimeCharts = [];
                for (let i = 0; i < this.realtimeChartsConfig.totalChart; i++) {
                    this.realtimeCharts.push(echarts.init(document.getElementById('realtimeChart' + i.toString())));
                }

                this.realtimeChartsInited = true;
            }
        },

        getRealtimeChartsConfig() {
            fetch(process.env.BASE_URL + 'realtimeChartsConfig.json').then((data) => {
                data.json().then((customConfig) => {
                    console.log(customConfig);
                    this.realtimeChartsConfig = customConfig;
                    this.chartLines = Math.ceil(customConfig.totalChart / 2);
                    this.realtimeChartsConfigTotalChart = customConfig.totalChart;
                    this.realtimeChartsConfigBarsPerChart = customConfig.barsPerChart;
                    console.log('Chart Line: ' + this.chartLines);
                })
            });
        },

        onRealtimeChartsConfigDialog1OK() {
            console.log('Local: ' + this.realtimeChartsConfigTotalChart + ' ' + this.realtimeChartsConfigBarsPerChart);
            console.log('Server: ' + this.realtimeChartsConfig.totalChart + ' ' + this.realtimeChartsConfig.barsPerChart);
            this.realtimeChartsConfigDialog1Visible = false;
            this.realtimeChartsConfigDialog2Visible = true;
        },

        onRealtimeChartsConfigDialog2OK() {
            this.realtimeChartsConfigDialog2Visible = false;
            this.updateRealtimeChartsConfig();
        },

        updateRealtimeChartsConfig() {
            this.$message.success('图表配置更新成功');
        }
    },
    created() {
        this.getRealtimeChartsConfig();
        this.getSites();
        this.dataTypes = this.$customConfig.COMMON_DATA_TYPES;
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

.realtimeChart-chart-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.realtimeChart-inner-card {
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.realtimeChart-inner-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
