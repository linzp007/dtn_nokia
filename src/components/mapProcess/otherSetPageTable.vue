
<template>
  <div class=''>
    <div class="outerpage_btn">
      <el-upload
        action
        accept=".csv,.CSV"
        :auto-upload="false"
        :on-change="handlechange"
        :file-list="fileList"
        :limit="1"
        style="float:left"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-download"
          plain
        >导入</el-button>
        <span slot="file"></span>
      </el-upload>
      <span class="e-move-tip">
        <i class="el-icon-warning-outline"></i>只能选择.csv文件
      </span>
      <div class="fr clearfix">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="addtabelDialog = true"
        >添加</el-button>
        <el-button
          type="danger"
          plain
          size="mini"
          @click="otherItemDel"
        >删除</el-button>
      </div>
    </div>
    <div class="outerpage_table">
      <el-table
        :data="otherTabParams"
        @cell-dblclick="doubleClick"
        @selection-change="selTabItem"
        max-height="200"
        border
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableHeader"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          :min-width="item.prop == 'clutter'? '' : 25"
        >
          <template slot-scope="scope">
            <el-input
              :type="item.type"
              v-if="scope.row[item.prop + 'isseen']"
              v-model="scope.row[item.prop]"
              @blur="loseFocus(scope.row, item.prop)"
              @keyup.enter.native="loseFocus(scope.row, item.prop)"
              size="mini"
              v-focus
            >
            </el-input>
            <span
              style="color: #409eff;"
              v-else
            >{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加地貌校正 -->
    <el-dialog
      width="30%"
      :title="tabDialogTitle"
      class="nothing_dialog"
      :visible.sync="addtabelDialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :close="closeAddDialog"
      append-to-body
    >
      <el-form
        label-width="80px"
        :model="addForm"
        style="margin-right: 20px"
      >
        <el-form-item
          :label="addi.label"
          v-for="(addi, i) in tableHeader"
          :key="i"
        >
          <span class="redtip">*</span>
          <el-input
            :type="addi.type"
            v-model="addForm[addi.prop]"
            :placeholder="`请输入${addi.label}`"
            size="small"
            style="width: 70%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          @click="closeAddDialog"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="addOtherTab"
          size="mini"
        >添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        inserted: function (el) {
          el.querySelector("input").focus();
        }
      }
    },
    props: {
      colList: Array,
      tabDialogTitle: String,
      tableHeader: Array,
      tabParams: Array,
      addForm: Object
    },
    data() {
        return {
          fileList: [],
          selids: [],
          addtabelDialog: false,
          otherTabParams: this.tabParams
        }
    },
    methods: {
      addOtherTab() {
        // 添加表格内容
        if(this.tabDialogTitle === '地貌校正') {
          let {clutterId, clutter, rSRPOffset} = this.addForm;
          if(clutterId.replace(/\s*/g,'') === '' ||  clutter.replace(/\s*/g,'') === '' ||  rSRPOffset.replace(/\s*/g,'') === '') {
            this.$message.warning('请填写必填值再进行添加');
            return;
          }
        } 
        if(this.tabDialogTitle === '建筑物损耗设置') {
          let {minHeight, maxHeight, penetrationLoss, linearLoss} = this.addForm;
          if(minHeight.replace(/\s*/g,'') === '' ||  maxHeight.replace(/\s*/g,'') === '' ||  penetrationLoss.replace(/\s*/g,'') === '' ||  linearLoss.replace(/\s*/g,'') === '') {
            this.$message.warning('请填写必填值再进行添加');
            return;
          }
        }
        this.addForm.isseen = this.otherTabParams.length + 1;
        this.$emit('tabPush', this.tabDialogTitle,this.addForm);  
        this.closeAddDialog();
      },
      closeAddDialog() {
        // 关闭添加弹层
        this.addtabelDialog = false;
        this.$emit('closeAddForm', this.tabDialogTitle); 
      }, 
      doubleClick(row, column) {
        // 双击修改
        row[column.property + "isseen"] = true;
      },
      loseFocus(row, prop) {
        // 失焦处理
        if(row[prop].replace(/\s*/g,'') === '') {
          this.$message.error('修改值不能为空，请输入相应的值');
          return;
        }
        row[prop + "isseen"] = false;
      },
      selTabItem(arr) {
      // 选择
        this.selids = [];
        arr.forEach(val => {
          this.selids.push(val.isseen);
        })
      },
      otherItemDel() {
        // 删除
        if(this.selids.length === 0) {
          this.$message.warning('请选择表格内容进行删除')
          return;
        }
        this.$emit('otherDelItem', this.tabDialogTitle, this.selids)
      },
      handlechange(file) {
        // 文件上传
        var $this = this;
        var col = $this.colList;
        var readerFile = new FileReader();
        $this.$emit('otherTabNull', $this.tabDialogTitle);
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
                  fileJson[col[j]+'isseen'] = false;
                })
                fileJson['isseen'] = index;
                $this.$emit('tabPush', $this.tabDialogTitle,fileJson);         
              }
            }
          })
          $this.fileList = [];
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
      }
    },
    watch: {
      tabParams: {
        handler: function(newval, oldVal) {
          this.otherTabParams = [...newval]
        },
        immediate: true
      }
    }
} 
</script>
<style scoped>
  .otherpage .outerpage_tiptile {
    padding-left: 10px;
    font-size: 12px;
    color: #aeaeae;
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
    margin-bottom: 5px;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .otherpage .footer {
    text-align: right;
    margin: 10px;
  }
  .outerpage_btn {
    margin-top: 10px;
    padding-left: 20px;
  }
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
  .redtip {
    color: red;
    position: relative;
    left: -8px;
    top: -1px;
  }
</style>
