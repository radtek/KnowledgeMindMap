;(function($,Raphael,window){
    //树状结构
    //v.1.0.1
    //需要引入jquery，raphael
    //调用：
    //mindMap('#YH-MM-J-box',treeJson,{color:'#73a1bf',width:1});
    //

    $.YH.mindMap=function(options){
        var that=this;
        var opts=$.extend({}, $.YH.mindMap.defaults, options);
        this.$box=$(opts.selector);
        this.data=opts.data;
        this.strokeColor=opts.strokeColor;
        this.strokeWidth=opts.strokeWidth;
        this.$leftBranch=$('<div class="YH-MM-box-leftBranch" style="position: absolute; top:0; left:0; width:37%"></div>');
        this.$rightBranch=$('<div class="YH-MM-box-rightBranch" style="position: absolute; top:0; right:0; width:37%"></div>');
        this.svgId='YH-MM-box-svgBackground_'+Math.round(Math.random()*10000);
        this.$svgBackground=$('<div id="'+this.svgId+'" style=" position: absolute; top:0; left:0; width:100%; z-index:0"></div>');
        this.$mainNode=$('<div class="YH-MM-box-mainNode " id="YH-MM-node_'+this.data.Id+'"><a href="'+(this.data.url || 'javascript:;')+'">'+this.data.Name+'</a></div>');
        this.$box.addClass('YH-MM-box').append(this.$svgBackground).append(this.$leftBranch).append(this.$rightBranch).append(this.$mainNode);

        $.each(this.data.SubNodes,function(extprop){
            var isAddToLeft=that.$leftBranch.height()<=that.$rightBranch.height();
            if(isAddToLeft){
                that.$leftBranch.append(createNode(this,isAddToLeft,opts.extProp?opts.extProp:[]));
            }else{
                that.$rightBranch.append(createNode(this,isAddToLeft,opts.extProp?opts.extProp:[]));
            }
        });
        this.height=this.$leftBranch.height()>this.$rightBranch.height()?this.$leftBranch.height():this.$rightBranch.height();
        this.$box.height(this.height)
        var mTop=(this.$box.height()-this.$mainNode.height())*0.5;
        var mLeft=(this.$box.width()-this.$mainNode.width())*0.5;
        this.$mainNode.css({top:mTop,left:mLeft});
        this.$svgBackground.height(this.$box.height());

        //划出层级间的连线
        drawLine.call(this)
    }
    $.YH.mindMap.defaults={selector:'#YH-MM-J-box',data:{},strokeColor:'#73a1bf',strokeWidth:0.7}
    function createNode(node,isAddToLeft,extProps){
        var html='',lv=1;
        function addNode(node,extProps){
            if(node.Name !== undefined){
                var dtLeft='',dtRight='';
                if(isAddToLeft){
                    dtLeft ='<dt><div id="'+(node.Id ? "YH-MM-node_"+node.Id : '')+'" class="YH-MM-node-con YH-MM-lv'+(lv++)+' '+node.Class+'"';
                    for(var i=0;i<extProps.length;i++){
                        dtLeft += extProps[i]+'="' + node[extProps[i]] + '" ';
                    }
                    dtLeft += '><h3><a href="'+(node.url || 'javascript:void(0);')+'">'+node.Name+'</a></h3><h4>'+(node.subtitle || '')+'</h4><i class="'+(node.Flag || '')+'"></i></div></dt>';
                }else{
                    dtRight='<dt><div id="'+(node.Id ? "YH-MM-node_"+node.Id : '')+'" class="YH-MM-node-con YH-MM-lv'+(lv++)+' '+node.Class+'"';
                    for(var i=0;i<extProps.length;i++){
                        dtRight += extProps[i]+'="' + node[extProps[i]] + '" ';
                    }
                    dtRight += '><h3><a href="'+(node.url || 'javascript:void(0);')+'">'+node.Name+'</a></h3><h4>'+(node.subtitle || '')+'</h4><i class="'+(node.Flag || '')+'"></i></div></dt>';
                }
                html+='<dl class="YH-MM-node">'+dtRight+'<dd class="YH-MM-node-children">';
                if(node.SubNodes){
                    for(var i in node.SubNodes){
                        addNode(node.SubNodes[i],extProps);
                    }
                }
                html+='</dd>'+dtLeft+'</dl>';
                lv--;
            }
        }

        addNode(node,extProps);
        return html;
    }
    function drawLine(){
        var that=this;
        var r = Raphael(this.svgId, '100%', '100%');
        function newCurve(x,y,x3,y3){
            var x1=x+(x3-x)*0.5;
            var y1=y+(y3-y)*0.1;
            var x2=x+(x3-x)*0.6;
            var y2=y+(y3-y)*0.9;
            r.path('M'+x+' '+y+'C'+x1+' '+y1+' '+x2+' '+y2+' '+x3+' '+y3).attr({stroke: that.strokeColor,'stroke-width':that.strokeWidth});
        }
        function newCurve1(x,y,x3,y3){
            var x1=x+(x3-x)*0.5;
            var y1=y+(y3-y)*0.1;
            var x2=x+(x3-x)*0.9;
            var y2=y+(y3-y)*0.5;
            r.path('M'+x+' '+y+'C'+x1+' '+y1+' '+x2+' '+y2+' '+x3+' '+y3).attr({stroke:that.strokeColor,'stroke-width':that.strokeWidth});
        }

        this.$leftBranch.find('.YH-MM-node').each(function() {
            $(this).find('.YH-MM-node-con').each(function() {
                if(jQuery.support.leadingWhitespace){
                    var tOffset=1;
                    var lOffset=0;
                }else{
                    var tOffset=-1;
                    var lOffset=-1;
                }

                if($(this).closest('.YH-MM-node-children').length>0){
                    var $p=$(this).closest('.YH-MM-node-children').siblings('dt').children('.YH-MM-node-con');
                    var firstLv=$p.hasClass('YH-MM-lv1')?0.5:1;
                    var pTop=$p.position().top+$p.height()*firstLv+tOffset;
                    var pTLeft=$p.position().left+lOffset;
                    var sTop=$(this).position().top+$(this).height()+tOffset;
                    var sLeft=$(this).position().left+$(this).width()+lOffset;
                    newCurve(sLeft,sTop,pTLeft,pTop)
                }
            });
        });
        this.$rightBranch.find('.YH-MM-node').each(function() {
            var offLeft=that.$rightBranch.position().left;
            $(this).find('.YH-MM-node-con').each(function() {
                if(jQuery.support.leadingWhitespace){
                    var tOffset=1;
                    var lOffset=0;
                }else{
                    var tOffset=-1;
                    var lOffset=-1;
                }

                if($(this).closest('.YH-MM-node-children').length>0){
                    var $p=$(this).closest('.YH-MM-node-children').siblings('dt').children('.YH-MM-node-con');
                    var firstLv=$p.hasClass('YH-MM-lv1')?0.5:1;
                    var pTop=$p.position().top+$p.height()*firstLv+tOffset;
                    var pTLeft=$p.position().left+$p.width()+offLeft+lOffset;
                    var sTop=$(this).position().top+$(this).height()+tOffset;
                    var sLeft=$(this).position().left+offLeft+lOffset;

                    newCurve(sLeft,sTop,pTLeft,pTop)
                }
            });
        });

        this.$leftBranch.children('.YH-MM-node').each(function() {


            var $sub=$(this).children('dt').children('.YH-MM-node-con');

            var mTop=that.$mainNode.position().top+that.$mainNode.height()*0.5;
            var mTLeft=that.$mainNode.position().left+that.$mainNode.width()*0.5;
            var subTop=$sub.position().top+$sub.height()*0.5;
            var subLeft=$sub.position().left+$sub.width();

            newCurve1(subLeft,subTop,mTLeft,mTop);

        });
        this.$rightBranch.children('.YH-MM-node').each(function() {
            var offLeft=that.$rightBranch.position().left;

            var $sub=$(this).children('dt').children('.YH-MM-node-con');

            var mTop=that.$mainNode.position().top+that.$mainNode.height()*0.5;
            var mTLeft=that.$mainNode.position().left+that.$mainNode.width()*0.5;
            var subTop=$sub.position().top+$sub.height()*0.5;
            var subLeft=$sub.position().left+offLeft;

            newCurve1(subLeft,subTop,mTLeft,mTop);
        });

    }

})(jQuery,Raphael,window)


/*$('#YH-MM-J-box').delegate('.YH-MM-node-con','click',function(){
    if($(this).attr('id')=='') return false;
    var $cObj=$(this),offsetLeft,cls;
    if($cObj.offset().left>$(window).width()/2){
        offsetLeft=$cObj.offset().left-500;
        cls="P-J-mindMapNodeInfo_L";
    }else{
        offsetLeft=$cObj.offset().left+80;
        cls="P-J-mindMapNodeInfo_R";
    }
    var offsetTop=$cObj.offset().top-80;
    $('#P-J-mindMapNodeInfo').attr('class',cls).show().css({top:offsetTop,left:offsetLeft}).find('.mapNodeInfo_'+$(this).attr('id').replace('YH-MM-node_','')).show().siblings('.mapNodeInfo').hide();



    setTimeout("$('body').one('click',function(){$('#P-J-mindMapNodeInfo').hide()})",10)


    return false;
})
*/