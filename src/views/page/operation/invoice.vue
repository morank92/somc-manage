<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <div style="overflow-x:scroll;height: 700px;">
                <table id="invoice_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
                    <thead>
                    <tr>
                        <th>用户名</th>
                        <th>发票类型</th>
                        <th>发票抬头</th>
                        <th>金额</th>
                        <th>收票人</th>
                        <th>联系电话</th>
                        <th>收票地址</th>
                        <th>提交日期</th>
                        <th>处理日期</th>
                        <th>发票状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in items">
                        <td>{{item.user.userName}}</td>
                        <td v-if="item.invoiceType==0">普通发票</td>
                        <td v-else>普通发票</td>
                        <td>{{item.invoiceTitle}}</td>
                        <td>{{item.invoiceAmt}}</td>
                        <td>{{item.contactUser}}</td>
                        <td>{{item.contactPhone}}</td>
                        <td>{{item.address}}</td>
                        <td>{{item.commitDate}}</td>
                        <td>{{item.completeDate}}</td>
                        <td v-if="item.invoiceStatus==0">
                            <span class="label label-default">未处理</span>
                        </td>
                        <td v-else="item.invoiceStatus==1">
                            <span class="label label-success">已处理</span>
                        </td>
                        <td v-if="item.invoiceStatus==0">
                            <a @click="doInvoice(item.invoiceId)"><span  style="color:#4db3ff;">处理</span></a>&nbsp;&nbsp;
                        </td>
                        <td v-else="item.invoiceStatus==1">处理</td>
                    </tr>
                    </tbody>
                </table>
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
        beforeCreate(){//初始化之前

        },
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            this.init4table();
        },
        mounted() {//初始化时，组装datatable，
            initDataTable($('#invoice_table'),[]);
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
                let sdata = sendGetAjax("invoice/getInvoice",true).then(function(sdata) {
                    $('#invoice_table').dataTable().fnDestroy();//销毁之前的table
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#invoice_table'),[]);
                    });
                });
            },
            //供子组件调用的方法，改变父组件的opmenDomain的值
            changeThisOpenDomain(f){
              this.openChild = f;
            },
            doInvoice(id){
                let that = this;
                sendGetAjax("invoice/updateInvoiceStatusById?id="+id+"&time="+new Date().getTime(),true).then(function(sdata) {
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
