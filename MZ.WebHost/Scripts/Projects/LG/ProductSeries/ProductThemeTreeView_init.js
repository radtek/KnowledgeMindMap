
function reloadDiv() {
    changeModuleModule();
}
function changeModuleModule(obj, combid) {
    var themeId = $("#themeId").val();
    var levelId = $("#curLevelId").val();
    $('#p-j-module').html('');
    getModuleNum();
    var url = ["/Home/GetProductThemeLevelModuleRelationJson?",
        "themeId="+themeId,
        "&boolUse=" + boolUse,
        "&levelId=" + levelId
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
            }
            else {
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
                }
                else {
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

function getModuleNum() {
    var themeId = $("#themeId").val();
    var levelId = $("#curLevelId").val();
    $.ajax({
        url: "/Home/GetProductThemeModuleCount",
        type: 'post',
        data: {
            themeId: themeId,
            levelId: levelId,
            booluse: boolUse
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", "获取模块数量出错", { infotype: 2 });
            }
            else {
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





if (isEdit == "1") {
    var themeId = $("#themeId").val();
    $('#p-j-treecontent').delegate('.mt-name, .mt-title', 'contextmenu', function (e) {
        var $node = $(this), configItemId;
        var moduleRelId = $node.attr("itemid");

        configItemId = $node.attr("itemid");
        var levelId = $("#curLevelId").val();
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
            menu = menu + // '<li id="YH-MM-J-nodeEdit">设置模块应用</li>' +

             '<li id="YH-MM-J-nodeAdd">关联子模块</li>' +
              '<li id="YH-MM-J-nodeRemove">移除模块</li>' +
            //   '<li id="YH-MM-J-nodeMove">移动模块</li>' +

            //'<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>' +
            //   '<li id="YH-MM-J-nodeDel">删除模块</li>' +
                                    '</ul></div>';
        } else {
            var menu = '<div id="YH-MM-J-menu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><ul>';
            //                    if(catRight[curTreeId] == 1){
            //                        menu = menu + '<li id="YH-MM-J-nodeEdit">设置价值项</li>' + '<li id="YH-MM-J-nodeIndexEdit">编辑价值项指标</li>';
            //                    } else {
            //                        menu = menu + '<li yh-popover="暂无权限">设置价值项</li>' + '<li yh-popover="暂无权限">编辑价值项指标</li>';
            //                    }
            // menu = menu +   '<li id="YH-MM-J-nodeAddSibling">添加同级模块</li>' +
            menu = menu + //'<li id="YH-MM-J-nodeEdit">设置模块应用</li>' +

                            '<li id="YH-MM-J-nodeAdd">关联子模块</li>' +
                            '<li id="YH-MM-J-nodeRemove">移除模块</li>' +
            //                                    '<li id="YH-MM-J-nodeMove">移动模块</li>' +
            //                                    '<li id="YH-MM-J-nodeDel">删除模块</li>' +
                                    '</ul></div>';
        }
        $('body').append(menu).one('click', function () {
            $('#YH-MM-J-menu').remove();
        });
        $('#YH-MM-J-menu').on('click', '#YH-MM-J-nodeEdit', function () {
            var levelId = $("#curLevelId").val();
            //编辑价值项
            $.YH.box({
                target: "/ProductSeries/ProductThemeModuleRightClickContent?moduleRelId=" + moduleRelId + "&levelId=" + levelId + "&r=" + Math.random(),
                title: '设置模块应用',
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
                        })
                        return false;
                    })
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
                    })

                },
                ok: function () {
                }
            });
            $('#YH-MM-J-menu').remove();
            return false;
        }).on('click', '#YH-MM-J-nodeDel', function () {
            if (confirm('删除该模块将会级联删除该模块的子模块,确定删除该模块？')) {
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
                            $.tmsg("m_jfw", "删除成功", { infotype: 1, time_out: 500 });
                            reloadDiv("tbl");
                        }
                    }
                });
            }
            $('#YH-MM-J-menu').remove();
            return false;
        }).on('click', '#YH-MM-J-nodeRemove', function () {
            if (!confirm('移除该模块将会级联移除该模块的子模块,确定移除该模块？')) {
                return false;
            }
            var url = "/home/RemoveThemeLevelModuleRelation";
            $.ajax({
                url: url,
                type: 'post',
                data: {
                    levelId: levelId,
                    moduleRelId: moduleRelId
                },
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    if (data.Success == false) {
                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                        reloadDiv("tbl");
                    }
                    else {
                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                        reloadDiv("tbl");
                    }
                }
            });
            $('#YH-MM-J-menu').remove();
            return false;
        }).on('click', '#YH-MM-J-nodeAddSibling', function () {
            var pid = $node.attr("pid");
            var isTemplate = 4;
            var url = ["/ProductSeries/ModuleCommonSelector?",
                                "themeId=" + themeId,
                                "&isTemplate=" + isTemplate,
                                "&r=" + Math.random()].join('');
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
                    })

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
                            }
                            else {
                                $.tmsg("m_jfw", "保存成功", { infotype: 1, time_out: 500 });
                                reloadDiv("tbl");
                            }
                        }
                    });
                }
            });
            $('#YH-MM-J-menu').remove();
            return false;
        }).on('click', '#YH-MM-J-nodeAdd', function () {
            var isTemplate = 4;
            var url = ["/ProductSeries/ModuleCommonSelector?",
                                "&themeId=" + themeId,
                                "&isTemplate=" + isTemplate,
                                "&levelId=" + levelId,
                                "&r=" + Math.random()].join('');
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
                    })

                    $.ajax({
                        url: "/Home/SaveThemeLevelModuleRelation",
                        type: 'post',
                        data: {
                            moduleIds: moduleIds,
                            themeId: themeId,
                            levelId: levelId,
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
                            }
                            else {
                                $.tmsg("m_jfw", "保存成功", { infotype: 1, time_out: 500 });
                                reloadDiv("tbl");
                            }
                        }
                    });
                }
            });
            $('#YH-MM-J-menu').remove();
            return false;
        }).on('click', '#YH-MM-J-nodeMove', function () {
            //移动价值项
            var $this = $node;
            var $p = $this.closest('.YH-MM-node');
            var $box = $('#p-j-treecontent');

            $p.fadeTo(600, 0.5);

            $box.addClass('YH-MM-J-dropable').find('.YH-MM-node').addClass('YH-MM-J-targetBlock');

            $p.removeClass('YH-MM-J-targetBlock').find('.YH-MM-node').removeClass('YH-MM-J-targetBlock');

            //        var fnMove=function(e){
            //            $('title').html(e.pageX);
            //            return false;
            //        }
            var fnOk = function () {
                $('.YH-MM-J-dropable').undelegate('.YH-MM-J-targetBlock .YH-MM-node-con,.YH-MM-box-mainNode', 'click').removeClass('YH-MM-J-dropable')
                $('.YH-MM-J-targetBlock').removeClass('YH-MM-J-targetBlock')

                $p.fadeTo(600, 1);
            }

            $('.YH-MM-J-dropable').delegate('.YH-MM-J-targetBlock .YH-MM-node-con,.YH-MM-box-mainNode', 'click', function () {
                var moveType = "";
                if ($(this).hasClass('YH-MM-box-mainNode ')) {
                    //根节点
                    moveType = "child";
                } else {
                    //                                    alert('移动' + $node.attr('id') + '到' + $(this).attr('id'))
                    moveType = "pre";
                }
                var moveId = $node.attr("id").replace("YH-MM-node_", "");
                var moveToId = $(this).attr("id").replace("YH-MM-node_", "")
                $.ajax({
                    url: "/Home/MovePostInfo",
                    type: 'post',
                    data: {
                        tbName: "ProductModuleRelation",
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
                        }
                        else {
                            $.tmsg("m_jfw", "移动成功", { infotype: 1, time_out: 500 });
                            reloadDiv("tbl");
                        }
                    }
                });

                fnOk();
                return false;
            });

            $('#YH-MM-J-menu').remove();
            return false;
        })
        return false;
    });
}

$('#p-j-treecontent').delegate('.mt-name', 'click', function () {
    var themeId = $("#themeId").val();
    var levelId = $("#curLevelId").val();
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
    var lurl = "/ProductSeries/ProductThemeLevelTreeClickContent?isEdit=" + isEdit + "&themeId=" + themeId + "&moduleRelId=" + modRelId + "&levelId=" + levelId;

    $('#p-j-mindMapNodeInfo').attr('class', cls).find('.mapNodeInfo')
            .load(lurl + "&r=" + Math.random())
            .attr("lurl",lurl)
            .end().show().css({ top: offsetTop, left: offsetLeft, "z-index": "105" });
    $("body").mask();
    $("body").children(".loadmask").css("z-index", "100");
    $("body").children(".loadmask").on("click", function () { $("body").unmask(); $('#p-j-mindMapNodeInfo').hide(); })

    setTimeout("$('#p-j-treecontent').one('click',function(){$('#p-j-mindMapNodeInfo').hide()})", 10)

    return false;
})




//新增模块实例弹窗开始....
//重用模块实例
function reUseResult(obj) {
    if (!confirm("确定引用该模块实例吗？")) return false;
    var $obj = $(obj);
    var isSynKernel = "1";
    var formdata = {};

    var url = '/home/ImportProductResult';
    var resultIds = $obj.attr("data-retId");
    var modRelId = $(obj).attr("data-modRelId");
    var combineId = $(obj).attr("data-comId");

    formdata.moduleRelId = modRelId;
    formdata.combinationId = combineId;
    formdata.lineResultIdList = resultIds;
    formdata.isSynKernel = isSynKernel;
    url = '/home/ImportProductResult';

    $.ajax({
        url: url,
        type: 'post',
        async: false,
        data: formdata,
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                alert(data.Message);
            }
            else {
                $.tmsg("m_jfw", '添加成功', { infotype: 1, time_out: 800, callback: function () {
                    // $boxObj.dialog('destroy');
                    //$("#YH-MM-node_<%=configItemId %>").click();
                    $("#p-j-module div[itemid=<%=moduleRelId %>]").click();
                }
                });
            }
        }
    });

}


function productModuleResultEdit(obj) {
    var resultId = $(obj).attr("resultid");
    var configItemId = $(obj).attr("configitemid");
    var title = "编辑" + $(obj).attr("resultname") + "指标";
    var isIssue = $(obj).attr("isIssue");
    $.YH.box({
        target: "/ProductSeries/ProductThemeResultIndicatorManage?resultId=" + resultId + "&itemId=" + configItemId + "&r=" + Math.random(),
        title: title,
        width: 700,
        height: 460,
        modal: true,
        buttons: {
            'button1': {
                click: function () {
                    postSaveIndicator($(this), resultId, 1);
                    $(this).dialog("close");
                    return false;
                },
                'class': "ui-button-primary",
                text: '保存'
            },
            //                'button2': {
            //                    click: function () {
            //                        postSaveIndicator($(this), resultId, 2);
            //                        $(this).dialog("destroy");
            //                        return false;
            //                    },
            //                    'class': "ui-button-primary",
            //                    text: '保存并提交审核'
            //                },
            'button3': {
                click: function () {
                    $(this).dialog("destroy");
                    return false;
                },
                text: '取消'
            }
        },
        create: function () {
            if (parseInt(isIssue) == 1 || parseInt(isIssue) == 2) {
                $("button.ui-button-primary").hide();
            }
        },
        ok: function () {
        }
    });
    return false;
}


function productModuleResultDele(obj) {
    var resultId = $(obj).attr("resultid");
    if (!confirm("是否删除当前模块实例？\n模块实例删除后将无法恢复")) return false;
    $.ajax({
        url: "/Home/SavePostInfo/",
        type: 'post',
        data: {
            tbName: "ProductModuleResult",
            queryStr: "db.ProductModuleResult.distinct('_id', { 'resultId': '" + resultId + "' })",
            isDel: "1"
        },
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                alert(data.Message);
            }
            else {
                $.tmsg("", "删除成功", { infotype: 1, time_out: 800 });
                $("#p-j-module div[itemid=<%=moduleRelId %>]").click();
            }
        }
    });
}


function postSaveIndicator(obj, resultId, typeId) {
    var $boxObj = $(obj);
    var indstatus = [];
    var formdata = {};
    var isIssue = 0;
    $.each($boxObj.find(".p-j-indstatus"), function (index, item) {
        var $tr = $(item);
        var indid = $tr.attr("data-indid");
        var status = $tr.attr("data-isUse");
        indstatus.push(indid + '|Y|' + status);
        $.each($tr.find("input,textarea"), function (index2, item2) {
            if ($(item2).attr("name")) {
                if ($(item2).is(":radio")) {
                    if ($(item2).is(":checked")) {
                        formdata[$(item2).attr("name")] = $(item2).val();
                    }
                } else {
                    formdata[$(item2).attr("name")] = $(item2).val();
                }
            }
        });
    });
    formdata.tbName = 'ProductModuleResult';
    formdata.queryStr = 'db.ProductModuleResult.distinct("_id",{"resultId":"' + resultId + '"})';
    formdata.indStatus = indstatus.join('|H|');
    formdata.isIgnoreRemarkLogs = 'true';
    formdata.isSaveIndStatus = 'true'; //设置保存指标状态
    if (parseInt(typeId) == 2) {
        isIssue = 1
    }
    formdata.isIssue = isIssue;
    formdata.name = $("#retName").val();
    //        var relMatIds = "";
    //        $boxObj.find("#p-j-materialList").find("a[mat=mat]").each(function () {
    //            relMatIds = relMatIds + "," + $(this).attr("matid");
    //        });
    //        formdata.relMatIds = relMatIds;

    formdata.isIgnoreMat = 'true';

    var $fileListFrom = $("#p-j-filelistform");
    $.each($fileListFrom.find("input"), function (index, item) {
        if ($(item).attr("name")) {
            formdata[$(item).attr("name")] = $(item).val();
        }
    });
    var this_uuid = $("#uploadUUID").val(); //在这里保存防止页面被关闭后获取不到
    $.ajax({
        url: '/Home/SaveModuleResult',
        type: 'post',
        data: formdata,
        dataType: 'json',
        error: function () {
            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                var FileInfo = data.FileInfo;
                var str = FileInfo.split("|");
                var result = eval("(" + str[0] + ")");
                var fileIdList = "";
                if (result.success) {
                    if (str.length > 1) {
                        if (str[1] != "") {
                            var files = eval("(" + str[1] + ")");
                            cwf.tasks.send(this_uuid, files, function () {
                                $.tmsg("m_jfw", "保存并上传成功", { infotype: 1, time_out: 700, callback: function () {
                                    $boxObj.dialog('destroy');
                                    $("#p-j-module div[itemid=<%=moduleRelId %>]").click();
                                }
                                });
                            });
                        }
                    }
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 700, callback: function () {
                        $boxObj.dialog('destroy');
                        $("#p-j-module div[itemid=<%=moduleRelId %>]").click();
                    }
                    });
                }
            }
        }
    });
}


function selectResultFromLibrary(obj) {
    var moduleRelId=$(obj).attr("data-modRelId");
    var levelId=$(obj).attr("data-levelId");
    var url = "/ProductSeries/ProductThemeLevelChooseResult?isEdit=1&moduleRelId=" + moduleRelId + "&levelId=" + levelId + "&r=" + new Date().getTime();
    $.YH.box({
        target: url,
        title: '选择模块实例',
        width: 500,
        modal: true,
        create: function () {
        },
        ok: function () {
            var results = $(this).find("input[data-result]:checked");
            var formdata = {};
            var url = '/home/BatchSaveThemeLevelRetRelation';
            if (results.length > 0) {
                var resultIds = [];
                $.each(results, function (i, n) { resultIds.push($(n).val()) });
                formdata={
                    levelId:levelId,
                    resultIdList: resultIds.join(',')
                };
                $.ajax({
                    url: url,
                    type: 'post',
                    async: false,
                    data: formdata,
                    dataType: 'json',
                    error: function () {
                        $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                    },
                    success: function (data) {
                        if (data.Success == false) {
                            alert(data.Message);
                        }
                        else {
                            $.tmsg("m_jfw", '添加成功', { infotype: 1, time_out: 800});
                            reloadClickContent();
                        }
                    }
                });
            }
        }
    });
}

//新增模块实例并保存于当前档次关联
function createNewResultAddLevRel(obj, callback) {
    var name = $(obj).attr("data-name");
    var moduleId = $(obj).attr("data-modId");
    var modRelId = $(obj).attr("data-modRelId");
    var themeId = $(obj).attr("data-themeId");
    var levelId = $(obj).attr("data-levelId");

    var formdata = {
        tbName: "ProductModuleResult",
        queryStr: '',
        isTemplate: 4,
        themeId: themeId,
        moduleRelId: modRelId,
        moduleId: moduleId,
        levelId:levelId,
        isIssue: 0,
        name: name,
        isSaveLevRetRel:1
    };
    $.ajax({
        url: "/Home/SaveProductModuleResult/",
        type: 'post',
        data: formdata,
        dataType: 'json',
        error: function (xhr, txt, ex) {
            alert('未知错误，请联系服务器管理员，或者刷新页面重试', '保存失败');
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg("m_jfw", data.Message, { infotype: 2 });
            }
            else {
                if (typeof callback === "function") {
                    callback(data.htInfo);
                }
                else {
                    $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 1000, callback: function () {
                        productModuleResultEdit(
                            {
                                resultid: data.htInfo.resultId,
                                resultname: data.htInfo.name,
                                configitemid: data.htInfo.moduleRelId
                            }
                            );
                    }
                    });
                }
            }
        }
    });
}
function changeRetLevelUse(obj, itemId, tbName, primaryKey) {
    itemId = itemId || $(obj).attr("keyvalue");
    tbName = tbName || $(obj).attr("tbname");
    primaryKey = primaryKey || $(obj).attr("keyname");
    var levelId = $(obj).attr("data-levId");
    var resultId = $(obj).attr("data-retId");
    var isUse = 0;
    if (!confirm("确定要取消使用该模块实例？")) {
        return false;
    }

    var queryStr = "db." + tbName + ".distinct('_id',{'" + primaryKey + "':'" + itemId + "'})";
    if (itemId == "" || itemId == '0') queryStr = "";
    $.ajax({
        url: "/Home/SavePostInfo",
        type: 'post',
        data: {
            tbName: tbName,
            queryStr: queryStr,
            isUse: isUse
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
                $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                reloadClickContent();
            }
        }
    });
}

function reloadClickContent() {
    var $div = $('#p-j-mindMapNodeInfo .mapNodeInfo');
    $div.load($div.attr("lurl") + "&r=" + new Date().getTime());
}
//新增模块实例弹窗结束....




$(document).ready(function () {
    //SetMenu(8, 33);
    changeModuleModule();
});
