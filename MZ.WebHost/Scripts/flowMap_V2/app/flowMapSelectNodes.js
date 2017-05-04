define('flowMapSelectNodes', function(require,exports,module) {
	function selectNodes(FM, paper, $) {
		var getNodeInArea = function (area, $nodeList) {
			var $targetNodes = $();
			var areaMinX = area.left,
					areaMinY = area.top,
					areaMaxX = area.left + area.width,
					areaMaxY = area.top + area.height;

			$nodeList.each(function () {
				var $node = $(this);
				var nodeMinX = $node.position().left,
						nodeMinY = $node.position().top,
						nodeMaxX = nodeMinX + $node.width(),
						nodeMaxY = nodeMinY + $node.height();
				var isOutSide = nodeMaxX < areaMinX || nodeMaxY < areaMinY || nodeMinX > areaMaxX || nodeMaxY > areaMaxY;

				if (!isOutSide) {
					$targetNodes = $targetNodes.add($node);
				}
			})
			return $targetNodes;
		}

		FM.selectedNodes = {
			innerLines: paper.set(),
			relevantLines: {}
		}

		FM.selectNodes = function (e) {
			var $this = $(this);
			if (e.target.raphael || e.which !== 1) {
				return true;
			}
			var orgY = e.pageY;
			var orgX = e.pageX;
			var offX = $this.offset().left;
			var offY = $this.offset().top;
			var $mask = $('<div class="YH-FM-mask" style="top:' + (e.pageY - offY) + 'px; left: ' + (e.pageX - offX) + 'px">');
			var startTime = (new Date()).getTime();

			var mouseMoveFn = function (e) {
				var top, left, width, height;
				width = Math.abs(e.pageX - orgX);
				height = Math.abs(e.pageY - orgY);

				if (e.pageX - orgX < 0) {
					left = e.pageX - offX;
				}
				if (e.pageY - orgY < 0) {
					top = e.pageY - offY;
				}
				$mask.css({
					width: width,
					height: height,
					top: top,
					left: left
				})
				return false;
			};
			var mouseUpFn = function (e) {
				FM.removeMenu();
				$('.YH-FM-selectedNode').removeClass('YH-FM-selectedNode');
				$('body').off('mousemove', mouseMoveFn).off('mouseup', mouseUpFn);
				if ((new Date()).getTime() - startTime < 200) {
					$mask.remove();
					return true;
				}

				$('.YH-FM-selectedNode').removeClass('YH-FM-selectedNode');

				var area = {
					top: $mask.position().top,
					left: $mask.position().left,
					width: $mask.width(),
					height: $mask.height()
				}

				FM.selectedNodes.$frontNodes = getNodeInArea(area, FM.canvas.boxDrop.children());
				FM.selectedNodes.$backNodes = getNodeInArea(area, FM.canvas.bgBox.children());

				var fromLines = {};
				var toLines = {};
				FM.selectedNodes.$frontNodes.each(function () {
					var node = $(this).data('node');
					$.extend(fromLines, node.from);
					$.extend(toLines, node.to);
				})

				FM.selectedNodes.innerLines.clear();
				$.each(fromLines, function (fromLineID) {
					var fromLine = this;
					$.each(toLines, function (toLineID) {
						if (fromLine === this) {
							FM.selectedNodes.innerLines.push(this);
							console.log(fromLineID, toLineID, this)
							delete fromLines[fromLineID];
							delete toLines[toLineID];
						}
					})
				})
				FM.selectedNodes.relevantLines = $.extend({}, fromLines, toLines);

				//console.log(FM.selectedNodes);

				FM.selectedNodes.$frontNodes.addClass('YH-FM-selectedNode');
				$mask.remove();
			}
			$(this).append($mask);
			$('body').on('mousemove', mouseMoveFn).on('mouseup', mouseUpFn);
			return false;
		}

	}
	module.exports = selectNodes;
});