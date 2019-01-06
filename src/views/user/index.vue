<template>
<div class="app-container">
  <el-form :inline="true" :model="user" size="mini" class="user">
    <el-form-item label="手机号码">
      <el-input v-model="user.phone" placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item label="是否认证" class="label">
      <el-select v-model="user.auth" placeholder="请选择">
        <el-option label="已认证" value="true"></el-option>
        <el-option label="未认证" value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>

</div>
</template>

<script>
    export default {
        name: 'Index',
       data () {
         return {
           user: {

           }
         }
       },
      methods: {
        /**
        * 查询
        * */
        onSubmit(){

        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .user{
    label{
      font-weight: normal !important;
    }
    .label{
      margin-left:30px;
    }
  }
</style>
