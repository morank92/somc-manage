<template>
    <div class="app-container">
        <template v-for="(servicePackage,index) in servicePackages">
            <a type="button" @click="changeVersion($event,servicePackage)" v-if="index==0" style="margin-right: 10px;" class="btn btn-primary version-btn">{{servicePackage.serviceVersion}}-{{servicePackage.serviceTtl}}</a>
            <a type="button" @click="changeVersion($event,servicePackage)" v-else style="margin-right: 10px;" class="btn btn-info version-btn">{{servicePackage.serviceVersion}}-{{servicePackage.serviceTtl}}</a>
        </template>
        <hr>
        <p style="color: red">提示：页面将按照选择的先后顺序来进行展示</p>
        <div style="margin-top: 20px;">
            <el-transfer id="el_transfer" v-model="elements"
                         :data="data"
                         :titles="['未选项', '已选项']"
                         :button-texts="['到左边', '到右边']"
            ></el-transfer>
        </div>
        <div style="margin:1% 0 0 24%;">
            <button type="button" @click="completeSubmit()" class="btn btn-primary">完成配置</button>
        </div>
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
          this.getServiceAndElement();
      },
      mounted() {//初始化时，组装datatable，
//          initDataTable($('#node_table'),[]);
      },
    data() {//页面所需的数据
        return {
            servicePackages:[
                {packageId:"0",serviceVersion:"",serviceTtl:"",ipCount:""},
            ],
            data: [],
            elements: [],
            packageId:0,
        };
    },
    methods: {
        getServiceAndElement(){
            let that = this;
            //获取所有element
            sendGetAjax("serviceConf/getServiceConf",true).then(function(elementData) {
                let data = []
                if(elementData.code=="000"){
                    let elements = elementData.data;
                    $.each(elements,function(i,element){
                        data.push({key:element.id,label:element.name});
                    });
                    that.$nextTick(function () {
                        that.data = data;
                        //出现点问题，所以这里单独设置了高度
                        $(".el-transfer-panel").css("height","320");
                    });
                }else{
                    that.$message({
                        type: 'error',
                        message:sdata.msg,
                        customClass:'cus-message-class',
                    })
                }
            });
            //获取所有版本
            sendGetAjax("serviceConf/getServicePackage",true).then(function(versionData) {
                let servicePackages = that.servicePackages;
                if(versionData.code=="000"){
                    servicePackages = versionData.data;
                    that.$nextTick(function () {
                        that.packageId = servicePackages[0].packageId;
                        that.servicePackages = servicePackages;
                        that.init4table();
                    });
                }else{
                    that.$message({
                        type: 'error',
                        message:sdata.msg,
                        customClass:'cus-message-class',
                    })
                }
            });
        },
        //初始获取表单数据
        init4table(){
            let that = this;
            sendGetAjax("serviceConf/getVersionElement?packageId="+this.packageId+"&time="+new Date().getTime(),true).then(function(sdata) {
                let data = [];
                if(sdata.code=="000"){
                    $.each(sdata.data,function(i,obj){
                        data.push(obj.elementId);
                    });
                }else{
                    that.$message({
                        type: 'error',
                        message:sdata.msg,
                        customClass:'cus-message-class',
                    })
                }
                that.$nextTick(function () {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                    that.elements = data;
                });
            });
        },

        //完成配置
        completeSubmit(){
            let that = this;
            if(that.elements.length==0){
                that.$message({
                    type: 'error',
                    message:"请至少选择一项配置",
                    customClass:'cus-message-class',
                })
                return;
            }
            let spElementList = [];
            let packageId = that.packageId;
            $.each(that.elements,function(i,value){
                spElementList.push({packageId:packageId,elementId:value,seq:i+1});
            });
            sendAjax("serviceConf/addVersionElement",true,spElementList).then(function(sdata) {
                if(sdata.code=="000"){
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
        },

        //切换选中，颜色标记
        changeVersion($event,servicePackage){
            //显示选中
            $(".version-btn").removeClass("btn-primary")
            $(".version-btn").addClass("btn-info")
            let obj = $($event.currentTarget);
            obj.removeClass("btn-info");
            obj.addClass("btn-primary");

            this.packageId = servicePackage.packageId;
            this.init4table();
        },

    }
  }
</script>
