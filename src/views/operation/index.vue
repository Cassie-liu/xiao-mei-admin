<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="账号管理" name="accounts">
      <account></account>
    </el-tab-pane>
    <el-tab-pane label="角色管理" name="roles">
      <role></role>
    </el-tab-pane>
    <el-tab-pane label="密码" name="pwd">
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import Account from './account';
  import Role from './role';
    export default {
        name: 'Index',
      data () {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.form.confirmPassword !== '') {
              this.$refs.form.validateField('confirmPassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          activeName: 'accounts',
          form: {
            password: '',
            confirmPassword: '',
          },
          rules: {
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            confirmPassword: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          }
        };
      },
      components:{
        Account,
        Role
      },
      created () {},
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>

</style>
