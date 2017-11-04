<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <div style="overflow-x:scroll;height: 700px;">
                <table id="order_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
                    <thead>
                    <tr>
                        <th>选择</th>
                        <th>IP</th>
                        <th>服务器编号</th>
                        <th>节点</th>
                        <th>线路类型</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in items">
                        <td>
                            <template>
                                <el-checkbox :id="index" class="moreCheck" />
                            </template>
                        </td>
                        <td>{{item.proxyIp.ipStr}}</td>
                        <td>{{item.proxy.proxyName}}</td>
                        <td>{{item.node.nodeName}}</td>
                        <td v-if="item.proxyIp.linkType==0">电信</td>
                        <td v-else>联通</td>
                    </tr>
                    </tbody>
                </table>
                <div style="text-align: center">
                    <button type="button" @click="doAllot()" data-dismiss="modal" class="btn btn-info">确定分配</button>
                </div>
            </div>
        </div>
    </div>


</template>

<style scoped>
</style>

<script>
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import select2 from '@/components/select2/select2.js';

    export default {
        beforeCreate(){//初始化之前

        },
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
            this.$emit('changeOpenDomain',true);
            this.init4table();
        },
        mounted() {//初始化时，组装datatable，
            initDataTable($('#order_table'),[]);
        },
        data() {//页面所需的数据
            return {
                openChild:false,//是否打开了子组件的标识，当初始化时为未打开false
                items:[],
            }
        },
        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                sendGetAjax("subscribe/getDisProxyip4Sub",true).then(function(sdata) {
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
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

            //分配提交
            doAllot(){
                let that = this;
                //拿到table中的所有数据
                let items = that.items;
                var objs = $(".moreCheck");
                var arrobjs = new Array();
                $.each(objs,function(i,obj){
                    let index = $(obj).prop("id");
                    let flag = $($(obj).children("span")).hasClass("is-checked");
                    if(flag){
                        arrobjs.push(items[index]);
                    }
                });
                //订单
                let sparam = that.$route.query;
                //订单的信息
                let id = sparam.id;
                let serviceCount = sparam.serviceCount;
                let ipCount = sparam.ipCount;
                let ttl = sparam.ttl;

                let num = serviceCount*ipCount;
                if(arrobjs.length!=num){
                    that.$message({
                        message:"IP数量与订单IP数量不一致",
                        type:'error',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                let arripstr = new Array();
                $.each(arrobjs,function(i,obj){
                    arripstr.push(obj.proxyIp.ipStr);
                });
                let paramAssist = {"list":arripstr,"obj":id};
                sendAjax("subscribe/disProxyip4Sub",true,paramAssist).then(function(msg) {
                    if(msg.code=="000"){
                        that.$message({
                            message:msg.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        that.$router.push({path:"/operation/order"});
                    }else{
                        that.$message({
                            message:msg.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },
        },
    }
</script>
