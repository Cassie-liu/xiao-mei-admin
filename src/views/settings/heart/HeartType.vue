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
          <!--<el-form-item label="编码" label-width="120px">-->
            <!--<el-input v-model="form.number" size="small"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.typeName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="行善类型" label-width="120px">
            <!--<el-input v-model="form.type" size="small"></el-input>-->
            <el-select size="small" v-model="form.type" placeholder="请选择行善类型" class="select">
              <el-option :value="0" label="行善"></el-option>
              <el-option :value="1" label="过失"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="积分计算" label-width="120px">
            <el-input v-model="form.integral" size="small"></el-input>
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
  import * as heart from '@/api/heart';
    export default {
        name: 'HeartType',
      data () {
        return {
          columns: [
            {
              type: 'index',
              label: '序号'
            },
            // {
            //   prop: 'number',
            //   label: '编码'
            // },
            {
              prop: 'typeName',
              label: '名称'
            },
            {
              prop: 'CharityType',
              label: '行善类型'
            },
            {
              prop: 'integral',
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
            this.loading = true;
            heart.getCharityFaultTypeList(this.params)
              .then(res => {
                this.tableData = res && res.data && res.data.content;
                this.totalCount = res && res.data && res.data.totalElements;
                this.loading = false;
                for  (let data of this.tableData) {
                  if (data.type === 0) {
                    data.CharityType = '行善';
                  } else if (data.type === 1) {
                    data.CharityType = '过失';
                  }
                }
              }).catch(res => {
              this.loading = false;
            });
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
            heart.deleteCharityFaultType(row.cfTypeId)
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
        save() {
          let params = {
            typeName: this.form.typeName,
            type: this.form.type,
            integral: this.form.integral
          };
          if (!this.form.cfTypeId) {
            heart.addCharityFaultType(params)
              .then(res => {
                this.resetParams(res);
              })
          } else {
            params.cfTypeId = this.form.cfTypeId;
            heart.updateCharityFaultType(params)
              .then(res => {
                this.resetParams(res);
              })
          }
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
    }
</script>

<style scoped  rel="stylesheet/scss" lang="scss">
  .add-dialog{
    .dialog-footer{
      text-align: center;
    }
  }
</style>
