
var hasInitMap = false;

// 指标单项统计
$("#p-j-indexStatistics").on("click", function () {
    $("#p-j-saveSelProj").val("0");
    $box = $.YH.box({
        title: "指标单项统计",
        width: 400,
        height: 570,
        target: "/DesignManage/IndexItemStatistics",
        buttonNames: [null, "确 定"]
    });
    $box.addClass("p-j-loadStatistics");
    $box.on("change", ".p-j-selIndex", function () {
        var stageValue = $box.find(".p-j-selStage").val();
        if ($(this).val() == "0") {
            $box.parent().find(".ui-dialog-title").text("指标单项统计");
            $box.load("/DesignManage/IndexItemStatistics?r=" + Math.random());
        } else {
            $box.parent().find(".ui-dialog-title").text($(this).find("option[value=" + $(this).val() + "]").text().replace(/-/g, "") + "指标统计");
            $box.load("/DesignManage/IndexItemStatistics?itemComDirId=" + $(this).val() + "&stageId=" + stageValue + "&r=" + Math.random());
        }
    });
    $box.on("change", ".p-j-selStage", function () {
        var indexValue = $box.find(".p-j-selIndex").val();
        if ($(this).val() == "0" && indexValue == "0") {
            $box.load("/DesignManage/IndexItemStatistics?r=" + Math.random());
        } else {
            $box.load("/DesignManage/IndexItemStatistics?itemComDirId=" + indexValue + "&stageId=" + $(this).val() + "&r=" + Math.random());
        }
    });
});


$(".p-screening-list a").click(function () {
    $(".p-screening-list a.select").removeClass("select");
    $(this).addClass("select");
    cityId = $(this).attr("value");
    cityId = cityId ? cityId : 0;
    var url = "/DesignManage/ProjectList?cityId=" + cityId + "&keyWord=" + escape(keyWord);
    url += "&noUse=" + $("input[name=noUse]").val();
    $("#projectList").load(url + "&r=" + Math.random()).attr("lurl", url);
});

function searchProject() {
    keyWord = $("#keyWord").val();
    var url = "/DesignManage/ProjectList?cityId=" + cityId + "&keyWord=" + escape(keyWord);
    url += "&noUse=" + $("input[name=noUse]").val();
    $("#projectList").load(url + "&r=" + Math.random()).attr("lurl", url);
}

function reloadSearchProject() {
    $("#keyWord").val("");
    keyWord = "";
    $(".p-screening-list a:eq(0)").click();
}



function CheckAnddeleteSelect() {
    $("#p-j-mspropertyId").find("option").each(function () {
        if ($(this).attr("selected") == "selected") {
            $(this).remove();
        }
    })
}
$('.p-j-projCompare_btn').click(function () {
    $.YH.box({
        target: "/DesignManage/ProjectCompareCondition?r=" + Math.random(),
        title: '项目对比',
        width: 800,
        height: 500,
        modal: true,
        buttons: {
            '确定': {
                'class': 'ui-button-primary',
                text: '确定',
                click: function () {
                    window.open("/Contrast/ContrastIndex?isOutside=" + isOutside + "&projId=" + $(this).find("[name=select1]").val() + "&projId2=" + $(this).find("[name=select2]").val() + "&projId3=" + $(this).find("[name=select3]").val() + "&projId4=" + $(this).find("[name=select4]").val() + "&formatId=" + $("#p-j-format").val(), "_blank");
                    $(this).dialog('destroy');
                }
            }
        }
    });
    return false;
});
//专项对比弹框
$('.p-j-itemCompare_btn').click(function () {
    $.YH.box({
        target: "/DesignManage/ProjectItemCompareCondition?&r=" + Math.random(),
        title: '专项对比',
        width: 800,
        height: 550,
        modal: true,
        buttons: {
            '确定': {
                'class': 'ui-button-primary',
                text: '确定',
                click: function () {

                    var treeId = $("#p-j-tree").val();
                    var _lastItem = $("select[id^=p-j-item]:last");
                    var itemId = "";
                    if (parseInt(_lastItem.val()) == 0) {
                        itemId = _lastItem.prev("select").val();
                    } else {
                        itemId = _lastItem.val();
                    }

                    var itemIds = "";
                    $(".p-j-itemCompare_popbox").find("select[id^=p-j-item]").each(function () {
                        itemIds = itemIds + $(this).val() + "_";
                    })
                    window.open("/Contrast/SpecialContrastIndex?isOutside=" + isOutside +"&itemIds=" + itemIds + "&treeId=" + treeId + "&itemId=" + itemId + "&projId=" + $("[name=itemSelect1]").val() + "&projId2=" + $("[name=itemSelect2]").val() + "&projId3=" + $("[name=itemSelect3]").val() + "&projId4=" + $("[name=itemSelect4]").val() + "&formatId=" + $("#p-j-format").val(), "_blank");
                    $(this).dialog('destroy');
                }
            }
        }
    });
    return false;
});

function changeUse(obj, t) {
    $(obj).removeClass("c_999").addClass("fb c_333 mr5");
    $(obj).siblings().removeClass("fb c_333 mr5").addClass("c_999");
    $("input[name=noUse]").val(t);
    searchProject();
}