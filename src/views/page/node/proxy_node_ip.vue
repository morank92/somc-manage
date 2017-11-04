<template>
    <div class="app-container">
        <div class="row" style="margin-left:8px;margin-bottom:20px;">
            <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <table id="proxy_ip_table" class="table table-striped table-hover table-bordered">
            <thead>
            <tr>
                <th style="text-align: center;">IP</th>
                <th style="text-align: center;">线路</th>
                <th style="text-align: center;">状态</th>
                <th style="text-align: center;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items">
                <td>{{item.ipStr}}</td>
                <td v-if="item.linkType==1">电信</td>
                <td v-else-if="item.linkType==2">联通</td>
                <td v-else="item.linkType">移动</td>
                <td v-if="item.status==1">
                    <span class="label label-info">空闲中</span>
                </td>
                <td v-else>
                    <span class="label label-warning">使用中</span>
                </td>
                <td><a @click="deleteProxyIp(item)">删除</a></td>
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
                        <h4 class="modal-title">创建代理服务器IP</h4>
                    </div>
                    <div class="modal-body">
                        <form :model="proxyIp"  class="form-horizontal" style="margin-top:20px;">
                            <div class="form-group">
                                <label class="control-label col-md-4">
                                    线路
                                </label>
                                <div class="col-md-3">
                                    <template>
                                        <el-select v-model="proxyIp.linkType" filterable placeholder="请选择线路类型"
                                                   style="width: 100%">
                                            <el-option
                                                    v-for="item in circuits"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4">
                                    IP
                                </label>
                                <div class="col-md-3">
                                    <el-select v-model="addType" @change="addTypeChange()" placeholder="请选择" style="width: 100%">
                                        <el-option
                                                v-for="item in addTypes"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-group" id="single_type" style="display: none;">
                                <label class="control-label col-md-4">IP值</label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="proxyIp.ipStr">
                                </div>
                            </div>
                            <div class="form-group multiple_type"  style="display: none;">
                                <label class="control-label col-md-4">开始IP</label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="startIp">
                                </div>
                            </div>
                            <div class="form-group multiple_type" style="display: none;">
                                <label class="control-label col-md-4">结束IP</label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="endIp">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-1 col-md-offset-5">
                            <button type="button" @click="subAddObj" class="btn btn-info">确定
                            </button>
                        </div>
                        <div class="col-md-1">
                            <button type="button" class="btn btn-default" aria-label="Close" data-dismiss="modal">取消
                            </button>
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
    import {sendAjax, sendGetAjax} from '@/utils/ajax_common';
    import {validateIP} from '@/utils/validate';
    import {initDataTable, initModal} from '@/utils/func_common.js';
    import select2 from '@/components/select2/select2.js';

    export default {
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            this.$emit('changeOpenDomain', true);
            this.init4table();
        },
        mounted() {//初始化时，组装datatable，
            initDataTable($('#main_table'), []);
        },
        data() {//页面所需的数据
            return {
                items: [],
                addTypes:[
                    {label:"单个IP",value:1},
                    {label:"IP段",value:2},
                ],
                addType:'',
                startIp:'',
                endIp:'',
                proxyIp: {
                    "proxyId":'',
                    "linkType": '',
                    "ipStr": '',
                },
                circuits: [
                    {"label":"电信","value":1},
                    {"label":"联通","value":2},
                    {"label":"移动","value":3},
                ],
            }
        },

        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                $('#proxy_ip_table').dataTable().fnDestroy();//销毁之前的table
                let proxy = that.$route.query;
                let proxyId = proxy.proxyId;
                that.proxyIp.proxyId = proxyId;
                sendGetAjax("node/getProxyIpList?proxyId=" + proxyId + "&time=" + new Date().getTime(), true).then(function(sdata) {
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.$nextTick(function () {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#proxy_ip_table'), []);
                    });
                });
            },
            //创建代理服务器ip打开模态框
            createObj () {
                //清除select框记录的上次选中数据
                this.proxyIp.linkType='';
                this.addType='';
                $("#single_type").hide();
                $(".multiple_type").hide();
                //初始化模态框里面的数据
                initModal($('#create_modal'));

            },
            //删除ip
            deleteProxyIp(proxyIp){
                let that = this;
                if(proxyIp.status==2){
                    that.$message({
                        message: "该IP正在使用中，不可删除",
                        type: 'error',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                that.$confirm('确定要删除该IP吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(() => {
                    sendGetAjax("node/delProxyIp?proxyId="+proxyIp.proxyId+"&proxyIpId="+proxyIp.id+"&time="+new Date().getTime(),true).then(function(sdata) {
                        if(sdata.code=='000'){
                            that.$message({
                                message: sdata.msg,
                                type: 'success',
                                customClass:'cus-message-class',
                            });
                            that.init4table();
                        }else{
                            that.$message({
                                message: sdata.msg,
                                type: 'error',
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
            //添加IP方式切换
            addTypeChange(){
                if(this.addType==1){
                    $("#single_type").show();
                    $(".multiple_type").hide();
                }else if(this.addType==2){
                    $("#single_type").hide();
                    $(".multiple_type").show();
                }
            },

            //添加代理服务器IP提交
            subAddObj() {
                let that = this;
                //表单验证
                if(that.proxyIp.linkType==""){
                    that.$message({
                        type: 'warning',
                        message: '请选择线路类型',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                //整理IP
                let proxyIpList = [];
                if(that.addType==1){
                    let b = validateIP(that.proxyIp.ipStr);
                    if(b){
                        //添加单个IP
                        proxyIpList.push(that.proxyIp);
                    }else{
                        that.$message({
                            type: 'warning',
                            message: '请填写正确的IP格式',
                            customClass:'cus-message-class',
                        });
                        return;
                    }
                }else{
                    let b1 = validateIP(that.startIp);
                    let b2 = validateIP(that.endIp);
                    if(b1 && b2){
                        proxyIpList = that.calculateIp(that.startIp,that.endIp,that.proxyIp.linkType,that.proxyIp.proxyId);
                    }else{
                        that.$message({
                            type: 'warning',
                            message: '请填写正确的IP格式',
                            customClass:'cus-message-class',
                        });
                        return;
                    }
                }
                //提交表单
                sendAjax("node/addProxyIp", true, proxyIpList).then(function(sdata) {
                    if (sdata.code == "000") {
                        that.$message({
                            message: sdata.msg,
                            type: 'success',
                            customClass:'cus-message-class',
                        });
                        //清空滞留数据
                        that.proxyIp = {
                            "proxyId":'',
                            "linkType": '',
                            "ipStr": '',
                        };
                        that.addType = '';
                        that.startIp = '',
                        that.endIp = '',
                        $('#create_modal').modal("hide");
                        that.init4table();
                    } else {
                        that.$message({
                            message: sdata.msg,
                            type: 'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },
            //ip段计算IP
            calculateIp(startIp,endIp,linkType,proxyId){
                var ipList = new Array();
                var startIpArr = startIp.split(".");
                var endIpArr = endIp.split(".");
                var startIp2 = parseInt(startIpArr[2]);
                var startIp3 = parseInt(startIpArr[3]);

                var endIp2 = parseInt(endIpArr[2]);
                var endIp3 = parseInt(endIpArr[3]);
                if(startIp2==endIp2){
                    for(var i=startIp3;i<=endIp3;i++){
                        var ipStr = startIpArr[0]+"."+startIpArr[1]+"."+startIpArr[2]+"."+i;
                        var ipBusi = ipBusi;
                        var proxyIp = {ipStr:ipStr,linkType:linkType,proxyId:proxyId};
                        ipList.push(proxyIp);
                    }
                }else{
                    for(var j = startIp2;j<=endIp2;j++){
                        if(j==startIp2){
                            for(var i=startIp3;i<=255;i++){
                                var ipStr = startIpArr[0]+"."+startIpArr[1]+"."+startIp2+"."+i;
                                var ipBusi = ipBusi;
                                var proxyIp = {ipStr:ipStr,linkType:linkType,proxyId:proxyId};
                                ipList.push(proxyIp);
                            }
                        }else if(j==endIp2){
                            for(var i=0;i<=endIp3;i++){
                                var ipStr = startIpArr[0]+"."+startIpArr[1]+"."+endIp2+"."+i;
                                var ipBusi = ipBusi;
                                var proxyIp = {ipStr:ipStr,linkType:linkType,proxyId:proxyId};
                                ipList.push(proxyIp);
                            }
                        }else{
                            for(var i=0;i<=255;i++){
                                var ipStr = startIpArr[0]+"."+startIpArr[1]+"."+j+"."+i;
                                var ipBusi = ipBusi;
                                var proxyIp = {ipStr:ipStr,linkType:linkType,proxyId:proxyId};
                                ipList.push(proxyIp);
                            }
                        }

                    }

                }
                return ipList;
            }
        }
    }
</script>
