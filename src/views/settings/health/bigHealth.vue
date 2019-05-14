<template>
  <div class="big-health">
    <el-row>
      <el-button type="primary" size="small" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增/编辑 弹框-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" width="70%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px">
          <el-input v-model="form.number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="养生类目名称" label-width="120px">
          <el-input v-model="form.healthName" size="small"></el-input>
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
            :file-list="form.bgImage">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容介绍" label-width="120px">
          <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
        </el-form-item>
        <el-form-item label="相关解决方案" label-width="120px">
          <el-select v-model="form.solutions"   class="select" size="small">
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
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Tinymce from '@/components/Tinymce';
  import Pagination from '@/components/Pagination'
  import {uploadSingleImage} from '@/api/uploadImage';
  import {checkImages} from '@/utils/index';
  import * as health from '@/api/health';
    export default {
        name: 'bigHealth',
      data () {
          return {
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
                prop: 'healthName',
                label: '养生类目名称'
              },
              // {
              //   prop: 'createBy',
              //   label: '创建人'
              // },
              // {
              //   prop: 'createTime',
              //   label: '创建时间'
              // },
              // {
              //   prop: 'modifyBy',
              //   label: '修改人'
              // },
              // {
              //   prop: 'modifyTime',
              //   label: '修改时间'
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
            loading: false,
            tableData: [],
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {
              bgImage: []
            }
          };
      },
      components: {
        commonTable,
        Tinymce,
        Pagination
      },
      created() {
          this.query();
      },
      methods: {
          /**
           * 查询
           * */
        query(){
            this.loading = true;
            health.getHealthList(this.params)
              .then(res => {
                this.tableData = res && res.data && res.data.content;
                this.totalCount = res && res.data && res.data.totalElements;
                this.loading = false;
              }).catch(res => {
              this.loading = false;
            });
        },
        /**
         * 新增
         * */
        add () {
          this.dialogFormVisible = true;
          this.title = '新增';
          this.form = {
            bgImage: []
          };
        },
        /**
         * 编辑
         * */
        edit (index, row){
          this.dialogFormVisible = true;
          this.title = '编辑';
          this.form = Object.assign({}, row);
          this.form.bgImage = [];
          if (row.bgImage) {
            this.form.bgImage.push(row.bgImage)
          }
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
            health.deleteHealth(row.healthId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                  this.query();
                }
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
        },
        save () {
          let params = Object.assign({}, this.form);
          params.bgImage = {};
          params.bgImageId = this.form.bgImage[0].id;
          if (!params.healthId) {
            health.addHealth(params)
              .then(res => {
                this.resetParams(res);
              })
          } else {
            health.updateHealth(params)
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
        }
      }
    }
</script>

<style scoped>

</style>
