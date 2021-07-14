<template>
<div class="otherpage">
  <div class="outerpage_tiptile">建筑物校正</div>
  <el-form :model="engineParam" :inline="true" class="tipform">
    <el-form-item label="校正值1">
      <el-input type="number" v-model="engineParam.buildingCorrect.contour" placeholder="请输入校正值1" size="small" style="width: 80%"></el-input>
    </el-form-item>
    <br/>
    <el-form-item label="校正值2">
      <el-input type="number" v-model="engineParam.buildingCorrect.inside" placeholder="请输入校正值2" size="small" style="width: 80%"></el-input>
    </el-form-item>
  </el-form>
  <br/>
  <div class="outerpage_tiptile"> 地貌校正  (提示：双击表格即可进行修改)</div>
    <other-table 
    :tabDialogTitle="`地貌校正`"
    :tabParams="areaTabParams" 
    :tableHeader="areaTableHeader" 
    :addForm="areaAddForm"
    :colList="areaColList"
    @closeAddForm="closeAddForm"
    @otherDelItem="otherDelItem"
    @tabPush="tabPush"
    @otherTabNull="otherTabNull"
    ></other-table>
  <!-- 建筑物损耗设置 -->
  <br/>
  <div class="outerpage_tiptile"> 建筑物损耗设置  (提示：双击表格即可进行修改)</div>
    <other-table 
    :tabDialogTitle="`建筑物损耗设置`"
    :tabParams="buildTabParams" 
    :tableHeader="buildTableHeader" 
    :addForm="buildAddForm"
    :colList="buildColList"
    @closeAddForm="closeAddForm"
    @otherDelItem="otherDelItem"
    @tabPush="tabPush"
    @otherTabNull="otherTabNull"
    ></other-table>
  <!-- 建筑物楼层设置 -->
  <br/>
  <div class="outerpage_tiptile"> 建筑物楼层设置 </div>
  <div class="build_up">
    <el-upload
      action
      accept=".csv,.CSV"
      :auto-upload="false"
      :on-change="buildUploadchange"
      :limit="1"
      class="build_up_upload"
      :file-list="upfilelist"
      :on-remove="buildUpRemove"
    >
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-download"
        plain
      >导入</el-button>
      <!-- <span slot="file"></span> -->
    </el-upload>
    <span class="e-move-tip">
      <i class="el-icon-warning-outline"></i>只能选择.csv文件
    </span>
  </div>
  <div slot="footer" class="footer" >
    <el-button @click="closeOther" size="mini">取 消</el-button>
    <el-button type="primary" @click="editOther" size="mini">确 定</el-button>
  </div>
</div>
</template>

<script>
import otherTable from './otherSetPageTable'
export default {
  props: {
    innerVisible: Boolean
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      }
    }
  },
  components: {
    otherTable
  },
  data() {
    return {
      areaColList: ['clutterId','clutter','rSRPOffset'],
      buildColList: ['minHeight','maxHeight','penetrationLoss','linearLoss'],
      buildUpColList: ['floorHeight', 'floor', 'expectOutdoor', 'expectOutline', 'expectInside', 'minOutdoor', 'maxOutdoor', 'minIndoor', 'maxIndoor'],
      areaTableHeader: [
        {
          prop: 'clutterId',
          label: '地貌id',
          type: 'number'
        },{
          prop: 'clutter',
          label: '地貌名称',
          type: 'text'
        },{
          prop: 'rSRPOffset',
          label: '校正值',
          type: 'number'
        }
      ], 
      buildTableHeader: [
        {
          prop: 'minHeight',
          label: '起始高度',
          type: 'number'
        },{
          prop: 'maxHeight',
          label: '终止高度',
          type: 'number'
        },{
          prop: 'penetrationLoss',
          label: '穿透损耗',
          type: 'number'
        },{
          prop: 'linearLoss',
          label: '线性损耗',
          type: 'number'
        }
      ], 
      // 地貌校正表头
      areaTabParams: [], // 地貌校正表格内容
      buildTabParams: [], // 地貌校正表格内容
      buildingAdujst: [],
      areaAddForm: {
        clutterId: '',
        clutter: '',
        rSRPOffset: '',
        clutterIdisseen: false,
        clutterisseen: false,
        rSRPOffsetisseen: false,
      },
      buildAddForm: {
        minHeight: '',
        maxHeight: '',
        penetrationLoss: '',
        linearLoss: '',
        minHeightisseen: false,
        maxHeightisseen: false,
        penetrationLossisseen: false,
        linearLossisseen: false,
      },
      engineParam:{ // 其他设置
        buildingCorrect:{ 
          contour:'',  // 校正值1
          inside: ''  // 校正值2
        }
      },
      saveParmas: { 
        buildingCorrect:{ 
          contour:'',  
          inside: ''  
        },
        clutterCorrect: [],
        buildingHeigthOffset: [],
        buildingAdujst: [],
        upfilelist: []
      },
      upfilelist: []
    }
  },
  methods: {
    buildUpRemove(file, filelist) {
      // 移除列表
      this.upfilelist = filelist;
      this.buildingAdujst = [];
    },
    buildUploadchange(file,filelist) {
      var $this = this;
      var col = $this.buildUpColList;
      var readerFile = new FileReader();
      $this.buildingAdujst = [];
      /**
       * 当 FileReader 读取文件的方式为  
       * readAsArrayBuffer, readAsBinaryString, readAsDataURL 或者 readAsText 的时候，
       * 会触发一个 load 事件。
       */
      readerFile.onload = function(evt) {
        let resDate = evt.target.result;
        let fileDate = resDate ? resDate.split(/\n+/):[];
        fileDate.forEach((val,index) => {
          if(index !== 0) {
            let itemDate = val.replace(/\s*/g,'').split(',');
            let fileJson = {};
            if(itemDate.length > 0 && $this.checkArray(itemDate)) {
              itemDate.forEach((ival, j) => {
                fileJson[col[j]] = ival;
              })
              $this.buildingAdujst.push(fileJson)     
            }
          }
        })
        $this.upfilelist = filelist;
      }
      readerFile.readAsText(file.raw, 'gbk');
    },
    checkArray(arr) {
      if(arr.length === 1) {
        if(arr[0] === '') {
          return false;
        }
      } else {
        return true;
      }
    },
    closeAddForm(title,json) {
      // 关闭添加弹层 清空form表单内容
      if(title === '地貌校正') {
        this.areaAddForm = {
          clutterId: '',
          clutter: '',
          rSRPOffset: '',
          clutterIdisseen: false,
          clutterisseen: false,
          rSRPOffsetisseen: false,
        };
      } else {
        // 建筑物
        this.buildAddForm =  {
          minHeight: '',
          maxHeight: '',
          penetrationLoss: '',
          linearLoss: '',
          minHeightisseen: false,
          maxHeightisseen: false,
          penetrationLossisseen: false,
          linearLossisseen: false,
        };
      }
    },
    otherTabNull(title) {
      if(title === '地貌校正') {
        this.areaTabParams = [];
      } else {
        // 建筑物
        this.buildTabParams = [];
      }
    },
    tabPush(title,data) {
      if(title === '地貌校正') {
        this.areaTabParams.push(data);  
      } else {
        // 建筑物
        this.buildTabParams.push(data);  
      }
    },
    otherDelItem(title, ids) {
      if(title === '地貌校正') {
        ids.forEach(val => {
          this.areaTabParams.map((v, i)=> {
            if(ids.indexOf(v.isseen) !== -1) {
              this.areaTabParams.splice(i,1)
            }
          });
        })
      } else {
        // 建筑物
        ids.forEach(val => {
          this.buildTabParams.map((v, i)=> {
            if(ids.indexOf(v.isseen) !== -1) {
              this.buildTabParams.splice(i,1)
            }
          });
        });  
      }; 
    },
    closeOther() {
      this.$emit('othersetVisibleClose');
      const {contour, inside} = this.saveParmas.buildingCorrect;
      const filearr = this.saveParmas.upfilelist;
      this.areaTabParams = JSON.parse(JSON.stringify(this.saveParmas.clutterCorrect));
      this.buildTabParams = JSON.parse(JSON.stringify(this.saveParmas.buildingHeigthOffset));
      this.buildingAdujst = JSON.parse(JSON.stringify(this.saveParmas.buildingAdujst));
      this.upfilelist = filearr.length === 0 ? [] : JSON.parse(JSON.stringify(filearr));
      this.engineParam.buildingCorrect.contour = contour;
      this.engineParam.buildingCorrect.inside = inside;
    },
    setArray(arr) {
      let mark = true;
      arr.forEach(val => {
        if(Object.keys(val).map(key => val[key] === '' ? false : true).indexOf(false) !== -1) {
          mark = false;
        }
      })
      return mark;
    },
    editOther() {
      // 修改
      var params = {...this.engineParam};
      var saparmas = {...this.engineParam};
      const {contour, inside} = this.engineParam.buildingCorrect;
      saparmas.clutterCorrect = [...this.areaTabParams];
      saparmas.buildingHeigthOffset = [...this.buildTabParams];
      saparmas.buildingAdujst = [...this.buildingAdujst];
      saparmas.upfilelist = [...this.upfilelist];
      const creplace = contour.replace(/\s*/g,'');
      const inplace = inside.replace(/\s*/g,'');
      if((creplace !== '' && inplace === '')|| (creplace === '' && inplace !== '')) {
        this.$message.warning('请填写建筑物校正的两个值~')
        return;            
      };
      if(contour === '' && inside === '') {
        params.buildingCorrect = null;
      };
      params.clutterCorrect = this.areaTabParams.length === 0 ? null : JSON.parse(JSON.stringify(this.areaTabParams));
      params.buildingHeigthOffset = this.buildTabParams.length === 0 ? null : JSON.parse(JSON.stringify(this.buildTabParams));
      params.buildingAdujst = this.buildingAdujst.length === 0 ? null : this.buildingAdujst;
      if(this.setArray(this.areaTabParams)) {
        if(this.areaTabParams.length !== 0) {
          params.clutterCorrect = JSON.parse(JSON.stringify(this.areaTabParams))
          params.clutterCorrect.forEach(val => {
            Object.keys(val).map(key => key.indexOf('isseen') !== -1 ? delete val[key] : '')
          });
        }
      } else {
        this.$message.error('地貌校正内容有为空数据，请更改之后进行修改');
        return;
      };
      if(this.setArray(this.buildTabParams)) {
        if(this.buildTabParams.length !== 0) {
          params.buildingHeigthOffset = JSON.parse(JSON.stringify(this.buildTabParams))
          params.buildingHeigthOffset.forEach(val => {
            Object.keys(val).map(key => key.indexOf('isseen') !== -1 ? delete val[key] : '')
          });
        }
      } else {
        this.$message.error('建筑物损耗设置内容有为空数据，请更改之后进行修改');
        return;
      };
      if(!this.setArray(this.buildingAdujst)) {
        this.$message.error('建筑物楼层设置内容有为空数据，请更改之后进行修改');
        return;
      }
      this.$emit('otherDialogAdd',params);
      this.$emit('othersetVisibleClose',params);
      this.saveParmas = JSON.parse(JSON.stringify(saparmas));
    }
  }
}
</script>

<style scoped>
 /* 其他设置 */
  .otherpage>>>.el-dialog__title {
    font-size: 14px;
  }
  .otherpage>>>.el-dialog__header {
    padding: 14px 0px 10px;
    border-bottom: 1px solid #eee;
    margin: 0 15px;
  }
  .otherpage .outerpage_tiptile {
    padding-left: 10px;
    font-size: 12px;
    color: #616060;
    position: relative;
  }
  .otherpage .outerpage_tiptile::before {
    content: '';
    position: absolute;
    height: 13px;
    width: 2px;
    background-color: #409EFF;
    left: 4px;
    top: 2px;
  }
  .otherpage .tipform {
    margin: 0 20px;
  }
  .otherpage .fr {
    float: right;
    margin-right: 20px;
  }
  .mr-30 {
    margin-right: 30px;
  }
  .outerpage_table {
    margin: 20px;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .otherpage .footer {
    text-align: right;
    margin: 10px;
    margin-top: 26px;
  }
  .outerpage_btn {
    margin-top: 10px;
    padding-left: 20px;
  }
  .build_up {
    margin: 10px;
    padding-left: 10px;
    position: relative;
  }
  .build_up .build_up_upload {
    display: inline-block;
  }
  .build_up .e-move-tip {
    position: absolute;
    top: 6px;
    left: 86px;
  }
  /* 提示 */
  .e-move-tip {
    padding-left: 10px;
    font-size: 12px;
    color: #aeaeae;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    position: relative;
    top: 2px;
  }
  .e-move-tip i {
    color: #eaa446;
    font-size: 12px;
    padding-right: 4px;
    position: relative;
    top: 0px;
  }
  .nothing_dialog>>>.el-dialog__title {
    font-size: 14px;
  }
  .nothing_dialog>>>.el-dialog__header {
    padding: 14px 0px 10px;
    border-bottom: 1px solid #eee;
    margin: 0 15px;
  }
  .nothing_dialog>>>.el-form-item {
    margin-bottom: 2px;
  }
  .nothing_dialog>>>.el-dialog__headerbtn {
    top: 14px;
    right: 12px;
  }
  .redtip {
    color: red;
    position: relative;
    left: -8px;
    top: -1px;
  }
</style>