<template>
<div class="app-container">
  <el-form :inline="true" :model="user" size="mini" class="user">
    <el-form-item label="手机号码">
      <el-input v-model="user.phone" placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item label="是否认证" class="label">
      <el-select v-model="user.auth" placeholder="请选择">
        <el-option label="已认证" value="true"></el-option>
        <el-option label="未认证" value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
  <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
  <el-pagination style="text-align: right;margin-top: 20px;" v-if="pageable.total"
                 :total="pageable.total" :current-page.sync="pageable.currentPage" :page-size.sync="pageable.pageSize"
                 @current-change="onSubmit" @size-change="onSubmit" layout="total, sizes, prev, pager, next">
  </el-pagination>
</div>
</template>

<script>
  import commonTable from '../common/commonTable';
    export default {
        name: 'Index',
       data () {
         return {
           user: {      // user查询参数

           },
           columns: [     // 表格表头
             {
               type: 'index',
               label: '序号'
             },
             {
               prop: 'userName',
               label: '用户昵称'
             },
             {
               prop: 'phoneNum',
               label: '手机号码'
             },
             {
               prop: 'avatar',
               label: '头像'
             },
             {
               prop: 'commonDisease',
               label: '常见疾病'
             },
             {
               prop: 'isAuth',
               label: '是否认证'
             },
             {
               prop: 'userLesson',
               label: '用户课程'
             },
             {
               prop: 'heartReport',
               label: '爱心捐赠记录'
             },
             {
               prop: 'follow',
               label: '关注人'
             },
             {
               prop: 'fans',
               label: '粉丝数'
             },
             {
               prop: 'publishDynamic',
               label: '发布动态数量'
             },
             {
               prop: 'star',
               label: '收藏'
             }
           ],
           tableData: [],
           pageable: {
             total: 0,
             currentPage: 1,
             pageSize: 10
           },
           loading: false
         }
       },
      components: {
        commonTable
      },
      created () {
          this.onSubmit();
      },
      methods: {
        /**
        * 查询
        * */
        onSubmit(page){
          console.log(page);
        //   dummy
          this.tableData = [
            {
              userName: 'user1',
              phoneNum: '13458789815',
              avatar: '111',
              commonDisease: '感冒',
              isAuth: '是',
              userLesson: '123',
              heartReport: '12',
              follow: '23',
              fans: '45',
              publishDynamic: '56',
              star: '67',
            }
          ];
          this.pageable = {
            total: 1,
            currentPage: 1
          }
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
