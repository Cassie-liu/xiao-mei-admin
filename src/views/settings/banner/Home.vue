<template>
    <div class="home">
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
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
            <!--<el-input v-model="form.image" size="small"></el-input>-->
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
  import {uploadSingleImage} from '@/api/uploadImage';
    export default {
        name: 'Home',
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
                prop: 'link',
                label: '链接'
              },
              {
                prop: 'image',
                label: '图片'
              },
              {
                prop: 'sort',
                label: '排序'
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
            loading: false,
            form: {},
            tableData: [],
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            title: '新增',
            dialogFormVisible: false,
            dialogImageUrl: '',
            dialogVisible: false

          };
      },
      components: {
        commonTable,
        Pagination
      },
      mounted () {},
      methods: {
        query () {},
        add () {
          this.form = {};
          this.title = '新增';
          this.dialogFormVisible = true;
        },
        edit (index, row) {
          this.form = row;
          this.title = '编辑';
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
            deleteMajorDisease(row.diseaseId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                }
              }).catch(err=>{

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
          // formData.append('model', '1');
          uploadSingleImage(formData)
            .then(res => {
              if (res.code === 200) {
                console.log(res);
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
        save () {}
      }
    }
</script>

<style scoped>

</style>
