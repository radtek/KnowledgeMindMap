var ExcelHelper = {
    getHtmlCode: function ($table) {
        var htmlCode;
        if ($table.length == 0 || $table[0].nodeName.toLowerCase() != "table")
            return false;
        $table.find("td,th").each(function () {
            var align = $(this).attr("align");
            if (!align) {
                align = $(this).css("text-align");
            }
            if (!align)
                align = "center";
            $(this).attr("align", align);
        });
        htmlCode = "<table>" + $table.html() + "</table>";
        return htmlCode;
    },
    getHtmlCodeEx: function ($table) {
        var htmlCode;
        if ($table.length == 0 || $table[0].nodeName.toLowerCase() != "table")
            return false;
        $table.find("td,th").each(function () {
            var align = $(this).attr("align");
            if (!align) {
                align = $(this).css("text-align");
            }
            if (!align)
                align = "center";
            $(this).attr("align", align);
        });

        var htmlStr = "";
        var regExp = new RegExp("&nbsp;", "g");


        if ($table.find("table").length > 0) {
            $table.find("tr[mark!=in]").each(function () {
                htmlStr += "<tr>";
                if ($(this).find("table").length > 0) {
                    var $innerTable = $(this).find("table");
                    var trCount = $innerTable.find("tr").length + 1;
                    var $td = $innerTable.closest("td");
                    var tableOuter = $.trim($td.clone().find("table").remove().end().text());
                    var beforeTableHtml = "";

                    $(this).children("td").each(function () {
                        if ($(this).find("table").length > 0) {
                            var trIndex = 1;

                            var tdCount = $innerTable.find("tr").last().find("td").length;
                            htmlStr += "<td colspan='" + tdCount + "'>" + tableOuter + "</td></tr><tr>";
                            trIndex++;

                            $innerTable.find("tr").each(function () {
                                htmlStr += beforeTableHtml + $(this).html();
                                if (trIndex < trCount) {
                                    htmlStr += "</tr><tr>";
                                }
                                trIndex++;
                            });

                        } else {
                            var copSpan = $(this).attr("colspan");
                            var curTdHtml = "<td ";

                            if (copSpan != undefined) {
                                curTdHtml += "colspan='" + copSpan;
                            }
                            curTdHtml += "'>";
                            beforeTableHtml += curTdHtml + "</td>";
                            htmlStr += curTdHtml + $(this).html() + "</td>";
                        }
                    });
                } else {
                    htmlStr += $(this).html();
                }

                htmlStr += "</tr>";
            })
        }
        console.log(htmlStr.replace(regExp, ""));
        htmlCode = "<table>" + htmlStr.replace(regExp, "") + "</table>";
        return htmlCode;
    },
    getExcelFile: function ($table, fileName) {
        var htmlCode = this.getHtmlCode($table);
        if (!htmlCode) {
            $.tmsg("m_jfw", "表格生成错误，请联系管理员！", { infotype: 2 });
            return false;
        }
        htmlCode = encodeURIComponent(htmlCode)
        fileName = escape(fileName);
        var result;
        $.ajax({
            url: "/Home/CreateExcelByHtmlCode",
            type: "post",
            data: { "htmlCode": htmlCode, "sheetName": fileName },
            async: false,
            success: function (ret) {
                ret = $.parseJSON(ret);
                result = ret.Success;
                if (ret.Success) {
                    var url = "/Home/GetExcelFile?fullFileName=" + escape(ret.Message) + "&downloadName=" + fileName + "&contentType=application/excel&r=" + Math.random();
                    window.location.href = url;
                } else {
                    $.tmsg("m_jfw", ret.Message, { infotype: 2 });
                }
            }
        });
        return result;
    },
    getExcelFileEx: function ($table, fileName) {
        var htmlCode = this.getHtmlCodeEx($table);
        if (!htmlCode) {
            $.tmsg("m_jfw", "表格生成错误，请联系管理员！", { infotype: 2 });
            return false;
        }
        htmlCode = encodeURIComponent(htmlCode)
        fileName = escape(fileName);
        var result;
        $.ajax({
            url: "/Home/CreateExcelByHtmlCode",
            type: "post",
            data: { "htmlCode": htmlCode, "sheetName": fileName },
            async: false,
            success: function (ret) {
                ret = $.parseJSON(ret);
                result = ret.Success;
                if (ret.Success) {
                    var url = "/Home/GetExcelFile?fullFileName=" + escape(ret.Message) + "&downloadName=" + fileName + "&contentType=application/excel&r=" + Math.random();
                    window.location.href = url;
                } else {
                    $.tmsg("m_jfw", ret.Message, { infotype: 2 });
                }
            }
        });
        return result;
    }
};