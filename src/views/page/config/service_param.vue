<template>
    <div class="app-container">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基础防护带宽" name="1">
                <h4>基础防护带宽参数配置</h4>
                <p style="color: red">提示：大小，价钱不加单位，默认大小：GB,价钱：元</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">大小</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1">价钱</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1"><a @click="addbaseWidthInput()"><i class="el-icon-plus"></i></a></label>
                    </div>
                    <template v-for="(baseWidth,index) in baseWidths">
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control update-baseWidth-value" v-model="baseWidth.value" v-if="baseWidth.id != 0" disabled />
                                <input class="form-control add-baseWidth-value" v-else v-model="baseWidth.value" />
                                <input class="form-control update-baseWidth-id" v-model="baseWidth.id" v-if="baseWidth.id != 0" type="hidden" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control update-baseWidth-price" v-if="baseWidth.id != 0" v-model="baseWidth.price" disabled />
                                <input class="form-control add-baseWidth-price" v-else v-model="baseWidth.price" />
                            </div>
                            <label class="col-lg-1">
                                <a @click="editInput($event)"><i class="el-icon-edit"></i></a>
                                <a @click="removeInput($event,baseWidth)" style="margin-left: 16%"><i class="el-icon-delete"></i></a>
                            </label>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="baseWidthSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>

            <!--<el-collapse-item title="弹性防护带宽" name="2">-->

            <!--</el-collapse-item>-->
            <el-collapse-item title="业务带宽" name="3">
                <h4>业务带宽参数配置</h4>
                <p style="color: red">提示：最小值，最大值，递增值，价钱不加单位，默认带宽：M,价钱：元</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">最小值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">最大值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">递增值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">基础价格</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">递增价格</label>
                    </div>
                    <template>
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" type="hidden" v-model="bandWidth.id"/>
                                <input class="form-control" v-model="bandWidth.min"/>
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="bandWidth.max" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="bandWidth.step" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="bandWidth.basePrice" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="bandWidth.stepPrice" />
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="bandWidthSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>
            <el-collapse-item title="防护域名个数" name="4">
                <h4>防护域名个数参数配置</h4>
                <p style="color: red">提示：最小值，最大值，递增值，价钱不加单位，默认单位：个,价钱：元</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">最小值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">最大值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">递增值</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">基础价格</label>
                        <div class="col-lg-1"></div>
                        <label class="col-lg-1">递增价格</label>
                    </div>
                    <template>
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" type="hidden" v-model="countDomain.id"/>
                                <input class="form-control" v-model="countDomain.min"/>
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="countDomain.max" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="countDomain.step" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="countDomain.basePrice" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-1">
                                <input class="form-control" v-model="countDomain.stepPrice" />
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="countDomainSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>

            <el-collapse-item title="防护时长" name="5">
                <h4>防护时长参数配置</h4>
                <p style="color: red">提示：时长不加单位，默认时长单位：月</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">时长</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1"><a @click="addDurationInput()"><i class="el-icon-plus"></i></a></label>
                    </div>
                    <template v-for="(duration,index) in durations">
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control update-duration-value" v-if="duration.id != 0" v-model="duration.value" disabled />
                                <input class="form-control add-duration-value" v-else v-model="duration.value" />
                                <input class="form-control update-duration-id" v-if="duration.id != 0" v-model="duration.id"  type="hidden" />
                            </div>
                            <label class="col-lg-1">
                                <a @click="editInput($event)"><i class="el-icon-edit"></i></a>
                                <a @click="removeInput($event,duration)" style="margin-left: 16%"><i class="el-icon-delete"></i></a>
                            </label>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="durationSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>

            <el-collapse-item title="购买数量" name="6">
                <h4>购买数量参数配置</h4>
                <p style="color: red">提示：最小值，最大值，递增值，默认单位：个,</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">最小值</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1">最大值</label>
                    </div>
                    <template>
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control" type="hidden" v-model="count.id"/>
                                <input class="form-control" v-model="count.min"/>
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control" v-model="count.max" />
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="countSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>

            <el-collapse-item title="版本控制" name="7">
                <h4>产品版本配置</h4>
                <p style="color: red">提示：目前支持线路有：电信、联通,两条线路的请以顿号（、）间隔</p>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-lg-1">版本名称</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1">线路类型</label>
                        <div class="col-lg-2"></div>
                        <label class="col-lg-1"><a @click="addServicePackageInput()"><i class="el-icon-plus"></i></a></label>
                    </div>
                    <template v-for="(servicePackage,index) in servicePackages">
                        <div class="form-group">
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control update-servicePackage-serviceVersion" v-model="servicePackage.serviceVersion" v-if="servicePackage.packageId != 0" disabled />
                                <input class="form-control add-servicePackage-serviceVersion" v-else v-model="servicePackage.serviceVersion" />
                                <input class="form-control update-servicePackage-packageId" v-model="servicePackage.packageId" v-if="servicePackage.packageId != 0" type="hidden" />
                            </div>
                            <label class="col-lg-1"></label>
                            <div class="col-lg-2">
                                <input class="form-control update-servicePackage-serviceTtl" placeholder="电信、联通" v-if="servicePackage.packageId != 0" v-model="servicePackage.serviceTtl" disabled />
                                <input class="form-control add-servicePackage-serviceTtl" placeholder="电信、联通" v-else v-model="servicePackage.serviceTtl" />
                            </div>
                            <label class="col-lg-1">
                                <a @click="editInput($event)"><i class="el-icon-edit"></i></a>
                                <a @click="removePackageInput($event,servicePackage)" style="margin-left: 16%"><i class="el-icon-delete"></i></a>
                            </label>
                        </div>
                    </template>
                    <div class="form-group">
                        <label class="col-lg-1"></label>
                        <label class="col-lg-1">
                            <button type="button" style="margin-right:10px;" @click="servicePackageSubmit()" class="btn btn-primary">完成配置</button>
                        </label>
                    </div>
                </form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<style scoped>

</style>

<script>
    import {sendAjax, sendGetAjax} from '@/utils/ajax_common';
    import {initDataTable, initModal} from '@/utils/func_common.js';

    export default {
        created() {//初始化？
        },
        beforeMount(){//初始化之前获取数据，将数据set进data（）{}中
            this.init4table();
            this.initServicePackage();
        },
        mounted() {//初始化时，组装datatable，
            initDataTable($('#node_table'), []);
        },
        data() {//页面所需的数据
            return {
                activeNames: [],
                servicePackages:[
                    {packageId:"0",serviceVersion:"",serviceTtl:"",ipCount:""},
                ],
                baseWidths:[
                    {id:"0",value:"",price:""},
                ],
                bandWidth:{
                    id:"0",
                    min:"",
                    max:"",
                    step:"",
                    basePrice:"",
                    stepPrice:"",
                },
                countDomain:{
                    id:"0",
                    min:"",
                    max:"",
                    step:"",
                    basePrice:"",
                    stepPrice:"",
                },
                count:{
                    id:"0",
                    min:"",
                    max:"",
                },
                durations:[
                    {id:"0",value:""},
                ],
                //各种element的ID
                baseWidthId:"",
                durationId:"",
                countId:"",
                countDomainId:"",
                bandWidthId:"",
            }
        },
        methods: {
            //初始化版本信息数据
            initServicePackage(){
                let that = this;
                sendGetAjax("serviceConf/getServicePackage",true).then(function(sdata) {
                    let servicePackages = that.servicePackages;
                    if(sdata.code=="000"){
                        servicePackages = sdata.data;
                    }else{
                        that.$message({
                            type: 'error',
                            message:sdata.msg,
                            customClass:'cus-message-class',
                        })
                    }
                    that.$nextTick(function () {
                        that.servicePackages = servicePackages;
                    });
                });
            },
            //初始element-data数据
            init4table(){
                let that = this;
                let baseWidthArr = this.baseWidths;
                let durationArr = this.durations;
                let count = this.count;
                let countDomain = this.countDomain;
                let bandWidth = this.bandWidth;

                let baseWidthId = "";
                let durationId = "";
                let countId = "";
                let countDomainId = "";
                let bandWidthId = "";
                sendGetAjax("serviceConf/getServiceConf",true).then(function(sdata) {
                    if(sdata.code=="000"){
                        let data = sdata.data;
                        $.each(data,function(i,element){
                            switch(element.tag){
                                case "baseWidth":
                                    baseWidthId = element.id;
                                    baseWidthArr = element.elementDatas;
                                    break;
                                case "duration":
                                    durationId = element.id;
                                    durationArr = element.elementDatas;
                                    break;
                                case "count":
                                    countId = element.id;
                                    count = element.elementPriceRule;
                                    break;
                                case "countDomain":
                                    countDomainId = element.id;
                                    countDomain = element.elementPriceRule;
                                    break;
                                case "bandWidth":
                                    bandWidthId = element.id;
                                    bandWidth = element.elementPriceRule;
                                    break;
                            }
                        });
                    }else{
                        that.$message({
                            type: 'error',
                            message:sdata.msg,
                            customClass:'cus-message-class',
                        })
                    }
                    that.$nextTick(function () {//vue的数据载入绘制完成后执行的方法，以确保Vue已经将新数据刷新到DOM
                        that.baseWidthId = baseWidthId;
                        that.bandWidthId = bandWidthId;
                        that.countId = countId;
                        that.countDomainId = countDomainId;
                        that.durationId = durationId;

                        that.baseWidths = baseWidthArr;
                        that.durations = durationArr;
                        that.count = count;
                        that.countDomain = countDomain;
                        that.bandWidth = bandWidth;
                    });
                });
            },
            //添加基础防护带宽input框
            addbaseWidthInput(){
                this.baseWidths.push({id:"0",value:"",price:""});
            },
            //修改input框为可操作
            editInput($event){
                $($event.currentTarget).parent().prev().children().removeAttr("disabled");
            },
            //删除element-data操作
            removeInput($event,obj){
                let that = this;
                if(obj.id != 0){
                    this.$confirm('确定要删除该配置项吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type:'warning'
                    }).then(() => {
                        sendGetAjax("serviceConf/deleteServiceConfData?id="+obj.id+"&time="+new Date().getTime(),true).then(function(sdata) {
                            if(sdata.code=="000"){
                                that.$message({
                                    message:sdata.msg,
                                    type:'success',
                                    customClass:'cus-message-class',
                                });
                                $($event.currentTarget).parent().parent().remove();
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
                }else{
                    $($event.currentTarget).parent().parent().remove();
                }
            },
            //添加时长input框
            addDurationInput(){
                this.durations.push({id:"0",value:""});
            },

            //基础带宽防护参数提交
            baseWidthSubmit(){
                let that = this;
                let addPriceObjs = $(".add-baseWidth-price");
                let addValueObjs = $(".add-baseWidth-value");
                let updatePriceObjs = $(".update-baseWidth-price");
                let updateValueObjs = $(".update-baseWidth-value");
                let updateIdObjs = $(".update-baseWidth-id");

                let addElementDatas = [];
                let updateElementDatas = [];

                let baseWidthId = that.baseWidthId;
                $.each(addValueObjs,function(i,valueObj){
                    let addValue = $(valueObj).val();
                    let addPrice = $(addPriceObjs[i]).val();
                    addElementDatas.push({value:addValue,price:addPrice,unit:"GB",elementId:baseWidthId});
                });
                $.each(updatePriceObjs,function(i,priceObj){
                    if(!$(priceObj).attr("disabled")){
                        let updatePrice = $(priceObj).val();
                        let updateValue = $(updateValueObjs[i]).val();
                        let updateId = $(updateIdObjs[i]).val();
                        updateElementDatas.push({id:updateId,value:updateValue,price:updatePrice});
                    }
                });
                let addElement = {id:baseWidthId,elementDataList:addElementDatas};
                let updateElement = {id:baseWidthId,elementDataList:updateElementDatas};
                let elements = [addElement,updateElement];
                let sdata = sendAjax("serviceConf/addServiceConfData",true,elements).then(function(sdata) {
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
            //业务带宽参数配置提交
            bandWidthSubmit(){
                let that = this;
                let min = that.bandWidth.min;
                let max = that.bandWidth.max;
                let step = that.bandWidth.step;
                let basePrice = that.bandWidth.basePrice;
                let stepPrice = that.bandWidth.stepPrice;
                if(min>max){
                    that.$message({
                        type: 'error',
                        message: '请输入正确的个数区间',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                let elementDataList = [];
                let elementPriceRule = {elementId:that.bandWidthId,min:min,max:max,step:step,basePrice:basePrice,stepPrice:stepPrice,discount:0,discountBase:0};
                for(let i=min;i<=max;i=i+step){
                    if(i!=min) {
                        basePrice = parseInt(basePrice);
                        stepPrice = parseInt(stepPrice);
                        basePrice = basePrice + stepPrice;
                    }
                    elementDataList.push({elementId: that.bandWidthId, value: i, unit: "个", price: basePrice});
                }
                let element = {id:that.bandWidthId,elementDataList:elementDataList,elementPriceRule:elementPriceRule};
                sendAjax("serviceConf/addServiceConf",true,element).then(function(sdata) {
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
            //防护域名个数配置提交
            countDomainSubmit(){
                let that = this;
                let min = that.countDomain.min;
                let max = that.countDomain.max;
                let step = that.countDomain.step;
                let basePrice = that.countDomain.basePrice;
                let stepPrice = that.countDomain.stepPrice;
                if(min>max){
                    that.$message({
                        type: 'error',
                        message: '请输入正确的个数区间',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                let elementDataList = [];
                let elementPriceRule = {elementId:that.countDomainId,min:min,max:max,step:step,basePrice:basePrice,stepPrice:stepPrice,discount:0,discountBase:0};
                for(let i=min;i<=max;i=i+step){
                    if(i!=min) {
                        basePrice = parseInt(basePrice);
                        stepPrice = parseInt(stepPrice);
                        basePrice = basePrice + stepPrice;
                    }
                    elementDataList.push({elementId: this.countDomainId, value: i, unit: "个", price: basePrice});
                }
                let element = {id:this.countDomainId,elementDataList:elementDataList,elementPriceRule:elementPriceRule};
                sendAjax("serviceConf/addServiceConf",true,element).then(function(sdata) {
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

            //购买时长配置提交
            durationSubmit(){
                let that = this;
                let addValueObjs = $(".add-duration-value");
                let updateValueObjs = $(".update-duration-value");
                let updateIdObjs = $(".update-duration-id");

                let addElementDatas = [];
                let updateElementDatas = [];
                let durationId = that.durationId;
                $.each(addValueObjs,function(i,valueObj){
                    let addValue = $(valueObj).val();
                    addElementDatas.push({value:addValue,elementId: durationId,unit:"个月",price:0});
                });
                $.each(updateValueObjs,function(i,valueObj){
                    if(!$(valueObj).attr("disabled")){
                        let updateValue = $(valueObj).val();
                        let updateId = $(updateIdObjs[i]).val();
                        updateElementDatas.push({id:updateId,value:updateValue,price:0});
                    }
                });
                let addElement = {id:durationId,elementDataList:addElementDatas};
                let updateElement = {id:durationId,elementDataList:updateElementDatas};
                let elements = [addElement,updateElement];
                sendAjax("serviceConf/addServiceConfData",true,elements).then(function(sdata) {
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
            //购买数量配置参数提交
            countSubmit(){
                let that = this;
                let min = that.count.min;
                let max = that.count.max;
                if(min>max){
                    that.$message({
                        type: 'error',
                        message: '请输入正确的个数区间',
                        customClass:'cus-message-class',
                    });
                    return;
                }
                let elementDataList = [];
                for(let i=min;i<=max;i++){
                    elementDataList.push({elementId:that.countId,value:i,unit:"个",price:0});
                }
                let elementPriceRule = {elementId:that.countId,min:min,max:max,step:1,stepPrice:0,discount:0,discountBase:0};
                let element = {id:that.countId,elementDataList:elementDataList,elementPriceRule:elementPriceRule};
                sendAjax("serviceConf/addServiceConf",true,element).then(function(sdata) {
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

            //添加版本input
            addServicePackageInput(){
                this.servicePackages.push({packageId:"0",serviceVersion:"",serviceTtl:"",ipCount:""})
            },
            //删除版本input操作
            removePackageInput($event,obj){
                let that = this;
                if(obj.packageId != 0){
                    that.$confirm('确定要删除该配置项吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type:'warning'
                    }).then(() => {
                        sendGetAjax("serviceConf/?id="+obj.packageId+"&time="+new Date().getTime(),true).then(function(sdata) {
                            if(sdata.code=="000"){
                                that.$message({
                                    message:sdata.msg,
                                    type:'success',
                                    customClass:'cus-message-class',
                                });
                                $($event.currentTarget).parent().parent().remove();
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
                }else{
                    $($event.currentTarget).parent().parent().remove();
                }
            },
            //版本控制提交
            servicePackageSubmit(){
                let that = this;
                let addVersionObjs = $(".add-servicePackage-serviceVersion");
                let addTtlObjs = $(".add-servicePackage-serviceTtl");
                let updateVersionObjs = $(".update-servicePackage-serviceVersion");
                let updateTtlObjs = $(".update-servicePackage-serviceTtl");
                let updatePackageIdObjs = $(".update-servicePackage-packageId");

                let addServicePackages = [];
                let updateServicePackages = [];

                $.each(addVersionObjs,function(i,versionObj){
                    let addVersion = $(versionObj).val();
                    let addTtl = $(addTtlObjs[i]).val();
                    let ipCount = addTtl.split("、").length;
                    addServicePackages.push({serviceVersion:addVersion,serviceTtl:addTtl,ipCount:ipCount});
                });
                $.each(updateTtlObjs,function(i,ttlObj){
                    if(!$(ttlObj).attr("disabled")){
                        let updateTtl = $(ttlObj).val();
                        let updateVersion = $(updateVersionObjs[i]).val();
                        let updatePackageId = $(updatePackageIdObjs[i]).val();
                        let ipCount = updateTtl.split("、").length;
                        updateServicePackages.push({packageId:updatePackageId,serviceVersion:updateVersion,serviceTtl:updateTtl,ipCount:ipCount});
                    }
                });
                let servicePackages = [addServicePackages,updateServicePackages];
                sendAjax("serviceConf/addServicePackage",true,servicePackages).then(function(sdata) {
                    if(sdata.code=="000"){
                        that.$message({
                            message:sdata.msg,
                            type:'success',
                            customClass:'cus-message-class',
                        });
                        that.initServicePackage();
                    }else{
                        that.$message({
                            message:sdata.msg,
                            type:'error',
                            customClass:'cus-message-class',
                        });
                    }
                });
            },


        }
    }
</script>
