<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="siteInfo-card-header">
                <h2 align="center">站点详情</h2>
            </div>

            <el-select v-model="selectedSiteUUID" placeholder="请选择站点" @change="getSiteInfo()">
                <el-option v-for="site in siteList" :key="site.siteUUID" :label="site.siteId + '号站点 - ' + site.siteFullName" :value="site.siteUUID">
                    <span style="float: left">{{ site.siteFullName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ site.siteId }}</span>
                </el-option>
            </el-select>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">基础信息</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>站点号： {{ siteData.siteId }}</span></el-col>
                    <el-col :span="6"><span>版本号：</span></el-col>
                    <el-col :span="6"><span>时钟： {{ siteData.dateTime }}</span></el-col>
                    <el-col :span="6"><span>状态： {{ siteData.offlineAlert }}</span></el-col>
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
                    <h3 align="center">设备管理</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><el-button @click="getSiteInfo()" icon="el-icon-search">读取信息</el-button></el-col>
                    <el-col :span="6" v-if="userGroup !=='guest'"><el-button @click="siteControllingDialogVisible = true" icon="el-icon-setting">站点控制</el-button></el-col>
                    <el-col :span="6" v-if="userGroup !=='guest'"><el-button @click="siteSettingDialogVisible = true" icon="el-icon-setting">站点设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">数字量</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射报警： {{ siteData.incidentAlerts }}</span></el-col>
                    <el-col :span="6"><span>反射报警： {{ siteData.reflectedAlerts }}</span></el-col>
                    <el-col :span="6"><span>推动报警： {{ siteData.pushAlerts }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">模拟量</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射功率(W)： {{ siteData.incidentPower }}</span></el-col>
                    <el-col :span="6"><span>反射功率(W)： {{ siteData.reflectedPower }}</span></el-col>
                    <el-col :span="6"><span>推动功率(mW)： {{ siteData.pushPower }}</span></el-col>
                    <el-col :span="6"><span>输入功率(W)： {{ siteData.inputPower }}</span></el-col>
                </el-row>
                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>额定功率(W)： {{ siteData.ratedPower }}</span></el-col>
                    <el-col :span="6"><span>功放电流(A)： {{ siteData.electricCurrent }}</span></el-col>
                    <el-col :span="6"><span>功放温度(℃)： {{ siteData.temperature }}</span></el-col>
                    <el-col :span="6"><span>驻波比： {{ siteData.standingWaveRatio }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">控制状态</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>报警状态： {{ siteData.alertState }}</span></el-col>
                    <el-col :span="6"><span>在线状态： {{ siteData.powerOn }}</span></el-col>
                    <el-col :span="6"><span>衰减值： {{ siteData.inputAttenuation }}</span></el-col>
                    <el-col :span="6"><span>额定功率(W)： {{ siteData.supplyVoltage }}</span></el-col>
                </el-row>
            </el-card>
        </el-card>

        <el-dialog title="站点控制" :visible.sync="siteControllingDialogVisible" width="50%" :close-on-click-modal="false">
            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">设备信息</h3>
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
                    <h3 align="center">设备控制</h3>
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

        <el-dialog @open="getSiteSetting()" title="站点设置" :visible.sync="siteSettingDialogVisible" width="50%" top="5vh" :close-on-click-modal="false">
            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">报警电平设置</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>入射报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select @change="updateAlertState('IncidentAlert')" v-model="siteSettingData.incidentAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>反射报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select @change="updateAlertState('ReflectedAlert')" v-model="siteSettingData.reflectedAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4"><span>推动报警电平：</span></el-col>
                    <el-col :span="6">
                        <el-select @change="updateAlertState('PushAlert')" v-model="siteSettingData.pushAlertState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">报警上下限设置</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>入射功率：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('IncidentPower')" v-model="siteSettingData.incidentPowerState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.incidentPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.incidentPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('IncidentPower',
                            siteSettingData.incidentPowerLowerLimit,
                            siteSettingData.incidentPowerUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>反射功率：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('ReflectedPower')" v-model="siteSettingData.reflectedPowerState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.reflectedPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.reflectedPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('ReflectedPower',
                            siteSettingData.reflectedPowerLowerLimit,
                            siteSettingData.reflectedPowerUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>推动功率：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('PushPower')" v-model="siteSettingData.pushPowerState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.pushPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('PushPower',
                            siteSettingData.pushPowerLowerLimit,
                            siteSettingData.pushPowerUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>输入功率：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('InputPower')" v-model="siteSettingData.inputPowerState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.inputPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.inputPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('InputPower',
                            siteSettingData.inputPowerLowerLimit,
                            siteSettingData.inputPowerUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>额定功率</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('RatedPower')" v-model="siteSettingData.ratedPowerState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.ratedPowerLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.ratedPowerUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('RatedPower',
                            siteSettingData.ratedPowerLowerLimit,
                            siteSettingData.ratedPowerUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>功放电流：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('ElectricCurrent')" v-model="siteSettingData.electricCurrentState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.electricCurrentLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.electricCurrentUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('ElectricCurrent',
                            siteSettingData.electricCurrentLowerLimit,
                            siteSettingData.electricCurrentUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>功放温度：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('Temperature')" v-model="siteSettingData.temperatureState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.temperatureLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.temperatureUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('Temperature',
                            siteSettingData.temperatureLowerLimit,
                            siteSettingData.temperatureUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>电源电压：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('SupplyVoltage')" v-model="siteSettingData.supplyVoltageState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.supplyVoltageLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.supplyVoltageLowerLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('SupplyVoltage',
                            siteSettingData.supplyVoltageLowerLimit,
                            siteSettingData.supplyVoltageUpperLimit)">设置</el-button>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>驻波比：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-select style="width:100%"  @change="updateAlertState('StandingWaveRatio')" v-model="siteSettingData.standingWaveRatioState" placeholder="请选择是否报警">
                            <el-option label="不报警" :value="false"></el-option>
                            <el-option label="报警" :value="true"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.standingWaveRatioLowerLimit" placeholder="下限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteSettingData.standingWaveRatioUpperLimit" placeholder="上限"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="updateAlertLimit('StandingWaveRatio',
                            siteSettingData.standingWaveRatioLowerLimit,
                            siteSettingData.standingWaveRatioUpperLimit)">设置</el-button>
                    </el-col>
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
                incidentAlertState: true,
                reflectedAlertState: true,
                pushAlertState: true,
                incidentPowerState: false,
                incidentPowerLowerLimit: 0.0,
                incidentPowerUpperLimit: 0.0,
                reflectedPowerState: false,
                reflectedPowerLowerLimit: 0.0,
                reflectedPowerUpperLimit: 0.0,
                pushPowerState: false,
                pushPowerLowerLimit: 0.0,
                pushPowerUpperLimit: 0.0,
                inputPowerState: false,
                inputPowerLowerLimit: 0.0,
                inputPowerUpperLimit: 0.0,
                ratedPowerState: false,
                ratedPowerLowerLimit: 0.0,
                ratedPowerUpperLimit: 0.0,
                electricCurrentState: false,
                electricCurrentLowerLimit: 0.0,
                electricCurrentUpperLimit: 0.0,
                temperatureState: false,
                temperatureLowerLimit: 0.0,
                temperatureUpperLimit: 0.0,
                supplyVoltageState: false,
                supplyVoltageLowerLimit: 0.0,
                supplyVoltageUpperLimit: 0.0,
                standingWaveRatioState: false,
                standingWaveRatioLowerLimit: 0.0,
                standingWaveRatioUpperLimit: 0.0
            },

            siteData: {
                siteId: 0,
                longitude: 0,
                latitude: 0,
                tunnel: '',
                location: '',
                siteName: '',
                description: '',
                offlineAlert: '',
                dateTime: '',
                incidentAlerts: 0,
                reflectedAlerts: 0,
                pushAlerts: 0,
                incidentPower: 0.0,
                reflectedPower: 0.0,
                pushPower: 0.0,
                inputPower: 0.0,
                ratedPower: 0.0,
                electricCurrent: 0.0,
                temperature: 0.0,
                standingWaveRatio: 0.0,
                alertState: '',
                powerOn: '',
                inputAttenuation: 0.0,
                supplyVoltage: 0.0
            },

            siteList: [],

            selectedSiteUUID: ''
        };
    },
    methods: {
        getSiteInfo() {
            if (this.selectedSiteUUID !== '') {
                logService.showRealtimeLog(this.selectedSiteUUID).then((res) => {
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
        },

        getSiteSetting() {
            if (this.selectedSiteUUID !== '') {
                siteService.alertConf(this.selectedSiteUUID).then((res) => {
                    console.log(res);
                    if (res.data.data && res.data.data.alertConf) {
                        this.siteSettingData = res.data.data.alertConf;
                    }
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            }
        },

        updateAlertState(alertName) {
            if (this.selectedSiteUUID !== '') {
                siteService.updateAlertState({ id: this.selectedSiteUUID, name: alertName }).then((res) => {
                    console.log(res);
                    this.$message.success('设置成功');
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            }
        },

        updateAlertLimit(alertName, lowerLimit, upperLimit) {
            if (this.selectedSiteUUID !== '') {
                siteService.updateAlertLimit({ id: this.selectedSiteUUID, name: alertName, min: Number(lowerLimit), max: Number(upperLimit) }).then((res) => {
                    console.log(res);
                    this.$message.success('设置成功');
                }).catch((err) => {
                    err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                });
            }
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
