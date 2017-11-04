<template>
    <div class="app-container panel panel-default">
        <div v-if="!openChild">
            <div class="row" style="margin-left:8px;margin-bottom:20px;">
                <button type="button" @click="createObj" class="el-button el-button--primary"><span>新建</span></button>
            </div>
            <table id="main_table" class="table table-striped table-hover table-bordered">
                <thead>
                <tr>
                    <th>用户名</th>
                    <th>电话号码</th>
                    <th>注册时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items" :key="item.userId">
                    <td>{{item.userName}}</td>
                    <td>{{item.phoneNo}}</td>
                    <td>{{item.registTimeStr}}</td>
                    <td>
                        <router-link :to="{path:'/operation/customer/domain',query:{userId:item.userId}}">
                            <span  style="color:#4db3ff;">域名</span>&nbsp;&nbsp;
                        </router-link>
                        <router-link :to="{path:'/operation/customer/fenceip',query:{userId:item.userId}}">
                            <span  style="color:#4db3ff;">IP</span>&nbsp;&nbsp;
                        </router-link>
                        <router-link :to="{path:'/operation/customer/waf',query:{userId:item.userId}}">
                            <span  style="color:#4db3ff;">WAF</span>&nbsp;&nbsp;
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>

            <!-- 模态框 -->
            <div id="create_modal" class="modal fade" tabindex='-1' role='dialog'>
                <div class="modal-dialog cus-modal" role='document'>
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" type='button' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>×</span>
                            </button>
                            <h4 class="modal-title">新建用户</h4>
                        </div>
                        <div class="modal-body">
                            <form :model="user" class="form-horizontal" style="margin-top:20px;">
                                <div class="form-group">
                                    <label class="control-label col-md-4">
                                        用户名
                                    </label>
                                    <div class="col-md-3">
                                        <input class="form-control" type='text' v-model="user.userName">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="control-label col-md-4">
                                        手机号
                                    </label>
                                    <div class="col-md-3">
                                        <input class="form-control" type='text' v-model="user.phoneNo">
                                    </div>
                                </div>
                            </form>
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

    export default {
        beforeCreate(){//初始化之前
        },
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            this.init4table();
        },
        mounted() {//初始化时，组装datatable，

        },
        data() {//页面所需的数据
            return {
                openChild:false,//是否打开了子组件的标识，当初始化时为未打开false
                items:[],
                user:{
                    "userName":'',
                    "phoneNo":'',
                },
            }
        },
        methods: {
            //初始获取表单数据
            init4table(){
                let time = new Date().getTime();
                let that = this;
                sendGetAjax("user/getAllUser?time="+time,true).then(function(sdata){
                    that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                    $('#main_table').dataTable().fnDestroy();//销毁之前的table
                    that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        initDataTable($('#main_table'),[]);
                    });
                });
            },
            //供子组件调用的方法，改变父组件的opmenDomain的值
            changeThisOpenDomain(f){
              this.openChild = f;
            },
            //
            createObj () {
                //初始化模态框里面的数据
                this.user = {"userName":"","phoneNo":""};
                initModal($('#create_modal'));
            },
            subAddObj() {
                let user = this.user;
                let that = this;
                if(user.userName === "" ||user.phoneNo === ""){
                    that.$message({
                        message:"请正确填写信息!",
                        type:'error',
                        duration:1500,
                        customClass:'cus-message-class',
                    });
                    return;
                }
                sendAjax("user/addUser",true,user).then(function (sdata) {//添加
                    if(sdata.code === "000"){
                        that.$message({
                            message:"创建用户成功!",
                            type:'success',
                            duration:1500,
                            customClass:'cus-message-class',
                        });
                        $('#create_modal').modal("hide");
                        that.init4table();//刷新列表
                    }
                });
            }
        },
        destroyed(){
        }
    }
</script>
