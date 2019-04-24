<template>
    <div class="customer-service">
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--新增/编辑 弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="40%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="客服姓名" label-width="120px">
            <el-input v-model="form.name" size="small"></el-input>
            <div class="error" v-if="validated && !form.name">请输入客服姓名</div>
          </el-form-item>
          <el-form-item label="客服电话" label-width="120px">
            <el-input v-model="form.phone" size="small"></el-input>
            <div class="error" v-if="validated && !form.name">请输入客服电话</div>
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
  import Pagination from '@/components/Pagination';
  import commonTable from '@/views/common/commonTable';
  import * as other from '@/api/other';
    export default {
        name: 'customerService',
      data() {
          return {
            columns: [
              {
                type: 'index',
                label: '序号'
              },
              {
                prop: 'name',
                label: '客服姓名'
              },
              {
                prop: 'phone',
                label: '客服电话'
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
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {},
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
        query(){
          this.loading = true;
          other.getCustomList(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            });
        },
        add(){
          this.dialogFormVisible = true;
          this.title = '新增';
          this.form = {};
        },
        edit(index,row) {
          this.dialogFormVisible = true;
          this.title = '编辑';
          this.form = row;
        },
        deleteRow(index,row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            other.deleteCustom(row.id)
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
        save () {
          if (!this.form.name && !this.form.phone) {
            this.validated = true;
            return;
          }
          if (this.form.id) {
            other.updateCustom(this.form)
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
              });
          }else {
            other.addCustom(this.form)
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
              });
          }
          this.dialogFormVisible = false
        }
      }
    }
</script>

<style scoped>

</style>
