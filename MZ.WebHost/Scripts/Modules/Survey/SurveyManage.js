function EditSubCat(catId) {
    var url = "/SurveyMange/EditSubCat?catId=" + catId + "";
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
                            $("#subCatDiv").load("/SurveyMange/SubCategories?r=" + Math.random());
                        }
                        });
                    }
                }
            });
        }
    });
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
    if (catId != 0) {
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
                            //$("#subCatDiv").load("/SurveyMange/SubCategories?r=" + Math.random());
                        }
                        });
                    }
                }
            });
        }
    });
}
