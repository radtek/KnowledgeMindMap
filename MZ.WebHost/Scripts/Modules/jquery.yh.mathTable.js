;(function ($) {
    $.fn.YHmathTable = function (opts) {
        var options = $.extend({}, $.fn.YHmathTable.defaults, opts);
        this.each(function () {
            var $table = $(this);
            var $mathCells = $table.find('[mathid]');
            var data = {};
            $mathCells.each(function () {
                var $this = $(this);
                data[$this.attr('mathid')] = {
                    value: $.nodeName($this[0], 'input') ? $this.val() : $this.text(),
                    node: this
                };
            })

            function updateCellValue() {
                var $this = this.jquery ? this : $(this);
                data[$this.attr('mathid')].value = $.nodeName($this[0], 'input') ? $this.val() : $this.text();
            }

            $table.on('blur.YHmathTable', '[mathid]', updateCellValue)

            $table.find('[mathfn]').each(function () {
                var $this = $(this);
                var reg = /^(\w+)\(([\w\,\_]+)\)$/g;
                var fnData = reg.exec($this.attr('mathfn').replace(/\ /g, ''));
                var prams = fnData[2].split(',')
                var i, len = prams.length;
                if (len > 0) {
                    for (i = 0; i < len; i++) {
                        $(data[prams[i]].node).on('blur.YHmathTable', function () {
                            updateCellValue.call(this);
                            updateResult();
                        });
                    }
                }

                function updateResult() {
                    var args = [];
                    var fixed = isNaN(parseInt($this.attr('fixed'))) ? 2 : parseInt($this.attr('fixed'));
                    for (var j = 0; j < len; j++) {
                        args.push(Number(data[prams[j]].value));
                    }
                    var newVal = parseFloat(options.functions[fnData[1]].apply($this, args));
                    newVal = isNaN(newVal) ? '' : newVal.toFixed(fixed);
                    if ($.nodeName($this[0], 'input')) {
                        $this.val(newVal).trigger('blur.YHmathTable');
                    } else {
                        $this.text(newVal).trigger('blur.YHmathTable');
                    }
                    $.isFunction(options.onResultUpdate) && options.onResultUpdate.call($this[0], newVal);
                }
                updateResult();
            })
        });
    }
    $.extend($.fn.YHmathTable, {
        defaults: {
            functions: {
                add: function () {
                    var res = 0, i = 0, len = arguments.length;
                    for (; i < len; i++ ) {
                        res += arguments[i];
                    }
                    return res;
                },
                minus: function () {
                    // 第一个参数进去之后所有参数的值
                    var res = arguments[0], i = 1, len = arguments.length;
                    for (; i < len; i++ ) {
                        res -= arguments[i];
                    }
                    return res;
                },
                multiplication: function () {
                    var res = 1, i = 0, len = arguments.length;
                    for (; i < len; i++ ) {
                        res *= arguments[i];
                    }
                    return res;
                }
            },
            onResultUpdate: $.noop
        },
        info: '数学表格计算',
        options: {
            functions: '传入计算函数，格式参考默认值',
            onResultUpdate: '当结果更新时触发回调'
        },
        url: ''
    })
    if ($.YH) $.YH.YHmathTable = $.fn.YHmathTable;
})(jQuery)