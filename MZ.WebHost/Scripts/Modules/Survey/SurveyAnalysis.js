// 选中维度事件
$("#p-j-selAnalysisDim").off("click").on("click", "input", function (e) {
    var $this = $(this);
    var dimLiObj = $this.closest("li");
    var dimId = dimLiObj.attr("dimid");
    var unit = $.trim(dimLiObj.attr("unit"));
    var isclosed = $.trim(dimLiObj.attr("isclosed"));
    var valueType = dimLiObj.attr("valuetype");
    var selHtml = "<a href='javascript:void(0)' dimid='";
    selHtml += dimId;
    selHtml += "' class='p-f_redBrown mr15'>";
    selHtml += $this.siblings("div").text();
    selHtml += "<i class='p-icon_del ml5'></i></a>";
    // $('li[dimid=' + $this.closest("li").attr('dimid') + ']').find("input").prop('checked', $this.prop('checked'));
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
});
// 生成图表
$("#p-j-generateChart").on("click", function () {
    var markeIds = $(".p-j-selSource").find("[type=checkbox]:checked").map(function () {
        return $(this).closest("li").attr("markedId");
    }).get().join("|");
    var dimIds = $(".p-j-seledDim").find("a").map(function () {
        return $(this).attr("dimid");
    }).get().join(",");
    if (dimIds == "") {
        alert("请选择分析维度");
        return false;
    }
    var statTotal = $(".p-j-selSource").find("[name=statTotal]:checked").val();
    var filterNull = $(".p-j-selSource").find("[name=filterNull]:checked").val();

    var formData = "marketIds=" + markeIds + "&dimIds=" + dimIds + "&statTotal=" + statTotal + "&filterNull=" + filterNull;
    $("body").maskInfo({ loadType: "6" });
    $.ajax({
        url: "/SurveyLib/CaseAnalysisResult?caseId=" + caseId + "&briefSumId=" + briefSumId ,
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


// 保存小结
function saveBriefSum() {
    if (schemeId == 0) {
        $.YH.box({
            target: ".p-j-schemeDiv",
            width: "840",
            title: "选择或添加方案",
            ok: function () {
                var isCreate = 0;
                var scheme = "";
                if ($(this).find("select").val() == "0") {
                    isCreate = 1;
                    scheme = "&schemeName=" + $(this).find(".p-j-schemeName").val();
                    scheme += "&foreword=" + encodeURIComponent(encodeURIComponent(forewordUE.getContent()));
                    scheme += "&summary=" + encodeURIComponent(encodeURIComponent(summaryUE.getContent()));
                } else {
                    scheme = "&schemeId=" + schemeId;
                }
                $.ajax({
                    url: '/Home/SaveCaseAnalysisSummary',
                    data: $(".p-j-briefform").serialize() + "&isCreate=" + isCreate + scheme,
                    type: 'post',
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
                        } else {
                            if (schemeId == "") {
                                window.location.href = "/SurveyLib/CaseAnalysis?schemeId=" + data.htInfo.schemeId + "&caseId="+caseId+"&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random();
                            } else {
                                $("#schemeBriefList").load("/SurveyLib/CaseSchemeBriefSumList?schemeId=" + data.htInfo.schemeId + "&caseId=" + caseId + "&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random(), function () {
                                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                                });
                            }

                        }
                    }
                });
            }
        });
    } else {
        $.ajax({
            url: '/Home/SaveCaseAnalysisSummary',
            data: $(".p-j-briefform").serialize()+ "&isCreate=0&schemeId=" + schemeId,
            type: 'post',
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", "保存失败！", { infotype: 2 });
                } else {
                    //window.location.href = "/GroupAnalysis/CustomerAnalysis?pageType=3&isEdit=1&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random();
                    $("#schemeBriefList").load("/SurveyLib/CaseSchemeBriefSumList?schemeId=" + data.htInfo.schemeId + "&caseId=" + caseId + "&briefSumId=" + data.htInfo.briefSumId + "&r=" + Math.random(), function () {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                    });
                }
            }
        });
    }

}

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
// 交换维度
$(".p-j-seledDim").on("click", ".p-j-changeDim", function () {
    if (selDim.length == 2) {
        var temp = selDim[0];
        selDim[0] = selDim[1];
        selDim[1] = temp;
        $(".p-j-seledDim").html(selDim.join("")).append("<a href='javascript:void(0)' class='p-j-changeDim yh-a_gray'>[交换]</a>");
    }
});

//删除小结
function DeleteCaseBriefSummary(briefSumId) {
    if (confirm("确定要删除该分析小结?")) {
        $.ajax({
            url: '/Home/DeleteCaseAnalysisSummary',
            data: "briefSumId=" + briefSumId,
            type: 'post',
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", "删除失败！", { infotype: 2 });
                } else {
                    window.location.href = "/SurveyLib/CaseAnalysis?schemeId=" + schemeId + "&caseId=" + caseId + "&r=" + Math.random();
                    $.tmsg("m_jfw", "删除成功！", { infotype: 1 });
                }
            }
        });
    }
}


// 修改方案名
$(".p-j-changeSchemeName").on("blur", function () {
    var $this = $(this);
    var $curVal = $.trim($this.val());
    if ($curVal == "") {
        $this.val($this.attr("defname"));
    } else if ($curVal != $this.attr("defname")) {
        $.ajax({
            url: "/Home/SavePostInfo",
            type: 'post',
            data: {
                tbName: "CaseAnalyiseScheme",
                queryStr: "db.CaseAnalyiseScheme.distinct('_id',{'schemeId':'" + schemeId + "'})",
                name: $curVal
            },
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $this.attr("defname", $curVal);
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                }
            }
        });
    }
});

// 方案前言
$(".p-j-changeSchemeForeword").on("click", function () {
    var params = [];
    params.push("tableName=CaseAnalyiseScheme");
    params.push("keyName=schemeId");
    params.push("keyValue=" + schemeId);
    params.push("sumField=foreword");
    $.YH.box({
        target: "/AccurateToCenter/AnalySchemeSummary?" + params.join("&") + "&r=" + Math.random(),
        title: "方案前言",
        width: "840",
        height: "450",
        beforeDestroy: function () {
            UE.getEditor('sumEditor').destroy();
        },
        ok: function () {
            var foreword = UE.getEditor('sumEditor').getContent();
            $.ajax({
                url: "/Home/SavePostInfo",
                type: "post",
                data: {
                    tbName: "CaseAnalyiseScheme",
                    queryStr: "db.CaseAnalyiseScheme.distinct('_id',{'schemeId':'" + schemeId + "'})",
                    foreword: encodeURIComponent(foreword)
                },
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    } else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                    }
                }
            });
        }
    });
});

// 方案总结
$(".p-j-changeSchemeSummary").on("click", function () {
    var params = [];
    params.push("tableName=CaseAnalyiseScheme");
    params.push("keyName=schemeId");
    params.push("keyValue=" + schemeId);
    params.push("sumField=summary");
    $.YH.box({
        target: "/AccurateToCenter/AnalySchemeSummary?" + params.join("&") + "&r=" + Math.random(),
        title: "方案总结",
        width: "840",
        height: "450",
        beforeDestroy: function () {
            UE.getEditor('sumEditor').destroy();
        },
        ok: function () {
            var summary = UE.getEditor('sumEditor').getContent();
            $.ajax({
                url: "/Home/SavePostInfo",
                type: "post",
                data: {
                    tbName: "CaseAnalyiseScheme",
                    queryStr: "db.CaseAnalyiseScheme.distinct('_id',{'schemeId':'" + schemeId + "'})",
                    summary: encodeURIComponent(summary)
                },
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    } else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                    }
                }
            });
        }
    });
});

