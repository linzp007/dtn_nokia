<template>
    <div>
        <el-dialog title="投诉小区详情" :visible.sync="dialogVisible" width="150">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="4" class="font">小区名称</el-col>
                <el-col :span="8">{{ cellData.coverName }}</el-col>
                 <el-col :span="4" class="font">小区CGI</el-col>
                <el-col :span="8">{{ cellData.siteName }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="4" class="font">经度</el-col>
                <el-col :span="8">{{ cellData.lng }}</el-col>
                <el-col :span="4" class="font">纬度</el-col>
                <el-col :span="8">{{ cellData.lat }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>                
                <el-col :span="4" class="font">地市</el-col>
                <el-col :span="8">{{ cellData.city }}</el-col>
                <el-col :span="4" class="font">县市</el-col>
                <el-col :span="8">{{ cellData.town }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <!-- <el-row>
                <el-col :span="4" class="font">机械下倾角</el-col>
                <el-col :span="8">{{ cellData.mecDow }}</el-col>
                <el-col :span="4" class="font">电子下倾角</el-col>
                <el-col :span="8">{{ cellData.addiEleDow }}</el-col>
            </el-row>
            <el-divider></el-divider> -->
            <el-row>
                <el-col :span="4" class="font">月投诉量汇总</el-col>
                <el-col :span="8">{{ cellData.monthComplaintSum }}</el-col>
            </el-row>
            <el-divider></el-divider>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            dialogVisible:false,
            cellData: {
                cgi:'',  // 小区CGI
                coverName: '', // 小区名称 cellName
                monthComplaintSum:0, // 月投诉量汇总
                lng: '',
                lat: '',
                town: '',  // 县市
                city: '',  // 地市
                // azimuth: '',
                // mecDow: '',
                // addiEleDow: '',
                // height: ''
            }
        }
    },
    created() {
        let that = this
        window['showComplainCellDetail'] = function showCellDetail(model) {
            that.showDialog(model)
        }
    },
    methods: {
        showDialog(model) {
            this.cellData = model
            this.dialogVisible = true
        },
        cancelCU() {}
    }
}
</script>
<style scoped>
.font{
    font-weight: bold;
}
</style>