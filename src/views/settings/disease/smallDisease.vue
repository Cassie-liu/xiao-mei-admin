<template>
    <div class="small-disease">
      <el-row>
       <el-form :inline="true" :model="params">
         <el-form-item label="选择疾病类目">
           <el-select v-model="params.diseaseId" placeholder="请选择疾病类目" size="small">
             <el-option v-if="categoryLoading" v-loading="categoryLoading" :value="''"></el-option>
             <el-option v-if="!categoryLoading" v-for="item in options" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
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
      <!--<el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"-->
                     <!--:total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"-->
                     <!--@current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">-->
      <!--</el-pagination>-->
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--新增/编辑弹框-->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" width="30%">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="选择疾病类目" label-width="120px">
            <el-select v-model="form.diseaseId" placeholder="请选择疾病类目" size="small" class="select">
              <el-option v-for="item in options" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
            </el-select>
            <div class="error" v-if="validated && !form.diseaseId">请选择疾病类目</div>
          </el-form-item>
          <el-form-item label="编码" label-width="120px" size="small">
            <el-input v-model="form.number"></el-input>
            <div class="error" v-if="validated && !form.number">请输入编码</div>
          </el-form-item>
          <el-form-item label="疾病名称" label-width="120px" size="small">
            <el-input v-model="form.diseaseDetailName"></el-input>
            <div class="error" v-if="validated && !form.diseaseDetailName">请输入疾病名称</div>
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
  import {getDiseaseDetail,getDiseaseMajorCategory,addDiseaseDetail,updateDiseaseDetail, deleteDiseaseDetail} from '@/api/disease';
  import Pagination from '@/components/Pagination'
    export default {
        name: 'smallDisease',
        data () {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20,
              diseaseId: ''
            },
            totalCount: 0,
            options: [],
            loading: false,     // table loading
            categoryLoading: true,     // category loading
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
                prop: 'diseaseDetailName',
                label: '疾病名称'
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
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            title: '新增',    // 弹框标题
            type: 'add',
            dialogFormVisible: false,
            form: {},
            validated: false
          }
        },
      components: {
        commonTable,
        Pagination
      },
      created () {
          // this.query();
        this.queryCategory();
      },
      methods: {
        /**
         *  查询
         * */
        query () {
          if (!this.params.diseaseId) {
            this.$alert('请选择疾病类目','提示', {
              confirmButtonText: '确定'
            });
            return;
          }
          this.loading = true;
          getDiseaseDetail(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            })
        },
        /**
         * 查询疾病类目
         * */
        queryCategory () {
          getDiseaseMajorCategory()
            .then(res => {
              this.options = res && res.data;
              this.categoryLoading = false;
            })
        },
        add () {
          this.title ='新增';
          this.type = 'add';
          this.dialogFormVisible = true;
          this.form = {};
        },
        edit (index, row) {
          this.title ='编辑';
          this.type = 'edit';
          this.dialogFormVisible = true;
          this.form = row;
        },
        /**
         * 保存
         * */
        save () {
          if (!this.form.diseaseId || !this.form.diseaseDetailName || !this.form.number) {
            this.validated = true;
            return;
          }
          this.params.diseaseId = this.form.diseaseId;
          this.loading = true;
          if (this.type === 'add') {
            addDiseaseDetail(this.form)
              .then(res =>{
                if (res && res.code === 200) {
                  this.$message({
                    message: res && res.message,
                    type: 'success'
                  });
                }
                this.loading = false;
                this.query();
              });
          } else if (this.type === 'edit') {
            updateDiseaseDetail(this.form)
              .then(res =>{
                if (res && res.code === 200) {
                  this.$message({
                    message: res && res.message,
                    type: 'success'
                  });
                }
              });
            this.query();
          }
          this.dialogFormVisible = false;
        },
        deleteRow (index, row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.tableData.splice(index, 1);
            deleteDiseaseDetail(row.diseaseDetailId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  });
                }
              }).catch(err => {

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
