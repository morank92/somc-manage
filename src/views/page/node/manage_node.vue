<template>
    <div class="app-container panel panel-default">
        <div class="row" style="margin-left:8px;margin-bottom:20px;">
            <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <table id="node_table" class="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th style="text-align: center;">选择</th>
                    <th style="text-align: center;">节点名称</th>
                    <th style="text-align: center;">区域</th>
                    <th style="text-align: center;">清洗带宽(G)</th>
                    <th style="text-align: center;">客户</th>
                    <th style="text-align: center;">设备</th>
                    <th style="text-align: center;">代理</th>
                    <th style="text-align: center;">使用率</th>
                    <th style="text-align: center;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items">
                    <td><div class="c-checkbox"><input name="choose_tr" type="checkbox"></div></td>
                    <td>{{item.node.nodeName}}</td>
                    <td>{{item.node.regionProvince+item.node.regionCity}}</td>
                    <td>{{item.node.bandwidth}}</td>
                    <td><a @click="trCustomer(item,$event)">{{item.node.userNum}}</a></td>
                    <td><router-link :to="{path:'/node/device_node',query:item.node}">{{item.node.deviceNum}}</router-link></td>
                    <td><router-link :to="{path:'/node/proxy_node',query:item.node}">{{item.node.proxyNum}}</router-link></td>
                    <td>
                        <a @click="trUsed(item,$event)">
                        <div class="progress progress-striped" style="margin-top:10px;height: 18px;">
                            <div v-if="item.resUsage==0">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: 8 + '%'}">
                                    0%
                                </div>
                            </div>
                            <div v-else-if="item.resUsage<30">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.resUsage + '%'}">
                                    {{item.resUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.resUsage >= 30 && item.resUsage < 70">
                                <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.resUsage + '%'}">
                                    {{item.resUsage}}%
                                </div>
                            </div>
                            <div v-else-if="item.resUsage >= 70">
                                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                     :style="{width: item.resUsage + '%'}">
                                    {{item.resUsage}}%
                                </div>
                            </div>
                        </div>
                        </a>
                    </td>
                    <td><a @click="deleteNode(item.node)">删除</a></td>
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
                        <h4 class="modal-title">新增节点</h4>
                    </div>
                    <div class="modal-body">
                        <form :model="node" class="form-horizontal" style="margin-top:20px;" >
                            <div class="form-group">
                                <label class="control-label col-md-4">
                                    节点名称
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="node.nodeName">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4">
                                   所在区域
                                </label>
                                <div class="col-md-3">
                                    <template>
                                        <el-select v-on:change="provinceChange()" filterable v-model="province" placeholder="请选择" style="width: 100%">
                                            <el-option
                                                    v-for="item in provinces"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div>
                                <div class="col-md-3">
                                    <template>
                                        <el-select v-model="node.regionCity" filterable placeholder="请选择" style="width: 100%">
                                            <el-option
                                                    v-for="item in citys"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4">
                                   清洗带宽
                                </label>
                                <div class="col-md-3">
                                    <el-input  v-model="node.bandwidth">
                                        <template slot="append">G</template>
                                    </el-input>
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
    import provinces from '@/api/city.json';
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';

  export default {
      created() {//初始化？
      },
      beforeMount(){//初始化之前获取数据，将数据set进data（）{}中

      },
      mounted() {//初始化时，组装datatable，
          this.init4table();
      },
    data() {//页面所需的数据
          return {
                items:[],
                node:{
                    "nodeName":"",
                    "bandwidth":"",
                    "regionProvince":"",
                    "regionCity":"",
                },
                provinces:[],
                province:{},
                citys:[],
          }
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let that = this;
            let time = new Date().getTime();
            sendGetAjax("node/getNodeList?time="+time,true).then(function(json) {
                that.items = json.data;
                $('#node_table').dataTable().fnDestroy();//销毁之前的table
                that.$nextTick(function () {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    initDataTable($('#node_table'), []);
                });
            });
        },
        //打开添加节点模态框
        createObj(){
            //清空表单
            this.node={
                "nodeName":"",
                "bandwidth":"",
                "regionProvince":"",
                "regionCity":"",
            };
            //给省下拉赋值
            this.provinces = provinces;
            //清除省记录上次的值
            this.province = {};
            //城市下拉清空
            this.citys = [];
            initModal($('#create_modal'));
        },

        //省下拉列表切换
        provinceChange(){
            if(this.province.name==undefined)
            {
                this.node.regionProvince = "";
            }else
            {
                this.node.regionProvince = this.province.name;
            }

            //清空城市以选
            this.node.regionCity = "";
            //给城市下拉赋值
            this.citys = this.province.sub;
        },

        //删除节点
        deleteNode(node){
            let that = this;
            if(node.deviceNum!=0 || node.proxyNum != 0){
                that.$message({
                    message: "该节点下拥有设备或代理服务器信息，不可删除",
                    type: 'error',
                    customClass:'cus-message-class',
                });
                return;
            }
            that.$confirm('确定要删除该节点吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).then(() => {
                let nodeId = node.nodeId;
                sendGetAjax("node/deleteNode?nodeId="+nodeId+"&time="+new Date().getTime(),true).then(function(sdata){
                    if(sdata.code=="000"){
                        that.$message({
                            message: sdata.msg,
                            type: 'success',
                            customClass:'cus-message-class',
                        });
                        //清空滞留数据
                        that.node = {
                            "nodeName":"",
                            "bandwidth":"",
                            "regionProvince":"",
                            "regionCity":"",
                        };
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

        //添加节点提交
        subAddObj(){
            let that = this;
            //验证表单
            let alertMsg = "";
            if(that.node.bandwidth=="" || isNaN(parseInt(that.node.bandwidth))){
                alertMsg = "请正确填写清洗带宽";
            }
            if(that.node.regionCity==""){
                alertMsg = "请选择节点城市";
            }
            if(that.node.regionProvince==""){
                alertMsg = "请选择节点省份";
            }
            if(that.node.nodeName==""){
                alertMsg = "请填写节点名称";
            }
            if(alertMsg!=""){
                that.$message({
                    message:alertMsg,
                    type:'warning',
                    customClass:'cus-message-class',
                });
                return;
            }
            sendAjax("node/addNewNode",true,that.node).then(function (sdata) {
                if(sdata.code=="000"){
                    that.$message({
                        message: sdata.msg,
                        type: 'success',
                    });
                    $('#create_modal').modal("hide");
                    that.init4table();
                }else{
                    that.$message({
                        message: sdata.msg,
                        type: 'error',
                    });
                }
            });
        },
    }
  }
</script>
