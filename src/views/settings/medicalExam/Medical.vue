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
          <el-input v-model="form.normNumber" size="small"></el-input>
        </el-form-item>
        <el-form-item label="指标名称" label-width="120px">
          <el-input v-model="form.normName" size="small"></el-input>
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
          <el-select class="select" v-model="form.inputType" size="small">
            <el-option :value="1" label="1 (普通输入类型)"></el-option>
            <el-option :value="2" label="2 (双参数输入类型)"></el-option>
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
  import commonTable from '../../common/commonTable';
  import Pagination from '@/components/Pagination';
  import * as health from '@/api/health'
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
            prop: 'normNumber',
            label: '编码'
          },
          {
            prop: 'normName',
            label: '指标名称'
          },
          {
            prop: 'unit',
            label: '单位'
          },
          {
            prop: 'max',
            label: '最大值'
          },
          {
            prop: 'min',
            label: '最小值'
          },
          {
            prop: 'step',
            label: '步进'
          },
          {
            prop: 'inputType',
            label: '输入类型'
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
        INPUTTYPE: {
          1: '普通输入类型',
          2: '双参数输入类型'
        },
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
        this.loading = true;
        health.getHelthNormalType(this.params)
          .then(res => {
            this.tableData = res && res.data && res.data.content;
            this.totalCount = res && res.data && res.data.totalElements;
            this.loading = false;
          }).catch(err => {
          this.loading = false;
        })
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
        this.form = Object.assign({}, row);
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
         health.deleteHealthNormalType(row.normTypeId)
           .then(res => {
             this.resetParams(res);
           })
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
        let params = {
          normNumber: this.form.normNumber,
          normName: this.form.normName,
          unit: this.form.unit,
          max: this.form.max,
          min: this.form.min,
          step: this.form.step,
          inputType: this.form.inputType
        };
        if (this.form.normTypeId) {
          params.normTypeId = this.form.normTypeId;
        }
        health.updateHelthNormalType(params)
          .then(res => {
            this.resetParams(res);
          });
        this.dialogFormVisible = false;
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
  };
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
  .add-dialog{
    .dialog-footer{
      text-align: center;
    }
  }
</style>
