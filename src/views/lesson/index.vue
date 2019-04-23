<template>
  <div class="app-container">
    <el-row>
      <el-button size="small" type="primary" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增-->

    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog1" top="5%" bottom="5%" width="80%">
    <!--<el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" :fullscreen="true">-->
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="form.title" size="small"></el-input>
          <div class="error" v-if="validated && !form.title">请输入标题</div>
        </el-form-item>
        <el-form-item label="课程价格" label-width="120px">
          <el-input v-model="form.price" size="small"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="120px">
          <!--<el-input v-model="form.startTime"></el-input>-->
          <el-date-picker
            v-model="form.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size="small"
            placeholder="选择日期时间">
          </el-date-picker>
          <div class="error" v-if="validated && !form.startTime">请选择开始时间</div>
        </el-form-item>
        <el-form-item label="报名人数" label-width="120px">
          <el-input v-model="form.members" size="small"></el-input>
        </el-form-item>
        <el-form-item label="活动地址" label-width="120px">
          <el-input v-model="form.address" size="small"></el-input>
        </el-form-item>
        <el-form-item label="封面图" label-width="120px">
          <el-upload
            action=""
            :on-error="uploadError"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveCoverImage"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            name="image"
            :file-list="form.coverImage">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="展示图" label-width="120px">
          <el-upload
            multiple
            action=""
            list-type="picture-card"
            :limit="5"
            :http-request="uploadUrls"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveCourseImage"
            :on-exceed="onExceeds"
            :before-upload="beforeUpload"
            :before-remove="beforeRemoveCourseImages"
            :file-list="form.courseImages">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，<span style="color: red">最多上传5张图片</span></div>
            <!--<div slot="tip" class="el-upload__tip">最多上传5张图片</div>-->
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="详情描述">
          <div class="solution-ue">
            <tinymce :height="300" ref="editor" v-model="form.description" :show-modal="false" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '../common/commonTable';
  import Tinymce from '@/components/Tinymce';
  import Pagination from '@/components/Pagination';
  import {getCourseInfo,uploadSingleImage,addCourse, updateCourse,deleteCourse} from '@/api/lesson';
  import {checkImages} from "../../utils";

  export default {
    name: 'Index',
    data () {
      return {
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'startTime',
            label: '开始时间'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            prop: 'members',
            label: '当前报名人数'
          },
          // {
          //   link:true,
          //   prop: 'members',
          //   label: '当前报名人数',
          //   func: this.showDetails
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
        ],                  // 表格表头
        loading: false,                 // 显示加载
        tableData: [],                  // 表格数据
        pageable: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },                // 分页
        params: {
          pageNumber: 1,
          pageSize: 20
        },
        totalCount: 0,
        dialogFormVisible: false,      // 是否显示弹框
        form: {
          coverImage: [],   // 封面图
          courseImages: []        // 展示图
        },                    // 表单数据
        dialogVisible: false,           // 上传图片弹框显示
        dialogImageUrl: '',
        fileList: [],
        title: '新增',                 // 弹框
        validated: false
      };
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
      query(){
        this.loading = true;
        getCourseInfo(this.params)
          .then(res => {
            this.loading = false;
            this.tableData = res && res.data && res.data.content;
            this.totalCount = res && res.data && res.data.totalElements;
          });
      },
      /**
       * 编辑
       * */
      edit (index, row) {
        this.title =  '编辑';
        this.dialogFormVisible = true;
        this.form = row;
      },
      /**
       * 删除
       * */
      deleteRow (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCourse(row.courseId)
            .then(res => {
              this.$message({
                type: 'success',
                message: res && res.message
              });
              this.query();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*新增*/
      add () {
        this.title =  '新增';
        this.dialogFormVisible = true;
        this.form = {
          courseImages: [],
          coverImage: []
        };
      },
      /**
       * 上传封面图
       * */
      uploadUrl(file) {
        if (file && file.file) {
          this.uploadImages(file.file, 0);
        }
      },
      /**
       * 上传展示图
       * */
      uploadUrls(file) {
        if (file && file.file) {
          this.uploadImages(file.file, 1);
        }
      },
      /**
       * flag 为0 代表上传封面图， 为1 代表上传展示图
       * */
      uploadImages(file, flag) {
        let formData = new FormData();
        formData.append('image', file);
        formData.append('model', '1');
        uploadSingleImage(formData)
          .then(res => {
            if (res.code === 200) {
              // 展示图
              if (flag) {
                this.form.courseImages.push(res.data);
              } else {
                // 封面图
                this.form.coverImage.push(res.data);
              }
            }
          })
      },
      uploadError() {
        this.$message.error('上传失败，请重新上传');
      },
      handleRemoveCoverImage (file, fileList) {
        this.form.coverImage = fileList;
      },
      handleRemoveCourseImage(file, fileList) {
        this.form.courseImages = fileList;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onExceed() {
        this.$message({
          type: 'info',
          message: '最多只能上传一个图片',
          duration: 6000
        });
      },
      onExceeds() {
        this.$message({
          type: 'info',
          message: '最多只能上传五张图片',
          duration: 6000
        });
      },
      beforeUpload (file) {
        checkImages(file, this);
      },
      beforeRemoveCourseImages(file, fileList){

      },
      showDetails (index, row) {
        console.log(index);
        console.log(row);
      },
      /**
       * 保存
       * */
      save () {
        if (!this.form.title || !this.form.startTime) {
          this.validated = true;
          return ;
        } else {
          this.validated = false;
        }
        let params = {
          address: this.form.address,
          description: this.form.description,
          members: this.form.members,
          startTime: this.form.startTime,
          title: this.form.title,
          price: this.form.price,
          coverImage: {},
          courseImages: []
        };
        if (this.form.coverImage && this.form.coverImage.length>0) {
          params.coverImage = {
            imageId: this.form.coverImage[0].id
          }
        }
       if (this.form.courseImages && this.form.courseImages.length>0) {
         for (let i in this.form.courseImages) {
           params.courseImages.push({imageId: this.form.courseImages[i].id});
         }
       }
        if (this.form.courseId) {
          params.courseId = this.form.courseId;
          // 编辑
          updateCourse(params)
            .then(res => {
              if (res && res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res && res.message,
                  duration: 6000
                });
              }
              this.query();
            })
        } else {
          // 新增
          addCourse(params)
            .then(res => {
              if (res && res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res && res.message,
                  duration: 6000
                });
              }
              this.query();
            })
        }
        this.dialogFormVisible = false;
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .add-dialog1{
    .solution-ue{
      margin-left:120px;
    }
    .el-dialog__body{
      max-height: 500px !important;
      overflow: auto !important;
    }
    .item-wrap{
      display: inline-block;
      margin-right:10%;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
