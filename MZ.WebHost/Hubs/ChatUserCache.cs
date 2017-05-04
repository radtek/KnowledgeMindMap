using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatRoom.Hubs
{
    public static class ChatUserCache
    {
        //public static IList<UserChat> userList = new List<UserChat>();
        public static IList<UserInfo> userList = new List<UserInfo>();
    }
}