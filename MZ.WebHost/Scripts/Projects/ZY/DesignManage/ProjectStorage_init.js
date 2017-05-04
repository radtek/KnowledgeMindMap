
var hasInitMap = false;
function tabChange(i) {
    var $mapview = $("#mapView");
    var $listview = $("#listView");
    if (i == 1) {
        $listview.show();
        $mapview.hide();
        $("#listTab").attr("class", "fb c_333 mr5");
        $("#mapTab").attr("class", "c_999");

    } else {
        if (!hasInitMap) {
            hasInitMap = true;
            initMap();
            if (cityId != "0") {
                $("#cid_" + cityId).find("dt:first").click();
            } else if ($("#p-j-projTree").find("a[data-haslocation=1]").length > 0) {
                $("#p-j-projTree").find("a[data-haslocation=1]:first").click();
            } else {
                $("#p-j-projTree").find("a[projType=proj]:first").click();
            }
        } 
        $listview.hide();
        $mapview.show();

        $("#listTab").attr("class", "c_999 mr5");
        $("#mapTab").attr("class", "fb c_333");
    }
}

function delProj(projid) {
    if (!confirm("是否确认删除分期信息，删除后将无法恢复!")) {
        return false;
    }

    $("body").mask("正在删除分期，请稍后...");
    $.ajax({
        url: "/Home/DelePostInfo/",
        type: 'post',
        data: {
            tbName: 'Project',
            queryStr: 'db.Project.distinct("_id",{"projId":"' + projid + '"})'
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试！", { infotype: 2 });
        },
        success: function (data) {
            //$("#delProjInfo").unmask();
            $('body').unmask();
            if (data.Success == false) {
                $.tmsg("m_jfw", "删除失败！", { infotype: 2 });
            }
            else {
                $.tmsg("m_jfw", "删除成功！", { infotype: 1 });
                location.reload();
            }
        }
    });
}

$("#projectList").delegate(".p-j-newProj", "click", function () {
    var landId = $(this).attr("landId");
    $.YH.box({
        target: "/PersonelWorkCenter/HomeIndexModelStyle?r=" + Math.random() + "  .p-j-createNewProj_popbox",
        title: '分期基本信息',
        width: 800,
        height: 660,
        modal: true,
        buttons: {
            '确认新建分期': {
                text: '确认新建分期',
                'class': 'ui-button-primary',
                click: function () {
                    if (saveProjInfo(this)) {
                        return false;
                    }
                }
            }
        },
        afterLoaded: function () {
            $(this).append("<div id='p-j-importData'></div>")
            var importUrl = "/DesignManage/ProjCIImport?r=" + Math.random();
            $("#p-j-importData").load(importUrl);
            var that = this;
            $(this).find("select[name=landId]").unbind("change").change(function () {

                var curCityName = $(this).find("option:selected").attr("cityname");
                var curCityId = $(this).find("option:selected").attr("cityId");
                $(".p-j-createNewProj_popbox").find('input[name=cityId]').val(curCityId);
                $(".p-j-createNewProj_popbox").find('#p-j-cityname').html("");
                $(".p-j-createNewProj_popbox").find('#p-j-cityname').html(curCityName);
            });
            $("select[name=landId]").val(landId);
            $("select[name=landId]").change();
            $(".p-j-createNewProj_popbox").find("[name=belongLineId]").unbind("change").change(function () {
                var formatId = $(this).find("option:selected").attr("formatId");
                $("#formatSelect").val(formatId);
                $("[name=formatId").val(formatId);
                $("#seriesSlt").val($(this).val());
            });
            $(this).find("a[id=p-j-createLand]").unbind("click").click(function () {
                $.YH.box({
                    target: "/PersonelWorkCenter/HomeIndexModelStyle?r=" + Math.random() + "  #p-j-createNewLand",
                    title: '创建项目',
                    width: 400,
                    height: 260,
                    modal: true,
                    afterLoaded: function () {
                        $('#p-j-createNewLand').show();
                    },
                    buttons: {
                        '确认新建项目': {
                            text: '确认新建项目',
                            'class': 'ui-button-primary',
                            click: function () {
                                var $form = $("#p-j-landInfoform");

                                if ($.trim($form.find("input[name=name]").val()) == "") {
                                    $.tmsg('', '项目名称不能为空', { infotype: 2 });
                                    return false;
                                }
                                var cityId = $.trim($form.find("select[name=cityId]").val())
                                var curCityName = $.trim($form.find("select[name=cityId]").find("option:selected").html());
                                if (cityId == "") {
                                    $.tmsg("", "请选择项目的所属城市", { infotype: 2 });
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
                                $(this).dialog('destroy');
                            }
                        }
                    }
                });

            });
        }
    });
    return false;
});

//function saveProjInfo(box, isRefresh) {
function saveProjInfo(box) {
    var $form = $("#p-j-projinfoform");

    if ($.trim($form.find("input[name=name]").val()) == "") {
        $.tmsg('', '分期名称不能为空', { infotype: 2 });
        return false;
    }
    if ($.trim($form.find("select[name=landId]").val()) == "") {
        $.tmsg("", "请选择分期的所属项目", { infotype: 2 });
        return false;
    }

    if ($form.find("select[name=formatId]").val() == "") {
        $.tmsg("", "请选择分期的物业形态", { infotype: 2 });
        return false;
    }

    var belongLineId = $form.find("select[name=belongLineId]").val();
    if ($.trim(belongLineId) == "" || belongLineId == "undefined") {
        $.tmsg('', '请选择分期所属产品线', { infotype: 2 });
        $form.find("select[name=belongLineId]").focus();
        return false;
    }
    var $this = $(box);

    var formdata = $form.serialize();
    var properIdArray = [];
    $("#p-j-mspropertyId").find("option").each(function () {
        properIdArray.push($(this).attr("value"));
    })
    formdata += "&propertyIdArray=" + properIdArray.join(',');

    var selectSeriesId = $form.find("[name=belongLineId]").find("option:selected").attr("seriesId");
    formdata += "&seriesId=" + selectSeriesId;
    var $import = $(box).find("#p-j-importData");

    if ($import.length > 0) {
        var treeComb = [];
        $import.find("#divCombineList .treecomb").each(function (index, item) {
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
        if (importType == 1) {
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
            //formdata += "&seriesId=" + seriesId;
            formdata += "&lineId=" + lineId;
            formdata += "&importType=" + importType;
        } else if (importType == 2) {
            var $citySelObj = $("#citySel", $this).find("option:selected");
            var srcCityId = $citySelObj.attr("cityId");
            var srcProjId = $citySelObj.attr("value");

            if (srcCityId == '0' || srcCityId == '' || srcCityId == undefined) {
                $.tmsg("", "请选择一个城市", { infotype: 2, time_out: 1000 });
                return false;
            }

            if (srcProjId == '0' || srcProjId == '' || srcProjId == undefined) {
                $.tmsg("", "请选择一个分期", { infotype: 2, time_out: 1000 });
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
        formdata += "&combineStr=" + treeComb.join('|H|');
    }


    $("body").mask("正在新建分期，请稍后...");
    $.ajax({
        url: "/Home/SaveLandProjInfoZY/",
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
                    window.location.href = '/DesignManage/ProjectBaseInfoIndexNew?projId=' + data.htInfo.newProj;
                }
                });
            }
        }
    });
};


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


function editLand(landId, cityId) {
    var title = "编辑项目";
    if (parseInt(landId) == 0) {
        title = "创建项目";
    }
    $.YH.box({
        target: '/DesignManage/ProjectLandEditBox?landId=' + landId + '&cityId=' + cityId,
        title: title,
        width: 800,
        ok: function () {
            saveInfo();
        }
    })
}
function deleteLand(obj) {
    var primaryId = $(obj).attr("landId");
    $.ajax({
        url: '/DesignManage/DeleteExitRelResult',
        type: 'post',
        dataType: 'json',
        data: { primaryId: primaryId, relTbName: 'Project', relKeyName: 'landId' },
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                alert("该项目存在关联的分期，请先删除关联分期！");
                // $.tmsg("m_jfw", "该土地存在关联的项目，请先删除关联项目！", { infotype: 2 });
            } else {
                CustomDeleteItem($(obj), reloadSearchProject);
            }
        }
    })
}

function addProperty(obj) {
    var tp = '<div class="m5"><select id="clyt" multiple="multiple" name="clyt" class="p-selectMul_box" style="height:180px" ></select><p>提示：同时按下 Ctrl 键可进行多选</p></div>';
    $.YH.box({
        target: $(tp),
        title: "选择产品类型",
        width: 330,

        create: function () {
            $.post('/home/GetSingleTableJson',
                    {
                        tbName: "SystemPropertyType",
                        ps: -1,
                        cu: 1,
                        qu: ''
                    }, function (data) {
                        var htmlStr = "<ul class='p-screening-list p-tab_4 mb10' id='p-j-ulType'>";
                        $(data).each(function (i, n) {
                            htmlStr += '<li class="fl"><a href="javascript:;" value="' + data[i].typeId + '" onclick="showPropertyList(this);">' + data[i].name + '</a></li>';
                        });
                        htmlStr += "</ul>";
                        $("#clyt").before(htmlStr);
                        $("#p-j-ulType").find("a:eq(0)").click();
                    });
        },
        ok: function () {
            var has = false;
            $("#clyt option:selected").each(function () {
                var sf = this; has = false;
                $("#p-j-mspropertyId option").each(function () {
                    if ($(this).val() == $(sf).val()) {
                        has = true; return;
                    }
                });
                if (!has) $("#p-j-mspropertyId").append('<option value="' + $(sf).val() + '">' + $(sf).text() + '</option>');
            });
        }
    });
}
function showPropertyList(obj) {
    var typeId = $(obj).attr("value");
    $("#p-j-ulType").find("a.select").removeClass("select");
    $(obj).addClass("select");
    $.post('/home/GetSingleTableJson',
                    {
                        tbName: "SystemProperty",
                        ps: -1,
                        cu: 1,
                        qu: 'db.SystemProperty.distinct("_id",{"isUse":"1","typeId":"' + typeId + '"})'
                    }, function (data) {
                        var htmlOp = "";
                        $(data).each(function (i, n) {
                            htmlOp += '<option value="' + data[i].propertyId + '">' + data[i].name + '</option>';
                        });
                        $("#clyt").html(htmlOp).hide().show();
                        $("#p-j-mspropertyId option").each(function () {
                            var sf = this;
                            $("#clyt option").each(function () {
                                if ($(this).val() == $(sf).val()) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                        });
                    });
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
                    window.open("/Contrast/ContrastIndex?projId=" + $(this).find("[name=select1]").val() + "&projId2=" + $(this).find("[name=select2]").val() + "&projId3=" + $(this).find("[name=select3]").val() + "&projId4=" + $(this).find("[name=select4]").val() + "&formatId=" + $("#p-j-format").val(), "_blank");
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
        target: "/DesignManage/ProjectItemCompareCondition?r=" + Math.random(),
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
                    window.open("/Contrast/SpecialContrastIndex?itemIds=" + itemIds + "&treeId=" + treeId + "&itemId=" + itemId + "&projId=" + $("[name=itemSelect1]").val() + "&projId2=" + $("[name=itemSelect2]").val() + "&projId3=" + $("[name=itemSelect3]").val() + "&projId4=" + $("[name=itemSelect4]").val() + "&formatId=" + $("#p-j-format").val(), "_blank");
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

$("#p-j-projTree").delegate(".p-j-folder_area", "click", function () {
    var plus = "/Content/images/common/plus.gif";
    var minus = "/Content/images/common/minus.gif";
    var level = $(this).parent().attr("nodekey") ? $(this).parent().attr("nodekey") + "." : $(this).parents("dl").attr("nodekey") + ".";
    var $node = $("dd[nodekey ^= '" + level + "']");
    if ($(this).parent().siblings().is("dd")) {
        if ($(this).attr("src") == minus) {
            $(this).attr("src", plus);
            $node.hide();
            $node.each(function () {
                if ($(this).children("img").attr("src") == minus) {
                    $(this).children("img").attr("src", plus);
                }
            })

        } else {
            $(this).attr("src", minus);
            $node.show();
            $node.each(function () {
                if ($(this).children("img").attr("src") == plus) {
                    $(this).children("img").attr("src", minus);
                }
            })
        }
    }
})


//以下闭包代码中执行地图所需脚本
function initMap() {
    var bmap = new BMap.Map("p-j-map");
    bmap.centerAndZoom(new BMap.Point(110.404, 33.915), 5);  // 初始化地图,设置中心点坐标和地图级别
    bmap.enableScrollWheelZoom();
    bmap.disableDoubleClickZoom();
    bmap.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] }));
    var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }); // 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
    bmap.addControl(top_left_control);
    bmap.addControl(top_left_navigation);

    var JH_Map = new JH_map(bmap);

    //获取projects要放在/Scripts/Projects/JH/index.js之后，防止值被覆盖
    $.ajax({
        url: '/home/GetBMapProjPointInfo',
        type: 'get',
        async: false, //记得设置为同步
        cache: false, //防止加载缓存
        data: {},
        dataType: 'json',
        error: function () {
            //alert('获取分期地图坐标信息失败，请检查设置');
            $.tmsg("m_jfw", "获取分期地图坐标信息失败，请检查设置", { infotype: 2 });
        },
        success: function (data) {
            projects = data;
        }
    });


    var opts = {
        width: 330,     // 信息窗口宽度
        enableMessage: false//设置允许信息窗发送短息
    }

    $('#p-j-projTree').delegate('dt', 'click', function () {
        var curName = $(this).attr('name');
        if (curName.length > 2) {
            for (i = curName.length; i >= 2; i--) {
                bmap.centerAndZoom(curName.substring(0, i), 10);
            }
        } else {
            bmap.centerAndZoom($(this).attr('name'), 10);
        }
        return false;
    }).delegate('dd a[projType=proj]', 'click', function () {
        bmap.centerAndZoom(new BMap.Point($(this).attr('lng'), $(this).attr('lat')), 15);
        updatePopbox($(this).attr('pid'), $(this).attr('lng'), $(this).attr('lat'));
        $(".p-j-selectItem").removeClass("select");
        $(this).addClass("select");
        return false;
    }).delegate('dd a[projType=land]', 'click', function () {
        var curName = $(this).attr('name');
        if (curName.length > 2) {
            for (i = curName.length; i >= 2; i--) {
                bmap.centerAndZoom(curName.substring(0, i), 10);
            }
        } else {
            bmap.centerAndZoom($(this).attr('name'), 10);
        }
        return false;
    });

    function updatePopbox(id, lng, lat) {
        $('#p-j-projTree').find('.p-highlight_brown').removeClass('p-highlight_brown').end().find('[pid="' + id + '"]').addClass('p-highlight_brown');


        //以下注释代码为演示时使用
        //            $.each(projects,function(){
        //                var proj=this;
        //                $.each(this.projDots,function(){
        //                    if(this.id==id){
        //                        $('.projTitle').html(this.name);
        //                        $('.projSeries').html(proj.name);
        //                        $('.img_con img').attr('src','images/pic/'+id+'.jpg');
        //                    }
        //                })
        //            })

        //lix 因为可能涉及到权限控制，因此单独放在控件中更新
        var url = '/DesignManage/BMapProjPopBox?projId=' + id;
        $('#p-j-mapPopBox').load(url + "&r=" + new Date().getTime(), function () {
            var infoWindow = new BMap.InfoWindow($('#p-j-mapPopBox').html(), opts);  // 创建信息窗口对象

            bmap.openInfoWindow(infoWindow, new BMap.Point(lng, lat));
        });

    }

    var html = '';
    var timer;
    var defaultLng = 135;
    var defaultLat = 20;
    // 创建地址解析器
    var myGeo = new BMap.Geocoder();

    $.each(projects, function (key) {
        var that = this;


        $.each(that.projDots, function () {
            var dot = this;

            if (dot.lng == defaultLng && dot.lat == defaultLat) {
                myGeo.getPoint(dot.cname, function (point) {
                    if (point) {
                        dot.lng = point.lng;
                        dot.lat = point.lat;
                    }
                    //$('#cid_' + dot.cid).append('<dd><a class="p-j-selectItem" pid="' + dot.id + '" lng="' + dot.lng + '" lat="' + dot.lat + '" href="#">' + dot.name + '</a></dd>')
                    $('#cid_' + dot.cid).find("a[pid=" + dot.id + "]").attr("lng", dot.lng).attr("lat", dot.lat);
                    dot.icon = { src: that.src, height: 33, width: 20 };
                    var marker = JH_Map.createDot(dot);
                    if (hasViewObjRight == "1") {
                        marker.addEventListener("mouseover", function () {

                            timer = setTimeout(function () {
                                updatePopbox(dot.id, dot.lng, dot.lat);

                                var $tree = $('#p-j-projTree');
                                var $curNode = $tree.find('[pid="' + dot.id + '"]');
                                var h = $curNode.offset().top - $tree.offset().top;
                                var s = $tree.scrollTop();
                                $tree.animate({ scrollTop: (s + h - 100) });

                            }, 600);

                        })
                        marker.addEventListener("mouseout", function () {

                            clearTimeout(timer);

                        })
                        marker.addEventListener("click", function () {
                            //alert();
                            bmap.centerAndZoom(marker.getPosition(), 16);
                            updatePopbox(dot.id, dot.lng, dot.lat);
                        })
                    }
                }, dot.cname);
            } else {
                //$('#cid_' + this.cid).append('<dd><a class="p-j-selectItem" pid="' + dot.id + '" lng="' + dot.lng + '" lat="' + dot.lat + '" href="#">' + dot.name + '</a></dd>')
                this.icon = { src: that.src, height: 33, width: 20 };
                var marker = JH_Map.createDot(dot);
                if (hasViewObjRight == "1") {
                    marker.addEventListener("mouseover", function () {

                        timer = setTimeout(function () {
                            updatePopbox(dot.id, dot.lng, dot.lat);

                            var $tree = $('#p-j-projTree');
                            var $curNode = $tree.find('[pid="' + dot.id + '"]');
                            var h = $curNode.offset().top - $tree.offset().top;
                            var s = $tree.scrollTop();
                            $tree.animate({ scrollTop: (s + h - 100) });

                        }, 600);

                    })
                    marker.addEventListener("mouseout", function () {

                        clearTimeout(timer);

                    })
                    marker.addEventListener("click", function () {
                        //alert();
                        bmap.centerAndZoom(marker.getPosition(), 16);
                        updatePopbox(dot.id, dot.lng, dot.lat);
                    })
                }
            }
            //markerClusterer['sp'].addMarker(marker);
        })



        html += '<li><img height="20" src="' + this.src + '"> ' + this.name + '</li>';
    })
    $('<ul id="p-j-mapDotsIntro">' + html + '</ul>').appendTo('#p-j-map');


    setTimeout('$(".anchorTR :last").text("卫星")', 400);

}
