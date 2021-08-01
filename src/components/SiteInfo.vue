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

            <el-select v-model="selectedSiteUUID" placeholder="请选择站点" @change="startTimeIntervel()">
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
                    <el-col :span="6" id='offlineAlert'><span>状态： {{ siteData.offlineAlert }}</span></el-col>
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
                    <el-col :span="6" id="incidentAlerts"><span>入射报警： {{ siteData.incidentAlerts }}</span></el-col>
                    <el-col :span="6" id="reflectedAlerts"><span>反射报警： {{ siteData.reflectedAlerts }}</span></el-col>
                    <el-col :span="6" id="pushAlerts"><span>推动报警： {{ siteData.pushAlerts }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">模拟量</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6" id="incidentPower"><span>入射功率(W)： {{ siteData.incidentPower }}</span></el-col>
                    <el-col :span="6" id="reflectedPower"><span>反射功率(W)： {{ siteData.reflectedPower }}</span></el-col>
                    <el-col :span="6" id="pushPower"><span>推动功率(mW)： {{ siteData.pushPower }}</span></el-col>
                    <el-col :span="6" id="inputPower"><span>输入功率(mW)： {{ siteData.inputPower }}</span></el-col>
                </el-row>
                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6" id="supplyVoltage"><span>电源电压(V)： {{ siteData.supplyVoltage }}</span></el-col>
                    <el-col :span="6" id="electricCurrent"><span>功放电流(A)： {{ siteData.electricCurrent }}</span></el-col>
                    <el-col :span="6" id="temperature"><span>功放温度(℃)： {{ siteData.temperature }}</span></el-col>
                    <el-col :span="6" id="standingWaveRatio"><span>驻波比： {{ siteData.standingWaveRatio }}</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <h3 align="center">控制状态</h3>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6" id="alertState"><span>报警状态： {{ siteData.alertState }}</span></el-col>
                    <el-col :span="6" id="powerOn"><span>在线状态： {{ siteData.powerOn }}</span></el-col>
                    <el-col :span="6"><span>衰减值： {{ siteData.inputAttenuation }}</span></el-col>
                    <el-col :span="6" id="ratedPower"><span>额定功率(W)： {{ siteData.ratedPower }}</span></el-col>
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
                        <el-input-number v-model="siteSettingData.incidentPowerLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.incidentPowerUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.reflectedPowerLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.reflectedPowerUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.pushPowerLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.pushPowerUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.inputPowerLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.inputPowerUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.ratedPowerLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.ratedPowerUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.electricCurrentLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.electricCurrentUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.temperatureLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.temperatureUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.supplyVoltageLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.supplyVoltageUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                        <el-input-number v-model="siteSettingData.standingWaveRatioLowerLimit" style="width: 100%;" placeholder="下限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="siteSettingData.standingWaveRatioUpperLimit" style="width: 100%;" placeholder="上限" :controls=false></el-input-number>
                    </el-col>
                    <el-col :span="4">
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
                incidentPowerLowerLimit: undefined,
                incidentPowerUpperLimit: undefined,
                reflectedPowerState: false,
                reflectedPowerLowerLimit: undefined,
                reflectedPowerUpperLimit: undefined,
                pushPowerState: false,
                pushPowerLowerLimit: undefined,
                pushPowerUpperLimit: undefined,
                inputPowerState: false,
                inputPowerLowerLimit: undefined,
                inputPowerUpperLimit: undefined,
                ratedPowerState: false,
                ratedPowerLowerLimit: undefined,
                ratedPowerUpperLimit: undefined,
                electricCurrentState: false,
                electricCurrentLowerLimit: undefined,
                electricCurrentUpperLimit: undefined,
                temperatureState: false,
                temperatureLowerLimit: undefined,
                temperatureUpperLimit: undefined,
                supplyVoltageState: false,
                supplyVoltageLowerLimit: undefined,
                supplyVoltageUpperLimit: undefined,
                standingWaveRatioState: false,
                standingWaveRatioLowerLimit: undefined,
                standingWaveRatioUpperLimit: undefined
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
                supplyVoltage: 0.0,
                incidentPowerAlert: false,
                reflectedPowerAlert: false,
                pushPowerAlert: false,
                electricCurrentAlert: false,
                temperatureAlert: false,
                supplyVoltageAlert: false,
                inputPowerAlert: false,
                standingWaveRatioAlert: false,
                inputAttenuationAlert: false,
                ratedPowerAlert: false
            },

            refreshInterval: null,

            refreshPaused: false,

            siteList: [],

            selectedSiteUUID: ''
        };
    },
    methods: {
        startTimeIntervel() {
            this.getSiteInfo();

            this.clearInterval();

            this.refreshInterval = window.setInterval(this.getSiteInfo, 5000);
        },

        getSiteInfo() {
            if (this.selectedSiteUUID !== '') {
                logService.showRealtimeLog(this.selectedSiteUUID).then((res) => {
                    console.log(res);
                    if (res.data.data && res.data.data.state) {
                        this.siteData = res.data.data.state;
                        this.highlightAlert();
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
                if (this.selectedSiteUUID === '' && this.siteList.length > 0) {
                    this.selectedSiteUUID = this.siteList[0].siteUUID;
                    this.startTimeIntervel();
                }
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
                        this.hideZero();
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
        },

        highlightAlert() {
            this.modifyFontColor('incidentAlerts', this.siteData.incidentAlerts);
            this.modifyFontColor('reflectedAlerts', this.siteData.reflectedAlerts);
            this.modifyFontColor('pushAlerts', this.siteData.pushAlerts);
            this.modifyFontColor('incidentPower', this.siteData.incidentPowerAlert);
            this.modifyFontColor('reflectedPower', this.siteData.reflectedPowerAlert);
            this.modifyFontColor('pushPower', this.siteData.pushPowerAlert);
            this.modifyFontColor('electricCurrent', this.siteData.electricCurrentAlert);
            this.modifyFontColor('temperature', this.siteData.temperatureAlert);
            this.modifyFontColor('supplyVoltage', this.siteData.supplyVoltageAlert);
            this.modifyFontColor('inputPower', this.siteData.inputPowerAlert);
            this.modifyFontColor('standingWaveRatio', this.siteData.standingWaveRatioAlert);
            this.modifyFontColor('ratedPower', this.siteData.ratedPowerAlert);
            this.modifyFontColor('offlineAlert', this.siteData.offlineAlert === '离线');
            this.modifyFontColor('alertState', this.siteData.alertState === '开始报警');
            this.modifyFontColor('powerOn', this.siteData.powerOn === '关机');
        },

        modifyFontColor(item, highlight) {
            if (highlight) {
                document.getElementById(item).classList.add('siteInfo-col-alert');
            } else {
                document.getElementById(item).classList.remove('siteInfo-col-alert');
            }
        },

        hideZero() {
            // TODO: to show placeholder, have to set the default value as undefined
            if (this.siteSettingData.incidentPowerLowerLimit === 0 && this.siteSettingData.incidentPowerUpperLimit === 0) {
                this.siteSettingData.incidentPowerLowerLimit = undefined;
                this.siteSettingData.incidentPowerUpperLimit = undefined;
            }
            if (this.siteSettingData.reflectedPowerLowerLimit === 0 && this.siteSettingData.reflectedPowerUpperLimit === 0) {
                this.siteSettingData.reflectedPowerLowerLimit = undefined;
                this.siteSettingData.reflectedPowerUpperLimit = undefined;
            }
            if (this.siteSettingData.pushPowerLowerLimit === 0 && this.siteSettingData.pushPowerUpperLimit === 0) {
                this.siteSettingData.pushPowerLowerLimit = undefined;
                this.siteSettingData.pushPowerUpperLimit = undefined;
            }
            if (this.siteSettingData.inputPowerLowerLimit === 0 && this.siteSettingData.inputPowerUpperLimit === 0) {
                this.siteSettingData.inputPowerLowerLimit = undefined;
                this.siteSettingData.inputPowerUpperLimit = undefined;
            }
            if (this.siteSettingData.ratedPowerLowerLimit === 0 && this.siteSettingData.ratedPowerUpperLimit === 0) {
                this.siteSettingData.ratedPowerLowerLimit = undefined;
                this.siteSettingData.ratedPowerUpperLimit = undefined;
            }
            if (this.siteSettingData.electricCurrentLowerLimit === 0 && this.siteSettingData.electricCurrentUpperLimit === 0) {
                this.siteSettingData.electricCurrentLowerLimit = undefined;
                this.siteSettingData.electricCurrentUpperLimit = undefined;
            }
            if (this.siteSettingData.temperatureLowerLimit === 0 && this.siteSettingData.temperatureUpperLimit === 0) {
                this.siteSettingData.temperatureLowerLimit = undefined;
                this.siteSettingData.temperatureUpperLimit = undefined;
            }
            if (this.siteSettingData.standingWaveRatioLowerLimit === 0 && this.siteSettingData.standingWaveRatioUpperLimit === 0) {
                this.siteSettingData.standingWaveRatioLowerLimit = undefined;
                this.siteSettingData.standingWaveRatioUpperLimit = undefined;
            }
            if (this.siteSettingData.supplyVoltageLowerLimit === 0 && this.siteSettingData.supplyVoltageUpperLimit === 0) {
                this.siteSettingData.supplyVoltageLowerLimit = undefined;
                this.siteSettingData.supplyVoltageUpperLimit = undefined;
            }
        },

        clearInterval() {
            if (this.refreshInterval) {
                window.clearInterval(this.refreshInterval);
                console.log('SiteInfo time intervel destroyed');
            }
        }
    },
    created() {
        const user = JSON.parse(storageService.get(storageService.USER_INFO));
        this.userGroup = user.userGroup;
    },
    activated() {
        if (this.$route.query.siteId) {
            console.log(this.$route.query.siteId + this.$route.query.siteUUID);
            this.siteId = this.$route.query.siteId;
            this.selectedSiteUUID = this.$route.query.siteUUID;
            this.startTimeIntervel();
        } else {
            if (this.refreshPaused) {
                this.startTimeIntervel();
            }
        }

        this.getSites();
    },
    deactivated() {
        if (this.refreshInterval) {
            this.refreshPaused = true;
        }
        this.clearInterval();
    },
    beforeDestroy() {
        this.clearInterval();
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

.siteInfo-col-alert {
    color: #FF4136
}

.el-select {
    width: 400px;
}
</style>
