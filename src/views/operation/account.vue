<template>
  <div class="app-container">
    <div class="account">
      <el-card class="box-card">
        <el-form :label-position="'left'" label-width="120px">
          <el-form-item label="用户名" label-width="100px">
            <el-input size="small" class="input"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="100px">
            <el-input placeholder="请输入密码" size="small" show-password class="input"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account'
}
</script>

<style scoped>
.account .input{
  width: 20%;
}
</style>
