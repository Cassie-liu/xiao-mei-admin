<template>
  <div class="small-health">
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" top="5%">
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
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!--</el-scrollbar>-->
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import UE from '@/components/ue/ue';
  import Tinymce from '@/components/Tinymce'
  export default {
    name: 'cause',
    data () {
      return {
        loading: false,
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'coding',
            label: '编码'
          },
          {
            prop: 'belongHealthCategory',
            label: '所属养生类目'
          },
          {
            prop: 'healthName',
            label: '养生方式名称'
          },
          {
            prop: 'introduceTitle',
            label: '介绍标题'
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
        type: 'add',
        dialogFormVisible: false,
        form: {
          categoryName: '',
          diseaseName: '',
          causeCode: '',
          causeTitle: '',
          defaultMsg: '',
          relateSolveCase: []
        },
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 200
        },                  // 文本编辑器配置
        ue: 'ue'
      }
    },
    components: {
      commonTable,
      UE,
      Tinymce
    },
    created () {
      this.query();
    },
    methods: {
      /**
       *  查询
       * */
      query () {
        this.tableData = [
          {
            coding: '1252452152',
            belongHealthCategory: '类目A',
            healthName: '口腔溃疡',
            introduceTitle: '15214814',
            relateSolveCase: ['解决方案一', '解决方案二'],
            content: '<u>111111111111111111111111111111111111</u>'
          },
          {
            coding: '1252452152',
            belongHealthCategory: '类目B',
            healthName: '口腔溃疡',
            introduceTitle: '15214814',
            relateSolveCase: ['解决方案二', '解决方案三'],
            content: '<u>2222222222222222222222222</u>'
          },
        ];
        this.pageable = {
          total: 2,
          currentPage: 1,
          pageSize: 10
        };
      },
      add () {
        this.title ='新增';
        this.type = 'add';
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
        this.type = 'edit';
        this.dialogFormVisible = true;
        this.form = row;
        // this.form.relateSolveCase = [];
        if (this.$refs && this.$refs.editor) {
          this.$refs.editor.setContent(this.form.content);
        }
      },
      save () {
        this.dialogFormVisible = false;
        console.log(this.form);
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
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .small-health{
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
