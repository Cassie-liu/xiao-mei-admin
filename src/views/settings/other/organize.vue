<template>
    <div class="organize">
      <el-row>
        <el-button type="primary" size="small" @click="add()">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--新增/编辑弹框-->
      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="机构编码" label-width="120px">
            <el-input v-model="form.number" size="small"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" label-width="120px">
            <el-input v-model="form.name" size="small"></el-input>
            <div class="error" v-if="validated && !form.name">请输入机构名称</div>
          </el-form-item>
          <el-form-item label="机构地址" label-width="120px">
            <el-input v-model="form.address" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" label-width="120px">
            <el-input v-model="form.contactName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" label-width="120px">
            <el-input v-model="form.phone" size="small"></el-input>
          </el-form-item>
          <el-form-item label="配图" label-width="120px">
            <el-upload
              multiple
              action=""
              list-type="picture-card"
              :http-request="uploadUrls"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              name="image"
              :file-list="form.officeImages">
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
  import Pagination from '@/components/Pagination';
  import  * as organize from '@/api/organize';
  import {checkImages} from '@/utils';
  import {uploadSingleImage} from '@/api/uploadImage';
    export default {
        name: 'organize',
      data() {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
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
                prop: 'name',
                label: '机构名称'
              },
              {
                prop: 'address',
                label: '机构地址'
              },
              {
                prop: 'contactName',
                label: '联系人姓名'
              },
              {
                prop: 'phone',
                label: '联系人电话'
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
            dialogFormVisible: false,
            form: {
              officeImages: []
            },
            validated: false
          };
      },
      components: {
        commonTable,
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
          this.loading = true;
          organize.getOrganizeList(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            });
        },
        add () {
          this.title ='新增';
          this.dialogFormVisible = true;
          this.form = {
            officeImages:[]
          };
        },
        edit (index, row) {
          this.title ='编辑';
          this.dialogFormVisible = true;
          this.form = row;
        },
        deleteRow (index, row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            organize.deleteOrganize(row.officeId)
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
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        beforeUpload (file) {
          checkImages(file, this);
        },
        uploadUrls(file) {
          if (file && file.file) {
            this.uploadImages(file.file);
          }
        },
        uploadImages(file) {
          let formData = new FormData();
          formData.append('image', file);
          formData.append('model', '4');
          uploadSingleImage(formData)
            .then(res => {
              this.form.officeImages.push(res.data);
            })
        },
        save () {
          let params = Object.assign({}, this.form);
          if (!this.form.name) {
            this.validated = true;
            return;
          }
          params.officeImages = [];
          for (let i in this.form.officeImages) {
            params.officeImages.push({imageId: this.form.officeImages[i].id});
          }
          if (!params.officeId) {
            organize.addOrganize(params)
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
              })
          } else {
            organize.updateOrganize(params)
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
              })
          }
          this.dialogFormVisible = false
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dialog-footer{
    text-align: center;
  }
</style>
