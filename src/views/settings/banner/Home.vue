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
      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" v-loading="loadingDialog" top="5%" width="40%">
        <el-form v-model="form" label-position="left" label-width="120px">
          <el-form-item label="标题">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <!--<el-input size="small" v-model="form.type"></el-input>-->
            <el-select size="small" v-model="form.type" @change="change()">
              <el-option value="commodity" label="商品"></el-option>
              <el-option value="case" label="案例"></el-option>
              <el-option value="course" label="课程"></el-option>
              <el-option value="link" label="链接"></el-option>
            </el-select>
            <div class="error" v-if="validated && !form.type">请选择类型</div>
          </el-form-item>
          <el-form-item :label="handleTypeTitle()"  v-if="form.type && form.type !== 'link'">
            <el-select size="small" v-model="form.jumpId" @change="changeSelect()">
              <el-option v-for="(item, index) in bannerTypes" :value="item.key" :key="index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="链接" v-if="form.type === 'link'">
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
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, 建议大小750*440px, <span style="color: red">只能上传1张图片</span></div>
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
              images: [],
              jumpId: ''
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
            validated: false,
            bannerTypes: [],
            loadingDialog: false
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
          this.loadingDialog = true;
          this.dialogFormVisible = true;
          this.form = Object.assign({}, row);
          this.title = '编辑';
          this.form.images = [];
          let link = row.link && JSON.parse(row.link) || {};
          this.form.type = link.type || '';
          if (this.form.type !== 'link') {
            this.form.jumpId = String(link.jumpId);
          } else {
            this.form.link = link.link
          }
          this.form.image && this.form.images.push(this.form.image);
          this.loadingDialog = false;
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
            sort: this.form.sort,
            type: this.form.type
          };
          if (this.form.type !== '' && this.form.type !== 'link') {
            params.jumpId = this.form.jumpId;
          }
          if (this.form.images && this.form.images.length>0) {
            params.imageId = this.form.images[0] && this.form.images[0].id;
          }
          if (!params.imageId || !this.form.type) {
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
        },
        getTypes () {
          if (this.form.type) {
            banner.getBannerTypes(this.form.type)
              .then(res => {
                this.bannerTypes = res.data;
              })
          }
        },
        change () {
          this.form.jumpId = '';
          if (this.form.type !== 'link') {
            this.form.link = '';
            this.getTypes();
          } else {
            this.form.link = '';
            this.form.jumpId = '';
          }
          this.$forceUpdate();
        },
        changeSelect () {
          this.$forceUpdate();
        },
        handleTypeTitle () {
          if (this.form.type === 'commodity') {
            return '请选择商品';
          } else if (this.form.type === 'case') {
            return '请选择案例';
          } else if (this.form.type === 'course') {
            return '请选择课程';
          }
        }
      },
      watch: {
          'form.type': {
            handler (curVal, oldVal) {
              this.form.type === curVal;
              if (curVal !== '' || curVal !== 'link') {
                this.getTypes();
              }
            },
            deep: true
          },
        'form.jumpId': {
            handler (curVal, oldVal) {
              this.$forceUpdate();
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
