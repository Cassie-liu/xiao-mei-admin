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
      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" width="70%" >
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="选择疾病类目" label-width="120px">
            <el-select v-model="form.diseaseId" placeholder="请选择疾病类目" size="small" class="select">
              <el-option v-for="item in options" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
            </el-select>
            <div class="error" v-if="validated && !form.diseaseId">请选择疾病类目</div>
          </el-form-item>
          <el-form-item label="疾病类型" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择疾病类型" size="small" class="select">
              <el-option key="0" label="普通疾病" value="0"></el-option>
              <el-option key="1" label="常见疾病" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" label-width="120px">
            <el-input v-model="form.number" size="small"></el-input>
            <div class="error" v-if="validated && !form.number">请输入编码</div>
          </el-form-item>
          <el-form-item label="疾病名称" label-width="120px">
            <el-input v-model="form.diseaseDetailName" size="small"></el-input>
            <div class="error" v-if="validated && !form.diseaseDetailName">请输入疾病名称</div>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <!--<tinymce :height="300" ref="editor" v-model="form.content" :show-modal="false" />-->
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="form.content">
            </el-input>
          </el-form-item>
          <el-form-item label="背景图" label-width="120px">
            <el-upload
              action=""
              list-type="picture-card"
              :http-request="uploadUrls"
              :limit="1"
              :on-exceed="onExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveBgImage"
              :before-upload="beforeUpload"
              :file-list="form.bgImages">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,  建议大小750*326px, <span style="color: red">只能上传1张图片</span></div>
            </el-upload>
            <div class="error" v-if="validated && form.bgImages.length === 0">请选择背景图进行上传</div>
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
              :on-exceed="onExceed"
              :on-remove="handleRemoveIconmage"
              :before-upload="beforeUpload"
              :file-list="form.icon">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, 建议大小220*140px, <span style="color: red">只能上传1张图片</span></div>
            </el-upload>
            <div class="error" v-if="validated && form.icon.length === 0">请选择图标进行上传</div>
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
  import * as common from  '@/api/uploadImage';
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
            }).catch(err => {
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
          this.form = {
            bgImages : [],
            icon: []
          };
        },
        edit (index, row) {
          let params = {
            bgImages : [],
            icon: []
          };
          this.title ='编辑';
          this.type = 'edit';
          this.form = Object.assign({}, row);
          this.form.bgImages &&  params.bgImages.push(this.form.bgImages);
          this.form.icon && params.icon.push(this.form.icon);
          this.form.bgImages = params.bgImages;
          this.form.icon = params.icon;
          this.dialogFormVisible = true;
        },
        /**
         * 保存
         * */
        save () {
          let params = {
            bgImages: {
              imageId: null
            },
            icon: {
              imageId: null
            },
            number: this.form.number,
            type: this.form.type,
            content: this.form.content,
            diseaseId: this.form.diseaseId,
            diseaseDetailName: this.form.diseaseDetailName
          };
          this.params.diseaseId = this.form.diseaseId;
          params.bgImages.imageId = this.form.bgImages && this.form.bgImages[0] && this.form.bgImages[0].id;
          params.icon.imageId = this.form.icon && this.form.icon[0] && this.form.icon[0].id;
          if (!params.diseaseId || !params.diseaseDetailName || !params.number || !params.icon.imageId || !params.bgImages.imageId) {
            this.validated = true;
            return;
          } else {
            this.validated = false;
          }
          if (!this.form.diseaseDetailId) {
            addDiseaseDetail(params)
              .then(res =>{
                this.resetParams(res);
              });
          } else {
            params.diseaseDetailId = this.form.diseaseDetailId;
            updateDiseaseDetail(params)
              .then(res =>{
                this.resetParams(res);
              });
          }
          this.dialogFormVisible = false;
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
          common.uploadSingleImage(formData)
            .then(res => {
              if (res.code === 200) {
                // 背景图
                if (!flag) {
                  this.form.bgImages = [];
                  this.form.bgImages.push(res.data);
                } else {
                  // 图标
                  this.form.icon = [];
                  this.form.icon.push(res.data);
                }
                this.$forceUpdate();
              }
            })
        },
        onExceed() {
          this.$message({
            type: 'info',
            message: '最多只能上传一个图片',
            duration: 6000
          });
        },
        uploadError() {
          this.$message.error('上传失败，请重新上传');
        },
        /**
         * 删除图片
         * */
        handleRemoveBgImage(file, fileList) {
          this.form.bgImages = fileList;
          common.deleteImage(file.id)
        },
        handleRemoveIconmage(file, fileList) {
          this.form.icon = fileList;
          common.deleteImage(file.id)
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
