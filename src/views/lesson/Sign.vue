<template>
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="报名管理">
          <el-row>
            <el-form :inline="true" :model="params">
              <el-form-item label="手机号码">
                <el-input size="small" v-model.trim="params.phone"></el-input>
              </el-form-item>
              <el-form-item label="选择课程">
                <el-select size="small" placeholder="选择课程" v-model="params.courseId">
                  <el-option v-for="(item, index) in courseItems" :label="item.value" :key="item.key" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="params.pageNumber = 1;query()">查询</el-button>
                <el-button size="small" type="primary" @click="drive">导出</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-table :data="tableData" size="small">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="title" label="报名课程"></el-table-column>
            <el-table-column prop="price" label="报名费用"></el-table-column>
            <el-table-column prop="createTime" label="报名时间"></el-table-column>
          </el-table>

          <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import commonTable from '../common/commonTable';
  import Pagination from '@/components/Pagination';
  import * as lesson from '@/api/lesson';
    export default {
        name: "Sign",
      data () {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20,
              phone: '',
              courseId: ''
            },
            loading: false,
            tableData: [],
            totalCount: 0,
            courseItems: []
          }
      },
      components: {
        commonTable,
        Pagination
      },
      created () {
          this.query();
          this.queryCourseItems();
      },
      methods: {
        query () {
          this.loading = true;
          lesson.getFollowPageList(this.params)
            .then(res => {
              this.loading = false;
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
            });
        },
        queryCourseItems () {
          lesson.getCourseList()
            .then(res => {
              this.courseItems = res && res.data;
            });
        },
        /**
         * 导出
         * */
        drive () {
          window.open(`${process.env.BASE_API}/courseFollow/export?courseId=${this.params.courseId}&phone=${this.params.phone}`, '_blank')
        }
      }
    }
</script>

<style scoped>

</style>
