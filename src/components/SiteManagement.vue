<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>站点管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="siteManagement-card-header">
                <h2 align="center">站点管理</h2>
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
                <el-table-column label="屏蔽报警">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.ignoreAlert" @change="updateIgnoreAlertState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" circle @click="editSite(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="removeSite(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @current-change="handleCurrentPageChange"
                :current-page="queryInfo.pageNum"
                :page-size="queryInfo.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalCount"
                class="siteManagement-pagination">
            </el-pagination>
        </el-card>

        <el-dialog title="新增站点" :visible.sync="addSiteDialogVisible" width="50%" @close="resetAddSiteDialog" :close-on-click-modal="false">
            <el-form :model="addSiteForm" :rules="addEditSiteFormRules" ref="addSiteFormRef" label-width="70px" label-position="left">
                <el-form-item label="站点号">
                    <el-input-number v-model="addSiteForm.siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="addSiteForm.longitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="addSiteForm.latitude"></el-input>
                </el-form-item>
                <el-form-item label="隧道" prop="tunnel">
                    <el-input v-model="addSiteForm.tunnel"></el-input>
                </el-form-item>
                <el-form-item label="地段" prop="location">
                    <el-input v-model="addSiteForm.location"></el-input>
                </el-form-item>
                <el-form-item label="站点" prop="siteName">
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

        <el-dialog title="编辑站点" :visible.sync="editSiteDialogVisible" width="50%" @close="resetEditSiteDialog" :close-on-click-modal="false">
            <el-form :model="editSiteForm" :rules="addEditSiteFormRules" ref="editSiteFormRef" label-width="70px" label-position="left">
                <el-form-item label="站点号">
                    <el-input-number v-model="editSiteForm.siteId" controls-position="right" :min="1" :max="99999"></el-input-number>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="editSiteForm.longitude"></el-input>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="editSiteForm.latitude"></el-input>
                </el-form-item>
                <el-form-item label="隧道" prop="tunnel">
                    <el-input v-model="editSiteForm.tunnel"></el-input>
                </el-form-item>
                <el-form-item label="地段" prop="location">
                    <el-input v-model="editSiteForm.location"></el-input>
                </el-form-item>
                <el-form-item label="站点" prop="siteName">
                    <el-input v-model="editSiteForm.siteName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="editSiteForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditSiteForm">确定</el-button>
                <el-button @click="editSiteDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import siteService from '@/service/siteService';
export default {
    data() {
        return {
            siteList: [],

            addSiteDialogVisible: false,

            addSiteForm: {
                siteId: 0,
                longitude: 0,
                latitude: 0,
                tunnel: '',
                location: '',
                siteName: '',
                description: ''
            },

            addEditSiteFormRules: {
                longitude: [
                    { required: true, message: '请输入经度', trigger: 'blur' }
                ],
                latitude: [
                    { required: true, message: '请输入纬度', trigger: 'blur' }
                ],
                tunnel: [
                    { required: true, message: '请输入隧道', trigger: 'blur' }
                ],
                location: [
                    { required: true, message: '请输入地段', trigger: 'blur' }
                ],
                siteName: [
                    { required: true, message: '请输入站点', trigger: 'blur' }
                ]
            },

            editSiteDialogVisible: false,

            editSiteForm: {
                siteId: 0,
                longitude: 0,
                latitude: 0,
                tunnel: '',
                location: '',
                siteName: '',
                description: ''
            },

            queryInfo: {
                pageNum: 1,
                pageSize: 5
            },

            totalCount: 10
        };
    },
    methods: {
        resetAddSiteDialog() {
            this.$refs.addSiteFormRef.resetFields();
        },

        submitAddSiteForm() {
            this.$refs.addSiteFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                this.addSiteForm.longitude = Number(this.addSiteForm.longitude);
                this.addSiteForm.latitude = Number(this.addSiteForm.latitude);

                siteService.create(this.addSiteForm).then((res) => {
                    console.log(res);
                    this.$message.success('新增站点成功');
                    this.getSites();
                }).catch((err) => {
                    return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                })

                this.addSiteDialogVisible = false;
            });
        },

        resetEditSiteDialog() {
            this.$refs.editSiteFormRef.resetFields();
        },

        submitEditSiteForm() {
            this.$refs.editSiteFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                this.editSiteForm.longitude = Number(this.editSiteForm.longitude);
                this.editSiteForm.latitude = Number(this.editSiteForm.latitude);

                siteService.update(this.editSiteForm).then((res) => {
                    console.log(res);
                    this.$message.success('编辑站点成功');
                    this.getSites();
                }).catch((err) => {
                    return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                })

                this.editSiteDialogVisible = false;
            });
        },

        editSite(siteUUID) {
            this.editSiteDialogVisible = true;
            this.editSiteForm = (this.siteList.filter((site) => { return site.id === siteUUID; }))[0];
        },

        async removeSite(siteUUID) {
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
                siteService.remove(siteUUID).then((res) => {
                    this.$message.success('删除成功');
                    this.getSites();
                }).catch((err) => {
                    return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
                })
            }
        },

        handleCurrentPageChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getSites();
        },

        getSites() {
            siteService.showAll(this.queryInfo).then((res) => {
                console.log(res);
                this.siteList = res.data.data.sites;
                this.totalCount = res.data.data.totalCount;
            }).catch((err) => {
                return err.response ? this.$message.error(err.response.data.msg) : this.$message.error(err);
            })
        },

        updateIgnoreAlertState(siteInfo) {
            siteService.ignoreAlert(siteInfo)
            console.log(siteInfo.id + ' ' + siteInfo.ignoreAlert);
        }
    },
    created() {
        this.getSites();
    }
}
</script>

<style lang="less" scoped>
.siteManagement-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.siteManagement-pagination {
    margin-top: 15px;
}
</style>
