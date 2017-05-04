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
       var MMP=MindMapBll._();
       var allMindMapList = MMP.FindMindMapList();
       var orgList = dataOp.FindAll("Organization").ToList();
       Authentication auth = new Authentication(dataOp.GetCurrentUserId());
    %>
    <div id="yh-layout">
        <div id="yh-layout-content">
           <!--正文部分-->
            <div class="p-content mt20">
                <div class="mt20">
                    <div class="p-title_1">
                        <i class="p-tablelist mr5"></i>脉络图列表
                    </div>
                    <div class="m10">
                        <ul class="contain contain_nav p-module_article p-module_article_1 clearfix">
                           <%if (auth.IsAdmin){ %>
                            <li class="p-listadd">
                                <a href="/KnowledgeMindMap/MindMapInfoEdit">+</a><p class="mt-20">创建脉络图</p>
                            </li>
                            <%} %>
                        <%foreach (var mindMap in allMindMapList)
                          { 
                              var labelCollection = new BsonArray();
                              if(!string.IsNullOrEmpty(mindMap.Text("labelCollection"))){
                                labelCollection = mindMap["labelCollection"] as BsonArray ?? new BsonArray();
                              }
                              var orgObj = orgList.Where(c => c.Text("orgId") == mindMap.Text("orgId")).FirstOrDefault();
                              if (orgObj == null) orgObj = new BsonDocument();
                        %>
                            <li class="p-hoverShow">
                                <div class="ArtContent">
                                    <div>
                                        <h3 class="mb10">
                                            <a class="digest blue" href="/KnowledgeMindMap/MindMapSearch?mindMapId=<%=mindMap.Text("mindMapId") %>">
                                                <%=mindMap.Text("name")%></a>
                                        </h3>
                                      
                                        <div title="编辑" class="fr p-hoverShow-itm" style="margin-top: -28px; <%if (!auth.IsAdmin){ %>display:none<%} %> " >
                                            <a href="/KnowledgeMindMap/MindMapInfoEdit?mindMapId=<%=mindMap.Text("mindMapId") %>" class="green">[编辑]</a>
                                            <a href="javascript:;" onclick="DeleteMindMap('<%=mindMap.Text("mindMapId") %>')" class="yh-f_red">[删除]</a>
                                        </div>
                                        
                                        <%foreach (var label in labelCollection.Take(14))
                                           {
                                               var labelStr = HttpUtility.UrlEncode(label.ToString());
                                              %>
                                        <a href="/KnowledgeMindMap/MindMapSearch?keyWord=<%=labelStr  %>&mindMapId=<%=mindMap.Text("mindMapId") %>"  class="p-element_tag mb5"><%=label%></a>
                                        <%} %>
                                    </div>
                                </div>
                               
                                   <%--<div style="margin-left: -10px; margin-right: -10px;"></div>--%>
                                <div class="Artdesign">
                                    <span title="创建人"><i class="icon-user mr2"></i><%=mindMap.CreateUserName()%></span>
                                    <span title="部门" class="ml10"><i class="icon-cube mr2"></i><%=orgObj.Text("name")%></span>
                                    <span class="ml10" title="标签数：<%=labelCollection.Count()%>"><img src="/Content/images/client/InfoExpert/icon/icon-markbook.png" class="mr2" style="margin-top: -2px" width="10" />
                                        <%=labelCollection.Count()%></span>
                                    
                                    <span class="fr"><%=mindMap.DateFormat("updateDate", "yyyy-MM-dd")%></span>
                                    <i class="hidden icon-locked  orange-text text-accent-3"></i>
                                </div>
                            </li>
                        <%} %>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="h30"></div>
        </div>
    </div>
    <script>
        function DeleteMindMap(mindMapId) {
            if (isAdmin) {
                if (confirm("是否确定删除")) {
                    $.ajax({
                        url: "/KnowledgeMindMap/QuickDeleteMindMap",
                        type: 'post',
                        data: { mindMapId: mindMapId },
                        dataType: 'json',
                        error: function () {
                            MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试！", 5, 2000);
                        },
                        success: function (data) {
                            if (data.Success == false) {
                                MZ.msgbox.show(data.Message, 5, 2000);
                            }
                            else {
                                MZ.msgbox.show("删除成功", 1, 2000);
                                window.location.reload();
                            }
                        }
                    });
                }
            } else {
                MZ.msgbox.show("管理员才可以进行操作", 1, 2000);
            }
        }
    </script>
</asp:Content>
