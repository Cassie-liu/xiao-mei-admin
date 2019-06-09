<template>
<div class="app-container">
  <el-tabs type="border-card">
    <el-tab-pane label="用户管理">
      <el-form :inline="true" :model="params" size="mini" class="user">
        <el-form-item label="手机号码">
          <el-input v-model="params.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="昵称" class="label">
          <el-input v-model="params.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="起始注册日期">
          <el-date-picker
            v-model="params.createTimeStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止注册日期">
          <el-date-picker
            v-model="params.createTimeEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import commonTable from '../common/commonTable';
  import Pagination from '@/components/Pagination';
  import * as login from '@/api/login';
  import {formatDate} from '@/utils/validate';
    export default {
        name: 'Index',
       data () {
         return {
           params: {
             pageNumber: 1,
             pageSize: 20,
             createTimeStart: '',
             createTimeEnd: formatDate(new Date(), 'yyyy-MM-dd'),
             mobile: '',
             nickName: ''
           },
           totalCount: 0,
           columns: [     // 表格表头
             {
               type: 'index',
               label: '序号'
             },
             {
               prop: 'nickName',
               label: '用户昵称'
             },
             {
               prop: 'mobile',
               label: '手机号码'
             },
             {
               prop: 'createTime',
               label: '注册时间'
             }
           ],
           tableData: [],
           loading: false
         }
       },
      components: {
        commonTable,
        Pagination
      },
      mounted () {
          this.params.createTimeStart = formatDate(new Date(), 'yyyy-MM-dd');
          this.params.createTimeEnd = formatDate(new Date(), 'yyyy-MM-dd');
          this.query();
      },
      methods: {
        /**
        * 查询
        * */
        query(){
          console.log(this.params);
          this.loading = true;
          login.getUsers(this.params)
            .then(res => {
              this.loading = false;
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
            }).catch(error => {
              this.loading = false;
          });
        },
        showDetails(index, row, url) {
          this.$router.push(url + '/' + row.id);
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .user{
    label{
      font-weight: normal !important;
    }
    .label{
      margin-left:30px;
    }
  }
</style>
