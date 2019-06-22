<template>
    <div class="unReviewed">
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--查看养生日记-->
      <el-dialog title="养生日记" v-if="dialogFormVisibles" :visible.sync="dialogFormVisibles" class="add-dialog" :loading="diaryLoading">
        <el-collapse v-model="activeNames" accordion >
          <el-collapse-item v-for="(item, index) in diaryList" :title="item.noteDateStr" :name="index+1" :key="index"  v-if="diaryList.length>0">
            <el-row>
              <el-card class="box-card">
                <div>{{item.content}}</div>
              </el-card>
              <div  class="images">
                <img v-for="(image, index) in item.images" :src="image.url" alt="">
              </div>
            </el-row>
            <el-row>
              <el-card class="box-card">
                <div>体检指标</div>
                <div v-for="(noteNorm, index) in item && item.journeyNoteNorms">
                  <div>{{noteNorm.normName}}：<span>{{noteNorm.value1}} {{noteNorm.value2}}</span></div>
                </div>
              </el-card>
            </el-row>
          </el-collapse-item>
          <div v-if="diaryList.length ===0" class="no-result">暂无数据</div>
        </el-collapse>
        <pagination v-show="noteTotalCount>0" :total="noteTotalCount" :page.sync="noteParams.pageNumber" :limit.sync="noteParams.pageSize" @pagination="watchDiary" />
      </el-dialog>

      <!--审核-->
      <el-dialog title="审核" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="add-dialog">
        <el-form :model="form" :label-position="'left'">
          <el-form-item label="旅程描述" label-width="120px">
            <el-input type="textarea" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="疾病" label-width="120px">
            <!--<span>糖尿病</span> ; <span>高血压</span>-->
            <span v-for="(item, index) in form.diseaseNames">
              <span>{{item}}</span>
              <span v-if="index < form.diseaseNames.length - 1">; </span>
            </span>
          </el-form-item>
          <el-form-item label="养生" label-width="120px">
            <!--<span>辟谷</span> ; <span>跑步</span>-->
            <span v-for="(item, index) in form.healthResult">
              <span>{{form.healths[index]}}: {{item}}</span>
              <span v-if="index < form.healthResult.length - 1">; </span>
            </span>
          </el-form-item>
          <el-form-item label="参加课程" label-width="120px">
            <!--<span>课程A</span> ; <span>课程B</span>-->
            <span v-for="(item, index) in form.courses">
              <span>{{item}}</span>
              <span v-if="index < form.courses.length - 1">; </span>
            </span>
          </el-form-item>
          <el-form-item label="使用方案" label-width="120px">
            <!--<span>方案一</span> ; <span>方案二</span>-->
            <span v-for="(item, index) in form.solutions">
              <span>{{item}}</span>
              <span v-if="index < form.solutions.length - 1">; </span>
            </span>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" size="small" @click="doAudit(1)">标记为已审核</el-button>
          <el-button type="primary" size="small" @click="doAudit(2)">审核被评为案例</el-button>
        </div>
      </el-dialog>

      <!--查看体检报告-->
      <el-dialog title="体检报告" v-if="dialogReportVisible" :visible.sync="dialogReportVisible">
        <el-table :data="reportData" size="small">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column  label="类型">
            <template slot-scope="scope">
              {{scope.row.type ? '旅程结束体检报告' : '旅程开始体检报告'}}
            </template>
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="watchReportDetails(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" size="small" @click="dialogReportVisible = false">关闭</el-button>
        </div>
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
              prop: 'nickName',
              label: '用户名'
            },
            {
              prop: 'journeyName',
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
            audit: "false"      // 0 代表未审核
          },
          totalCount: 0,
          tableData: [],
          form: {
            diseaseNames: [],
            healthResult: [],
            courses: [],
            solutions: [],
            healths: []
          },
          dialogFormVisible: false,
          dialogFormVisibles: false,
          dialogReportVisible: false,
          activeNames: ['1'],
          noteParams: {
            pageNumber: 1,
            pageSize: 10,
            journeyId: ''
          },
          diaryList: [],
          noteTotalCount: 0,
          diaryLoading: false,
          reportData: []
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
                for(let data of this.tableData) {
                  data.result = data.healthResult.join(',');
                }
              }).catch(res => {
                this.loading = false;
            });
          },
          /**
           * 查看
           * */
          watchDiary (index, row) {
            this.dialogFormVisibles = true;
            this.diaryLoading = true;
            this.noteParams.journeyId = row.journeyId;
            caseService.getDiaryList(this.noteParams)
              .then(res => {
                this.diaryLoading = false;
                this.diaryList = res.data.content;
                for (let list of this.diaryList) {
                  if (list.coverImageUrl) {
                    list.images.unshift({url: list.coverImageUrl});
                  }
                }
                this.noteTotalCount = res && res.data && res.data.totalElements;
              })
          },
        /**
         * 查看体检报告
         * */
          watchReport (index, row) {
            this.dialogReportVisible = true;
            this.reportData = row.reports || [];
          },
          watchReportDetails(row) {
            window.open(row.url, '_blank');
          },
          /**
           * 审核
           * */
        review (index, row) {
          this.dialogFormVisible = true;
          this.form = Object.assign({}, row);
          },
        /**
         * 案例审核
         * @flag 1：标记为已审核
         *       2：审核被被评为案例
         * */
        doAudit (flag) {
          let params = {
            checkType: flag,
            journeyId: this.form.journeyId,
            title: this.form.title
          };
          caseService.doAuditforCase(params)
            .then(res => {
              if (res.code === 200) {
                this.$alert(res.message, '提示', {
                  confirmButtonText: true
                });
              } else {
                this.$alert(res.data, '提示', {
                  confirmButtonText: true
                });
              }
              this.query();
            });
          this.dialogFormVisible = false;
        }
      }
    }
</script>

<style  rel="stylesheet/scss" lang="scss">
.add-dialog{
  .no-result{
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #909399;
  }
  .dialog-footer{
    text-align: center;
  }
 /deep/ .el-dialog__body{
    min-height:180px;
  }
  .images{
    img{
      width:200px;
      height:200px;
      margin-right:10px;
    }
  }
}
</style>
