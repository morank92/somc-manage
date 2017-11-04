<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <table id="main_table" class="table table-striped table-hover table-bordered">
                <thead>
                <tr>
                    <th style="text-align: center;">用户</th>
                    <th style="text-align: center;">工单标题</th>
                    <th style="text-align: center;">工单类型</th>
                    <th style="text-align: center;">发起时间</th>
                    <th style="text-align: center;">结束时间</th>
                    <th style="text-align: center;">状态</th>
                    <th style="text-align: center;">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items">
                    <td>{{item.user.userName}}</td>
                    <td>{{item.title}}</td>
                    <td v-if="item.orderType == 0">域名</td>
                    <td v-else-if="item.orderType == 1">高防IP</td>
                    <td v-else-if="item.orderType == 2">服务</td>
                    <td v-else-if="item.orderType == 3">订单</td>
                    <td>{{item.commitDate}}</td>
                    <td>{{item.updateDate}}</td>
                    <td v-if="item.orderStatus == 0"><span class="label-info">未处理</span></td>
                    <td v-if="item.orderStatus == 1"><span class="label-success">已处理</span></td>
                    <td v-if="item.orderStatus == 0">
                        <a @click="workOrderDeal(item)"><span  style="color:#4db3ff;">处理</span></a>&nbsp;&nbsp;
                        <a @click="workOrderDetail(item)"><span style="color:#4db3ff;">详情</span></a>&nbsp;&nbsp;
                    </td>
                    <td v-if="item.orderStatus == 1">
                        <a @click="workOrderDetail(item)"><span style="color:#4db3ff;">详情</span></a>&nbsp;&nbsp;
                    </td>
                </tr>
                </tbody>
            </table>

            <!-- 工单详情页面 -->
            <div id="workOrder_modal" class="modal fade" tabindex='-1' role='dialog'>
                <div class="modal-dialog cus-modal" role='document'>
                    <div class="modal-content" style="height: 300px;">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title" id="myModalLabel">工单详情</h4>
                        </div>
                        <div class="modal-body">
                            <el-form ref="form" label-width="80px">
                                <el-form-item label="工单详情">
                                    <el-input type="textarea"  v-model="orderDesc"></el-input>
                                </el-form-item>
                            </el-form>
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
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';

    export default {
        beforeCreate(){//初始化之前
        },
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
                orderDesc:"",
            }
        },
        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                let sData = sendGetAjax("workOrder/getAllWorkOrder",true).then(function(sdata) {
                    $('#main_table').dataTable().fnDestroy();//销毁之前的table
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#main_table'),[]);
                    });
                });

            },
            //供子组件调用的方法，改变父组件的opmenDomain的值
            changeThisOpenDomain(f){
                this.openChild = f;
            },
            workOrderDeal(trData){
                let that = this;
                let orderId = trData.orderId;
                let msg = sendGetAjax("workOrder/disposeOrder?orderId="+orderId+"&time="+new Date().getTime(),true).then(function(msg) {
                    if(msg.code=='000'){
                        that.$message({
                            message:msg.msg,
                            duration:2000,
                            customClass:'cus-message-class',
                            type:'success',
                        });
                        that.init4table(); //重新加载数据
                    }else{
                        that.$message({
                            message:msg.msg,
                            duration:2000,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                    }
                });

            },
            workOrderDetail(item){
                this.orderDesc = "";
                initModal($("#workOrder_modal"));
                this.orderDesc = item.orderDesc;
            },
        },
    }
</script>