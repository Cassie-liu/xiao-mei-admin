<template>
  <div class="course">
    <el-row>
      <el-button type="primary" size="small" @click="add">新增</el-button>
    </el-row>
    <common-table :columns="columns" :loading="loading" :table-data="tableData"></common-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

    <!--新增课程轮播图-->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" top="5%">
      <el-table :data="courseData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
      </el-table>
      <pagination v-show="courseTotalCount>0" :total="courseTotalCount" :page.sync="courseParams.pageNumber" :limit.sync="courseParams.pageSize" @pagination="queryCourses" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import commonTable from '@/views/common/commonTable';
  import Pagination from '@/components/Pagination';
  import {getCourseInfo} from '@/api/lesson';
export default {
  name: 'Course',
  data() {
    return {
      columns: [
        {
          type: 'index',
          label: '序号'
        },
        {
          prop: 'title',
          label: '标题'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'price',
          label: '价格'
        },
        {
          prop: 'members',
          label: '当前报名人数'
        },
        {
          type: 'function',
          label: '操作',
          functionOpt: [
            {
              type: 'text',
              label: '删除',
              func: this.deleteRow
            }
          ]
        }
      ],
      loading: false,
      tableData: [],
      params: {
        pageNumber: 1,
        pageSize: 20
      },
      totalCount: 0,
      form: {},
      title: '',
      dialogFormVisible: false,
      courseData: [],
      courseLoading:false,
      courseTotalCount: 0,
      courseParams: {
        pageNumber: 1,
        pageSize: 10
      },
      multipleSelection: []
    }
  },
  components: {
    commonTable,
    Pagination
  },
  mounted() {
    this.query();
  },
  methods: {
    queryCourses () {
      this.courseLoading = true;
      getCourseInfo(this.courseParams)
        .then(res => {
          this.courseLoading = false;
          this.courseData = res && res.data && res.data.content;
          this.courseTotalCount = res && res.data && res.data.totalElements;
        }).catch(err => {
        this.courseLoading = false;
      });
    },
    query () {},
    add () {
      this.courseTotalCount = 0;
      this.courseParams.pageNumber = 1;
      this.courseParams.pageSize = 10;
      this.queryCourses();
      this.form = {};
      this.title = '新增';
      this.dialogFormVisible = true;
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    /**
     * 删除
     * */
    deleteRow (index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    save () {
      console.log(this.multipleSelection);
      this.dialogFormVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
