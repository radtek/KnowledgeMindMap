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
        var curUserId = PageReq.GetParam("userId");
        var userName = Server.UrlDecode(PageReq.GetParam("userName"));
        if (string.IsNullOrEmpty(curUserId))
        {
            curUserId = this.CurrentUserId.ToString();
        }
        BsonDocument userInfo =null;
        if (!string.IsNullOrEmpty(userName))
        {
            userInfo = dataOp.FindAllByQuery("SysUser", Query.EQ("name", userName.Trim())).FirstOrDefault();
        }
        if (userInfo == null)
        {
            userInfo = dataOp.FindAllByQuery("SysUser", Query.EQ("userId", curUserId)).FirstOrDefault();
        }
        curUserId = userInfo.Text("userId");
        //该用户历史以来爆的奖励
        var EPersonItemList = dataOp.FindAllByQuery("Expert_PersonItem", Query.EQ("userId", curUserId)).ToList();
        var EPersonItemList_last15 = EPersonItemList.OrderByDescending(i => i.Date("createDate")).Take(15).ToList();

        var list = EPersonItemList_last15.GroupBy(l => l.ShortDate("createDate"));
        
        //用户名
        var username = this.CurrentUserName;
       
        var personLevel = dataOp.FindAllByQuery("PersonLevel", Query.EQ("level",(userInfo.Int("level") + 1).ToString())).FirstOrDefault();
        var sumMoney = 0;
        var itemHelper = new MZ.BusinessLogicLayer.ItemHelper();
        var allItem = itemHelper.GetAllItem();
        foreach (var personitem in EPersonItemList)
        {
           var hitItem = allItem.Where(c => personitem.Text("itemId") == c.Text("_id")).FirstOrDefault();
           if(hitItem==null) continue;
           sumMoney+=hitItem.Int("value");
           
        }
       
    %>

    <!--正文部分-->
            <div class="p-content mt30 clearfix">
                <div class="p-pageLeft" style=" width:600px; border-right:1px dashed #ccc; padding-left:0;">
                    <div class="p-personalInfoBox clearfix">
                        <div class="b fl p-userImg">
                            <img alt="" src="../../Content/images/client/InfoExpert/head-sculpture.png" />
                        </div>
                        <div class="personalInfo">
                            <ul class="userName clearfix bb mb10">
                                <li class="name"><%=userInfo.Text("name")%></li>
                                <li class="userlevel">
                                    <img class="inline-block mt-5" alt="" src="../../Content/images/client/InfoExpert/icon/icon-level_small.png" /><%=userInfo.Int("level")%>
                                </li>
                                <li class="fl ml10 fb c_666" style="margin-top:8px;">
                                    <i class="p-icon-moneyBag"></i>
                                    金币:<%=sumMoney %>
                                </li>
                                <li class="fl ml10 fb c_666" style="margin-top:8px; ">
                                      <i class="p-icon_upload mr5"></i>
                                      <a href="/KnowledgeMindMap/MindMapUpLoadArticle?userId=<%=userInfo.Text("userId") %>">查看文章</a>
                                    
                                </li>
                                <li class="fl ml10 fb c_666" style="margin-top:8px;">
                                 <i class="p-icon_favoriate mr5"></i>
                                     <a href="/KnowledgeMindMap/MindMapFavoriateArticle?userId=<%=userInfo.Text("userId") %>">查看收藏</a>
                                     </li>
                            </ul>
                            <ul class="userDetail">
                                <%--<li class="clearfix"><a class="p-infoEdit"></a></li>--%>
                                <li>联系方式：<br /><span><%=userInfo.Text("phoneNumber")%></span></li>
                                <li>电子邮箱：<br /><span><%=userInfo.Text("emailAddr")%></span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="p-column">
                        <div class="title">
                            <i class="p-userlevel mr10"></i>等级详情</div>
                        <div class="p-curLevel">
                            当前等级：<img class="inline-block ml10 mt-10" alt="" src="../../Content/images/client/InfoExpert/icon/icon-level_big.png" /><span><%=userInfo.Int("level")%></span>
                        </div>
                        <ul>
                            <li id="width" class="c_bbb clearfix mb5">
                                <span class="fr"><%=userInfo.Int("exp")%></span>
                            </li>
                            <li>
                                <div class="p-levelExp">
                                    <div class="p-curExp" ></div>
                                </div>
                            </li>
                            <li class="c_bbb mt5">
                                <span class="fl">0</span>
                                <span class="fr"><%=personLevel.Int("levelExp")%></span>
                            </li>
                        </ul>
                        <div class="p-needLevel">
                            距离下一等级<img class="inline-block ml5 mt-5" alt="" src="../../Content/images/client/InfoExpert/icon/icon-level_small.png"><span style=""><%=userInfo.Int("level") + 1%></span>
                            还需：<i><%=personLevel.Int("levelExp") - userInfo.Int("exp")%>Exp</i>
                        </div>
                    </div>
                </div>
                <div class="p-pageRight" style=" padding-left:40px; width:519px;">
                    <div class="p-column">
                        <div class="title mb15">
                            <i class="p-tablelist mr5"></i>获奖记录
                        </div>
                        <div class="p-awardList">
                            
                            <%foreach (var item in list)
                              {
                                 
                                  var key = item.Key;
                                  var ilist = item.ToList();
                             %>
                                <div class="clearfix">
                                <div class="month">
                                   <%=key%>
                                </div>
                                <ul class="awardList">
                                    <li><i class="point"></i></li>
                                    <%
                                  foreach (var iitem in ilist)
                                  {
                                      var color = "#ecf0f1";
                                      var hitItem = allItem.Where(c => iitem.Text("itemId") == c.Text("_id")).FirstOrDefault();
                                      if (hitItem == null) return;
                                      var rareDropItemClass = false;
                                      switch (iitem.Int("rarity"))
                                      {
                                          case 0://白
                                              color = "";

                                              break;
                                          case 1://蓝
                                              color = "#3498db";
                                          
                                              break;
                                          case 2://紫
                                              color = "#8e44ad";

                                              break;
                                          case 3://粉
                                              color = "#C0139E";
                                              rareDropItemClass = true;
                                              break;
                                          case 4://传奇
                                              color = "#e74c3c";
                                              rareDropItemClass = true;
                                              //因为

                                              break;
                                          case 5://ss
                                              color = "#f1c40f";
                                              rareDropItemClass = true;

                                              break;
                                      }
                                      %>
                                    <li><span><%= iitem.Text("createDate").Split(' ')[1] %></span>开启红包,获得
                                    <font title="<%=hitItem.Text("remark") %>"  style=" color:<%=color%>"><%=iitem.Text("name")%></font>
                                    
                                    </li>
                                    <%} %>
                                </ul>
                            </div>
                             <%
                              } %>

                        </div>
                    </div>
                </div>
            </div>
            <!--正文部分结束-->
            <script type="text/javascript">
                $(document).ready(function () {
                    function widthcon(exp, levelexp, obj) {
                        var obj_width = exp / levelexp * 100 + "%";
                        $(obj).css('width', obj_width)
                    }
                    widthcon('<%=userInfo.Int("exp")%>', '<%=personLevel.Int("levelExp")%>', '.p-curExp');
                    widthcon('<%=userInfo.Int("exp")%>', '<%=personLevel.Int("levelExp")%>', '#width');
                });
    </script>
</asp:Content>


