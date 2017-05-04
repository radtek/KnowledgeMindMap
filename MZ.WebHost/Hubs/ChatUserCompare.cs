using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatRoom.Hubs
{
    public class ChatUserCompare : IEqualityComparer<UserInfo>
    {
        public bool Equals(UserInfo x, UserInfo y)
        {
            return x.ID == y.ID;
        }

        public int GetHashCode(UserInfo obj)
        {
            return obj.GetHashCode();
        }
    }
}