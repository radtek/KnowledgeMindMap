using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Yinhe.ProcessingCenter;
namespace Yinhe.WebHost.Controllers
{
    public class EvaluationController : Yinhe.ProcessingCenter.ControllerBase
    {
        
        public ActionResult Index()
        {

            return View();
        }

        /// <summary>
        /// 系统评论控件
        /// </summary>
        /// <returns></returns>
        public ActionResult Comment()
        {
            return View();
        }

        /// <summary>
        /// 评论列表控件
        /// </summary>
        /// <returns></returns>
        public ActionResult CommentList()
        {
            return View();
        }

        /// <summary>
        /// 系统回复控件
        /// </summary>
        /// <returns></returns>
        public ActionResult CommentRevert()
        {
            return View();
        }

        /// <summary>
        /// 系统回复的回复列表控件
        /// </summary>
        /// <returns></returns>
        public ActionResult CommentRevertList()
        {
            return View();
        }

        /// <summary>
        /// 系统回复编辑控件
        /// </summary>
        /// <returns></returns>
        public ActionResult CommentEdit()
        {
            return View();
        }

        /// <summary>
        /// 系统回复编辑控件
        /// </summary>
        /// <returns></returns>
        public ActionResult RevertEdit()
        {
            return View();
        }

        #region 联发评价
        /// <summary>
        /// LF标准库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult LFComment()
        {
            return View();
        }
        /// <summary>
        /// LF标准库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult LFCommentEdit()
        {
            return View();
        }
        /// <summary>
        /// LF标准库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult LFCommentList()
        {
            return View();
        }
        /// <summary>
        /// LF标准库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult LFRevertEdit()
        {
            return View();
        }
        /// <summary>
        /// LF标准库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult LFCommentRevertList()
        {
            return View();
        }
        #endregion

        #region 金辉工艺工法库评价
        /// <summary>
        /// 金辉工艺工法库评价
        /// </summary>
        /// <returns></returns>
        public ActionResult JHComment()
        {
            return View();
        }

        /// <summary>
        /// 金辉工艺工法库评价列表
        /// </summary>
        /// <returns></returns>
        public ActionResult JHCommentList()
        {
            return View();
        }

        /// <summary>
        /// 金辉工艺工法库评价项编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult JHCommentEdit()
        {
            return View();
        }

        /// <summary>
        /// 金辉工艺工法库评价回复列表
        /// </summary>
        /// <returns></returns>
        public ActionResult JHRevertList()
        {
            return View();
        }

        /// <summary>
        /// 金辉工艺工法库评价回复项编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult JHRevertEdit()
        {
            return View();
        }
        #endregion
    }
}
