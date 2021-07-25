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
                    <el-button type="primary" icon="el-icon-setting" @click="logsConfigDialogVisible = true">日志筛选</el-button>
                </div>
            </div>

            <div class="logs-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>

                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getSiteAlerts()">查询</el-button>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getAlerts()">查询所有站点</el-button>
            </div>

            <el-table :data="alertList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="siteId" label="站点号"></el-table-column>
                <el-table-column prop="alertState" label="报警状态" :formatter="formatAlertState"></el-table-column>
                <el-table-column prop="dateTime" label="时间"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('incidentAlerts') === -1" prop="incidentAlerts" label="入射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('reflectedAlerts') === -1" prop="reflectedAlerts" label="反射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('pushAlerts') === -1" prop="pushAlerts" label="推动报警" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('incidentPower') === -1" prop="incidentPower" label="入射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('reflectedPower') === -1" prop="reflectedPower" label="反射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('pushPower') === -1" prop="pushPower" label="推动功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('electricCurrent') === -1" prop="electricCurrent" label="功放电流" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('temperature') === -1" prop="temperature" label="功放温度" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('supplyVoltage') === -1" prop="supplyVoltage" label="电源电压" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('inputPower') === -1" prop="inputPower" label="输入功率" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('standingWaveRatio') === -1" prop="standingWaveRatio" label="驻波比" :formatter="formatAlert"></el-table-column>
                <el-table-column v-if="logsConfigIngoreData.indexOf('offlineAlert') === -1" prop="offlineAlert" label="在线状态" :formatter="formatOfflineState"></el-table-column>
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

        <el-dialog title="日志筛选" :visible.sync="logsConfigDialogVisible" width="30%" :close-on-click-modal="false">
            <el-card class="logs-inner-card">
                <el-transfer v-model="logsConfigIngoreData" :data="logsConfigData"
                :titles="['显示', '隐藏']" :button-texts="['显示', '隐藏']"></el-transfer>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="logsConfigDialogVisible = false">确定</el-button>
                <el-button @click="logsConfigDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import alertService from '@/service/alertService';
import siteService from '@/service/siteService';
export default {
    data() {
        return {
            selectedSiteUUID: '',

            queryInfo: {
                pageNum: 1,
                pageSize: 0
            },

            alertList: [],

            siteList: [],

            totalCount: 0,

            logsConfigDialogVisible: false,

            logsConfigData: [
                {
                    key: 'incidentAlerts',
                    label: '入射报警',
                    disabled: false
                },
                {
                    key: 'reflectedAlerts',
                    label: '反射报警',
                    disabled: false
                },
                {
                    key: 'pushAlerts',
                    label: '推动报警',
                    disabled: false
                },
                {
                    key: 'IncidentPower',
                    label: '入射功率',
                    disabled: false
                },
                {
                    key: 'ReflectedPower',
                    label: '反射功率',
                    disabled: false
                },
                {
                    key: 'PushPower',
                    label: '推动功率',
                    disabled: false
                },
                {
                    key: 'InputPower',
                    label: '输入功率',
                    disabled: false
                },
                {
                    key: 'RatedPower',
                    label: '额定功率',
                    disabled: false
                },
                {
                    key: 'ElectricCurrent',
                    label: '功放电流',
                    disabled: false
                },
                {
                    key: 'Temperature',
                    label: '功放温度',
                    disabled: false
                },
                {
                    key: 'SupplyVoltage',
                    label: '电源电压',
                    disabled: false
                },
                {
                    key: 'StandingWaveRatio',
                    label: '驻波比',
                    disabled: false
                },
                {
                    key: 'offlineAlert',
                    label: '在线状态',
                    disabled: false
                }
            ],

            logsConfigIngoreData: []
        };
    },
    methods: {
        handleCurrentPageChange(newPage) {
            this.queryInfo.pageNum = newPage;
            if (this.selectedSiteUUID !== '') {
                this.getSiteAlerts();
            } else {
                this.getAlerts();
            }
        },

        getAlerts() {
            alertService.showAll(this.queryInfo).then((res) => {
                this.alertList = res.data.data.alerts;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getSiteAlerts() {
            if (this.selectedSiteUUID !== '') {
                alertService.show(this.selectedSiteUUID, this.queryInfo).then((res) => {
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
                        siteUUID: site.id
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
        }
    },
    created() {
        this.queryInfo.pageSize = Number(this.$customConfig.LOGS_PAGE_SIZE);
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
