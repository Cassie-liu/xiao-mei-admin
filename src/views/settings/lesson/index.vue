<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="课程类型">
        <el-row>
          <el-button size="small" type="primary" @click="add">新增</el-button>
        </el-row>
        <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
        <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      </el-tab-pane>
    </el-tabs>
    <!--新增/编辑-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"  top="5%" bottom="5%" width="40%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label-width="120px" label="类型名称">
          <el-input v-model="form.courseTypeName" size="small"></el-input>
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
  import * as lesson from '@/api/lesson';
    export default {
        name: 'index',
      data () {
          return {
            columns: [
              {
                type: 'index',
                label: '序号'
              },
              {
                prop: 'courseTypeName',
                label: '类型名称'
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
            loading: false,
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
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
        query () {
          this.loading = true;
          lesson.getCourseTypeList(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
          });
        },
          add () {
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
            lesson.deleteCourseType(row.id)
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
        // 保存
        save () {
          let params = {
            courseTypeName: this.form.courseTypeName
          };
          if (this.form.id) {
            params.id = this.form.id;
            lesson.updateCourseType(params)
              .then(res => {
                this.resetParams(res);
              })
          } else {
            lesson.addCourseType(this.form)
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

<style scoped>

</style>
