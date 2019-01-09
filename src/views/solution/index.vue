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

  <el-dialog :title="title" :visible.sync="dialogFormVisible" class="add-dialogs">
    <el-form :model="form" :label-position="'left'">
      <el-form-item label="编码" label-width="120px">
        <el-input v-model="form.coding"></el-input>
      </el-form-item>
      <el-form-item label="解决方案名称" label-width="120px">
        <el-input v-model="form.resolveTitle"></el-input>
      </el-form-item>
      <el-form-item label="解决方案">
        <div class="solution-ue">
          <UE ref="ue" :default-msg="defaultMsg" :config="config" :id="ue1"/>
        </div>
      </el-form-item>
      <el-form-item label="配图" label-width="120px">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="相关课程" label-width="120px" class="item-wrap">
        <el-select v-model="form.relateLesson" placeholder="请选择相关课程">
          <el-option label="课程1" value="kecheng1"></el-option>
          <el-option label="课程2" value="kecheng2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关机构" label-width="120px" class="item-wrap">
        <el-select v-model="form.relateOrganization" placeholder="请选择相关机构">
          <el-option label="机构1" value="jigou1"></el-option>
          <el-option label="机构2" value="jigou2"></el-option>
        </el-select>
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
  import UE from '../../components/ue/ue.vue'
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
                prop: 'coding',
                label: '编码'
              },
              {
                prop: 'resolveTitle',
                label: '解决方案标题'
              },
              {
                prop: 'rehabilitationAmount',
                label: '康复人数'
              },
              {
                prop: 'relateOrganization',
                label: '相关机构'
              },
              {
                prop: 'relateLesson',
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

            },                    // 表单数据
            defaultMsg: '',
            config: {
              initialFrameWidth: null,
              initialFrameHeight: 200
            },                  // 文本编辑器配置
            ue1: 'ue1',                     // 不同编辑器必须不同的id
            dialogVisible: false,           // 上传图片弹框显示
            dialogImageUrl: '',
            fileList: [],
            title: '新增'                 // 弹框
          };
        },
      components: {
        commonTable,
        UE
      },
      created () {
          this.query();
      },
      methods: {
        query(){
          this.tableData = [
            {
              coding: '123',
              resolveTitle: '解决方案标题1',
              rehabilitationAmount: '123',
              relateOrganization: '123',
              relateLesson: '123'
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
          this.form = {};
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }
      }
    }
</script>

<style  rel="stylesheet/scss" lang="scss">
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
  }
  .dialog-footer{
    text-align: center;
  }
}
</style>
