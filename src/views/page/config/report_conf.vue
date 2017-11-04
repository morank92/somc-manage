<template>
    <div class="app-container">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="邮箱告警配置" name="1" >
                <form id="email_param_form"  class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">SSL</label>
                        <div class="col-lg-1">
                            <input type="radio" v-model="emailParam.isSsl" value="1" disabled class="email-conf-input " />
                            <span class="fa fa-circle"></span>是
                        </div>
                        <div class="col-lg-1">
                            <input type="radio" v-model="emailParam.isSsl" disabled value="0" class="email-conf-input" />
                            <span class="fa fa-circle"></span>否
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">端口</label>
                        <div class="col-lg-3">
                            <input id="id" v-model="emailParam.id" type="hidden" class="form-control" />
                            <input id="port" value="25" v-model="emailParam.port" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">SMTP地址</label>
                        <div class="col-lg-3">
                            <input id="smtp" v-model="emailParam.smtp" placeholder="暂无配置，格式例如：smtp.163.com" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">邮箱账号</label>
                        <div class="col-lg-3">
                            <input id="email_account" v-model="emailParam.emailAccount" placeholder="暂无配置" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">邮箱密码</label>
                        <div class="col-lg-3">
                            <input id="email_password" v-model="emailParam.emailPassword" type="password" placeholder="暂无配置" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">发件名称</label>
                        <div class="col-lg-3">
                            <input id="send_name" v-model="emailParam.sendName" placeholder="暂无配置" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">测试邮箱</label>
                        <div class="col-lg-3">
                            <input id="receive_email" v-model="emailParam.receiveEmail" placeholder="暂无配置" disabled="disabled" class="form-control email-conf-input" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-2"></label>
                        <div class="col-lg-3">
                            <button type="button" id="go_remove" disabled style="margin-right:10px;" @click="goRemove()" class="btn btn-primary">移除</button>
                            <button type="button" style="margin-right:10px;" @click="goEdit()" class="btn btn-primary">编辑</button>
                            <button type="button" style="margin-right:10px;" @click="goTest()" class="btn btn-primary">测试</button>
                            <button type="button" id="go_submit" disabled @click="goSubmit()" class="btn btn-primary">提交</button>
                        </div>
                    </div>
                </form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<style scoped>

</style>

<script>
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';

  export default {
      created() {//初始化？
      },
      beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
          this.init4table();
      },
      mounted() {//初始化时，组装datatable，
          initDataTable($('#node_table'),[]);
      },
    data() {//页面所需的数据
          return {
              activeNames:["1"],
              emailParam:{
                  "id":"0",
                  "isSsl":"0",
                  "port":"25",
                  "smtp":"",
                  "emailAccount":"",
                  "emailPassword":"",
                  "sendName":"",
                  "receiveEmail":"",
              },
          }
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let that = this;
            sendGetAjax("reportConf/queryManageEmailParam",true).then(function(sdata) {
                if(sdata.code!="000"){
                    that.$message({
                        message:sdata.msg,
                        type:'error',
                        customClass:'cus-message-class',
                    });
                }
                that.$nextTick(function () {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    if(sdata.data!=null){
                        that.emailParam = sdata.data;
                        $("#go_remove").removeAttr("disabled");
                        $("#go_submit").attr("disabled",true);
                        $(".email-conf-input").attr("disabled",true);
                    }
                });
            });
        },
        //编辑
        goEdit(){
            $(".email-conf-input").removeAttr("disabled");
            $("#go_submit").removeAttr("disabled");
        },
        //测试
        goTest(){
            let that = this;
            sendAjax("reportConf/testManageEmailParam",true,that.emailParam).then(function(sdata) {
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
            });
        },
        //移除
        goRemove(){
            let that = this;
            sendGetAjax("reportConf/deleteManageEmailParam?id="+that.emailParam.id+"&time="+new Date().getTime(),true).then(function(sdata) {
                if(sdata.code=="000"){
                    that.$message({
                        message:sdata.msg,
                        type:'success',
                        customClass:'cus-message-class',
                    });
                    that.emailParam = {
                        "id":"0",
                        "isSsl":"0",
                        "port":"25",
                        "smtp":"",
                        "emailAccount":"",
                        "emailPassword":"",
                        "sendName":"",
                        "receiveEmail":"",
                    };
                    that.init4table();
                }else{
                    that.$message({
                        message:sdata.msg,
                        type:'error',
                        customClass:'cus-message-class',
                    });
                }
            });
        },
        //提交
        goSubmit(){
            let that = this;
            if(this.emailParam.id == 0){
                 sendAjax("reportConf/insertManageEmailParam",true,this.emailParam).then(function(sdata) {
                     if(sdata.code=="000"){
                         that.$message({
                             message:sdata.msg,
                             type:'success',
                             customClass:'cus-message-class',
                         });
                         that.emailParam = {
                             "id":"0",
                             "isSsl":"0",
                             "port":"25",
                             "smtp":"",
                             "emailAccount":"",
                             "emailPassword":"",
                             "sendName":"",
                             "receiveEmail":"",
                         };
                         that.init4table();
                     }else{
                         that.$message({
                             message:sdata.msg,
                             type:'error',
                             customClass:'cus-message-class',
                         });
                     }
                 });
            }else{
                 sendAjax("reportConf/updateManageEmailParam",false,this.emailParam).then(function(sdata) {
                     if(sdata.code=="000"){
                         that.$message({
                             message:sdata.msg,
                             type:'success',
                             customClass:'cus-message-class',
                         });
                         that.emailParam = {
                             "id":"0",
                             "isSsl":"0",
                             "port":"25",
                             "smtp":"",
                             "emailAccount":"",
                             "emailPassword":"",
                             "sendName":"",
                             "receiveEmail":"",
                         };
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
        },
    }
  }
</script>
