<template>
    <div>
        <div class="row" style="margin-left:8px;margin-bottom:20px;">
            <button type="button" @click="createWafInstance" class="el-button el-button--primary"><span>新建</span></button>
        </div>
        <table id="waf_table" class="table table-striped table-hover table-bordered">
            <thead>
            <tr>
                <th>实例ID</th>
                <th>WAF版本</th>
                <th>带宽(Mbps)</th>
                <th>时长</th>
                <th>开始时间</th>
                <th>到期时间</th>
                <th>价格(元)</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in items" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>{{item.wafVersion}}</td>
                    <td>{{item.bandWidth}}</td>
                    <td>{{item.duration}}</td>
                    <td>{{item.startTime}}</td>
                    <td>{{item.endTime}}</td>
                    <td>{{item.price}}</td>
                    <td>
                        <router-link :to="{path:'/operation/customer/waf_config',query:{userId:userId,wafInstId:item.id}}">
                            <span style="color:#4db3ff;">安全配置</span>
                        </router-link>&emsp;
                        <a @click="removeWafInstance(item,$event)"><span  style="color:#4db3ff;">移除</span></a>&emsp;
                        <a @click="wafInstanceDes(item,$event)"><span  style="color:#4db3ff;">版本描述</span></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 模态框 -->
        <div id="create_waf_instance_modal" class="modal fade" tabindex='-1' role='dialog'>
            <div class="modal-dialog cus-modal" role='document'>
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 class="modal-title">创建WAF实例</h4>
                    </div>
                    <div class="modal-body">
                        <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">基础配置</div>
                        <div class="panel-body">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label class="control-label col-md-2">
                                        WAF版本
                                    </label>
                                    <div class="col-md-3">
                                        <el-select v-model="instance.wafVersion" placeholder="请选择" style="width: 100%;">
                                            <el-option
                                                    v-for="item in wafVersionDesc"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
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
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-2">
                                        描述
                                    </label>
                                    <div class="col-md-8">
                                        <el-input type="textarea" v-model="instance.description"></el-input>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-2">
                                        带宽
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.bandWidth">
                                            <template slot="append">Mbps</template>
                                        </el-input>
                                    </div>
                                    <label class="control-label col-md-2">
                                        价格
                                    </label>
                                    <div class="col-md-3">
                                        <el-input  v-model="instance.price">
                                            <template slot="append">元</template>
                                        </el-input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer" style="margin-top:20px;">
                        <div class="col-md-1 col-md-offset-5">
                            <button type="button" @click="subAddObj()" class="btn btn-info">确定</button>
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
              "wafVersion":'',
              "description":'',
              "bandWidth":0,
              "duration":'',
              "price":'',
          },
          sldCount:0,
          sldNames:[],
          durationObjs:[
              {"label":"1个月","value":1},{"label":"2个月","value":2},{"label":"3个月","value":3},{"label":"4个月","value":4},
              {"label":"5个月","value":5},{"label":"6个月","value":6},{"label":"12个月","value":12},{"label":"24个月","value":24},
          ],
          wafVersionDesc:[
              {"label":"增强版","value":"增强版"},
              {"label":"高级版","value":"高级版"},
              {"label":"企业版","value":"企业版"},
              {"label":"旗舰版","value":"旗舰版"},
          ],
      }
    },
    watch:{
        sldCount:{handler:"countCheck",deep:true},
    },
    methods: {
        //初始获取表单数据
        init4table(){
            let userId = this.userId;
            let time = new Date().getTime();
            let url = "fenceWaf/getWafByUserId?userId="+userId+"&time="+time;
            let that = this;
            sendGetAjax(url,true).then(function (sdata) {
                that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                $('#waf_table').dataTable().fnDestroy();//销毁之前的table
                that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    initDataTable($('#waf_table'),[]);
                });
            });
        },
        createWafInstance(){
            //初始化模态框里面的数据
            this.instance = {
                            "userId":this.userId,
                            "wafVersion":'',
                            "description":'',
                            "bandWidth":'',
                            "duration":''};
            initModal($('#create_waf_instance_modal'));
        },

        //删除waf实例
        removeWafInstance(wafInstance,$event){
            //判断该waf实例下是否已有站点
            if(wafInstance.domainWafs.length!=0){
                this.$message({
                    message:"该实例下已有站点，请先将站点删除！！！",
                    type:'warning',
                    duration:1500,
                    customClass:'cus-message-class',
                });
                return;
            }

            let that = this;
            that.$confirm('确定要删除该WAF实例吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).then(() => {
                //删除waf实例
                sendGetAjax("fenceWaf/delWafInstance?wafInstanceId="+wafInstance.id,true).then(function (sdata) {
                if(sdata.code == "000"){
                    that.$message({
                        message:sdata.msg,
                        type:'success',
                        customClass:'cus-message-class',
                    });
                    that.init4table();
                }else{
                    that.$message({
                        message:sdata.msg,
                        type:'error',
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

        countCheck(){
            let domainPackageCount = parseInt(this.instance.domainPackage) + 1;
            if(this.sldCount > domainPackageCount){
                this.$message({
                    message:"说选一级域名个数不能大于扩展包个数!",
                    type:'error',
                    duration:1500,
                    customClass:'cus-message-class',
                });
            }
        },
        doChecked(e){
            let that = this;
            let checkedObj = e.target;
            let checkedParent = $(checkedObj).parent();
            let flag = $(checkedParent[0]).hasClass("is-checked");
            if(!flag){
                that.sldCount = that.sldCount + 1;
            }else{
                that.sldCount = that.sldCount - 1;
            }
        },
        //创建waf实例
        subAddObj(){
            let that = this;
            let ins = this.instance;
            let alertMsg = "";
            if(ins.price=="" || isNaN(parseInt(ins.price))){
                alertMsg="请正确填写价格";
            }
            if(ins.bandWidth=="" || isNaN(parseInt(ins.bandWidth))){
                alertMsg="请正确填写带宽";
            }
            if(ins.description==""){
                alertMsg="请填写版本描述";
            }
            if(ins.duration==""){
                alertMsg="请选择时长";
            }
            if(ins.wafVersion==""){
                alertMsg="请选择WAF版本";
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
            let param = {"wafInstance":this.instance};
            sendAjax("fenceWaf/createWafInstance",true,param).then(function (sdata) {
                if(sdata.code === "000"){
                    that.$message({
                        message:"创建成功!",
                        type:'success',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    $('#create_waf_instance_modal').modal("hide");
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
        wafInstanceDes(item,$event){
            this.$alert(item.description, {
                confirmButtonText: '确定',
                title:'WAF版本描述',
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${ action }`
                    });
                }
            });
        }

     },
  }
</script>
<style >

</style>


