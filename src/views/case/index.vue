<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="未审核" name="unReviewed">
      <un-reviewed v-if="activeName === 'unReviewed'"></un-reviewed>
    </el-tab-pane>
    <el-tab-pane label="已审核" name="reviewed">
      <reviewed v-if="activeName === 'reviewed'"></reviewed>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import UnReviewed from './UnReviewed';
  import Reviewed from './Reviewed';
    export default {
        name: 'Index',
      data () {
          return {
            activeName: 'unReviewed'
          }
      },
      components: {
        UnReviewed,
        Reviewed
      }
    }
</script>

<style scoped>

</style>
