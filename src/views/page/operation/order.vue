<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <div style="overflow-x:scroll;height: 700px;">
                <table id="order_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
                    <thead>
                    <tr>
                        <th>订单号</th>
                        <th>用户名</th>
                        <th>联系电话</th>
                        <th>下单时间</th>
                        <th>金额</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in items">
                        <td>{{item.subscriberId}}</td>
                        <td>{{item.user.userName}}</td>
                        <td>{{item.user.phoneNo}}</td>
                        <td>{{item.subscriberDate}}</td>
                        <td>{{item.amt}}</td>
                        <td v-if="item.payFlag==0">
                            <span class="label label-sm label-default">未支付</span>
                        </td>
                        <td v-else-if="item.payFlag==1">
                            <span class="label label-sm label-warning">已支付</span>
                        </td>
                        <td v-else>
                            <span class="label label-sm label-success">服务中</span>
                        </td>
                        <td v-if="item.payFlag==0">
                            <a @click="subPay(item.id)"><span  style="color:#4db3ff;">支付</span></a>
                            <a @click="subDetail(item)"><span  style="color:#4db3ff;">详情</span></a>
                            <a @click="subDelete(item.id)"><span  style="color:#4db3ff;">删除</span></a>
                        </td>
                        <td v-else-if="item.payFlag==1">
                            <a @click="subDetail(item)"><span  style="color:#4db3ff;">详情</span></a>
                            <router-link :to="{path:'/operation/order/allot',query:item}"><span  style="color:#4db3ff;">分配</span></router-link>
                        </td>
                        <td v-else>
                            <a @click="subDetail(item)"><span  style="color:#4db3ff;">详情</span></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- 订单详情页面 -->
            <div id="subDetail_modal" class="modal fade" tabindex='-1' role='dialog'>
                <div class="modal-dialog cus-modal" role='document'>
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 class="modal-title" id="myModalLabel">订单详情</h4>
                        </div>
                        <div class="modal-body">
                            <form action="#"  class="form-horizontal">
                                <div class="form-group">
                                    <span class="control-label col-md-2"><label>版本:</label></span>
                                    <span  class="control-label col-md-2">{{subscriber.version}}</span>
                                    <span class="control-label col-md-3"><label>线路:</label></span>
                                    <span  class="control-label col-md-2">{{subscriber.ttl}}</span>
                                </div>
                                <div class="form-group">
                                    <span class="control-label col-md-2"><label>IP个数:</label></span>
                                    <span  class="control-label col-md-2" >{{subscriber.ipCount}}</span>
                                    <span class="control-label col-md-3"><label>基础防护带宽(Gb):</label></span>
                                    <span  class="control-label col-md-2" >{{subscriber.basewidth}}</span>
                                </div>
                                <div class="form-group">
                                    <span class="control-label col-md-2"><label>弹性防护带宽(Gb):</label></span>
                                    <span  class="control-label col-md-2" >{{subscriber.expandwidth}}</span>
                                    <span class="control-label col-md-3"><label>业务防护带宽(M):</label></span>
                                    <span  class="control-label col-md-2" >{{subscriber.businesswidth}}</span>
                                </div>
                                <div class="form-group">
                                    <span class="control-label col-md-2"><label>购买时长:</label></span>
                                    <span class="control-label col-md-2" >{{subscriber.duration}}</span>
                                    <span class="control-label col-md-3"><label>防护域名个数:</label></span>
                                    <span  class="control-label col-md-2" >{{subscriber.domainCount}}</span>
                                </div>
                                <div class="form-group">
                                    <span class="control-label col-md-2"><label>购买数量:</label></span>
                                    <span class="control-label col-md-2" >{{subscriber.serviceCount}}</span>
                                    <span class="control-label col-md-3"><label>配置费用:</label></span>
                                    <span class="control-label col-md-2" style="font-size: 30px;color: red;">￥{{subscriber.amt}}</span>
                                </div>
                            </form>
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



    $.fn.modal.Constructor.prototype.enforceFocus = function () { };//解决multiselect的bug代码

    export default {
        beforeCreate(){//初始化之前

        },
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            this.init4table();
        },
        mounted() {//初始化时，组装datatable，
            initDataTable($('#order_table'),[]);
        },
        data() {//页面所需的数据
            return {
                openChild:false,//是否打开了子组件的标识，当初始化时为未打开false
                items:[],
                subscriber:{
                    "version":"",
                    "ttl":"",
                    "ipCount":"",
                    "basewidth":"",
                    "expandwidth":"",
                    "businesswidth":"",
                    "duration":"",
                    "domainCount":"",
                    "serviceCount":"",
                    "amt":""
                }
            }
        },
        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                sendGetAjax("subscribe/getAllSubscriber",true).then(function(sdata) {
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作
                    $('#order_table').dataTable().fnDestroy();//销毁之前的table
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#order_table'),[]);
                    });
                });
            },
            //供子组件调用的方法，改变父组件的opmenDomain的值
            changeThisOpenDomain(f){
              this.openChild = f;
            },
            //订单详情
            subDetail(item){
                this.subscriber = item;
                initModal("#subDetail_modal");
            },
            //订单支付（这里的支付管理员支付，属于线下支付，直接修改订单状态）
            subPay(id){
                let that = this;
                that.$confirm('确定用户线下已付款，此操作可能带来资金损失，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(() => {
                    sendGetAjax("subscribe/confirm2payForUser?id="+id+"&time="+new Date().getTime(),true).then(function(sdata) {
                        if(sdata.code=="000"){
                            that.$message({
                                message:sdata.msg,
                                type:'success',
                                customClass:'cus-message-class',
                            });
                        }else{
                            that.$message({
                                message:sdata.msg,
                                type:'error',
                                customClass:'cus-message-class',
                            });
                        }
                        that.init4table();//刷新列表
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消支付',
                        customClass:'cus-message-class',
                    })
                })
            },
            //订单删除
            subDelete(id){
                let that = this;
                sendGetAjax("subscribe/deleteSubscribe?id="+id+"&time="+new Date().getTime(),true).then(function(sdata) {
                    if(sdata.code=="000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                    }
                    that.init4table();//刷新列表
                });
            },
        },
    }
</script>
