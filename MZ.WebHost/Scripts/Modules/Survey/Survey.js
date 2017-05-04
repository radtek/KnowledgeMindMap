var subItemIndex = 0;

//返回
function goBack(marketId, caseId, rUrl) {
    if (goUrl != "") {
        window.location.href = rUrl;
        return;
    }
    var url = window.location.pathname;
    var surveyChildUrl = ["CaseSubjectEdit", "CaseAnswerEdit", "CaseUsers"];
    var goUrl = ["/Survey/CaseIndex", "/Survey/CaseIndex", "/Survey/CaseIndex"]
    $.each(surveyChildUrl, function (i, item) {
        if (url.indexOf(item) >= 0) {
            window.location.href = goUrl[i] + "?marketId="+marketId;
        }
    })
}
//跳转到锚点
function GoAnchor(o, catId) {
    window.location.hash = "#cat_" + catId;
    $("li[name=catli]").each(function () {
        $(this).removeClass("active");
    });
    $(o).parent().addClass("active");
}

//编辑案例
function EditCase(caseId, landId, marketId) {
    var url = "/Survey/CaseEdit?caseId=" + caseId;
    if (typeof landId != 'undefined') {
        url += "&landId=" + landId;
    }
    if (typeof marketId != 'undefined') {
        url += "&marketId=" + marketId;
    }
    var titleString = "新增调研案例";
    if (caseId != 0) {
        titleString = "编辑调研案例";
    }
    $.YH.box({
        target: url + "&r=" + Math.random(),
        title: titleString,
        width: 400,
        height: 320,
        ok: function () {
            var formata = $("#frmCase").serialize();
            $.ajax({
                url: "/Home/SavePostInfo",
                type: 'post',
                data: formata,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    }
                    else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500, callback: function () {
                            //$("#bodyDiv").load("/Survey/CaseList?r=" + Math.random());
                            window.location.href = "/Survey/CaseSubjectEdit?caseId=" + data.htInfo.caseId + "&marketId=" + marketId;
                        }
                        });
                    }
                }
            });
        }
    });
}
//删除调研问卷
function DelCase(marketId, caseId, isedit) {
    if (confirm("确定要删除该调研问卷？")) {
        var formata = "caseId=" + caseId;
        $.ajax({
            url: "/Home/DeleteCase",
            type: 'post',
            data: formata,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "删除成功！", { infotype: 1, time_out: 500, callback: function () {
                        $("#bodyDiv").load("/Survey/CaseList?marketId=" + marketId + "&isedit=" + isedit + "&r=" + Math.random());
                        }
                    });
                }
            }
        });
    }
}

//编辑分类
function EditSubCat(caseId,catId,type) {
    var url = "/Survey/EditCaseSubCat?caseId=" + caseId + "&catId=" + catId + "";
    var titleString = "新增问题分类";
    if (catId != 0) {
        titleString = "编辑问题分类";
    }
    $.YH.box({
        target: url + "&r=" + Math.random(),
        title: titleString,
        width: 400,
        height: 320,
        ok: function () {
            var catName = $("#txtCatName").val();
            var hasSameName = false;
            $("#caseCatDiv").find("a[name=catName]").each(function (o) {
                if ($(this).html() == catName) {
                    $.tmsg("m_jfw", "已经存在\"" + catName + "\" 的问题分类", { infotype: 2 });
                    hasSameName = true;
                    return;
                }
            });
            if (hasSameName == true) { return; }
            var formata = $("#frmSubCat").serialize();
            $.ajax({
                url: "/Home/SavePostInfo",
                type: 'post',
                data: formata,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    }
                    else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500, callback: function () {
                            //$("#subCatDiv").load("/SurveyMange/SubCategories?r=" + Math.random());
                            //alert(data.BsonInfo.catId);
                            if (type == 0) {
                                $("#selCatId").append("<option value=\"" + data.htInfo.catId + "\">" + data.htInfo.name + "</option>");
                                $("#selCatId").val(data.htInfo.catId);
                            } else {
                                $("#bodyDiv").load("/Survey/CaseSubjects?caseId=" + caseId + "&r=" + Math.random());
                            }
                        }
                        });
                    }
                }
            });
        }
    });
}
function DelCaseSubCat(caseId, catId, type, marketId) {
    if (confirm("删除分类将同步删除分类下的问题，确定要删除该分类？")) {
        var formata = "catId=" + catId; 
        $.ajax({
            url: "/Home/DelCaseSubCat",
            type: 'post',
            data: formata,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "删除成功！", { infotype: 1, time_out: 500, callback: function () {
                        $("#bodyDiv").load("/Survey/CaseSubjects?marketId=" + marketId + "&caseId=" + caseId + "&r=" + Math.random());
                    }
                    });
                }
            }
        });
    }
}
//编辑问题
function EditSubject(subId, marketId, caseId, catId, stype, pid) {
    var url = "/Survey/SubjectEdit?marketId=" + marketId + "&subId=" + subId + "&caseId=" + caseId + "&catId=" + catId + "&sType=" + stype + "&pid=" + pid;
    var titleString = "新增问题";
    if (catId != 0) {
        titleString = "编辑问题";
    }
    $.YH.box({
        target: url + "&r=" + Math.random(),
        title: titleString,
        width: 550,
        height: 560,
        ok: function () {
            reIndexItems();
            var formata = $("#frmSubject").serialize();
            $.ajax({
                url: "/Home/SaveSubject",
                type: 'post',
                data: formata,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    }
                    else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500, callback: function () {
                            $("#bodyDiv").load("/Survey/CaseSubjects?marketId=" + marketId + "&caseId=" + caseId + "&r=" + Math.random());
                        }
                        });
                    }
                }
            });
        }
    });
}
//删除问题
function DeleteSubject(subId, caseId, marketId) {
    if (confirm("确定要删除该问题？")) {
        var formata = "subjectId=" + subId;
        $.ajax({
            url: "/Home/DelCaseSubject",
            type: 'post',
            data: formata,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "删除成功！", { infotype: 1, time_out: 500, callback: function () {
                        $("#bodyDiv").load("/Survey/CaseSubjects?marketId=" + marketId + "&caseId=" + caseId + "&r=" + Math.random());
                    }
                    });
                }
            }
        });
    }
}

function addItem() {
    subItemIndex++;
    var html = $("#tblItemTmp").html();
    html = html.replace("*index*", subItemIndex).replace("*index*", subItemIndex);
    $("#subImtesTbl").append(html);
}

function delItem(o) {
    $(o).parent().parent().remove();
}
function reIndexItems() {
    var ind = 0;
    $("#subImtesTbl").find("tr[name=itmList]").each(function () {
        $(this).find("input[feild=name]").attr("name", "itemList[" + ind + "].name");

        $(this).find("input[feild=itemId]").attr("name", "itemList[" + ind + "].id");
        $(this).find("input[feild=subjectId]").attr("name", "itemList[" + ind + "].value");
        $(this).find("input[feild=type]:checked").attr("name", "itemList[" + ind + "].type");
        $(this).find("input[feild=childSubjectId]").attr("name", "itemList[" + ind + "].otherParam");
        ind++;
    })
}

//保存答案
function SaveCaseAnswer(isContinue,caseId,marketId) {
    var formData = $("#frmCaseAnswer").serialize();

    $.ajax({
        url: "/Home/SaveCaseAnswer",
        type: 'post',
        data: formData,
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500, callback: function () {
                    if (isContinue == true) {
                        window.location.href = "/Survey/CaseAnswerEdit?marketId=" + marketId + "&caseId=" + caseId;
                    } else {
                        window.location.href = "/Survey/CaseIndex?marketId=" + marketId;
                    }
                }
                });
            }
        }
    });
}

//导入调研问卷
function ImportCase(marketId, caseId) {
    $.YH.box({ target: "/Survey/CaseSubjectSelectTemplate?r=" + Math.random(),
        title: "导入模板选择",
        width: "750",
        ok: function () {
            var $this = $(this);
            var srccaseId = $this.find(".p-j-tempList").find("a.select").closest("dd").attr("value");
            var srcType = $this.find(".p-j-tempList").find("a.select").closest("dd").attr("srcType");
            if (confirm("导入问卷将会删除原来问卷的所有问题，确定要导入该调研问卷？")) {
                var formata = "marketId=" + marketId + "&caseId=" + caseId + "&srccaseId=" + srccaseId + "&srcType=" + srcType;
                $.ajax({
                    url: "/Home/ImportCaseTempate",
                    type: 'post',
                    data: formata,
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            $.tmsg("m_jfw", "导入问卷成功！", { infotype: 1, time_out: 500, callback: function () {
                                $("#bodyDiv").load("/Survey/CaseSubjects?marketId=" + marketId + "&caseId=" + caseId + "&r=" + Math.random());
                            }
                            });
                        }
                    }
                });
            } else {
                return false;
            }
        }
    })
}
//导入调研问卷
function ImportSubjects(marketId, caseId) {
    if (confirm("确定要增加选择的问题？")) {
        var formata = "marketId=" + marketId + "&caseId=" + caseId;
        var srcCase = $("#txtSrcCase").val();
        var srcSubLib = $("#txtSrcSubLib").val();
        var param = "1|" + srcCase + "#2|" + srcSubLib;
        $.ajax({
            url: "/Home/ImportCaseTempate",
            type: 'post',
            data: formata,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "导入问题成功！", { infotype: 1, time_out: 500, callback: function () {
                        $("#bodyDiv").load("/Survey/CaseSubjects?marketId=" + marketId + "&caseId=" + caseId + "&r=" + Math.random());
                    }
                    });
                }
            }
        });
    }
}

function DeleteCaseUser(marketId, caseId,uId,curPage) {
    if (confirm("确定删除该调研用户？")) {
        var formata = "marketId=" + marketId + "&caseId=" + caseId + "&uId=" + uId;
        $.ajax({
            url: "/Home/DelCaseUser",
            type: 'post',
            data: formata,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == false) {
                    $.tmsg("m_jfw", data.Message, { infotype: 2 });
                }
                else {
                    $.tmsg("m_jfw", "删除成功！", { infotype: 1, time_out: 500, callback: function () {
                        var url = "/Survey/CaseUserList?curPage=" + curPage;
                        url += "&marketId=" + marketId;
                        url += "&caseid=" + caseId;
                        $("#bodyDiv").mask("加载中...");
                        $("#bodyDiv").load(url + "&r=" + Math.random(), function () {
                            $("#bodyDiv").unmask();
                        });
                    }
                    });
                }
            }
        });
    }
}

//生成案例模板
function GenerateCaseTempate(srccaseId, srcType) {
    $.YH.box({ target: "/Survey/CaseTemplateEdit",
        title: "生成模板",
        width: "400",
        ok: function () {
            if (confirm("确定要生该案例模板？")) {
                var name = escape($("#txtTmpCaseName").val());
                if (name == "") {
                    alert("请输入模板名称");
                    return;
                }
                var formata = "name=" + name + "&srccaseId=" + srccaseId + "&srcType=" + srcType;
                $.ajax({
                    url: "/Home/GenerateCaseTempate",
                    type: 'post',
                    data: formata,
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            $.tmsg("m_jfw", "模板生成成功！", { infotype: 1, time_out: 500, callback: function () {
                               
                            }
                            });
                        }
                    }
                });
            } else {
                return false;
            }
        }
    })
}