<template>
    <div class="customer-service">
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                     :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                     @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
      </el-pagination>

      <!--新增/编辑 弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="40%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="客服电话" label-width="120px">
            <el-input v-model="form.customerPhone" size="small"></el-input>
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
                prop: 'customerPhone',
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
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {}
          };
      },
      components: {
        commonTable
      },
      created () {
          this.query();
      },
      methods: {
        query(){
          this.tableData = [
            {
              customerPhone: '15845745825'
            },
            {
              customerPhone: '18457512542'
            }
          ];
          this.pageable = {
            total: 2,
            currentPage: 1,
            pageSize: 10
          };
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
        }
      }
    }
</script>

<style scoped>

</style>
