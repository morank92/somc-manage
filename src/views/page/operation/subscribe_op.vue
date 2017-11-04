<template>
    <div class="panel panel-default">
        <div style="color:black;background-color: #E5E9F2;" class="panel-heading font-bold">配置清单</div>
        <div style="position:relative;z-index: 1;" class="panel-body">
            <form :model="subs" class="form-horizontal">
                <div class="form-group col-md-8">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">版本</label>
                    <div class="col-md-10">
                        <button @click="sub4btn($event)" type="button" class="mb-sm btn btn-info btn-l">{{spsCurrent.serviceVersion}}</button>
                    </div>
                </div>
                <div class="form-group col-md-8">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">线路</label>
                    <div class="col-md-10">
                        <button v-for="(sp,index) in sps" @click="ttlBtnClick($event,index)" type="button" class="mb-sm btn btn-default btn-l">{{sp.serviceTtl}}</button>
                    </div>
                </div>
                <div class="form-group col-md-8">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">IP个数</label>
                    <div class="col-md-10">
                        <button type="button" class="mb-sm btn btn-info btn-l">{{spsCurrent.ipCount}}</button>
                    </div>
                </div>
                <div class="form-group col-md-8">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">基础防护带宽</label>
                    <div class="col-md-10" id="basewidth_div">
                        <button  v-for="(item,index) in basewidthObjs" @click="btnClick($event,item)" :key="item.id"
                                 type="button" class="mb-sm btn btn-default btn-l">{{item.value}}{{item.unit}}</button>
                    </div>
                </div>
                <div class="form-group col-md-8">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">弹性防护带宽</label>
                    <div class="col-md-10" id="expandwidth_div">
                        <button  v-for="item in exwidthObjs" @click="btnClick($event,item)" :key="item.id"
                                 type="button" class="mb-sm btn btn-default btn-l">{{item.value}}{{item.unit}}</button>
                    </div>
                </div>
                <div class="form-group col-md-8" style="margin-top: 20px;margin-bottom: 30px;">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">业务防护带宽</label>
                    <div class="col-md-8">
                        <div class="block col-md-8">
                            <el-slider
                                    v-model="busiwidthVal"
                                    :min="busiwidthObjs[0].value"
                                    :max="busiwidthObjs[busiwidthObjs.length-1].value"
                                    :step="1"
                                    @change="busiwidthChange"
                            >
                            </el-slider>
                        </div>
                        <div class="input-group spinner col-md-4">
                            <input type="text" class="form-control" :value="busiwidthVal">
                            <div class="input-group-btn-vertical">
                                <button tag="bandWidth" @click="numberUp($event,busiwidthVal,busiwidthObjs)" class="btn btn-default" type="button"><i class="el-icon-caret-top"></i></button>
                                <button tag="bandWidth" @click="numberDown($event,busiwidthVal,busiwidthObjs)"  class="btn btn-default" type="button"><i class="el-icon-caret-bottom"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-8" style="margin-bottom: 30px;">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">防护域名个数</label>
                    <div class="col-md-8">
                        <div class="block col-md-8">
                            <el-slider
                                    v-model="countDomainVal"
                                    :min="countDomainObjs[0].value"
                                    :max="countDomainObjs[countDomainObjs.length-1].value"
                                    :step="1"
                                    @change="countDomainChange"
                            >
                            </el-slider>
                        </div>
                        <div class="input-group spinner col-md-4">
                            <input type="text" class="form-control" :value="countDomainVal">
                            <div class="input-group-btn-vertical">
                                <button tag="countDomain" @click="numberUp($event,countDomainVal,countDomainObjs)" class="btn btn-default" type="button"><i class="el-icon-caret-top"></i></button>
                                <button tag="countDomain" @click="numberDown($event,countDomainVal,countDomainObjs)"  class="btn btn-default" type="button"><i class="el-icon-caret-bottom"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-8" style="margin-bottom: 30px;">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">购买数量</label>
                    <div class="col-md-8">
                        <div class="block col-md-8">
                            <el-slider
                                    v-model="countVal"
                                    :min="countObjs[0].value"
                                    :max="countObjs[countObjs.length-1].value"
                                    :step="1"
                                    @change="countChange"
                            >
                            </el-slider>
                        </div>
                        <div class="input-group spinner col-md-4">
                            <input type="text" class="form-control" :value="countVal">
                            <div class="input-group-btn-vertical">
                                <button tag="count" @click="numberUp($event,countVal,countObjs)" class="btn btn-default" type="button"><i class="el-icon-caret-top"></i></button>
                                <button tag="count" @click="numberDown($event,countVal,countObjs)"  class="btn btn-default" type="button"><i class="el-icon-caret-bottom"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-8" style="margin-bottom: 30px;">
                    <label style="margin-top: 6px;" class="col-md-2 text-right">时长</label>
                    <div class="col-md-6">
                        <el-select v-model="durationVal" placeholder="请选择" @change="durationChange">
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

                <div class="col-md-1 col-md-offset-5" style="margin-top:50px;margin-bottom: 30px;">
                    <button type="button" @click="subAddObj" class="btn btn-warning">确定下单</button>
                </div>
            </form>
        </div>

        <div style="position:absolute;width:25%;height:30%;right:80px;top:140px;z-index: 2">
            <div class="panel panel-info">
                <div class="panel-heading">购买清单</div>
                <div class="panel-body">
                    <form class="form-horizontal ng-pristine ng-valid">
                        <div class="form-group">
                            <label class="col-md-5">版本：</label>
                            <div class="col-md-7">{{spsCurrent.serviceVersion}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">线路：</label>
                            <div class="col-md-7">{{spsCurrent.serviceTtl}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">IP个数：</label>
                            <div class="col-md-7">{{spsCurrent.ipCount}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">基础防护带宽：</label>
                            <div class="col-md-7">{{subs.basewidth.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">弹性防护带宽：</label>
                            <div class="col-md-7">{{subs.exwidth.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">业务防护带宽：</label>
                            <div class="col-md-7">{{subs.busiwidth.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">防护域名个数：</label>
                            <div class="col-md-7">{{subs.countDomain.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">时长：</label>
                            <div class="col-md-7">{{subs.duration.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">购买数量：</label>
                            <div class="col-md-7">{{subs.count.value}}</div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-5">总计（元）：</label>
                            <div class="col-md-7" style="font-size: 30px;color: red;">{{subs.price}}</div>
                        </div>
                    </form>
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
          this.subs.userId = rparam.userId;

          let that = this;
          sendGetAjax("subscribe/toBuyServicePackage",true).then(function (sdata) {
              console.log(sdata);
              that.sps = sdata.data;//所有的服务包
              that.spsCurrent = that.sps[0];//当前服务包

              that.$nextTick(function() {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                  $('.btn-l').parent().children(":first-child").removeClass("btn-default").addClass("btn-info");//第一个为默认选中状态
                  this.refreshData();
              });
          });
      },
      mounted(){
      },
    data() {
      return {
          sps:[],//可购买的服务
          spsCurrent:{},//当前服务包
          userId:{},
          subs:{//清单的最后配置
              "basewidth":{},
              "exwidth":{},
              "busiwidth":{},
              "countDomain":{},
              "duration":{},
              "count":{},
              "price":0
          },
          //当前的值，各个select和slider值
          durationVal:1,
          busiwidthVal:100,
          countDomainVal:50,
          countVal:1,
      }
    },
    computed:{//计算属性，可以监测data数据变化
        basewidthObjs:function () {//基础带宽
            let tag = "baseWidth";
            return this.getElementDatas(tag);
        },
        busiwidthObjs:function () {//业务带宽
            let tag = "bandWidth";
            return this.getElementDatas(tag);
        },
        exwidthObjs:function () {//弹性带宽
            let tag = "elasticBandWidth";
            return this.getElementDatas(tag);
        },
        durationObjs:function () {//时长
            let tag = "duration";
            let datas = this.getElementDatas(tag);
            for(let i=0;i<datas.length;i++){
                datas[i].label = datas[i].value + datas[i].unit;
            }
            return datas;
        },
        countDomainObjs:function () {//防护的域名数
            let tag = "countDomain";
            return this.getElementDatas(tag);
        },
        countObjs:function () {//购买数量
            let tag = "count";
            return this.getElementDatas(tag);
        },
    },
    methods: {
          getElementDatas(tag){//通过tag从当前服务子项中遍历出对应的数据
              let els = this.spsCurrent.elements;//当前服务下所有的子项
              for(let i=0;i<els.length;i++){
                  if(els[i].tag === tag){
                      return els[i].elementDatas;
                  }
              }
          },
        ttlBtnClick($event,index){//线路btn切换
            let dom = $event.currentTarget;
            let sps = this.sps;
            this.spsCurrent = sps[index];//切换服务包数据
            this.toggleInfo4Btn(dom);//切换class
        },

        subAddObj(){
            let calldata = sendAjax("subscribe/createSubscriber",false,this.subs);
            if(calldata.code == "000"){
                this.$message({
                    message:calldata.msg,
                    type:'success',
                    customClass:'cus-message-class',
                });
            }
        },
        btnClick($event,item){//普通的btn事件
            let dom = $event.currentTarget;
            this.toggleInfo4Btn(dom);//切换class
            //刷新购买清单显示
            this.refreshData();

        },
        toggleInfo4Btn(dom){//btn点击切换其兄弟所有的button的class
            let btns = $(dom).parent().find('button');
            for(let i=0;i<btns.length;i++){
                $(btns[i]).removeClass('btn-info').addClass('btn-default');
            }
            $(dom).removeClass('btn-default').addClass('btn-info');
        },
        durationChange(val){
            //刷新购买清单显示
            this.refreshData();
        },
        busiwidthChange(nval){
            //刷新购买清单显示
            this.busiwidthVal = this.getSliderChangeVal(nval,this.busiwidthObjs);
            this.refreshData();
        },
        countDomainChange(val){
            //刷新购买清单显示
            this.countDomainVal = this.getSliderChangeVal(val,this.countDomainObjs);
            this.refreshData();
        },
        countChange(val){
            //刷新购买清单显示
            this.countVal = this.getSliderChangeVal(val,this.countObjs);
            this.refreshData();
        },
        numberUp($event,nval,objs){//向上递增
            let dom = $event.target;
            for(let i=0;i<objs.length;i++){
                if(nval == objs[i].value && i<objs.length){
                    nval = objs[i+1].value;//往右移一位
                    break;
                }
            }
            $(dom).parent().parent().find('input').val(nval);
            //修改slider上的值
            let tag = $(dom).attr("tag");
            switch(tag){
                case "countDomain":
                    this.countDomainVal = nval;
                    break;
                case "bandWidth":
                    this.busiwidthVal = nval;
                    break;
                case "count":
                    this.countVal = nval;
                    break;
            }
        },
        numberDown($event,nval,objs){//向上递增
            let dom = $event.target;
            for(let i=0;i<objs.length;i++){
                if(nval == objs[i].value && i>0){
                    nval = objs[i-1].value;//往左移一位
                    break;
                }
            }
            $(dom).parent().parent().find('input').val(nval);
            //修改slider上的值
            let tag = $(dom).attr("tag");
            switch(tag){
                case "countDomain":
                    this.countDomainVal = nval;
                    break;
                case "bandWidth":
                    this.busiwidthVal = nval;
                    break;
                case "count":
                    this.countVal = nval;
                    break;
            }
        },

        getInfoBtnIndex(dom){
            let btns = $(dom).find('button');
            for(let i=0;i<btns.length;i++){
                if($(btns[i]).hasClass('btn-info')){
                    return i;
                }
            }
        },
        getSliderChangeVal(nval,objs){//slider的二叉选择取值
            let srcArray = [];
            for(let i=0;i<objs.length;i++){//固定对象中有value属性值
                srcArray.push(objs[i].value);
            }
            if(srcArray.indexOf(nval) == -1){//没有正确匹配到值，则采用二叉选择
                var low = 0;
                var high = srcArray.length - 1;
                var index = 0;
                while ((low <= high) && (low <= srcArray.length - 1) && (high <= srcArray.length - 1)) {
                    var middle = (high + low) >> 1;
                    if (nval>=srcArray[middle] && nval<=srcArray[middle+1]) {
                        index = middle+1;
                        break;
                    } else if (nval < srcArray[middle]) {
                        high = middle - 1;
                    } else {
                        low = middle + 1;
                    }
                }
                nval = srcArray[index];
            }
            return nval;
        },
        refreshData(){//刷新购买清单显示
            //获取class为info的btn的下角标
            let index1 = this.getInfoBtnIndex($('#basewidth_div'));
            let index2 = this.getInfoBtnIndex($('#expandwidth_div'));
            //获取其对应的对象
            let exwidth = {};
            let basewidth = this.basewidthObjs[index1];//基础带宽
            if(typeof(index2) == "undefined" ){
                exwidth = basewidth;
            }
            let p1 = basewidth.price;
            let p2 = 0;//弹性带宽价格
            //let exwidth = this.exwidthObjs[index2];//弹性带宽
            //console.log(this.exwidthObjs);

            let busiwidth = this.busiwidthVal;//业务带宽
            let obj1 = this.busiwidthObjs.find((item)=>{//通过数组中一个对象的属性值匹配出正确的对象
                return item.value == busiwidth;//注意字符和int类型区别
            });
            let p3 = obj1.price;

            let countDomain = this.countDomainVal;//域名
            let obj2 = this.countDomainObjs.find((item)=>{//通过数组中一个对象的属性值匹配出正确的对象
                return item.value == countDomain;//注意字符和int类型区别
            });
            let p4 = obj2.price;

            let count = this.countVal;//服务数
            let obj3 = this.countObjs.find((item)=>{//通过数组中一个对象的属性值匹配出正确的对象
                return item.value == count;//注意字符和int类型区别
            });

            let duration = this.durationVal;//时长
            let obj4 = this.durationObjs.find((item)=>{//通过数组中一个对象的属性值匹配出正确的对象
                return item.value == duration;//注意字符和int类型区别
            });
            let p = (p1  + p2 + p3 + p4) * duration * count;//总价格

            this.subs = {//清单对象数据
                "basewidth":basewidth,
                "exwidth":exwidth,
                "busiwidth":obj1,
                "countDomain":obj2,
                "duration":obj4,
                "count":obj3,
                "price":p
            };
        },

    },
  }
</script>
<style>
    .btn-l{
        margin-right: 3px;
        width: 120px;
        margin-top: 5px;
    }
    .panel-info > .panel-heading{
        color: #fff;
        background-color: #31b0d5;
        border-color: #269abc;
    }

    /** inputNumber */
    .spinner {
        width: 100px;
    }
    .spinner input {
        text-align: center;
    }
    .input-group-btn-vertical {
        position: relative;
        white-space: nowrap;
        width: 1%;
        vertical-align: middle;
        display: table-cell;
    }
    .input-group-btn-vertical > .btn {
        display: block;
        float: none;
        width: 100%;
        max-width: 100%;
        padding: 8px;
        margin-left: -1px;
        position: relative;
        border-radius: 0;
    }
    .input-group-btn-vertical > .btn:first-child {
        border-top-right-radius: 4px;
    }
    .input-group-btn-vertical > .btn:last-child {
        margin-top: -2px;
        border-bottom-right-radius: 4px;
    }
    .input-group-btn-vertical i{
        position: absolute;
        top: 4px;
        left: 2px;
        font-size: 11px
    }

</style>


