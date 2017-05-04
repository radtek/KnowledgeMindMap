define('flowMapSvg', function(require,exports,module) {
	function svg(FM, paper, $, Raphael) {
		svg = {}
		svg.lineSet = paper.set();
		var datas = FM.datas;
		var lines = {};
		FM.lines = lines;
		var line1, line2;
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

		//鼠标拖动改变线条1
		function changeLine1 (line) {
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
			var orgDashaary = o.obj.attr("stroke-dasharray");
			o.down = function(){
				this.obj.attr({"stroke-dasharray": ".",path:this.pathInfo});
			};
			o.move = function(dH,dV,x,y){
				o.obj.attr('transform', '');

				var curX=parseInt(x-this.svgX);
				var curY=parseInt(y-this.svgY);

				var fId=line.data('from'),
						from = datas[fId],
						fPosX = from.$frontDiv.position().left,
						fPosY = from.$frontDiv.position().top,
						fH = from.$frontDiv.outerHeight(),
						fW = from.$frontDiv.outerWidth(),
						fCX = parseInt(fPosX + fW*0.5),
						fCY = parseInt(fPosY + fH*0.5),
						fEX = parseInt(fPosX + fW),
						fEY = parseInt(fPosY + fH);
				fEY=parseInt(fPosY+fH);
				var tId=line.data('to'),
						to = datas[tId],
						tPosX = to.$backDiv.position().left,
						tPosY = to.$backDiv.position().top,
						tH = to.$backDiv.outerHeight(),
						tW = to.$backDiv.outerWidth(),
						tCX = parseInt(tPosX + tW*0.5),
						tCY = parseInt(tPosY + tH*0.5),
						tEX = parseInt(tPosX + tW),
						tEY = parseInt(tPosY + tH);

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
				this.obj.attr({"stroke-dasharray": orgDashaary});
				lineclick(o.obj,e);
			}
			o.test = function(gg){
				//alert('hhhhh:'+this.startP);
				this.name=gg;
			};
			return o;
		}

//鼠标拖动改变线条2
		function changeLine2 (line) {
			var o = {};
			o.startP = '1';
			o.endP = '';
			o.midP = '';
			o.obj = line;
			o.pathInfo = o.obj.attr('path').toString().replace(/[a-z]([0-9]|\ |\.|\,)*A([0-9]|\ |\.|\,)*/gi,'');
			o.pathArr = Raphael.parsePathString(o.pathInfo);
			o.segVH = o.pathArr[1][0];
			var orgDashaary = o.obj.attr("stroke-dasharray");
			o.down = function(){
				this.obj.attr({"stroke-dasharray": ".",path:this.pathInfo});
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
				console.log(this.segVH);
				var curP = this.midP + eval("d"+this.segVH);
				console.log(curP);
				if(curP>this.startP && curP<this.endP){
					var str = '([0-9]|\a\ |\a\,|\a\.)*'.replace('a', '');
					var patt1 = new RegExp(this.segVH + str, 'i');
					var nPathInfo=this.pathInfo.replace(patt1,this.segVH + curP);
					this.obj.attr({path:nPathInfo});

				}

				console.log('hello:', this.pathInfo);
				console.log('hello:', nPathInfo);
			};
			o.up = function(e){
				this.obj.attr({"stroke-dasharray": orgDashaary});
				lineclick(o.obj,e);
			}
			return o;
		}

		//点击线条后出现‘删除’和‘转换’按钮
		function lineclick(p,e){


			var action = {
				type: 'editLineMenu',
				line: p,
				event: e
			}
			FM.menu(action);

			return false;

			//curEditPath=p;
			//$('#YH-FM-pathMenu').show().css({top:e.clientY+$(window).scrollTop(),left:e.clientX+$(window).scrollLeft()});
			//setTimeout(hideMenu,500)
			//function hideMenu(){
			//	$('#YH-FM-mindMap').one('click',function(){
			//		$('#YH-FM-pathMenu').hide()
			//		curEditPath=undefined;
			//	})
			//}
		}
		//获取线条信息
		function getPathInfo (from, to) {

			var fId = from.id,
					fPosX = from.$frontDiv.position().left,
					fPosY = from.$frontDiv.position().top,
					fH = from.$frontDiv.outerHeight(),
					fW = from.$frontDiv.outerWidth(),
					fCX = parseInt(fPosX + fW*0.5),
					fCY = parseInt(fPosY + fH*0.5),
					fEX = parseInt(fPosX + fW),
					fEY = parseInt(fPosY + fH);
			var tId = to.id,
					tPosX = to.$backDiv.position().left,
					tPosY = to.$backDiv.position().top,
					tH = to.$backDiv.outerHeight(),
					tW = to.$backDiv.outerWidth(),
					tCX = parseInt(tPosX + tW*0.5),
					tCY = parseInt(tPosY + tH*0.5),
					tEX = parseInt(tPosX + tW),
					tEY = parseInt(tPosY + tH);
			var pInfo = '';
			var lineType;



			function check( p1, len1, p2, len2){
				if(p1>p2){
					return p1>p2+len2? false:true;
				}else{
					return p2>p1+len1? false:true;
				}
			}

			////alert(check(fPosX,fW,tPosX,tW));
			////alert(check(fPosY,fH,tPosY,tH));

			//判断起点和终点位置关系 然后划线
			if(fPosX<=tPosX && fPosY<=tPosY ){
				//alert(11);
				if(check(fPosX,fW,tPosX,tW)){
					//alert(21);

					pInfo='M'+fCX+','+fEY+'V'+(fEY*1+10)+'H'+tCX+'V'+tPosY;
					lineType = 2;

				}else if(check(fPosY,fH,tPosY,tH)){
					//alert(22);
					pInfo='M'+fEX+','+fCY+'H'+(fEX*1+10)+'V'+tCY+'H'+tPosX;
					lineType = 2;
				}else{
					//alert(23);
					pInfo='M'+fCX+','+fEY+'V'+tCY+'H'+tPosX;
					lineType = 1;
				}
			}else if(fPosX>=tPosX && fPosY<=tPosY ){
				//alert(12);
				if(check(fPosX,fW,tPosX,tW)){
					//alert(21);
					pInfo='M'+fCX+','+fEY+'V'+(fEY*1+10)+'H'+tCX+'V'+tPosY;
					lineType = 2;

				}else if(check(fPosY,fH,tPosY,tH)){
					//alert(22);
					pInfo='M'+fPosX+','+fCY+'H'+(fPosX*1-10)+'V'+tCY+'H'+tEX;
					lineType = 2;
				}else{
					//alert(23);
					pInfo='M'+fCX+','+fEY+'V'+tCY+'H'+tEX;
					lineType = 1;
				}
			}else if(fPosX>=tPosX && fPosY>=tPosY ){
				//alert(14);
				if(check(fPosX,fW,tPosX,tW)){
					//alert(21);
					pInfo='M'+fCX+','+fPosY+'V'+(fPosY*1-10)+'H'+tCX+'V'+tEY;
					lineType = 2;

				}else if(check(fPosY,fH,tPosY,tH)){
					//alert(22);
					pInfo='M'+fPosX+','+fCY+'H'+(fPosX*1-10)+'V'+tCY+'H'+tEX;
					lineType = 2;
				}else{
					//alert(23);
					pInfo='M'+fCX+','+fPosY+'V'+tCY+'H'+tEX;
					lineType = 1;
				}
			}else if(fPosX<=tPosX || fPosY>=tPosY ){
				//alert(13);
				if(check(fPosX,fW,tPosX,tW)){
					//alert(21);
					pInfo='M'+fCX+','+fPosY+'V'+(fPosY*1-10)+'H'+tCX+'V'+tEY;
					lineType = 2;

				}else if(check(fPosY,fH,tPosY,tH)){
					//alert(22);
					pInfo='M'+fEX+','+fCY+'H'+(fEX*1+10)+'V'+tCY+'H'+tPosX;
					lineType = 2;
				}else{
					//alert(23);
					pInfo='M'+fCX+','+fPosY+'V'+tCY+'H'+tPosX;
					lineType = 1;
				}
			}

			return {
				info: pInfo,
				type: lineType
			};
		}

		var initStroke='#0000ff';
		var initStrokeWidth=1.5;
		var initStrokeDasharray='';

		svg.setInitStroke = function (color) {
			initStroke = color;
		}
		svg.setInitStrokeWidth = function (value) {
			initStrokeWidth = value;
		}
		svg.getInitStrokeWidth = function () {
			return initStrokeWidth;
		}
		svg.drawline = function (from, to, data){


			var fId = (data && data['from']) || from.id,
					tId = (data && data['to']) || to.id,
					pName = (data && data['name']) || 'path_' + fId + '_' + tId;
			// is line exist
			if(lines[pName]){
				return false;
			}

			var stroke = (data && data['stroke']) ||  initStroke ;
			var strokeWidth = (data && data['stroke-width']) || initStrokeWidth;
			var strokeDasharray = (data && data['strokeDasharray']) ||  initStrokeDasharray;
			var pathData = getPathInfo(from, to);
			var path = (data && data['path']) || pathData.info;
			var lineType = (data && data['lineType']) || pathData.type;


			lines[pName] = paper.path(path);
			lines[pName].id = pName;
			lines[pName].attr({
				stroke: stroke,
				cursor: "move",
				"stroke-width": "3",
				"arrow-end": "2",
				"stroke-dasharray": strokeDasharray,
			}).data({
				stroke: stroke,
				"stroke-width": strokeWidth,
				"stroke-dasharray": strokeDasharray,
				from: fId,
				to: tId,
				lineType: lineType
			}).drag(draggerMove, draggerDown, draggerUp);
			from.to[pName] = to.from[pName] = lines[pName];
			svg.lineSet.push(lines[pName]);
		};

		svg.drawLineState = {
			state: false,
		}

		//删除划线函数
		svg.deletePath = function(line) {

			var from = datas[line.data('from')];
			var to = datas[line.data('to')];
			var fId = line.data('from');
			var tId = line.data('to');
			var pName = 'path_' + fId + '_' + tId;

			delete from.to[pName];
			delete to.from[pName]
			delete lines[pName];
			//把path从set中移除
			svg.lineSet.exclude(line);
			//把path从内存中删除
			line.remove();


		}
		//划线函数
		svg.convetLine = function (line){
			var type = line.data('lineType');

			line.attr('transform', '');
			if(type=='3'){
				svg.reDrawLine(line)
			}else{

				var from = datas[line.data('from')];
				var to = datas[line.data('to')];

				var fId = from.id,
						fPosX = from.$frontDiv.position().left,
						fPosY = from.$frontDiv.position().top,
						fH = from.$frontDiv.outerHeight(),
						fW = from.$frontDiv.outerWidth(),
						fCX = parseInt(fPosX + fW*0.5),
						fCY = parseInt(fPosY + fH*0.5),
						fEX = parseInt(fPosX + fW),
						fEY = parseInt(fPosY + fH);
				var tId = to.id,
						tPosX = to.$backDiv.position().left,
						tPosY = to.$backDiv.position().top,
						tH = to.$backDiv.outerHeight(),
						tW = to.$backDiv.outerWidth(),
						tCX = parseInt(tPosX + tW*0.5),
						tCY = parseInt(tPosY + tH*0.5),
						tEX = parseInt(tPosX + tW),
						tEY = parseInt(tPosY + tH);

				if(fPosX<=tPosX && fPosY<=tPosY ){
					pInfo='M'+fEX+','+fCY+'H'+tCX+'V'+tPosY;
				}else if(fPosX>=tPosX && fPosY<=tPosY ){
					pInfo='M'+fPosX+','+fCY+'H'+tCX+'V'+tPosY;
				}else if(fPosX>=tPosX && fPosY>=tPosY ){
					pInfo='M'+fPosX+','+fCY+'H'+tCX+'V'+tEY;
				}else if(fPosX<=tPosX || fPosY>=tPosY ){
					pInfo='M'+fEX+','+fCY+'H'+tCX+'V'+tEY;
				}
				line.attr('path',pInfo).data('lineType',3);
			}
		}

		// YH-FM-box在调整大小和位置时触发重新划线
		svg.reDrawLine = function (line){
			var from = datas[line.data('from')];
			var to = datas[line.data('to')];

			var path = getPathInfo(from, to);
			line.attr({
				path: path.info,
				transform: ''
			}).data({
				lineType: path.type
			})
		}

		svg.showPathIntersection=function(path1, path2){
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

		FM.svg = svg;

	}
    module.exports = svg;
});