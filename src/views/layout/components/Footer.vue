<template>
  <el-footer class="footer-container">
    <div class="footer-content">
      <span>当前用户：{{userName}}</span>
      <span>版权所有 © 2019  笑美健康</span>
      <span>版本: v1.0</span>
    </div>
  </el-footer>
</template>

<script>
    export default {
        name: "Footer",
      data () {
          return {
            userName: ''
          }
      },
      mounted () {
        this.userName = sessionStorage.getItem('userName');
      }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.footer-container{
  font-size:14px;
  font-family: FangSong;
  /*font-family: STXingkai;*/
  .footer-content{
    display: flex;
    justify-content: space-between;
  }
}
</style>
