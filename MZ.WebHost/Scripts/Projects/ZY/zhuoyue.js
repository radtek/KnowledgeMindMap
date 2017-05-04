/** --卓越系统
 * 1.表格限高，移动到对应单元格上方显示全部
 * 2.表格空白列（备注列）收折
 * 3.图片轮播 配置方法
 *   $("selector").picCarousel({
 *        limitNum: "4", //多于几张后开始轮播
 *         time:"5" //切换时间
 *   });
 */
; (function ($,window, document, undefined) {
    /*显示更多*/
    $.fn.showMore = function (options) {
        return this.each(function () { //this调用当前插件的对象
            var defaults = {
                limitLv1: "45", /*rowspan=1 限制字数*/
                limitLv2: "45", /*rowspan=2 限制字数*/
                limitLv3: "150" /*rowspan=3 限制字数*/
            }
            var opts = $.extend(defaults, options);

            var $current = $(this);
            var detail = $current.html();
            var detLen = detail.length;
            var more = "<span class='showMoreSpan'>&nbsp;. . . . . .</span>";
            var curTdHei = $current.height();
                       
            //限制文字字数  可改为初始化方法
            $current.attr("detali",detail);
            //console.log(detLen)
            if (detLen > 75 && $current.prop("rowspan") == 2) {
                var showText = detail.substring(0, opts.limitLv2);
                $current.html(showText).append(more);
            } else if (detLen > 75 && $current.prop("rowspan") > 2) {
                var showText = detail.substring(0, opts.limitLv3);
                $current.html(showText).append(more);
            } else if (detLen > 45 && $current.prop("rowspan") < 2) {
                var showText = detail.substring(0, opts.limitLv1);
                $current.html(showText).append(more);
            }
            if ($current.height() == curTdHei) $current.html(detail);

            //hover显示全部
            if ($current.children(".showMoreSpan").length != 0) {
                $current.hover(
                    function () {
                        var htmlDom = $("<div id='showMore'>" + $current.attr("detali") + "</div>");
                        htmlDom.css({
                            "height": "auto",
                            "overflow": "auto",
                            "z-index": "1000",
                            "left": $current.offset().left,
                            "top": $current.offset().top,
                            "position": "absolute",
                            "background-color": "#eee",
                            "border": "1px solid #c6c6c6",
                            "width": $current.width(),
                            "padding": "6px 3px",
                            "box-shadow": "0 0 5px rgba(0,0,0,0.5)",
                            "-webkit-box-shadow": "0 0 5px rgba(0,0,0,0.5)",
                            "-moz-box-shadow": "0 0 5px rgba(0,0,0,0.5)"
                        });
                        htmlDom.appendTo($("body"));
                    },
                    function () {
                        var showTimer = setTimeout(function () {
                            $("#showMore").remove();
                        }, "slow");
                        $("#showMore").hover(
                            function () {
                                clearInterval(showTimer);
                            },
                            function () {
                                $("#showMore").remove();
                            });
                    });
            }
        })
    };

    $(".p-j-switch").live("click", function () {
        var $this = $(this);
        if ($this.hasClass("icon_tdFold_show")) {
            $this.closest("table").find(".p-j-tdFold").hide();
            $this.toggleClass("icon_tdFold_show icon_tdFold_hide");
            $this.prop("title","点击展开");
        } else {
            $this.closest("table").find(".p-j-tdFold").show();
            $this.toggleClass("icon_tdFold_show icon_tdFold_hide");
            $this.prop("title","点击折叠")
        }
    });

    //图片轮播
    $.fn.picCarousel = function (options) {
        return this.each(function () { //this调用当前插件的对象
            var defaults = {
                time:"5", //轮播时间
                count:'1', //每次轮播的张数
                limitNum: "4", //超过几张就进行轮播（定宽）  //若不填则默认为 总 li 宽度超过 容器宽度 则轮播（非定宽）
                autoPlay:true
            }
            var opts = $.extend(defaults,options);

            var $boxDiv = $(this);
            var scrollTimer;
            var $picCon = $boxDiv.find("ul");

//            if ($picCon.children().length > opts.limitNum*1) {
//                $picCon.children().clone().appendTo($picCon);
//            }
            //设置ul长度
            $boxDiv.find("ul").css("width", 2*$boxDiv.find("ul").children().length * ($boxDiv.find("ul").children(":first").width() + 10));
            
            function scroller(obj) {
                var $self = obj.find("ul"),$firstChild = $self.children("li:first"),$fc = $firstChild.clone().addClass('p-j-cloneItem');
                var lineLeft = $firstChild.width();
                if ($self.children().length > opts.limitNum*1) {
                    $self.append($fc)
                    //for (var i = 0; i < opts.limitNum*1; i++) {
                        $self.stop().animate({ "marginLeft": -$self.children(":first").width()*parseInt(opts.count) + "px" }, 100*opts.time, function () {
                            for(var i=0;i<parseInt(opts.count);i++){
                                $self.css({ "marginLeft": 0 + "px" }).find("li:first").appendTo($self);
                            }
                            $self.find('.p-j-cloneItem').remove();
                        });
                    //}
                }
            }
            
            function forward(obj) {
                var $self = obj.find("ul"),$lastChild = $self.children("li:last"),$lc = $lastChild.clone();
                $lastChild.addClass('p-j-cloneItem');
                var lineLeft = $lastChild.width();
                if ($self.children().length > opts.limitNum*1) {
                    $self.append($lc);
                    $self.css({ "marginLeft": -$self.children(":first").width()*parseInt(opts.count) + "px" });
                    for (var i = 0; i < parseInt(opts.count); i++) {
                        $self.find("li:last").prependTo($self);
                        $self.animate({ "marginLeft": 0 + "px" }, 500,function(){
                            $self.find('.p-j-cloneItem').remove();
                        });
                    }
                }
            }

            $boxDiv.hover(
              function () {
                  clearInterval(scrollTimer);
                  //左移
                  if ($boxDiv.find("ul").children().length>opts.limitNum*1) {
                      $boxDiv.find(".lbtn").fadeIn();
                      $boxDiv.find(".rbtn").fadeIn();
                  }
                  $boxDiv.find(".rbtn").unbind("click");
                  $boxDiv.find(".rbtn").on("click", function () {
                      scroller($boxDiv);
                  });
                  //右移
                  $boxDiv.find(".lbtn").unbind("click");
                  $boxDiv.find(".lbtn").on("click", function () {
                      forward($boxDiv);
                  });
              }, function () {
              return;
                  $boxDiv.find(".lbtn").fadeOut();
                  $boxDiv.find(".rbtn").fadeOut();
                  scrollTimer = setInterval(function () {
                      if(opts.autoPlay){
                          scroller($boxDiv);
                      }
                  }, opts.time*1000)
              }
            ).trigger("mouseleave");
        });
    }
})(jQuery);



//hash操作与定位
;(function($) {

    if ($.zyhash) {
	    return;
    }
    $.zyhash = function(name, value) {
	    // jQuery doesn't support a is string judgement, so I made it by myself.
	    function isString(obj) {
		    return typeof obj == "string" || Object.prototype.toString.call(obj) === "[object String]";
	    }
	    if (!isString(name) || name == "") {
		    return;
	    }

	    var clearReg = new RegExp("(;" + name + "=[^;]*)|(\\b" + name + "=[^;]*;)|(\\b" + name + "=[^;]*)", "ig");
	    var getReg   = new RegExp(";*\\b" + name + "=[^;]*", "i");
	    if (typeof value == "undefined") {
		    // get name-value pair's value
		    var result = location.hash.match(getReg);
		    return result ? decodeURIComponent($.trim(result[0].split("=")[1])) : null;
	    }
	    else if (value === null) {
		    // remove a specific name-value pair
		    location.hash = location.hash.replace(clearReg, "");
	    }
	    else {
		    value = value + "";

		    // clear all relative name-value pairs 
		    var temp = location.hash.replace(clearReg, "");

		    // build a new hash value-pair to save it
		    temp +=  ";" + name + "=" + encodeURIComponent(value);
		    location.hash = temp;
	    }
    };
})(jQuery);
//hash操作与定位      


// 左边nav-stacked 导航条样式
$(function() {
    $('.nav-stacked li').on('click',function() {
        var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
    });
});
