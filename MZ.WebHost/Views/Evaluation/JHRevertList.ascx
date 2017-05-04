﻿<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%
    
    DataOperation dataOp = new DataOperation();
    var CommentsId = PageReq.GetParam("comentId");
    //var comObjId = PageReq.GetParam("coid");
    //var objId = PageReq.GetParamInt("id");

    var comment = dataOp.FindOneByKeyVal("EvaluationComment", "commentId", CommentsId);
    var commentReverts = dataOp.FindAllByKeyVal("EvaluationCommentReply", "commentId", CommentsId).ToList();
    if (comment == null)
    {
        comment = new BsonDocument();
    }
    int userId = dataOp.GetCurrentUserId();
   
%>
<%--<%=Html.Hidden("comObjId", comObjId) %>--%>
<%--<%=Html.Hidden("objId", objId)%>--%>
<%    
    var picturePath = "/Content/Images/Comments/pic10.jpg";
    var user = dataOp.FindOneByKeyVal("SysUser", "userId", comment.Text("updateUserId"));
    if (user != null)
    {
        if (!string.IsNullOrEmpty(user.Text("picturePath")))
        {
            picturePath = user.Text("picturePath");
        }
    }
                             
%>
<div style="margin: 0px 0px 10px 10px">
    <table width="100%" style="line-height: 21px">
        <tr>
            <td valign="top" width="40">
                <img src="<%=SysAppConfig.HostDomain %><%=picturePath%>" />
            </td>
            <td align="left">
                <div style="margin: 0px 8px 8px 8px">
                    <table width="100%" style="line-height: 21px">
                        <tr>
                            <td>
                                来自：<a href="#" class="blue4"><%=user!=null?user.Text("name"):string.Empty%></a>&nbsp;&nbsp;
                                <span style="color: #A49B9C">[<%=comment.Text("createDate")%>] </span>
                            </td>
                            <td align="right">
                                <%if (comment.Text("createUserId") == userId.ToString())
                                  {%>
                                [<a hidefocus="true" href="javascript:void(0)" class="edit" onclick="showRevertEdit('CommentEdit','/Evaluation/JHCommentEdit/?id=<%=comment.Text("comentId")%>');">编辑</a>]<%}%><%if (comment.Text("createUserId") == userId.ToString())
                                                                                                                                                                                                                                 {%>
                                [<a hidefocus="true" href="javascript:void(0)" class="delete" onclick="CustomDeleteItem(this,reload);"
                                    tbname="EvaluationComment" querystr="db.EvaluationComment.distinct('_id',{'commentId':'<%=comment.Int("commentId") %>'})">删除</a>]<%}%>
                                [<a hidefocus="true" href="javascript:void(0)" onclick='$("#divCommentList" ).load($("#divCommentList").attr("url")+"&r="+ Math.random())'
                                    class="return" style="font-weight: normal">返回</a>]
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <%=comment.Text("comContent")%>
                            </td>
                            <td align="right">
                                <font style="font-weight: bold">
                                    <%=commentReverts.Count()%>人回复</font>
                            </td>
                            <%-- ，<span id="tj"><%=comment.Text("commendNum")%></span>人推荐--%>
                            <%--  <a href="javascript:void(0)" onclick="TJComments(<%=CommentsId%>,<%=objId%>)" class="green2">
                                我要推荐</a>&nbsp;&nbsp;--%>
                            <%--|&nbsp;&nbsp;<a href="#rever" class="blue4">我要回复</a>--%>
                       <%-- </tr>
                    </table>--%>
                    <%if (commentReverts.Count() > 0)
                      {%>
                    <%var index = 1;
                      foreach (var revert in commentReverts)
                      {%>
                    <% var revertPicturePath = "/Content/Images/Comments/pic10.jpg";
                       var revertUser = dataOp.FindOneByKeyVal("SysUser", "userId", revert.Text("updateUserId"));
                       if (revertUser != null)
                       {
                           if (!string.IsNullOrEmpty(revertUser.Text("picturePath")))
                           {
                               revertPicturePath = revertUser.Text("picturePath");
                           }
                       } %>
                    <table width="100%" style="margin-top: 10px; margin-bottom: 12px;">
                        <tr>
                            <td width="40" valign="top">
                                <img src="<%=SysAppConfig.HostDomain %><%=picturePath%>" />
                            </td>
                            <td>
                                <%--<div style="margin: 0px 8px 8px 8px">
                                    <table width="100%" style="border-bottom: 1px solid #E2E0E1; margin-bottom: 5px;
                                        line-height: 18px">
                                        <tr>
                                            <td>
                                                来自：<a href="#" class="blue4"><%=revertUser!=null?revertUser.Text("name"):string.Empty%></a>&nbsp;&nbsp;
                                                <span style="color: #A49B9C">[<%=revert.Text("createDate")%>] </span>
                                                <%=index%>楼
                                            </td>
                                            <td align="right">
                                                <%if (revert.Text("createUserId") == userId.ToString())
                                                  {%>[<a href="javascript:void(0)" class="edit" onclick="showRevertEdit('RevertEdit','/Evaluation/RevertEdit/?id=<%=revert.Text("revertId")%>&objId=<%=objId %>');">编辑</a>]<%}%><%if (revert.Text("createUserId") == userId.ToString())
                                                                                                                                                                                                                                  {%>
                                                [<a href="javascript:void(0)" class="delete" onclick="CustomDeleteItem(this,reload);"
                                                    tbname="EvaluationCommentReply" querystr="db.EvaluationCommentReply.distinct('_id',{'revertId':'<%=revert.Int("revertId") %>'})">删除</a>]<%}%>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            </td>
                                            <td>
                                                <%=revert.Text("revertContent")%>
                                            </td>
                                        </tr>
                                    </table>
                                </div>--%>
                                <table width="100%" style="border-bottom: 1px solid #E2E0E1; margin-bottom: 5px;
                                    line-height: 18px">
                                    <tr>
                                        <td>
                                            来自：<%=user.Text("name")%>&nbsp;&nbsp; <span style="color: #A49B9C">
                                                [<%=revert.Text("createDate")%>]
                                                <%if (revert.Text("createUserId") == userId.ToString())
                                                  {%>
                                                  <a hidefocus="true" href="javascript:void(0)" class="edit" onclick="showCommentEdit('RevertEdit','/Evaluation/JHRevertEdit/?id=<%=revert.Text("revertId")%>&r=<%=DateTime.Now.Ticks %>');">编辑</a>
                                                  <%}%>
                                                  <%if (revert.Text("createUserId") == userId.ToString()){%>
                                                  <a hidefocus="true" href="javascript:void(0)" class="delete" onclick="CustomDeleteItem(this,reload);" tbname="EvaluationCommentReply" querystr="db.EvaluationCommentReply.distinct('_id',{'revertId':'<%=revert.Int("revertId") %>'})">删除</a>
                                                  <%}%>
                                            </span>
                                        </td>
                                        <td align="right" style="color: #939395">
                                            <%=index%>楼
                                        </td>
                                    </tr>
                                </table>
                                <div style="line-height: 19px; padding: 5px 5px 10px 5px; color: #5E5E5E">
                                    <%=revert.Text("commentRec")%></div>
                            </td>
                        </tr>
                    </table>
                    <%index++;
                      } %>
                    <%} %>
                </div>
            </td>
        </tr>
    </table>
</div>
<br />
<br />
<form id="revertCommentForm" method="post">
<input type="hidden" name="commentId" value="<%=comment.Text("commentId")%>" />
<input type="hidden" name="tbName" value="EvaluationCommentReply" />
<%--<input type="hidden" name="commentObjectId" value="<%=comObjId %>" />--%>
<%--<input type="hidden" name="objectId" value="<%=objId %>" />--%>
<input type="hidden" name="queryStr" value="" />
<div style="margin: 0px 8px 8px 8px">
    <table width="100%" style="line-height: 30px" id="rever">
        <tr>
            <td style="font-size: 12px">
                <strong>回复话题</strong>
            </td>
        </tr>
        <tr>
            <td>
                <textarea name="commentRec" id="commentRec" rows="10" style="width: 95%" class="textarea_01"></textarea>
            </td>
        </tr>
        <tr>
            <td height="50">
                <a hidefocus="true" class="btn_01" name="RecComment" onclick="RecTaskComment()" href="javascript:;"
                    style="cursor: pointer">回复<span></span></a>
            </td>
        </tr>
    </table>
</div>
</form>
<div class="clear">
</div>
<script type="text/javascript">
    $("span[name=sp_objName]").each(function () {
        $(this).html(objName);
    });
    function RecTaskComment() {
        var formdata = $("#revertCommentForm").serialize();

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
                    $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
                }
            }
        });
    }

    function showRevertEdit(id, url) {
        $.YH.box({
            target: url,
            title: '编辑回复',
            width: 400,
            ok: function () {
                if (id == "CommentEdit") {
                    saveInfo("#" + id);
                } else {
                    saveRevertEdit("#" + id, this);
                }
            }
        });
    }

    function reload() {
        $("#divCommentList").load($("#divCommentList").attr("url") + "&r=" + Math.random());
    }

</script>
