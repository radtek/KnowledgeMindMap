/*
*
* EditTable 1.0 
* 传入四个参数
*NullTips -- 空数据输出
*EditClass -- 在所需要编辑的列增加Class属性
*NumOnlyClass -- 其中列只能输入数字加Num属性
*ChangeClass  -- 更改内容后所改的样式
*
*  target
* 1、可排序 分页
* 2、 快速筛选
* 3、 二次开发
*/

;(function ($) {
    $.fn.EditTable = function (options) {
        //初始化
        options = $.extend(true, {
            NullTips: "单击可编辑...",
            EditClass: "edit",
            NumOnlyClass: "Num",
            ChangeClass: "taEidtAfter",
            SaveMode: 1, //保存模式	1:全部一起提交保存， 2:单个编辑后实时保存, 5:编辑指定数据库记录的值
            EditMode: "click",  // 触发编辑的事件
            SaveURL: "",
            SaveData: null, //可以是方法也可以是变量，保存模式1的方法可以用ChangeClass来获取当前编辑区域
            IsReload: false,
            tableName: "",   //数据库表名A3
            Primarykey: 1, //数据库主键A3
            ValueKey: "", //值字段名
            SaveType: "",
            DataConnectStr:"",
            width:"96%",
            callBack: function(data){},
            AddAction: [[
				null, //插入函数的位置	AfterEdit AfterSave
				null	//插入的函数	function({editing:editing_td_jQuery_Object, savedata:savedata_json}) {}
			], [null, null]]
        }, options);

        var _Table = this;
        this.doaction = function (position, data, node) {
            for (i in options.AddAction) {
                if (options.AddAction[i][0] == position && typeof options.AddAction[i][1] == "function") {
                    options.AddAction[i][1].call(node, {
                        editing: data.editing,
                        savedata: data.savedata
                    });
                }
            }
        }

        this.Numonly = function (obj) {
            if (event.keyCode == 46) {
                if ($(this).val().indexOf(".") != -1) {
                    return false;
                }
            } else {
                return event.keyCode >= 45 && event.keyCode <= 57;
            }

        }

        var $borderTop = $('<div style="height:1px; border-top:1px dotted #000; position:absolute; z-index: 100000"></div>')
            ,$borderBottom = $('<div style="height:1px; border-bottom:1px dotted #000; position:absolute; z-index: 100000"></div>')
            ,$borderLeft = $('<div style="width:1px; border-left:1px dotted #000; position:absolute; z-index: 100000"></div>')
            ,$borderRight = $('<div style="width:1px; border-right:1px dotted #000; position:absolute; z-index: 100000"></div>')
            ,$borders=$().add($borderTop).add($borderBottom).add($borderLeft).add($borderRight)
            ,curEditTd;
        this.editTable = function () {
            var NullTips = options.NullTips;
            var width = options.width;
            var EditClass = options.EditClass;
            var EditMode = options.EditMode;
            var NumOnlyClass = options.NumOnlyClass;
            var emptyText = "<font color=silver>" + NullTips + "</font>";

            _Table.find("." + EditClass).each(function () {
                var tdCon = $(this).find("div").html();
                var tdCon_format = $.trim(tdCon.replace(/&nbsp;/ig, ""));
                if (tdCon_format == "" || typeof tdCon_format == "undefined") {
                    tdCon = emptyText;
                }
                var Content = "<textarea style='display:none;overflow:auto;width:"+width+";height:60px;'>" + tdCon_format + "</textarea><span>" + $.trim(tdCon).replace(/[\n\r]/g, "<br/>") + "</span>";
                $(this).find("div").html(Content);
            });

            if (NumOnlyClass != null) {
                $("." + NumOnlyClass + " textarea").bind("keypress", _Table.Numonly).css("ime-mode", "Disabled");
            }



            _Table.on(EditMode, "." + EditClass, function () {
                curEditTd = this;
                if ($(this).find("textarea").css("display") == "none") {
                    $(this).find("span").hide();
                    if ($(this).find("span").html().indexOf(NullTips) != -1) {
                        $(this).find("textarea").html("");
                    } else {

                        var aa = $.trim($(this).find("span").html().replace(/&nbsp;/ig, "").replace(/<(br|BR) *\/?>/g, '\n'));
                        $(this).find("textarea").html(aa);
                    }
                    $(this).find("textarea").show().focus(function () {
                        $(this).select();

                    }).focus();
                }
                $borders.remove()

            }).on("mouseenter", "." + EditClass, function(){
                if(curEditTd === this) return;
                var $this=$(this),
                    t=$this.offset().top,
                    l=$this.offset().left,
                    w=$this.outerWidth(),
                    h=$this.outerHeight();
                $borderTop.css({
                    top:t-2,
                    left:l-2,
                    width:w + 3
                })
                $borderLeft.css({
                    top:t-2,
                    left:l-2,
                    height:h + 3
                })
                $borderBottom.css({
                    top:t + h -1,
                    left:l - 2,
                    width:w + 3
                })
                $borderRight.css({
                    top:t - 2,
                    left:l + w - 1,
                    height:h +3
                })
                $borders.appendTo($(this).closest('body'));
            }).on("mouseleave", "." + EditClass, function(){
                $borders.remove()
            })

            //
            _Table.on('blur', "." + EditClass + " textarea", function () {
                var tr = this
                var _that = $(this).parent().find("span").first();
                var _this = $(this).parent().find("span").html();
                var value = $.trim(this.value);
                curEditTd = null;
                if ((_this.indexOf(NullTips) == -1 && value != _this) || (_this.indexOf(NullTips) != -1 && value != "")) {

                    $(this).parent().addClass(options.ChangeClass);
                    _that.html(value.replace(/[\n\r]/g,"<br/>"));
                    if (options.SaveMode == 1) {
                        _Table.saveBar();
                    } else if (options.SaveMode == 2) {
                        var savedata = typeof options.SaveData == 'function' ? options.SaveData() : options.SaveData;
                        console.log(options.SaveData)
                        $.ajax({
                            url: options.SaveURL,
                            type: options.SaveType,
                            dataType: 'json',
                            data: savedata,
                            success: function (data) {
                                if (data.Success) {
                                    hiOverAlert("保存成功");
                                    _Table.doaction("AfterSave", { savedata: savedata }, tr);
                                    $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                    options.callBack.call(tr, data);
                                    
                                } else {
                                    hiAlert("保存失败");
                                }
                            }
                        });
                    } else if (options.SaveMode == 3) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");
                        //key = $.trim(key)
                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                data: {
                                    tbName: options.tableName,
                                    queryStr: "db." + options.tableName + ".distinct('_id',{'" + options.Primarykey + "':'" + valId + "'})",
                                    dataStr: key + "=" + encodeURIComponent(value)
                                },
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                                        _Table.doaction("AfterSave", { savedata: savedata }, tr);

                                    }
                                }
                            });
                        }

                    }
                    else if (options.SaveMode == 4) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");

                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                data: {
                                    tbName: options.tableName,
                                    queryStr: "db." + options.tableName + ".distinct('_id',{'" + options.Primarykey + "':'" + valId + "'})",
                                    dataStr: key + "=" + value
                                },
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                                        _Table.doaction("AfterSave", { savedata: savedata });
//                                        LoadDiv();
                                    }
                                }
                            });
                        }

                    }
                     else if (options.SaveMode == 5) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");
                        //key = $.trim(key)
                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                data: {
                                    tbName: options.tableName,
                                    queryStr: options.Primarykey+"="+valId,
                                    dataStr: key + "=" + encodeURIComponent(value),
                                    connectStr:options.DataConnectStr
                                },
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                                        _Table.doaction("AfterSave", { savedata: savedata }, tr);

                                    }
                                }
                            });
                        }

                    }
                    else if (options.SaveMode == 7) {
                       var $this = $(this);
                       var primarykey =options.Primarykey;
                        var dataAry = [];
                        var tbName =  $(this).closest('td').find('input[name=tbName]').val();
                        $(this).closest('td').find('input:hidden').each(function(){
                            var selfInput = $(this);
                            dataAry[dataAry.length] = selfInput.attr("name")+"="+selfInput.attr('value');
                        })
                        dataAry[dataAry.length] = options.ValueKey +"=" +$(this).val();
                        var savedata  = dataAry.join('&');
                        $.ajax({
                            url: options.SaveURL,
                            type: options.SaveType,
                            dataType: 'json',
                            data: savedata,
                            success: function (data) {
                                if (data.Success) {
                                    var queryStr = "db."+tbName+".distinct('_id',{'"+ primarykey +"':'" + data.htInfo[primarykey] + "'})";
                                    $this.closest('td').find('input[name=queryStr]').val(queryStr);
                                    hiOverAlert("保存成功");
                                    _Table.doaction("AfterSave", { savedata: savedata }, tr);
                                    $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                    options.callBack.call(tr, data);
                                    
                                } else {
                                    hiAlert("保存失败");
                                }
                            }
                        });
                    } 
                    
                    else if (options.SaveMode == 6) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");
                        //key = $.trim(key)
                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                //data: {
                                //    tbName: options.tableName,
                                //    queryStr: "db." + options.tableName + ".distinct('_id',{'" + options.Primarykey + "':'" + valId + "'})",
                                //    dataStr: key + "=" + encodeURIComponent(value)
                                //},
                                data: "tbName=" + options.tableName + "&" + options.Primarykey + "=" + valId + "&" + key + "=" + encodeURIComponent(value),
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        _Table.doaction("AfterSave", { savedata: savedata }, tr);
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                                    }
                                }
                            });
                        }
                    }
                }

                if (value == "") {
                    _that.html(emptyText);
                }
                $(this).hide();
                _that.show();

                _Table.doaction("AfterEdit", { editing: $(this).parent() }, tr);

                // $("#btnupdate1").click();
            });
        }
        this.editTable();

        this.saveBar = function () {
            if ($("#savearea").css("display") == "none") {
                $("#savearea").show();
            }
        };

        if (options.SaveMode == 1) {
            var bottomSave = '<DIV style="Z-INDEX: 10000; POSITION: fixed; WIDTH: 100%; BOTTOM: 0px; DISPLAY: none; HEIGHT: 40px" id="savearea">' +
                            '<DIV style="BACKGROUND: none transparent scroll repeat 0% 0%; HEIGHT: 40px" id=meerkat-container jQuery1323502422512="26">' +
                            '<DIV class="baoCun" style="TEXT-ALIGN: center; FILTER: ; ZOOM: 1" id=SeriesStepSaveButton class=baoCun jQuery1323502422512="27">' +
                            '<INPUT style="WIDTH: 300px" value=数据已更新，请点此保存 type=button>' +
                            '</DIV></DIV></DIV>';
            $("body").append(bottomSave);
            $("#savearea input").click(function () {
                var curNode = this;
                var savedata = typeof options.SaveData == 'function' ? options.SaveData() : options.SaveData;
                $.ajax({
                    url: options.SaveURL,
                    type: options.SaveType,
                    dataType: 'json',
                    data: savedata,
                    success: function (data) {
                        if (data.Success) {
                            hiOverAlert("保存成功");
                            $("#savearea").hide();
                            $("." + options.ChangeClass).removeClass(options.ChangeClass);
                            _Table.doaction("AfterSave", { savedata: savedata }, curNode);
                            if (options.IsReload == true) {
                                window.location.reload();
                            }
                        } else {
                            hiAlert("保存失败");
                        }
                    }
                });
            });
        }

    }
})(jQuery);


(function ($) {
    $.fn.EditTableV2 = function (options) {
        //初始化
        options = $.extend(true, {
            NullTips: "单击可编辑...",
            EditClass: "edit",
            NumOnlyClass: "Num",
            ChangeClass: "taEidtAfter",
            SaveMode: 1, //保存模式	1:全部一起提交保存， 2:单个编辑后实时保存
            EditMode: "click", // 触发编辑的事件
            SaveURL: "",
            SaveData: null, //可以是方法也可以是变量，保存模式1的方法可以用ChangeClass来获取当前编辑区域
            IsReload: false,
            tableName: "",   //数据库表名A3
            Primarykey: 1, //数据库主键A3
            ValueKey: "", //值字段名
            isShowMsg:true,  //在SaveMode=3时是否显示“保存成功”的提示
            SaveType: "",
            width:"96%",
            height:"60px",
            callBack: function(data){},
            beforeSave: function(){ return true;},
            AddAction: [[
				null, //插入函数的位置	AfterEdit AfterSave
				null	//插入的函数	function({editing:editing_td_jQuery_Object, savedata:savedata_json}) {}
			], [null, null]]
        }, options);

        var _Table = this;
        this.doaction = function (position, data) {
            for (i in options.AddAction) {
                if (options.AddAction[i][0] == position && typeof options.AddAction[i][1] == "function") {
                    options.AddAction[i][1]({
                        editing: data.editing,
                        savedata: data.savedata
                    });
                }
            }
        }

        this.Numonly = function (obj) {
            if (event.keyCode == 46) {
                if ($(this).val().indexOf(".") != -1) {
                    return false;
                }
            } else {
                return event.keyCode >= 45 && event.keyCode <= 57;
            }

        }


        this.editTable = function () {
            var NullTips = options.NullTips;
            var EditClass = options.EditClass;
            var width=options.width;
            var height=options.height;
            var NumOnlyClass = options.NumOnlyClass;
            var emptyText = "<font color=silver>" + NullTips + "</font>";
            var EditMode = options.EditMode;

            _Table.find("td." + EditClass).each(function () {
                var $this=$(this);
                var tdCon=$.trim($this.find("div.value").html());
                var tdCon_format = $.trim(tdCon);
                if (tdCon_format == "" || typeof tdCon_format == "undefined") {
                    tdCon_format = emptyText;
                }else{
                    tdCon_format=$this.children("div.show").html();
                }
                var Content = "<textarea style='display:none;overflow:auto;width:"+width+";height:"+height+";'>" + tdCon + "</textarea><span>" + tdCon_format + "</span>";
                $this.find("div.show").html(Content);
            });

            if (NumOnlyClass != null) {
                $("." + NumOnlyClass + " textarea").bind("keypress", _Table.Numonly).css("ime-mode", "Disabled");
            }



            _Table.on(EditMode,"td." + EditClass, function () {
                var $this=$(this);
                if ($this.find("textarea").css("display") == "none") {
                    $this.find("span").hide();
                    if ($this.find("span").html().indexOf(NullTips) != -1) {
                        $this.find("textarea").html("");
                    } else {
//                        var tdCon=$.trim($this.find("input:hidden").val());
//                        $(this).find("textarea").html(tdCon);
                    }
                    $(this).find("textarea").show().focus(function () {
                        $(this).select();
                    }).focus();
                }
            });

            //
            _Table.on('blur',"." + EditClass + " textarea", function () {
                var _that = $(this).parent().find("span").first();
                var _this = $(this).parent().find("span").html();
                var tr = this;
                var value = $.trim(this.value);

                if(!options.beforeSave.call(tr)){
                    $.tmsg("m_jfw", "合计值偏小！", { infotype: 2 });
                    return false;
                }

                if ((_this.indexOf(NullTips) == -1 && value != _this) || (_this.indexOf(NullTips) != -1 && value != "")) {
                    $(this).parent().addClass(options.ChangeClass);
                    _that.html(value);
                    if (options.SaveMode == 1) {
                        _Table.saveBar();
                    } else if (options.SaveMode == 2) {
                        var savedata = typeof options.SaveData == 'function' ? options.SaveData() : options.SaveData;
                        $.ajax({
                            url: options.SaveURL,
                            type: options.SaveType,
                            dataType: 'json',
                            data: savedata,
                            success: function (data) {
                                if (data.Success) {
                                    hiOverAlert("保存成功");
                                    _Table.doaction("AfterSave", { savedata: savedata });
                                    $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                    options.callBack.call(tr, data);
                                } else {
                                    hiAlert("保存失败");
                                }
                            }
                        });
                    } else if (options.SaveMode == 3) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");
                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                data: {
                                    tbName: options.tableName,
                                    queryStr: "db." + options.tableName + ".distinct('_id',{'" + options.Primarykey + "':'" + valId + "'})",
                                    dataStr: key + "=" + encodeURIComponent(value)
                                },
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        if(options.isShowMsg){
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1, time_out: 500 });
                                        }
                                        _Table.doaction("AfterSave", { savedata: savedata });
                                        options.callBack.call(tr, data);
                                    }
                                }
                            });
                        }
                    }
                    else if (options.SaveMode == 4) {
                        var key = $(this).parent().parent().find("input").attr("name");
                        var valId = $(this).parent().parent().find("input").attr("valueid");

                        if (options.tableName != "") {
                            $.ajax({
                                url: options.SaveURL,
                                type: 'post',
                                data: {
                                    tbName: options.tableName,
                                    queryStr: "db." + options.tableName + ".distinct('_id',{'" + options.Primarykey + "':'" + valId + "'})",
                                    dataStr: key + "=" + value
                                },
                                dataType: 'json',
                                error: function () {
                                    $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                                },
                                success: function (data) {
                                    if (data.Success == false) {
                                        $.tmsg("m_jfw", data.Message, { infotype: 2 });
                                    } else {
                                        $("." + options.ChangeClass).removeClass(options.ChangeClass);
                                        $.tmsg("m_jfw", "保存成功！", { infotype: 1 });
                                        LoadDiv();
                                    }
                                }
                            });
                        }
                    }
                }
                if (value == "") {
                    _that.html(emptyText);
                }
                $(this).hide();
                _that.show();

                _Table.doaction("AfterEdit", { editing: $(this).parent() });

                // $("#btnupdate1").click();
            });
        }
        this.editTable();

        this.saveBar = function () {
            if ($("#savearea").css("display") == "none") {
                $("#savearea").show();
            }
        };

        if (options.SaveMode == 1) {
            var bottomSave = '<DIV style="Z-INDEX: 10000; POSITION: fixed; WIDTH: 100%; BOTTOM: 0px; DISPLAY: none; HEIGHT: 40px" id="savearea">' +
                            '<DIV style="BACKGROUND: none transparent scroll repeat 0% 0%; HEIGHT: 40px" id=meerkat-container jQuery1323502422512="26">' +
                            '<DIV class="baoCun" style="TEXT-ALIGN: center; FILTER: ; ZOOM: 1" id=SeriesStepSaveButton class=baoCun jQuery1323502422512="27">' +
                            '<INPUT style="WIDTH: 300px" value=数据已更新，请点此保存 type=button>' +
                            '</DIV></DIV></DIV>';
            $("body").append(bottomSave);
            $("#savearea input").click(function () {
                var savedata = typeof options.SaveData == 'function' ? options.SaveData() : options.SaveData;
                $.ajax({
                    url: options.SaveURL,
                    type: options.SaveType,
                    dataType: 'json',
                    data: savedata,
                    success: function (data) {
                        if (data.Success) {
                            hiOverAlert("保存成功");
                            $("#savearea").hide();
                            $("." + options.ChangeClass).removeClass(options.ChangeClass);
                            _Table.doaction("AfterSave", { savedata: savedata });
                            if (options.IsReload == true) {
                                window.location.reload();
                            }
                        } else {
                            hiAlert("保存失败");
                        }
                    }
                });
            });
        }
    }
})(jQuery);


var lockTableHead = (function () {
    var vph = YH.dom.getViewportHeight(), hasBind = false, sts = {}, gtableid = '', ids = [];
    function doLockHead(o, tableObj) {
        var tableid = tableObj.id, scr, $tb = $(tableObj),
            _rows = $tb.find('thead')[0].rows,
            h = 0, i = 0, _tr, of = $tb.offset();
        for (; _tr = _rows[i]; ++i) {
            h += parseInt(_tr.cells[0].offsetHeight, 10) || 24;
        }
        ids.push(tableid);
        sts['table_' + tableid] = { "tbl": tableObj, "fHeadId": 'scr_' + tableid, "height": h, "left": of.left, "top": of.top, "hasCalW": false, "tblht": tableObj.offsetHeight };
        scr = document.getElementById('scr_' + tableid);
        if (!scr) scr = createScr_(tableObj, tableid);
        gtableid = gtableid == '' ? tableid : gtableid;
        bindRS_();
    }
    function createScr_(tableObj, tableid) {
        var scr = $('<div><table cellpadding="0" style="margin-top:0px;" cellspacing="0" id="scr_' + tableid + '"><caption><div style="float:left"></div></caption><thead class="thead01"></thead><tbody></tbody></table></div>').appendTo(document.body),
            _th = scr.find('thead'), $tb = $(tableObj),
            ohead = $tb.find('thead').html();
        _th.html(ohead);
        scr = scr[0];
        if (tableObj.className != '') scr.className = tableObj.className;
        scr.style.display = 'none'; scr.style.zIndex = 999;

        YH.dom.elemFixedPos(scr);
        return scr;
    }
    function resetPos_(tbl) {
        var sct = $(document).scrollTop(), bt;
        if (tbl.top + tbl.height - 100 < sct && tbl.top + tbl.tblht - tbl.height / 2 > sct) {
            bt = 1;
        } else if (tbl.top + tbl.tblht < sct) {
            bt = 0;
        } else {
            bt = 0;
        }
        return bt;
    }
    function checkNowId() {
        var i = ids.length - 1, tbid, tbl, rid, r = 0;
        for (; i >= 0; i--) {
            tbid = ids[i];
            tbl = sts['table_' + tbid];
            rid = resetPos_(tbl);
            if (rid == 1) {
                r = tbid;
                break;
            }
        }
        return r;
    }
    function bindRS_() {
        if (hasBind) return;
        hasBind = true;
        $(window).bind("scroll", function () {
            var tbl = sts['table_' + gtableid],
                _b = resetPos_(tbl), scr = document.getElementById('scr_' + gtableid);
            if (_b == 0) {
                var _r = checkNowId();
                if (_r != 0) {
                    ;
                    gtableid = _r;
                    tbl = sts['table_' + gtableid];
                    _b = resetPos_(tbl); scr = document.getElementById('scr_' + gtableid);
                }
            }
            if (!tbl.hasCalW) {
                var r1 = $(tbl.tbl).find('thead').find("tr"),
                    cell, i = 0, _th, _tr0, _w, _cspan; scr.parentNode.style.width = $(tbl.tbl).width() + 1 + 'px';

                r1.each(function (i) {
                    if (i == 0) {
                        for (var j = 0; j < $(this).find("th").length; j++) {
                            _w = $(this).find("th:eq(" + j + ")").width() + 2 + 'px';
                            $(scr).find('tr:first').find("th:eq(" + j + ")").css("width", _w);
                        }
                    } else {
                        for (var j = 0; j < $(this).find("th").length; j++) {
                            _w = $(this).find("th:eq(" + j + ")").width() - 1 + 'px';
                            $(scr).find('tr:eq(1)').find("th:eq(" + j + ")").css("width", _w);
                        }
                    }
                })
                tbl.hasCalW = true;
            }
            if (_b == 1) {
                scr.parentNode.style.top = 0;
                scr.parentNode.style.marginTop = 0;
                scr.parentNode.style.left = $(tbl.tbl).offset().left + 'px';
                scr.parentNode.style.display = '';
            } else {
                scr.parentNode.style.display = 'none';
            }
        }).bind("resize", function () {
            vph = YH.dom.getViewportHeight();
            var tbl = sts['table_' + gtableid], scr = document.getElementById('scr_' + gtableid);
            if (scr) {
                scr.style.left = $(tbl.tbl).offset().left;
            }
        });
    }
    return {
        doLock: function (o, tableObj, h) {
            if (!tableObj) return;
            YH.dom.fixedPosition();
            doLockHead(o, tableObj);
        }
    };
})();

function LockTableHeadXC() {
    //this.vph = YH.dom.getViewportHeight();
    this.hasThead = true;
}

LockTableHeadXC.fn = LockTableHeadXC.prototype = {
    ids: [],
    sts: {},
    gtableid: '',
    hasBind: false,
    doLockHead: function (tableObj) {
        var tableid = tableObj.id, scr, $tb = $(tableObj), _rows = [], h = 0, i = 0, _tr, of = $tb.offset();
        var theads = tableObj.getElementsByTagName("thead"), ohead = {};
        if (theads.length > 0) {
            _rows = theads[0].rows;
            ohead.content = theads[0].innerHTML;
            ohead.className = theads[0].className;
        } else {
            var rows = tableObj.rows;
            if (rows.length > 0) {
                _rows = [].push(rows[0]);
                this.hasThead = false;
                ohead.content = rows[0].innerHTML;
                ohead.className = rows[0].className;
            } else {
                return false;
            }
        }
        for (; _tr = _rows[i]; ++i) {
            h += parseInt(_tr.cells[0].offsetHeight, 10) || 24;
        }
        var curIdArr = LockTableHeadXC.fn.ids, hasThisId = false;

        for (i = 0; i < curIdArr.length; i++) {
            if (curIdArr[i] == tableid) {
                hasThisId = true;
            }
        }
        if (!hasThisId) {
            curIdArr.push(tableid);
        }

        LockTableHeadXC.fn.sts['table_' + tableid] = {
            tbl: tableObj,
            fHeadId: 'scr_' + tableid,
            height: h,
            left: of.left,
            top: of.top,
            hasCalW: false,
            tblht: tableObj.offsetHeight,
            rows: _rows,
            fixedHead: null//当前id对应的固定表头
        };
        scr = this.createScr_(tableObj, tableid, ohead);
        if (LockTableHeadXC.fn.gtableid == "") {
            LockTableHeadXC.fn.gtableid = tableid;
        }

        this.bindRS_();
    },
    calculateState: function (tableObj) {
        var tableid = tableObj.id, scr, $tb = $(tableObj), _rows = [], h = 0, i = 0, _tr, of = $tb.offset();
        var theads = tableObj.getElementsByTagName("thead"), ohead = {}, tRows = tableObj.rows;
        var oldSts = LockTableHeadXC.fn.sts['table_' + tableid];
        if (theads.length > 0) {
            _rows = theads[0].rows;
        } else if (tRows.length > 0) {
            _rows = [tRows[0]];
        } else {
            return false;
        }

        for (; _tr = _rows[i]; ++i) {
            h += parseInt(_tr.cells[0].offsetHeight, 10) || 24;
        }

        oldSts.tbl = tableObj;
        oldSts.height = h;
        oldSts.left = of.left;
        oldSts.top = of.top;
        oldSts.hasCalW = false;
        oldSts.tblht = tableObj.offsetHeight;
        oldSts.rows = _rows;

    },
    createScr_: function (tableObj, tableid, ohead) {
        //移除旧的lockHead
        $("#scr_" + tableid).remove();
        var scr = $('<table cellpadding="0" style="margin-top:0px;" cellspacing="0" id="scr_' + tableid + '"></table>').appendTo(document.body),
        _th, $tb = $(tableObj), $colgroup = $tb.find("colgroup");
        if ($colgroup.length > 0) {
            var _cg = $('<colgroup></colgroup').appendTo(scr);
            _cg.html($colgroup.html());
        }
        if (this.hasThead) {
            _th = $('<thead></thead>').appendTo(scr);
        } else {
            _th = $('<tr></tr>').appendTo(scr);
        }
        _th.html(ohead.content);
        if (ohead.className != "") {
            _th[0].className = ohead.className;
        }

        scr = scr[0];
        LockTableHeadXC.fn.sts['table_' + tableid].fixedHead = scr;

        if (tableObj.className != '') {
            scr.className = tableObj.className;
        }
        scr.style.display = 'none'; scr.style.zIndex = 999;

        YH.dom.elemFixedPos(scr);
        return scr;
    },

    resetPos_: function (tbl) {
        var sct = $(document).scrollTop(), bt;

        //重新计算参数，防止在绑定后改变位置
        var tbid = tbl.tbl.id;
        if (tbl.top != tbl.tbl.offsetTop) {
            LockTableHeadXC.fn.calculateState(tbl.tbl);
        }

        if ((tbl.top + tbl.height - 0) < sct && (tbl.top + tbl.tblht - tbl.height / 2) > sct) {
            bt = 1;
        } else if (tbl.top + tbl.tblht < sct) {
            bt = 0;
        } else {
            bt = 0;
        }
        return bt;
    },
    checkNowId: function () {
        var i = LockTableHeadXC.fn.ids.length - 1, tbid, tbl, rid, r = 0;
        for (; i >= 0; i--) {
            tbid = LockTableHeadXC.fn.ids[i];
            var $tbObj = $("#" + tbid);
            if (!$tbObj.is(":hidden")) {
                tbl = LockTableHeadXC.fn.sts['table_' + tbid];
                rid = this.resetPos_(tbl);
                if (rid == 1) {
                    r = tbid;
                    break;
                }
            }
        }
        return r;
    },
    bindRS_: function () {
        var _this = this, fn = LockTableHeadXC.fn;
        if (fn.hasBind) return;
        fn.hasBind = true;
        $(window).bind("scroll", function () {

            var 
                gtableid = fn.gtableid,
                tbl = fn.sts['table_' + gtableid],
                _b = 0,
                scr = tbl.fixedHead,
                $tbObj = $(tbl.tbl);

            if ($tbObj.is(":hidden")) {
                _b = 0;
            } else {
                _b = _this.resetPos_(tbl);
            }

            if (_b == 0) {
                var _r = _this.checkNowId();
                if (_r != 0) {//找到当前有效的tableId
                    fn.gtableid = gtableid = _r;
                    tbl = fn.sts['table_' + gtableid];
                    _b = _this.resetPos_(tbl);
                    scr = tbl.fixedHead;
                }
            }
            if (!tbl.hasCalW) {
                var cell, i = 0, _th, _tr0, _w, _cspan, cellTag = "th";
                scr.style.width = $(tbl.tbl).width() + 'px';
                var l1 = $tbObj.width();
                var l2 = 0;

                $.each(tbl.rows, function (i) {
                    var $this = $(this), length = 0, e = 1;
                    if ($this.find("td").length > 0) {
                        cellTag = "td";
                    }
                    length = $this.find(cellTag).length;
                    for (var j = 0; j < length; j++) {
                        e = (j == 0) ? 0 : 1;
                        _w = $(this).find(cellTag).eq(j).width() + e + 'px';
                        l2 += $(this).find(cellTag).eq(j).width();
                        $(scr).find('tr').eq(i).find(cellTag).eq(j).css("width", _w);
                    }
                });
                tbl.hasCalW = true;
            }
            if (_b == 1) {
                scr.style.top = 0;
                scr.style.left = $(tbl.tbl).offset().left + 'px';
                scr.style.display = '';
            } else {
                scr.style.display = 'none';
            }
        }).bind("resize", function () {
            var gtableid = LockTableHeadXC.fn.gtableid;
            //vph = YH.dom.getViewportHeight();
            var tbl = LockTableHeadXC.fn.sts['table_' + gtableid], scr = document.getElementById('scr_' + gtableid);
            if (scr) {
                scr.style.left = $(tbl.tbl).offset().left;
            }
        });
    },
    doLock: function (tableObj) {
        if (typeof tableObj == "string") {
            tableObj = document.getElementById(tableObj);
        }
        if (!tableObj) return;
        YH.dom.fixedPosition();
        this.doLockHead(tableObj);
    },
    copy: function () {
        var f = function () {
        };
        f.prototype = LockTableHeadXC.fn;
        return new f();
    }
};

function LockTableHeadZHHY(){}
LockTableHeadZHHY.prototype = new LockTableHeadXC();




