$('#p-j-treecontent').delegate('.mt-name', 'click', function () {
    if ($('#p-j-module').hasClass('p-j-moveModel')) {
        return false;
    }
    var lineId = $("#curLineId").val();
    var seriesId = $("#curSeriesId").val();
    var $cObj = $(this), offsetLeft, cls, configItemId, combinationId;
    combinationId = $("#p-j-comblist").find("a[class=select]").attr("comId");
    configItemId = $cObj.attr("itemid");
    if ($cObj.offset().left > $(window).width() / 2) {
        offsetLeft = $cObj.offset().left - 500;
        cls = "p-j-mindMapNodeInfo_L";
    } else {
        offsetLeft = $cObj.offset().left + 50;
        cls = "p-j-mindMapNodeInfo_R";
    }
    var offsetTop = $cObj.offset().top - 80;
    $('#p-j-mindMapNodeInfo').attr('class', cls).find('.mapNodeInfo')
                             .load("/ProductSeries/ModuleTreeClickContent?isEdit=" + isEdit + "&combinationId=" + combinationId + "&configItemId=" + configItemId + "&seriesId=" + seriesId + "&lineId=" + lineId + "&r=" + Math.random()).end().show().css({ top: offsetTop, left: offsetLeft, "z-index": "105" });
    $("body").mask();
    $("body").children(".loadmask").css("z-index", "100");
    $("body").children(".loadmask").on("click", function () { $("body").unmask(); $('#p-j-mindMapNodeInfo').hide(); });

    setTimeout("$('#p-j-treecontent').one('click',function(){$('#p-j-mindMapNodeInfo').hide()})", 10);

    return false;
});

function indicatorManage(id, obj) {
    var url = "/ProductDevelop/ModuleTreeItemIndicatorManage?itemId=" + id;
    var title = "指标管理";
    $.YH.box({
        target: url,
        title: title,
        width: 800,
        buttonNames: ['保 存', null],
        ok: function () { }
    });
}
//修改不同分类下指标类型
function changeIndictorList(obj, typeId) {
    var itemId = $(obj).attr("itemId");
    var url = "/ProductDevelop/ModuleTreeItemIndicatorList?itemId=" + itemId + "&typeId=" + typeId;
    $("#p-j-indList").load(url + "&r=" + Math.random());
}
function classAdd(obj) {
    $(obj).closest("table").find("tr.select").removeClass("select");
    $(obj).closest("tr").addClass("select");
}

var createMask = function () {
    //mask遮罩层
    var newMask = document.createElement("div");
    newMask.id = "m";
    newMask.style.position = "absolute";
    newMask.style.zIndex = "1";
    _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    newMask.style.width = _scrollWidth + "px";
    newMask.style.height = _scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "#33393C";
    newMask.style.filter = "alpha(opacity=10)";
    newMask.style.opacity = "0.20";
    return newMask;
}
var docEle = function (id) {
    return document.getElementById(id) || false;
}
function changeResult(obj, resultId) {
    var isForce = $(obj).val();
    var queryStr = "db.ProductModuleResult.distinct('_id', { 'resultId': '" + resultId + "' })";
    $.ajax({ url: "/Home/SavePostInfo/",
        type: 'post',
        data: {
            tbName: "ProductModuleResult",
            queryStr: queryStr,
            isForce: isForce
        },
        dataType: 'json',
        error: function () {
            $('#save').val('保存并关闭');
            $('#save').attr('disabled', false);
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            } else {
                saveLineLastTime();
                $.tmsg("m_jfw", "设置成功！", { infotype: 1 });
            }
        }
    });
}
function changeResultType(obj, resultId) {
    var standardType = $(obj).val();
    var queryStr = "db.ProductModuleResult.distinct('_id', { 'resultId': '" + resultId + "' })";
    $.ajax({ url: "/Home/SavePostInfo/",
        type: 'post',
        data: {
            tbName: "ProductModuleResult",
            queryStr: queryStr,
            standardType: standardType
        },
        dataType: 'json',
        error: function () {
            $('#save').val('保存并关闭');
            $('#save').attr('disabled', false);
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            } else {
                saveLineLastTime();
                $.tmsg("m_jfw", "设置成功！", { infotype: 1 });
            }
        }
    });
}

$('#p-j-treecontent').delegate('.mt-name, .mt-title', 'contextmenu', function (e) {
    if (isEdit != "1") return false;
    var $node = $(this), configItemId;
    var curTreeId = $("#p-j-curTree").val();
    if ($node.attr('lv') == "1" && $('#p-j-module').find('.mt-session3').length > 0) {
        $node.attr('floor', '3');
    }
    //configItemId = $node.attr("id").replace("YH-MM-node_", ""); 
    configItemId = $node.attr("itemid");
    $('#YH-MM-J-menu').remove();

    if ($(this).hasClass('mt-title')) {
        //根节点
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;z-index:10000000;"><ul>';
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>';
        menu = menu + '</ul></div>';
    } else if ($(this).hasClass('unUse')) {
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;z-index:10000000;"><ul>';
        //                    if(catRight[curTreeId]==1){
        //                        menu = menu+'<li id="YH-MM-J-nodeEdit">设置价值项</li>';
        //                    } else {
        //                        menu = menu+'<li yh-popover="暂无权限">设置价值项</li>';
        //                    }
        // menu = menu +   '<li id="YH-MM-J-nodeAddSibling">添加同级模块</li>' +
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>'
                    + '<li id="YH-MM-J-nodeMove">移动模块</li>'
        //'<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>' +
                    + '<li id="YH-MM-J-nodeDel">删除模块</li>'
                    + '</ul></div>';
    } else {
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;z-index:10000000;"><ul>';
        //                    if(catRight[curTreeId] == 1){
        //                        menu = menu + '<li id="YH-MM-J-nodeEdit">设置价值项</li>' + '<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>';
        //                    } else {
        //                        menu = menu + '<li yh-popover="暂无权限">设置价值项</li>' + '<li yh-popover="暂无权限">编辑价值项指标</li>';
        //                    }
        // menu = menu +   '<li id="YH-MM-J-nodeAddSibling">添加同级模块</li>' +
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>'
                    + '<li id="YH-MM-J-nodeMove">移动模块</li>'
                    + '<li id="YH-MM-J-nodeDel">删除模块</li>'
                    + '</ul></div>';
    }
    $('body').append(menu).one('click', function () {
        $('#YH-MM-J-menu').remove();
    });
    $('#YH-MM-J-menu').on('click', '#YH-MM-J-nodeEdit', function () {
        var treeId = $("#p-j-curTree").val();
        var lineId = $("#curLineId").val();
        //编辑价值项
        $.YH.box({
            target: "/ProductDevelop/ModuleRightClickContent?treeId=" + treeId + "&itemId=" + configItemId + "&lineId=" + lineId + "&r=" + Math.random(),
            title: '设置价值项',
            width: 530,
            height: 390,
            modal: true,
            ok: function () {
                $("#p-j-comblist").find("a[class=select]").first().click();
            },
            buttons: {
                '关闭': function () {
                    $(this).dialog('destroy');
                }
            }
        });
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeIndexEdit', function () {
        //编辑价值项指标
        $.YH.box({
            target: "/ProductDevelop/ModuleTreeItemIndicatorManage?itemId=" + configItemId + "&r=" + Math.random(),
            title: '设置价值项指标',
            width: 700,
            height: 600,
            modal: true,
            create: function () {
                $(this).find('#p-j-indList .p-j-indList-addIndexItm_btn').click(function () {
                    //添加指标
                    $('#p-j-indList').find('.p-j-indList-box').animate({ scrollTop: 100000 }, function () {
                        var html = '<tr lv="1" path="p" ><td class="p-j-tdMoveHandler"><div class="tb_con">1</div></td>'
                        + '<td><div class="p-j-trLv" style="margin-left: 10px"><a class="p-icon_fold01_close"></a><input class="p-j-indexName" type="text"><a href="javascript:;" lv="1" class="p-j-addSubIndex p-addSetting-ml"> 添加子级指标 </a></div></td>'
                        + '<td><div class="tb_con tc"><input type="checkbox"></div></td>'
                        + '<td><div class="tb_con tc"><input type="checkbox"></div></td>'
                        + '<td align="center"><div class="tb_con"><a href="#">删除</a></div></td></tr>';

                        $(html).appendTo('#p-j-indList .p-j-indList-table tbody').fadeIn(500).find('input:first').focus();
                    });
                    return false;
                });
                $('#p-j-indList .p-j-indList-table').delegate('.p-j-tdMoveHandler', 'mousedown', function () {
                    return false;
                }).delegate('.p-j-addSubIndex', 'click', function () {
                    //添加子级指标
                    var $tr = $(this).closest('tr');
                    if ($tr.attr('tId')) {
                        var lv = $tr.attr('lv') * 1 + 1;
                        var path = $tr.attr('path');
                        var html = '<tr tId="" lv="' + lv + '" path="' + path + '"><td class="p-j-tdMoveHandler"><div class="tb_con">1</div></td>'
                        + '<td><div class="p-j-trLv" style="margin-left: ' + lv + '0px"><a class="p-icon_fold01_close"></a><input class="p-j-indexName" type="text"><a href="javascript:;" lv="1" class="p-j-addSubIndex p-addSetting-ml"> 添加子级指标 </a></div></td>'
                        + '<td><div class="tb_con tc"><input type="checkbox"></div></td>'
                        + '<td><div class="tb_con tc"><input type="checkbox"></div></td>'
                        + '<td align="center"><div class="tb_con"><a href="#">删除</a></div></td></tr>';
                        $tr.after(html);
                    } else {
                        alert('必须输入指标名才能创建子节点');
                        $tr.find('.p-j-indexName').focus();
                    }
                    return false;
                }).delegate('.p-j-indexName', 'change', function () {
                    //编辑指标名
                    var $tr = $(this).closest('tr');
                    if ($tr.attr('tId')) {
                        //改变指标值
                    } else {
                        //给新建指标命名
                        var newId = 1234; //后台传回的id
                        $tr.attr({ 'tId': newId, 'path': $tr.attr('path') + '_' + newId });
                    }
                    var $tr = $(this).closest('tr');
                    return false;
                });
            },
            ok: function () {
            }
        });
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeDel', function () {
        //删除价值项
        if (confirm('确定删除该模块？')) {
            $.ajax({
                url: "/Home/DelePostInfo",
                type: 'post',
                data: {
                    tbName: "ProductModuleRelation",
                    queryStr: "db.ProductModuleRelation.distinct('_id',{'moduleRelId':'" + configItemId + "'})"
                },
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    }
                    else {
                        $.tmsg("m_jfw", "删除成功", { infotype: 1 });
                        reloadPage("tbl");
                    }
                }
            });
        }
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeAddSibling', function () {
        $('body').unmask();
        var pid = $node.attr("pid");
        var treeId = $("#p-j-curTree").val();
        var treeSplitId = $("#treeSplitId").val();
        var lineId = $("#curLineId").val();
        var seriesId = $("#curSeriesId").val();
        var isTemplate = 2;
        var url = [
                "/ProductSeries/ModuleCommonSelector?",
                "treeId=" + treeId,
                "&treeSplitId=" + treeSplitId,
                "&lineId=" + lineId,
                "&seriesId=" + seriesId,
                "&isTemplate=" + isTemplate,
                "&r=" + Math.random()
            ].join('');
        //新增子价值项
        $.YH.box({
            target: url,
            title: '新增同级模块',
            width: 500,
            height: 430,
            modal: true,
            ok: function () {
                var moduleIds = "";
                $(this).find("input[name=checkbox]:checked").each(function () {
                    moduleIds += $(this).val() + ",";
                });

                $.ajax({
                    url: "/Home/SaveSeriesModuleRelation",
                    type: 'post',
                    data: {
                        moduleIds: moduleIds,
                        treeId: treeId,
                        treeSplitId: treeSplitId,
                        lineId: lineId,
                        seriesId: seriesId,
                        isTemplate: isTemplate,
                        nodePid: pid
                    },
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            $.tmsg("m_jfw", "保存成功", { infotype: 1 });
                            reloadPage("tbl");
                        }
                    }
                });
            }
        });
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeAdd', function () {
        var treeId = $("#p-j-curTree").val();
        var treeSplitId = $("#treeSplitId").val();
        var lineId = $("#curLineId").val();
        var seriesId = $("#curSeriesId").val();
        var isTemplate = 2;
        var url = [
                "/ProductSeries/ModuleCommonSelector?",
                "treeId=" + treeId,
                "&treeSplitId=" + treeSplitId,
                "&lineId=" + lineId,
                "&seriesId=" + seriesId,
                "&isTemplate=" + isTemplate,
                "&configItemId=" + configItemId,
                "&r=" + Math.random()
            ].join('');
        //新增子价值项
        $.YH.box({
            target: url,
            title: '关联子模块',
            width: 500,
            modal: true,
            ok: function () {
                var moduleIds = "";
                $(this).find("input[name=checkbox]:checked").each(function () {
                    //需过滤已存在的关联
                    if ($(this).attr("hasExit") != "1") moduleIds += $(this).val() + ",";
                });
                $.ajax({
                    url: "/Home/SaveSeriesModuleRelation",
                    type: 'post',
                    data: {
                        moduleIds: moduleIds,
                        treeId: treeId,
                        treeSplitId: treeSplitId,
                        lineId: lineId,
                        seriesId: seriesId,
                        isTemplate: isTemplate,
                        nodePid: configItemId
                    },
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            reloadPage("tbl");
                            $.tmsg("m_jfw", "保存成功", { infotype: 1 });
                        }
                    }
                });
            }
        });
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeMove', function () {
        //移动价值项
        var $this = $node,  //要移动的节点
            $box = $('#p-j-module'), flag = true, flag2 = true,
            $itemBox = $node.closest('.mt-itemBox');
        var cantFirst = false;
        if ($this.attr('lv') == 1 && $box.find('.mt-session3').length > 0) {
            cantFirst = true;
        }
        $box.addClass('p-j-moveModel');
        $('body').append('<div id="p-j-moveBlock">' + $node.find('.mt-text').text() + '</div>');
        var fnMove = function (e) {
            $('#p-j-moveBlock').css({ top: e.pageY, left: (e.pageX + 20) });
            return false;
        }
        $box.on('mousemove', fnMove);
        var fnRemove = function (e) { //取消移动
            $("#YH-MM-J-menu").remove();
            var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>' +
                       '<li id="YH-MM-J-nodeCancelMove">取消移动</li>' +
                       '</ul></div>';
            $('#p-j-moveBlock').remove();
            $('.p-j-moveType').remove();
            $box.off('mousemove', fnMove);
            $box.off('mouseenter mouseleave click', '.mt-item');
            $('body').append(menu).one(function () {
                $("#YH-MM-J-menu").remove();
            });
            $('#YH-MM-J-nodeCancelMove').click(function () {
                $("#YH-MM-J-menu").remove();
                $box.off('contextmenu', fnRemove);
            });
            $box.removeClass('p-j-moveModel');
            return false;
        }
        $box.on('contextmenu', fnRemove);

        $box.on('mouseenter', '.mt-item', function () {
            //目标
            var targetPid = $(this).find('.mt-name ').attr('pid'),        //父节点id
                targetId = $(this).find('.mt-name ').attr('itemid'),  //当前节点id
                targetLv = $(this).find('.mt-name ').attr('lv'),
                targetCC = $(this).find('.mt-name ').attr('childcount');
            //要移动的
            var movePid = $this.attr('pid'),
                moveId = $this.attr('itemid'),
                moveLv = $this.attr('lv'),
                moveCC = $this.attr('childcount');
            //要移动的子级
            var curChild = $(".mt-name[pid=" + moveId + "]");
            if (curChild.length > 0) { //移动的是有子级的层级  不可移动到孙子级
                curChild.each(function () {
                    var $curChild = $(this),
                        curCPid = $curChild.attr('pid'),
                        curCid = $curChild.attr('itemid'),
                        curLv = $curChild.attr('lv');
                    if (curCid == targetPid) {
                        flag2 = false;
                        return false;
                    } else {
                        flag2 = true;
                    }
                });
            }

            if (moveId == targetId) { //本身
                flag = false;
            } else if (moveId == targetPid) { //目标是子级
                flag = false;
            } else if (+moveCC + +targetLv > 3) {
                flag = false;
            } else {
                flag = true;
            }

            if (!flag || !flag2) return false;
            $(this).find('.mt-name ').css('border', "1px dotted #ddd")
                .end().addClass('p-j-target');

        }).on('mouseleave', '.mt-item', function () {
            $(this).find('.mt-name ').css('border', "")
                .end().removeClass('p-j-target');
        }).on('click', ".mt-item", function (e) {
            if (!$(this).hasClass('p-j-target')) {
                $.tmsg("m_jfw", "非法目标！请重新选择", { infotype: 2 });
                return false;
            }
            $box.off('mousemove', fnMove).off('click', ".mt-item");
            $('#p-j-moveBlock').remove();
            var $target = $(this);
            var moveType = '<div class="p-j-moveType pa" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>'
                         + '<li movetype="pre">节点左侧</li>'
                         + '<li movetype="next" class="select">节点右侧</li>';

            var curChild = $(".mt-name[pid=" + $this.attr('itemid') + "]");

            if ($target.find('.mt-name').attr('lv') == "1" && $this.attr('childcount') < 2) {
                moveType += '<li movetype="child">子节点</li></ul></div>';
            } else if ($target.find('.mt-name').attr('lv') == "2" && $this.attr('childcount') < 1) {
                moveType += '<li movetype="child">子节点</li></ul></div>';
            }

            $('body').append(moveType);
            $('body').on('click', '.p-j-moveType li', function () {
                var type = $(this).attr('movetype'),
                    moveId = $this.attr('itemid'),
                    moveToId = $target.find('.mt-name').attr('itemid');
                moveModuleItem('ProductModuleRelation', moveId, moveToId, type);
                $('body').off('click', '.p-j-moveType li');
                $(this).closest('.p-j-moveType').remove();
                $box.removeClass('p-j-moveModel');
            });
        });
    });
    return false;
});


function ChangeModulCore(obj, combId, treeId, propertyId) {
    //  var propertyid = $(obj).attr("propertyid");
    var isCore = 0;
    if ($(obj).prop("checked") == true) {
        isCore = 1;
    }
    var queryStr = "";
    if (propertyId != 0) {
        queryStr = "db.ConfigItemProperty.distinct('_id',{'propertyId':'" + propertyId + "'})";
    }
    $.ajax({
        url: "/Home/SavePostInfo",
        type: 'post',
        data: {
            tbName: "ConfigItemProperty",
            queryStr: queryStr,
            dataStr: "isCore=" + isCore + "&haSet=1"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                saveLineLastTime();
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                var comObj = $("#p-j-comblist").find("a[class=select]").first().click();
            }
        }
    });
}

function ChangeProjUse(obj, combId, treeId, propertyId) {
    //  var propertyid = $(obj).attr("propertyid");
    var isCore = 0;
    if ($(obj).prop("checked") == true) {
        isCore = 1;
    }
    var queryStr = "";
    if (propertyId != 0) {
        queryStr = "db.ConfigItemProperty.distinct('_id',{'propertyId':'" + propertyId + "'})";
    }
    $.ajax({
        url: "/Home/SavePostInfo",
        type: 'post',
        data: {
            tbName: "ConfigItemProperty",
            queryStr: queryStr,
            dataStr: "isProjUse=" + isCore + "&haSet=1"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                saveLineLastTime();
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                var comObj = $("#p-j-comblist").find("a[class=select]").first().click();
            }
        }
    });
}

function changeIsUse(obj, itemId, tbName, primaryKey) {
    var isUse = 0;
    if ($(obj).prop("checked") == true) {
        isUse = 1;
    }
    if (isUse != 1) {
        if (!confirm("确定要取消使用该模块,取消使用后该模块的子模块同样取消使用!")) {
            $(obj).attr("checked", true);
            return false;
        }
    }

    var queryStr = "db." + tbName + ".distinct('_id',{'" + primaryKey + "':'" + itemId + "'})";
    $.ajax({
        url: "/Home/SaveTreeAndSubNodeField",
        type: 'post',
        data: {
            tbName: tbName,
            queryStr: queryStr,
            isUse: isUse,
            relModField: "isUse"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                saveLineLastTime();
                $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                var comObj = $("#p-j-comblist").find("a[class=select]").first().click();
            }
        }
    });
}
function changeProf(obj, itemId, tbName, primaryKey) {
    var profId = $(obj).val();
    var queryStr = "db." + tbName + ".distinct('_id',{'" + primaryKey + "':'" + itemId + "'})";
    $.ajax({
        url: "/Home/SavePostInfo",
        type: 'post',
        data: {
            tbName: tbName,
            queryStr: queryStr,
            profId: profId
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                saveLineLastTime();
                $.tmsg("m_jfw", "修改成功！", { infotype: 1 });
                //var comObj = $("#p-j-comblist").find("a[class=select]").first().click();
            }
        }
    });
}
function getModuleNum(lineId, treeId, combinationId) {
    $.ajax({
        url: "/Home/GetProductModuleCount",
        type: 'post',
        data: {
            lineId: lineId,
            treeId: treeId,
            combinationId: combinationId,
            booluse: "1"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                //                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                //                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                $("#p-j-moduleAllNum").html("");
                $("#p-j-moduleCoreNum").html("");
                $("#p-j-treemoduleAllNum").html("");
                $("#p-j-treemoduleCoreNum").html("");
                $("#p-j-resultAllNum").html("");
                $("#p-j-treeResultNum").html("");
                $("#p-j-moduleAllNum").html(data.htInfo.useMoudule);
                $("#p-j-moduleCoreNum").html(data.htInfo.allKerMoudule);
                $("#p-j-treemoduleAllNum").html(data.htInfo.curTreeMoudule);
                $("#p-j-treemoduleCoreNum").html(data.htInfo.curComKerMoudule);
                $("#p-j-resultAllNum").html(data.htInfo.allResultCount);
                $("#p-j-treeResultNum").html(data.htInfo.curTreeResultCount);
            }
        }
    });
}
function addStyle(obj, treeId, lineId, seriesId) {
    $.YH.box({
        target: "#p-j-addstyle",
        title: '添加风格',
        width: 350,
        height: 200,
        modal: true,
        ok: function () {
            var curSrcId = $(this).find("#p-j-styleSelect").val();
            var curSelctHtml = $.trim($(this).find("#p-j-styleSelect").find("option:selected").text());
            if (curSelctHtml == "已添加所有风格") {
                $.tmsg("m_jfw", "所有风格已添加,不需再添加!", { infotype: 1 });
                return;
            } else if (curSrcId == 0) {
                $.tmsg("m_jfw", "请先选择风格", { infotype: 1 });
                return false;
            } else {
                $.ajax({
                    url: "/Home/SavePostInfo",
                    type: 'post',
                    data: {
                        tbName: "ProductCombination",
                        queryStr: "",
                        name: curSelctHtml,
                        isDefaultOrNot: "2",
                        lineId: lineId,
                        seriesId: seriesId,
                        treeId: treeId,
                        srcId: curSrcId
                    },
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        }
                        else {
                            saveLineLastTime();
                            $.tmsg("m_jfw", "添加风格成功！", { infotype: 1 });
                            window.location.href = '/ProductDevelop/ProductModuleTreeManage?seriesId=' + seriesId + '&lineId=' + lineId + '&isEdit=1&r=' + Math.random() + '#2_' + data.htInfo.combinationId;
                        }
                    }
                });
            }
        }
    });
}

// 保存产品线最后更新时间
function saveLineLastTime() {
    var lineId = $("#curLineId").val();
    $.ajax({
        url: "/Home/UpdateFieldDate?tbName=ProductLine&keyValue=" + lineId + "&keyName=lineId&fieldStr=lastUpdateTime",
        dataType: "json",
        type: 'post',
        error: function () {
        },
        success: function (data) {

        }
    });
}

function loadTreeModule(obj) {
    var lineId = $("#curLineId").val();
    var seriesId = $("#curSeriesId").val();
    var treeId = $(obj).attr("treeid");
    var treeType = $(obj).attr("treetype");
    var hashTreeId = $.zyhash("treeId");
    if (hashTreeId != treeId) {
        $.zyhash("treeId", treeId);
    }
    $("#p-j-curTree").val(treeId);
    $(obj).parent().addClass("select").siblings().removeClass("select");
    var treeName = $(obj).attr("treename");
    var treeSplitId = $("input[name=treeSplitId]").val();
    var _isEdit = $.zyhash("isEdit");
    if (_isEdit != undefined) isEdit = _isEdit;
    var url = "/ProductSeries/ProductModuleTreeContent?treeSplitId=" + treeSplitId + "&treeId=" + treeId + "&lineId=" + lineId + "&seriesId=" + seriesId + "&isEdit=" + isEdit;
    $("#p-j-treecontent").load(url + "&r=" + Math.random());
    $("#p-j-treecontent").attr("url", url);
    $("#p-j-treecontent").attr("lurl", url);
    $("#p-j-treeheadname").html("");
    $("#p-j-treeheadname").html(treeName);
}

function changeTreeSplit(obj) {
    var newSplitId = $(obj).attr("keyvalue");
    var oldUrl = window.location.href;
    var oldHash = location.hash;
    url = oldUrl.replace(/&treeSplitId=\d*/, "").replace(/#.*/, "") + "&treeSplitId=" + newSplitId + oldHash;
    window.location.href = url;
}

function reloadPage() {
    window.location.reload();
}

function editSplit(obj) {
    var id = $(obj).attr("data-splitId");
    var title = "编辑划分";
    if (id == '' || id == '0') {
        title = "添加划分";
    }
    var lineId = $("#curLineId").val();
    var seriesId = $("#curSeriesId").val();
    var url = [
            "/ProductSeries/ProductValueTreeSeriesSplitEdit?",
            "isTemplate=2",
            "&seriesId=" + seriesId,
            "&lineId=" + lineId,
            "&splitId=" + id,
            "&r=" + Math.random()
        ].join('');
    $.YH.box({
        target: url,
        title: title,
        width: "555",
        height: "350",
        ok: function () {
            var $this = $(this);
            var formdata = {};
            var createType = $this.find("#p-j-sptype").val(); //1:新增  2：从模板选择
            if (createType == "1") {
                formdata.name = $this.find("input[name=name]").val();
            } else {
                var chooseSplitId = $this.find("input[name=treeSplitId]:checked").val();
                if (chooseSplitId == undefined) {
                    alert("请选择一个现有划分");
                    return false;
                }
            }
            var name = $.trim($this.find("input[name=name]").val());
            if (name == "") {
                alert('请填写划分名称');
                return false;
            }
            var url = "/Home/SavePostInfo";

            $.ajax({
                url: url,
                type: 'post',
                data: formdata,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                    } else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                        var newSplitId = data.htInfo.treeSplitId;
                        var oldUrl = window.location.href;
                        url = oldUrl.replace(/&treeSplitId=\d*/, "").replace(/#.*/, "") + "&treeSplitId=" + newSplitId + oldHash;
                        window.location.href = url;
                    }
                }
            });
        }
    });
}

$(function () {
    var treeId = $.zyhash('treeId');
    var $treeObj = $("#p-j-item").find("a[treeid=" + treeId + "]");
    if ($treeObj.length > 0) {
        $treeObj.first().click();
    } else {
        $("#p-j-item").find("a[treeid]").first().click();
    }
});

//移动价值项
function moveModuleItem(tbName, moveId, moveToId, moveType) {
    $.ajax({
        url: "/Home/MoveTemplateModuleRelation",
        type: 'post',
        data: {
            tbName: tbName,
            moveId: moveId,
            moveToId: moveToId,
            type: moveType
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            } else {
                reloadPage("tbl");
                $.tmsg("m_jfw", "移动成功！", { infotype: 1 });
            }
        }
    });
}