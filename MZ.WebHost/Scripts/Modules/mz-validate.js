/* 
*****************����У��*****************
* �������� <input mz-type="float" type="text"/>
*/
; (function ($, window, document, undefined) {
    $.fn.mzValidate = function (options) {
        var defaults = {
            "target":"",    //�����Ķ���
            "verified":"", //����֤����
            "type":""       //��֤������
        }
        var opts = $.extend(defaults, options);
        var typeList = {"int":intVerify,"float":floatVerify}; //�����б�
        var $target = $(this);//Ŀ��/Ŀ������
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
        // ��ֹ��������֡�С�����ֵ����λ��ΪС���㣬С������������һ��
        $t.val($t.val().replace(/[^0-9.]/g, '').replace(/^\./g, "").replace(".", "sr5220$").replace(/\./g, "").replace("sr5220$", "."));
    }
})(jQuery);