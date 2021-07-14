<template>
<!-- 多边形上传 -->
  <div class=''>
    <el-form :model="uploadform" class="createStyle" ref="uploadform" label-width="80px" :rules="upformrules">
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="uploadform.name" style="width: 50%" size="mini"></el-input>
      </el-form-item>
      <div style="display: flex;">
        <el-form-item label="省市" prop="province" >
          <el-select v-model="uploadform.province" @change="citySelChange" @clear="clearChange" placeholder="全国" size="mini" clearable>
            <el-option v-for="item in provinceitem" :key="`${item.arId}`" :value="`${item.arId}`" :label="item.admRegName"></el-option>
          </el-select>
          <!-- <el-select prop="city" v-model="uploadform.city" placeholder="地市" size="mini" clearable @change="priceSelChange">
            <el-option v-for="item in cityItem" :key="`${item.arId}`" :value="`${item.arId}`" :label="item.admRegName"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item prop="city"  class="cityform">
          <el-select v-model="uploadform.city" placeholder="地市" size="mini" clearable @change="priceSelChange" style="margin-left: 1%;width: 30%" >
            <el-option v-for="item in cityItem" :key="`${item.arId}`" :value="`${item.arId}`" :label="item.admRegName"></el-option>
          </el-select>
          <el-select v-model="uploadform.cityArea" placeholder="区县" size="mini" clearable class="dishi" style="margin-left: 1%;width: 30%" @change="selectArea">
              <el-option v-for="item in cityArea" :key="`${item.arId}`" :value="`${item.arId}`" :label="item.admRegName"></el-option>
          </el-select>
        </el-form-item>      
      </div>

      <el-form-item label="制式">
          <el-select
          v-model="uploadform.cellType"
          placeholder="请选择制式"
          size="mini"
          class="dishi"
          clearable
          @change="changeCell"
          style="width: 50%"
          >
              <el-option v-for="item in cellList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="文件上传">
        <el-upload 
          action
          :auto-upload="false"
          accept=".kml,.KML,.mif,.MIF"
          class="ply_upload"
          :on-change="beforeUpload"
          :file-list="fileList"
        >
          <el-button size="mini" type="primary" plain style="width: 120px; margin-top: 15px">选择区域文件</el-button>
          <span class="e-move-tip">
            <i class="el-icon-warning-outline"></i>只能选择.mif,.kml文件
          </span>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="deDilog" size="mini">取 消</el-button>
      <el-button type="primary" @click="polUpload" :loading="uploading" size="mini">上 传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    areID: String
  },
  data () {
    return {
      uploading: false,
      upformrules: {
        // 校验区域名称不为空
        name: [{ required: true, message: '不能为空', trigger: 'change' }],
        province: [{ required: true, message: '不能为空', trigger: 'change' }],
        city: [{ required: true, message: '不能为空', trigger: 'change' }],
      },
      uploadform: {
        //多边形绘制参数
        name: '',
        province: '', // 全国
        city: '', // 地市
        cityArea: '',
        cellType: ''
      },
      cityItem: [], // 选择 -地市
      provinceitem: [], // 选择 -省
      fileList: [], // 文件列表
      cityArea: [],
      arId1: '',
      arId2: '',
      cellList: ['4G', '5G']
    }
  },
  mounted () {
    var $this = this;
    const CITY = JSON.parse(localStorage.getItem('city'));
    if(CITY.length !== 0) {
      $this.provinceitem = CITY
    } else {
      $this.$axios({
        method: 'get',
        url: this.httpUrl + '/adminiRegionCode?parentId=1'
      }).then(res => {
        $this.provinceitem = [...res.data] //赋值省数据
      });
    }
    $this.citySelChange($this.areID)
  },
  methods: {
    clearChange() {
      // 清除
    },
    deDilog() {
      // 关闭弹层
      this.$emit('polUpVisibleClose');
      this.clearForm();
    },
    citySelChange(val) {
      // 省选择 给地市赋值
      // this.uploadform.province = val
      // this.cityItem = []
      // this.uploadform.city = ''
      // this.$axios({
      //   method: 'get',
      //   url: this.httpUrl + `/adminiRegionCode?parentId=${val}`
      // }).then(res => {
      //   // 给地市赋值
      //   this.cityItem = res.data;
      // })

      this.uploadform.province = val
      this.cityItem = []
      this.uploadform.city = ''
      if (val) {
          this.$axios({
              method: 'get',
              url: this.httpUrl + `/adminiRegionCode?parentId=${val}`
          }).then(res => {
              console.log('pro====>', res)
              this.cityItem = res.data
              this.arId1 = res.data.arId ? res.data.arId : ''
              this.arId2 = res.data.arID ? res.data.arId : ''
          })
      } else if (!val) {
          this.proCity = []
          this.cityArea = []
          this.arId1 = ''
          this.arId2 = ''
      }
    },
    priceSelChange(val) {
      this.uploadform.city = val
      if (val) {
        this.$axios({
          method: 'get',
          url: this.httpUrl + `/adminiRegionCode?parentId=${val}`
        }).then(res => {
          console.log('city====>', res)
          this.cityArea = res.data
          this.arId2 = res.data.arId ? res.data.arId : ''
        })
      } else if (!val) {
        this.cityArea = []
        this.arId2 = ''
      }
    },
    beforeUpload(file, filelist) {
      // 选择文件
      this.fileList = [];
      this.fileList.push(file);
    },
    clearForm(){
      // 清除表单
      this.fileList = [],
      this.uploadform = {
        name: '',
        province: '', 
        city: '',
        cityArea: ''
      }
    },
    polUpload() {
      // 上传 提交
      var $this = this;
      $this.$refs['uploadform'].validate(valid => {
        if(valid) {
          if($this.fileList.length === 0) {
            $this.$message.warning('请选择文件进行上传~')
            return;
          };
          let fileParam = new FormData();
          let { name, province, city, cityArea, cellType } = $this.uploadform;
          const filename = $this.fileList[0].name.substring($this.fileList[0].name.lastIndexOf('.') + 1);
          let templateType = filename == 'kml' || filename == 'KML' ? 1 : 0;
          let getParams = `menuType=0&templateType=${templateType}&name=${name}&province=${province}&city=${city}&townCode=${cityArea}&taskType=${cellType == '4G'?'LTE': 'NR'}`;
          fileParam.append('file', $this.fileList[0].raw);
          $this.uploading = true;
          $this.$axios({
            method: 'post',
            url: $this.httpUrl + `/tasks/templateImport?${getParams}`,
            data: fileParam
          })
          .then(res => {
            if (res.status === 200) {
              $this.$message.success('上传成功')
              $this.$emit('fetch')
              $this.$emit('polUpVisibleClose')
              $this.uploading = false
              $this.clearForm()
            }
          })
          .catch(err => {
            $this.$message.error(err.response.data.error);
            $this.$emit('polUpVisibleClose');
            $this.$emit('fetch'); //上传失败，弹框关闭，刷新列表
            $this.clearForm()
          })           
        }
       
      })
    },

    selectArea(test) {
      console.log('sellect==town==>', this.uploadform, test)
    },

    changeCell(e) {
        console.log('celltype===>',e)
        this.cellType = e
    },
  }
}
</script>
<style scoped>
.footer {
  text-align: right;
  margin: 10px;
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
.ply_upload {
  position: relative;
  top: -9px;
}
.createStyle>>>.el-form-item__content{
  margin-bottom: 14px !important;
}
.cityform>>>.el-form-item__content {
  margin-left: 22px !important;
}
</style>
