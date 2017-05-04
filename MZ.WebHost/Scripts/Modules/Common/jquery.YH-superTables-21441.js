/////////////////////////////////////////////////////////////////////////////////////////
// YH-SuperTable 银禾系统超级表格 
// 应用于固定表头
// 时间：2014.8.29
// 作者： zuizui Yinhoo
// huangzuizui@gmail.com
/////////////////////////////////////////////////////////////////////////////////////////
////// EXAMPLES:
//jqueryObj.YHsuperTable{
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
//}
////// ISSUES / NOTES:
// 应用超级表格，表必须包含<thead><tbody>标签，table必须有width绝对宽度
////////////////////////////////////////////////////////////////////////////////////////
;(function($){
		$.fn.YHsuperTable=function(options){
			options=$.extend({
				headerRows : 1,
				fixedCols : 1,
				colAutoWidth : null,
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
				var pWidth;
				var pHeight;
				var hHeight=0;
				var hWidth=0;
				var hColsWidth=[];
				var bwidth=1;
				var tWidth=0;
				var colLen=0;
				var emptyTd='';
				var ie7width=0;
				
				var $p=$(this).parent();
				if($p.children().length===1 && $p.height()<$(window).height()){
					pWidth=$p.width();
					pHeight=$p.height();
				}else{
					pWidth=$p.width();
					pHeight=500;
				}
				
				if(parseInt(options.colLength)>0){
					colLen=parseInt(options.colLength);
				}else{
					$(this).find('tr:first').children().each(function(index, element) {
						colLen+=$(this).attr('colspan')*1 || 1;
					});
				}
				if(options.colAutoWidth || $.type(options.colWidth) == "array"){
					var cols='';
					for(var i=0;i<colLen;i++){
						var colWidth=options.colWidth && options.colWidth[i] > 0 ? options.colWidth[i]*1 : (options.colAutoWidth || 120);
						cols+='<col width="'+colWidth+'">';
						tWidth+=colWidth;
						
						//获取固定列数的宽度hWidth；
						if(i<options.fixedCols) hWidth+=colWidth*1;
					
					}
					$(this).width(tWidth);
					if($(this).find('colgroup').length>0){
						$(this).find('colgroup').html(cols);
					}else{
						$(this).prepend("<colgroup>"+cols+"</colgroup>");
					}
					
				}
				
				if(options.fixedCols >0){
					
					//ie7 colspan bug处理，在固定行的表格中加入空td
					if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){
						ie7width=colLen;
						for(var i=0;i<colLen;i++){
							emptyTd+='<td>&nbsp;</td>';
						}
					}
					var rowspan=[];
					var colspan=[];
					var $tBody=$('<tbody></tbody>');
					$(this).find('tbody tr').each(function(index, element) {
						
						var fixcol;
						var rowLength=rowspan.length;
						
						//以下代码兼容ie8处理，ie8中不能直接使用tr的高度
						if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8."){
							var h=$(this).children('[rowspan="1"]').outerHeight();
						}else{
							var h=$(this).outerHeight();
						}
						
						$(this).height(h);
						var $tr=$('<tr style="height:'+h+'px"></tr>');
						
						
						$(this).children().each(function(j, el) {
							var colLength=0;
							
							if($(this).attr('colspan')>1){
								var arr=[];
								var arrLen=$(this).attr('rowspan') ? $(this).attr('rowspan') : 1;
								for(var i=0;i<arrLen;i++){
									arr.push($(this).attr('colspan')-1);
								}
								colspan.push(arr);
							}
							
							for(var i=0;i<colspan.length;i++){
								colLength+=colspan[i][0];
							}
							
							var len=j+parseInt($(this).attr('colspan') ? $(this).attr('colspan') : 1)+rowLength+colLength;
							
							if($(this).attr('rowspan')>1) rowspan.push($(this).attr('rowspan'));
							
							
							$tr.append($(this).clone());
							//alert('j:'+j+'------len:'+len+'------arr:'+rowspan+'-------colLength:'+colLength);
							
                            if(len>=options.fixedCols){
								return false;
							}
                        });
						
						$tBody.append($tr);	
						
						//alert($tBody.html())
						rowspan=$.map(rowspan , function(n){
							if(n-1) return n-1;
						});
						//alert(colspan);
						//console.log(colspan);
						var tempArr=[];
						$.each(colspan,function(n,m){
							if(m.length>1){
								m.pop();
								tempArr.push(m);
							}
						})
						colspan=tempArr;
						//alert(colspan);
						//console.log(colspan);
					});
					
					
				}
				
/*				hHeight=$(this).children('thead').outerHeight();
				if(!confirm('hh')){
					return;
				}*/
				
				var $data=$('<div class="YH-superTable-base" style="position: relative; width: 100%; height: '+pHeight+'px; overflow: hidden;"></div>')
				$data.insertAfter(this);
				
				
				
				//如果表格有thead时生成固定行
				if($(this).find('thead').length==1){
					hHeight=$('<div class="YH-superTable-header" style="position: absolute; z-index: 3; overflow: hidden; width:100%;'+options.colHeaderStyle+'"><div class="YH-superTable-headerInner" style="position: relative;"><table class="'+$(this).attr('class')+'" style="width:'+(tWidth+ie7width)+'px;"><colgroup>'+$(this).find('colgroup').html()+'</colgroup><tbody>'+emptyTd+'</tbody></table></div></div>').find('table').append($(this).find('thead')).end().prependTo($data).find('thead').height();
					
					$data.find('.YH-superTable-header').height(hHeight+bwidth);
					
					//如果表格有thead,以及固定列数时生成右上角固定小块内容
					if(options.fixedCols >0 ){
						$('<div class="YH-superTable-fHeader" style="position:absolute; z-index: 4; overflow: hidden; width:'+(hWidth+bwidth)+'px;  height:'+(hHeight+bwidth)+'px; '+options.headerStyle+'"><table class="'+$(this).attr('class')+'" style="width:'+(tWidth+ie7width)+'px;" ><colgroup>'+$(this).find('colgroup').html()+'</colgroup><thead>'+$data.find('thead').html()+'</thead><tbody>'+emptyTd+'</tbody></table></div>').prependTo($data);
					}
				}
				
				
				
				$(this).css({"margin-left": "-"+(hWidth+bwidth)+"px","width":(tWidth+ie7width)}).wrap('<div class="YH-superTable-data" style="position: absolute; z-index: 2; overflow: auto; bottom: 0px; right: 0px; height: '+(pHeight-hHeight)+'px; width:'+(pWidth-hWidth-bwidth*3)+'px; '+options.tableStyle+'"></div>').parent().appendTo($data);
				
				
				
				
				
				
				//如果设置固定列数时生成右侧固定列
				if(options.fixedCols >0){
					var cols='';
					$(this).find('colgroup col:lt('+options.fixedCols+')').each(function(index, element) {
                        cols+=this.outerHTML;
                    });
				
					$('<div class="YH-superTable-fData" style="top:'+hHeight+'px;width:'+(hWidth+bwidth*3)+'px;position: absolute; z-index: 1; '+options.rowHeaderStyle+'"><div class="YH-superTable-fDataInner" style="position: relative; top: 0px;"><table class="'+$(this).attr('class')+'" style="width:'+(hWidth+bwidth*3)+'px"><colgroup>'+cols+'</colgroup></table></div></div>').find('table').append($tBody).end().prependTo($data);
				}
				//内容滚动时固定头部同步滚动
				$data.children('.YH-superTable-data').scroll(function(){
					$(this).prevAll('.YH-superTable-header').children('.YH-superTable-headerInner').css('left',-$(this).scrollLeft());
					$(this).prevAll('.YH-superTable-fData').children('.YH-superTable-fDataInner').css('top',-$(this).scrollTop());
				})
				//结束时的回调函数
				if(options.onFinish){
					options.onFinish.call($(this).closest('.YH-superTable-base')[0]);
				}
			});  
			
			
			return this;
			
		}

})(jQuery)