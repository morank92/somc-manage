function initDataTable(dom,visiList){
    //$(dom).dataTable().fnDraw(false);
    $(dom).find("th").attr("style","text-align: center;");
    let table = $(dom).DataTable({
        //"bSort": true, // 排序功能
        //"aaSorting": [[1, "desc"]],//排序，时间列
        "bLengthChange": true, //改变每页显示数据数量
        "bFilter": false, //过滤功能
        "paging": true,//是否显示分页
        "bProcessing": true,//处理中。。。。
        'bRetrieve': true,
        "destroy": true,//允许clear重构
        "sPaginationType": "full_numbers",//two_button
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "无数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "sZeroRecords": "未检索到数据",
            "sSearch": "关键字  ",
            "sProcessing": "正在加载中......",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "尾页"
            }
        },
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $(nRow).attr("name", "trData");//标识，给后面操作当前行的数据用

            let tds = $(nRow).children('td');
            //样式居中
            for (let i = 0; i < tds.length; i++) {
                tds.eq(i).attr('style', 'text-align: center;vertical-align:middle;');
            }
        },
        "fnInitComplete": function (oSettings, json) {
            //隐藏列
            let dt = $(dom).dataTable().api();
            if(visiList.length != 0){//之前有设置过隐藏列
                for(let i=0;i<visiList.length;i++){
                    dt.column(visiList[i]).visible(false);
                }
            }
        }
    });
    return table;
}

//modal页面的初始化
function initModal(dom){
    //清空表单信息
    let fdom = $(dom).find('form');
    if(fdom.length != 0){
        $(fdom)[0].reset();
    }
    //初始化模态框
    $(dom).modal({
        //backdrop:false,//默认情况下，点击其它位置，模态框自动关闭，你可以设置此属性为false或者"static"防止模态框自动关闭
        keyboard:true,//键盘上的 esc 键被按下时关闭模态框。
        show:true,//模态框初始化之后就立即显示出来
        remote:false
    });
}

export {initDataTable,initModal}


