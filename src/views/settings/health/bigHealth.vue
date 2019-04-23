<template>
  <div class="big-health">
    <el-row>
      <el-button type="primary" size="small" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
    </el-pagination>
    <!--新增/编辑 弹框-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px">
          <el-input v-model="form.coding" size="small"></el-input>
        </el-form-item>
        <el-form-item label="养生类目名称" label-width="120px">
          <el-input v-model="form.healthCategoryName" size="small"></el-input>
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
        <el-form-item label="内容介绍" label-width="120px">
          <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Tinymce from '@/components/Tinymce';
  import Pagination from '@/components/Pagination';
  import {uploadSingleImage} from '@/api/uploadImage';
  import {checkImages} from '@/utils/index';
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
                prop: 'coding',
                label: '编码'
              },
              {
                prop: 'healthCategoryName',
                label: '养生类目名称'
              },
              {
                prop: 'createBy',
                label: '创建人'
              },
              {
                prop: 'createTime',
                label: '创建时间'
              },
              {
                prop: 'modifyBy',
                label: '修改人'
              },
              {
                prop: 'modifyTime',
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
            loading: false,
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {
              bg_images: []
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
            this.tableData = [
              {
                coding: '125245125',
                healthCategoryName: '类目A',
                createBy: 'sysadmin',
                createTime: '2018-12-12',
                modifyBy: 'datadmin',
                modifyTime: '2018-12-21'
              },
              {
                coding: '125245126',
                healthCategoryName: '类目B',
                createBy: 'sysadmin',
                createTime: '2018-12-12',
                modifyBy: 'sysadmin',
                modifyTime: '2018-12-21'
              }
            ];
            this.pageable = {
              total: 2,
              currentPage: 1,
              pageSize: 10
            };
        },
        /**
         * 新增
         * */
        add () {
          this.dialogFormVisible = true;
          this.title = '新增';
          this.form = {};
        },
        /**
         * 编辑
         * */
        edit (index, row){
          this.dialogFormVisible = true;
          this.title = '编辑';
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

<style scoped>

</style>
