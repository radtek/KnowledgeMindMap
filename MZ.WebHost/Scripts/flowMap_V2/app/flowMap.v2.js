
//var boxId = 0;
//var paper = Raphael('YH-FM-lineLayer','100%', 500);
//var setPath=paper.set();
//var mapHeight;
//var mapWidth;
//var initStroke='#0000ff';
define('flowMap', function(require, exports, module){
    var bgTable = require('flowMapBgTable');
    var menu = require('flowMapMenu');
    var svg = require('flowMapSvg');
    var node = require('flowMapNode');
    var selectNodes = require('flowMapSelectNodes');
    ;(function ($, Raphael) {

        var FM = {};
        var FlowMap = {};
        FM.canvas = {};

        FM.datas = {id:0};
        var paper;
        var initGrid=5;
        //var $template = $('<div class="YH-FM-box" ><div class="boxCon">右键编辑</div></div>');

        FM.canvas.box = $('#YH-FM-canvas');
        FM.canvas.bgBox = $('#YH-FM-bgBox');
        FM.canvas.lineLayer = $('#YH-FM-lineLayer');
        FM.canvas.boxDrop = $('#YH-FM-boxDrop');
        paper = Raphael(FM.canvas.lineLayer[0],'100%', 500);

        FlowMap.initFlowMapEditor = function (mapData) {
            if (!mapData) return;

            $('#YH-FM-canvasHeight').val(mapData.height).blur();
            $('#YH-FM-canvasWidth').val(mapData.width).blur();
            $('#YH-FM-initBoxBorderWidth').val(mapData.pStrokeWidth);
            $('#YH-FM-initBorderColor i').css('background-color', mapData.pStroke);
            FM.datas.id = mapData.nodeId;

            FlowMap.setPathStyle({
                strokeWidth: mapData.pStrokeWidth,
                strokeColor: mapData.pStroke
            })

            FM.canvas.boxDrop.children('.YH-FM-box').each(function () {
                var $this = $(this);
                FM.generateNode({
                    nodeID: $this.attr('nodeId'),
                    $frontDiv: $this,
                    $backDiv: FM.canvas.bgBox.children('[nodeId='+ $this.attr('nodeId') +']')
                });
            })

            $.each(mapData.lines, function (lineName, line) {
                FM.svg.drawline(FM.datas[line.from], FM.datas[line.to], line);
            })
        }


        bgTable(FM, $)
        selectNodes(FM, paper, $)
        svg(FM, paper, $, Raphael)
        node(FM, $)
        menu(FM, UE, $)

        FM.canvas.box.on('contextmenu', function (e) {
            var action = {
                event: e,
                type: 'createNodeMenu',
                createNode: FM.createNode,
                cloneNode: FM.cloneNode
            }
            FM.menu(action);
            return false;
        });
        FM.canvas.lineLayer.on('mousedown', FM.selectNodes);

        // 改变画布大小
        FlowMap.canvasResize = function (val) {
            if (val.width) {
                $('#YH-FM-mindMap').width(val.width);
                $("#YH-FM-canvas").css({
                    'width': val.width,
                    'left': $('#YH-FM-bgTable  th:first').outerWidth()
                });
            }
            if (val.height) {
                $('#YH-FM-mindMap').height(val.height);
                $("#YH-FM-bgBox,#YH-FM-lineLayer").css({'height': val.height});
                $("#YH-FM-canvas").css({
                    'height': val.height,
                    'top': $('#YH-FM-bgTable th:first').outerHeight()
                });
                paper.setSize('100%',  val.height)
            }
        }
        FlowMap.setPathStyle = function (val) {
            if (val.strokeColor) {
                FM.svg.lineSet.attr({'stroke': val.strokeColor}).data("stroke", val.strokeColor);
                FM.svg.setInitStroke(val.strokeColor);
            }
            if (val.strokeWidth) {
                FM.svg.setInitStrokeWidth(val.strokeWidth);
            }
        }

        FlowMap.setDrawLineState = function (getStart) {
            if (getStart) {
                FM.svg.drawLineState.state = 'drawLineStart';
            } else {
                FM.svg.drawLineState.state = false;
            }
        }

        //脉络图所有数据保存到表单中
        var generateData = function() {
            var jsonData = {
                width: $('#YH-FM-mindMap').width(),
                height: $('#YH-FM-mindMap').height(),
                nodeId: FM.datas.id,
                pStrokeWidth: FM.svg.getInitStrokeWidth(),
                pStroke: $('#YH-FM-initBorderColor i').css('background-color'),
                lines: {}
            }

            $.each(FM.lines, function (lineName, line) {
                jsonData.lines[lineName] = {
                    path: line.attr("path"),
                    from: line.data('from'),
                    to: line.data('to'),
                    strokeDasharray: line.attr('stroke-dasharray'),
                    lineType: line.data('lineType'),
                    transform: line.attr('transform')
                }
            })

            $('#YH-FM-mapData textarea[name="mapXml"]').val($.trim($('#YH-FM-boxDrop').clone().find('.ui-resizable-handle').remove().end().find('.tableBox').removeAttr('oncontextmenu').attr('class','YH-FM-box').end().html()));
            $('#YH-FM-mapData textarea[name="mapPath"]').val(JSON.stringify(jsonData));
            $('#YH-FM-mapData textarea[name="mapBoxBg"]').val($.trim($('#YH-FM-bgBox').html()));
            $('#YH-FM-mapData textarea[name="mapTableBg"]').val($.trim($('#YH-FM-bgTable').clone().find('.ui-resizable-handle').remove().end().find('th').removeAttr('oncontextmenu').end().html()));

        }

        FlowMap.previewMap = function () {

            var $popUpBox = $('<div id="YH-FM-pop"><div id="YH-FM-pop-close"></div><div id="YH-FM-popMap"><div id="YH-FM-flowMap"></div></div><div  id="YH-FM-popMap-saveBtn"><button id="YH-FM-saveCanvas" class="YH-FM-btn">保存</button></div></div>');
            var $mapArea = $popUpBox.find('#YH-FM-flowMap');

            generateData();

            var svgData = JSON.parse($('#YH-FM-mapData textarea[name="mapPath"]').val());

            $mapArea.css({
                'height': svgData.height,
                'width':svgData.width
            }).append('<table id="YH-FM-flowMapBgTable">'+$('#YH-FM-mapData textarea[name="mapTableBg"]').val()+'</table><div id="YH-FM-flowMapData"><div id="YH-FM-flowMapLayer1"></div><div id="YH-FM-flowMapLayer2"></div><div id="YH-FM-flowMapLayer3"></div></div>');

            $popUpBox.appendTo('body')

            $mapArea.find('#YH-FM-flowMapData').css({
                'height': (svgData.height*1 - $('#YH-FM-flowMapBgTable th:first').outerHeight()*1),
                'width': (svgData.width*1 - $('#YH-FM-flowMapBgTable th:first').outerWidth()*1),
                'top': $mapArea.find('#YH-FM-flowMapBgTable th:first').outerHeight(),
                'left': $mapArea.find('#YH-FM-flowMapBgTable th:first').outerWidth()
            });
            $mapArea.find('#YH-FM-flowMapLayer1,#YH-FM-flowMapLayer2,#YH-FM-flowMapLayer3').css({
                'height': (svgData.height*1 - $('#YH-FM-flowMapBgTable th:first').outerHeight()*1),
                'width': '100%'
            });
            $mapArea.find('#YH-FM-flowMapLayer1').html($('#YH-FM-mapData textarea[name="mapBoxBg"]').val());
            $mapArea.find('#YH-FM-flowMapLayer3').html($('#YH-FM-mapData textarea[name="mapXml"]').val());
            var flowMapCanvas = Raphael('YH-FM-flowMapLayer2', '100%', svgData.height*1 - $('#YH-FM-flowMapBgTable th:first').outerHeight()*1);

            var lines = {};
            var flowSetPath = paper.set();
            var newSetPath = paper.set();

            $.each(svgData.lines, function (lineName, line) {
                lines[lineName] = flowMapCanvas.path(line.path).attr({
                    stroke: svgData.pStroke,
                    "stroke-width": svgData.pStrokeWidth,
                    "stroke-dasharray": line.strokeDasharray,
                    "arrow-end":"2",
                    "transform": line.transform,
                }).data({
                    orgLine: line
                })
                flowSetPath.push(lines[lineName]);
                newSetPath.push(lines[lineName]);
            })

            flowSetPath.forEach(function(line){
                newSetPath.exclude(line)
                newSetPath.forEach(function(lineB){
                    FM.svg.showPathIntersection(line, lineB);
                    line.data('orgLine').finalPath = line.attr('path');
                    lineB.data('orgLine').finalPath = lineB.attr('path');
                })
            })

            $('#YH-FM-mapData textarea[name="mapPath"]').val(JSON.stringify(svgData));
            $popUpBox.find('#YH-FM-popMap').css({'height': svgData.height, 'width': svgData.width}).draggable();
            $popUpBox.find('#YH-FM-pop-close').click(function(){
                $('#YH-FM-pop').remove()
            })

            //提交数据
            $popUpBox.find('#YH-FM-saveCanvas').click(function(){
                var mapXml = $("#YH-FM-mapData").find("textarea[name=mapXml]").val();
                var mapPath = $("#YH-FM-mapData").find("textarea[name=mapPath]").val();

                var mapBoxBg = $("#YH-FM-mapData").find("textarea[name=mapBoxBg]").val();
                var mapTableBg = $("#YH-FM-mapData").find("textarea[name=mapTableBg]").val();
                var path = "/Content/ContextDiagram/SSV2-Graph.xml";
                var formUrl = $("#YH-FM-mapData").attr('action');

                var formdata = "mapXml=" + escape(mapXml.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|")) + "&mapPath=" + escape(mapPath.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|"))
                    + "&mapBoxBg=" + escape(mapBoxBg.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|")) + "&mapTableBg=" + escape(mapTableBg.replace(/\"/g, '|Q|').replace(/</g, "|L|").replace(/>/g, "|R|"))
                    + "&xmlFilePath=" + escape(path);

                formdata += "&diagramId=" + $("#YH-FM-mapData").find("[name=diagramId]").val();

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
            })

        }
        module.exports =  FlowMap;
    })(jQuery, Raphael);
});

