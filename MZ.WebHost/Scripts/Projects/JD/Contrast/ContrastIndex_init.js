function changeList(obj){
    var formatId=$(obj).val();
    window.location.href="/Contrast/ContrastIndex?formatId="+formatId;
    }
      $(window).on('scroll resize',function (e) {
            if ($('#p-j-contrast').offset().top < $(this).scrollTop()) {
                if ($('#p-j-floatTable').length == 0 || e.type === 'resize') {

                    $('#p-j-tableControl>tr>td').each(function () {
                        var arr = [];

                        $(this).find('option:selected').each(function () {

                            if ($(this).val() && $(this).val() != 0) {
                                arr.push($.trim($(this).text()))
                            }
                        }).end().outerWidth($(this).outerWidth()-0.5).find('.p-j-hideTitle').text(arr.join('>'));

                    });
                    var cloneColgroup = $('#p-j-tableControl').prev().clone()
                    var cloneTh = $('#p-j-tableControl').clone(true).find('select').remove().end().find('.p-j-hideTitle').removeClass('none').end();
                    $('#p-j-floatTable').remove();
                    $('body').append($('<table id="p-j-floatTable" class="p-tableborder" style="position: fixed; top: 0; min-width:944px;"></table>').append(cloneColgroup).append(cloneTh))

                }
            } else {
                if ($('#p-j-floatTable').length > 0) {
                    $('#p-j-floatTable').remove();
                }
            }
        })
        $('.p-j-colGoLeft').click(function () {
            if ($(this).closest('td').index() == 1) {
                alert('无法左移');
                return false;
            }
            var colNum = $(this).parent().attr('col')
            $('#p-j-c' + colNum + ',td[id^="p-j-' + colNum + '"],td[id^="p-j-r' + colNum + '"],td[id^="p-j-t' + colNum + '"]')
            .each(function () {
                $(this).insertBefore($(this).prev())
            });
        })
        $('.p-j-colGoRight').click(function () {
            if ($(this).closest('td').index() == 4) {
                alert('无法右移');
                return false;
            }
            var colNum = $(this).parent().attr('col')
            $('#p-j-c' + colNum + ',td[id^="p-j-' + colNum + '"],td[id^="p-j-r' + colNum + '"],td[id^="p-j-t' + colNum + '"]')
            .each(function () {
                $(this).insertAfter($(this).next())
            })
        })

        $('.p-j-colEmpty').click(function () {
            var source=$("#source").val();
            if (source == 1) {
                $('#p-j-stage' + $(this).parent().attr('col')).children(':first').prop('selected', true).end().trigger('change');
            } else {
                $('#p-j-select' + $(this).parent().attr('col')).children(':first').prop('selected', true).end().trigger('change');
            }
            
            $(this).closest('td').find('.p-j-hideTitle').empty();
            contrast.checkStatus();
        })
        $('.p-j-collapseTable-tit').on('click', function () {
            var $this = $(this);
            if ($this.hasClass('select')) {
                $this.removeClass('select').closest('thead').next("tbody").show();
            } else {
                $this.addClass('select').closest('thead').next("tbody").hide();
            }
        })



        $('#p-j-showColBtn').click(function () {

            $(this).addClass('hidden');

            $.each($(this).data('hideNum'), function () {

                $('#p-j-c' + this).show();
                $('td[id^="p-j-' + this + '"]').show();
                $('td[id^="p-j-r' + this + '"]').show();
                $('td[id^="p-j-t' + this + '"]').show();

            })

            $(this).removeData('hideNum');
        })


        var contrast = {
            loadCount: 0,
            highlightDif: function () {

                $('#p-j-contrast [trtype="item"]').each(function () {
                    var list = $(this).find('select:visible').map(function () {

                        if ($(this).val() != 0 && $(this).val() != null) {
                            return $(this).parent().index()
                        }
                    }).get()
                    var len = list.length;
                    if (len === 0) {
                        return;
                    }

                    var $tr = $(this).nextUntil('[trtype="item"]').filter('[trtype="ind"]');

                    $tr.each(function () {
                        $td = $(this).children();
                        var isDif = false;
                        var standard = $td.eq(list[0] - 1).html().replace(/<[^>]+>/g, '').replace(/\s+/g, "");

                        for (var i = 1; i < len; i++) {
                            //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                            if (standard != $td.eq(list[i] - 1).html().replace(/<[^>]+>/g, '').replace(/\s+/g, "")) {
                                //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                                isDif = true;
                                break;
                            }
                        }

                        if (isDif) {
                            $(this).addClass('p-j-highlightDiff');
                        }
                    })
                    var $firstTd = $(this).children().first();

                })
            },
            removeHightLightDif: function () {

                $('tr.p-j-highlightDiff').removeClass('p-j-highlightDiff');


            },
            hideDif: function () {
                $('#p-j-contrast [trtype="item"]').each(function () {
                    var list = $(this).find('select:visible').map(function () {

                        if ($(this).val() != 0 && $(this).val() != null) {
                            return $(this).parent().index();
                        }

                    }).get()
                    var len = list.length;
                    if (len === 0) {
                        return;
                    }
                    //var count = 0;

                    var $tr = $(this).nextUntil('[trtype="item"]').filter('[trtype="ind"]');

                    $tr.each(function () {
                        $td = $(this).children();
                        var isDif = false;
                        var standard = $.trim($td.eq(list[0] - 1).html());

                        for (var i = 1; i < len; i++) {
                            //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                            if (standard != $.trim($td.eq(list[i] - 1).html())) {
                                //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                                isDif = true;
                                break;
                            }
                        }
                        if (!isDif) {
                            //count++;
                            $(this).addClass('p-invisibleTr p-hideDifItem');
                            //$(this).css({ background: '#f00' }); //测试后注释此行代码
                        }
                    })
                    var $firstTd = $(this).children().first();
                    //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 - count)

                })
            },
            showHideDif: function () {
                $('#p-j-contrast [trtype="item"]').each(function () {
                
                   $(this).nextUntil('[trtype="item"]').filter('.p-hideDifItem').removeClass('p-invisibleTr p-hideDifItem');

//                    var count = $(this).nextUntil('[trtype="item"]').filter('.none').removeClass('none').length;
//                    var $firstTd = $(this).children().first();
//                    $firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 + count)
                })

            },
            hint:true,
            showHint:function(){
                $('#p-j-contrast [trtype="item"]').each(function () {
                    var endLoop=false;
                    var list = $(this).find('select:visible').map(function () {

                        if ($(this).val() != 0 && $(this).val() != null) {
                            return $(this).parent().index();
                        }

                    }).get()
                    var len = list.length;
                    if (len === 0) {
                        return;
                    }
                    //var count = 0;

                    var $tr = $(this).nextUntil('[trtype="item"]').filter('[trtype="ind"]');

                    $tr.each(function () {
                        $td = $(this).children();
                        var isDif = false;
                        var standard = $.trim($td.eq(list[0] - 1).html());

                        for (var i = 1; i < len; i++) {
                            //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                            if (standard != $.trim($td.eq(list[i] - 1).html())) {
                                //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                                isDif = true;
                                break;
                            }
                        }
                        if (!isDif) {
                            //count++;
                            var $this=$(this);
                          //alert('hh')

                          var $html=$('<div style="height:'+$this.height()+'px; width:'+($this.width()-$this.children('[indtype]:first').offset().left)+'px; top:'+($this.offset().top-3)+'px; left:'+($this.children('[indtype]:first').offset().left-3)+'px; position:absolute; border:2px solid #15507e;">'
                            +'<div style="top: -30px; left: 100px;" class="p-tipBlue">'
                                +'<div class="p-tipBlue-con">点击左上角隐藏相同项复选框可隐藏页面相同项</div>'
                                +'<div class="p-tipBlue-close p-j-closeBtn"></div>'
                                +'<div class="p-tipBlue-arr "></div>'
                            +'</div>'
                          +'</div>');
                          
                          $('body').append($html)
                          $html.find('.p-j-closeBtn').click(function(){
                            $html.remove();
                          })
                          endLoop=true;
                          return false;
                        }
                    })
                    var $firstTd = $(this).children().first();
                    //$firstTd.attr('rowspan', $firstTd.attr('rowspan') * 1 - count)

                    if(endLoop){
                        return false;
                    }
  
  
                })
                $('#p-j-contrast [trtype="item"]').each(function () {
                    var endLoop=false;
  
                    var list = $(this).find('select:visible').map(function () {

                        if ($(this).val() != 0 && $(this).val() != null) {
                            return $(this).parent().index()
                        }
                    }).get()
                    var len = list.length;
                    if (len === 0) {
                        return;
                    }

                    var $tr = $(this).nextUntil('[trtype="item"]').filter('[trtype="ind"]');

                    $tr.each(function () {
                        $td = $(this).children();
                        var isDif = false;
                        var standard = $.trim($td.eq(list[0] - 1).html());

                        for (var i = 1; i < len; i++) {
                            //alert(standard+"::::"+i+"::::"+$td.eq(list[i]-1).text());
                            if (standard != $.trim($td.eq(list[i] - 1).html())) {
                                //alert('nono'+standard+"::::::::"+$td.eq(list[i]-1).text());
                                isDif = true;
                                break;
                            }
                        }

                        if (isDif) {
                            //$(this).addClass('p-j-highlightDiff');
                          var $this=$(this);
                          
                          
                          var $html=$('<div style="height:'+$this.height()+'px; width:'+($this.width()-$this.children('[indtype]:first').offset().left)+'px; top:'+($this.offset().top-3)+'px; left:'+($this.children('[indtype]:first').offset().left-3)+'px; position:absolute; border:2px solid #15507e;">'
                            +'<div style="top: -30px; left: 100px;" class="p-tipBlue">'
                                +'<div class="p-tipBlue-con">点击左上角高亮不同项复选框可切换高亮不同的项</div>'
                                +'<div class="p-tipBlue-close p-j-closeBtn"></div>'
                                +'<div class="p-tipBlue-arr "></div>'
                            +'</div>'
                          +'</div>');

                          $('body').append($html)
                          $html.find('.p-j-closeBtn').click(function(){
                            $html.remove();
                          })
                          endLoop=true;
                          return false;
                        }
                    })
                    var $firstTd = $(this).children().first();

                    if(endLoop){
                        return false;
                    }
  
                })
            },
            checkStatus: function () {
                $('[trtype="item"]').each(function(){
                    if(!$(this).find('select:visible').length){
                        $(this).nextUntil('[trtype="item"]').addClass('p-invisibleTr');
                        
                    }else{
                        $(this).nextUntil('[trtype="item"]').removeClass('p-invisibleTr');
                    }
                })

                contrast.removeHightLightDif();
                if ($('#p-j-highlightDifItem_Checkbox').is(':checked')) {
                    setTimeout('contrast.highlightDif()',700)
                }

                contrast.showHideDif();
                if ($('#p-j-hideSameItem_Checkbox').is(':checked')) {
                    setTimeout('contrast.hideDif()',700)
                }
                if(contrast.hint){
                    contrast.hint=false;
                    contrast.showHint();
                    setTimeout(function(){
                        $('.p-tipBlue-close').trigger('click');
                    },15000)
                }else{
                    $('.p-tipBlue-close').trigger('click');
                }
            }
        }
        
        $("[class^=p-j-showIndTypeItems_]").change(function () {
        
            if ($(this).is(':checked')) {
            
                $('#p-j-contrast').addClass('p-j-showIndType_'+$(this).val());

                $.tmsg("m_jfw", "显示"+$(this).attr('title'), { infotype: 1 });

                $('.'+$(this).attr('class')).prop('checked',true);

            } else {
            
                $('#p-j-contrast').removeClass('p-j-showIndType_'+$(this).val());

                $.tmsg("m_jfw", "隐藏"+$(this).attr('title'), { infotype: 1 });

                $('.'+$(this).attr('class')).prop('checked',false);
            }
        })
        $('#p-j-highlightDifItem_Checkbox').change(function () {

            if ($(this).is(':checked')) {
                contrast.highlightDif();
                $.tmsg("m_jfw", "高亮不同项", { infotype: 1 })
                $('#p-j-highlightDifItem_Checkbox').prop('checked', true);
            } else {
                contrast.removeHightLightDif();
                $.tmsg("m_jfw", "取消高亮不同项", { infotype: 1 });
                $('#p-j-highlightDifItem_Checkbox').prop('checked', false);
            }
        })
        $('#p-j-hideSameItem_Checkbox').change(function () {

            if ($(this).is(':checked')) {
                contrast.hideDif();
                $.tmsg("m_jfw", "隐藏相同项", { infotype: 1 });
                $('#p-j-hideSameItem_Checkbox').prop('checked', true);
            } else {
                contrast.showHideDif();
                $.tmsg("m_jfw", "显示相同项", { infotype: 1 });
                $('#p-j-hideSameItem_Checkbox').prop('checked', false);
            }
        })
        
        function ChoseType(obj, cotype) {
            var curObjValue = $(obj).val();
            var formatId=$("#p-j-format").val();
            var curProjId = 0;
            if (cotype == 1) {
                if (curObjValue == "1") {
                    curProjId = seriesInfo.seriesId1;
                    seriesInfo.seriesId1 = 0;
                } else {
                    curProjId = projId1;
                    projId1 = 0;
                }
            }
            else if (cotype == 2) {
                if (curObjValue == "1") {
                    curProjId = seriesInfo.seriesId2;
                    seriesInfo.seriesId2 = 0;
                } else {
                    curProjId = projId2;
                    projId2 = 0;
                }
            }
            else if (cotype == 3) {
                if (curObjValue == "1") {
                    curProjId = seriesInfo.seriesId3;
                    seriesInfo.seriesId3 = 0;
                } else {
                    curProjId = projId3;
                    projId3 = 0;
                }
            }
            else if (cotype == 4) {
                if (curObjValue == "1") {
                    curProjId = seriesInfo.seriesId4;
                    seriesInfo.seriesId4 = 0;
                } else {
                    curProjId = projId4;
                    projId4 = 0;
                }
            }
            var chooseAscx = "ChoseContrastItem";
            if (source == 1) {
                chooseAscx = "ChoseVersionItem";
            }
            $("#p-j-content" + cotype).load("/Contrast/" + chooseAscx + "?formatId="+formatId+"&type=" + $(obj).val() + "&contrastItem=" + cotype + "&projId=" + curProjId + "&r=" + Math.random(), function () {
                $("#p-j-content" + cotype).find("select").eq(0).children('[value="' + curProjId + '"]').attr('selected', 'selected').end().change();
            });
        }
        //SetMenu(2, 1);
        
        if (isEdit == '1') {
            SetMenu(2, 2);
        } else {
            SetMenu(2, 1);
        }
        function clearResult(obj, index) {
            $("#p-j-contrast").find("td[order=order_" + index + "]").html("");
            $("#p-j-contrast").find("td[id^=p-j-" + index + "-]").each(function () {
                $(this).find("select").each(function () {
                    $(this).html("");
                    $(this).html("<option value='0' >--选择成果--</option>");
                    $(this).css("display", "none");

                });
            });
        }

        $('#p-j-contrast').on('mouseenter', '.p-j-showLargePic', function () {
            var $this = $(this);
            var t = $this.position().top + 25;
            var l = $this.position().left + 25;
            $('body').append('<div id="p-j-showLargePic-pic" style="top:' + t + 'px;left:' + l + 'px;z-index: 100; position: absolute; box-shadow: 3px 3px 3px rgba(0,0,0,0.2); background:#fff; border:1px solid #ddd; padding:5px;"><img src="' + $this.attr('src').replace('_hs.', '_ul.') + '"></div>')

        }).on('mouseleave', '.p-j-showLargePic', function () {
            $('#p-j-showLargePic-pic').remove();
        })
        $(document).ready(function () {
            if (projId1 != "0"||seriesInfo.seriesId1!="0") {
                // $("#p-j-c1").val(2);
                $("#p-j-c1").find("select").eq(0).change();
                // ChoseType($("#p-j-c1"), 1);
            }
            if (projId2 != "0"||seriesInfo.seriesId2!="0") {
                // $("#p-j-c2").val(2);
                $("#p-j-c2").find("select").eq(0).change();
                // ChoseType($("#p-j-c2"), 2);
            }
            if (projId3 != "0"||seriesInfo.seriesId3!="0") {
                //$("#p-j-c3").val(2);
                $("#p-j-c3").find("select").eq(0).change();
                //  ChoseType($("#p-j-c3"), 3);
            }
            if (projId4 != "0"||seriesInfo.seriesId4!="0") {
                //$("#p-j-c4").val(2);
                $("#p-j-c4").find("select").eq(0).change();
                //ChoseType($("#p-j-c4"), 4);
            }
        });



        function GetProductLines(obj, type) {
            var seriesId = $.trim($(obj).val());
            $.post("/Home/GetSelectObjList",
         {
             tbName: "ProductLine",
             qu: 'db.ProductLine.distinct("_id",{"seriesId":"' + seriesId + '"})'

             //qu: "seriesId="+ seriesId 
         }, function (data) {
             if (data.Success == true) {
                 $("#p-j-contrastLine" + type).show();
                 $("#p-j-contrastLine" + type).empty();
                 $("#p-j-contrastLine" + type).append('<option value="0">--选择产品线--</option>');

                 var lineListInfo = "";
                 if (data.htInfo.ObjList != "") {
                     lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                     var len = lineListInfo.length;
                     if (len > 0) {
                         for (var i = 0; i < len; i++) {
                         var select="";
                         if(i==0){select="selected='selected'";}
                             $("#p-j-contrastLine" + type).append('<option '+select+' value="' + lineListInfo[i].metaObjId + '">' + lineListInfo[i].metaObjName + '</option>');

                         }
                     }
                 }
                 else {
                     //                     $("#p-j-contrastLine" + type).empty();
                     //                     $("#p-j-contrastLine" + type).hide();
                 }
                  var curlineId = 0;
                 if (type == 1) {
                     curlineId = seriesInfo.lineId1;
                     seriesInfo.lineId1 = 0;
                 }
                 else if (type == 2) {
                     curlineId = seriesInfo.lineId2;
                     seriesInfo.lineId2 = 0;
                 }
                 else if (type == 3) {
                     curlineId = seriesInfo.lineId3;
                     seriesInfo.lineId3 = 0;
                 }
                 else if (type == 4) {
                     curlineId = seriesInfo.lineId4;
                     seriesInfo.lineId4 = 0;
                 }
                 $("#p-j-contrastLine" + type).children('[value="' + curlineId + '"]').prop('selected', true).end().change();
             }

         });
        }
        function GetStage(obj, type) {
            $.post("/Home/GetSelectObjList",
        {
            tbName: "ProjectDevelopStage",
            qu: "",
            orderBy:'order'
        },
         function (data) {
             if (data.Success == true) {
                 $("#p-j-stage" + type).show();
                 $("#p-j-stage" + type).empty();
                 $("#p-j-stage" + type).append("<option value='0'>--选择阶段--</option>");
                 var lineListInfo = "";
                 if (data.htInfo.ObjList != "") {
                     lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                     var len = lineListInfo.length;
                     if (len > 0) {
                         for (var i = 0; i < len; i++) {
                             $("#p-j-stage" + type).append("<option value='" + lineListInfo[i].metaObjId + "' >" + lineListInfo[i].metaObjName + "</option>");
                         }
                     }
                 }
                 else {
                     //                     $("#p-j-stage" + type).empty();
                     //                     $("#p-j-stage" + type).hide();
                 }
                 var curStage = 0;
                 if (type == 1) {
                     curStage = stage1;
                     stage1 = 0;
                 }
                 else if (type == 2) {
                     curStage = stage2;
                     stage2 = 0;
                 }
                 else if (type == 3) {
                     curStage = stage3;
                     stage3 = 0;
                 }
                 else if (type == 4) {
                     curStage = stage4;
                     stage4 = 0;
                 }
                 $("#p-j-stage" + type).children('[value="' + curStage + '"]').prop('selected', true).end().change();
             }

         });
        }

        function GetVersion(obj, type) {
            var stageId = $.trim($(obj).val());
            var projId = $("#p-j-proj" + type).val();
            $.post("/Home/GetSelectObjListField",
        {
            tbName: "ProjectCIStageVersion",
            qu: 'db.ProjectCIStageVersion.distinct("_id",{"projId":"' + projId + '","stageId":"' + stageId + '"})',
            fieldStr:"isIssue"
        },
        function (data) {
            if (data.Success == true) {
                $("#p-j-version" + type).show();
                $("#p-j-version" + type).empty();
                $("#p-j-version" + type).append('<option value="0" >--选择版本--</option>');
                var lineListInfo = "";
                if (data.htInfo.ObjList != "") {
                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
                    var len = lineListInfo.length;
                    var statusName="未审";
                    if (len > 0) {
                         for (var i = 0; i < len; i++) {
                        if(lineListInfo[i].isIssue==1){
                        statusName="审核中";
                        }else if(lineListInfo[i].isIssue==2){
                        statusName="已审";
                        }
                            $("#p-j-version" + type).append('<option value="' + lineListInfo[i].metaObjId + '">' + lineListInfo[i].metaObjName+"--"+statusName + '</option>');

                        }
                    }
                }
                else {
                }
                var curStageVersionId = 0;
                if (type == 1) {
                    curStageVersionId = stageVersionId1;
                    stage1 = 0;
                }
                else if (type == 2) {
                    curStageVersionId = stageVersionId2;
                    stageVersionId2 = 0;
                }
                else if (type == 3) {
                    curStageVersionId = stageVersionId3;
                    stageVersionId3 = 0;
                }
                else if (type == 4) {
                    curStageVersionId = stageVersionId4;
                    stageVersionId4 = 0;
                }
                $("#p-j-version" + type).children('[value="' + curStageVersionId + '"]').prop('selected', true).end().change();
            }

        });
        }

        function GetResult(obj, type) {
            var lineId = $.trim($(obj).find("option:selected").val());
            var formatId=$("#p-j-format").val();
           
            contrast.loadCount++;
            $.post("/Home/CPIMGetAllResultAllFieldList?lineId=" + lineId + "&formatId=" + formatId,
        function (data) {
            $("select[selprojnum=" + type + "]").hide();
            $("select[selnum=" + type + "]").each(function () {
                $(this).empty();

            });
            $("td[order=order_" + type + "]").html("");
            var lineListInfo = eval("(" + data.toString() + ")");
            if (lineListInfo.length > 0) {
                for (var i = 0; i < lineListInfo.length; i++) {
                    $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].treeItemId).append("<option value='" + lineListInfo[i].resultId + "'>" + lineListInfo[i].name + "</option>");
                    if (lineListInfo[i].select == 1) {
                        $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId + "]").each(function () {
                            var curdataKey = $(this).parent("tr").attr("datakey");
                            if (lineListInfo[i][curdataKey] != null) {
                                
                                var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
                                $(this).html(html);
                            }
                        });
                    }
                }


            }
            $("select[selnum=" + type + "]").each(function () {
                if ($(this).find("option").length > 0) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
                // $(this).change();
                if ($(this).find("option").length == 1) {
                    $(this).attr("disabled", "disabled");
                }
            });
            if (--contrast.loadCount < 1) {
                contrast.checkStatus();
            }
        });
        }


        function GetProjResult(obj, type) {
            contrast.loadCount++;
            var stageVersionId = $(obj).val();
            var formatId=$("#p-j-format").val();
            $.post("/Home/CPIMGetProjAllResultAllFieldList?stageVersionId=" + stageVersionId+"&formatId="+formatId,
        function (data) {
            $("select[selnum=" + type + "]").hide();

            $("select[selprojnum=" + type + "]").each(function () {
                $(this).empty();
            });
            $("td[order=order_"+type+"]").html("");
            var  lineListInfo =  JSON.parse( data.toString());//data.toString() 
            if(lineListInfo.length>0)
            {
              for (var i = 0; i < lineListInfo.length; i++) {
                            $("#p-j-choseProjRe" + type + "-" + lineListInfo[i].treeItemId).append("<option value='" + lineListInfo[i].resultId + "'>" + lineListInfo[i].name + "</option>");
                            if($("#p-j-choseProjRe" + type + "-" + lineListInfo[i].treeItemId).find("option").length==1)
                            {
                                $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId+"]").each(function(){
                                var curdataKey=$(this).parent("tr").attr("datakey");
                                if(lineListInfo[i][curdataKey]!=null){
                                 var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
                                   $(this).html(html);
                                   }
                                })
                            }
                        }
                        
            }
            $("select[selprojnum=" + type + "]").each(function () {
                    if ($(this).find("option").length > 0) {
                        $(this).show();
                         
                    } else {
                        $(this).hide();
                    }
                     if($(this).find("option").length==1)
                        {
                        $(this).attr("disabled","disabled");
                        }
                });
              if (--contrast.loadCount < 1) {
                contrast.checkStatus();
            }


        });
        }


        function GetResultInfo(obj, itemId, type) {
        //去除子集成果
           $("tr[nodePid="+itemId+"]").find("select[selnum=" + type + "]").each(function () {
                $(this).empty();
                var selId=$(this).attr("id");
                var subItemId=selId.split('p-j-choseSerRe1-')[1];
                 $(".p-j-r" + type + "-" + subItemId).html("");
                
            });
            var resultId = $(obj).val();
            contrast.loadCount++;
           $.getJSON("/Home/CPIMGetSerAllResultInfo?resultId=" + resultId + "&treeItemId=" + itemId,
        function (data) {
            if (--contrast.loadCount < 1) {
                contrast.checkStatus();
            } 
            $(".p-j-r" + type + "-" + itemId).html("");
//            if (data.Success == true) {
             var  lineListInfo = JSON.parse( data.toString());
            if(lineListInfo.length>0)
            {
             for (var i = 0; i < lineListInfo.length; i++) {
             if(lineListInfo[i].select!=1){
               $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].treeItemId).append("<option value='" + lineListInfo[i].resultId + "'>" + lineListInfo[i].name + "</option>");
             if( $("#p-j-choseSerRe" + type + "-" + lineListInfo[i].treeItemId).find("option").length==1){
               $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId+"]").each(function(){
               var curdataKey=$(this).parent("tr").attr("datakey");
                 if(lineListInfo[i][curdataKey]!=null){
                                 var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
               $(this).html(html);}
               });} }else{
               $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId+"]").each(function(){
               var curdataKey=$(this).parent("tr").attr("datakey");
                 if(lineListInfo[i][curdataKey]!=null){
                                 var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
               $(this).html(html);}
               });
               }
               }}
                $("tr[nodePid="+itemId+"]").find("select[selnum=" + type + "]").each(function () {
                 if ($(this).find("option").length > 0) {
                        $(this).show();
                         
                    } else {
                        $(this).hide();
                    }
            });
//                var lineListInfo = "";
//                if (data.htInfo.ObjList != "") {
//                    lineListInfo = eval("(" + data.htInfo.ObjList + ")");
//                    var len = lineListInfo.length;
//                    if (len > 0) {
//                        for (var i = 0; i < len; i++) {
//                            var indType = $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).attr("indType");
//                            if (indType != "5") {
//                                //$("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(lineListInfo[i].metaObjName.replace(/[\r\n]+/g,"<br />"));

//                                var html = $.map(lineListInfo[i].metaObjName.split(/[\r\n]+/), function (v) {
//                                    if (v) {
//                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
//                                    }
//                                }).join('')
//                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).html(html);

//                            } else {
//                                //  var sss = +lineListInfo[i].metaObjId
//                                //去掉图集对比
//                                //                                contrast.loadCount++;
//                                //                                $("#p-j-r" + type + "-item" + itemId + "-Ind" + lineListInfo[i].metaObjId).load("/Contrast/ImageRollAxcx?itemId=" + itemId + "&col=" + type + "&resultId=" + resultId + "&indId=" + lineListInfo[i].metaObjId + "&resultType=1&r=" + Math.random(), function () {
//                                //                                    if (--contrast.loadCount < 1) {
//                                //                                        contrast.checkStatus();
//                                //                                    }
//                                //                                });
//                            }

//                        }
//                    }
//                }
//            }

        });
        }

        function GetProjResultInfo(obj, itemId, type) {
         //去除子集成果
           $("tr[nodePid="+itemId+"]").find("select[selprojnum=" + type + "]").each(function () {
                $(this).empty();
                var selId=$(this).attr("id");
                var subItemId=selId.split('p-j-choseProjRe1-')[1];
                 $(".p-j-r" + type + "-" + subItemId).html("");
                
            });
            var resultId = $(obj).val();
            contrast.loadCount++;
            $.post("/Home/CPIMGetProjAllResultInfo?resultId=" + resultId + "&treeItemId=" + itemId,
        function (data) {
            if (--contrast.loadCount < 1) {
                contrast.checkStatus();
            }
            $(".p-j-r" + type + "-" + itemId).html("");
            var  lineListInfo = JSON.parse( data.toString());
            if(lineListInfo.length>0)
            { 
            for (var i = 0; i < lineListInfo.length; i++) {
             if(lineListInfo[i].select!=1){
               $("#p-j-choseProjRe1" + type + "-" + lineListInfo[i].treeItemId).append("<option value='" + lineListInfo[i].resultId + "'>" + lineListInfo[i].name + "</option>");
             if( $("#p-j-choseProjRe1" + type + "-" + lineListInfo[i].treeItemId).find("option").length==1){
               $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId+"]").each(function(){
               var curdataKey=$(this).parent("tr").attr("datakey");
                 if(lineListInfo[i][curdataKey]!=null){
                                 var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
               $(this).html(html);}
               });} }else{
                $("td[class=p-j-r" + type + "-" + lineListInfo[i].treeItemId+"]").each(function(){
               var curdataKey=$(this).parent("tr").attr("datakey");
                 if(lineListInfo[i][curdataKey]!=null){
                                 var html = $.map(lineListInfo[i][curdataKey].split(/[\r\n]+/), function (v) {
                                    if (v) {
                                        return '<p class="mb5"><i class="p-f_brown mr5">●</i>' + v.replace(/^\d+、/g, '') + '</p>'
                                    }
                                }).join('')
               $(this).html(html);}
               });
               }
               }}
                $("tr[nodePid="+itemId+"]").find("select[selprojnum=" + type + "]").each(function () {
                 if ($(this).find("option").length > 0) {
                        $(this).show();
                         
                    } else {
                        $(this).hide();
                    }
            });


        });
        }

        function saveContrastLog() {
            var curFormatId=$("#p-j-format").val();
            var curselect1,curselect2,curselect3,curselect4,curproj1,curproj2,curproj3,curproj4,curstage1,curstage2,curstage3,curstage4,curversion1,curversion2,curversion3,curversion4;
            var curseries1,curline1,curseries2,curline2,curseries3,curline3,curseries4,curline4;
             $("#p-j-tableControl").find("tr:eq(0)").find("td[id^=p-j-c]").each(function(){
         var tempIndex = $(this).parent().find("td[id^=p-j-c]").index(this);
         switch (tempIndex){
         case 0:curselect1=$(this).find("select[id^=p-j-select]").val();
                curproj1=$(this).find("select[id^=p-j-proj]").val();
                curstage1=$(this).find("select[id^=p-j-stage]").val();
                curversion1=$(this).find("select[id^=p-j-version]").val();
                curseries1=$(this).find("select[id^=p-j-contrastSeries]").val();
                curline1=$(this).find("select[id^=p-j-contrastLine]").val();
                break;
         case 1:curselect2=$(this).find("select[id^=p-j-select]").val();
                curproj2=$(this).find("select[id^=p-j-proj]").val();
                curstage2=$(this).find("select[id^=p-j-stage]").val();
                curversion2=$(this).find("select[id^=p-j-version]").val();
                curseries2=$(this).find("select[id^=p-j-contrastSeries]").val();
                curline2=$(this).find("select[id^=p-j-contrastLine]").val();break;
         case 2:curselect3=$(this).find("select[id^=p-j-select]").val();
                curproj3=$(this).find("select[id^=p-j-proj]").val();
                curstage3=$(this).find("select[id^=p-j-stage]").val();
                curversion3=$(this).find("select[id^=p-j-version]").val();
                curseries3=$(this).find("select[id^=p-j-contrastSeries]").val();
                curline3=$(this).find("select[id^=p-j-contrastLine]").val();break;
         case 3:curselect4=$(this).find("select[id^=p-j-select]").val();
                curproj4=$(this).find("select[id^=p-j-proj]").val();
                curstage4=$(this).find("select[id^=p-j-stage]").val();
                curversion4=$(this).find("select[id^=p-j-version]").val();
                curseries4=$(this).find("select[id^=p-j-contrastSeries]").val();
                curline4=$(this).find("select[id^=p-j-contrastLine]").val();break;
         }
        });
            $.YH.box_prompt({
                key: "名称",
                title: "保存对比",
                ok: function (name) {
                    if (name == "") {
                        alert("请输入名称");
                        return false;
                    }

                    $.ajax({
                        url: "/Home/SavePostInfo",
                        type: 'post',
                        data: {
                            tbName: "PersonalContrastLog",
                            queryStr: "",
                            name: name,
                            formatId:curFormatId,
                            select1: curselect1,
                            select2: curselect2,
                            select3: curselect3,
                            select4: curselect4,
                            proj1: curproj1,
                            proj2: curproj2,
                            proj3: curproj3,
                            proj4: curproj4,
                            stage1: curstage1,
                            stage2: curstage2,
                            stage3: curstage3,
                            stage4: curstage4,
                            version1: curversion1,
                            version2: curversion2,
                            version3: curversion3,
                            version4: curversion4,
                            series1: curseries1,
                            series2: curseries2,
                            series3: curseries3,
                            series4: curseries4,
                            line1: curline1,
                            line2: curline2,
                            line3: curline3,
                            line4: curline4
                        },
                        dataType: 'json',
                        error: function () {
                            $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
                        },
                        success: function (data) {
                            if (data.Success == false) {
                                $.tmsg("m_jfw", data.Message, { infotype: 2 });
                            }
                            else {
                                $.tmsg("m_jfw", "保存成功", { infotype: 1 });
                            }
                        }
                    });
                }
            })
        }

        function choseContrastLog() {
            var $box = $.YH.box({
                title: "选择对比",
                width: 850,
                target: "/Contrast/ContrastLogList?r=" + Math.random(),
                buttonNames: [null, '关 闭'],
                afterLoaded:function(){
                    $(this).find("a[mark=contrastCompare]").click(function(){
                        var selectType = $(this).attr("selectType");
                        var projIds = $(this).attr("projIds");
                        var stageIds = $(this).attr("stageIds");
                        var sVerIds = $(this).attr("sVerIds");
                        var seriesIds = $(this).attr("seriesIds");
                        var linesIds = $(this).attr("linesIds");
                        var curFormatId= $(this).attr("formatId");
                        chooseCompareScheme(selectType, projIds,stageIds,sVerIds,seriesIds,linesIds,curFormatId);
                        $box.dialog("destroy");
                    });
                }
            });
        }
        //不足或没有用0占位 格式： id_id_id_id
     function chooseCompareScheme(selectType, projIds,stageIds,sVerIds,seriesIds,linesIds,curFormatId)
     {
        $("#p-j-format").val(curFormatId);
         var indexArr=new Array();
        indexArr.push(0);indexArr.push(1);indexArr.push(2);indexArr.push(3);
        $("#p-j-tableControl").find("tr:eq(0)").find("td[id^=p-j-c]").each(function () {
      
            var tempIndex = $(this).parent().find("td[id^=p-j-c]").index(this);
            var thisCol = $(this).attr("selNum");
            indexArr[thisCol-1] = tempIndex;
        });
        var selectTypeArr=selectType.split('_');
        var projIdsArr=projIds.split('_');
        var stageIdsArr=stageIds.split('_');
        var sVerIdsArr=sVerIds.split('_');
        var seriesIdsArr=seriesIds.split('_');
        var linesIdsArr=linesIds.split('_');
         projId1 =projIdsArr[indexArr[0]];
         projId2 =projIdsArr[indexArr[1]];
         projId3 =projIdsArr[indexArr[2]];
         projId4 =projIdsArr[indexArr[3]];
         stageVersionId1 = sVerIdsArr[indexArr[0]];
        stageVersionId2 = sVerIdsArr[indexArr[1]];
        stageVersionId3 = sVerIdsArr[indexArr[2]];
        stageVersionId4 = sVerIdsArr[indexArr[3]];
        stage1 = stageIdsArr[indexArr[0]];
        stage2 = stageIdsArr[indexArr[1]];
        stage3 = stageIdsArr[indexArr[2]];
        stage4 = stageIdsArr[indexArr[3]];
        seriesInfo.lineId1 = linesIdsArr[indexArr[0]];
        seriesInfo.lineId2 = linesIdsArr[indexArr[1]];
        seriesInfo.lineId3 = linesIdsArr[indexArr[2]];
        seriesInfo.lineId4 = linesIdsArr[indexArr[3]];
        seriesInfo.seriesId1 = seriesIdsArr[indexArr[0]];
        seriesInfo.seriesId2 = seriesIdsArr[indexArr[1]];
        seriesInfo.seriesId3 = seriesIdsArr[indexArr[2]];
        seriesInfo.seriesId4 = seriesIdsArr[indexArr[3]];
                 $("#p-j-c1").find("select").eq(0).val(selectTypeArr[indexArr[0]]);
                $("#p-j-c1").find("select").eq(0).change();
                $("#p-j-c2").find("select").eq(0).val(selectTypeArr[indexArr[1]]);
                $("#p-j-c2").find("select").eq(0).change();
                $("#p-j-c3").find("select").eq(0).val(selectTypeArr[indexArr[2]]);
                $("#p-j-c3").find("select").eq(0).change();
                $("#p-j-c4").find("select").eq(0).val(selectTypeArr[indexArr[3]]);
                $("#p-j-c4").find("select").eq(0).change();
     }
     $('#p-j-exportPDF').click(function(){

        var $table=$('#p-j-contrast').find('select').each(function(){
           if($(this).is(':visible')){
             var txt=$(this).children(':selected').text();
             $(this).after('<span class="p-j-tempName">'+txt+'</span>')
           }
        }).end().clone();
        var html=$table.appendTo('body').find('select,.yh-btn').remove().end()
        .find('input:not(:checked)').closest('td').empty().end().end().prop('outerHTML');
  
        $('#p-j-contrast').find('.p-j-tempName').remove();

          $.YH.exportPDF({
                    action:'/Home/CommonHtmlToPDF',
                    cssUrl:'/Content/css/client/JH/jinhui.css',
                    pdfName:'项目对比',
                    html:html,
                    pdfParams:"--footer-center 第[page]页/共[topage]页 --footer-line"
                })
  
            })