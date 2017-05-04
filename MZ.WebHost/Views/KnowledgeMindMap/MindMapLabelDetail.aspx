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
       //某个具体标签
       var labelId = PageReq.GetParam("labelId");
       var mindMapIds = PageReq.GetParam("mindMapIds");
   
        %>
    <div id="yh-layout">
        <div id="yh-layout-content">
           <!--正文部分-->
            <div class="p-content mt20">
                <div>
                    <!-- 关系图 -->
                    <div id="p-j-svgCon"></div>
                </div>
                <div class="mt20" id="articleList">
                    
                </div>
            </div>
            <div class="h60"></div>
        </div>
    </div>
    <script>
        ; (function () {
            var mindMapIds = "<%=mindMapIds%>";
            var mindMapIds = "<%=mindMapIds%>",labelId = "<%=labelId%>";
           
            $.get("/KnowledgeMindMap/LabelDetailJson?mindMapIds=" + mindMapIds + "&labelId=" + labelId, function (rs) {
                $('#p-j-svgCon').showMindMap({
                    data: JSON.parse(rs),
                    size:[1200,260] ,mindMapId: mindMapIds, isEdit: isEditMindMap,
                    clickNode: function (event, data) {
                        var _about = "/KnowledgeMindMap/MindMapLabelDetail?labelId=" + data.id + "&mindMapIds=" + mindMapIds + "&r=" + Math.random();
                        window.open(_about);
                    }
                });
            });

        })();

        var url = "/KnowledgeMindMap/MindMapArticleListCtrl?type=3&labelId=<%=labelId %>";
        $("#articleList").load(url);
        $("#articleList").attr("lurl", url);
 
    </script>
 
</asp:Content>
