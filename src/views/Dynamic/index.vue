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
  <!--查看图片-->
  <el-dialog title="查看图片" :visible.sync="dialogFormVisible" class="add-dialog" width="40%">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
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
                type: 'function',
                label: '图片',
                functionOpt: [
                  {
                    type: 'text',
                    label: '查看',
                    func: this.showImages
                  }
                ]
              },
              {
                link: true,
                prop: 'likeAmount',
                label: '点赞数',
                func: this.showDetails
              },
              {
                link: true,
                prop: 'commentAmount',
                label: '评论数',
                func: this.showDetails
              },
              {
                link: true,
                prop: 'starAmount',
                label: '收藏数',
                func: this.showDetails
              }
            ],
            loading: false,
            tableData: [],
            pageable: {
              total: 0,
              currentPage: 1,
              pageSize: 10
            },
            dialogFormVisible: false
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
        },
        showImages (index, row) {
          console.log(index);
          console.log(row);
          this.dialogFormVisible = true;
        },
        showDetails (index, row) {
          console.log(index);
          console.log(row);
        }
      }
    }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .dialog-footer{
    text-align: center;
  }
</style>
