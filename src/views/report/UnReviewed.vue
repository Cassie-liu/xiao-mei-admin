<template>
  <div class="unReviewed">
    <el-row>
      <el-form :inline="true" :model="params">
        <el-form-item label="选择举报类型">
          <el-select size="small" placeholder="选择举报类型" v-model="params.typeId">
            <el-option v-for="(item, index) in typeList" :label="item.typeName" :key="item.reportTypeId" :value="item.reportTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="query(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
    </el-row>

    <el-dialog title="审核" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" v-loading="formLoading" class="add-dialog">
      <div class="list-item">
        <div class="list-item-main">
          <div class="list-item-meta">
           <div class="list-item-meta-avatar">
             <span class="avatar avatar-circle avatar-image avatar-default">
               <img :src="form.userAvatar" alt="">
             </span>
           </div>
            <div class="list-item-meta-content">
                <div class="list-item-meta-title">{{form.nickName}}</div>
                <div class="list-item-meta-description">{{form.createTime}}</div>
            </div>
          </div>
          <div class="list-type">
            <span class="el-link link-primary">{{form.cfType}} </span>
            <span class="el-link link-success">{{form.typeContent}}</span>
          </div>
          <div class="list-item-content">{{form.content}}</div>
          <div class="block" v-for="(image,index) in form.images" :key="index">
            <div class="el-image" style="width: 100px;height:100px;">
              <img :src="image" >
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="small" @click="check(true)">审核通过</el-button>
        <el-button type="primary" size="small" @click="check(false)">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from '@/views/common/commonTable'
import Pagination from '@/components/Pagination';
import * as report from '@/api/report'
export default {
  name: 'UnReviewed',
  components: {
    commonTable,
    Pagination
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          type: 'index',
          label: '序号'
        },
        {
          prop: 'reporterName',
          label: '举报人'
        },
        {
          prop: 'informeeName',
          label: '被举报用户'
        },
        {
          prop: 'type',
          label: '举报类型'
        },
        {
          prop: 'reportTime',
          label: '举报时间'
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
        typeId: '',
        isChecked: false,
        pageNumber: 1,
        pageSize: 20
      },
      typeList: [],
      totalCount: 0,
      tableData: [],
      dialogFormVisible: false,
      formLoading: false,
      form: {},
      id: null
    }
  },
  mounted() {
    this.queryTypeList();
    this.query();
  },
  methods: {
    queryTypeList () {
      report.getReportTypeList()
        .then(res => {
          this.typeList = res.data;
        })
    },
    query() {
      this.loading = true;
      report.getReportData(this.params)
        .then(res=>{
          this.loading = false;
          this.tableData = res.data.content;
          this.totalCount = res && res.data && res.data.totalElements;
        });
    },
    review(index, row) {
      this.dialogFormVisible = true;
      this.formLoading = true;
      report.getReportDetail(row.id)
        .then(res => {
          this.formLoading = false;
          this.form = res.data;
          this.id = row.id;
        })
    },
    check(flag) {
      let data = {
        checkStatus: flag,
        id: this.id
      }
      report.reportCheck(data)
        .then(res => {
            this.dialogFormVisible = false;
            this.params.pageNumber = 1;
            this.params.pageSize = 20;
            this.totalCount = 0;
            this.form = {};
            this.query();
            this.$emit('refresh', true);
        });
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
  .list-item{
    border-bottom: 1px solid #e8eaec;
    border-top:  1px solid #e8eaec;
    display: flex;
    padding: 12px 0;
    .list-item-main{
      display: block;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      .list-type{
        margin-left: 68px;
        padding: 15px 0;
        .el-link{
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          position: relative;
          text-decoration: none;
          outline: none;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
          font-weight: 500;
        }
        .link-success{
          color: #67c23a;
        }
        .link-primary{
          color: #409eff;
        }
      }
      .list-item-meta{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        font-size: 0;
        .list-item-meta-avatar{
          margin-right: 16px;
          .avatar{
            display: inline-block;
            text-align: center;
            background: #ccc;
            color: #fff;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
            vertical-align: middle;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 50%;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .avatar-image{
            background: 0 0;
          }
        }
        .list-item-meta-content{
          -webkit-box-flex: 1;
          -ms-flex: 1 0;
          flex: 1 0;
          .list-item-meta-title{
            color: rgba(0,0,0,.85);
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
          }
          .list-item-meta-description{
            color: rgba(0,0,0,.45);
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
      .list-item-content{
        margin-left: 68px;
      }
      .block{
        padding: 30px 0;
        border-right: 1px solid #eff2f6;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        vertical-align: top;
        margin-left:68px;
        .el-image{
          display: inline-block;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }

    }
  }
}
</style>
