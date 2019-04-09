<template>
    <div class="reviewed">
      <el-row>
        <el-col :span="23">
          <span class="font">是否案例：</span>
          <el-radio label="1" v-model="params.radio">全部</el-radio>
          <el-radio label="2" v-model="params.radio">案例</el-radio>
          <el-radio label="3" v-model="params.radio">非案例</el-radio>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small">查询</el-button>
        </el-col>
      </el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>

      <!--查看养生日记-->
      <el-dialog title="养生日记" v-if="dialogFormVisible" :visible.sync="dialogFormVisible">
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
    </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Pagination from '@/components/Pagination';
    export default {
        name: 'Reviewed',
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
              prop: 'tripName',
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
                  label: '取消案例',
                  func: this.cancel
                }
              ]
            }
          ],
          tableData: [],
          params: {
            radio: '1'
          },
          dialogFormVisible: false,
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
          query() {
            this.tableData = [
              {
                userName: '111111',
                tripName: '111111111111'

              }
            ]
          },
        /**
         * 查看养生日记
         * */
        watchDiary (index, row) {
          this.dialogFormVisible = true;
        },
        /**
         * 查看体检报告
         * */
        watchReport (index, row) {

        },
      /**
       *  取消案例
       * */
        cancel (index, row) {
          this.$confirm('确认取消案例?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$message({
              type: 'info',
              message: '已取消案例'
            });
          }).catch(err => {
          })
        }
      }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.reviewed{
  .font{
    font-size: 16px;
  }
  .box-card{
    margin-top:20px;
  }
}
</style>
