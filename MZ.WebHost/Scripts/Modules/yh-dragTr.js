/*
* ZJGK 决策模版页脚本
*/
/*
* 移动到行后半部分为子级
* 移动到行前半部分为同级
*/
;(function ($) {
    $.fn.dragTr = function (options) {
        var $table = $(this);
        var moveable = false;
        var curNode,curNodekey,curLev,targetTr;
        var tbName = $table.attr("tableName"),
        tbId = $table.prop("id");
        var tbLeft = $table.offset().left,
        tbWidth = $table.width();
        var defaults={
			    sameLev : "0"      //是否允许只在同级移动 1 :允许 ;0:不允许  其他值 :不允许
            }
        var opts = $.extend(defaults, options);

        $table.find('.p-j-handleBox').each(function(){
            if($(this).find('.p-j-moveNode').length == 0 && $(this).closest('tr').attr('canmove')==1){
                $(this).append('<a href="javascript:void(0);" title="移动" class="p-j-moveNode"><i class="p-icon_move"></i></a>');
            }
        });
        $table.off('click',".p-j-moveNode").on('click',".p-j-moveNode",function(e){
            curNode = $(this).closest('tr');
            if(curNode.attr("canmove")=="1" && $(e.target).closest("select").length==0){ //可移动节点
                curNode.addClass('p-j-yhMoveTrSelect');
                moveable = true;
            }else{
                alert('该节点不可移动！');
            }
            return false;
        });

        $table.off('mouseenter','tbody tr').on('mouseenter','tbody tr',function(){
            var $cur = $(this);
            if(!moveable || $cur.attr('data-key') == curNode.attr('data-key')){ return false;}
            
            var coveMenu = "<div class='p-j-yhMoveNode' moveKey="+curNode.attr('data-key')+" dataKey="+ $cur.attr('data-key') +" style='position:absolute;top:"+$cur.offset().top+"px;left:"+$cur.offset().left+"px;"
                         + "width:"+$cur.width()+"px;height:"+$cur.height()+"px;'>";
                coveMenu += "<table height='100%' width='100%'><tr><td align='center'><a href='javascript:void(0);' type='pre' class='p-j-move'>该节点上方</a></td>"
                         + "<td align='center'><a href='javascript:void(0);' type='next' class='p-j-move'>该节点下方</a></td>";
                if(opts.sameLev!="1" && $cur.closest("tbody").length==1){
                    coveMenu += "<td align='center'><a href='javascript:void(0);' type='child' class='p-j-move'>该节点子级</a></td>";
                }
                coveMenu += "</tr></table></div>";
            var $coveMenu = $(coveMenu)
            $('body').append($coveMenu);

            $cur.on('mouseleave',function(){
                var showTimer = setTimeout(function () {
                       $coveMenu.remove();
                    }, "slow");
                $coveMenu.hover(function () {
                    clearInterval(showTimer);
                }, function () {
                    showTimer = setTimeout(function () {
                        $coveMenu.remove();
                    }, "fast");
                });
            });
        });
        $('body').off('click',".p-j-move").on('click',".p-j-move",function(){
            var $this = $(this),type = $this.attr('type');
            var $handleDiv = $this.closest('div');
            var moveId = $handleDiv.attr("moveKey"),moveToId = $handleDiv.attr("dataKey");
            move(tbName+"Dir",moveId ,moveToId , type);

            moveable = false;
            $table.find('.p-j-yhMoveTrSelect').removeClass('p-j-yhMoveTrSelect');
            $handleDiv.remove();
        });

        // 光标拖出表格外的不处理
        $(document).on("mouseup",function(e){
            var e = e||window.event;
            var target = $(e.target);

            if(moveable==true){
                if(target.closest("#"+tbId).length<1){
                    moveable = false;
                    $table.find('.p-j-yhMoveTrSelect').removeClass('p-j-yhMoveTrSelect');
                }
            } 
        });
    }
    /*
    * 1.单击选中单元格
    * 2.ctrl+c 复制单元格中的内容
    * 3.表格中有复制后的单元格后 点击选中要赋值的单元格
    * 4.ctrl+v 为选中的单元格赋值
    * 
    */
    $.fn.copyTd = function(options){
        var $table = $(this),tbId = $table.prop("id"),
            tableName = $table.attr("tableName")+"Dir",
            primaryKey = tableName.substr(0,1).toLowerCase()+tableName.substr(1,tableName.length-1)+"Id",
            primaryId,key,keyValue;
        var copyVal,$copyTd;

        $table.on("click","tbody td",function(){ //选中需要复制的单元格
            var $activeTd = $(this);
            if($table.find(".p-j-tdChosed").length>=0 && $table.find(".p-j-tdActive").length<1){
                $table.find(".p-j-tdChosed").removeClass("p-j-tdChosed");
                $activeTd.addClass("p-j-tdChosed");
                copyVal = "";
            }
            if($table.find(".p-j-tdActive").length>0){
                $activeTd.toggleClass("p-j-tdSelect");
            }
        });

        $("body").on("keyup",function(e){
            var e = e||window.event;
            if (e.ctrlKey==1){
                if(document.all){
                    k=e.keyCode;
                }else{
                    k=e.which;
                }
                if( $table.find("td.p-j-tdChosed").length>0 ){ // 存在选中的td
                    if(k==67){ //CTRL+C  
                        var $choseTd = $table.find("td.p-j-tdChosed");
                        $choseTd.addClass("p-j-tdActive").removeClass("p-j-tdChosed");
                        copyVal = $choseTd.find(".tdText").length>0?$.trim($choseTd.find(".tdText").text()):null;  //复制值
                        $copyTd = $choseTd;
                    }
                }else if( $table.find("td.p-j-tdSelect").length>0 && $table.find("td.p-j-tdActive").length>0){ //存在有复制的td
                    if(k==86){ //CTRL+V
                        if(copyVal==null){
                            if($table.find(".p-j-tdChosed").length>0){
                                $table.find(".p-j-tdChosed").removeClass("p-j-tdChosed");
                            }
                            if($table.find(".p-j-tdActive").length>0){
                                $table.find(".p-j-tdActive").removeClass("p-j-tdActive");
                            }
                            if($table.find(".p-j-tdSelect").length>0){
                                $table.find(".p-j-tdSelect").removeClass("p-j-tdSelect");
                            }
                            alert("该列暂不支持复制粘贴功能！");
                            return false;
                        }
                        var count = 0;
                        $table.find("td.p-j-tdSelect").each(function(){
                            count++;
                            $select = $(this);
                            primaryId = $.trim($select.closest("tr").attr("data-key"));

//                            var $seleDom = $copyTd.find("select");//下拉框
//                            var key = $.trim($seleDom.prop("name"));
                            
                            var $vSeleDom = $copyTd.find(".p-j-vSelect");
                            var key = $.trim($vSeleDom.attr("name"));

                            if(key){
//                                var keyValue = $copyTd.find("select[name="+key+"]").find("option:selected").prop("value");
                                var keyValue = $copyTd.find(".p-j-vSelect[name="+key+"]").find("li[class=selected]").attr("value");
                            }
                            //console.log(tableName+"-"+primaryKey+"-"+primaryId+"-"+key+"-"+keyValue)
//                            if($seleDom.length>0 && $select.find("select").prop("name")==key){ //同列的才执行操作  非同列的不进行操作
//                                $select.find(".tdText").text(copyVal);
//                                saveData(tableName,primaryKey,primaryId,key,keyValue);
//                            }else{
//                            }
                            if($vSeleDom.length>0 && $select.find(".p-j-vSelect").attr("name")==key){ //同列的才执行操作  非同列的不进行操作
                                $select.find(".tdText").text(copyVal);
                                saveData(tableName,primaryKey,primaryId,key,keyValue);
                            }else if(tbId == "p-j-celt" && count == $table.find("td.p-j-tdSelect").length){
                                saveSpecialData($table,copyVal);
                            }else if(tbId == "p-j-pilnt" && count == $table.find("td.p-j-tdSelect").length){
                                saveSpecialData($table,copyVal,tableName);
                            }
                        });

                        if($table.find(".p-j-tdChosed").length>0){
                            $table.find(".p-j-tdChosed").removeClass("p-j-tdChosed");
                        }
                        if($table.find(".p-j-tdActive").length>0){
                            $table.find(".p-j-tdActive").removeClass("p-j-tdActive");
                        }
                        if($table.find(".p-j-tdSelect").length>0){
                            $table.find(".p-j-tdSelect").removeClass("p-j-tdSelect");
                        }
                        copyVal="";
                    }
                }
            }
        });

        $(document).on("click",function(e){
            var e = e||window.event;
            var target = $(e.target);

            if(target.closest("#"+tbId).length<1){ //点击在表格外 移除左右样式 清空复制的值
                if($table.find(".p-j-tdChosed").length>0){
                    $table.find(".p-j-tdChosed").removeClass("p-j-tdChosed");
                }
                if($table.find(".p-j-tdActive").length>0){
                    $table.find(".p-j-tdActive").removeClass("p-j-tdActive");
                }
                if($table.find(".p-j-tdSelect").length>0){
                    $table.find(".p-j-tdSelect").removeClass("p-j-tdSelect");
                }
                copyVal="";

//                $table.find("select").hide();
                $table.find("div.p-j-vSelect").hide();
            }
        });
        //表格中的下拉框操作
        $table.on("dblclick","td",function(){
            var $this = $(this);
//            if($this.find("select").length>0){
//                $this.find("select").show();
//            }
            if($table.find(".p-j-vSelect").length>0){
                $table.find(".p-j-vSelect").hide();
            }
            if($this.find(".p-j-vSelect").length>0){
                $this.find(".p-j-vSelect").show();
            }
        });
//        $table.on("change","select",function(){  //旧版双击出现下拉框
//            var $this = $(this);
//            key = $.trim($this.prop("name"));
//            $selectOp = $this.find("option:selected");
//            keyValue = $selectOp.prop("value");
//            primaryId = $this.closest("tr").attr("data-key");

//            $this.closest("td").find(".tdText").text($selectOp.text());
//            saveData(tableName,primaryKey,primaryId,key,keyValue);
//            $this.hide();
//        });
        $table.on("click",".p-j-vSelect li",function(){
            var $this = $(this);
            key = $.trim($this.closest("div.p-j-vSelect").attr("name"));
            keyValue = $.trim($this.attr("value"));
            primaryId = $this.closest("tr").attr("data-key");
            $this.addClass("selected").siblings().removeClass("selected");
            $this.closest("td").find(".tdText").text($this.text());
            saveData(tableName,primaryKey,primaryId,key,keyValue);
            $this.closest("div.p-j-vSelect").hide();
        }).on('click','i.p-j-empty',function(){ //清空
            if(confirm("确定清空该项！")){
                var $this = $(this);
                key = $.trim($this.closest("td").find(".p-j-vSelect").attr("name"));
                keyValue = $.trim($this.attr("value"));
                primaryId = $this.closest("tr").attr("data-key");
                $this.closest("td").find(".tdText").text("");
                saveData(tableName,primaryKey,primaryId,key,keyValue);
                $this.closest("div.p-j-vSelect").hide();
            }
        });
    }
})(jQuery);

function saveData(tableName,primaryKey,primaryId,key,keyValue){
    $.ajax({
        url: '/home/SavePostInfo',
        type: 'post',
        data: {
            tbName: tableName,
            queryStr: "db." + tableName + ".distinct('_id',{'" + primaryKey + "':'" + primaryId + "'})",
            dataStr: key + '=' + keyValue
        },
        dataType: 'json',
        error: function () {
            $.tmsg('m_jfw', '未知错误，请联系服务器管理员，或者刷新页面重试', {
                infotype: 2
            });
            return false;
        },
        success: function (data) {
            if (data.Success == false) {
                $.tmsg('m_jfw', data.Message, {
                    infotype: 2
                });
                return false;
            } else {
                $.tmsg('m_jfw', '保存成功！', {
                    infotype: 1
                });
            }
        }
    });
}

function saveSpecialData(obj,copyval,tbName) { 
    var copyVal = copyval;
    var $copy = $(".p-j-tdActive");
    var $paste = $(".p-j-tdSelect");
    var copyId = $.trim($copy.closest("tr").attr("data-key")),cascade = $.trim($copy.attr("data-cascade")),
    copyToId = [];
    $paste.each(function(){
        var valKey = $.trim($(this).closest("tr").attr("data-key"));
        copyToId.push(valKey);
    });

    $.ajax({
        url: '/Home/BatchCopyTemplateValueZJGK',
        type: 'post',
        data: {
            copyId: copyId,
            copyToId: copyToId.join(","),
            cascade: cascade,
            tbName: tbName || ""
        },
        dataType: 'json',
        error: function () {
            $.tmsg('m_jfw', '未知错误，请联系服务器管理员，或者刷新页面重试', {
                infotype: 2
            });
            return false;
        },
        success: function (data) {
            $.tmsg('m_jfw', '保存成功！', {
                infotype: 1
            });
            for (var i = 0; i < copyToId.length; i++) {
                var $selectTd = $(obj).find("tr[data-key=" + copyToId[i] + "]").find("td[data-cascade=" + cascade + "]");
                $selectTd.find(".tdText").text(copyVal);
            }
        }
    });
}
//设置科目标识
function showidentity(obj) {
    var type = $(obj).prop("checked");
    var $table = $("#p-j-celt"), $tbody = $table.find("tbody"),
        tHeight = $tbody.height(), tWidth = $tbody.width(),
        $firstTr = $tbody.children("tr:first").next(),
        $firstTd = $firstTr.children("td:first"), $secondTd = $firstTd.next();

    if (type == true) {
        var top = $secondTd.offset().top - $(".p-j-position").offset().top,
            left = $secondTd.offset().left - $(".p-j-position").offset().left;
        var extWidth = $firstTd.width(), maskWidth = tWidth - extWidth - 6;
        var maskTable, underMask;
        var underMask = '<div class="p-j-underMask" style="width:100%;height:100%;position:fixed;left:0;top:0;z-index:9000;"></div>'
        var maskTable = '<div class="p-j-masking" style="background: rgba(0,0,0, 0.7);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#b2000000, endColorstr=#b2000000);position:absolute;z-index:10000;width:' +
                    maskWidth + 'px;height:' + tHeight + 'px;top:' + top + 'px;left:' + left + 'px;">';
        maskTable += "<table width='100%' style='color:#fff;'><tbody>";

        $tbody.find("tr:visible").each(function () {
            var $this = $(this);
            var canMove = $this.attr("canmove");
            maskTable += "<tr style='height:" + $this.height() + "px' key=" + $this.attr("data-key") + "><td align='center'><span class='p-j-text'>" + $this.attr("data-itemtype") + "</span>&nbsp;";
            if (canMove == "1"){
                maskTable += "<i class='p-icon_tools p-j-changeItemType'></i></td></tr>";
            }else{
                maskTable += "</td></tr>";
            }
        });

        maskTable += "</tbody></table></div>";
        $(maskTable).appendTo($("#p-j-subjectContent"));
        $(underMask).appendTo($("body")).on("click", function () {
            var verId = $("input[name=curVersionId]").val();
            $.post('/Home/GetCostItemType?versionId=' + verId, {}, function (data) {
                if (+data.len == 0) {
                    $(".p-j-underMask").remove();
                    $(window).off('beforeunload');
                } else {
                    alert("请先设置完科目计算标识！");
                }
            });
        });
        //绑定beforeunload事件
        $(window).on('beforeunload', function () {
            return '您输入的内容尚未保存，确定离开此页面吗？';
        });
    } else {
        if ($(".p-j-masking").length > 0) $(".p-j-masking").remove();
        //解除绑定，一般放在提交触发事件中
        $(window).off('beforeunload');
    }
}
//修改科目标识
$(document).on("click", ".p-j-changeItemType", function () {
    var $this = $(this);
    var $tr = $this.closest("tr");
    var key = $tr.attr("key");
    var top = $this.offset().top - $(".p-j-position").offset().top,
        left = $this.offset().left - $(".p-j-position").offset().left;

    $.post('/Home/GetCostItemType?id=' + key, {}, function (data) {
        var alertDom = "<div class='pa p-j-alertDom' style='top:" + parseFloat(top + 20) + "px;left:" + parseFloat(left + 20) + "px;z-index:10009;background:#fff;'><ul key=" + key + ">";
        for (var i = 0; i < data.length; i++) {
            alertDom += "<li style='padding:3px 6px;' data-id='" + data[i].id + "'>" + (data[i].name!="请选择"?data[i].name:"<i class='icon-trash mr5' title='清空'></i>清空") + "</li>";
        }
        alertDom += "</ul></div>";
        $(alertDom).appendTo($("#p-j-subjectContent"));
    }, 'json');
}).on("click", ".p-j-alertDom li", function () {
    var $this = $(this);
    var primaryId = $this.closest("ul").attr("key");
    var keyValue = $this.attr("data-id");
    var keyText = $.trim($this.text());
    saveData("CostDir", "costDirId", primaryId, "itemType", keyValue);
    if (+$this.attr("data-id") !== 0) {
        $("tr[key=" + primaryId + "]").find(".p-j-text").text(keyText);
        $("#p-j-celt").find("tr[data-key=" + primaryId + "]").attr("data-itemtype", keyText);
    } else {
        $("tr[key=" + primaryId + "]").find(".p-j-text").text("");
        $("#p-j-celt").find("tr[data-key=" + primaryId + "]").attr("data-itemtype", "");
    }
    if (keyValue == "0" && $(".p-j-underMask").length==0) {
        var underMask = '<div class="p-j-underMask" style="width:100%;height:100%;position:fixed;left:0;top:0;z-index:9000;"></div>';
        $(underMask).appendTo($("body")).on("click", function () {
            var verId = $("input[name=curVersionId]").val();
            $.post('/Home/GetCostItemType?versionId=' + verId, {}, function (data) {
                if (+data.len == 0) {
                    $(".p-j-underMask").remove();
                    //                    $("#p-j-subjectContent").find(".p-j-masking").remove();
                    //                    $(".p-j-setMask").prop("checked", false);
                    $(window).off('beforeunload');
                } else {
                    alert("请先设置完科目计算标识！");
                }
            });
        });
        //绑定beforeunload事件
        $(window).on('beforeunload', function () {
            return '您输入的内容尚未保存，确定离开此页面吗？';
        });
    }
    $this.closest(".p-j-alertDom").remove();
}).on("click", function (e) {
    var e = e || window.event;
    var target = $(e.target);
    var alertDom = $("#p-j-subjectContent").find(".p-j-alertDom");
    if (target.closest(".p-j-alertDom").length == 0) {
        $(".p-j-alertDom").remove();
    }
});

//销售回款表遮罩
function addMask(o, type) {
    var $content = o.find(".YH-superTable-data").children("div"), $head = o.find(".YH-superTable-headerInner");
    var $coverTable = $content.find("table");

    if (type) {
        var left = $coverTable.find("tbody tr:first td:eq(1)").width() + 6,
        left2 = $head.find("thead tr:first td:eq(2)").offset().left - $head.offset().left, tHeight = $coverTable.height(),
        maskWidth = o.find(".YH-superTable-data").width() - $coverTable.find("tbody tr:first td:eq(1)").width() - 6;
        var maskTable = '<div class="p-j-masking" style="position:absolute;z-index:10000;width:' +
            maskWidth + 'px;height:' + tHeight + 'px;top:0px;left:' + left + 'px;">';
            maskTable += "<table width='100%' style='color:#000;' class='p-j-maskTable'><tbody>";
        var maskHead = "<table class='p-j-maskHead p-j-maskTable' style='position:absolute;left:" + left2 + "px;top:0;height:" + $head.height() + "px;z-index:10000;width:" + maskWidth + "px;color:#000; font-weight:bold'><tr><th width='250' align='center'>科目占比</th><th align='center' width='250'>分得可售面积</th></tr></table>";
        $coverTable.find("tr:visible").each(function () {
            var $this = $(this),
                canSaleArea = parseFloat($this.find("td[n=saleArea]").text().replace(/,/g, "")) || 0;
            rate = parseFloat($this.attr("rate")) || 0;
            if ($this.attr("isleaf") === "True") {
                maskTable += "<tr style='height:" + $this.height() + "px' key=" + $this.attr("val") + "><td align='center' width='250'><div class='p-j-rate p-inputdiv' contenteditable='true' type='text' style='width: 100px;color:#404040;background: #fff;height: 15px;'>" + $.trim($this.attr("rate")) + "</div></td>";
                maskTable += "<td canSaleArea='" + canSaleArea + "' class='p-j-saleArea' align='center' width='250'><span>" + (canSaleArea * rate/100).toFixed(2) + "</span></td></tr>";
            } else {
                maskTable += "<tr style='height:" + $this.height() + "px' key=" + $this.attr("val") + "><td align='center' width='250'><span class='p-j-text'>" + $this.attr("rate") + "</span>&nbsp;</td>";
                maskTable += "<td canSaleArea='" + canSaleArea + "' align='center' width='250'><span>" + (canSaleArea * rate/100).toFixed(2) + "</span></td></tr>";
            }
        });
        o.find('.YH-superTable-data').animate({ scrollLeft: 0 }, function () {
            o.find('.YH-superTable-data').css("overflow-x", "hidden"); //禁用水平滚动条
        });
        maskTable += "</tbody></table></div>";
        $(maskTable).appendTo($content);
        $(maskHead).appendTo($head);
    } else {
        if ($(".p-j-masking").length > 0) {
            $(".p-j-masking").remove();
        }
        if ($(".p-j-maskHead").length > 0) {
            $(".p-j-maskHead").remove();
        }
        o.find('.YH-superTable-data').css("overflow-x", "auto");
    }
}
//财务表遮罩
function addMask2(o) {
    var $obj = $(o), type = $obj.prop("checked"), $table = $("#p-j-fvtb"),
        $target = $table.parent(), tHeight = $table.height(), left = $table.find("tbody tr:first td:eq(3)").offset().left-$table.offset().left;
    var maskWidth = 623;
    if (type) {
        var maskTable = '<div class="p-j-masking" style="background: rgba(0,0,0, 0.7);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#b2000000, endColorstr=#b2000000);position:absolute;z-index:10000;width:' +
                    maskWidth + 'px;height:' + tHeight + 'px;top:0px;left:' + left + 'px;">';
        maskTable += "<table width='100%' style='color:#fff;'>";
        maskTable += "<thead><tr><td align='center' style='height:" + $table.find("thead").height() + "px'>科目占比</td></tr></thead><tbody>";
        $table.find("tbody tr:visible").each(function () {
            var $this = $(this);
            if ($this.attr("isleaf") === "True") {
                maskTable += "<tr style='height:" + $this.height() + "px' key=" + $this.attr("data-key") + "><td align='center'>" +
                "<div class='p-j-rate p-inputdiv' contenteditable='true' type='text' style='width: 100px;color:#404040;background: #ddd;height: 15px;'>" + $.trim($this.attr("rate")) + "</div></td></tr>";
            } else {
                maskTable += "<tr style='height:" + $this.height() + "px' key=" + $this.attr("data-key") + "><td align='center'><span>" + 
                $this.attr("rate") + "</span></td></tr>";
            }
        });
        maskTable += "</tbody></table></div>";
        $(maskTable).appendTo($target);
    } else {
        if ($(".p-j-masking").length > 0) {
            $(".p-j-masking").remove();
        }
    }
}

$(document).on("blur", ".p-j-rate", function () {
    var $t = $(this), val = parseFloat($t.text()) || 0,
        data_key = $t.closest("tr").attr("key");
    if (val > 100) {
        $t.text("");
        $.tmsg("m_jfw", "科目占比不能超过百分百!", { infotype: 2 });
        return false;
    } else if (isNaN($t.text())) {
        $t.text("");
        $.tmsg("m_jfw", "科目占比只能填写数字！", { infotype: 2 });
        return false;
    }
    var $canSaleArea = $t.closest("tr").find(".p-j-saleArea");
    if ($canSaleArea.length > 0) {  // 销售回款表
        var b = parseFloat($canSaleArea.attr("canSaleArea")) || 0;
        $canSaleArea.text((val * b / 100).toFixed(2));
        $(".YH-superTable-data").find("table.J-supertable").find("tr[val=" + data_key + "]").attr("rate", val);
    } else { //财务表
        $("#p-j-fvtb").find("tr[data-key=" + data_key + "]").attr("rate", val);
    }
    saveData("CostDir", "costDirId", data_key, "itemRate", val);
});

/*格式化 金钱格式*/
function toMoney(nStr) {
    nStr += ''; //改变成字符串
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//返回格式化后的数据
function numFmt(num) {
    var newNum = num.replace(/[^0-9.]/g, '').replace(/^\./g, "").replace(".", "sr5220$").replace(/\./g, "").replace("sr5220$", ".");
    return newNum;
}