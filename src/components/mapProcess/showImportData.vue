<template>
    <div>
        <el-dialog title="选择显示在地图上的数据" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
            <!-- <el-tabs v-model="activeName" @tab-click="handleClickOftabs" type="border-card">
                <el-tab-pane label="MR数据文件" name="mrdata">MR数据反反复复文件</el-tab-pane>
                <el-tab-pane label="路测数据文件" name="dtdata">路测数据文件</el-tab-pane>
                <el-tab-pane label="投诉数据文件" name="complaintdata">投诉数据文件</el-tab-pane>
            </el-tabs> -->
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
            <!-- 通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点.
                 需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。 -->
            <el-tree :data="treedata" show-checkbox check-on-click-node accordion node-key="id" ref="tree" :check-strictly="true" highlight-current :props="defaultProps" @node-click="handleTreeNodeClick" :filter-node-method="filterTreeNode" @check="setSelectedNode"> </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="resetChecked" plain>清空勾选</el-button>
                <el-button @click="cancel" plain>关 闭</el-button>
                <el-button type="primary" @click="confirm" plain>显 示</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dtComplaintMrFileList, getRoadTestListByFileName, getComplaintListByFileName, getMrListByFileName } from '@/components/mapProcess/api/showImportDataApi.js'
export default {
    components: {},
    props: {
        dialogVisible: Boolean
    },
    created() {
        // function getFileTrees(res, iTreenodeIdBegin, dataType, fileList) {
        //     let total = res.total
        //     fileList = res.list
        //     console.log(JSON.stringify(res.list) + '=mrFileList=' + JSON.stringify(this.mrFileList))
        //     let childrenlist = []
        //     for (let i = 0; i < total; i++) {
        //         if (res.list[i] != null) {
        //             let item = {
        //                 id: iTreenodeId + i,
        //                 label: res.list[i]
        //             }
        //             childrenlist.push(item)
        //         }
        //     }
        //     this.treedata[dataType].children = childrenlist
        // }
        // 路测数据文件   // 参数type  类型 0路测  1 投诉  2mr
        let dtParam = {
            type: 0,
            pageNo: 1,
            pageSize: 50000
        }
        dtComplaintMrFileList(dtParam)
            .then(res => {
                let total = res.total
                this.dtFileList = res.list
                let dtChildrenlist = []
                for (let i = 0; i < total; i++) {
                    if (res.list[i] != null) {
                        let item = {
                            id: 10000000 + i,
                            label: res.list[i]
                        }
                        dtChildrenlist.push(item)
                    }
                }
                this.treedata[1].children = dtChildrenlist
            })
            .catch(e => {
                console.log('catch:' + e)
            })

        // 投诉数据文件  // 参数type  类型 0路测  1 投诉  2mr
        let complainParam = {
            type: 1,
            pageNo: 1,
            pageSize: 50000
        }
        dtComplaintMrFileList(complainParam).then(res => {
            let total = res.total
            this.complaintList = res.list
            let complainChildrenlist = []
            for (let i = 0; i < total; i++) {
                if (res.list[i] != null) {
                    let item = {
                        id: 20000000 + i,
                        label: res.list[i]
                    }
                    complainChildrenlist.push(item)
                }
            }
            this.treedata[2].children = complainChildrenlist
        })
        // MR 文件列表；  // 参数type  类型 0路测  1 投诉  2mr
        let mrParam = {
            type: 2,
            pageNo: 1,
            pageSize: 50000
        }
        dtComplaintMrFileList(mrParam).then(res => {
            let total = res.total
            this.mrFileList = res.list
            let mrChildrenlist = []
            for (let i = 0; i < total; i++) {
                if (res.list[i] != null) {
                    let item = {
                        id: 30000000 + i,
                        label: res.list[i]
                    }
                    mrChildrenlist.push(item)
                }
            }
            this.treedata[0].children = mrChildrenlist
            // getFileTrees(res,30000000,0,this.mrFileList);
        })
    },
    mounted() {},
    data() {
        return {
            activeName: 'mrdata',
            filterText: '',
            mrFileList: [],
            dtFileList: [],
            complaintList: [], // 投诉数据文件列表
            checkedMrlist: [],
            checkedDtlist: [],
            checkedComplainlist: [],
            dtDataArray: [],
            mrDataArray: [],
            complaintDataArray: [],
            editArr: [], // 设置默认选中 ，目前约束 tree单选; 依据需要扩展多文件数据
            treedata: [
                {
                    id: 1,
                    label: 'MR数据文件',
                    children: []
                },
                {
                    id: 2,
                    label: '路测数据文件',
                    children: []
                },
                {
                    id: 3,
                    label: '投诉数据文件',
                    children: []
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    },
    methods: {
        // 设置tree单选
        setSelectedNode(data) {
            this.$refs.tree.setCheckedNodes([data])
            const node = this.$refs.tree.getCheckedNodes()
            console.log(node[0].id)
            this.editArr = [node[0].id]
        },
        confirm() {
            //点击确定 显示 按钮
            //更改父页面的状态
            this.$parent.showImportDataShow = false
            //通过 node 获取
            this.getCheckedNodes()

            //通过 key 获取  getCheckedKeys();
            //调用 dtnzdMap地图页面显示路测、MR、和投诉数据在地图上，目前只有路测数据的 RSRP。
            if (this.checkedDtlist.length > 0) {
                // 加载路测DT文件数据并显示;
                // 显示图例；路测图例;
                window.frames['dtnzdMap'].xsyc()
                //显示选定的路测文件数据到地图上，散点图。目前只支持单个文件的数据获取;
                let filename = this.checkedDtlist[0]
                let dtParam = {
                    fileName: filename,
                    pageNo: 1,
                    pageSize: 500000
                }
                getRoadTestListByFileName(dtParam).then(res => {
                    console.log('DT文件数据:' + JSON.stringify(res))
                    this.dtDataArray = res.list
                    let dataArray = []
                    for (let i = 0; i < res.list.length; i++) {
                        let item = res.list[i]
                        let temp = {
                            lon: item.longitude,
                            lat: item.latitude,
                            rsrp: parseFloat(item.rsrp)
                        }
                        dataArray.push(temp)
                    }

                    console.log('dataArray:' + JSON.stringify(dataArray))
                    window.frames['dtnzdMap'].draw_pointsForDt(dataArray) //调用gis绘制方法
                })
            }
            // 加载mr文件数据并显示;
            if (this.checkedMrlist.length > 0) {
                // 显示图例；mr图例;???
                // window.frames['dtnzdMap'].xsyc()
                let filename = this.checkedMrlist[0]
                let mrParam = {
                    fileName: filename,
                    pageNo: 1,
                    pageSize: 500000
                }
                getMrListByFileName(mrParam).then(res => {
                    this.mrDataArray = res.list
                    let dataArray = res.list
                    window.frames['dtnzdMap'].drawSqureForMr(dataArray) //调用gis绘制方法
                })
            }
            // 加载投诉数据;
            if (this.checkedComplainlist.length > 0) {
                let complainFilename = this.checkedComplainlist[0]
                let complainParam = {
                    fileName: complainFilename,
                    pageNo: 1,
                    pageSize: 500000
                }
                getComplaintListByFileName(complainParam).then(res => {
                    console.log('投诉文件数据:' + JSON.stringify(res))
                    this.complaintDataArray = res.list
                    let dataArray = res.list
                    if (dataArray == null && dataArray.length < 1) {
                        // 数据为空时，返回提示：
                        this.$message({
                            message: '投诉文件未包含任何投诉数据',
                            type: 'warning',
                            center: true,
                            duration: 30000,
                            showClose: true
                        })
                        return false
                    }
                    // 需要依据文件获取投诉数据的同时，
                    // 还得需要先将小区数据获取到通过经纬度放置在地图上后，在将投诉数据附着到小区上，高亮显示这些投诉小区的同时，点选某个小区显示该小区的投诉详情。
                    window.frames['dtnzdMap'].drawCellDetailsForComplaintData(dataArray) //调用gis绘制方法
                })
            }

            // if(this.checkedDtlist.length >0)this.showDtDataInto2dMap();
            // if(this.checkedMrlist.length >0)this.showMrDataInto2dMap();
            // if(this.checkedComplainlist.length >0)this.showComplainDataInto2dMap();
        },
        cancel() {
            this.$parent.showImportDataShow = false
            //   this.dialogVisible = false;
        },
        handleClickOftabs(tab, event) {
            console.log('log-tab:', tab, event)
        },
        handleTreeNodeClick(data) {
            console.log(data)
        },
        showMrDataInto2dMap() {
            let filename = this.checkedMrlist[0]
            console.log('MR文件名称:' + JSON.stringify(filename))
        },
        showDtDataInto2dMap() {
            // 显示图例；路测图例;
            window.frames['dtnzdMap'].xsyc()
            //显示选定的路测文件数据到地图上，散点图。目前只支持单个文件的数据获取;
            let filename = this.checkedDtlist[0]

            let dtParam = {
                fileName: filename,
                pageNo: 1,
                pageSize: 500000
            }
            getRoadTestListByFileName(dtParam).then(res => {
                console.log('DT文件数据:' + JSON.stringify(res))
                this.dtDataArray = res.list
                let dataArray = []
                for (let i = 0; i < res.list.length; i++) {
                    let item = res.list[i]
                    let temp = {
                        lon: item.longitude,
                        lat: item.latitude,
                        rsrp: parseFloat(item.rsrp)
                    }
                    dataArray.push(temp)
                }
                debugger
                console.log('dataArray:' + JSON.stringify(dataArray))
                window.frames['dtnzdMap'].draw_pointsForDt(dataArray) //调用gis绘制方法
            })
        },
        getCheckedNodes() {
            // 通过 node 获取勾选项  this.$refs.tree.getCheckedNodes(leafOnly) ; // let leafOnly = ture 只获取勾选文件
            var checkedTreeNodes = this.$refs.tree.getCheckedNodes(true)
            // 清空数据；
            this.checkedDtlist = []
            this.checkedMrlist = []
            this.checkedComplainlist = []
            // 目前是三类数据每次只能选择一个文件且互斥;
            for (let i = 0; i < checkedTreeNodes.length; i++) {
                // console.log('通过 node 获取id:' + checkedTreeNodes[i].id + ';' + checkedTreeNodes[i].label)
                let fileNameStr = checkedTreeNodes[i].label
                if (this.dtFileList.indexOf(fileNameStr) > -1) {
                    //则包含该元素
                    this.checkedDtlist.push(fileNameStr)
                }
                if (this.mrFileList.indexOf(fileNameStr) > -1) {
                    //则包含该元素
                    this.checkedMrlist.push(fileNameStr)
                }
                if (this.complaintList.indexOf(fileNameStr) > -1) {
                    //则包含该元素
                    this.checkedComplainlist.push(fileNameStr)
                }
            }
        },
        getCheckedKeys() {
            //通过 key 获取勾选项 getCheckedKeys(leafOnly)
            console.log(this.$refs.tree.getCheckedKeys())
            let leafOnly = Boolean(ture)
            let checkedTreeNodes = this.$refs.tree.getCheckedKeys()
            debugger
            for (let i = 0; i < checkedTreeNodes.length; i++) {
                console.log('通过 node key 获取id:' + checkedTreeNodes[i].id + ';' + checkedTreeNodes[i].label)
                console.log('key=' + i + ':' + checkedTreeNodes[i].children)
            }
        },
        resetChecked() {
            // 清空勾选的树节点选择项;
            this.$refs.tree.setCheckedKeys([])
        },
        filterTreeNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        handleClose() {
            this.$parent.showImportDataShow = false
        }
    }
}
</script>

<style scoped></style>