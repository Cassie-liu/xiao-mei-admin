<template>
<div class="app-container">
  <el-row>
    <el-button size="small" type="primary" @click="add">新增</el-button>
  </el-row>
  <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
  <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

  <!--新增-->

  <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialogs" top="5%" width="80%">
    <el-form :model="form" :label-position="'left'">
      <el-form-item label="编码" label-width="120px">
        <el-input v-model="form.number" size="small"></el-input>
      </el-form-item>
      <el-form-item label="解决方案名称" label-width="120px">
        <el-input v-model="form.title" size="small"></el-input>
      </el-form-item>
      <el-form-item label="解决方案">
        <div class="solution-ue">
          <!--<UE ref="ue" :default-msg="defaultMsg" :config="config" :id="ue1"/>-->
          <tinymce :height="300" ref="editor" v-model="form.content"/>
        </div>
      </el-form-item>
      <el-form-item label="配图" label-width="120px">
        <el-upload
          multiple
          action=""
          list-type="picture-card"
          :http-request="uploadUrls"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :file-list="form.images">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="相关课程"  label-width="120px">
        <el-select v-model="form.refCourses" multiple placeholder="请选择相关课程" size="small" class="select">
          <el-option v-for="(item, index) in courseItems" :label="item.value" :value="item.key" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关机构" label-width="120px" >
        <el-select v-model="form.refOffices" placeholder="请选择相关机构" size="small" class="select">
          <el-option label="机构1" value="jigou1"></el-option>
          <el-option label="机构2" value="jigou2"></el-option>
        </el-select>
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
  import commonTable from '../common/commonTable';
  import Tinymce from '@/components/Tinymce';
  import Pagination from '@/components/Pagination';
  import {getSolutionInfo, addSolution,getSolutionList,getRelateOffice} from '@/api/solution';
  import {uploadSingleImage} from '@/api/uploadImage';
  import {checkImages} from "@/utils/index";
    export default {
        name: 'Index',
        data () {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20
            },
            totalCount: 0,
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
                prop: 'title',
                label: '解决方案标题'
              },
              {
                prop: 'rehabilitationAmount',
                label: '康复人数'
              },
              {
                prop: 'refOffices',
                label: '相关机构'
              },
              {
                prop: 'refCourses',
                label: '相关课程'
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
              number: '',
              title: '',
              content: '',
              images: [],
              refCourses: [],
              refOffices: []
            },                    // 表单数据
            dialogVisible: false,           // 上传图片弹框显示
            dialogImageUrl: '',
            fileList: [],
            title: '新增',                 // 弹框
            type: 'add',
            courseItems: []
          };
        },
      components: {
        commonTable,
        Tinymce,
        Pagination
      },
      created () {
          this.query();
          this.queryCourseItems();
          this.queryOfficeItems();
      },
      methods: {
        query(){
          this.loading= true;
          getSolutionList(this.params)
            .then(res => {
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
              this.loading = false;
            })
        },
        queryCourseItems () {
          getSolutionInfo()
            .then(res => {
              this.courseItems = res.data;
            });
        },
        queryOfficeItems () {
          getRelateOffice()
            .then(res => {

            });
        },
        /**
         * 编辑
         * */
        edit (index, row) {
          this.title =  '编辑';
          this.dialogFormVisible = true;
          this.form = row;
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
            content: '',
            images: [],
            courseIds: []
          };
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        beforeUpload (file) {
          checkImages(file, this);
        },
        showDetails(index, row){
          console.log(index);
          console.log(row);
        },
        /**
         * 上传配图
         * */
        uploadUrls(file) {
          if (file && file.file) {
            this.uploadImages(file.file);
          }
        },
        uploadImages(file) {
          let formData = new FormData();
          formData.append('image', file);
          formData.append('model', '2');
          uploadSingleImage(formData)
            .then(res => {
              this.form.images.push(res.data);
            });
        },
        save () {
          console.log(this.form);
          let params = {
            number: this.form.number,
            title: this.form.title,
            content: this.form.content,
            images: [],
            courseIds: this.form.courseIds
          };
          if (this.form.images && this.form.images.length>0){
            for (let i in this.form.images){
              params.images.push({imageId: this.form.images[i].id});
            }
          }
          if (this.form.id) {
            params.id = this.form.id;
          }
          addSolution(params)
            .then(res => {
              this.dialogFormVisible = false;
              this.query();
            })
        }
      }
    }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.add-dialogs{
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
    width: 100%;
    .select{
      min-width: 40%;
      color:red;
    }
  }
  .dialog-footer{
    text-align: center;
  }
}
</style>
