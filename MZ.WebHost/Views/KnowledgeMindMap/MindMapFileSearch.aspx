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
       var keyWord = Server.UrlDecode(PageReq.GetParam("keyWord"));
       //某个具体标签
      
      
        %>
       <div id="yh-layout">
        <div id="yh-layout-content">
           <!--正文部分-->
            <div class="p-content mt20">
                <div class="" style="background-color:#fafafa;">
                    <!-- 关系图 -->
                    <div id="p-j-svgCon"></div>
                </div>
                <div class="mt20"id="articleList">
                    
                </div>
            </div>
        </div>
    </div>
      <script>
        var url = "/KnowledgeMindMap/MindMapArticleListCtrl?type=4&keyWord=" + escape("<%=keyWord%>");
        $("#articleList").load(url);
        $("#articleList").attr("lurl", url);
       </script>
</asp:Content>
