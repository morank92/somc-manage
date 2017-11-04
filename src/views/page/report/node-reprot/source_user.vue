<template>
    <div>
        <div class="panel panel-default" style="border: 0">
            <div id="source_user_node" class="charts-big"></div>
        </div>

        <div class="app-container pop-diy">
            <div v-show="popOpen" class="app-container pop-body-diy">
                <form :model="queryParam" ref="queryParam1" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-2" style="color: #e5ecf3">版本：</label>
                        <div class="col-md-4">
                            <el-input></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2">版本：</label>
                        <div class="col-md-4">
                            <el-input></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2">版本：</label>
                        <div class="col-md-4">
                            <el-input></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-2 col-md-offset-2">
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

<script>
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/pie';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';

    import {sendAjax,sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable,initModal} from '@/utils/func_common.js';

    export default  {
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
        },
        mounted() {//初始化时，组装datatable，
            let seriesData = [
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ];
            this.seriesData = seriesData;
        },
        data() {//页面所需的数据
            return {
                "popOpen":true,//是否展开查询条件
                "queryParam":{},
                "seriesData":[],
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
        watch: {
            // 如果 seriesData 发生改变，这个函数就会运行
            seriesData: function (newData) {
                this.builCharts(newData);
            }
        },
        methods: {
            togglePopOpen(){
              this.popOpen = !this.popOpen;
            },
            builCharts(seriesData){
                let mycharts = echarts.init(document.getElementById('source_user_node'));
                let legData = [];
                for(let i=0;i<seriesData.length;i++){
                    let name = seriesData[i].name;
                    legData.push(name);
                }

                let option = {
                    backgroundColor: 'rgba(47, 79, 125,0.9)',
                    title : {//标题
                        text: '资源用户',
                        //subtext: '纯属虚构',
                        x:'10',
                        y:'10',
                        textStyle:{
                            color:"#fff",
                        },
                    },
                    tooltip : {//悬浮信息
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: '20',
                        top:'80%',
                        data: legData,
                        textStyle:{
                            color:"#fff",
                        },
                    },
                    series : [//图形集合
                        {
                            name: '信息一',
                            type: 'pie',
                            radius : '65%',//图形大小
                            center: ['35%', '50%'],//图形位置
                            data:seriesData,
                            itemStyle: {
                                emphasis: {//强调，阴影
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowBlur: 50,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)'//阴影
                                },
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                        }
                    ]
                };
                mycharts.setOption(option);
            },
            submitForm(){

            }
        }

    }
</script>
<style>
</style>