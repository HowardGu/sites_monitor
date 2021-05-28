<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div slot="header" class="userManagement-card-header">
                <span>用户管理</span>
                <el-button type="primary" @click="addUserDialogVisible = true">新增用户</el-button>
            </div>

            <el-table :data="userList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="userGroup" label="用户组"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" circle @click="editUser(scope.row.userId)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle @click="removeUser(scope.row.userId)"></el-button>
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
                class="userManagement-pagination">
            </el-pagination>
        </el-card>

        <el-dialog title="新增用户" :visible.sync="addUserDialogVisible" width="50%" @close="resetAddUserDialog" :close-on-click-modal="false">
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="80px" label-position="left">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addUserForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="addUserForm.password2" type="password"></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="userGroup">
                    <el-select v-model="addUserForm.userGroup" placeholder="请选择用户组">
                        <el-option label="admin" value="admin"></el-option>
                        <el-option label="manager" value="manager"></el-option>
                        <el-option label="user" value="user"></el-option>
                        <el-option label="guest" value="guest"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAddUserForm">确定</el-button>
                <el-button @click="addUserDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑用户" :visible.sync="editUserDialogVisible" width="50%" @close="resetEditUserDialog" :close-on-click-modal="false">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="80px" label-position="left">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editUserForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editUserForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="editUserForm.password2" type="password"></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="userGroup">
                    <el-select v-model="editUserForm.userGroup" placeholder="请选择用户组">
                        <el-option label="admin" value="admin"></el-option>
                        <el-option label="manager" value="manager"></el-option>
                        <el-option label="user" value="user"></el-option>
                        <el-option label="guest" value="guest"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditUserForm">确定</el-button>
                <el-button @click="editUserDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        const validateAddUserFormPassword = (rule, value, callback) => {
            if (this.addUserForm.password2 !== '') {
                this.$refs.addUserForm.validateField('password2');
            } else {
                callback();
            }
        };

        const validateAddUserFormPassword2 = (rule, value, callback) => {
            if (value !== this.addUserForm.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };

        const validateEditUserFormPassword = (rule, value, callback) => {
            if (this.editUserForm.password2 !== '') {
                this.$refs.editUserForm.validateField('password2');
            } else {
                callback();
            }
        };

        const validateEditUserFormPassword2 = (rule, value, callback) => {
            if (value !== this.editUserForm.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };

        return {
            userList: [
                {
                    userId: 1,
                    userName: 'admin',
                    password: 'admin',
                    userGroup: 'admin'
                },
                {
                    userId: 2,
                    userName: 'manager',
                    password: 'manager',
                    userGroup: 'manager'
                }
            ],

            addUserDialogVisible: false,

            addUserForm: {
                userName: '',
                password: '',
                password2: '',
                userGroup: ''
            },

            addUserFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validateAddUserFormPassword, trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validateAddUserFormPassword2, trigger: 'blur' }
                ],
                userGroup: [
                    { required: true, message: '请选择用户组', trigger: 'blur' }
                ]
            },

            editUserDialogVisible: false,

            editUserForm: {
                userName: '',
                password: '',
                password2: '',
                userGroup: ''
            },

            editUserFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validateEditUserFormPassword, trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validateEditUserFormPassword2, trigger: 'blur' }
                ],
                userGroup: [
                    { required: true, message: '请选择用户组', trigger: 'blur' }
                ]
            },

            queryInfo: {
                pageNum: 1,
                pageSize: 20
            },

            totalCount: 10
        };
    },
    methods: {
        resetAddUserDialog() {
            this.$refs.addUserFormRef.resetFields();
        },

        submitAddUserForm() {
            this.$refs.addUserFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                console.log(valid);
                this.addUserDialogVisible = false;
                // after add user, need to get user list again
            });
        },

        resetEditUserDialog() {
            this.$refs.editUserFormRef.resetFields();
        },

        submitEditUserForm() {
            this.$refs.editUserFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                console.log(valid);
                this.editUserDialogVisible = false;
                // after edit user, need to get user list again
            });
        },

        editUser(userId) {
            this.editUserDialogVisible = true;
            this.editUserForm = (this.userList.filter((user) => { return user.userId === userId; }))[0];
        },

        async removeUser(userId) {
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
        },

        handleCurrentPageChange(newPage) {
            console.log(newPage);
            this.queryInfo.pageNum = newPage;
        }
    }
}
</script>

<style lang="less" scoped>
.userManagement-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.userManagement-pagination {
    margin-top: 15px;
}
</style>
