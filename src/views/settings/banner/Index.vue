<template>
    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="首页轮播图" name="Home">
          <home v-if="activeName === 'Home'"></home>
        </el-tab-pane>
        <el-tab-pane label="课程轮播图" name="course">
          <Course v-if="activeName === 'course'"></Course>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import Home from './Home';
  import Course from './Course';
    export default {
        name: 'Index',
      data () {
          return {
            activeName: 'Home'
          }
      },
      components: {
        Home,
        Course
      }
    }
</script>

<style scoped>

</style>
