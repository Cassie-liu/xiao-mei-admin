<template>
  <div class="app-container">
    <el-row>
      <el-button size="small" type="primary" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :v-loading="loading" :table-data="tableData"></common-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增/编辑-->

    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="40%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="数据模型名称" label-width="120px">
          <el-input v-model="form.modelName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="参数个数" label-width="120px">
          <el-radio v-model="form.paramsNum" label="1">1</el-radio>
          <el-radio v-model="form.paramsNum" label="2">2</el-radio>
        </el-form-item>
        <el-form-item label="单位" label-width="120px">
          <el-input v-model="form.unit" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上限值" label-width="120px">
          <el-input-number v-model="form.upperLimit" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="下限值" label-width="120px">
          <el-input-number v-model="form.lowerLimit" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="步进" label-width="120px">
          <el-input-number v-model="form.step" size="small"></el-input-number>
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
  import commonTable from '../../common/commonTable';
  import Pagination from '@/components/Pagination';
  export default {
    name: 'Modal',
    data () {
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
            prop: 'modelName',
            label: '数据模型名称'
          },
          {
            prop: 'paramsNum',
            label: '参数个数'
          },
          {
            prop: 'unit',
            label: '单位'
          },
          {
            prop: 'upperLimit',
            label: '上限值'
          },
          {
            prop: 'lowerLimit',
            label: '下限值'
          },
          {
            prop: 'step',
            label: '步进'
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
        dialogFormVisible: false,
        title: '新增',
        form: {
          paramsNum: ''
        }
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
      query() {
          this.tableData = [
            {
              modelName: '模型一',
              paramsNum: '1',
              unit: '11111',
              upperLimit: '10',
              lowerLimit: '1',
              step: '1'
            }
          ]
      },
      /**
       * 新增
       * */
      add() {
        this.title =  '新增';
        this.dialogFormVisible = true;
        this.form = {};
      },
      /**
       * 编辑
       * */
      edit (index, row) {
        this.title =  '编辑';
        this.dialogFormVisible = true;
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
      /**
       * 保存
       * */
      save() {
        console.log(this.form);
        this.dialogFormVisible = false;
      }
    }
  };
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
  .add-dialog{
    .dialog-footer{
      text-align: center;
    }
  }
</style>
