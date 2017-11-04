<template>
    <div class="app-container panel panel-default">
        <div class="row" style="margin-left:8px;margin-bottom:20px;">
            <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <table id="device_table" class="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th style="text-align: center;">当前节点</th>
                    <th style="text-align: center;">用途</th>
                    <th style="text-align: center;">类型</th>
                    <th style="text-align: center;">设备IP</th>
                    <th style="text-align: center;">性能(G)</th>
                    <th style="text-align: center;">当前流量</th>
                    <th style="text-align: center;">CPU使用率</th>
                    <th style="text-align: center;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items">
                    <td>{{item.device.node.nodeName}}</td>
                    <td>{{item.device.deviceUse}}</td>
                    <td>{{item.device.deviceType}}</td>
                    <td>{{item.device.deviceIp}}</td>
                    <td>{{item.device.capability}}</td>
                    <td>{{item.currentFlow}}</td>
                    <td>
                        <div class="progress progress-striped" style="margin-top:10px;height: 18px;">
                            <div v-if="item.cpuUsage==0">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: 8 + '%'}">
                                    0%
                                </div>
                            </div>
                            <div v-if="item.cpuUsage<30">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.cpuUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.cpuUsage >= 30 && item.cpuUsage < 70">
                                <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.cpuUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.cpuUsage >= 70">
                                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.cpuUsage}}%
                                </div>
                            </div>
                        </div>
                    </td>
                    <td><a @click="deleteDevice(item.device.deviceId)">删除</a></td>
                </tr>
            </tbody>
        </table>

        <!-- 模态框 -->
        <div id="create_modal" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document'>
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">新建设备</h4>
                    </div>
                    <div class="modal-body">
                        <form :model="device" class="form-horizontal" style="margin-top:20px;">
                            <div class="form-group">
                                <label class="control-label col-md-2">
                                    节点
                                </label>
                                <div class="col-md-3">
                                    <template>
                                        <el-select v-model="device.nodeId" filterable placeholder="请选择节点" style="width:100%">
                                            <el-option
                                                    v-for="item in nodes"
                                                    :key="item.node.nodeId"
                                                    :label="item.node.nodeName"
                                                    :value="item.node.nodeId">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div>
                                <label class="control-label col-md-2">
                                    IP
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.deviceIp">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-2">
                                    用途
                                </label>
                                <div class="col-md-3">
                                    <el-select v-model="device.deviceUse" filterable v-on:change="deviceUseChange()" style="width:100%" placeholder="请选择类型">
                                        <el-option
                                                v-for="item in deviceUses"
                                                :key="item.label"
                                                :label="item.label"
                                                :value="item.label">
                                        </el-option>
                                    </el-select>
                                </div>
                                <label class="control-label col-md-2">
                                    类型
                                </label>
                                <div class="col-md-3">
                                    <el-select v-model="device.deviceType" style="width:100%" placeholder="请选择类型">
                                        <el-option
                                                v-for="item in deviceTypes"
                                                :key="item.label"
                                                :label="item.label"
                                                :value="item.label">
                                        </el-option>
                                    </el-select>
                                </div>

                            </div>
                            <div class="form-group">
                                <div class="waf-device" style="display: none">
                                    <label class="control-label col-md-2">
                                        认证方式
                                    </label>
                                    <div class="col-md-3">
                                        <input class="form-control" type='text' v-model="device.authType">
                                    </div>
                                </div>
                                <label class="control-label col-md-2">
                                    性能
                                </label>
                                <div class="col-md-3">
                                    <el-input  v-model="device.capability">
                                        <template slot="append">G</template>
                                    </el-input>
                                </div>
                            </div>
                            <div class="form-group waf-device" style="display:none;">
                                <label class="control-label col-md-2">
                                    认证端口
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.authPort">
                                </div>
                                <label class="control-label col-md-2">
                                    API端口
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.apiPort">
                                </div>
                            </div>
                            <div class="form-group waf-device" style="display: none;">
                                <label class="control-label col-md-2">
                                    用户名
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.username">
                                </div>
                                <label class="control-label col-md-2">
                                    密码
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='password' v-model="device.password">
                                </div>
                            </div>
                            <div class="form-group waf-device" style="display: none;">
                                <label class="control-label col-md-2">
                                    认证版本
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.authVersion">
                                </div>
                                <label class="control-label col-md-2">
                                    API版本
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="device.apiVersion">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-1 col-md-offset-5">
                            <button type="button" @click="subAddObj" class="btn btn-info">确定</button>
                        </div>
                        <div class="col-md-1">
                            <button type="button" class="btn btn-default" aria-label="Close"  data-dismiss="modal">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {validateIP} from '@/utils/validate';
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import select2 from '@/components/select2/select2.js';

  export default {
      created() {//初始化？
      },
      beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
          this.init4table();
      },
      mounted() {//初始化时，组装datatable，
          initDataTable($('#main_table'),[]);
      },
    data() {//页面所需的数据
          return {
                items:[],
                device:{
                    "deviceType":'',
                    "deviceIp":'',
                    "capability":'',
                    "nodeId":'',
                    "deviceUse":'',
                    "authPort":'',
                    "apiPort":'',
                    "authVersion":'',
                    "apiVersion":'',
                    "username":'',
                    "password":'',
                    "authType":'auth2',
                },
                nodes:[],
                deviceUses:[
                    {"label":"DDOS","DDOS":[
                        {"label":"华为AntiDDoS8140"},
                        {"label":"华为AntiDDoS8160"},
                        {"label":"华为AntiDDoS8180"},
                        ]},
                    {"label":"WAF","WAF":[
                        {"label":"华为AntiWAF8140"},
                        {"label":"华为AntiWAF8160"},
                        {"label":"华为AntiWAF8180"},
                    ]},
                ],
                deviceTypes:[],
          }
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let that = this;
            let node = this.$route.query;
            let nodeId = 0;
            if(typeof (node.nodeId)!="undefined"){
                nodeId = node.nodeId;
            }
            sendGetAjax("node/getNodeDeviceList?nodeId="+nodeId+"&time="+new Date().getTime(),true).then(function(sdata) {
                that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                $('#device_table').dataTable().fnDestroy();//销毁之前的table
                that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    initDataTable($('#device_table'),[]);
                });
            });
        },
        //删除设备
        deleteDevice(deviceId){
            let that = this;
            that.$confirm('确定要删除该设备吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).then(() => {
                sendGetAjax("node/deleteDeviceById?deviceId="+deviceId+"&time="+new Date().getTime(),true).then(function(sdata) {
                    if(sdata.code=="000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        that.init4table();
                    }else{
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除',
                    customClass:'cus-message-class',
                })
            });
        },

        //创建设备
        createObj () {
            let that = this;
            //获取所有节点
            sendGetAjax("node/getNodeList",true).then(function(sdata) {
                //清空表单.
                that.device={
                    "deviceType":'',
                    "deviceIp":'',
                    "capability":'',
                    "nodeId":'',
                    "deviceUse":'',
                    "authPort":'',
                    "apiPort":'',
                    "authVersion":'',
                    "apiVersion":'',
                    "username":'',
                    "password":'',
                    "authType":'auth2',
                };
                that.nodes = sdata.data;
                initModal($('#create_modal'));
                $(".waf-device").hide();
            });
        },
        //添加设备提交
        subAddObj() {
            let that = this;
            //表单验证
            let alertMsg = "";
            if(that.device.deviceUse=="WAF"){
                if(that.device.apiVersion==""){
                    alertMsg = "请正确填写API版本";
                }
                if(that.device.authVersion==""){
                    alertMsg = "请正确填写认证版本";
                }
                if(that.device.password==""){
                    alertMsg = "请正确填写密码";
                }
                if(that.device.username==""){
                    alertMsg = "请正确填写用户名";
                }
                if(that.device.apiPort=="" || isNaN(parseInt(that.device.apiPort))){
                    alertMsg = "请正确填写API端口";
                }
                if(that.device.authPort=="" || isNaN(parseInt(that.device.authPort))){
                    alertMsg = "请正确填写认证端口";
                }
                if(that.device.authType==""){
                    alertMsg = "请正确填写认证方式";
                }
            }
            if(that.device.capability=="" || isNaN(parseInt(that.device.capability))){
                alertMsg = "请正确填写性能";
            }
            if(that.device.deviceType==""){
                alertMsg = "请选择设备类型";
            }
            if(that.device.deviceUse==""){
                alertMsg = "请选择设备用途";
            }
            if(that.device.deviceIp=="" || !validateIP(that.device.deviceIp)){
                alertMsg = "请正确填写IP";
            }
            if(that.device.nodeId==""){
                alertMsg = "请选择节点";
            }
            if(alertMsg!=""){
                that.$message({
                    message:alertMsg,
                    type:'warning',
                    customClass:'cus-message-class',
                });
                return;
            }

            //提交表单
            sendAjax("node/addDevice",true,this.device).then(function(sdata) {
                if(sdata.code=="000"){
                    that.$message({
                        message:sdata.msg,
                        type:'success',
                        customClass:'cus-message-class',
                    });
                    //清空滞留在对象中的信息
                    that.device = {
                        "deviceType":'',
                        "deviceIp":'',
                        "capability":'',
                        "nodeId":'',
                        "deviceUse":'',
                        "authPort":'',
                        "apiPort":'',
                        "authVersion":'',
                        "apiVersion":'',
                        "username":'',
                        "password":'',
                        "authType":'auth2',
                    };
                    //关闭模态框
                    $('#create_modal').modal("hide");
                    that.init4table();
                }else{
                    that.$message({
                        message:sdata.msg,
                        type:'error',
                        customClass:'cus-message-class',
                    });
                }
            });
        },
        //设备用途切换事件
        deviceUseChange(){
            if(this.device.deviceUse=="DDOS"){
                this.deviceTypes = this.deviceUses[0].DDOS;
                $(".waf-device").hide();
            }else if(this.device.deviceUse=="WAF"){
                this.deviceTypes = this.deviceUses[1].WAF;
                $(".waf-device").show();
            }else{
                $(".waf-device").hide();
            }
        }
    }
  }
</script>
