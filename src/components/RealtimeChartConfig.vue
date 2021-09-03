<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实时配置</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="realtimeChartConfig-card-header">
                <h2 align="center">实时配置</h2>
            </div>

            <div>
                <el-row :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>实时页面：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="pageId" placeholder="请选择页面">
                            <el-option v-for="i of realtimeChartsConfig.pageCount" :label="'页面' + i.toString()" :value="i - 1" :key="i - 1"></el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>选择图表：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="chartId" placeholder="请选择图表">
                            <el-option v-for="i of chartsPerPage" :label="'图表' + i.toString()" :value="i - 1" :key="i - 1"></el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-row :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>数据类型：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="realtimeChartsConfig.pages[pageId].charts[chartId].dataType" placeholder="请选择数据类型">
                            <el-option v-for="dataType of dataTypes" :label="dataType.label" :value="dataType.key" :key="dataType.key"></el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>功率上限：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="realtimeChartsConfig.pages[pageId].charts[chartId].yAxisMax" placeholder="功率上限"></el-input>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>图表标题：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="realtimeChartsConfig.pages[pageId].charts[chartId].title" placeholder="图表标题"></el-input>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row v-for="i of barsPerChart" :key="i" :gutter="5" class="realtimeChartConfig-row">
                    <el-col :span="3">
                        <span>{{ '数据项' + i + '：' }}</span>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="realtimeChartsConfig.pages[pageId].charts[chartId].bars[i - 1]" :placeholder="'第' + i.toString() + '个数据项'" :clearable="true">
                            <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                                <span style="float: left">{{ site.siteFullName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <div class="realtimeChartConfig-row">
                    <el-button type="primary" @click="updateRealtimeChartsConfig()">确定</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import siteService from '@/service/siteService';
import userService from '@/service/userService';
import storageService from '@/service/storageService';

export default {
    data() {
        return {
            userId: 0,

            siteList: [],

            realtimeChartsConfig: {
                pageCount: 0,
                pages: [
                    {
                        charts: [
                            {
                                id: 0,
                                title: '',
                                bars: ['', '', '', '', '', '', '', '', '', ''],
                                dataType: '',
                                yAxisMax: null
                            }
                        ]
                    }
                ]
            },

            pageId: 0,

            chartId: 0,

            dataTypes: [],

            chartsPerPage: 6,

            barsPerChart: 10,

            siteMap: null
        };
    },
    methods: {
        getSites() {
            siteService.showAll().then((res) => {
                this.siteList = res.data.data.sites.map((site) => {
                    return {
                        siteFullName: site.tunnel + ' - ' + site.location + ' - ' + site.siteName,
                        siteId: site.siteId,
                        siteUUID: site.siteUUID,
                        tunnelName: site.tunnel
                    }
                });
                console.log(this.siteList);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        getRealtimeChartsConfig() {
            const chartsConfigQuertInfo = {
                userId: this.userId,
                name: 'realtimeChartsConfig'
            }

            console.log(chartsConfigQuertInfo);

            userService.showConf(chartsConfigQuertInfo).then((res) => {
                console.log(res);
                if (res.data.data && res.data.data.conf.conf) {
                    console.log('Use RealtimeCharts config from server');
                    this.realtimeChartsConfig = JSON.parse(res.data.data.conf.conf);
                } else {
                    console.log('Use RealtimeCharts config from local');
                    this.realtimeChartsConfig = this.$customConfig.REALTIMECHART_DEFAULT_CONFIG;
                }

                console.log(this.realtimeChartsConfig);
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        updateRealtimeChartsConfig() {
            const chartsConfig = {
                userId: this.userId,
                name: 'realtimeChartsConfig',
                conf: JSON.stringify(this.realtimeChartsConfig)
            }

            console.log(chartsConfig);

            userService.updateConf(chartsConfig).then((res) => {
                console.log(res);
                this.$message.success('图表配置更新成功');
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userId = user.userId;
        this.getRealtimeChartsConfig();

        this.dataTypes = this.$customConfig.COMMON_DATA_TYPES.analog;
    },
    activated() {
        this.getSites();
    }
}
</script>

<style lang="less" scoped>
.realtimeChartConfig-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-select {
    width: 400px;
}

.realtimeChartConfig-row {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.realtimeChartConfig-dialog-container {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
}
</style>
