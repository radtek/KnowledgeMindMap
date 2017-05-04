function reloadDiv() {
    changeModuleModule();
}
function changeModuleModule(obj, combid) {
    var themeId = $("#themeId").val();
    $('#p-j-module').html('');
    getModuleNum();
    //$(obj).addClass("select").siblings().removeClass("select");
    var url = [
            "/Home/GetProductThemeModuleRelationJson?",
            "themeId=" + themeId,
            "&boolUse=" + boolUse
        ].join('');

    $.ajax({
        url: url + "&r=" + new Date().getTime(),
        type: 'post',
        data: {},
        dataType: 'json',
        error: function () {
            hiAlert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
        },
        success: function (data) {
            if (data.Success == false) {
                alert(data.Message);
            } else {
                //data.htInfo.jsonStr
                $.YH.moduleTree({ selector: '#p-j-module', data: JSON.parse(data.htInfo.jsonStr) })
                //                    $.YH.mindMap({ selector: '#p-j-module', data: JSON.parse(data.htInfo.jsonStr), color: '#73a1bf', extProp: ["Pid"] });
                //                    var top = $('#p-j-module').find('.YH-MM-box-mainNode').position().top;
                //                    var html = '<div style="position:absolute; top:' + (top + 50) + 'px; left:390px; z-index:100"></div>';
                //                    $('#p-j-module').attr("lurl",url).append(html);
            }
        }
    });
}

function reloadTreeModule() {
    var $con = $('#p-j-module');
    if ($con.length > 0 && $con.attr("lurl") != undefined) {
        $.ajax({
            url: $con.attr("lurl") + "&r=" + new Date().getTime(),
            type: 'post',
            data: {},
            dataType: 'json',
            error: function () {
                hiAlert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
            },
            success: function (data) {
                if (data.Success == false) {
                    alert(data.Message);
                } else {
                    $.YH.moduleTree({ selector: '#p-j-module', data: JSON.parse(data.htInfo.jsonStr) });
                    //                        var top = $('#p-j-module').find('.YH-MM-box-mainNode').position().top;
                    //                        var html = '<div style="position:absolute; top:' + (top + 50) + 'px; left:390px; z-index:100"></div>';
                    //                        $('#p-j-module').attr("lurl", url).append(html);
                }
            }
        });
    } else {
        location.reload();
    }
}

//    function ItemSet() {
//        var url = "/ProductDevelop/ProductModuleTreeItemList?";
//        $("#p-j-treecontent").load(url + "&r=" + Math.random());
//    }
function getCombinationMessage(combinationId, type, obj) {
    var curQuery = "db.ProductCombination.distinct('_id',{'combinationId':'" + combinationId + "'})";
    $.ajax({
        url: '/Home/GetSingleTableJson',
        type: 'post',
        data:{
            tbName: "ProductCombination",
            queryStr: curQuery
        },
        dataType: 'json',
        error: function () {
            hiAlert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
        },
        success: function (data) {
            if (data.Success == false) {
            } else {
                return data;
            }
        }
    });
}

function getModuleNum() {
    var themeId = $("#themeId").val();
    $.ajax({
        url: "/Home/GetProductThemeModuleCount",
        type: 'post',
        data: {
            themeId: themeId,
            booluse: "1"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", "获取模块数量出错", { infotype: 2 });
            } else {
                //                        $("#p-j-moduleAllNum").html("");
                //                        $("#p-j-moduleCoreNum").html("");
                $("#p-j-treemoduleAllNum").html("");
                //                        $("#p-j-treemoduleCoreNum").html("");
                //                        $("#p-j-resultAllNum").html("");
                $("#p-j-treeResultNum").html("");
                //                        $("#p-j-moduleAllNum").html(data.htInfo.useMoudule);
                //                        $("#p-j-moduleCoreNum").html(data.htInfo.allKerMoudule);
                $("#p-j-treemoduleAllNum").html(data.htInfo.curTreeMoudule);
                //                        $("#p-j-treemoduleCoreNum").html(data.htInfo.curComKerMoudule);
                //                        $("#p-j-resultAllNum").html(data.htInfo.allResultCount);
                $("#p-j-treeResultNum").html(data.htInfo.curTreeResultCount);
            }
        }
    });
}

var themeId = $("#themeId").val();
$('#p-j-treecontent').delegate('.mt-name, .mt-title', 'contextmenu', function (e) {
    if (isEdit != "1") return false;
    var $node = $(this), configItemId;
    var moduleRelId = $node.attr("itemid");
    configItemId = $node.attr("itemid");
    $('#YH-MM-J-menu').remove();

    if ($(this).hasClass('mt-title')) {
        //根节点
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>';
        //if (catRight[curTreeId] == 1) {
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>';
        //} else {
        //    menu = menu + '<li yh-popover="暂无权限">关联子模块</li>';
        //}
        menu = menu + '</ul></div>';
    } else if ($(this).hasClass('unUse')) {
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>';
        //                    if(catRight[curTreeId]==1){
        //                        menu = menu+'<li id="YH-MM-J-nodeEdit">设置价值项</li>';
        //                    } else {
        //                        menu = menu+'<li yh-popover="暂无权限">设置价值项</li>';
        //                    }
        // menu = menu +   '<li id="YH-MM-J-nodeAddSibling">添加同级模块</li>' +
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>'
                    + '<li id="YH-MM-J-nodeMove">移动模块</li>'
        //'<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>' +
                    + '<li id="YH-MM-J-nodeDel">移除模块</li>'
                    + '</ul></div>';
    } else {
        var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>';
        //                    if(catRight[curTreeId] == 1){
        //                        menu = menu + '<li id="YH-MM-J-nodeEdit">设置价值项</li>' + '<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>';
        //                    } else {
        //                        menu = menu + '<li yh-popover="暂无权限">设置价值项</li>' + '<li yh-popover="暂无权限">编辑价值项指标</li>';
        //                    }
        // menu = menu +   '<li id="YH-MM-J-nodeAddSibling">添加同级模块</li>' +
        menu = menu + '<li id="YH-MM-J-nodeAdd">关联子模块</li>'
                    + '<li id="YH-MM-J-nodeMove">移动模块</li>'
                    + '<li id="YH-MM-J-nodeDel">移除模块</li>'
                    + '</ul></div>';
    }
    $('body').append(menu).one('click', function () {
        $('#YH-MM-J-menu').remove();
    });
    $('#YH-MM-J-menu').on('click', '#YH-MM-J-nodeEdit', function () {
        //编辑价值项
        $.YH.box({
            target: "/ProductDevelop/ModuleRightClickContent?treeId=" + tree.id + "&itemId=" + configItemId + "&lineId=" + tree.lineId + "&r=" + Math.random(),
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
                    //移动指标
                    //                    var $this=$(this);
                    //
                    //                    $this.parent().fadeTo(500,0.3).addClass('p-j-selfTr');
                    //
                    //                    $('#p-j-indList .p-j-indList-table').delegate('tr:not(".p-j-addTrBox,.p-j-selfTr")','mouseover',function(){
                    //                        if(!$(this).prev().hasClass('.p-j-addTrBox')){
                    //                            $('#p-j-indList .p-j-addTrBox').remove();
                    //                            $(this).before('<tr class="p-j-addTrBox"><td style="height:5px; border:2px dashed #f00; background: #fefefe" colspan="10"></td></tr>')
                    //                        }
                    //
                    //                    })
                    //                    var fnUp=function(e){
                    //                        $('#p-j-indList .p-j-indList-table').undelegate('tr:not(".p-j-addTrBox,.p-j-selfTr")','mouseover');
                    //                        $('#p-j-indList .p-j-addTrBox').after($this.parent().removeClass('p-j-selfTr').fadeTo(500,1)).remove();
                    //                        $(window).off('mouseup',fnUp);
                    //                        return false;
                    //
                    //                    }
                    //                    $(window).on('mouseup',fnUp)
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
                        $tr.attr({ 'tId': newId, 'path': $tr.attr('path') + '_' + newId })
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
        if (confirm('确定移除该模块？')) {
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
                    } else {
                        reloadDiv("tbl");
                        $.tmsg("m_jfw", "移除成功", { infotype: 1, time_out: 500 });
                    }
                }
            });
        }
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeAddSibling', function () {
        var pid = $node.attr("pid");
        var isTemplate = 4;
        var url = [
                "/ProductSeries/ModuleCommonSelector?",
                "themeId=" + themeId,
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
                    url: "/Home/SaveThemeModuleRelation",
                    type: 'post',
                    data: {
                        moduleIds: moduleIds,
                        themeId: themeId,
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
                        } else {
                            reloadDiv("tbl");
                            $.tmsg("m_jfw", "保存成功", { infotype: 1, time_out: 500 });
                        }
                    }
                });
            }
        });
        $('#YH-MM-J-menu').remove();
        return false;
    }).on('click', '#YH-MM-J-nodeAdd', function () {
        var isTemplate = 4;
        var url = [
                "/ProductSeries/ModuleCommonSelector?",
                "&themeId=" + themeId,
                "&isTemplate=" + isTemplate,
                "&r=" + Math.random()
            ].join('');
        //新增子价值项
        $.YH.box({
            target: url,
            title: '关联子模块',
            width: 500,
            height: 430,
            modal: true,
            ok: function () {
                var moduleIds = "";
                $(this).find("input[name=checkbox]:checked").each(function () {
                    moduleIds += $(this).val() + ",";
                });

                $.ajax({
                    url: "/Home/SaveThemeModuleRelation",
                    type: 'post',
                    data: {
                        moduleIds: moduleIds,
                        themeId: themeId,
                        isTemplate: isTemplate,
                        nodePid: moduleRelId
                    },
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        } else {
                            reloadDiv("tbl");
                            $.tmsg("m_jfw", "保存成功", { infotype: 1, time_out: 500 });
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
            var $this = $(this);
            var $tarObj = $(e.target);

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
                targetLv = $(this).find('.mt-name ').attr('lv');
            //要移动的
            var movePid = $this.attr('pid'),
                moveId = $this.attr('itemid'),
                moveLv = $this.attr('lv');
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
            } else {
                flag = true;
            }

            if (!flag || !flag2) return false;
            $(this).find('.mt-name ').css('border', "2px dotted #ddd");

        }).on('mouseleave', '.mt-item', function () {
            $(this).find('.mt-name ').css('border', "");
        }).on('click', ".mt-item", function (e) {
            $box.off('mousemove', fnMove).off('click', ".mt-item");
            $('#p-j-moveBlock').remove();
            var $target = $(this);
            var moveType = '<div class="p-j-moveType pa" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>'
                         + '<li movetype="pre">节点左侧</li>'
                         + '<li movetype="next" class="select">节点右侧</li>';

            var curChild = $(".mt-name[pid=" + $this.attr('itemid') + "]");
            if ($target.find('.mt-name').attr('lv') == "3") {
                moveType += "</ul></div>";
            } else if (curChild.length > 0 && $target.find('.mt-name').attr('lv') == "2") {
                moveType += "</ul></div>";
            } else if ($target.find('.mt-name').attr('lv') == "1" && $this .attr('floor')=="3") {
                moveType += "</ul></div>";
            } else {
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

$('#p-j-treecontent').delegate('.mt-name', 'click', function () {
    if ($(".p-j-moveType").size() == 0) {
        var themeId = $("#themeId").val();
        var $cObj = $(this), offsetLeft, cls, configItemId, combinationId;
        var modRelId = $cObj.attr("itemid");
        if ($cObj.offset().left > $(window).width() / 2) {
            offsetLeft = $cObj.offset().left - 500;
            cls = "p-j-mindMapNodeInfo_L";
        } else {
            offsetLeft = $cObj.offset().left + 50;
            cls = "p-j-mindMapNodeInfo_R";
        }
        var offsetTop = $cObj.offset().top - 80;
        var lurl = "/ProductSeries/ProductThemeModuleTreeClickContent?isEdit=" + isEdit + "&themeId=" + themeId + "&moduleRelId=" + modRelId;

        $('#p-j-mindMapNodeInfo').attr('class', cls).find('.mapNodeInfo')
                .load(lurl + "&r=" + Math.random())
                .end().show().css({ top: offsetTop, left: offsetLeft, "z-index": "105" });
        $("body").mask();
        $("body").children(".loadmask").css("z-index", "100");
        $("body").children(".loadmask").on("click", function () { $("body").unmask(); $('#p-j-mindMapNodeInfo').hide(); });

        setTimeout("$('#p-j-treecontent').one('click',function(){$('#p-j-mindMapNodeInfo').hide()})", 10);
    }
    return false;
});

//页面刷新
function reloadPage() {
    window.location.reload();
}
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


$(document).ready(function () {
    //SetMenu(8, 33);
    changeModuleModule();
});