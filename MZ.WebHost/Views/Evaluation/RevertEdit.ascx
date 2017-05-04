<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
 
    var comObjId = PageReq.GetParam("coid");
    var revertId = PageReq.GetParam("id");
    var dataOp = new DataOperation();
    BsonDocument revert = new BsonDocument();
    revert = dataOp.FindOneByKeyVal("Evaluation_CommentReply", "revertId", revertId);
    var userId = dataOp.GetCurrentUserId();//获取用户Id
    string updateQuery = "";
    if (revert == null)
    {
        revert = new BsonDocument();
    }
    else
    {
        updateQuery = "db.Evaluation_CommentReply.distinct('_id',{'revertId':'" + revertId + "'})";
    }
%>
<div class="contain">
    <form action="" name="revertEdit" action="/Home/SavePostInfo" id="RevertEdit" method="post">
    <input type="hidden" name="comentId" value="<%=revert.Text("comentId")%>" />
    <input type="hidden" name="tbName" value="Evaluation_CommentReply" />
    <input type="hidden" name="queryStr" value="<%=updateQuery %>" />
    <table class="m5">
       <tr>
          <td align="right" valign="top" width="70">回复内容：</td>
          <td><input type="hidden" name="revertId" value="<%=revert.Text("revertId")%>"/>
        <textarea  class="textarea_01" name="commentRec" cols="35" rows="6"><%=revert.Text("commentRec")%></textarea></td>
       </tr>
    </table>
    </form>
    </div>
<script type="text/javascript">
    var Revert_objId = "<%=comObjId %>";
    function saveRevertEdit(obj,o) {
        var formData = $(obj).serialize();
        $.ajax({
            url: '/Home/SavePostInfo',
            type: 'post',
            data: formData,
            dataType: 'json',
            error: function () {
                MZ.msgbox.show('未知错误，请联系服务器管理员，或者刷新页面重试', 5);
            },
            success: function (data) {
                if (data.Success == true) {
                    MZ.msgbox.show("回复成功", 4);
                    if ($("#divCommentList") != null) {
                        $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
                    }

                    if (Revert_objId == "" || Revert_objId == "0") {
                        window.location.reload();
                    }
                    else {
                        if ($("#divCommentList_" + Revert_objId) != null) {
                            $("#divCommentList_" + Revert_objId).load($("#divCommentList_" + Revert_objId).attr("url") + "&r=" + Math.random());
                        }
                    }
                }
                else {
                    MZ.msgbox.show(data.msgError, 5);
                }
            }
        });
    }
        
    </script>