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
                    <el-button type="primary" icon="el-icon-share" @click="exportToCSV">导出曲线</el-button>
                    <el-button type="primary" icon="el-icon-share">导出报表</el-button>
                </div>
            </div>

            <div class="history-refresh-bar">
                <el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                <el-date-picker v-model="dateTimeRange" type="datetimerange"  class="history-refresh-bar-datepicker"
                    start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['12:00:00']"></el-date-picker>
                <el-button class="history-refresh-bar-button" icon="el-icon-search">刷新曲线</el-button>
            </div>

            <div id="incidentPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
            <div id="reflectedPowerChart" style="margin-top: 50px; width: 100%; height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import CsvExportor from 'csv-exportor'

export default {
    data() {
        return {
            siteId: 1,
            dateTimeRange: '',
            powerList: [
                { dateTime: '2000-06-05 13:05:13', incidentPower: 116, reflectedPower: 55 },
                { dateTime: '2000-06-06 14:05:13', incidentPower: 45, reflectedPower: 111 },
                { dateTime: '2000-06-07 15:05:13', incidentPower: 99, reflectedPower: 13 },
                { dateTime: '2000-06-08 16:05:13', incidentPower: 234, reflectedPower: 54 }
            ]
        };
    },
    methods: {
        exportToCSV() {
            const header = ['时间', '入射功率', '反射功率'];
            CsvExportor.downloadCsv(this.powerList, { header }, 'history.csv');
        }
    },
    mounted() {
        const dateList = this.powerList.map((item) => {
            return item.dateTime;
        });

        const incidentPowerValueList = this.powerList.map((item) => {
            return item.incidentPower;
        });

        const reflectedPowerValueList = this.powerList.map((item) => {
            return item.reflectedPower;
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
    align-items: center;
}

.history-refresh-bar-button {
    margin-left: 10px;
}

.history-refresh-bar-datepicker {
    margin-left: 10px;
}
</style>
