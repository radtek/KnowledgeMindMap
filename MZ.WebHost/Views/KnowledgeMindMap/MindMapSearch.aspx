<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/EMM.Master" Inherits="Yinhe.ProcessingCenter.ViewPageBase" %>

<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<%@ Import Namespace="MZ.BusinessLogicLayer" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="HeadContent" runat="server">
 
    <% Html.RenderPartial("HeadContent"); %>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <%
        var keyWord = Server.UrlDecode(PageReq.GetParam("keyWord")).Trim();
        var mMids = PageReq.GetParamList("mindMapId");
        var oldKeyWord = Server.UrlDecode(PageReq.GetParam("oldKeyWord")).Trim();
        //获取匹配的脉络图
        var mindMapList = MindMapBll._().FindMindMapByKeyWord(keyWord);
        var mindMapIdsList = mindMapList.Select(c => c.Text("mindMapId")).ToList();

        if (mMids.Count() > 0)
        {
            mindMapIdsList.AddRange(mMids);
        }
        var mindMapIds = string.Join(",", mindMapIdsList.Distinct().ToList());
        //相关搜索
        var otherKeyWordList = MindMapBll._().SearchKeyWordRecomend(keyWord, 10);
        if (otherKeyWordList.Count <= 1)
        {
            SortByDocument sort = new SortByDocument { { "searchCount", -1 } };//最近的
            var hotWordList = dataOp.FindLimitByQuery("MindMapLabelCollection", Query.NE("searchCount", "0"), sort, 0, 5).Select(c => c.Text("name")).ToList();
            otherKeyWordList.AddRange(hotWordList);
        }
        //关键字涉及的文章
        var relationLabelIds = MindMapBll._().FindMindMapLabelCollectionByKeyWord(keyWord, 10);
        var hitArticleList = MindMapBll._().FindMindMapArticleByLabIds(relationLabelIds.Select(c => c.Text("labelId")).ToList());

      
    %>
    <!--正文部分-->
    <div class="p-content mt20">
        <!-- 操作指引 -->
        <div class="p-j-guide" style="right: -262px; z-index: 9999; position: fixed; top: 40%;
            display: none;">
            <div class="pr">
                <div class="p-GuiOperation">
                    操作指引</div>
                <%-- style="right:260px;"--%>
                <div class="p-GuiContent">
                    <h3 class="head">
                        脉络图</h3>
                    <div class="infoContent">
                        1、双击节点展示该标签节点相关文章；<br />
                        <br />
                        2、节点右击选择“创建关联节点”，新增与之关联的新节点；<br />
                        <br />
                        3、关联关系<br />
                        —<font class="fb">虚线框</font>高亮为可选择关联节点，<br />
                        —<font class="gray">灰色</font>为不可选择节点，<br />
                        —点击空白区域取消操作。
                    </div>
                    <div class="foot">
                    </div>
                </div>
            </div>
        </div>
      
        <!-- 左侧主体 -->
        <div class="p-pageLeft pr">
            <!-- 脉络图 -->
            <div id="p-j-contextualMap" class="p-contextualMap pr">
                <!-- 操作指引 -->
                <div class="pa p-operation-notice">
                </div>
                <div class="pa p-operation-noticeBox">
                    <h3 class="bb mb5">
                        操作指引</h3>
                    1、双击节点展示该标签节点相关文章；<br />
                    2、节点右击选择"创建关联节点",新增与之关联的新节点；<br />
                    3、关联关系<br />
                    —<font class="fb">虚线框</font>高亮为可选择关联节点；<br />
                    —<font class="gray">灰色</font>为不可选择节点；<br />
                    —点击空白区域取消操作。
                </div>
            </div>
            <!-- 折叠功能 -->
            <div class="p-icon_Foldposition p-j-toggleSvg" title="右侧收起">
                <i class="p-icon_folding"></i>
            </div>
        </div>
        <!-- 右侧菜单 -->
        <div class="p-pageRight">
            <%if (hitArticleList.Count > 0)
              { %>
            <div class="p-column">
                <div class="title">
                    <i class="p-tablelist mr5"></i>关联文章</div>
                <ul class="contain contain_nav">
                    <%foreach (var article in hitArticleList.Take(10))
                      { %>
                    <li type="square"><a href="/KnowledgeMindMap/MindMapArticleView?articleId=<%=article.Text("articleId") %>">
                        <%=article.Text("name")%></a></li>
                    <%} %>
                </ul>
            </div>
            <%} %>
            <%if (otherKeyWordList.Count() > 0)
              { %>
            <div class="p-column">
                <div class="title">
                    <i class="p-markbook mr5"></i>热门搜索</div>
                <ul class="contain contain_tag">
                    <%foreach (var otherKW in otherKeyWordList)
                      {%>
                    <li><a href="javascript:;" onclick="SearchMineMap(this,'<%=otherKW %>')">
                        <%=otherKW%></a></li>
                    <%} %>
                </ul>
            </div>
            <%} %>
            <div class="p-column">
                <div class="title">
                    <i class="p-tablelist mr5"></i>红包记录
                </div>
                <div id="itemRecord"></div>
            </div>
        </div>
    </div>
    <input type="hidden" id="userGuid" value="">
    <script type="text/javascript">

       
        ; (function () {
            var mindMapIds = "<%=mindMapIds%>";
            $("#itemRecord").load("/KnowledgeMindMap/ItemRecord"); //物品记录页面
    
            LoadMindMapData();
            function LoadMindMapData() {
                var keyWord = $(".p-top_search").val();
                if (keyWord != "" || mindMapIds != "") {
                    var url = "/KnowledgeMindMap/MindMapDetailJson?mindMapIds=" + mindMapIds + "&keyWord=" + escape(keyWord) + "&oldKeyWord=" + escape("<%=oldKeyWord %>"); ;
                    $.get(url, function (rs) {
                        $('#p-j-contextualMap').showMindMap({
                            data: JSON.parse(rs),
                            mindMapId: mindMapIds, isEdit: isEditMindMap,
                            clickNode: function (event, data) {
                                var _about = "/KnowledgeMindMap/MindMapLabelDetail?labelId=" + data.id + "&mindMapIds=" + mindMapIds + "&r=" + Math.random();
                                window.open(_about);
                            },
                            callback: function (force) {
                                //左侧区域缩放
                                $('.p-j-toggleSvg').on('click', 'i', function () {
                                    var $this = $(this), svg = $('.p-contextualMap').children("svg");
                                    if ($this.hasClass('p-icon_folding')) { //展开
                                        $this.closest('.p-pageLeft').css('width', "100%");
                                        $('.p-pageRight').css('display', "none");
                                        svg.attr("width", 1200);
                                        force.size([1200, 600]);
                                    } else {
                                        $this.closest('.p-pageLeft').css('width', "");
                                        $('.p-pageRight').css('display', "");
                                        svg.attr("width", 780);
                                        force.size([780, 600]);
                                    }
                                    $this.toggleClass("p-icon_folding p-icon_unfolding");
                                });
                            }
                        });
                    });
                }
            }
       
        })();
        


    </script>
    <script src="../../Scripts/Modules/Common/YH.js" type="text/javascript"></script>
    
</asp:Content>
