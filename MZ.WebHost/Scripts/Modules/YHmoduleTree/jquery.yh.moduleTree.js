;(function ($) {
    $.YH = $.YH || {};
    $.YH.moduleTree = function (options) {
        var $box = $(options.selector);
        var data = options.data;
        var $session1 = $('<div class="mt-session mt-session1"></div>');
        var $line1 = $('<div class="mt-lineBetweenSession mt-bold"></div>');
        var $line2 = $('<div class="mt-lineBetweenSession"></div>');
        var $table = $('<table id="mt-part2" cellspacing="0"><tbody><tr></tr></tbody></table>');
        var $part2 = $table.find('tr');
        var trigerIndex;

        var updateLine = function () {
            var p1 = $session1.find('.selected').position().left + $session1.find('.selected').width()/ 2;
            var p2 = $part2.find('.mt-session:first').position().left + $part2.find('.mt-session:first').width()/ 2;
            var p3 = $part2.find('.mt-session:last').position().left + $part2.find('.mt-session:last').width()/2;
            $line2.css({
                width: Math.max(p1, p2, p3) - Math.min(p1, p2, p3),
                marginLeft: Math.min(p1, p2, p3)
            });
        }

        var render = function () {
            $box.empty();
            $box.append('<div class="mt-titleBox"><div class="mt-title" pid="'+data.Pid+'" itemid="'+data.Id+'">'+ data.Name +'</div></div>');
            if(data.childCount==0){ //判断是否有子集
                return false;
            }
            $box.find(".mt-titleBox").append('<div class="mt-line"></div>');
            $session1.append($line1)
            var eva = Math.floor(10000/data.SubNodes.length)/100;
            $.each(data.SubNodes, function (i, data) {
                if (!trigerIndex && data.SubNodes.length) {
                    trigerIndex = i;
                }
                
                $session1.append(
                    $('<div style="width: '+ eva +'%;*width:'+Math.floor(eva)+'%" class="mt-itemBox">' +
                        '<div class="mt-item">' +
                        '<div class="mt-line"></div>' +
                        '<div class="mt-name '+ data.Class +'" lv="1" pid="'+data.Pid+'" itemid="'+ data.Id +'" title="'+ data.Name +'" style="word-wrap: break-word; width:18px; padding:5px 6px;text-align:center;"><sup class="mt-number">'+ (i + 1) +'</sup>'+ '<span class="mt-text" style="letter-spacing:2px;">' + ((data.Name).length>9?(data.Name).substring(0,9):""+data.Name) + '</span>'+((data.Name).length>9?"<div style='margin-top:-8px;'>...</div>":"") + (data.retCount>=0?'<i class="mt-count">' + (data.retCount==0&&shwoChild(data)>0?"":"("+data.retCount+")") + '</i>':"") +'</div>' +
                        '<div class="mt-lineDown"></div>' +
                        '</div>' +
                        '</div>').data('data', data));
            });
            $box.append($session1);
            $line1.css({
                width: $session1.find('.mt-itemBox:last').position().left - $session1.find('.mt-itemBox:first').position().left,
                marginLeft:  $session1.find('.mt-itemBox:first').position().left + $session1.find('.mt-itemBox:first').width()/2
            });
            $box.append($line2);
            $box.append($table);
        }
        render();
        var timer;
        $session1.on('mouseleave', '.mt-itemBox .mt-item', function () {
            clearTimeout(timer);
        }).on('mouseenter', '.mt-itemBox .mt-item', function () {
            clearTimeout(timer);
            var $this = $(this);
            timer = setTimeout(function () {
                var myData = $this.parent().data('data');
                $part2.empty();
                $line2.show();
                $this.children('.mt-name').attr('childcount',shwoChild(myData));
                if (myData.SubNodes.length === 0) {
                    $line2.hide();
                    $this.parent().siblings().removeClass('selected');
                    return;
                }
                $this.parent().addClass('selected').siblings().removeClass('selected');
                //console.log($(this).data('data'))

                $.each(myData.SubNodes, function (i, itemLv2) {
                    var $session2 = $('<td></td>');
                    var $session3 = $('<div class="mt-session mt-session3"></div>');
                    if (itemLv2.SubNodes.length === 0) {//只有二级
                        $session2.append('<div class="mt-session">' +
                            '<div class="mt-itemBox">' +
                            '<div class="mt-item">' +
                            '<div class="mt-line"></div>' +
                            '<div class="mt-name '+ data.Class +'" childcount="0" lv="2" pid="'+itemLv2.Pid+'" itemid="'+ itemLv2.Id +'" title="'+ itemLv2.Name +'" style="padding:0px; width:28px;">'+ '<div class="mt-text" style="padding:5px 5px 0px 5px; text-align:center; letter-spacing:2px; display:inline-block;">'+ ((itemLv2.Name).length>11?(itemLv2.Name).substring(0,11):""+itemLv2.Name) + '</div>'+((data.Name).length>9?"<div style='margin-top:-9px;margin-left: 8px;'>...</div>":"")+ '<div class="mt-count" style="padding:0px 2px 3px 3px; text-align: center">' + (itemLv2.retCount>=0?"(" + itemLv2.retCount + ")":"")+ '</div>' +'</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>').find('.session').append($session3);
                    } else {//有三级
                        $session2.append('<div class="mt-session">' +
                            '<div class="mt-itemBox">' +
                            '<div class="mt-item">' +
                            '<div class="mt-line"></div>' +
                            '<div class="mt-name '+ data.Class +'" childcount="1" lv="2" pid="'+itemLv2.Pid+'" itemid="'+ itemLv2.Id +'" title="'+ itemLv2.Name +'" style="padding:0px; width:28px;">'+ '<div class="mt-text" style="padding:5px 5px 0px 5px; text-align: center; letter-spacing:2px; display:inline-block;">'+ ((itemLv2.Name).length>11?(itemLv2.Name).substring(0,11):""+itemLv2.Name) + '</div>'+((data.Name).length>9?"<div style='margin-top:-9px;margin-left: 8px;'>...</div>":"")+ '<div style="padding:0px 2px 3px 3px;  text-align: center">' + (itemLv2.retCount>=0?"(" + itemLv2.retCount + ")":"")+ '</div>' +'</div>' +
                            '<div class="mt-line"></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>').find('.mt-session').append($session3);

                        var eva2 = Math.floor(10000/itemLv2.SubNodes.length)/100;
                        $session3.append('<div class="mt-lineBetweenSession"></div>')
                        $.each(itemLv2.SubNodes, function (j, itemLv3) {
                            $session3.append('<div class="mt-itemBox" style="width: '+ eva2 +'%">' +
                                '<div class="mt-item">' +
                                '<div class="mt-line"></div>' +
                                '<div childcount="0" class="mt-name '+ data.Class +'" lv="3" pid="'+itemLv3.Pid+'" itemid="'+ itemLv3.Id +'" title="'+ itemLv3.Name +'" style="padding:0px; width:28px;">'+ '<div class="mt-text" style="padding:5px 5px 0px 5px; text-align: center; letter-spacing:2px; display:inline-block;">'+ itemLv3.Name + '</div>'+ '<div class="mt-count" style="padding:0px 2px 3px 3px; text-align: center">' + (itemLv3.retCount>=0?"(" + itemLv3.retCount + ")":"")+ '</div>' +'</div>' +
                                '</div>' +
                                '</div>');
                        });
                    }

                    $part2.append($session2);
                    $part2.find('.mt-session3').each(function () {
                        var $this = $(this);
                        var $line = $this.find('.mt-lineBetweenSession');
                        switch ($this.find('.mt-itemBox').length) {
                            case 0:
                                return;
                            case 1:
                                $line.hide();
                                break;
                            default:
                                $line.css({
                                    width: $this.find('.mt-itemBox:last').position().left - $this.find('.mt-itemBox:first').position().left,
                                    marginLeft:  $this.find('.mt-itemBox:first').position().left + $this.find('.mt-itemBox:first').width()/2
                                });
                        }
                    });
                    updateLine();
                });
            }, 300);
        });

        $session1.find('.mt-itemBox').eq(trigerIndex).find('.mt-item').trigger('mouseenter');
        //判断 该项下挂几级
        function shwoChild(data){
            var count = 0;
            var child = data.SubNodes;
            if(child.length>0){
                count=1;
                for(var i=0;i<child.length;i++){
                    if(child[i].SubNodes.length>0){
                        count=2;
                    }
                }
            }
            return count;
        }
    }
})(jQuery)  