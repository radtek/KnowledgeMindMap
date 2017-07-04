using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Yinhe.ProcessingCenter;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using Yinhe.ProcessingCenter.DataRule;
using System.Threading;
using MongoDB.Driver;
using System.Text.RegularExpressions;
using System.Timers;
using System.Configuration;

namespace MZ.BusinessLogicLayer
{
 
    /// <summary>
    /// 知识脉络图
    /// </summary>
    public class MindMapTimerBll
    {
        System.Timers.Timer aTimer = new System.Timers.Timer();
        int curInterVal = 60 * 60 * 1000;
        #region 构造函数
        /// <summary>
        /// 类私有变量
        /// </summary>
        private DataOperation dataOp = null;
 
        /// <summary>
        /// 封闭当前默认构造函数
        /// </summary>
        public MindMapTimerBll()
        {
            dataOp = new DataOperation();
            TimerInit();
        }

        /// <summary>
        /// 封闭当前默认构造函数
        /// </summary>
        private MindMapTimerBll(DataOperation ctx)
        {
            dataOp = ctx;
            TimerInit();
        }


        /// <summary>
        /// 构造器
        /// </summary>
        /// <returns></returns>
        public static MindMapTimerBll _()
        {
            return new MindMapTimerBll();
        }

        /// <summary>
        /// 构造器
        /// </summary>
        /// <returns></returns>
        public static MindMapTimerBll _(DataOperation ctx)
        {
            return new MindMapTimerBll(ctx);
        }
        #endregion
        /// <summary>
        /// 初始化
        /// </summary>
        private void TimerInit()
        {
            aTimer.Elapsed += new ElapsedEventHandler(OnTimedEvent);
            aTimer.Interval = curInterVal;    // 1秒 = 1000毫秒,修改成可随机
            aTimer.Enabled = false;
        }

        #region 事件处理
        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            try
            {
                ShowMessageInfo("开始更新UpdateArticleScoreService");
                var count=MindMapBll._().UpdateArticleScoreService();
                ShowMessageInfo("结束更新UpdateArticleScoreService更新了" + count + "条记录");

                ShowMessageInfo("开始更新UpdateUserCoin");
                var userCount = MindMapBll._().UpdateUserCoinService();
                ShowMessageInfo("结束更新UpdateUserCoin更新了" + userCount + "条记录");
                if (DateTime.Now.Hour >= 23)
                {
                      ShowMessageInfo("开始UpdateMindMapLabelCollection");
                      MindMapBll._().UpdateMindMapLabelCollection();
                      ShowMessageInfo("结束UpdateMindMapLabelCollection");
                }
            }
            catch (Exception ex)
            {
                //UrlQueue.Instance.EnQueue()
                //MessageBox.Show(ex.Message);
                ShowMessageInfo(ex.Message);
                timerStop();
            }
        }
        #endregion

        /// <summary>
        /// 定时器开始
        /// </summary>
        public void timerStart()
        {

            if (aTimer.Enabled == false)
            {
                var rand = new Random();
                aTimer.Interval = curInterVal;
                aTimer.Enabled = true;
                aTimer.Start();
                ShowMessageInfo("计时器开始");
              }
       }
        public void timerStop()
        {
            if (aTimer.Enabled == true)
            {

                aTimer.Stop();
                aTimer.Enabled = false;
                ShowMessageInfo("计时器结束");
             }
        }
        /// <summary>
        /// 记录信息
        /// </summary>
        /// <param name="msg"></param>
        private void ShowMessageInfo(string msg)
        {
            NLog.Logger _log = NLog.LogManager.GetCurrentClassLogger();
            _log.Info(msg);
        }
    }
}
