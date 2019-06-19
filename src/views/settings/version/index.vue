<template>
  <div class="app-container">
    <el-tabs type="border-card" >
      <el-tab-pane label="版本更新">
        <div class="version">
          <el-form :label-position="'right'" :model="params" label-width="120px" >
            <el-form-item label="版本序号">
              <el-input size="small" v-model="params.versionId" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item label="显示版本号">
              <el-input size="small" v-model="params.version" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item label="是否强制升级">
              <el-radio :label="true" v-model="params.forceUpdate" :disabled="readonly">是</el-radio>
              <el-radio :label="false" v-model="params.forceUpdate"  :disabled="readonly">否</el-radio>
            </el-form-item>
            <el-form-item label="app上传">
              <el-input size="small" v-model="params.key" disabled></el-input>
              <el-button type="text" @click="download">下载</el-button>
              <div class="upload">
                <el-upload action="" :disabled="readonly"
                :http-request="uploadUrls">
                  <el-button type="text" :disabled="readonly" class="uploadButton">上传</el-button>
                </el-upload>
                <!--<el-button type="text" :disabled="readonly" class="uploadButton">上传</el-button>-->
                <!--<input type="file">-->
              </div>
            </el-form-item>
            <el-form-item label="版本说明">
              <el-input size="small" v-model="params.description" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" v-if="readonly" @click="readonly = false">编辑</el-button>
              <el-button size="small" type="primary" v-if="!readonly" @click="save">保存</el-button>
              <el-button size="small" v-if="!readonly" @click="readonly = true">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as other from '@/api/other';
    export default {
        name: "index",
      data () {
          return {
            params: {},
            readonly: true,
            file: ''
          }
      },
      mounted () {
        this.query();
      },
      methods: {
          query() {
            other.getAppVersion()
              .then(res => {
                this.params = res.data || {};
              });
          },
        download () {
            window.open(this.params.url, '_blank');
        },
        uploadUrls (file) {
          this.params.key = file && file.file && file.file.name;
          this.file = file.file;
        },
        save () {
            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('description', this.params.description);
            formData.append('forceUpdate', this.params.forceUpdate);
            formData.append('version', this.params.version);
            formData.append('versionId', this.params.versionId);
            other.updateApp(formData)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res && res.message,
                    duration: 6000
                  });
                }
                this.readonly = true;
                this.query();
              })
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.version{
  width: 40%;
  /deep/  .el-input.el-input--small {
    width: 60% !important;
  }
  .upload{
    display: inline-block;
    position: relative;
    cursor: pointer;
    input[type="file"] {
      width: 30px;
      position: absolute;
      top:6px;
      opacity: 0;
    }
    /deep/ .el-upload-list.el-upload-list--text{
      display: none;
    }
  }
}

</style>
