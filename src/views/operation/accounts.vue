<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="账号管理">
        <div class="customer-service">
          <el-row>
            <el-button type="primary" size="small" @click="add">
              新增
              <!--<router-link :to="{path: 'new'}" append>新增</router-link>-->
            </el-button>
          </el-row>
          <common-table :columns="columns" :loading="loading" :table-data="tableData"/>
          <el-pagination
            v-if="pageable.total"
            :total="pageable.total"
            :current-page.sync="pageable.currentPage"
            :page-size.sync="pageable.pageSize"
            style="text-align: right;margin-top: 20px;"
            layout="total, sizes, prev, pager, next"
            @current-change="query"
            @size-change="query"/>

          <!--新增/编辑 弹框-->
          <el-dialog
            v-if="dialogFormVisible"
            :title="title === 'add' ? '新增': '编辑'"
            :visible.sync="dialogFormVisible"
            class="add-dialog"
            width="40%">
            <el-form ref="form" :model="form" :label-position="'left'" status-icon label-width="100px">
              <el-form-item label="账号" label-width="120px">
                <el-input v-model="form.account" size="small"/>
              </el-form-item>
              <el-form-item v-if="mode == 'add'" label="密码" prop="password" label-width="120px">
                <el-input v-model="form.password" type="password" size="small"/>
              </el-form-item>
              <el-form-item v-if="mode == 'add'" label="确认密码" prop="confirmPassword" label-width="120px">
                <el-input v-model="form.confirmPassword" type="password" size="small"/>
              </el-form-item>
              <el-form-item label="关联角色" label-width="120px">
                <el-checkbox-group v-model="roles">
                  <el-checkbox v-for="(item, index) in checkBoxList" :label="item.id" :key="index" >{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="resetForm('form')">取 消</el-button>
              <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
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
export default {
  name: 'Accounts',
  components: {
    commonTable
  },
  data() {
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
        // {
        //   prop: 'relateRoles',
        //   label: '关联角色'
        // },
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
      title: '新增', // 弹框标题
      mode: 'add',
      dialogFormVisible: false,
      form: {
        account: '',
        password: '',
        confirmPassword: '',
        relateRoles: []
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
      ]
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.tableData = [
        {
          account: 'sysadmin',
          relateRoles: ['系统管理员'],
          createBy: 'sysadmin',
          createTime: '2018-12-11',
          modifyBy: 'sysadmin',
          modifyTime: '2018-12-25'
        },
        {
          account: 'datadmin',
          relateRoles: ['平台管理员'],
          createBy: 'sysadmin',
          createTime: '2018-12-11',
          modifyBy: 'sysadmin',
          modifyTime: '2018-12-25'
        }
      ]
      this.pageable = {
        total: 2,
        currentPage: 1,
        pageSize: 10
      }
    },
    add() {
      this.dialogFormVisible = true
      this.title = '新增'
      this.mode = 'add'
      this.form = {
        account: '',
        password: '',
        confirmPassword: '',
        relateRoles: []
      }
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.title = '编辑'
      this.mode = 'edit'
      this.form = row
    },
    deleteRow(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        console.log(this.form)
        this.dialogFormVisible = false
      })
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
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