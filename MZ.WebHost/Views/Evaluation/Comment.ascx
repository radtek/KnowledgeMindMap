<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
    string name = PageReq.GetParam("name");
    int type = PageReq.GetParamInt("type");
    int action = PageReq.GetParamInt("action");
    int comObjId = PageReq.GetParamInt("coid");
    int objId = PageReq.GetParamInt("id");
    
%>
<script type="text/javascript">
    var objName = "<%=name %>";
</script>
<div id="divCommentList" url="/Evaluation/CommentList?coid=<%=comObjId %>&id=<%=objId %>&type=<%=type %>&action=<%=action %>">
    评论读取中...</div>
<div id="ShowAllHisVer" style="display: none; position: absolute">
</div>
<script type="text/javascript">
    $("#divCommentList").load("/Evaluation/CommentList?coid=<%=comObjId %>&id=<%=objId %>&type=<%=type %>&action=<%=action %>&r=" + Math.random());
</script>
