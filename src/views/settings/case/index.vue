<template>
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="案例录入">
         <div class="case">
           <el-form :label-position="'right'" class="inline-form" :inline="true" label-width="120px">
             <el-form-item label="用户昵称" class="inline-form-item">
               <el-input size="small"></el-input>
             </el-form-item>
             <el-form-item label="手机号码" class="inline-form-item">
               <el-input size="small"></el-input>
             </el-form-item>
           </el-form>
           <el-form :label-position="'right'" label-width="120px">
             <el-form-item label="案例标题">
               <el-input size="small"></el-input>
             </el-form-item>
             <el-form-item label="案例介绍">
               <el-input type="textarea"  :autosize="{ minRows: 2}"></el-input>
             </el-form-item>
           </el-form>
           <hr>
           <el-button size="small" type="primary" @click="addDisease">添加疾病配置</el-button>
           <el-form :label-position="'right'" :inline="true" label-width="120px" class="disease-form" v-for="(item, index) in form.disease">
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
           <el-form :label-position="'right'" :inline="true"  label-width="120px" class="norm-form" v-for="(item, index) in form.norm">
             <el-form-item label="体检指标">
               <el-select v-model="item.normTypeId" size="small">
                 <el-option v-for="(item, index) in normTypeList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="开始指标值">
                <el-col :span="8"  class="inline-input">
                  <el-input size="small" v-model="item.startValue1"></el-input>
                </el-col>
               <el-col :span="8" v-if="item.normTypeId === 2">
                 <el-input size="small" v-model="item.startValue2"></el-input>
               </el-col>
             </el-form-item>
             <el-form-item label="结束指标值">
               <el-col :span="8"  class="inline-input">
                 <el-input size="small" v-model="item.endValue1"></el-input>
               </el-col>
               <el-col :span="8"  v-if="item.normTypeId === 2">
                 <el-input size="small" v-model="item.endValue2"></el-input>
               </el-col>
             </el-form-item>
             <el-form-item v-if="form.norm.length > 1">
               <el-button type="text" size="small" @click="deleteRow(form.norm, index)">删除</el-button>
             </el-form-item>
           </el-form>
           <hr>
           <el-form :lalbel-position="'right'" label-width="120px">
             <el-form-item label="使用的养生方式">
               <el-select v-model="form.health" multiple size="small" class="select" @change="changeSelect">
                 <el-option v-for="(item, index) in healthList" :value="item.key" :key="item.key + index" :label="item.value"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="使用的解决方案">
               <el-select v-model="form.solution" multiple size="small" class="select" @change="changeSelect">
                 <el-option v-for="(item, index) in solutionList" :value="Number(item.key)" :key="item.key + index" :label="item.value"></el-option>
               </el-select>
             </el-form-item>
           </el-form>
           <el-form :label-position="'right'" label-width="120px" :inline="true" class="inline-form">
             <el-form-item label="开始时间">
               <el-date-picker v-model="form.startTime" size="small" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
             </el-form-item>
             <el-form-item label="结束时间">
               <el-date-picker v-model="form.endTime" size="small"  type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
             </el-form-item>
           </el-form>
           <hr>
           <el-button size="small" type="primary" @click="addNote">添加日记</el-button>
           <el-form :label-position="'right'" label-width="120px" v-for="(item, index) in form.note">
             <el-form-item label="日记时间">
               <el-date-picker v-model="item.noteDate" size="small" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
               <el-button size="small" type="text" @click="deleteRow(form.note, index)">删除</el-button>
             </el-form-item>
             <el-form-item label="日记内容">
               <el-input type="textarea"  v-model="item.content" :autosize="{ minRows: 2}"></el-input>
             </el-form-item>
           </el-form>
           <el-form :label-position="'right'" label-width="120px">
             <el-form-item>
               <el-button size="small" type="primary" @click="save">保存</el-button>
             </el-form-item>
           </el-form>
         </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import * as caseEntry from '@/api/caseEntry';
    export default {
        name: "index",
      data () {
          return {
            form: {
              content: '',
              health: [],
              solution: [],
              norm: [
                {
                  normTypeId: '',
                  startValue1: '',
                  endValue1: ''
                }
              ],        // 体检指标
              note: [
                {
                  noteDate: '',
                  content: ''
                }
              ],         // 日记
              disease: [
                {
                  diseaseDetailId: '',
                  healthResultId: '',
                }
              ],
              startTime: '',      //  开始时间
              endTime: '',      //  结束时间
            },
            diseaseList: [],  //疾病
            healthList: [],   // 养生
            normTypeList: [],   // 体检指标
            resultList: [],   // 治疗效果
            solutionList: []  // 解决方案
          }
      },
      components: {
        Tinymce
      },
      mounted () {
          this.getDiseaseList();
          this.getHealthList();
          this.getNormTypeList();
          this.getHealthResultList();
          this.geSolutionList();
      },
      methods: {
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
          this.form.note.push({
            noteDate: '',
            content: ''
          })
        },
        deleteRow (array, index) {
          array.splice(index, 1);
        },
        save () {
          console.log(this.form);
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.case{
  width: 60%;
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
    width:130%;
  }
  .norm-form{
    width:250%;
    /deep/ .el-form-item__content{
      width:200px;
    }
  }
}
</style>
