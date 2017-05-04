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
       var userId = PageReq.GetParam("userId");
       //某个具体标签
       var MMP=MindMapBll._();
       var relArticleIds = MMP.FindUserFavoriateArticleIds(this.CurrentUserId.ToString());
       var hitArticleList = MMP.FindMindMapArticleByIds(relArticleIds);
       var allArticleRelLabelIds = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.In("articleId", relArticleIds.Select(c => (BsonValue)c))).ToList();
       var allLableList = MMP.FindMindMapLabelCollectionByLabIds(allArticleRelLabelIds.Select(c => c.Text("labelId")).ToList());
        %>
       <div id="yh-layout">
        <div id="yh-layout-content">
           <!--正文部分-->
            <div class="p-content mt20">
                <div class="" style="background-color:#fafafa;">
                    <!-- 关系图 -->
                    <div id="p-j-svgCon"></div>
                </div>
                <div class="mt20" id="articleList">
                   
                </div>
            </div>
        </div>
    </div>
      <script>
          var url = "/KnowledgeMindMap/MindMapArticleListCtrl?type=1&userId=<%=userId %>";
          $("#articleList").load(url);
          $("#articleList").attr("lurl", url);
    </script>
</asp:Content>
