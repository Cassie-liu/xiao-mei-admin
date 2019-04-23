<template>
    <div>
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

      <!--新增-->

      <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="40%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="编码" label-width="120px">
            <el-input v-model="form.number" size="small"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="行善类型" label-width="120px">
            <el-input v-model="form.type" size="small"></el-input>
          </el-form-item>
          <el-form-item label="积分计算" label-width="120px">
            <el-input v-model="form.score" size="small"></el-input>
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
  import Pagination from '@/components/Pagination'
    export default {
        name: 'HeartType',
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
              prop: 'name',
              label: '名称'
            },
            {
              prop: 'type',
              label: '行善类型'
            },
            {
              prop: 'score',
              label: '积分'
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
          dialogFormVisible: false,
          title: '新增',
          type: 'add',
          form: {},
          params: {
            pageNumber: 1,
            pageSize: 20
          },
          totalCount: 0,
          tableData: [],
          loading: false
        };
      },
      components: {
        commonTable,
        Pagination
      },
      mounted() {
        this.query();
      },
      methods: {
          query () {

          },
        /**
         * 新增
         * */
        add () {
          this.dialogFormVisible = true;
          this.title = '新增';
          this.type = 'add';
          this.form = {};
        },
        /**
         * 编辑
         * */
        edit (index, row) {
          this.dialogFormVisible = true;
          this.title = '编辑';
          this.type = 'edit';
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
              message: '已删除'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        save() {}
      }
    }
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
  .add-dialog{
    .dialog-footer{
      text-align: center;
    }
  }
</style>
