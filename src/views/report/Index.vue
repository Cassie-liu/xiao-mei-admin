<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane name="unReviewed">
        <span slot="label">
          <el-badge :value="form.pendingCount" :max="99" class="item">待审核</el-badge>
        </span>
        <un-reviewed v-if="activeName === 'unReviewed'" @refresh="refresh"/>
      </el-tab-pane>
      <el-tab-pane name="reviewed">
         <span slot="label">
          <el-badge :value="form.auditedCount" :max="99" class="item">已审核</el-badge>
        </span>
        <reviewed v-if="activeName === 'reviewed'" @refresh="refresh"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UnReviewed from './UnReviewed'
import Reviewed from './Reviewed'
import * as report from '@/api/report';
export default {
  name: 'Index',
  components: {
    UnReviewed,
    Reviewed
  },
  mounted () {
    this.query();
  },
  data() {
    return {
      activeName: 'unReviewed',
      form: {
        pendingCount: 0,
        auditedCount: 0
      }
    }
  },
  methods: {
    query() {
      report.getReportCount()
        .then(res => {
          this.form = res.data;
        })
    },
    refresh(flag) {
      if (flag) {
        this.query();
      }
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.item{
  /*margin-top: 10px;*/
  margin-right: 40px;
}
  /deep/ .el-badge__content.is-fixed{
    top:8px;
    right: 4px;
  }
</style>
