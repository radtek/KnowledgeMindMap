;(function ($, window, undefined) {
    $.YH = $.YH || {};
    $.extend($.YH,{
        createSpot:function(options){
            options = $.extend({}, $.YH.createSpot.defaults, options);
            var x=options.x,y=options.y;name=options.name,id=options.id,content=options.content,htmlSpot,
                that = this;
            htmlSpot = "<div class='p-hoverShow' id='yh-spot_'"+id+"><i class='hb-spot_point'></i>" +
                        "<div class='p-hoverShow-itm'></div></div>";

        },
        removeSpot:function(spot){

        },
        moveSpot:function(e){
            var event = e||window.event;
        },
        editSpot:function(){

        },
        choseSpot:function(){

        },
        showMsg:function(){

        }
    });
    $.extend($.YH.createSpot, {
        info:'标注点',
        url:'',
        defaults:{
            "x":'',
            "y":'',
            "content":'',
            'id':'',
            'name':''
        },
        options:{
            "x":'x坐标',
            "y":'y坐标',
            "content":'（点下挂的内容）',
            'id':'(模块id)',
            'name':'（模块名称）'
        }
    });

})(jQuery, window);
; (function ($, window, document, undefined) {
    $.fn.hotSpot = function(options){
        return this.each(function() {
            var defaults = {
                x: '',
                y: '',
                content: '',
                id: '',
                name: '',
                clickEvent: function () {}//点点击事件
            }
            var opts = $.extend(defaults, options);
            var $inputEle = $(this);
            var width = parseInt($inputEle.width() - 2);
            if (!width) return false;
            var $searchList = $('<div class="yh-intelPrompt_searchList" style="display:none; position: absolute; border: 1px solid #888888; background-color:#fff; padding: 3px; width:' + width + 'px;max-height:400px;overflow:auto;"></div>');
            var timer;
        });
    }

})(jQuery);