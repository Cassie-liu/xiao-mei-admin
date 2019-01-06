<template>
<div class="app-container">
  <el-form :inline="true" :model="form" size="small" label-width="120px" >
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="选择养生类目">
        <el-select v-model="form.healthCategory">
          <el-option label="类目A" value="healthCategory1"></el-option>
          <el-option label="类目B" value="healthCategory2"></el-option>
          <el-option label="类目C" value="healthCategory3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择排序方式">
        <el-select v-model="form.sort">
          <el-option label="年" value="year"></el-option>
          <el-option label="月" value="month"></el-option>
          <el-option label="周" value="week"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户基数">
        <el-select v-model="form.userBase">
          <el-option label="全部用户" value="all"></el-option>
          <el-option label="康复用户" value="kangfu"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary">查询</el-button>
      </el-form-item>
  </el-form>
  <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
  <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                 :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                 @current-change="query" @size-change="query" layout="total, sizes, prev, pager, next">
  </el-pagination>
</div>
</template>

<script>
  import commonTable from '../common/commonTable';
    export default {
        name: 'Index',
       data() {
          return {
            form: {},        // 查询条件
            columns: [
              {
                prop: 'ranking',
                label: '排名'
              },
              {
                prop: 'userName',
                label: '昵称'
              },
              {
                prop: 'phone',
                label: '手机号码'
              },
              {
                prop: 'isHealthUser',
                label: '是否康复用户'
              },
              {
                prop: 'healthCategory',
                label: '养生类目'
              },
              {
                prop: 'totalTime',
                label: '累计时长'
              }
            ],
            loading: false,
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },                // 分页
          }
       },
      components: {
        commonTable
      },
      created() {
          this.query();
      },
      methods: {
          query(){
            this.tableData = [
              {
                ranking: '1',
                userName: 'user1',
                phone: '13578545020',
                isHealthUser: '是',
                healthCategory: '类目A',
                totalTime: '23分钟'
              }
            ];
            this.pageable = {
              total: 1,
              currentPage: 1,
              pageSize: 10
            };

          }
      }
    }
</script>

<style scoped>

</style>
