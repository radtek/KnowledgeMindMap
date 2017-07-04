using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Yinhe.ProcessingCenter;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MZ.BusinessLogicLayer;
using Yinhe.ProcessingCenter.DataRule;
using Yinhe.ProcessingCenter.Document;
using HtmlAgilityPack;

namespace Yinhe.WebHost.Controllers
{
    public class KnowledgeMindMapController : Yinhe.ProcessingCenter.ControllerBase
    {
        /// <summary>
        /// 搜索首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {

            return View();
        }
        public ActionResult HeadContent()
        {
            return View();
        }

        /// <summary>
        /// 脉络图详细页
        /// </summary>
        /// <returns></returns>
        public ActionResult MindMapSearch()
        {
            return View();
        }

        public ActionResult MindMapFileSearch()
        {
            return View();
        }
        /// <summary>
        /// 标签文档详细
        /// </summary>
        /// <returns></returns>
        public ActionResult MindMapLabelDetail()
        {
            return View();
        }
        /// <summary>
        /// 文章编辑页面
        /// </summary>
        /// <returns></returns>
        public ActionResult MindMapArticleNow()
        {
            return View();
        }
        /// <summary>
        /// 文章展示页面
        /// </summary>
        /// <returns></returns>
        public ActionResult MindMapArticleView()
        {
            return View();
        }

        /// <summary>
        /// 文章展示页面
        /// </summary>
        /// <returns></returns>
        public ActionResult MindMapArticleFilePart()
        {
            return View();
        }

        public ActionResult MindMapFavoriateArticle()
        {
            return View();
        }

        public ActionResult MindMapInfoEdit()
        {
            return View();
        }

        public ActionResult MindMapInfoList()
        {
            return View();
        }
        public ActionResult MindMapUpLoadArticle()
        {
            return View();
        }
        public ActionResult MindMapArticleListCtrl()
        {
            return View();
        }
        public ActionResult PersonalCenter()
        {
            return View();
        }

        public ActionResult MindMapRank()
        {
            return View();
        }
        public ActionResult MindMapRankDetail()
        {
            return View();
        }
        
        /// <summary>
        /// 广播用 掉落物品记录页
        /// </summary>
        /// <returns></returns>
        public ActionResult ItemRecord()
        {
            return View();
        }

        #region 获取掉落物品
        /// <summary>
        /// 点击掉落物品 返回json 
        /// type = error|item|exp
        /// </summary>
        /// <returns></returns>
        public string ItemDrop(int dropCount)
        {
            if (this.CurrentUserId > 0)
            {
               
               
                var itemHelper = new ItemHelper(dataOp);
                var itemResult = itemHelper.DailyItemDrop(this.CurrentUserId.ToString(), dropCount); //物品掉落
                if (itemResult.Status == Status.Successful)
                {
                    DateTime dateTime = DateTime.Now;
                    if (itemResult.Message.Contains("道具"))
                    {
                        PageReq.SetObjSession("itemDropTime", dateTime); //重置cd
                    }
                    var message = itemResult.Message;

                    return message;
                }
                else
                {
                    return new { type = "error", message = "数据库执行异常" }.ToJson();
                }
            }
            else
            {
                return new { type = "error", message = "未登录" }.ToJson();
            }
        }
        #endregion

        #region Json数据

        /// <summary>
        /// 脉络图Json数据
        /// 通过搜索关键字找出匹配的脉络图点，在展示出以匹配的关键字节点为中心展开3级关联，全部展示所有的节点与关系
        /// </summary>
        /// <returns></returns>
        public JsonResult MindMapDetailJson()
        {
            var mindMapIds = PageReq.GetParamList("mindMapIds");
            var keyWord = Server.UrlDecode(PageReq.GetParam("keyWord"));//关键字
            var oldKeyWord = Server.UrlDecode(PageReq.GetParam("oldKeyWord"));//前置关键字
            var mindMapBll = MindMapBll._();
            var jsonResult = new PageJson();
            List<object> ResultList = new List<object>();
            var nodeList = new List<BsonDocument>();
            var LinkList = new List<BsonDocument>();
            foreach (var mindMapId in mindMapIds)
            {
                ///获取脉络图中的标签
                var labIds = mindMapBll.GetMindMapLabelCollection(mindMapId);
                ///获取标签实体对象
                var allLabList = mindMapBll.FindMindMapLabelCollectionByLabIds(labIds);
                //获取关键字节点,目前使用contains 判断后续通过索引等进行匹配,可能多个
                var centerLabIds = mindMapBll.GetMindMapCenterLabelId(allLabList, keyWord);
                var hitMindMapLabelList = new List<BsonDocument>();//获取所有脉络图需要出现的标签节点
                var hitTraceResult = new List<BsonDocument>();
                //匹配的节点
                if (centerLabIds.Count <= 0)
                {
                    //查找当前脉络图所有的节点
                    var mindMapObj = mindMapBll.FindMindMapById(mindMapId);
                    if (mindMapObj != null && !string.IsNullOrEmpty(mindMapObj.Text("centerLabelId")))
                    {
                        centerLabIds.Add(mindMapObj.Text("centerLabelId"));
                        hitTraceResult = mindMapBll.FindMindMapLabelTraceById(mindMapId, mindMapObj.Text("centerLabelId"));//找出所有三级关联关系点
                        var preLabelIds = hitTraceResult.Select(c => c.Text("preLabelId")).Distinct().ToList();
                        var sucLabelIds = hitTraceResult.Select(c => c.Text("sucLabelId")).Distinct().ToList();
                        preLabelIds.AddRange(sucLabelIds);
                        preLabelIds.AddRange(centerLabIds);
                        hitMindMapLabelList = mindMapBll.FindMindMapLabelCollectionByLabIds(preLabelIds);
                        allLabList = hitMindMapLabelList;
                    }
                }
                else
                {

                    foreach (var centerLabId in centerLabIds)
                    {
                        var hitResult = mindMapBll.InitialMindMapLabelCollectionByLabelId(mindMapId, centerLabId);//找出所有三级关联关系点
                        hitMindMapLabelList.AddRange(hitResult);
                    }
                }
                var hitMindMapLabelIds = hitMindMapLabelList.Select(c => c.Text("labelId")).ToList();
                //此处可能有的节点是中心节点又在某个节点中已被展示，目前规则为只展示一次？中心节点不宜多

                foreach (var lab in hitMindMapLabelList.Distinct())
                {
                    if (nodeList.Where(c => c.Text("id") == lab.Text("labelId")).Count() > 0)
                    {
                        continue;
                    }
                    var hitLabObj = allLabList.Where(c => c.Text("labelId") == lab.Text("labelId")).FirstOrDefault();
                    if (hitLabObj == null) continue;
                    var textLen=hitLabObj.Text("textLen");
                    if(string.IsNullOrEmpty(textLen)){
                        textLen=StringExtension.TextLength(hitLabObj.Text("name")).ToString();
                    }
                    var nodeDoc = new BsonDocument().Add("id", lab.Text("labelId")).Add("name", hitLabObj.Text("name")).Add("len", textLen);
                    var type = lab.Text("type");
                    var pid = lab.Text("pid");
                    if (string.IsNullOrEmpty(type))
                    {
                        if (centerLabIds.Contains(lab.Text("labelId")))
                        {
                            type = "1";
                        }
                        else
                        {
                            type = "2";
                        }
                    }
                    if (string.IsNullOrEmpty(pid) && !centerLabIds.Contains(lab.Text("labelId")))
                    {
                        //是否二级关联
                        var isSecCenterObj = hitTraceResult.Where(c => lab.Text("labelId") == c.Text("sucLabelId") || lab.Text("labelId") == c.Text("preLabelId")).FirstOrDefault();
                        if (isSecCenterObj != null)
                        {
                            if (isSecCenterObj.Text("preLabelId") != lab.Text("labelId"))
                            {
                                pid = isSecCenterObj.Text("preLabelId");
                            }
                            else
                            {
                                pid = isSecCenterObj.Text("sucLabelId");
                            }
                        }
                    }
                    nodeDoc.Add("type", type);//中心节点
                    nodeDoc.Add("pid", pid);//中心节点
                    nodeList.Add(nodeDoc);
                }

                ///只列出设计的标签关联
                var allMindMapTraceList = mindMapBll.FindMindMapLabelTraceById(mindMapId).Where(c => hitMindMapLabelIds.Contains(c.Text("preLabelId")) && hitMindMapLabelIds.Contains(c.Text("sucLabelId")));
                foreach (var rel in allMindMapTraceList.Distinct())
                {
                    var relDoc = new BsonDocument().Add("relation", "从属");
                    relDoc.Add("source", rel.Text("preLabelId"));
                    relDoc.Add("target", rel.Text("sucLabelId"));
                    if (centerLabIds.Contains(rel.Text("preLabelId")) || centerLabIds.Contains(rel.Text("sucLabelId")))
                    {
                        relDoc.Add("level", "1");
                    }
                    LinkList.Add(relDoc);
                }
            }
            //
            if (nodeList.Count <= 0)
            {
                var keyWordLabelList = mindMapBll.FindMindMapLabelCollectionByKeyWord(keyWord);
                foreach (var node in keyWordLabelList)
                {
                    var textLen=node.Text("textLen");
                    if(string.IsNullOrEmpty(textLen)){
                        textLen=StringExtension.TextLength(node.Text("name")).ToString();
                    }
                    var nodeDoc = new BsonDocument().Add("id", node.Text("labelId")).Add("name", node.Text("name")).Add("len", textLen);
                    nodeDoc.Add("type", "1");
                    nodeList.Add(nodeDoc);
                }
            }
            var result = new { links = LinkList.Distinct().ToList(), node = nodeList.Distinct().ToList() }.ToJson();
            #region 添加日志
            if (!string.IsNullOrEmpty(keyWord))
            {
                var logBson = new BsonDocument();
                logBson.Add("keyWord", keyWord);
                logBson.Add("userId", this.CurrentUserId.ToString());
                if (!string.IsNullOrEmpty(oldKeyWord) && oldKeyWord != keyWord && mindMapIds.Count() > 0)
                {
                    logBson.Add("oldKeyWord", oldKeyWord);
                    logBson.Add("isKeyWordChange", "1");
                }
                mindMapBll.LogOperation(logBson, MindMapOperateType.Search);
            }
            #endregion
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 详细标签脉络图Json数据
        /// </summary>
        /// <returns></returns>
        public JsonResult LabelDetailJson()
        {
            var mindMapIds = PageReq.GetParamList("mindMapIds");//可能不存在
            var centerLabId = PageReq.GetParam("labelId");
            if (string.IsNullOrEmpty(centerLabId))
            {
                return Json(string.Empty, JsonRequestBehavior.AllowGet);
            }
            var mindMapBll = MindMapBll._();
            var jsonResult = new PageJson();
            List<object> ResultList = new List<object>();
            var nodeList = new List<BsonDocument>();
            var LinkList = new List<BsonDocument>();
            //获取脉络图中的标签
            //var labIds = mindMapBll.GetMindMapLabelCollection(mindMapIds);
            var hitMindMapLabelIds = new List<string>() { centerLabId };//获取所有脉络图需要出现的标签节点
            var hitResult = mindMapBll.GetNextMindMapLabelCollectionByLabelId(mindMapIds.ToList(), centerLabId);//找出所有三级关联关系点
            hitMindMapLabelIds.AddRange(hitResult);
            ///获取标签实体对象
            var allLabList = mindMapBll.FindMindMapLabelCollectionByLabIds(hitMindMapLabelIds);
            foreach (var labelId in hitMindMapLabelIds)
            {
                var hitLabObj = allLabList.Where(c => c.Text("labelId") == labelId).FirstOrDefault();
                if (hitLabObj == null) continue;
                var textLen = hitLabObj.Text("textLen");
                if (string.IsNullOrEmpty(textLen))
                {
                    textLen = StringExtension.TextLength(hitLabObj.Text("name")).ToString();
                }
                var nodeDoc = new BsonDocument().Add("id", hitLabObj.Text("labelId")).Add("name", hitLabObj.Text("name")).Add("pid", centerLabId).Add("len", textLen);
                if (labelId == centerLabId)
                {
                    nodeDoc.Add("type", 1);//中心节点
                }
                else
                {
                    var relDoc = new BsonDocument().Add("relation", "从属");
                    relDoc.Add("source", centerLabId);
                    relDoc.Add("target", labelId);
                    LinkList.Add(relDoc);
                    nodeDoc.Add("type", 2);//周边节点
                }
                nodeList.Add(nodeDoc);
            }
            ///只列出设计的标签关联
            var result = new { links = LinkList.Distinct().ToList(), node = nodeList.Distinct().ToList() }.ToJson();
            #region 添加日志
            if (!string.IsNullOrEmpty(centerLabId))
            {
                var logBson = new BsonDocument();
                logBson.Add("labelId", centerLabId);
                logBson.Add("mindMapId", PageReq.GetParam("mindMapIds"));
                logBson.Add("userId", this.CurrentUserId.ToString());
                mindMapBll.LogOperation(logBson, MindMapOperateType.ViewLabel);
            }
            #endregion
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region 保存操作


        /// <summary>
        /// 标签保存,此处需要注意如果为脉络图的标签保存，需要更换标签关联，但目前需要传入脉络图id才能批量更改
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveLabelCollection()
        {
            MindMapBll MMB = MindMapBll._();
            var result = new InvokeResult();
            string labelId = PageReq.GetForm("labelId");
            string mindMapId = PageReq.GetForm("mindMapId");
            string name = Server.UrlDecode(PageReq.GetForm("name"));
            var hitObj = MMB.FindMindMapLabelCollectionByName(name.Trim());
            if (hitObj != null)
            {
                var newLabelId = hitObj.Text("labelId");
                //替换标签需要进行脉络图相关替换
                if (!string.IsNullOrEmpty(mindMapId))
                {
                    result = MMB.ReplaceMindMapLabelTrace(new List<string>() { mindMapId }, labelId, newLabelId);

                }
                else
                {
                    result.Message = "替换标签请在传入脉络图Id,否则将更改所有的关联";
                    result.Status = Status.Failed;

                }

            }
            else
            {
                //更改标签的名字
                result = MMB.UpdateMindMapLabelColleciton(labelId, new BsonDocument().Add("name", name));

            }
            #region 添加日志
            if (!string.IsNullOrEmpty(name))
            {

                var logBson = new BsonDocument();
                logBson.Add("labelId", labelId);
                logBson.Add("mindMapId", mindMapId);
                logBson.Add("userId", this.CurrentUserId.ToString());
                MMB.LogOperation(logBson, MindMapOperateType.EditMindMap);
            }
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));

        }
        /// <summary>
        /// 文章保存
        /// </summary>
        /// <param name="main"></param>
        /// <param name="subList"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveArticle(FormCollection saveForm)
        {
            MindMapBll MMB = MindMapBll._();
            InvokeResult result = new InvokeResult();
            string tbName = PageReq.GetForm("tbName");
            string queryStr = PageReq.GetForm("queryStr");
            string dataStr = PageReq.GetForm("dataStr");
            string articleId = PageReq.GetForm("articleId");//主键Id
            string mindMapId = PageReq.GetForm("mindMapId");//脉络图Id
            string name = Server.UrlDecode(PageReq.GetForm("name"));//名称
            string content = Server.UrlDecode(PageReq.GetForm("content"));//内容
            var labelIds = PageReq.GetFormList("labelIds").ToList();//关联标签Id
            var addLabelNames = PageReq.GetFormList("addLabelNames").ToList();//新增的关联标签Id

            #region 文章保存
            var updateBson = new BsonDocument();
            updateBson.Add("content", content.Trim());

            if (!string.IsNullOrEmpty(name))
            {

                updateBson.Add("name", name.Trim());
            }
            else
            {
                if (!string.IsNullOrEmpty(content))
                {
                    HtmlDocument htmlDoc = new HtmlDocument();
                    htmlDoc.LoadHtml(content.Trim());
                    var contentText = htmlDoc.DocumentNode.InnerText;
                    updateBson.Add("name", StringExtension.CutStr(contentText, 30, ""));
                }
                else
                {
                    //获取文件当标题
                    string localPath = PageReq.GetForm("uploadFileList");
                    string[] filePaths = System.Text.RegularExpressions.Regex.Split(localPath, @"\|", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                    if (filePaths.Length > 0)
                    {
                        var fileName = System.IO.Path.GetFileName(filePaths[0]);
                        updateBson.Add("name", fileName);
                    }
                }
            }
            if (string.IsNullOrEmpty(updateBson.Text("name")))
            {
                result.Status = Status.Failed;
                result.Message = "请先保存内容或者上传文件";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            result = MMB.UpdateMindMapArticle(articleId, updateBson);
            if (result.Status == Status.Successful)
            {
                if (result.BsonInfo != null)
                {
                    var curArticle = result.BsonInfo;
                    articleId = curArticle.Text("articleId");
                }

            }
            if (result.Status != Status.Successful)
            {
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            result.BsonInfo = new BsonDocument().Add("articleId", articleId);
            #endregion
            #region 提取标签并保存
            var resultLabel = MMB.UpdateMindMapArticleLabel(articleId, labelIds, addLabelNames);
            if (resultLabel.Status != Status.Successful)
            {
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            #endregion
            #region 文件上传
            #region 删除文件
            string delFileRelIds = saveForm["delFileRelIds"] != null ? saveForm["delFileRelIds"] : "";
            if (!string.IsNullOrEmpty(delFileRelIds))
            {
                FileOperationHelper opHelper = new FileOperationHelper();
                try
                {
                    string[] fileArray;
                    if (delFileRelIds.Length > 0)
                    {
                        fileArray = delFileRelIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                        if (fileArray.Length > 0)
                        {
                            foreach (var item in fileArray)
                            {
                                var result1 = opHelper.DeleteFileByRelId(int.Parse(item));
                                if (result1.Status == Status.Failed)
                                {
                                    break;
                                }
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    result.Status = Status.Failed;
                    result.Message = ex.Message;
                    return Json(TypeConvert.InvokeResultToPageJson(result));
                }
            }
            #endregion
            #region 保存文件
            saveForm["keyValue"] = articleId;
            result.FileInfo = SaveMultipleUploadFiles(saveForm);

            #endregion
            #endregion

            #region 添加日志
            if (!string.IsNullOrEmpty(articleId))
            {
                var logBson = new BsonDocument();
                logBson.Add("articleId", articleId);
                logBson.Add("mindMapId", mindMapId);
                logBson.Add("userId", this.CurrentUserId.ToString());
                MMB.LogOperation(logBson, MindMapOperateType.EditArticle);
            }
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #region 脉络图初始化
        /// <summary>
        /// 建立节点关联，只更改对应的脉络图过着更改关联的所有脉络图更新
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateMindMapTrace()
        {
            InvokeResult result = new InvokeResult();
            MindMapBll MMB = MindMapBll._();
            var mindMapIds = PageReq.GetFormList("mindMapIds");
            var preLabelId = PageReq.GetForm("preLabelId");
            var sucLabelIds = PageReq.GetFormList("sucLabelId").ToList();//可能多个批量添加标签
            var addLabelNames = PageReq.GetFormList("addLabelNames").ToList();//新增的关联标签Id
            var type = PageReq.GetForm("type");
            ///初始化标签不存在的进行添加
            var hitSucLabelIds = MMB.SelectMindMapLabelPush(sucLabelIds, addLabelNames);
            if (string.IsNullOrEmpty(preLabelId) || hitSucLabelIds.Count() < 0)
            {
                result.Status = Status.Failed;
                result.Message = "传入参数出错";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            if (type == "1")//删除
            {
                result = MMB.DeleteMindMapLabelTrace(mindMapIds.ToList(), preLabelId, hitSucLabelIds);
            }
            else//添加
            {
                result = MMB.UpdateMindMapLabelTrace(mindMapIds.ToList(), preLabelId, hitSucLabelIds);
            }

            #region 添加日志
            if (result.Status == Status.Successful)
            {
                var logBson = new BsonDocument();
                logBson.Add("preLabelId", preLabelId);
                logBson.Add("sucLabelId", string.Join(",", sucLabelIds));
                logBson.Add("mindMapId", PageReq.GetForm("mindMapIds"));
                logBson.Add("userId", this.CurrentUserId.ToString());
                MMB.LogOperation(logBson, MindMapOperateType.EditMindMap);
            }
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 快速建立脉络图
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult QuickCreateMindMap()
        {
            InvokeResult result = new InvokeResult();
            MindMapBll MMB = MindMapBll._();
            var mindMapId = PageReq.GetForm("mindMapId");
            var name = Server.UrlDecode(PageReq.GetForm("name"));//脉络图名称
            var remark = Server.UrlDecode(PageReq.GetForm("remark"));
            var centerLabelId = PageReq.GetForm("centerLabelId");
            var labelIds = PageReq.GetFormList("labelIds").ToList();//关联标签Id
            var addLabelNames = PageReq.GetFormList("addLabelNames").ToList();//新增的关联标签Id
            var category = PageReq.GetForm("category");//类型
            var orgId = PageReq.GetForm("orgId");//所属部门
            var hitSucLabelIds = new List<string>();
            if (string.IsNullOrEmpty(centerLabelId))
            {
                if (labelIds.Count > 0)
                {
                    centerLabelId = labelIds.FirstOrDefault();
                }
                ///选择标签初始化
                labelIds = MMB.SelectMindMapLabelPush(labelIds, addLabelNames);
                //需要取出排序中的第一个
                if (string.IsNullOrEmpty(centerLabelId) && labelIds.Count() > 0)
                {
                    var allLabel = MMB.FindMindMapLabelCollectionByLabIds(labelIds);
                    var firstName = addLabelNames.FirstOrDefault();
                    if (firstName != null)
                    {
                        var hitObj = allLabel.Where(c => c.Text("name") == firstName).FirstOrDefault();
                        if (hitObj != null)
                        {
                            centerLabelId = hitObj.Text("labelId");
                        }
                    }
                }

            }

            if (string.IsNullOrEmpty(centerLabelId))
            {
                result.Status = Status.Failed;
                result.Message = "请添加标签";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            var curMindMapObj = new BsonDocument();
            curMindMapObj.Add("name", name);
            curMindMapObj.Add("centerLabelId", centerLabelId);
            curMindMapObj.Add("category", category);
            curMindMapObj.Add("orgId", orgId);
            curMindMapObj.Add("userId", dataOp.GetCurrentUserId().ToString());
            curMindMapObj.Add("remark", remark);
            result = MMB.QuickCreateMindMap(mindMapId, curMindMapObj);
            #region 添加关联,当中心点改变
            if (result.Status == Status.Successful)
            {
                mindMapId = result.BsonInfo.Text("mindMapId");
                MMB.UpdateMindMapLabelTrace(new List<string>() { mindMapId }, centerLabelId, labelIds);
            }
            #endregion
            #region 添加日志
            if (result.Status == Status.Successful)
            {
                var logBson = new BsonDocument();
                logBson.Add("preLabelId", centerLabelId);
                logBson.Add("isCreate", "1");
                logBson.Add("mindMapId", PageReq.GetForm("mindMapIds"));
                logBson.Add("userId", this.CurrentUserId.ToString());
                MMB.LogOperation(logBson, MindMapOperateType.EditMindMap);
            }
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 快速建立脉络图
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult QuickDeleteMindMap()
        {
            InvokeResult result = new InvokeResult();
            MindMapBll MMB = MindMapBll._();
            var mindMapId = PageReq.GetForm("mindMapId");
            result = MMB.QuickDeleteMindMap(mindMapId);
            #region 添加日志
            if (result.Status == Status.Successful)
            {
                var logBson = new BsonDocument();
                logBson.Add("mindMapId", PageReq.GetForm("mindMapIds"));
                logBson.Add("userId", this.CurrentUserId.ToString());
                MMB.LogOperation(logBson, MindMapOperateType.DeleteMindMap);
            }
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetHitArticleListData(string type, int pageNum, int pageSize)//List<string> articleIds
        {

            MindMapBll MMB = MindMapBll._();
            var articleIds = new List<string>();
            var sortType = PageReq.GetForm("sortType");
            var userId = PageReq.GetForm("userId");
            if (string.IsNullOrEmpty(userId))
            {
                userId = this.CurrentUserId.ToString();
            }
            switch (type)
            {
                case "1"://我收藏的文章
                    articleIds = MMB.FindUserFavoriateArticleIds(userId);
                    //新增内置文章52专家系统报告
                    articleIds.Add("52"); articleIds.Add("88");
                    break;
                case "3"://标签详细列表
                    var labelId = PageReq.GetForm("labelId");
                    articleIds = MMB.FindMindMapArticleIdsByLabIds(new List<string>() { labelId });
                    break;
                case "4"://文章标签搜索
                    // 添加缓存防止查询速度过慢
                    var keyWord = Server.UrlDecode(PageReq.GetForm("keyWord"));
                    var searchKey = "MapArticleByKeyWord_" + keyWord;
                    var cacheResult = CacheHelper.GetCache(searchKey);
                    if (cacheResult != null)
                    {
                        articleIds = cacheResult as List<string>;
                    }
                    else
                    {
                        articleIds = MMB.FindMindMapArticleByKeyWord(keyWord).Select(c => c.Text("articleId")).ToList();
                        var relationLabelIds = MMB.FindMindMapLabelCollectionByKeyWord(keyWord);
                        var hitLabelArticleList = MMB.FindMindMapArticleIdsByLabIds(relationLabelIds.Select(c => c.Text("labelId")).ToList());
                        articleIds.AddRange(hitLabelArticleList);
                        CacheHelper.SetCache(searchKey, articleIds, null, DateTime.Now.AddMinutes(60));
                        //过期时间1个小时
                    }
                    break;

                case "2"://我上传的文章
                default:
                    articleIds = MMB.FindUserUpLoadArticleIds(userId);
                    break;
            }

            List<BsonDocument> hitArticleList = new List<BsonDocument>();
            if (articleIds.Count() > 0)
            {
                try
                {
                    hitArticleList = MMB.FindhitArticleListByArticleIds(articleIds, pageNum, pageSize, sortType);
                }

                catch (Exception ex)
                {
                    //此处传入的pageNum超出次数会导致异常
                    hitArticleList = new List<BsonDocument>();
                }
            }
            var allArticleRelLabelIds = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.In("articleId", articleIds.Select(c => (BsonValue)c))).ToList();
            var allLableList = MMB.FindMindMapLabelCollectionByLabIds(allArticleRelLabelIds.Select(c => c.Text("labelId")).ToList());
            bool flag = true;
            var resultList = new List<BsonDocument>();
            foreach (var article in hitArticleList)
            {

                var relLabelIds = allArticleRelLabelIds.Where(c => c.Text("articleId") == article.Text("articleId")).Select(c => c.Text("labelId")).ToList();
                var hitLabelList = allLableList.Where(c => relLabelIds.Contains(c.Text("labelId"))).ToList();
                BsonArray labelJson = new BsonArray();
                foreach (var label in hitLabelList.Take(10))
                {
                    labelJson.Add(new BsonDocument().Add("labelId", label.Text("labelId")).Add("name", label.Text("name")));
                }
                var articleDoc = new BsonDocument();
                articleDoc.Add("articleId", article.Text("articleId"));
                articleDoc.Add("name", article.Text("name"));
                articleDoc.Add("shortName", StringExtension.CutStr(article.Text("name"), 25, ".."));
                articleDoc.Add("createUserName", article.CreateUserName());
                articleDoc.Add("replyCount", article.Int("replyCount"));
                articleDoc.Add("viewCount", article.Int("viewCount"));
                articleDoc.Add("favoriateCount", article.Int("favoriateCount"));
                articleDoc.Add("priseCount", article.Int("priseCount"));
                articleDoc.Add("updateDate", article.DateFormat("updateDate", "yyyy-MM-dd"));
                articleDoc.Add("labelIds", labelJson);
                resultList.Add(articleDoc);
            }
            if (hitArticleList.Count < pageSize)
                flag = false;
            return Json(new { data = resultList.ToJson(), flag, recordCount = resultList.Count(), allRecordCount = articleIds.Count() });
        }
        #endregion

        #region 文章点赞收藏

        /// <summary>
        ///  收藏操作
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateMindMapArticleFaoriate()
        {
            MindMapBll MMB = MindMapBll._();
            string articleId = PageReq.GetForm("articleId");//主键Id
            var result = new InvokeResult();
            var curArticle = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
            if (curArticle == null)
            {
                result.Status = Status.Failed;
                result.Message = "文章不存在请刷新";
            }
            else
            {
                result = MMB.UpdateMindMapArticleFavoriate(this.CurrentUserId.ToString(), articleId);

            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        ///  点赞操作
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateMindMapArticlePrise()
        {
            MindMapBll MMB = MindMapBll._();
            string articleId = PageReq.GetForm("articleId");//主键Id
            var result = new InvokeResult();
            var curArticle = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
            if (curArticle == null)
            {
                result.Status = Status.Failed;
                result.Message = "文章不存在请刷新";
            }
            else
            {
                result = MMB.UpdateMindMapArticlePrise(this.CurrentUserId.ToString(), articleId);

            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #endregion

        #endregion
        /// <summary>
        /// 获取urlHashCode
        /// </summary>
        /// <param name="filterContext"></param>
        /// <returns></returns>
        private int GetUrlHashCode(ActionExecutingContext filterContext)
        {
            return GetUrlHashCode(filterContext.HttpContext.Request);
        }

        private int GetUrlHashCode(HttpRequestBase request)
        {
            int urlHashCode = 0;
            try
            {
                //HttpRequestBase request = filterContext.HttpContext.Request;
                var method = request.HttpMethod;//post/get
                var paramBson = new BsonDocument();
                if (method == "GET")
                {
                    paramBson = TypeConvert.NameValueToBsonDocument(request.QueryString);
                }
                else if (method == "POST")
                {
                    paramBson = TypeConvert.NameValueToBsonDocument(request.Form);
                }
                var orininalString = request.Url.OriginalString;
                urlHashCode = string.Format("{0}{1}", orininalString, paramBson).GetHashCode();
            }
            catch (Exception ex)
            {
            }
            return urlHashCode;
        }

        #region 动作执行前 是否有宝箱
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var actionArray = new Dictionary<string, int>();
            actionArray.Add("MindMapSearch", 1);
            actionArray.Add("MindMapLabelDetail", 1);
            actionArray.Add("MindMapArticleView", 2);
            var actionName = RouteData.Values["Action"].ToString(); //当前action
            if (!actionArray.ContainsKey(actionName))
            {
                return;
            }
            var drouCount = actionArray[actionName];//掉落个数
            int urlHashCode = GetUrlHashCode(filterContext);
            ItemDropActionCheck(urlHashCode, drouCount);
            RouteData.Values.Add("urlHashCode", urlHashCode.ToString()); // 掉落次数结束
        }
        /// <summary>
        /// 掉落动作执行
        /// </summary>
        /// <param name="urlHashCode"></param>
        public void  ItemDropActionCheck(int urlHashCode,int drouCount=1)
        {
            ItemHelper itemHelper = new ItemHelper();
            int cdTime = ItemHelper.DROPCDTIME; ;
            int EXPERTOBJECTKEYTIME = ItemHelper.EXPERTOBJECTKEYTIME;//0.5天重置
            
            var canContinue = true;
            RouteData.Values.Add("pageCanDropItem", "1"); //当前页面可掉落物品
            var avaiableDropTimes = itemHelper.ExecDailyItemDropTimes(dataOp.GetCurrentUserId().ToString());
            RouteData.Values.Add("avaiableDropTimes", avaiableDropTimes.ToString()); // 掉落次数结束

            #region 掉落cd 2分钟
            var itemDropTime = PageReq.GetObjSession("itemDropTime") as DateTime?;
            if (itemDropTime != null && itemDropTime.HasValue)
            {
                if ((DateTime.Now - itemDropTime.Value).TotalSeconds < cdTime) //cd中
                {
                    var nextAvaiableCoolTime = itemDropTime.Value.AddSeconds(cdTime);
                    RouteData.Values.Add("nextAvaiableCoolTime", nextAvaiableCoolTime.ToString("yyyy-MM-dd HH:mm:ss")); //下次有效时间
                    canContinue = false;
                }
            }
            #endregion
            #region 防止每次刷新都掉落数据，2017.4.24 新增浏览不同数据才进行掉落
          
            var viewExpertObjCacheKey = string.Format("EXPERTOBJECTKEY_{0}", this.CurrentUserId);
            var expertUrlQueue = CacheHelper.GetCache(viewExpertObjCacheKey) as List<int>;
            if (expertUrlQueue != null)
            {
                if (expertUrlQueue.Contains(urlHashCode))
                {
                    RouteData.Values.Add("isDropCompleted", "1"); // 已经攻略该位置
                    canContinue = false;
                }
            }
            else
            {
                CacheHelper.SetCache(viewExpertObjCacheKey, new List<int> { }, null, DateTime.Now.AddDays(EXPERTOBJECTKEYTIME));
            }
            #endregion


            //剩余获得次数
            if (!canContinue || avaiableDropTimes <= 0) //每日获得上限
            {

                return ;
            }
            #region 判断字符可靠性
            var t = PageReq.GetParam("t");
            var sign = PageReq.GetParam("sign");
            //页面上的url字符串
            if (!string.IsNullOrEmpty(sign))
            {
                if (string.IsNullOrEmpty(t))
                {
                    RouteData.Values.Add("errorMsg", "随机数参数不能为空");
                    return;
                }
                if (PageReq.UrlCheckSign() )
                {
                    DateTime curDate;
                    IFormatProvider ifp = new System.Globalization.CultureInfo("zh-CN", true);
                    if(!DateTime.TryParseExact(t,"yyyyMMddHHmmss",ifp,System.Globalization.DateTimeStyles.None,out curDate))
                    {
                        RouteData.Values.Add("errorMsg", "参数传入有误");
                        return;
                    }
                    if ((DateTime.Now - curDate).TotalMinutes >= 1)
                    {
                        RouteData.Values.Add("errorMsg", "token超时");
                        return;
                    }
                    drouCount = SysAppConfig.Mission_HellItemDropCount;//掉落个数提升
                }
                else
                {
                    RouteData.Values.Add("errorMsg", "token失效");
                    return;
                }
            }
            #endregion
           
            string jsonResult = this.ItemDrop(drouCount);
            if (jsonResult.Contains("道具"))
            {
                ///有掉落才限制同一个url半天不能访问一次
                if (expertUrlQueue != null)
                {
                    expertUrlQueue.Add(urlHashCode);
                }
                RouteData.Values.Add("Item", jsonResult);
                RouteData.Values.Add("isDrop", "1"); //将是否有宝箱标志加到路由中
            }
        }
        /// <summary>
        /// 开启宝箱
        /// </summary>
        /// <returns></returns>
        public JsonResult OpenItem()
        {
            var t = PageReq.GetParam("t");
            var sign = PageReq.GetParam("sign");
            if (string.IsNullOrEmpty(sign) || string.IsNullOrEmpty(t))
            {
                var errorResult = new[] { "" }.Select(d => new { succeed = "false", errorMsg = "参数输入有误" });
                return Json(errorResult);
            }
            var urlHashCode = PageReq.GetParamInt("urlHashCode");
            ItemDropActionCheck(urlHashCode);
            var isDrop = RouteData.Values["isDrop"] as String ?? "0"; //是否掉落
            var isDropCompleted = RouteData.Values["isDropCompleted"] as String ?? "0"; //是否攻略
            var avaiableDropTimes =  RouteData.Values["avaiableDropTimes"] as String ?? "0"; //是否掉落次数为0
            var nextAvaiableCoolTimeStr = RouteData.Values["nextAvaiableCoolTime"] as String ?? ""; //是否掉落次数为0
            var pageCanDropItem =  RouteData.Values["pageCanDropItem"] as String ?? ""; //页面是否可掉落道具
            var Item = RouteData.Values["Item"] as String ?? "";
            var errorMsg = RouteData.Values["errorMsg"] as String ?? "";
            var nextItemDropHasCD = false;
            var nextAvaiableCoolTime = DateTime.Now;
            if (!string.IsNullOrEmpty(nextAvaiableCoolTimeStr))
            {
                nextItemDropHasCD = true;
                nextAvaiableCoolTime = DateTime.Parse(nextAvaiableCoolTimeStr);
            }
            var succeed = "true";
            if (!string.IsNullOrEmpty(errorMsg))
            {
                succeed = "false";
            }
            var result=new []{""}.Select(d=>new {succeed=succeed,errorMsg=errorMsg, isDrop=isDrop,isDropCompleted=isDropCompleted,avaiableDropTimes=avaiableDropTimes,nextAvaiableCoolTimeStr=nextAvaiableCoolTimeStr,pageCanDropItem=pageCanDropItem, Item=Item, nextItemDropHasCD=nextItemDropHasCD,nextAvaiableCoolTime=nextAvaiableCoolTime  });
            return Json(result);
        }
        #endregion
    }
}
