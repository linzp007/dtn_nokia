<template>
    <div class="upload-demo">
        <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"> -->
            <el-button size="mini" type="primary" plain style="width: 130px;margin-top: 15px;margin-left: 0;">导出MR数据</el-button>
            <el-button  size="mini" type="primary" plain style="width: 130px;margin-top: 15px;margin-left: 0;">导出路测数据</el-button>
            <el-button  size="mini" type="primary" plain style="width: 130px;margin-top: 15px;margin-left: 0;">导出投诉数据</el-button>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">关 闭</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span> -->
        <!-- </el-dialog> -->
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        // dialogVisible: Boolean
    },
    created() {},
    data() {
        return {}
    },
    methods: {
        confirm() {
            //更改父页面的状态
            // this.$parent.exportShow = false
        },
        cancel() {
            // this.$parent.exportShow = false
            //   this.dialogVisible = false;
        },
        handleClose() {
            // this.$parent.exportShow = false
        }
    }
}
</script>

<style scoped></style>