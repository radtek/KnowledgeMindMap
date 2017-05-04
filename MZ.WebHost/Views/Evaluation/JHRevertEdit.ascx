<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
 
    //var comObjId = PageReq.GetParam("coid");
    var revertId = PageReq.GetParam("id");
    var dataOp = new DataOperation();
    BsonDocument revert = new BsonDocument();
    revert = dataOp.FindOneByKeyVal("EvaluationCommentReply", "revertId", revertId);
    var userId = dataOp.GetCurrentUserId();//获取用户Id
    string updateQuery = "";
    if (revert == null)
    {
        revert = new BsonDocument();
    }
    else
    {
        updateQuery = "db.EvaluationCommentReply.distinct('_id',{'revertId':'" + revertId + "'})";
    }
%>
<div class="contain">
    <form action="" name="revertEdit" action="/Home/SavePostInfo" id="RevertEdit" method="post">
    <input type="hidden" name="comentId" value="<%=revert.Text("comentId")%>" />
    <input type="hidden" name="tbName" value="EvaluationCommentReply" />
    <input type="hidden" name="queryStr" value="<%=updateQuery %>" />
    <table>
       <tr>
          <td align="right" valign="top" width="70">回复内容：</td>
          <td><input type="hidden" name="revertId" value="<%=revert.Text("revertId")%>"/>
        <textarea  class="textarea_01" name="commentRec" cols="35" rows="6"><%=revert.Text("commentRec")%></textarea></td>
       </tr>
    </table>
    </form>
    </div>
<script type="text/javascript">
    var Revert_objId = 1;
    function saveRevertEdit(obj,o) {
        var formData = $(obj).serialize();
        $.ajax({
            url: '/Home/SavePostInfo',
            type: 'post',
            data: formData,
            dataType: 'json',
            error: function () {
                $.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
            },
            success: function (data) {
                if (data.Success == true) {
                    MZ.msgbox.show("更新成功！", 4);
                    if ($("#divCommentList") != null) {
                        //$("#divCommentList").load($("#divCommentList").attr("url"));
                        $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + new Date().getTime());
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