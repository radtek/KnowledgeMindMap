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
       var mindMapId = PageReq.GetParam("mindMapId");//文章Id
       var mindMap = dataOp.FindOneByQuery("MindMapLibrary", Query.EQ("mindMapId", mindMapId));
       if (mindMap == null)
       {
           mindMap = new BsonDocument();
       }
       var centerLabelId = mindMap.Text("centerLabelId");
       var curCenterLabel = MindMapBll._().FindMindMapLabelCollectionByLabId(centerLabelId);
       var orgList = dataOp.FindAll("Organization").ToList();
       //获取用户所属部门 默认选中
       var userOrgIdList=new List<int>();
       if (Session["orgIdList"] != null)
       { 
         userOrgIdList=Session["orgIdList"] as  List<int>??new List<int>();
       }
  %>
    <div class="p-content mt20">
    <form method="post" id="mindMapEdit" action="">
        <input type="hidden" id="mindMapId" name="mindMapId" value="<%=mindMapId %>" />
        <div>
            <table class="p-table_keyAndVal_3">
                <tr>
                    <td width="60">
                        <i class="p-icon-artTit mr5"></i>名称：
                    </td><td>
                        <input type="text" id="name" name="name" class="w400" value="<%=mindMap.Text("name") %>"/>
                    </td>
                </tr><tr>
                    <td width="60">
                        <i class="icon-list-ul mr5"></i>分类：
                    </td><td>
                        <input type="text" id="category" name="category" class="w400" value="<%=mindMap.Text("category") %>"/>
                    </td>
                </tr><tr>
                    <td width="60">
                        <i class="icon-cube mr5"></i>部门：
                    </td><td>
                        <select name="orgId" id="orgId" class="w410">
                        <%  var firstOrgId = userOrgIdList.FirstOrDefault();
                            foreach (var org in orgList)
                           {
                              var isSelected = false;
                              if(string.IsNullOrEmpty(mindMap.Text("orgId"))&&firstOrgId != null)
                              {
                               mindMap.Set("orgId",firstOrgId.ToString());
                              }
                             
                              if(mindMap.Text("orgId")==org.Text("orgId"))
                              {
                               isSelected=true;
                              }
                               %>
                          <option value="<%=org.Text("orgId") %>" <%if(isSelected){ %>selected<%} %> ><%=org.Text("name") %> </option>
                        <%} %>
                        </select>
                    </td>
                </tr><tr>
                    <td valign="top" style="padding-top: 14px;">
                        <i class="p-markbook mr5"></i>标签：
                    </td><td>
                        <input type="text" id="seachWordValue" class="w400" placeholder="添加相关标签，用逗号或空格隔开，回车确认" />
                        <%--<a href="javascript:;" class="yh-f_blue" onclick="addLabel()">+添加</a>--%>
                        <div id="tags_collection" class="mt5 h30">
                        <%if (curCenterLabel!=null){ %>
                         <span labelId="<%=centerLabelId %>" class="chip truncate base-tag p-element_tag p-hoverShow p-hoverShow_inlineblock" data-tag="<%=curCenterLabel.Text("name")%>">
                                <%=curCenterLabel.Text("name")%><i labelId="<%=centerLabelId %>" class="p-icon_del p-hoverShow-itm"></i>
                            </span>
                         <%} %>
                        </div>
                    </td>
                </tr><tr >
                    <td width="60">
                        <i class="icon-flag mr5"></i>备注：
                    </td>
                    <td rowspan=3>
                       <textarea name="remark" class="remark" style="width: 96%; height: 100px"  title="备注"><%=mindMap.Text("name") %></textarea>
                    </td>
                </tr>
            </table>
        </div>
        </form>
        <div class="p-saveBar">
            <a href="javascript:;" onclick="SaveData()" class="p-btn p-btn_blue p-btn_large">保存</a>
            
        </div>
    </div>
    <div class="h100 clear"></div><%--div,h100勿删，防止foot脚注遮挡--%>
    <script>
        //Home/GetSingleTableJson/?tableName=MindMapLabelCollection&ps=10&qu=db.MindMapLabelCollection.distinct("_id",{"name":/' + "" + '.*/})
    var mindMapId = "<%=mindMapId%>";

    $('#seachWordValue').showSearchList({ target: $("#tags_collection") });

    ///保存
    function SaveData() {
        var formdata = $("#mindMapEdit").serialize();
        var labelInfo = getlabels();

        $.ajax({
            url: "/KnowledgeMindMap/QuickCreateMindMap",
            type: 'post',
            data: formdata + "&labelIds=" + labelInfo.labIds + "&addLabelNames=" + labelInfo.addLabNames,
            dataType: 'json',
            error: function () {
                MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试！", 5, 2000);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5, 2000);
                }
                else {
                   // alert(data.htInfo.mindMapId);
                    //var url = "/KnowledgeMindMap/MindMapInfoEdit/?mindMapId=" + data.htInfo.mindMapId;
                    var url = "/KnowledgeMindMap/MindMapSearch/?mindMapId=" + data.htInfo.mindMapId;
                    MZ.msgbox.show("操作成功", 1, 2000);
                    window.location.href = url;
                   // window.open(url);
                }
            }
        });
    }
    //获取新增标签及现有标签
    function getlabels() {
        var tags = $('#tags_collection').children(),oldTags=[], newTags=[];
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
   </script>
</asp:Content>
