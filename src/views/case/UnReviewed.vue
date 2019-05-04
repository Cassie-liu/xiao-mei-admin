<template>
    <div class="unReviewed">
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>

      <!--查看养生日记-->
      <el-dialog title="养生日记" v-if="dialogFormVisibles" :visible.sync="dialogFormVisibles">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item v-for="(item, index) in 10" :title="'养生日记标题' + (index+1)" :name="index+1" :key="index">
            <el-row>
              <el-card>
                养生日记图文内容xxxxxxxxxxxxxx
              </el-card>
            </el-row>
            <el-row>
              <el-card class="box-card">
                <div>体检指标</div>
                <div>血脂：<span>xxx</span></div>
                <div>血糖：<span>xxx</span></div>
              </el-card>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-dialog>

      <!--审核-->
      <el-dialog title="审核" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="旅程描述" label-width="120px">
            <el-input type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="疾病" label-width="120px">
            <span>糖尿病</span> ; <span>高血压</span>
          </el-form-item>
          <el-form-item label="养生" label-width="120px">
            <span>辟谷</span> ; <span>跑步</span>
          </el-form-item>
          <el-form-item label="参加课程" label-width="120px">
            <span>课程A</span> ; <span>课程B</span>
          </el-form-item>
          <el-form-item label="使用方案" label-width="120px">
            <span>方案一</span> ; <span>方案二</span>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" size="small">标记为已审核</el-button>
          <el-button type="primary" size="small">审核被评为案例</el-button>
        </div>
      </el-dialog>

      <!--查看体检报告-->
      <el-dialog title="体检报告" v-if="dialogReportVisible" :visible.sync="dialogReportVisible">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3>{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Pagination from '@/components/Pagination';
  import * as caseService from '@/api/case';
    export default {
        name: 'unReviewed',
      data () {
        return {
          loading: false,
          columns: [
            {
              type: 'index',
              label: '序号'
            },
            {
              prop: 'userName',
              label: '用户名'
            },
            {
              prop: 'JourneyName',
              label: '旅程名称'
            },
            {
              prop: 'result',
              label: '养生成果'
            },
            {
              type: 'function',
              label: '养生日记',
              functionOpt: [
                {
                  type: 'text',
                  label: '查看',
                  func: this.watchDiary
                }
              ]
            },
            {
              type: 'function',
              label: '体检报告',
              functionOpt: [
                {
                  type: 'text',
                  label: '查看',
                  func: this.watchReport
                }
              ]
            },
            {
              type: 'function',
              label: '操作',
              functionOpt: [
                {
                  type: 'text',
                  label: '审核',
                  func: this.review
                }
              ]
            }
          ],
          params: {
            pageNumber: 1,
            pageSize: 20,
            audit: 0      // 0 代表未审核
          },
          tableData: [],
          form: {},
          dialogFormVisible: false,
          dialogFormVisibles: false,
          dialogReportVisible: false,
          activeNames: ['1']
        };
      },
      components: {
        commonTable,
        Pagination
      },
      mounted () {
        this.query();
      },
      methods: {
          query () {
            this.loading = true;
            caseService.getCaseList(this.params)
              .then(res => {
                this.tableData = res.data.content;
                this.totalCount = res && res.data && res.data.totalElements;
                this.loading = false;
              });
          },
          /**
           * 查看
           * */
          watchDiary (index, row) {
            this.dialogFormVisibles = true;
          },
        /**
         * 查看体检报告
         * */
          watchReport (index, row) {
          this.dialogReportVisible = true;
          },
          /**
           * 审核
           * */
        review (index, row) {
          this.dialogFormVisible = true;
          }
      }
    }
</script>

<style  rel="stylesheet/scss" lang="scss">
.add-dialog{
  .dialog-footer{
    text-align: center;
  }
}
</style>
