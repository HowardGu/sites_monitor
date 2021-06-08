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

            <el-row :gutter="20" class="siteInfo-row">
                <el-col :span="6">
                    <span>站点号：</span>
                    <el-input-number v-model="siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                </el-col>
                <el-col :span="6"><span>版本号：</span></el-col>
                <el-col :span="6"><span>时钟：</span></el-col>
                <el-col :span="6"><span>状态：</span></el-col>
            </el-row>

            <el-row :gutter="20" class="siteInfo-row">
                <el-col :span="6"><span>隧道：</span></el-col>
                <el-col :span="6"><span>地段：</span></el-col>
                <el-col :span="6"><span>站点：</span></el-col>
                <el-col :span="6"><span>描述：</span></el-col>
            </el-row>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>设备管理</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><el-button @click="getSiteInfo(siteId)" icon="el-icon-search">读取信息</el-button></el-col>
                    <el-col :span="6"><el-button @click="siteControllingDialogVisible = true" icon="el-icon-setting">站点控制</el-button></el-col>
                    <el-col :span="6"><el-button @click="siteSettingDialogVisible = true" icon="el-icon-setting">站点设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>数字量</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射报警：</span></el-col>
                    <el-col :span="6"><span>反射报警：</span></el-col>
                    <el-col :span="6"><span>推动报警：</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>模拟量</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射功率(W)：</span></el-col>
                    <el-col :span="6"><span>反射功率(W)：</span></el-col>
                    <el-col :span="6"><span>推动功率(mW)：</span></el-col>
                    <el-col :span="6"><span>功放电流(A)：</span></el-col>
                    <el-col :span="6"><span>功放温度(℃)：</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-inner-card-header">
                    <span>控制状态</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>报警状态：</span></el-col>
                    <el-col :span="6"><span>在线状态：</span></el-col>
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
export default {
    data() {
        return {
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
            }
        };
    },
    methods: {
        getSiteInfo(siteId) {
            console.log(this.siteId);
        }
    },
    created() {
        if (this.$route.query.siteId) {
            console.log(this.$route.query.siteId);
            this.siteId = this.$route.query.siteId;
        }
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
</style>
