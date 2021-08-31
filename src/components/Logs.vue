<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>报警日志</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="logs-card-header">
                <h2 align="center">报警日志</h2>
                <div>
                    <el-button type="primary" icon="el-icon-setting" @click="showLogsConfigDialog()">日志筛选</el-button>
                </div>
            </div>

            <div class="logs-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>

                <el-date-picker v-model="dateTimeRange" type="datetimerange" :picker-options="pickerOptions" class="logs-search-bar-datepicker" :unlink-panels="true"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getSiteAlerts(1)">查询</el-button>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getAlerts(1)">查询所有站点</el-button>
            </div>

            <el-table :data="alertList" :border="true" :cell-class-name="rowClass" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="siteId" label="站点号"></el-table-column>
                <el-table-column prop="alertState" label="报警状态" :formatter="formatAlertState"></el-table-column>
                <el-table-column prop="dateTime" label="时间"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('IncidentAlerts') === -1" prop="incidentAlerts" label="入射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('ReflectedAlerts') === -1" prop="reflectedAlerts" label="反射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('PushAlerts') === -1" prop="pushAlerts" label="推动报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('IncidentPower') === -1" prop="incidentPower" label="入射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('ReflectedPower') === -1" prop="reflectedPower" label="反射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('PushPower') === -1" prop="pushPower" label="推动功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('InputPower') === -1" prop="inputPower" label="输入功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('RatedPower') === -1" prop="ratedPower" label="额定功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('ElectricCurrent') === -1" prop="electricCurrent" label="功放电流" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('Temperature') === -1" prop="temperature" label="功放温度" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('SupplyVoltage') === -1" prop="supplyVoltage" label="电源电压" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('StandingWaveRatio') === -1" prop="standingWaveRatio" label="驻波比" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('OfflineAlert') === -1" prop="offlineAlert" label="在线状态" :formatter="formatOfflineState"></el-table-column>
            </el-table>

            <el-pagination
                @current-change="handleCurrentPageChange"
                :current-page="queryInfo.pageNum"
                :page-size="queryInfo.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalCount"
                class="logs-pagination">
            </el-pagination>
        </el-card>

        <el-dialog title="日志筛选" :visible.sync="logsConfigDialogVisible" width="800px" :close-on-click-modal="false">
            <el-card class="logs-inner-card">
                <el-transfer v-model="logsConfigIngoreData" :data="logsConfigItems"
                :titles="['显示', '隐藏']" :button-texts="['显示', '隐藏']"></el-transfer>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onLogsConfigDialogOK()">确定</el-button>
                <el-button @click="onLogsConfigDialogCancel()">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import alertService from '@/service/alertService';
import siteService from '@/service/siteService';
import userService from '@/service/userService';
import storageService from '@/service/storageService';
export default {
    data() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);

        return {
            userId: 0,

            selectedSiteUUID: '',

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
                pageNum: 1,
                pageSize: 0
            },

            historyQueryInfo: {
                startTime: '',
                endTime: ''
            },

            alertList: [],

            siteList: [],

            totalCount: 0,

            logsConfigDialogVisible: false,

            logsConfigItems: [],

            logsConfigIngoreData: [],

            originalLogsConfigIngoreData: []
        };
    },
    methods: {
        handleCurrentPageChange(newPage) {
            if (this.selectedSiteUUID !== '') {
                this.getSiteAlerts(newPage);
            } else {
                this.getAlerts(newPage);
            }
        },

        getAlerts(pageNum) {
            this.queryInfo.pageNum = pageNum;
            this.selectedSiteUUID = '';
            if (this.dateTimeRange) {
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                this.historyQueryInfo.startTime = (new Date(this.dateTimeRange[0] - tzoffset)).toISOString();
                this.historyQueryInfo.endTime = (new Date(this.dateTimeRange[1] - tzoffset)).toISOString();
            } else {
                this.historyQueryInfo.startTime = '';
                this.historyQueryInfo.endTime = '';
            }
            alertService.showAll(this.queryInfo, this.historyQueryInfo).then((res) => {
                this.alertList = res.data.data.alerts;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getSiteAlerts(pageNum) {
            this.queryInfo.pageNum = pageNum;
            if (this.selectedSiteUUID !== '') {
                if (this.dateTimeRange) {
                    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                    this.historyQueryInfo.startTime = (new Date(this.dateTimeRange[0] - tzoffset)).toISOString();
                    this.historyQueryInfo.endTime = (new Date(this.dateTimeRange[1] - tzoffset)).toISOString();
                } else {
                    this.historyQueryInfo.startTime = '';
                    this.historyQueryInfo.endTime = '';
                }

                alertService.show(this.selectedSiteUUID, this.queryInfo, this.historyQueryInfo).then((res) => {
                    this.alertList = res.data.data.alerts;
                    this.totalCount = res.data.data.totalCount;
                }).catch((err) => {
                    return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                })
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
                        siteUUID: site.siteUUID
                    }
                });
                console.log(this.siteList);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        formatAlertState: function(row, column, cellValue) {
            var ret = ''
            if (cellValue) {
                ret = '报警开始'
            } else {
                ret = '报警解除'
            }
            return ret;
        },

        formatAlert: function(row, column, cellValue) {
            var ret = ''
            if (cellValue) {
                ret = '异常'
            } else {
                ret = '正常'
            }
            return ret;
        },

        formatOfflineState: function(row, column, cellValue) {
            var ret = ''
            if (cellValue) {
                ret = '掉线'
            } else {
                ret = '在线'
            }
            return ret;
        },

        rowClass: function({ row, column, rowIndex, columnIndex }) {
            const columnProperty = this.alertList[rowIndex][column.property];
            if (column.property !== 'siteId' && column.property !== 'dateTime') {
                if (columnProperty) {
                    return 'logs-cell-warning';
                }
            }
        },

        showLogsConfigDialog() {
            this.logsConfigDialogVisible = true;
            this.originalLogsConfigIngoreData = JSON.parse(JSON.stringify(this.logsConfigIngoreData));
        },

        onLogsConfigDialogOK() {
            this.logsConfigDialogVisible = false;
            this.originalLogsConfigIngoreData = JSON.parse(JSON.stringify(this.logsConfigIngoreData));
            this.updateLogsConfig();
        },

        onLogsConfigDialogCancel() {
            this.logsConfigDialogVisible = false;
            this.logsConfigIngoreData = JSON.parse(JSON.stringify(this.originalLogsConfigIngoreData));
        },

        updateLogsConfig() {
            const logsConfig = {
                userId: this.userId,
                name: 'logsConfig',
                conf: JSON.stringify(this.logsConfigIngoreData)
            }

            console.log(logsConfig);

            userService.updateConf(logsConfig).then((res) => {
                console.log(res);
                this.$message.success('日志筛选更新成功');
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getLogsConfig() {
            const logsConfigQuertInfo = {
                userId: this.userId,
                name: 'logsConfig'
            }

            console.log(logsConfigQuertInfo);

            userService.showConf(logsConfigQuertInfo).then((res) => {
                console.log(res);
                if (res.data.data && res.data.data.conf.conf) {
                    console.log('Use logs config from server');
                    this.logsConfigIngoreData = JSON.parse(res.data.data.conf.conf);
                }

                console.log(this.logsConfigIngoreData);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userId = user.userId;

        this.queryInfo.pageSize = Number(this.$customConfig.LOGS_PAGE_SIZE);

        const digitalTypes = this.$customConfig.COMMON_DATA_TYPES.digital;
        const analogTypes = this.$customConfig.COMMON_DATA_TYPES.analog;
        const stateTypes = this.$customConfig.COMMON_DATA_TYPES.state;

        this.logsConfigItems = [];

        digitalTypes.forEach((item) => {
            item.disabled = false;
            this.logsConfigItems.push(item);
        });

        analogTypes.forEach((item) => {
            item.disabled = false;
            this.logsConfigItems.push(item);
        });

        stateTypes.forEach((item) => {
            item.disabled = false;
            this.logsConfigItems.push(item);
        });

        console.log(this.logsConfigItems);

        this.getLogsConfig();
    },
    activated() {
        this.getSites();
    }
}
</script>

<style lang="less" scoped>
.logs-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logs-search-bar {
    display: flex;
    align-items: center;
}

.logs-search-bar-datepicker {
    margin-left: 10px;
}

.logs-search-bar-button {
    margin-left: 10px;
}

.logs-pagination {
    margin-top: 15px;
}

.el-select {
    width: 400px;
}

.logs-inner-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    display: flex;
    justify-content: center;
}
</style>

<style lang="less">
.logs-cell-warning {
    color: #FF4136;
}
</style>
