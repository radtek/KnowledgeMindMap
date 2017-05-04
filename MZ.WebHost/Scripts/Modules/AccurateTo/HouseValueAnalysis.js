//获取分组条件
function GetDimGroupParam(dimIds) {
    var arrDimId = dimIds.split(",");
    var groupParam = "";
    $.each(arrDimId, function (i, val) {
        var param = "";
        $("#p-j-GroupList" + val).find("li").each(function () {
            if (param != "") {
                param += "," + $(this).attr("min") + "|" + $(this).attr("max");
            } else {
                param += $(this).attr("min") + "|" + $(this).attr("max");
            }
        });
        if (param != "") {
            groupParam += "##" + val + ":" + param;
        }
    });
    return groupParam;
}

// 维度选中事件
$("#p-j-selAnalysisDim").off("click").on("click", "input", function (e) {
    var $this = $(this);
    var dimId = $this.closest("li").attr("dimid");
    var feildName = $this.closest("li").attr("feildName");
    var tblName = $this.closest("li").attr("tableName");
    var unit = $this.closest("li").attr("unit");
    var dataType = $this.closest("li").attr("dataType");
    var isCustomerGroup = $this.closest("li").attr("isCustomerGroup") == "1";
    var selHtml = "<a href='javascript:void(0)' dimid='";
    selHtml += dimId;
    selHtml += "' class='p-f_redBrown mr15'>";
    selHtml += $this.siblings("div").text();
    selHtml += "<i class='p-icon_del ml5'></i></a>";
    if ($this.prop("checked")) {
        if ($.inArray(selHtml, selDim) == -1) {
            if (selDim.length < 2) {
                selDim.push(selHtml);
            } else {
                alert("最多选两个维度");
                return false;
            }
        } else {
            return false;
        }
    } else {
        $(".p-j-seledDim").find(".p-j-changeDim").remove();
        if ($.inArray(selHtml, selDim) > -1) {
            selDim.splice($.inArray(selHtml, selDim), 1);
        } else {
            return false;
        }
    }
    $(".p-j-seledDim").html(selDim.join(""));
    if (selDim.length == 2) {
        $(".p-j-seledDim").append("<a href='javascript:void(0)' class='p-j-changeDim yh-a_gray'>[交换]</a>");
    }
    if (isCustomerGroup == true) {
        if (dataType == "1" || dataType == "2") {
            //数字区间分组
            var groupHtml = "<tr style='display: table-row;' dimid='" + dimId + "'><td class='yh-f_gray' valign='top'>" + $this.siblings("div").text() + "分组</td>";
            groupHtml += "<td valign='top'><ul id='p-j-GroupList" + dimId + "' class='li_fl fl'>"
            groupHtml += "</ul>";
            groupHtml += "<a class='yh-a_gray' onclick='reGroup(event,this,false);' href='javascript:;'>[重新分组]</a></td></tr>";
            if ($this.prop("checked") == true) {
                $("#p-j-makeSure").before(groupHtml);

                var html = "";
                $.get("/Home/GetHouseValueAnalyDimGroupJson?marketId=" + markId + "&graphId="+curGraphId+"&briefSumId=" + briefSumId + "&dimId=" + dimId + "&feildName=" + feildName + "&tableName=" + tblName, function (data) {
                    for (var i in data) {
                        //存储自定义分组数据 格式Json字符串,{"tableName":"","feildName":"",dataRegion:"minVal-maxVal,minVal-maxVal"} -->
                        var min = data[i].min;
                        var max = data[i].max;
                        if (min > 0 && max > 0) {
                            html += "<li class='mr20' min='" + min + "' max='" + max + "'>" + min + "-" + max + unit + "</li>";
                        } else if (min > 0 && max == "") {
                            html += "<li class='mr20' min='" + min + "' max='" + max + "'> ≥ " + min + unit + "</li>";
                        } else if (min == "" && max > 0) {
                            html += "<li class='mr20' min='" + min + "' max='" + max + "'> ≤ " + max + unit + "</li>";
                        }
                    }
                    $("#p-j-GroupList" + dimId).html(html);
                });
            } else if ($this.prop("checked") == false) {
                $this.closest("tbody").find("tr[dimid=" + dimId + "]").remove();
            }
        }
    }
});

// 生成图表
$("#p-j-generateChart").on("click", function () {
    var sourceIds = $(".p-j-selSource").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("state");
    }).get().join("|");
    if (sourceIds == "") {
        alert("请选择房源");
        return false;
    }
    var dimIds = $(".p-j-seledDim").find("a").map(function () {
        return $(this).attr("dimid");
    }).get().join(",");
    if (dimIds == "") {
        alert("请选择分析维度");
        return false;
    }
    var groupParam = GetDimGroupParam(dimIds);
    var formData = "marketId=" + markId + "&dimIds=" + dimIds + "&sourceIds=" + sourceIds + "&briefSumId=" + briefSumId;
    formData += "&groupparam=" + encodeURI(groupParam);
    $("body").maskInfo({ loadType: "6" });
    $.ajax({
        url: "/AccurateToCenter/HouseValueAnalysisDim",
        type: "post",
        data: formData,
        dataType: "html",
        error: function () {
            $("body").unmaskInfo();
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            $(".p-j-seledChart").html(data);
            $("body").unmaskInfo();

        }
    });
    $(".p-j-saveBriefSum").show();  // 可保存
    $(".p-j-addChart").show();      // 可添加
    $(".p-j-briefSumDiv").show();   // 可填写小结
});

// 选择标签,选择统计维度
$("#p-j-chartDiv").on("click", ".p-j-selSumTag li", function (e) {
    //e.stopPropagation();
    var $this = $(this);
    var $chart = $this.closest(".p-j-showChart");
    var tag = $this.attr("tag");
    var chartType = $chart.find(".p-j-changeChart").find("a[type].select").attr("type");
    var groupParam = $chart.find("input[name=groupParam]").val();
    var graphId =$chart.find("input[name=graphId]").val();
    var formData = "marketId=" + markId + "&graphId="+graphId+"&dimIds=" + $chart.find("input[name=dimIds]").val() + "&sourceIds=" + $chart.find("input[name=sourcesIds]").val() + "&briefSumId=" + briefSumId;
    formData += "&groupparam=" + encodeURI(groupParam) + "&statdim=" + tag + "&chartType=" + chartType;
    $("body").maskInfo({ loadType: "6" });
    $.ajax({
        url: "/AccurateToCenter/HouseValueAnalysisDim",
        type: "post",
        data: formData,
        dataType: "html",
        error: function () {
            $("body").unmaskInfo();
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            $(".p-j-seledChart").html(data);
            $("body").unmaskInfo();
        }
    });
});

// 切换图类型
$("#p-j-chartDiv").on("click", ".p-j-changeChart a", function (e) {
    e.stopPropagation();
    var $this = $(this);
    var type = $this.attr("type");
    var $showDiv = $this.closest(".p-j-showChart");
    var tag = $showDiv.find(".p-j-selSumTag").find("li.select").attr("tag");

    $this.addClass("select").siblings("a").removeClass("select");
    var url = "";
    switch (type) {
        case "pie":
            url = "/AccurateToCenter/ChartPie?r=" + Math.random();
            break;
        case "column":
            url = "/AccurateToCenter/ChartColumn?r=" + Math.random();
            break;
        case "line":
            url = "/AccurateToCenter/ChartLine?r=" + Math.random();
            break;
        default:
            break;
    }
    if (url != "") {
        $showDiv.find(".p-j-showDataPic").load(url, {
            infoList: $showDiv.find("input[name=summaryValue]").val(),
            sourceIds: $showDiv.find("input[name=sourcesIds]").val(),
            dimIds: $showDiv.find("input[name=dimIds]").val()
        });
        $showDiv.find("input[name=chartType]").val(type);
    }
});

  //重新分组
function reGroup(e,obj,isChild) {
    e = e || window.event;
    e.stopPropagation();
    var $this = $(obj);
    var dimId = $this.closest("tr").attr("dimid"); //分组dimId
    var unit = $.trim($("#p-j-selAnalysisDim").find("li[dimid="+dimId+"]").attr("unit"));
    var isclosed = $.trim($("#p-j-selAnalysisDim").find("li[dimId=" + dimId + "]").attr("isclosed"));
    var dimName = ""; //分组名
    var graphId = "";
    if(isChild){    // 是否是子页面的分组
        dimName = $this.closest("tr").attr("dimname");
    }else{
        dimName =$.trim($this.closest("tr").children(":first").text().replace("分组", ""));
    }
    var params = "?dimId="+dimId;
    var $curChart = $this.closest(".p-j-showChart");
    var dimValue = "";
    if(isChild){
        var dimIds = $curChart.find("input[name=dimIds]").val();
        var isCustom = "";
        if(dimIds.indexOf(",")>-1){
            if(dimIds.split(",")[0]==dimId){
                if($curChart.find("input[name=xGroupType]").val()=="1"){
                    dimValue = $curChart.find("input[name=xDimValue]").val();
                    isCustom="1";
                }
            }else if(dimIds.split(",")[1]==dimId){
                if($curChart.find("input[name=yGroupType]").val()=="1"){
                    dimValue = $curChart.find("input[name=yDimValue]").val();
                    isCustom="1";
                }
            }
        }else{
            if( $curChart.find("input[name=xGroupType]").val()=="1"){
                dimValue = $curChart.find("input[name=xDimValue]").val();
                isCustom = "1";
            };
        }
        params = params + "&isCustom="+isCustom;
    }
    params = params + "&r="+Math.random();
    var $box = $.YH.box({
        title: "对" + dimName + "重新分组",
        width: 520,
        height: 500,
        target:"/AccurateToCenter/CustomerAnalyDimGroup"+params,
        data:{
            dimValue : dimValue
        },
        afterLoaded: function () {
            //年龄新增区间
            $(this).on("click",".p-j-addBtn", function () {
                var trDom = $("<tr flag='1'><td align='center'><input type='text' class='min w150 intOnly'></td><td align='center'><input type='text' class='max w150 intOnly'></td><td align='center'>"+ unit +"</td><td align='center'><a href='javascript:void(0);' class='p-j-delGroup yh-a_red'>删除</a></td></tr>");
                if ($("#p-j-addGroup table tr[flag=1]").find(".min").val() == "" && $("#p-j-addGroup table tr[flag=1]").find(".max").val() == "") {
                    alert("请先确定新增的区间范围！");
                    return false;
                }
                if($("#p-j-addGroup table tr[flag=1]").length<1){//区间为空的时候
                    $("#p-j-addGroup tbody").append(trDom);
                    return false;
                }else{
                    if(checkFlagTr(initArray,isclosed)==false) return false;
                    $("#p-j-addGroup tbody tr").removeAttr("flag");
                    $("#p-j-addGroup tbody").append(trDom);
                }
            });

            //删除区间
            $(this).on("click", ".p-j-delGroup", function () {
                $(this).closest("tr").remove();
                $("#p-j-addGroup tbody tr:last").attr("flag", "1");
            });
            var htmlDom = "<div class='ui-dialog-warning' style='float:left;width:330px;color:red;display:none;margin-top: 12px;'>错误：您输入的区间有误!（各区间不能交叉且不包含0）</div>";
            $(".ui-dialog-buttonpane").append(htmlDom);

            $("#p-j-addGroup table").on("focus","input",function(e){
                var target  = $(e.target);
                var $this = $(this);
                if(target.closest("tr[flag=1]").length == 0){
                    if(checkFlagTr(initArray,isclosed)==true){
                        $this.closest("tr").attr("flag","1").siblings().removeAttr("flag");
                    }
                }
            });
        },
        ok: function () {
            if(checkFlagTr(initArray,isclosed)==false && $("#p-j-addGroup table tr[flag=1]").length > 0){
                return false;
            }
            var dataStr = [];
            var html = "";
            $("#p-j-addGroup tbody tr").each(function () {
                var min = $(this).find(".min").val();
                var max = $(this).find(".max").val();
                if (min > 0 && max > 0) {
                    html += "<li class='mr20' min='" + min + "' max='" + max + "'>" + min + "-" + max + unit +"</li>";
                } else if (min > 0 && max == "") {
                    html += "<li class='mr20' min='" + min + "' max='" + max + "'> ≥ " + min + unit +"</li>";
                } else if (min == "" && max > 0) {
                    html += "<li class='mr20' min='" + min + "' max='" + max + "'> ≤ " + max + unit +"</li>";
                }
                if (min != "" || max != "") {
                    dataStr.push(min + ":" + max);
                }
            });
            if(isChild){
                $this.prev().html(html);
                $.post("/Home/JZQH_SaveDimPersonalValue",{
                    dimId:dimId,
                    readOnly:1,
                    dataStr:dataStr.toString()
                },function(data){
                    if($this.attr("dim")=="1"){
                        $curChart.find("input[name=xGroupType]").val("1");
                        $curChart.find("input[name=xDimValue]").val(data.Message);
                    }else{
                        $curChart.find("input[name=yGroupType]").val("1");
                        $curChart.find("input[name=yDimValue]").val(data.Message);
                    }
                    $.post("/Home/GetGraphBriefSummaryJson",{
                        marketId:"<%=marketId %>",
                        dimIds:$curChart.find("input[name=dimIds]").val(),
                        sourcesIds:$curChart.find("input[name=sourcesIds]").val(),
                        xDimValue:$curChart.find("input[name=xDimValue]").val(),
                        yDimValue:$curChart.find("input[name=yDimValue]").val()
                    },function(summary){
                        $curChart.find("input[name=summaryValue]").val(summary.Message);
                        //$curChart.find("a[type]:first").click();
                        $curChart.find("li[tag]:first").click();
                    });
                });
            }else{
                $("#p-j-GroupList" + dimId).html(html);
                $.post("/Home/JZQH_SaveDimPersonalValue", {
                    dimId: dimId,
                    dataStr: dataStr.toString()
                }, function (data) {
                    if(data.Success==false){
                        $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
                    } else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                    }
                });
            }
        }
    });
}

 //判断新的区间是否正确
function checkFlagTr(fn, isclosed) {
    var oldData = fn();
    var flag = true; //标识是否正确
    $flagTr = $("#p-j-addGroup tr[flag=1]");
    var minValNew = $flagTr.find(".min").val(); //编辑行的最大最小值
    var maxValNew = $flagTr.find(".max").val();
    if(minValNew > 0 && maxValNew > 0){
        if(parseInt(maxValNew) <= parseInt(minValNew)){
            $flagTr.find(".max").val("");
            flag = false;
        }else {
            for(var i=0;i<oldData.length;i++){
                if(oldData[i].length==1){//开区间
                    var inpVal = oldData[i][0];
                    var type = inpVal.split("-")[0];
                    var typeVal = parseInt(inpVal.split("-")[1]);
                    if (type == "min") {
                        if ((minValNew >= typeVal || maxValNew > typeVal) && isclosed != "1") { //不符合的值
                            flag = false;
                            break;
                        } else if ((minValNew > typeVal || maxValNew > typeVal) && isclosed == "1") { //不符合的值
                            flag = false;
                            break;
                        }
                    }else if(type=="max"){ //<=max
                        if ((parseInt(minValNew) < parseInt(typeVal) || parseInt(maxValNew) <= parseInt(typeVal)) && isclosed != "1") { //不符合的值
                            flag = false;
                            break;
                        } else if ((parseInt(minValNew) < parseInt(typeVal) || parseInt(maxValNew) < parseInt(typeVal)) && isclosed == "1") { //不符合的值
                            flag = false;
                            break;
                        }
                    }
                }else{//闭区间
                    var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                    var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                    if (minValNew >= dataMinVal && ((minValNew < dataMaxVal && isclosed != "1") || ((minValNew <= dataMaxVal) && isclosed == "1"))) {
                        flag = false;
                        break;
                    } else if (((maxValNew > dataMinVal && isclosed != "1") || (maxValNew >= dataMinVal && isclosed == "1")) && maxValNew <= dataMaxVal) {
                        flag = false;
                        break;
                    }else if(minValNew <= dataMinVal && maxValNew >= dataMaxVal){
                        flag = false;
                        break;
                    }
                }
            }
        }
    }else if(minValNew > 0 && maxValNew == ""){ //新区间为开区间
        for(var i=0;i<oldData.length;i++){
            if(oldData[i].length==1){//开区间
                var inpVal = oldData[i][0];
                var type = inpVal.split("-")[0];
                var typeVal = parseInt(inpVal.split("-")[1]);
                if(type=="min"){
                    flag = false;
                    break;
                }else if(type=="max"){ //<=max
                    if ((minValNew < typeVal && isclosed != "1") || (minValNew <= typeVal && isclosed == "1")) {
                        flag = false;
                        break;
                    }
                }
            }else{ //闭区间
                var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                if (minValNew <= dataMinVal || ((minValNew < dataMaxVal && isclosed != "1") || (minValNew < dataMaxVal && isclosed == "1"))) {
                    flag = false;
                    break;
                }
            }
        }
    }else if(minValNew == "" && maxValNew > 0){
        for(var i=0;i<oldData.length;i++){
            if(oldData[i].length==1){//开区间
                var inpVal = oldData[i][0];
                var type = inpVal.split("-")[0];
                var typeVal = parseInt(inpVal.split("-")[1]);
                if(type=="min"){
                    if ((maxValNew > typeVal && isclosed != "1") || (maxValNew >= typeVal && isclosed == "1")) {
                        flag = false;
                        break;
                    }
                }else if(type=="max"){ //<=max
                    flag = false;
                    break;
                }
            }else{ //闭区间
                var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                if (((maxValNew > dataMinVal && isclosed != "1") || (maxValNew >= dataMinVal && isclosed == "1")) || maxValNew >= dataMaxVal) {
                    flag = false;
                    break;
                }
            }
        }
    }else{
        flag = false;
    }
    if(flag == false){
        $(".ui-dialog-warning").show();
    }else {
        $(".ui-dialog-warning").hide();
    }
    allowAndBan(flag);
    return flag;
}

// 保存小结
$(".p-j-saveBriefSum").on("click",function(){
    $(".p-j-tip").closest(".p-j-showChart").find(".p-j-closeGraph").click();
    if($(".p-j-showChart").length==1 && $(".p-j-saveBriefSum").is(":hidden")){
        alert("当前没有图形，请重新选择");
        return false;
    }
    var summaryName = $("input[name=summaryName]").val();
    var summaryContent = $("[name=summaryContent]").val();
    if(summaryName==""){
        alert("请先填写小结名");
        return false;
    }
    var graphJson = {};
    var i = 0;
    var tempSchemeId = schemeId;
    if(tempSchemeId=="" || tempSchemeId=="0"){
        var forewordUE = UE.getEditor("forewordEditor");
        var summaryUE = UE.getEditor("summaryEditor");
        $.YH.box({
            target:".p-j-schemeDiv",
            width:840,
            title:"选择或添加方案",
            ok:function(){
                var isCreate = 0;
                var schemeName ="";
                var schemeSummary ="";
                var foreword = "";
                var schemeForeword="";
                if($(this).find("select").val()=="0"){
                    isCreate = 1;
                    schemeName= $(this).find(".p-j-schemeName").val();
                    foreword= encodeURIComponent(forewordUE.getContent());
                    schemeSummary = encodeURIComponent(summaryUE.getContent());
                }else{
                    tempSchemeId = $(this).find("select").val();
                }
                $('.p-j-showChart').each(function () {
                    var $this = $(this);
                    graphJson[i] = {
                    graphId:$this.find("[name=graphId]").val(),
                    summaryValue: $this.find('[name=summaryValue]').val(),
                    dimIds:$this.find("[name=dimIds]").val(),
                    sourcesIds :$this.find("[name=sourcesIds]").val(),
                    groupParam:$this.find("[name=groupParam]").val(),
                    chartType:$this.find("input[name=chartType]").val(),
                    statdim:$this.find("input[name=statdim]").val()
                    };
                    i++;
                });
                $.ajax({
                    url: '/Home/SaveHouseValueBriefSummary',
                    data: {
                        graphJsonStr:JSON.stringify(graphJson),
                        delGraphIds:delGraphIds.join(","),
                        summaryName:summaryName,
                        summaryContent:summaryContent,
                        schemeId:tempSchemeId,
                        briefSumId:briefSumId,
                        marketId:markId,
                        schemeName:schemeName,
                        type :pageType,
                        foreword:foreword,
                        schemeSummary:schemeSummary,
                        isCreate:isCreate
                    },
                    type: 'post',
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
                        } else {
                            window.location.search = "?marketId="+markId+"&isEdit="+isEdit+"&pageType="+pageType+"&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random();
                            $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                        }
                    }
                });
            }
        });
    }
    else
    {
        $('.p-j-showChart').each(function () {
            var $this = $(this);
            var graphId = $this.find("name=graphId").val();
            if(graphId!="" && delGraphIds.indexOf(graphId) > -1) {
                return true;
            }
            graphJson[i] = {
            graphId:$this.find("[name=graphId]").val(),
            summaryValue: $this.find('[name=summaryValue]').val(),
            dimIds:$this.find("[name=dimIds]").val(),
            sourcesIds :$this.find("[name=sourcesIds]").val(),
            groupParam:$this.find("[name=groupParam]").val(),
            chartType:$this.find("input[name=chartType]").val(),
            statdim:$this.find("input[name=statdim]").val()
            };
            i++;
        });
        $.ajax({
            url: '/Home/SaveHouseValueBriefSummary',
            data: {
                graphJsonStr:JSON.stringify(graphJson),
                marketId:markId,
                delGraphIds:delGraphIds.join(","),
                summaryName:summaryName,
                summaryContent:summaryContent,
                schemeId:tempSchemeId,
                briefSumId:briefSumId
            },
            type: 'post',
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
                } else {
                    window.location.search = "?marketId="+markId+"&isEdit="+isEdit+"&pageType="+pageType+"&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random();
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                }
            }
        });
    }
});

function DeleteHouseValueBriefSummary(o,briefSumId) {
    $.ajax({
        url: '/Home/DeleteHouseValueBriefSummary',
        data: "briefSumId=" + briefSumId,
        type: 'post',
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
            } else {
                window.location.href = "/AccurateToCenter/HouseValueAnalysis?marketId="+markId+"&schemeId=" + data.htInfo.schemeId + "&r=" + Math.random();
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
            }
        }
    });
}