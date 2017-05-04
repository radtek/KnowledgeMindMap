var fromNodeId;
$('#YH-FM-drawLineBtn').toggle(function(){
	//alert()
	$(this).addClass('YH-FM-highlight');
	$('#YH-FM-canvas').attr('class','YH-FM-fromCursor');
	$('.YH-FM-box').live('click',function(){
		
		//alert(fromNodeId)
		if(fromNodeId && fromNodeId != $(this).attr('id')){
			$('#YH-FM-canvas').attr('class','YH-FM-toCursor');
			//alert(11)
			//alert($("#"+fromNodeId).length)
			//$(this).attr('from',fromNodeId);
			if(!checkAttr($(this),'from',fromNodeId) || !checkAttr($("#"+fromNodeId),'to',$(this).attr('id'))){
				alert('连线已经存在！');
				return false;
			}
			//$("#"+fromNodeId).attr('to',$(this).attr('id'));
			
			drawline($("#"+fromNodeId),$(this));
			
			$('#YH-FM-canvas').attr('class','YH-FM-fromCursor');
			fromNodeId='';
		}else{
			//alert(20)
			fromNodeId=$(this).attr('id');
			$('#YH-FM-canvas').attr('class','YH-FM-toCursor');
			//drawline(fromNode,$('#b13'))
		}
	}).live('mouseenter',function(){
		$('.YH-FM-cur').removeClass('YH-FM-cur');
		$('#c'+$(this).attr('id')).addClass('YH-FM-cur');
	}).live('mouseleave',function(){
		$('#c'+$(this).attr('id')).removeClass('YH-FM-cur');
	})
},function(){
	$(this).removeClass('YH-FM-highlight');
	//alert('drawline nono')
	$('.YH-FM-box').die('click');
	$('#YH-FM-canvas').removeAttr('class');
	fromNodeId='';
})

$("#YH-FM-mindMap .YH-FM-box").live('mouseenter',function(){
	$(this).resizable({
		grid: initGrid,
		alsoResize:'#c'+$(this).attr('id'),
		stop: function() {
			reDrawLine($(this));
			$('#c'+$(this).attr('id')).css({'height':$(this).css('height'),'width':$(this).css('width')});
			
		}
	}).draggable({ grid: [ initGrid, initGrid ], cursor: "move",opacity: 0.7,
		drag: function() {
			$('#c'+$(this).attr('id')).css({'top':$(this).css('top'),'left':$(this).css('left')});
		},
		stop: function() {
			
			reDrawLine($(this));
			$('#c'+$(this).attr('id')).css({'top':$(this).css('top'),'left':$(this).css('left')});
			
		}
	});
})
$(".YH-FM-table1 tr td").live('mouseenter',function(){
	$(this).resizable({
		grid: initGrid
	})
})
$("#YH-FM-bgTable th").live('mouseenter',function(){
	$(this).addClass('ui-resizable');
}).live('mouseleave',function(){
	$(this).removeClass('ui-resizable');
})

$()
$("#YH-FM-addBoxBtn").draggable({ grid: [ 20, 20 ], cursor: "move",opacity: 0.7,helper:"clone"});


//右键菜单
function showNewMenu(e){
	$('#YH-FM-newMenu').show().css({top:e.clientY,left:e.clientX});
	
	$('#YH-FM-mindMap').one('click',function(){
		$('#YH-FM-newMenu').hide()
	})
	if($('#YH-FM-pasteBtn').attr('copyId')){
		$('#YH-FM-pasteBtn').show()
	}else{
		$('#YH-FM-pasteBtn').hide	()
	}
	stopPropagation(e);
	return false;
}
function showMenu(e,cObj,type){
	
	var $cObj=$(cObj);
	$('.YH-FM-boxEditing').removeClass('YH-FM-boxEditing');
	$cObj.addClass('YH-FM-boxEditing');
	if(type=='YH-FM-box'){
		var $bgObj=$('#c'+$cObj.attr('id'));
		var bg=$bgObj.css('background-color');
		var borderColor=$bgObj.css('border-top-color');
		var borderStyle=$bgObj.css('border-top-style');
		var borderWidth=$bgObj.css('border-top-width');
		var isAudit=$cObj.attr('audit')=='1'? true : false;
		var isKey=$cObj.attr('key')=='1'?  true : false;
		var taskType=$cObj.attr('tasktype') || '';
		$('#YH-FM-mapMenu input[name="isAudit"]').attr('checked',isAudit);
		$('#YH-FM-mapMenu input[name="isKey"]').attr('checked',isKey);
		$('#YH-FM-mapMenu input[name="taskType"]').val(taskType);
		$('#YH-FM-boxBorderWidth option[value="'+borderWidth+'"]').attr('selected',true);
		$('#YH-FM-boxBorderStyle option[value="'+borderStyle+'"]').attr('selected',true);
		$('#YH-FM-csBorder i').css('background-color',borderColor);
		$('#YH-FM-csBackground i').css('background-color',bg);
	}else if(type=='YH-FM-col'){
		var headerBg=$cObj.css('background-color');
		var borderColor=$cObj.css('border-right-color');
		var colBg=$cObj.closest('#bgTable').find('col').eq($cObj.index()).css('background-color');
		$('#YH-FM-headerBackground i').css('background-color',headerBg);
		$('#YH-FM-colBorderColor i').css('background-color',borderColor);
		$('#YH-FM-colBackground i').css('background-color',colBg);
		
	}else if(type=='YH-FM-row'){
		
		var headerBg=$cObj.css('background-color');
		var borderColor=$cObj.css('border-bottom-color');
		var rowBg=$cObj.parent().css('background-color');
		$('#YH-FM-headerBackground i').css('background-color',headerBg);
		$('#YH-FM-rowBorderColor i').css('background-color',borderColor);
		$('#YH-FM-rowBackground i').css('background-color',rowBg);
		
	}
	
	var difX=$cObj.offset().left+$cObj.width()+390-$(window).width();
	var difY=$cObj.offset().top+290-$(window).height();
	
	var menuX=difX > 0 ? $cObj.offset().left+$cObj.width() - difX : $cObj.offset().left+$cObj.width();
	var menuY=difY > 0 ? $cObj.offset().top - difY : $cObj.offset().top-10;
	$('#YH-FM-mapMenu').show().css({top:menuY,left:menuX}).attr('class',type);
	
	UE.getEditor('YH-FM-editor').setContent($cObj.children('.boxCon').html());
	
	$('#YH-FM-mindMap').one('click',function(){
		$('#YH-FM-mapMenu').hide()
		$cObj.removeClass('YH-FM-boxEditing');
	})
	
	stopPropagation(e);
	return false;
}

$('#YH-FM-submitUeditor').click(function(){
	$('.YH-FM-boxEditing').attr('title',UE.getEditor('YH-FM-editor').getContentTxt()).children('.boxCon').html(UE.getEditor('YH-FM-editor').getContent());
	$('#YH-FM-mapMenu').hide()
})
$('#YH-FM-copyBox').click(function(){
	$('#YH-FM-pasteBtn').attr('copyId',$('.YH-FM-boxEditing').attr('id'));
	$('#YH-FM-mapMenu').hide()
})
$('#YH-FM-pasteBtn,#YH-FM-newBoxBtn').click(function(){
	var top=Math.round(($('#YH-FM-newMenu').position().top*1-$('#YH-FM-canvas').offset().top*1)/initGrid)*initGrid;
	var left=Math.round(($('#YH-FM-newMenu').position().left*1-$('#YH-FM-canvas').offset().left*1)/initGrid)*initGrid;
	$('#'+$(this).attr('copyId')).clone().children('.ui-resizable-handle').remove().end().appendTo('#YH-FM-boxDrop').css({'top':top,'left':left}).attr('id','b'+(++boxId)).removeAttr('from').removeAttr('to');
	$('#c'+$(this).attr('copyId')).clone().appendTo($('#YH-FM-mindMap #YH-FM-bgBox')).css({'top':top,'left':left}).attr('id','cb'+boxId);
	$('#YH-FM-newMenu').hide()
})

$('#YH-FM-boxBorderWidth').change(function(){
	$("#c"+$('.YH-FM-boxEditing').attr('id')).css('border-width', $(this).val());
	
})
$('#YH-FM-boxBorderStyle').change(function(){
	$("#c"+$('.YH-FM-boxEditing').attr('id')).css('border-style', $(this).val());
	
})
$('#YH-FM-mapMenu input[name="isAudit"]').change(function(){
	$('.YH-FM-boxEditing').attr('audit',($(this).is(':checked')? "1" : "0"));
})
$('#YH-FM-mapMenu input[name="isKey"]').change(function(){
	$('.YH-FM-boxEditing').attr('key',($(this).is(':checked')? "1" : "0"));
})
$('#YH-FM-mapMenu input[name="taskType"]').blur(function(){
	$('.YH-FM-boxEditing').attr('tasktype',$(this).val());
})

$('#YH-FM-csFont').ColorPicker({
	color: '#333333',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-csFont i').css('backgroundColor', '#' + hex);
		$('.YH-FM-boxEditing').children('.boxCon').css('color', '#' + hex);
	}
});
$('#YH-FM-csBorder').ColorPicker({
	color: '#eeeeee',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-csBorder i').css('backgroundColor', '#' + hex);
		$("#c"+$('.YH-FM-boxEditing').attr('id')).css('border-color', '#' + hex);
	}
});
$('#YH-FM-headerBackground').ColorPicker({
	color: '#ffffff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-headerBackground i').css('backgroundColor', '#' + hex);
		$('.YH-FM-boxEditing').css('backgroundColor', '#' + hex);
	}
});
$('#YH-FM-colBackground').ColorPicker({
	color: '#ffffff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-colBackground i').css('backgroundColor', '#' + hex);
		$('#YH-FM-bgTable colgroup').find('col').eq($('.YH-FM-boxEditing').index()).css('backgroundColor', '#' + hex);
	}
});
$('#YH-FM-rowBackground').ColorPicker({
	color: '#ffffff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-rowBackground i').css('backgroundColor', '#' + hex);
		$('.YH-FM-boxEditing').parent('tr').css('backgroundColor', '#' + hex);
	}
});
$('#YH-FM-csBackground').ColorPicker({
	color: '#ffffff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-csBackground i').css('backgroundColor', '#' + hex);
		$("#c"+$('.YH-FM-boxEditing').attr('id')).css('background-color', '#' + hex);
	}
});

$('#YH-FM-boxGrid').change(function(){
	initGrid=$(this).val();
})
$('#YH-FM-pathWidth').change(function(){
	curEditPath.data('stroke-width', $(this).val());
/*	for(i in curEditPath.data()){
		alert(i);
		alert( curEditPath.data()[i])
	}*/
})
$('#YH-FM-pathStyle').change(function(){
	curEditPath.data("stroke-dasharray",$(this).val());
	
/*	for(i in curEditPath.data()){
		alert(i);
		alert( curEditPath.data()[i])
	}*/
})

$('#YH-FM-csPath').ColorPicker({
	color: '#ffffff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-csPath i').css('backgroundColor', '#' + hex);
		curEditPath.attr('stroke','#' + hex);
		curEditPath.data("stroke",'#' + hex);
	}
});
$('#YH-FM-initBorderColor').ColorPicker({
	color: '#0000ff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-initBorderColor i').css('backgroundColor', '#' + hex);
		initStroke='#' + hex;
		setPath.attr({'stroke':initStroke}).data("stroke",'#' + hex);
	}
});
$('#YH-FM-colBorderColor').ColorPicker({
	color: '#0000ff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		var i=$('.YH-FM-boxEditing').index();
		$('#YH-FM-colBorderColor i').css('backgroundColor', '#' + hex);
		$('#YH-FM-bgTable tr').each(function(index, element) {
			$(this).children().eq(i).css({'border-left-color':'#' + hex,'border-right-color':'#' + hex});
		})
	
	}
});
$('#YH-FM-rowBorderColor').ColorPicker({
	color: '#0000ff',
	onShow: function (colpkr) {
		$(colpkr).fadeIn(500);
		return false;
	},
	onHide: function (colpkr) {
		$(colpkr).fadeOut(500);
		return false;
	},
	onChange: function (hsb, hex, rgb) {
		$('#YH-FM-rowBorderColor i').css('backgroundColor', '#' + hex);
		$('.YH-FM-boxEditing').parent('tr').children().each(function(index, element) {
            $(this).css({'border-top-color':'#' + hex,'border-bottom-color':'#' + hex});
        });
	
	}
});

$('#YH-FM-initBoxBorderWidth').change(function(){
	initStrokeWidth=$(this).val();
})
$('#YH-FM-initBoxBorderStyle').change(function(){
	initStrokeDasharray=$(this).val();
})


$('#YH-FM-delPathBtn').click(function(){
	deletePath(curEditPath);
	$('#YH-FM-pathMenu').hide();
})
$('#YH-FM-convetLineBtn').click(function(){
	convetLine(curEditPath);
	$('#YH-FM-pathMenu').hide();
})

/*$('.bold').toggle(function(){
	$('.boxEditing').children('.boxCon').css('font-weight', 'bold');
},function(){
	$('.boxEditing').children('.boxCon').css('font-weight', 'normal');
})
$('.italic').toggle(function(){
	$('.boxEditing').children('.boxCon').css('font-style', 'italic');
},function(){
	$('.boxEditing').children('.boxCon').css('font-style', 'normal');
})
$('.justifyleft').click(function(){
	$('.boxEditing').children('.boxCon').css('text-align', 'left');
})
$('.justifycenter').click(function(){
	$('.boxEditing').children('.boxCon').css('text-align', 'center');
})
$('.justifyright').click(function(){
	$('.boxEditing').children('.boxCon').css('text-align', 'right');
})
$('.fontsize select').change(function(){
	$('.boxEditing').children('.boxCon').css('font-size', $(this).val());
})*/



//背景画布大小设置
$( "#YH-FM-canvasHeight" ).spinner({
	min: 1,
	step: 100 ,
	change: function( event, ui ) {
		mapHeight=$(this).val();
		canvasResize()
	}
});
$( "#YH-FM-canvasWidth" ).spinner({
	min: 1,
	step: 100 ,
	change: function( event, ui ) {
		mapWidth=$(this).val();
		canvasResize()
	} 
});
$('#YH-FM-pop-close').click(function(){
	$('#YH-FM-pop').hide()
})
$('#YH-FM-saveCanvas').click(function () {

    saveData();
    var mapXml = $("#YH-FM-mapData").find("textarea[name=mapXml]").val();
    var mapPath = $("#YH-FM-mapData").find("textarea[name=mapPath]").val();
    
    var mapBoxBg = $("#YH-FM-mapData").find("textarea[name=mapBoxBg]").val();
    var mapTableBg = $("#YH-FM-mapData").find("textarea[name=mapTableBg]").val();
    var path = "/Content/ContextDiagram/SSV2-Graph.xml";
    var formUrl = $("#YH-FM-mapData").attr('action');

    var formdata = "mapXml=" + escape(mapXml.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|")) + "&mapPath=" + escape(mapPath.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|"))
                 + "&mapBoxBg=" + escape(mapBoxBg.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|")) + "&mapTableBg=" + escape(mapTableBg.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|"))
                 + "&xmlFilePath=" + escape(path);

    if (typeof rootId != "undefined" && rootId != "") {
        formdata += "&rootId=" + rootId;
    }
    $.ajax({
        url: formUrl,
        type: 'post',
        data: formdata,
        dataType: 'json',
        error: function () {
            alert("未知错误，请联系服务器管理员，或者刷新页面重试");
        },
        success: function (data) {
            if (data.Success == false) {
                alert(data.Message);
            }
            else {
                alert("保存成功");
            }
        }
    });
    //$('#YH-FM-mapData').trigger('submit')

})

//显示展示视图
$('#YH-FM-viewModeBtn').click(function(){
	$('#YH-FM-flowMap').html('');
	$('#YH-FM-pop').show();
	
	saveData();
	
	var dataObj;
	eval('dataObj='+$('#YH-FM-mapData textarea[name="mapPath"]').val())

	$('#YH-FM-flowMap').css({'height':dataObj.height,'width':dataObj.width}).append('<table id="YH-FM-flowMapBgTable">'+$('#YH-FM-mapData textarea[name="mapTableBg"]').val()+'</table><div id="YH-FM-flowMapData"><div id="YH-FM-flowMapLayer1"></div><div id="YH-FM-flowMapLayer2"></div><div id="YH-FM-flowMapLayer3"></div></div>');
	
	$('#YH-FM-flowMapData').css({
		'height':(dataObj.height*1-$('#YH-FM-flowMapBgTable th:first').outerHeight()*1),
		'width':(dataObj.width*1-$('#YH-FM-flowMapBgTable th:first').outerWidth()*1),
		'top':$('#YH-FM-flowMapBgTable th:first').outerHeight(),
		'left':$('#YH-FM-flowMapBgTable th:first').outerWidth()
	});
	$('#YH-FM-flowMapLayer1,#YH-FM-flowMapLayer2,#YH-FM-flowMapLayer3').css({
		'height':(dataObj.height*1-$('#YH-FM-flowMapBgTable th:first').outerHeight()*1),
		'width':'100%'
	});
	$('#YH-FM-flowMapLayer1').html($('#YH-FM-mapData textarea[name="mapBoxBg"]').val());
	$('#YH-FM-flowMapLayer3').html($('#YH-FM-mapData textarea[name="mapXml"]').val());
	
	var flowMap = Raphael('YH-FM-flowMapLayer2','100%', dataObj.height*1-$('#YH-FM-flowMapBgTable th:first').outerHeight()*1);
	var flowSetPath=flowMap.set();
	var newSetPath=flowMap.set();
	var pathJson=dataObj.p;
	for(i in pathJson){
		eval('n'+i+'=flowMap.path("'+pathJson[i]['path']+'").attr({stroke:"'+pathJson[i]['stroke']+'","stroke-width":"'+dataObj.pStrokeWidth+'","arrow-end":"2"}).data({'+pathJson[i]['data']+'});')
		
		eval('flowSetPath.push(n'+i+')');
		eval('newSetPath.push(n'+i+')');
		
	}
	
		
	flowSetPath.forEach(function(p){
        newSetPath.exclude(p)
        newSetPath.forEach(function(q){
            Raphael.showPathIntersection(p,q)
        })
	})
	
	$('#YH-FM-popMap').css({'height':dataObj.height,'width':dataObj.width});
	//$('#popMap').append($('#bgTable').clone()).append($('#canvas').clone())
	
	$('#YH-FM-pop').mousedown(function (e) {
		//'p' for 'parent','s' for 'self','c' for 'children'
		$sObj=$(this);
		$cObj=$sObj.find('#YH-FM-popMap');
		var startX=e.pageX;
		var startY=e.pageY;
		var cPosX=$cObj.position().left;
		var cPosY=$cObj.position().top;
		//var maxLen=85*$obj.find('ul li').length-$(this).width();
		$cObj.bind('mousemove',function(e){
			var mouseX=e.pageX;
			var mouseY=e.pageY;
			var curX=mouseX-startX+cPosX;
			var curY=mouseY-startY+cPosY;
			//$('.timeline_content_block').text('startX:'+startX+';mouseX:'+mouseX+';curX:'+curX+';maxLen:'+maxLen);
			
			$cObj.css({left:curX,top:curY});
			
		}).mouseup(function(){
			$cObj.unbind('mousemove');
		})
		return false;
	}).mouseout(function (){
			$(this).find('#YH-FM-popMap').unbind('mousemove');
	})
	
	return ;
	

})


$('.theader-xy').resizable({
	stop:function(){
		canvasResize();
	}
});
$('.theader-x').resizable({create: function( event, ui ) {
	$(this).children('.ui-resizable-s, .ui-resizable-se').remove()
}});
$('.theader-y').resizable({create: function( event, ui ) {
	$(this).children('.ui-resizable-e, .ui-resizable-se').remove()
}});

$('#YH-FM-addTableCol').click(function(){
		$('#YH-FM-bgTable colgroup').append($('#YH-FM-bgTable colgroup col:last').clone());
		$('#YH-FM-bgTable tr').each(function(index, element) {
			if(index==0){
				$('#YH-FM-bgTable thead th:last').clone().children('.boxCon').html(UE.getEditor('YH-FM-editor').getContent()).end().children('.ui-resizable-handle').remove().end().appendTo($(this))
				.resizable({
					create: function( event, ui ) {
						$(this).children('.ui-resizable-s, .ui-resizable-se').remove()
					}})
			}else{
				$(this).children().eq(1).clone().appendTo($(this));
			}
		});
		$('#YH-FM-mapMenu').hide();
})
$('#YH-FM-addTableRow').click(function(){
		var trObj=$('.YH-FM-boxEditing').parent('tr');
		var tbodyObj=$('.YH-FM-boxEditing').parents('tbody');
		trObj.clone().appendTo(tbodyObj).find('.boxCon').html(UE.getEditor('YH-FM-editor').getContent()).end().find('th').children('.ui-resizable-handle').remove().end().resizable({
			create: function( event, ui ) {
				$(this).children('.ui-resizable-e, .ui-resizable-se').remove()
			}}
		);
		$('#YH-FM-mapMenu').hide();
})
$('#YH-FM-delTableBox').click(function(){
		delTableBox()
		$('#YH-FM-mapMenu').hide();
})
$('#YH-FM-delTableCol').click(function(){
	var i=$('.YH-FM-boxEditing').index();
	$('#YH-FM-bgTable colgroup col').eq(i).remove();
	$('#YH-FM-bgTable tr').each(function(index, element) {
		$(this).children().eq(i).remove();
	})
	$('#YH-FM-mapMenu').hide();
})
$('#YH-FM-delTableRow').click(function(){
	$('.YH-FM-boxEditing').parent('tr').remove()
	$('#YH-FM-mapMenu').hide();
})
$('#YH-FM-body').height($(window).height())


$(".YH-FM-selectmenu").selectmenu({
   change: function( event, data ) {
	 $(this).val(data.item.value).trigger('change');
   }
 });



