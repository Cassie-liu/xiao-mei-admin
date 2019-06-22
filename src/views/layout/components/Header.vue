<template>
  <el-header class="header-container">
    <span class="title">笑美健康</span>
    <el-popover placement="right-start" title="笑美健康公司" width="400" trigger="click" popper-class="intro-content">
      <div class="intro-content">
        <p>笑美公司是一家致力于运用传统自然疗愈方法，不通过药物、不需要手术实现身心健康的平台。</p>
        <p>目前主要聚合了以刘海荣老师为代表的顶尖专家、秘技传人，并综合运用正骨、经络、气功、太极、意识、音乐、正念冥想等自愈自然疗愈方术，为民众打造一个，除药物治疗外的更益于身心健康发展的疗愈选择。</p>
        <p>笑美公司愿景：人类不治而康的引领者。</p>
      </div>
      <span class="intro" slot="reference">公司介绍</span>
    </el-popover>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../images/avatar.png" class="user-avatar">
          <span>{{userName}}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/user/index">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
    export default {
        name: "Header",
      data () {
        return {
          userName: ''
        }
      },
      created () {
        this.userName = sessionStorage.getItem('userName');
      },
      methods: {
        logout() {
          this.$store.dispatch('LogOut').then(() => {
            // location.reload() // 为了重新实例化vue-router对象 避免bug
            this.$router.push({ path: '/login' })
          })
        }
      }
    }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .header-container{
    line-height:60px;
    color:#fff;
    font-family: STXingkai;
    .title{
      font-family: STXingkai;
      font-size: 30px;
      /*border-left:1px solid #fff;*/
      border-right:1px solid #fff;
      padding:0 10px;
      margin-right:10px;
    }
    .intro{
      cursor: pointer;
    }
    .right-menu{
      float: right;
      .avatar-container {
        height: 50px;
        display: inline-block;
        /*position: absolute;*/
        /*right: 35px;*/
        color: #fff;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 10px;
          position: relative;
          line-height: initial;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            vertical-align: -5px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
