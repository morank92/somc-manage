<template>
    <div style="overflow-x:scroll;height:700px;">
        <div class="row" style="margin-left:8px;margin-bottom:20px;" >
            <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <table id="domain_table" class="table table-striped table-hover table-bordered" style="white-space:nowrap">
            <thead>
            <tr>
                <th>域名</th>
                <th>一级域名</th>
                <th>主机记录</th>
                <th id="access_line_th">线路</th>
                <th id="ttl_th">TTL</th>
                <th>IP地址</th>
                <th id="protocol">协议</th>
                <th>端口</th>
                <th>后端端口</th>
                <th>更新时间</th>
                <th>状态</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in items" :key="item.domainId">
                <td>{{item.domainName}}</td>
                <td>{{item.sldName}}</td>
                <td>{{item.recordName}}</td>
                <td>
                    <select class="form-control" v-model="item.accessLine" disabled="disabled" style="height:3%;width: 82%;">
                        <option value="1">电信</option>
                        <option value="2">联通</option>
                        <option value="3">移动</option>
                    </select>
                </td>
                <td>
                    <select class="form-control" v-model="item.ttl" disabled="disabled" style="height:3%;width: 80%;">
                        <option value="0">AUTO</option>
                    </select>
                </td>
                <td>
                    <input class="form-control" type='text' v-model="item.ipAddr" disabled="disabled" style="height:3%;width: 80%;"/>
                </td>
                <td>
                    <input class="form-control" type='text' v-model="item.protocol" disabled="disabled" style="height:3%;width: 80%;"/>
                </td>
                <td>
                    <input class="form-control" type='text' v-model="item.protocolPort" disabled="disabled" style="height:3%;width: 80%;"/>
                </td>
                <td>
                    <input class="form-control" type='text' v-model="item.backendProtocolPort" disabled="disabled" style="height:3%;width: 80%;"/>
                </td>
                <td>{{item.updateTime}}</td>
                <td>
                    <div name="status_select" style="display: none;">
                        <select class="form-control" v-model="item.status" style="height:3%;width: 80%;">
                            <option value="0">失效</option>
                            <option value="1">待审核</option>
                            <option value="2">审核未通过</option>
                            <option value="3">审核通过</option>
                        </select>
                    </div>
                    <div name="status">
                        <span v-if="item.status == 0" class="label label-sm label-default">失效</span>
                        <span v-else-if="item.status == 1" class="label label-sm label-info">待审核</span>
                        <span v-else-if="item.status == 2" class="label label-sm label-warning">审核未通过</span>
                        <span v-else-if="item.status == 3" class="label label-sm label-success">审核通过</span>
                    </div>
                </td>
                <td>
                    <a @click="editOrDoneClick(item,$event)"><span  style="color:#4db3ff;">编辑</span></a>&nbsp;&nbsp;
                    <a @click="deleteTr(item)"><span style="color:#4db3ff;">删除</span></a>&nbsp;&nbsp;
                </td>
            </tr>
            </tbody>
        </table>

        <!-- 模态框 -->
        <div id="create_modal_domain" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document' style="width: 90%;margin-left: -15%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">添加域名</h4>
                    </div>
                    <div class="modal-body">
                        <form :model="firstTr" class="form-horizontal" style="margin-top:20px;">
                            <div class="form-group">
                                <label class="control-label col-md-1">
                                    一级域名
                                </label>
                                <div class="col-md-3">
                                    <input class="form-control" type='text' v-model="firstTr.sldName" placeholder="如：somc.com">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-1">
                                    主机记录
                                </label>
                                <div class="col-md-3">
                                    <button @click="addHostRecord" type="button" class="btn btn-info">
                                        <i class="icon-plus">添加</i>
                                    </button>
                                </div>
                            </div>
                            <div class="form-group" style="margin-left:10px;margin-right: 10px;">
                                <table id="add_domain" class="table table-striped table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <td style="text-align: center;">记录名称</td>
                                            <td style="text-align: center;">线路</td>
                                            <td style="text-align: center;">IP地址</td>
                                            <td style="text-align: center;">TTL</td>
                                            <td style="text-align: center;">协议</td>
                                            <td style="text-align: center;">端口</td>
                                            <td style="text-align: center;">后端端口</td>
                                            <td style="text-align: center;">操作</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input class="form-control" type='text' v-model="firstTr.recordName" placeholder="如：www"/></td>
                                            <td>
                                                <div>
                                                    <select class="form-control" v-model="firstTr.accessLine">
                                                        <option value="1">电信</option>
                                                        <option value="2">联通</option>
                                                        <option value="3">移动</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td><input class="form-control" type='text' v-model="firstTr.ipAddr"/></td>
                                            <td>
                                                <div>
                                                    <select class="form-control" v-model="firstTr.ttl">
                                                        <option value="0">AUTO</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td><input class="form-control" placeholder="例：http/https/upgrade_http" type='text' v-model="firstTr.protocol"/></td>
                                            <td><input class="form-control" type='text' v-model="firstTr.protocolPort"/></td>
                                            <td><input class="form-control" type='text' v-model="firstTr.backendProtocolPort"/></td>
                                            <td style="text-align: center;vertical-align:middle;">
                                            </td>
                                        </tr>

                                        <template v-for="(tr,index) in trs">
                                            <tr>
                                                <td><input class="form-control" placeholder="例：www" type='text' v-model="tr.recordName"/></td>
                                                <td>
                                                    <div>
                                                        <select class="form-control" v-model="tr.accessLine">
                                                            <option value="1">电信</option>
                                                            <option value="2">联通</option>
                                                            <option value="3">移动</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td><input class="form-control" type='text' v-model="tr.ipAddr"/></td>
                                                <td>
                                                    <div>
                                                        <select class="form-control" v-model="tr.ttl">
                                                            <option value="0">AUTO</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td><input class="form-control" placeholder="例：http/https/upgrade_http" type='text' v-model="tr.protocol"/></td>
                                                <td><input class="form-control" type='text' v-model="tr.protocolPort"/></td>
                                                <td><input class="form-control" type='text' v-model="tr.backendProtocolPort"/></td>
                                                <td style="text-align: center;vertical-align:middle;">
                                                    <a @click="removeTr(index)"><i class="icon-remove icon-1x"></i></a>
                                                </td>
                                            </tr>
                                        </template>

                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-2 col-md-offset-5">
                            <button type="button" @click="subAddObj" class="btn btn-info" style="display: inline;">确定</button>
                            <button type="button" aria-label="Close"  data-dismiss="modal" class="btn btn-default" style="display: inline;">取消</button>
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
          this.userId = this.$route.query.userId;//路由传过来的参数
          this.init4table();
      },
      mounted(){
          initDataTable($('#domain_table'), []);
      },
    data() {
      return {
          //tOpenDomain:this.openDomain,
          //isEdit:false,
          userId:{},
          items:[],
          firstTr:{
              "userId":this.userId,
              "sldName":"",//一级域名：lanyu.com
              "recordName":"",//二级域名：www.
              "ipAddr":"",//记录值：ipstr
              "accessLine":1,//线路：电信、联通
              "ttl":0,
              "protocol":"",
              "protocolPort":80,
              "backendProtocolPort":80,
          },
          trs:[],//添加提交的数据
      }
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let userId = this.userId;
            let that = this;
            let time = new Date().getTime();
            let url = "domain/getDomainForUser?userId="+userId+"&time="+time;
            sendGetAjax(url,true).then(function (sdata) {
                $('#domain_table').dataTable().fnDestroy();//销毁之前的table
                that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    initDataTable($('#domain_table'),[]);
                    $("#access_line_th").css("width","10%");
                    $("#ttl_th").css("width","7%");
                    $("#protocol").css("width","10%");
                });
            });
        },
        editOrDoneClick(item,$event){//编辑or完成
            let dom = $event.currentTarget;
            let tds = $(dom).parent().parent().find('td');
            if($(dom).children().text() === "编辑"){
                $(tds[10]).find("div[name=status_select]").show();
                $(tds[10]).find("div[name=status]").hide();
                $(dom).children().text("完成");
                $(tds[8]).children().attr("disabled",false);
                $(tds[3]).children().attr("disabled",false);
                $(tds[4]).children().attr("disabled",false);
                $(tds[5]).children().attr("disabled",false);
                $(tds[6]).children().attr("disabled",false);
                $(tds[7]).children().attr("disabled",false);
            }else{
                $(tds[10]).find("div[name=status_select]").hide();
                $(tds[10]).find("div[name=status]").show();
                $(dom).children().text("编辑");
                $(tds[8]).children().attr("disabled",true);
                $(tds[3]).children().attr("disabled",true);
                $(tds[4]).children().attr("disabled",true);
                $(tds[5]).children().attr("disabled",true);
                $(tds[6]).children().attr("disabled",true);
                $(tds[7]).children().attr("disabled",true);
                let time = new Date().getTime();
                let that = this;
                sendGetAjax("userDomain/checkDomainInFenceIp?domainId="+item.domainId+"&time="+time,true,1).then(function (sdata) {
                    if(sdata.code === "203"){
                        that.$message({
                            message:sdata.msg,
                            type:'warning',
                            duration:1500,
                            customClass:'cus-message-class',
                        });
                        that.init4table();
                        return;
                    }else if(sdata.code === "204"){
                        sendAjax("userDomain/updateDomain",true,item,1).then(function (sdata2) {
                            that.init4table();
                        });
                    }
                });
            }
        },
        deleteTr(item) {//删除当前一行域名
            let time = new Date().getTime();
            let that = this;
            sendGetAjax("userDomain/checkDomainInFenceIp?domainId="+item.domainId+"&time="+time,true).then(function (sdata) {
                if(sdata.code === "203"){
                    that.$message({
                        message:sdata.msg,
                        type:'warning',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    return;
                }else if(sdata.code === "204"){
                    sendAjax("userDomain/deleteDomain",true,item).then(function (sdata2) {
                        that.init4table();
                    });
                }
            });
        },
        createObj () {
            //初始化模态框里面的数据
            this.firstTr = {"userId":this.userId,"sldName":"","recordName":"","ipAddr":"","accessLine":"1","ttl":"0","protocol":"","protocolPort":80,"backendProtocolPort":80};
            this.trs = [];
            initModal($('#create_modal_domain'));

        },
        subAddObj() {//提交
            let trs = [];
            trs.push(this.firstTr);//第一行
            trs = trs.concat(this.trs);
            for(let i=0;i<trs.length;i++){
                if(trs[i].sldName ==="" || trs[i].recordName ==="" || trs[i].ipAddr ==="" || trs[i].accessLine ==="" || trs[i].ttl ===""){
                    this.$message({
                       message:"您的数据填写不完整！",
                        type:'warning',
                        customClass:'cus-message-class',
                    });
                    return;
                }
            }
            let that = this;
            sendAjax("user/addDomainForUser",true,trs).then(function (sdata) {
                    if(sdata.code === "205"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            duration:1500,
                            customClass:'cus-message-class',
                        });
                    that.init4table();
                    $('#create_modal_domain').modal("hide");
                }else if(sdata.code === "207"){
                    that.$message({
                        message:"添加失败！"+sdata.data+sdata.msg,
                        type:'warning',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    return;
                };
            });
        },
        addHostRecord(){
            let tr = {"userId":this.userId,"sldName":this.firstTr.sldName,"recordName":"","ipAddr":"","accessLine":"1","ttl":"0","protocol":"","protocolPort":80,"backendProtocolPort":80};
            this.trs.push(tr);
        },
        removeTr(index){//删除当前一行记录
            this.trs.splice(index,1);
        },
    },
  }
</script>
<style >

</style>


