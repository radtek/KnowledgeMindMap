//检查线path1和path2是否有交点，有则在交点处划出弧形
;Raphael.showPathIntersection=function(path1,path2){
	var dots=Raphael.pathIntersection(path1.attr("path"),path2.attr("path"));
	
	
	var path1Point= []; 
	var path2Point= []; 
	
	for(var i in dots){
		
		var pointX=Math.round(dots[i]['x']);
		var pointY=Math.round(dots[i]['y']);
		
		var dot1X=Math.round(dots[i]['bez1'][0]);
		var dot1Y=Math.round(dots[i]['bez1'][1]);
		var dot2X=Math.round(dots[i]['bez2'][0]);
		var dot2Y=Math.round(dots[i]['bez2'][1]);
		
		var dotM=pointX+"-"+pointY;
		var dot1S=dot1X+"-"+dot1Y;
		var dot2S=dot2X+"-"+dot2Y;
		var dot1M=Math.round(dots[i]['bez1'][4])+"-"+Math.round(dots[i]['bez1'][5]);
		var dot2M=Math.round(dots[i]['bez2'][4])+"-"+Math.round(dots[i]['bez2'][5]);
		var dot1E=Math.round(dots[i]['bez1'][6])+"-"+Math.round(dots[i]['bez1'][7]);
		var dot2E=Math.round(dots[i]['bez2'][6])+"-"+Math.round(dots[i]['bez2'][7]);
		
		if(dot1M!=dot1E || dot2M!=dot2E){
			
			//alert('相交线为曲线');
			return;
		}
		if(dotM==dot1S || dotM==dot2S || dotM==dot1E || dotM==dot2E){
			
			//alert('线条重合');
			return;
		}
		
		//生成交点弧度信息(dotX,dotY交点坐标；pathNum横线的编号1或2；)
		function addArc(dotX,dotY,pathNum){
			
			var pathInfo;
			
			if((dots[i]['bez'+pathNum][0]-dots[i]['bez'+pathNum][6])>0){
				//alert(pathNum+':1');
				return pathInfo="H"+(Math.round(dotX)+5)+"A4,4,90,0,"+0+","+(Math.round(dotX)-5)+","+Math.round(dotY);
			}else{
				//alert(pathNum+':2');
				return pathInfo="H"+(Math.round(dotX)-5)+"A4,4,90,0,"+1+","+(Math.round(dotX)+5)+","+Math.round(dotY);
			}	
		}
		
		if(dots[i]['bez1'][1]==dots[i]['bez1'][7]){
			path1Point[i]={};
			path1Point[i]['inSeg']=dots[i]['segment1'];
			path1Point[i]['info']=addArc(dots[i]['x'],dots[i]['y'],1);
			
				
		}else{
			path2Point[i]={};
			path2Point[i]['inSeg']=dots[i]['segment2'];
			path2Point[i]['info']=addArc(dots[i]['x'],dots[i]['y'],2);
			
		}
		
	}

	function newPathInfo(path,pathPoint){
		var arr=path.attr('path').toString().match(/[a-z]([0-9]|\ |\.|\,)*/gi);
        var aNum=0;
		var pathInfo='';
		
		for(var i=0,len =arr.length;i<len;i++){
            if((arr[i]+"c").match(/a/gi)){
                aNum++;
            }
			for(j in pathPoint){
				if((i*1+aNum)==pathPoint[j]['inSeg']){
					pathInfo=pathInfo+pathPoint[j]['info'];
				}
			}
			pathInfo=pathInfo+arr[i];
		}
		return pathInfo;
	}
	if(path1Point.length>0){
		path1.attr({path:newPathInfo(path1, path1Point)})
	}
	if(path2Point.length>0){
		path2.attr({path:newPathInfo(path2, path2Point)})
		
	}
}
function vInit(dataObj,stateJson){
	$('#YH-FM-flowMap').css({'height':dataObj.height,'width':dataObj.width});
	$('#YH-FM-flowMapData').css({
		'height':(dataObj.height*1-$('#YH-FM-flowMapBgTable th:first').outerHeight()*1),
		'width':(dataObj.width*1-$('#YH-FM-flowMapBgTable th:first').outerWidth()*1),
		'top':$('#YH-FM-flowMapBgTable th:first').outerHeight(),
		'left':$('#YH-FM-flowMapBgTable th:first').outerWidth()
	});
	$('#YH-FM-flowMapLayer1,#YH-FM-flowMapLayer2,#YH-FM-flowMapLayer3').css({
		'height':(dataObj.height*1-$('#flowMapBgTable th:first').outerHeight()*1),
		'width':'100%'
	});
	var flowMap = Raphael('YH-FM-flowMapLayer2','100%',dataObj.height*1-$('#YH-FM-flowMapBgTable th:first').outerHeight()*1);

	var flowSetPath=flowMap.set();
	var newSetPath=flowMap.set();
	var pathJson=dataObj.p;
	for(var i in pathJson){
        eval('n'+i+'=flowMap.path("'+pathJson[i]['path']+'").attr({stroke:"'+(pathJson[i]['stroke'] || '#333')+'","stroke-width":"'+dataObj.pStrokeWidth+'","arrow-end":"2"}).data({'+pathJson[i]['data']+'});')

        eval('flowSetPath.push(n'+i+')');
		eval('newSetPath.push(n'+i+')');
		
	}
	
//	flowSetPath.forEach(function(p){
//		newSetPath.exclude(p)
//		newSetPath.forEach(function(q){
//			Raphael.showPathIntersection(p,q)
//		})
//	})
//	
	for(var i in stateJson){
		var $obj=$('#'+i);
		if(stateJson[i]['flag']){
			$obj.append('<i class="'+stateJson[i]['flag']+'"></i>');
		}
		if(stateJson[i]['isDeliver']){
			$obj.append('<i class="flag4" ></i>');
		}
	}
	
}
$('#YH-FM-flowMapfullScreenBtn').click(function(){
	$('body,html').css('overflow','hidden');
	$('.YH-FM-flowMapWrap').addClass('YH-FM-flowMapFullScreen');
})
$('.YH-FM-flowMapFullScreenClose').click(function(){
	$('body,html').css('overflow','auto');
	$('.YH-FM-flowMapWrap').removeClass('YH-FM-flowMapFullScreen');
})

function showInfo(json,$cObj){
	var offsetLeft=$cObj.offset().left-$cObj.closest('.YH-FM-flowMapWrap').offset().left;
	var offsetTop=$cObj.offset().top-$cObj.closest('.YH-FM-flowMapWrap').offset().top;
	var difX=offsetLeft+$cObj.width()+210-$('#YH-FM-flowMap').closest('.YH-FM-flowMapWrap').width();
	var difY=offsetTop+180-$('#YH-FM-flowMap').closest('.YH-FM-flowMapWrap').height();

	//	var menuX=difX > 0 ? offsetLeft+$cObj.width() - difX : offsetLeft+$cObj.width();
	//	var menuY=difY > 0 ? offsetTop - difY : offsetTop-10;
	var menuX = offsetLeft + $cObj.width();
	var menuY = offsetTop - 10;

	if (difX > 0) {
	    menuX = offsetLeft + $cObj.width() - difX;
	    menuY = menuY + $cObj.height() + 8;
    }

    if (difY > 0 && json.info != undefined) {
        menuY = offsetTop - difY;
    }

	var html = '<dt>';
	if (json.taskId != undefined) {
	    if (typeof isEdit != "undefined") {
	        html += '<a href="/DesignManage/ProjTaskInfo/' + json.taskId + '?retType=1&isEdit=' + isEdit + '" target="_blank">' + json.title + '</a></dt>';
	    } else {
	        html += '<a href="/DesignManage/ProjTaskInfo/' + json.taskId + '?retType=1" target="_blank">' + json.title + '</a></dt>';
        }
	} else {
	    html += json.title + '</dt>';
    }
	for(var i in json.info){
		html+='<dd><span>'+i+':</span>'+json.info[i]+'</dd>';
	}
	$('#YH-FM-flowMapBoxInfo').show().css({top:menuY,left:menuX}).find('dl').html(html);
	
	
	setTimeout("$('#YH-FM-flowMap').one('click',function(){$('#YH-FM-flowMapBoxInfo').hide()})",10)
/*	$('#YH-FM-flowMap').one('click',function(){
		$('#YH-FM-flowMapBoxInfo').hide()
	})*/
}


if($('.YH-FM-flowMapWrap').attr('draggable')){
	$('.YH-FM-flowMapWrap').mousedown(function (e) {
			//'p' for 'parent','s' for 'self','c' for 'children'
			$sObj=$(this);
			$cObj=$sObj.find('#YH-FM-flowMap').css({'cursor':'move','position':'absolute'});
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
				if(1){
					$cObj.css({left:curX,top:curY});
				}
			}).mouseup(function(){
				$cObj.unbind('mousemove');
			})
			return false;
		}).mouseout(function (){
				$(this).find('#YH-FM-flowMap').unbind('mousemove');
	})
}


