<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="params">
        <el-form-item label="选择行善类型">
          <el-select v-model="params.cfTypeId" placeholder="请选择行善类型" size="small">
            <el-option v-for="(item, index) in allTypes" :value="item.cfTypeId" :key="item.cfTypeId" :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-button type="primary" size="small" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增-->

    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="40%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="行善类型" label-width="120px">
          <el-select v-model="form.cfTypeId" placeholder="请选择行善类型" size="small" class="select">
            <el-option v-for="(item, index) in allTypes" :value="item.cfTypeId" :key="item.cfTypeId" :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行善内容" label-width="120px">
          <el-input size="small" type="textarea" v-model="form.content"></el-input>
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
    name: 'HeartContent',
    data () {
      return {
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'typeName',
            label: '行善类型'
          },
          {
            prop: 'content',
            label: '行善内容'
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
          pageSize: 20,
          cfTypeId: ''
        },
        totalCount: 0,
        tableData: [],
        loading: false,
        allTypes: []      // 行善类型
      };
    },
    components: {
      commonTable,
      Pagination
    },
    mounted() {
      this.queryCharityType();
      this.query();
    },
    methods: {
      query () {
        this.loading = true;
        heart.getCharityFaultContentList(this.params)
          .then(res => {
            this.tableData = res && res.data && res.data.content;
            this.totalCount = res && res.data && res.data.totalElements;
            this.loading = false;
          }).catch(res => {
          this.loading = false;
        });
      },
      /**
       * 查询行善类型
       * */
      queryCharityType () {
        heart.getCharityFaultTypeList()
          .then(res => {
              this.allTypes = res && res.data && res.data.content;
          })
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
            heart.deleteCharityFaultContent(row.id)
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
          cfTypeId: this.form.cfTypeId,
          content: this.form.content
        };
        this.params.cfTypeId = this.form.cfTypeId;
        if (!this.form.id) {
          heart.addCharityFaultContent(params)
            .then(res => {
              this.resetParams(res);
            })
        } else {
          params.id = this.form.id;
          heart.updateCharityFaultContent(params)
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
