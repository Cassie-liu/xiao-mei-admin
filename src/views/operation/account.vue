<template>
    <div class="customer-service">
      <el-row>
        <el-button type="primary" size="small" @click="add">新增</el-button>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                     :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                     @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
      </el-pagination>

      <!--新增/编辑 弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible"
                 class="add-dialog" width="40%">
        <el-form :model="form" :label-position="'left'" status-icon :rules="rules" ref="form" label-width="100px">
          <el-form-item label="账号" label-width="120px">
            <el-input v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item label="关联角色" label-width="120px">
            <el-select v-model="form.relateRoles"  multiple class="select">
              <el-option label="系统管理员" value="case1"></el-option>
              <el-option label="平台管理员" value="case2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="120px">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" label-width="120px">
            <el-input type="password" v-model="form.confirmPassword" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">取 消</el-button>
          <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
    export default {
        name: 'account',
      data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.form.confirmPassword !== '') {
              this.$refs.form.validateField('confirmPassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
          return {
            columns: [
              {
                type: 'index',
                label: '序号'
              },
              {
                prop: 'account',
                label: '账号'
              },
              {
                prop: 'relateRoles',
                label: '关联角色'
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
            loading: false,
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            title: '新增',    // 弹框标题
            dialogFormVisible: false,
            form: {
              account: '',
              password: '',
              confirmPassword: '',
              relateRoles: []
            },
            rules: {
              password: [
                { validator: validatePass, trigger: 'blur' }
              ],
              confirmPassword: [
                { validator: validatePass2, trigger: 'blur' }
              ]
            }
          };
      },
      components: {
        commonTable
      },
      created () {
          this.query();
      },
      methods: {
        query(){
          this.tableData = [
            {
              account: 'sysadmin',
              relateRoles: '系统管理员',
              createBy: 'sysadmin',
              createTime: '2018-12-11',
              modifyBy: 'sysadmin',
              modifyTime: '2018-12-25'
            },
            {
              account: 'datadmin',
              relateRoles: '平台管理员',
              createBy: 'sysadmin',
              createTime: '2018-12-11',
              modifyBy: 'sysadmin',
              modifyTime: '2018-12-25'
            }
          ];
          this.pageable = {
            total: 2,
            currentPage: 1,
            pageSize: 10
          };
        },
        add(){
          this.dialogFormVisible = true;
          this.title = '新增';
          this.form = {};
        },
        edit(index,row) {
          this.dialogFormVisible = true;
          this.title = '编辑';
          this.form = row;
        },
        deleteRow(index,row) {
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
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
              this.dialogFormVisible = false;
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.dialogFormVisible = false;
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>
  .select{
    width: 100%;
  }
  .dialog-footer{
    text-align: center;
  }
</style>
