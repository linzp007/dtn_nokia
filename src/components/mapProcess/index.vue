<template class="mapOperator">
    <div>
        <!-- <div> -->
        <!-- <el-row > -->
        <!-- <el-button @click="addCellFun" >新增小区</el-button> -->
        <!-- <el-button @click="moveCellFun">移动基站</el-button> -->
        <!-- <el-button @click="importFun">导入</el-button> -->
        <!-- <el-button @click="exportFun">导出</el-button> -->
        <!-- <el-button @click="showDataFun">数据展示</el-button> -->
        <!-- </el-row> -->
        <!-- </div> -->
        <div>
            <addCell v-show="addCellShow" :dialogVisible="addCellShow" :cellParam="cellParam" />
            <moveCell v-show="moveCellShow" />
            <importPage v-show="importShow" :dialogVisible="importShow"> </importPage>
            <exportPage v-show="exportShow" :dialogVisible="exportShow"> </exportPage>
            <showImportData v-show="showImportDataShow" :dialogVisible="showImportDataShow"> </showImportData>
            <cellDetail> </cellDetail>
            <complainCellDetail></complainCellDetail>
        </div>
    </div>
</template>

<script>
import addCell from './addCell'
import moveCell from './moveCell'
import importPage from './importPage'
import cellDetail from './cellDetail'
import exportPage from './exportPage'
import showImportData from './showImportData'
import complainCellDetail from './complainCellDetail'
export default {
    components: { addCell, moveCell, importPage, cellDetail, exportPage, showImportData, complainCellDetail },
    data() {
        return {
            cellParam: {},
            addCellShow: false,
            moveCellShow: false,
            importShow: false,
            exportShow: false,
            showImportDataShow: false,
            cellDetailShow: false
        }
    },
    methods: {
        addCellFun(paramModel) {
            let polygonIds = paramModel.polygonIds
            let jobIds = paramModel.jobIds
            let chkPolygons = paramModel.chkPolygons
            if (polygonIds.length == 0) {
                this.$message({
                    message: '请勾选一个区域，在进行新增小区!',
                    type: 'warning'
                })
                return
            }
            if (polygonIds.length > 1) {
                this.$message({
                    message: '添加小区时,不能勾选多个区域!',
                    type: 'warning'
                })
                return
            }
            this.cellParam = {
                jobId: jobIds[0],
                provinceCode: chkPolygons[0].province,
                cityCode: chkPolygons[0].city,
                province: chkPolygons[0].provinceName,
                city: chkPolygons[0].cityName
            }
            this.$parent.$refs.dtnzdMap.contentWindow.setStationDefaultInfo(0)

            this.addCellShow = false
            this.moveCellShow = false
            this.importShow = false
            this.exportShow = false
            this.showImportDataShow = false
        },
        converPolygon(paramModel) {
            let jobIds = paramModel.jobIds
            if (jobIds.length == 0) {
                this.$message({
                    message: '请勾选区域!',
                    type: 'warning'
                })
                return
            }

             this.$parent.$refs.dtnzdMap.contentWindow.showConverPolygons(jobIds)
        },
        moveCellFun() {
            this.addCellShow = false
            this.moveCellShow = false
            this.importShow = false
            this.exportShow = false
            this.showImportDataShow = false
        },
        importFun() {
            this.addCellShow = false
            this.moveCellShow = false
            this.importShow = true
            this.exportShow = false
            this.showImportDataShow = false
        },
        exportFun() {
            this.addCellShow = false
            this.moveCellShow = false
            this.importShow = false
            this.exportShow = true
            this.showImportDataShow = false
        },
        showDataFun() {
            this.addCellShow = false
            this.moveCellShow = false
            this.importShow = false
            this.exportShow = false
            this.showImportDataShow = true
        }
    }
}
</script>
.mapOperator {
    width: 104px;
    position: absolute;
    top: 3px;
    left: 567px;
    opacity: 0.9;
}
<style scoped></style>
