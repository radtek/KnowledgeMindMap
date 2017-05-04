
//导入项目配置方法
function importProjectConfig(obj) {
    var projId = obj.projId,
    callback = obj.callback;
    if (projId == undefined) {
        alert('请传入正确的分期');
        return false;
    }
    var url = "/DesignManage/ProjCIImport?projId=" + projId + "&r=" + new Date().getTime();
    $.YH.box({
        target: url,
        title: '导入产品配置',
        width: 750,
        modal: true,
        ok: function () {
            var $this = $(this);
            var treeComb = [];
            $.each($this.find("#divCombineList .treecomb"), function (index, item) {
                var $sel = $(item).find("a.p-btn_brown_1").first();
                if ($sel.length > 0) {
                    treeComb.push($(item).attr("data-treeId") + "|Y|" + $sel.attr("data-combId"));
                }
            });
            var url = "/Home/CPIMSaveProjectCIlistFromLine";
            var stageId = $("#stageId", $this).val();
            var importType = $("input[name=ImportType]:checked", $this).val();             //来源类型

            if (stageId == '0' || stageId == '') {
                $.tmsg("", "请选择配置表阶段", { infotype: 2, time_out: 1000 });
                return false;
            }

            var versionName = $("#versionName", $this).val();

            var formdata = {};

            formdata.versionName = versionName;
            formdata.addType = $(this).find("input[name=addType]:checked").val();

            if (importType == 1) {
                var $seriesOpt = $("#seriesSlt", $this).find("option:selected");
                var seriesId = $seriesOpt.attr("seriesId");
                if (seriesId == '0' || seriesId == '' || seriesId == undefined) {
                    $.tmsg("", "请选择一个产品系列", { infotype: 2, time_out: 1000 });
                    return false;
                }
                var lineId = $seriesOpt.attr("value");
                if (lineId == '0' || lineId == '') {
                    $.tmsg("", "请选择一个产品线", { infotype: 2, time_out: 1000 });
                    return false;
                }
                formdata.projId = projId;
                formdata.stageId = stageId;
                formdata.seriesId = seriesId;
                formdata.lineId = lineId;
                formdata.treeSplitId = $("#treeSplitId", $this).val();
            } else if (importType == 2) {
                var $cityOpt = $("#citySel", $this).find("option:selected");
                var srcCityId = $cityOpt.attr("cityId");
                if (srcCityId == '0' || srcCityId == '' || srcCityId == undefined) {
                    $.tmsg("", "请选择一个城市", { infotype: 2, time_out: 1000 });
                    return false;
                }
                var srcProjId = $cityOpt.attr("value");
                if (srcProjId == '0' || srcProjId == '') {
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
                formdata.curProjId = projId;
                formdata.curStageId = stageId;
                formdata.copyProjId = srcProjId;
                formdata.copyStageId = copyStageId;
                formdata.copyVersionId = copyVersionId;
                url = "/Home/JH_SaveProjectCIlistFromProject";
            } else {
                $.tmsg("", "请选择一种导入方式", { infotype: 2, time_out: 1000 });
                return false;
            }
            formdata.importType = importType;
            formdata.combineStr = treeComb.join('|H|');

            $('body').mask('产品配置创建中...请耐心等待');
            $.ajax({
                url: url,
                type: 'post',
                data: formdata,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    var info = data.htInfo;
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    }
                    else {
                        $.tmsg("m_jfw", "导入成功", { infotype: 1, time_out: 700, callback: function () {
                            $.ajax({
                                url: "/Home/UpdateFieldDate?tbName=Project&keyValue=" + projId + "&keyName=projId&fieldStr=lastUpdateTime",
                                dataType: "json",
                                type: 'post',
                                asyn: false,
                                error: function () {
                                },
                                success: function (data) {
                                    if (info != undefined && info.stageVersionId) {
                                        var newVid = info.stageVersionId;
                                        if (typeof callback == "function") {
                                            callback(newVid);
                                        } else {
                                            location.href = '/DesignManage/ProjCIItemIndex?projId=' + projId + '&isEdit=' + isEdit + '&vid=' + newVid;
                                        }
                                    } else {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                        });
                    }
                }, complete: function () {
                    $('body').unmask();
                }
            });
        }
    });
    return false;
}