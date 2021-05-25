<template>
    <div class="login_container">
        <div class="login_box">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="telephone">
                    <el-input v-model="loginForm.telephone" prefix-icon="el-icon-user"></el-input>
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
export default {
    data() {
        return {
            loginForm: {
                telephone: '12345678905',
                password: '12345678901'
            },
            loginFormRules: {
                telephone: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
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
                    this.$router.push('/home');
                } else {
                    const result = await this.$http.post('login', this.loginForm).catch((err) => { return err; });
                    console.log(result);

                    if (result.status !== 200) {
                        return this.$message.error('Login Failed');
                    } else {
                        this.$message.success('Login Success');
                        window.sessionStorage.setItem('token', result.data.data.token);
                        console.log(result.data.data.token);
                        this.$router.push('/home');
                    }
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
    transform: translate(-50%, -50%);
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
