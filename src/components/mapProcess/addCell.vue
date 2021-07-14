<template>
    <div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="150" :before-close="handleClose">
            <!-- 卡片视图 -->
            <el-card>
                <!-- 提示区域 -->
                <!-- 表单区域，这段<:model="form" :rules="rules" ref="form">不能被改变！！！ -->
                <el-form :model="cellForm" class="createStyle" ref="cellForm" label-width="80px" :rules="rules">
                    <div class="formCreate">
                        <el-form-item label="基站名称" prop="basStaName">
                            <el-input v-model="cellForm.basStaName" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="小区名称" prop="areaName">
                            <el-input v-model="cellForm.areaName" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formCreate">
                        <el-form-item label="经度" prop="longitude">
                            <el-input v-model="cellForm.longitude" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="纬度" prop="latitude">
                            <el-input v-model="cellForm.latitude" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formCreate">
                        <el-form-item label="CGI" prop="cgi">
                            <el-input v-model="cellForm.cgi" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="天线挂高" prop="antennaHeight">
                            <el-input v-model="cellForm.antennaHeight" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formCreate">
                        <el-form-item label="方位角" prop="directionAngle">
                            <el-input v-model="cellForm.directionAngle" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="频点" prop="channelNumber">
                            <el-input v-model="cellForm.channelNumber" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                    </div>
                    <div class="formCreate">
                        <el-form-item label="频带" prop="freqBand">
                            <el-input v-model="cellForm.freqBand" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item label="基站类型" prop="stationType">
                            <el-select v-model="cellForm.stationType" placeholder="请选择基站类型" style="width: 93%" size="mini">
                                <el-option label="室分" value="0"></el-option>
                                <el-option label="四角塔" value="1"></el-option>
                                <el-option label="三角塔" value="2"></el-option>
                                <el-option label="三管塔" value="3"></el-option>
                                <el-option label="桅杆" value="4"></el-option>
                                <el-option label="配重架" value="5"></el-option>
                                <el-option label="美化灯杆" value="6"></el-option>
                                <el-option label="美化方柱" value="7"></el-option>
                                <el-option label="美化射灯" value="8"></el-option>
                                <el-option label="一体化机房" value="9"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="formCreate">
                        <el-form-item label="小区类型" prop="cellType">
                            <el-input v-model="cellForm.cellType" style="width: 93%" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item> </el-form-item>
                    </div>
                </el-form>

                <!-- 底部区域 -->
                <el-row type="flex" justify="center" :gutter="100">
                    <el-col :span="1" :pull="1">
                        <el-button size="medium" @click="cancelCU">取 消</el-button>
                    </el-col>
                    <el-col :span="1" :push="0">
                        <el-button size="medium" type="primary" @click="submitCU">保 存</el-button>
                    </el-col>
                </el-row>
            </el-card>
        </el-dialog>
    </div>
</template>
<script>
import { getAntennaNameList } from '@/components/mapProcess/api/stationApi.js'
import { getById, update, delCellByIdApi, checkCellData, save } from '@/components/mapProcess/api/cellOperator.js'
import { cellModel } from '@/components/mapProcess/default/cell.js'
export default {
    components: {},
    props: {
        dialogVisible: Boolean,
        cellParam: {}
    },
    computed: {
        userInfo() {
            return {
                loginId: sessionStorage.getItem('user'),
                userName: sessionStorage.getItem('userName')
            }
        }
    },
    data() {
        return {
            cellDataModel: cellModel,
            cellForm: {
                basStaName: cellModel.basStaName,
                areaName: cellModel.basStaName,
                longitude: '',
                latitude: '',
                cgi: cellModel.cgi,
                antennaHeight: cellModel.antennaHeight,
                directionAngle: cellModel.directionAngle,
                channelNumber: cellModel.channelNumber,
                freqBand: cellModel.freqBand,
                stationType: cellModel.stationType,
                cellType: cellModel.cellType
            },
            rules: {
                basStaName: [{ required: true, message: '不能为空', trigger: 'change' }],
                areaName: [{ required: true, message: '不能为空', trigger: 'change' }],
                longitude: [{ required: true, message: '不能为空', trigger: 'change' }],
                latitude: [{ required: true, message: '不能为空', trigger: 'change' }],
                antennaHeight: [{ required: true, message: '不能为空', trigger: 'change' }],
                directionAngle: [{ required: true, message: '不能为空', trigger: 'change' }],
                channelNumber: [{ required: true, message: '不能为空', trigger: 'change' }],
                freqBand: [{ required: true, message: '不能为空', trigger: 'change' }],
                stationType: [{ required: true, message: '不能为空', trigger: 'change' }],
                cellType: [{ required: true, message: '不能为空', trigger: 'change' }],
                cgi: [{ required: true, message: '不能为空', trigger: 'change' }]
            }
        }
    },
    created() {
        let that = this
        window['addCell'] = function addCell(model) {
            that.showDialog(model)
        }
    },
    methods: {
        showDialog(model) {
            this.cellForm.longitude = model.lng
            this.cellForm.latitude = model.lat

            this.$parent.addCellShow = true
        },
        submitCU(model) {
            this.$refs['cellForm'].validate(valid => {
                if (valid) {
                    this.validCellData()
                }
            })
        },
        setCellModel(basStaName, areaName, longitude, latitude, cgi, antennaHeight, directionAngle, channelNumber, freqBand, stationType, cellType, loginId, userName, taskId, provinceCode, cityCode, province, city) {
            this.cellDataModel.basStaName = basStaName
            this.cellDataModel.areaName = areaName
            this.cellDataModel.longitude = longitude
            this.cellDataModel.latitude = latitude
            this.cellDataModel.cgi = cgi
            this.cellDataModel.antennaHeight = antennaHeight
            this.cellDataModel.directionAngle = directionAngle
            this.cellDataModel.channelNumber = channelNumber
            this.cellDataModel.freqBand = freqBand
            this.cellDataModel.stationType = stationType
            this.cellDataModel.cellType = cellType
            this.cellDataModel.loginId = loginId
            this.cellDataModel.userName = userName
            this.cellDataModel.taskId = taskId
            this.cellDataModel.provinceCode = provinceCode
            this.cellDataModel.cityCode = cityCode
            this.cellDataModel.province = province
            this.cellDataModel.city = city
        },
        getCellModel() {
            return this.cellDataModel
        },
        validCellData() {
            let loginId = this.userInfo.loginId
            let userName = this.userInfo.userName
            let jobId = this.cellParam.jobId
            let provinceCode = this.cellParam.provinceCode
            let cityCode = this.cellParam.cityCode
            let province = this.cellParam.province
            let city = this.cellParam.city

            this.setCellModel(
                this.cellForm.basStaName,
                this.cellForm.areaName,
                this.cellForm.longitude,
                this.cellForm.latitude,
                this.cellForm.cgi,
                this.cellForm.antennaHeight,
                this.cellForm.directionAngle,
                this.cellForm.channelNumber,
                this.cellForm.freqBand,
                this.cellForm.stationType,
                this.cellForm.cellType,
                loginId,
                userName,
                jobId,
                provinceCode,
                cityCode,
                province,
                city
            )

            let models = [this.getCellModel()]

            
            checkCellData(models).then(res => {
                this.saveData(this.getCellModel())
            })
        },
        saveData(models) {
            console.log("save models:"+JSON.stringify(models))
            save(models).then(res => {
                this.showCell(res)
                this.$message.success('新增成功!')
            })
        },
        showCell(bsId) {
            let lng = this.cellForm.longitude
            let lat = this.cellForm.latitude
            let angle = this.cellForm.directionAngle
            //cellId 用bsId代替
            let cellId = bsId

            //显示小区
            this.$parent.$parent.$refs.dtnzdMap.contentWindow.setStationDefaultInfo(-1)
            this.$parent.$parent.$refs.dtnzdMap.contentWindow.showNewCell(cellId, lng, lat, angle, bsId)
            this.$parent.addCellShow = false
        },
        cancelCU() {
            this.$parent.$parent.$refs.dtnzdMap.contentWindow.setStationDefaultInfo(-1)
            this.$parent.addCellShow = false
        },
        handleClose() {
            this.$parent.$parent.$refs.dtnzdMap.contentWindow.setStationDefaultInfo(-1)
            this.$parent.addCellShow = false
        }
    }
}
</script>

<style scoped>
.createStyle {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
}
.createStyle :global(.el-form-item) {
    width: 100%;
    display: flex;
    justify-content: center;
}
.formCreate {
    display: flex;
    width: 100%;
    justify-content: space-around;
}
.formCreate :global(.el-form-item__content) {
    width: 70%;
    margin-left: 0px !important;
}
</style>
