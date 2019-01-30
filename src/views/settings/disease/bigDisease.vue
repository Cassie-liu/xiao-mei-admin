<template>
    <div>
      <el-row>
        <el-button type="primary" size="small" @click="add()">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <!--<el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"-->
                     <!--:total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"-->
                     <!--@current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">-->
      <!--</el-pagination>-->
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

      <!--新增/编辑 弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="40%" ref="ruleForm  ">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="编码" label-width="120px" >
            <el-input v-model="form.number" ></el-input>
            <div class="error" v-if="validated && !form.number">请输入编码</div>
          </el-form-item>
          <el-form-item label="疾病类目名称" label-width="120px">
            <el-input v-model="form.diseaseName"></el-input>
            <div class="error" v-if="validated && !form.diseaseName">请输入疾病类目名称</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import {getMajorDisease, addMajorDisease, updateMajorDisease, deleteMajorDisease} from '@/api/disease'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    export default {
        name: 'bigDisease',
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
                prop: 'diseaseName',
                label: '疾病类目名称'
              },
              {
                prop: 'createUserName',
                label: '创建人'
              },
              {
                prop: 'createTime',
                label: '创建时间'
              },
              {
                prop: 'updateUserName',
                label: '修改人'
              },
              {
                prop: 'updateTime',
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
            ruleForm: {
              number: '',
              diseaseName: ''
            },
            rules: {
              name: [
                { required: true, message: '请输入编码', trigger: 'blur' },
              ],
              diseaseName: [
                { required: true, message: '请输入疾病类目名称', trigger: 'blur' },
              ]
            },
            loading: false,
            tableData: [],
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
            title: '新增',    // 弹框标题
            type: 'add',
            dialogFormVisible: false,
            form: {},
            validated : false   // 验证
          }
        },
      components: {
        commonTable,
        Pagination
      },
      created(){
        this.query();
      },
      methods: {
          /**
           * 查询
           * */
          query () {
            getMajorDisease (this.params)
              .then(res => {
                this.tableData = res && res.data && res.data.content;
                this.totalCount = res && res.data && res.data.totalElements;
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
            // this.tableData.splice(index, 1);
            deleteMajorDisease(row.diseaseId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
              }).catch(err=>{

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
        save(){
          if (!this.form.number || !this.form.diseaseName) {
            this.validated = true;
            return;
          }
          if (this.type === 'add') {
            addMajorDisease(this.form)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    message: res && res.message,
                    type: 'success'
                  });
                  this.query();
                }
              });
          } else if (this.type === 'edit') {
            updateMajorDisease({diseaseId: this.form.diseaseId, number: this.form.number, diseaseName: this.form.diseaseName})
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    message: res && res.message,
                    type: 'success'
                  });
                  this.query();
                }
              })
          }
          this.dialogFormVisible = false;
          this.params.pageNumber = 1;
        }
      }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.error{
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
