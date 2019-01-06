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
      <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                     :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                     @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
      </el-pagination>
      <!--新增/编辑弹框-->
      <!--<el-scrollbar :native="false" wrap-style="" wrap-class="" view-class="" tag="section">-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog">
          <el-form :model="form" :label-position="'left'">
            <el-form-item label="选择疾病类目" label-width="120px">
              <el-select v-model="form.categoryName" class="select" size="small">
                <el-option label="类目A" value="categoryA"></el-option>
                <el-option label="类目B" value="categoryB"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择疾病名称"  label-width="120px">
              <el-select v-model="form.diseaseName" class="select" size="small">
                <el-option label="口腔溃疡" value="A"></el-option>
                <el-option label="感冒" value="B"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原因编码" label-width="120px">
              <el-input v-model="form.causeCode" size="small"></el-input>
            </el-form-item>
            <el-form-item label="原因标题" label-width="120px">
              <el-input v-model="form.causeTitle" size="small"></el-input>
            </el-form-item>
            <el-form-item label="原因描述" label-width="120px">
              <div class="solution-ue">
                <!--<UE ref="ue" :default-msg="defaultMsg" :config="config" :id="ue"/>-->
                <tinymce :height="300" ref="editor" v-model="form.content"  :show-modal="false"/>
              </div>
            </el-form-item>
            <el-form-item label="相关解决方案" label-width="120px">
              <el-select v-model="form.relateSolveCase"  multiple class="select">
                <el-option label="解决方案一" value="case1"></el-option>
                <el-option label="解决方案二" value="case2"></el-option>
                <el-option label="解决方案三" value="case3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      <!--</el-scrollbar>-->
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Tinymce from '@/components/Tinymce'
  import {getDiseaseMajorCategory, getDiseaseDetail} from '@/api/disease';
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
            loading: false,
            columns: [
              {
                type: 'index',
                label: '序号'
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
                prop: 'causeCode',
                label: '原因编码'
              },
              {
                prop: 'causeTitle',
                label: '原因标题'
              },
              {
                prop: 'relateSolveCase',
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
              categoryName: '',
              diseaseName: '',
              causeCode: '',
              causeTitle: '',
              defaultMsg: '',
              content: '',
              relateSolveCase: []
            },
            categoryOption: [],      // 疾病类目下拉框
            categoryLoading: false,      // 疾病类目 loading
            NameOptions: [],           // 疾病名称下拉框
            NameLoading: false
          }
        },
      components: {
        commonTable,
        Tinymce
      },
      created () {
        // this.query();
        this.queryCategory();
      },
      methods: {
        /**
         * 查询疾病类目
         * */
        queryCategory () {
          this.categoryLoading = true;
          getDiseaseMajorCategory()
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
          getDiseaseDetail({diseaseId: value, pageSize: 1000, pageNumber: 1})
            .then(res => {
                this.NameOptions = res && res.data && res.data.content;
                this.NameLoading = false;
            });
        },
        /**
         *  查询
         * */
        query () {
          this.tableData = [
            {
              categoryName: '类目A',
              diseaseName: '口腔溃疡',
              causeCode: '12524512',
              causeTitle: '口腔溃疡.....',
              relateSolveCase: ['解决方案一', '解决方案二'],
              content: '<s>111111111111111111111</s>'
            },
            {
              categoryName: '类目A',
              diseaseName: '口腔溃疡',
              causeCode: '12524512',
              causeTitle: '口腔溃疡.....',
              relateSolveCase: ['解决方案二', '解决方案三'],
              content: '<i>222222222222222222222222222222</i>'
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
          this.form = {
            relateSolveCase: [],
            content: ''
          };
          if (this.$refs && this.$refs.editor) {
            this.$refs.editor.setContent('');
          }
        },
        edit (index, row) {
          this.title ='编辑';
          this.dialogFormVisible = true;
          this.form = row;
          // this.form.relateSolveCase = [];
          if (this.$refs && this.$refs.editor) {
            this.$refs.editor.setContent(this.form.content);
          }
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
      },
      watch: {
          'params.diseaseId': {
            handler (curVal, oldVal) {
              console.log(curVal);
              this.queryDiseaseName(curVal);
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
