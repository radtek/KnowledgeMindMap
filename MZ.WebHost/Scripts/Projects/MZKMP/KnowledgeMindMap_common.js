/**
 * 此文件为知识库公用脚本文件
 * JSON格式参照：
 * {
 *  "node":[
 *      {
 *          "id":"id",
 *           "name":"石狮",
 *          "type":"2"
 *      }
 *  ],"links":[
 *      {
 *          "source":"id1", //对应node的id
 *          "target":"id2",
 *          "relation":"关系"
 *      },
 * ]}
 */
;(function($){
    //"use strict";
    $.fn.showMindMap = function(options){
        var opts = $.extend({}, {
            data:null,//数据来源
            mindMapId:null,// 关系图 所属
            size:[780,600], //画布大小
            zoom:[0.5,2], //缩放范围
            isEdit:false, //是否为编辑模式
            linkLev1Distance:"50",//一级连接线长度
            linkDistance:"100",//连接线长度
            clickNode:function(event,data){}, //单击
            contextmenuNode:function(event,data){}, //右击
            callback:function(){}
        }, options);
        //容器及全局的数据
        var svgCon = $(this),
            initData = opts.data,
            isLinking = false, //是否在操作关联关系
            handleData; //正在操作的数据 （用完释放掉其中保存的数据）
        /**
         * 状态颜色值
         * @type {{disableColor: string, activeNodeColor: string}}
         */
        var stateColors = {
            disableColor:"#ddd",
            activeNodeColor:""
        }
        /**
         * 文字长度与圆对应半径
         * @type {{2: string, 3: string, 4: string, 5: string}}
         */
        var radiusStaff = {
            "1":"12","2":"16",
            "3":"20","4":"28",
            "5":"34"
        }
        /**
         * 标签名分割规则 超过16个中文字符长度的以 ... 结尾。
         * @type {{字符长度: {分割组长度: [*], r: 圆半径}}}
         */
        var strRule = {
            "3":{'group':[3],"r":"25"},"4":{'group':[4],"r":'28'},"5":{'group':[3,2],"r":"25"},
            "6":{'group':[3,3],"r":"25"},"7":{'group':[2,3,2],"r":"25"},
            "8":{'group':[4,4],"r":"28"},"9":{'group':[3,3,3],"r":"28"},
            "10":{'group':[3,4,3],"r":"28"},"11":{'group':[4,4,3],"r":"32"},
            "12":{'group':[4,4,4],"r":"32"},"13":{'group':[4,5,4],"r":"35"},
            "14":{'group':[5,5,4],"r":"38"},"15":{'group':[5,5,5],"r":"38"},
            "16":{'group':[5,6,5],"r":"40"}
        }
        var colorStaff = ["#4abbd9","#92d14f","#ffba00","#fd7e69","#c4a4ff","#62a7e8","#fc9d40","#a9bafd","#0d9f96","#fd824c"];
        var colorStaff20 = d3.scale.category20();
        /**
         * 取得选择器
         * @returns {string}
         */
        var _getSelector = function(){
            var selector = "";
            if(svgCon.attr('id')){
                selector = "#"+$.trim(svgCon.attr('id'));
            }else{
                if(!svgCon.attr('class')) return false;
                var classNames = svgCon.attr('class').split(' ');
                for(var i=0;i<classNames.length;i++){
                    selector += "." + $.trim(classNames[i])+" ";
                }
            }
            return selector;
        }
        /**
         * 取得节点信息
         * @param node
         * @returns {{node: Array, tempNodesIndex: Array}}
         */
        var _getNodeInfo = function(node){
            var Nodes = [],tempNodesIndex = [];
            if(!node) return {"node":Nodes,"tempNodesIndex":tempNodesIndex};
            for(var j=0;j<node.length;j++){
                Nodes[Nodes.length]={
                    "id":node[j].id,
                    "name":node[j].name,
                    "pid":node[j].pid,
                    "type":(node[j].type || ""),
                    "len":node[j].len || 10
                };
                tempNodesIndex[tempNodesIndex.length] = node[j].id;
            }
            return {"node":Nodes,"tempNodesIndex":tempNodesIndex}
        }
        /**
         * 重新映射节点关系
         * @param tempNodesIndex
         * @param link
         * @returns {Array}
         */
        var _getLinks = function(tempNodesIndex,link){
            var links = [];
            for(var i=0; i<initData.links.length; i++){
                links.push({
                    "source":tempNodesIndex.indexOf(link[i].source),
                    "target":tempNodesIndex.indexOf(link[i].target),
                    "relation":(link[i].relation || ""),
                    "level":link[i].level?link[i].level:2
                });
            }
            return links;
        }

        var zoom = d3.behavior.zoom()
            .scaleExtent(opts.zoom)
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin(function(d) { return d; }) //设置拖动行为的原点
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);
        /**
         * 生成力导向图必要数据
         */
        var force = d3.layout.force()
            .size(opts.size)//指定作用域范围
            .linkDistance(function(d){
                return setLinkDistance(d);
            }) //指定连线长度
            .charge([-800]); //作用力

        var svg = d3.select(_getSelector())
            .append("svg")
            .attr("width", opts.size[0])
            .attr("height", opts.size[1])
            .append("g").call(zoom)
            .on("dblclick.zoom",null)//禁止双击缩放
            .on('click',function(){ //移除菜单 及选中的效果
                var event = d3.event,target = event.target;
                $(target).closest('g.menu').length === 0 && d3.selectAll(".menu").remove();
                if($(target).closest('g.menu').length === 0){ //$(target).closest('.link-disable').length === 0 &&
                    resetState();
                }
            });

        var rect = svg.append("rect") //整体的容器
            .attr("width", 1200)
            .attr("height", opts.size[1])
            .style("fill", "none")
            .style("cursor","move")
            .style("pointer-events", "all");

        var container = svg.append("g"); //控制缩放的容器

        /**
         * 获取整理数据
         */
        var NodeInfo = _getNodeInfo(initData.node),
            Links = _getLinks(NodeInfo.tempNodesIndex,initData.links);
        var color = d3.scale.category10();
        var lineColor = "#ccc";
        var rootStyle = {
            fill:"#FFFFFF",
            radius:15,
            strokeWidth:2,
            stroke:"#ccc",
            fontColor:"#000"
        }
        //开始作用
        force.nodes(NodeInfo.node)
            .links(Links).start();

        //添加连线
        var _lines = container.append('g')
            .attr("class", "links")
            .selectAll('.line')
            .data(Links)
            .enter().append('line')
            .attr('class','line')
            .style('stroke-width',2)
            .style('stroke',function(d){
                return d.level==1?"#46b1dd":lineColor;//colorStaff[0] 设置一级线的颜色
            })
            .style('stroke-opacity',function(d){
                return d.level==1?1:"";
            });

        //添加节点
        var _nodes = container.append('g')
            .attr("class", "nodes")
            .selectAll('.node')
            .data(NodeInfo.node)
            .enter().append('g')
            .attr('class',function(d){
                return (Math.ceil(d.len/2)||5)>16?"node p-j-showMore":'node';
            })
            .style('cursor',"pointer")
            .call(drag);

        var colorCount = 0;
        var rootData;
        for(var c=0;c<NodeInfo.node.length;c++){
            if(NodeInfo.node[c].type == 1){
                rootData = NodeInfo.node[c];
                break;
            }
        }

        _nodes.append('circle')
            .attr("r", function(d) { //根节点权重设置为5 最高权重不超过5
                return setRadius(d);
            })
            .attr('radius',function(d){
                return setRadius(d);
            })
            .style('stroke',function(d){
                return d.pid==rootData.id?"#555":"";
            })
            .style('stroke-width',function(d){
                return d.pid==rootData.id?"1.5px":"";
            })
            .style("fill", function(d,i) { //设置圈的颜色
                var colorIndex = 0;
                if(d.type != 1 && d.pid == rootData.id ){
                    colorIndex = d.colorIndex;
                }
                if(d.type != 1 && d.pid != rootData.id ){
                    for(var k=0;k<NodeInfo.node.length;k++){
                        (NodeInfo.node[k].id == d.pid) && (colorIndex = NodeInfo.node[k].colorIndex || NodeInfo.node[k].index);
                    }
                }
                var color = colorIndex>9?colorStaff20(colorIndex):colorStaff[colorIndex];
                return color;
            });
        //添加文字
        _nodes.filter(function(d,i){ //筛选右键菜单
                if(d.name.length<=4){
                    return d;
                }
            })
            .append('text')
            .attr('class','text')
            .attr('text-anchor',"middle")
            .attr('dy',function(d){ return "0.5ex"; })
            .attr('fill',function(d){
                return d.type==1?"#000":"#FFF";
            })
            .text(function(d){ return d.name; });
        //矩形框添加文字
        _nodes.filter(function(d){
            var length = d.name.length;
            if(length>4){
                var strData = cutStr(d);
                var nodeData = d;
                var strLen = strData.length;
                var _nodeData = d;
                d3.select(this)
                    .append('g')
                    .selectAll('.pText')
                    .data(strData)
                    .enter()
                    .append("text")
                    .attr("text-anchor","middle")
                    .attr('y',function(d,i){
                        var site;
                        if(strLen ==1){
                            site = 5;
                        }else if(strLen==2){
                            site = i==0?0:15
                        }else if(strLen == 3){
                            site = i==0?-10:i==1?5:20
                        }else if(strLen == 4){
                            site = i==0?-10:i==1?5:i==2?20:30
                        }
                        return site;
                    })
                    .attr('fill',function(d){
                        return _nodeData.type==1?"#000":"#FFF";
                    })
                    .text(function(d){
                        return d;
                    });
            }
        });

        var linkedByIndex = {};
        Links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        _nodes.on("mouseenter",function(d){
            var event = d3.event
            _nodes.classed("node-active", function(o) {
                var thisOpacity = isConnected(d, o) ? true : false;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            _lines.classed("link-active", function(o) {
                return o.source === d || o.target === d ? true : false;
            });
            d3.select(this).classed("node-active", true);
            d3.select(this).select("circle")
                .transition().duration(750)
                .attr("r", $(this).find('circle').attr('radius')*1.2);

            if($(this).attr('class').indexOf('p-j-showMore')>-1 && !$('.menu').is(':visible')){
                if($('.p-j-textShow').is(':visible')){
                    $('.p-j-textShow').css({
                        "left":event.pageX+'px',
                        "top":event.pageY+'px'
                    });
                }else{
                    var htmlDom = "";
                    htmlDom = '<div class="p-j-textShow p-infoTextBox pa p-hoverShow-itm" style="left:'+event.pageX+'px; top: '+event.pageY+'px; z-index:2000;max-width:150px;">'
                        +'<div class="p-infoTextBox_con">'
                        +d.name
                        +'</div></div>';
                    $('body').append($(htmlDom));
                }
            }
        }).on("mousemove",function(){
            var event = d3.event
            if($('.p-j-textShow').is(':visible')){
                $('.p-j-textShow').css({
                    "left":event.pageX+10+'px',
                    "top":event.pageY+10+'px'
                });
            }
        }).on("mouseleave", function(d){
            $('.p-j-textShow').hide();
            _nodes.classed("node-active", false);
            _lines.classed("link-active", false);

            d3.select(this).select("circle")
                .transition().duration(750)
                .attr("r", $(this).find('circle').attr('radius'));
        });
        /**
         * 节点操作事件
         */
        _nodes.on('contextmenu',function(d){
            $('.p-j-textShow').hide();
            var event = d3.event,
                target = event.target,   //  获取事件发生源DOM
                data = d3.select(target).datum(); //  获取事件发生源的数据
            event.preventDefault(); //阻止事件冒泡
            opts.isEdit && getMenu.call(this,event,d,target);
            //opts.contextmenuNode.call(svgCon,event,d);
        })
        .on('dblclick',function(d){
            var event = d3.event;
            if (d3.event.defaultPrevented) return; //防止拖拽时 触发click事件
            isLinking?handleLink.call(this,d): //执行关联操作
                opts.clickNode.call(svgCon,event,d);  //执行跳转操作
        });

        //更新图形的每一帧
        force.on('tick',function(){
            //更新连线坐标
            _lines.attr("x1",function(d){ return d.source.x; })
                .attr("y1",function(d){ return d.source.y; })
                .attr("x2",function(d){ return d.target.x; })
                .attr("y2",function(d){ return d.target.y; });

            //更新节点坐标
            _nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        opts.callback.call(svgCon,force);
        /********************************* D3工具方法及交互效果 *********************************/
        /**
         * 缩放
         */
        function zoomed() {
            container.attr("transform",
                "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        /**
         * 拖拽相关函数
         * @param d
         */
        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
            //d.fixed = true;
            force.start();
        }
        function dragged(d) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        }
        function dragended(d) {
            d3.select(this).classed("dragging", false);
        }

        /**
         * 是否是相邻的节点或线
         * @param a
         * @param b
         * @returns {*}
         */
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
        }

        /**
         * 获取矩形框的宽高
         * @param d
         */
        function getLength(d){
            return 10;
            var length = d.name.length,lineHeight = 16,groupNum = 5;
            //4个字 宽54 高 20  3个字高20 宽40  20为上下边距各加2
            if(length === 6){
                return {"width":44,"height":lineHeight*2+4};
            }else if(length<9){
                //最多两行
                return {"width":58,"height":lineHeight*2+4};
            }else if(length === 9){//三行
                return {"width":44,"height":lineHeight*3+4}
            }else if(length>9&& length<=20){//超过10个字的
                var rows = Math.ceil(length/groupNum);
                return {"width":68,"height":rows*lineHeight+4};
            }else if(length>20){
                var rows = Math.ceil(length/8);
                return {"width":104,"height":rows*lineHeight+4};
            }
        }

        /**
         * 按字数要求切割字符串成数组
         * @param str 原始字符串
         * @param num 每组字数
         * @returns {Array}
         */
        function cutStr(d){
            var strLen = (d.len/2||5) >16?16:(Math.ceil(d.len/2)||5),strAry = [],eachLen = strRule[strLen];
            if(!eachLen)console.log(d)
            if(eachLen){
                var count = 0,index=0,str = d.name,strItem="",group = eachLen.group;
                for(var i=0;i<str.length;i++){
                    var maxLen = group[index];
                    strItem+=str[i];

                    if(isChinese(str[i])){
                        count +=1;
                    }else{
                        count += chkHalf(str[i])?1:0.5;
                    }
                    if((count+0.4)>=maxLen || i===str.length-1){
                        if(maxLen==undefined) break;
                        strAry[strAry.length]=strItem;
                        count=0;index++;
                        strItem=""
                    }
                }
            }
            if((Math.ceil(d.len/2)||5)>16) strAry[strAry.length]="..."
            return strAry;
        }

        /**
         * 判断是否为中文
         * @param str
         * @returns {boolean}
         */
        function isChinese(str){
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            return reg.test(str);
        }

        /**
         * 判断是否为全角或半角字符
         * @param str
         * @returns {boolean}
         */
        function chkHalf(str){
            for(var i=0;i<str.length;i++){
                strCode=str.charCodeAt(i);
                if((strCode>65248)||(strCode==12288)){
                    return true;
                }else{
                    return false;
                }
            }
        }
        /**
         * 设置半径
         * @param d
         */
        function setRadius(d){
            var w = d.type == 1 ? 5 : d.weight>5?5:d.weight;
            var len = Math.ceil(d.len/2) || 5;
            w = len<=4?
                radiusStaff[len]:5* 2+ 18;
            if(len>4){
                len = len>16?16:len;
                w = strRule[len].r
            }
            //设置二级节点的顺序
            if(d.pid == rootData.id){
                colorCount += 1;
                d.colorIndex = colorCount;
            }
            return w;
        }

        /**
         * 设置关系连线长度
         * @param d
         * @returns {*}
         */
        function setLinkDistance(d){
            return d.level==1?opts.linkLev1Distance:opts.linkDistance;
        }

        /************************ 业务逻辑 ********************************/
        //生成右键菜单
        function getMenu(e,d){
            var sourceData = d,self = this;
            d3.selectAll('.menu').remove();

            var target = d3.select(e.target.parentNode),
                menuAry = [
                    {
                        "title":"创建关联节点",
                        "sourceId":d.id,
                        "className":"kmm-j-addReleNode",
                        "clickEvent":function () {
                            var html = '<div class="p-j-con mt10" style="position: relative;"><input type="text" class="p-j-keyAdd w400" placeholder="添加新节点名称，用逗号或空格隔开，回车确认" /><div class="p-j-tagList"></div></div>';
                            $.YH.box({
                                target:$(html),
                                title:"创建关联节点",
                                width:440,
                                height:400,
                                open:function(){
                                    var box = $(this);
                                    $('.p-j-keyAdd').showSearchList({ target: $(".p-j-tagList"),type:"box",limitList:7 });
                                },
                                ok:function(){
                                    var newNodeName = $(this).find('.p-j-keyAdd').val();
                                    var data = getlabels();
                                    handleNode(sourceData.id,data,"0");//已有节点id  新增节点名称
                                }
                            });
                        }
                    },
                    {
                        "title":"删除末节点",
                        "sourceId":d.id,
                        "className":"kmm-j-delFootNode",
                        "clickEvent":function () {
                            var r=confirm("确定删除当前节点吗,删除后不可恢复！")
                            if (r==true) {
                                for(var i=0;i<Links.length;i++){
                                    if(Links[i].source.id == sourceData.id || Links[i].target.id == sourceData.id){
                                        targetId = Links[i].source.id == sourceData.id?Links[i].target.id:Links[i].source.id;
                                    }
                                }

                                handleNode(sourceData.id,targetId,"1");//已有节点id  新增节点名称
                            }
                        }
                    },
                    {
                        "title":"建立关联关系",
                        "sourceId":d.id,
                        "className":"kmm-j-addRele",
                        "clickEvent":function (d) {
                            var event = d3.event;
                            isLinking = true;
                            handleData = {
                                type:"LINK_ADD",
                                data:sourceData
                            };
                            _nodes.classed("link-disable", function(o) { //为相邻的节点 添加类
                                var thisOpacity = isConnected(sourceData, o) ? true : false;
                                this.setAttribute('fill-opacity', thisOpacity);
                                return thisOpacity;
                            }).classed('link-click',function(o){
                                var thisOpacity = isConnected(sourceData, o) ? true : false;
                                this.setAttribute('fill-opacity', thisOpacity);
                                return !thisOpacity;
                            });

                            d3.select(self).classed("link-active", true)
                                .classed("link-disable", false)
                                .classed('link-click',false);
                        }
                    },
                    {
                        "title":"删除关联关系",
                        "sourceId":d.id,
                        "className":"kmm-j-delRele",
                        "clickEvent":function () {
                            var event = d3.event;
                            isLinking = true;
                            handleData = {
                                type:"LINK_REMOVE",
                                data:sourceData
                            };
                            _nodes.classed("link-disable", function(o) { //为相邻的节点 添加类
                                var thisOpacity = isConnected(sourceData, o) ? true : false;
                                this.setAttribute('fill-opacity', thisOpacity);
                                return !thisOpacity;
                            }).classed('link-click',function(o){
                                var thisOpacity = isConnected(sourceData, o) ? true : false;
                                this.setAttribute('fill-opacity', thisOpacity);
                                return thisOpacity;
                            });
                            d3.select(self).classed("link-active", true)
                                .classed("link-disable", false)
                                .classed('link-click',false);
                        }
                    },
                    {
                        "title":"上传文章",
                        "sourceId":d.id,
                        "className":"kmm-j-uploadFile",
                        "clickEvent":function(){
                            window.location.href = "/KnowledgeMindMap/MindMapArticleNow?mindMapId="+
                                opts.mindMapId+"&labelName="+escape(sourceData.name)+"&labelId="+sourceData.id+"&r="+Math.random();
                        }
                    }
                ];
            var _menu = target.append('g')
                .attr("class", "menu")
                .selectAll('.menu_list')
                .data(menuAry)
                .enter().append("g")
                .filter(function(d,i){ //筛选右键菜单
                    if(sourceData.weight != 1 && $.trim(d.className) !== "kmm-j-delFootNode"){
                        return d;
                    } else if(sourceData.weight == 1){
                        return d;
                    }
                })
                .attr('class','menu_list')
                .on('click',function(d){ //点击菜单
                    d3.event.preventDefault();
                    d3.selectAll('.menu').remove();
                    d.clickEvent.call(this,d);
                });


            _menu.append('rect')
                .attr("width", 90)
                .attr("height", 20)
                .style("fill", "#32394b")
                .style("pointer-events", "all")
                .attr("y",function(d,i){
                    return i * 20 - 15;
                })
                .attr("x",35);

            _menu.append('text')
                .attr('calss','menu_text')
                .attr('text-anchor',"middle")
                .attr('fill',function(d){
                    return "#fff";
                })
                .text(function(d){ return d.title; })
                .attr("y",function(d,i){
                    return i * 20;
                })
                .attr("x",80);
        }
        /**
         * 关联操作
         * @param d
         */
        function handleLink(d){
            var event = d3.event;
            if($(event.target).closest('.link-disable').length > 0 && $(event.target).closest('.link-active').length > 0) return false;

            var url = '/KnowledgeMindMap/UpdateMindMapTrace';
            var postData = {
                "mindMapIds":opts.mindMapId,
                "preLabelId":handleData.data.id,
                "sucLabelId":d.id,
                "type":handleData.type=="LINK_REMOVE"?1:0,
            }

            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                success: function(rs){
                    window.location.reload();
                }
            });
            //ajax 结束后 重置
            resetState("LINK");
        }

        /**
         * 节点操作 （增\删）
         * @param d
         */
        function handleNode(sourceId,dataIfo,type){ //type 为1时 为删除操作
            MZ.msgbox.show("正在加载中...", 6);

            var event = d3.event;

            var url = '/KnowledgeMindMap/UpdateMindMapTrace';
            var postData = {
                "mindMapIds":opts.mindMapId,
                "preLabelId":sourceId,
                "sucLabelId":type==1?dataIfo:dataIfo.labIds,
                "addLabelNames":dataIfo.addLabNames,
                "type":type,
            }

            $.ajax({
                type: 'POST',
                url: url,
                data: postData,
                success: function(rs){
                    MZ.msgbox.hide();
                    window.location.reload();
                }
            });
            //ajax 结束后 重置
            resetState();
        }
        /**
         * 重置因操作新增或修改的参数、样式
         */
        function resetState(type){
            isLinking = false;

            d3.selectAll('.link-active').classed('link-active',false);
            d3.selectAll(".link-disable").classed('link-disable',false);
            d3.selectAll('.link-click').classed('link-click',false);
            handleData = null;
        }

        //获取新增标签及现有标签
        function getlabels() {
            var tags = $('.p-j-tagList').children(),oldTags=[], newTags=[];
            tags.each(function () {
                var cur = $(this);
                if (cur.attr('labelid')) {
                    oldTags[oldTags.length] = cur.attr('labelid');
                } else {
                    newTags[newTags.length] = $.trim(cur.text());
                }
            });
            return {
                labIds: oldTags.join(','),
                addLabNames: newTags.join(',')
            }
        }

    }
})(jQuery);
/**
 * 此方法为 该系统 调用搜索列表的 统一插件
 *
 * 调用参数,方法如:$('#input').showSearchList({'url': 'data.aspx'});
 * url :'url'               请求后台的地址
 * target:obj,              标签存放容器 若无则默认生成
 * limitList:num            限制出现的个数
 * type :'doc'\'box'        调用的地方是否位于弹窗中
 */
;(function($){
    "use strict";
    $.fn.showSearchList = function(options){
        var opts = $.extend({}, {
            url:'/home/GetSingleTableJson',//数据来源
            target:null, //标签存放容器 若无则默认生成
            limitList:10, //限制出现的个数
            type:"doc"
        }, options);
        var target = undefined;
        //标签存放容器获取
        if(!(opts.target instanceof $) && typeof(opts.target) == 'string'){
            target = $(opts.target);
        }else if(opts.target instanceof $ && typeof(opts.target) != 'string'){
            target = opts.target;
        }

        var self = $(this),selfParent = self.parent(),
            content = $('<div class="p-j-searchList p-searchList_bg"></div>'),
            tagCon = target || $('<div class="mt5 h30"></div>'); //存放标签的容器 若没有填写存放容器则生成
        tagCon.appendTo(selfParent);
        $(document).on('keydown',function(event){
            var searchList = $('.p-j-searchList');
            if(searchList.length>0){
                var key = event.keyCode;
                if (key == 38){
                    if(searchList.find('li.active').length == 0){
                        searchList.find('li:first').addClass('active')
                    } else if(searchList.find('li.active').prev().length>0){
                        searchList.find('li.active').removeClass('active').prev().addClass('active');
                    }
                }
                if (key == 40){
                    if(searchList.find('li.active').length == 0){
                        searchList.find('li:first').addClass('active');
                    }else if(searchList.find('li.active').next().length>0){
                        searchList.find('li.active').removeClass('active').next().addClass('active');
                    }
                }
            }
        });
        /**
         * 添加标签
         */
        self.on('blur',function(){
            var keyWord = $.trim(self.val()),
                appendHtml = getHtml(keyWord);

            selfParent.append(
                tagCon.append(appendHtml)
            );
            self.val("");
        });

        self.on('keyup',function(event){
            if(event.keyCode == 37 || event.keyCode == 38 ||event.keyCode == 39 ||event.keyCode == 40 ) return false;
            var keyWord = $.trim(self.val()),appendHtml = "";
            if (event.keyCode == "13") { //执行添加操作
                    if(keyWord == ""){
                        $('.p-j-searchList').find('.active').click();
                    }else{
                        appendHtml = getHtml(keyWord);
                        selfParent.append(
                            tagCon.append(appendHtml)
                        );
                        self.val("");
                    }
            } else {
                $.post(opts.url,
                    {
                        tbName: "MindMapLabelCollection",
                        ps: -1,
                        cu: 1,
                        qu: 'db.MindMapLabelCollection.distinct("_id",{"name":/' + keyWord + '.*/i})'
                    }, function (data) {
                        selfParent.find('.p-j-searchList').remove();
                        if (data.length == 0) return false;
                        appendHtml += "<div class='p-j-searchList p-searchList_bg' style='position:absolute'><ul>";
                        $(data).each(function (i) {
                            if(i>(opts.limitList-1)) return false;
                            if ($.trim(data[i].name) == "") return true; //判断是否为空 若为空 则跳过当前
                            appendHtml += "<li labelId='" + data[i].labelId + "'>" + data[i].name;
                            appendHtml += "</li>";
                        });
                        appendHtml += "</ul></div>";
                        if(opts.type == "box"){
                            var left = "", top = 25;
                        }else{
                            var left = self.offset().left, top = self.offset().top + self.height();
                        }
                        $(appendHtml).css({ top: (top + 9) + "px", left: left+"px" }).appendTo(selfParent);
                    });
            }
        });

        selfParent.on('click','.p-j-searchList li',function(){
            var $this = $(this), tagName = $.trim($this.text());
            if (!checkRepeat(tagName,tagCon)) { //检查是否重复
                var appendHtml = '<span labelid="' + $this.attr('labelId') + '" class="chip truncate base-tag p-element_tag p-hoverShow p-hoverShow_inlineblock" data-tag="' + tagName + '">' + tagName
                    + '<i class="p-icon_del p-hoverShow-itm"></i></span>';
                tagCon.append(appendHtml);
            }
            $this.closest('.p-j-searchList').remove();
            self.val("");
        });

        //回车或失焦后获取标签
        function getHtml(keyWord){
            var keyWordAry = keyWord.split(/[\s,，]/g).unique(),appendHtml = "";
            if (keyWordAry.length > 0) {
                for (var i = 0; i < keyWordAry.length; i++) {
                    if ($.trim(keyWordAry[i]) == "") continue;
                    if (!checkRepeat(keyWordAry[i],tagCon)) {
                        appendHtml += '<span labelid="" class="chip truncate base-tag p-element_tag p-hoverShow p-hoverShow_inlineblock" data-tag="' + keyWordAry[i] + '">' + keyWordAry[i]
                            + '<i class="p-icon_del p-hoverShow-itm"></i></span>';
                    }
                }
                return appendHtml;
            }
        }
        // 添加时判断是否与现有标签重复
        function checkRepeat(tagName,$tags) {
            var tags = tagCon.children(),tagAry = [],flag=false;
            $tags.children().each(function(){
                if($.trim($(this).text()) == $.trim(tagName)){
                    flag = true;
                    return false
                }
            });
            return flag;
        }

        /**
         * 删除标签
         */
        tagCon.on('click','i.p-icon_del',function(){
            $(this).closest('span').remove();
        });
        /**
         * 数组去重
         * @returns {Array}
         */
        Array.prototype.unique = function(){
            var res = [],json = {};
            for(var i = 0; i < this.length; i++){
                if(!json[this[i]]){
                    res[res.length] = this[i];
                    json[this[i]] = 1;
                }
            }
            return res;
        }
        //点击空白处 去掉搜索列表
        $(document).on('click', function (e) {
            var target = $(e.target);
            if (target.closest('.p-j-searchList').length == 0 && target!==self) {
                $('.p-j-searchList').remove();
            }
        });
    }
})(jQuery);
/**
 * 调用参数,方法如:$('#more').more({'url': 'data.php'});
 * url :'url'     请求后台的地址
 * data:{},                自定义参数
 * template:'.single_item' html记录DIV的单条记录模版
 * trigger :'#get_more'    触发加载更多记录的class属性
 * scroll  :'false'        是否支持滚动触发加载
 */
;(function(){
    "use strict";
    $.fn.more = function(options) {
        var opts = $.extend({}, {
            url: '/home/GetSingleTableJson',//数据来源
            target: null, //标签存放容器 若无则默认生成
            limitList: 10, //限制出现的个数
            type: "doc"
        }, options);
    }
})();