/**
 * 框选插件
 * Created by sr5220 on 2015/10/10.
 */
;
(function ($) {
    $.extend($.YH, {
        selectrect: function (options) {
            var opts = $.extend({}, $.YH.selectrect.defaults, options);

            $(document).off("mousedown.rect").on("mousedown.rect", opts.rectScope, function (evt) {
                evt.preventDefault();
                var isSel = false;  // 本次操作是否有选择
                var $that = $(this);
                if (evt.which == 1 || opts.rightClkMode == 2) {      // 点击左键时
                    var $nodes = $(opts.node);
                    $("#p-j-selRectDiv").remove();
                    if ($(evt.target).is(opts.node)) {
                        if (opts.selectMode == 2 || (opts.selectMode == 1 && !evt.ctrlKey)) {
                            $nodes.each(function () {
                                if (this != evt.target) {
                                    $(this).removeClass(opts.checkedCss);
                                }
                            });
                        }
                        $(evt.target).toggleClass(opts.checkedCss);
                        if (opts.selectMode == 3 || (evt.ctrlKey && opts.selectMode == 1)) {
                            $(evt.target).attr("isSel", "1");
                        }
                    }

                    var startX = (evt.x || evt.pageX);
                    var startY = (evt.y || evt.pageY);
                    var $selDiv = $("<div id='p-j-selRectDiv'></div>");
                    $selDiv.css({
                        "position": "absolute",
                        "width": "0px",
                        "height": "0px",
                        "font-size": "0px",
                        "margin": "0px",
                        "padding": "0px",
                        "border": "1px dashed #0099FF",
                        "background-color": "#C3D5ED",
                        "z-index": "1000",
                        "filter": "alpha(opacity:60)",
                        "opacity": "0.6",
                        "display": "none",
                        "left": startX + "px",
                        "right": startY + "px"
                    });
                    $that.append($selDiv);

                    var _x = null;
                    var _y = null;

                    $that.off("mousemove.rect").on("mousemove.rect", function (e) {
                        e.preventDefault();
                        isSel = true;
                        $selDiv.show();
                        _x = (e.x || e.pageX);
                        _y = (e.y || e.pageY);
                        $selDiv.css({
                            "left": Math.min(_x, startX) + "px",
                            "top": Math.min(_y, startY) + "px",
                            "width": Math.abs(_x - startX) + "px",
                            "height": Math.abs(_y - startY) + "px"
                        });
                        var _l = $selDiv.offset().left, _t = $selDiv.offset().top;
                        var _w = $selDiv[0].offsetWidth, _h = $selDiv[0].offsetHeight;
                        $nodes.each(function () {
                            var sl = this.offsetWidth + $(this).offset().left;
                            var st = this.offsetHeight + $(this).offset().top;
                            switch (opts.selectMode) {
                                case 1:     // 同 2，按Ctrl时，同3
                                    var isSel = $(this).attr("isSel") == "1";
                                    if (sl > _l && st > _t && $(this).offset().left < _l + _w && $(this).offset().top < _t + _h) {
                                        if (e.ctrlKey) {
                                            if (!isSel) {
                                                $(this).toggleClass(opts.checkedCss);
                                                $(this).attr("isSel", "1");
                                            }
                                        } else {
                                            $(this).addClass(opts.checkedCss);
                                        }
                                    } else {
                                        if (e.ctrlKey) {
                                            if (isSel) {
                                                $(this).removeAttr("isSel");
                                                $(this).toggleClass(opts.checkedCss);
                                            }
                                        } else {
                                            $(this).removeClass(opts.checkedCss);
                                        }
                                    }
                                    break;
                                case 2:     // 重新选
                                    if (sl > _l && st > _t && $(this).offset().left < _l + _w && $(this).offset().top < _t + _h) {
                                        $(this).addClass(opts.checkedCss);
                                    } else {
                                        $(this).removeClass(opts.checkedCss);
                                    }
                                    break;
                                case 3:     // 反选
                                    var isSel = $(this).attr("isSel") == "1";
                                    if (sl > _l && st > _t && $(this).offset().left < _l + _w && $(this).offset().top < _t + _h) {
                                        if (!isSel) {
                                            $(this).toggleClass(opts.checkedCss);
                                            $(this).attr("isSel", "1");
                                        }
                                    } else {
                                        if (isSel) {
                                            $(this).removeAttr("isSel");
                                            $(this).toggleClass(opts.checkedCss);
                                        }
                                    }
                                    break;
                                case 4:     // 增选
                                    if (sl > _l && st > _t && $(this).offset().left < _l + _w && $(this).offset().top < _t + _h) {
                                        $(this).addClass(opts.checkedCss);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        });
                    });

                    $that.off("mouseup.rect").on("mouseup.rect", function (e) {
                        e.preventDefault();
                        if (!isSel && e.which == 1 && !e.ctrlKey) {     // 在旁边点一下，则取消所有选择 按下Ctrl键，不取消选择
                            if ($(e.target).closest(opts.node).length == 0) {
                                $nodes.removeClass(opts.checkedCss);
                            }
                        }
                        $that.off("mousemove.rect");
                        if (opts.selectMode == 3 || opts.selectMode == 1) {
                            $nodes.removeAttr("isSel");
                        }
                        $selDiv.remove();
                    });
                } else if (evt.which == 3) {      // 点击右键时
                    var curSelNum = $([opts.node, ".", opts.checkedCss].join("")).length;    // 当前选中个数

                    function showMenu(event, selector) {
                        var $menu = $(selector).css({
                            "position": "fixed",
                            "top": event.clientY,
                            "left": event.clientX,
                            "z-index": "1001",
                            "display": "block"
                        });
                        $(document).off("mousedown."+selector).on("mousedown."+selector, function (e) {
                            if($(e.target).closest(selector).length==0){
                                $menu.hide();
                                $(document).off("mousedown."+selector);
                            }else if($(e.target).closest(opts.menuTag).length>0){
                                $(document).off("mouseon."+selector).on("mouseover."+selector, function (e) {
                                    $menu.hide();
                                    $(document).off("mouseover."+selector);
                                });
                            }
                        });
                    }

                    switch (opts.rightClkMode) {
                        case 1:
                            $that.off("contextmenu").on("contextmenu", function (event) {
                                if (typeof(eval(opts.rightClkFunc)) == "function") {
                                    opts.rightClkFunc(event, $([opts.node, ".", opts.checkedCss].join("")));
                                }
                                return false;
                            });
                            break;
                        case 3:
                            $that.off("contextmenu").on("contextmenu", function (event) {
                                event.preventDefault();
                                if (curSelNum == 0) {
                                    if($(event.target).closest(opts.node).length==0) {
                                        alert("请选择后再右键");
                                    }else{
                                        $(event.target).closest(opts.node).addClass(opts.checkedCss);
                                        showMenu(event,opts.singleMenu);
                                    }
                                } else {
                                    showMenu(event, opts.menu);
                                }
                                if (typeof(eval(opts.rightClkFunc)) == "function") {
                                    opts.rightClkFunc(event, $([opts.node, ".", opts.checkedCss].join("")));
                                }
                                return;
                            });
                            break;
                        case 4:
                            $that.off("contextmenu").on("contextmenu", function (event) {
                                event.preventDefault();
                                if (curSelNum == 0) {
                                    if ($(event.target).closest(opts.node).length == 0) {
                                        alert("请选择后再右键");
                                    } else {
                                        $(event.target).closest(opts.node).addClass(opts.checkedCss);
                                        showMenu(event, opts.singleMenu);
                                    }
                                } else if (curSelNum == 1) {
                                    showMenu(event, opts.singleMenu);
                                } else {
                                    showMenu(event, opts.menu);
                                }
                                if (typeof(eval(opts.rightClkFunc)) == "function") {
                                    opts.rightClkFunc(event, $([opts.node, ".", opts.checkedCss].join("")));
                                }
                                return;
                            });
                            break;
                        default :
                            break;
                    }
                }
            });
        }
    });
    $.extend($.YH.selectrect, {
        defaults: {
            rectScope: ".p-j-selectScope",
            node: ".p-j-selectNode",
            checkedCss: "select",
            selectMode: 1,
            rightClkMode: 0,
            menu: "#p-j-rectMenu",
            singleMenu: "#p-j-rectMenu",
            menuTag:"li"
        },
        options: {
            rectScope: "（默认值为 .p-j-selectScope）框选作用域",
            node: "（默认值为 .p-j-selectNode）可被框选的元素",
            checkedCss: "（默认值为 select）框选变化的样式Class",
            selectMode: "（默认值为 1）选择模式：1、每次重选，按住Ctrl，则在原来基础上反选 2、每次重新选 3、反选 4、增选",
            rightClkMode: "（默认值为 0）右键点击模式：0、默认行为 1、无操作 2、同左键 3、列出自定义菜单 4、区分单多选菜单",
            menu: "（默认值为 #p-j-rectMenu）右键点击模式为3时 调用的菜单 右键点击模式为4时 多选菜单",
            singleMenu: "（默认值为 #p-j-rectMenu）右键点击模式为4时 单选菜单",
            menuTag:"（默认值为li）菜单项所用标签名",
            rightClkFunc:"（默认无此函数，function(e,$selNodes)）右键点击触发函数（在原有基础上扩展），e为事件对象，$selNodes为当前选中所有结点"
        }
    });
})(jQuery);