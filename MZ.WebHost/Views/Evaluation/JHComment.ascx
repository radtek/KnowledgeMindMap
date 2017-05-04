<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
    //string name = PageReq.GetParam("name");
    //int type = PageReq.GetParamInt("type");
    //int action = PageReq.GetParamInt("action");
    //int comObjId = PageReq.GetParamInt("coid");
    //int objId = PageReq.GetParamInt("id");
    string keyName = PageReq.GetParam("keyName");
    string keyValue = PageReq.GetParam("keyValue");
    string tableName = PageReq.GetParam("tableName");
    
%>
<%--<div id="divCommentList" url="/Evaluation/JHCommentList?coid=<%=comObjId %>&id=<%=objId %>&type=<%=type %>&action=<%=action %>">
    评论读取中...</div>--%>
<div id="divCommentList" url="/Evaluation/JHCommentList?keyValue=<%=keyValue %>&keyName=<%=keyName %>&tableName=<%=tableName %>">
    评论读取中...</div>
<div id="ShowAllHisVer" style="display: none; position: absolute">
</div>
<script type="text/javascript">
    $("#divCommentList").load("/Evaluation/JHCommentList?keyValue=<%=keyValue %>&keyName=<%=keyName %>&tableName=<%=tableName %>&r=" + Math.random());
</script>
