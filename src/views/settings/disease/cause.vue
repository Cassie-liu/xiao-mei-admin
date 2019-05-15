<template>
  <div class="cause">
    <el-row>
      <el-form :inline="true" :model="params">
        <el-form-item label="选择疾病类目">
          <el-select v-model="params.diseaseId" placeholder="请选择疾病类目" size="small">
            <el-option v-if="categoryLoading" v-loading="categoryLoading" :value="''"></el-option>
            <el-option v-if="!categoryLoading" v-for="item in categoryOption" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择疾病名称">
          <el-select v-model="params.diseaseDetailId" placeholder="请选择疾病名称" size="small">
            <el-option v-if="NameLoading" v-loading="NameLoading" :value="''"></el-option>
            <el-option v-if="!NameLoading" v-for="item in NameOptions" :key="item.diseaseDetailId" :label="item.diseaseDetailName" :value="item.diseaseDetailId"></el-option>
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
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query"/>
    <!--新增/编辑弹框-->
    <!--<el-scrollbar :native="false" wrap-style="" wrap-class="" view-class="" tag="section">-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog" top="5%" width="70%">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="选择疾病类目" label-width="120px">
          <el-select v-model="form.diseaseId" class="select" size="small">
            <el-option  v-for="(item, index) in categoryOption" :key="index" :label="item.diseaseName" :value="item.diseaseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择疾病名称"  label-width="120px">
          <el-select v-model="form.diseaseDetailId" class="select" size="small">
            <el-option v-for="(item,index) in NameOptions" :key="index" :label="item.diseaseDetailName" :value="item.diseaseDetailId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因编码" label-width="120px">
          <el-input v-model="form.number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="原因标题" label-width="120px">
          <el-input v-model="form.title" size="small"></el-input>
        </el-form-item>
        <el-form-item label="病因类型" label-width="120px">
          <el-select v-model="form.causeType" size="small" class="select">
            <el-option v-for="(item, index) in causeType" :value="item.key" :key="item.key" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因描述" label-width="120px">
          <div class="solution-ue">
            <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
          </div>
        </el-form-item>
        <el-form-item label="相关解决方案" label-width="120px">
          <el-select v-model="form.solutionIds" multiple  class="select" size="small" :aria-readonly="false" @change="changeSelect">
            <el-option v-for="(item, index) in solutions" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--</el-scrollbar>-->
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
  import Tinymce from '@/components/Tinymce'
  import * as disease from '@/api/disease';
  import {getSolutionOptions} from '@/api/solution';
  export default {
    name: 'cause',
    data () {
      return {
        params: {
          pageNumber: 1,
          pageSize: 20,
          diseaseId: '',
          diseaseDetailId: ''
        },
        totalCount: 0,
        loading: false,
        columns: [
          {
            type: 'index',
            label: '序号'
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
            prop: 'number',
            label: '原因编码'
          },
          {
            prop: 'title',
            label: '原因标题'
          },
          {
            prop: 'solutions',
            label: '相关解决方案'
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
        form: {
          diseaseId: '',
          diseaseDetailId: '',
          number: '',
          title: '',
          content: '',
          solutionIds: []
        },
        categoryOption: [],      // 疾病类目下拉框
        categoryLoading: false,      // 疾病类目 loading
        NameOptions: [],           // 疾病名称下拉框
        NameLoading: false,
        solutions: [],     // 相关解决方案
        causeType: []     // 病因类型
      }
    },
    components: {
      commonTable,
      Pagination,
      Tinymce
    },
    created () {
      this.queryCategory();
    },
    mounted () {
      this.query();
      this.querySolutionOptions();
      this.getCauseType();
    },
    methods: {
      /**
       * 查询疾病类目
       * */
      queryCategory () {
        this.categoryLoading = true;
        disease.getDiseaseMajorCategory()
          .then(res => {
            this.categoryOption = res && res.data;
            this.categoryLoading = false;
          })
      },
      /**
       * 查询疾病名称
       * */
      queryDiseaseName (value) {
        this.NameLoading = true;
        disease.getDiseaseDetail({diseaseId: value, pageSize: 1000, pageNumber: 1})
          .then(res => {
            this.NameOptions = res && res.data && res.data.content;
            this.NameLoading = false;
          });
      },
      /**
       * 查询相关解决方案下拉选
       * */
      querySolutionOptions () {
        getSolutionOptions()
          .then(res => {
            this.solutions =  res.data;
          })
      },
      /**
       * 获取病因类型
       * */
      getCauseType () {
        disease.getCauseType()
          .then(res => {
            this.causeType = res.data;
          })
      },
      /**
       *  查询
       * */
      query () {
        disease.getDiseaseCause(this.params)
          .then(res => {
            this.tableData = res && res.data && res.data.content;
            this.totalCount = res && res.data && res.data.totalElements;
            this.loading = false;
            for (let data of this.tableData) {
              data.solutions = [];
              for (let i in data.solutionNames) {
                data.solutions.push(data.solutionNames[i].value);
              }
              data.solutions = data.solutions.join(',');
            }
          })
      },
      add () {
        this.title ='新增';
        this.dialogFormVisible = true;
        this.form = {
          solutionIds: []
        };
      },
      edit (index, row) {
        this.title ='编辑';
        this.dialogFormVisible = true;
        this.form = row;
        this.form.solutionIds = [];
        for (let solution of this.form.solutionNames) {
          this.form.solutionIds.push(String(solution.key));
        }
        this.form.causeType = this.form.type.key;
      },
      deleteRow (index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          disease.deleteDiseaseCause(row.id)
            .then(res => {
              this.resetParams(res);
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      changeSelect () {
        this.$forceUpdate();
      },
      save ()  {
        let params = Object.assign({}, this.form);
        delete params.causeType;
        params.type = this.form.causeType;
        if (!this.form.id) {
          disease.addDiseaseCause(params)
            .then(res => {
              this.resetParams(res);
            });
        } else {
          disease.updateDiseaseCause(params)
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
        } else if (res.code === 500) {
          this.$alert(res.data,'提示', {
            confirmButtonText: '确定'
          });
        }
      }
    },
    watch: {
      'params.diseaseId': {
        handler (curVal, oldVal) {
          this.queryDiseaseName(curVal);
        }
      },
      'form.diseaseId': {
        handler (curVal, oldVal) {
          if (curVal) {
            this.queryDiseaseName(curVal);
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .cause{
    .add-dialog{
      .el-dialog__body{
        max-height: 500px !important;
        overflow: auto !important;
      }
    }
    .select{
      width: 100%;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
