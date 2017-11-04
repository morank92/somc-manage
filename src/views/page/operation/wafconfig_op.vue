<template>
    <div>
        <div class="panel panel-default">
            <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">WAF服务信息</div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">版本：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.wafVersion}}</label>
                    </div>
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">带宽（M）：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.bandWidth}}</label>
                    </div>
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">时长：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.durationStr}}</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">开始时间：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.startTime}}</label>
                    </div>
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">到期时间：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.endTime}}</label>
                    </div>
                    <div class="col-md-3" style="margin: auto">
                        <label class="col-md-5">描述：</label>
                        <label class="col-md-7" style="font-weight: 500">{{wafInstance.description}}</label>
                    </div>
                </div>
            </div>
        </div>

        <div style="overflow-x:scroll;height:600px;display:block">
            <div class="col-md-3" style="margin-left: -15px;margin-bottom: 10px;">
                <button @click="relateDomain" type="button" class="el-button el-button--primary" >分配站点</button>
                <router-link :to="{path:'/operation/customer/waf',query:{userId:userId}}">
                    <button type="button" class="el-button el-button--primary">返回</button>
                </router-link>
            </div>
            <table id="waf_site_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
                <thead>
                    <tr>
                        <th>站点名称</th>
                        <th>域名</th>
                        <th>域名IP</th>
                        <th>域名个数</th>
                        <th>IP来源</th>
                        <th>请求体检测</th>
                        <th>响应体检测</th>
                        <th>日志等级</th>
                        <th>状态</th>
                        <th>策略</th>
                        <th>防护</th>
                        <th>提醒邮箱</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in items" :key="item.id">
                    <td>{{item.name}}</td>
                    <td><div v-for="(temp,index) in item.domains.split(' ')">{{temp}}</div></td>
                    <td>{{item.ip_addr}}</td>
                    <td>{{item.domains.split(" ").length}}</td>
                    <td>
                        <div v-if="item.ip_src == 'remote_addr'">源IP</div>
                        <div v-else-if="item.ip_src == 'x_real_ip'">X-Real-IP</div>
                        <div v-else-if="item.ip_src == 'x_forwarded_for'">X-Forwarded-For</div>
                    </td>
                    <td>
                        <div v-if="item.check_request_body == 1">启用</div>
                        <div v-else-if="item.check_request_body == 0">禁用</div>
                    </td>
                    <td>
                        <div v-if="item.check_response_body == 1">启用</div>
                        <div v-else-if="item.check_response_body == 0">禁用</div>
                    </td>
                    <td>
                        <div v-if="item.log_level == 'all'">全部(请求头+请求体+响应头+响应体)</div>
                        <div v-else-if="item.log_level == 'default'">默认(请求头+响应头)</div>
                        <div v-else-if="item.log_level == 'detail'">详细(请求头+请求体+响应头)</div>
                        <div v-else-if="item.log_level == 'base'">基本(请求头)</div>
                    </td>
                    <td>
                        <div v-if="item.audit_status == 1">启用</div>
                        <div v-else-if="item.audit_status == 0">禁用</div>
                    </td>
                    <td>{{item.policy_id}}</td>
                    <td>--</td>
                    <td>{{item.tamper_recv_mail}}</td>
                    <td>
                        <a @click="editSite(item,$event)"><span  style="color:#4db3ff;">编辑</span></a>&nbsp;&nbsp;
                        <a @click="remove(item,$event)"><span  style="color:#4db3ff;">移除</span></a>&nbsp;&nbsp;
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

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
                        <form class="form-horizontal" style="margin-top:20px;">
                            <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">基础配置</div><br>
                            <div class="form-group">
                                <label class="control-label col-md-3">一级域名</label>
                                <div class="col-md-2">
                                    <el-select v-model="sldName" placeholder="请选择" style="width: 100%;" @change="changeValue">
                                        <el-option
                                                v-for="sldName in sldNames"
                                                :key="sldName"
                                                :label="sldName"
                                                :value="sldName"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                                <label class="control-label col-md-3">节点</label>
                                <div class="col-md-2">
                                    <el-select v-model="nodeId" v-on:change="nodeChange()" filterable placeholder="请选择节点" style="width:100%">
                                        <el-option
                                                v-for="item in nodes"
                                                :key="item.node.nodeId"
                                                :label="item.node.nodeName"
                                                :value="item.node.nodeId">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3">设备</label>
                                <div class="col-md-2">
                                    <el-select v-model="deviceId" v-on:change="deviceChange()" filterable placeholder="请选择设备" style="width:100%">
                                        <el-option
                                                v-for="item in devices"
                                                :key="item.deviceId"
                                                :label="item.deviceType"
                                                :value="item.deviceId">
                                        </el-option>
                                    </el-select>
                                </div>
                                <label class="control-label col-md-3">策略</label>
                                <div class="col-md-2">
                                    <el-select v-model="strategyId" filterable placeholder="请选择策略" style="width:100%">
                                        <el-option
                                                v-for="item in strategys"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3">地址</label>
                                <div class="col-md-2">
                                    <el-select v-model="network" filterable placeholder="请选择地址" style="width:100%">
                                        <el-option
                                                v-for="item in networks"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </form>
                        <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">域名选择</div><br>
                        <div class="form-group">
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
                            <tr v-for="(domain,index) in domains" :key="domain.domainId">
                                <td>
                                    <template>
                                        <el-checkbox :id="index" class="moreCheck create-site-check"/>
                                    </template>
                                </td>
                                <td>{{domain.domainName}}</td>
                                <td>{{domain.cnameValue}}</td>
                                <td>{{domain.ipAddr}}</td>
                                <td>
                                    <div v-if="domain.accessLine == 1">电信</div>
                                    <div v-else-if="domain.accessLine == 2">联通</div>
                                    <div v-else-if="domain.accessLine == 3">移动</div>
                                </td>
                                <td>
                                    <div v-if="domain.ttl == 0">AUTO</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
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

        <!-- 修改站点域名列表模态框 -->
        <div id="edit_site_domain_modal" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document'>
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">选择域名</h4>
                    </div>
                    <div class="modal-body">
                        <table id="edit_site_domain_table" class="table table-striped table-hover table-bordered">
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
                            <tr v-for="(domain,index) in conditionDomain" :key="domain.domainId">
                                <td>
                                    <template>
                                        <el-checkbox :id="domain.domainId" class="site-domain-check" v-if="tempEditSite.domains.indexOf(domain.domainName)!=-1" checked />
                                        <el-checkbox :id="domain.domainId" v-else class="site-domain-check" />
                                    </template>
                                </td>
                                <td>{{domain.domainName}}</td>
                                <td>{{domain.cnameValue}}</td>
                                <td>{{domain.ipAddr}}</td>
                                <td>
                                    <div v-if="domain.accessLine == 1">电信</div>
                                    <div v-else-if="domain.accessLine == 2">联通</div>
                                    <div v-else-if="domain.accessLine == 3">移动</div>
                                </td>
                                <td>
                                    <div v-if="domain.ttl == 0">AUTO</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-1 col-md-offset-5">
                            <button type="button" @click="editSiteDomainsSubmit()" class="btn btn-info">确定</button>
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
            this.wafInstanceId = this.$route.query.wafInstId;
            this.initWafInstance();
            //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
            this.$emit('changeOpenDomain',true);
        },
        mounted(){

        },
        data() {
            return {
                userId:{},
                items:[],
                wafInstanceId:{},
                nodes:[],
                devices:[],
                nodeId:'',
                deviceId:'',
                strategys:[],
                strategyId:'',
                networks:[],
                network:'',
                wafInstance:{
                    "id":'',
                    "userId":'',
                    "description":'',
                    "domainPackage":'',
                    "domainAsset":'',
                    "bandWidth":'',
                    "duration":'',
                    "startTime":'',
                    "endTime":'',
                    "wafVersion":'',
                    "durationStr":'',
                    "domainCount":'',
                    "siteCount":'',
                    "sites":[],
                },
                sldNames:[],
                domains:[],
                sldName:'',
                conditionDomain:[], //未受waf防护，审核通过，一定IP的域名列表
                tempEditSite:{},//正在编辑的站点
            }
        },
        methods: {
            //获取WAF服务信息
            initWafInstance(){
                let that = this;
                let wafInstanceId = this.wafInstanceId;
                let time = new Date().getTime();
                let url = "fenceWaf/getWafInstById?id="+wafInstanceId+"&time="+time;
                sendGetAjax(url,true).then(function (sdata) {
                    that.wafInstance = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.items = sdata.data.sites;
                    $('#waf_site_table').dataTable().fnDestroy();//销毁之前的table
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#waf_site_table'),[]);
                    });
                });
            },
            //关联域名创建新的站点
            relateDomain(){
                let that = this;
                let userId = this.userId;
                let time = new Date().getTime();
                that.sldName='';
                that.sldNames=[];
                //选中节点id
                that.nodeId = '';
                //设备集合
                that.devices = [];
                //选中设备id
                that.deviceId = '';
                //策略集合
                that.strategys=[];
                //选中策略id
                that.strategyId = '';
                //网络地址集合
                that.networks = [];
                //选中网络地址
                that.network = '';
                sendGetAjax("node/getNodeList",true).then(function(sdata) {
                    that.nodes = sdata.data;
                    let url = "domain/getSldNameByUserId?userId=" + that.userId + "&time=" + time;
                    initModal($('#relate_domain_modal'));
                    sendGetAjax(url,true).then(function (sdata) {
                        $('#relate_domain_ip_table').dataTable().fnDestroy();//销毁之前的table
                        that.sldNames = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                        that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                            //初始化模态框里面的数据
                            initDataTable($('#relate_domain_ip_table'),[]);
                        });
                    });
                });
            },
            changeValue(val){
                let that = this;
                that.domains = [];
                that.domain = "";
                $('#relate_domain_ip_table').dataTable().fnDestroy();//销毁之前的table
                sendGetAjax("domain/getDomainNoWafBySldName?sldName="+that.sldName+"&userId="+that.userId,true,1).then(function (sdata) {
                    $('#relate_domain_ip_table').dataTable().fnDestroy();//销毁之前的table
                    that.domains = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        //初始化模态框里面的数据
                        initDataTable($('#relate_domain_ip_table'),[]);
                    });
                });
            },
            subFormData(){//提交选中的域名关联
                let alertMsg = "";
                let that = this;
                let sldDomain = {
                    'sldName':'',
                    'domains':[],
                };
                sldDomain.sldName = that.sldName;
                //被选中的对象
                let objs = $(".moreCheck");
                for(let i=0;i<objs.length;i++){
                    let index = $(objs[i]).prop("id");
                    let flag = $($(objs[i]).children("span")).hasClass("is-checked");
                    if(flag){
                        sldDomain.domains.push(that.domains[index]);//将选择的对象id放入数组中
                    }
                };
                if(sldDomain.domains.length==0){
                    alertMsg="请勾选域名";
                }
                if(this.sldName==""){
                    alertMsg="请选择一级域名";
                }
                if(this.strategyId==""){
                    alertMsg="请选择策略";
                }
                if(this.network==""){
                    alertMsg="请选择地址";
                }
                if(this.deviceId==""){
                    alertMsg="请选择设备";
                }
                if(this.nodeId==""){
                    alertMsg="请选择节点";
                }

                if(alertMsg!=""){
                    that.$message({
                        message:alertMsg,
                        type:'warning',
                        customClass:'cus-message-class',
                    });
                    return;
                }

                let param = {"wafInstId":that.wafInstanceId,"sldDomain":sldDomain,"deviceId":that.deviceId,"strategyId":that.strategyId,"address":that.network};
                sendAjax("fenceWaf/doWafConfig",true,param).then(function (sdata) {
                    if(sdata.code == "000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        $('#relate_domain_modal').modal('hide');
                        that.initWafInstance();
                        //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
                        that.$emit('changeOpenDomain',true);
                    }else if(sdata.code == "001"){
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },
            //删除站点
            remove(item,$event){
                let that = this;
                that.$confirm('确定要删除该站点吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(() => {
                    let time = new Date().getTime();
                    let url = "fenceWaf/delSite?siteId=" + item.id +'&deviceId='+item.device_id+ '&time='+time;
                    sendGetAjax(url,true).then(function (sdata) {
                        if(sdata.code == "000"){
                            that.$message({
                                message:sdata.msg,
                                type:'success',
                                customClass:'cus-message-class',
                            });
                            that.initWafInstance();
                            //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
                            that.$emit('changeOpenDomain',true);
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
            //编辑站点中的域名列表
            editSite(item,$event){
                let that = this;
                that.tempEditSite = item;
                var ip_addr = that.tempEditSite.ip_addr;
                var status = 3;
                let url = "userDomain/getDomainByField?ip_addr=" + ip_addr +'&status='+status+'&userId='+that.userId+ '&time='+new Date().getTime();
                sendGetAjax(url,true).then(function (sdata) {
                    if(sdata.code == "000"){
                        that.conditionDomain = sdata.data;
                        $('#edit_site_domain_table').dataTable().fnDestroy();
                        that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                            //初始化模态框里面的数据
                            initModal($('#edit_site_domain_modal'));
                            //初始化模态框里面的数据
                            initDataTable($('#edit_site_domain_table'),[]);
                        });
                    }else{
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },

            //修改站点域名列表提交
            editSiteDomainsSubmit(){
                let domainIds = [];
                let siteId = this.tempEditSite.id;
                //将站点IP也放到集合里 放在0下标，方便传参，后台直接取第一位
                domainIds.push(siteId);
                //将站点IP也放到集合里 放在1下标，方便传参，后台直接取第2位
                domainIds.push(this.tempEditSite.device_id);

                let checkedInputs = $(".site-domain-check :checked");
                $.each(checkedInputs,function(index,obj){
                    let domainId =$(obj).parent().parent().prop("id");
                    domainIds.push(domainId);
                });
                let that = this;
                sendAjax("fenceWaf/updateSiteDomains",true,domainIds).then(function (sdata) {
                    if(sdata.code == "000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        $("#edit_site_domain_modal").modal("hide");
                        that.initWafInstance();
                    }else{
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },
            //选择节点切换
            nodeChange(){
                //根据节点ID查询waf设备
                let url = "node/getWAFDeviceList?nodeId="+this.nodeId+"&deviceUse="+"WAF";
                let that = this;
                that.devices = [];
                that.deviceId = '';
                that.strategys=[];
                that.strategyId = '';
                that.networks = [];
                that.network = '';
                sendGetAjax(url,true,1).then(function (sdata) {
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        that.devices = sdata.data;
                        console.log(that.devices);
                    });
                });
            },
            //设备切换事件
            deviceChange(){
                //根据设备ID查询waf设备策略
                let url1 = "node/getDeviceStrategyList?deviceId="+this.deviceId;
                let that = this;
                that.strategys=[];
                that.strategyId = '';
                that.networks = [];
                that.network = '';
                sendGetAjax(url1,true,1).then(function (sdata) {
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        that.strategys = sdata.data;
                    });
                });
                //根据设备id查询waf设备配置的网络地址
                let url2 = "node/getDeviceNetWorkList?deviceId="+this.deviceId;
                sendGetAjax(url2,true,1).then(function (sdata) {
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        that.networks = sdata.data;
                    });
                });

            }
        },

    }
</script>
<style >

</style>


