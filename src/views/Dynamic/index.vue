<template>
<div class="app-container">
  <el-form :inline="true" :model="user" size="mini" class="user">
    <el-form-item label="手机号码">
      <el-input v-model="user.phone" placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="query">查询</el-button>
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
        data () {
          return {
            user: {
              phone: ''
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
                prop: 'publishTime',
                label: '发表时间'
              },
              {
                prop: 'property',
                label: '属性'
              },
              {
                prop: 'title',
                label: '标题'
              },
              {
                prop: 'image',
                label: '图片'
              },
              {
                prop: 'likeAmount',
                label: '点赞数'
              },
              {
                prop: 'commentAmount',
                label: '评论数'
              },
              {
                prop: 'starAmount',
                label: '收藏数'
              }
            ],
            loading: false,
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            }
          };
        },
      components: {
        commonTable
      },
       created () {
        this.query()
       },
      methods: {
        query () {
          this.tableData = [
            {
              userName: 'user1',
              publishTime: '2018-12-14',
              property: '公开',
              title: '疾病111111',
              image: 'url',
              likeAmount: '30',
              commentAmount: '40',
              starAmount: '50'
            },
            {
              userName: 'user2',
              publishTime: '2018-12-14',
              property: '私密',
              title: '疾病111111',
              image: 'url',
              likeAmount: '30',
              commentAmount: '40',
              starAmount: '50'
            }
          ],
          this.pageable = {
            total: 2,
            currentPage: 1,
            pageSize: 10
          }
        }
      }
    }
</script>

<style scoped>

</style>
