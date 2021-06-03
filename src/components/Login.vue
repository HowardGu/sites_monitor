<template>
    <div class="login_container">
        <div class="login_box">
            <h2 align="center">欢迎使用厦门市隧道监控系统</h2>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <el-form-item class="login_form_buttons">
                    <el-button type="primary" @click="submitLoginForm">Login</el-button>
                    <el-button type="info" @click="resetLoginForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            loginForm: {
                userName: 'root',
                password: 'Password1'
            },

            loginFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        ...mapActions('userModule', { userlogin: 'login' }),
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        submitLoginForm() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) {
                    return;
                }

                if (this.$localTest) {
                    this.$message.success('Login Success');
                    window.sessionStorage.setItem('token', 'thisistesttokenstr');
                    window.sessionStorage.setItem('userName', 'root');
                    window.sessionStorage.setItem('userGroup', 'admin');
                    this.$router.push('/home');
                } else {
                    this.userlogin(this.loginForm).then(() => {
                        this.$message.success('登录成功！');
                        this.$router.push('/home');
                    }).catch((err) => {
                        return this.$message.error(err.response.data.msg);
                    });
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
}

.login_form_buttons {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
