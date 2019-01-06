<template>
  <div class="app-container">
    收藏
    <el-row>
      <el-button icon="el-icon-back" type="text" @click="back()"></el-button>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: 'Star',
      data() {
          return {

          };
      },
      methods: {
        back(){
          history.go(-1);
        }
      }
    }
</script>

<style scoped>

</style>
