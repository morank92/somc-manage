<template>
    <div>
        <div class="panel panel-default" style="border: 0">
            <div id="source_user_node" class="charts-big"></div>
        </div>

        <div class="app-container pop-diy">
            <div v-show="popOpen" class="app-container pop-body-diy">
                <form :model="queryParam" ref="queryParam1" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-3" style="color: #e5ecf3">用户：</label>
                        <div class="col-md-5">
                            <el-select v-model="user" placeholder="请选择">
                                <el-option
                                        v-for="item in users"
                                        :key="item.nodeId"
                                        :label="item.nodeName"
                                        :value="item.nodeId"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3" style="color: #e5ecf3">统计周期：</label>
                        <div class="col-md-5">
                            <el-select v-model="cycleVal" placeholder="请选择">
                                <el-option
                                        v-for="item in cycles"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3">开始时间：</label>
                        <div class="col-md-4">
                            <el-date-picker
                                    v-model="stime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3">结束时间：</label>
                        <div class="col-md-4">
                            <el-date-picker
                                    v-model="etime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-2 col-md-offset-3">
                            <el-button type="primary" icon="search">搜索</el-button>
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
        mounted() {//初始化时，组装datatable，
            this.buildCharts();
        },
        data() {//页面所需的数据
            return {
                "popOpen":true,//是否展开查询条件
                "queryParam":{},
                "seriesData":[],

                "users":[{"nodeName":"长沙节点","nodeId":1},
                    {"nodeName":"北京节点","nodeId":2},
                    {"nodeName":"杭州节点","nodeId":3}
                ],
                "user":1,
                "protocol":"全部",
                "pros":["全部","TCP","UDP","ICMP","DNS QUERY","DNS REPLY","HTTP","HTTPS","SIP","TCP FRAG","UDP FRAG"],
                "unit":"pps",
                "units":["pps","kbit/s"],
                "stime":"",
                "etime":"",
                "cycles":["分钟","小时","星期","月份"],
                "cycleVal":"分钟",
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
            togglePopOpen(){
                this.popOpen = !this.popOpen;
            },
            buildCharts(){
                let mycharts = echarts.init(document.getElementById('source_user_node'));
                let option = {
                    //animation : false,
                    //backgroundColor: 'rgba(47, 79, 125,0.9)',
                    title: {
                        text: '连接数',
                    },
                    tooltip: {
                        //trigger: 'axis',
                    },
                    color:['red','#008800','#5599FF','#000088'],
                    legend: {
                        data:['长沙节点','深圳节点','扬州节点','武汉节点'],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                        x:80, y:80, x2:50, y2:80,
                    },
                    calculable : true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            //data:flowTimeX,
                            data:['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
                            //scale: true,
                            //show:false,
                            axisLabel:{
                                //X轴刻度配置
                                interval:0, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                            },
                            splitLine:{
                                show:true
                            }
                        }
                    ],
                    yAxis: {
                        type: 'value',
                        //splitNumber:10,
                        axisLabel:{
                            formatter : function(str){
                                var newData = str + "%";
                                return newData;
                            },
                        }
                        //name:yname,单位
                    },
                    series: [
                        {
                            symbol:'none',
                            smooth:true,
                            name:'长沙节点',
                            type:'line',
                            stack: 'value1',
                            data:[20,26,43,56,12,19,70,88],
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width : 1.3,
                                    }
                                }
                            },
                        },
                        {
                            symbol:'none',
                            smooth:true,
                            name:'深圳节点',
                            type:'line',
                            stack: 'value2',
                            data:[12,22,48,56,30,80,70,66],
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width : 1.2,
                                    }
                                }
                            },
                        },
                        {
                            symbol:'none',
                            smooth:true,
                            name:'扬州节点',
                            type:'line',
                            stack: 'value3',
                            data:[26,38,66,77,22,80,30,36],
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width : 1,
                                        //color:'red'
                                    }
                                }
                            },
                        },
                        {
                            symbol:'none',
                            smooth:true,
                            name:'武汉节点',
                            type:'line',
                            stack: 'value4',
                            data:[16,11,66,77,42,50,40,32],
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        width : 1,
                                        //color:'red'
                                    }
                                }
                            },
                        },
                    ]
                };
                mycharts.setOption(option);
            },

            submitForm(){

            }
        }

    }
</script>
