;(function ($) {
    $.fn.YHTableCanvas = function (opts) {
        var options = $.extend({}, $.fn.YHTableCanvas.defaults, opts);
        var rowSize, colSize, tableWidth, $tbody, $table, selectedCell = {};
        var $initialButtons = $('<div class="yh-tc-forPlainCanvas">' +
            '<label>行数:<input type="text" name="colSize" /></label>' +
            '<label>列数:<input type="text" name="rowSize" /></label>' +
            '<label>宽度:<input type="text" name="width" /></label>' +
            '<input type="button" class="yh-tc-action" value="生成">' +
            '</div>');

        var actionButtons = [
            {
                html: '<label class="ib">修改宽度:<input type="text" name="modifyWidth"  class="yh-tc-action w60" /></label>',
                actions: [
                    {
                        type: 'blur',
                        action: function (e) {
                            $table.width($(this).val());
                            $table.find('table').width($(this).val());

                            var widthVal = $(this).val();
                            if ( $toolBar.find('[name="isRelative"]').prop('checked')) {
                                if (widthVal > 100) {
                                    alert('设置为相对宽度时宽度值不能超过100%')
                                    widthVal = 100;
                                    $(this).val(100)
                                }
                                $table.width(widthVal + '%');
                                $table.find('table').width(widthVal + '%');
                            } else {
                                $table.width(widthVal)
                                $table.find('table').width(widthVal)
                            }
                        }
                    }
                ]
            },
            {
                html: '<label class="ib"><input type="checkbox" name="isRelative" class="yh-tc-action" value=" " />是否设置为相对宽度</label>',
                actions: [
                    {
                        type: 'change',
                        action: function (e) {
                            var widthVal = $toolBar.find('[name="modifyWidth"]').val();
                            if ($(this).prop('checked')) {
                                if (widthVal > 100) {
                                    alert('设置为相对宽度时宽度值不能超过100%')
                                    widthVal = 100;
                                    $toolBar.find('[name="modifyWidth"]').val(100)
                                }
                                $table.width(widthVal + '%');
                                $table.find('table').width(widthVal + '%');
                            } else {
                                $table.width($(this).val())
                                $table.find('table').width($(this).val())
                            }
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="清空选区">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            $tbody.find('.active').removeClass('active');
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="合并单元格">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            mergeBeforeAry = [];
                            mergeRowCell(); //合并行
                            mergeColCell(); //合并列
                            $.isFunction(options.afterMergeCell) && options.afterMergeCell.call(mergeBeforeAry, mergeBeforeAry)
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="拆分单元格">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            splitRowCell();
                            splitColCell();
                        }
                    }
                ]
            },
            {
                html: '<div class="yh-tc-tableCanvas-alignBtns"><label><input type="radio" name="align" value="left" class="yh-tc-action" checked>左</label><label><input class="yh-tc-action" type="radio" name="align" value="center">中</label><label><input class="yh-tc-action" type="radio" name="align" value="right">右</label></div>',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            //console.log('hhh', $(this).val());
                            $tbody.find('.active').attr('align', $(this).val());
                        }
                    }
                ]
            },
            {
                html: '<input class="yh-tc-action" type="button" value="添加行">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            colSize++;
                            var $tr = $('<tr>');
                            for (var i = 0; i < rowSize; i++) {
                                $tr.append('<td colNum="' + i + '"  rowNum="' + colSize + '"><div class="yh-tc-tplCell">[' + i + ',' + colSize + ']</td>');
                            }
                            $tbody.append($tr)
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="添加列">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            $tbody.children().each(function (i) {
                                if (i === 0) {
                                    var $th = $('<th colNum="' + rowSize + '"  rowNum="' + (i) + '" style="background: #eee;"></th>');
                                    $(this).append($th);
                                    $th.resizable({handles: "e", stop: handleResizeEnd})
                                } else {
                                    $(this).append('<td colNum="' + rowSize + '"  rowNum="' + (i) + '"><div class="yh-tc-tplCell">[' + rowSize + ',' + (i) + ']</td>');
                                }
                            })
                            rowSize++;
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="删除行">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            if (confirm('删除行可能会导致数据丢失以及表格错乱，确定要删除吗')){
                                colSize--;
                                $tbody.children().last().remove();
                            }
                        }
                    }
                ]
            },
            {
                html: '<input class="yh-tc-action" type="button" value="删除列">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            if (confirm('删除列可能会导致数据丢失以及表格错乱，确定要删除吗')){
                                $tbody.children().each(function (i) {
                                    $(this).children().last().remove();
                                })
                                rowSize--;
                            }
                        }
                    }
                ]
            },
            {
                html: '<div class="yh-tc-colorPicker"></div><input type="button" class="yh-tc-action" value="设置单元格背景色">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            $tbody.find('.active').css('background-color', $colorPicker.attr('color'))
                        }
                    }
                ]
            },
            {
                html: '<input type="button" class="yh-tc-action" value="清除表格">',
                actions: [
                    {
                        type: 'click',
                        action: function (e) {
                            if (confirm('删除表格后数据将清空，无法恢复，确定要删除吗')){
                                $initialButtons.show();
                                $actionButtonBox.hide();
                                $table.remove();
                            }
                        }
                    }
                ]
            }
        ];

        var $actionButtonBox = $('<div class="yh-tc-tableCanvas"></div>');
        $.each(actionButtons, function () {
            var $actionButton = $(this.html);
            $.each(this.actions, function () {
                var $tarBtn = $actionButton.hasClass('yh-tc-action') ? $actionButton.removeClass('yh-tc-action') : $actionButton.find('.yh-tc-action').removeClass('yh-tc-action');
                $tarBtn.on(this.type, this.action);
            })
            $actionButtonBox.append($actionButton);
        });
        $initialButtons.find('.yh-tc-action').click(function (e) {
            var colSize = $initialButtons.find('[name="colSize"]').val(),
                rowSize = $initialButtons.find('[name="rowSize"]').val(),
                tableWidth =  $initialButtons.find('[name="width"]').val();
            tableEditable(createTable(colSize, rowSize, tableWidth));
            $initialButtons.hide();
            $actionButtonBox.show();
            $.isFunction(options.afterTableCreated) && options.afterTableCreated.call($table)
        })
        var $toolBar = $('<div class="yh-tc-tableCanvasEditor-toolBar" class="yh-tc-isPlainCanvas"></div>').append($initialButtons).append($actionButtonBox);
        var $editorBody = $('<div class="yh-tc-tableCanvasEditor-body yh-box-j-alsoResize" ></div>');
        var $editor = $('<div class="yh-tc-tableCanvasEditor"></div>').append($toolBar).append($editorBody);
        var $colorPicker = $toolBar.find('.yh-tc-colorPicker');

        $editor.append($editorBody);
        $colorPicker.ColorPicker({
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
                $colorPicker.css('backgroundColor', '#' + hex).attr('color', '#' + hex);
            }
        });
        function createTable(colSize, rowSize, tableWidth) {
            $tbody = $('<tbody>');

            for (var i = 0; i <= colSize; i++) {
                var $tr = $('<tr>');
                for (var j = 0; j < rowSize; j++) {
                    if (i === 0) {
                        $tr.addClass('yh-tc-tplResizeTr').append('<th colNum="' + j + '"  rowNum="' + i + '" style=" background: #eee;"></th>');
                    } else {
                        $tr.append('<td colNum="' + j + '"  rowNum="' + i + '"><div class="yh-tc-tplCell">[' + j + ',' + i + ']</td>');
                    }
                }
                $tbody.append($tr)
            }
            return $('<div class="yh-tc-tableCanvas" style="width: ' + tableWidth + 'px">').append($('<table class="p-tableborder"  style="width: ' + tableWidth + 'px">').append($tbody));
        }
        function tableEditable(tableHtml) {
            $table = $(tableHtml);
            if (!$table.is('div.yh-tc-tableCanvas')) {
                $table = $('<div class="yh-tc-tableCanvas">').attr('style', $table.attr('style')).append($table.removeClass('yh-tc-tableCanvas'));
            }
            $tbody = $table.find('tbody');
            rowSize = $tbody.find('th').length;
            colSize = $tbody.children().length - 1;
            $table.find('tr:first th').resizable({handles: "e", stop: handleResizeEnd})
            $table.on('click', 'td', function (e) {
                var $curCell = $(this);
                if (e.ctrlKey) {
                    $curCell.toggleClass('active');
                } else if (e.shiftKey) {
                    var colStart = $tbody.find('.active:first').attr('colnum') * 1;
                    var rowStart = $tbody.find('.active:first').attr('rownum') * 1;
                    var colEnd = $curCell.attr('colnum') * 1;
                    var rowEnd = $curCell.attr('rownum') * 1;

                    if (isNaN(colStart)) return;

                    if ($curCell.hasClass('active')) {
                        $tbody.children().slice(rowStart, rowEnd + 1).each(function () {
                            $(this).children().slice(colStart, colEnd + 1).removeClass('active');
                        })
                    } else {
                        $tbody.children().slice(rowStart, rowEnd + 1).each(function () {
                            $(this).children().slice(colStart, colEnd + 1).addClass('active');
                        })
                    }
                }
                return false;
            }).on('dblclick', 'td', function (e) {
                $.isFunction(options.cellClick) && options.cellClick.call(this)
                return false;
            })
            $editorBody.html($table);
        }

        function handleResizeEnd(e) {
            $table.find('tr:first th').each(function () {
                $(this).width($(this).width()).css('height', '');
            })
        }
        var mergeBeforeAry = [];
        function mergeRowCell() {
            var $tarCell = $tbody.find('.active:first');
            while ($tarCell.next().hasClass('active') && $tarCell.attr('rowspan') == $tarCell.next().attr('rowspan')) {
                mergeBeforeAry.push($tarCell.find('.yh-tc-tplCell').text());
                var nextCol = $tarCell.next().prop("colspan")?$tarCell.next().prop("colspan"):1;
                $tarCell.attr('colspan', Number(!$tarCell.attr('colspan')) ? nextCol+1 : Number($tarCell.attr('colspan')) + nextCol);
                mergeBeforeAry.push($tarCell.next().find('.yh-tc-tplCell').text());
                $tarCell.next().remove();
            }
            $tarCell.removeClass('active').addClass('colActive');
            if ($tbody.find('.active:first').length) {
                mergeRowCell();
            }
        }

        function mergeColCell() {
            var $tarCell = $tbody.find('.colActive:first');
            var rowspan = $tarCell.attr('rowspan');
            var $nextRow = $tarCell.parent().next();
            for (var i = 0; i < rowspan - 1; i++) {
                $nextRow = $nextRow.next();
            }
            var $next = $nextRow.children('[colnum=' + $tarCell.attr('colnum') + ']');
            while ($next.length && $next.hasClass('colActive') && $next.attr('colspan') === $tarCell.attr('colspan')) {
                mergeBeforeAry.push($tarCell.find('.yh-tc-tplCell').text());
                var addRowspan = Number($next.attr('rowspan')) ? Number($next.attr('rowspan')) : 1;
                $tarCell.attr('rowspan', Number(!$tarCell.attr('rowspan')) ? addRowspan+1 : Number($tarCell.attr('rowspan')) + addRowspan);
                mergeBeforeAry.push($next.find('.yh-tc-tplCell').text());
                $next.remove();
                $nextRow = $nextRow.next();
                $next = $nextRow.children('[colnum=' + $tarCell.attr('colnum') + ']');
            }
            $tarCell.removeClass('colActive');
            if ($tbody.find('.colActive:first').length) {
                mergeColCell();
            }
        }

        function splitRowCell() {
            $tbody.find('.active').each(function () {
                var $tarCell = $(this);
                var colspan = Number($tarCell.attr('colspan'));
                var rowspan = Number($tarCell.attr('rowspan'));
                var rowspanAttr = rowspan ? 'rowspan="' + rowspan + '" class="active"' : '';
                var rowID = Number($tarCell.attr('rowNum'));
                var colID = Number($tarCell.attr('colNum'));
                $tarCell.removeAttr('colspan');
                while (--colspan) {
                    $tarCell.after('<td colNum="' + (colID + colspan) + '"  rowNum="' + rowID + '" ' + rowspanAttr + '><div class="yh-tc-tplCell">[' + (colID + colspan) + ',' + rowID + ']</td>');
                }
            });
        }
        function splitColCell() {
            $tbody.find('.active').each(function () {
                var $tarCell = $(this), $tarParent = $tarCell.parent();
                var rowspan = Number($tarCell.attr('rowspan'));
                var rowID = Number($tarCell.attr('rowNum'));
                var colID = Number($tarCell.attr('colNum'));
                $tarCell.removeAttr('rowspan').removeClass('active');
                while (--rowspan) {
                    rowID++;
                    $tarParent = $tarParent.next();
                    var $pos = $tarParent.children().eq(colID);
                    if ($pos.length) {
                        $pos.before('<td colNum="' + colID + '"  rowNum="' + rowID + '"><div class="yh-tc-tplCell">[' + colID + ',' + rowID + ']</td>')
                    } else {
                        $tarParent.append('<td colNum="' + colID + '"  rowNum="' + rowID + '"><div class="yh-tc-tplCell">[' + colID + ',' + rowID + ']</td>')
                    }
                }
            });
        }

        if ($.trim(options.html)) {
            $initialButtons.hide();
            $actionButtonBox.show();
            tableEditable(options.html);
        } else {
            $initialButtons.show();
            $actionButtonBox.hide();
        }

        this.append($editor);
        return this;
    }

    $.extend($.fn.YHTableCanvas, {
        info: '表格画布编辑器',
        url: 'http://localhost:8030/Scripts/Modules/tabelCanvas/tableCanvas.html',
        defaults: {
            cellClick: $.noop,
            afterMergeCell: $.noop,
            afterTableCreated: $.noop,
            html: ''
        },
        options: {
            cellClick: '双击单元格后的回调',
            afterMergeCell: '合并单元格后的回调',
            afterTableCreated: '输入行列数生成新表格后的回调',
            html: '可传人初始化的表格html字符串'
        }
    });
    $.YH = $.YH || {};
    $.YH.YHTableCanvas = $.fn.YHTableCanvas;
})(jQuery);