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
                    <el-col :span="6"><el-button @click="getSiteInfo(siteId)">读取信息</el-button></el-col>
                    <el-col :span="6"><el-button @click="siteControllingDialogVisible = true">站点控制</el-button></el-col>
                    <el-col :span="6"><el-button>站点设置</el-button></el-col>
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
            </el-card>
        </el-card>

        <el-dialog title="站点控制" :visible.sync="siteControllingDialogVisible" width="50%">
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
                        <el-date-picker v-model="siteControllingDate.dateTime" type="datetime" placeholder="选择日期时间" :default-time="['12:00:00']"></el-date-picker>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="4">
                        <span>服务器：</span>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteControllingDate.serverAddress" placeholder="服务器地址"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="siteControllingDate.serverPort" placeholder="服务器端口"></el-input>
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
                        <el-select v-model="siteControllingDate.state" placeholder="请选择开关状态">
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
                        <el-input v-model="siteControllingDate.ratedPower"></el-input>
                    </el-col>
                    <el-col :span="6"><el-button>设置</el-button></el-col>
                </el-row>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button @click="siteControllingDialogVisible = false">关闭</el-button>
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

            siteControllingDate: {
                dateTime: '',
                serverAddress: '',
                serverPort: '',
                state: false,
                ratedPower: 0
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
