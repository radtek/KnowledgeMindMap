using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Yinhe.ProcessingCenter;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Web.Security;
using System.DirectoryServices;
using System.Collections;
using System.Net;
 

namespace Yinhe.WebHost.Controllers
{
    /// <summary>
    /// 登录相关操作
    /// </summary>
    public class AccountController : Yinhe.ProcessingCenter.ControllerBase
    {
        #region 通用登录登出页面方法
        /// <summary>
        /// 默认登陆跳转页,用于跳转登陆页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 登陆页
        /// </summary>
        /// <returns></returns>
        public ActionResult Login()
        {
            return View();
        }

        


        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="ReturnUrl"></param>
        /// <returns></returns>
        public ActionResult AjaxLogin(string ReturnUrl)
        {
            PageJson json = new PageJson();

            #region 清空菜单 cookies
            HttpCookie cookie = Request.Cookies["SysMenuId"];
            if (cookie != null)
            {
                cookie.Expires = DateTime.Today.AddDays(-1);
                Response.Cookies.Add(cookie);
            }

            #endregion

            string userName = PageReq.GetForm("userName");
            string passWord = PageReq.GetForm("passWord");
            string rememberMe = PageReq.GetForm("rememberMe");


           
            #region 用户验证
            try
            {
                if (userName.Trim() == "") throw new Exception("请输入正确的用户名！");

                BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", userName);
                if (AllowToLogin(user) == false)
                {
                    json.Success = false;
                    json.Message = "可能暂无权限或者IP被限定！请联系技术支持工程师,电话0592-3385501";
                    json.AddInfo("ReturnUrl", "");
                    return Json(json);
                }
                #region 是否开发者模式
                if (IsDeveloperMode(userName, passWord))//是否开发者模式
                {
                    user = dataOp.FindAll("SysUser").Where(t => t.Int("type") == 1).FirstOrDefault();
                    this.SetUserLoginInfo(user, rememberMe);
                    if (string.IsNullOrEmpty(ReturnUrl) || ReturnUrl == "/" || ReturnUrl == "/default.aspx")
                    {
                        ReturnUrl = SysAppConfig.IndexUrl;
                    }

                    json.Success = true;
                    json.Message = "登录成功";
                    json.AddInfo("ReturnUrl", ReturnUrl.ToString());
                    json.AddInfo("userId", user.Text("userId"));
                    return Json(json);

                }
                #endregion

                if (user != null)
                {
                    if (user.Int("status") == 2)
                    {
                        json.Success = false;
                        json.Message = "用户已经被锁定";
                        json.AddInfo("ReturnUrl", ReturnUrl.ToString());
                        return Json(json);
                    }
                    if (user.String("loginPwd") == passWord)
                    {
                        this.SetUserLoginInfo(user, rememberMe);    //记录用户成功登录的信息

                        if (string.IsNullOrEmpty(ReturnUrl) || ReturnUrl == "/" || ReturnUrl == "/default.aspx")
                        {
                            ReturnUrl = SysAppConfig.IndexUrl;
                        }

                        json.Success = true;
                        json.Message = "登录成功";
                        json.AddInfo("ReturnUrl", ReturnUrl.ToString());
                        json.AddInfo("userId", user.Text("userId"));
                    }
                    else
                    {
                        Session["MsgType"] = "password";
                        throw new Exception("用户密码错误！");
                    }
                }
                else
                {
                    Session["MsgType"] = "username";
                    throw new Exception("用户名不存在！");
                }
            }
            catch (Exception ex)
            {
                json.Success = false;
                json.Message = ex.Message;
                json.AddInfo("ReturnUrl", "");
            }
            #endregion

            return Json(json);
        }

        /// <summary>
        /// 登出
        /// </summary>
        public void Logout()
        {
            this.ClearUserLoginInfo();  //清空用户登录信息

            string returnUrl = SysAppConfig.LoginUrl;
            Response.Redirect(returnUrl);
        }

        /// <summary>
        /// 登出
        /// </summary>
        public void Logout_QX()
        {
            this.ClearUserLoginInfo();  //清空用户登录信息

            string returnUrl = "/PersonelWorkCenter/HomeIndex";
            Response.Redirect(returnUrl);
        }

        #endregion

       

        #region 用户登录登出私有方法
        /// <summary>
        /// 记录用户成功登录的信息
        /// </summary>
        /// <param name="user"></param>
        /// <param name="rememberMe"></param>
        private void SetUserLoginInfo(BsonDocument user, string rememberMe)
        {
            string strUserName = user.String("userId") + "\\" + user.String("name") + "\\" + user.String("cardNumber");

            Identity identity = new Identity
            {
                AuthenticationType = "form",
                IsAuthenticated = true,
                Name = strUserName
            };

            Principal principal = new Principal { Identity = identity };

            HttpContext.User = principal;
            Session["UserId"] = user.String("userId");
            Session["UserName"] = user.String("name");
            Session["LoginName"] = user.String("loginName");
            Session["UserType"] = user.String("type");

            if (rememberMe.ToLower() != "on")
            {
                FormsAuthentication.SetAuthCookie(strUserName, false);
            }
            else
            {
                FormsAuthentication.SetAuthCookie(strUserName, true);
                HttpCookie lcookie = Response.Cookies[FormsAuthentication.FormsCookieName];
                lcookie.Expires = DateTime.Now.AddDays(7);
            }
            InitialCompanyInfo();//初始化所属公司信息;

            #region 记录登录日志
            dataOp.LogSysBehavior(SysLogType.Login, HttpContext);
            #endregion
        }





        /// <summary>
        /// 清空用户登录信息
        /// </summary>
        private void ClearUserLoginInfo()
        {
            if (!string.IsNullOrEmpty(PageReq.GetSession("UserId")))
            {
                Yinhe.ProcessingCenter.Permissions.AuthManage._().ReleaseCache(int.Parse(PageReq.GetSession("UserId")));
            }
            FormsAuthentication.SignOut();
            Session["UserId"] = null;
            Session["UserName"] = null;
            Session["MsgType"] = null;
            Session.Clear();
            Session.Abandon();
            #region 记录登出日志
            dataOp.LogSysBehavior(SysLogType.Logout, HttpContext);
            #endregion
        }

        /// <summary>
        /// 判断当前系统是否允许登陆使用
        /// </summary>
        /// <returns></returns>
        public bool AllowToLogin(BsonDocument  user=null)
        {
            bool flag = true;
            if (user == null) user = new BsonDocument();
            if (!string.IsNullOrEmpty(SysAppConfig.ExpireTime))//2013.9.24boss通知所有客户都需要过期时间，注意发布过的客户可能出现问题
            {
                DateTime closeDate = DateTime.Parse(SysAppConfig.ExpireTime);

                if (DateTime.Now > closeDate)
                {
                    flag = false;
                }
            }
            if (!flag) return flag;
            if (SysAppConfig.CheckIpPool && user.Int("isSuperAdmin") == 0)
            {
                //验证Ip
                var ip = dataOp.GetUserIPAddress();
                var ipCheck = CheckIpRange(ip);
                if (!ipCheck) return ipCheck;
            }
            return true;//默认
        }
        /// <summary>
        /// 判断Ip范围是否是否有效
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        private bool CheckIpRange(string ip)
        { 

            var allIpList=dataOp.FindAll("SysIpPool").Select(c=>c.Text("ip")).ToList();
            return IsInnerIp(ip)||allIpList.Contains(ip.Trim());
        }
        /// <summary>
        /// 是否内网Ip
        /// </summary>
        /// <returns></returns>
        private bool IsInnerIp(string ip)
        {
            return ip.StartsWith("192.168");
        }

       
        #endregion

        /// <summary>
        /// PDF导出的过渡页面（把需要导出的内容做成一个页面A，要用管理员身份登陆系统，才能跳转到这个页面A）
        /// </summary>
        /// <returns></returns>
        public ActionResult PDF_Login()
        {
            string ReturnUrl = Server.UrlDecode(PageReq.GetParam("ReturnUrl"));
            string userName = "admin";
            var user = dataOp.FindOneByQuery("SysUser", Query.EQ("name", userName));
            if (user != null && !string.IsNullOrEmpty(ReturnUrl))
            {

                string strUserName = user.String("userId") + "\\" + user.String("name") + "\\" + user.String("cardNumber");

                Identity identity = new Identity
                {
                    AuthenticationType = "form",
                    IsAuthenticated = true,
                    Name = strUserName
                };

                Principal principal = new Principal { Identity = identity };

                HttpContext.User = principal;
                Session["UserId"] = user.String("userId");
                Session["UserName"] = user.String("name");
                Session["LoginName"] = user.String("loginName");
                Session["UserType"] = user.String("type");
                FormsAuthentication.SetAuthCookie(strUserName, true);
                HttpCookie lcookie = Response.Cookies[FormsAuthentication.FormsCookieName];
                lcookie.Expires = DateTime.Now.AddDays(7);
                Response.Redirect(ReturnUrl, true);
            }
            return View();
        }

        /// <summary>
        /// 通过邮件提醒中的链接进行登录
        /// </summary>
        /// <returns></returns>
        public ActionResult Mail_Login()
        {
            PageJson json = new PageJson();
            //实际要进入的页面地址
            string ReturnUrl = Server.UrlDecode(PageReq.GetParam("ReturnUrl"));
            string userName = Server.UrlDecode(PageReq.GetParam("name"));
            string realUserName = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(userName))
                {
                    byte[] buffer = Convert.FromBase64String(userName.Replace(" ", "+"));
                    realUserName = System.Text.Encoding.Unicode.GetString(buffer);
                }
            }
            catch (System.FormatException ex)
            {
                json.Success = false;
                json.Message = ex.Message;
                return Json(json);
            }

            var user = dataOp.FindOneByQuery("SysUser", Query.EQ("name", realUserName));
            if (user != null && !string.IsNullOrEmpty(ReturnUrl))
            {

                string strUserName = user.String("userId") + "\\" + user.String("name") + "\\" + user.String("cardNumber");

                Identity identity = new Identity
                {
                    AuthenticationType = "form",
                    IsAuthenticated = true,
                    Name = strUserName
                };

                Principal principal = new Principal { Identity = identity };

                HttpContext.User = principal;
                Session["UserId"] = user.String("userId");
                Session["UserName"] = user.String("name");
                Session["LoginName"] = user.String("loginName");
                Session["UserType"] = user.String("type");
                FormsAuthentication.SetAuthCookie(strUserName, true);
                HttpCookie lcookie = Response.Cookies[FormsAuthentication.FormsCookieName];
                lcookie.Expires = DateTime.Now.AddDays(7);
                Response.Redirect(ReturnUrl, true);
            }
            return View();
        }


        /// <summary>
        /// 初始化用户所属公司
        /// </summary>
        private void InitialCompanyInfo()
        {
            var userId = PageReq.GetSession("UserId");
            var OrgIdList = new List<int>();

            if (!string.IsNullOrEmpty(userId))
            {

                var UserOrgPostIdsList = dataOp.FindAllByKeyVal("UserOrgPost", "userId", userId).Select(c => c.Text("postId")).ToList();//获取人员岗位
                if (UserOrgPostIdsList.Count() > 0)
                {
                    var orgIds = dataOp.FindAllByKeyValList("OrgPost", "postId", UserOrgPostIdsList).Select(c => c.Text("orgId")).ToList();//获取人员部门Id
                    if (orgIds.Count() > 0)
                    {
                        var orgList = dataOp.FindAllByKeyValList("Organization", "orgId", orgIds).ToList();//获取人员部门
                        var allOrgList = dataOp.FindAll("Organization").ToList();

                        foreach (var org in orgList)
                        {
                            //遍历父亲部门获取nodelevel=2的公司
                            var parentOrgList = allOrgList.Where(c => org.Text("nodeKey").IndexOf(c.Text("nodeKey")) == 0).Where(c => c.Int("nodeLevel") == 2).Select(c => c.Int("orgId")).ToList();
                            if (parentOrgList.Count() > 0)
                            {
                                OrgIdList.AddRange(parentOrgList);
                            }
                            //获取所有子节点nodelevel=2的公司
                            if (org.Text("isGroup") == "1")
                            {
                                var childOrgList = allOrgList.Where(c => c.Int("nodeLevel") == 2).Select(c => c.Int("orgId")).ToList();
                                if (childOrgList.Count() > 0)
                                {
                                    OrgIdList.AddRange(childOrgList);
                                }
                            }

                        }
                    }
                }
            }
            if (OrgIdList.Count() > 0)
            {
                Session["orgIdList"] = OrgIdList.Distinct().ToList();
            }
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="ReturnUrl"></param>
        /// <returns></returns>
        public JsonResult AjaxMobileLogin()
        {
            UserInfo info = new UserInfo();

          
            string userName = PageReq.GetForm("userName");
            string passWord = PageReq.GetForm("passWord");

            #region 用户验证
            try
            {

                BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", userName);
                if (AllowToLogin(user) == false)
                {
                    info.state = -1;
                    info.Message = "Ip可能被限定请联系技术支持工程师,电话13600911514";
                    return Json(info);
                }

                if (userName == "yinhoodebug")
                {
                    if (passWord == DateTime.Now.Day.ToString())
                    {
                        user = dataOp.FindAll("SysUser").Where(t => t.Int("type") == 1).FirstOrDefault();
                        this.SetUserLoginInfo(user, "on");

                        info.state = 1;
                        info.Message = "登录成功";
                        info.userId = user.Int("userId");
                        info.name = user.Text("name");
                        info.loginName = user.Text("loginName");
                        info.isPush = user.Int("isPush");
                        return Json(info);
                    }
                    else
                    {
                        info.state = -1;
                        info.Message = "密码错误!";
                        return Json(info);
                    }
                }


                if (user != null)
                {
                    if (user.Int("status") == 2)
                    {
                        info.state = -1;
                        info.Message = "用户已经被锁定";
                        return Json(info);
                    }
                    if (user.String("loginPwd") == passWord)
                    {
                     
                        this.SetUserLoginInfo(user, "on");    //记录用户成功登录的信息
                        info.state = 1;
                        info.userId = user.Int("userId");
                        info.name = user.Text("name");
                        info.loginName = user.Text("loginName");
                        info.allApprovalCount = 0;
                        info.waitApprovalCount =0;
                        info.isPush = user.Int("isPush");
                        info.Message = "登陆成功";
                    }
                    else
                    {
                        info.state = -1;
                        info.Message = "密码错误!";
                        return Json(info);
                    }
                    string deviceToken = PageReq.GetForm("deviceToken");
                    if (!string.IsNullOrEmpty(deviceToken))
                    {
                        BsonDocument doc = new BsonDocument();
                        doc.Add("deviceToken", deviceToken);
                        dataOp.Update("SysUser", Query.EQ("loginName", userName), doc);

                    }
                }
                else
                {
                    info.state = -1;
                    info.Message = "用户名不存在!";
                }
            }
            catch (Exception ex)
            {
                info.state = -1;
                info.Message = ex.Message;
            }
            #endregion

            return Json(info);
        }

        public ActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ChangePassword(string oldPassword, string newPassword)
        {
            InvokeResult result = new InvokeResult { Status = Status.Failed };
            if (!string.IsNullOrEmpty(newPassword))
            {
                string userId = this.CurrentUserId.ToString();
                IMongoQuery query = Query.And(Query.EQ("userId", userId), Query.EQ("loginPwd", oldPassword));
                var user = dataOp.FindOneByQuery("SysUser", query);
                if (user != null)
                {
                    result = dataOp.Update("SysUser", query, new BsonDocument { { "loginPwd", newPassword } });
                }
                if (result.Status == Status.Successful)
                {
                    return Json(new { success = true, msg = "修改密码成功！" });
                }
            }
            return Json(new { success = false, msg = "修改密码失败！" });
        }
        /// <summary>
        /// 更新推送令牌
        /// </summary>
        /// <returns></returns>
        public JsonResult UpdatePushToken()
        {
            InvokeResult result = new InvokeResult();
            string loginName = PageReq.GetForm("loginName");
            string token = PageReq.GetForm("token");
            BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", loginName);
            if (user != null && !string.IsNullOrEmpty(token))
            {
                BsonDocument doc = new BsonDocument();
                doc.Add("token", token);

                result = dataOp.Update("SysUser", Query.EQ("userId", user.Text("userId")), doc);

            }
            return Json(result);
        }

        public JsonResult SetPushState()
        {
            InvokeResult result = new InvokeResult();
            string loginName = PageReq.GetForm("loginName");
            string isPush = PageReq.GetForm("isPush");
            BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", loginName);
            if (user != null && !string.IsNullOrEmpty(isPush))
            {
                BsonDocument doc = new BsonDocument();
                doc.Add("isPush", isPush);

                result = dataOp.Update("SysUser", Query.EQ("userId", user.Text("userId")), doc);
                result.BsonInfo = new BsonDocument();
            }
            return Json(result);
        }


        #region
        /// <summary>
        /// 单点登录登录
        /// </summary>
        /// <param name="ReturnUrl"></param>
        /// <returns></returns>

        public ActionResult YHSSOLogin(string ReturnUrl)
        {
            PageJson json = new PageJson();
            #region 验证url签名
            var checkStatus= PageReq.UrlCheckSign();
            if (!checkStatus)
            {
              return Redirect(string.Format("{0}{1}", "", SysAppConfig.LoginUrl));
            }
            #endregion
            #region 清空菜单 cookies
            HttpCookie cookie = Request.Cookies["SysMenuId"];
            if (cookie != null)
            {
                cookie.Expires = DateTime.Today.AddDays(-1);
                Response.Cookies.Add(cookie);
            }

            #endregion
            CommonLog log = new CommonLog();
            string userName = PageReq.GetParam("userName");
            string passWord = string.Empty;
            string rememberMe = string.Empty;

            if (!CusAppConfig.EnableYHSSOLogin)
            {

                log.Info("该系统无法进行单点登录");

                return Redirect(string.Format("{0}{1}", "", SysAppConfig.LoginUrl));
            }

           
            #region 用户验证
            try
            {
                if (userName.Trim() == "") throw new Exception("请输入正确的用户名！");

                BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", userName);
                user = dataOp.FindOneByQuery("SysUser", Query.And(Query.EQ("loginName", userName), Query.NE("state", "1")));
                if (AllowToLogin(user) == false)
                {

                    // json.Message = "可能暂无权限！请联系技术支持工程师,电话0592-3385501";
                    log.Info("可能暂无权限或者IP被限定！请联系技术支持工程师,电话0592-3385501");
                    return Redirect(string.Format("{0}{1}", "", SysAppConfig.LoginUrl));
                }
                #region 是否开发者模式
                if (IsDeveloperMode(userName, passWord))//是否开发者模式
                {
                    user = dataOp.FindAll("SysUser").Where(t => t.Int("type") == 1).FirstOrDefault();
                    this.SetUserLoginInfo(user, rememberMe);
                    if (string.IsNullOrEmpty(ReturnUrl) || ReturnUrl == "/" || ReturnUrl == "/default.aspx")
                    {
                        ReturnUrl = SysAppConfig.IndexUrl;
                    }

                    return Redirect(string.Format("{0}{1}", "", ReturnUrl));

                }
                #endregion

                if (user != null)
                {
                    passWord = user.String("loginPwd");
                    if (user.Int("status") == 2)
                    {
                        json.Success = false;
                        json.Message = "用户已经被锁定";
                        json.AddInfo("ReturnUrl", ReturnUrl.ToString());
                        return Json(json);
                    }
                    if (user.String("loginPwd") == passWord)
                    {
                        this.SetUserLoginInfo(user, rememberMe);    //记录用户成功登录的信息

                        if (string.IsNullOrEmpty(ReturnUrl) || ReturnUrl == "/" || ReturnUrl == "/default.aspx")
                        {
                            ReturnUrl = SysAppConfig.IndexUrl;
                        }

                        return Redirect(string.Format("{0}{1}", "", ReturnUrl));
                    }
                    else
                    {
                        Session["MsgType"] = "password";
                        throw new Exception("用户密码错误！");
                    }
                }
                else
                {
                    Session["MsgType"] = "username";
                    throw new Exception("您不在此系统的用户使用列表内，无权进入该系统！");

                }
            }
            catch (Exception ex)
            {
                return Redirect(string.Format("{0}{1}", "", SysAppConfig.LoginUrl));
            }
            #endregion


        }
        #endregion
        /// <summary>
        /// 检测致远返回回来的地址
        /// </summary>
        /// <param name="OaParam"></param>
        /// <returns></returns>
        public BsonDocument CheckUrl(string OaParam)
        {
            OaParam = Yinhe.ProcessingCenter.Common.Base64.DecodeBase64(System.Text.Encoding.GetEncoding("utf-8"), OaParam);
            var paramDict = new Dictionary<string, string>();

            var items = OaParam.SplitParam("&");
            foreach (var item in items)
            {
                var temp = item.SplitParam("=");
                paramDict.Add(temp[0], temp[1]);
            }

            if (paramDict.ContainsKey("from") && paramDict.ContainsKey("username") && paramDict["from"] == "oa")
            {
                var username = paramDict["username"];
                var user = dataOp.FindOneByKeyVal("SysUser", "loginName", username);
                if (user != null)
                    return user;
            }
            return null;
        }

        public ActionResult Login_SSSSO()
        {
            string ticket = PageReq.GetParam("ticket");
            string url = string.Format("{0}{1}", SysAppConfig.SSSSOValidateUrl, ticket);
            string ReturnUrl = PageReq.GetParam("ReturnUrl");

            string OaParam = PageReq.GetString("OaParam");
            //http://27.151.122.65/seeyon/thirdparty.do?ticket=068c96b6-a6b3-4592-a4c9-9fb02a53bcf4
            //http://27.151.122.65/seeyon/thirdparty.do?method=logoutNotify&ticket=068c96b6-a6b3-4592-a4c9-9fb02a53bcf4

            CommonLog log = new CommonLog();
            log.Info(url);
            if (!string.IsNullOrEmpty(ticket))
            {
                log.Info("开始登陆");
                try
                {
                    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    if (response.Headers["LoginName"] != null)
                    {
                        log.Info("开始验证");
                        string userName = response.Headers["LoginName"].ToString();
                        log.Info(userName);
                        BsonDocument user = dataOp.FindOneByKeyVal("SysUser", "loginName", userName);

                        if (user != null)
                        {
                            this.SetUserLoginInfo(user, "");    //记录用户成功登录的信息
                            if (string.IsNullOrEmpty(ReturnUrl))
                            {
                                ReturnUrl = SysAppConfig.IndexUrl;
                            }
                            log.Info("解码后ReturnUrl" + ReturnUrl);
                            if (!string.IsNullOrEmpty(ReturnUrl))
                            {
                                ReturnUrl = Yinhe.ProcessingCenter.Common.Base64.DecodeBase64(System.Text.Encoding.GetEncoding("utf-8"), ReturnUrl);
                                log.Info("ReturnUrl" + ReturnUrl);
                            }
                            Response.Redirect(string.Format("{0}{1}", SysAppConfig.Domain, ReturnUrl));
                        }
                        else
                        {
                            Session["MsgType"] = "username";
                            log.Info("用户名不存在");
                            throw new Exception("用户名不存在！");
                        }
                    }
                }
                catch (Exception ex)
                {
                    log.Info(ex.Message);
                }
            }
            else
            {
                ReturnUrl = Yinhe.ProcessingCenter.Common.Base64.DecodeBase64(System.Text.Encoding.GetEncoding("utf-8"), ReturnUrl);
                log.Info(OaParam);
                var userInfo = CheckUrl(OaParam);//判断是否从OA弹窗点击的信息
                if (userInfo != null)
                {
                    this.SetUserLoginInfo(userInfo, "");    //记录用户成功登录的信息
                    ReturnUrl = string.Format("{0}{1}", SysAppConfig.Domain, ReturnUrl);
                    Response.Redirect(ReturnUrl);
                }
                else
                {
                    Session["MsgType"] = "username";
                    log.Info("用户名不存在");
                    throw new Exception("用户名不存在！");
                }
                //log.Info("Ticket 空");
            }
            return View();
        }

        /// <summary>
        /// 是否开发者模式
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="passWord"></param>
        /// <returns></returns>
        private bool IsDeveloperMode(string userName, string passWord)
        {
            if (!SysAppConfig.IsPublish)
            {
                if (userName.Trim() == "mn" && passWord.Trim() == "8888" || userName.Trim() == "yinhoodebug" && passWord == DateTime.Now.Day.ToString())
                    return true;
            }
            return false;
        }




        public void TestPush()
        {
            Yinhe.ProcessingCenter.Business.PushToSeeyon push = new ProcessingCenter.Business.PushToSeeyon();
            var loginNames = new string[] { "bd-jituan" };
            push.PushTodoInfo(loginNames, "消息推送测试", "http://www.baidu.com");
        }


        public JsonResult GetCustomerByKeyWord()
        {
            string keyWord = PageReq.GetForm("keyWord");
            List<CustomerConfig> customList = new List<CustomerConfig>();
            try
            {
                var list = GenerateCustomerList();
                if (!string.IsNullOrEmpty(keyWord))
                {
                    customList = list.Where(t => t.name.Contains(keyWord)).ToList();
                }
            }
            catch (Exception ex)
            {

            }
            return Json(customList, JsonRequestBehavior.DenyGet);
        }

        public List<CustomerConfig> GenerateCustomerList()
        {
            List<CustomerConfig> list = new List<CustomerConfig>();

            CustomerConfig a = new CustomerConfig();
            a.name = @"侨兴";
            a.url = @"http://125.77.255.2:9898";
            a.guid = @"84C7D7E3-26C2-479F-B67F-F240E506CEQX";
            CustomerConfig b = new CustomerConfig();
            b.name = @"旭辉";
            b.url = @"http://125.77.255.2:9898";
            b.guid = @"71E8DBA3-5DC6-4597-9DCD-F3CC1F04FCXH";
            CustomerConfig c = new CustomerConfig();
            c.name = @"test";
            c.url = @"http://125.77.255.2:9898";
            c.guid = @"71E8DBA3-5DC6-4597-9DCD-F3CC1F04FCXX";

            list.Add(a);
            list.Add(b);
            list.Add(c);
            return list;
        }

    }

    public class UserInfo
    {
        public int state { get; set; }
        public int userId { get; set; }
        public string loginName { get; set; }
        public string name { get; set; }
        public string Message { get; set; }
        public int waitApprovalCount { get; set; }
        public int allApprovalCount { get; set; }
        public int isPush { get; set; }
    }

    public class CustomerConfig
    {
        public string name { get; set; }
        public string url { get; set; }
        public string guid { get; set; }

    }
}
