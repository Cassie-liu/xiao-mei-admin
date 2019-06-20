<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="角色管理">
        <div class="customer-service">
          <el-row>
            <el-button type="primary" size="small" @click="add">新增</el-button>
          </el-row>
          <common-table :columns="columns" :loading="loading" :table-data="tableData"/>
          <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

          <!--新增/编辑 弹框-->
          <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" width="40%">
            <el-form :model="form" :label-position="'left'">
              <el-form-item label="角色标签名" label-width="120px">
                <el-input v-model="form.role" size="small"/>
                <div class="error" v-if="validated && !form.role">请填写角色标签名</div>
              </el-form-item>
              <el-form-item label="角色名称" label-width="120px">
                <el-input v-model="form.name" size="small"/>
                <div class="error" v-if="validated && !form.name">请填写角色名称</div>
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
import Pagination from '@/components/Pagination'
import roleMap from './roleMap'
import commonTable from '@/views/common/commonTable'
import * as role from '@/api/role';
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
          prop: 'role',
          label: '角色标签名'
        },
        {
          prop: 'name',
          label: '角色名称'
        },
        // {
        //   prop: 'createBy',
        //   label: '创建人'
        // },
        // {
        //   prop: 'createTime',
        //   label: '创建时间'
        // },
        // {
        //   prop: 'modifyBy',
        //   label: '修改人'
        // },
        // {
        //   prop: 'modifyTime',
        //   label: '修改时间'
        // },
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
      dialogFormVisible: false,
      form: {},
      tree: [],
      defaultProps: {
        label: 'lable'
      },
      idList: [],
      constantRouterMap,
      roleMap,
      validated: false
    }
  },
  created() {
    this.query()
  },
  mounted() {
    this.queryRoleList();
  },
  methods: {
    query() {
      role.getRolesList(this.params)
        .then(res => {
          this.tableData = res && res.data && res.data.content;
          this.totalCount = res && res.data && res.data.totalElements;
          this.loading = false;
        }).catch(res => {
        this.loading = false;
      });
    },
    queryRoleList () {
      role.getRoleResource()
        .then(res => {
          this.tree = res.data;
        })
    },
    add() {
      this.dialogFormVisible = true
      this.title = '新增'
      this.form = {};
      this.idList = [];
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.title = '编辑'
      this.form = row;
      this.idList = row.resource;
    },
    deleteRow(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        role.deleteRole(row.id)
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
    save() {
      if (!this.form.role || !this.form.name) {
        this.validated = true;
        return;
      } else {
        this.validated = false;
      }
      let params ={
        role: this.form.role,
        name: this.form.name,
        resource: []
      };
      this.idList = this.$refs.tree.getCheckedKeys()
      params.resource =  this.idList;
      if (!this.form.id) {
        role.addRole(params)
          .then(res => {
            this.resetPages(res);
          });
      } else {
        role.updateRole(params)
          .then(res => {
            this.resetPages(res);
          });
      }
      this.dialogFormVisible = false
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
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
</style>
