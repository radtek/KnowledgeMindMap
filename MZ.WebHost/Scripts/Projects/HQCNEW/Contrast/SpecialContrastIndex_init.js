var projIds = {};
var isChangeFormat = 0;
$('#p-j-initContrast').click();
if (typeof isOutside != 'undefined' && isOutside == "1") {
    SetMenu(4, 1);
} else {
    SetMenu(2, 1);
}

function changeItem(obj) {
    var treeId = $("#p-j-tree").val();
    var curFormatId = $("#p-j-format").val();
    var _lastItem = $(".p-contrast-con-add").find("select:last");
    var itemId = "";
    if (parseInt(_lastItem.val()) == 0) {
        itemId = _lastItem.prev("select").val();
    } else {
        itemId = _lastItem.val();
    }
    if (count-- < 1) {//第一次不执行这段代码
        var type1 = $("select[id^=p-j-select1]").val();
        if (type1 == "1") {
            projIds.projId1 = $('select[id^=p-j-proj1]').val();
            stage1 = $('select[id^=p-j-stage1]').val();
            stageVersionId1 = $('select[id^=p-j-version1]').val();
            projIdStr1 = projIds.projId1 + "_1";
        }
        else if (type1 == "2") {
            seriesInfo.seriesId1 = $('select[id^=p-j-contrastSeries1]').val();
            seriesInfo.lineId1 = $('select[id^=p-j-contrastLine1]').val();
            projIdStr1 = seriesInfo.lineId1 + "_2";
        }
        var type2 = $("select[id^=p-j-select2]").val();
        if (type2 == "1") {
            projIds.projId2 = $('select[id^=p-j-proj2]').val();
            stage2 = $('select[id^=p-j-stage2]').val();
            stageVersionId2 = $('select[id^=p-j-version2]').val();
            projIdStr2 = projIds.projId2 + "_1";
        }
        else if (type2 == "2") {
            seriesInfo.seriesId2 = $('select[id^=p-j-contrastSeries2]').val();
            seriesInfo.lineId2 = $('select[id^=p-j-contrastLine2]').val();
            projIdStr2 = seriesInfo.lineId2 + "_2";
        }
        var type3 = $("select[id^=p-j-select3]").val();
        if (type3 == "1") {
            projIds.projId3 = $('select[id^=p-j-proj3]').val();
            stage3 = $('select[id^=p-j-stage3]').val();
            stageVersionId3 = $('select[id^=p-j-version3]').val();
            projIdStr3 = projIds.projId3 + "_1";
        }
        else if (type3 == "2") {
            seriesInfo.seriesId3 = $('select[id^=p-j-contrastSeries3]').val();
            seriesInfo.lineId3 = $('select[id^=p-j-contrastLine3]').val();
            projIdStr3 = seriesInfo.lineId3 + "_2";
        }
        var type4 = $("select[id^=p-j-select4]").val();
        if (type4 == "1") {
            projIds.projId4 = $('select[id^=p-j-proj4]').val();
            stage4 = $('select[id^=p-j-stage4]').val();
            stageVersionId4 = $('select[id^=p-j-version4]').val();
            projIdStr4 = projIds.projId4 + "_1";
        }
        else if (type4 == "2") {
            seriesInfo.seriesId4 = $('select[id^=p-j-contrastSeries4]').val();
            seriesInfo.lineId4 = $('select[id^=p-j-contrastLine4]').val();
            projIdStr4 = seriesInfo.lineId4 + "_2";
        }
    }
    if (isChangeFormat == 1) {
        type1 = 0; type2 = 0; type3 = 0; type4 = 0; isChangeFormat = 0;
        projIdStr1 = ""; projIdStr2 = ""; projIdStr3 = ""; projIdStr4 = "";
        $("#p-j-treeContent").load('/Contrast/SpecialContrastAllAscx?projId=' + '&projId2=' + '&projId3=' + '&projId4=' + '&itemId=' + itemId + '&treeId=' + treeId + '&formatId=' + curFormatId + '&r=' + Math.random());
    } else {
        $("#p-j-treeContent").load('/Contrast/SpecialContrastAllAscx?projId=' + projIdStr1 + '&projId2=' + projIdStr2 + '&projId3=' + projIdStr3 + '&projId4=' + projIdStr4 + '&itemId=' + itemId + '&treeId=' + treeId + '&formatId=' + curFormatId + '&r=' + Math.random());
    }
}
// changeTree($("#p-j-tree"));

$("#p-j-format").change(function () {
    var curFormatId = $(this).val();
    $.post('/home/GetSingleTableJson',
                    {
                        tbName: "ProductValueTree",
                        ps: -1,
                        cu: 1,
                        qu: 'db.ProductValueTree.distinct("_id",{"isUse":"1","treeType":"2","formatId":"' + curFormatId + '"})'
                    }, function (data) {
                        var htmlLi = "<option value='0'>选择专业</option>";
                        $(data).each(function (i, n) {
                            var selected = "";
                            if (i == 0) { selected = "selected='selected'" }
                            htmlLi += '<option ' + selected + ' value="' + data[i].treeId + '">' + data[i].name + '</option>';
                        });
                        $("#p-j-tree").html("");
                        $("#p-j-tree").html(htmlLi);
                        isChangeFormat = 1;
                        $("#p-j-tree").change();
                    });


});
$(document).ready(function () { })

function ChoseType(obj, cotype, itemId) {
    var curObjValue = $(obj).val();
    var curFormatId = $("#p-j-format").val();
    var $selectDivObj = $("#p-j-Type" + cotype + "-" + itemId);
    var curHtml = "";
    var $psSelectObj = $selectDivObj.find("select[id^=p-j-contrastSeries]");
    var $projSelectObj = $selectDivObj.find("select[id^=p-j-proj" + cotype + "]");

    if (curObjValue == "0") {
        $selectDivObj.find("div").css("display", "none");
        $selectDivObj.find("select[id^=p-j-contrastSeries]").val(0);
        $selectDivObj.find("select[id^=p-j-contrastSeries]").change();
        $selectDivObj.find("select[id^=p-j-proj" + cotype + "]").val(0);
        $selectDivObj.find("select[id^=p-j-proj" + cotype + "]").change();

    }
    else if (curObjValue == "1") {
        $psSelectObj.val(0);
        //$selectDivObj.find("select[id^=p-j-contrastSeries]").change();

        $selectDivObj.find("div").eq(0).css("display", "").siblings().css("display", "none");

        //只有唯一系列可选的时候默认选中
        if ($projSelectObj.find("option[value!=0]").length == 1) {
            var tempProjId = $projSelectObj.find("option[value!=0]").first().val();
            $projSelectObj.val(tempProjId).change();
        } else {
            $projSelectObj.val(0).change();
        }

    } else if (curObjValue == "2") {
        $selectDivObj.find("div").eq(1).css("display", "").siblings().css("display", "none");
        //只有唯一系列可选的时候默认选中
        if ($psSelectObj.find("option[value!=0]").length == 1) {
            var tempSeriesId = $psSelectObj.find("option[value!=0]").first().val();
            $psSelectObj.val(tempSeriesId).change();
        } else {
            $psSelectObj.val(0).change();
        }

        $projSelectObj.val(0);
        //$selectDivObj.find("select[id^=p-j-proj" + cotype + "]").change();
    }

}


$('.p-j-clear').click(function () {
    $("#p-j-tree").val(0);
    $("#p-j-tree").change();
    //            $('.p-contrast .p-contrast-con li').each(function () {
    //                $('.configure').find('.Contrast[cid="' + $(this).attr('cid') + '"]').removeClass('select');
    //                $(this).remove();
    //            });
    return false;
})
function changeTree(obj) {
    var curTreeId = $(obj).val();
    var nodeLevel = parseInt($(obj).attr("nodeLevel"));
    $.post('/home/CPIMGetTreeModuleRelList',
                    {
                        tbName: "ProductValueTreeItem",
                        ps: -1,
                        cu: 1,
                        treeId: curTreeId,
                        nodeLevel:2,
                        qu: 'db.ProductValueTreeItem.distinct("_id",{"nodeLevel":"2","itemType":{"$ne":"0"},"treeId":"' + curTreeId + '"})'
                    }, function (data) {
                        data = JSON.parse(data.toString());
                        var htmlLi = "";
                        $(data).each(function (i, n) {
                            htmlLi += '<option value="' + data[i].itemId + '">' + data[i].name + '</option>';
                        });
                        $("#p-j-item2").html("");
                        $("#p-j-item2").html(htmlLi);
                        $(".p-contrast-con-add").find("select").each(function () {
                            var _obj = $(this);
                            var indexNodeLevel = _obj.attr("nodeLevel");
                            if (parseInt(indexNodeLevel) - nodeLevel > 1) {
                                _obj.remove();
                            }
                        })
                        itemId = 0;
                        changeItem();
                    });
                }




    function changeModule(obj) {
        var curModuleId = $(obj).val();
        var nodeLevel = parseInt($(obj).attr("nodeLevel"));
        $.post('/home/CPIMGetTreeModuleRelList',
        {
            tbName: "ProductValueTreeItem",
            ps: -1,
            cu: 1,
            nodeLevel: (nodeLevel + 1),
            nodePid:curModuleId,
            qu: 'db.ProductValueTreeItem.distinct("_id",{"nodeLevel":"' + (nodeLevel + 1) + '","itemType":{"$ne":"0"},"nodePid":"' + curModuleId + '"})'
        },
            function (data) {
                data = JSON.parse(data.toString());
                var htmlLi = "";
                var selectHtml = '<select class="w190 mt5" id="p-j-item' + (nodeLevel + 1) + '"  nodeLevel="' + (nodeLevel + 1) + '"  onchange="changeModule(this)"></select>'
                var firstOpt = '<option value="0" id="opt' + (nodeLevel + 1) + '">请选择</option>';
                if (data.length > 0) {
                    if ($("#p-j-item" + (nodeLevel + 1) + "").length > 0) {
                        //$("#p-j-item" + (nodeLevel + 1) + "").html(""); 在个别ie9浏览器下会出现删除不掉的情况
                        var obj = document.getElementById("p-j-item" + (nodeLevel + 1));
                        obj.options.length = 0;
                    } else {
                        $("#p-j-item" + nodeLevel + "").after(selectHtml);
                    }
                    $("#p-j-item" + (nodeLevel + 1) + "").append(firstOpt);
                    $(".p-contrast-con-add").find("select").each(function () {
                        var _obj = $(this);
                        var indexNodeLevel = _obj.attr("nodeLevel");
                        if (parseInt(indexNodeLevel) - nodeLevel > 1) {
                            _obj.remove();
                        }
                    })
                    $(data).each(function (i, n) {
                        htmlLi += '<option value="' + data[i].itemId + '">' + data[i].name + '</option>';
                    });
                    $('#opt' + (nodeLevel + 1) + '').after(htmlLi);
                    $("#p-j-item" + (nodeLevel + 1)).nextAll().remove();
                }
                else {
                    $(obj).nextAll().remove();
                }
            });
    }


$('.p-j-toggleCon h4').click(function () {
    //$(this).parent().toggleClass('select');
    var $this = $(this).parent();
    if ($this.hasClass('select')) {
        $this.removeClass('select');
    } else {
        $this.addClass('select');
        $('body').on("click.sr5220", function (e) {
            if ($(e.target).closest($this.find('.p-contrast-con')).length == 0 && $(e.target).closest($this).length == 0) {
                $this.removeClass('select');
                $("body").off("click.sr5220");
            }
        });
    }
})
function GetStage(obj, type, itemId, projId) {
    var url = "/Home/GetSelectObjList";
    var postData = {
        tbName: "ProjectDevelopStage",
        qu: "",
        orderBy: 'order'
    };

    if (projId != undefined) {
        url = "/Home/GetProjUseStage";
        postData = {
            projId: projId,
            tbName: "ProjectDevelopStage",
            orderBy: 'order'
        }
    }
    $.post(url, postData,
         function (data) {
             if (data.Success == true) {
                 $("#p-j-stage" + type + "-" + itemId).show();
                 $("#p-j-stage" + type + "-" + itemId).empty();
                 $("#p-j-stage" + type + "-" + itemId).append("<option value='0'>--选择阶段--</option>");
                 var lineListInfo = "";
                 var newStageId = 0;
                 if (data.htInfo.ObjList != "") {
                     lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                     var len = lineListInfo.length;

                     if (len > 0) {

                         for (var i = 0; i < len; i++) {
                             $("#p-j-stage" + type + "-" + itemId).append("<option value='" + lineListInfo[i].metaObjId + "' >" + lineListInfo[i].metaObjName + "</option>");

                         }
                     }
                 }
                 else {
                     //                                          $("#p-j-stage" + type).empty();
                     //                                          $("#p-j-stage" + type).hide();
                 }
                 var curStage = 0;
                 if (type == 1) {
                     curStage = stage1;
                     stage1 = 0;
                 }
                 else if (type == 2) {
                     curStage = stage2;
                     stage2 = 0;
                 }
                 else if (type == 3) {
                     curStage = stage3;
                     stage3 = 0;
                 }
                 else if (type == 4) {
                     curStage = stage4;
                     stage4 = 0;
                 }
                 var $curOption = $("#p-j-stage" + type + "-" + itemId).find("option[value=" + curStage + "]").first();
                 if ($curOption == undefined || $curOption.val() == 0) {
                     $curOption = $("#p-j-stage" + type + "-" + itemId).find("option[value!=0]").first();
                 }
                 $("#p-j-stage" + type + "-" + itemId).val($curOption.val()).change();

                 //$("#p-j-stage" + type + "-" + itemId).children('[value="' + curStage + '"]').prop('selected', true).end().change();
             }

         });
}

function GetVersion(obj, type, itemId) {
    var stageId = $.trim($(obj).val());
    var projId = $("#p-j-proj" + type + "-" + itemId).val();
    $.post("/Home/GetSelectObjList",
        {
            tbName: "ProjectCIStageVersion",
            qu: 'db.ProjectCIStageVersion.distinct("_id",{"projId":"' + projId + '","stageId":"' + stageId + '"})'
        },
        function (data) {
            if (data.Success == true) {
                $("#p-j-version" + type + "-" + itemId).show();
                $("#p-j-version" + type + "-" + itemId).empty();
                $("#p-j-version" + type + "-" + itemId).append('<option value="0" >--选择版本--</option>');

                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    var len = lineListInfo.length;

                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            $("#p-j-version" + type + "-" + itemId).append('<option value="' + lineListInfo[i].metaObjId + '">' + lineListInfo[i].metaObjName + '</option>');

                        }
                    }
                }
                else {
                    //                                        $("#p-j-version" + type).empty();
                    //                                        $("#p-j-version" + type).hide();
                }
            }
            var curStageVersionId = 0;
            if (type == 1) {
                curStageVersionId = stageVersionId1;
                stage1 = 0;
            }
            else if (type == 2) {
                curStageVersionId = stageVersionId2;
                stageVersionId2 = 0;
            }
            else if (type == 3) {
                curStageVersionId = stageVersionId3;
                stageVersionId3 = 0;
            }
            else if (type == 4) {
                curStageVersionId = stageVersionId4;
                stageVersionId4 = 0;
            }
            var $curOption = $("#p-j-version" + type + "-" + itemId).find("option[value=" + curStageVersionId + "]").first();

            if ($curOption == undefined || $curOption.val() == 0) {
                $curOption = $("#p-j-version" + type + "-" + itemId).find("option[value!=0]").first();
            }
            $("#p-j-version" + type + "-" + itemId).val($curOption.val()).change();
            //$("#p-j-version" + type + "-" + itemId).children('[value="' + curStageVersionId + '"]').prop('selected', true).end().change();
        });
}
function GetProjResult(obj, type, itemId) {
    var stageVersionId = $(obj).val();
    $.post("/Home/CPIMGetProjResultList?stageVersionId=" + stageVersionId,
        function (data) {
            var $contentDiv = $("#p-j-allContent-" + itemId);
            $contentDiv.find("select[selnum=" + type + "]").hide();
            //$contentDiv.find("select[selprojnum=" + type + "]").show();
            $contentDiv.find("select[selprojnum=" + type + "]").each(function () {
                $(this).empty();
                //$(this).append("<option value='0' >--选择成果--</option>");
                //$(this).change();
            });
            if (data.Success == true) {
                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    var len = lineListInfo.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            $("#p-j-choseProjRe" + type + "-" + lineListInfo[i].metaObjTreeId).append("<option value='" + lineListInfo[i].metaObjId + "'>" + lineListInfo[i].metaObjName + "</option>");

                        }
                    }
                }
                $("select[selprojnum=" + type + "]").each(function () {
                    if ($(this).find("option").length > 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    // else { $(this).append("<option value='0' >--选择成果--</option>"); }
                    $(this).change();
                });
            }
        });
    }

    function GetProjResultInfo(obj, itemId, type) {
        var resultId = $(obj).val();
        $.post("/Home/CPIMGetProjResultInfo?resultId=" + resultId + "&treeItemId=" + itemId,
        function (data) {
            var flag = $('#p-j-highlightDifItem_Checkbox').prop('checked');
            if (flag) $('#p-j-highlightDifItem_Checkbox').prop('checked', false);

            $(".p-j-r" + type + "-" + itemId).html("");
            if (data.Success == true) {
                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    var len = lineListInfo.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var indType = $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).attr("indType");
                            if (indType != "5") {
                                var html = $.map(lineListInfo[i].metaObjName.split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('');

                                //材料标准时，将材料信息加到后面
                                if (parseInt(indType) == 4) {
                                    var html1 = $.map(lineListInfo[i].metaObjMat.split(/[\r\n]+/), function (v) {
                                        if (v) {
                                            return '<p class="mb5">' + v.replace(/^\d+、/g, '') + '</p>'
                                        }
                                    }).join('');
                                    html = html + html1;
                                }

                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(html);
                            } else {
                                var html = $.map(lineListInfo[i].metaObjFile.split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5">' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('');
                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(html);
                            }
                        }
                        if(flag)
                            $('#p-j-highlightDifItem_Checkbox').click();
                    }
                }
            }
        });
    }


    $('#p-j-treeContent').on('change', '.p-j-hideSameItem_Checkbox', function () {

        if ($(this).is(':checked')) {
            $(this).closest('table').find('[trtype="item"]').each(function () {
                var list = $(this).find('select[id^="p-j-choseProjRe"]:visible,select[id^="p-j-choseSerRe"]:visible').map(function () {
                    if ($(this).val() != 0 && $(this).val() != null) {
                        return $(this).parent().index()
                    }
                }).get()
                var len = list.length;
                if (len === 0) {
                    return;
                }
                var count = 0;

                var $tr = $(this).nextAll().filter('[trtype="ind"]');
                $tr.each(function () {
                    $td = $(this).children();
                    var isDif = false;
                    var standard = $.trim($td.eq(list[0]).html());

                    for (var i = 1; i < len; i++) {
                        //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                        if (standard != $.trim($td.eq(list[i]).html())) {
                            //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                            isDif = true;
                            break;
                        }
                    }
                    if (!isDif) {
                        count++;
                        $(this).addClass('none');
                        //$(this).css({ background: '#f00' }); //测试后注释此行代码
                    }
                })
                var $firstTd = $(this).children().first();
                //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 - count)

            })
            $.tmsg("m_jfw", "隐藏相同项", { infotype: 1 })
        } else {

            $(this).closest('table').find('[trtype="item"]').each(function () {

                var count = $(this).nextUntil('[trtype="item"]').filter('.none').removeClass('none').length;

                var $firstTd = $(this).children().first();

                //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 + count)
            });

            $.tmsg("m_jfw", "显示相同项", { infotype: 1 });
        }
    }).on('change', '#p-j-highlightDifItem_Checkbox', function () {
        if ($(this).is(':checked')) {
            $(this).closest('table').find('[trtype="item"]').each(function () {
                var list = $(this).find('select[id^="p-j-choseProjRe"]:visible,select[id^="p-j-choseSerRe"]:visible').map(function () {
                    if ($(this).val() != 0 && $(this).val() != null) {
                        return $(this).parent().index()
                    }
                }).get();
                var len = list.length;
                if (len === 0) {
                    return;
                }
                var count = 0;

                var $tr = $(this).nextAll().filter('[trtype="ind"]');
                $tr.each(function () {
                    $td = $(this).children();
                    var isDif = false;
                    var standard = $.trim($td.eq(list[0]).html());

                    for (var i = 1; i < len; i++) {
                        //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                        if (standard != $.trim($td.eq(list[i]).html())) {
                            //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                            isDif = true;
                            break;
                        }
                    }
                    if (isDif) {
                        count++;
                        $(this).addClass('p-j-highlightDiff');
                        //$(this).css({ background: '#f00' }); //测试后注释此行代码
                    }
                });
                var $firstTd = $(this).children().first();
                //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 - count)

            });
            $.tmsg("m_jfw", "高亮不同项", { infotype: 1 })
        } else {

            $(this).closest('table').find('[trtype="item"]').each(function () {

                var count = $(this).nextUntil('[trtype="item"]').filter('.p-j-highlightDiff').removeClass('p-j-highlightDiff').length;

                var $firstTd = $(this).children().first();

                //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 + count)
            })

            $.tmsg("m_jfw", "取消高亮不同项", { infotype: 1 })
        }
    }).on('click', '.p-j-collapseTable-tit', function () {
        var $this = $(this);
        if ($this.hasClass('select')) {
            $this.removeClass('select').closest('thead').next().show();
        } else {
            // $this.addClass('select').closest('thead').next().hide();
        }
    }).on('click', '.p-j-colGoLeft', function () {
        if ($(this).closest('td').index() == 1) {
            alert('无法左移');
            return false;
        }
        var colNum = $(this).parent().attr('col')
        $(this).parents('td').add('td[id^="p-j-' + colNum + '"],td[id^="p-j-r' + colNum + '"],td[id^="p-j-t' + colNum + '"]')
            .each(function () {
                $(this).insertBefore($(this).prev())
            });
    }).on('click', '.p-j-colGoRight', function () {
        if ($(this).closest('td').index() == 4) {
            alert('无法右移');
            return false;
        }
        var colNum = $(this).parent().attr('col')
        $(this).parents('td').add('td[id^="p-j-' + colNum + '"],td[id^="p-j-r' + colNum + '"],td[id^="p-j-t' + colNum + '"]')
            .each(function () {
                $(this).insertAfter($(this).next())
            })
    }).on('click', '.p-j-colEmpty', function () {
        $(this).parent().next().val(0).trigger('change');

    })

function GetProductLines(obj, type, itemId) {
    var seriesId = $.trim($(obj).val());
    $.post("/Home/GetSelectObjList",
         {
             tbName: "ProductLine",
             qu: 'db.ProductLine.distinct("_id",{"seriesId":"' + seriesId + '"})'

             //qu: "seriesId="+ seriesId 
         }, function (data) {
             if (data.Success == true) {
                 $("#p-j-contrastLine" + type + "-" + itemId).show();
                 $("#p-j-contrastLine" + type + "-" + itemId).empty();
                 $("#p-j-contrastLine" + type + "-" + itemId).append('<option value="0">--请选择--</option>');//原本的选择产品线

                 var lineListInfo = "";
                 if (data.htInfo.ObjList != "") {
                     lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                     var len = lineListInfo.length;
                     if (len > 0) {
                         for (var i = 0; i < len; i++) {
                             $("#p-j-contrastLine" + type + "-" + itemId).append('<option value="' + lineListInfo[i].metaObjId + '">' + lineListInfo[i].metaObjName + '</option>');

                         }
                     }
                 }
                 else {
                     //                     $("#p-j-contrastLine" + type).empty();
                     //                     $("#p-j-contrastLine" + type).hide();
                 }
                 var curlineId = 0;
                 if (type == 1) {
                     curlineId = seriesInfo.lineId1;
                     seriesInfo.lineId1 = 0;
                 }
                 else if (type == 2) {
                     curlineId = seriesInfo.lineId2;
                     seriesInfo.lineId2 = 0;
                 }
                 else if (type == 3) {
                     curlineId = seriesInfo.lineId3;
                     seriesInfo.lineId3 = 0;
                 }
                 else if (type == 4) {
                     curlineId = seriesInfo.lineId4;
                     seriesInfo.lineId4 = 0;
                 }
                 //                 alert("type:" + type)
                 //                 alert("curVer:" + curlineId)
                 $("#p-j-contrastLine" + type + "-" + itemId).children('[value="' + curlineId + '"]').prop('selected', true).end().change();
             }
         });
     }



function GetResult(obj, type, itemId) {
    var lineId = $.trim($(obj).find("option:selected").val());
    var curtreeId = $.trim($("#p-j-tree").val());
    var postUrl = "/Home/CPIMGetSerItemResultList?lineId=" + lineId + "&treeId=" + curtreeId;
    postUrl += "&treeItemId=" + itemId;
    $.post(postUrl,
        function (data) {
            var $contentDiv = $("#p-j-allContent-" + itemId);
            $contentDiv.find("select[selprojnum=" + type + "]").hide();
            $contentDiv.find("select[selnum=" + type + "]").each(function () {
                $(this).empty();
            });
            if (data.Success == true) {
                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    for (var i = 0; i < lineListInfo.length; i++) {
                        if (lineListInfo[i].metaObjTreeId < 3) {
                            //alert(lineListInfo[i].metaObjTreeId);

                            //alert($("#p-j-choseSerRe" + type + "-" + lineListInfo[i].metaObjTreeId).attr("id")) 
                        }
                        //console.log(lineListInfo[i].metaObjTreeId + " ## " + $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].metaObjTreeId).attr("id"));
                        $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].metaObjTreeId).append("<option value='" + lineListInfo[i].metaObjId + "' >" + lineListInfo[i].metaObjName + "</option>");
                        // $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].metaObjTreeId).change();
                    }
                }
                $contentDiv.find("select[selnum=" + type + "]").each(function () {
                    if ($(this).find("option").length > 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    $(this).change();
                });
            }

        });
    }



function GetResultInfo(obj, itemId, type) {
    var resultId = $(obj).val();
    $.post("/Home/CPIMGetSerResultInfo?resultId=" + resultId + "&treeItemId=" + itemId,
        function (data) {
            $(".p-j-r" + type + "-" + itemId).html("");
            if (data.Success == true) {
                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    var len = lineListInfo.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var indType = $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).attr("indType");
                            if (indType != "5") {
                                //$("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(lineListInfo[i].metaObjName.replace(/[\r\n]+/g,"<br />"));

                                var html = $.map(lineListInfo[i].metaObjName.split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')

                                //材料标准时，将材料信息加到后面
                                if (parseInt(indType) == 4) {
                                    var html1 = $.map(lineListInfo[i].metaObjMat.split(/[\r\n]+/), function (v) {
                                        if (v) {
                                            return '<p class="mb5">' + v.replace(/^\d+、/g, '') + '</p>'
                                        }
                                    }).join('')
                                    html = html + html1;
                                }

                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(html);

                            } else {
                                var html = $.map(lineListInfo[i].metaObjFile.split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5">' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(html);
                                //  var sss = +lineListInfo[i].metaObjId
                                //去掉图集对比
                                //                                contrast.loadCount++;
                                //                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).load("/Contrast/ImageRollAxcx?itemId=" + itemId + "&col=" + type + "&resultId=" + resultId + "&indId=" + lineListInfo[i].metaObjId + "&resultType=1&r=" + Math.random(), function () {
                                //                                    if (--contrast.loadCount < 1) {
                                //                                        contrast.checkStatus();
                                //                                    }
                                //                                });
                            }

                        }
                    }
                }
            }

        });
}
//    function getSelNum(selNum) {
//        switch (selNum) {
//            case 1: return; break;
//            case 2: break;
//            case 3: break;
//            case 4: break;
//         }
//     }
function chooseCompareScheme(selectType, projIds, stageIds, sVerIds, seriesIds, linesIds, formatId) {
    var indexArr = new Array();
    indexArr.push(0); indexArr.push(1); indexArr.push(2); indexArr.push(3);
    //        $("table[id^=p-j-contrast]").find("tbody:eq(0)").find("tr:eq(0)").find("td").each(function () {
    //            var tempIndex = $(this).parent().find("td").index(this);
    //            var thisCol = $(this).attr("selNum");
    //indexArr[thisCol-1] = tempIndex-1;
    //            switch (tempIndex) {
    //                case 1: var thisCol = $(this).attr("selNum"); indexArr[thisCol] = 0; break;
    //                case 2: var thisCol = $(this).attr("selNum"); indexArr[thisCol] = 0; break;
    //                case 3: break;
    //                case 4: break;
    //            }
    //        });
    //        return false;
    count = 1;
    var selectTypeArr = selectType.split('_');
    var projIdsArr = projIds.split('_');
    var stageIdsArr = stageIds.split('_');
    var sVerIdsArr = sVerIds.split('_');
    var seriesIdsArr = seriesIds.split('_');
    var linesIdsArr = linesIds.split('_');
    stageVersionId1 = sVerIdsArr[indexArr[0]];
    stageVersionId2 = sVerIdsArr[indexArr[1]];
    stageVersionId3 = sVerIdsArr[indexArr[2]];
    stageVersionId4 = sVerIdsArr[indexArr[3]];
    stage1 = stageIdsArr[indexArr[0]];
    stage2 = stageIdsArr[indexArr[1]];
    stage3 = stageIdsArr[indexArr[2]];
    stage4 = stageIdsArr[indexArr[3]];
    seriesInfo.lineId1 = linesIdsArr[indexArr[0]];
    seriesInfo.lineId2 = linesIdsArr[indexArr[1]];
    seriesInfo.lineId3 = linesIdsArr[indexArr[2]];
    seriesInfo.lineId4 = linesIdsArr[indexArr[3]];
    seriesInfo.seriesId1 = seriesIdsArr[indexArr[0]];
    seriesInfo.seriesId2 = seriesIdsArr[indexArr[1]];
    seriesInfo.seriesId3 = seriesIdsArr[indexArr[2]];
    seriesInfo.seriesId4 = seriesIdsArr[indexArr[3]];
    if (selectTypeArr[indexArr[0]] == "1") {
        projIdStr1 = projIdsArr[indexArr[0]] + "_" + selectTypeArr[indexArr[0]];
    }
    else if (selectTypeArr[indexArr[0]] == "2") {
        projIdStr1 = linesIdsArr[indexArr[0]] + "_" + selectTypeArr[indexArr[0]];
    }
    else { projIdStr1 = ""; }
    if (selectTypeArr[indexArr[1]] == "1") {
        projIdStr2 = projIdsArr[indexArr[1]] + "_" + selectTypeArr[indexArr[1]];
    }
    else if (selectTypeArr[indexArr[1]] == "2") {
        projIdStr2 = linesIdsArr[indexArr[1]] + "_" + selectTypeArr[indexArr[1]];
    } else { projIdStr2 = ""; }
    if (selectTypeArr[indexArr[2]] == "1") {
        projIdStr3 = projIdsArr[indexArr[2]] + "_" + selectTypeArr[indexArr[2]];
    }
    else if (selectTypeArr[indexArr[2]] == "2") {
        projIdStr3 = linesIdsArr[indexArr[2]] + "_" + selectTypeArr[indexArr[2]];
    } else { projIdStr3 = ""; }
    if (selectTypeArr[indexArr[3]] == "1") {
        projIdStr4 = projIdsArr[indexArr[3]] + "_" + selectTypeArr[indexArr[3]];
    }
    else if (selectTypeArr[indexArr[3]] == "2") {
        projIdStr4 = linesIdsArr[indexArr[3]] + "_" + selectTypeArr[indexArr[3]];
    } else { projIdStr4 = ""; }

    //        if (projId1 != "0" || seriesInfo.seriesId1 != "0") {
    $("#p-j-c1").find("select").eq(0).val(selectTypeArr[indexArr[0]]);
    //$("#p-j-c1").find("select").eq(0).change();
    //        }
    //        if (projId2 != "0" || seriesInfo.seriesId2 != "0") {
    $("#p-j-c2").find("select").eq(0).val(selectTypeArr[indexArr[1]]);
    //$("#p-j-c2").find("select").eq(0).change();
    //        }
    //        if (projId3 != "0" || seriesInfo.seriesId3 != "0") {
    $("#p-j-c3").find("select").eq(0).val(selectTypeArr[indexArr[2]]);
    // $("#p-j-c3").find("select").eq(0).change();
    //        }
    //        if (projId4 != "0" || seriesInfo.seriesId4 != "0") {
    $("#p-j-c4").find("select").eq(0).val(selectTypeArr[indexArr[3]]);
    //$("#p-j-c4").find("select").eq(0).change();
    //        }
    changeItem($("#p-j-initContrast"));
}