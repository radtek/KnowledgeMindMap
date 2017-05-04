define("flowMap" , ["E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapBgTable.js","E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapMenu.js","E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSvg.js","E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapNode.js","E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSelectNodes.js"], function(require , exports , module){

//var boxId = 0;
//var paper = Raphael('YH-FM-lineLayer','100%', 500);
//var setPath=paper.set();
//var mapHeight;
//var mapWidth;
//var initStroke='#0000ff';

    var bgTable =require("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapBgTable.js");
    var menu =require("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapMenu.js");
    var svg =require("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSvg.js");
    var node =require("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapNode.js");
    var selectNodes =require("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSelectNodes.js");
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


define("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapBgTable.js" , [], function(require , exports , module){

    function bgTable(FM, $) {
        var $table = $('#YH-FM-bgTable');

        $table.on('mouseenter', '.theader-x', function () {
            $(this).resizable({
                handles: "e"
            })
        }).on('mouseenter', '.theader-y', function () {
            $(this).resizable({
                handles: "s"
            })
        }).on('contextmenu', '.theader-x,.theader-y', function (e) {
            var action = {
                event: e,
                type: 'tableMenu',
                node: $(this)
            }
            FM.menu(action)
            return false;
        }).find('.theader-xy').resizable({
            stop: function (e) {
                FM.canvas.box.css({
                    top: $table.find('.theader-xy').outerHeight(),
                    left: $table.find('.theader-xy').outerWidth()
                });
            }
        })

        var table = {};

        table.addRow = function () {
            $('#YH-FM-bgTable colgroup').append($('#YH-FM-bgTable colgroup col:last').clone());
            $('#YH-FM-bgTable tr').each(function (index, element) {
                if (index == 0) {
                    $('#YH-FM-bgTable thead th:last').clone().children('.boxCon').html(UE.getEditor('YH-FM-editor').getContent()).end().children('.ui-resizable-handle').remove().end().appendTo($(this));
                } else {
                    $(this).children().eq(1).clone().appendTo($(this));
                }
            });
        }
        table.addCol = function ($cell) {
            console.log($cell);
            var trObj = $cell.parent('tr');
            var tbodyObj = $cell.parents('tbody');
            trObj.clone().appendTo(tbodyObj).find('.boxCon').html(UE.getEditor('YH-FM-editor').getContent()).end().find('th').children('.ui-resizable-handle').remove()
        }

        table.delRow = function ($cell) {
            $cell.parent('tr').remove()
        }
        table.delCol = function ($cell) {
            var i = $cell.index();
            $('#YH-FM-bgTable colgroup col').eq(i).remove();
            $('#YH-FM-bgTable tr').each(function(index, element) {
                $(this).children().eq(i).remove();
            })
        }


        FM.canvas.box.css({
            top: $table.find('.theader-xy').outerHeight(),
            left: $table.find('.theader-xy').outerWidth()
        });

        FM.table = table;
    };
    module.exports = bgTable;
});
define("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapMenu.js" , [], function(require , exports , module){

    function menu(FM, UE, $) {
        var copyedNode;
        var curAction;
        var $menu;


        var editorMenuHTML = '<div id="YH-FM-mapMenu" style="display:none;">' +
            '<script id="YH-FM-editor" type="text/plain" style="width:348px;height:100px;"></script>' +
            '</div>';

        var nodeMenuHtml = '<div style="display: none">' +
            '<table class="YH-FM-borderTable">' +
            '<colgroup>' +
            '<col width="116" />' +
            '<col width="116"/>' +
            '<col width="117" />' +
            '</colgroup>' +
            '<tbody class="YH-FM-forBoxBtns">' +
            '<tr>' +
            '<td>' +
            '<input name="isAudit" value="1" type="checkbox" />是否需要审核' +
            '</td>' +
            '<td>' +
            '<input name="isKey" value="1" type="checkbox" />是否关键任务' +
            '</td>' +
            '<td >' +
            '类型 <input name="taskType" type="text" style="width:60px;" />' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2">' +
            '边框：' +
            '<select id="YH-FM-boxBorderWidth">' +
            '<option selected="selected" value="1px">1px</option>' +
            '<option value="2px">2px</option>' +
            '<option value="3px">3px</option>' +
            '<option value="4px">4px</option>' +
            '<option value="5px">5px</option>' +
            '</select>' +
            '<select id="YH-FM-boxBorderStyle">' +
            '<option selected="selected" value="solid">实线</option>' +
            '<option value="dashed">虚线</option>' +
            '<option value="dotted">点线</option>' +
            '</select>' +
            '<span id="YH-FM-csBorder" class="YH-FM-colorSelector">' +
            '<i></i>' +
            '</span>' +
            '</td>' +
            '<td >' +
            '背景：' +
            '<span id="YH-FM-csBackground" class="YH-FM-colorSelector">' +
            '<i></i>' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<div class="YH-FM-menuCenterBtns">' +
            '<button id="YH-FM-submitUeditor" class="YH-FM-btn">修改</button>' +
            '<button id="YH-FM-copyBox" class="YH-FM-btn">复制</button>' +
            '<button id="YH-FM-delTableBox" class="YH-FM-btn">删除</button>' +
            '</div></div>';

        var tableMenuHtml = '<div style="display: none">' +
            '<table class="YH-FM-borderTable">' +
            '<colgroup>' +
            '<col width="116" />' +
            '<col width="116"/>' +
            '<col width="117" />' +
            '</colgroup>' +
            '<tbody class="YH-FM-forTableBtns">' +
            '<tr>' +
            '<td>边框：' +
            '<span id="YH-FM-cellBorderColor" class="YH-FM-colorSelector">' +
            '<i></i>' +
            '</span>' +
            '</td>' +
            '<td>头背景：' +
            '<span id="YH-FM-headerBackgroundColor" class="YH-FM-colorSelector">' +
            '<i></i>' +
            '</span>' +
            '</td>' +
            '<td >' +
            '内容背景：' +
            '<span id="YH-FM-cellBackgroundColor" class="YH-FM-colorSelector">' +
            '<i></i>' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<div class="YH-FM-menuCenterBtns">' +
            '<button id="YH-FM-updateCell" class="YH-FM-btn">修改</button>' +
            '<button id="YH-FM-addCell" class="YH-FM-btn" >添加</button>' +
            '<button id="YH-FM-delCell" class="YH-FM-btn" >删除</button>' +
            '</div></div>';

        var lineMenuHtml = '<div id="YH-FM-pathMenu" style="display: none">' +
            '<label>虚线：<input type="checkbox" id="YH-FM-pathStyle"></label>' +
            '<button id="YH-FM-delPathBtn" class="YH-FM-btn">删除</button>' +
            '<button id="YH-FM-convetLineBtn" class="YH-FM-btn mt5">转换</button>' +
            '</div>';

        var $lineMenu = $(lineMenuHtml).appendTo('body');
        var $lineMenuConvertBtn = $lineMenu.find('#YH-FM-convetLineBtn');
        var $lineMenuDeleteBtn = $lineMenu.find('#YH-FM-delPathBtn');
        var $lineMenuStyleBtn = $lineMenu.find('#YH-FM-pathStyle');
        $lineMenuConvertBtn.click(function (e) {
            FM.svg.convetLine(curAction.line);
            $menu.hide();
        })
        $lineMenuDeleteBtn.click(function (e) {
            FM.svg.deletePath(curAction.line);
            $menu.hide();
        })
        $lineMenuStyleBtn.change(function (e) {
            if ($(this).is(':checked')) {
                curAction.line.attr({"stroke-dasharray": "-"});
            } else {
                curAction.line.attr({"stroke-dasharray": ""});
            }
        })

        var $nodeMenu = $(nodeMenuHtml);
        var $editorMenuIsAudit = $nodeMenu.find('[name=isAudit]');
        var $editorMenuIsKey = $nodeMenu.find('[name=isKey]');
        var $editorMenuTaskType = $nodeMenu.find('[name=taskType]');
        var $editorMenuBoxBorderWidth = $nodeMenu.find('#YH-FM-boxBorderWidth');
        var $editorMenuBoxBorderStyle = $nodeMenu.find('#YH-FM-boxBorderStyle');
        var $editorMenuCSBorder = $nodeMenu.find('#YH-FM-csBorder i');
        var $editorMenuCSBackground = $nodeMenu.find('#YH-FM-csBackground i');
        var $editorMenuSubmitUeditor = $nodeMenu.find('#YH-FM-submitUeditor');
        var $editorMenuCopyBox = $nodeMenu.find('#YH-FM-copyBox');
        var $editorMenuDelTableBox = $nodeMenu.find('#YH-FM-delTableBox');

        var $tableMenu = $(tableMenuHtml);
        var $editorMenuHeaderBackgroundColor = $tableMenu.find('#YH-FM-headerBackgroundColor i');
        var $editorMenuCellBorderColor = $tableMenu.find('#YH-FM-cellBorderColor i');
        var $editorMenuCellBackgroundColor = $tableMenu.find('#YH-FM-cellBackgroundColor i');
        var $editorMenuUpdateCell = $tableMenu.find('#YH-FM-updateCell');
        var $editorMenuAddCell = $tableMenu.find('#YH-FM-addCell');
        var $editorMenuDelCell = $tableMenu.find('#YH-FM-delCell');

        var $editorMenu = $(editorMenuHTML).append($tableMenu).append($nodeMenu);


        $editorMenuHeaderBackgroundColor.ColorPicker({
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
                $editorMenuHeaderBackgroundColor.css('backgroundColor', '#' + hex);
                $('.YH-FM-boxEditing').parent('tr').css('backgroundColor', '#' + hex);
                curAction.node.css('backgroundColor', '#' + hex);
            }
        });

        $editorMenuCellBorderColor.ColorPicker({
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
                $editorMenuCellBorderColor.css('backgroundColor', '#' + hex);
                curAction.node.attr('CellBorderColor', '#' + hex);
                if (curAction.node.hasClass('theader-x')) {
                    var i = curAction.node.index();
                    $('#YH-FM-bgTable tr').each(function(index, element) {
                        $(this).children().eq(i).css({'border-left-color':'#' + hex,'border-right-color':'#' + hex});
                    })
                } else {
                    curAction.node.parent('tr').children().each(function(index, element) {
                        $(this).css({'border-top-color':'#' + hex,'border-bottom-color':'#' + hex});
                    });
                }
            }
        });
        $editorMenuCellBackgroundColor.ColorPicker({
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
                $editorMenuCellBackgroundColor.css('backgroundColor', '#' + hex);
                curAction.node.attr('CellBackgroundColor', '#' + hex);
                if (curAction.node.hasClass('theader-x')) {
                    $('#YH-FM-bgTable colgroup').find('col').eq(curAction.node.index()).css('backgroundColor', '#' + hex);
                } else {
                    curAction.node.parent('tr').css('backgroundColor', '#' + hex);
                }
            }
        });


        $editorMenuIsAudit.change(function(){
            curAction.node.$frontDiv.attr('audit', $(this).is(':checked') ? "1" : "0");
        })
        $editorMenuIsKey.change(function(){
            curAction.node.$frontDiv.attr('key',$(this).is(':checked') ? "1" : "0");
        })
        $editorMenuTaskType.blur(function(){
            curAction.node.$frontDiv.attr('tasktype',$(this).val());
        })
        $editorMenuBoxBorderWidth.change(function (e) {
            curAction.node.$backDiv.css('border-width', $(this).val());
        })
        $editorMenuBoxBorderStyle.change(function (e) {
            curAction.node.$backDiv.css('border-style', $(this).val());
        })

        $editorMenuSubmitUeditor.click(function (e) {
            curAction.node.$frontDiv.attr('title', uEditor.getContentTxt()).children('.boxCon').html(uEditor.getContent());
            $editorMenu.hide();
        })
        $editorMenuCopyBox.click(function (e) {
            copyedNode = curAction.node;
            $editorMenu.hide();
        })
        $editorMenuDelTableBox.click(function (e) {
            curAction.node.delete();
            $editorMenu.hide();
        })
        $editorMenuCSBorder.ColorPicker({
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
                $editorMenuCSBorder.css('backgroundColor', '#' + hex);
                curAction.node.$backDiv.css('border-color', '#' + hex);
            }
        });

        $editorMenuCSBackground.ColorPicker({
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
                $editorMenuCSBackground.css('backgroundColor', '#' + hex);
                curAction.node.$backDiv.css('background-color', '#' + hex);
            }
        });

        $editorMenuUpdateCell.click(function (e) {
            curAction.node.attr('title', uEditor.getContentTxt()).children('.boxCon').html(uEditor.getContent());
            $editorMenu.hide();
        })

        $editorMenuAddCell.click(function (e) {
            if (curAction.node.hasClass('theader-x')) {
                FM.table.addRow(curAction.node)
            } else {
                FM.table.addCol(curAction.node)
            }
            $editorMenu.hide();
        })
        $editorMenuDelCell.click(function (e) {
            if (curAction.node.hasClass('theader-x')) {
                FM.table.delCol(curAction.node)
            } else {
                FM.table.delRow(curAction.node)
            }
            $editorMenu.hide();
        })

        $editorMenu.appendTo('body');

        var uEditor = UE.getEditor('YH-FM-editor');

        var $createNodeMenu = $('<div id="YH-FM-newMenu" style="display: none"></div>');
        var $newNodeBtn = $('<button id="YH-FM-newBoxBtn" class="YH-FM-btn width100">新建</button>');
        var $pasteNodeBtn = $('<button id="YH-FM-newBoxBtn" style="display: none" class="YH-FM-btn width100">黏贴</button>');
        $createNodeMenu.append($newNodeBtn).append($pasteNodeBtn);

        $newNodeBtn.on('click', function (e) {
            curAction.createNode($menu.position().top, $menu.position().left);
            $createNodeMenu.hide();
        })

        $pasteNodeBtn.click(function (e) {
            curAction.cloneNode($menu.position().top, $menu.position().left, copyedNode);
            $createNodeMenu.hide();
        })

        FM.canvas.box.append($createNodeMenu);


        var menu = function (action) {
            curAction = action;
            var wHeight = $(window).height();
            var wWidth = $(window).width();
            switch (action.type) {
                case 'createNodeMenu':

                    $menu = $createNodeMenu;

                    if (copyedNode) {
                        $pasteNodeBtn.show();
                    }

                    $menu.css({
                        top: action.event.offsetY,
                        left: action.event.offsetX,
                        display: 'block'
                    })
                    break;

                case 'editNodeMenu':
                    $menu = $editorMenu;
                    $nodeMenu.show();
                    $tableMenu.hide();
                    uEditor.setContent(action.node.$frontDiv.children('.boxCon').html());

                    var bg = action.node.$backDiv.css('background-color');
                    var borderColor = action.node.$backDiv.css('border-top-color');
                    var borderStyle = action.node.$backDiv.css('border-top-style');
                    var borderWidth = action.node.$backDiv.css('border-top-width');
                    var isAudit = action.node.$frontDiv.attr('audit')=='1'? true : false;
                    var isKey = action.node.$frontDiv.attr('key')=='1'?  true : false;
                    var taskType = action.node.$frontDiv.attr('tasktype') || '';

                    $editorMenuIsAudit.attr('checked',isAudit);
                    $editorMenuIsKey.attr('checked',isKey);
                    $editorMenuTaskType.val(taskType);
                    $editorMenuBoxBorderWidth.children('option[value="'+borderWidth+'"]').attr('selected',true);
                    $editorMenuBoxBorderStyle.children('option[value="'+borderStyle+'"]').attr('selected',true);
                    $editorMenuCSBorder.css('background-color',borderColor);
                    $editorMenuCSBackground.css('background-color',bg);


                    $menu.css({
                        top: action.event.pageY + 260 > wHeight ? wHeight - 260 : action.event.pageY,
                        left: action.event.pageX + 350 > wWidth ? wWidth - 350 : action.event.pageX,
                        display: 'block'
                    })
                    break;
                case 'tableMenu':
                    $menu = $editorMenu;

                    uEditor.setContent(action.node.children('.boxCon').html());
                    var bg = action.node.css('background-color');
                    var CellBackgroundColor=action.node.attr('CellBackgroundColor') || '#fff';
                    var CellborderColor=action.node.attr('CellborderColor') || '#fff';

                    $editorMenuCellBackgroundColor.css('background-color',CellBackgroundColor);
                    $editorMenuCellBorderColor.css('background-color',CellborderColor);
                    $editorMenuHeaderBackgroundColor.css('background-color',bg);

                    $tableMenu.show();
                    $nodeMenu.hide();

                    $menu.css({
                        top: action.event.pageY + 260 > wHeight ? wHeight - 260 : action.event.pageY,
                        left: action.event.pageX + 350 > wWidth ? wWidth - 350 : action.event.pageX,
                        display: 'block'
                    })
                    break;

                case 'editLineMenu':
                    $menu = $lineMenu;

                    $lineMenuStyleBtn.prop('checked', !!curAction.line.attr("stroke-dasharray"));

                    $menu.css({
                        top: action.event.clientY+$(window).scrollTop(),
                        left: action.event.clientX+$(window).scrollLeft(),
                        display: 'block'
                    });
            }
        }
        //
        //function removeMenu($menu) {
        //    function tryRemoveMenu(event) {
        //        if (!$(event.target).closest($menu).length) {
        //            $menu.hide();
        //            $('body').off('click', tryRemoveMenu);
        //        }
        //    }
        //    $('body').on('click', tryRemoveMenu);
        //}

        FM.menu = menu;

        FM.removeMenu = function () {
            $menu && $menu.hide();
        }

    }
    module.exports = menu;
});

define("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSvg.js" , [], function(require , exports , module){

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
define("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapNode.js" , [], function(require , exports , module){

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
define("E:_A3/Yinhe.WebHost/Scripts/flowMap_V2/app/flowMapSelectNodes.js" , [], function(require , exports , module){

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
