$(function () {
	var CS={
		config:{
			jqueryui:{js:'js/jquery-ui-1.9.2.custom.min.js',css:'js/jQuery/JQueryUi/css/jquery-ui-1.9.2.custom.css',key:['jQuery.ui','object']},
			YHsuperTable:{js:'js/table/jquery.YH-superTables.js',key:['jQuery.fn.YHsuperTable','function']},
			YHsly:{js:'js/jQuery/sly/jquery.YH-sly.js',key:['jQuery.fn.YHsly','function']},
			colorpicker:{}
		},
		component:{
			sly:{
				cls:'',
				title:'sly-自动生成滚动条'
			}
		},
		copy_clip:function (copy){
			if (window.clipboardData){
				window.clipboardData.setData("Text", copy);}
			else if (window.netscape){
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				//if (!clip) return;
				var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				//if (!trans) return;
				trans.addDataFlavor('text/unicode');
				var str = new Object();
				var len = new Object();
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				var copytext=copy;
				str.data=copytext;
				trans.setTransferData("text/unicode",str,copytext.length*2);
				var clipid=Components.interfaces.nsIClipboard;
				//if (!clip) return false;
				clip.setData(trans,null,clipid.kGlobalClipboard);
			}else{
				alert('您的浏览器不知道剪切板功能');
			}
			//return false;
		}
	}
	//测试页面是否包含jqueryui的css以及js文件
	$.YH.testFunction('jqueryui',this,function(){
		var str='<div data-cs-title="xixi"></div>',
            $topLine=$('<div class="CS-op" style="border: 1px dotted #000; height: 0px; position: absolute; z-index: 100000">'),
            $bottomLine=$('<div class="CS-op" style="border: 1px dotted #000; height: 0px; position: absolute; z-index: 100000">'),
            $leftLine=$('<div class="CS-op" style="border: 1px dotted #000; width: 0px; position: absolute; z-index: 100000">'),
            $rightLine=$('<div class="CS-op" style="border: 1px dotted #000; width: 0px; position: absolute; z-index: 100000">'),
            $borders=$().add($topLine).add($bottomLine).add($leftLine).add($rightLine);
        var $mask=$('<div title="点击查看代码详情" class="CS-J-blockMask" style="position: absolute; background: rgba(73,159,255,0.5); z-index: 100000"></div>');
        var $documents=$(document);
        $('iframe').each(function(){
            $documents=$documents.add(this.contentWindow.document);
        })
        $documents.on('mouseover','.CS-J-block',function(){
            var $this=$(this),
                t=$this.offset().top,
                l=$this.offset().left,
                w=$this.outerWidth(),
                h=$this.outerHeight();
            $topLine.css({
                top:t-4,
                left:l-4,
                width:w+7
            })
            $leftLine.css({
                top:t-4,
                left:l-4,
                height:h+7
            })
            $bottomLine.css({
                top:t + h +3,
                left:l - 4,
                width:w +7
            })
            $rightLine.css({
                top:t - 4,
                left:l + w + 3,
                height:h +7
            })
            $borders.appendTo($(this).closest('body'));
            //$('.CS-op').removeClass('CS-op');
            //$(this).addClass('CS-op');
			return false;
		}).on('mouseleave','.CS-J-block',function(){
			//$(this).removeClass('CS-op');
            $borders.remove();
        }).delegate('.CS-J-block','contextmenu',function(){
			var This=this;
            $mask.remove();
			//if (window.clipboardData){
             //   $(this).closest('body').append('<div title="点击查看代码详情" class="CS-J-blockMask" style="top:'+$(this).offset().top+'px; left:'+$(this).offset().left+'px; height:'+($(this).outerHeight()-1)+'px; width:'+($(this).outerWidth()-1)+'px;" class="CS-J-block"><a class="CS-J-copyCode"><i class="icon-copy"></i> 复制</a></div>');
			//}else{
             //   $(this).closest('body').append('<div title="点击查看代码详情" class="CS-J-blockMask" style="" class="CS-J-block"></div>');
			//}
            $(this).closest('body').append($mask.css({top: $(this).offset().top , left: $(this).offset().left , height: $(this).outerHeight()-1, width: $(this).outerWidth()-1 }))


            $mask.one('click',function(){
                var title=$(This).attr('data-cs-title') || '相关代码';
                $(this).remove();
                var dialogHtml='<pre class="YH-well mh400 scroll">'+$(This).clone().removeAttr('data-cs-title')[0].outerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/CS-J-block/g,'').replace(/data-cs-title="*/,'')+'</pre>';
                $.YH.box({
                    target:$('<div>'+dialogHtml+'</div>'),
                    title:title,
                    autoOpen: true,
                    modal: true,
                    width: 600
                })
            })

			//$('.CS-J-blockMask .CS-J-copyCode').click(function(){
			//	//alert(This.outerHTML);
			//	CS.copy_clip(This.outerHTML);
			//	return false;
			//})
            return false;
		})
		
	});
				

	
	

});