<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
    string name = Server.UrlDecode(PageReq.GetParam("name"));
    string tableName = PageReq.GetParam("tableName");
    string keyName = PageReq.GetParam("keyName");
    string keyValue = PageReq.GetParam("keyValue");
    int type = PageReq.GetParamInt("type");
    int action = PageReq.GetParamInt("action");
    int objectId = PageReq.GetParamInt("objectId");
    int isShowAll = PageReq.GetParamInt("isShowAll");

%>
<script language="javascript">
    var objName = "<%=name %>";
</script>
<div class="fr" style='margin-top:-35px;'>
    <a href="javascript:void(0);" class="blue" onclick="showAllComment(this)" mark="part">[查看全部]</a>
    <a name="Comment" showall="true"  href="javascript:void(0);" class="blue" onclick="showCommentEdit(this,'Comment','/Evaluation/LFCommentEdit/?id=0&objectId=<%=objectId %>&tableName=<%=tableName %>&keyName=<%=keyName %>&keyValue=<%=keyValue %>&r=<%=DateTime.Now.Ticks %>')">[我要评价]</a>
</div>
<div>
<div id="divCommentList" url="/Evaluation/LFCommentList?objectId=<%=objectId %>&type=<%=type %>&action=<%=action %>&tableName=<%=tableName %>&keyName=<%=keyName %>&keyValue=<%=keyValue %>&isShowAll=<%=isShowAll %>">
    评论读取中...</div>
</div>
<div id="ShowAllHisVer" style="display: none; position: absolute">
</div>
<script type="text/javascript">
    var url = $("#divCommentList").attr("url") + "&r=" + Math.random();

    $("#divCommentList").load(url);

    function showAllComment(obj) {
        var url = $("#divCommentList").attr("url");
        var mark = $(obj).attr("mark");
        if (url) {
            if (mark == "part") {
                $("#divCommentList").load(url.replace("isShowAll=0", "isShowAll=1") + "&r=" + Math.random());
                $(obj).attr("mark", "all");
                $(obj).html("[收起]");
            } else {
                $("#divCommentList").load(url.replace("isShowAll=1", "isShowAll=0") + "&r=" + Math.random());
                $(obj).attr("mark", "part");
                $(obj).html("[查看全部]");
            }
        }
    }
</script>
