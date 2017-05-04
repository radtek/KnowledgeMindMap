/*
* 业态选择
*/
; (function ($) {
	$.fn.choseType = function(options){
        /*
        * 默认参数设置
        */
        var defaults = {
            url:"",                  //（必须）获取业态JSON的路径
            type:'get',
            radioOrNot:"0",          //（可选）单选或多选
            infoMsg:"提示：同时按下 Ctrl 键可进行多选！",
            selectClass:"background:blue;color:#fff;",
            selected:[]              // (可选)已选中的项
        };
		var opts = $.extend(defaults, options);
        var $con = $(this);     //容器
        $con.html('数据加载中...');
        $.ajax({
            type: 'get',
            url: opts.url,
            success:function(rs){
                var r = rs.length,htmlDom="";
                if(r>0){
                    htmlDom = "<div class='p-j-typeListCon' style='width: 100%; height: 200px;border:1px solid #ddd;overflow:auto;'><ul>";
                    for(var i=0;i<r;i++){
                        var cur = rs[i],lv = cur.otherParam,id=cur.id
                        if(cur.type == "1"){    //类型
                            htmlDom += "<li typeId='"+id+"' isType='1' lv='"+lv+"' style='color:#9b212e;padding-left:"+
                                        ((lv-1)*15+5)+"px;font-weight:bold;' value='"+cur.id+"'>"+cur.name+"</li>";
                        }else{
                            htmlDom += "<li class='"+(opts.selected.indexOf(id)!='-1'?"select":"")+" type' typeId='"+id+"' isType='0' lv='"+(lv-1)+"' style='padding-left:"+
                                        ((lv-1)*15+5)+"px;' value='"+cur.id+"'><i class='yh-level'></i>"+cur.name+"</li>";
                        }
                    }
                    htmlDom += "</ul></div>";
                    if(opts.radioOrNot == "0"){
                        htmlDom += "<p class='mt5'>"+opts.infoMsg +"</p>";
                    }
                }else{
                    htmlDom+='<div>暂无可选项！</div>';
                }
                $con.html(htmlDom);

                $con.off('click').on('click','li',function(){
                    clickType.call(this);
                });

                $(document).on("keydown",function(e){
                    var e = e||window.event;
                    if (e.ctrlKey==1){
                        $con.off('click','li').on('click','li',function(){
                            clickType.call(this,opts.radioOrNot);
                        });
                    }
                }).on('keyup',function(e){
                    $con.off('click','li').on('click','li',function(){
                        clickType.call(this);
                    });
                });
            }
        });
	}
	
    /*
    * 点击事件
    */
    function clickType(radioOrNot){
        var $this = $(this);
        if($this.attr('istype')=="1") return false;
        if($this.hasClass('select')){
            $this.removeClass('select');
        }else{
            if(radioOrNot!=0){
                $this.addClass('select').siblings().removeClass('select');
            }else{
                $this.addClass('select');
            }
        }
    }
})(jQuery);