<template>
    <div></div>
</template>

<script>
import { getById, update,updateBj, delCellByIdApi,getTempById } from '@/components/mapProcess/api/cellOperator.js'
export default {
    data() {
        return {}
    },
    computed: {
        userInfo() {
            return {
                loginId: sessionStorage.getItem('user'),
                userName: sessionStorage.getItem('userName')
            }
        }
    },
    created() {
        let that = this
        window['updateCell'] = function updateCell(model) {
            that.updateCell(model)
        }

        window['delCellById'] = function updateCell(model) {
            that.delCellConfirm(model)
        }

        window['getAlertMsg'] = function getAlertMsg(msg,isSuccess, duration) {
            let alertType = isSuccess?'success':'warning';
            that.alertMsg(msg, alertType, duration)
        }
    },
    methods: {
        async updateCell(model) {
            let bsId = model.bsId
            let cellDatas = await getTempById({
                bsId: bsId
            })
            // cellDatas[0].longitude = model.lng
            // cellDatas[0].latitude = model.lat
            // update(cellDatas[0]).then(res => {
            //     this.$message.success('移动成功!')
            // })
            cellDatas.longitude = model.lng
            cellDatas.latitude = model.lat
            updateBj(cellDatas).then(res => {
                this.$message.success('移动成功!')
            })
        },
        delCellConfirm(model) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.delCellById(model)
                })
                .catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        delCellById(model) {
            delCellByIdApi(model.bsId).then(res => {
                this.$parent.$parent.$refs.dtnzdMap.contentWindow.delCellFeature()
                this.$message.success('删除成功!')
            })
        },
        alertMsg(msg, msgType, duration) {
            if (!duration) duration = 1000
            this.$message({
                message: msg,
                type: msgType,
                duration: duration
            })
        },
    }
}
</script>

<style scoped></style>
