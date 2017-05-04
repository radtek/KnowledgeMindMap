define('flowMapMenu', function(require,exports,module) {
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
