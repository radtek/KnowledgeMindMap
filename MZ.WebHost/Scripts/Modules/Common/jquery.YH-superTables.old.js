/////////////////////////////////////////////////////////////////////////////////////////
// YH-SuperTable 银禾系统超级表格 
// 应用于固定表头
// 时间：2014.8.29
// 作者： zuizui Yinhoo
// huangzuizui@gmail.com
/////////////////////////////////////////////////////////////////////////////////////////
////// EXAMPLES:
//jqueryObj.YHsuperTable({
//	headerRows : 1,//固定的表头行数
//	fixedCols : 1,//固定的表头列数
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
				colAutoWidth : null,
				colWidth : null,
				colLength : 0,
				headerStyle:'background-color:#bbb',
				colHeaderStyle:'background-color:#ccc',
				rowHeaderStyle:'background-color:#ddd',
				tableStyle:'background-color:#fff'
			},options);
			this.each(function() {
				//检查表格是否已经应用过超级表格
				if($(this).parents('.YH-superTable-base').length>0) return;
				//检查表格格式是否符合要求
				if(this.tagName.toLowerCase()!='table'){
					alert('超级表格只能应用于table标签');
					return;
				}else if($(this).children('thead').length<1){
					alert('表格格式不符合要求，表格中必须包含thead标签');
					return;
				}else if($(this).children('tbody').length<1){
					alert('表格格式不符合要求，表格中必须包含tbody标签');
					return;
				}
				
				//开始时的回调函数
				if(options.onStart){
					options.onStart.call(this);
				}
				
				var pWidth=$(this).parent().width();
				var pHeight=$(this).parent().height();
				var hHeight=0;
				var hWidth=0;
				var tWidth=0;
				var colLen=0;
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
					}
					$(this).attr('width',tWidth);
					if($(this).children('colgroup').length>0){
						$(this).children('colgroup').html(cols);
					}else{
						$(this).prepend("<colgroup>"+cols+"</colgroup>");
					}
					
				}
				
				if(options.headerRows>0){
					hHeight=$(this).children('thead').outerHeight();
					var $tHeader=$(this).clone().removeAttr('id');
				}
				if(options.fixedCols >0){
					var colNum=0;
					for(var colNum=0,i=0;colNum<options.fixedCols;i++){
						var $td=$(this).find('tr:first').children().eq(i);
						hWidth+=$td.outerWidth()*1;
						colNum+=$td.attr('colspan') || 1;
					}
					//hWidth+=tdBorder;
					var $tBody=$(this).clone().removeAttr('id');
				}
				var $tFHeader=$(this).clone().removeAttr('id');
				$(this).css({"margin-top":"-"+hHeight+"px", "margin-left": "-"+hWidth+"px"}).wrap('<div class="YH-superTable-base" style="position: relative; width: 100%; height: 100%; overflow: hidden;"><div class="YH-superTable-data" style="position: absolute; z-index: 2; overflow: auto; bottom: 0px; right: 0px; height: '+(pHeight-hHeight)+'px; width:'+(pWidth-hWidth)+'px; '+options.tableStyle+'"></div>');
				var $data=$(this).parent();
				
				if(options.headerRows>0 && options.fixedCols >0 ){
					$tFHeader.insertBefore($data).wrap('<div class="YH-superTable-fHeader" style="position:absolute; z-index: 4; overflow: hidden; width:'+hWidth+'px;  height:'+hHeight+'px; '+options.headerStyle+'"></div>');
				}
				if(options.headerRows>0){
					$tHeader.insertBefore($data).wrap('<div class="YH-superTable-header" style="position: absolute; z-index: 3; overflow: hidden; width:100%; height:'+hHeight+'px;'+options.colHeaderStyle+'"><div class="YH-superTable-headerInner" style="position: relative;"></div></div>');
				}
				
				if(options.fixedCols >0){
					$tBody.insertBefore($data).wrap('<div class="YH-superTable-fData" style="position: absolute; z-index: 1; '+options.rowHeaderStyle+'"><div class="YH-superTable-fDataInner" style="position: relative; top: 0px;"></div></div>');
				}
				
				$data.scroll(function(){
					$(this).prevAll('.YH-superTable-header').children('.YH-superTable-headerInner').css('left',-$(this).scrollLeft());
					$(this).prevAll('.YH-superTable-fData').children('.YH-superTable-fDataInner').css('top',-$(this).scrollTop());
				})
				//结束时的回调函数
				if(options.onFinish){
					options.onFinish.call(this);
				}
			});  
			return this;
			
		}

})(jQuery)