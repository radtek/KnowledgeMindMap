/*
 * 固定表头
 * 实例方法YH_fixThead(opts)调用的是工具方法YH_fixHead(elem,opts)，通过$.YH.YH_fixThead.defaults暴露参数
 * 基于livequery直接通过class为‘yh-j-fixThead’调用
 * */
  ;(function ($, window, undefined) {
    $.YH = $.YH || {};
    $.extend($.YH,{
        YH_fixThead:function(elem,opts){
            opts= $.extend({},$.YH.YH_fixThead.defaults,opts);
            var $this=$(elem),
                $fixedHead;
            if(!$this.data('YH_fixThead')){
                $this.data('YH_fixThead',true);
            }else{
                return;
            }
            if(!$this.children('thead').length){
                $.error('固定表格表头必须包含thead标签');
                return;
            }
            $(window).on('scroll resize',function(e){
                if(!$this.get(0).parentNode){
                    $fixedHead && $fixedHead.remove();
                    $(window).off('scroll resize',arguments.callee);
                    $this=null;
                    $fixedHead=null;
                    return;
                }
                if($this.is(':hidden')){
                    $fixedHead && $fixedHead.hide();
                    return;
                }else{
                    $fixedHead && $fixedHead.show();
                }
                if(
                    $this.offset().top < $(window).scrollTop()
                    && $this.offset().top+$this.height() > $(window).scrollTop()
                    && (!$fixedHead || e.type === 'resize')
                ){
                    var $thead=$this.children('thead')
                        ,tTop=$thead.offset().top
                        ,tLeft=$thead.offset().left
                        ,$html=$('<table class="p-j-yhFixedHead '+opts.tableClass+'" style="z-index:10000;position:fixed; top:'+opts.top+'px; left:'+tLeft+'px;font-weight: bold;"></table>')
                        ,zIndex=0;
                    $thead.find('td:visible,th:visible').each(function(){
                        var vAlign=$(this).css('vertical-align')
                            ,tAlign=$(this).css('text-align');
                        var $td=$(this);
                        var html = '<' + this.nodeName + ' class="' + ($td.attr('class') || '') + ' '+opts.cellClass+'" style="' +
                        'border:1px solid #bbb;' +
                        'position:absolute;' +
                        'vertical-align:middle;' +
                        'background:' + opts.background + ';'+
                        //'z-index:' + (zIndex++) + ';' +
                        'top:' + ($td.offset().top - tTop) + 'px;' +
                        'left:' + ($td.offset().left - tLeft - 1) + 'px;' +
                        'width:' + ($td.outerWidth() - 1) + 'px;' +
                        'height:' + ($td.outerHeight() - 1) + 'px;' +
                        '"><div style="display: table-cell;' +
                        'height: ' + ($td.outerHeight()-parseInt($td.css('padding-top'))-parseInt($td.css('padding-bottom'))) + 'px;' +
                        'vertical-align:'+vAlign+';' +
                        'padding-top:'+$td.css('padding-top')+';' +
                        'padding-left:'+$td.css('padding-left')+';' +
                        'padding-bottom:'+$td.css('padding-bottom')+';' +
                        'padding-right:'+$td.css('padding-right')+';'+
                        'text-align:'+tAlign+';' +
                        'width:' + ($td.outerWidth() -parseInt($td.css('padding-left'))-parseInt($td.css('padding-right'))- 2) + 'px;"></div></' + this.nodeName + '>';
                        $html.append($(html).children().append($td.clone(true).removeAttr('colspan').css("width",($td.outerWidth() -parseInt($td.css('padding-left'))-parseInt($td.css('padding-right'))- 2))).end())
                    })
                    $fixedHead && $fixedHead.remove();
                    $fixedHead=$html.insertAfter($this);
                }else if(($this.offset().top>$(window).scrollTop() || $this.offset().top+$this.height() < $(window).scrollTop()) && $fixedHead  ){
                    $fixedHead && $fixedHead.remove();
                    $fixedHead=null;
                }
            })
        }
    });
    $.extend($.YH.YH_fixThead,{
        info:'固定表头，其中表格必须包含thead标签，实例方法$.fn.YH_fixThead(opts)调用的是工具方法$.YH.fixThead(elem,opts)，通过class为‘yh-j-fixThead’调用',
        url:'',
        options:{
            top:'(默认‘0’)距离顶部的高度',
            tableClass:'(默认‘’)指定固定头部class',
            cellClass:'(默认‘’)指定固定头部内单元格class',
            background:'(默认‘#f3f3f3’)指定固定头部内单元格背景'
        },
        defaults:{
            top:0,
            tableClass:'',
            cellClass:'',
            background:'#f3f3f3'
        }
    });
    $.fn.extend({
        YH_fixThead:function(options){
            this.each(function(){
                $.YH.YH_fixThead(this,options)
            })
            return this;
        }
    })
})(jQuery,window)