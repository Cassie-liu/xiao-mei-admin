<template>
    <div class="reviewed">
      <el-row>
        <el-col :span="23">
          <span class="font">是否案例：</span>
          <el-radio label="" v-model="params.recoverCase">全部</el-radio>
          <el-radio label="true" v-model="params.recoverCase">案例</el-radio>
          <el-radio label="false" v-model="params.recoverCase">非案例</el-radio>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="params.pageNumber = 1;query()">查询</el-button>
        </el-col>
      </el-row>
      <!--<common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>-->
      <el-table :data="tableData"  v-loading="loading" style="width:100%" size="small">
        <el-table-column type="index" label="序号" width="120"></el-table-column>
        <el-table-column prop="nickName" label="用户名"></el-table-column>
        <el-table-column prop="journeyName" label="旅程名称"></el-table-column>
        <el-table-column prop="result" label="养生成果"></el-table-column>
        <el-table-column label="养生日记">
          <template slot-scope="scope">
            <el-button type="text" @click="watchDiary(scope.$index, scope.row)" class="text-primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="体检报告">
          <template slot-scope="scope">
            <el-button type="text" @click="watchReport(scope.$index, scope.row)" class="text-primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" v-if="scope.row.recoverCase" @click="cancel(scope.$index, scope.row)" class="text-primary">取消案例</el-button>-->
            <!--<el-button type="text" v-if="scope.row.recoverCase === false" @click="cancel(scope.$index, scope.row)" class="text-primary">确认为案例</el-button>-->
            <el-button type="text" size="small" @click="reReview(scope.$index, scope.row)">重新审核</el-button>
            <el-button type="text" size="small" @click="deleteCase(scope.$index, scope.row)">删除案例</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
      <!--查看养生日记-->
      <el-dialog title="养生日记" v-if="dialogFormVisibles" :visible.sync="dialogFormVisibles" class="add-dialog" top="5%" bottom="5%">
        <el-collapse v-model="activeNames" accordion :loading="diaryLoading">
          <el-collapse-item v-for="(item, index) in diaryList" :title="item.noteDateStr" :name="index+1" :key="index" v-if="diaryList.length>0">
            <el-row>
              <el-card class="box-card">
                <div>{{item.content}}</div>
              </el-card>
            </el-row>
            <el-row>
              <el-card class="box-card">
                <div  class="images">
                  <img v-for="(image, index) in item.images" :src="image.url" alt="">
                </div>
              </el-card>
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
          <div class="no-result" v-if="diaryList.length === 0">暂无数据</div>
        </el-collapse>
        <pagination v-show="noteTotalCount>0" :total="noteTotalCount" :page.sync="noteParams.pageNumber" :limit.sync="noteParams.pageSize" @pagination="watchDiary" />
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
        name: 'Reviewed',
      data () {
        return {
          loading: true,
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
                  label: '是否为案例',
                  func: this.cancel
                }
              ]
            }
          ],
          tableData: [],
          params: {
            pageNumber: 1,
            pageSize: 20,
            audit: 'true',      // 1 代表未审核
            recoverCase: ''   // 是否评为案例  1 是 0 否
          },
          totalCount: 0,
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
          query() {
            this.loading = true;
            caseService.getCaseList(this.params)
              .then(res => {
                this.tableData = res.data.content;
                this.totalCount = res && res.data && res.data.totalElements;
                for(let data of this.tableData) {
                  data.result = data.healthResult.join(',');
                }
                this.loading = false;
              }).catch(res => {
              this.loading = false;
            });
          },
        /**
         * 查看养生日记
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
       *  重新审核
       * */
      reReview (index, row) {
          this.$confirm('确认重新审核?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            caseService.reReviewCase(row.journeyId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res && res.message,
                    duration: 6000
                  });
                  this.params.pageNumber = 1;
                  this.query();
                }
              });
          }).catch(err => {
          })
        },
        deleteCase (index, row) {
          this.$confirm('确认删除案例?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            caseService.deleteCaseInfo(row.journeyId)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: res && res.message,
                    duration: 6000
                  });
                  this.params.pageNumber = 1;
                  this.query();
                }
              });
          }).catch(err => {
          })
        }
      },
      watch: {
          'params.recoverCase': {
            handler (curVal, oldVal) {
              this.query();
            },
            deep: true
          }
      }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.reviewed{
  .no-result{
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #909399;
  }
  .font{
    font-size: 16px;
  }
  .box-card{
    margin-top:20px;
  }
  .images{
   img{
     width:200px;
     height:200px;
     margin-right:10px;
   }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
}
</style>
