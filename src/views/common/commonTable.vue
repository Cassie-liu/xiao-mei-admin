<template>
  <div class="dashboard-container">
    <el-table :data="tableData" size="small" v-loading="loading">
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label"
                       :width="item.width || ''">
        <template slot-scope="scope">
          <div v-if="item.type === 'index'">{{scope.$index + 1}}</div>
          <div v-if="item.type !=='function'">
            <span v-if="!item.link">{{scope.row[item.prop]}}</span>
            <span v-if="item.link" @click="item.func && item.func(scope.$index, scope.row, item.url)" class="text-primary">
              <!--<el-button type="text"></el-button>-->
              {{scope.row[item.prop]}}
            </span>
          </div>
          <div v-if="item.type === 'function'">
            <el-button v-for="(func, $index) in item.functionOpt" :key="$index" :type="func.type" @click="func.func(scope.$index, scope.row)"
                       :class="func.text === 'text'? 'button-text': ''" class="button-text">
              {{func.label}}
            </el-button>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column v-for="(item, index) in columns" :key="index" :label="item.label"-->
                       <!--:width="item.width || ''" v-if="item.type === 'function'">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-for="(func, $index) in item.functionOpt" :key="$index" :type="func.type" @click="func.func(scope.$index, scope.row)">-->
            <!--{{func.label}}-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    columns: Array,
    tableData: Array,
    loading: Boolean
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text-primary{
  color:#409EFF;
  cursor: pointer;
  &:hover{
    color:#66b1ff;
  }
}
  .button-text{
    font-size: 12px;
  }
</style>
