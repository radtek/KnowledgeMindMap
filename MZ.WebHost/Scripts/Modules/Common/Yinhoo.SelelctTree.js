﻿/*
* Yinhoo.SelectTree.2.0
*
* Copyright (c) 2010 da.lei<da.lei@yinhootech.com>
*
* Dual licensed under the MIT and GPL licenses (same as jQuery):
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* CreateDate: 2010-10-25
* Ver 1.0
*
* target:
* 1、	Tree样式调整，风格变更为可配置
* 2、	数据载入多元化，可页面Push加载、异步一次加载&多次加载（同时放开5级限制）
* 3、	移动功能优化、增加批量移动操作
* 4、	增删改的免刷新接口
* 5、	树体的重新布局事件（拖拽改变树的大小）
* 6、	初次加载选中参数、点击CallBack事件、鼠标移动高亮事件优化，可定制
* 7、	旧JsTree原数据导入、兼容方案
* 8、	各式接口的回调函数
*/

/*
* 目录树优化后每个节点数据缓存被删除，所以对应的data方法无效需要把项目页面的代码进行修改替换$(this).parent().data("node")-》$(this).parent()
* */
(function ($) {

    $.fn.RemoveSelectTree = function () {
        $(this).html("");
        $(this).data("options", null);
        return true;
    }


    $.fn.ReloadSelectTree = function (options) {
        var clear = false;
        if (options.startXml != $(this).data("options").startXml) { clear = true; }
        options = $.extend($(this).data("options"), options);
        if (clear == true) {
            options.nowselected = null;
        }
        $(this).RemoveSelectTree();
        $(this).SelectTree(options);
        return true;
    }

    $.fn.selectTreeItem = function (id) {
        if (id) {
            $(this).find("div[id=div" + id + "]").find(".name:first").click();
        } else {
            $(this).find("div[lv=1]:first").find(".name:first").click();
        }
        return true;
    }

    $.fn.removeSelection = function () {
        $(this).data("options").selectedhighlight.hide();
        $(this).data("options").nowselected = null;
    }

    //全部折叠 可以指定层级
    $.fn.CollapseSelectTree = function (lv) {
        if (!lv) { lv = 1; }

        options = $(this).data("options");
        options.selectedhighlight.hide();

        var _Tree = $(this);
        _Tree.find("div[lv=" + lv + "]").each(function () {
            var obj = $(this);
            //if (obj.data("node").attr("isfolder") != 1) {//新版目录树没有.data("node")
            if (obj.attr("isfolder") != 1) {

                var h = obj.find("div:first").height();
                var img = obj.find("img:first");
                var ico = img.next();
                var cbk = null;
                if (ico.attr("type") == "checkbox") {
                    cbk = ico;
                    ico = ico.next();
                }
                img.attr("src", options.picurl + "ico-Collapsehover.gif");
                ico.attr("src", options.picurl + "ico-folder.gif");
                obj.find("div[lv=" + (parseInt(obj.attr("lv")) + 1) + "]").hide();
                obj.css("height", "auto");

                if (options.nowselected != null) {
                    if (options.nowselected.offset().top < options.outHtmlsInit.offset().top || options.nowselected.offset().top + options.nowselected.height() > options.outHtmlsInit.offset().top + options.outHtmlsInit.height()) {
                        options.selectedhighlight.hide();
                    } else {
                        options.selectedhighlight.css("top", options.nowselected.offset().top - _Tree.find(".tree:first").offset().top + _Tree.find(".tree:first").position().top).show(); //.css("width", options.outHtmlsInit.width() + _Tree.configurePYWidth())
                    }
                }
                if (options.highlight != null) options.highlight.hide();
            }
        });
        return true;
    }

    $.fn.ExpandSelectTree = function () {
        options = $(this).data("options");
        options.selectedhighlight.hide();
        var _Tree = $(this);
        _Tree.find("div[top=top]").each(function () {
            var obj = $(this);

            //if (obj.data("node").attr("isfolder") != 1) {
            if (obj.attr("isfolder") != 1) {

                var img = obj.find("img:first");
                var ico = img.next();
                var cbk = null;
                if (ico.attr("type") == "checkbox") {
                    cbk = ico;
                    ico = ico.next();
                }
                img.attr("src", options.picurl + "ico-Expandhover.gif");
                ico.attr("src", options.picurl + "ico-folderoper.gif");

                obj.css("overflow", "auto");
                obj.find("div[lv=" + (parseInt(obj.attr("lv")) + 1) + "]").show();

                if (options.nowselected != null) {
                    if (options.nowselected.offset().top < options.outHtmlsInit.offset().top || options.nowselected.offset().top + options.nowselected.height() > options.outHtmlsInit.offset().top + options.outHtmlsInit.height()) {
                        options.selectedhighlight.hide();
                    } else {
                        options.selectedhighlight.css("top", options.nowselected.offset().top - _Tree.find(".tree:first").offset().top + _Tree.find(".tree:first").position().top).show(); //.css("width", options.outHtmlsInit.width() + _Tree.configurePYWidth()).show();
                    }
                }
                if (options.highlight != null) options.highlight.hide();
            }
        });
        return true;
    }

    $.fn.SelectTree = function (options) {

        //初始化必须值
        options = $.extend({
            startXml: "",                    //初始化加载用地址
            asynUrl: "",                     //二次加载用地址
            target: this,                    //实现目标（可以不是本身）
            cache: false,                    //数据源地址是否需要缓存（时间戳）
            dataXml: null,                   //Xml数据
            defaultShowItemLv: 1,            //初始展示到第几级
            treeContent: $("<div class='treecontent'></div>"),
            highlight: $("<div type=mh class='selected' style='width: 100%; margin-left: -10px'><div class='treeleft'></div><div class='treeright'></div></div>"),
            selectedhighlight: $("<div type=sh class='selected' style='width: 100%; margin-left: -10px'><div class='treeleft'></div><div class='treeright'></div></div>"),
            outLine: null,
            needoutLine: true,
            outHtmlsInit: $("<div class='tree' style='position:relative;'></div>"),       //Tree初始容器
            outHtmls: $("<div style='position:relative; overflow: hidden' class='p-j-treeParent'></div>"),       //Tree初始容器
            ImgShowHide: 0,                   //状态参数
            ImgShowHideAction: 0,                   //状态参数
            picurl: '../../Content/images/tree/',
            defaultMsg: '数据读取错误',
            nowmouseover: null,
            nowselected: null,
            hasCheckBox: false,
            enableSelectChildren: true, //仅当hasCheckBox时有效，设置目录树中checkbox选中父节点时是否同时选中子节点
            ReferenceDiv: null,
            behandHtml: "",
            loadIco: '<div style="padding-left:6px;clear:both;"><img src="/Content/images/icon/loading.gif" />&nbsp;加载中...</div>',
            _beforePrint: function () { return; },                           //数据加载后，构成结构前
            _afterPrint: function (obj, type) { return; },                            //构成结构后，输出前
            _afterPrintOnce: function (obj) { return; },
            _onCheckBoxClick: function (obj, node) { return; },
            _onClick: function (id, name, obj, node) { return; },                //点击事件
            _onRightClick: function (id, name, obj, node) { return; },           //点击事件
            _onMouseOver: function (id, name, obj, node) { return; },        //Mouseover
            _onMouseOut: function (id, name, obj, node) { return; }          //Mouseout
        }, options);

        //指定全局this指代对象，避免进入Jquery循环错误判断
        var _Tree = this;
        //回写options 用于重载整棵树
        $(this).data("options", options);

        //装载XML并打开加载循环
        this.setUpTree = function () {
            var root = $(options.dataXml).find("root");
            if (root == null) {
                _Tree.onError("XML信息为空");
                return false;
            }
            this.putOutTreeXml(root, 1);
        }

        //读取XML并进行初始化处理
        this.loadXMLData = function () {

            var mask = $('<div style="margin-top:25%; text-align:center; height:86px"><table height="95"><tr><td width="25"><img src="/Content/images/icon/loading.gif"/></td><td style="font-size:14px; font-weight:bold;">正在加载...</td></tr></table></div>');

            $(_Tree).append(mask);
            //地址初始化处理
            var url = this.urlDelcache(options.startXml);
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'xml',
                timeout: 20000,
                error: function (xml) {
                    _Tree.onError(options.defaultMsg);
                },
                success: function (xml) {
                    $.extend(options, { dataXml: xml });
                    mask.remove();
                    _Tree.setUpTree();
                }
            });



            return true;
        }

        this.reloadXMLData = function (obj) {
            if (options.asynUrl == "" || options.asynUrl == null) return false;
            var id = obj.attr("id").replace('div', '');
            var lv = parseInt(obj.attr("lv")) + 1;
            var _parent = obj.attr("objid");
            var tempIco = $(options.loadIco);
            obj.append(tempIco);
            $.ajax({
                url: options.asynUrl,
                data: "id=" + id + "&lv=" + lv + "&time=" + Math.random(),
                type: 'GET',
                dataType: 'xml',
                timeout: 20000,
                error: function (xml) {
                    _Tree.onError("加载子节点数据读取错误");
                },
                success: function (xml) {
                    tempIco.remove();
                    $.extend(options, { dataXml: xml });
                    var root = $(options.dataXml).find("root");
                    root.attr("id", id);
                    _Tree.putOutTreeXml(root, lv++, obj, _parent, obj);
                }
            });
        }
        //用于循环读取节点内容，传入初始lv值为1，之后再每次循环中叠加
        this.putOutTreeXml = function (node, lv, parent, _parent, show) {

            var This = this;
            var treeHtml = '<div>';
            var obj;

            putOutTreeXmlCopy(node, lv);
            function putOutTreeXmlCopy(node, lv) {


                //if (!_parent) _parent = "0-0-0";
                //if (!parent) parent = null;
                var Items = This.getChildNode(node);

                if (Items != null) {
                    //输出前CallBack
                    if (lv == 1) options._beforePrint();
                    $(Items).each(function () {
                        //这里输出内容
                        if (typeof $(this).attr("name") != "undefined") {

                            treeHtml += _Tree.makeHtmlProc1($(this), lv);



                            //循环读取子节点
                            //_Tree.putOutTreeXmlCopy($(this), lv + 1, obj, obj.attr("objid"));
                            //alert(obj)
                            putOutTreeXmlCopy($(this), lv + 1);
                            //每次输出后绑定CallBack
                            options._afterPrintOnce($(options.target));



                        }

                    });
                    if (lv == 1) {
                        //输出内容
                        options.outHtmlsInit.append(options.outHtmls);
                        options.treeContent.append(options.outHtmlsInit);
                        options.selectedhighlight.hide();
                        options.treeContent.children(":eq(0)").prepend(options.selectedhighlight);
                        options.highlight.hide();
                        options.treeContent.children(":eq(0)").prepend(options.highlight);
                        options.target.append(options.treeContent);
                        This.createResizeAble();
                        //配置目标图标的显示效果
                        This.configureIco();

                        //回写options 用于重载整棵树
                        $(This).data("options", options);

                        if (_Tree.find(".tree").find("div").length == 1) {

                            _Tree.html('<div style="color:#a5a5a5; text-align:center; font-size:16px; font-weight:bold;padding-top:30px;">暂无数据</div>');
                        }

                    }
                }
                treeHtml += "</div>";


            }
            if (parent != null) {
                parent.append(treeHtml);
            } else {
                options.outHtmls.append(treeHtml);
            }


            if (show) {
                show.find("div[lv=" + (parseInt(show.attr("lv")) + 1) + "]").show();
                var h = show.height();
                options.selectedhighlight.hide();
                show.css("height", "24px").css("overflow", "hidden").animate({ "height": h }, 500, function () {
                    show.css("overflow", "visible").css("height", "auto");

                });

            }

            //输出后CallBack
            options._afterPrint($(options.target));

        }




        this.createResizeAble = function () {
            var CustX = null;
            var h = _Tree.height();
            if (h == 0) { h = options.outHtmlsInit.height(); }
            options.outHtmlsInit
                        .css("width", _Tree.width() - 20)
                        .css("height", h)
                        .css("overflow-x", "hidden")
                        .css("overflow-y", "auto");
        }


        //初始化节点目标图标的显示效果
        this.configureIco = function () {

            /*临时注释ie7下有bug
            $(options.outHtmls).mouseover(function () {
            if (top.window.event) {
            if (top.window.event.y < $(this).offset().top + $(this).height() - 10
            && top.window.event.y > $(this).offset().top
            && top.window.event.x > $(this).offset().left
            && top.window.event.x < $(this).offset().left + $(this).width()) {
            options.ImgShowHideAction = 1;

            if (options.ImgShowHide == 0 || options.ImgShowHide == 100) {
            _Tree.imgShowHide();
            }
            }
            }
            }).mouseout(function () {
            if (top.window.event) {
            if (top.window.event.y > $(this).offset().top + $(this).height() - 10
            || top.window.event.y < $(this).offset().top
            || top.window.event.x < $(this).offset().left
            || top.window.event.x > $(this).offset().left + $(this).width()) {
            options.ImgShowHideAction = -1;
            options.highlight.hide();
            if (options.ImgShowHide == 0 || options.ImgShowHide == 100) {
            //_Tree.imgShowHide();
            }
            }
            }
            });*/
            //$(options.outHtmls).find("img[co=true]").css("filter", "alpha(opacity=" + options.ImgShowHide + ")");

        }

        //图标效果附加事件
        this.imgShowHide = function () {
            if (options.ImgShowHideAction == 0
            || (options.ImgShowHideAction == 1 && options.ImgShowHide == 100)
            || (options.ImgShowHideAction == -1 && options.ImgShowHide == 0)) return false;

            if (options.ImgShowHide < 0) { options.ImgShowHide = 0; return false; }
            else if (options.ImgShowHide > 100) { options.ImgShowHide = 100; return false; }

            if (options.ImgShowHideAction == 1) {
                options.ImgShowHide = parseInt(options.ImgShowHide, 10) + 10;
            } else {
                options.ImgShowHide = parseInt(options.ImgShowHide, 10) - 2;
            }
            $(options.outHtmls).find("img[co=true]").css("filter", "alpha(opacity=" + options.ImgShowHide + ")");
            setTimeout(function () { _Tree.imgShowHide() }, 1);
        }


        //输出节点内容
        this.makeHtmlProc1 = function (node, lv, parent, _parent) {
            node = $(node);
            var obj, name = node.attr("name");
            var objid = lv + "-" + node.attr("id") + "-" + Math.round(new Date().getTime() / 1000);
            var imgtype = "<img class='treeIconType' src=" + options.picurl + "ico-folder.gif>";
            var imgtypeopen = "<img class='treeIconType' src=" + options.picurl + "ico-folderoper.gif>";
            var fileStyle;
            if ($(node).attr("isfolder") == 1) {
                imgtype = "<img class='treeIconType' src=" + options.picurl + "ico-file.gif>";
                imgtypeopen = "<img class='treeIconType' src=" + options.picurl + "ico-file.gif>";
                fileStyle = "visibility: hidden;";
            }

            var StyleClass = "level0";
            if (lv != 1) { StyleClass = "levelx"; }
            var ckb = "";
            if (options.hasCheckBox) { ckb = "<input value='" + node.attr("id") + "' needChecked=needChecked type=checkbox style='float:left; margin-top:2px;'>"; }

            if (node.attr("param") && node.attr("param").indexOf("[") != -1 && node.attr("param").indexOf("]") != -1) {
                //折叠后显示总和 By 小E
                if (lv < options.defaultShowItemLv) {
                    //层级高于额定初始展示层级，输出显示状态，节点处于展开状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + " isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " id=div" + node.attr("id") + " lv=" + lv + "><img  class='treeIconArrow' co=true type=Expand src='" + options.picurl + "ico-Expand.gif' style='" + fileStyle + "'>" + ckb + imgtypeopen + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name' expand_name='" + node.attr("name") + "' collapse_name='" + node.attr("param") + "' state='expand'><span>" + node.attr("name") + "</span></div>";
                } else if (lv == options.defaultShowItemLv) {
                    //层级等于额定初始展示层级，输出显示状态，节点处于闭合状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + "  isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " id=div" + node.attr("id") + " lv=" + lv + "><img class='treeIconArrow' co=true type=Collapse src='" + options.picurl + "ico-Collapse.gif' style='" + fileStyle + "'>" + ckb + imgtype + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name' expand_name='" + node.attr("name") + "' collapse_name='" + node.attr("param") + "' state='collapse'><span>" + node.attr("param") + "</span></div>";
                } else {
                    //层级低于额定初始展示层级，输出隐藏状态，节点处于闭合状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + "  isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " style='display:none;' id=div" + node.attr("id") + " lv=" + lv + "><img class='treeIconArrow' co=true type=Collapse src='" + options.picurl + "ico-Collapse.gif' style='" + fileStyle + "'>" + ckb + imgtype + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name' expand_name='" + node.attr("name") + "' collapse_name='" + node.attr("param") + "' state='collapse'><span>" + node.attr("param") + "</span></div>";
                }
            } else {
                //lv=lv-1;
                if (lv < options.defaultShowItemLv) {
                    //层级高于额定初始展示层级，输出显示状态，节点处于展开状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + " isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " id=div" + node.attr("id") + " lv=" + lv + "><img class='treeIconArrow' co=true type=Expand src='" + options.picurl + "ico-Expand.gif' style='" + fileStyle + "'>" + ckb + imgtypeopen + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name'><span>" + node.attr("name") + "</span></div>";
                } else if (lv == options.defaultShowItemLv) {
                    //层级等于额定初始展示层级，输出显示状态，节点处于闭合状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + "  isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " id=div" + node.attr("id") + " lv=" + lv + "><img class='treeIconArrow' co=true type=Collapse src='" + options.picurl + "ico-Collapse.gif' style='" + fileStyle + "'>" + ckb + imgtype + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name'><span>" + node.attr("name") + "</span></div>";
                } else {
                    //alert(lv+":"+options.defaultShowItemLv)
                    //层级低于额定初始展示层级，输出隐藏状态，节点处于闭合状态
                    obj = "<div objid=" + objid + " param=" + node.attr("param") + " childcount=" + node.attr("childcount") + " leafcount=" + node.attr("leafcount") + "  name=" + node.attr("name") + "  isfolder=" + node.attr("isfolder") + " top=top class=" + StyleClass + " style='display:none;' id=div" + node.attr("id") + " lv=" + lv + "><img class='treeIconArrow' co=true type=Collapse src='" + options.picurl + "ico-Collapse.gif' style='" + fileStyle + "'>" + ckb + imgtype + "<div style='float:right'>" + options.behandHtml + "</div>" + "<div class='name'><span>" + node.attr("name") + "</span></div>";
                }
            }
            return obj;
        }






        options.outHtmlsInit.delegate('div[lv]', 'mousedown', function (e) {

            options.nowselected = $(this).parent();
            options.selectedhighlight.attr("class", "selectedmouseover");


            var evt = e;
            $(this).mouseup(function () {
                $(this).unbind('mouseup');
                if (evt.button == 0) {
                    //鼠标右键
                    options._onRightClick.call(this, $(this).attr('id').replace('div', ''), $(this).attr("name"), $(this), $(this));
                    return;
                }
            });

            $(this)[0].oncontextmenu = function () {
                return false;
            }

        }).delegate('div[lv]', 'click', function (e) {
            var obj = $(this);
            $(".p-j-treeParent").find("div[select=true]").removeAttr("select");
            obj.attr("select", "true");
            var name = $(this).children('.name:first');
            if (name.attr("expand_name")) {
                var name_split_left = name.attr("expand_name").split("["),
				name_split_right = name_split_left[1].split("]"),
				name_split = name_split_right[0];
                if (name.attr("state") == "collapse" && name_split <= 0) {
                    _Tree.ExpandObj(obj);
                    return false;
                }
            }
            options.selectedhighlight.css("top", obj.position().top).show().attr("class", "selectedmouseover");
            options.nowselected = obj;
            options.highlight.hide();
            //alert(options._onClick);
            options._onClick.call(this, obj.attr('id').replace('div', ''), obj.attr("name"), obj, obj);
            e.stopPropagation();
            //return false;
        }).delegate('.name', 'mouseover', function (e) {

            var obj = $(this).parent();


            options.highlight.css("top", obj.position().top).show();

            //behandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtmlbehandHtml
            _Tree.find("img[name=behandHtml]").hide();
            _Tree.find("img[name=behandHtml2]").hide();
            if (options.behandHtml != "") {
                obj.find("img[name=behandHtml]:first").show(); obj.find("img[name=behandHtml2]:first").show();
                obj.find("img[name=behandHtml]").attr("divid", obj.attr("id").replace("div", ""));
                obj.find("img[name=behandHtml2]").attr("divid", obj.attr("id").replace("div", ""));

            }

            options.nowmouseover = obj;
            //console.log($(this).position().left+":"+$(this).width()+":"+$(this).closest('.tree').width());
            if (options.needoutLine == true && $(this).children().height() > 30) {

                $("div[selectTreeTip=tip]").remove();
                var zIndex = 1;
                (function (o) {
                    if (o.offsetParent) {
                        var cIndex = $(o.offsetParent).css('zIndex');
                        if ($(o.offsetParent).css('zIndex') != 'auto') {
                            zIndex = cIndex * 1 + 100;
                        }
                        arguments.callee(o.offsetParent)
                    }
                })(this)
                options.outLine = $("<div selectTreeTip=tip style='position:absolute;padding:2px 6px;cursor:hand;border:1px solid #000000;background-color:#fffff7; z-index:" + zIndex + ";'>" + obj.children("div.name").text() + "</div>");

                if (options.behandHtml != "") {
                    options.outLine.append("&nbsp;");
                    if (obj.find("img[name=behandHtml]:first"));
                    {
                        var temp = obj.find("img[name=behandHtml]:first").clone();
                        options.outLine.append(temp);
                    }
                    if (obj.find("img[name=behandHtml2]:first"));
                    {
                        var temp = obj.find("img[name=behandHtml2]:first").clone();
                        options.outLine.append(temp);
                    }

                    options.outLine.append("&nbsp;")
                    .find("img[name=behandHtml]:first").show()
                    .find("img[name=behandHtml2]:first").show();
                }
                $(top.document.body).append(options.outLine);
                options.outLine
						.css({ "left": obj.find("div.name").offset().left, "top": obj.find("div.name").offset().top })
                     	.click(function () {

                     	    obj.trigger('click');

                     	}).mouseleave(function () { options.outLine.hide(); });

            } else {
                if (options.outLine != null) options.outLine.hide();
            }
            if (options.nowmouseover != options.nowselected && options.nowselected != null) {
                $(options.selectedhighlight).attr("class", "selected");
            }

            if (options.nowmouseover != options.nowselected) {
                $(options.highlight).attr("class", "unselectactive");
            } else {
                options.highlight.hide();
                $(options.selectedhighlight).attr("class", "selectedmouseover");
            }
            return false;
        }).delegate('img[co=true]', 'mouseover', function () {

            if ($(this).attr("src").indexOf("ico-Expand") != -1) {
                $(this).attr("src", options.picurl + "ico-Expandhover.gif");
            } else {
                $(this).attr("src", options.picurl + "ico-Collapsehover.gif");
            }

            options.highlight
		   .css("top", $(this).parent().position().top)
		   .show();

        }).delegate('img[co=true]', 'mouseout', function () {

            if ($(this).attr("src").indexOf("ico-Expand") != -1) {
                $(this).attr("src", options.picurl + "ico-Expand.gif");
            } else {
                $(this).attr("src", options.picurl + "ico-Collapse.gif");
            }

        }).delegate('img[co=true]', 'click', function () {

            if ($(this).attr("src").indexOf("ico-Expand") != -1) {
                _Tree.CollapseObj($(this).parent());
            } else {
                _Tree.ExpandObj($(this).parent());
            }
            return false;
        }).delegate('input:checkbox', 'change', function () {
            var $curCheck = $(this), $curNode = $curCheck.closest('[lv]'),
                curLev = $curNode.attr('lv');
            var rootNode = $curNode.closest('div[lv=1]'); //根节点

            if (options.enableSelectChildren) {// 父级选中 子级也选中
                $curCheck.closest('.levelx').find('input[type=checkbox]').prop('checked', $curCheck.prop('checked'));
            }

            if (curLev == 1) { //根节点
                $curNode.find('input[type=checkbox]').attr('checked', $curCheck.prop('checked'));
            } else {
                for (var i = curLev - 1; i > 0; i--) {
                    var parents = $curNode.closest('div[lv=' + i + ']');
                    var childs = parents.find('input[type=checkbox]');
                    var checkCon = 0;
                    var dir = parents.children('input[type=checkbox]').attr('value');
                    childs.each(function () {
                        if ($(this).attr('checked') && $(this).attr('value') != dir) {
                            checkCon += 1;
                        }
                    });
                    parents.children('input[type=checkbox]').prop('checked', (checkCon == childs.length - 1 ? true : false));
                }
            }
        });

        this.CollapseObj = function (obj) {
            options.selectedhighlight.hide();
            var h = obj.find("div:first").height();
            var img = obj.find("img:first");
            var ico = img.next();
            var cbk = null;
            var name = obj.find("div.name:first");
            if (ico.attr("type") == "checkbox") {
                cbk = ico;
                ico = ico.next();
            }
            img.attr("src", options.picurl + "ico-Collapsehover.gif");
            ico.attr("src", options.picurl + "ico-folder.gif");
            obj.find("div[lv=" + (parseInt(obj.attr("lv")) + 1) + "]").fadeOut(500);
            obj.animate({ "height": h }, 500, function () {
                obj.css("overflow", "visible").css("height", "auto")
                //_Tree.moveSelection();
                if (name.attr("collapse_name")) {
                    name.html(name.attr("collapse_name"));
                }
            });
            name.attr("state", "collapse");
        }

        this.ExpandObj = function (obj) {
            //if (obj.data("node").attr("isfolder") == 1) { return false; } //新版目录树没有.data("node")
            if (obj.attr("isfolder") == 1) { return false; }
            options.selectedhighlight.hide();
            var img = obj.find("img:first");
            var ico = img.next();
            var cbk = null;
            var name = obj.find("div.name:first");
            if (ico.attr("type") == "checkbox") {
                cbk = ico;
                ico = ico.next();
            }
            img.attr("src", options.picurl + "ico-Expandhover.gif");
            ico.attr("src", options.picurl + "ico-folderoper.gif");
            if (obj.find("div[lv=" + (parseInt(obj.attr("lv")) + 1) + "]").length == 0) {
                _Tree.reloadXMLData(obj);
            } else {
                obj.css("overflow", "auto");
                obj.find("div[lv=" + (parseInt(obj.attr("lv")) + 1) + "]").show();
                var h = obj.find("div[lv]:visible").length * 24;
                obj.css("height", "24px").css("overflow", "hidden").animate({ "height": h }, 500, function () {
                    obj.css("overflow", "visible").css("height", "auto")
                    //_Tree.moveSelection();
                    if (name.attr("expand_name")) {
                        name.html(name.attr("expand_name"));
                    }
                });
                name.attr("state", "expand");
            }

        }


        //构建层级偏移
        this.makeLeverPadding = function (lv) {
            //return (lv - 1) * 6;
            return 6;
        }

        //获取下一级子节点并返回
        this.getChildNode = function (node) {
            if (node[0].childNodes) {
                return node[0].childNodes;
            } else {
                return null;
            }
        }

        //URL时间戳编码
        this.urlDelcache = function (url) {
            //如果cache被设置为True则不需要进行地址加时间戳操作
            if (options.cache == false) {
                if (url.indexOf("?") >= 0) {
                    url = url + "&r=" + Math.random();
                } else {
                    url = url + "?r=" + Math.random();
                }
            }
            return url;
        }

        //错误&Debug处理中心
        this.onError = function (msg) {
            this.reportError(msg);
        }

        //错误回写
        this.reportError = function (msg) {
            alert(msg);
        }

        this.init = function () {
            this.loadXMLData();
            //setInterval(function () { _Tree.moveSelection(); }, 500);
        }

        this.init();
    }
})(jQuery);