<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>历史记录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div slot="header" class="history-header">
                <span>历史记录</span>
                <div>
                    <el-button type="primary" icon="el-icon-share">导出曲线</el-button>
                    <el-button type="primary" icon="el-icon-share">导出报表</el-button>
                </div>
            </div>

            <div class="history-refresh-bar">
                <div>
                    <el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                    <el-date-picker v-model="dateTimeRange" type="datetimerange"  class="history-refresh-bar-datepicker"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                    <el-button class="history-refresh-bar-button" icon="el-icon-search">刷新曲线</el-button>
                </div>
            </div>

            <div id="incidentPowerChart" style="margin-top: 50px; width: 800px; height:400px;"></div>
            <div id="reflectedPowerChart" style="margin-top: 50px; width: 800px; height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    data() {
        return {
            siteId: 1,
            dateTimeRange: '',
            powerList: [
                ['2000-06-05', 116, 55],
                ['2000-06-06', 129, 99],
                ['2000-06-07', 135, 66],
                ['2000-06-08', 86, 10]
            ]
        };
    },
    mounted() {
        const dateList = this.powerList.map((item) => {
            return item[0];
        });

        const incidentPowerValueList = this.powerList.map((item) => {
            return item[1];
        });

        const reflectedPowerValueList = this.powerList.map((item) => {
            return item[2];
        });

        const incidentPowerChart = echarts.init(document.getElementById('incidentPowerChart'));

        const incidentPowerOption = {
            title: {
                text: '入射功率'
            },
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
                data: incidentPowerValueList,
                type: 'line'
            }]
        };

        incidentPowerChart.setOption(incidentPowerOption);

        const reflectedPowerChart = echarts.init(document.getElementById('reflectedPowerChart'));

        const reflectedPowerOption = {
            title: {
                text: '反射功率'
            },
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
                data: reflectedPowerValueList,
                type: 'line'
            }]
        };

        reflectedPowerChart.setOption(reflectedPowerOption);
    }
}
</script>

<style lang="less" scoped>
.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-refresh-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-refresh-bar-button {
    margin-left: 10px;
}

.history-refresh-bar-datepicker {
    margin-left: 10px;
}
</style>
