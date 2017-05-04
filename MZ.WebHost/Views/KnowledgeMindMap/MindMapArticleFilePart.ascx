<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Document" %>
 <%
     var dataOp = new DataOperation();
     
     
     var fileId = PageReq.GetParam("fileId");//文件Id
     var fileInfo = dataOp.FindOneByQuery("FileLibrary", Query.EQ("fileId", fileId));
     
     
      %>

  <div class="mt15 c_bg_fff" id="pdf_Online_PageTarget">
    <% if (fileInfo.String("onlineFilePath") != "")
    {
        var gk = fileInfo.String("onlineFilePath").Split('/');
        var ext = gk[gk.Length - 1].Split('.')[1].ToString();
        if (ext == "pdf")
        {
            Uri uri = new Uri(fileInfo.String("onlineFilePath"));
            var hostAddr = "http://" + uri.Authority;
            %>
            <script>
                if (typeof (Worker) !== "undefined") {
                    $("#pdf_Online_PageTarget").html('<div style="border:1px solid #d3d3d3; box-shadow:0 1px 3px #d3d3d3;" ><iframe src="<%= hostAddr%>/web/viewer.html?file=<%=fileInfo.String("onlineFilePath") %>" style="width:100%; height:550px;" align="middle"></iframe></div>');
                } else {
                    $("#pdf_Online_PageTarget").html('<div class="yh-msg">当前浏览器不支持页面预览！<a href="javascript:void(0);" onclick="<%= FileCommonOperation.GetClientOnlineRead(fileInfo)%>" class="p-btn p-btn_brown_1">点此查看文件</a></div>');
                }
            </script>
        <%}
        else if (ext == "html" || ext == "jpg" || ext == "png")
        {%>
            <div style="border:1px solid #d3d3d3; box-shadow:0 1px 3px #d3d3d3;" >
                <iframe src="<%=fileInfo.String("onlineFilePath") %>" style="width:100%; height:550px;" align="middle"></iframe>
            </div>
        <%}
        else if (ext == "dwg")
        {%>
            <div class="yh-msg">当前文件不支持页面预览！<a href="javascript:void(0);" onclick="ReadDwgFile('<%=fileInfo.String("onlineFilePath") %>','<%=fileInfo.String("name") %>');" class="p-btn p-btn_brown_1">点此查看文件</a></div>
        <% }
        else
        {%>
                <div class="yh-msg">当前文件不支持在线查看,请下载后再查看！<a href="javascript:void(0);" class="p-btn p-btn_brown_1" onclick='$(".opertmore_con").hide();<%=FileCommonOperation.GetClientDownLoad(fileInfo) %>'>点此下载</a></div>
        <% }

    }
    else
    {
        if (fileInfo.String("guid") != "")
        {%>
            <div class="yh-msg">文件未转化完成,请等待转化完成再查看！</div>
        <% }
        else
        {%>
            <div class="yh-msg">文件未上传,请等待上传完成再查看！</div>
        <%}
    }
    %>
</div>
