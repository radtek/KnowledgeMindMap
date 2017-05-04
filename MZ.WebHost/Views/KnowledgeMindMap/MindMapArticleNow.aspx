<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/EMM.Master" Inherits="Yinhe.ProcessingCenter.ViewPageBase" %>

<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<%@ Import Namespace="MZ.BusinessLogicLayer" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="HeadContent" runat="server">
    <% Html.RenderPartial("HeadContent"); %>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
   <%
       var articleId = PageReq.GetParam("articleId");//文章Id
       var article = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
       if (article == null)
       {
           article = new BsonDocument();
       }
       var relLabelIds = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.EQ("articleId", articleId)).Select(c => c.Text("labelId")).ToList();
       MindMapBll mmp=MindMapBll._();
       var relLabelList = mmp.FindMindMapLabelCollectionByLabIds(relLabelIds);
       var fileOp = new Yinhe.ProcessingCenter.Document.FileOperationHelper();
       var fileList = fileOp.FindFileList("MindMapArticle", articleId.ToString());
       var mindMapId = PageReq.GetParam("mindMapId");
       var labelName =Server.UrlDecode(PageReq.GetParam("labelName"));
       var curLabelId = PageReq.GetParam("labelId");
       if (!string.IsNullOrEmpty(curLabelId))
       {
           var hitLabelObj = mmp.FindMindMapLabelCollectionByLabId(curLabelId);
           if (hitLabelObj != null)
           {
               if (!string.IsNullOrEmpty(labelName) && labelName != hitLabelObj.Text("name"))
               {
                   labelName = labelName + "," + hitLabelObj.Text("name");
               }
               else
               {
                   labelName = hitLabelObj.Text("name");
               }
           }
       }
      
  %>
    <div class="p-content mt20">
        <form method="post" id="articleEdit" action="">
        <input type="hidden" id="delFileRelIds" name="delFileRelIds" value="" />
        <input type="hidden" id="uploadFileList" name="uploadFileList" />
        <input type="hidden" id="fileSaveType" name="fileSaveType" value="multiply" />
        <input type="hidden" id="uploadType" name="uploadType" value="0" />
        <input type="hidden" id="fileTypeId" name="fileTypeId" value="0" />
        <input type="hidden" id="fileObjId" name="fileObjId" value="0" />
        <input type="hidden" id="keyValue" name="keyValue" value="0" />
        <input type="hidden" id="tableName" name="tableName" value="0" />
        <input type="hidden" id="keyName" name="keyName" value="0" />
        <input type="hidden" id="articleId" name="articleId" value="<%=articleId %>" />
        <div>
            <%if (!string.IsNullOrEmpty(articleId))
              { %>
            <a class="fr f14 unl p-transpart" href="/KnowledgeMindMap/MindMapArticleView?articleId=<%=articleId %>"  ><i class="icon-share-square-o mr2" style="font-size: 16px;"></i>返回展示</a>
            <%} %>
            <table class="p-table_keyAndVal_3">
                <tr>
                    <td width="60">
                        <i class="p-icon-artTit mr5"></i>标题：
                    </td><td>
                        <input type="text" id="name" name="name" class="w400" value="<%=article.Text("name") %>"/>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding-top: 14px;">
                        <i class="p-markbook mr5"></i>标签：
                    </td><td>
                        <input type="text" id="seachWordValue" class="w400" placeholder="添加相关标签，用逗号或空格隔开，回车确认" />
                        <%--<a href="javascript:;" class="yh-f_blue" onclick="addLabel()">+添加</a>--%>
                        <div id="tags_collection" class="mt5 h30">
                        <%foreach (var label in relLabelList) {%>
                            <span labelId="<%=label.Text("labelId") %>" class="chip truncate base-tag p-element_tag p-hoverShow p-hoverShow_inlineblock" data-tag="<%=label.Text("name")%>">
                                <%=label.Text("name")%><i labelId="<%=label.Text("labelId") %>" class="p-icon_del p-hoverShow-itm"></i>
                            </span>
                        <%} %>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </form>
        <div class="mt10 mb10">
            <i class="p-icon_annex"></i>
            <a class="yh-f_blue f14"  onclick='UploadFilesNew(this,"true","p-j-attachment");' filetypeid="0" fileobjid="8888"
                keyvalue="<%=articleId %>" uploadtype="2" tablename="MindMapArticle" keyname="articleId" href="javascript:;">添加附件</a>
            <div id="p-j-attachment" class="p-border_gray p5 mt5">
        <%
                foreach (var file in fileList)
                {
                    var imgUrl = file.String("thumbPicPath").Replace("_m.", "_um.");
                    var relModel =dataOp.FindOneByQuery("FileRelation",Query.EQ("fileId", file.String("fileId"))) ;
                    var fileRelId = relModel != null ? relModel.Int("fileRelId") : 0;
            %>
            <div class="p2 p-hoverShow p-hoverShow_inlineblock"><i class="p-icon_annex mr5"></i><%=file.String("name") %><a href="javascript:void(0);" class="pl5 p-hoverShow-itm" onclick='DeleteFiles("<%=fileRelId%>",reloadFileList,this)'><i class="p-icon_del"></i></a></div>
            <%} %>
            </div>
        </div>
        <!-- 编辑器 -->
        <div class="c_bg_eee h450"> 
            <script id="articleEditor" type="text/plain" style="width: 100%; height: 80%"><%=Server.UrlDecode(article.String("content"))%></script>
        </div>
        <div class="p-saveBar">
            <a href="javascript:;" onclick="SaveData()" class="p-btn p-btn_blue p-btn_large">保存</a>
        </div>
    </div>
    <div class="h100 clear"></div><%--div,h100勿删，防止foot脚注遮挡--%>
    <script>
        //Home/GetSingleTableJson/?tableName=MindMapLabelCollection&ps=10&qu=db.MindMapLabelCollection.distinct("_id",{"name":/' + "" + '.*/})

    var mindMapId = "<%=mindMapId%>";
    var curLabelId = "<%=curLabelId%>";
    var curLabeName = "<%=labelName%>";
    var articleEditor = UE.getEditor('articleEditor');
     
    $(document).ready(function () {
        if (curLabeName !== "") {
            var $target = $('#tags_collection');
            $target.html('');
            var html = '<span labelid="' + curLabelId + '" class="chip truncate base-tag p-element_tag p-hoverShow p-hoverShow_inlineblock" data-tag="'
                     + curLabeName + '">' + curLabeName + '<i class="p-icon_del p-hoverShow-itm"></i></span>';
            $target.html(html);
        }
    });
    
    function getFormData() {
        var formData = {};
        $('#articleEdit').find('input[name]').each(function () {
            var cur = $(this);
            formData[cur.prop('name')] = $.trim(cur.val());
        });
        return formData;
    }
    ///保存
    function SaveData() {
        var labelInfo = getlabels();
        var formdata = getFormData();
        formdata["content"] = escape(articleEditor.getContent());
        formdata["labelIds"] = labelInfo.labIds;
        formdata["addLabelNames"] = labelInfo.addLabNames;
        
        $.ajax({
            url: "/KnowledgeMindMap/SaveArticle",
            type: 'post',
            data: formdata,
            dataType: 'json',
            error: function () {
                MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试！", 5,2000);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5,2000);
                }
                else {
                    var FileInfo = data.FileInfo;
                    var str = FileInfo.split("|");
                    var result = eval("(" + str[0] + ")");
                    var fileIdList = "";
                    if (result.success) {
                        if (str.length > 1) {
                            if (str[1] != "") {
                                var files = eval("(" + str[1] + ")");
                                ClientUploadFile(files);
                            }
                        }
                    }
                    //setTimeout(function () { window.location.reload(); }, 50);
                    //alert("保存成功！");
                    MZ.msgbox.show("保存成功", 1, 2000);
                    setTimeout(function () { window.location.href = "/KnowledgeMindMap/MindMapArticleView?articleId=" + data.htInfo.articleId; }, 50);
                }
            }
        });
    }
    //获取新增标签及现有标签
    function getlabels() {
        var tags = $('#tags_collection').children(),oldTags=[], newTags=[];
        tags.each(function () {
            var cur = $(this);
            if (cur.attr('labelid')) {
                oldTags[oldTags.length] = cur.attr('labelid');
            } else {
                newTags[newTags.length] = $.trim(cur.text());
            }
        });
        return {
            labIds: oldTags.join(','),
            addLabNames: newTags.join(',')
        }
    }

    $('#seachWordValue').showSearchList({ target: $("#tags_collection") });

    function addFileTr() {
        var html = "<span>";
        html += FileName + " ";
        html += ' <a href="javascript:void(0);" class="red" Num="' + FileMathNum + '" path="' + FilePath + '" onclick=\'delFileRow(this)\'>删除</a>';
        html += "</span>";
        $("#" + fileTableId).append(html);
    }

    function delFileRow(obj) {
        $(obj).parent().remove();
        var tempPath = $(obj).attr("path");
        var tempUploadFileList = $("#uploadFileList").val();
        if (tempUploadFileList.indexOf(tempPath + "|H|") != -1) {
            $("#uploadFileList").val(tempUploadFileList.replace(tempPath + "|H|", ""));
        }
        else if (tempUploadFileList.indexOf(tempPath) != -1) {
            $("#uploadFileList").val(tempUploadFileList.replace(tempPath, ""));
        }
    } 

    function reloadFileList(obj) {
        $(obj).parent().remove();
    }
    </script>
</asp:Content>
