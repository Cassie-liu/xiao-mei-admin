<template>
<div class="app-container">
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="关于笑美" name="about" :v-loading="loading">
      <el-row>
        <el-button size="small" type="primary" @click="save">保存</el-button>
      </el-row>
      <el-row>
        <div class="solution-ue">
          <tinymce :height="300" ref="editor" v-model="result.profile"  :show-modal="true"/>
        </div>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import Tinymce from '@/components/Tinymce';
  import * as about from '@/api/about';
    export default {
        name: "index",
      data () {
          return {
            activeName: 'about',
            loading: false,
            result: {
              profile: ''
            }
          };
      },
      components: {
        Tinymce
      },
      mounted () {
        this.query();
      },
      methods: {
        query () {
          this.loading = true;
          about.getCompanyIntro()
            .then(res => {
              this.result = res.data;
            })
        },
        save () {
          about.updateCompanyIntro({profile: this.result.profile})
            .then(res => {
              if (res && res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.query();
              }
            })
        }
      }
    }
</script>

<style scoped>
  .solution-ue{
    margin-top:10px;
  }
</style>
