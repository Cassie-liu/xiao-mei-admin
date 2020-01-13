<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="商品管理">
        <el-form :inline="true" :model="params" size="mini" class="user">
          <el-form-item label="商品名称">
            <el-input v-model.trim="params.name" placeholder="请输入商品名称"/>
          </el-form-item>
          <el-form-item label="商品SKU" class="label">
            <el-input v-model.trim="params.sku" placeholder="请输入商品编码"/>
          </el-form-item>
          <el-form-item label="价格最大值" class="label">
            <!--<el-input-number v-model="params.priceMax" :precision="2" :step="0.1"  placeholder="请输入价格最大值"></el-input-number>-->
            <el-input v-model.trim="params.priceMax" placeholder="请输入价格最大值"/>
          </el-form-item>
          <el-form-item label="价格最小值" class="label">
            <el-input v-model.trim="params.priceMin" placeholder="请输入价格最小值"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button size="small" type="primary" @click="add">新增</el-button>
        </el-row>
        <el-table :data="tableData" :loading="loading" size="small">
          <el-table-column type="index" label="序号" width="120"/>
          <el-table-column
            property="name"
            label="商品名称"/>
          <el-table-column
            property="price"
            label="商品价格"/>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.status ? '已停售' : '售卖中' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="sell(scope.row)">{{ scope.row.status ? '上架' : '下架' }}</el-button>
              <el-button type="text" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deletRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />

        <!--新增/编辑-->
        <el-dialog v-if="dialogFormVisible" :title="title" :visible.sync="dialogFormVisible" top="5%" width="70%">
          <el-form :model="form" :label-position="'left'">
            <el-form-item label="商品名称" label-width="120px">
              <el-input v-model="form.name" size="small"/>
            </el-form-item>
            <el-form-item label="商品SKU" label-width="120px">
              <el-input v-model="form.sku" size="small"/>
            </el-form-item>
            <el-form-item label="商品价格" label-width="120px">
              <el-input-number v-model="form.price" :precision="2" :step="0.1" />
            <!--<el-input size="small" v-model="form.price"></el-input>-->
            </el-form-item>
            <el-form-item label="商品URL" label-width="120px">
              <el-input v-model="form.url" size="small"/>
            </el-form-item>
            <el-form-item label="售卖状态" label-width="120px">
              <el-radio v-model="form.status" label="1">售卖中</el-radio>
              <el-radio v-model="form.status" label="2">已停售</el-radio>
            </el-form-item>
            <el-form-item label="邮递" label-width="120px">
              <el-radio :label="0" v-model="form.freightType">包邮</el-radio>
              <el-radio :label="1" v-model="form.freightType">不包邮</el-radio>
            </el-form-item>
            <el-form-item v-if="form.freightType" label="运费" label-width="120px">
              <el-input-number v-model="form.freight" :precision="2" :step="0.1" />
            <!--<el-input v-model="form.freight"></el-input>-->
            </el-form-item>
            <el-form-item label="展示图" label-width="120px">
              <el-upload
                :http-request="uploadUrls"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveCourseImage"
                :before-upload="beforeUpload"
                :file-list="form.images"
                multiple
                action=""
                list-type="picture-card">
                <i class="el-icon-plus"/>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，建议大小750*440px, <span style="color: red">最多上传5张图片</span></div>
              <!--<div slot="tip" class="el-upload__tip">最多上传5张图片</div>-->
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img :src="dialogImageUrl" width="100%" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="商品介绍" label-width="120px">
              <el-input v-model="form.introduce" type="textarea"/>
            </el-form-item>
            <el-form-item label="商品描述" label-width="120px">
              <div class="solution-ue">
                <tinymce ref="editor" :height="300" v-model="form.description" :show-modal="false" />
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import commonTable from '../common/commonTable'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import * as common from '@/api/uploadImage'
import { checkImages } from '../../utils'
import * as commodity from '@/api/commodity'
export default {
  name: 'Index',
  components: {
    commonTable,
    Pagination,
    Tinymce
  },
  data() {
    return {
      tableData: [],
      loading: false,
      params: {
        pageNumber: 1,
        pageSize: 20,
        name: '',
        sku: '',
        priceMin: '',
        priceMax: ''
      },
      totalCount: 0,
      dialogFormVisible: false,
      form: {
        name: '',
        price: '',
        freightType: 0,
        freight: '',
        images: [],
        introduce: '',
        description: '',
        sku: ''
      },
      title: '新增',
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.loading = true
      commodity.getCommodityList(this.params)
        .then(res => {
          this.loading = false
          this.tableData = res && res.data && res.data.content
          this.totalCount = res && res.data && res.data.totalElements
        })
    },
    add() {
      this.dialogFormVisible = true
      this.title = '新增'
      this.form = {
        name: '',
        price: '',
        freightType: 0,
        freight: '',
        images: [],
        introduce: '',
        description: '',
        sku: ''
      }
    },
    sell(row) {
      this.$confirm(`是否将此商品${row.status ? '上架' : '下架'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commodity.sellCommodity({ commodityId: row.commodityId, opType: row.status ? 0 : 1 })
          .then(res => {
            this.$message({
              type: 'success',
              message: res && res.message
            })
            this.params.pageNumber = 1
            this.query()
          })
      }).catch(() => {})
    },
    edit(index, row) {
      this.dialogFormVisible = true
      this.title = '新增'
      commodity.getCommodityDetails(row.commodityId)
        .then(res => {
          this.form = res.data
        })
      // this.form = Object.assign({}, row);
    },
    deletRow(index, row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commodity.deleteCommmodity(row.commodityId)
          .then(res => {
            this.$message({
              type: 'success',
              message: res && res.message
            })
            this.params.pageNumber = 1
            this.query()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
         * 上传展示图
         * */
    uploadUrls(file) {
      if (file && file.file) {
        this.uploadImages(file.file)
      }
    },
    /**
         * flag 为0 代表上传封面图， 为1 代表上传展示图
         * */
    uploadImages(file, flag) {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('model', '1')
      common.uploadSingleImage(formData)
        .then(res => {
          if (res.code === 200) {
            this.form.images.push(res.data)
            console.log(this.form.images)
          }
        })
    },
    uploadError() {
      this.$message.error('上传失败，请重新上传')
    },
    beforeUpload(file) {
      checkImages(file, this)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemoveCourseImage(file, fileList) {
      this.form.courseImages = fileList
      common.deleteImage(file.id)
    },
    save() {
      const params = {
        name: this.form.name,
        price: this.form.price,
        sku: this.form.sku,
        status: this.form.status,
        url: this.form.url,
        description: this.form.description,
        freight: this.form.freight,
        freightType: this.form.freightType,
        introduce: this.form.introduce,
        imageIds: []
      }
      if (this.form.images && this.form.images.length > 0) {
        for (const image of this.form.images) {
          params.imageIds.push(image.id)
        }
      }
      if (this.form.commodityId) {
        params.commodityId = this.form.commodityId
        commodity.updateCommmodity(params)
          .then(res => {
            if (res && res.code === 200) {
              this.$message({
                type: 'success',
                message: res && res.message,
                duration: 6000
              })
            }
            this.params.pageNumber = 1
            this.query()
          })
      } else {
        commodity.addCommmodity(params)
          .then(res => {
            if (res && res.code === 200) {
              this.$message({
                type: 'success',
                message: res && res.message,
                duration: 6000
              })
            }
            this.params.pageNumber = 1
            this.query()
          })
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .add-dialog1{
    .solution-ue{
      margin-left:120px;
    }
    .inline{
      display: inline-block;
    }
    .el-dialog__body{
      max-height: 500px !important;
      overflow: auto !important;
    }
    .item-wrap{
      display: inline-block;
      margin-right:10%;
    }
    .dialog-footer{
      text-align: center;
    }
  }
</style>
