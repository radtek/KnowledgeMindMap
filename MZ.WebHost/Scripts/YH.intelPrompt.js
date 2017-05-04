//调用方法
/* $("#selector").intelPrompt({
        url: "url",           //url
        tableName: "table1",   //表名
        queryStr: "ssskkkk",   //查询语句
        type: "get",            //请求方式
        contentType:"html", //或者ajax //传入类型
        styleList:{"width":"50px","height":"100px"}
    });*/
/* 调用示例
$("#supplierName").intelPrompt({
            url: "/Home/searchGetJson",
            tableName: "Material_Supplier",
            type: "post",
            primaryKey: "supplierId",
            nameKey: "name",
            styleList: { "width": "250px", "margin-top": "8px" },
            clickEvent: function () {
                $("#supplierName").val($(this).text());
                $(this).closest(".yh-intelPrompt_searchList").remove();
                SearchMaterial();
            }
        });
*/
; (function ($, window, document, undefined) {
    $.fn.intelPrompt = function(options){
        return this.each(function(){
            var defaults={
			    url : "",             //路径或 html字符串
			    tableName : "",       //表名
                queryStr : "",        //搜素语句
                type : "post",           //请求类型
                primaryKey : "",
                nameKey : "",
                contentType : "ajax",
                styleList : "",
                clickEvent: function(){
                    $inputEle.val($.trim($(this).text()));
                    $searchList.detach();
                }
            }
            var opts = $.extend(defaults, options);
            var $inputEle = $(this);
            var width = parseInt($inputEle.width()-2);
            if(!width) return false;
            var $searchList = $('<div class="yh-intelPrompt_searchList" style="display:none; position: absolute; border: 1px solid #888888; background-color:#fff; padding: 3px; width:'+width+'px;max-height:400px;overflow:auto;"></div>');
            var timer;
            var inpClickOuside = function (e) {//点击空白处隐藏
                e = e || window.event;
                if (!$(e.target).closest($searchList).length) {
                    $(document).off('click', arguments.callee)
                    $searchList.detach();
                }
            }
            
            if(opts.contentType=="ajax"){
                var oldData = $inputEle.val();
                
                $inputEle.on("keyup", function () { //发起检索
                    if($.trim(oldData)==$.trim($(this).val())){
                        return false;
                    }else{
                        oldData = $(this).val();
                    }
                    $searchList.empty();
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var keyWord = $inputEle.val();
                        if(!keyWord || keyWord==""){
                            $searchList.detach();
                            return false;
                        }
                        keyWord = $.trim(keyWord);
                        if (keyWord != ""&&opts.type=="get") {//获取检索结果
                            $.get(opts.url,
                            {
                                tbName: opts.tableName,
                                kW: encodeURI(keyWord), //keyWord
                                qu: opts.queryStr
                            },
                            function (data) {
                                var len = data.length;
                                if (len > 0) {
                                    var html = "<ul>";
                                    for (var i = 0; i < len; i++) {
                                        html += "<li><a class='aui-list-item-link' href='javascript:;' value=" + data[i][opts.primaryKey] + ">" + data[i][opts.nameKey];
                                        html += "</a></li>";
                                    }
                                    html += "</ul>";
                                }else{
                                    var html = "<p>找不到与关键字相符的结果！</p>";
                                }
                                $searchList.css({ left: $inputEle.offset().left, top: $inputEle.offset().top + 20 }).appendTo('body').html("").append(html).show();
                                $searchList.closest("body").on('click', inpClickOuside);
                                $searchList.on('click', 'li', function () { //点击选项
                                    var Name = $.trim($(this).text());
                                    var id = $(this).attr("value");
                                    opts.clickEvent.apply($(this));
                                });
                            });
                        }else if(keyWord != ""&&opts.type=="post"){
                            $.post(opts.url,
                            {
                                tbName: opts.tableName,
                                kw: encodeURI(keyWord), //keyWord
                                qu: opts.queryStr
                             },
                             function (data) {
                                 var len = data.length;
                                 if (len > 0) {
                                     var html = "<ul>";
                                     for (var i = 0; i < len; i++) {
                                         html += "<li><a class='aui-list-item-link' href='javascript:;' value=" + data[i][opts.primaryKey] + ">" + data[i][opts.nameKey];
                                         html += "</a></li>";
                                     }
                                     html += "</ul>";
                                 }else{
                                     var html = "<p>找不到与关键字相符的结果！</p>";
                                 }
                                 $searchList.css({ left: $inputEle.offset().left, top: $inputEle.offset().top + 20 }).appendTo('body').append(html).show();
                                 $searchList.closest("body").on('click', inpClickOuside);
                                 $searchList.on('click', 'li', function () { //点击选项
                                    var Name = $.trim($(this).text());
                                    var id = $(this).attr("value");
                                    opts.clickEvent.apply($(this));
                                });
                             });
                       }
                    }, 500)
                });
                if(opts.styleList!="" && opts.styleList!=null && opts.styleList!=undefined){
                    $searchList.css(opts.styleList);
                }
            }else if(opts.contentType=="html"){
                $inputEle.on("keyup", function () {
                    var html = opts.url;
                    $searchList.css({ left: $inputEle.offset().left, top: $inputEle.offset().top + 20 }).appendTo('body').append(html).show();
                    if(opts.styleList!="" && opts.styleList!=null && opts.styleList!=undefined){
                        $searchList.css(opts.styleList);
                    }
                    $searchList.closest("body").on('click', inpClickOuside);
                });
                if(opts.styleList!="" && opts.styleList!=null && opts.styleList!=undefined){
                    $searchList.css(opts.styleList);
                }
                $searchList.on('click', 'li', function () { //点击选项
                    var Name = $.trim($(this).text());
                    var id = $(this).attr("value");
                    opts.clickEvent.apply($(this));
                });
            }else if(opts.contentType=="load"){
            
                var keyWord = $(this).val();
                if($(".yh-intelPrompt_searchList").length<1){
                    $searchList.css({ left: $inputEle.offset().left, top: $inputEle.offset().top + 20 }).appendTo('body').show();
                    $searchList.load(opts.url);
                }else{
                    $(".yh-intelPrompt_searchList").load(opts.url);
                }
                $searchList.closest("body").on('click', inpClickOuside);
                if(opts.styleList!="" && opts.styleList!=null && opts.styleList!=undefined){
                    $searchList.css(opts.styleList);
                }
                $searchList.on('click', 'li', function () { //点击选项
                    var Name = $.trim($(this).text());
                    var id = $(this).attr("value");
                    opts.clickEvent.apply($(this));
                });
            }
        });
    }
    
})(jQuery);