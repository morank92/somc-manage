<template>
    <div>
        <div class="col-md-3" style="margin-left:-8px;width:14%">
            <button @click="relateDomain" type="button" class="btn btn-info" >关联域名</button>
            <router-link :to="{path:'/operation/customer/fenceip',query:{userId:userId}}">
                <button type="button" class="btn btn-info"><i class="icon-reply">返回</i></button>
            </router-link>

        </div>
        <div class="col-md-3">
            <h4 style="margin-bottom: 20px;">当前高防IP为：<span style="color:#4db3ff;">{{fenceIp}}</span></h4>
        </div>


        <table id="domain_ip_table" class="table table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th>域名</th>
                    <th>接入CNAME</th>
                    <th>源站IP</th>
                    <th>线路</th>
                    <th>TTL</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in items" :key="item.domainId">
                <td>{{item.domainName}}</td>
                <td>{{item.cnameValue}}</td>
                <td>{{item.ipAddr}}</td>
                <td>
                    <div v-if="item.accessLine == 1">电信</div>
                    <div v-else-if="item.accessLine == 2">联通</div>
                    <div v-else-if="item.accessLine == 3">移动</div>
                </td>
                <td>
                    <div v-if="item.ttl == 0">AUTO</div>
                </td>
                <td>
                    <a @click="remove(item,$event)"><span  style="color:#4db3ff;">移除</span></a>&nbsp;&nbsp;
                </td>
            </tr>
            </tbody>
        </table>

        <!-- 模态框 -->
        <div id="relate_domain_modal" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document'>
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">选择域名</h4>
                    </div>
                    <div class="modal-body">
                        <table id="relate_domain_ip_table" class="table table-striped table-hover table-bordered">
                            <thead>
                            <tr>
                                <th>选择</th>
                                <th>域名</th>
                                <th>接入CNAME</th>
                                <th>源站IP</th>
                                <th>线路</th>
                                <th>TTL</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(tr,index) in domainItems" :key="tr.domainId">
                                <td><div class="c-checkbox">
                                    <input name="choose_tr" type="checkbox" >
                                    <input name="trData" type="hidden" :value="index" />
                                </div></td>
                                <td>{{tr.domainName}}</td>
                                <td>{{tr.cnameValue}}</td>
                                <td>{{tr.ipAddr}}</td>
                                <td>
                                    <div v-if="tr.accessLine == 1">电信</div>
                                    <div v-else-if="tr.accessLine == 2">联通</div>
                                    <div v-else-if="tr.accessLine == 3">移动</div>
                                </td>
                                <td>
                                    <div v-if="tr.ttl == 0">AUTO</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-1 col-md-offset-5">
                            <button type="button" @click="subFormData" class="btn btn-info">确定</button>
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

<script>
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';

    export default {
        beforeCreate(){//初始化之前
        },
        beforeMount(){//初始化之前获取数据，
            this.userId = this.$route.query.userId;
            this.fenceId = this.$route.query.fenceId;
            this.fenceIp = this.$route.query.fenceIp;
            //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
            this.$emit('changeOpenDomain',true);
            this.init4table();
        },
        mounted(){

        },
        data() {
            return {
                userId:{},
                fenceId:{},
                fenceIp:{},
                items:[],
                domainItems:[],//选择关联域名
                device:{
                    "type":'',
                    "ipStr":'',
                    "ttl":'',
                    "name":'',
                },
                trs:[],
            }
        },
        methods: {
            //初始获取表单数据
            init4table(){
                let that = this;
                let fenceId = this.fenceId;
                let time = new Date().getTime();
                let url = "fenceIp/getDomainByFenceIp?fenceId="+fenceId+"&time="+time;
                sendGetAjax(url,true).then(function (sdata) {
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    $('#domain_ip_table').dataTable().fnDestroy();//销毁之前的table
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#domain_ip_table'),[]);
                    });
                });

            },
            relateDomain(){
                let that = this;
                let userId = this.userId;
                let time = new Date().getTime();
                let url = "fenceIp/getAllDomainList?userId="+userId+"&time="+time;
                sendGetAjax(url,true).then(function (sdata) {
                    $('#relate_domain_ip_table').dataTable().fnDestroy();//销毁之前的table
                    that.domainItems = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        //初始化模态框里面的数据
                        initModal($('#relate_domain_modal'));
                        initDataTable($('#relate_domain_ip_table'),[]);
                    });
                });



            },
            subFormData(){//提交选中的域名关联
                let pids = [];
                let boxs = $('input[name=choose_tr]:checked');
                for(let i=0;i<boxs.length;i++){
                    let val = $(boxs[i]).parent().find('input[name=trData]').val();
                    let pid = this.domainItems[val].domainId;
                    pids.push(pid);
                }
                let that = this;
                let param = {"list":pids,"obj":this.fenceId};
                sendAjax("fenceIp/addDomainToFenceIp",true,param).then(function (sdata) {
                    if(sdata.code == "000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        $('#relate_domain_modal').modal('hide');
                        that.init4table();
                    }else if(sdata.code == "001"){
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });

            },
            remove(item,$event){//
                let time = new Date().getTime();
                let that = this;
                let url = "fenceIp/removeDomainFromFenceIp?fenceId="+this.fenceId+'&domainId='+item.domainId+'&time='+time;
                sendGetAjax(url,true).then(function (sdata) {
                    if(sdata.code == "000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        that.init4table();
                    }
                });
            },
        },
    }
</script>
<style >

</style>


