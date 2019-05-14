<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="账号管理" name="accounts">
      <account></account>
    </el-tab-pane>
    <!--<el-tab-pane label="角色管理" name="roles">-->
      <!--<role></role>-->
    <!--</el-tab-pane>-->
  </el-tabs>
</div>
</template>

<script>
  import Account from './account';
  import Role from './role';
    export default {
        name: 'Index',
      data () {
        return {
          activeName: 'accounts'
        };
      },
      components:{
        Account,
        Role
      },
      created () {},
      methods: {
      }
    }
</script>

<style scoped>

</style>
