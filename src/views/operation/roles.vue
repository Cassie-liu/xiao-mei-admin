<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="角色管理">
        <div class="customer-service">
          <el-row>
            <el-button type="primary" size="small" @click="add">新增</el-button>
          </el-row>
          <common-table :columns="columns" :loading="loading" :table-data="tableData"/>

          <!--新增/编辑 弹框-->
          <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="40%">
            <el-form :model="form" :label-position="'left'">
              <el-form-item label="角色标签名" label-width="120px">
                <el-input v-model="form.coding" size="small"/>
              </el-form-item>
              <el-form-item label="角色名称" label-width="120px">
                <el-input v-model="form.roleName" size="small"/>
              </el-form-item>
              <el-form-item label="权限信息" label-width="120px">
                <el-tree
                  ref="tree"
                  :data="tree"
                  :default-checked-keys="idList"
                  :current-node-key="idList"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  highlight-current/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" size="small" @click="save">确 定</el-button>
            </div>
          </el-dialog>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { constantRouterMap } from '@/router'
import Pagination from '@/components/Pagination';
import roleMap from './roleMap'
import commonTable from '@/views/common/commonTable'
export default {
  name: 'Roles',
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
          prop: 'coding',
          label: '角色标签名'
        },
        {
          prop: 'roleName',
          label: '角色名称'
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
      title: '新增', // 弹框标题
      dialogFormVisible: false,
      form: {},
      tree: [],
      defaultProps: {
        label: 'label'
      },
      idList: ['COURSE_CONFIGURATION'],
      constantRouterMap,
      roleMap
    }
  },
  created() {
    this.query()
  },
  mounted() {
    this.tree = roleMap
  },
  methods: {
    query() {
      this.tableData = [
        {
          coding: '15845745825',
          roleName: '系统管理员',
          createBy: 'sysadmin',
          createTime: '2018-12-14',
          modifyBy: 'sysadmin',
          modifyTime: '2018-12-24'
        },
        {
          coding: '18457512542',
          roleName: '平台管理员',
          createBy: 'sysadmin',
          createTime: '2018-12-14',
          modifyBy: 'sysadmin',
          modifyTime: '2018-12-24'
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
      this.form = {}
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.title = '编辑'
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
    save() {
      this.idList = this.$refs.tree.getCheckedKeys()
      this.idList.concat(this.$refs.tree.getHalfCheckedKeys())
      console.log(this.$refs.tree.getCheckedKeys());
      // console.log(this.$refs.tree.getHalfCheckedKeys());
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
</style>
