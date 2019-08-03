<template>
  <div class="app-container">
    <el-dialog v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :loading="loading" top="5%" width="60%" class="case-entry">
      <div class="case">
        <el-form :label-position="'right'" :model="form" class="inline-form" :inline="true" label-width="120px">
          <el-form-item label="用户昵称" class="inline-form-item">
            <el-input size="small" v-model="form.nickname" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号码" class="inline-form-item">
            <el-input size="small" v-model="form.phone" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-form :label-position="'right'" :model="form"  label-width="120px">
          <el-form-item label="案例标题">
            <el-input size="small" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="案例介绍">
            <el-input type="textarea"  :autosize="{ minRows: 2}" v-model="form.content"></el-input>
          </el-form-item>
        </el-form>
        <hr>
        <el-button size="small" type="primary" @click="addDisease">添加疾病配置</el-button>
        <el-form :label-position="'right'" :model="form" :inline="true" label-width="120px" class="disease-form" v-for="(item, index) in form.disease" :key="item.key">
          <el-form-item label="选择疾病">
            <el-select size="small" v-model="item.diseaseDetailId"  @change="changeSelect">
              <el-option v-for="(item, index) in diseaseList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="治疗效果">
            <el-select size="small" class="select" v-model="item.healthResultId"  @change="changeSelect">
              <el-option v-for="(item, index) in resultList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.disease.length > 1">
            <el-button size="small" type="text" @click="deleteRow(form.disease, index)">删除</el-button>
          </el-form-item>
        </el-form>
        <hr>
        <el-button size="small" type="primary" @click="addNorm">添加指标</el-button>
        <el-form :label-position="'right'" :inline="true"   label-width="120px" class="norm-form" v-for="(item, index) in form.norm">
          <el-form-item label="体检指标">
            <el-select v-model="item.normTypeId" size="small" @change="changeNorm(item, item.normTypeId)">
              <el-option v-for="(item, index) in normTypeList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始指标值">
            <el-col :span="8"  class="inline-input">
              <el-input size="small" v-model="item.startValue1"></el-input>
            </el-col>
            <el-col :span="8" v-if="item.type === '2'">
              <el-input size="small" v-model="item.startValue2"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="结束指标值">
            <el-col :span="8"  class="inline-input">
              <el-input size="small" v-model="item.endValue1"></el-input>
            </el-col>
            <el-col :span="8"  v-if="item.type === '2'">
              <el-input size="small" v-model="item.endValue2"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item v-if="form.norm.length > 1">
            <el-button type="text" size="small" @click="deleteRow(form.norm, index)">删除</el-button>
          </el-form-item>
        </el-form>
        <hr>
        <el-form :lalbel-position="'right'" :model="form"  label-width="120px">
          <el-form-item label="使用的养生方式">
            <el-select v-model="form.healthIds" multiple size="small" class="select" @change="changeSelect">
              <el-option v-for="(item, index) in healthList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用的解决方案">
            <el-select v-model="form.solutionIds" multiple size="small" class="select" @change="changeSelect">
              <el-option v-for="(item, index) in solutionList" :value="Number(item.key)" :key="item.key + index" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :label-position="'right'" label-width="120px" :model="form"  :inline="true" class="inline-form">
          <el-form-item label="开始时间">
            <el-date-picker v-model="form.startTime" size="small" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" size="small"  type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-form>
        <hr>
        <el-button size="small" type="primary" @click="addNote">添加日记</el-button>
        <el-form :label-position="'right'" label-width="120px" :model="form"  v-for="(item, index) in form.notes" :key="item.key">
          <el-form-item label="日记时间">
            <el-date-picker v-model="item.noteTime" size="small" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-button size="small" type="text" @click="deleteRow(form.notes, index)">删除</el-button>
          </el-form-item>
          <el-form-item label="日记内容">
            <el-input type="textarea"  v-model="item.content" :autosize="{ minRows: 2}"></el-input>
          </el-form-item>
          <el-form-item label="封面图">
            <div @click="showCurrentImgList(index)">
              <el-upload
                action=""
                :on-error="uploadError"
                list-type="picture-card"
                :limit="1"
                :http-request="uploadUrl"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveCoverImage"
                :on-exceed="onExceed"
                :before-upload="beforeUpload"
                name="image"
                :file-list="item.coverImages">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传1张图片</span></div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="配图">
            <div @click="showCurrentImgList(index)">
              <el-upload
                action=""
                :on-error="uploadError"
                list-type="picture-card"
                :limit="5"
                :http-request="uploadUrls"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveImages"
                :on-exceed="onExceeds"
                :before-upload="beforeUpload"
                name="image"
                :file-list="item.images">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb, <span style="color: red">只能上传5张图片</span></div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import * as caseEntry from '@/api/caseEntry';
  import * as caseService from '@/api/case';
  import * as common from  '@/api/uploadImage';
  import {checkImages} from "@/utils";
    export default {
        name: "caseEntry",
      props: ['show', 'id'],
      data () {
        return {
          dialogFormVisible: false,
          loading: true,
          form: {
            title: '',                           // 案例标题
            nickname: '',                        // 用户昵称
            phone: '',                           // 手机号码
            content: '',                         // 案例介绍
            healthIds: [],                       // 养生ID
            solutionIds: [],                     // 解决方案ID
            norm: [
              {
                normTypeId: '',                  // 体检指标类型ID
                startValue1: '',                // 开始数值1
                endValue1: '',                  // 结束数值1
                type: ''
              }
            ],                                   // 体检指标
            notes: [
              {
                noteTime: '',   // 日记时间
                content: '',      // 日记内容
                coverImageId: '', // 封面图ID
                coverImages: [],   // 封面图list
                imageIds: [],    // 配图ID集合
                images: []       // 展示图list
              }
            ],                         // 日记
            disease: [
              {
                diseaseDetailId: '',    // 疾病小类ID
                healthResultId: '',     // 治疗效果ID
              }
            ],                      // 疾病
            startTime: '',                      //  开始时间
            endTime: ''                         //  结束时间
          },
          norm: [
            {
              normTypeId: '',                  // 体检指标类型ID
              startValue1: '',                // 开始数值1
              endValue1: '',                  // 结束数值1
              type: ''
            }
          ],
          diseaseList: [],  //疾病
          healthList: [],   // 养生
          normTypeList: [],   // 体检指标
          resultList: [],   // 治疗效果
          solutionList: [],  // 解决方案
          index: 0,
          normType: {},
          dialogVisible: false,           // 上传图片弹框显示
          dialogImageUrl: ''
        }
      },
      components: {
        Tinymce
      },
      mounted () {
        this.dialogFormVisible = this.show;
        this.getDiseaseList();
        this.getHealthList();
        this.getNormTypeList();
        this.getHealthResultList();
        this.geSolutionList();
        this.getCaseInfo();
      },
      methods: {
        getCaseInfo () {
          this.loading = true;
          caseService.editCaseInfo(this.id)
            .then(res => {
              this.form = Object.assign({}, res.data);
              if (this.form.disease && this.form.disease.length > 0) {
                for (let i in this.form.disease) {
                  this.form.disease[i].diseaseDetailId = String(this.form.disease[i].diseaseDetailId);
                  this.form.disease[i].healthResultId = this.form.disease[i].healthResultId && String(this.form.disease[i].healthResultId);
                }
              }
              if (this.form.disease && this.form.norm.length > 0) {
                for (let i in this.form.norm) {
                  this.form.norm[i].normTypeId = this.form.norm[i].normTypeId && String(this.form.norm[i].normTypeId);
                }
              }
              if (this.form.healthIds && this.form.healthIds.length > 0) {
                for (let i in this.form.healthIds) {
                  this.form.healthIds[i] =this.form.healthIds[i] && String(this.form.healthIds[i]);
                }
              }
              if (this.form.notes && this.form.notes.length === 0) {
                // if (this.form.notes[i].coverImages)  {
                //     this.form.notes[i].coverImageId = this.form.notes[i].coverImages && this.form.notes[i].coverImages.id;
                // }
              }
              this.loading = false;
            })
        },
        getHealthList () {
          caseEntry.getHealth()
            .then(res => {
              if (res.code === 200) {
                this.healthList = res.data;
              } else{
                this.healthList = [];
              }
            })
        },
        getDiseaseList () {
          caseEntry.getDisease()
            .then(res => {
              if (res.code === 200) {
                this.diseaseList = res.data;
              } else{
                this.diseaseList = [];
              }
            })
        },
        getNormTypeList () {
          caseEntry.getHealthNormType()
            .then(res => {
              if (res.code === 200) {
                this.normTypeList = res.data;
                for (let type of this.normTypeList) {
                  this.normType[type.key] = type.type;
                }
              } else{
                this.normTypeList = [];
              }
            })
        },
        getHealthResultList () {
          caseEntry.getHealthResult()
            .then(res => {
              if (res.code === 200) {
                this.resultList = res.data;
              } else{
                this.resultList = [];
              }
            })
        },
        geSolutionList () {
          caseEntry.getSolution()
            .then(res => {
              if (res.code === 200) {
                this.solutionList = res.data;
              } else{
                this.solutionList = [];
              }
            })
        },
        changeSelect () {
          this.$forceUpdate();
        },
        addDisease () {
          this.form.disease.push(
            {
              diseaseDetailId: '',
              healthResultId: ''
            }
          )
        },
        addNorm () {
          this.form.norm.push({
            normTypeId: '',
            startValue1: '',
            endValue1: ''
          })
        },
        addNote () {
          this.form.notes.push({
            noteTime: '',
            content: '',
            images: [],
            coverImages: []
          })
        },
        changeNorm (item, key) {
          item.type = this.normType[key];
          item.startValue1 = '';
          item.startValue2 = '';
          item.endValue1 = '';
          item.endValue2 = '';
          // this.$forceUpdate();
        },
        deleteRow (array, index) {
          array.splice(index, 1);
        },
        showCurrentImgList(index) {
          this.index = index;
        },
        uploadError () {
          this.$message.error('上传失败，请重新上传');
        },
        /**
         * 上传封面图
         * */
        uploadUrl (file) {
          if (file && file.file) {
            this.uploadImages(file.file, 1);
          }
        },
        /**
         * 上传展示图
         * */
        uploadUrls(file) {
          if (file && file.file) {
            this.uploadImages(file.file, 0);
          }
        },
        /**
         * flag 为1代表上传封面图， 为0代表上传展示图
         * */
        uploadImages(file, flag) {
          let formData = new FormData();
          formData.append('image', file);
          formData.append('model', '1');
          common.uploadSingleImage(formData)
            .then(res => {
              if (res.code === 200) {
                // 封面图
                if (flag) {
                  this.form.notes[this.index].coverImages.push(res.data);
                  this.form.notes[this.index].coverImageId = res.data.id;
                } else {
                  // 展示图
                  this.form.notes[this.index].images.push(res.data);
                }
              }
            })
        },
        /**
         * 移除封面图
         * */
        handleRemoveCoverImage (file, fileList) {
          // this.form.coverImage = fileList;
          this.form.notes[this.index].coverImages = fileList;
          this.form.notes[this.index].coverImageId = '';
          common.deleteImage(file.id);
        },
        /**
         * 移除配图
         * */
        handleRemoveImages (file, fileList) {
          this.form.notes[this.index].images = fileList;
          common.deleteImage(file.id);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        onExceed() {
          this.$message({
            type: 'info',
            message: '最多只能上传一个图片',
            duration: 6000
          });
        },
        onExceeds() {
          this.$message({
            type: 'info',
            message: '最多只能上传五张图片',
            duration: 6000
          });
        },
        beforeUpload (file) {
          checkImages(file, this);
        },
        save () {
          let params = Object.assign({}, this.form);
          if (this.form && this.form.notes && this.form.notes.length > 0) {
            for (let note of this.form.notes) {
              if (note.images.length > 0) {
                note.imageIds = [];
                for (let i in note.images) {
                  note.imageIds.push(note.images[i].id);
                }
              }
              if (note.coverImages.length > 0) {
                note.coverImageId = note.coverImages[0].id;
              }
            }
          }
          caseEntry.updateCaseEntry(params)
            .then(res => {
              if (res && res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res && res.message,
                  duration: 6000
                });
                this.resetParams();
                this.$emit('close');
              }
            })
        },
        resetParams () {
          this.form = {
            title: '',                           // 案例标题
            nickname: '',                        // 用户昵称
            phone: '',                           // 手机号码
            content: '',                         // 案例介绍
            healthIds: [],                       // 养生ID
            solutionIds: [],                     // 解决方案ID
            norm: [
              {
                normTypeId: '',                  // 体检指标类型ID
                startValue1: '',                // 开始数值1
                endValue1: '',                  // 结束数值1
                type: ''
              }
            ],                                   // 体检指标
            notes: [
              {
                noteTime: '',   // 日记时间
                content: '',      // 日记内容
                coverImageId: '', // 封面图ID
                coverImages: [],   // 封面图list
                imageIds: [],    // 配图ID集合
                images: []       // 展示图list
              }
            ],                         // 日记
            disease: [
              {
                diseaseDetailId: '',    // 疾病小类ID
                healthResultId: '',     // 治疗效果ID
              }
            ],                      // 疾病
            startTime: '',                      //  开始时间
            endTime: ''                         //  结束时间
          }
          this.$forceUpdate();
        }
      },
      watch: {
          'id': {
            handler (curVal, oldVal) {
              this.id = curVal;
              this.getCaseInfo();
            }
          }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .case{
    .inline-form{
      display:flex;
      justify-content: space-between;
      .inline-form-item{
        width:50%;
        /deep/ .el-form-item__content{
          width: 60%;
        }
      }

    }
    .inline-input{
      margin-right:10px;
    }
    .disease-form{
      width:100%;
    }
    .norm-form{
      width:125%;
      /deep/ .el-form-item__content{
        width:200px;
      }
    }
  }
</style>

