<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Blank.Master" Inherits="Yinhe.ProcessingCenter.ViewPageBase" %>

<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="HeadContent" runat="server">
    <!-- box 弹窗依赖 -->
    <link href="<%=SysAppConfig.HostDomain %>/Scripts/Reference/jQuery/JQueryUi_bs/css/jquery-ui-1.9.2.custom.css"
        rel="stylesheet" type="text/css" />
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Reference/jQuery/JQueryUi_bs/jquery-ui-1.9.2.custom.js"
        type="text/javascript"></script>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Reference/jQuery/livequery.js"
        type="text/javascript"></script>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Modules/jquery.yinhoo.js" type="text/javascript"></script>
    <!-- 提示信息插件 -->
    <link href="<%=SysAppConfig.HostDomain %>/Scripts/Reference/msgbox/msgbox.css" rel="stylesheet"
        type="text/css" />
    <%--<script src="<%=SysAppConfig.HostDomain %>/Scripts/Reference/msgbox/msgbox.min.js" type="text/javascript"></script>--%>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Reference/msgbox/msgbox.js" type="text/javascript"></script>
    <link href="<%=SysAppConfig.HostDomain %>/Content/css/client/InfoExpert/InfoExpert.css"
        rel="stylesheet" type="text/css" />
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Modules/Common/YH.js" type="text/javascript"></script>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Modules/Common/jquery.bgiframe.js"
        type="text/javascript"></script>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Modules/Common/popbox.js" type="text/javascript"></script>
    <script src="<%=SysAppConfig.HostDomain %>/Scripts/Modules/Common/CommonFunc.js"
        type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <%
        var keyWord = Server.UrlDecode(PageReq.GetParam("keyWord"));
        var oldKeyWord = Server.UrlDecode(PageReq.GetParam("oldKeyWord"));
        SortByDocument sort = new SortByDocument { { "searchCount", -1 } };//最近的
        var hotLabelList = dataOp.FindLimitByQuery("MindMapLabelCollection", Query.NE("searchCount", "0"), sort, 0, 6).Select(c => c.Text("name")).ToList();
        var allArticleCount = dataOp.FindCount("MindMapArticle");
    %>
    <style>
        #footer
        {
            background: none;
            border: 0;
        }
    </style>
    <div id="yh-layout">
        <div id="yh-layout-content">
            <!--正文部分-->
            <div id="container">
                <div class="p-indexheader p-icon_entry p-hoverShow">
                    <span class="p-transpart"><i class="p-icon_user mr5"></i><a href="/KnowledgeMindMap/MindMapUpLoadArticle">
                        <%=dataOp.GetCurrentUserName() %><i class="icon-sort-down ml5" style="vertical-align: top"></i></a></span>
                    <div class="p-headerSwitch p-hoverShow-itm">
                        <ul>
                            <li><a href="/KnowledgeMindMap/MindMapInfoList"><i class="p-icon_chart mr5"></i>脉络图</a></li>
                            <li><a href="/KnowledgeMindMap/PersonalCenter"><i class="p-icon_user mr5"></i>个人中心</a></li>
                            <li><a href="/KnowledgeMindMap/MindMapArticleNow"><i class="p-icon_upload mr5"></i>上传文章</a></li>
                            <li><a href="/KnowledgeMindMap/MindMapFavoriateArticle"><i class="p-icon_favoriate mr5"></i>我的收藏</a></li>
                            <li><a href="javascript:void(0);" onclick="return changePassword()"><i class="p-icon_password mr5"></i>修改密码</a></li>
                            <li><a onclick="Logoff();"><i class="p-icon_off mr5"></i>退出账号</a></li>
                        </ul>
                    </div>
                </div>
                <div class="p-search_bg">
                    <div class="p-MZlogo">
                    </div>
                    <div class="p-search_con">
                        <input class="p-search_text p-j-enterSearch" placeholder="力争精准，助力快速成为专家" />
                        <a href="javascript:;" onclick="SearchMineMap()"><i class="icon-search p-search_icon"
                            style="font-size: 20px;"></i></a>
                        <div class="p-countFile">
                            已有<i><%=allArticleCount.ToString()%></i>篇文章</div>
                    </div>
                    <div class="p-search_hot c_333">
                        <span class="c_555">搜索热词：</span>
                        <%foreach (var name in hotLabelList)
                          {%>
                        <a href="javascript:;" onclick="SearchMineMap('<%=name %>')">
                            <%=name %></a>
                        <%} %>
                    </div>
                </div>
            </div>
            <!--正文部分结束-->
        </div>
    </div>
    <script>
        function Logoff() {
            window.location.href = "/Account/Logout";
        }

        function changePassword() {
            var url = "/Account/ChangePassword";
            box(url, { boxid: "_changepassword", contentType: "ajax", width: 250,
                submit_cb: function (o) {
                    var form = o.fbox.find("form");
                    var newPassword = form.find("#newPassword").val();
                    var verify = form.find("#verify").val();

                    if (newPassword != verify) {
                        alert("输入的两次新密码不一样！");
                        return false;
                    }

                    var formdata = form.serialize();
                    $.ajax({
                        type: "post",
                        url: url,
                        data: formdata,
                        async: false,
                        success: function (data) {
                            if (data.success) {
                                $.tmsg("m_jfw", data.msg, { infotype: 1 });
                            } else {
                                $.tmsg("m_jfw", data.msg, { infotype: 2 });
                            }
                        }
                    });

                }
            });
        }
        function SearchMineMap(keyWord) {
            if (!keyWord) {
                keyWord = $(".p-search_text").val();
            }
            if (keyWord != "") {
                var jumpUrl = "/KnowledgeMindMap/MindMapSearch?keyWord=" + escape(keyWord) + "&oldKeyWord=" + escape("<%=keyWord %>");
                window.location.href = jumpUrl;
            } else {
                MZ.msgbox.show("请输入关键字", 1, 2000);
            }
        }
        //回车搜索
        $('.p-j-enterSearch').on('keyup', function (event) {
            if (event.keyCode == "13") {
                var keyWord = $.trim($(this).val());
                SearchMineMap(keyWord);
            }
        });
    </script>
</asp:Content>
