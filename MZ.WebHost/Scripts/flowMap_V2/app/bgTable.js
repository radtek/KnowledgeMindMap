define('flowMapBgTable', function(require,exports,module) {
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

        FM.canvas.box.css({
            top: $table.find('.theader-xy').outerHeight(),
            left: $table.find('.theader-xy').outerWidth()
        });

        FM.table = table;
    };
    module.exports = bgTable;
});