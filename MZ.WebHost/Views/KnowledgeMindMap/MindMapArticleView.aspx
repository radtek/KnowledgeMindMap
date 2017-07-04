<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/EMM.Master" Inherits="Yinhe.ProcessingCenter.ViewPageBase" %>

<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<%@ Import Namespace="MZ.BusinessLogicLayer" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="HeadContent" runat="server">
    <% Html.RenderPartial("HeadContent"); %>
     <% Html.RenderPartial("FileServiceHeadContent"); %>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <%
       var articleId = PageReq.GetParam("articleId");//文章Id
       var article = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
       if (article != null)
       {
           var relLabelIds = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.EQ("articleId", articleId)).Select(c => c.Text("labelId")).ToList();
           MindMapBll mmp = MindMapBll._();
           var relLabelList = mmp.FindMindMapLabelCollectionByLabIds(relLabelIds);
           var fileOp = new Yinhe.ProcessingCenter.Document.FileOperationHelper();
           var fileList = fileOp.FindFileList("MindMapArticle", articleId.ToString());
           var commentCount = mmp.GetArticleCommentCount(articleId);
           var commentUrl = mmp.GetArticleCommentUrl(articleId);
           var viewCount = article.Text("viewCount");
           
           var hasFaorivated = mmp.HasUserFaoriated(this.CurrentUserId.ToString(), articleId);
           var hasUserPrised = mmp.HasUserPrised(this.CurrentUserId.ToString(), articleId);
           var recommendArticleList = mmp.SearchArticleRecommend(articleId, 10);//获取推荐的文章
           #region  查看日志
           var viewDoc = new BsonDocument();
           viewDoc.Add("articleId", articleId);
           viewDoc.Add("userId", dataOp.GetCurrentUserId());
           mmp.LogOperation(viewDoc, MindMapOperateType.ViewArticle);
        #endregion
  %>
    <div class="p-content mt20">
        <div class="p-pageLeft" style="width: 880px">
            <h2 class="tc mb20">
                <%=article.Text("name")%><font class="f12 fn">（<%=article.DateFormat("createDate", "yyyy-MM-dd")%>）</font>
            </h2>
            <div class="fr f14 unl p-transpart" style="margin-top: -40px;">
                <a href="/KnowledgeMindMap/MindMapArticleNow?articleId=<%=articleId %>"><i class="icon-edit mr2" style="font-size: 16px;"></i>进入编辑</a>
            </div>
            <div>
                <i class="p-icon_user mr5 ml10"></i><a href="/KnowledgeMindMap/PersonalCenter?userId=<%=article.Text("createUserId") %>"><%=article.CreateUserName()%></a><span class="pl10" style="border-right: 1px solid #ddd;"></span>
                <i class="p-icon_browse mr5 ml10"></i>阅读量：<%=viewCount%><span class="pl10" style="border-right: 1px solid #ddd;"></span>
                <i class="p-icon_comment mr5 ml10"></i>评论：<%=commentCount%><span class="pl10" style="border-right: 1px solid #ddd;"></span>
                <a href="javascript:;" onclick="UpdateMindMapArticlePrise(this)"><%if (hasUserPrised)
                    { %><i class="icon-thumbs-up mr5 ml10 yh-f_red" style="font-size: 14px"></i><span>(<%=article.Text("priseCount")%>)</span><%}
                    else
                    { %>
                    <i class="icon-thumbs-o-up mr5 ml10 gray" style="font-size: 14px"></i><span class="gray">(<%=article.Text("priseCount")%>)</span>
                    <%} %></a>
                <span class="pl10" style="border-right: 1px solid #ddd;"></span>
                <a href="javascript:;" onclick="UpdateMindMapArticleFaoriate(this)"><%if (hasFaorivated)
                { %><i class="icon-star mr5 ml10 yh-f_red" style="font-size: 14px"></i><span>(<%=article.Text("favoriateCount")%>)</span><%}
                else
                { %>
                <i class="icon-star-o mr5 ml10 gray" style="font-size: 14px"></i><span class="gray">(<%=article.Text("favoriateCount")%>)</span>
                <%} %></a>
            </div>
            <div class="p-labelList">
               <i class="p-icon_label mr5 ml10"></i>标签：<font class="yh-f_red f14">
                <%var labelCount=1;
                    foreach (var label in relLabelList)
                    {%>
                    <span labelId="<%=label.Text("labelId") %>" class="chip truncate base-tag" data-tag="<%=label.Text("name")%>">
                        <a href='/KnowledgeMindMap/MindMapLabelDetail/?labelId=<%=label.Text("labelId") %>'><%=label.Text("name")%></a><i labelId="<%=label.Text("labelId") %>" ></i> 
                        <%if (labelCount++ < relLabelList.Count())
                          { %>
                          ,
                        <%} %>
                    </span>
                <%} %>
                </font>
            </div>
            <%if(fileList.Count>0) {%>
            <div class="p-FiletBannerL" id="p-j-FileBanner" style="z-index:8888">
                <i class="icon-arrows p-icon_arrows p-transpart" title="小伙伴们，可自由拖动导航位置哦！"></i>
                <ul class="w200">
                <li class="w200"><span class="Sline"></span><i class="circle">●</i><font class="BNum">1</font>
                    <a onclick="showContent(this)" class="p5">正文</a>
                </li>

                <%
                    var index = 2;
                    foreach (var file in fileList)
                    {
                        var imgUrl = file.String("thumbPicPath").Replace("_m.", "_um.");
                        var relModel =dataOp.FindOneByQuery("FileRelation",Query.EQ("fileId", file.String("fileId"))) ;
                        var fileRelId = relModel != null ? relModel.Int("fileRelId") : 0;
                %>
                <li class="w200"><span class="Sline"></span><i class="circle">●</i><font class="BNum"><%=index++ %></font>
                    <a onclick="onlineShowFile('<%=file.String("fileId") %>',this)" class="p5"><%=file.String("name")%></a>
                </li>
                <%} %>
                </ul>
            </div>
            <%} %>
            <%--<div id="p-j-OnlineFileList" class="p-contextualMap mt10" style="height: 567px; overflow:auto;">
                    
            </div>--%>
            <div class="p-j-articleCon pr">
                <div id="p-j-ContentDiv" class="mt15 p10" style="max-height: 567px; min-height:300px; overflow:auto;">
                  <%=Server.UrlDecode(article.Text("content"))%>     
                </div>
                <%if (fileList.Count() > 0)
                  {%>
                <div id="p-j-OnlineFileDiv" class="p-contextualMap" style="height: 567px; overflow:auto;">
                </div>
                <%} %>
                <i class="p-j-toggleFullPage icon-fullPage" fullpage="0" title="全屏" style="position:absolute;z-index:10000;top:10px;right:10px;"></i>
            </div>
            <div class="mt30">
                <div class="p-title_1">
                    评论(<%=commentCount%>)</div>
                <div class="fr yh-f_blue" style="margin-top: -22px"><%--<a class="yh-f_blue f14" href="javascript:;"><i class="p-icon_comment_blue mr5"></i>加入评论</a>--%></div>
                <div class="p10" id="resultCommentDiv">
                    <!--评论内容部分载入评论-->
                </div>
            </div>
        </div>
        <div class="p-pageRight" style="width: 250px">
            <div class="p-column mt30">
                <div class="title mb10">
                    <i class="p-tablelist mr5"></i>相关推荐</div>
                <ul class="p-searcList">
                <%foreach (var recommendArticle in recommendArticleList.Where(c=>c.Text("articleId")!=articleId))
                    {
                        %>
                    <li >
                        <div class="p-fileTit ellipsis w250">
                            <i class="legend">W</i><a href="/KnowledgeMindMap/MindMapArticleView?articleId=<%=recommendArticle.Text("articleId") %>" title="<%=recommendArticle.Text("name")%>"><%=recommendArticle.Text("name")%></a></div>
                        <div class="p-filemark clearfix">
                                <%--<%=recommendArticle.DateFormat("createDate", "yyyy-MM-dd HH:mm:ss")%>--%>
                               <%=article.DateFormat("createDate", "yyyy-MM-dd")%>
                            <div class="fr">
                                <i class="icon-file-text-o mr5"></i>阅读量:<%=recommendArticle.Int("viewCount")%><span class="pl5" style="border-right: 1px solid #ddd;"></span>
                                <i class="icon-comments iconx mr5 ml5"></i>评论:<%=recommendArticle.Int("replyCount")%>
                            </div>
                        </div>
                    </li>
                    <%} %>
                </ul>
            </div>
        </div>
    </div>
    <div class="h60 clear"></div><%--div,h60勿删，防止foot脚注遮挡--%>
    <script>
        $(document).ready(function () {
            $('#p-j-OnlineFileList').find("li:first").find("a").click();
        });

        $("#resultCommentDiv").load('<%=commentUrl%>');
        $('#p-j-FileBanner').draggable();
        $('#p-j-FileBanner').find('a:first').click();
        function showContent(obj) {
            $("#p-j-ContentDiv").show();
            $("#p-j-OnlineFileDiv").hide();
            $(obj).addClass('select').closest('li').siblings().find('.select').removeClass('select');
        }

        function onlineShowFile(fileId, obj) {
            $(obj).addClass('select').closest('li').siblings().find('.select').removeClass('select');
            $("#p-j-ContentDiv").hide();
            $("#p-j-OnlineFileDiv").show();
            $("#p-j-OnlineFileDiv").load("/KnowledgeMindMap/MindMapArticleFilePart/?fileId=" + fileId + "&r=" + Math.random());
        }


       //点赞 /KnowledgeMindMap/UpdateMindMapArticlePrise  {articleId}
       //收藏 /KnowledgeMindMap/UpdateMindMapArticleFaoriate {articleId}

       ///点赞
        function UpdateMindMapArticlePrise(obj) {
            var $obj = $(obj);

            $.ajax({
                url: "/KnowledgeMindMap/UpdateMindMapArticlePrise",
                type: 'post',
                data: {
                    articleId: "<%=articleId %>"
                },
                dataType: 'json',
                error: function () {
                    MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试！", 5);
                },
                success: function (data) {
                    if (data.Success == false) {
                        MZ.msgbox.show(data.Message, 5);
                    }
                    else {
                        MZ.msgbox.show("操作成功！", 4, 1000);
                        if ($obj.children('i').hasClass('gray')) { //点赞
                            $obj.find('span').text("(" + (+$obj.find('span').text().replace(/[^1-9]{1}[^0-9]*/g, "") + 1) + ")");
                        } else {
                            $obj.find('span').text("(" + ($obj.find('span').text().replace(/[^1-9]{1}[^0-9]*/g, "") - 1) + ")");
                        }
                        $obj.children('span').toggleClass('gray');
                        $obj.children('i').toggleClass('gray yh-f_red');
                    }
                }
            });
        }
        ///收藏
        function UpdateMindMapArticleFaoriate(obj) {
            var $obj = $(obj);
            $.ajax({
                url: "/KnowledgeMindMap/UpdateMindMapArticleFaoriate",
                type: 'post',
                data: {
                    articleId: "<%=articleId %>"
                },
                dataType: 'json',
                error: function () {
                    MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试！", 5);
                },
                success: function (data) {
                    if (data.Success == false) {
                        MZ.msgbox.show(data.Message, 5);
                    }
                    else {
                        MZ.msgbox.show("操作成功！", 4);
                        if ($obj.children('i').hasClass('gray')) { //点赞
                            $obj.find('span').text("(" + (+$obj.find('span').text().replace(/[^1-9]{1}[^0-9]*/g, "") + 1) + ")");
                        } else {
                            $obj.find('span').text("(" + ($obj.find('span').text().replace(/[^1-9]{1}[^0-9]*/g, "") - 1) + ")");
                        }
                        $obj.children('span').toggleClass('gray');
                        $obj.children('i').toggleClass('gray yh-f_red');
                    }
                }
            });
        }

       //全屏功能
        $('.p-j-toggleFullPage').on('click', function () {
            var self = $(this);
            var articleCon = $('.p-j-articleCon'), conDiv = $('#p-j-ContentDiv'), onlineDiv = $('#p-j-OnlineFileDiv');

            if (self.attr('fullpage') == 0) {
                self.attr('fullpage', 1);
                self.prop('title', "退出全屏");
                self.removeClass('icon-fullPage').addClass('icon-fullPage_exit');
                self.css({"position":"fixed","top":"10px","right":"10px"})
            } else {
                self.attr('fullpage', 0);
                self.prop('title', "全屏");
                self.removeClass('icon-fullPage_exit').addClass('icon-fullPage');
                self.css({ "position": "absolute", "top": "10px", "right": "10px" })
            }

            if (conDiv.is(":visible")) {
                conDiv.toggleClass('p-j-fullPage');
            } else if (onlineDiv.is(":visible")) {
                onlineDiv.toggleClass('p-j-fullPage');
                var frameCon = onlineDiv.find('iframe');
                if (onlineDiv.hasClass('p-j-fullPage')) {//全屏
                    if (!frameCon.attr("conheight")) { //保存原来的高度
                        frameCon.attr("conheight", frameCon.css('height'))
                    }
                    frameCon.css("height", document.body.offsetHeight - 20 + "px");
                } else {
                    frameCon.css("height", frameCon.attr("conheight"));
                }
            }
        });

    </script>
    <%}else{ %>
        数据不存在
    <%} %>
 
</asp:Content>
