<template>
    <div class="home">
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <el-table :data="tableData" :v-loading="loading" size="small">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="链接" prop="link"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div class="image">
              <img :src="scope.row.image && scope.row.image.url" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" top="5%" width="40%">
        <el-form v-model="form" label-position="left" label-width="120px">
          <el-form-item label="标题">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="form.link" size="small"></el-input>
          </el-form-item>
          <el-form-item label="图片">
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
              :file-list="form.images">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
            </el-upload>
            <div class="error" v-if="validated && form.images.length === 0">请选择图片进行上传</div>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" size="small" :min="0" :step="1"></el-input-number>
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
  import Pagination from '@/components/Pagination';
  import {checkImages} from '@/utils/index';
  import * as banner from '@/api/banner';
  import * as common from  '@/api/uploadImage';
    export default {
        name: 'Home',
      data () {
          return {
            loading: false,
            form: {
              images: []
            },
            tableData: [],
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            title: '新增',
            dialogFormVisible: false,
            dialogImageUrl: '',
            dialogVisible: false,
            validated: false
          };
      },
      components: {
        commonTable,
        Pagination
      },
      mounted () {
          this.query();
      },
      methods: {
        query () {
          this.loading = true;
          banner.getBannerList(this.params)
            .then(res => {
              this.tableData = res && res.data;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            })
        },
        add () {
          this.form = {
            images: []
          };
          this.title = '新增';
          this.dialogFormVisible = true;
        },
        edit (index, row) {
          this.form = Object.assign({}, row);
          this.title = '编辑';
          this.form.images = [];
          this.form.image && this.form.images.push(this.form.image);
          this.dialogFormVisible = true;
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
            // this.tableData.splice(index, 1);
            banner.deleteBannerImage(row.id)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                  this.params.pageNumber = 1;
                  this.totalCount =0;
                  this.query();
                }
              }).catch(err=>{
                this.params.pageNumber = 1;
                this.totalCount =0;
                this.query();
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        uploadUrl(file) {
          if (file && file.file) {
            this.uploadImages(file.file);
          }
        },
        uploadImages(file) {
          let formData = new FormData();
          formData.append('image', file);
          common.uploadSingleImage(formData)
            .then(res => {
              if (res.code === 200) {
                this.form.images = [];
                this.form.images.push(res.data);
                this.$forceUpdate();
              }
            })
        },
        beforeUpload (file) {
          checkImages(file, this);
        },
        uploadError() {
          this.$message.error('上传失败，请重新上传');
        },
        handleRemoveCoverImage (file, fileList) {
          this.form.images = fileList;
          common.deleteImage(file.id)
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
        save () {
          let params = {
            imageId: '',
            link: this.form.link,
            title: this.form.title,
            sort: this.form.sort
          };
          if (this.form.images && this.form.images.length>0) {
            params.imageId = this.form.images[0] && this.form.images[0].id;
          }
          if (!params.imageId) {
           this.validated = true;
            return;
          } else {
            this.validated = false;
          }
            if (this.form.id) {
                params.id = this.form.id;
                banner.updateBannerImage(params)
                  .then(res => {
                    this.dialogFormVisible = false;
                    this.params.pageNumber = 1;
                    this.totalCount =0;
                    this.query();
                  });
            } else {
              banner.addBannerImage(params)
                .then(res => {
                  this.dialogFormVisible = false;
                  this.params.pageNumber = 1;
                  this.totalCount =0;
                  this.query();
                });
            }
        }
      }
    }
</script>

<style scoped lang="scss">
.image{
 img{
   width:100px;
   height:60px;
 }
}
</style>
