<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="客服电话" name="customerService">
      <customer-service></customer-service>
    </el-tab-pane>
    <el-tab-pane label="机构管理" name="organize">
      <organize></organize>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import customerService  from './customerService';
  import organize  from './organize'
    export default {
        name: 'Index',
      data () {
          return {
            activeName: 'customerService'
          };
      },
      components:{
        customerService,
        organize
      },
      created () {},
      methods: {

      }
    }
</script>

<style scoped>

</style>
