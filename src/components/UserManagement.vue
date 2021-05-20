<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户管理</span>
                <el-button class="addUser-button" type="text" @click="addUserDialogVisible = true">新增用户</el-button>
            </div>

            <el-table :data="userList" :border="true" style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="userGroup" label="用户组"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{}">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="新增用户" :visible.sync="addUserDialogVisible" width="50%" @close="addUserDialogClosed">
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addUserForm.userName"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            userList: [
                {
                    userName: 'admin',
                    password: 'admin',
                    userGroup: 'admin'
                },
                {
                    userName: 'manager',
                    password: 'manager',
                    userGroup: 'manager'
                }
            ],
            addUserDialogVisible: false,
            addUserForm: {
                userName: '',
                password: '',
                userGroup: ''
            },
            addUserFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                userGroup: [
                    { required: true, message: '请选择用户组', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        addUserDialogClosed() {
            this.$refs.addUserFormRef.resetFields();
        },
        submitAddUserForm() {
            this.$refs.addUserFormRef.validate((valid) => {
                if (!valid) {
                    return;
                }

                console.log(valid);
                this.addUserDialogVisible = false;
                //after add user, need to get user list again
            });
        }
    }
}
</script>

<style lang="less" scoped>
.addUser-button {
    float: right;
    padding: 3px 0;
}
</style>
