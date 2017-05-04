<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>

<%
  
    //var comObjId = PageReq.GetParam("coid");
    var commentId = PageReq.GetParam("id");
    var dataOp = new DataOperation();
    BsonDocument comment = new BsonDocument();
    comment = dataOp.FindOneByKeyVal("EvaluationComment", "commentId", commentId);
    var userId = dataOp.GetCurrentUserId();//获取用户Id
    string updateQuery = "";
      if (comment == null)
     {
            comment = new BsonDocument();
     }
    else
      {
          updateQuery = "db.EvaluationComment.distinct('_id',{'commentId':'" + commentId + "'})";
      }
  
%>
 
<div class="contain">
     <form action="/Home/SavePostInfo" method="post" id="CommentEdit">
    <input type="hidden" name="comentId" value="<%=comment.Text("comentId")%>" />
    <input type="hidden" name="tbName" value="EvaluationComment" />
    <%--<input type="hidden" name="commentObjectId" value="<%=comObjId %>" />--%>
    <%--<input type="hidden" name="objectId" value="<%=comment.Text("objectId") %>" />--%>
    <input type="hidden" name="queryStr" value="<%=updateQuery %>" />

    <table width="100%">
        <tr>
            <td align="right" valign="top" width="60">
                评价：
            </td><td>
                <textarea name="comContent"  class="textarea_01" cols="35" rows="6"><%=comment.Text("comContent")%></textarea>
            </td>
        </tr>
    </table>
    </form>
</div>

<script type="text/javascript">
    function saveInfo(obj) {
        var formdata = $(obj).serialize();

        $.ajax({
            url: "/Home/SavePostInfo",
            type: 'post',
            data: formdata,
            dataType: 'json',
            error: function () {
                MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试", 5);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5);
                }
                else {
                    MZ.msgbox.show("保存成功！", 4);
                    $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + new Date().getTime());
                }
            }
        });
    }
    
        
</script>

