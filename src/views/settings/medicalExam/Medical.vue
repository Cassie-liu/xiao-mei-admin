<template>
  <div class="app-container">
    <el-row>
      <el-button size="small" type="primary" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :v-loading="loading" :table-data="tableData"></common-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增/编辑-->

    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px">
          <el-input v-model="form.number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="指标名称" label-width="120px">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="单位" label-width="120px">
          <el-input v-model="form.unit" size="small"></el-input>
        </el-form-item>
        <el-form-item label="最大值" label-width="120px">
          <el-input v-model="form.max" size="small"></el-input>
        </el-form-item>
        <el-form-item label="最小值" label-width="120px">
          <el-input v-model="form.min" size="small"></el-input>
        </el-form-item>
        <el-form-item label="步进" label-width="120px">
          <el-input v-model="form.step" size="small"></el-input>
        </el-form-item>
        <el-form-item label="输入类型" label-width="120px">
          <el-select class="select" v-model="form.input_type" size="small">
            <el-option value="1" label="普通输入类型"></el-option>
            <el-option value="2" label="血压两个输入框"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" v-model="form.memo"></el-input>
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
    name: 'Medical',
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
            prop: 'number',
            label: '编码'
          },
          {
            prop: 'name',
            label: '指标名称'
          },
          {
            prop: 'model',
            label: '数据模型'
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
        form: {}
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
            number: '001',
            name: '指标一',
            model: '模型一'
          }
        ];
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
      save() {}
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
