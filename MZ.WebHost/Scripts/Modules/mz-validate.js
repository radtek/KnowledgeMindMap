/* 
*****************数据校验*****************
* 调用类型 <input mz-type="float" type="text"/>
*/
; (function ($, window, document, undefined) {
    $.fn.mzValidate = function (options) {
        var defaults = {
            "target":"",    //触发的对象
            "verified":"", //待验证的数
            "type":""       //验证的类型
        }
        var opts = $.extend(defaults, options);
        var typeList = {"int":intVerify,"float":floatVerify}; //函数列表
        var $target = $(this);//目标/目标区域
        $target.on("keyup","input[type=text]",function(){
            var $inp = $(this);
            var valiType = $inp.attr("mz-type");
            if(valiType in typeList){
                typeList[valiType]($inp);
            }
        });
    }
    function intVerify(obj){
        var $t = $(obj);
        $t.val($t.val().replace(/[^0-9]/g, ''));
    }
    function floatVerify(obj){
        var $t = $(obj);
        // 禁止输入非数字、小数点的值，首位不为小数点，小数点最多仅出现一次
        $t.val($t.val().replace(/[^0-9.]/g, '').replace(/^\./g, "").replace(".", "sr5220$").replace(/\./g, "").replace("sr5220$", "."));
    }
})(jQuery);