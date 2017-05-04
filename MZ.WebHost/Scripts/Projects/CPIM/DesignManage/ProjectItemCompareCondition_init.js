var itemUpdateDate1 = "";
var itemUpdateDate2 = "";
var itemCityId = "";
var itemSeriesId = "";
function changeTree(obj) {
    var curTreeId = $(obj).val();
    var nodeLevel = parseInt($(obj).attr("nodeLevel"));
    if (curTreeId == 0) {
        highLightProj();
        $(".p-j-itemCompare_popbox").find("select[id^=p-j-item]").each(function () {
            var _obj = $(this);
            var indexNodeLevel = _obj.attr("nodeLevel");
            if (parseInt(indexNodeLevel) - nodeLevel > 1) {
                _obj.remove();
            }
        });
    }
    $.post('/home/CPIMGetTreeModuleRelList',
    {
        tbName: "ProductValueTreeItem",
        ps: -1,
        cu: 1,
        treeId: curTreeId,
        nodeLevel:2,
        qu: 'db.ProductValueTreeItem.distinct("_id",{"nodeLevel":"2","itemType":{"$ne":"0"},"treeId":"' + curTreeId + '"})'
    },
    function (data) {
        data = JSON.parse(data.toString());
        var htmlLi = "";
        var firstOpt = '<option value="0">选择模块</option>';

        $(".p-j-itemCompare_popbox").find("select[id^=p-j-item]").each(function () {
            var _obj = $(this);
            var indexNodeLevel = _obj.attr("nodeLevel");
            if (parseInt(indexNodeLevel) - nodeLevel > 1) {
                //_obj.closest("tr").remove();
                _obj.remove();
            }
        });

        if (data.length > 0) {
            $(data).each(function (i, n) {
                htmlLi += '<option value="' + data[i].itemId + '">' + data[i].name + '</option>';
            });
            $("#p-j-item2").html("");
            $("#p-j-item2").append(htmlLi);
                
            $("#p-j-item2").change();
        } else {
            $("#p-j-item2").html("");
            $("#p-j-item2").append(firstOpt);
        }
    });
}

function changeModule(obj) {
    var curModuleId = $(obj).val();
    var nodeLevel = parseInt($(obj).attr("nodeLevel"));
    $("#p-j-saveCurMod").val(curModuleId);
    highLightProj();
    $.post('/home/CPIMGetTreeModuleRelList',
    {
        tbName: "ProductValueTreeItem",
        ps: -1,
        cu: 1,
        nodeLevel: (nodeLevel + 1),
        nodePid: curModuleId,
        qu: 'db.ProductValueTreeItem.distinct("_id",{"nodeLevel":"' + (nodeLevel + 1) + '","itemType":{"$ne":"0"},"nodePid":"' + curModuleId + '"})'
    },
    function (data) {
        data = JSON.parse(data.toString());
        var htmlLi = "";
        //var selectHtml = '<tr><td width="60"></td><td><select id="p-j-item' + (nodeLevel + 1) + '"  nodeLevel="' + (nodeLevel + 1) + '"  onchange="changeModule(this)"></select></td><tr>'
        var selectHtml = '<select class="mr20" id="p-j-item' + (nodeLevel + 1) + '"  nodeLevel="' + (nodeLevel + 1) + '" onchange="changeModule(this)"></select> ';

        var firstOpt = '<option value="0" id="opt' + (nodeLevel + 1) + '">请选择</option>';
        if (data.length > 0) {
            if ($("#p-j-item" + (nodeLevel + 1) + "").length > 0) {
                $("#p-j-item" + (nodeLevel + 1) + "").html("");
            } else {
                $("#p-j-item" + nodeLevel + "").closest("td").append(selectHtml);
            }
            $("#p-j-item" + (nodeLevel + 1) + "").append(firstOpt);
            $(".p-j-itemCompare_popbox").find("select[id^=p-j-item]").each(function () {
                var _obj = $(this);
                var indexNodeLevel = _obj.attr("nodeLevel");
                if (parseInt(indexNodeLevel) - nodeLevel > 1) {
                    //_obj.closest("tr").remove();
                    _obj.remove();
                }
            });
            $(data).each(function (i, n) {
                htmlLi += '<option value="' + data[i].itemId + '">' + data[i].name + '</option>';
            });
            $('#opt' + (nodeLevel + 1) + '').after(htmlLi);
            $("#p-j-item" + (nodeLevel + 1) + "").hide();
            $("#p-j-item" + (nodeLevel + 1) + "").show();
        } else {
            if ($("#p-j-item" + (nodeLevel + 1) + "").length > 0) {
                $("#p-j-item" + (nodeLevel + 1) + "").html("");
                $("#p-j-item" + (nodeLevel + 1) + "").append(firstOpt);
            }
        }
    });
}

$("#p-j-format").change(function () {
    var curFormatId = $(this).val();
    $.post('/home/GetSingleTableJson',
    {
        tbName: "ProductValueTree",
        ps: -1,
        cu: 1,
        qu: 'db.ProductValueTree.distinct("_id",{"isUse":"1","treeType":"2","formatId":"' + curFormatId + '"})'
    }, function (data) {
        var htmlLi = "";
        $(data).each(function (i, n) {
            var selected = "";
            if (i == 0) { selected = "selected='selected'" }
            htmlLi += '<option ' + selected + ' value="' + data[i].treeId + '">' + data[i].name + '</option>';
        });
        $("#p-j-tree").html("");
        $("#p-j-tree").html(htmlLi);
        $("#p-j-tree").change();
        $("input[name^=itemSelect]").val("");
        $(".p-j-itemCompare_popbox").find(".p-j-selectedProj").find("td:gt(0)").remove();
        choseProj(1, itemUpdateDate1, itemUpdateDate2, itemCityId);
        choseLine(1, itemUpdateDate1, itemUpdateDate2, "");
    });
});

function highLightProj() {
    var treeId = $("#p-j-tree").val();
    var itemId = $("#p-j-saveCurMod").val();
    $.ajax({
        url: "/Home/FindHasResultProj/",
        type: 'post',
        data: {
            treeId: treeId,
            itemId: itemId
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            $(".p-j-selProjDiv").find("label").removeClass("p-f_redBrown");
            if (data.Success == false) {
            } else {
                var projArr = data.Message.split(",");
                for (var i in projArr) {
                    if (!isNaN(i)) {
                        $(".p-j-selProj[value=" + projArr[i] + "]").parent().addClass("p-f_redBrown");
                    }
                }
            }
        }
    });
}

$(".p-j-itemCompare_popbox").find(".p-j-selDate").on("click", "a", function () {
    var curContext = $(this).html();
    var d = new Date();
    if (curContext == "全部") {
        itemUpdateDate1 = "";
        itemUpdateDate2 = "";
    } else if (curContext == "本日") {
        itemUpdateDate1 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        itemUpdateDate2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    } else if (curContext == "本周") {
        var weekStartDate = new Date(d.getFullYear(), d.getMonth(), (d.getDate() - d.getDay() + 1));
        itemUpdateDate1 = weekStartDate.getFullYear() + "-" + (weekStartDate.getMonth() + 1) + "-" + weekStartDate.getDate();
        itemUpdateDate2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    } else if (curContext == "本月") {
        //var monthStartDate = new Date(d.getYear, d.getMonth, 1);
        //itemUpdateDate1 = monthStartDate.getFullYear + "-" + (monthStartDate.getMonth() + 1) + "-" + monthStartDate.getDate();
        itemUpdateDate1 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-1";
        itemUpdateDate2 = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    $(this).addClass("p-btn_brown_1").siblings("a").removeClass("p-btn_brown_1");

    $(".p-j-itemCompare_popbox").find(".p-j-date1").val(itemUpdateDate1);
    $(".p-j-itemCompare_popbox").find(".p-j-date2").val(itemUpdateDate2);

    choseProj(1, itemUpdateDate1, itemUpdateDate2, itemCityId);
    choseLine(1, itemUpdateDate1, itemUpdateDate2, itemSeriesId);
});
$(".p-j-itemCompare_popbox").find(".p-j-selCity").on("click", "a", function () {
    $(this).addClass("p-btn_brown_1").siblings("a").removeClass("p-btn_brown_1");
    itemCityId = $(this).attr("city");
    choseProj(1, itemUpdateDate1, itemUpdateDate2, itemCityId);
});
$(".p-j-itemCompare_popbox").find(".p-j-date1").on("change", function () {
    itemUpdateDate1 = $(this).val();
    choseProj(1, itemUpdateDate1, itemUpdateDate2, itemCityId);
    choseLine(1, itemUpdateDate1, itemUpdateDate2, itemSeriesId);
});

$(".p-j-itemCompare_popbox").find(".p-j-date2").on("change", function () {
    itemUpdateDate2 = $(this).val();
    choseProj(1, itemUpdateDate1, itemUpdateDate2, itemCityId);
    choseLine(1, itemUpdateDate1, itemUpdateDate2, itemSeriesId);
});

//                $(".p-j-projCompare_popbox").find(".p-j-date1").on("change", function () {
//                    projUpdateDate1 = $(this).val();
//                    choseProj(2, projUpdateDate1, projUpdateDate2, projCityId);
//                    choseLine(2, projUpdateDate1, projUpdateDate2, projSeriesId);
//                });

//                $(".p-j-projCompare_popbox").find(".p-j-date2").on("change", function () {
//                    projUpdateDate2 = $(this).val();
//                    choseProj(2, projUpdateDate1, projUpdateDate2, projCityId);
//                    choseLine(2, projUpdateDate1, projUpdateDate2, projSeriesId);
//                });
function choseProj(kind, updateDate1, updateDate2, cityId) {
    var formatId = $("#p-j-format").val();
    if (kind == 1 || kind == 3) {
        $(".p-j-selProjDiv").load("/Contrast/ChoseItemConProject?formatId=" + formatId + "&updateDate1=" + updateDate1 + "&updateDate2=" + updateDate2 + "&cityId=" + cityId + "&r=" + Math.random());
        highLightProj();
    }
    if (kind == 2 || kind == 3) {
        $(".p-j-selProj2Div").load("/Contrast/ChoseProjConProject?formatId=" + formatId + "&updateDate1=" + updateDate1 + "&updateDate2=" + updateDate2 + "&cityId=" + cityId + "&r=" + Math.random());
    }
}
function choseLine(kind, updateDate1, updateDate2, seriesId) {
    var formatId = $("#p-j-format").val();
    if (kind == 1 || kind == 3) {
        $(".p-j-selLineDiv").load("/Contrast/ChoseItemConLine?formatId=" + formatId + "&updateDate1=" + updateDate1 + "&updateDate2=" + updateDate2 + "&seriesId=" + seriesId + "&r=" + Math.random());
    }
    if (kind == 2 || kind == 3) {
        $(".p-j-selLine2Div").load("/Contrast/ChoseProjConLine?formatId=" + formatId + "&updateDate1=" + updateDate1 + "&updateDate2=" + updateDate2 + "&seriesId=" + seriesId + "&r=" + Math.random());
    }
}
$(document).ready(function () {
    choseProj(3, "", "", "", 0);
    choseLine(3, "", "", "", 0);
    // 初始化专项对比
    $(".p-j-selProj").removeAttr("disabled");
    $(".p-j-selProj").prop("checked", false);
    $("input[name^=itemSelect]").val("");
});