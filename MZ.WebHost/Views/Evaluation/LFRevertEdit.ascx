<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
 
    var objectId = PageReq.GetParam("objectId");
    var revertId = PageReq.GetParam("id");
    var commentId = PageReq.GetParam("commentId");
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
        if (commentId == "" || commentId == "0")
            commentId = revert.Text("commentId");
    }
%>
<form action="" name="revertEdit" action="/Home/SavePostInfo" id="RevertEdit" method="post">
<input type="hidden" name="commentId" value="<%=commentId %>" />
<input type="hidden" name="tbName" value="EvaluationCommentReply" />
<input type="hidden" name="queryStr" value="<%=updateQuery %>" />
<input type="hidden" name="objectId" value="<%=objectId %>" />
<div class="popup mt10">
    <table class="w">
        <tr>
            <td width="50" valign="top" class="pt10">
                回复：
            </td>
            <td>
                <input type="hidden" name="revertId" value="<%=revert.Text("revertId")%>" />
                <div class="h120">
                <script id="editor" type="text/plain" style="width: 100%; height: 70%"><%=Server.UrlDecode(revert.Text("commentRec"))%></script>
               </div>
              <%--<textarea class="textarea_01" name="commentRec" style="width:95%; height:100px"  class="textareaborder"><%=revert.Text("commentRec")%></textarea> --%>
            </td>
        </tr>
    </table>
</div>
</form>
<script type="text/javascript">
//    var editor = UE.getEditor('editor');
//    var editor = UE.getEditor('editor', {
//        toolbars: [
//    ['fullscreen', 'source', 'undo', 'redo'],
//    ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
//],
//    autoHeightEnabled: true,
//    autoFloatEnabled: true
    //});
    UE.delEditor('editor');
    var editor = UE.getEditor('editor', { toolbars: [
    ['emotion', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
    ],
        autoClearinitialContent: false,
        wordCount: false,
        elementPathEnabled: false
    });
    editor.ready(function () {
        editor.focus(true);
    });
    var Revert_objId = "<%=objectId %>";
    function saveRevertEdit(obj) {
        //var formData = $(obj).serialize();
        if (!editor.hasContents()) {
            MZ.msgbox.show('请输入内容', 5);
            return false;
        }
        var str = editor.getContent();
        str = escape(str);
        $.ajax({
            url: '/Home/SavePostInfo',
            type: 'post',
            data: { commentId: $("[name='commentId']").val(),
                commentRec: str,
                objectId: $("[name='objectId']").val(),
                queryStr: $("[name='queryStr']").val(),
                revertId: $("[name='revertId']").val(),
                tbName: $("[name='tbName']").val()
            },
            dataType: 'json',
            error: function () {
                MZ.msgbox.show('未知错误，请联系服务器管理员，或者刷新页面重试', 5);
            },
            success: function (data) {
                if (data.Success == true) {
                    MZ.msgbox.show("更新成功!", 4);
                    if ($("#divCommentList") != null) {
                        $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
                    }

                    if (Revert_objId == "" || Revert_objId == "0") {
                        window.location.reload();
                    }
                    else {
                        $("#divResponse").remove();
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
