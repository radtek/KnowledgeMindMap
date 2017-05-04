<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<%
    var type = PageReq.GetParam("type");
    var labelId = PageReq.GetParam("labelId");
    var userId = PageReq.GetParam("userId");
    var keyWord = Server.UrlDecode(PageReq.GetParam("keyWord"));
    var pageSize = 12;
    var sortType = PageReq.GetParam("sortType");
    if (string.IsNullOrEmpty(sortType))
    {
        sortType = "score";
    }
 %>
                    
                    <div class="p-title_1">
                        <i class="p-tablelist mr5"></i>相关文章(<span id="countSpan"></span>)</div>
                        <div class="fr mt-30">
                        <div class="p-ArticleSort">
                            <ul>
                                <li name="sortType" <%if(sortType=="score"){ %>class="select"<%} %> title="按综合从高到底" sortType="score">综合<i class="icon-arrow-down ml5"></i></li>
                                <li name="sortType" <%if(sortType=="createDate"){ %>class="select"<%} %>  sortType="createDate" title="按最新发布时间">发布时间<i class="icon-arrow-down ml5"></i></li>
                                <li name="sortType" <%if(sortType=="viewCount"){ %>class="select"<%} %> title="按浏览量从高到低" sortType="viewCount">人气浏览<i class="icon-arrow-down ml5"></i></li>
                                <li name="sortType" <%if(sortType=="favoriateCount"){ %>class="select"<%} %> title="按收藏量从高到低"  sortType="favoriateCount">加入收藏<i class="icon-arrow-down ml5"></i></li>
                            </ul>
                        </div>
                    </div>
                    <div class="m10" >
                    <ul id="ulArticleList" class="contain contain_nav p-module_article p-module_article_1 clearfix">
                      </ul>
                    </div>
       
  <div id="isloading" style="margin:0 auto;text-align:center; display:none; width:100%; height:50px;"></div>
   
   <script type="text/javascript">
        var pageNum = 1;
        var range = 50;             //距下边界长度/单位px
        var flag = true;
        var main = $("#ulArticleList");  //主体元素
        var isLoading = false;
        var sortType = "<%=sortType %>";
        $(document).ready(function () {

            LoadData(1);
            $(window).scroll(function () {
                var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
                var toTop = document.body.scrollTop > document.documentElement.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
                var toBottom = $(document).height() - document.body.clientHeight - toTop;
                if (toBottom <= range && flag) { //请求
                    if (isLoading) return false;
                    isLoading = true;
                    $("#isloading").html("—玩命加载中—");
                    $("#isloading").css("display", "block");
                    LoadData();
                }
                if (!flag) {
                    $("#isloading").html("");
                    $("#isloading").css("display", "block");
                }
            });
            $("li[name='sortType']").click(function () {
                SortData(this)
            });
        });

        function SortData(obj) {
            sortType = $(obj).attr("sortType");
            var lurl = $("#articleList").attr("lurl");
            // var lurl = window.location.href;
            if (lurl.indexOf("?") != -1) {
                lurl += "&sortType=" + sortType;
            } else {
                lurl += "?sortType=" + sortType;
            }
            $("#articleList").load(lurl);
        }
       function LoadData() {
           $.ajax({
               url: "/KnowledgeMindMap/GetHitArticleListData",
               type: 'post',
               async: false,
               data: {
                   type: "<%=type %>",
                   labelId: "<%=labelId %>",
                   pageNum: pageNum,
                   pageSize: "<%=pageSize %>", keyWord: "<%=keyWord %>", sortType: sortType,
                   userId: "<%=userId %>"
               },
               dataType: 'json',
               error: function () {
                   isLoading = false;
                   MZ.msgbox.show('未知错误，请联系服务器管理员，或者刷新页面重试', 5);
               },
               success: function (data) {
                   isLoading = false;
                   $("#isloading").css("display", "none");
                   if (data.Success == false) {
                       MZ.msgbox.show(data.Message, 5);
                   }
                   else {
                       var html = InitHtml(data.data);
                       main.append(html);
                       flag = data.flag;
                       pageNum++;
                       if (typeof ($("#countSpan")) != "undefined")
                           $("#countSpan").html(data.allRecordCount);
                   }
               }
           });
       }

       function InitHtml(data) {
         
          var html = '';
          var dataObj = JSON.parse(data);
          for (var i = 0; i < dataObj.length; i++) {
              var article = dataObj[i];
              var labList = article.labelIds;
              
              html += '<li class="p-hoverShow">';
              html += '<div class="ArtContent">';
              html += '<div >';
              html += '<h3 class="mb10"><a class="digest blue" title="' + article.name + '" href="/KnowledgeMindMap/MindMapArticleView?articleId=' + article.articleId + '">' + article.shortName + '</a></h3>';
              for (var j = 0; j < labList.length;j++) {
                  label = labList[j];
                  html += '<a href="/KnowledgeMindMap/MindMapLabelDetail?labelId=' + label.labelId + '" class="p-element_tag mb5">' + label.name + '</a>';
              }
              html += '</div>';
              html += '</div>';
              html += ' <div class="Artdesign">';
              html += '  <span title="创建人"><i class="icon-user mr2"></i>' + article.createUserName + '</span>&nbsp;&nbsp;';
              html += '  <span title="评论数：' + article.replyCount + '"><i class="icon-comments iconx mr2"></i>' + article.replyCount + '</span>';
              html += '  <span class="ml10" title="阅读量：' + article.viewCount + '"><i class="icon-file-text-o iconx mr2"></i>' + article.viewCount + '</span>';
              html += '  <span class="ml10" title="收藏量：' + article.favoriateCount + '"><i class="icon-star-o iconx mr2"></i>' + article.favoriateCount + '</span>';
              html += '  <span class="ml10" title="点赞数：' + article.priseCount + '"><i class="icon-thumbs-o-up iconx mr2"></i>' + article.priseCount + '</span>';
              html += '  <span class="fr">' + article.updateDate + '</span>';
              html += '  <i class="hidden icon-locked  orange-text text-accent-3"></i>';
              html += '</div>';
              html += '</li>';
          }
            return html;
       
       }
    </script>