<template>
    <div class="app-container">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="体检指标" name="medical">
          <medical v-if="activeName === 'medical'"></medical>
        </el-tab-pane>
        <el-tab-pane label="数据模型" name="model">
          <modal v-if="activeName === 'model'"></modal>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import Medical from './Medical';
  import Modal from './Modal';
    export default {
        name: 'Index',
      data () {
          return {
           activeName: 'medical'
          };
      },
      components: {
        Medical,
        Modal
      }
    };
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
  .add-dialog{
    .dialog-footer{
      text-align: center;
    }
  }
</style>
