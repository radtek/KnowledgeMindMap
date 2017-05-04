//切换城市
function changeDataKey(obj, tdIndex) {
    var productCatId = $("select[name=selProductCat][tdIndex=" + tdIndex + "]").val();
    var dataKey = $(obj).val();
    filterProductLine(tdIndex, dataKey, productCatId);
}
//切换系列
function changeProductCat(obj, tdIndex) {
    var productCatId = $(obj).val();
    var dataKey = $("select[name=selCity][tdIndex=" + tdIndex + "]").val();
    filterProductLine(tdIndex, dataKey, productCatId);
}
//刷新项目列表
function filterProductLine(tdIndex,dataKey,productCatId) {
    var selProductObj = $("select[name=selProductLine][tdIndex=" + tdIndex + "]")[0];
    $(selProductObj).find("option").each(function () {
        if ($(this).val() != "0") {
            $(this).remove();
        }
    });
    $(productLineJson).each(function (n, value) {
        if (dataKey != "" && productCatId != "") {
            if (value.dataKey == dataKey && value.prodCatId == productCatId) {
                $("<option value=\"" + value.lineId + "\">" + value.name + "</option>").appendTo($(selProductObj));
            }
        } else if (dataKey != "" && productCatId == "") {
            if (value.dataKey == dataKey) {
                $("<option value=\"" + value.lineId + "\">" + value.name + "</option>").appendTo($(selProductObj));
            }
        } else if (dataKey == "" && productCatId != "") {
            if (value.prodCatId == productCatId) {
                $("<option value=\"" + value.lineId + "\">" + value.name + "</option>").appendTo($(selProductObj));
            }
        }
    });
}
//清空
$('.p-j-colEmpty').click(function () {
    var self = $(this).closest('td');
    self.find('select[name=selCity]').children(':first').prop('selected', true).end().trigger('change');
    self.find('select[name=selProductCat]').children(':first').prop('selected', true).end().trigger('change');
    self.find('select[name=selProductLine]').children(':first').prop('selected', true).end().trigger('change');
});
//选中项目
function changeProductLine(obj) {
    var self = $(obj), lineId = self.val(),
        tdIndex = self.attr('tdIndex');
    var options = {
        url: 'data-original'
    };
    $("td[id^=p-j-" + tdIndex + "]").find('select').empty().hide();
    $("td[id^=p-j-t" + tdIndex + "]").empty();
    $.get('/home/GetModuleResults?lineId=' + lineId, function (data) {
        $.each(data, function (index, cur) {
            var moduleId = cur.moduleId,
                rsList = cur.resultList;
            var htmlDom = "",
            imgbox = '<div class="p-ResultShow"><div id="' + moduleId + '-' + tdIndex + '"><div class="pic"><ul>';

            $.each(rsList, function (index2, cur2) {
                htmlDom += "<option value=" + cur2.id + ">" + cur2.name + "</option>";
                if (index2 == 0) {
                    if (cur2.fileList) {
                        $.each(cur2.fileList, function (index3, imgInfo) {
                            //imgbox += "<li><a class='yh-img_ul' onclick='return hs.expand(this);' href='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_sup.") + "' style='width: 220px; height: 200px'><img alt='" + imgInfo.name + "' src='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_ul.") + "' width='220' height='200' /></a></li>";
                            imgbox += "<li><a class='yh-img_ul' href='javascript:;' style='width: 220px; height: 200px'>"
                                    + "<img data-original='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_sup.") + "' alt='" + imgInfo.name + "' src='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_ul.") + "' width='220' height='200' /></a></li>";
                        });
                    }
                }
            });
            imgbox += "</ul></div></div></div>";
            var target1 = $('#p-j-' + tdIndex + "-" + moduleId);
            var target2 = $('#p-j-t' + tdIndex + "-" + moduleId);
            if (target1.length > 0) {
                target1.find('select').empty().append(htmlDom).show().data("results", rsList);
            }
            if (target2.length > 0 && $(imgbox).find("li").length>0) {
                target2.append(imgbox);
                setTimeout((function () {
                    myFocus.set({
                        id: moduleId + '-' + tdIndex, //焦点图盒子ID
                        pattern: 'mF_fscreen_tb', //风格应用的名称
                        auto: false,
                        trigger: 'click', //触发切换模式:'click'(点击)/'mouseover'(悬停)
                        width: 220, //设置图片区域宽度(像素)
                        height: 200, //设置图片区域高度(像素)
                        //autoZoom:true,
                        txtHeight: '0'//文字层高度设置(像素),'default'为默认高度，0为隐藏
                    });

                    $("#" + moduleId + '-' + tdIndex).viewer(options);
                })(), 0);
            }
        });
    });
}
//切换成果
function GetResultInfo(obj, moduleId) {
    var $obj = $(obj), tdIndex = $obj.closest('td').attr('tdIndex'),
        target = $('#p-j-t' + tdIndex + "-" + moduleId), data = $obj.data('results');
    target.empty();
    var curVal = $obj.val();
    var options = {
        url: 'data-original'
    };
    $.get('/home/GetResult?retId=' + curVal, function (rs) {
        if (rs.length > 0) {
            imgbox = '<div class="p-ResultShow"><div id="' + moduleId + '-' + tdIndex + '"><div class="pic"><ul>';
            $.each(rs, function (index2, imgInfo) {
                //imgbox += "<li><a class='yh-img_ul' onclick='return hs.expand(this);' href='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_sup.") + "' style='width: 220px; height: 200px'><img alt='" + imgInfo.name + "' src='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_ul.") + "' width='220' height='200' /></a></li>";
                imgbox += "<li><a class='yh-img_ul' href='javascript:;' style='width: 220px; height: 200px'>"
                                    + "<img data-original='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_sup.") + "' alt='" + imgInfo.name + "' src='" + unescape(imgInfo.thumbPicPath).replace('_m.', "_ul.") + "' width='220' height='200' /></a></li>";
            });
            imgbox += "</ul></div></div></div>";
            
            if (target.length > 0 && $(imgbox).find("li").length > 0) {
                target.append(imgbox);
                setTimeout((function () {
                    myFocus.set({
                        id: moduleId + '-' + tdIndex, //焦点图盒子ID
                        pattern: 'mF_fscreen_tb', //风格应用的名称
                        auto: false,
                        trigger: 'click', //触发切换模式:'click'(点击)/'mouseover'(悬停)
                        width: 220, //设置图片区域宽度(像素)
                        height: 200, //设置图片区域高度(像素)
                        txtHeight: '0'//文字层高度设置(像素),'default'为默认高度，0为隐藏
                    });
                    $("#" + moduleId + '-' + tdIndex).viewer(options);
                })(), 0);
            }
        }
    });

}

$(document).on('click', ".p-j-collapseTable-tit", function () {
    var self = $(this);
    var target = self.closest('thead').next();
    if (target[0].nodeName.toUpperCase() === "TBODY") {
        self.toggleClass('select');
        if (self.hasClass('select')) {
            target.slideUp();
        } else {
            target.slideDown();
        }
    }
});