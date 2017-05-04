var selDim = [];
// 生成图表
$("#p-j-generateChart").on("click", function () {
    var conditionParam = GetConditionParam();
    if (conditionParam == "") {
        alert("请选择要分析的客群数据");
        return;
    }
    var dimIds = $(".p-j-seledDim").find("a").map(function () {
        return $(this).attr("dimid");
    }).get().join(",");
    if (dimIds == "") {
        alert("请选择分析维度");
        return false;
    }
    var groupParam = GetDimGroupParam(dimIds);
    var formData = "where=" + escape(conditionParam) + "&dimIds=" + dimIds + "&briefSumId=" + briefSumId;
    formData += "&groupparam=" + encodeURI(groupParam);
    $("body").maskInfo({ loadType: "6" });
    $.ajax({
        url: "/GroupAnalysis/CustomerAnalysisResult",
        type: "post",
        data: formData,
        dataType: "html",
        error: function () {
            $("body").unmaskInfo();
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            $("body").unmaskInfo();
            $("#p-j-showChart").html(data);
        }
    });

});

//获取筛选参数
function GetConditionParam()
{
   var conditionParam = "";
   $("#tblSelect").find("ul[xtype=codition]").each(function () {
       var feildName = $(this).attr("feildName");
       var vals = "";
       $(this).find("input[feildName=" + feildName + "]:checked").each(function () {
           if (vals == "") {
               vals = $(this).val();
           } else {
               vals += "|" + $(this).val();
           }
       });
       if (vals != "") {
           if (conditionParam == "") {
               conditionParam = feildName + ":" + vals;
           } else {
               conditionParam += "*" + feildName + ":" + vals;
           }
       }
   });
   return conditionParam;}
//分组维度的分组参数
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
            groupHtml += "<a class='yh-a_gray' onclick='reGroup(this)' href='javascript:;'>[重新分组]</a></td></tr>";
            if ($this.prop("checked") == true) {
                $("#p-j-makeSure").before(groupHtml);

                var html = "";
                $.get("/Home/GetCustomerAnalyDimGroupJson?dimId=" + dimId + "&feildName=" + feildName + "&tableName=" + tblName, function (data) {
                    for (var i in data) {
                        //存储自定义分组数据 格式Json字符串,{"tableName":"","feildName":"",dataRegion:"minVal-maxVal,minVal-maxVal"} -->
                        var min = data[i].min;
                        var max = data[i].max;
                        if (min > 0 && max > 0) {
                            html += "<li class='mr20' min='" + min + "' max='" + max + "'>" + min + "-" + max + unit + "</li>";
                        } else if (min > 0 && max == "") {
                            html += "<li class='mr20' min='" + min + "' max='" + max + "'> ≥ " + min + unit + "</li>";
                        } else if (min == "" && max >= 0) {
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

//重新分组
function reGroup(obj) {
    var $this = $(obj);
    var dimId = $this.closest("tr").attr("dimid"); //分组dimId
    var unit = $.trim($("#p-j-selAnalysisDim").find("li[dimid=" + dimId + "]").attr("unit"));
    var isclosed = $.trim($("#p-j-selAnalysisDim").find("li[dimId=" + dimId + "]").attr("isclosed"));
    var dimName = $.trim($this.closest("tr").children(":first").text().replace("分组", "")); //分组名
    //+ "&briefSumId=" + briefSumId + 
    var $box = $.YH.box({
        title: "对" + dimName + "重新分组",
        width: 520,
        height: 550,
        target: "/AccurateToCenter/CustomerAnalyDimGroup?dimId=" + dimId+"&r=" + Math.random(),
        afterLoaded: function () {
            //年龄新增区间
            $(this).on("click", ".p-j-addBtn", function () {
                var trDom = $("<tr flag='1'><td align='center'><input type='text' class='min w150 intOnly'></td><td align='center'><input type='text' class='max w150 intOnly'></td><td align='center'>" + unit + "</td><td align='center'><a href='javascript:void(0);' class='p-j-delGroup yh-a_red'>删除</a></td></tr>");
                if ($("#p-j-addGroup table tr[flag=1]").find(".min").val() == "" && $("#p-j-addGroup table tr[flag=1]").find(".max").val() == "") {
                    alert("请先确定新增的区间范围！");
                    return false;
                }
                if ($("#p-j-addGroup table tr[flag=1]").length < 1) {//区间为空的时候
                    $("#p-j-addGroup tbody").append(trDom);
                    return false;
                } else {
                    if (checkFlagTr(initArray, isclosed) == false) return false;
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

            $("#p-j-addGroup table").on("focus", "input", function (e) {
                var target = $(e.target);
                var $this = $(this);
                if (target.closest("tr[flag=1]").length == 0) {
                    if (checkFlagTr(initArray, isclosed) == true) {
                        $this.closest("tr").attr("flag", "1").siblings().removeAttr("flag");
                    }
                }
            });
        },
        ok: function () {
            if (checkFlagTr(initArray, isclosed) == false && $("#p-j-addGroup table tr[flag=1]").length > 0) {
                return false;
            }
            var dataStr = [];
            var html = "";
            $("#p-j-addGroup tbody tr").each(function () {
                var min = $(this).find(".min").val();
                var max = $(this).find(".max").val();
                if (min > 0 && max > 0) {
                    html += "<li class='w70' min='" + min + "' max='" + max + "'>" + min + "-" + max + unit + "</li>";
                } else if (min > 0 && max == "") {
                    html += "<li class='w70' min='" + min + "' max='" + max + "'> ≥" + min + unit + "</li>";
                } else if (min == "" && max >= 0) {
                    html += "<li class='w70' min='" + min + "' max='" + max + "'> ≤" + max + unit + "</li>";
                }
                if (min != "" || max != "") {
                    dataStr.push(min + ":" + max);
                }
            });
            $("#p-j-GroupList" + dimId).html(html);
            $.post("/Home/JZQH_SaveDimPersonalValue", {
                dimId: dimId,
                dataStr: dataStr.toString()
            }, function (data) {

            });
        }
    });
}

//解除及禁止非当前编辑行
function allowAndBan(flag) {
    if (flag == false) {
        $("#p-j-addGroup tbody tr").not("[flag=1]").each(function () {
            $(this).find(".min").prop("disabled", "disabled");
            $(this).find(".max").prop("disabled", "disabled");
        });
    } else {
        $("#p-j-addGroup tbody tr").not("[flag=1]").each(function () {
            $(this).find(".min").removeProp("disabled");
            $(this).find(".max").removeProp("disabled");
        });
    }
}

//初始化数组
function initArray() {
    var oldData = new Array(); //将旧数据存为二维数组
    $("#p-j-addGroup tbody tr").not("[flag=1]").each(function () {
        var $this = $(this);
        var minVal = parseInt($this.find(".min").val());
        var maxVal = parseInt($this.find(".max").val());
        if (minVal > 0 && maxVal > 0) {
            var ary = ["min-" + minVal, "max-" + maxVal];
            oldData.push(ary);
        } else if (minVal > 0 && isNaN(maxVal)) {
            var ary = ["min-" + minVal];
            oldData.push(ary);
        } else if (isNaN(minVal) && maxVal > 0) {
            var ary = ["max-" + maxVal];
            oldData.push(ary);
        }
    });
    return oldData;
}
//判断新的区间是否正确
function checkFlagTr(fn, isclosed) {
    var oldData = fn();
    var flag = true; //标识是否正确
    $flagTr = $("#p-j-addGroup tr[flag=1]");
    var minValNew = $flagTr.find(".min").val(); //编辑行的最大最小值
    var maxValNew = $flagTr.find(".max").val();
    if (minValNew > 0 && maxValNew > 0) {
        if (parseInt(maxValNew) <= parseInt(minValNew)) {
            $flagTr.find(".max").val("");
            flag = false;
        } else {
            for (var i = 0; i < oldData.length; i++) {
                if (oldData[i].length == 1) {//开区间
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
                    } else if (type == "max") { //<=max
                        if ((parseInt(minValNew) < parseInt(typeVal) || parseInt(maxValNew) <= parseInt(typeVal)) && isclosed != "1") { //不符合的值
                            flag = false;
                            break;
                        } else if ((parseInt(minValNew) < parseInt(typeVal) || parseInt(maxValNew) < parseInt(typeVal)) && isclosed == "1") { //不符合的值
                            flag = false;
                            break;
                        }
                    }
                } else {//闭区间
                    var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                    var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                    if (minValNew >= dataMinVal && ((minValNew < dataMaxVal && isclosed != "1") || ((minValNew <= dataMaxVal) && isclosed == "1"))) {
                        flag = false;
                        break;
                    } else if (((maxValNew > dataMinVal && isclosed != "1") || (maxValNew >= dataMinVal && isclosed == "1")) && maxValNew <= dataMaxVal) {
                        flag = false;
                        break;
                    } else if (minValNew <= dataMinVal && maxValNew >= dataMaxVal) {
                        flag = false;
                        break;
                    }
                }
            }
        }
    } else if (minValNew > 0 && maxValNew == "") { //新区间为开区间
        for (var i = 0; i < oldData.length; i++) {
            if (oldData[i].length == 1) {//开区间
                var inpVal = oldData[i][0];
                var type = inpVal.split("-")[0];
                var typeVal = parseInt(inpVal.split("-")[1]);
                if (type == "min") {
                    flag = false;
                    break;
                } else if (type == "max") { //<=max
                    if ((minValNew < typeVal && isclosed != "1") || (minValNew <= typeVal && isclosed == "1")) {
                        flag = false;
                        break;
                    }
                }
            } else { //闭区间
                var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                if (minValNew <= dataMinVal || ((minValNew < dataMaxVal && isclosed != "1") || (minValNew < dataMaxVal && isclosed == "1"))) {
                    flag = false;
                    break;
                }
            }
        }
    } else if (minValNew == "" && maxValNew > 0) {
        for (var i = 0; i < oldData.length; i++) {
            if (oldData[i].length == 1) {//开区间
                var inpVal = oldData[i][0];
                var type = inpVal.split("-")[0];
                var typeVal = parseInt(inpVal.split("-")[1]);
                if (type == "min") {
                    if ((maxValNew > typeVal && isclosed != "1") || (maxValNew >= typeVal && isclosed == "1")) {
                        flag = false;
                        break;
                    }
                } else if (type == "max") { //<=max
                    flag = false;
                    break;
                }
            } else { //闭区间
                var dataMinVal = parseInt(oldData[i][0].split("-")[1]);
                var dataMaxVal = parseInt(oldData[i][1].split("-")[1]);
                if (((maxValNew > dataMinVal && isclosed != "1") || (maxValNew >= dataMinVal && isclosed == "1")) || maxValNew >= dataMaxVal) {
                    flag = false;
                    break;
                }
            }
        }
    } else {
        flag = false;
    }
    if (flag == false) {
        $(".ui-dialog-warning").show();
    } else {
        $(".ui-dialog-warning").hide();
    }
    allowAndBan(flag);
    return flag;
}

// 交换维度
$(".p-j-seledDim").on("click", ".p-j-changeDim", function () {
    if (selDim.length == 2) {
        var temp = selDim[0];
        selDim[0] = selDim[1];
        selDim[1] = temp;
        $(".p-j-seledDim").html(selDim.join("")).append("<a href='javascript:void(0)' class='p-j-changeDim yh-a_gray'>[交换]</a>");
    }
});

// 删除
$(".p-j-seledDim").on("click", ".p-icon_del", function () {
    var $this = $(this);
    var dimId = $this.closest("a").attr("dimid");
    $this.closest("tbody").find("tr[dimid=" + dimId + "]").remove();
    $this.closest("a").remove();
    $("#p-j-selAnalysisDim").find("li[dimid=" + dimId + "]").find("input").prop("checked", false);
    $(".p-j-seledDim").find(".p-j-changeDim").remove();
    if (selDim.length == 2) {
        if (selDim[0] == $this.closest("a").prop("outerHTML").replace(/\"/g, "'")) {
            selDim.splice(0, 1);
        } else {
            selDim.splice(1, 1);
        }
    } else {
        selDim = [];
    }
});