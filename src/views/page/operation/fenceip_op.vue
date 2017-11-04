<template>
    <div>
        <div class="row" style="margin-left:8px;margin-bottom:20px;">
            <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <div style="overflow-x:scroll;height:600px;">
            <table id="fenceip_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
                <thead>
                <tr>
                    <th style='text-align: center;'>实例ID</th>
                    <th style='text-align: center;'>基础带宽(Mbps)</th>
                    <th style='text-align: center;'>业务带宽(Mbps)</th>
                    <th style='text-align: center;'>扩展带宽(Mbps)</th>
                    <th style='text-align: center;'>开始时间</th>
                    <th style='text-align: center;'>到期时间</th>
                    <th style='text-align: center;'>价钱(元)</th>
                    <th style='text-align: center;'>当前防护状态</th>
                    <th style='text-align: center;'>高防IP</th>
                    <th style='text-align: center;'>线路</th>
                    <th style='text-align: center;'>防护域名个数</th>
                    <th style='text-align: center;'>配置</th>
                    <th style='text-align: center;'>操作</th>
                </tr>
                </thead>
                <tbody v-for="(ddosInstance,index) in items" :key="ddosInstance.id">
                    <tr v-for="(fenceIp,flag) in ddosInstance.fenceIpList" :key="ddosInstance.id">
                        <td style='text-align: center;vertical-align: middle;' :rowspan=ddosInstance.fenceIpList.length v-if="flag==0">{{ddosInstance.id}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.baseWidth}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.busiWidth}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.exWidth}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.startTime}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.endTime}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">{{ddosInstance.price}}</td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">
                            <div :v-if="ddosInstance.status == 1">
                                <span class="label label-sm label-success">正常</span>
                            </div>
                            <div :v-else-if="ddosInstance.status == 2">
                                <span class="label label-sm label-denger">异常</span>
                            </div>
                        </td>
                        <td style='text-align: center;vertical-align: middle;'>{{fenceIp.fenceIp}}</td>
                        <td style='text-align: center;vertical-align: middle;'>{{fenceIp.ttl}}</td>
                        <td style='text-align: center;vertical-align: middle;'>{{fenceIp.realityDomainCount}}</td>
                        <td style='text-align: center;vertical-align: middle;'>
                            <router-link :to="{path:'/operation/customer/config',query:{userId:ddosInstance.userId,fenceId:fenceIp.fenceId,fenceIp:fenceIp.fenceIp}}">
                                <span style="color:#4db3ff;">安全配置</span>
                            </router-link>
                        </td>
                        <td style='text-align: center;vertical-align: middle;' :rowspan="ddosInstance.fenceIpList.length" v-if="flag==0">
                            &emsp;
                            <a @click="removeDdosInstance(ddosInstance,$event)"><span  style="color:#4db3ff;">移除</span></a>&nbsp;&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 模态框 -->
        <div id="create_modal" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document'>
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">创建高防IP实例</h4>
                    </div>
                    <div class="modal-body">
                        <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">基础配置</div>
                        <div class="panel-body">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label class="control-label col-md-2">
                                        基础带宽
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.baseWidth">
                                            <template slot="append">Mbps</template>
                                        </el-input>
                                    </div>
                                    <label class="control-label col-md-2">
                                        弹性带宽
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.exWidth">
                                            <template slot="append">Mbps</template>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-2">
                                        业务带宽
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.busiWidth">
                                            <template slot="append">Mbps</template>
                                        </el-input>
                                    </div>
                                    <label class="control-label col-md-2">
                                        防护域名数
                                    </label>
                                    <div class="col-md-3">
                                        <input class="form-control" type='text' v-model="instance.domainCount">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-2">时长</label>
                                    <div class="col-md-3">
                                        <el-select v-model="instance.duration" placeholder="请选择" style="width: 100%;">
                                            <el-option
                                                    v-for="item in durationObjs"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <label class="control-label col-md-2">
                                        价钱
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.price">
                                            <template slot="append">元</template>
                                        </el-input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">选择IP</div>
                        <div class="panel-body">
                            <form class="form-horizontal">
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
                                    <tr v-for="(item,index) in fenceIps">
                                        <td>
                                            <template>
                                                <el-checkbox :id="index" class="moreCheck"  />
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
                            </form>
                        </div>
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

<script>
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';

  export default {
      beforeCreate(){//初始化之前
      },
      beforeMount(){//初始化之前获取数据，
          //通过父组件中绑定该视图上的事件来改变父组件的show的条件开关
          this.$emit('changeOpenDomain',true);
          let rparam = this.$route.query;//路由传过来的参数
          this.userId = rparam.userId;
          this.init4table();
      },
      mounted(){

      },
    data() {
      return {
          userId:{},
          items:[],
          instance:{
              "userId":"",
              "baseWidth":'',
              "exWidth":'',
              "busiWidth":'',
              "duration":'',
              "domainCount":'',
              "price":'',
          },
          fenceIps:[],
          durationObjs:[
              {"label":"1个月","value":1},{"label":"2个月","value":2},{"label":"3个月","value":3},{"label":"4个月","value":4},
              {"label":"5个月","value":5},{"label":"6个月","value":6},{"label":"12个月","value":12},{"label":"24个月","value":24},
          ],
      }
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let userId = this.userId;
            let time = new Date().getTime();
            let url = "fenceIp/getFenceIp?userId="+userId+"&time="+time;
            let that = this;
            sendGetAjax(url,true).then(function (sdata) {
                that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                $('#fenceip_table').dataTable().fnDestroy();//销毁之前的table
                that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
//                    initDataTable($('#fenceip_table'),[]);
                });
            });
        },
        init4fenceIpTable(){
            let that = this;
            sendGetAjax("subscribe/getDisProxyip4Sub",true).then(function(sdata) {
                that.fenceIps = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                $('#order_table').dataTable().fnDestroy();//销毁之前的table
                that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    initDataTable($('#order_table'),[]);
                });
            });
        },
        createObj(){
            //初始化模态框里面的数据
            this.instance = {
                            "userId":this.userId,
                            "baseWidth":'',
                            "exWidth":'',
                            "busiWidth":'',
                            "price":'',
                            "duration":'',
                            "domainCount":''};
            this.init4fenceIpTable();
            initModal($('#create_modal'));
        },
        //删除ddos实例
        removeDdosInstance(ddosInstance,$event){
            let that = this;
            let flag = 0;
            $.each(ddosInstance.fenceIpList,function(index,fenceIp){
                if(fenceIp.realityDomainCount!=0){
                    that.$message({
                        message:"该实例下已有防护域名，请先取消防护",
                        type:'info',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    flag = 1;
                    return;
                }
            });
            if(flag==1){
                return;
            }
            //删除实例
            sendGetAjax("fenceIp/deleteDdosInstance?id="+ddosInstance.id,true).then(function (sdata) {
                if(sdata.code === "000"){
                    that.$message({
                        message:sdata.msg,
                        type:'success',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    that.init4table();//刷新列表
                }else{
                    that.$message({
                        message:"网络异常!",
                        type:'error',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                }
            });
        },
        //创建ddos实例
        subAddObj(){
            let that = this;
            let ins = this.instance;
            //被选中的对象
            let objs = $(".moreCheck");
            let fenceIps = [];
            for(let i=0;i<objs.length;i++){
                let index = $(objs[i]).prop("id");
                let flag = $($(objs[i]).children("span")).hasClass("is-checked");
                if(flag){
                    fenceIps.push(this.fenceIps[index].proxyIp);//将选择的对象id放入数组中
                }
            };
            let alertMsg = "";
            if(fenceIps.length==0){
                alertMsg = "至少选择一个高防IP";
            }
            if(ins.price=="" || isNaN(parseInt(ins.price))){
                alertMsg = "请填写正确的价格";
            }
            if(ins.duration==""){
                alertMsg = "请填写正确的时长";
            }
            if(ins.domainCount=="" || isNaN(parseInt(ins.domainCount))){
                alertMsg = "请填写正确的防护域名数";
            }
            if(ins.busiWidth=="" || isNaN(parseInt(ins.busiWidth))){
                alertMsg = "请填写正确的业务带宽";
            }
            if(ins.exWidth=="" || isNaN(parseInt(ins.exWidth))){
                alertMsg = "请填写正确的弹性带宽";
            }
            if(ins.baseWidth=="" || isNaN(parseInt(ins.baseWidth))){
                alertMsg = "请填写正确的基础带宽";
            }
            if(alertMsg!=""){
                that.$message({
                    message:alertMsg,
                    type:'warning',
                    customClass:'cus-message-class',
                });
                return;
            }
            //提交
            let param = {"ddosInstance":this.instance,"proxyIps":fenceIps};
            sendAjax("subscribe/createDdosInstance",true,param).then(function (sdata) {
                if(sdata.code === "000"){
                    that.$message({
                        message:"创建成功!",
                        type:'success',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    $('#create_modal').modal("hide");
                    that.init4table();//刷新列表
                }else{
                    that.$message({
                        message:"网络异常!",
                        type:'error',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                }
            });
        }
    },
  }
</script>
<style >

</style>


