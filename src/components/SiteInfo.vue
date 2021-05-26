<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="siteInfo-header">
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
                <div slot="header" class="siteInfo-header">
                    <span>设备管理</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><el-button @click="getSiteInfo(siteId)">读取信息</el-button></el-col>
                    <el-col :span="6"><el-button>站点控制</el-button></el-col>
                    <el-col :span="6"><el-button>站点设置</el-button></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-header">
                    <span>数字量</span>
                </div>

                <el-row :gutter="20" class="siteInfo-row">
                    <el-col :span="6"><span>入射报警：</span></el-col>
                    <el-col :span="6"><span>反射报警：</span></el-col>
                    <el-col :span="6"><span>推动报警：</span></el-col>
                </el-row>
            </el-card>

            <el-card class="siteInfo-inner-card">
                <div slot="header" class="siteInfo-header">
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
                <div slot="header" class="siteInfo-header">
                    <span>控制状态</span>
                </div>
            </el-card>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            siteId: 1
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
.siteInfo-header {
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
}
</style>
