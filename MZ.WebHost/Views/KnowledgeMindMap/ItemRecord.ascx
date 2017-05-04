<%@ Control Language="C#" Inherits="Yinhe.ProcessingCenter.ViewUserControlBase" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Permissions" %>
<%@ Import Namespace="Yinhe.ProcessingCenter.Common" %>
<%
    var recordList = CacheHelper.GetCache("EXPERT_ITEMLISTCACHEKEY") as List<string> ?? new List<string>(); //获取记录缓存v
    var allItem = dataOp.FindAll("Expert_Item").SetFields("name", "rarity").ToList();
%>
<ul class="contain contain_record">
    <%foreach (var item in recordList.Take(13))
      {
          var spiltArray = item.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
          if (spiltArray.Length < 3) continue;
          var name = spiltArray[1];
           
          var color = string.Empty;
          var dropItem = allItem.Where(c => name.Trim().Contains(c.Text("name"))).FirstOrDefault();
          switch (dropItem.Int("rarity"))
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
                 
                  break;
              case 4://传奇
                  color = "#e74c3c";
               
                  //因为
                  break;
              case 5://ss
                  color = "#f1c40f";
                
                  break;
          }
          var uniqueKey = string.Format("{0}_{1}", spiltArray[0],  spiltArray[2]);
          var url = string.Format("/KnowledgeMindMap/PersonalCenter?userName={0}", spiltArray[0].Trim());
    %>
    <li name="itemMsg" uniqueKey="<%=uniqueKey %>"> 
		  <span class="mr5" style="width:42px"><a href="<%=url%>"><%=spiltArray[0].PadRight(3,' ') %></a></span>开启<i class="icon-redBag"></i>，领取了<span style="color:<%=color%>; "><%=name %></span><i class="c_bbb" ><%=spiltArray[2]%></i>
			 </li>
    <%} %>
</ul>
