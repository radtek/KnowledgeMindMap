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
				tableStyle:'background-color:#fff'
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

	
				//以下判断优化ie9的wrap方法效率低的问题
				if($(this).parent('.superTableDiv').parent('.superTableDiv').parent('.superTableDiv').length===1){
					$p=$(this).parent().parent().parent().parent();
					
					if($p.children().length===1 && $p.height()<$(window).height()){
						pWidth=$p.width();
						pHeight=$p.height();
						$p.css('overflow','visible');
					}else{
						pWidth=$p.width();
						pHeight=500;
					}
					if(window.navigator.userAgent.indexOf("Chrome") !== -1){
						$(this).prependTo($p).removeAttr('width').width('auto').wrap('<div class="YH-superTable-base" style="position: relative; width: 100%; height: '+pHeight+'px; overflow: hidden;"><div class="YH-superTable-data"><div style="width:100000px;"></div></div></div>');
						$p.find('.superTableDiv').remove();
					}else{
						$(this).removeAttr('width').width('auto').parent().removeAttr('class').width(100000).parent().attr('class','YH-superTable-data').parent().attr('class','YH-superTable-base').attr('style','position: relative; width: 100%; height: '+pHeight+'px; overflow: hidden;');
					}
					
				}else{
					
					
					if($p.children().length===1 && $p.height()<$(window).height()){
						pWidth=$p.width();
						pHeight=$p.height();
						$p.css('overflow','visible');
					}else{
						pWidth=$p.width();
						pHeight=500;
					}
				
					$(this).removeAttr('width').width('auto').wrap('<div class="YH-superTable-base" style="position: relative; width: 100%; height: '+pHeight+'px; overflow: hidden;"><div class="YH-superTable-data"><div style="width:100000px;"></div></div></div>');
				}
				
				var $data=$(this).parent().parent().parent();
				
				if(parseInt(options.colLength)>0){
					colLen=parseInt(options.colLength);
				}else{
					$(this).find('tr:first').children().each(function(index, element) {
						colLen+=$(this).attr('colspan')*1 || 1;
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
						
					}
					var rowspan=[];
					var colspan=[];
					var $tBody=$('<tbody>'+ie7fixColHideTr+'</tbody>');

					$(this).find('tbody tr').each(function(index, element){
						
						var rowLength=rowspan.length;
						var $tr=$('<tr></tr>');
						
						//逐个单元格遍历
						$(this).children().each(function(j, el) {
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
						})
						colspan=tempArr;
					});
					
					
				}
				
				
				//如果表格有thead时生成固定行
				if($(this).find('thead').length==1){
					
					if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){
						ie7width=3;
						ie7bodyHideTr="<tr style='display:none;'><td colspan='"+colLen+"'></td></tr>";
					}
					hHeight=$('<div class="YH-superTable-header" style="position: absolute; z-index: 3; overflow: hidden; width:100%;'+options.colHeaderStyle+'"><div class="YH-superTable-headerInner" style="position: relative;width:100000px;"><table class="'+$(this).attr('class')+'" ><colgroup>'+$(this).find('colgroup').html()+'</colgroup><tbody>'+emptyTd+'</tbody></table></div></div>').find('table').append($(this).find('thead').prepend(ie7bodyHideTr)).end().prependTo($data).find('thead').height();
					
					$data.find('.YH-superTable-header').height(hHeight+bwidth+ie7width);
					
					//如果表格有thead,以及固定列数时生成右上角固定小块内容
					if(options.fixedCols >0 ){
						$('<div class="YH-superTable-fHeader" style="position:absolute; z-index: 4; overflow: hidden; width:100px;  height:'+(hHeight+bwidth+ie7width)+'px; '+options.headerStyle+'"><div style="width:100000px;"><table class="'+$(this).attr('class')+'" ><colgroup>'+$(this).find('colgroup').html()+'</colgroup><thead>'+$data.find('thead').html()+'</thead><tbody>'+emptyTd+'</tbody></table></div></div>').prependTo($data);
					}
				}
				
								
				$(this).children('tbody').prepend(ie7bodyHideTr).end().parent().parent().attr('style','position: absolute; z-index: 2; overflow: auto; bottom: 0px; right: 0px; height: '+(pHeight-hHeight)+'px; width:100px; '+options.tableStyle);
				
				
				//如果设置固定列数时生成右侧固定列
				if(options.fixedCols >0){
					var cols='';
					$(this).find('colgroup col:lt('+options.fixedCols+')').each(function(index, element) {
                        cols+=this.outerHTML;
                    });
				
					hWidth=$('<div class="YH-superTable-fData" style="top:'+hHeight+'px;width:100px;position: absolute; z-index: 1; '+options.rowHeaderStyle+'"><div class="YH-superTable-fDataInner" style="position:relative; width:1920px; top: 0px;"><table class="'+$(this).attr('class')+'"><colgroup>'+cols+'</colgroup>'+$tBody[0].outerHTML+'</table></div></div>').prependTo($data).find('table').outerWidth();
					
					
				}
				
				//内容滚动时固定头部同步滚动
				$(this).css({"margin-left": "-"+hWidth+"px"}).parent().width($(this).outerWidth()-hWidth).parent().width(pWidth-hWidth);
				$data.children('.YH-superTable-fData').width(hWidth).end()
					.children('.YH-superTable-fHeader').width(hWidth+bwidth).end()
					.children('.YH-superTable-data').scroll(function(){
					$(this).prevAll('.YH-superTable-header').children('.YH-superTable-headerInner').css('left',-$(this).scrollLeft());
					$(this).prevAll('.YH-superTable-fData').children('.YH-superTable-fDataInner').css('top',-$(this).scrollTop());
				})
				
				
				$fData=$data.find('.YH-superTable-fDataInner tr');
				
				if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){ 
					$(this).find('tbody tr').each(function(index, element){
							//以下代码兼容ie8处理，ie8中不能直接使用tr的高度
							var h=$(this).innerHeight();
							
							trHeight.push(h);
					})
					$(this).find('tbody tr').each(function(index, element){
							$(this).children('[rowspan="1"]:first,:not([rowspan]):first').first().height(trHeight[index]);
					})
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
						trHeight.push(h);
						$fData.eq(index).height(h)
				})
					
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
						})
					}
				//结束时的回调函数
				if(options.onFinish){
					options.onFinish.call($(this).closest('.YH-superTable-base')[0]);
				}
			});  
			
			return this;
			
		}

})(jQuery)