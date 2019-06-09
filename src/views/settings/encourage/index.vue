<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="爱心养生介绍" :v-loading="loading">
        <el-row>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </el-row>
        <el-row>
          <div class="solution-ue">
            <tinymce :height="300" ref="editor" v-model="content"  :show-modal="true"/>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import commonTable from '@/views/common/commonTable';
  import * as heart from '@/api/heart';
  export default {
    name: 'index',
    props: [],
    data () {
      return {
        content: '',
        loading: false
      };
    },
    components: {
      commonTable,
      Tinymce
    },
    mounted () {
      this.query();
    },
    methods:{
      /**
       * 查询
       * */
      query () {
        this.loading = true;
        heart.getHealthIntro()
          .then(res => {
            this.loading = false;
            this.content = res.data;
          });
      },
      save () {
        heart.updateHelthInto({content: this.content})
          .then(res => {
            if (res && res.code === 200) {
              this.$message({
                message: res && res.message,
                type: 'success'
              });
              this.query();
            }
          })
      }
    }
  };
</script>

<style scoped>
.solution-ue{
  margin-top:10px;
}
</style>
