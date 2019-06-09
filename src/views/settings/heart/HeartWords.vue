<template>
  <div>
    <el-row>
      <el-button size="small" type="primary" @click="add()">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增/编辑-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog1" top="5%" bottom="5%" width="40%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="编码" label-width="120px">
          <el-input size="small" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <el-input size="small" v-model="form.description" type="textarea"></el-input>
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
  import * as heart from '@/api/heart';
    export default {
        name: 'HeartWords',
      data () {
          return {
            columns: [
              {
                type: 'index',
                label: '序号'
              },
              {
                prop: 'code',
                label: '编码'
              },
              {
                prop: 'description',
                label: '描述'
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
            loading : false,
            tableData: [],
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            dialogFormVisible: false,
            title: '新增',
            form: {
              description: ''
            }
          }
      },
      components: {
        commonTable,
        Pagination
      },
      mounted () {
          this.query();
      },
      methods: {
          query () {
            this.loading = true;
            heart.getEncourageList(this.params)
              .then(res => {
                this.tableData = res.data;
                this.loading = false;
              }).catch(res => {
                this.loading = false;
            });
          },
          add () {
            this.dialogFormVisible = true;
            this.title = '新增';
            this.form = {};
          },
        edit (index, row) {
          this.dialogFormVisible = true;
          this.title = '编辑';
          this.form = Object.assign({}, row);
        },
        deleteRow(index, row) {
          this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            heart.deleteEncourage(row.id)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: res && res.message
                });
                this.params.pageNumber = 1;
                this.query();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        save () {
            let params = Object.assign({}, this.form);
            if (params.id) {
              heart.updateEncourage(params)
                .then(res => {
                  if (res && res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res && res.message,
                      duration: 6000
                    });
                  }
                  this.params.pageNumber = 1;
                  this.query();
                })
            } else {
              heart.addEncourage(params)
                .then(res => {
                  if (res && res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: res && res.message,
                      duration: 6000
                    });
                  }
                  this.params.pageNumber = 1;
                  this.query();
                })
            }
            this.dialogFormVisible = false;

        }
      }
    }
</script>

<style scoped>

</style>
