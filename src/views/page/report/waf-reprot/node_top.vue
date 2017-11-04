<template>
    <div>
        <div class="panel panel-default" style="border: 0">
            <div id="waf_node_top" class="charts-big"></div>
        </div>

        <div class="app-container pop-diy">
            <div v-show="popOpen" class="app-container pop-body-diy">
                <form :model="queryParam" ref="queryParam1" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-3">开始时间：</label>
                        <div class="col-md-4">
                            <el-date-picker
                                    format="yyyy-MM-dd hh:MM:ss"
                                    v-model="stime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    @change="dateChange1">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3">结束时间：</label>
                        <div class="col-md-4">
                            <el-date-picker
                                    v-model="etime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    @change="dateChange2">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-2 col-md-offset-3">
                            <el-button type="primary" icon="search" @click="getUserTopCount">搜索</el-button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-2 col-md-offset-5">
                <el-button @click="togglePopOpen" class="pop-btn-diy">{{openLabel}}</el-button>
            </div>

        </div>
    </div>

</template>

<style scoped>
</style>

<script>
    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';
    import echarts from 'echarts';



    export default  {
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
        },
        mounted() {//初始化时，
            let that = this;
            that.mycharts = echarts.init(document.getElementById('waf_node_top'));
            that.getNewDateTime();//初始化默认时间
            that.getUserTopCount();
        },
        data() {//页面所需的数据
            return {
                "mycharts":{},
                "popOpen":true,//是否展开查询条件
                "queryParam":{},
                "xAxis":[],
                "legend":[],
                "series":[],

                "stime":"",
                "etime":"",
            }
        },
        computed:{
            openLabel:function () {
                if(this.popOpen){
                    return "隐藏查询条件";
                }else{
                    return "展开查询条件";
                }
            }
        },
        methods: {
            dateChange1(val){
                this.stime = val;
            },
            dateChange2(val){
                this.etime = val;
            },
            getNewDateTime(){
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();
                this.stime = year+"-"+(month<10?("0"+month):(month))+"-"+(day<10?("0"+day):day)+" "+"00:00:00";
                this.etime = year+"-"+(month<10?("0"+month):(month))+"-"+(day<10?("0"+day):day)+" "+"23:59:59";
            },
            togglePopOpen(){
                this.popOpen = !this.popOpen;
            },
            getUserTopCount(){//获取数据并绘图
                let that = this;
                let sdate = that.stime;
                let edate = that.etime;
                let time = new Date().getTime();
                let url = "userReprot/getNodeTopCount?sdate="+sdate+"&edate="+edate+"&time="+time;
                sendGetAjax(url,true).then(function (sdata) {
                    console.log(sdata);
                    let xAxis = JSON.parse(sdata.xAxis);
                    let legend = JSON.parse(sdata.legend);
                    let series = JSON.parse(sdata.series);
                    that.buildCharts(xAxis,legend,series);
                    /*that.items = sdata.data;//重新数据绑定，同时vue绘制table，此时为异步操作，
                     that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                     });*/
                });
            },
            buildCharts(xAxis,legend,series){
                let option = {
                    title : {
                        //text: '用户TOP',
                        //subtext: '纯属虚构'
                    },
                    tooltip : {
                        // trigger: 'axis'
                    },
                    legend: {
                        data:legend
                    },
                    /*toolbox: {
                     show : true,
                     feature : {
                     dataView : {show: true, readOnly: false},
                     magicType : {show: true, type: ['line', 'bar']},
                     restore : {show: true},
                     saveAsImage : {show: true}
                     }
                     },*/
                    calculable : true,
                    xAxis : {
                        type : 'category',
                        data : xAxis
                    },
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : series,
                };
                this.mycharts.setOption(option);
            },

            submitForm(){

            }
        }

    }
</script>
