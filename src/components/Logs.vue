<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>报警日志</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="logs-card-header">
                <h2 align="center">报警日志</h2>
            </div>

            <div class="logs-search-bar">
                <el-select v-model="selectedSiteUUID" placeholder="请选择站点">
                    <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                        <span style="float: left">{{ site.siteFullName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                    </el-option>
                </el-select>

                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getSiteLogs()">查询</el-button>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getLogs()">查询所有站点</el-button>
            </div>

            <el-table :data="alertList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="siteId" label="站点号"></el-table-column>
                <el-table-column prop="alertState" label="报警状态" :formatter="formatAlertState"></el-table-column>
                <el-table-column prop="dateTime" label="时间"></el-table-column>
                <el-table-column prop="incidentAlerts" label="入射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="reflectedAlerts" label="反射报警" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="pushAlerts" label="推动报警" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="incidentPower" label="入射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="reflectedPower" label="反射功率" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="pushPower" label="推动功率" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="electricCurrent" label="功放电流" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="temperature" label="功放温度" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="supplyVoltage" label="电源电压" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="inputPower" label="输入功率" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="standingWaveRatio" label="驻波比" :formatter="formatAlert"></el-table-column>
                <el-table-column prop="offlineAlert" label="在线状态" :formatter="formatOfflineState"></el-table-column>
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
                pageSize: Number(process.env.VUE_APP_LOGS_PAGE_SIZE)
            },

            alertList: [],

            siteList: [],

            totalCount: 0
        };
    },
    methods: {
        handleCurrentPageChange(newPage) {
            console.log(newPage);
            this.queryInfo.pageNum = newPage;
        },

        getLogs() {
            alertService.showAll(this.queryInfo).then((res) => {
                console.log(res);
                this.alertList = res.data.data.alerts;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getSiteLogs() {
            if (this.selectedSiteUUID !== '') {
                alertService.show(this.selectedSiteUUID, this.queryInfo).then((res) => {
                    console.log(res);
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
                // this.selectedSiteUUID = this.siteList[0].siteUUID;
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
</style>
