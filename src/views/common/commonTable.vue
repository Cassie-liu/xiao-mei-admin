<template>
  <div class="dashboard-container">
    <el-table :data="tableData" size="small" v-loading="loading">
      <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" :type="item.type? item.type: ''"
                       :width="item.width || ''" v-if="item.type !=='function'"></el-table-column>
      <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label"
                       :width="item.width || ''" v-if="item.type === 'function'">
        <template slot-scope="scope">
          <el-button v-for="(func, $index) in item.functionOpt" :key="$index" :type="func.type" @click="func.func(scope.$index, scope.row)">
            {{func.label}}
          </el-button>
        </template>
      </el-table-column>
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

</style>
