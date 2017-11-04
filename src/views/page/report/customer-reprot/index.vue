<template>
    <div class="app-container panel panel-default panel-diy">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="流量对比" name="flowCom">
            </el-tab-pane>
            <el-tab-pane label="连接数" name="conn">
            </el-tab-pane>
            <el-tab-pane label="攻击趋势" name="trend">
            </el-tab-pane>
            <el-tab-pane label="攻击TOPN" name="top">
            </el-tab-pane>
            <el-tab-pane label="攻击分布" name="dist">
            </el-tab-pane>
        </el-tabs>
        <component :is="currentView"></component>
    </div>


</template>

<script>

    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';

    const flowCom = resolve => require(['./flow_compare'],resolve);
    const conn = resolve => require(['./connect'],resolve);
    const sourceUsage = resolve => require(['./source_usage'],resolve);
    const nodeFlow = resolve => require(['./node_flow'],resolve);


    export default {
        beforeCreate(){//初始化之前
        },
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
        },
        mounted() {//初始化时，组装datatable，

        },
        components:{
            "flowCom":flowCom,//流量对比
            "conn": conn,
            "trend":sourceUsage,
            "top":nodeFlow,
            "dist":nodeFlow,
        },
        data() {//页面所需的数据
            return {
                "currentView":"flowCom",//当前视图组件
                "activeName":"flowCom",//tab当前高亮
            }
        },
        methods: {
            handleClick(tab, event) {
                this.currentView = this.activeName;
                //console.log(tab, event);
            },
            submitForm(){

            },
        },
    }
</script>
<style>
    .panel-diy{

    }
    .charts-div{
        margin-left: 1%;
        margin-right: 1%;
        margin-top: 1%;
        margin-bottom: 1%;
        height:500px;
        background-color:rgba(42, 63, 100,0.7);
        color: #fff;
    }
    .charts-big{
        height: 700px;
        /*background-color: rgba(47, 79, 125,0.7);*/
        background-color: rgb(47, 79, 125);
        /*box-shadow: 0 0 2px #1876A2;*//*rgba(0, 204, 204, .5);*/
        border-radius: 3px;
        border:0;
        position:relative;/** 父级**/
    }
    .pop-btn-diy{
        /*position: absolute;
        top: -32px;
        right: 200px;*/
        /*transform:rotate(-90deg);
        -ms-transform:rotate(-90deg); 	!* IE 9 *!
        -moz-transform:rotate(-90deg); 	!* Firefox *!
        -webkit-transform:rotate(-90deg); !* Safari 和 Chrome *!
        -o-transform:rotate(-90deg);*/

        padding: 0.5em 1em;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid #fff;
        /*border-radius: 5px;*/
        background-color: rgba(47, 79, 125,0.9);
        color: #fff;
        font-size: 14px;
        text-align: center;
        text-decoration: none;
        /*position:absolute;right:320px;top:560px;!** 子级**!*/
    }
    .pop-diy{
        height: auto;
        width: 600px;
        border: 0;/*1px solid #fff;*/
        /*border-radius: 5px;*/
        /*background-color: rgba(0,0,0,0.4);*/
        color: #fff;
        /*margin-top: 1px;*/
        position:absolute;right:40px;top:108px;/** 子级**/
    }
    .pop-body-diy{
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        height: auto;
        width: 600px;
        border: 0;/*1px solid #fff;*/
        background-color: rgba(0,0,0,0.4);
        color: #fff;
        margin-top: 1px;
    }

</style>