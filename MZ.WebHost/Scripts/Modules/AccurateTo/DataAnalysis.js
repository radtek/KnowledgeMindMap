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
                $.get("/Home/GetCustomerAnalyDimGroupJson?marketId=" + markId + "&briefSumId=" + briefSumId + "&dimId=" + dimId + "&feildName=" + feildName + "&tableName=" + tblName, function (data) {
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


// 生成图表
$("#p-j-generateChart").on("click", function () {
    var sourceIds = $(".p-j-selSource").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("state");
    }).get().join("|");
    if (sourceIds == "") {
        alert("请选择客源");
        return conditions;
    }
    var propertyIds = $(".p-j-selProp").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("propid");
    }).get().join("|");
    var dimIds = $(".p-j-seledDim").find("a").map(function () {
        return $(this).attr("dimid");
    }).get().join(",");
    if (dimIds == "") {
        alert("请选择分析维度");
        return false;
    }
    var groupParam = GetDimGroupParam(dimIds);
    if ($("#forewordEditor").length > 0) {
        UE.getEditor("forewordEditor").destroy();
    }
    if ($("#summaryEditor").length > 0) {
        UE.getEditor("summaryEditor").destroy();
    }
    var formData = "marketId=" + markId + "&dimIds=" + dimIds + "&sourceIds=" + sourceIds + "&propertyIds=" + propertyIds + "&schemeId=" + schemeId + "&briefSumId=" + briefSumId + "&isReadDB=" + isReadDB;
    formData += "&groupparam=" + encodeURI(groupParam);
    $("body").maskInfo({ loadType: "6" });
    $.ajax({
        url: "/AccurateToCenter/AnalysisCustomerDim",
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
            isReadDB = 0;
        }
    });
});

function GetCondition() {
    var conditions = "";
    var index=0;
    var sourceIds = $(".p-j-selSource").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("state");
    }).get().join("|");
    if (sourceIds == "") {
        alert("请选择客源");
        return conditions;
    }
    conditions +="conditions[0].FeildName=State&conditions[0].TableName=CustomerAnalysisData&conditions[0].QueryType=IN&conditions[0].DateType=String&conditions[0].FeildValue="+sourceIds;
    index++;
    var propertyIds = $(".p-j-selProp").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("propid");
    }).get().join("|");
    if(propertyIds.length>0)
    {
      conditions +="&conditions["+index+"].FeildName=State&conditions["+index+"].TableName=CustomerAnalysisData&conditions["+index+"].QueryType=IN&conditions["+index+"].DateType=String&conditions["+index+"].FeildValue="+sourceIds;
    }
    return conditions;
}
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

