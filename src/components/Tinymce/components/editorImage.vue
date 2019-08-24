<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :modal="showModal" :v-loading="true" :modal-append-to-body="false">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        action=""
        class="editor-slide-upload"
        list-type="picture-card"
        :http-request="uploadUrls"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" size="small">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import  {uploadSingleImage} from '@/api/lesson';
import {checkImages} from '@/utils/index';

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    showModal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: [],
      fileList: []
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('successCBK', this.listObj)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj) || [];
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          // this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].url = response.data.url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    // handleRemove(file) {
    //   const uid = file.uid
    //   const objKeyArr = Object.keys(this.listObj)
    //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
    //     if (this.listObj[objKeyArr[i]].uid === uid) {
    //       delete this.listObj[objKeyArr[i]]
    //       return
    //     }
    //   }
    // },
    beforeUpload (file) {
      checkImages(file, this);
    },
    uploadUrls (file) {
      if (file && file.file) {
        this.uploadImages(file.file);
      }
    },
    uploadImages(file) {
      let formData = new FormData();
      formData.append('image', file);
      formData.append('model', '1');
      uploadSingleImage(formData)
        .then(res => {
          if (this.listObj && this.listObj.length>0) {
          } else {
            this.listObj = [];
          }
          this.listObj.push({uid: file.uid, url: res.data.url});
        });
    },
    handleRemove() {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
