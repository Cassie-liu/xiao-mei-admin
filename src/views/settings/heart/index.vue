<template>
    <div class="app-container">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="行善过失类型" name="type">
          <heart-type v-if="activeName == 'type'"></heart-type>
        </el-tab-pane>
        <el-tab-pane label="行善过失内容" name="content">
          <heart-content v-if="activeName === 'content'"></heart-content>
        </el-tab-pane>
        <el-tab-pane label="过失鼓励话语" name="heartWord">
          <heart-words v-if="activeName === 'heartWord'"></heart-words>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import HeartType from './HeartType';
  import HeartContent from './HeartContent';
  import HeartWords from './HeartWords';
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
        HeartContent,
        HeartWords
      }
    };
</script>

<style scoped>

</style>
