<template>
    <div >
          <el-upload action="''" :show-file-list="false" accept :before-upload="onMrDataImport">
                        <el-button size="mini" type="primary" plain style="width: 120px;margin-top: 15px">导入 MR 数据</el-button>
                         <!-- <div slot="tip" class="el-upload__tip">一次只能上传一个MR数据excel文件，且不超过200M </div> -->
                    </el-upload>     
              <el-upload action="''" :show-file-list="false" accept :before-upload="onDtestImport">
                        <el-button  size="mini" type="primary" plain style="width: 120px;margin-top: 15px" >导入路测数据</el-button>
                         <!-- <div slot="tip" class="el-upload__tip">一次只能上传一个路测数据excel文件，且不超过200M </div> -->
                    </el-upload>
            <el-upload action="''" :show-file-list="false" accept :before-upload="onComplaintDataImport">
                        <el-button  size="mini" type="primary" plain style="width: 120px;margin-top: 15px">导入投诉数据</el-button>
                         <!-- <div slot="tip" class="el-upload__tip">一次只能上传一个投诉数据excel文件，且不超过200M </div> -->
                    </el-upload>
                     <div slot="tip" class="el-upload__tip" style="width: 120px;margin-top: 15px">上传的MR、路测和投诉数据excel文件不超过200M </div>
    </div>
</template>

<script>
// import { roadTestImport, complaintDataImport, mrDataImport } from '@/components/mapProcess/api/importPageApi.js'
export default {
    components: {},
    props: {
        // dialogVisible: Boolean
    },
    created() {},
    data() {
        return {
            // labelPosition: 'right',
        }
    },
    methods: {
        confirm() {
            //更改父页面的状态
            // this.$parent.importShow = false
        },
        cancel() {
            //更改父页面的状态
            // this.$parent.importShow = false
            //  this.$emit('closepop'); //通知父组件改变。
        },
        handleClose() {
            // this.$parent.importShow = false
        },
        onMrDataImport(file) {
            // 导入MR数据
            let importUrl = '/android/mrDataImport';
            this.importDataInterface(file,importUrl);
        },
        onDtestImport(file) {
            //路测数据导入 // 
            console.log("this.httpUrl:"+this.httpUrl);
            let importUrl = '/android/roadTestImport';
            this.importDataInterface(file,importUrl);
           
        },
        onComplaintDataImport(file) {
            //导入投诉数据
            let importUrl = '/android/complaintDataImport';
            this.importDataInterface(file,importUrl);
            
        },
        importDataInterface(file,importUrl){           
            let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
            // const extension2 = testmsg === "xlsx";          
            if (extension == 'xlsx') {
                // add loading progress
                const loading = this.$loading({
                    lock: true,
                    text: '导入中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                // add loading progress end
                let param = new FormData()
                param.append('file', file)
                debugger
                // 导入后台接口调用
                this.$axios({
                    method: 'post',
                    url: this.httpUrl + importUrl,
                    data: param
                })
                    .then(res => {
                        if (res.status === 200) {
                            loading.close() //close loading progress
                            this.$message({
                                type: 'success',
                                message: '上传成功！',
                                center: true,
                                duration: 30000,
                                showClose: true
                            })                            
                        }
                    })
                    .catch(err => {
                        loading.close() //close loading progress
                        this.$message({
                            type: 'error',
                            message: err.response.data.error,
                            center: true,
                            duration: 30000,
                            showClose: true
                        })
                    })
            } else {
                return this.$message({
                    message: '上传文件只能是xlsx格式!',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            }
        }
    }
}
</script>

<style scoped></style>
