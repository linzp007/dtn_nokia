<template>
    <div class="main">
        <!-- <div><v-header></v-header></div> -->
        <div class="contentLeft">
            <!-- 引擎参数配置 弹框 开始 该弹框被 引擎参数-计算设置 按钮使用 -->
            <el-dialog title="引擎参数计算设置" :visible.sync="isEngineParamCfgVisible" width="50%" center>
                
                <el-form :model="engineStartParam" ref="engineParamCfgForm" label-width="100px" size="mini" >
                    <el-form-item label="仿真计算:" prop="type">
                        <el-checkbox-group v-model="engineStartParam.calculate">
                            <el-checkbox label="calFloor" name="type">分楼层计算</el-checkbox>
                            <el-checkbox label="calCellRsrp" name="type">单小区计算</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="服务小区渲染:">
                        <el-switch v-model="engineStartParam.ServiceCellRenderer" active-text="是" inactive-text="否"> </el-switch>
                    </el-form-item>
                    <el-form-item :inline="true" label="2D结果:" prop="ResultRender">
                        <el-checkbox-group v-model="engineStartParam.ResultRender">
                            <el-checkbox label="RSRP" name="ResultRender"></el-checkbox>
                            <el-checkbox label="SINR" name="ResultRender"></el-checkbox>
                            <el-checkbox label="COVER" name="ResultRender"></el-checkbox>
                            <el-checkbox label="ISCOVER" name="ResultRender"></el-checkbox>
                            <el-checkbox label="LiShuttleCover" name="ResultRender"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="输出TOP17:">
                                <el-switch v-model="engineStartParam.PrintRsrpCluster" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="仿真结果文本:">
                                <el-switch v-model="engineStartParam.PrintResult" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="3D楼层渲染:" prop="type">
                        <el-checkbox-group v-model="engineStartParam.FloorRender">
                            <el-checkbox label="RSRP" name="FloorRender"></el-checkbox>
                            <el-checkbox label="SINR" name="FloorRender"></el-checkbox>
                            <el-checkbox label="COVER" name="FloorRender"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="3D立面渲染:" prop="type" >
                                <!-- <el-switch v-model="engineStartParam.BuildingRenderer" active-text="是" inactive-text="否"></el-switch> -->
                                <el-checkbox-group v-model="engineStartParam.BuildingRenderer">
                                  <el-checkbox label="DrawImages" >立面渲染</el-checkbox>
                                 <el-checkbox label="staticTable" >画像统计</el-checkbox>
                            
                               </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="建筑整体统计:" prop="type">
                                <el-switch v-model="engineStartParam.BuildingStatics" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="单小区渲染:">
                                <el-switch v-model="engineStartParam.DrawCellRsrp" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="路测渲染:">
                                <el-switch v-model="engineStartParam.drawMeasure" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分级RSRP:">
                                <el-switch v-model="engineStartParam.ClassifyRSRP" active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 其他设置 star -->
                <el-button type="text" @click="othersetVisible = true">其他设置</el-button>
                <el-dialog width="40%" title="其他设置" :visible.sync="othersetVisible" :close="othersetVisibleClose"  class="nothing_dialog"  :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
                    <other-set-page @othersetVisibleClose="othersetVisibleClose" @otherDialogAdd="otherDialogAdd"></other-set-page>
                </el-dialog>
                <!-- 其他设置  end -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isEngineParamCfgVisible = false">取 消</el-button>
                    <el-button type="primary" @click="engingStartParamOk">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 引擎参数配置 弹框 结束 -->

            <!-- 定时仿真弹层开始 -->
            <div v-show="isShowTimeBox" class="timeBox">
                <div class="topIcon">
                    <i class="el-icon-date"></i>
                    <div class="icon-text">时间</div>
                </div>
                <div class="hourColumn">
                    <div class="hourEach" :class="activeClass == id ? 'timeActive' : ''" v-for="(item, id) in timeArray" @click="clickTimeHour(item)" :key="id">{{ item.value }}</div>
                </div>
                <div class="selectArea">
                    <div class="selectArea-leftText">重复:</div>
                    <el-select @change="thisTimeRep" v-model="repeatValue" placeholder="请选择" size="mini" style="width: 100px">
                        <el-option v-for="item in repeatArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div v-show="0" class="weekSelectArea">
                    <div class="selectArea-leftText">间隔:</div>
                    <el-select v-model="intervalValue" placeholder="请选择" size="mini" style="width: 100px; margin-right: 10px">
                        <el-option v-for="item in interArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <div class="selectArea-leftText">周</div>
                </div>
                <div v-if="repeatValue != '1'" class="weekClickArea">
                    <div class="weekBox" :class="activeWeek == item.value ? 'timeActive' : ''" v-for="item in weekArray" :key="item.value" :label="item.label" :value="item.value" @click="clickWeekBox(item)">{{ item.label }}</div>
                </div>
                <div class="tipsArea">
                    {{ repeatValue == '1' ? '每日重复' : repeatValue == '2' ? '每周重复' : repeatValue == '3' ? '每月重复' : '每日重复' }}
                    {{ activeWeek == '1' ? '周一' : activeWeek == '2' ? '周二' : activeWeek == '3' ? '周三' : activeWeek == '4' ? '周四' : activeWeek == '5' ? '周五' : activeWeek == '6' ? '周六' : activeWeek == '7' ? '周日' : '' }}
                </div>
                <div class="startButtonArea">
                    <el-button type="primary" @click="clickStartButton" size="mini" style="height: 100%">启动</el-button>
                    <!--                    <el-button @click="clickStopButton" size="mini" style="height: 100%">停止</el-button>-->
                    <el-button @click="clickCloseModalButton" size="mini" style="height: 100%">关闭</el-button>
                </div>
            </div>
            <!-- 统计设置弹层开始 -->

            <div class="settingContainer" v-if="isShowStatistics">
                <div class="mask" @click="settingHide"></div>
                <div class="leftSettingContainer">
                    <div class="topTitle">
                        <el-select v-model="netType" placeholder="请选择" size="mini" style="width: 100%; height: 100%" @change="topNetChange">
                            <el-option v-for="item in netTypeArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="bodySetting">
                        <div class="bodyLeft">
                            <div class="normBox" v-for="item in normArray" :key="item.norm">
                                <div class="normLeft">{{ item.norm }}</div>
                                <div class="normRight">{{ item.value }}</div>
                            </div>
                        </div>
                        <div class="bodyRight">
                            <div class="normBox-right" v-for="item in RSRPArray" :key="item.id">
                                <div class="norm-text">{{ item.title }}</div>
                                <div class="normSame">{{ item.sign }}</div>
                                <div class="normSame-noneBorder" v-if="item.id == 0">
                                    <input type="text" v-model="item.number" placeholder="请输入数字" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" maxlength="11" @input="firstRSRPChange(item.number)" />
                                </div>
                                <div class="normSame-noneBorder" v-if="item.id == 2">
                                    <input type="text" v-model="item.number" placeholder="请输入数字" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" maxlength="11" @input="firstSINRChange(item.number)" />
                                </div>
                                <div class="normSame-noneBorder" v-if="item.id != 0 && item.id != 2">
                                    <input type="text" v-model="item.number" placeholder="请输入数字" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" maxlength="11" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="lastColumn">
                        <div class="lastColumn-left">
                            <div class="lastColumn-left-titleLeft">指标5</div>
                            <div class="lastColumn-left-titleRight">{{ lastLongTitle }}</div>
                        </div>
                        <div class="lastColumn-right">
                            <div class="normBox-right" v-for="item in lastRSRPArray" :key="item.id">
                                <div class="norm-text">{{ item.title }}</div>
                                <div class="normSame">{{ item.sign }}</div>
                                <div class="normSame-noneBorder" v-if="item.id == 0">
                                    <input type="text" v-model="item.number" placeholder="请输入数字" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" @input="secondRSRPChange(item.number)" maxlength="11" />
                                </div>
                                <div class="normSame-noneBorder" v-if="item.id != 0">
                                    <input type="text" v-model="item.number" placeholder="请输入数字" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" @input="secondSINRChange(item.number)" maxlength="11" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 底部的保存按钮 -->
                    <div class="confirmBotton" @click="clickConfirm">保存</div>
                </div>
            </div>
            <!-- 折线图的弹层开始 -->
            <div class="lineArea" v-show="isShowLineArea">
                <!-- 头部的下拉框开始 -->
                <div class="areaChoose">
                    <el-select v-model="selectAreaValue" placeholder="请选择" size="mini" style="width: 100%; background-color: #666666" @change="changeBlackSelect">
                        <el-option v-for="item in selectAreaArray" :key="item.value" :label="item.label" :value="item.label"></el-option>
                    </el-select>
                    <div class="rightLineClose" @click="closeLineArea()">X</div>
                </div>
                <!-- 第一个折线图开始 -->
                <div id="firstLineChart"></div>
            </div>
            <!-- <div class="mButton"></div> -->
            <div class="content" id="content">

                <div id="resize"></div>
                <div class="right" id="right">
                    <div class="rightTop">
                        <el-dialog title="导入文件" :visible.sync="uploadVisilble" width="15%" center>
                            <div class="upload-demo">
                                <el-button size="mini" type="primary" plain style="width: 120px" @click="kmlDown">示例文件kml下载</el-button>

                                <el-button size="mini" type="primary" plain style="width: 120px; margin-top: 15px; margin-left: 0" @click="mifDown">示例文件mif下载</el-button>
                                <el-button size="mini" type="primary" plain style="width: 120px; margin-top: 15px; margin-left: 0" @click="polUpVisible = true">上传区域文件</el-button>
                                <!-- <el-upload action="''" :show-file-list="false" accept :before-upload="beforeUpload">
                                </el-upload> -->
                                <!-- 多边形上传 -->
                                <el-dialog width="40%" title="多边形上传" class="nothing_dialog" 
                                :visible.sync="polUpVisible" 
                                :close="polUpVisibleClose"  
                                :close-on-press-escape="false" 
                                :close-on-click-modal="false" 
                                :destroy-on-close="true"
                                append-to-body
                                >
                                <!-- <polygon-up-dialog :areID="areID" @fetch="fetch" @polUpVisibleClose="polUpVisibleClose"></polygon-up-dialog> -->
                                </el-dialog>
                                <el-upload action="''" :show-file-list="false" accept :before-upload="beforekmlUpload">
                                    <el-button size="mini" type="primary" plain style="width: 120px; margin-top: 15px">上传道路KML文件</el-button>
                                </el-upload>
                                <!-- MR DT和投诉三种数据文件的导入组件 -->
                                <importPage> </importPage>
                            </div>
                        </el-dialog>
                        <el-dialog title="导出文件" :visible.sync="outVisilble" width="15%" center>
                            <div class="upload-demo">
                                <el-button size="mini" type="primary" plain style="width: 130px" @click="dcMif">导出mif文件</el-button>
                                <el-button size="mini" type="primary" plain style="width: 130px; margin-top: 15px; margin-left: 0" @click="dcKml">导出kml文件</el-button>
                            </div>
                            <!-- MR DT和投诉三种数据的导出文件组件 -->
                            <exportPage> </exportPage>
                        </el-dialog>
                        <el-select v-if="tabType == '2D'" v-model="noId" clearable placeholder="指标" v-has="'target'" size="mini" class="zhibiao" @change="handelZbChange">
                            <el-option v-for="item in findNormList" :key="item.noId" :label="item.normType" :value="item.noId"></el-option>
                        </el-select>
                        <el-button type="info" plain size="mini" @click="clearImg" class="quyu" v-if="tabType == '2D'" v-has="'clear'">区域结果清除</el-button>
                        <el-checkbox v-if="tabType == '2D'" border size="mini" class="wxMap" @change="invokeHtmlMethod" v-model="checkState" v-has="'gisMap'">卫星地图</el-checkbox>
                        <!--mapProcess
                        <el-button type="info" v-if="tabType == '2D'" @click="addCellFun" plain size="mini" class="addCell">显示</el-button>
                        <el-button type="info" v-if="tabType == '2D'" @click="showDataFun" plain size="mini" class="showDataFun">数据展示</el-button>
                        <el-button type="info" v-if="tabType == '2D'" @click="converPolygon" plain size="mini" class="converPolygon">弱覆盖栅格渲染</el-button>
                        <mapProcess ref="mapProcessFuc"></mapProcess>
                        --mapProcess --
                        -- 经纬度定位 搜索 --
                        <el-input type="info" v-if="tabType == '2D'" v-model="searchtext" plain size="mini" class="searchLatLngText"></el-input>
                        <el-button type="info" v-if="tabType == '2D'" @click="searchLatLngPosition" plain size="mini" class="searchLatLng">搜索</el-button> -->
                        <el-button type="info" plain size="mini" v-has="'dispaly'" class="addCell" @click="showTable" style="margin-left: 0px">显示</el-button>
                    </div>
                    <div class="tabce">
                        <button @click="tabTypeClick" size="mini" class="tabButton">
                            {{ tabType == '3D' ? '2D' : '3D' }}
                        </button>
                        <button v-if="tabType == '2D'" type="info" plain class="measuring commonToolButton" @click="measuringDistance">
                            <img src="" />
                        </button>
                        <button @click="clickshowLine" class="tabButtonOpen commonToolButton">{{ 'o' }}</button>
                    </div>
                    <div class="o-echarts">
                        <iframe v-show="tabType == '2D'" :src="this.sendMapUrl" width="100%" height="100%" ref="dtnzdMap" frameborder="0" name="dtnzdMap" id="dtnzdMap"></iframe>
                        <iframe v-show="tabType == '3D'" :src="this.threeMapUrl" width="100%" height="100%" frameborder="0" name="dtnMap" id="dtnMap"></iframe>
                    </div>
                    <div>
            <!-- <el-button
              type="primary"
              size="mini"
              plain
              @click="outDown"
              style="float: right;margin-top:5px;margin-bottom: 5px"
              v-show="!isShowLineArea"
              >导出</el-button> -->
                    </div>
                    <!-- 底部表格开始 -->
                    <div class="tableArea" v-show="isShowLineArea">
                        <!-- 底部表格需要下拉框 -->
                        <div class="election">
                            <el-select v-model="monthValue" placeholder="请选择" size="mini" style="width: 100px; margin-right: 10px">
                                <el-option v-for="item in monthArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="typeNetValue" placeholder="请选择" size="mini" style="width: 100px; margin-right: 10px">
                                <el-option v-for="item in typeNetArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-pagination style="width: 40%" @current-change="handleCurrentChange" :current-page="formPage.pageNum" :page-size="formPage.pageSize" layout="total, prev, pager, next, jumper" :total="formPage.pageTotal"></el-pagination>
                        </div>
                        <div class="addRight-table">
                            <el-table :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :data="tableDataArray" tooltip-effect="dark" height="143px" border size="mini" highlight-current-row>
                                <el-table-column prop="areaName" label="区域名称" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>

                                <!-- <el-table-column
                prop="assessRadius"
                label="评估半径(米)"
                show-overflow-tooltip
                ></el-table-column>-->

                                <el-table-column prop="calculateregion" label="场景" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.calculateregion"></span>
                                        <span v-if="scope.row.calculateregion == '1'">全部区域</span>
                                        <span v-if="scope.row.calculateregion == '2'">楼宇区域</span>
                                        <span v-if="scope.row.calculateregion == '3'">室外区域</span>
                                        <span v-if="scope.row.calculateregion == '4'">道路区域</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="roadLevel" label="道路级别" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.roadLevel"></span>
                                        <span v-if="scope.row.roadLevel == '1'">1级</span>
                                        <span v-if="scope.row.roadLevel == '2'">2级</span>
                                        <span v-if="scope.row.roadLevel == '3'">3级</span>
                                        <span v-if="scope.row.roadLevel == '4'">4级</span>
                                        <span v-if="scope.row.roadLevel == '5'">5级</span>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="averRsrp" label="平均RSRP(dBm)" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="rsrpCover93" label="RSRP覆盖率(>=-93dBm)" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.rsrpCover93 }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="rsrpCover96" label="RSRP覆盖率(>=-96dBm)" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.rsrpCover96 }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sinr" label="SINR达标率(>=-3db)" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.sinr }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="overlapOver3" label="重叠覆盖率(大于3)" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.overlapOver3 }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="effectiveData93" label="满足RSRP覆盖率(>=-93dBm)且SINR达标率(>=-3dBm)的百分比">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.effectiveData93 }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="effectiveData96" label="满足RSRP覆盖率(>=-96dBm)且SINR达标率(>=-3db)的百分比">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.effectiveData96 }} %</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="downEdge" label="下行边缘RSRP(dBm)" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.downEdge }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="right-table">
                        <el-table :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :data="tableData2" tooltip-effect="dark" height="143px" border size="mini" highlight-current-row>
                            <el-table-column prop="areaName" label="区域名称" key="areaName" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="calculateregion" label="场景" key="calculateregion"  show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.calculateregion"> </span>
                                    <span v-if="scope.row.calculateregion == '1'">全部区域</span>
                                    <span v-if="scope.row.calculateregion == '2'">楼宇区域</span>
                                    <span v-if="scope.row.calculateregion == '3'">室外区域</span>
                                    <span v-if="scope.row.calculateregion == '4'">道路区域</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="calculateregion" label="制式" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.taskType"></span>
                                    <span v-if="scope.row.taskType == 'LTE'">4G</span>
                                    <span v-if="scope.row.taskType == 'NR'">5G</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="calculateregion" label="阶段" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.stage"></span>
                                    <span v-if="scope.row.stage == 9">规划</span>
                                    <span v-else>现网+规划</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column v-if="!(isTableData2ColNr700Show ||isTableData2ColNrDShow )" prop="roadLevel" label="道路级别" key="roadLevel" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.roadLevel"></span>
                                    <span v-if="scope.row.roadLevel == '1'">1级</span>
                                    <span v-if="scope.row.roadLevel == '2'">2级</span>
                                    <span v-if="scope.row.roadLevel == '3'">3级</span>
                                    <span v-if="scope.row.roadLevel == '4'">4级</span>
                                    <span v-if="scope.row.roadLevel == '5'">5级</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="averRsrp" label="平均RSRP(dBm)" key="rsrpCover93" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="rsrpCover93" label="RSRP覆盖率(>=-93dBm)" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover93 }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rsrpCover96" label="RSRP覆盖率(>=-96dBm)" key="rsrpCover96" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover96 }} %</span>
                                </template>
                            </el-table-column>
                            <!-- 20210118新增动态列：输出结果，只有单选NR 700 或者NR D的任务，才显示 -->
                            <!-- 如果选择的制式频段是NR  700，显示这样两列，不显示道路级别列，那么上行速率1M就对应着rsrpCover1058，上行速率5M就对应着rsrpCover99。 -->
                            <el-table-column v-if="isTableData2ColNr700Show"  prop="rsrpCover1058" label="上行速率(1Mbps)" key="rsrpCover1058" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover1058 }} </span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="isTableData2ColNr700Show"  prop="rsrpCover99" label="上行速率(5Mbps)" key="rsrpCover99" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover99 }} </span>
                                </template>
                            </el-table-column>
                            <!-- 如果选择的制式频段是NR D ,显示这样两列，不显示道路级别列，那么上行速率1M就对应着rsrpCover114，上行速率5M就对应着rsrpCover108 -->
                            <el-table-column v-if="isTableData2ColNrDShow" prop="rsrpCover114" label="上行速率(1Mbps)" key="rsrpCover114" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover114 }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="isTableData2ColNrDShow" prop="rsrpCover108" label="上行速率(5Mbps)" key="rsrpCover108" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.rsrpCover108 }} %</span>
                                </template>
                            </el-table-column>

                            <!--  20210118新增动态列 end -->
                            <el-table-column prop="sinr" label="SINR达标率(>=-3db)" key="sinr" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.sinr }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="overlapOver3" label="重叠覆盖率(大于3)" key="overlapOver3" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.overlapOver3 }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="effectiveData93" key="effectiveData93" label="满足RSRP覆盖率(>=-93dBm)且SINR达标率(>=-3dBm)的百分比">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.effectiveData93 }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="effectiveData96" key="effectiveData96" label="满足RSRP覆盖率(>=-96dBm)且SINR达标率(>=-3db)的百分比">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.effectiveData96 }} %</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="downEdge" label="下行边缘RSRP(dBm)" key="downEdge" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{ scope.row.downEdge }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import mapProcess from '../components/mapProcess'
import importPage from './mapProcess/importPage'
import exportPage from './mapProcess/exportPage'
import otherSetPage from './mapProcess/otherSetPage'
import polygonUpDialog from './mapProcess/polygonUpDialog'
export default {
    name: 'nokia',
    components: {
        mapProcess,
        importPage,
        exportPage,
        otherSetPage,
        polygonUpDialog
    },
    data() {
        return {
            areID: '110000', // 110000北京 440000广州
            polUpVisible: false, // 弹框-上传区域文件
            othersetVisible: false, // 引擎参数计算设置-其他设置
            tablechange: true, // 左侧表格收起展开
            iconchange: true, //左侧按钮切换
            isActive: false, // 右侧宽度100%
            total: 0, //页面总数
            timer: null, // 定时器
            uploadVisilble: false, //上传弹框
            nameVisilble: false, // 编辑弹框
            outVisilble: false, //导出弹框
            menuType: 0, // 重点区域页面类型
            loading: false,
            zhanzhi: false, //站址勾选
            allCity: [], // 所有城市
            checkState: false, //卫星地图勾选
            searchtext: '', // 搜索功能对应的输入文本框，据 经纬度 查找 位置;格式要求：lat,lng
            centerDialogVisible: false, //多边形绘制弹框
            tabType: '2D', //2D、3D类型, 默认2D类型
            dataList: {
                polygonName: '',
                province: '',
                city: '',
                cellType: '',
                townCode: ''
            },
            dbList: {
                //多边形绘制参数
                polygonName: '',
                // province: '440000',
                province: '',
                provinceName: '',
                city: '',
                cityArea: '',
                cityName: ''
            },
            tabData: [], //列表重新赋值
            city: [], //省
            proCity: [], //市
            arId: '', // 省ID
            arId1: '', // 市ID
            arId2: '',
            statusList: [], // 状态列表
            taskStatus: '', // 状态名称
            taskStateType: '', //状态类型
            stanSysType: '', // 制式类型
            stanSysType1: '', // 频段
            stanSysTypeFreqBand: [
                {
                    cellType: 'NR',
                    freq: 'D'
                }
            ], // [{cellType:"制式类型名",freq:"频段名1-频段名2-频段名3"}]  制式频段多选数组;增加默认值
            modelType: '', //仿真模型类型
            antennaEntity: 'A9611AS26', //天线模型  默认值：A9611AS26
            binWidth: '5', // 栅格精度类型
            findStandardSystemList: [], //制式列表
            freqList: [],
            findNormList: [], //指标列表
            simulationModelList: [], //仿真模型列表
            secenList: [
                { secenId: '1', secenType: '全部区域' },
                { secenId: '2', secenType: '楼宇区域' },
                { secenId: '3', secenType: '室外区域' },
                { secenId: '4', secenType: '道路区域' }
            ],
            secenechecked: true, // 场景选定默认值;
            tableDataArray: [],
            tableDataHead: [],
            secenId: '',
            secenList1: ['1'], // 选定的场景 数组 ，增加默认值："1"
            rodeList: [
                { rodeId: '1', rodeType: '1级' },
                { rodeId: '2', rodeType: '2级' },
                { rodeId: '3', rodeType: '3级' },
                { rodeId: '4', rodeType: '4级' },
                { rodeId: '5', rodeType: '5级' }
            ],
            rodeList1: [],
            rodeId: '',
            noId: '', //指标ID
            tableData: [], //列表数据
            tableData2: [], //结果列表数据
            isTableData2ColNr700Show: false , // Nr 700 和 Nr D 互斥显示列控制变量;
            isTableData2ColNrDShow : false,// 结果列表数据 20210118新增动态列
            input: '', //区域名称参数
            maxHeight: '1000', //最大高度
            floorHeight: '3', // 楼层高度
            highLevelFloorHeight: '20', //高层单层高度
            highLevelThreadshold: '1000', // 高层门限
            interFereCancelFig: '',
            cellCalculationRadius: 600.0, // 小区计算半径：最小是10，默认800，限制两位小数，前端限制不为空值
            extendSpread: 800, // 外扩半径 int 数字类型，不能是负数和小数,
            isEngineParamCfgVisible: false, // 是否引擎参数配置弹窗显示 
            engineStartParam: { // 引擎参数 对象
                calculate: ['calFloor'], //仿真计算 calFloor,calCellRsrp 单小区计算 calCellRsrp ；分楼层计算 calFloor
                ServiceCellRenderer: false, // 服务小区渲染
                ResultRender: ['RSRP', 'SINR', 'COVER'], // 仿真结果，渲染2D结果 RSRP,SINR,COVER, ISCOVER, LiShuttleCover
                PrintRsrpCluster: false, // 输出TOP17
                PrintResult: true, // 输出仿真结果文本。文本结果，一版都是1
                FloorRender: [], //RSRP,SINR,COVER	3D楼层渲染
                BuildingRenderer: ['staticTable'], // 3D立面渲染以及分层统计;多选：BuildingRenderer=1;functions=DrawImages,staticTable【后台】；立面渲染，画像统计【前端】
                BuildingStatics: false, // 建筑整体统计
                DrawCellRsrp: false, //单小区渲染
                drawMeasure: false, //路测渲染
                ClassifyRSRP: false // 分级RSRP
            },
            engineParamCorrect:{ // 其他设置
                buildingCorrect: null,
                clutterCorrect: null,// 地貌校正
                buildingHeigthOffset: null,// 建筑物损耗设置
                buildingAdujst: null,// 建筑物楼层设置
            },
            multipleSelection: '', // 勾选列表选项
            dbIds: [], //勾选列表taId
            polygonIds: [], //勾选列表rpolygonId
            coordinates: [], //gis经纬度
            currentPage: 1, //页码
            pageSize: 20, //一页显示20条数据
            p: '', //编辑区域信息省
            c: '', //编辑区域信息市
            taskIds: [], //勾选列表taskId
            stuList: [], // 勾选列表的所有信息
            rayList: [],
            modelList: [],
            modelId: '-1', // // 仿真模型默认值：-1=DTN-SPM
            modelName: 'DTN-SPM', // 仿真模型默认值：DTN-SPM
            threeMapUrl: '',
            sendMapUrl: './static/2dMap/dtnzdMap.html',
            rulesCreate: {
                // 校验区域名称不为空
                polygonName: [{ required: true, message: '不能为空', trigger: 'change' }]
            },
            ruleTask: {
                polygonName: [{ required: true, message: '不能为空', trigger: 'change' }]
            },
            isShowTimeBox: false,
            isShowStatistics: false,
            isShowLineArea: false,
            activeClass: '-1',
            activeWeek: '',
            timeArray: [
                { id: 0, value: '0:00' },
                { id: 1, value: '1:00' },
                { id: 2, value: '2:00' },
                { id: 3, value: '3:00' },
                { id: 4, value: '4:00' },
                { id: 5, value: '5:00' },
                { id: 6, value: '6:00' },
                { id: 7, value: '7:00' },
                { id: 8, value: '8:00' },
                { id: 9, value: '9:00' },
                { id: 10, value: '10:00' },
                { id: 11, value: '11:00' },
                { id: 12, value: '12:00' },
                { id: 13, value: '13:00' },
                { id: 14, value: '14:00' },
                { id: 15, value: '15:00' },
                { id: 16, value: '16:00' },
                { id: 17, value: '17:00' },
                { id: 18, value: '18:00' },
                { id: 19, value: '19:00' },
                { id: 20, value: '20:00' },
                { id: 21, value: '21:00' },
                { id: 22, value: '22:00' },
                { id: 23, value: '23:00' }
            ],
            repeatValue: '1',
            selectAreaValue: '',
            intervalValue: '1',
            netType: '0',
            monthValue: '0',
            typeNetValue: '0',
            typeNetArray: [
                {
                    value: '0',
                    label: '4G'
                },
                {
                    value: '1',
                    label: '5G'
                }
            ],
            monthArray: [
                {
                    value: '0',
                    label: '近1个月'
                },
                {
                    value: '1',
                    label: '近3个月'
                },
                {
                    value: '2',
                    label: '近6个月'
                }
            ],
            formPage: {
                pageTotal: 0,
                pageSize: 10,
                pageNum: 1
            },
            netTypeArray: [
                {
                    value: '0',
                    label: '4G指标统计门限设置'
                },
                {
                    value: '1',
                    label: '5G指标统计门限设置'
                }
            ],
            interArray: [
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                },
                {
                    value: '4',
                    label: '4'
                },
                {
                    value: '5',
                    label: '5'
                }
            ],
            selectAreaArray: [],
            repeatArray: [
                {
                    value: '1',
                    label: '每日重复'
                },
                {
                    value: '2',
                    label: '每周重复'
                },
                {
                    value: '3',
                    label: '每月重复'
                }
            ],
            lastRSRPArray: [
                {
                    title: 'RSRP',
                    sign: '大于',
                    number: '-105',
                    id: '0'
                },
                {
                    title: 'SINR',
                    sign: '小于',
                    number: '3',
                    id: '1'
                }
            ],
            RSRPArray: [
                {
                    title: 'RSRP',
                    sign: '大于',
                    number: '-105',
                    id: '0'
                },
                {
                    title: 'RSRP',
                    sign: '大于',
                    number: '-110',
                    id: '1'
                },
                {
                    id: '2',
                    title: 'SINR',
                    sign: '大于',
                    number: '-3'
                },
                {
                    id: '3',
                    title: '重叠覆盖',
                    sign: '大于',
                    number: '3'
                }
            ],
            normArray: [
                {
                    norm: '指标1',
                    value: 'RSRP覆盖率'
                },
                {
                    norm: '指标2',
                    value: 'RSRP覆盖率'
                },
                {
                    norm: '指标3',
                    value: 'SINR达标率'
                },
                {
                    norm: '指标4',
                    value: '重复覆盖率'
                }
            ],
            weekArray: [
                {
                    value: '1',
                    label: '一'
                },
                {
                    value: '2',
                    label: '二'
                },
                {
                    value: '3',
                    label: '三'
                },
                {
                    value: '4',
                    label: '四'
                },
                {
                    value: '5',
                    label: '五'
                },
                {
                    value: '6',
                    label: '六'
                },
                {
                    value: '7',
                    label: '日'
                }
            ],
            mapStyle: '',
            firstLineCharts: '',
            // modelId: "",
            checkList: [],
            lineChartXTime: [],
            linAloneName: [],
            firstLineSeries: [],
            secondLineSeries: [],
            thirdLineSeries: [],
            fourLineSeries: [],
            fiveLineSeries: [],
            initPageNo: '1',
            lastLongTitle: '满足RSRP覆盖率且SINR达标率的百分比',
            alltaIDArray: [],
            findeList: [],
            modalShow: false,
            typeItem: [{id: 8, name:'规划站点'}, {id: 9, name: '现网站点+规划站点'}],
            typeSelect: '',
            cityArea: null,
            areaShow: true,
            crownCity: ['110000', '120000', '500000', '500000', '810000', '820000'],
            files: [],
            uploadType: true,
            uploadName: '',  //新建上传文件名
            uploadFlag: true,
            cellType: '',  //新建上传选定制式
            editCellType: '', //编辑选定制式
            cellList: ['4G', '5G'],
            typeBox: [],
            selctList: [],   //筛选过后的制式下拉列表参数
            excelError: [], //上传工参返回错误信息
            excelModal: false,
            tableData1: [
                {
                    id: 1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },
                {
                    id: 2,
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    children: [
                    {
                        id: 31,
                        date: '2020-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄',
                        children: [
                        {
                            id: 33,
                            date: '2020-05-32',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄'
                        }
                        ]
                    },
                    {
                        id: 32,
                        date: '2020-05-32',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄',
                        children: [
                        {
                            id: 34,
                            date: '2020-05-32',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄'
                        }
                        ]
                    }
                    ]
                },
                {
                    id: 3,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    hasChildren: true
                },
                {
                    id: 4,
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
            ],
            searchZsType: '',   //搜索制式参数
            isThCity: false,
            showBox: null
        }
    },
    created() {
        //指标下拉接口
        this.$axios({
            method: 'get',
            url: this.httpUrl + '/norms'
        }).then(res => {
            this.findNormList = res.data.list // 指标列表赋值
        })
        //vue定义方法，gis在html ，js里进行调用
        window['vueDefinedMyProp'] = receiveParams => {
            this.receiveParamsFromHtml(receiveParams)
        }
    },
    mounted() {
        //vue定义方法，gis在html ，js里进行调用
        window['vueDefinedMyProp'] = receiveParams => {
            this.receiveParamsFromHtml(receiveParams)
        }
        let passToken = this.$md5('123456789kkkk')
        console.log('token====>', passToken)
        let cont = new Date().getTime().toString()
        let time1 = cont.slice(0, 6)
        let time2 = cont.slice(6, 13)
        console.log('contbox-============>', time1, time2)
        let tokenStr = time1 + passToken + time2
        console.log('md5=====cont=====>', cont, tokenStr)
        
        // var req = new XMLHttpRequest()
        // req.open('GET', document.location, false)
        // req.send(null)
        // var headers = req.getAllResponseHeaders().toLowerCase()
        // var date = req.getResponseHeader('date')
        // console.log('this.$router====>', headers, date, typeof(headers))
        this.showBox = this.$route.query
        console.log('token========nokia33==========>', this.showBox)
        // this.showTable(this.$route.query.taskId, this.$route.query.polygonIds)
        
        this.timer = setInterval(() => {
            this.showTable()
        }, 3000)

        this.dragControllerDiv() //拖拽功能调用
        // 查询4/5门限信息
        this.getStatisticsThresholdInfo()

        this.$nextTick(()=>{
            document.addEventListener('keyup',(res)=>{
                if(res.keyCode == 27){
                    window.frames['dtnzdMap'].clear_polygon()
                }
            })
        })
    },

    //销毁组件前进行定时器清除
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
        sessionStorage.removeItem('token')
        console.log('destory====>', sessionStorage.getItem('token'))
    },
    //销毁组件进行定时器清除
    destroyed() {
        clearInterval(this.timer)
        this.timer = null
    },
    methods: {
        polUpVisibleClose() {
            // 弹框关闭- 上传区域文件
            this.polUpVisible = false;
        },
        othersetVisibleClose(val) {
            // 其他页面关闭
            this.othersetVisible = false;
        },
        otherDialogAdd(val) {
            // 其他设置配置
            this.engineParamCorrect = JSON.parse(JSON.stringify(val));
        },
        addCellFun() {
            let paramModel = {
                polygonIds: this.polygonIds,
                jobIds: this.taskIds,
                chkPolygons: this.stuList
            }
            this.$refs.mapProcessFuc.addCellFun(paramModel)
        },
        converPolygon() {
            let paramModel = {
                jobIds: this.taskIds
            }
            this.$refs.mapProcessFuc.converPolygon(paramModel)
        },
        showDataFun() {
            this.$refs.mapProcessFuc.showDataFun()
        },
        /**
         * 点击当前是多少页面页码
         * @method handleCurrentChange
         * @return any
         */
        handleCurrentChange(val) {
            this.formPage.pageNum = val
            // 请求表格的接口
            // this.getTableList()
        },
        firstSINRChange(value) {
            this.lastRSRPArray[1].number = value
        },
        secondSINRChange(value) {
            this.RSRPArray[2].number = value
        },
        secondRSRPChange(value) {
            this.RSRPArray[0].number = value
        },
        /**
         * @description 第一个resp输入框变化
         * @author xiaowenjun
         * @since 20/04/15
         */
        firstRSRPChange(value) {
            this.lastRSRPArray[0].number = value
        },
        /**
         * @description 初始化第一个折线图
         * @author xiaowenjun
         * @since 20/04/15
         */
        initFirstLine() {
            this.firstLineCharts = echarts.init(document.getElementById('firstLineChart'))
            this.firstLineCharts.setOption({
                xAxis: {
                    type: 'category',
                    data: ['平均RSRP', 'SS-PSRP覆盖率(>=-93dBM)', 'SS-PSRP覆盖率(>=-96dBM)', 'SINR达标率(>=-3dBM)', '重叠覆盖率(大于3)']
                },

                series: [
                    {
                        data: this.lineChartXTime,
                        type: 'line'
                    }
                ],
                color: ['#155faa', '#df7736', '#5c9b3f', '#70a1c6', '#9aa3cb'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['平均RSRP', 'SS-PSRP覆盖率(>=-93dBM)', 'SS-PSRP覆盖率(>=-96dBM)', 'SINR达标率(>=-3dBM)', '重叠覆盖率(大于3)']
                },
                grid: {
                    top: '30%',
                    left: '5%',
                    right: '5%', //处理右边显示不全问题
                    bottom: '5%',
                    y: 55,
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.lineChartXTime,
                    axisLabel: {
                        interval: 0,
                        rotate: 40
                    }
                },
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '平均RSRP',
                        type: 'line',
                        stack: '总量',
                        data: this.firstLineSeries
                    },
                    {
                        name: 'SS-PSRP覆盖率(>=-93dBM)',
                        type: 'line',
                        stack: '总量',
                        data: this.secondLineSeries
                    },
                    {
                        name: 'SS-PSRP覆盖率(>=-96dBM)',
                        type: 'line',
                        stack: '总量',
                        data: this.thirdLineSeries
                    },
                    {
                        name: 'SINR达标率(>=-3dBM)',
                        type: 'line',
                        stack: '总量',
                        data: this.fourLineSeries
                    },
                    {
                        name: '重叠覆盖率(大于3)',
                        type: 'line',
                        stack: '总量',
                        data: this.fiveLineSeries
                    }
                ]
            })
        },
        /**
         * @description 点击确认按钮
         * @author xiaowenjun
         * @since 20/04/29
         */
        clickConfirm() {
            // console.log(this.lastRSRPArray, 'lastRSRPArray', this.RSRPArray, 'RSRPArray')
            if (this.RSRPArray[0].number == '' || this.RSRPArray[1].number == '') {
                this.$message({
                    message: '请输入覆盖率指标',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else if (this.RSRPArray[2].number == '') {
                this.$message({
                    message: '请输入SINR达标率',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else if (this.RSRPArray[3].number == '') {
                this.$message({
                    message: '请输入重叠覆盖率',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            }

            let params = {
                type: this.netType, //类型0-4G  1-5G
                rsrpCover: this.RSRPArray[0].number, //rsrp覆盖率指标1 100
                rsrpCover2: this.RSRPArray[1].number, //rsrp覆盖率指标2 100
                sinr: this.RSRPArray[2].number, //sinr达标率 -3
                overlapCover: this.RSRPArray[3].number, //重叠覆盖率  -100
                createBy: 'dwsongwei' //操作人
            }
            this.$axios({
                method: 'post',
                url: this.httpUrl + `/setStatisticsThreshold`,
                data: params
            }).then(res => {
                if (res.data == 'ok') {
                    this.$message({
                        type: 'success',
                        message: '保存成功!',
                        center: true,
                        duration: 30000,
                        showClose: true
                    })
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'warning',
                        center: true,
                        duration: 30000,
                        showClose: true
                    })
                }
            })
            // this.isShowStatistics = false;
        },

        /**
         * @description 查询4/5门限信息
         * @author xiaowenjun
         * @since 20/04/28
         */
        getStatisticsThresholdInfo() {
            let params = ''
            this.$axios({
                method: 'get',
                url: this.httpUrl + `/getStatisticsThresholdInfo`,
                data: params
            }).then(res => {})
        },
        /**
         * @description 请求第一个折线图接口
         * @author xiaowenjun
         * @since 20/04/27
         */
        getRegionResultList() {
            let params = {
                dateType: this.monthValue, //时间类型 0 1 2
                cellType: this.typeNetValue, //制式类型 4G-0,5G-1
                pageNo: this.initPageNo, //1
                pageSize: '100', //100
                roadLevel: this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : '',
                calculateregion: this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : ''
            }

            this.$axios({
                method: 'get',
                url: this.httpUrl + `/tasks/regionResult?ids=${this.alltaIDArray}&dateType=${params.dateType}&cellType=${params.cellType}&roadLevel=${params.roadLevel}&calculateregion=${params.calculateregion}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`
            }).then(res => {
                let newArray = []
                if (res.status == '200') {
                    this.formPage.pageTotal = res.data.total
                    this.selectAreaArray = []
                    this.findeList = res.data.list
                    res.data.list.map((item, index) => {
                        newArray.push(item.areaName)
                    })
                    newArray = this.uniqueTest(newArray)
                    for (let i = 0; i < newArray.length; i++) {
                        this.selectAreaArray.push({ label: newArray[i] })
                    }
                }
            })
        },

        /**
         * @description 数组去重复
         * @author xiaowenjun
         * @since 20/06/19
         */
        uniqueTest(arr) {
            return Array.from(new Set(arr))
        },

/**
         * @description 黑色下拉框切换
         * @author xiaowenjun
         * @since 20/06/18
         */
        changeBlackSelect(val) {
            console.log('select===>', val)
            let findID = ''
            this.findeList.map((item, index) => {
                if (item.areaName == val) {
                    console.log((findID = item.taId))
                }
            })
            this.$axios({
                method: 'get',
                url: this.httpUrl + `/tasks/regionResult?ids=${findID}`
            }).then(res => {
                this.lineChartXTime = []
                this.firstLineSeries = []
                this.secondLineSeries = []
                this.thirdLineSeries = []
                this.fourLineSeries = []
                this.fiveLineSeries = []
                this.tableDataArray = []
                if (res.status == '200') {
                    res.data.list.map((item, index) => {
                        item.createDate = item.createDate.split(' ')[0]
                    })
                    this.formPage.pageTotal = res.data.total
                    this.tableDataArray = res.data.list
                    var hash = {}
                    this.tableDataArray = this.tableDataArray.reduce(function (item, next) {
                        hash[next.createDate] ? '' : (hash[next.createDate] = true && item.push(next))
                        return item
                    }, [])

                    this.tableDataArray.map((item, index) => {
                        this.firstLineSeries.push(item.averRsrp)
                        this.secondLineSeries.push(item.rsrpCover93)
                        this.thirdLineSeries.push(item.rsrpCover96)
                        this.fourLineSeries.push(item.sinr)
                        this.fiveLineSeries.push(item.overlapOver3)

                        this.lineChartXTime.push(item.createDate)
                    })
                    console.log(this.lineChartXTime, 'this.lineChartXTime')

                    this.initFirstLine()
                }
            })
        },
        /**
         * @description 点击地图的按钮显示折线图以及底部的表格
         * @author xiaowenjun
         * @since 20/04/15
         */
        clickshowLine() {
            // this.mapStyle =
            //   this.mapStyle ==
            //   "width: calc(100% - 423px);height: calc(100vh - 240px - 120px); "
            //     ? "width:100%;height: calc(100vh - 170px - 120px);  "
            //     : "width: calc(100% - 423px);height: calc(100vh - 240px - 120px); ";
            this.isShowLineArea = !this.isShowLineArea
            //关闭其他弹层
            this.isShowTimeBox = false
            this.isShowStatistics = false
            // 点击O符号需要请求接口重新渲染底部的表格
            this.getRegionResultList()
        },
        /**
         * @description 点击关闭折线图
         * @author xiaowenjun
         * @since 20/06/19
         */
        closeLineArea() {
            this.isShowLineArea = false
        },
        thisTimeRep() {
            // 点重复重置这个值
            this.activeWeek = ''
        },
        /**
         * @description 点击选择开始
         * @author xiaowenjun
         * @since 20/04/15
         */
        clickStartButton() {
            if (this.taskIds.length == 0) {
                this.$message({
                    message: '请选择区域', //判断如果没有选择区域
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } // todo 多制式多频段 的检查;
            else if (this.stanSysTypeFreqBand.length < 1) {
                this.$message({
                    message: '请选择仿真制式与频段', //判断是否选择多仿真制式\多频段,即多制式多频段数组不能为[]
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            }
            // else if (this.stanSysType == '') {
            //     this.$message({
            //         message: '请选择仿真制式', //判断是否选择仿真制式
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            // } else if (this.stanSysType1 == '') {
            //     this.$message({
            //         message: '请选择频段', //判断是否选择频段
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            // }
            else if (this.modelName == '') {
                this.$message({
                    message: '请选择仿真模型', //判断是否选择仿真模型
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else if (this.binWidth == '') {
                this.$message({
                    message: '请选择栅格精度', //判断是否选择栅格精度
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else if (this.antennaEntity == '') {
                this.$message({
                    message: '请选择天线型号', //判断是否选择天线型号
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } 
            else if (this.secenList1.length == 0) {
                this.$message({
                    message: '请选择场景', //判断是否选择场景
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.secenList1.includes('4') === true && this.rodeList1.length == 0) {
                this.$message({
                    message: '请选择道路级别', //判断是否选择道路级别
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.checkList.length < 1) {
                this.$message({
                    message: '请勾选地区', //判断是否选择请勾选地区
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else if (this.activeClass == '-1' || (this.activeWeek == '' && this.repeatValue != '1')) {
                this.$message({
                    message: '请选择时间', //判断是否选择时间
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            } else {
                //todo 多制式多频段 修改多制式多频段参数；  //给制式cellType和freq频段赋值，多制式，多频段

                let multiCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                    return item.cellType
                })
                let multiFreqForCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                    return item.freq
                })

                let fzPrame = {
                    antennaName: this.antennaEntity, //天线名称
                    binTidth: this.binWidth, //栅格宽度
                    // cellType: this.stanSysType, //制式(LTE或NR)
                    cellType: multiCellTypeStr.toString(), //todo 多选制式
                    createBy: 'dwsongwei', //操作人
                    createUserCode: 'test001', //操作人code
                    date: this.activeClass, //时间10
                    list: this.checkList, //勾选的多选框
                    modelId: this.modelId, //模型id
                    modelType: this.modelName, //仿真模型类型
                    repeatType: this.repeatValue, //重复类型1-每日 2-每周 3-每月
                    intervalType: this.intervalValue, //间隔类型单位周 1
                    // req: this.stanSysType1, //频段
                    req: multiFreqForCellTypeStr.toString(), //todo 多频段字符串；
                    week: this.activeWeek, //周一至周日 1-7
                    roadLevel: this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : '',
                    floorHeight: this.floorHeight,
                    maxHeight: this.maxHeight,
                    highLevelFloorHeight: this.highLevelFloorHeight, //'20', //高层单层高度
                    highLevelThreadshold: this.highLevelThreadshold, //'60', // 高层门限
                    interFereCancelFig: this.interFereCancelFig,
                    extendSpread: this.extendSpread,
                    mainCalcuRadius: parseFloat(this.cellCalculationRadius), // 小区计算半径，
                    calculateRegion: this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : ''
                }
                this.$axios
                    .post(this.httpUrl + '/saveTimingSimulation', fzPrame)
                    .then(res => {
                        console.log(res, 'res')
                        if (res.status == '200') {
                            this.$message({
                                type: 'success',
                                message: res.data,
                                center: true,
                                duration: 30000,
                                showClose: true
                            })
                        }
                        //提示成功看返回数据
                    })
                    .catch(err => {})
            }
            //关闭定时仿真的弹层
            // this.isShowTimeBox = false;
        },
        /**
         * @description 点击停止
         * @author xiaowenjun
         * @since 20/04/15
         */
        clickStopButton() {
            //关闭定时仿真的弹层
            // this.isShowTimeBox = false;
        },
        /**
         * @description 点击选择星期的active
         * @author xiaowenjun
         * @since 20/04/15
         */
        clickWeekBox(item) {
            this.activeWeek = item.value
        },
        /**
         * @description 点击选择小时active
         * @author xiaowenjun
         * @since 20/04/15
         */
        clickTimeHour(item) {
            this.activeClass = item.id
        },
        /**
         * @description 点击定时仿真按钮
         * @author xiaowenjun
         * @since 20/04/15
         */
        timeReImg() {
            // this.isShowTimeBox = !this.isShowTimeBox;
            //  取消显示开关，点击弹框;
            this.isShowTimeBox = true
            this.isShowStatistics = false

            //点击的时候关闭底部的表格和折线图
            // this.mapStyle = "width: 100%;height: calc(100vh - 170px - 120px);";
            this.isShowLineArea = false
        },
        /**
         * @description 点击关闭 定时仿真弹框
         * @author lj
         * @since 20/07/23
         */
        clickCloseModalButton() {
            this.activeWeek = '' //关闭重置初始值
            // this.isShowTimeBox = false;
            if (this.isShowTimeBox) this.isShowTimeBox = false
        },
        /**
         * @description
         * 点击统计设置
         * @author xiaowenjun
         * @since 20/04/15
         */
        statistics() {
            this.isShowStatistics = !this.isShowStatistics

            //点击的时候关闭底部的表格和折线图
            this.isShowTimeBox = false
            this.mapStyle = 'width: 100%;height: calc(100vh - 170px - 120px);'

            this.isShowLineArea = false
        },

        //分界线

        dragControllerDiv: function () {
            let resize = document.getElementById('resize')
            let left = document.getElementById('left')
            let right = document.getElementById('right')
            let content = document.getElementById('content')
            let table = document.getElementById('table')

            resize.onmousedown = function (e) {
                let startX = e.clientX
                resize.left = resize.offsetLeft
                document.onmousemove = function (e) {
                    let endX = e.clientX
                    let moveLen = resize.left + (endX - startX)
                    let maxT = content.clientWidth - resize.offsetWidth
                    // if (moveLen < 150) moveLen = 360
                    // if (moveLen > maxT - 800) moveLen = maxT - 800
                    resize.style.left = moveLen
                    table.style.width = left.style.width = moveLen + 'px'
                    // table.style.width = (moveLen - 10) + 'px'
                    right.style.width = content.clientWidth - moveLen - 30 + 'px'
                }
                document.onmouseup = function () {
                    document.onmousemove = null
                    document.onmouseup = null
                    resize.releaseCapture && resize.releaseCapture()
                }
                resize.setCapture && resize.setCapture()
                return false
            }
        },
        //切换2D，3D地图方法
        tabTypeClick() {
            if (this.tabType == '3D') {
                this.tabType = '2D'
            } else {
                if (this.taskIds.length > 1) {
                    this.$message({
                        message: '三维地图只支持单个区域勾选',
                        type: 'warning',
                        center: true,
                        duration: 30000,
                        showClose: true
                    })
                    return
                } else if (this.taskIds.length == 0) {
                    this.$message({
                        message: '请勾选区域,点击显示按钮',
                        type: 'warning',
                        center: true,
                        duration: 30000,
                        showClose: true
                    })
                    return
                }
                let jobId1 = this.taskIds.map(item => item).toString()
                this.tabType = '3D'
                // 将全局参数 this.httpUrl 字符串 格式化为 格式实例：http://218.205.192.26:8090 才能使用;
                let tmpHttpUrl = this.httpUrl.substring(0, this.httpUrl.lastIndexOf(':') + 1) + this.httpUrl.split('/')[2].split(':')[1]
                if (this.noId == 1) {
                    this.threeMapUrl = tmpHttpUrl + `/3dMap/main.html?JobId=${jobId1}&ResultType=rsrp`
                    // this.threeMapUrl = `http://218.205.192.26:8090/3dMap/main.html?JobId=${jobId1}&ResultType=rsrp`
                    // this.threeMapUrl = `http://bjkyhx.tpddns.cn:40003/3dMap/main.html?JobId=${jobId1}&ResultType=rsrp`;
                    // this.threeMapUrl = `http://10.254.221.145:8090/3dMap/main.html?JobId=${jobId1}&ResultType=rsrp`;
                    // this.threeMapUrl = `http://10.243.72.74:80/3dMap/main.html?JobId=${jobId1}&ResultType=rsrp`
                } else if (this.noId == 2) {
                    this.threeMapUrl = tmpHttpUrl + `/3dMap/main.html?JobId=${jobId1}&ResultType=sinr`
                    // this.threeMapUrl = `http://218.205.192.26:8090/3dMap/main.html?JobId=${jobId1}&ResultType=sinr`
                    // this.threeMapUrl = `http://bjkyhx.tpddns.cn:40003/3dMap/main.html?JobId=${jobId1}&ResultType=sinr`;
                    //  this.threeMapUrl = `http://10.254.221.145:8090/3dMap/main.html?JobId=${jobId1}&ResultType=sinr`;
                    // this.threeMapUrl = `http://10.243.72.74:80/3dMap/main.html?JobId=${jobId1}&ResultType=sinr`
                } else if (this.noId == 3) {
                    this.threeMapUrl = tmpHttpUrl + `/3dMap/main.html?JobId=${jobId1}&ResultType=cover`
                    // this.threeMapUrl = `http://218.205.192.26:8090/3dMap/main.html?JobId=${jobId1}&ResultType=cover`
                    // this.threeMapUrl = `http://bjkyhx.tpddns.cn:40003/3dMap/main.html?JobId=${jobId1}&ResultType=cover`;
                    // this.threeMapUrl = `http://10.254.221.145:8090/3dMap/main.html?JobId=${jobId1}&ResultType=cover`;
                    // this.threeMapUrl = `http://10.243.72.74:80/3dMap/main.html?JobId=${jobId1}&ResultType=cover`
                }
            }
        },
        //打开导入弹框
        uploadDialog() {
            this.uploadVisilble = true
        },
        //打开导出弹框
        uploadOut() {
            this.outVisilble = true
        },
        //通过调用gis传参，双击弹框进行省市请求并赋值
        receiveParamsFromHtml(res) {
            // 每次弹框显示时，清理 多边形弹窗中 所选省下的市 列表数据；以便每次进入弹框 省为：全国时，不能有任何市数据。
            this.proCity = []

            this.centerDialogVisible = true
            this.coordinates = res
            if (this.dbList.province) {
                this.$axios({
                    method: 'get',
                    url: this.httpUrl + `/adminiRegionCode?parentId=${this.dbList.province}`
                }).then(data => {
                    this.proCity = data.data
                })
            }
        },
        //选择站址方法
        zzChange() {
            console.log('jobId--------:' + this.taskIds)
            //判断是否选择区域
            if (this.dbIds.length == 0) {
                this.$message({
                    message: '请选择区域',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            //todo 增加多制式多频段;
            //给制式cellType和freq频段赋值，多制式，多频段
            let multiCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                return item.cellType
            })
            let multiFreqForCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                return item.freq
            })
            // todo 不应该出现，有制式而频段为空的情况。
            const z = {
                ids: this.dbIds,
                ztype: this.zhanzhi,
                //"cellType" ="NR,LTE_FDD" , "freq" = "D,F-900"
                cellType: multiCellTypeStr.toString(),
                freq: multiFreqForCellTypeStr.toString(),
                jobIds: this.taskIds
            }
            if (this.zhanzhi == true) {
                window.frames['dtnzdMap'].stationAddressInfo(z) //给gis stationAddressInfo方法进行传参
            } else {
                window.frames['dtnzdMap'].stationAddressInfo(z) //给gis stationAddressInfo方法进行传参
            }
        },
        invokeHtmlMethod() {
            if (this.checkState == true) {
                window.frames['dtnzdMap'].onMapTypeChanged() //调用gis 卫星地图方法  勾选
            } else {
                window.frames['dtnzdMap'].onMapTypeChanged() //调用gis 卫星地图方法  未勾选
            }
        },
        invokeHtmlDraw() {
            window.frames['dtnzdMap'].draw_polygon_click(this.menuType) //调用gis绘制方法
        },
        measuringDistance() {
            window.frames['dtnzdMap'].addInteraction(0, 2)
        },
        //多选筛选
        handleSelectionChange(val) {
            console.log('select====>', val)
            let type = []
            for(let i in val) {
                type.push(val[i].taskType)
            }
            this.typeBox = type.sort()
            if(this.typeBox.length == 1) {
                this.typeBox.map((item, index) => {
                    console.log('checklist====>', item)
                    console.log('this.findStandardSystemList', this.findStandardSystemList)
                    let findBox = []
                    if(item == 'LTE') {
                        for(let i in this.findStandardSystemList) {
                            if(this.findStandardSystemList[i].stanSysType == 'TD-LTE' || this.findStandardSystemList[i].stanSysType == 'LTE-FDD'){
                                findBox.push(this.findStandardSystemList[i])
                            }
                        }
                        this.selctList = findBox
                        console.log('selctList==444=>', this.selctList)
                    }else if(item == 'NR') {
                        for(let i in this.findStandardSystemList) {
                            if(this.findStandardSystemList[i].stanSysType == 'NR'){
                                findBox.push(this.findStandardSystemList[i])
                            }
                        }
                        this.selctList = findBox
                        console.log('selctList==555=>', this.selctList)
                    }else{
                        this.selctList = this.findStandardSystemList
                        console.log('selctList==null=>', this.selctList)
                    }
                })
                this.typeBox.push(val[0].taskType)
                console.log('push=111==>', type, this.typeBox)
            }else {
                this.selctList = this.findStandardSystemList
            }
            const id = val.map(item => item.taId).toString() //判断taId
            this.multipleSelection = id
            this.dbIds = val.map(item => item.taId) //判断taId
            this.taskIds = val.map(item => item.taskId) //判断taskId
            var idArray = []
            for (var k = 0; k < this.dbIds.length; k++) {
                idArray.push(this.dbIds[k])
            }
            this.polygonIds = val.map(item => item.rpolygonId) //判断rpolygonId
            this.stuList = val //勾选列表信息
            this.checkList = []
            if (val.length > 0) {
                val.map((item, index) => {
                    console.log(item, '我是要修改的city和province,item', sessionStorage.getItem('user'))
                    this.checkList.push({
                        city: item.city, //city :'bj'
                        // city: 'gz',  //city :'bj'
                        polygonType: item.polygonType,
                        province: item.province, //province:'bj'
                        // province: 'gd',  //province:'bj'
                        polygonId: item.rpolygonId,
                        createUserCode: item.createUserCode
                    })
                })
            }
        },

        //删除接口
        deleteTable() {
            let praram = this.multipleSelection.replace(/,/g, ',')
            // let user = sessionStorage.getItem('user')
            let user = sessionStorage.getItem('user')
            console.log('deleteTable', user, this.checkList.createUserCode)
            //判断是否勾选区域
            if (this.multipleSelection == []) {
                this.$message({
                    message: '请选择区域',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            
            //判断是否是自己角色下创建任务
            for(let i in this.checkList) {
                if(this.checkList[i].createUserCode !== user) {
                    this.$message({
                        message: '你不能删除他人任务',
                        type: 'warning',
                        center: true,
                        duration: 30000,
                        showClose: true
                    })
                    return
                }
            }

            //
            this.$confirm('此操作将删除选定区域的仿真, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios
                        .delete(this.httpUrl + `/tasks/${praram}`)
                        .then(data => {
                            if (data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                    center: true,
                                    duration: 3000,
                                    showClose: true
                                })
                                this.fetch() //删除成功刷新区域列表
                                window.frames['dtnzdMap'].clear_polygon()
                            }
                        })
                        .catch(res => {
                            this.$message({
                                type: 'error',
                                message: '删除失败!',
                                center: true,
                                duration: 3000,
                                showClose: true
                            })
                            this.fetch() //删除失败刷新区域列表
                            window.frames['dtnzdMap'].clear_polygon()
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 3000,
                        showClose: true
                    })
                })
            //
        },
        //显示接口
        showTable() {
            // let ids = this.multipleSelection
            // 判断如果没有勾选区域，则区域结果为空，清除区域多边形，并给出提示
            // if (ids == []) {
            //     this.$message({
            //         message: '请选择区域',
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            //     this.tableData2 = []
            //     window.frames['dtnzdMap'].clear_polygon()
            //     return
            // } else if (this.secenList1.length == 0) {
            //     this.$message({
            //         message: '请选择场景', //判断是否选择场景
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            //     return
            // } else if (this.secenList1.includes('4') === true && this.rodeList1.length == 0) {
            //     this.$message({
            //         message: '请选择道路级别', //判断是否选择道路级别
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            //     return
            // }
            let ids = this.showBox.taskId.split(',')
            let polygonIds = this.showBox.polygonIds.split(',')
            console.log('ids和polygonIds============>', ids, polygonIds)
            this.tabType = '2D'
            this.sendMapUrl
            const secen = this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : ''
            const dlRoad = this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : ''
            const zb = {
                targetId: 1,
                taskId: ids,
                calculateregion: 1,
                roadLevel: ''
            }
            const token = sessionStorage.getItem('token') //缓存获取token
            console.log('cont----box=====>',polygonIds, zb)
            window.frames['dtnzdMap'].show_polygon(polygonIds, token) //将token和参数传个gis显示接口
            window.frames['dtnzdMap'].target_select(zb.targetId) //筛选指标
            window.frames['dtnzdMap'].xsyc()
            window.frames['dtnzdMap'].resultsByIndexType(zb) //指标结果
            window.frames['dtnzdMap'].init_is_mouse_move()

            this.$axios.get(this.httpUrl + `/tasks/regionResult?ids=${ids}&calculateregion=${secen}&roadLevel=${dlRoad}`).then(data => {
                // this.tableData2 = data.data; //获取区域结果列表
                // 处理结果中的 制式频段是单选，且 是NR  700；(NR D  互斥) 增加两列显示，道路级别一列不显示；todo 优化下属判断为函数??
                console.log('end======================>',data.status)
                if(data.status == 200) {
                    console.log('嘻嘻哈哈')
                    clearInterval(this.timer)
                    this.timer = null
                    console.log('this.timer============>', this.timer)
                }
                let isNrD = [];let isNr700 = [];
                let dataListlength = data.data.list.length
                let dataList = data.data.list;
                for(let i=0; i < dataListlength ; i++){
                    let item = dataList[i];                   
                    if(item.cellType != null && item.cellType.toUpperCase() =="NR"){                        
                        if(item.freq == "D"){
                          isNrD.push(true);
                        }
                        if(item.freq == "700"){
                          isNr700.push(true);
                        }
                    } else {
                      this.isTableData2ColNr700Show = false;
                      this.isTableData2ColNrDShow = false;
                      break;
                    }
                }
                if(isNrD.length == dataListlength )   {
                    this.isTableData2ColNrDShow = true ;
                    this.isTableData2ColNr700Show  = false ;
                } // Nr 700 和 Nr D 互斥显示列控制变量;
                if(isNr700.length == dataListlength )   {
                    this.isTableData2ColNr700Show  = true ;
                    this.isTableData2ColNrDShow = false
                }
                // console.log("-------"+JSON.stringify(data.data.list))
                // 其它情况下，按照原有列显示;
                this.tableData2 = data.data.list
                // 这里需要根据场景字段去重?
                // var hash2 = {};
                // this.tableData2 = this.tableData2.reduce(function(item, next) {
                //   hash2[next.calculateregion]
                //     ? ""
                //     : (hash2[next.calculateregion] = true && item.push(next));
                //   return item;
                // }, []);
                // console.log(this.tableData2, "根据场景去重");
            })

            this.noId = 1
        },
        // 导出—— 区域统计结果
        outDown() {
            let ids = this.multipleSelection
            if (ids == []) {
                this.$message({
                    message: '请选择区域',
                    type: 'warning',
                    center: true
                })
                return
            } else if (this.secenList1.length == 0) {
                this.$message({
                    message: '请选择场景', //判断是否选择场景
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.secenList1.includes('4') === true && this.rodeList1.length == 0) {
                this.$message({
                    message: '请选择道路级别', //判断是否选择道路级别
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            const secen = this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : ''
            const dlRoad = this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : ''
            window.open(this.httpUrl + `/tasks/regionResultExport?ids=${ids}&calculateregion=${secen}&roadLevel=${dlRoad}`, 'ce')
        },
        

        dbselectValueCityArea(e) {
            this.dbList.cityArea = val
            for(let i in this.cityArea) {
                if(val == this.cityArea[i].arId) {
                    this.dbList.cityAreaName = this.cityArea[i].admRegName
                }
            }
        },
        //分页
        current_change: function (currentPage) {
            this.currentPage = currentPage
            this.fetch() //选择分页获取列表
        },
        //判断状态是否为空
        selectStatusValue(taskStateType) {
            this.taskStateType == this.taskStateType
            if (!taskStateType) {
                this.taskStateType = ''
            }
        },
        selectBlurzhishi() {
            console.log('______________:')
            // 弹出下拉菜单;
            // this.$refs.dropdownMenuCellTypePreq.show()
        },
        //判断制式是否为空
        selectZsValue(stanSysType) {
            this.stanSysType == this.stanSysType
            if (stanSysType) {
                this.$axios({
                    method: 'get',
                    url: this.httpUrl + `/standardSystem?parentType=${stanSysType}`
                }).then(res => {
                    this.freqList = res.data.list
                    this.stanSysType1 = res.data.list.stanSysType ? res.data.list.stanSysType : ''
                })
            } else if (!stanSysType) {
                this.stanSysType1 = ''
                this.freqList = []
            }
            // 弹出下拉菜单;
            this.$refs.dropdownMenuCellTypePreq.show()
        },
        selectZsValue1() {
            this.stanSysType1 == this.stanSysType1

            //todo  stanSysTypeFreqBand:[]  [{"cellType:制式类型名","freq:频段名1，频段名2-频段名3"}]
            let cellType = this.stanSysType
            let freqArray = ''
            for (let i = 0; i < this.stanSysType1.length; i++) {
                freqArray += this.stanSysType1[i] + '-'
            }
            //去掉freqArray字符串中最后一个 -
            freqArray = freqArray.slice(0, freqArray.length - 1)
            //参考制式频段对象
            let tmp = {
                cellType: cellType,
                freq: freqArray
            }
            //判断是否有重复的制式和频段，去重:用新的多选的频段去替换 已有制式的对象；
            let isHasCellType = false
            for (let j = 0; j < this.stanSysTypeFreqBand.length; j++) {
                let item = this.stanSysTypeFreqBand[j]
                if (item.cellType == cellType) {
                    if (freqArray != '') this.stanSysTypeFreqBand[j].freq = freqArray
                    isHasCellType = true
                }
            }
            if (!isHasCellType) this.stanSysTypeFreqBand.push(tmp)

            // 弹出下拉菜单;
            this.$refs.dropdownMenuCellTypePreq.show()
        },
        handleClosecellTypeTag(tag) {
            for (let i = 0; i < this.stanSysTypeFreqBand.length; i++) {
                if (tag == this.stanSysTypeFreqBand[i].cellType) {
                    this.stanSysTypeFreqBand.splice(i, 1)
                }
            }
        },
        //判断仿真模型是否为空
        selectModelType(modelName) {
            this.modelName == this.modelName
            this.modelList.map(item => {
                if (this.modelName == item.modelName) {
                    this.modelId = item.modelId
                }
            })
            // this.modelId = selectId;
            if (!modelName) {
                this.modelName = ''
            }
        },
        selectScene(val) {
            this.secenId = val
            let idIndexVal = this.secenList1.indexOf(this.secenId)
            if (idIndexVal >= 0) {
                // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
                this.secenList1.splice(idIndexVal, 1) //调用gis方法，给gis传参
            } else {
                // 选中该checkbox
                this.secenList1.push(this.secenId) //调用gis方法，给gis传参
            }
            if (!this.secenList1.includes('4')) {
                this.rodeList1 = []
            }
        },
        selectLevel(val) {
            this.rodeId = val
            let idIndexVal1 = this.rodeList1.indexOf(this.rodeId)
            if (idIndexVal1 >= 0) {
                // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
                this.rodeList1.splice(idIndexVal1, 1) //调用gis方法，给gis传参
            } else {
                // 选中该checkbox
                this.rodeList1.push(this.rodeId) //调用gis方法，给gis传参
            }
        },
        selectAntennaEntity(antennaEntity) {
            this.antennaEntity == this.antennaEntity
            if (!antennaEntity) {
                this.antennaEntity = ''
            }
        },
        //判断栅格宽度是否为空
        selectBinWidth(binWidth) {
            this.binWidth == this.binWidth
            if (!binWidth) {
                this.binWidth = ''
            }
        },
        // 导入下载kml模板
        kmlDown() {
            window.open(this.httpUrl + '/tasks/templateDownload?templateType=1', 'ce')
        },
        /**
         * @description 新加的一个最下面的导出按钮
         * @author xiaowenjun
         * @since 20/05/13
         */
        newLastDown() {
            console.log(22)
        },
        //导入下载mif模板
        mifDown() {
            window.open(this.httpUrl + '/tasks/templateDownload?templateType=0', 'ce')
        },
        //查询接口
        seachButton() {
            console.log('search===>', this.searchZsType)
            let ZsType = ''
            switch(this.searchZsType) {
                case '':
                    ZsType = ''
                    break
                case '4G':
                    ZsType = 'LTE'
                    break
                case '5G':
                    ZsType = 'NR'
            }
            this.$axios({
                method: 'get',
                url: this.httpUrl + `/tasks?pageNo=1&pageSize=20&taskStatus=${this.taskStateType}&province=${this.arId}&city=${this.arId1}&townCode=${this.arId2}&polygonName=${this.input}&menuType=${this.menuType}&cellType=${ZsType}`
            }).then(data => {
                this.tableData = data.data.list
                this.total = data.data.total
                this.currentPage = data.data.pageNum
                this.$axios({
                    method: 'get',
                    url: this.httpUrl + '/adminiRegionCode'
                }).then(data => {
                    console.log('list-=====>', data)
                    this.allCity = data.data
                    this.tableData.map((item, i) => {
                        this.allCity.map(item1 => {
                            if (item.city == item1.arId) {
                                this.tableData[i].cityName = item1.admRegName
                            }
                            if (item.province == item1.arId) {
                                this.tableData[i].provinceName = item1.admRegName
                            }
                        })
                    })

                    this.tabData = this.tableData
                })
            })
        },
        
        //选择指标
        handelZbChange(noId) {
            console.log('选择指标', noId, this.dbIds)
            // 判断选择指标需要先选择区域
            // if (this.dbIds.length == 0) {
            //     this.$message({
            //         message: '请选择区域',
            //         type: 'warning',
            //         center: true,
            //         duration: 30000,
            //         showClose: true
            //     })
            //     return
            // }
            this.noId == this.noId
            const secen = this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : ''
            const dlRoad = this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : ''
            const zb = {
                targetId: this.noId,
                taskId: this.showBox.taskId,
                calculateregion: secen,
                roadLevel: dlRoad
            }
            if (noId) {
                window.frames['dtnzdMap'].target_select(zb.targetId) //筛选指标将参数传个gis
                window.frames['dtnzdMap'].resultsByIndexType(zb) //调用gis方法，将参数传个gis
                window.frames['dtnzdMap'].init_is_mouse_move()
            }
            if (!noId) {
                this.noId = ''
                window.frames['dtnzdMap'].target_select(zb.targetId) //筛选指标将参数传个gis
                window.frames['dtnzdMap'].resultsByIndexType(zb) //调用gis方法，将参数传个gis
                window.frames['dtnzdMap'].init_is_mouse_move()
            }
        },

        isCellCalculationRadiusNum(value) {
            // 小区计算半径：最小是10，默认800，限制两位小数，前端限制不为空值
            // /\d+(\.\d{0,2})?/
            let val = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''
            if (parseFloat(val) < 10.0) return 10.0
            if (isNaN(parseFloat(val))) return 10.0
            return val
        },
        isNumber(val) {
            // 约束只能输入整数 数组;
            val = val.replace(/[^0-9]/gi, '')
            if (isNaN(parseInt(val))) return 0
            return parseInt(val)
        },
        isExtendSpreadNumber(val) {
            val = val.replace(/[^0-9]/gi, '')
            // extendSpread 默认800，填写范围是0-5000，不能填负数，不能填小数
            if (parseInt(val) > 5000) return 5000
            if (isNaN(parseInt(val))) return 0
            return parseInt(val)
        },
        engineParamCfgDialog() {
            this.isEngineParamCfgVisible = true
        },
        engingStartParamOk() {
            // 仿真计算 参数配置： 参数配置弹框的确认按钮功能；this.engineStartParam
            this.isEngineParamCfgVisible = false            
        },

        //仿真接口
        reImg(isFastSimul) {
            let loading = null
            let s = this.stuList.map(item => {
                return item.taskStatus
            })
            let newS = [...new Set(s)]
            let f1 = newS.filter(item => item == '1').toString()
            if (this.taskIds.length == 0) {
                this.$message({
                    message: '请选择区域', //判断如果没有选择区域
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (f1 == '1') {
                this.$message({
                    message: '正在仿真中，请选择未开始的区域进行仿真', //判断是否是仿真中状态的区域
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.stanSysTypeFreqBand.length < 1) {
                //todo  多制式多频段
                this.$message({
                    message: '请选择仿真制式和频段', //判断是否选择仿真模型 和频段，可以选择多个制式且每个制式必须有1个频段或多个频段;
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            else if (this.modelName == '') {
                this.$message({
                    message: '请选择仿真模型', //判断是否选择仿真模型
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.binWidth == '') {
                this.$message({
                    message: '请选择栅格精度', //判断是否选择栅格精度
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.antennaEntity == '') {
                this.$message({
                    message: '请选择天线型号', //判断是否选择天线型号
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.secenList1.length == 0) {
                this.$message({
                    message: '请选择场景', //判断是否选择场景
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else if (this.secenList1.includes('4') === true && this.rodeList1.length == 0) {
                this.$message({
                    message: '请选择道路级别', //判断是否选择道路级别
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            } else {
                // this.$message({
                //     message: '仿真启动中,请稍等!', //符合以上条件则弹出仿真弹框
                //     type: 'warning',
                //     center: true
                // })
                //loading显示;addnew
                loading = this.$loading({
                    lock: true,
                    text: '仿真启动中,请稍等!',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                })

                let arr = []
                let timerId = this.polygonIds.toString()
                console.log(timerId)
                //定时器，刷新列表仿真状态
                this.timer = setInterval(() => {
                    this.$axios({
                        method: 'get',
                        url: this.httpUrl + `/tasks/getTaskStatus?polygonIds=${timerId}`
                    }).then(res => {
                        arr = res.data
                        this.tabData.map((item, i) => {
                            arr.map(item1 => {
                                if (item.rpolygonId == item1.rpolygonId) {
                                    this.tabData[i].taskStatus = item1.taskStatus
                                }
                            })
                        })
                        let st1 = arr.map(item => item && item.taskStatus)
                        let newSt1 = [...new Set(st1)]
                        let ft1 = newSt1.filter(item => item !== '1').toString()
                        if (ft1) {
                            // localStorage.removeItem("arr");
                            clearInterval(this.timer)
                            this.timer = null
                        }
                        localStorage.setItem('arr', JSON.stringify(arr))
                    })
                }, 5000)
                // 给制式cellType和freq频段赋值，多制式，多频段
                let multiCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                    return item.cellType
                })
                let multiFreqForCellTypeStr = this.stanSysTypeFreqBand.map(function (item) {
                    return item.freq
                })

                const jobList = [
                    {
                        //"cellType" ="NR,LTE_FDD" , "freq" = "D,F-900"
                        cellType: multiCellTypeStr.toString(), //this.stanSysType,
                        freq: multiFreqForCellTypeStr.toString(), //this.stanSysType1,
                        jobId: this.taskIds.map(item => item).toString()
                    }
                ]

                let b = jobList.map(item => item.jobId.split(','))
                b = b.map((item, i) => {
                    item = item.map(j => {
                        return {
                            ...jobList[i],
                            jobId: j
                        }
                    })
                    return item
                })
                //todo 仿真计算; 待定要求：calFloor分楼层计算; 计算小区功率；没有calFloor功能项，则不能调用 FloorRender, BuildingRenderer, BuildingStatics;
                // 没有calCellRsrp功能项, 则不能调用DrawCellRsrp。单小区计算
                let tmpEngineStartParam = { // 将 对话框对象 this.engineStartParam 转换为接口要求的参数对象：对象中属性值均为字符串，其如果为false转为空字符串
                    calculate: this.engineStartParam.calculate.toString(), //仿真计算 calFloor,calCellRsrp
                    ServiceCellRenderer: this.engineStartParam.ServiceCellRenderer ? '1' : '', // 服务小区渲染
                    ResultRender: this.engineStartParam.ResultRender.toString(), // 仿真结果，渲染2D结果 RSRP,SINR,COVER, ISCOVER, LiShuttleCover
                    PrintRsrpCluster: this.engineStartParam.PrintRsrpCluster ? '1' : '', // 输出TOP17
                    PrintResult: this.engineStartParam.PrintResult ? '1' : '', // 输出仿真结果文本。文本结果，一版都是1
                    FloorRender: this.engineStartParam.FloorRender.toString(), //RSRP,SINR,COVER	3D楼层渲染
                    BuildingRenderer: this.engineStartParam.BuildingRenderer.toString(), // 3D立面渲染，以及分层统计;多选 checkbox
                    BuildingStatics: this.engineStartParam.BuildingStatics ? '1': '', // 建筑整体统计 this.engineStartParam.BuildingStatics.toString() 
                    DrawCellRsrp: this.engineStartParam.DrawCellRsrp ? '1' : '', //单小区渲染  this.engineStartParam.DrawCellRsrp.toString()
                    drawMeasure: this.engineStartParam.drawMeasure ?  '1': '', //路测渲染  this.engineStartParam.drawMeasure.toString()
                    ClassifyRSRP: this.engineStartParam.ClassifyRSRP ? '1' : '' // 分级RSRP  this.engineStartParam.ClassifyRSRP.toString()
                } 
                
                let fzPrame = {
                    calculateRegion: this.secenList1 ? this.secenList1.sort().toString().replace(/,/g, '-') : '',
                    roadLevel: this.rodeList1 ? this.rodeList1.sort().toString().replace(/,/g, '-') : '',
                    floorHeight: this.floorHeight,
                    maxHeight: this.maxHeight,
                    highLevelFloorHeight: this.highLevelFloorHeight, //'20', //高层单层高度
                    highLevelThreadshold: this.highLevelThreadshold, //'60', // 高层门限
                    interFereCancelFig: this.interFereCancelFig,
                    modelId: this.modelId,
                    binWidth: +this.binWidth,
                    modelType: this.modelName,
                    antennaEntity: this.antennaEntity,
                    simulationTaskDTOList: b.flat(),
                    fastSimulation: isFastSimul,
                    extendSpread: this.extendSpread,
                    mainCalcuRadius: parseFloat(this.cellCalculationRadius), // 小区计算半径，
                    engineStartParam: tmpEngineStartParam, // 引擎参数计算设置
                    engineParamCorrect: this.engineParamCorrect
                }
                
                console.log('仿真===》', fzPrame)
                this.$axios({
                    method: 'post',
                    url: this.httpUrl + `/startJob`,
                    data: fzPrame
                })
                    .then(res => {
                        // addnew
                        if (res.status == 200 || res.status == 201) {
                            // loading隐藏;
                            loading.close()
                            this.$message({
                                message: '仿真中,请耐心等候!', //发起启动任务成功后，则弹出仿真弹框
                                type: 'warning',
                                center: true
                            })
                        } // add new end
                        this.fetch() //仿真成功刷新区域列表
                    })
                    .catch(err => {
                        // loading隐藏;
                        loading.close()
                        //  addnew end
                        this.$message({
                            message: '仿真失败,原因：' + err.response.data.error, //仿真失败错误信息提示
                            type: 'error',
                            center: true,
                            duration: 30000,
                            showClose: true
                        })
                    })
            }
        },
        // 区域结果清除
        clearImg() {
            window.frames['dtnzdMap'].clear_polygon()
        },

        /**
         * 集团点击的导出(对比,趋势处)
         * @method exportJituanGongdanBar
         * @return any
         */
        beforekmlUpload(file) {
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = testmsg
            if (
                extension == 'kml' ||
                extension == 'mif' || //判断文件类型
                extension == 'MIF' ||
                extension == 'KML'
            ) {
                let param = new FormData()
                let ka = extension == 'kml' || extension == 'KML' ? 1 : 0
                param.append('file', file)
                this.$axios({
                    method: 'post',
                    url: this.httpUrl + `/uploadRoadKml`,
                    data: param
                })
                    .then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '上传成功！',
                                center: true,
                                duration: 30000,
                                showClose: true
                            })
                            this.uploadVisilble = false
                            this.fetch() //上传成功，弹框关闭，刷新列表
                        }
                    })
                    .catch(res => {
                        this.$message({
                            type: 'error',
                            message: '城市信息不存在测试任务',
                            center: true,
                            duration: 30000,
                            showClose: true
                        })
                        this.uploadVisilble = false
                        this.fetch() //上传失败，弹框关闭，刷新列表
                    })
            } else {
                //判断提示框，文件类型
                return this.$message({
                    message: '上传文件只能是mif格式或kml格式!',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
            }
        },
        
        
        //下载mif数据
        dcMif() {
            // 判断是否勾选区域
            if (this.polygonIds == '') {
                this.$message({
                    message: '请选择区域！',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            window.open(this.httpUrl + `/tasks/templateExport?templateType=0&polygonIds=${this.polygonIds}`, 'ce')
        },
        //下载kml数据
        dcKml() {
            // 判断是否勾选区域
            if (this.polygonIds == '') {
                this.$message({
                    message: '请选择区域！',
                    type: 'warning',
                    center: true,
                    duration: 30000,
                    showClose: true
                })
                return
            }
            window.open(this.httpUrl + `/tasks/templateExport?templateType=1&polygonIds=${this.polygonIds}`, 'ce')
        },

    },
}
</script>
<style scoped>
.leftSettingContainer,
.rightSettingContainer {
    width: 430px;
    border: 1px solid #ccc;
    z-index: 999;
}
.bodySetting {
    width: 100%;
    /* height: 400px; */
    display: flex;
    justify-content: space-around;
}

.normBox {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    justify-content: space-around;
}
.normBox-right {
    width: 100%;
    display: flex;
    margin-bottom: 18px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ccc;
}

.normLeft {
    width: 30%;
    border: 1px solid #ccc;

    height: 30px;
    line-height: 30px;
}
.norm-text {
    width: 60px;
    text-align: center;
    line-height: 30px;
}
.normSame {
    width: 30%;
    border: 1px solid #ccc;
    height: 25px;
    line-height: 25px;
}
.normSame-noneBorder {
    width: 30%;
    height: 25px;
    line-height: 25px;
}
.normSame-noneBorder > input {
    width: 100%;
    height: 25px;
    line-height: 25px;
}
.normSame > input {
    width: 100%;
    height: 25px;
    line-height: 25px;
}
.normRight {
    width: 70%;
    margin-left: -2px;
    border: 1px solid #ccc;

    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
}
.specialHeight {
    height: 110px;
}

.bodyLeft {
    width: 32%;
    padding-top: 10px;
}
.bodyRight {
    width: 62%;
    padding-top: 10px;
}
.lastColumn {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
}
.lastColumn-left,
.lastColumn-right {
    border: 1px solid #ccc;
    width: 32%;
    text-align: center;
    display: flex;
}
.lastColumn-right {
    width: 62%;
    display: block;
}
.lastColumn-right > .normBox-right {
    margin-bottom: 0;
    height: 49px;
    border: none;
}
.lastColumn-left > div:nth-child(1) {
    width: 30%;
    line-height: 97px;
    border-right: 1px solid #ccc;
}
.lastColumn-left > div:nth-child(2) {
    width: 70%;
    padding-top: 15px;
    box-sizing: border-box;
}

.normLeft.specialHeight {
    height: 110px;
    line-height: 110px;
}
.topTitle,
.confirmBotton {
    width: 100%;
    height: 30px;
    /* background-color: #279bf6; */
    color: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
.confirmBotton {
    background-color: #279bf6;
}
.topTitle >>> input {
    text-align: center;
    background-color: #129def !important;
    color: #fff;
}
.tableArea {
    width: 100%;
    background-color: #fff;
}
.election {
    padding-top: 5px;
    box-sizing: border-box;
    display: flex;
}
#firstLineChart {
    width: 420px;
    height: 300px;
}
.areaChoose {
    height: 30px;
    border-radius: 3px;
    display: flex;
}
.timeActive {
    background-color: #37a0f8;
    color: #fff;
}
.rightLineClose {
    width: 10%;
    height: 100%;
    background-color: #ccc;
    color: #fff;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    cursor: pointer;
}
.areaChoose >>> input {
    text-align: center;
    background-color: #666666 !important;
    color: #fff;
}
.lineArea {
    width: 420px;
    background-color: #fff;
    position: absolute;
    right: 10px;
    top: 130px;
    z-index: 10;
}
.settingContainer {
    width: 430px;
    background-color: #fff;
    position: absolute;
    right: 10px;
    top: 40px;
    z-index: 10;
    /* padding: 10px 20px; */
    display: flex;
    justify-content: space-between;
    /* border: 1px solid #ccc; */
}
.settingContainer .mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
}
.timeBox {
    width: 370px;
    background: #fff;
    position: absolute;
    right: 10px;
    top: 122px;
    z-index: 10;
    border: 1px solid #ccc;
    padding: 10px 20px;
}
.topIcon {
    box-sizing: border-box;
    padding-left: 20px;
    height: 20px;
    display: flex;
}
.icon-text {
    width: 40px;
    height: 100%;
    margin-left: 10px;
    margin-top: -3px;
    /* color: #ccc; */
}
.hourColumn {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 220px;
}
.selectArea,
.weekSelectArea,
.weekClickArea {
    height: 50px;
    display: flex;
    padding-top: 10px;
    padding-left: 20px;
}
.tipsArea {
    height: 30px;
    display: flex;
    padding-top: 10px;
    padding-left: 20px;
}
.startButtonArea {
    height: 28px;
    padding-left: 20px;
}
.weekBox {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
.selectArea-leftText {
    margin-right: 10px;
    margin-top: 3px;
}
.hourEach {
    width: 60px;
    height: 20px;
    /* background-color: #efeeec; */
    text-align: center;
    line-height: 20px;
    margin-top: 5px;
    /* border: 1px solid #ccc; */
    cursor: pointer;
}

#resize {
    position: relative;
    width: 5px;
    height: 100vh;
    cursor: w-resize;
    float: left;
}
.main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.main .dishi {
    width: 60px;
    float: left;
}
.main :global(.el-table th .cell) {
    /* max-width: 200px; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.main :global(.el-table th .cell):hover {
    height: auto;
    white-space: normal;
}

.topButton {
    padding-left: 10px;
    /* padding-top: 14px; */
    padding-top: 5px;
    width: 100%;
    /* height: 48px; */
    /* height: 66px; */

    box-sizing: border-box;
    /* width: 100%;
  height: 48px; */
}

.tabButtonOpen {
    position: absolute;
    top: 88px;
    right: 10px;
}
.commonToolButton {
    display: block;
    margin: 1px;
    padding: 0;
    color: #fff;
    font-size: 18.24218px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    height: 1.375em;
    width: 1.375em;
    line-height: 0.4em;
    background-color: rgba(0, 60, 136, 0.5);
    border: none;
    border-radius: 2px;
    justify-content: center;
    cursor: pointer;
}

.contentLeft {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.content {
    display: flex;
    width: 100%;
}

.zhishi {
    width: 110px;
    /* margin-left: 4px; */
}
.main .el-input {
    width: 72px;
}
.mButton {
    margin-top: 8px;
}
.upload-demo {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.leftTable {
    height: calc(100vh - 150px + 17px);
    overflow: hidden;
    background: #eef1f6;
}
.leftTable :global(.el-table__empty-block) {
    width: 100% !important;
}
.leftTable1 {
    /* overflow-y: scroll; */
    height: calc(100vh - 170px - 9px);
}
.precity {
    width: 100%;
    display: flex;
}
.o-echarts {
    /* width: calc(100% - 423px); */
    width: 100%;
    margin-top: 10px;
    /* height: calc(100vh - 170px - 150px); */
    height: calc(100vh - 170px);
}
.formCreate {
    display: flex;
}
.r-echarts {
    width: 100%;
    height: calc(100vh - 170px - 120px);
    background-image: url('../assets/2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
.left {
    float: left;
    margin-left: 10px;
}
.qxq {
    width: 70px;
    color: #dcdfe6;
    opacity: 0.9;
}
.qxq2 {
    color: #dcdfe6;
    opacity: 0.9;
}
.qxq2 :global(.el-button) {
    width: 100%;
}
.qxq2 :global(.el-icon--right) {
    margin-left: 3px !important;
}
.qxq2 :global(.el-icon-arrow-down) {
    margin-top: 0px !important;
}
.qxq :global(.el-button) {
    width: 100%;
}
.qxq :global(.el-icon--right) {
    margin-left: 3px !important;
}
.qxq :global(.el-icon-arrow-down) {
    margin-top: 0px !important;
}
.right {
    position: relative;
    left: 5px;
    top: 0px;
    width: 100%;
}
.zhibiao {
    width: 80px;
    position: absolute;
    top: 16px;
    left: 85px;
    opacity: 0.9;
}
.huizhi {
    width: 80px;
    position: absolute;
    top: 16px;
    left: 3px;
    opacity: 0.9;
}
.quyu {
    width: 104px;
    position: absolute;
    top: 16px;
    left: 167px;
    opacity: 0.9;
}
.zzhi {
    position: absolute;
    top: 16px;
    left: 274px;
    opacity: 0.9;
    width: 80px;
    height: 28px;
    background: #f4f4f5;
    line-height: 28px;
    text-align: center;
    border-radius: 5%;
    border: 1px solid #d3d4d6;
}
.measuring {
    position: absolute;
    top: 140px;
    right: 10px;
    /* opacity: 0.9; */
    background: url('../assets/3.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    background-color: rgba(0, 60, 136, 0.5);
}
.wxMap {
    position: absolute;
    top: 16px;
    left: 275px;
    opacity: 0.9;
    width: 100px;
    height: 28px;
    background: #f4f4f5;
    line-height: 28px;
    text-align: center;
    border-radius: 5%;
    border: 1px solid #d3d4d6;
}
.tabButton {
    position: absolute;
    top: 114px;
    right: 10px;
    display: block;
    margin: 1px;
    padding: 0;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    height: 1.6722em;
    width: 1.6722em;
    line-height: 0.4em;
    background-color: rgba(0, 60, 136, 0.5);
    border: none;
    border-radius: 2px;
    justify-content: center;
    cursor: pointer;
}
.tabce :global(.el-button--mini) {
    padding: 7px 12px !important;
}
.fenye {
    margin-top: 7px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.right-table {
    margin-top: 10px;
    width: 100%;
    border-bottom: 1px solid #dfdfdf;
}
/* .main .right .right-table :global(.el-table__body-wrapper) {
  height: 100% !important;
} */
.main :global(.ivu-page-simple span) {
    padding: 0 2px 0 0px;
}
.main :global(.ivu-page-simple .ivu-page-simple-pager input) {
    margin: 0 4px;
}
.main :global(.ivu-page-simple .ivu-page-simple-pager) {
    margin-right: 4px;
}

.addCell {
    width: 90px;
    position: absolute;
    top: 16px;
    left: 380px;
    opacity: 0.9;
}
.showDataFun {
    width: 90px;
    position: absolute;
    top: 16px;
    left: 538px;
    opacity: 0.9;
}
.converPolygon {
    width: 105px;
    position: absolute;
    top: 16px;
    left: 627px;
    opacity: 0.9;
}
.searchLatLngText {
    width: 60px;
    position: absolute;
    top: 16px;
    left: 740px;
    opacity: 0.9;
}
.searchLatLng {
    /* searchtext button*/
    /* width: 50px; */
    position: absolute;
    top: 16px;
    left: 850px;
    opacity: 0.9;
    color: #909399;
    height: 27px;
    border-radius: 3px;
    background: #f4f4f5;
    border-color: #d3d4d6;
    font-size: 11px;
}
 /* 其他设置 */
  .nothing_dialog>>>.el-dialog__title {
    font-size: 14px;
  }
  .nothing_dialog>>>.el-dialog__header {
    padding: 14px 0px 10px;
    border-bottom: 1px solid #eee;
    margin: 0 15px;
  }
  .nothing_dialog>>>.el-form-item {
    margin-bottom: 2px;
  }
  .nothing_dialog>>>.el-dialog__headerbtn {
    top: 14px;
    right: 12px;
  }
  .nothing_dialog>>>.el-button+.el-button {
    margin-left: 2px;
  }
  .nothing_dialog >>>.el-table td, .el-table th {
    padding: 6px 0 !important;
    font-size: 12px !important;
  }
  .nothing_dialog >>>.el-table--border th, .el-table__fixed-right-patch {
    padding: 6px 0 !important;
    font-size: 12px !important;
    background: rgba(166, 166, 166, 0.08);
  }
  .nothing_dialog >>>.el-table--border {
    border-bottom: 1px solid #EBEEF5;
  }
  
.btn{
  margin-left: 10px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #ccc;
  line-height: 24px;
  font-size: 12px;
  text-align: center;
  padding: 0 5px;
  float: right;
  margin-top: 0px;
}
.btn:active{
    background: #fff;
}

.dishi>>>.el-input__inner{
  	  /* font-size: 18px!important;
      color:#000000!important;
      font-family: cursive!important;  */
      padding: 0 6px !important;     
  }
.el-button--mini{
    padding: 7px !important;
}
.el-dialog__body{
    height: 500px;
}
</style>
