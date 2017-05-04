/////////////////////////////////////////////////////////////////////////////////////////
// YH-SuperTable 银禾系统超级表格
// 应用于固定表头
// 时间：2014.9.28
// 作者： zuizui Yinhoo
// huangzuizui@gmail.com
/////////////////////////////////////////////////////////////////////////////////////////
////// EXAMPLES:
//jqueryObj.YHsuperTable({
//	headerRows : 1,//固定的表头行数
//	fixedCols : 1,//固定的表头列数
//	col : 1,//固定的表头列数
//  colAutoWidth : 120,
//  colWidth : [100, 230, 220, -1, 120, -1, -1, 120],//用负一表示应用自动宽度
//  colWidthBack : [100, 230, 220],//从最后列倒数配置列宽度
//  colLength : 10,
//	headerStyle:'background-color:#bbb',//固定的表头样式设置
//	colHeaderStyle:'background-color:#ccc',//固定的表头列样式设置
//	rowHeaderStyle:'background-color:#ddd',//固定的表头行样式设置
//	tableStyle:'background-color:#fff'//固定的表内容样式设置
//  onStart:fn,//应用超级表格开始时执行回调函数
//  onFinish:fn//应用超级表格结束时执行回调函数
//})
////// ISSUES / NOTES:
// 应用超级表格，表必须包含<thead><tbody>标签，table必须有width绝对宽度
////////////////////////////////////////////////////////////////////////////////////////
;(function($){
    $.fn.YHsuperTable=function(options){
        options=$.extend({
            headerRows : 1,
            fixedCols : 1,
            colAutoWidth : 120,
            colWidth : null,
            colLength : 0,
            headerStyle:'background-color:#eee',
            colHeaderStyle:'background-color:#eee',
            rowHeaderStyle:'background-color:#eee',
            tableStyle:'background-color:#fff',
            fullScreen:true
        },options);
        this.each(function() {

            //检查表格是否已经应用过超级表格
            if($(this).parents('.YH-superTable-base').length>0) return;
            //检查表格格式是否符合要求
            if(this.tagName.toLowerCase()!='table'){
                alert('超级表格只能应用于table标签');
                return;
            }else if($(this).children('tbody').length<1){
                alert('表格格式不符合要求，表格中必须包含tbody标签');
                return;
            }

            //开始时的回调函数
            if(options.onStart){
                options.onStart.call(this);
            }
            var pWidth;//表格父级宽度
            var pHeight;//表格父级高度
            var hHeight=0;//表格头部浮动高度
            var hWidth=0;//表格右侧浮动宽度
            var hColsWidth=[];
            var trHeight=[];
            var bwidth=1;
            var tWidth=0;//表格宽度
            var colLen=0;
            var emptyTd='';
            var ie7width=0;
            var ie7fixColHideTr='';
            var ie7bodyHideTr='';//ie7中因为显示宽度包括设置的宽度加上padding和border，导致表格合并单元格大小不一致问题
            var $p=$(this).parent();
            var $tableBase,$tableFdata,$tableFheader,$tableData,$tableHeader;


            //以下判断优化ie9的wrap方法效率低的问题
            //开始不进行表格最大高度设置 等完后再进行限制（一开始就设置可能导致 表格未达到最大高度就出现滚动条）
            if($(this).parent('.superTableDiv').parent('.superTableDiv').parent('.superTableDiv').length===1){
                $p=$(this).parent().parent().parent().parent();

                if($p.children().length===1 && $p.height()<$(window).height()){
                    pWidth=$p.width();
                    pHeight="auto";//$p.height();
                    $p.css('overflow','visible');
                }else{
                    pWidth=$p.width();
                    pHeight="500px";
                }
                if(window.navigator.userAgent.indexOf("Chrome") !== -1){
                    $(this).prependTo($p).removeAttr('width').width('auto').wrap('<div class="YH-superTable-base" style="background: #fff; position: relative; width: 100%; max-height: '+pHeight+'; overflow: hidden;"><div class="YH-superTable-data"><div style="width:100000px;"></div></div></div>');
                    $p.find('.superTableDiv').remove();
                }else{
                    $(this).removeAttr('width').width('auto').parent().removeAttr('class').width(100000).parent().attr('class','YH-superTable-data').parent().attr('class','YH-superTable-base').attr('style','position: relative; width: 100%; height: '+pHeight+'; overflow: hidden;');
                }

            }else{

                if($p.children().length===1 && $p.height()<$(window).height()){
                    pWidth=$p.width();
                    pHeight="auto";//$p.height();
                    $p.css('overflow','visible');
                }else{
                    pWidth=$p.width();
                    pHeight="500px";
                }
                //                                                             此处样式为判断是否IE7 ：*min-height:20px;
                $(this).removeAttr('width').width('auto').wrap('<div class="YH-superTable-base" style="*min-height:20px;position: relative; width: 100%; max-height: '+pHeight+'; overflow: hidden;background:#fff;"><div class="YH-superTable-data"><div style="width:100000px;*float:left;"></div></div></div>');
            }

            var $data=$(this).parent().parent().parent();

            if(parseInt(options.colLength)>0){
                colLen=parseInt(options.colLength);
            }else{
                $(this).find('tr:first').children().each(function(index, element) {
                    colLen +=$(this).attr('colspan')*1 || 1;
                });
            }
            if(options.colAutoWidth || $.type(options.colWidth) === "array"){
                var cols='';
                for(var i=0;i<colLen;i++){
                    if($.type(options.colWidthBack) === "array" && $.type(options.colWidthBack[colLen-i-1])==='number'){
                        colWidth=parseInt(options.colWidthBack[colLen-i-1]) > 0 ?  parseInt(options.colWidthBack[colLen-i-1]) : (options.colAutoWidth || 120);
                    }else{
                        colWidth=options.colWidth && options.colWidth[i] > 0 ?  options.colWidth[i]*1 : (options.colAutoWidth || 120);
                    }
                    cols+='<col width="'+colWidth+'">';
                }
                if($(this).find('colgroup').length>0){
                    $(this).find('colgroup').html(cols);
                }else{
                    $(this).prepend("<colgroup>"+cols+"</colgroup>");
                }
            }

            if(options.fixedCols >0){

                //ie7 colspan bug处理，在固定行的表格中加入空td
                if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){

                    ie7fixColHideTr="<tr style='display:none;'><td colspan='"+options.fixedCols+"'></td></tr>";
                    ie7bodyHideTr="<tr style='display:none;'><td colspan='"+colLen+"'></td></tr>";
                    for(var i=0;i<colLen;i++){
                        emptyTd+='<td>&nbsp;</td>';
                    }
                    emptyTd = '<tr style="height:0">'+emptyTd+'</tr></tbody>';
                }
                var rowspan=[];
                var colspan=[];
                var $tBody=$('<tbody>'+ie7fixColHideTr+'</tbody>');

                $(this).find('tbody tr').each(function(index, element){
                    var rowLength=rowspan.length;
                    var $tr=$('<tr></tr>');

                    //逐个单元格遍历
                    $(this).children().each(function(j, el) {//固定表格部分
                        //当前单元格的colspan和rowspan
                        var thisColSpan=$(this).attr('colspan')?$(this).attr('colspan'):1;
                        var thisRowSpan=$(this).attr('rowspan')?$(this).attr('rowspan'):1;

                        var colLength=0;
                        if(thisColSpan>1){
                            var arr=[];
                            var arrLen=thisRowSpan;
                            for(var i=0;i<arrLen;i++){
                                arr.push(thisColSpan);
                            }
                            colspan.push(arr);
                        }
                        for(var i=0;i<colspan.length;i++){
                            colLength+=colspan[i][0]-1;
                        }
                        var len=j+rowLength+colLength+1;
                        if(thisRowSpan>1) rowspan.push(thisRowSpan);
                        $tr.append($(this).clone());
                        //alert('j:'+j+'------len:'+len+'------arr:'+rowspan+'-------colLength:'+colLength);

                        if(len>=options.fixedCols){
                            return false;
                        }
                    });
                    $tBody.append($tr);

                    rowspan=$.map(rowspan , function(n){
                        if(n-1) return n-1;
                    });
                    var tempArr=[];
                    $.each(colspan,function(n,m){
                        if(m.length>1){
                            m.pop();
                            tempArr.push(m);
                        }
                    });
                    colspan=tempArr;
                });
            }

            //如果表格有thead时生成固定行
            if($(this).find('thead').length==1){

                if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){
                    ie7width=3;
                    ie7bodyHideTr="<tr style='display:none;'><td colspan='"+colLen+"'></td></tr>";
                }
                hHeight=$('<div class="YH-superTable-header" style="position: relative; z-index: 3; overflow: hidden; width:100%;'+options.colHeaderStyle+'"><div class="YH-superTable-headerInner" style="position: relative;width:100000px;"><table style="*float:left;" class="'+$(this).attr('class')+'" ><colgroup>'+$(this).find('colgroup').html()+'</colgroup><tbody>'+emptyTd+'</tbody></table></div></div>').find('table').append($(this).find('thead').prepend(ie7bodyHideTr)).end().prependTo($data).find('thead').height();

                $data.find('.YH-superTable-header').height(hHeight+bwidth+ie7width);

                //如果表格有thead,以及固定列数时生成右上角固定小块内容
                if(options.fixedCols > 0 ){
                    $('<div class="YH-superTable-fHeader" style="position:absolute; z-index: 4; overflow: hidden; width:100px;  height:'+(hHeight+bwidth+ie7width)+'px; '+options.headerStyle+'"><div style="width:100000px;"><table style="*float:left;" class="'+$(this).attr('class')+'" ><colgroup>'+$(this).find('colgroup').html()+'</colgroup><thead>'+$data.find('thead').html()+'</thead><tbody>'+emptyTd+'</tbody></table></div></div>').prependTo($data);
                }
            }
            var conHeight = parseInt($data.parent().css('max-height')) || 500;//容器高度
            var curBaseHeight = $data.height();//设置完后的表格高度
            var dataHeight = "auto";
            if(curBaseHeight>=conHeight){
                $data.css('max-height',conHeight+"px");
                dataHeight = conHeight-hHeight;
            }else{
                $data.css('max-height',conHeight+"px");
                dataHeight = conHeight-hHeight;
            }
            //兼容原生IE8下 滚动条超出超级表格范围 不可见
            if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){
                if(dataHeight != "auto")
                    dataHeight = dataHeight-20;
            }
            $tableData = $(this).children('tbody').prepend(ie7bodyHideTr).end().parent().parent().attr('style','position: relative; z-index: 2; overflow: auto; top: -1px; max-height: '+dataHeight+'px; width:100px; '+options.tableStyle);

            //如果设置固定列数时生成右侧固定列
            if(options.fixedCols >0){
                var cols='';
                $(this).find('colgroup col:lt('+options.fixedCols+')').each(function(index, element) {
                    cols+=this.outerHTML;
                });

                hWidth=$('<div class="YH-superTable-fData" style="top:'+hHeight+'px;width:100px;position: absolute; z-index: 1; '+options.rowHeaderStyle+'"><div class="YH-superTable-fDataInner" style="position:relative; width:1920px; top: 0px;"><table style="*float:left;" class="'+$(this).attr('class')+'"><colgroup>'+cols+'</colgroup>'+$tBody[0].outerHTML+'</table></div></div>').prependTo($data).find('table').outerWidth();
                $tableData.css('left', hWidth);
            }

            //内容滚动时固定头部同步滚动
            $(this).css({"margin-left": "-"+hWidth+"px","max-width":"inherit"}).parent().width($(this).outerWidth()-hWidth).parent().width(pWidth-hWidth);
            $data.children('.YH-superTable-fData').width(hWidth).end()
                .children('.YH-superTable-fHeader').width(hWidth+bwidth).end()
                .children('.YH-superTable-data').scroll(function(){
                $(this).prevAll('.YH-superTable-header').children('.YH-superTable-headerInner').css('left',-$(this).scrollLeft());
                $(this).prevAll('.YH-superTable-fData').children('.YH-superTable-fDataInner').css('top',-$(this).scrollTop());
            });

            $fData=$data.find('.YH-superTable-fDataInner tr');

            if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
                $(this).find('tbody tr').each(function(index, element){
                    //以下代码兼容ie8处理，ie8中不能直接使用tr的高度
                    var h=$(this).innerHeight();

                    trHeight.push(h);
                })
                $(this).find('tbody tr').each(function(index, element){
                    $(this).children('[rowspan="1"]:first,:not([rowspan]):first').first().height(trHeight[index]);
                });
            }

            $(this).find('tbody tr').each(function(index, element){

                //以下代码兼容ie8处理，ie8中不能直接使用tr的高度
                if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/MSIE 8./i)=="MSIE 8."){
                    var h=$(this).children('[rowspan="1"]').outerHeight();
                }else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/MSIE 7./i)=="MSIE 7."){
                    //ie7兼容问题处理
                    var h=$(this).innerHeight()+5;
                }else{
                    var h=$(this).innerHeight();
                    //var h=$(this).children(':not([rowspan])').innerHeight();
                }
                //$(this).height(h);
                if($data.css('min-height') == "20px"){
                    $data.children('.YH-superTable-data').find('td').each(function(){
                        if($(this).text()=="") $(this).html('&nbsp;'); //兼容IE7 时td内容为空时 边框消失
                    });
                }
                trHeight.push(h);
                $fData.eq(index).height(h);
            });

            /*					if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){
             $(this).find('tbody tr').each(function(index, element){
             $(this).children('[rowspan="1"]:first,:not([rowspan]):first').first().height(trHeight[index]-22);
             })
             } else{
             $(this).find('tbody tr').each(function(index, element){
             $(this).height(trHeight[index]);
             })
             }*/
            if(navigator.appName != "Microsoft Internet Explorer" ||  navigator.appVersion.match(/9./i)!="9."){
                $(this).find('tbody tr').each(function(index, element){
                    $(this).height(trHeight[index]);
                });
            }
            //结束时的回调函数
            if(options.onFinish){
                options.onFinish.call($(this).closest('.YH-superTable-base')[0]);
            }

            // 按住ctrl键移动表格
            var moveData = {
                moveState: false
            };
            $data.children('.YH-superTable-data').mousedown(function (e) {
                moveData.initScrollTop = $(this).scrollTop();
                moveData.initScrollLeft = $(this).scrollLeft();
                moveData.initX = e.screenX;
                moveData.initY = e.screenY;
                if (e.ctrlKey) {
                    moveData.moveState = true;
                    return false;
                }
            }).mousemove(function (e) {
                var $this = $(this);
                if (e.ctrlKey) {
                    $this.css({'cursor': 'move'});
                    if (moveData.moveState) {
                        $this.scrollTop(moveData.initScrollTop + moveData.initY - e.screenY );
                        $this.scrollLeft(moveData.initScrollLeft + moveData.initX - e.screenX );
                    }
                    return false;
                } else {
                    $this.css({'cursor': 'default'});
                }
            }).mouseup(function (e) {
                moveData.moveState = false;
            });

            //全屏功能
            if(options.fullScreen){
                var oldBodyStyle = "",oldTableDataStyle = "",oldTableStyle = "";
                var $fullStreenBtn = $('<div class="YH-superTable-fullscreen" style="position: absolute; top: 0; left: 0; padding: 2px 5px; background: #333; cursor: pointer; color:#fff">全屏查看</div>');
               
                var resizeTable=function(){
                    $data.css({width:"100%",height:$(window).height(),position:"fixed",top:0,left:0,zIndex:10000, maxHeight: ''});
                    $data.children('.YH-superTable-data').css({width:$data.width()-hWidth,height:$data.height()-hHeight, maxHeight: ''});
                };
                $data.children('.YH-superTable-fHeader').append($fullStreenBtn.fadeTo("fast",0.15));

                $fullStreenBtn.click(function(e){
                    if(oldTableStyle){
                        $fullStreenBtn.text('全屏查看');
                        $('body').attr('style',oldBodyStyle || "");
                        $(window).unbind('resize',resizeTable);
                        $data.children('.YH-superTable-data').attr('style',oldTableDataStyle);
                        $data.attr('style',oldTableStyle).attr('fullscreen','false');
                        oldTableStyle=oldTableDataStyle=oldBodyStyle="";
                    }else{
                        $fullStreenBtn.text('退出全屏');
                        oldBodyStyle=$('body').attr('style');
                        oldTableDataStyle=$data.children('.YH-superTable-data').attr('style');
                        oldTableStyle=$data.attr('style');
                        $data.attr('fullscreen','true');
                        $('body').css({overflow:"hidden"});
                        resizeTable();
                        $(window).bind("resize",resizeTable);
                    }
                    //事件冒泡
                    if (e.stopPropagation) {//fireFox chrome
                        e.stopPropagation();
                    }else if (window.event) {//IE
                        window.event.cancelBubble = true;
                    }
                }).mouseenter(function(){
                    $(this).stop().fadeTo( "fast",1);
                }).mouseleave(function(){
                    $(this).stop().fadeTo("fast",0.15);
                });
            }
        });
        return this;
    }
})(jQuery);

;(function($){
    $.fn.MZSuperTable = function(options){
        var opts = $.extend({}, {
            fixHead:true,
            leftFixedCols: 0, //固定列数
            rightFixedCols: 0, //固定列数
            maxHeight:"500",
            callback:function(){console.log(this)}
        }, options);
        //浏览器判断
        var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
        //return false
        var self = $(this), tableClass = self.attr('class'),$tableCon = self.parent(),
            $tableCol = self.children('colgroup'), $tableThead = self.children('thead'),
            $tableTbody = self.children('tbody'), leftCols = opts.leftFixedCols,rightCols = opts.rightFixedCols,
            tableWidth = 0,maxWidth = $tableCon.width(),totalCols=$tableCol.children().length;

        var $mainCon,$midCon,scrollWidth=isChrome?17:18,border_right=isChrome?"0":"1px solid #c6c6c6",bodyCon=true;

        var $content = $('<div class="mz-table-content"></div>').css({'max-width':maxWidth+"px","position":"relative"}), //主容器
            $scroll = $('<div class="mz-table-scroll"></div>'),   //固定表头容器
            $fixedLeft = $('<div class="mz-table-fixed-left" style="position:absolute;top:0;left:0;overflow:hidden;"></div>'),  //固定左侧列 容器
            $fixedRight = $('<div class="mz-table-fixed-right" style="position:absolute;top:0;right:'+scrollWidth+'px;overflow:hidden;"></div>'),  //固定右侧列容器
            $innerDiv = $('<div class="mz-table-body-inner"></div>'),
            headerCon = $('<div class="mz-table-header"></div>').css({'overflow':"scroll","margin-bottom":"-17px","padding-bottom":0,"border-right":border_right}),
            bodyCon = $('<div class="mz-table-body"></div>').css({"max-height":opts.maxHeight+"px","overflow-x":"auto","overflow-y":"scroll","border-right":border_right}),
            fixTable = $('<table class="mz-table-fixed '+tableClass+'"></table>').append($tableCol);        

        $tableCol.children().each(function(){
            var cur = $(this),cw = +cur.attr("width")||cur.width();
            tableWidth += cw;
            cur.removeAttr('width')
            cur.css({'width':cw+"px","min-width":cw+"px"});
        });

        //固定表头
        if(opts.fixHead){
            var hc = headerCon.clone(),bc = bodyCon.clone();
            hc.append(fixTable.clone().append($tableThead.clone()).css({'width':tableWidth+"px","max-height":"auto","max-width":"10000px"}));
            bc.append(fixTable.clone().append($tableTbody.clone()).css({'width':tableWidth+"px","max-height":"auto","max-width":"10000px"}));
            
            $scroll.append(hc).css({'width':maxWidth+"px","overflow":"hidden"});
            if(bc.find('tr').length>0) {
                $scroll.append(bc);
            }else{
                hc.css('margin-bottom',"0px");
            };

            $content.append($scroll);
            bc.hover(function(){
                bc.off('scroll').on('scroll',function(){ //联动滚动条
                    var self = this;
                    hc[0].scrollLeft = self.scrollLeft;
                    var leftCon = $('.mz-table-fixed-left'),rightCon = $('.mz-table-fixed-right');
                    if(leftCon&&leftCon.find('.mz-table-body-inner').length>0){
                        leftCon.find('.mz-table-body-inner')[0].scrollTop = self.scrollTop;
                        rightCon.find('.mz-table-body-inner')[0].scrollTop = self.scrollTop;
                    }
                });
            },function(){
                bc.off('scroll');
            });
            
            //替换整个表格
            $tableCon.html($content);
            $mainCon = $('.mz-table-content');
            $midCon = $mainCon.find('.mz-table-scroll');
        }
        //固定左侧列
        if(leftCols !== 0){
            var hc2 = headerCon.clone(),bc2 = bodyCon.clone();
            if(leftCols >= 1){
                var leftTtable = fixTable.clone(),leftWidth=0;
                leftTtable.find('col:eq('+(leftCols-1)+')').nextAll().remove();
                leftTtable.find('col').each(function(){
                    var cur = $(this),cw = +cur.attr("width")||cur.width();
                    leftWidth += cw;
                });

                hc2.append(leftTtable.clone().append(
                    getLeftContent($mainCon.find('.mz-table-header thead').children(),'thead')
                )).css({"overflow":"hidden","margin-bottom":0});
                bc2.append($innerDiv.clone().css('width',(+leftWidth+scrollWidth)+"px").append(
                    leftTtable.clone().append(
                        getLeftContent($mainCon.find('.mz-table-body tbody').children(),"tbody")
                    )
                ).css({"overflow-y":"scroll","overflow-x":"auto","max-height":opts.maxHeight-scrollWidth})).css({"overflow":"hidden"});
                $fixedLeft.append(hc2).append(bc2).css({"width":leftWidth,"height":$mainCon.height()-scrollWidth});
                
                $fixedLeft.find('tbody tr').length>0 && $mainCon.append($fixedLeft);

                $fixedLeft.find('.mz-table-body-inner').hover(function(){
                    $fixedLeft.find('.mz-table-body-inner').on('scroll',function(){
                        $midCon.find('.mz-table-body')[0].scrollTop = this.scrollTop;
                        $('.mz-table-fixed-right').find('.mz-table-body-inner')[0].scrollTop = this.scrollTop;
                    });
                },function(){
                    $fixedLeft.find('.mz-table-body-inner').off('scroll');
                });
            }
        }
        //固定右侧
        if(rightCols){
            var hc3 = headerCon.clone(),bc3 = bodyCon.clone();
            if(rightCols>=1){
                var rightTable = fixTable.clone(),rightWidth=0;
                rightTable.find('col:eq('+(totalCols-rightCols)+')').prevAll().remove();
                rightTable.find('col').each(function(){
                    var cur = $(this),cw = +cur.attr("width")||cur.width();
                    rightWidth += cw;
                });
                hc3.append(rightTable.clone().append(
                    getLeftContent($mainCon.find('.mz-table-header thead').children(),'thead','back')
                )).css({"overflow":"hidden","margin-bottom":0});
                bc3.append($innerDiv.clone().css('width',(+rightWidth+scrollWidth)+"px").append(
                    rightTable.clone().append(
                        getLeftContent($mainCon.find('.mz-table-body tbody').children(),'tbody','back')
                    )).css({"overflow-y":"scroll","overflow-x":"auto","max-height":opts.maxHeight-scrollWidth})
                ).css({"overflow":"hidden"});
                
                $fixedRight.append(hc3).append(bc3).css({"width":rightWidth,"height":$mainCon.height()-scrollWidth})
                
                $fixedRight.find('tbody tr').length>0 && $mainCon.append($fixedRight);

                $fixedRight.find('.mz-table-body-inner').hover(function(){
                    $fixedRight.find('.mz-table-body-inner').on('scroll',function(){
                        $midCon.find('.mz-table-body')[0].scrollTop = this.scrollTop;
                        $('.mz-table-fixed-left').find('.mz-table-body-inner')[0].scrollTop = this.scrollTop;
                    });
                },function(){
                    $fixedRight.find('.mz-table-body-inner').off('scroll');
                });
            }
        }

        opts.callback.call($mainCon)

        function getLeftContent(trs,type,poi){
            var x=0,y=0,poiLeft;
            var htmlDom = type==="tbody"?'<tbody>':'<thead>';
            trs.each(function(index,ele){ //行
                var curTr = $(this),index = index+1,poiX = 0,trHeight=0,curTrClass=curTr.attr('class')||"";
                htmlDom += '<tr class="'+curTrClass+'">';
                curTr.children().each(function(ind2,ele2){ //单元格
                    var curTd = $(this),curCol=curTd.attr('colspan')?curTd.attr('colspan'):1,
                        curRow=curTd.attr('rowspan')?curTd.attr('rowspan'):1,
                        curLeft = curTd.offset().left,curHeight = curTd.height();

                    if(index===1){ //第一行
                        poiX += +curCol;
                        if(poi === "back"){
                            if(poiX>(totalCols-opts.rightFixedCols)){
                                curTd.prev().nextAll().clone().each(function(){
                                    this.style.height = curHeight+"px";
                                    htmlDom += this.outerHTML;
                                });
                                poiLeft = parseInt(curLeft)||0;
                                return false;
                            }
                        }else{
                            if(poiX>opts.leftFixedCols){
                                if(curTd.prevAll().length>0){
                                    var prependHTML = "";
                                    curTd.prevAll().clone().each(function(){
                                        this.style.height = curHeight+"px";
                                        prependHTML = this.outerHTML + prependHTML;
                                    });
                                }
                                htmlDom += prependHTML;
                                poiLeft = parseInt(curLeft)||0;
                                return false;
                            }
                        }
                    }else{
                        if(poi === "back"){
                            if(curLeft>=poiLeft){
                                curTd.prev().nextAll().clone().each(function(){
                                    this.style.height = curHeight+"px";
                                    htmlDom += this.outerHTML;
                                });
                                return false;
                            }
                        }else{
                            if(ind2===1 && curLeft > (+poiLeft+10)){//第二行后的每行第一个
                                return false;
                            }else if(curLeft>=poiLeft){ //IE8中 不能识别450.5
                                var prependHTML = "";
                                if(curTd.prevAll().length>0){
                                    curTd.prevAll().clone().each(function(){
                                        this.style.height = curHeight+"px";
                                        prependHTML = this.outerHTML + prependHTML;
                                    });
                                }
                                htmlDom += prependHTML;
                                return false;
                            }
                        }
                    }
                });
                htmlDom += "</tr>";
            });
            htmlDom += type==="tbody"?'</tbody>':'</thead>';
            return $(htmlDom);
        }
    }
})(jQuery);