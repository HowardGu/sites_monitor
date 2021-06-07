<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>报警日志</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="logs-card-header">
                <span>报警日志</span>
            </div>

            <div class="logs-search-bar">
                <el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getSiteLogs(siteId)">查询</el-button>
                <el-button class="logs-search-bar-button" icon="el-icon-search" @click="getLogs()">查询所有站点</el-button>
            </div>

            <el-table :data="logList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="siteId" label="站点号"></el-table-column>
                <el-table-column prop="alertState" label="报警状态"></el-table-column>
                <el-table-column prop="dateTime" label="时间"></el-table-column>
                <el-table-column prop="incidentAlerts" label="入射报警"></el-table-column>
                <el-table-column prop="reflectedAlerts" label="反射报警"></el-table-column>
                <el-table-column prop="pushAlerts" label="推动报警"></el-table-column>
                <el-table-column prop="incidentPower" label="入射功率"></el-table-column>
                <el-table-column prop="reflectedPower" label="反射功率"></el-table-column>
                <el-table-column prop="pushPower" label="推动功率"></el-table-column>
                <el-table-column prop="electricCurrent" label="功放电流"></el-table-column>
                <el-table-column prop="temperature" label="功放温度"></el-table-column>
                <el-table-column prop="onlineState" label="在线状态"></el-table-column>
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
import logService from '@/service/logService';
export default {
    data() {
        return {
            siteId: 1,

            queryInfo: {
                pageNum: 1,
                pageSize: 10
            },

            logList: [
            ],

            totalCount: 50
        };
    },
    methods: {
        handleCurrentPageChange(newPage) {
            console.log(newPage);
            this.queryInfo.pageNum = newPage;
        },

        async getLogs() {
            logService.showAll(this.queryInfo).then((res) => {
                console.log(res);
                this.logList = res.data.data.logs;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return this.$message.error(err.response.data.msg);
            })
        },

        async getSiteLogs(siteId) {
            logService.show(siteId, this.queryInfo).then((res) => {
                console.log(res);
                this.logList = res.data.data.logs;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return this.$message.error(err.response.data.msg);
            })
        }
    },
    created() {
        this.getLogs();
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
</style>
