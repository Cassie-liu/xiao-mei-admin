<template>
<div class="app-container">
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="养生配置" name="bigHealth">
      <big-health v-if="activeName === 'bigHealth'"></big-health>
    </el-tab-pane>
    <el-tab-pane label="养生方式配置" name="smallHealth">
      <small-health v-if="activeName === 'smallHealth'"></small-health>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import bigHealth from './bigHealth';
  import smallHealth from './smallHealth';
    export default {
        name: 'Index',
      data() {
          return {
            activeName: 'bigHealth'
          };
      },
      components: {
        bigHealth,
        smallHealth,
      },
      created () {},
      methods: {}
    }
</script>

<style scoped>

</style>
