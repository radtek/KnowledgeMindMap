using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Yinhe.ProcessingCenter;

namespace ChatRoom.Hubs
{
    [HubName("chatHub")]
    public class ChatHub : Hub, IChatHub
    {
        private IList<UserInfo> userList = ChatUserCache.userList;

        //连接启动
        public override System.Threading.Tasks.Task OnConnected()
        {
            string identity = this.Context.User.Identity.Name;
            var userArray = identity.Split(new string[] { "\\" }, StringSplitOptions.RemoveEmptyEntries);
            if (userArray.Length == 2)
            {
                SendLogin(userArray[0], userArray[1]);
            }
            return base.OnConnected();
        }
        //重新连接
        public override System.Threading.Tasks.Task OnReconnected()
        {
            string identity = this.Context.User.Identity.Name;
            var userArray = identity.Split(new string[] { "\\" }, StringSplitOptions.RemoveEmptyEntries);
            if (userArray.Length == 2)
            {
                SendLogin(userArray[0], userArray[1]);
            }
            return base.OnReconnected();
        }
        //断开连接
        public override System.Threading.Tasks.Task OnDisconnected()
        {
            string identity = this.Context.User.Identity.Name;
            var userArray = identity.Split(new string[] { "\\" }, StringSplitOptions.RemoveEmptyEntries);
            if (userArray.Length == 2)
            {
                SendLogoff(userArray[0], userArray[1]);
            }
            return base.OnDisconnected();
        }

        public void SendChat(string id, string name, string message)
        {
            message = HttpUtility.UrlDecode(message);
            name = name + " " + DateTime.Now.ToString("HH:mm:ss");
            #region 消息缓存队列
            var msgListCacheKey = string.Format("EXPERT_MESSAGELISTCACHEKEY");
            var msgList = CacheHelper.GetCache(msgListCacheKey) as List<string> ?? new List<string>();
            msgList.Add(string.Format("{0},{1},{2}", id, name, message));
            CacheHelper.SetCache(msgListCacheKey, msgList, null, DateTime.Now.AddHours(1));
            #endregion
            Clients.All.addNewMessageToPage(id, name, message);
        }

        //public void TriggerHeartbeat(string id, string name)
        //{
        //    var userInfo = userList.Where(x => x.ID.Equals(id) && x.Name.Equals(name)).FirstOrDefault();
        //    if (userInfo != null)
        //        userInfo.count = 0;  //收到心跳，重置计数器
        //}

        public void SendLogin(string id, string name)
        {
            var userInfo = new UserInfo() { ID = id, Name = name };

            var comparison = new ChatUserCompare();
            var userInfoToComp = userList.Where(x => x.ID.Equals(id)).FirstOrDefault();
            if (!userList.Contains<UserInfo>(userInfo, comparison) && userInfoToComp == null)
            {
                userList.Add(userInfo);
            }

            Clients.All.loginUser(userList);
        }

        public void SendLogoff(string id, string name)
        {
            var userInfo = userList.Where(x => x.ID.Equals(id) && x.Name.Equals(name)).FirstOrDefault();
            if (userInfo != null)
            {
                if (userList.Remove(userInfo))
                {
                    Clients.All.logoffUser(userList);
                }
            }
        }

        public void Send(string message)
        {
            Clients.All.getNewMessage(message);
        }

        public void updateMsg(string username, string message, string dateTime)
        {
            #region 获得物品记录缓存
            var msgListCacheKey = string.Format("EXPERT_ITEMLISTCACHEKEY");
            var msgList = CacheHelper.GetCache(msgListCacheKey) as List<string> ?? new List<string>();
            var msgStr = string.Format("{0},{1},{2}", username, message, dateTime);
            if (msgList.Contains(msgStr))//重复添加
            {
                return;
            }
            if (msgList.Count >= 10) //限制10条记录
            {
                msgList.RemoveAt(0); //出栈
            }
            msgList.Add(msgStr);
            CacheHelper.SetCache(msgListCacheKey, msgList, null, DateTime.Now.AddDays(1));
            #endregion
            //广播
            Clients.All.getupdateMsg(username, message, dateTime);
        }

    }
}