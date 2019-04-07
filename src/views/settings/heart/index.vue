<template>
    <div class="app-container">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="行善类型" name="type">
          <heart-type v-if="activeName == 'type'"></heart-type>
        </el-tab-pane>
        <el-tab-pane label="行善内容" name="content">
          <heart-content v-if="activeName === 'content'"></heart-content>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import HeartType from './HeartType';
  import HeartContent from './HeartContent';
    export default {
      name: 'Index',
      props: [],
      data () {
        return {
          activeName: 'type'
        }
      },
      components: {
        HeartType,
        HeartContent
      }
    };
</script>

<style scoped>

</style>
