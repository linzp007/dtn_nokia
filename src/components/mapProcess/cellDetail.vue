<template>
    <div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="150">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="4" class="font">小区名称</el-col>
                <el-col :span="8">{{ cellData.cellName }}</el-col>
                 <el-col :span="4" class="font">基站类型</el-col>
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
                <el-col :span="4" class="font">频段</el-col>
                <el-col :span="8">{{ cellData.freqBand }}</el-col>
                <el-col :span="4" class="font">天线方位角</el-col>
                <el-col :span="8">{{ cellData.azimuth }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="4" class="font">机械下倾角</el-col>
                <el-col :span="8">{{ cellData.mecDow }}</el-col>
                <el-col :span="4" class="font">电子下倾角</el-col>
                <el-col :span="8">{{ cellData.addiEleDow }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="4" class="font">天线高度</el-col>
                <el-col :span="8">{{ cellData.height }}</el-col>
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
                cellName: '',
                lng: '',
                lat: '',
                siteName: '',
                freqBand: '',
                azimuth: '',
                mecDow: '',
                addiEleDow: '',
                height: ''
            }
        }
    },
    created() {
        let that = this
        window['showCellDetail'] = function showCellDetail(model) {
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