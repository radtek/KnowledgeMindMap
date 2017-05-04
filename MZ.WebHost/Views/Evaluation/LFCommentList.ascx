<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<% 
    string type = PageReq.GetParam("type");
    string tableName = PageReq.GetParam("tableName");
    string keyName = PageReq.GetParam("keyName");
    string keyValue = PageReq.GetParam("keyValue");
    int objectId = PageReq.GetParamInt("objectId");
    var order = PageReq.GetParam("type");
    var isShowAll = PageReq.GetParamInt("isShowAll");
    // var comments = dataOp.FindAllByKeyVal("Evaluation_Comment", "commentObjectId", comObjId.ToString()).ToList();
    var comments = dataOp.FindAllByQueryStr("EvaluationComment", string.Format("objectId={0}&tableName={1}&keyValue={2}", objectId, tableName, keyValue)).OrderByDescending(t=>t.Date("updateDate")).ToList();
    var commentCount = comments.Count();
    if (isShowAll != 1)
        comments = comments.Take(6).ToList();
    var userId = dataOp.GetCurrentUserId();//获取用户Id
    //获取所有评论的用户
    var allCommentors = dataOp.FindAllByKeyValList("SysUser", "userId", comments.Select(t => t.String("updateUserId"))).ToList();
    //获取所有的回复清单
    var allCommentRevert = dataOp.FindAllByKeyValList("EvaluationCommentReply", "commentId", comments.Select(t => t.String("commentId"))).ToList();
   
%>
<%=Html.Hidden("objectId", objectId)%>
<%=Html.Hidden("tableName", tableName)%>
<%=Html.Hidden("keyName",keyName) %>
<%=Html.Hidden("keyValue",keyValue) %>
<%=Html.Hidden("type", type)%>
<%
    if (comments.Count > 0)
    {
        foreach (var comment in comments.OrderBy(c=>c.String("createDate")))
        {
            var userName = "";//获取用户名称
            //var curUser = dataOp.FindOneByKeyVal("SysUser", "userId", comment.Text("updateUserId"));
            var curUser = allCommentors.Find(t => t.Int("userId") == comment.Int("updateUserId"));
            if (curUser != null)
            {
                userName = curUser.Text("name");

            }
            //var commentReverts = dataOp.FindAllByKeyVal("EvaluationCommentReply", "commentId", comment.Text("commentId"));
            var commentReverts = allCommentRevert.Where(t => t.Int("commentId") == comment.Int("commentId")).ToList();
%>
<table width="100%" class="bb clearfix pt10 pb10 mb10">
    <tr>
        <td width="80" valign="top" align="center">
            <img src="<%=SysAppConfig.HostDomain %>/Content/images/client/InfoExpert/icon/UserAva.png" alt="" />
            <p class="yh-f_gray tc ellipsis w80"><%=StringExtension.CutStr(userName, 10, "..")%></p>
        </td>
        <td valign="top" width="100%">
            <div class="quote">
                <%=StringExtension.CutStr(Server.UrlDecode(comment.Text("comContent")), 270, "...")%>
            </div>
            <div class="author yh-f_gray mt5">
                <span class="date">
                    <%=comment.ShortDate("createDate")%></span>
                <%--  <span style="cursor: pointer" onclick='showCommentEdit("RevertEdit","/InformationPlatform/RevertEdit?objectId=<%=objectId %>&commentId=<%=comment.Text("commentId") %>&type=<%=type %>&action=0");'>
                 <img src="<%= SysAppConfig.HostDomain %>/Content/Images/Comments/ico25.jpg" width="14"
                        height="12" />
                    <%=commentReverts.Count()%></span>--%>
            </div>
            <div class="comment_operate mt5">
                <%if (comment.Text("createUserId") == userId.ToString())
                  {%>
                <a hidefocus="true" name="Comment" showall="true" href="javascript:void(0)" class="operate green" onclick="showCommentEdit(this,'CommentEdit','/Evaluation/LFCommentEdit/?id=<%=comment.Text("commentId")%>&objectId=<%=objectId %>&r=<%=DateTime.Now.Ticks %>');">
                    [编辑]</a> <a hidefocus="true" href="javascript:void(0)" class="operate red" onclick="CustomDeleteItemToolTip('确定要删除该评论吗？删除后将无法恢复',this,reload);"
                        tbname="EvaluationComment" querystr="db.EvaluationComment.distinct('_id',{'commentId':'<%=comment.Int("commentId") %>'})">
                        [删除]</a> <%} %>
                        <a showall="true" name="Comment" href="javascript:void(0)" class="operate blue" onclick="showCommentEdit(this,'RevertEdit','/Evaluation/LFRevertEdit/?id=0&objectId=<%=objectId %>&commentId=<%=comment.String("commentId") %>&r=<%=DateTime.Now.Ticks %>');">
                            [回复]</a></div>
            <%if (commentReverts.Count() > 0)
              {%>
            <%var index1 = 1;
              var allReverters = dataOp.FindAllByKeyValList("SysUser", "userId", commentReverts.Select(t => t.String("updateUserId"))).ToList();
              foreach (var revert in commentReverts)
              {
                         
            %>
            <table width="100%" class="revertcomment_table_lf bt_dotted mt10 pt10 clearfix">
                <tr>
                    <%
      var picturePath = "/Content/images/client/InfoExpert/icon/UserAva.png";
      //var user = dataOp.FindOneByKeyVal("SysUser", "userId", revert.Text("updateUserId"));
      var user = allReverters.Find(t => t.Int("userId") == revert.Int("updateUserId"));
      if (user == null)
          user = new BsonDocument();
      if (curUser != null)
      {
          if (!string.IsNullOrEmpty(curUser.Text("picturePath")))
          {
              picturePath = curUser.Text("picturePath");
          }
      }
                             
                    %>
                    <td width="55" valign="top" align="center">
                        <%--<img src="<%=Yinhoo.Utilities.Core.Extensions.StringExtension.GetFileFullNameNoExt(picturePath) + "_us.jpg"%>"
                                onerror="setTypeImg(this,'us');" />--%>
                        <img src="<%=SysAppConfig.HostDomain %><%=picturePath%>" width="40" height="40" />
                        <p class="yh-f_gray tc ellipsis w80"><%=user.Text("name")%></p>
                    </td>
                    <td valign="top">
                        <div class="quote">
                            <%=Server.UrlDecode(revert.Text("commentRec"))%>
                        </div>
                        <div class="author yh-f_gray mt5">
                            <span class="date">
                                <%=revert.ShortDate("createDate")%></span>
                            <%-- <%=index1%>楼--%>
                        </div>
                        <div class="comment_operate mt5">
                            <%if (revert.Text("createUserId") == userId.ToString())
                              {%><a showall="true" name="Comment" hidefocus="true" href="javascript:void(0)" class="operate green" onclick="showCommentEdit(this,'RevertEdit','/Evaluation/LFRevertEdit/?id=<%=revert.Text("revertId")%>&objectId=<%=objectId %>&r=<%=DateTime.Now.Ticks %>');">[编辑]</a><%}%><%if (revert.Text("createUserId") == userId.ToString())
                                                                                                                                                                                                                                                                 {%>&nbsp;<a hidefocus="true" href="javascript:void(0)" class="operate red" onclick="CustomDeleteItemToolTip('确定要删除该评论吗？删除后将无法恢复',this,reload);"
                                                                                                                                                                                                                                                                     tbname="EvaluationCommentReply" querystr="db.EvaluationCommentReply.distinct('_id',{'revertId':'<%=revert.Int("revertId") %>'})">[删除]</a><%}%></div>
                    </td>
                </tr>
            </table>
            <%index1++;
  } %>
            <%} %>
        </td>
    </tr>
</table>
<%} %>
<%}
    else
    { %>
<div class="none">
    暂无评价！</div>
<%} %>
<%--<div id="addComment" style="display: block; margin-bottom: 10px; padding-bottom: 10px;
    line-height: 30px">
    <%string updateQuery = "";
    %>
    <form id="commentForm" method="post">
    <input type="hidden" name="tbName" value="EvaluationComment" />
    <input type="hidden" name="queryStr" value="<%=updateQuery %>" />
    <input type="hidden" name="objectId" value="<%=objectId %>" />
    <input type="hidden" name="tableName" value="<%=tableName %>" />
    <input type="hidden" name="keyName" value="<%=keyName %>" />
    <input type="hidden" name="keyValue" value="<%=keyValue %>" />
    <div style="margin: 0px 8px 8px 8px">
        <table width="100%">
            <tr>
                <td width="60" height="35">
                    标题：
                </td>
                <td>
                    <input type="text" name="comTitle" id="CommentTitle" class="inputborder" style="width: 95%;" />
                </td>
            </tr>
            <tr>
                <td valign="top">
                    内容：
                </td>
                <td>
                    <textarea name="comContent" rows="10" id="CommentDesc" class="textarea_01" cols="45"
                        rows="5" style="width: 95%;"></textarea>
                </td>
            </tr>
            <tr>
                <td height="50">
                    &nbsp;
                </td>
                <td>
                    <a class="btn_01" hidefocus="true" href="javascript:;" style="cursor: pointer" onclick="addCommentContent('<%=keyValue %>');">
                        提交评价<span></span></a>
                </td>
            </tr>
        </table>
    </div>
    </form>
</div>--%>
<script type="text/javascript">
    $("#sp_objName").html("<%=keyValue %>");
    $("span[name=sp_commentObj]").each(function () {
        $(this).html("<%=keyValue %>");
    });
</script>
<input type="hidden" id="genreId" value="" />
<input type="hidden" id="responseType" value="" />
<input type="hidden" id="action" value="<%=PageReq.GetParamInt("action")%>" />
<input type="hidden" id="ProjRetId" value="<%=keyValue %>" />
<script type="text/javascript">
    $(function () {
        var commentCount = '<%=commentCount %>';
        $("body").find("h3").each(function () {
            var expos = $(this).text().indexOf("评价");
            if (expos > 0 && commentCount > 0) {
                $(this).html($(this).text().substr(0, expos + 2) + ("(" + commentCount + ")"));
            }
        })
    });

    function onSubmit() {
        var id = $("#responseType").val();
        if (id == "Comment" || id == "CommentEdit") {
            saveInfo("#" + id);
        } else {
            saveRevertEdit("#" + id);
        }
    }

    function Sort(type) {
        $("#divCommentList").load("/Evaluation/LFCommentList?objectId=<%=objectId %>&id=<%=keyValue %>&tableName=<%=tableName %>&keyName=<%=keyName %>&action=0&type=" + type + "&r=" + Math.random());
    }

    //添加任务书comment
    function addCommentContent(id) {
        if ($("#CommentDesc").val() == "") { top.showInfoBar("请填写评价内容"); return false; }

        var formdata = $("#commentForm").serialize();

        $.ajax({
            url: "/Home/SavePostInfo",
            type: 'post',
            data: formdata,
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
                    $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
                }
            }
        });
    }

    function showCommentEdit(obj, id, url) {
        $("#divResponse").remove();
        var showall = $(obj).attr("showall");//判断是否已有编辑框
        if (showall=="true") {
            $("a[name=Comment]").each(function () {
                $(this).attr("showall", "true");
             });
            $(obj).attr("showall", "false");
        } else {
           $("a[name=Comment]").each(function () {
                $(this).attr("showall", "true");
             });
            return false;
        }
        $("#responseType").val(id);
        var oComment = obj.parentNode; //获取父节点
        if (id == "Comment") {
            oComment = document.getElementById("divCommentList").parentNode;
        }
        $(oComment).append('<div id="divResponse"><div id="divUEditor"></div><a href="javascript:;" onclick="onSubmit()" class="p-btn p-btn_blue ml50 mt2">提交</a></div>'); //添加编辑框
        $("#divUEditor").load(url);
//        以下是回复，评价用弹窗形式
//        var title = "";
//        if (id == "CommentEdit") {
//            title = "编辑评论";
//        } else {
//            title = "编辑回复";
//        }
//        $.YH.box({
//            target: url,
//            title: title,
//            width: 600,
//            ok: function () {
//                if (id == "CommentEdit") {
//                    saveInfo("#" + id);
//                } else {
//                    saveRevertEdit("#" + id, this);
//                }
//            }
//        });
    }

    function reload() {
        $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random())
    }

</script>
