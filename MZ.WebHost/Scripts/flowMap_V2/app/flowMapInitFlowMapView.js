define('initFlowMapView', function(require,exports,module) {
	function initFlowMapView(data, stateJson) {
		setTimeout(function() {
			$('#YH-FM-flowMap').css({'height': data.height, 'width': data.width});
			$('#YH-FM-flowMapData').css({
				'height': (data.height * 1 - $('#YH-FM-flowMapBgTable th:first').outerHeight() * 1),
				'width': (data.width * 1 - $('#YH-FM-flowMapBgTable th:first').outerWidth() * 1),
				'top': $('#YH-FM-flowMapBgTable th:first').outerHeight(),
				'left': $('#YH-FM-flowMapBgTable th:first').outerWidth()
			});
			$('#YH-FM-flowMapLayer1,#YH-FM-flowMapLayer2,#YH-FM-flowMapLayer3').css({
				'height': (data.height * 1 - $('#flowMapBgTable th:first').outerHeight() * 1),
				'width': '100%'
			});
			var flowMapCanvas = Raphael('YH-FM-flowMapLayer2', '100%', data.height * 1 - $('#YH-FM-flowMapBgTable th:first').outerHeight() * 1);

			var lines = {};

			$.each(data.lines, function (lineName, line) {
				lines[lineName] = flowMapCanvas.path(line.finalPath).attr({
					stroke: data.pStroke,
					"stroke-width": data.pStrokeWidth,
					"stroke-dasharray": line.strokeDasharray,
					"arrow-end": "2",
					"transform": line.transform
				})
			})

			for (var i in stateJson) {
				var $node = $('[nodeid=' + i + ']');
				console.log(stateJson[i].flag);
				if (stateJson[i].flag) {
					$node.append('<i class="' + stateJson[i].flag + '"></i>');
				}
				if (stateJson[i]['isDeliver']) {
					$node.append('<i class="flag4" ></i>');
				}
			}
		}, 100)
	}
	module.exports = initFlowMapView
})

function showInfo(json,$cObj){
	if ($cObj.attr('tasktype') === 'noInfo') return;
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
			html += '<a href="/PlanManage/ProjTaskInfo/' + json.taskId + '?retType=1&isEdit=' + isEdit + '" target="_blank">' + json.title + '</a></dt>';
		} else {
			html += '<a href="/PlanManage/ProjTaskInfo/' + json.taskId + '?retType=1" target="_blank">' + json.title + '</a></dt>';
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


