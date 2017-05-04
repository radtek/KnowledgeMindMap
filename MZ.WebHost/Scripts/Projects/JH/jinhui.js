/**
 * Created by zuizui on 2014/12/11.
 */

//卡片式展示列表中显示更多模块动作
$('.p-j-blockList-itm-inner_showMore').mouseenter(function(){
    $(this).closest('.p-j-blockList-itm').addClass('select').mouseleave(function(){
        $(this).removeClass('select').unbind('mouseleave');
    })
})
//卡片式展示列表中折叠动作
$('.p-j-collapse-tit').click(function(){
    var $p=$(this).closest('.p-j-collapse');
    var $con=$p.find('.p-j-collapse-con');
    if($con.is(':visible')){
        $p.addClass('select');
        $con.animate({
            height:0,
            overflow:'hidden'
        },800,function(){
            $(this).hide();
        })
    }else{
        $p.removeClass('select');

        $con.fadeIn().css({
            height:'auto',
            overflow:'auto'
        })
    }
})


;(function ($, window, document, undefined) {
    $.extend($.p,{
        animateFromTo: function ($f, $t, fn) {
            var $dot = $('<i class="p-orangeDot"></i>').css({
                top: $f.offset().top + $f.height() / 2 - 6,
                left: $f.offset().left + $f.width() / 2 - 6
            }).appendTo('body')
            $dot.animate({
                top: $t.offset().top + $t.height() / 2 - 6,
                left: $t.offset().left + $t.width() / 2 - 6
            }, 600, function () {
                $dot.remove();
                fn();
            })
        }
    })
})(jQuery, window, document)