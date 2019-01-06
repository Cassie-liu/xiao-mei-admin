<template>
  <div class="app-container">
    关注人
    <el-row>
      <el-button icon="el-icon-back" type="text" @click="back()"></el-button>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: 'Fallow',
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
