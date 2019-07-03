<template>
      <div class="music-setting">
        <div class="query">
          <el-form :inline="true" :model="params" size="mini">
            <el-form-item label="音乐名称">
              <el-input v-model.trim="params.musicName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
          <el-row>
            <el-upload action="" :show-file-list="false"
                       :on-error="uploadError" multiple :http-request="uploadUrl"
                       :before-upload="beforeUpload">
              <el-button type="success" size="small">上传音乐</el-button>
            </el-upload>
          </el-row>
        </div>
        <div class="content">
          <el-table :data="tableData" :loading="loading" size="small">
            <el-table-column type="index" label="序号" width="120px"></el-table-column>
            <el-table-column label="音乐名称"  property="name"></el-table-column>
            <el-table-column label="播放" >
              <template slot-scope="scope">
                <audio :src="scope.row.url" controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </template>
            </el-table-column>
            <el-table-column label="上传时间"  property="createTime"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-if="totalCount>0" :total="totalCount" :page.sync="params.pageNumber" :limit.sync="params.pageSize" @pagination="query" />
        </div>
      </div>
</template>

<script>
  import Pagination from '@/components/Pagination';
  import * as health from '@/api/health';
    export default {
        name: "MusicSetting",
      data () {
          return {
            params: {
              pageNumber: 1,
              pageSize: 20,
              musicName: ''
            },
            totalCount: 0,
            tableData: [],
            loading: false
          }
      },
      components: {
        Pagination
      },
      mounted () {
          this.query();
      },
      methods: {
        query () {
          this.loading = true;
          health.getMusicList(this.params)
            .then(res => {
              this.loading = false;
              this.tableData = res && res.data && res.data.content;
              this.totalCount = res && res.data && res.data.totalElements;
            })
        },
        add () {},
        deleteRow (index, row) {
          this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            health.deleteMusicById(row.id)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: res && res.message
                });
                this.params.pageNumber = 1;
                this.query();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        uploadError() {
          this.$message.error('上传失败，请重新上传');
        },
        beforeUpload (file) {
          var fileExt = file.name.replace(/.+\./, "");
          if (['mp3', 'mpeg', 'mpeg-4', 'midi', 'wma', 'cd', 'mp4', 'wav'].indexOf(fileExt.toLowerCase()) === -1) {
            this.$message({
              type: 'warning',
              message: '请上传后缀名为mp3、mpeg、mpeg-4、midi、wma、cd、mp4或wav的音乐文件！'
            });
            return false;
          }
        },
        uploadUrl (file) {
          this.loading = true;
          if (file && file.file) {
            this.uploadMusics(file.file);
          }
        },
        uploadMusics (file) {
          let formData = new FormData();
          formData.append('file', file);
          formData.append('musicName', file.name);
          health.uploadMusic(formData)
            .then(res => {
              this.loading = false;
              this.$message({
                type: 'success',
                message: res && res.message
              });
              this.params.pageNumber = 1;
              this.query();
            }).catch(res => {
              this.$message({
                type: 'danger',
                message: res && res.message
              });
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .music-setting{
    .query{
      display: flex;
      justify-content: space-between;
    }
  }
</style>
