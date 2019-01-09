<template>
    <div class="small-disease">
      <el-row>
       <el-form :inline="true" :model="params">
         <el-form-item label="选择疾病类目">
           <el-select v-model="params.category" placeholder="请选择疾病类目" size="small">
             <el-option label="类目A" value="categoryA"></el-option>
             <el-option label="类目B" value="categoryB"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" size="small" @click="query()">查询</el-button>
         </el-form-item>
       </el-form>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="add()">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                     :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                     @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
      </el-pagination>
      <!--新增/编辑弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="30%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="选择疾病类目" label-width="120px">
            <el-select v-model="form.categoryName" class="select">
              <el-option label="类目A" value="categoryA"></el-option>
              <el-option label="类目B" value="categoryB"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码" label-width="120px">
            <el-input v-model="form.coding"></el-input>
          </el-form-item>
          <el-form-item label="疾病名称" label-width="120px">
            <el-input v-model="form.diseaseName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
    export default {
        name: 'smallDisease',
        data () {
          return {
            params: {
              page: 1,
              size: 10
            },
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
                prop: 'categoryName',
                label: '疾病类目名称'
              },
              {
                prop: 'diseaseName',
                label: '疾病名称'
              },
              {
                prop: 'createBy',
                label: '创建人'
              },
              {
                prop: 'createTime',
                label: '创建时间'
              },
              {
                prop: 'modifyBy',
                label: '修改人'
              },
              {
                prop: 'modifyTime',
                label: '修改时间'
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
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {}
          }
        },
      components: {
        commonTable
      },
      created () {
          this.query();
      },
      methods: {
        /**
         *  查询
         * */
        query () {
          this.tableData = [
            {
              coding: '12524512',
              categoryName: '类目A',
              diseaseName: '口腔溃疡',
              createBy: 'sysadmin',
              createTime: '2018-12-12',
              modifyBy: 'datadmin',
              modifyTime: '2018-12-21'
            },
            {
              coding: '12524516',
              categoryName: '类目B',
              diseaseName: '口腔溃疡',
              createBy: 'sysadmin',
              createTime: '2018-12-12',
              modifyBy: 'sysadmin',
              modifyTime: '2018-12-21'
            }
          ];
          this.pageable = {
            total: 2,
            currentPage: 1,
            pageSize: 10
          };
        },
        add () {
          this.title ='新增';
          this.dialogFormVisible = true;
          this.form = {};
        },
        edit (index, row) {
          this.title ='编辑';
          this.dialogFormVisible = true;
          this.form = row;
        },
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
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .small-disease{
    .select{
      width: 100%;
    }
  }
</style>
