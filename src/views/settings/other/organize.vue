<template>
    <div class="organize">
      <el-row>
        <el-form :inline="true" :model="params">
          <el-form-item label="选择疾病类目">
            <el-select v-model="params.category" placeholder="请选择疾病类目" size="small">
              <el-option label="类目A" value="categoryA"></el-option>
              <el-option label="类目B" value="categoryB"></el-option>
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
      <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                     :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                     @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
      </el-pagination>
      <!--新增/编辑弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="机构名称" label-width="120px">
            <el-input v-model="form.organizeName"></el-input>
          </el-form-item>
          <el-form-item label="机构编码" label-width="120px">
            <el-input v-model="form.coding"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" label-width="120px">
            <el-input v-model="form.contact"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" label-width="120px">
            <el-input v-model="form.contactPhone"></el-input>
          </el-form-item>
          <el-form-item label="配图" label-width="120px">
            <el-upload
              multiple
              action=""
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :auto-upload="false"
              :file-list="form.fileList">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，<span style="color: red">最多上传5张图片</span></div>-->
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
    export default {
        name: 'organize',
      data() {
          return {
            params: {
              page: 1,
              size: 10
            },
            loading: false,
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
                prop: 'organizeName',
                label: '机构名称'
              },
              {
                prop: 'contact',
                label: '联系人姓名'
              },
              {
                prop: 'contactPhone',
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
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {
              fileList: []
            },
            dialogVisible: false,
            dialogImageUrl: ''
          };
      },
      components: {
        commonTable
      },
      created () {
        this.query();
      },
      methods: {
        /**
         *  查询
         * */
        query () {
          this.tableData = [
            {
              coding: '12524512',
              organizeName: '机构一',
              contact: 'user1',
              contactPhone: '15845254525'
            },
            {
              coding: '12524514',
              organizeName: '机构二',
              contact: 'user2',
              contactPhone: '18754255252'
            }
          ];
          this.pageable = {
            total: 2,
            currentPage: 1,
            pageSize: 10
          };
        },
        add () {
          this.title ='新增';
          this.dialogFormVisible = true;
          this.form = {};
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
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dialog-footer{
    text-align: center;
  }
</style>
