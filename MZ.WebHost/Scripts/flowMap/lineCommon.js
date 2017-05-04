
var boxId=0;
var paper = Raphael('YH-FM-lineLayer','100%', 500);
var setPath=paper.set();
var mapHeight;
var mapWidth;
var initStroke='#0000ff';

//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
var ue = UE.getEditor('YH-FM-editor');
$( "#YH-FM-mapMenu" ).draggable();

//页面初始化通过后台json把页面相应参数初始化
function init(initData){
	
	boxId= 0;
	mapHeight= $('#YH-FM-canvasHeight').val();
	mapWidth= $('#YH-FM-canvasWidth').val();
	$('#YH-FM-boxGrid').val('5px')
	if(initData && typeof initData == 'object'){
		boxId=initData.bId;
		mapHeight=initData.height;
		mapWidth=initData.width;
		initStroke=initData.pStroke;
		
		$('#YH-FM-canvasHeight').val(mapHeight)
		$('#YH-FM-canvasWidth').val(mapWidth)
		$('#YH-FM-initBoxBorderWidth').val(initData.pStrokeWidth)
		
		//$('#mindMap .tableBox').bind('contextmenu',function(e){return showMenu(e,this,"box")});
		if(navigator.userAgent.indexOf("Firefox")>0){
			$('#YH-FM-mindMap .YH-FM-box').attr('oncontextmenu','return showMenu(event,this,"YH-FM-box")');
			$('#YH-FM-bgTable thead th').attr('oncontextmenu','return showMenu(event,this,"YH-FM-col")').removeClass('ui-resizable');
			$('#YH-FM-bgTable tbody th').attr('oncontextmenu','return showMenu(event,this,"YH-FM-row")').removeClass('ui-resizable');
		}else{
			$('#YH-FM-mindMap .YH-FM-box').bind('contextmenu',function(e){return showMenu(e,this,"YH-FM-box")});
			$('#YH-FM-bgTable thead th').removeClass('ui-resizable').bind('contextmenu',function(e){return showMenu(e,this,"YH-FM-col")});
			$('#YH-FM-bgTable tbody th').removeClass('ui-resizable').bind('contextmenu',function(e){return showMenu(e,this,"YH-FM-row")});;
		}
		$('#YH-FM-initBorderColor i').css('background-color',initData.pStroke);
		var pathJson=initData.p;
		for(var i in pathJson){
			eval(i+'=paper.path("'+pathJson[i]['path']+'").attr({stroke:"'+pathJson[i]['stroke']+'",cursor:"move","stroke-width":3,"arrow-end":"2"}).data({'+pathJson[i]['data']+'}).drag(draggerMove,draggerDown, draggerUp);')

            eval('setPath.push('+i+')');
			
		}
	}
	canvasResize();
}
//鼠标拖动改变线条1
function changeLine1(line){ 
	var o = {}; 
	o.startX = '1'; 
	o.startY = '1'; 
	o.obj = line; 
	o.pathInfo = o.obj.attr('path').toString().replace(/[a-z]([0-9]|\ |\.|\,)*A([0-9]|\ |\.|\,)*/gi,''); 
	o.pathArr = Raphael.parsePathString(o.pathInfo); 
	o.segVH = o.pathArr[1][0];
	o.startX=o.pathArr[0][1];
	o.startY=o.pathArr[0][2];
	//o.svgX='';
	//o.svgY='';
	o.svgY= parseInt($('#YH-FM-lineLayer').offset().top);
	o.svgX= parseInt($('#YH-FM-lineLayer').offset().left);
	o.revArr=o.pathArr.reverse();
	o.down = function(){ 
		this.obj.attr({"stroke-dasharray": "-",path:this.pathInfo});
	};
	o.move = function(dH,dV,x,y){
		
		var curX=parseInt(x-this.svgX);
		var curY=parseInt(y-this.svgY);
		
		
		var fId=line.data('from'),
			from = $('#'+fId),
			fPosX=from.position().left,
			fPosY=from.position().top,
			fH=$('#c'+fId).outerHeight(),
			fW=$('#c'+fId).outerWidth(),
			fCX=parseInt(fPosX+fW*0.5),
			fCY=parseInt(fPosY+fH*0.5),
			fEX=parseInt(fPosX+fW),
			fEY=parseInt(fPosY+fH);
		var tId=line.data('to'),
			to =$('#'+tId),
			tPosX=to.position().left,
			tPosY=to.position().top,
			tH=$('#c'+tId).outerHeight(),
			tW=$('#c'+tId).outerWidth(),
			tCX=parseInt(tPosX+tW*0.5),
			tCY=parseInt(tPosY+tH*0.5),
			tEX=parseInt(tPosX+tW),
			tEY=parseInt(tPosY+tH);
		
		
		
		
		if(this.segVH=='H'){
			//设置起点
			if(fPosX>=curX){
				this.startY=fCY;
				this.startX=fPosX;
			}else if(fEX<=curX){
				this.startY=fCY;
				this.startX=fEX;
			}else if(curY<=fPosY){
				this.startY=fPosY;
				this.startX=fCX;
			}else if(curY>=fEY){
				this.startY=fEY;
				this.startX=fCX;
			}
			//设置终点
			if(tPosY>=curY){
				this.revArr[0][1]=tPosY;
				this.revArr[1][1]=tCX;
			}else if(tEY<=curY){
				this.revArr[0][1]=tEY;
				this.revArr[1][1]=tCX;
			}else if(curX<=tPosX){
				this.revArr[0][1]=tCY;
				this.revArr[1][1]=tPosX;
			}else if(curX>=tEX){
				this.revArr[0][1]=tCY;
				this.revArr[1][1]=tEX;
			}
		
			
			var nPathInfo="M"+this.startX+' '+this.startY+"H"+curX+"V"+curY+this.revArr[1][0]+this.revArr[1][1]+this.revArr[0][0]+this.revArr[0][1];
			this.obj.attr({path:nPathInfo}); 
		}else if(this.segVH=='V'){
			
		//设置起点
		if(fPosY>=curY){
			this.startX=fCX;
			this.startY=fPosY;
		}else if(fEY<=curY){
			this.startX=fCX;
			this.startY=fEY;
		}else if(curX<=fPosX){
			this.startX=fPosX;
			this.startY=fCY;
		}else if(curX>=fEX){
			this.startX=fEX;
			this.startY=fCY;
		}
		//设置终点
		if(tPosX>=curX){
			this.revArr[0][1]=tPosX;
			this.revArr[1][1]=tCY;
		}else if(tEX<=curX){
			this.revArr[0][1]=tEX;
			this.revArr[1][1]=tCY;
		}else if(curY<=tPosY){
			this.revArr[0][1]=tCX;
			this.revArr[1][1]=tPosY;
		}else if(curY>=tEY){
			this.revArr[0][1]=tCX;
			this.revArr[1][1]=tEY;
		}
		
			
			var nPathInfo="M"+this.startX+' '+this.startY+"V"+curY+"H"+curX+this.revArr[1][0]+this.revArr[1][1]+this.revArr[0][0]+this.revArr[0][1];
			this.obj.attr({path:nPathInfo}); 
		}
	};
	o.up = function(e){ 
		this.obj.attr({"stroke-dasharray": ""});
		lineclick(o.obj,e);
	}
	o.test = function(gg){
		//alert('hhhhh:'+this.startP);
		this.name=gg; 
	}; 
	return o; 
} 

//鼠标拖动改变线条2
function changeLine2(line){ 
	var o = {}; 
	o.startP = '1'; 
	o.endP = ''; 
	o.midP = ''; 
	o.obj = line; 
	o.pathInfo = o.obj.attr('path').toString().replace(/[a-z]([0-9]|\ |\.|\,)*A([0-9]|\ |\.|\,)*/gi,''); 
	o.pathArr = Raphael.parsePathString(o.pathInfo); 
	o.segVH = o.pathArr[1][0];
	o.down = function(){ 
		this.obj.attr({"stroke-dasharray": "-",path:this.pathInfo});
		function range(arr,hv){
			if((arr[0][hv]-arr[3][1])<0){
				o.startP=arr[0][hv]+20;
				o.midP=arr[1][1];
				o.endP=arr[3][1]-20;
			}else{
				o.startP=arr[3][1]+20;
				o.midP=arr[1][1];
				o.endP=arr[0][hv]-20;
			}
		}
		if(this.segVH=='H'){
			range(this.pathArr,'1')
		}else if(this.segVH=='V'){
			range(this.pathArr,'2')
		}
	};
	o.move = function(dH,dV){
		var curP=this.midP+eval("d"+this.segVH);
		if(curP>this.startP && curP<this.endP){
			
			eval("var patt1 = /"+this.segVH+"([0-9]|\\ |\\,|\\.)*/i");
			var nPathInfo=this.pathInfo.replace(patt1,this.segVH+curP);
			this.obj.attr({path:nPathInfo}); 
			
		}
	};
	o.up = function(e){ 
		this.obj.attr({"stroke-dasharray": ""});
		lineclick(o.obj,e);
	}
	return o; 
} 
//改变画布大小
function canvasResize(){
	var th=$('#YH-FM-bgTable th:first').outerHeight();
	var tw=$('#YH-FM-bgTable  th:first').outerWidth();
	var height=mapHeight-th;
	var width=mapWidth-tw;
	$('#YH-FM-mindMap').height(mapHeight);
	$('#YH-FM-mindMap').width(mapWidth);
	$("#YH-FM-canvas").css({'height':height,'width':width,'top':th,'left':tw});
	$("#YH-FM-bgBox,#YH-FM-lineLayer").css({'height':height});
	paper.setSize('100%',height)
}

//点击线条后出现‘删除’和‘转换’按钮
function lineclick(p,e){
	curEditPath=p;
	$('#YH-FM-pathMenu').show().css({top:e.clientY+$(window).scrollTop(),left:e.clientX+$(window).scrollLeft()});
	setTimeout(hideMenu,500)
	function hideMenu(){
		$('#YH-FM-mindMap').one('click',function(){
			$('#YH-FM-pathMenu').hide()
			curEditPath=undefined;
		})
	}
}


//path1=paper.path('M150,250H100V50').attr({stroke:"#ff0000",cursor:'move','stroke-width':'3','arrow-end':'1'}).data({form:'1',to:'2',lineType:'1'}).drag(draggerMove,draggerDown, draggerUp);


//path2=paper.path('M50,150V100.5H65A4,4,90,0,1,75,100H100V50').attr({stroke:"#ff0000",cursor:'ns-resize','stroke-width':'3'}).data({form:'1',to:'2',lineType:'2'}).drag(draggerMove,draggerDown, draggerUp);

var curPath;
var initGrid=5;
var initStrokeWidth=1.5;
var initStrokeDasharray='';

//划线函数，传人起点的jquery对象和终点jquery对象
function drawline(from,to,type,data){
	
	var fId=from.attr('id'),
		fPosX=from.position().left,
		fPosY=from.position().top,
		fH=$('#c'+fId).outerHeight(),
		fW=$('#c'+fId).outerWidth(),
		fCX=parseInt(fPosX+fW*0.5),
		fCY=parseInt(fPosY+fH*0.5),
		fEX=parseInt(fPosX+fW),
		fEY=parseInt(fPosY+fH);
	var tId=to.attr('id'),
		tPosX=to.position().left,
		tPosY=to.position().top,
		tH=$('#c'+tId).outerHeight(),
		tW=$('#c'+tId).outerWidth(),
		tCX=parseInt(tPosX+tW*0.5),
		tCY=parseInt(tPosY+tH*0.5),
		tEX=parseInt(tPosX+tW),
		tEY=parseInt(tPosY+tH);
	var pName='path_'+fId+'_'+tId,
		pInfo='';
		
	var stroke=data ? data['stroke'] || initStroke : initStroke ;
		strokeWidth=data ? data['stroke-width'] || initStrokeWidth :initStrokeWidth;
		strokeDasharray=data ? data['stroke-dasharray'] || initStrokeDasharray : initStrokeDasharray;
/*		alert(stroke);
		alert(strokeWidth);
		alert(strokeDasharray);*/

	eval('var isPathExist=(typeof('+pName+')=="object")')
	if(isPathExist){
		return false;
	}
	function check(p1,len1,p2,len2){
		if(p1>p2){
			return p1>p2+len2? false:true;
		}else{
			return p2>p1+len1? false:true;
		}
	}
	
	
	//划出类型1的线条
	function drawline1(p){
		
		eval(pName+'=paper.path("'+p+'").attr({stroke:"'+stroke+'",cursor:"move","stroke-width":"3","arrow-end":"2"}).data({stroke:"'+stroke+'","stroke-width":"'+strokeWidth+'","stroke-dasharray":"'+strokeDasharray+'",from:"'+fId+'",to:"'+tId+'",lineType:"1"}).drag(draggerMove,draggerDown, draggerUp);')
	};
	//划出类型2的线条
	function drawline2(p){
		eval(pName+'=paper.path("'+p+'").attr({stroke:"'+stroke+'",cursor:"move","stroke-width":"3","arrow-end":"2"}).data({stroke:"'+stroke+'","stroke-width":"'+strokeWidth+'","stroke-dasharray":"'+strokeDasharray+'",from:"'+fId+'",to:"'+tId+'",lineType:"2"}).drag(draggerMove,draggerDown, draggerUp);')
	};
	////alert(check(fPosX,fW,tPosX,tW));
	////alert(check(fPosY,fH,tPosY,tH));

	//判断起点和终点位置关系 然后划线
	if(fPosX<=tPosX && fPosY<=tPosY ){
		//alert(11);
		if(check(fPosX,fW,tPosX,tW)){
			//alert(21);
			
			pInfo='M'+fCX+','+fEY+'V'+(fEY*1+10)+'H'+tCX+'V'+tPosY;
			drawline2(pInfo);
			
		}else if(check(fPosY,fH,tPosY,tH)){
			//alert(22);
			pInfo='M'+fEX+','+fCY+'H'+(fEX*1+10)+'V'+tCY+'H'+tPosX;
			drawline2(pInfo);
		}else{
			//alert(23);
			pInfo='M'+fCX+','+fEY+'V'+tCY+'H'+tPosX;
			drawline1(pInfo);
		}
	}else if(fPosX>=tPosX && fPosY<=tPosY ){
		//alert(12);
		if(check(fPosX,fW,tPosX,tW)){
			//alert(21);
			pInfo='M'+fCX+','+fEY+'V'+(fEY*1+10)+'H'+tCX+'V'+tPosY;
			drawline2(pInfo);
			
		}else if(check(fPosY,fH,tPosY,tH)){
			//alert(22);
			pInfo='M'+fPosX+','+fCY+'H'+(fPosX*1-10)+'V'+tCY+'H'+tEX;
			drawline2(pInfo);
		}else{
			//alert(23);
			pInfo='M'+fCX+','+fEY+'V'+tCY+'H'+tEX;
			drawline1(pInfo);
		}
	}else if(fPosX>=tPosX && fPosY>=tPosY ){
		//alert(14);
		if(check(fPosX,fW,tPosX,tW)){
			//alert(21);
			pInfo='M'+fCX+','+fPosY+'V'+(fPosY*1-10)+'H'+tCX+'V'+tEY;
			drawline2(pInfo);
			
		}else if(check(fPosY,fH,tPosY,tH)){
			//alert(22);
			pInfo='M'+fPosX+','+fCY+'H'+(fPosX*1-10)+'V'+tCY+'H'+tEX;
			drawline2(pInfo);
		}else{
			//alert(23);
			pInfo='M'+fCX+','+fPosY+'V'+tCY+'H'+tEX;
			drawline1(pInfo);
		}
	}else if(fPosX<=tPosX || fPosY>=tPosY ){
		//alert(13);
		if(check(fPosX,fW,tPosX,tW)){
			//alert(21);
			pInfo='M'+fCX+','+fPosY+'V'+(fPosY*1-10)+'H'+tCX+'V'+tEY;
			drawline2(pInfo);
			
		}else if(check(fPosY,fH,tPosY,tH)){
			//alert(22);
			pInfo='M'+fEX+','+fCY+'H'+(fEX*1+10)+'V'+tCY+'H'+tPosX;
			drawline2(pInfo);
		}else{
			//alert(23);
			pInfo='M'+fCX+','+fPosY+'V'+tCY+'H'+tPosX;
			drawline1(pInfo);
		}
	}
	
	eval('setPath.push('+pName+')');
	
	//path1=paper.path('M'+fromX+','+fromY+'H'+toX+'V'+toY).attr({stroke:"#ff0000",cursor:'move','stroke-width':'3','arrow-end':'1'}).data({form:'1',to:'2',lineType:'1'}).drag(draggerMove,draggerDown, draggerUp);
	//path2=paper.path('M'+fromX+','+fromY+'V'+(fromX*1+20)+'H'+toX+'V'+toY).attr({stroke:"#ff0000",cursor:'ns-resize','stroke-width':'3','arrow-end':'1'}).data({form:'1',to:'2',lineType:'2'}).drag(draggerMove,draggerDown, draggerUp);
}

//划线函数
function convetLine(p){
	var type = p.data('lineType');
		var fId=p.data('from'),tId=p.data('to');
	if(type=='3'){
		deletePath(p)
		drawline($('#'+fId),$('#'+tId))
	}else{
		var from = $('#'+fId),
			fPosX=from.position().left,
			fPosY=from.position().top,
			fH=$('#c'+fId).outerHeight(),
			fW=$('#c'+fId).outerWidth(),
			fCX=parseInt(fPosX+fW*0.5),
			fCY=parseInt(fPosY+fH*0.5),
			fEX=parseInt(fPosX+fW),
			fEY=parseInt(fPosY+fH);
		var to =$('#'+tId),
			tPosX=to.position().left,
			tPosY=to.position().top,
			tH=$('#c'+tId).outerHeight(),
			tW=$('#c'+tId).outerWidth(),
			tCX=parseInt(tPosX+tW*0.5),
			tCY=parseInt(tPosY+tH*0.5),
			tEX=parseInt(tPosX+tW),
			tEY=parseInt(tPosY+tH);
			
		if(fPosX<=tPosX && fPosY<=tPosY ){
				pInfo='M'+fEX+','+fCY+'H'+tCX+'V'+tPosY;
		}else if(fPosX>=tPosX && fPosY<=tPosY ){
				pInfo='M'+fPosX+','+fCY+'H'+tCX+'V'+tPosY;
		}else if(fPosX>=tPosX && fPosY>=tPosY ){
				pInfo='M'+fPosX+','+fCY+'H'+tCX+'V'+tEY;
		}else if(fPosX<=tPosX || fPosY>=tPosY ){
				pInfo='M'+fEX+','+fCY+'H'+tCX+'V'+tEY;
		}
		p.attr('path',pInfo).data('lineType',3);
	}
}

//删除划线函数
function deletePath(p){
	
	$('#'+p.data('from')).attr('to',$('#'+p.data('from')).attr('to').replace(p.data('to')+',',''));
	$('#'+p.data('to')).attr('from',$('#'+p.data('to')).attr('from').replace(p.data('from')+',',''));
	
	eval('path_'+p.data('from')+'_'+p.data('to')+'=""');
	//把path从set中移除
	setPath.exclude(p);
	p.remove();
	//把path从内存中删除
	
	
}
//删除内容块
function delTableBox(){
	var cId=$('.YH-FM-boxEditing').attr('id');
	if($('.YH-FM-boxEditing').attr('from')){
		var arrFrom=$('.YH-FM-boxEditing').attr('from').split(',');
		for(i in arrFrom){
			if(arrFrom[i]){
				eval('deletePath(path_'+arrFrom[i]+'_'+cId+')');
			}
		}
	}
	if($('.YH-FM-boxEditing').attr('to')){
		var arrTo=$('.YH-FM-boxEditing').attr('to').split(',');
		for(i in arrTo){
			if(arrTo[i]){
				eval('deletePath(path_'+cId+'_'+arrTo[i]+')');
			}
		}
	}
	$('.YH-FM-boxEditing,#c'+$('.YH-FM-boxEditing').attr('id')).remove();
}

function checkAttr(node,attr,val){
		
	if(typeof(node.attr(attr))=='undefined'){
		node.attr(attr,val+",");
		return true;
	}
	if(node.attr(attr).match(val)){
		return false;
	}else{
		node.attr(attr,node.attr(attr)+val+",");
		return true;
	}
	
}
//点击拖动线条	
function draggerDown(dx, dy){
	if(this.data('lineType')=='2'){
		line2 = changeLine2(this); 
		line2.down(); 
	}else{
		line1 = changeLine1(this); 
		line1.down(); 
	}
}
function draggerMove(dx, dy,x,y){
	if(this.data('lineType')=='2'){
		line2.move(dx,dy,x,y); 
	}else{
		line1.move(dx,dy,x,y);  
	}
}
function draggerUp(dx, dy){
	if(this.data('lineType')=='2'){
		line2.up(dx,dy);
	}else{
		line1.up(dx,dy);
	} 
}
//阻止事件冒泡
function stopPropagation(e) {
    e = e || window.event;
    if(e.stopPropagation) { //W3C阻止冒泡方法
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
}


//YH-FM-box在调整大小和位置时触发重新划线
function reDrawLine(obj){
	
	var thisId=obj.attr('id');
	
	if(obj.attr('from')){
		var fromArr=obj.attr('from').split(',');
		for(i in fromArr){
			if(fromArr[i]){
				//alert(fromArr[i])
				//eval('alert(path_'+fromArr[i]+'_'+thisId+')')
				//获取路径data的参数
				eval('var data=path_'+fromArr[i]+'_'+thisId+'.data()');
				//把path从set中移除
				eval('setPath.exclude(path_'+fromArr[i]+'_'+thisId+')');
				//把path从页面中移
				eval('path_'+fromArr[i]+'_'+thisId+'.remove();path_'+fromArr[i]+'_'+thisId+'=""');
				
				drawline($("#"+fromArr[i]),$("#"+thisId),'',data);
			}
		}
	}
	if(obj.attr('to')){
		var toArr=obj.attr('to').split(',');
		for(i in toArr){
			if(toArr[i]){
				
				//获取路径data的参数
				eval('var data=path_'+thisId+'_'+toArr[i]+'.data()');
				//把path从set中移除
				eval('setPath.exclude(path_'+thisId+'_'+toArr[i]+')');
				//alert(toArr[i])
				eval('path_'+thisId+'_'+toArr[i]+'.remove();path_'+thisId+'_'+toArr[i]+'=""');
				
				drawline($("#"+thisId),$("#"+toArr[i]),'',data);
			}
		}
	}
			
}


//脉络图所有数据保存到表单中
function saveData(){
	var jsonData='{width:'+$('#YH-FM-mindMap').width()+',height:'+$('#YH-FM-mindMap').height()+',bId:'+boxId+',pStrokeWidth:'+initStrokeWidth+',pStroke:"'+$('#YH-FM-initBorderColor i').css('background-color')+'",p:{';
	setPath.forEach(function(p){
		jsonData+='path_'+p.data("from")+'_'+p.data("to")+':{path:"'+p.attr("path")+'",data:\'from:\"'+p.data("from")+'\",to:\"'+p.data("to")+'\",lineType:\"'+p.data("lineType")+'\"\',stroke:\"'+p.attr("stroke")+'\"},'
	})
	jsonData=jsonData.replace(/\,$/,'')+'}}';
	$('#YH-FM-mapData textarea[name="mapXml"]').val($.trim($('#YH-FM-boxDrop').clone().find('.ui-resizable-handle').remove().end().find('.tableBox').removeAttr('oncontextmenu').attr('class','YH-FM-box').end().html()));
	$('#YH-FM-mapData textarea[name="mapPath"]').val(jsonData);
	$('#YH-FM-mapData textarea[name="mapBoxBg"]').val($.trim($('#YH-FM-bgBox').html()));
	$('#YH-FM-mapData textarea[name="mapTableBg"]').val($.trim($('#YH-FM-bgTable').clone().find('.ui-resizable-handle').remove().end().find('th').removeAttr('oncontextmenu').end().html()));
	
}



//检查线path1和path2是否有交点，有则在交点处划出弧形
Raphael.showPathIntersection=function(path1,path2){
	var dots=Raphael.pathIntersection(path1.attr("path"),path2.attr("path"));
	
	
	var path1Point= new Array(); 
	var path2Point= new Array(); 
	for(i in dots){
		
		//alert("(x:"+dots[i]['x']+")(y:"+dots[i]['y']+")(t1:"+dots[i]['t1']+")(t2:"+dots[i]['t2']+")(segment1:"+dots[i]['segment1']+")(segment2:"+dots[i]['segment2']+")(bez1:"+dots[i]['bez1']+")(bez2:"+dots[i]['bez2']+")");
		
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

