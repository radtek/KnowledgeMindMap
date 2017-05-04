define('flowMapNode', function(require,exports,module) {
	function node(FM, $) {
		function Node(opts) {
			var This = this
			this.top = opts.top;
			this.left = opts.left;
			this.width = opts.width || 70;
			this.height = opts.height || 30;
			this.id = opts.nodeID;
			this.from = {};
			this.to = {};
			this.$frontDiv = opts.$frontDiv || $('<div class="YH-FM-box" nodeId="' + this.id + '"><div class="boxCon">右键编辑</div></div>');
			this.$backDiv = opts.$backDiv || $('<div class="YH-FM-bgItem" nodeId="' + this.id + '"></div>');

			var nodeCss = opts.$frontDiv && !opts.isClone ? {} : {
				top: This.top,
				left: This.left,
				width: This.width,
				height: This.height
			}

			this.$frontDiv.css(nodeCss).on('mousedown', function (e) {
				if ($(e.target).hasClass('ui-resizable-handle')) return;
				This.drag(e);
				return false;
			}).on('click', function (e) {
				if (FM.svg.drawLineState.state) {
					This[FM.svg.drawLineState.state](e)
				}
			}).on('contextmenu', function (e) {
				var action = {
					type: 'editNodeMenu',
					node: This,
					event: e
				}
				FM.menu(action);
				return false;
			}).resizable({
				alsoResize: This.$backDiv,
				resize: function (e) {
					$.each(This.from, function () {
						FM.svg.reDrawLine(this);
					})
					$.each(This.to, function () {
						FM.svg.reDrawLine(this);
					})
				}
			})

			this.$frontDiv.data('node', this);
			this.$backDiv.css(nodeCss).data('node', this);

			FM.canvas.bgBox.append(this.$backDiv);
			FM.canvas.boxDrop.append(this.$frontDiv);
		}

		Node.prototype.delete = function () {

			$.each(this.from, function (lineName) {
				delete FM.datas[FM.lines[lineName].data('from')].to[lineName];
				delete FM.lines[lineName];
				this.remove()
			})

			$.each(this.to, function (lineName) {
				delete FM.datas[FM.lines[lineName].data('to')].from[lineName];
				delete FM.lines[lineName];
				this.remove()
			})

			this.$frontDiv.remove();
			this.$backDiv.remove();
			delete FM.datas[this.id];
		}
		Node.prototype.drag = function (e) {

			var This = this;
			var beforeX = e.pageX;
			var beforeY = e.pageY;
			var isMultiSelected = $(e.currentTarget).hasClass('YH-FM-selectedNode');

			if (isMultiSelected) {
				$moveTargets = FM.selectedNodes.$frontNodes.add(FM.selectedNodes.$backNodes);
			} else {
				$moveTargets = this.$frontDiv.add(this.$backDiv);
			}

			var mousemoveFn = function (e) {
				var deltaX = e.pageX - beforeX;
				var deltaY = e.pageY - beforeY;
				//
				beforeX = e.pageX;
				beforeY = e.pageY;
				var deltaStrX = deltaX > 0 ? '+=' + Math.abs(deltaX) : '-=' + Math.abs(deltaX);
				var deltaStrY = deltaY > 0 ? '+=' + Math.abs(deltaY) : '-=' + Math.abs(deltaY);

				$moveTargets.css({
					top: deltaStrY,
					left: deltaStrX
				})

				if (isMultiSelected) {
					FM.selectedNodes.innerLines.translate(deltaX, deltaY);
					$.each(FM.selectedNodes.relevantLines, function () {
						FM.svg.reDrawLine(this);
					})
				} else {
					$.each(This.from, function () {
						FM.svg.reDrawLine(this);
					})
					$.each(This.to, function () {
						FM.svg.reDrawLine(this);
					})
				}
				return false;
			}
			var mouseupFn = function (e) {

				$('body').off('mousemove', mousemoveFn).off('mouseup', mouseupFn);
			}
			$('body').on('mousemove', mousemoveFn).on('mouseup', mouseupFn);

		}
		Node.prototype.drawLineStart = function (e) {
			FM.svg.drawLineState.startNode = this;
			FM.svg.drawLineState.state = 'drawLineEnd';
		}
		Node.prototype.drawLineEnd = function (e) {
			if (FM.svg.drawLineState.startNode === this) return;

			FM.svg.drawLineState.state = 'drawLineStart';
			FM.svg.drawline(FM.svg.drawLineState.startNode, this);
			FM.svg.drawLineState.startNode = null;

		}


		FM.createNode = function (top, left) {
			var nodeID = ++FM.datas.id;

			FM.datas[nodeID] = new Node({
				nodeID: nodeID,
				top: top,
				left: left
			});
		}

		FM.generateNode = function (data) {
			FM.datas[data.nodeID] = new Node(data);
		}

		FM.cloneNode = function (top, left, cloneNode) {
			var nodeID = ++FM.datas.id;

			FM.datas[nodeID] = new Node({
				nodeID: nodeID,
				top: top,
				left: left,
				width: cloneNode.$frontDiv.width(),
				height: cloneNode.$frontDiv.height(),
				$frontDiv: cloneNode.$frontDiv.clone(false).removeClass('ui-resizable').attr('nodeid', nodeID).find('.ui-resizable-handle').remove().end(),
				$backDiv: cloneNode.$backDiv.clone(false).attr('nodeid', nodeID),
				//$frontDiv: cloneNode.$frontDiv.clone(false).removeClass('ui-resizable').attr('nodeid', nodeID).find('.ui-resizable-handle').remove().end(),
				//$backDiv: cloneNode.$backDiv.clone(false).attr('nodeid', nodeID),
				isClone: true
			});
		}

	}
	module.exports = node;
})