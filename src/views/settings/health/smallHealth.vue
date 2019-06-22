<template>
  <div class="small-health">
    <el-row>
      <el-button type="primary" size="small" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
    <!--新增/编辑弹框-->
    <!--<el-scrollbar :native="false" wrap-style="" wrap-class="" view-class="" tag="section">-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="70%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px" size="small">
         <el-input v-model="form.number"></el-input>
        </el-form-item>
        <!--<el-form-item label="选择养生类目"  label-width="120px">-->
          <!--<el-select v-model="form.categoryName" class="select" size="small">-->
            <!--<el-option v-for="(item, index) in healthList" :label="item.healthName" :value="item.healthId" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="养生方式名称" label-width="120px">
          <el-input v-model="form.wayName" size="small"></el-input>
        </el-form-item>
        <!--<el-form-item label="介绍标题" label-width="120px">-->
          <!--<el-input v-model="form.title" size="small"></el-input>-->
        <!--</el-form-item>-->
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
            :file-list="form.bgImage">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="养生方式类型" label-width="120px">
          <el-select v-model="form.type" size="small">
            <el-option label="类型一" value="1"></el-option>
            <el-option label="类型二" value="2"></el-option>
            <el-option label="类型三" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音乐链接" label-width="120px">
          <el-input size="small" v-model="form.musicUrl"></el-input>
        </el-form-item>
        <el-form-item label="介绍描述" label-width="120px">
          <div class="solution-ue">
            <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
          </div>
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
  import * as health from '@/api/health';
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
          // {
          //   prop: 'healthCategory',
          //   label: '所属养生类目'
          // },
          {
            prop: 'wayName',
            label: '养生方式名称'
          },
          // {
          //   prop: 'title',
          //   label: '介绍标题'
          // },
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
        params: {
          pageNumber: 1,
          pageSize: 20
        },
        totalCount: 0,
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
        },
        healthList: []
      }
    },
    components: {
      commonTable,
      Tinymce,
      Pagination
    },
    created () {
      this.queryHealthList();
      this.query();
    },
    methods: {
      /**
       * 查询养生类目
       * */
      queryHealthList () {
        health.getHealthList()
          .then(res => {
            this.healthList = res.data.content;
          })
      },
      /**
       *  查询
       * */
      query () {
       this.loading = true;
       health.getHealthWay(this.params)
         .then(res => {
           this.tableData = res && res.data && res.data.content;
           this.totalCount = res && res.data && res.data.totalElements;
           this.loading = false;
         }).catch(res => {
          this.loading = false;
       })
      },
      add () {
        this.title ='新增';
        this.type = 'add';
        this.dialogFormVisible = true;
        this.form = {
          bgImage: []
        };
      },
      edit (index, row) {
        this.title ='编辑';
        this.type = 'edit';
        this.dialogFormVisible = true;
        this.form = Object.assign({}, row);
        this.form.bgImage = [];
        if (row.bgImage) {
          this.form.bgImage.push(row.bgImage)
        }
      },
      save () {
        let params = {
          bgImageId: '',
          content: this.form.content,
          musicUrl: this.form.musicUrl,
          number: this.form.number,
          type: this.form.type,
          wayName: this.form.wayName,
        };
        params.bgImageId = this.form.bgImage  && this.form.bgImage[0] &&  this.form.bgImage[0].id;
        if (!this.form.healthWayId) {
          health.addHealthWay(params)
            .then(res => {
              this.resetParams(res);
            })
        } else {
          params.healthWayId = this.form.healthWayId;
          health.updateHealthWay(params)
            .then(res => {
              this.resetParams(res);
            })
        }
        this.dialogFormVisible = false
      },
      resetParams (res) {
        if (res && res.code === 200) {
          this.$message({
            message: res && res.message,
            type: 'success'
          });
          this.loading = false;
          this.params.pageNumber = 1;
          this.totalCount =0;
          this.query();
        }
      },
      deleteRow (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          health.deleteHealthWay(row.healthWayId)
            .then(res => {
              if (res && res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.query();
              }
            })
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
          this.uploadImages(file.file);
        }
      },
      uploadImages (file) {
        let formData = new FormData();
        formData.append('image', file);
        formData.append('model', '1');
        uploadSingleImage(formData)
          .then(res => {
            if (res.code === 200) {
              this.form.bgImage = [];
              this.form.bgImage.push(res.data)
            }
          })
      },
      beforeUpload (file) {
        checkImages(file, this);
      },
      handleRemoveImage (file, fileList) {
        this.form.bgImage = fileList;
      }
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
