<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="账号管理">
        <div class="customer-service">
          <el-row>
            <el-button type="primary" size="small" @click="add">新增</el-button>
          </el-row>
          <common-table :columns="columns" :loading="loading" :table-data="tableData"/>
          <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

          <!--新增/编辑 弹框-->
          <el-dialog
            v-if="dialogFormVisible"
            :title="title"
            :visible.sync="dialogFormVisible"
            class="add-dialog"
            width="40%">
            <el-form ref="form" :model="form" :label-position="'left'" status-icon label-width="100px">
              <el-form-item label="账号" label-width="120px">
                <el-input v-model.trim="form.loginName" size="small"/>
                <div class="error" v-if="validated && !form.loginName">请输入账号名</div>
              </el-form-item>
              <el-form-item label="用户名" label-width="120px">
                <el-input size="small" v-model="form.userName"></el-input>
                <div class="error" v-if="validated && !form.userName">请输入用户名</div>
              </el-form-item>
              <el-form-item v-if="mode == 'add'" label="密码" prop="password" label-width="120px">
                <el-input v-model="form.password" type="password" size="small"/>
                <div class="error" v-if="validated && !form.password">请输入密码</div>
                <div class="error" v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword">两次输入得密码不一致</div>
                <div class="error" v-if="form.password && form.password.length<6">密码长度不能小于6位！</div>
              </el-form-item>
              <el-form-item v-if="mode == 'add'" label="确认密码" prop="confirmPassword" label-width="120px">
                <el-input v-model="form.confirmPassword" type="password" size="small"/>
                <div class="error" v-if="validated && !form.confirmPassword">请再次输入密码</div>
                <div class="error" v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword">两次输入得密码不一致</div>
              </el-form-item>
              <el-form-item label="关联角色" label-width="120px">
                <el-checkbox-group v-model="form.roleIds">
                  <el-checkbox v-for="(item, index) in roleList" :label="item.id" :key="index" >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="resetForm('form')">取 消</el-button>
              <el-button type="primary" size="small" @click="submitForm('form')">确 定</el-button>
            </div>
          </el-dialog>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import commonTable from '@/views/common/commonTable'
import Pagination from '@/components/Pagination'
import * as account from '@/api/account';
export default {
  name: 'Accounts',
  components: {
    commonTable,
    Pagination
  },
  data() {
    return {
      columns: [
        {
          type: 'index',
          label: '序号'
        },
        {
          prop: 'loginName',
          label: '账号'
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
      loading: false,
      tableData: [],
      params: {
        pageNumber: 1,
        pageSize: 20
      },
      totalCount: 0,
      title: '新增', // 弹框标题
      mode: 'add',
      dialogFormVisible: false,
      form: {
        loginName: '',
        password: '',
        confirmPassword: '',
        roleIds: []
      },
      rules: {
      },
      roles: [],
      checkBoxList: [
        {
          label: '系统管理员',
          id: 'ROLE_ANL_ADMIN'
        },
        {
          label: '普通管理员',
          id: 'ROLE_CMN_ADMIN'
        }
      ],
      roleList: [],
      validated: false
    }
  },
  created() {
    this.query()
    this.queryAllRoles();
  },
  methods: {
    query() {
      account.getAccountList(this.params)
        .then(res => {
          this.tableData = res && res.data && res.data.content;
          this.totalCount = res && res.data && res.data.totalElements;
          this.loading = false;
        }).catch(res => {
        this.loading = false;
      });
    },
    queryAllRoles () {
      account.getRelateRoles()
        .then(res => {
          console.log(res.data);
          this.roleList = res.data;
        });
    },
    add() {
      this.dialogFormVisible = true
      this.title = '新增'
      this.mode = 'add'
      this.form = {
        loginName: '',
        password: '',
        confirmPassword: '',
        roleIds: []
      }
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.title = '编辑'
      this.mode = 'edit'
      account.getAccountById(row.id)
        .then(res => {
          this.form = res.data;
        })
    },
    deleteRow(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        account.deleteAccount(row.id)
          .then(res => {
            this.resetPages(res);
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm(formName) {
      if (!this.form.id) {
        if (!this.form.loginName || !this.form.userName || !this.form.password ||
          (this.form.password && this.form.confirmPassword && this.form.password !==this.form.confirmPassword) ||
          this.form.password.length<6) {
          this.validated = true;
          return ;
        } else {
          this.validated = false;
        }
      } else {
        if (!this.form.loginName || !this.form.userName) {
          this.validated = true;
          return;
        } else {
          this.validated = false;
        }
      }
      let params = {
        loginName: this.form.loginName,
        roleIds: this.form.roleIds,
        userName: this.form.userName
      }
      if (!this.form.id) {
        params.password = this.form.password;
        account.addAccount(params)
          .then(res => {
            this.resetPages(res);
          })
      } else {
        params.id = this.form.id;
        account.modifyAccount(params)
          .then(res => {
            this.resetPages(res);
          })
      }
      this.dialogFormVisible = false;
    },
    resetPages (res) {
      if (res && res.code === 200) {
        this.$message({
          message: res && res.message,
          type: 'success'
        });
        this.params.pageNumber = 1;
        this.query();
      }
    },
    resetForm(formName) {
      this.dialogFormVisible = false
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
