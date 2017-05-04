; (function (b) {
    function c(a, b) {
        this.options = b;
        this.root = a
    }

    c.prototype.init = function () {
        var a = "",
            d = "",
            c = "auto",
            g = "",
            h = "",
            e, f, a = a + ('<img src="' + this.root.find("img").first().attr("src") + '">');

        var url = this.options.url;
        var isEdit = this.options.isEdit;
        var opts = this.options;
        var $img = this.root.find("img");
        this.root.find(".hs-spot-object").each(function () { //初始化象限图点
            var pointId = $(this).attr("pointId");
            var lineId = b(this).data("lineId");
            "rect" == b(this).data("type") ? (d = "hs-rect", e = b(this).data("x"), f = b(this).data("y")) : (d = "hs-spot", e = b(this).data("x") - b(this).data("width") / 2, f = b(this).data("y") - b(this).data("height") / 2);
            g = "visible" == b(this).data("visible") ? "visible" : "visible";

            spotId = b(this).data("id");
            c = !1 == b(this).data("tooltip-auto-width") ? b(this).data("tooltip-width") + "px" : "auto";
            h = b(this).data("popup-position");

            var xSite = b(this).attr("data-x"),
                ySite = b(this).attr("data-y");

            var rx = parseInt($img.offset().left + $img.width() * xSite - 15);
            var ry = parseInt($img.height() * (1 - ySite) - 15);

            a += '<div hs_x="'+xSite+'" hs_y="'+ySite+'" spotId="' + spotId + '" class="' + d + " " + g + " " + h + ' hs-spot-object p-hoverShow" style="left: ' + rx + "px; top: " + ry + "px; width: " + b(this).data("width") + "px; height: " + b(this).data("height") + 'px;">';
            a += '\t<div class="pr"><div><i class="icon_red"></i><span class="p-j_spntName" style="width: 60px; display: block">' + b(this).html() + '</span></div>';
            a += '<div class="p-alert pa w610 p-hoverShow-itm" style="left: 0px; top: 35px; z-index:100 ">';
            a += '<div class="p-alert-con mh400 scrollY"><ul class="p-itm-subPic">';

            //            $.post(url + "&pointId=" + pointId, function (data) {
            //                $(data).each(function (i, n) {
            //                    a += '<li><div class="bc w80"><a class="yh-img_hss" href="javascript:;" target="_blank" value="' + data[i].resultId + '"><img width="80px" height="80px" src="' + data[i].filePath + '"/></div></li>';
            //                });
            //            });
            $.ajax({
                url: url + "&pointId=" + spotId,
                type: 'post',
                async: false,
                dataType: 'json',
                error: function () {
                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                },
                success: function (data) {
                    var projUrl = "";
                    $(data).each(function (i, n) {
                        var retPath = data[i].viewPath;
                        if (retPath == '') retPath = 'javascript:;';
                        a += '<li><div class="bc w80"><a class="yh-img_hss" href="' + retPath + '" target="_blank" value="' + data[i].resultId + '"><img width="80px" height="80px" src="' + data[i].filePath + '"/></a></div>';
                        a += '<a href="' + retPath + '" target="_blank">' + data[i].name + '</a></li>';
                    });
                    if ($(data).length == 0 && isEdit == 0) {
                        a += '<span class="yh-f_gray">暂无模块实例！</span>';
                    }
                }
            });

            if (isEdit == 1) {
                a += '<li style="height: 80px; margin-right: 2px;"><div class="bc w80 p-item_sub-add"><a class="p-j-newProj" landid="' + lineId + '" href="javascript:;" onclick="addResult(this,' + spotId + ');">+</a></div></li>';
            }
            a += '</ul></div></div></div>';
            a += "</div>";
        });
        //alert(a);
        this.root.html(a);
        this.root.removeClass("hs-loading");
        this.root.addClass(this.options.show_on);
        this.root.addClass(this.options.color_scheme);
        this.options.transparent_spots && this.root.addClass("transparent-spots");
        if ("click" == this.options.show_on) b(".hs-spot-object").on("click", function () {
            b(this).toggleClass("visible-tooltip")
        });
        "mouseover" == this.options.show_on && (b(".hs-spot-object").on("mouseover", function () {
            /**没有内容不显示注释框*/
            var _show = $.trim(b(this).find('.hs-tooltip').text());
            if (_show) {
                b(this).addClass("visible-tooltip")
            }
        }), b(".hs-spot-object").on("mouseout", function () {
            b(this).removeClass("visible-tooltip")
        }));
        this.root.on("dblclick", "img", function (e) { //双击描点
            if (isEdit == 0) return false;

            var $this = $(this);
            var e = e || window.event;
            mx = e.pageX;
            my = e.pageY;
            rx1 = mx - $this.offset().left;
            ry1 = my - $this.offset().top;

            var spot = '<div class="hs-spot-object p-hoverShow hs-spot visible" style="width: 30px; height: 30px;"><div class="pr"><div><i class="icon_red"></i><span class="p-j_spntName" style="width: 60px; display: block"></span></div>';
            spot += '<div class="p-alert pa w610 p-hoverShow-itm" style="left: 0px; top:35px; z-index:100"><div class="p-alert-con mh400 scrollY">';
            spot += '<ul class="p-itm-subPic"><li style="height: 80px; margin-right: 2px;"><div class="bc w80 p-item_sub-add">';
            spot += '<a class="p-j-newProj" onclick="addResult(this,1);" href="javascript:;" landid="36">+</a></div></li>';
            spot += '</ul></div></div></div></div>';

            $(spot).css({ "top": ry1 - 15, "left": rx1 - 15 }).appendTo($this.parent());
            cx = rx1 - 15, cy = ry1 - 15;
            rx = parseInt(cx / $this.width() * 1000) / 1000 > 0 ? ((parseInt(cx / $this.width() * 1000) / 1000).toFixed(2) > 1 ? 1 : (parseInt(cx / $this.width() * 1000) / 1000).toFixed(2)) : 0,
            ry = (1000 - parseInt(cy / $this.height() * 1000)) / 1000 > 0 ? (((1000 - parseInt(cy / $this.height() * 1000)) / 1000).toFixed(2) > 1 ? 1 : ((1000 - parseInt(cy / $this.height() * 1000)) / 1000).toFixed(2)) : 0;
            opts.drawFinish({ x: rx, y: ry });
        });

        this.root.on("click", ".icon_red", function () { //单击 右侧显示点信息
            var $t = $(this),
                $obj = $t.closest('.hs-spot-object');
            if (isEdit == 0) return false;
            var spot = $t.closest(".hs-spot-object");
            $obj.addClass("selected").siblings(".hs-spot-object").removeClass("selected");
            var editSpot = $t.closest("#p-j-content").find(".p-j-spotEdit");
            var cName = $.trim(spot.find(".p-j_spntName").text()),
                rx = +$obj.attr('hs_x'),
                ry = +$obj.attr('hs_y');
            editSpot.find(".p-j-spotX").attr("value", (rx * opts.data.x).toFixed(2));
            editSpot.find(".p-j-spotY").attr("value", (ry * opts.data.y).toFixed(2));

            if (cName) {
                editSpot.find(".p-j-spotName").attr("value", cName);
            } else {
                editSpot.find(".p-j-spotName").attr("value", "");
            }
        });
        this.root.on("mousedown", ".hs-spot-object", function (e) {
            if (isEdit == 0) return false;
            var e = e || window.event, isMove = true;
            var $curspt = $(this);
            if (!$curspt.hasClass("selected")) return false;
            $(document).on('mousemove', function (e) {
                if (isMove) {
                    $curspt.css({
                        "top": e.pageY - $curspt.siblings("img").offset().top,
                        "left": e.pageX - $curspt.siblings("img").offset().left
                    });
                }
            }).mouseup(function () {
                if (!isMove) return false;
                $curspt.find(".icon_red").click();
                opts.moveFinish($curspt);
                isMove = false;
            });
        });
    };
    b.fn.hotspot = function (a) {
        O = b.extend(!0, {
            show_on: "mouseover",
            transparent_spots: !0,
            color_scheme: "red",
            url: "",
            isEdit: "",
            data: "",
            moveFinish: function (spot) { }, //移动完后触发
            drawFinish: function (spot) { }  //描点完后触发

        }, a);
        return this.each(function () {
            (new c(b(this), O)).init()
        });
    }
})(jQuery);