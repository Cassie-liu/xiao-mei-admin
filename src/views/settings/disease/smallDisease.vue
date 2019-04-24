<template>
    <div class="small-disease">
      <el-row>
       <el-form :inline="true" :model="params">
         <el-form-item label="选择疾病类目">
           <el-select v-model="params.diseaseId" placeholder="请选择疾病类目" size="small">
             <el-option v-if="categoryLoading" v-loading="categoryLoading" :value="''"></el-option>
             <el-option v-if="!categoryLoading" v-for="item in options" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" size="small" @click="query()">查询</el-button>
         </el-form-item>
       </el-form>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="add()">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--新增/编辑弹框-->
      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="选择疾病类目" label-width="120px">
            <el-select v-model="form.diseaseId" placeholder="请选择疾病类目" size="small" class="select">
              <el-option v-for="item in options" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
            </el-select>
            <div class="error" v-if="validated && !form.diseaseId">请选择疾病类目</div>
          </el-form-item>
          <el-form-item label="疾病类型" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择疾病类型" size="small" class="select">
              <el-option key="0" label="普通疾病" :value="0"></el-option>
              <el-option key="1" label="常见疾病" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" label-width="120px" size="small">
            <el-input v-model="form.number"></el-input>
            <div class="error" v-if="validated && !form.number">请输入编码</div>
          </el-form-item>
          <el-form-item label="疾病名称" label-width="120px" size="small">
            <el-input v-model="form.diseaseDetailName"></el-input>
            <div class="error" v-if="validated && !form.diseaseDetailName">请输入疾病名称</div>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <tinymce :height="300" ref="editor" v-model="form.content" :show-modal="false" />
          </el-form-item>
          <el-form-item label="背景图" label-width="120px">
            <el-upload
              action=""
              list-type="picture-card"
              :http-request="uploadUrls"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveCourseImage"
              :before-upload="beforeUpload"
              :file-list="form.bgImages">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal="false">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="图标" label-width="120px">
            <el-upload
              action=""
              list-type="picture-card"
              :http-request="uploadIcon"
              :limit="1"
              :on-remove="handleRemoveCourseImage"
              :before-upload="beforeUpload"
              :file-list="form.icon">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
  import commonTable from '@/views/common/commonTable';
  import {getDiseaseDetail,getDiseaseMajorCategory,addDiseaseDetail,updateDiseaseDetail, deleteDiseaseDetail} from '@/api/disease';
  import Pagination from '@/components/Pagination';
  import Tinymce from '@/components/Tinymce';
  import {checkImages} from '@/utils/index';
  import {uploadSingleImage} from '@/api/uploadImage';
    export default {
        name: 'smallDisease',
        data () {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20,
              diseaseId: ''
            },
            totalCount: 0,
            options: [],
            loading: false,     // table loading
            categoryLoading: true,     // category loading
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
                prop: 'diseaseName',
                label: '疾病类目名称'
              },
              {
                prop: 'diseaseDetailName',
                label: '疾病名称'
              },
              {
                prop: 'createUserName',
                label: '创建人'
              },
              {
                prop: 'createTime',
                label: '创建时间'
              },
              {
                prop: 'updateUserName',
                label: '修改人'
              },
              {
                prop: 'updateTime',
                label: '修改时间'
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
            title: '新增',    // 弹框标题
            type: 'add',
            dialogFormVisible: false,
            form: {
              bgImages: [],
              icon: []
            },
            validated: false,
            dialogVisible: false,
            dialogImageUrl: ''
          }
        },
      components: {
        commonTable,
        Pagination,
        Tinymce
      },
      created () {
          // this.query();
        this.queryCategory();
      },
      methods: {
        /**
         *  查询
         * */
        query () {
          if (!this.params.diseaseId) {
            this.$alert('请选择疾病类目','提示', {
              confirmButtonText: '确定'
            });
            return;
          }
          this.loading = true;
          getDiseaseDetail(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            })
        },
        /**
         * 查询疾病类目
         * */
        queryCategory () {
          getDiseaseMajorCategory()
            .then(res => {
              this.options = res && res.data;
              this.categoryLoading = false;
            })
        },
        add () {
          this.title ='新增';
          this.type = 'add';
          this.dialogFormVisible = true;
          this.form = {};
        },
        edit (index, row) {
          this.title ='编辑';
          this.type = 'edit';
          this.dialogFormVisible = true;
          this.form = row;
        },
        /**
         * 保存
         * */
        save () {
          let params = Object.assign({}, this.form);
          if (!this.form.diseaseId || !this.form.diseaseDetailName || !this.form.number) {
            this.validated = true;
            return;
          }
          this.params.diseaseId = this.form.diseaseId;
          this.loading = true;
          params.bgImages = {};
          params.icon = {};
            for (let i in this.form.bg_images) {
              params.bgImages.imageId = this.form.bg_images[0].id;
            }
          for (let i in this.form.icon) {
            params.icon.imageId = this.form.icon[0].id;
          }
          debugger;
          if (!params.id) {
            addDiseaseDetail(params)
              .then(res =>{
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
              });
          } else {
            updateDiseaseDetail(params)
              .then(res =>{
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
              });
          }
          this.dialogFormVisible = false;
        },
        deleteRow (index, row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.tableData.splice(index, 1);
            deleteDiseaseDetail(row.diseaseDetailId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                  this.query();
                }
              }).catch(err => {

            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        beforeUpload (file) {
          checkImages(file, this);
        },
        /**
         * 上传背景图
         * */
        uploadUrls(file) {
          if (file && file.file) {
            this.uploadImages(file.file, 0);
          }
        },
        /**
         * 上传图标
         * */
        uploadIcon (file) {
          if (file && file.file) {
            this.uploadImages(file.file, 1);
          }
        },
        /**
         * flag 为0 代表上传背景图， 为1 代表上传图标
         * */
        uploadImages(file, flag) {
          let formData = new FormData();
          formData.append('image', file);
          formData.append('model', '3');
          uploadSingleImage(formData)
            .then(res => {
              if (res.code === 200) {
                // 背景图
                if (!flag) {
                  this.form.bg_images = [];
                  this.form.bg_images.push(res.data);
                } else {
                  // 图标
                  this.form.icon = [];
                  this.form.icon.push(res.data);
                }
              }
            })
        },
        uploadError() {
          this.$message.error('上传失败，请重新上传');
        },
        handleRemoveCourseImage (file, fileList) {
          this.form.coverImage = fileList;
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .small-disease{
    .select{
      width: 100%;
    }
  }
</style>
