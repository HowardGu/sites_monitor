<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="siteInfo-card-header">
                <span>站点详情</span>
            </div>

            <el-select v-model="selectedSiteUUID" placeholder="请选择站点" @change="getSiteInfo()">
                <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                    <span style="float: left">{{ site.siteFullName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                </el-option>
            </el-select>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>基础信息</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>站点号： {{ siteData.siteId }}</span></el-col>
                    <el-col :span="6"><span>版本号：</span></el-col>
                    <el-col :span="6"><span>时钟： {{ siteData.dateTime }}</span></el-col>
                    <el-col :span="6"><span>状态：</span></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>隧道： {{ siteData.tunnel }}</span></el-col>
                    <el-col :span="6"><span>地段： {{ siteData.location }}</span></el-col>
                    <el-col :span="6"><span>站点： {{ siteData.siteName }}</span></el-col>
                    <el-col :span="6"><span>描述： {{ siteData.description }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>设备管理</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><el-button @click="getSiteInfo()" icon="el-icon-search">读取信息</el-button></el-col>
                    <el-col :span="6" v-if="userGroup !=='guest'"><el-button @click="siteControllingDialogVisible = true" icon="el-icon-setting">站点控制</el-button></el-col>
                    <el-col :span="6" v-if="userGroup !=='guest'"><el-button @click="siteSettingDialogVisible = true" icon="el-icon-setting">站点设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>数字量</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射报警： {{ siteData.incidentAlerts }}</span></el-col>
                    <el-col :span="6"><span>反射报警： {{ siteData.reflectedAlerts }}</span></el-col>
                    <el-col :span="6"><span>推动报警： {{ siteData.pushAlerts }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>模拟量</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射功率(W)： {{ siteData.incidentPower }}</span></el-col>
                    <el-col :span="6"><span>反射功率(W)： {{ siteData.reflectedPower }}</span></el-col>
                    <el-col :span="6"><span>推动功率(mW)： {{ siteData.pushPower }}</span></el-col>
                    <el-col :span="6"><span>功放电流(A)： {{ siteData.electricCurrent }}</span></el-col>
                    <el-col :span="6"><span>功放温度(℃)： {{ siteData.temperature }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>控制状态</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>报警状态： {{ siteData.alertState }}</span></el-col>
                    <el-col :span="6"><span>在线状态： {{ siteData.onlineState }}</span></el-col>
                </el-row>
            </el-card>
        </el-card>

        <el-dialog title="站点控制" :visible.sync="siteControllingDialogVisible" width="50%" :close-on-click-modal="false">
            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>设备信息</span>
                    <el-button type="primary">重启设备</el-button>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>站点号(1 ~ 99999)：</span></el-col>
                    <el-col :span="12"><el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number></el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>时钟：</span>
                    </el-col>
                    <el-col :span="12">
                        <el-date-picker v-model="siteControllingData.dateTime" type="datetime" placeholder="选择日期时间" :default-time="['12:00:00']"></el-date-picker>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>服务器：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteControllingData.serverAddress" placeholder="服务器地址"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteControllingData.serverPort" placeholder="服务器端口"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>设备控制</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>开关状态：</span></el-col>
                    <el-col :span="6">
                        <el-select v-model="siteControllingData.onOffState" placeholder="请选择开关状态">
                            <el-option label="关机" :value="false"></el-option>
                            <el-option label="开机" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>额定功率(W)：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteControllingData.ratedPower"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button @click="siteControllingDialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="站点设置" :visible.sync="siteSettingDialogVisible" width="50%" :close-on-click-modal="false">
            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>报警电平设置</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>入射报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select v-model="siteSettingData.incidentAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>反射报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select v-model="siteSettingData.reflectedAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>推动报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select v-model="siteSettingData.pushAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>报警上下限设置</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>入射功率：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.incidentPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.incidentPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>反射功率：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.reflectedPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.reflectedPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>推动功率：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>功放电流：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>功放温度：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.temperatureLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.temperatureUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button @click="siteSettingDialogVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import logService from '@/service/logService';
import siteService from '@/service/siteService';
import storageService from '@/service/storageService';
export default {
    data() {
        return {
            userGroup: '',

            siteId: 1,

            siteControllingDialogVisible: false,

            siteControllingData: {
                dateTime: '',
                serverAddress: '',
                serverPort: '',
                onOffState: false,
                ratedPower: 0
            },

            siteSettingDialogVisible: false,

            siteSettingData: {
                incidentAlertState: false,
                reflectedAlertState: true,
                pushAlertState: false,
                incidentPowerLowerLimit: 24.2,
                incidentPowerUpperLimit: 50.2,
                reflectedPowerLowerLimit: 0.9,
                reflectedPowerUpperLimit: 9.9,
                pushPowerLowerLimit: 71.4,
                pushPowerUpperLimit: 171.4,
                electricCurrentLowerLimit: 3.7,
                electricCurrentUpperLimit: 13.7,
                temperatureLowerLimit: 1,
                temperatureUpperLimit: 51
            },

            siteData: {
                siteId: 0,
                longitude: 0,
                latitude: 0,
                tunnel: '',
                location: '',
                siteName: '',
                description: '',
                alertState: '',
                dateTime: '',
                incidentAlerts: 0,
                reflectedAlerts: 0,
                pushAlerts: 0,
                incidentPower: 0.0,
                reflectedPower: 0.0,
                pushPower: 0.0,
                electricCurrent: 0.0,
                temperature: 0.0,
                onlineState: ''
            },

            siteList: [],

            selectedSiteUUID: ''
        };
    },
    methods: {
        getSiteInfo() {
            if (this.selectedSiteUUID !== '') {
                logService.showCurrentInfo(this.selectedSiteUUID).then((res) => {
                    console.log(res);
                    if (res.data.data && res.data.data.state) {
                        this.siteData = res.data.data.state;
                    } else {
                        const targetSite = this.siteList.find((site) => {
                            return site.siteUUID === this.selectedSiteUUID;
                        });
                        this.$message('没有站点' + targetSite.siteId + '信息');
                    }
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
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err); ;
            })
        }
    },
    created() {
        if (this.$route.query.siteId) {
            console.log(this.$route.query.siteId + this.$route.query.siteUUID);
            this.siteId = this.$route.query.siteId;
            this.selectedSiteUUID = this.$route.query.siteUUID;
            this.getSiteInfo();
        }

        this.getSites();

        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userGroup = user.userGroup;
    }
}
</script>

<style lang="less" scoped>
.siteInfo-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.siteInfo-row {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.siteInfo-inner-card {
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.siteInfo-inner-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-select {
    width: 400px;
}
</style>
