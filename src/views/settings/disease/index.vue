<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="疾病大类" name="bigDisease">
      <big-disease></big-disease>
    </el-tab-pane>
    <el-tab-pane label="疾病小类" name="smallDisease">
      <small-disease></small-disease>
    </el-tab-pane>
    <el-tab-pane label="疾病原因" name="cause">
      <cause></cause>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import bigDisease from './bigDisease';
  import smallDisease from './smallDisease';
  import cause from './cause';
    export default {
        name: 'Index',
      data () {
          return {
            activeName: 'bigDisease'
          }
      },
      components: {
        bigDisease,
        smallDisease,
        cause
      }
    }
</script>

<style scoped>

</style>
