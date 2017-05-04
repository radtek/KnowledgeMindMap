
//专项对比弹框
$("#p-j-homeContent").on("click", ".p-j-itemCompare_btn", function () {
    $.YH.box({
        target: ".p-j-itemCompare_popbox",
        title: '专项对比',
        width: 750,
        height: 500,
        modal: true,
        open: function () {
            choseProj(1, "", "", "", 0);
            choseLine(1, "", "", "", 0);

//            // 初始化专项对比
//            $(".p-j-selProj").removeAttr("disabled");
//            $(".p-j-selProj").prop("checked", false);
//            $("input[name^=itemSelect]").val("");
        },
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
                    window.location.href = "/Contrast/SpecialContrastIndex?itemIds=" + itemIds + "&treeId=" + treeId + "&itemId=" + itemId + "&projId=" + $("[name=itemSelect1]").val() + "&projId2=" + $("[name=itemSelect2]").val() + "&projId3=" + $("[name=itemSelect3]").val() + "&projId4=" + $("[name=itemSelect4]").val();


                    //						if (parseInt($("#p-j-itemCompareItemId").val()) == 0) {
                    //							alert("请选择模块！");
                    //							return false;
                    //						}
                    //window.location.href = "/Contrast/SpecialContrastIndex?treeId=" + $(this).find("#p-j-itemCompareTreeId").val() + "&itemId=" + $(this).find("#p-j-itemCompareItemId").val() + "&projId=" + $(this).find("[name=select1]").val() + "&projId2=" + $(this).find("[name=select2]").val() + "&projId3=" + $(this).find("[name=select3]").val() + "&projId4=" + $(this).find("[name=select4]").val();
                    $(this).dialog('destroy');
                }
            }
        }
    });
    return false;
})
//项目对比弹框
$("#p-j-homeContent").on("click", ".p-j-projCompare_btn", function () {
    $.YH.box({
        target: ".p-j-projCompare_popbox",
        title: '项目对比',
        width: 750,
        height: 500,
        modal: true,
        open: function () {
            choseProj(2, "", "", "", 0);
            choseLine(2, "", "", "", 0);

//            // 初始化项目对比
//            $(".p-j-selProj2").removeAttr("disabled");
//            $(".p-j-selProj2").prop("checked", false);
//            $("input[name^=select]").val("");
        },
        buttons: {
            '确定': {
                'class': 'ui-button-primary',
                text: '确定',
                click: function () {
                    window.location.href = "/Contrast/ContrastIndex?projId=" + $(this).find("[name=select1]").val() + "&projId2=" + $(this).find("[name=select2]").val() + "&projId3=" + $(this).find("[name=select3]").val() + "&projId4=" + $(this).find("[name=select4]").val();
                    $(this).dialog('destroy');
                }
            }
        }
    });
    return false;
})
//项目基本信息弹框
$("#p-j-homeContent").on("click", '.p-j-createNewProj_btn',function () {
    $.YH.box({
        target: ".p-j-createNewProj_popbox",
        title: '项目基本信息',
        width: 750,
        height: 580,
        modal: true,
        buttonNames: ["确认新建项目", null],
        //        buttons: {
        //            '确认新建项目': {
        //                text: '确认新建项目',
        //                'class': 'ui-button-primary',
        //                click: function () {
        //                    if (saveProjInfo(this)) {
        //                        return false;
        //                    }
        //                    $(this).dialog('close');
        //                }
        //            }
        //        },
        open: function () {
            var that = this
            //记得unbind，否则会造成重复绑定导致重复提交
            $(this).find('.p-j-newproj_confirmbtn').unbind("click").click(function () {
                saveProjInfo(that);
                //$(that).dialog('close');
                return false;
            });
            $(this).find("select[name=landId]").unbind("change").change(function () {
                var curCityName = $(this).find("option:selected").attr("cityname");
                var curCityId = $(this).find("option:selected").attr("cityId");
                $(".p-j-createNewProj_popbox").find('input[name=cityId]').val(curCityId);
                $(".p-j-createNewProj_popbox").find('#p-j-cityname').html("");
                $(".p-j-createNewProj_popbox").find('#p-j-cityname').html(curCityName);
            });
            $(this).find("a[id=p-j-createLand]").unbind("click").click(function () {
                $.YH.box({
                    target: "#p-j-createNewLand",
                    title: '创建地块',
                    width: 400,
                    height: 260,
                    modal: true,
                    buttons: {
                        '确认新建地块': {
                            text: '确认新建地块',
                            'class': 'ui-button-primary',
                            click: function () {
                                var $form = $("#p-j-landInfoform");

                                if ($.trim($form.find("input[name=name]").val()) == "") {
                                    $.tmsg('', '地块名称不能为空', { infotype: 2 });
                                    return false;
                                }
                                var cityId = $.trim($form.find("select[name=cityId]").val())
                                var curCityName = $.trim($form.find("select[name=cityId]").find("option:selected").html());
                                if (cityId == "") {
                                    $.tmsg("", "请选择地块的所属城市", { infotype: 2 });
                                    return false;
                                }
                                var formdata = $form.serialize();
                                $.ajax({
                                    url: "/Home/SavePostInfo",
                                    type: 'post',
                                    data: formdata + "&tbName=Land",
                                    dataType: 'json',
                                    error: function () {
                                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                    },
                                    success: function (data) {
                                        if (data.Success == false) {
                                        } else {
                                            var curHtml = ' <option selected="selected" value="' + data.htInfo.landId + '" cityName="' + curCityName + '" cityid="' + data.htInfo.cityId + '">' + curCityName + "--" + data.htInfo.name + '</option>'
                                            $(".p-j-createNewProj_popbox").find("[name=landId]").append(curHtml);
                                            $(".p-j-createNewProj_popbox").find('input[name=cityId]').val(data.htInfo.cityId);
                                            $(".p-j-createNewProj_popbox").find('#p-j-cityname').html("");
                                            $(".p-j-createNewProj_popbox").find('#p-j-cityname').html(curCityName);
                                        }
                                    }
                                });
                                $(this).dialog('close');
                            }
                        }
                    }
                });

            })
            $(this).append("<div id='p-j-importData'></div>")
            var importUrl = "/DesignManage/ProjCIImport?r=" + Math.random();
            $("#p-j-importData").load(importUrl);

        },
        ok: function () {
            if (!saveProjInfo(this)) {
                return false;
            }
        }
    });
    return false;
});

//function saveProjInfo(box, isRefresh) {
function saveProjInfo(box) {
    var $form = $("#p-j-projinfoform");

    if ($.trim($form.find("input[name=name]").val()) == "") {
        $.tmsg('', '项目名称不能为空', { infotype: 2 });
        return false;
    }
    if ($.trim($form.find("select[name=landId]").val()) == "") {
        $.tmsg("", "请选择项目的所属地块", { infotype: 2 });
        return false;
    }
//    if ($.trim($form.find("select[name=cityId]").val()) == "") {
//        $.tmsg("", "请选择项目的所属城市", { infotype: 2 });
//        return false;
//    }

    var formdata = $form.serialize();
    var properIdArray = [];
    $.each($form.find("#p-j-propertyIdArray input:checked"), function (index, item) {
        properIdArray.push(item.value);
    })
    formdata += "&propertyIdArray=" + properIdArray.join(',');

    //选择导入配置的方式，默认不导入任何配置
    //    var $import = $form.find("#p-j-importData"), addType = '', importType = '';
    //    if ($import.hasClass('p-j-seriesBox')) {
    //        addType = 2, importType = 1;
    //    } else if ($import.hasClass('p-j-cityProjBox')) {
    //        addType = 2, importType = 2;
    //    } else {
    //        addType = 0;
    //    }
    //    formdata += "&AddType=" + addType + "&ImportType=" + importType;
    var $import = $(box).find("#p-j-importData");
    if ($import.length > 0) {
        var treeComb = [];
        $import.find("#divCombineList .treecomb").each(function (index,item) {
            var $sel = $(item).find("a.p-btn_brown_1").first();
            if ($sel.length > 0) {
                treeComb.push($(item).attr("data-treeId") + "|Y|" + $sel.attr("data-combId"));
            }
        });

        var stageId = $("#stageId", $import).val();
        var importType = $("input[name=ImportType]:checked", $import).val();

        //有选择导入的时候才判断是否选了阶段，不导入配置的话不判断
        if (importType == 1 || importType == 2) {
            if (stageId == '0' || stageId == '') {
                $.tmsg("", "请选择配置表阶段", { infotype: 2, time_out: 1000 });
                $("#stageId", $import).focus();
                return false;
            }
        }
        

        var versionName = $("#versionName", $import).val();
        formdata += "&versionName=" + versionName;
       
//        alert(importType);
        if (importType == 1) {
//            var seriesId = $("#seriesSlt", $import).val();
//            if (seriesId == '0' || seriesId == '') {
//                $.tmsg("", "请选择一个产品系列", { infotype: 2, time_out: 1000 });
//                return false;
//            }
//            var lineId = $("#lineSlt", $import).val();
//            if (lineId == '0' || lineId == '') {
//                $.tmsg("", "请选择一个产品线", { infotype: 2, time_out: 1000 });
//                return false;
//            }
            var $sereisSelObj = $("#seriesSlt", $import).find("option:selected");
            var seriesId = $sereisSelObj.attr("seriesId");
            var lineId = $sereisSelObj.attr("value");
            if (seriesId == '0' || seriesId == '' || seriesId == undefined) {
                $.tmsg("", "请选择一个产品系列", { infotype: 2, time_out: 1000 });
                return false;
            }

            if (lineId == '0' || lineId == '' || lineId == undefined) {
                $.tmsg("", "请选择一个产品线", { infotype: 2, time_out: 1000 });
                return false;
            }

            formdata += "&stageId=" + stageId;
            formdata += "&seriesId=" + seriesId;
            formdata += "&lineId=" + lineId;
            formdata += "&importType=" + importType;
        } else if (importType == 2) {
              $this = $(box);
//            var srcCityId = $("#citySel", $this).val();
//            if (srcCityId == '0' || srcCityId == '') {
//                $.tmsg("", "请选择一个城市", { infotype: 2, time_out: 1000 });
//                return false;
//            }
//            var srcProjId = $("#projSlt", $this).val();
//            if (srcProjId == '0' || srcProjId == '') {
//                $.tmsg("", "请选择一个项目", { infotype: 2, time_out: 1000 });
//                return false;
            //            }
            var $citySelObj = $("#citySel", $this).find("option:selected");
            var srcCityId = $citySelObj.attr("cityid");
            var srcProjId = $citySelObj.attr("value");

            if (srcCityId == '0' || srcCityId == '' || srcCityId == undefined) {
                $.tmsg("", "请选择一个城市", { infotype: 2, time_out: 1000 });
                return false;
            }

            if (srcProjId == '0' || srcProjId == '' || srcProjId == undefined) {
                $.tmsg("", "请选择一个项目", { infotype: 2, time_out: 1000 });
                return false;
            }
            var copyStageId = $("#copyStageId", $this).val();
            if (copyStageId == '0' || copyStageId == '') {
                $.tmsg("", "请选择一个来源阶段", { infotype: 2, time_out: 1000 });
                return false;
            }
            var copyVersionId = $("#copyVersionId", $this).val();
            if (copyVersionId == '0' || copyVersionId == '') {
                $.tmsg("", "请选择一个来源版本", { infotype: 2, time_out: 1000 });
                return false;
            }

            formdata += "&curStageId=" + stageId;
            formdata += "&copyProjId=" + srcProjId;
            formdata += "&copyStageId=" + copyStageId;
            formdata += "&copyVersionId=" + copyVersionId;
            formdata += "&importType=" + importType;
        }
//         else {
//            $.tmsg("", "请选择一种导入方式", { infotype: 2, time_out: 1000 });
//            return false;
//        }
        
        formdata += "&combineStr=" + treeComb.join('|H|');
    }

    $("body").mask("正在新建项目，请稍后...");
    $.ajax({
        url: "/Home/SaveLandProjInfoJH/",
        type: 'post',
        data: formdata,
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $('body').unmask();
                $.tmsg("", "保存失败! " + data.Message, { infotype: 2 });
            }
            else {
                haha = box;
                $(box).dialog('destroy'); //关闭当前窗口
                $('body').unmask();
                $.tmsg("", "保存成功!", { infotype: 1, time_out: 300, callback: function () {
                    window.location.href = '/DesignManage/ProjectManage?projId=' + data.htInfo.newProj;
                }
                });
            }
        }
    });
};

(function () {
    var $form = $("#p-j-projinfoform");
    var $lineSelect = $form.find("select[name=lineId]");
    var $seriesSelect = $form.find("select[name=seriesId]");
    var $opts = $lineSelect.find("option[value!='']").remove();
    $seriesSelect.change(function () {
        $lineSelect.find("option[value!='']").remove();
        var seriesId = this.value;
        if (seriesId != '') {
            $.each($opts, function (index, item) {
                if ($(item).attr("seriesId") == seriesId) {
                    $lineSelect.append($(item).clone());
                }
            })
        }
    })
})();


//项目对比弹框中添加添加项目按钮动作
$("#p-j-homeContent").on("click", '#p-j-addCompareProj',function () {
    $(this).closest('tr').prev().clone().insertBefore($(this).closest('tr'));
    return false;
})
//项目基本信息弹框中导入产品系列配置动作
$("#p-j-homeContent").on("click", '#p-j-series_toggleBtn', function () {
    if ($('#p-j-importData').hasClass('p-j-seriesBox')) {
        $('#p-j-importData').attr('class', '');
    } else {
        $('#p-j-importData').attr('class', 'p-j-seriesBox');
    }
    return false;
});
//项目基本信息弹框中导入对标项目配置动作
$("#p-j-homeContent").on("click", '#p-j-cityProj_toggleBtn', function () {
    if ($('#p-j-importData').hasClass('p-j-cityProjBox')) {
        $('#p-j-importData').attr('class', '');
    } else {
        $('#p-j-importData').attr('class', 'p-j-cityProjBox');
    }
    return false;
});

//项目基本信息弹框中导入对标项目配置下城市项目的级联选择
$("#p-j-homeContent").on("change", '#p-j-citySelect', function () {
    var cid = $(this).val();
    var options = '<select class="mr10" >';
    $.each(projects, function (key) {
        var that = this;
        $.each(that.projDots, function () {
            if (cid == this.cid) {
                options += '<option>' + this.name + '</option>';
            }
        })
    })
    options += '</select>';
    $(this).parent().next().html(options);
});

var projects = (function () {
    var projs = {};
    $.ajax({
        url: '/home/GetBMapProjPointInfo',
        type: 'get',
        async: false, //记得设置为同步
        cache: false, //防止加载缓存
        data: {},
        dataType: 'json',
        error: function () {
            alert('获取分期地图坐标信息失败，请检查设置');
        },
        success: function (data) {
            projs = data;
        }
    });
    return projs;
})();
