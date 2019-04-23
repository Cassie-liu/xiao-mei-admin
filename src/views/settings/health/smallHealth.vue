<template>
  <div class="small-health">
    <el-row>
      <el-button type="primary" size="small" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
    </el-pagination>
    <!--新增/编辑弹框-->
    <!--<el-scrollbar :native="false" wrap-style="" wrap-class="" view-class="" tag="section">-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="80%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px" size="small">
         <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="选择养生类目"  label-width="120px">
          <el-select v-model="form.healthCategory" class="select" size="small">
            <el-option label="养生类目一" value="A"></el-option>
            <el-option label="养生类目二" value="B"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="养生方式名称" label-width="120px">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="介绍标题" label-width="120px">
          <el-input v-model="form.title" size="small"></el-input>
        </el-form-item>
        <el-form-item label="背景图" label-width="120px">
          <el-upload
            action=""
            :on-error="uploadError"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadUrl"
            :on-remove="handleRemoveImage"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            name="image"
            :file-list="form.bg_images">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="音乐链接" label-width="120px">
          <el-input size="small" v-model="form.musicLink"></el-input>
        </el-form-item>
        <el-form-item label="养生方式类型" label-width="120px">
          <el-select v-model="form.type">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="介绍描述" label-width="120px">
          <div class="solution-ue">
            <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
          </div>
        </el-form-item>
        <el-form-item label="相关解决方案" label-width="120px">
          <el-select v-model="form.relateSolveCase"  multiple class="select" size="small">
            <el-option label="解决方案一" value="case1"></el-option>
            <el-option label="解决方案二" value="case2"></el-option>
            <el-option label="解决方案三" value="case3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--</el-scrollbar>-->
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Tinymce from '@/components/Tinymce';
  import Pagination from '@/components/Pagination';
  import {uploadSingleImage} from '@/api/uploadImage';
  import {checkImages} from '@/utils/index';
  export default {
    name: 'cause',
    data () {
      return {
        loading: false,
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'number',
            label: '编码'
          },
          {
            prop: 'healthCategory',
            label: '所属养生类目'
          },
          {
            prop: 'name',
            label: '养生方式名称'
          },
          {
            prop: 'title',
            label: '介绍标题'
          },
          {
            prop: 'relateSolveCase',
            label: '相关解决方案'
          },
          {
            type: 'function',
            label: '操作',
            functionOpt: [
              {
                type: 'text',
                label: '编辑',
                func: this.edit
              },
              {
                type: 'text',
                label: '删除',
                func: this.deleteRow
              }
            ]
          }
        ],
        tableData: [],
        pageable: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },
        title: '新增',    // 弹框标题
        type: 'add',
        dialogFormVisible: false,
        form: {
          number: '',
          healthCategory: '',
          title: '',
          name: '',
          content: '',
          relateSolveCase: []
        }
      }
    },
    components: {
      commonTable,
      Tinymce,
      Pagination
    },
    created () {
      this.query();
    },
    methods: {
      /**
       *  查询
       * */
      query () {
        this.tableData = [
          {
            number: '1252452152',
            healthCategory: '养生类目A',
            name: '口腔溃疡',
            title: '15214814',
            relateSolveCase: ['解决方案一', '解决方案二'],
            content: '<u>111111111111111111111111111111111111</u>'
          },
          {
            number: '1252452152',
            healthCategory: '养生类目B',
            name: '口腔溃疡',
            title: '15214814',
            relateSolveCase: ['解决方案二', '解决方案三'],
            content: '<u>2222222222222222222222222</u>'
          },
        ];
        this.pageable = {
          total: 2,
          currentPage: 1,
          pageSize: 10
        };
      },
      add () {
        this.title ='新增';
        this.type = 'add';
        this.dialogFormVisible = true;
        this.form = {
          relateSolveCase: [],
          content: ''
        };
      },
      edit (index, row) {
        this.title ='编辑';
        this.type = 'edit';
        this.dialogFormVisible = true;
        this.form = row;
      },
      save () {
        this.dialogFormVisible = false;
        console.log(this.form);
      },
      deleteRow (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      uploadError() {
        this.$message.error('上传失败，请重新上传');
      },
      onExceed() {
        this.$message({
          type: 'info',
          message: '最多只能上传一个图片',
          duration: 6000
        });
      },
      uploadUrl (file) {
        if (file && file.file) {
          this.uploadImages(file.file, 1);
        }
      },
      uploadImages () {
        let formData = new FormData();
        formData.append('image', file);
        formData.append('model', '1');
      },
      beforeUpload (file) {
        checkImages(file, this);
      },
      handleRemoveImage (file, fileList) {}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .small-health{
    .add-dialog{
      .el-dialog__body{
        max-height: 500px !important;
        overflow: auto !important;
      }
    }
    .select{
      width: 100%;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
