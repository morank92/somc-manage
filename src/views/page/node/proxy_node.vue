<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <div class="row" style="margin-left:8px;margin-bottom:20px;">
                <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
            </div>
            <table id="proxy_table" class="table table-striped table-hover table-bordered">
                <thead>
                <tr>
                    <th style="text-align: center;">当前节点</th>
                    <th style="text-align: center;">服务器编号</th>
                    <th style="text-align: center;">IP个数</th>
                    <th style="text-align: center;">用户个数</th>
                    <th style="text-align: center;">连接数</th>
                    <th style="text-align: center;">CPU使用率</th>
                    <th style="text-align: center;">RAM使用率</th>
                    <th style="text-align: center;">IP状态</th>
                    <th style="text-align: center;">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items">
                    <td>{{item.proxy.node.nodeName}}</td>
                    <td>{{item.proxy.proxyName}}</td>
                    <td><router-link :to="{path:'/node/proxy_node/proxyNodeIp',query:item.proxy}">{{item.proxy.ipNum}}</router-link></td>
                    <td>{{item.proxy.userNum}}</td>
                    <td>{{item.curConnCount}}</td>
                    <td>
                        <div class="progress progress-striped" style="margin-top:10px;height: 18px;">
                            <div v-if="item.cpuUsage==0">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: 8 + '%'}">
                                    0%
                                </div>
                            </div>
                            <div v-else-if="item.cpuUsage<30">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.cpuUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.cpuUsage >= 30 && item.cpuUsed < 70">
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
                    <td>
                        <div class="progress progress-striped" style="margin-top:10px;height: 18px;">
                            <div v-if="item.memUsage==0">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: 8 + '%'}">
                                    0%
                                </div>
                            </div>
                            <div v-if="item.memUsage<30">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.memUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.memUsage >= 30 && item.memUsage < 70">
                                <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.memUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.memUsage >= 70">
                                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.cpuUsed + '%'}">
                                    {{item.memUsage}}%
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.proxy.status<50">
                            <span class="label label-sm label-success"><span>空闲</span></span>
                        </div>
                        <div v-else-if="item.proxy.status>= 50">
                            <span class="label label-sm label-warning"><span>已满</span></span>
                        </div>
                    </td>
                    <td><a @click="deleteProxy(item.proxy)">删除</a></td>
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
                            <h4 class="modal-title">新建代理服务器</h4>
                        </div>
                        <div class="modal-body">
                            <form :model="proxyServer" class="form-horizontal" style="margin-top:20px;">
                                <div class="form-group">
                                    <label class="control-label col-md-4">
                                        节点
                                    </label>
                                    <div class="col-md-3">
                                        <template>
                                            <el-select v-model="proxyServer.nodeId"  filterable placeholder="请选择节点" style="width: 100%">
                                                <el-option
                                                        v-for="item in nodes"
                                                        :key="item.node.nodeId"
                                                        :label="item.node.nodeName"
                                                        :value="item.node.nodeId">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-4">
                                        服务器编号
                                    </label>
                                    <div class="col-md-3">
                                        <input class="form-control" type='text' v-model="proxyServer.proxyName">
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
        <template>
            <router-view @changeOpenDomain="changeThisOpenDomain"></router-view>
        </template>
    </div>

</template>
<style scoped>
</style>

<script>
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
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
                openChild:false,//是否打开了子组件的标识，当初始化时为未打开false
                items:[],
                proxyServer:{
                    "proxyName":'',
                    "nodeId":'',
                },
                nodes:[],
            }
        },

        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                let node = that.$route.query;
                let nodeId = 0;
                if(typeof (node.nodeId)!="undefined"){
                    nodeId = node.nodeId;
                }
                sendGetAjax("node/getNodeProxyList?nodeId="+nodeId+"&time="+new Date().getTime(),true).then(function(sdata) {
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    $('#proxy_table').dataTable().fnDestroy();//销毁之前的table
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#proxy_table'),[]);
                    });
                });

            },
            //供子组件调用的方法，改变父组件的opmenDomain的值
            changeThisOpenDomain(f){
                this.openChild = f;
            },

            //创建代理服务器打开模态框
            createObj () {
                //清空表单数据
                this.proxyServer={
                    "proxyName":'',
                    "nodeId":'',
                };
                let that = this;
                //获取所有节点
                sendGetAjax("node/getNodeList",true).then(function(sdata) {
                    that.nodes = sdata.data;
                });
                //初始化模态框里面的数据
                initModal($('#create_modal'));
            },
            //删除代理服务器
            deleteProxy(proxy){
                let that = this;
                if(proxy.ipNum != 0){
                    that.$message({
                        message:"该代理服务器下拥有IP，不可删除",
                        type:'error',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                that.$confirm('确定要删除该代理服务器吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(() => {
                    let proxyId = proxy.proxyId;
                    sendGetAjax("node/delProxyById?proxyId="+proxyId,true).then(function(sdata) {
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

            //添加代理服务器提交
            subAddObj() {
                let that = this;
                //表单验证
                let alertMsg = "";
                if(that.proxyServer.proxyName==""){
                    alertMsg = "请正确填写节点名字";
                }
                if(that.proxyServer.nodeId==""){
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
                sendAjax("node/addProxy",true,that.proxyServer).then(function(sdata) {
                    if(sdata.code=="000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        //清空滞留数据
                        that.proxyServer = {
                            "proxyName":'',
                            "nodeId":'',
                        };
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
            }
        }
    }
</script>
