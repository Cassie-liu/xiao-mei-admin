<template>
  <div class="app-container">
    <el-row>
      <el-button size="small" type="primary" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                   :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                   @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
    </el-pagination>

    <!--新增-->

    <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog1" top="5%" >
    <!--<el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialog" :fullscreen="true">-->
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="120px">
          <!--<el-input v-model="form.startTime"></el-input>-->
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名人数" label-width="120px">
          <el-input v-model="form.applicants"></el-input>
        </el-form-item>
        <el-form-item label="活动地址" label-width="120px">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="封面图" label-width="120px">
          <el-upload
            multiple
            action=""
            list-type="picture-card"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
            <!--<div slot="tip" class="el-upload__tip">最多上传5张图片</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="展示图" label-width="120px">
          <el-upload
            multiple
            action=""
            list-type="picture-card"
            :limit="5"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，<span style="color: red">最多上传5张图片</span></div>
            <!--<div slot="tip" class="el-upload__tip">最多上传5张图片</div>-->
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="详情描述">
          <div class="solution-ue">
            <!--<UE ref="ue" :default-msg="defaultMsg" :config="config" :id="ue"/>-->
            <tinymce :height="300" ref="editor" v-model="form.content" :show-modal="false" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '../common/commonTable';
  import Tinymce from '@/components/Tinymce'
  export default {
    name: 'Index',
    data () {
      return {
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'startTime',
            label: '开始时间'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            link:true,
            prop: 'currentApplicants',
            label: '当前报名人数',
            func: this.showDetails
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
        ],                  // 表格表头
        loading: false,                 // 显示加载
        tableData: [],                  // 表格数据
        pageable: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },                // 分页
        dialogFormVisible: false,      // 是否显示弹框
        form: {

        },                    // 表单数据
        dialogVisible: false,           // 上传图片弹框显示
        dialogImageUrl: '',
        fileList: [],
        title: '新增'                 // 弹框
      };
    },
    components: {
      commonTable,
      Tinymce
    },
    created () {
      this.query();
    },
    methods: {
      query(){
        this.tableData = [
          {
            title: '123',
            startTime: '2018-12-13',
            price: '50.00',
            currentApplicants: '123',
            content: '<h1>111111111111111111111</h1>'
          }
        ];
        this.pageable = {
          total: 1,
          currentPage: 1,
          pageSize: 10
        };
      },
      /**
       * 编辑
       * */
      edit (index, row) {
        this.title =  '编辑';
        this.dialogFormVisible = true;
        this.form = row;
        if (this.$refs && this.$refs.editor) {
          this.$refs.editor.setContent(this.form.content);
        }
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
      /*新增*/
      add () {
        this.title =  '新增';
        this.dialogFormVisible = true;
        this.form = {
          content: ''
        };
        if (this.$refs && this.$refs.editor) {
          this.$refs.editor.setContent('');
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      showDetails (index, row) {
        console.log(index);
        console.log(row);
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss">
  .add-dialog1{
    .solution-ue{
      margin-left:120px;
    }
    .el-dialog__body{
      max-height: 500px !important;
      overflow: auto !important;
    }
    .item-wrap{
      display: inline-block;
      margin-right:10%;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
