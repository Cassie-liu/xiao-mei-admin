<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="small" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :table-data="tableData"></common-table>
    <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
    </el-pagination>

    <!--新增/编辑-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialogs" top="5%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px">
          <el-input v-model="form.coding" size="small"></el-input>
        </el-form-item>
        <el-form-item label="鼓励文案" label-width="120px">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="form.encourageText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size= 'small' type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  export default {
    name: 'index',
    props: [],
    data () {
      return {
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
            prop: 'encourageText',
            label: '鼓励文案'
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
        title: '新增',
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
    methods:{
      /**
       * 查询
       * */
      query () {
        this.tableData = [
          {
            coding: '123',
            encourageText: '人之所以痛苦,是因为追求了错误的东西'
          },
          {
            coding: '123',
            encourageText: '人之所以痛苦,是因为追求了错误的东西'
          }
        ];
        this.pageable = {
          total: 2,
          currentPage: 1,
          pageSize: 10
        };
      },
      /**
       * 编辑
       * */
      edit (index, row){
        this.title = '编辑';
        this.dialogFormVisible = true;
        this.form = row;
      },
      /**
       * 新增
       * */
      add () {
        this.title = '新增';
        this.dialogFormVisible = true;
        this.form = {};
      },
      /**
       * 删除
       * */
      deleteRow (index, row){
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
  };
</script>

<style scoped>

</style>
