<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
  
    var objectId = PageReq.GetParam("objectId");
    var commentId = PageReq.GetParam("id");
    var tableName = PageReq.GetParam("tableName");
    var keyName = PageReq.GetParam("keyName");
    var keyValue = PageReq.GetParam("keyValue");
    var comment = dataOp.FindOneByKeyVal("EvaluationComment", "commentId", commentId);
    var userId = dataOp.GetCurrentUserId();//获取用户Id
    string updateQuery = "";
    if (comment == null)
    {
        comment = new BsonDocument();
    }
    else
    {
        updateQuery = "db.EvaluationComment.distinct('_id',{'commentId':'" + commentId + "'})";
        if (tableName == "")
            tableName = comment.String("tableName");
        if (keyName == "")
            keyName = comment.String("keyName");
        if (keyValue == "")
            keyValue = comment.String("keyValue");
    }
  
%>
<div class="popup">
    <form action="/Home/SavePostInfo" method="post" id="CommentEdit">
    <input type="hidden" name="tbName" value="EvaluationComment" />
    <input type="hidden" name="objectId" value="<%=objectId %>" />
    <input type="hidden" name="queryStr" value="<%=updateQuery %>" />
    <input type="hidden" name="tableName" value="<%=tableName %>" />
    <input type="hidden" name="keyName" value="<%=keyName %>" />
    <input type="hidden" name="keyValue" value="<%=keyValue %>" />
    <table class="w">
        <tr>
            <td width="50" valign="top" class="pt10">
                评价：
            </td>
            <td>
               <div class="h120">
                <script id="editor" type="text/plain" style="width: 100%; height: 70%"><%=Server.UrlDecode(comment.Text("comContent"))%></script>
               </div>
               <%-- <textarea name="comContent" class="textareaborder"  style=" width:95%; height:100px" ><%=comment.Text("comContent")%></textarea>--%>
            </td>
        </tr>
    </table>
    </form>
</div>
<script type="text/javascript">
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
        $(document).scrollTop($(document).height());
    });
    
    function saveInfo(obj) {
//        var formdata = $(obj).serialize();
        if (!editor.hasContents()) {
            MZ.msgbox.show('请输入内容', 5);
            return false;
        }
        var str = editor.getContent();
        str = escape(str);
        $.ajax({
            url: "/Home/SavePostInfo",
            type: 'post',
            data: { comContent: str,
                keyName: $("[name='keyName']").val(),
                keyValue: $("[name='keyValue']").val(),
                objectId: $("[name='objectId']").val(),
                queryStr: $("[name='queryStr']").val(),
                tableName: $("[name='tableName']").val(),
                tbName: $("[name='tbName']").val()
            },
            dataType: 'json',
            error: function () {
                MZ.msgbox.show('未知错误，请联系服务器管理员，或者刷新页面重试', 5);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5);
                }
                else {
                    MZ.msgbox.show("保存成功", 4);
                    $("#divResponse").remove();
                    $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
                }
            }
        });
    }
    
        
</script>
