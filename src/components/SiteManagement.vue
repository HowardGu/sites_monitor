<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div slot="header" class="siteManagement-header">
                <span>站点管理</span>
                <el-button type="primary" @click="addSiteDialogVisible = true">新增站点</el-button>
            </div>

            <el-table :data="siteList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="siteId" label="站点号"></el-table-column>
                <el-table-column prop="longitude" label="经度"></el-table-column>
                <el-table-column prop="latitude" label="纬度"></el-table-column>
                <el-table-column prop="tunnel" label="隧道"></el-table-column>
                <el-table-column prop="location" label="地段"></el-table-column>
                <el-table-column prop="siteName" label="站点"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="removeSite(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="新增站点" :visible.sync="addSiteDialogVisible" width="50%" @close="closeAddSiteDialog">
            <el-form :model="addSiteForm" :rules="addSiteFormRules" ref="addSiteFormRef" label-width="70px">
                <el-form-item label="站点号">
                    <el-input-number v-model="addSiteForm.siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="addSiteForm.longitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="addSiteForm.latitude"></el-input>
                </el-form-item>
                <el-form-item label="隧道">
                    <el-input v-model="addSiteForm.tunnel"></el-input>
                </el-form-item>
                <el-form-item label="地段">
                    <el-input v-model="addSiteForm.location"></el-input>
                </el-form-item>
                <el-form-item label="站点">
                    <el-input v-model="addSiteForm.siteName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="addSiteForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAddSiteForm">确定</el-button>
                <el-button @click="addSiteDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            siteList: [
                {
                    siteId: 1,
                    longitude: '118.1095150000',
                    latitude: '24.5019670000',
                    tunnel: '仙岳路隧道',
                    location: '横洞',
                    siteName: 'FM远端机1',
                    description: 'test site 1'
                },
                {
                    siteId: 2,
                    longitude: '118.1095150000',
                    latitude: '24.5019670000',
                    tunnel: '仙岳路隧道',
                    location: '横洞',
                    siteName: 'FM远端机1',
                    description: ''
                }
            ],
            addSiteDialogVisible: false,
            addSiteForm: {
                siteId: 0,
                longitude: '',
                latitude: '',
                tunnel: '',
                location: '',
                siteName: '',
                description: ''
            },
            addSiteFormRules: {
                longitude: [
                    { required: true, message: '请输入经度', trigger: 'blur' }
                ],
                latitude: [
                    { required: true, message: '请输入纬度', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        closeAddSiteDialog() {
            this.$refs.addSiteFormRef.resetFields();
        },
        submitAddSiteForm() {
            this.$refs.addSiteFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                console.log(valid);
                this.addSiteDialogVisible = false;
                // after add site, need to get site list again
            });
        },
        async removeSite(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该站点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((err) => {
                return err;
            });

            if (confirmResult !== 'confirm') {
                this.$message.info('已取消删除')
            } else {
                this.$message.success('删除成功');
            }
        }
    }
}
</script>

<style lang="less" scoped>
.siteManagement-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
