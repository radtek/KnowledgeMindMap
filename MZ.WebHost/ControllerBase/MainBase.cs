using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Collections.Specialized;
using MongoDB.Bson;
using System.Web;
using Yinhe.ProcessingCenter.MvcFilters;
using Yinhe.ProcessingCenter.Document;
using System.Text.RegularExpressions;
using Yinhe.ProcessingCenter.DataRule;
using System.Web.Security;
using MongoDB.Driver.Builders;
using System.Collections;
using Yinhe.ProcessingCenter.Permissions;
using System.IO;
using MongoDB.Driver;
using MongoDB.Bson.IO;
using Yinhe.ProcessingCenter.Common;
using System.Transactions;
using System.Threading;
using System.Diagnostics;
using org.in2bits.MyXls;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Data;


namespace Yinhe.ProcessingCenter
{
    /// <summary>
    /// A3基类
    /// </summary>
    public class DelTableInfo
    {
        /// <summary>
        /// 要删除的数据所属表名
        /// </summary>
        public string tbName { get; set; }

        /// <summary>
        /// 字段名称
        /// </summary>
        public string keyName { get; set; }

        /// <summary>
        /// 对应字段的值
        /// </summary>
        public string keyValue { get; set; }

        /// <summary>
        /// 对应被引用表的信息：表名为key，主键为value
        /// </summary>
        public Dictionary<string, string> relInfos { get; set; }
    }

    /// <summary>
    /// MVC Controller的通用基类
    /// </summary>
    [CommonExceptionAttribute]
    public partial class ControllerBase : Controller
    {


        public CommonLog _log = new CommonLog();
        /// <summary>
        /// "table1,key1|table2,key2"
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="keyName"></param>
        /// <param name="keyValue"></param>
        /// <param name="relInfos"></param>
        /// <returns></returns>
        public JsonResult CommonDel(string tbName, string keyName, string keyValue, string relInfos)
        {
            try
            {
                if (string.IsNullOrEmpty(tbName) && string.IsNullOrEmpty(keyName))
                    throw new Exception("传入参数有误，删除失败！");
                if (!string.IsNullOrEmpty(relInfos))
                {
                    var tempList = relInfos.SplitParam("|");
                    foreach (var temp in tempList)
                    {
                        var kv = temp.SplitParam(",");
                        IMongoQuery relQuery = Query.EQ(kv[1], keyValue);
                        if (dataOp.FindAllByQuery(kv[0], relQuery).Any())
                            return Json(new { Success = false, msg = "数据已经被引用，不能删除" });
                    }
                }
                IMongoQuery query = Query.EQ(keyName, keyValue);
                var result = dataOp.Delete(tbName, query);
                return Json(ConvertToPageJson(result));
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, msg = ex.Message });
            }
        }
        /// <summary>
        /// 资金管控删除测试
        /// </summary>
        /// <returns></returns>
        public ActionResult DeleteVersionTest(string versionId)
        {
            var result = dataOp.Delete("PolicyVersion", Query.EQ("versionId",versionId));
            return Json(ConvertToPageJson(result));
        }

        /// <summary>
        /// 通过主键删除
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="keyValue"></param>
        /// <param name="relTbNames"></param>
        /// <returns></returns>
        public JsonResult CommonDelByPK(string tbName, string keyVal, string relTbName, string relKey)
        {
            try
            {
                TableRule rule = new TableRule(tbName);
                var pk = rule.PrimaryKey;

                if (!string.IsNullOrEmpty(relTbName))//如果传入关联表，则判断该数据是否被关联。
                {
                    var relKey1 = pk;
                    if (!string.IsNullOrEmpty(relKey))
                        relKey1 = relKey;
                    IMongoQuery relQuery = Query.EQ(relKey1, keyVal);
                    var rels = dataOp.FindAllByQuery(relTbName, relQuery);
                    if (rels.Any())//存在关联数据，不能被删除，直接返回错误提示信息
                    {
                        return Json(new { Success = false, msg = "数据已经被引用，不能删除" });
                    }
                }
                IMongoQuery query = Query.EQ(pk, keyVal);
                var result = dataOp.Delete(tbName, query);

                return Json(ConvertToPageJson(result));
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, msg = ex.Message });
            }
        }

        #region 私有属性
        private DataOperation _dataOp = null;

        /// <summary>
        /// 数据操作类
        /// </summary>
        public DataOperation dataOp
        {
            get
            {
                if (_dataOp == null) _dataOp = new DataOperation();
                return this._dataOp;
            }
        }

        private static readonly object objPad = new object();
        #endregion

        #region 公共属性
        /// <summary>
        /// 获取当前用户的Id
        /// </summary>
        /// <value>当前用户的ID</value>
        public int CurrentUserId
        {
            get
            {
                if (string.IsNullOrEmpty(PageReq.GetSession("UserId").ToString()))
                {
                    return -1;
                }
                else
                {
                    return int.Parse(PageReq.GetSession("UserId"));
                    //PageReq.SetSession("UserId", "1");
                    return 1;
                }
            }
        }

        #region 新城地产控股类别
        /// <summary>
        /// 获取当前
        /// </summary>
        /// <value>当前用户的区域类型新城专用</value>
        public List<int> BusOrgAreaTypeList
        {
            get
            {
                if (Session["areaTypeCollection"] != null)
                {
                    return Session["areaTypeCollection"] as List<int> ?? new List<int>();
                }
                else
                {
                    return new List<int>();
                }
            }
        }

        public int latestUrlBusOrgAreaTypeId
        {
            get
            {
                if (Session["BusOrgAreaTypeId"] != null)
                {
                    return (int)Session["BusOrgAreaTypeId"];
                }
                else
                {
                    return -1;
                }
            }
            set
            {

                Session["BusOrgAreaTypeId"] = value;
            }


        }
        public int BusOrgAreaTypeId()
        {
            if ((SysAppConfig.IsPlugIn == true) && BusOrgAreaTypeList.Count() <= 0)
            {
                Session["areaTypeCollection"] = new List<int> { -1, (int)UserAreaType.LandArea, (int)UserAreaType.GroupArea };
            }

            if (BusOrgAreaTypeList.Count == 1)//只有单个权限默认全显示单个
            {
                latestUrlBusOrgAreaTypeId = BusOrgAreaTypeList[0];
            }
            else
            {
                if (string.IsNullOrEmpty(PageReq.GetParam("BusOrgAreaTypeId")))
                {

                    if (BusOrgAreaTypeList.Count > 0)//如果多个也返回0？两个权限均有以最新权限为准
                    {
                        if (latestUrlBusOrgAreaTypeId != 0)
                        {
                            return latestUrlBusOrgAreaTypeId;
                        }
                        else
                        {
                            return BusOrgAreaTypeList[0];//取第一个

                        }
                    }
                    else//无权限,默认返回地产页面
                    {
                        if (latestUrlBusOrgAreaTypeId != 0)
                        {
                            return latestUrlBusOrgAreaTypeId;
                        }
                        else
                        {
                            //跳转至无权限登录页面
                            return 0;

                        }

                    }
                }
                else
                {
                    var _busOrgAreaTypeId = PageReq.GetParamInt("BusOrgAreaTypeId");

                    if (BusOrgAreaTypeList.Contains(_busOrgAreaTypeId))//没有权限但又进行访问
                    {
                        latestUrlBusOrgAreaTypeId = _busOrgAreaTypeId;
                    }
                    else
                    {
                        if (BusOrgAreaTypeList.Count() > 0)
                        {
                            //跳转至无权限登录页面
                            Response.Redirect("/Home/ErrorInfo", true);
                        }
                        else
                        {
                            latestUrlBusOrgAreaTypeId = 0;//默认为地产
                        }
                    }
                }
            }

            return latestUrlBusOrgAreaTypeId;
        }


        /// <summary>
        /// 是否地产类型
        /// </summary>
        public bool IsBusOrgLandArea
        {
            get
            {
                var hitObjCount = BusOrgAreaTypeList.Where(c => c == (int)UserAreaType.LandArea).Count();
                return hitObjCount > 0;
            }
        }

        /// <summary>
        /// 是否集团控股类型
        /// </summary>
        public bool IsBusOrgGroupArea
        {
            get
            {
                var hitObjCount = BusOrgAreaTypeList.Where(c => c == (int)UserAreaType.GroupArea).Count();
                return hitObjCount > 0;
            }
        }

        public Func<BsonDocument, int, bool> AreaTypeIdFilterFunc = new Func<BsonDocument, int, bool>(AreaTypeIdFilter);//委托对象
        /// <summary>
        /// 数据过滤比较
        /// </summary>
        /// <typeparam name="?"></typeparam>
        /// <typeparam name="?"></typeparam>
        /// <param name="bsonDoc"></param>
        /// <param name="urlAreaTypeId"></param>
        /// <returns></returns>
        /// <summary>
        /// 数据过滤比较
        /// </summary>
        /// <typeparam name="?"></typeparam>
        /// <typeparam name="?"></typeparam>
        /// <param name="bsonDoc"></param>
        /// <param name="urlAreaTypeId"></param>
        /// <returns></returns>
        static bool AreaTypeIdFilter(BsonDocument bsonDoc, int urlAreaTypeId)
        {
            if (bsonDoc.Text("underTable") == "ProductSeries")//产品系列特殊处理,非地产展示所有
            {
                if (urlAreaTypeId != (int)UserAreaType.LandArea)
                {
                    urlAreaTypeId = -1;
                }
            }

            if (urlAreaTypeId == -1)
            {
                return true;
            }
            else
            {
                if (bsonDoc.Int("busOrgAreaTypeId") == -1 || bsonDoc.Int("busOrgAreaTypeId") == urlAreaTypeId)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

        }
        #endregion


        #endregion

        /// <summary>
        /// 保存提交上来的数据
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult SavePostInfo(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();

            #region 构建数据
            string tbName = PageReq.GetForm("tbName");
            string queryStr = PageReq.GetForm("queryStr");
            string dataStr = PageReq.GetForm("dataStr");
            TableRule rule = new TableRule(tbName);
            BsonDocument dataBson = new BsonDocument();
            bool columnNeedConvert = false;
            if (dataStr.Trim() == "")
            {
                if (saveForm.AllKeys.Contains("fileObjId"))
                {
                    columnNeedConvert = true;
                }
                foreach (var tempKey in saveForm.AllKeys)
                {
                    if (tempKey == "tbName" || tempKey == "queryStr" || tempKey.Contains("fileList[") || tempKey.Contains("param.")) continue;
                    //2016.1.25添加数据转换过滤,
                    //由于前端通用TableManage需要上传可能会内置tableName字段，如果表中页游tableName字段可能会冲突保存不了
                    //目前做法前段替换，后端转化COLUMNNEEDCONVERT_
                    var curFormValue= PageReq.GetForm(tempKey);
                    var curColumnName = tempKey;
                    if (columnNeedConvert&&tempKey.Contains("COLUMNNEEDCONVERT_"))
                    {
                        curColumnName = curColumnName.Replace("COLUMNNEEDCONVERT_", string.Empty);
                    }
                    dataBson.Set(curColumnName, curFormValue);
                }
            }
            else
            {
                dataBson = TypeConvert.ParamStrToBsonDocument(dataStr);
            }
            #endregion
             

            #region 保存数据
            result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
            #endregion

            #region 文件上传
            int primaryKey = 0;
            ColumnRule columnRule = rule.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault();
            string keyName = columnRule != null ? columnRule.Name : "";
            if (!string.IsNullOrEmpty(queryStr))
            {
                var query = TypeConvert.NativeQueryToQuery(queryStr);
                var recordDoc = dataOp.FindOneByQuery(tbName, query);
                saveForm["keyValue"] = result.BsonInfo.Text(keyName);
                if (recordDoc != null)
                {
                    primaryKey = recordDoc.Int(keyName);
                }
            }

            if (primaryKey == 0)//新建
            {
                if (saveForm["tableName"] != null)
                {
                    saveForm["keyValue"] = result.BsonInfo.Text(keyName);

                }
            }
            else//编辑
            {
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
                                var fileRelIdList = fileArray.Select(t => (BsonValue)t).ToList();
                                var result1 = opHelper.DeleteFileByRelIdList(fileRelIdList);
                            }
                            //{
                            //    foreach (var item in fileArray)
                            //    {
                            //        var result1 = opHelper.DeleteFileByRelId(int.Parse(item));
                            //        if (result1.Status == Status.Failed)
                            //        {
                            //            break;
                            //        }
                            //    }
                            //}
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

                saveForm["keyValue"] = primaryKey.ToString();
            }
            result.FileInfo = SaveMultipleUploadFiles(saveForm);
            #endregion

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 通用删除
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="queryJson"></param>
        /// <returns></returns>
        public ActionResult UniversalSave(string tbName, string queryJson, string dataJson)
        {
            InvokeResult result = new InvokeResult();

            QueryDocument query = null;

            if (string.IsNullOrEmpty(queryJson) == false)
            {
                query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<QueryDocument>(queryJson);
            }

            BsonDocument data = null;

            if (string.IsNullOrEmpty(dataJson) == false)
            {
                data = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(dataJson);
            }

            if (tbName != "")
            {
                result = dataOp.Save(tbName, query, data);
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 逻辑删除对应记录
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult logicDelePostInfo(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();
            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";
            string queryStr = saveForm["queryStr"] != null ? saveForm["queryStr"] : "";
            string dataStr = "";
            #region 删除数据
            BsonDocument curData = new BsonDocument();  //当前数据,即操作前数据

            if (queryStr.Trim() != "") curData = dataOp.FindOneByQuery(tbName, TypeConvert.NativeQueryToQuery(queryStr));

            if (curData != null)
            {
                result = dataOp.Update(curData, "delStatus=1");
            }
          
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }


        /// <summary>
        /// 删除提交上来的信息
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        /// 
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DelePostInfo(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();

            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";
            string queryStr = saveForm["queryStr"] != null ? saveForm["queryStr"] : "";
            string dataStr = "";

            int primaryKey = 0;
            TableRule rule = new TableRule(tbName);
            string keyName = rule.GetPrimaryKey();
            var isLogicDel = rule.isLogicDel;
            if (!isLogicDel)
            {
                #region 删除文档

                if (!string.IsNullOrEmpty(queryStr))
                {
                    var query = TypeConvert.NativeQueryToQuery(queryStr);
                    var recordDoc = dataOp.FindOneByQuery(tbName, query);
                    saveForm["keyValue"] = result.BsonInfo.Text(keyName);
                    if (recordDoc != null)
                    {
                        primaryKey = recordDoc.Int(keyName);
                    }

                    FileOperationHelper opHelper = new FileOperationHelper();
                    result = opHelper.DeleteFile(tbName, keyName, primaryKey.ToString());
                }
                #endregion

                #region 删除数据
                BsonDocument curData = new BsonDocument();  //当前数据,即操作前数据

                if (queryStr.Trim() != "") curData = dataOp.FindOneByQuery(tbName, TypeConvert.NativeQueryToQuery(queryStr));

                dataOp.SetOperationData(tbName, queryStr, dataStr);

                result = dataOp.Delete();
                #endregion
                //删除文件
            }
            else
            {
                return logicDelePostInfo(saveForm);
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 通用删除
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="queryJson"></param>
        /// <returns></returns>
        public ActionResult UniversalDelete(string tbName, string queryJson)
        {
            InvokeResult result = new InvokeResult();

            QueryDocument query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<QueryDocument>(queryJson);

            if (tbName != "" && query != null)
            {
                result = dataOp.Delete(tbName, query);
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 根据主键Id批量删除
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult BatchDeleteByPrimaryKey(FormCollection saveForm)
        {
            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";

            string ids = saveForm["ids"] != null ? saveForm["ids"] : "";

            InvokeResult result = new InvokeResult();

            List<int> idList = TypeConvert.StringToIntEnum(ids, ",").ToList();

            List<StorageData> delList = new List<StorageData>();

            TableRule table = new TableRule(tbName);

            foreach (var tempId in idList)
            {
                var query = Query.EQ(table.GetPrimaryKey(), tempId.ToString());

                StorageData temp = new StorageData();

                temp.Name = tbName;
                temp.Query = query;
                temp.Type = StorageType.Delete;
                temp.Document = new BsonDocument();

                delList.Add(temp);
            }


            result = dataOp.BatchSaveStorageData(delList);

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 移动提交上来的信息
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult MovePostInfo(FormCollection saveForm)
        {
            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";       //要移动的表
            string moveId = saveForm["moveId"] != null ? saveForm["moveId"] : "";       //要移动的节点Id
            string moveToId = saveForm["moveToId"] != null ? saveForm["moveToId"] : ""; //要移动至的目标节点
            string type = saveForm["type"] != null ? saveForm["type"] : "";             //要移动的类型:pre,next,child

            InvokeResult result = dataOp.Move(tbName, moveId, moveToId, type);

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        
        /// <summary>
        /// 获取简单表的Json列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="ps">每页条数(默认20,-1不翻页)</param>
        /// <param name="cu">当前页</param>
        /// <param name="qu">查询语句(原生查询)</param>
        /// <param name="of">排序字段</param>
        /// <param name="ot">排序类型(空正序,desc倒序)</param>
        /// <returns></returns>
        public ActionResult GetSingleTableJson(string tbName, int? ps, int? cu, string qu, string of, string ot)
        {
            int pageSize = (ps != null && ps.HasValue&& ps.Value != 0) ? ps.Value : 20;
            int current = (cu != null && cu.HasValue && cu.Value != 0) ? cu.Value : 1;

            string query = qu != null ? qu : "";
            string orderField = of != null ? of : "";
            string orderType = ot != null ? ot : "";

            var queryComp = TypeConvert.NativeQueryToQuery(query);

            List<BsonDocument> allDocList = new List<BsonDocument>();
            if (tbName != null && tbName != "") {
                allDocList = queryComp != null ? dataOp.FindAllByQuery(tbName, queryComp).ToList() : dataOp.FindAll(tbName).ToList();
            }
                
            //2015.8.26添加新城控股地产权限判断
            if (SysAppConfig.CustomerCode == CustomerCode.XC )
            {
                allDocList = allDocList.Where(c => AreaTypeIdFilterFunc(c, PageReq.GetParamInt("BusOrgAreaTypeId"))).ToList();
            }
            if (tbName == "Material_Standardization")//现价库添加版本需要过滤isUpdated功能
            {
                allDocList = allDocList.Where(c => c.Int("isUpdated")!=1).ToList();
            }
 
            int allCount = allDocList.Count();

            if (orderField != null && orderField != "")
            {
                if (orderType != null && orderType == "desc")
                {
                    allDocList = allDocList.OrderByDescending(t => t.String(orderField)).ToList();
                }
                else
                {
                    allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                }
            }
           

            List<Hashtable> retList = new List<Hashtable>();

            if (pageSize != -1)
            {
                allDocList = allDocList.Skip((current - 1) * pageSize).Take(pageSize).ToList();
            }

            foreach (var tempDoc in allDocList)
            {
                tempDoc.Add("allCount", allCount.ToString());
                tempDoc.Remove("_id");

                retList.Add(tempDoc.ToHashtable());
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取简单表的Json列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="ps">每页条数(默认20,-1不翻页)</param>
        /// <param name="cu">当前页</param>
        /// <param name="qu">查询语句(a=b&a=b)</param>
        /// <param name="of">排序字段</param>
        /// <param name="ot">排序类型(空正序,desc倒序)</param>
        /// <returns></returns>
        public ActionResult GetSingleTableByQueryStr(string tbName, int? ps, int? cu, string qu, string of, string ot)
        {
            int pageSize = (ps != null && ps.Value != 0) ? ps.Value : 20;
            int current = (cu != null && cu.Value != 0) ? cu.Value : 1;

            string query = qu != null ? qu : "";
            string orderField = of != null ? of : "";
            string orderType = ot != null ? ot : "";

            //var queryComp = TypeConvert.NativeQuesryToQuery(query);
            var queryComp = TypeConvert.ParamStrToQuery(query);

            List<BsonDocument> allDocList = queryComp != null ? dataOp.FindAllByQuery(tbName, queryComp).ToList() : dataOp.FindAll(tbName).ToList();

            int allCount = allDocList.Count();

            if (orderField != null && orderField != "")
            {
                if (orderType != null && orderType == "desc")
                {
                    allDocList = allDocList.OrderByDescending(t => t.String(orderField)).ToList();
                }
                else
                {
                    allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                }
            }

            List<Hashtable> retList = new List<Hashtable>();

            if (pageSize != -1)
            {
                allDocList = allDocList.Skip((current - 1) * pageSize).Take(pageSize).ToList();
            }

            foreach (var tempDoc in allDocList)
            {
                tempDoc.Add("allCount", allCount.ToString());
                tempDoc.Remove("_id");

                retList.Add(tempDoc.ToHashtable());
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 将中文转换为拼音
        /// </summary>
        /// <param name="cnStr"></param>
        /// <returns></returns>
        public string ChangeChinesetoPinYin(string cnStr)
        {
            cnStr = HttpUtility.UrlDecode(cnStr);

            string tempResult = PinyinHelper.GetPinyin(cnStr);

            Regex rex = new Regex("[a-z0-9A-Z_]+");
            MatchCollection mc = rex.Matches(tempResult);

            string retStr = "";

            foreach (Match m in mc)
            {
                retStr += m.ToString();
            }

            return retStr;
        }

        public JsonResult GetList()
        {
            var list = dataOp.FindAll("SysUser").Take(10).ToList();
            List<Hashtable> retList = new List<Hashtable>();

            foreach (var tempDoc in list)
            {
                tempDoc.Remove("_id");

                retList.Add(tempDoc.ToHashtable());
            }

            return Json(retList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 系统权限通用列表新增接口 对比数据库已有记录 
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult CommonInsertPost()
        {
            InvokeResult result = new InvokeResult();
            string tbName = PageReq.GetForm("tbName");//表名
            string ids = PageReq.GetForm("ids");//主键值
            int roleId = PageReq.GetFormInt("roleId");//角色ID
            TableRule table = new TableRule(tbName);
            string primaryKey = table.GetPrimaryKey();//获得主键名
            string[] idArray = ids.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);

            #region 删除旧的全部关联
            result = dataOp.Delete(tbName, "db." + tbName + ".distinct('_id',{'roleId':'" + roleId + "'})");
            #endregion

            if (idArray.Length > 0 && result.Status == Status.Successful)
            {
                foreach (var item in idArray)
                {
                    BsonDocument doc = new BsonDocument();
                    foreach (var entity in table.ColumnRules.Where(t => t.IsPrimary == false && t.Name != "roleId").Take(1))
                    {
                        doc.Add(entity.Name, item);
                    }
                    doc.Add("roleId", roleId);
                    result = dataOp.Insert(tbName, doc);
                }
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #region 获取树形XML数据

        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(a=b&a=b&....)</param>
        /// <returns></returns>
        public ActionResult GetSingleTreeXML(string tbName, string queryStr)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            if (string.IsNullOrEmpty(queryStr))
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAllByQueryStr(tbName, queryStr).ToList();
            }
            if (SysAppConfig.CustomerCode == CustomerCode.PM || SysAppConfig.CustomerCode == CustomerCode.TestPM)
            {
                var propertyId = PageReq.GetString("propertyId");
                allNodeList = allNodeList.Where(c => c.String("propertyId") == propertyId).ToList();
            }
           

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }
        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(a=b&a=b&....)</param>
        /// <returns></returns>
        public ActionResult GetLevelSingleTreeXML(string tbName, string queryStr, int nodeLevel)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            if (string.IsNullOrEmpty(queryStr))
            {
                allNodeList = dataOp.FindAll(tbName).Where(x => x.Int("nodeLevel") > nodeLevel).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAllByQueryStr(tbName, queryStr).Where(x => x.Int("nodeLevel") > nodeLevel).ToList();
            }

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }
        /// <summary>
        /// 通过多条件获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="queryStr">(a=a:b=b:c=c)</param>
        /// <returns></returns>
        public ActionResult GetSingleTreeMutiQueryXML(string tbName, string queryStr)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            if (string.IsNullOrEmpty(queryStr))
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                queryStr = queryStr.Replace(":", "&");
                allNodeList = dataOp.FindAllByQueryStr(tbName, queryStr).ToList();
            }

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }

        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(a=b&a=b&....)</param>
        /// <returns></returns>
        public ActionResult GetSingleNoRootTreeXML(string tbName, string queryStr)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            if (string.IsNullOrEmpty(queryStr))
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAllByQueryStr(tbName, queryStr).ToList();
            }

            List<TreeNode> treeList = new List<TreeNode>();
            List<TreeNode> tempTreeList = TreeHelper.GetSingleTreeList(allNodeList);

            if (tempTreeList.Count == 1)
            {
                treeList = tempTreeList[0].SubNodes;
            }

            return new XmlTree(treeList);
        }


        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(a=b&a=b&....)</param>
        /// <returns></returns>
        public ActionResult GetSingleTreeXMLByIntOrStr(string tbName, string queryStr)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();
            string[] paramArry = queryStr.Split('&');
            if (paramArry.Length == 0)
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAll(tbName).ToList();

                foreach (var tempArr in paramArry)
                {
                    var temp = tempArr.Split('=');

                    if (temp.Length == 2)
                    {
                        bool tempBool = true;
                        if (string.IsNullOrEmpty(temp[1]))
                        {
                            tempBool = false;
                        }
                        foreach (char c in temp[1])
                        {
                            if (!char.IsDigit(c))
                                tempBool = false;
                            break;
                        }

                        if (tempBool)
                        {
                            allNodeList = allNodeList.Where(x => x.String(temp[0]) == temp[1] || x.Int(temp[0]) == int.Parse(temp[1])).ToList();
                        }
                        else
                        {
                            allNodeList = allNodeList.Where(x => x.String(temp[0]) == temp[1]).ToList();
                        }
                    }
                }
            }
            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);
            return new XmlTree(treeList);
        }

        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(原生查询:db.tbName....)</param>
        /// <returns></returns>
        public ActionResult GetSingleTreeXMLByQuery(string tbName, string queryStr)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            IMongoQuery query = Query.Null;

            if (queryStr.StartsWith("db.")) query = TypeConvert.NativeQueryToQuery(queryStr);
            else if (queryStr.StartsWith("{"))
            {
                query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<QueryDocument>(queryStr);
            }

            if (query == null)
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAllByQuery(tbName, query).ToList();
            }

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }


        /// <summary>
        /// 获取单表普通树的XML列表
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询条件(原生查询:db.tbName....)</param>
        /// <param name="order">排序字段</param>
        /// <param name="orderType">排序字段类型 0：string 1：int </param>
        /// <param name="orderDirect">排序方向 0：正序 1：逆序</param>
        /// <returns></returns>
        public ActionResult GetSingleTreeXMLByQueryAndOrder(string tbName, string queryStr, string order, int orderType, int orderDirect)
        {
            List<BsonDocument> allNodeList = new List<BsonDocument>();

            IMongoQuery query = Query.Null;

            if (queryStr.StartsWith("db.")) query = TypeConvert.NativeQueryToQuery(queryStr);
            else if (queryStr.StartsWith("{"))
            {
                query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<QueryDocument>(queryStr);
            }

            if (query == null)
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }
            else
            {
                allNodeList = dataOp.FindAllByQuery(tbName, query).ToList();
            }

            if (order != "")
            {
                if (orderDirect == 0)
                {
                    if (orderType == 0)
                    {
                        allNodeList = allNodeList.OrderBy(f => f.Text(order)).ToList();
                    }
                    else
                    {
                        allNodeList = allNodeList.OrderBy(f => f.Int(order)).ToList();
                    }
                }
                else
                {
                    if (orderType == 0)
                    {
                        allNodeList = allNodeList.OrderByDescending(f => f.Text(order)).ToList();
                    }
                    else
                    {
                        allNodeList = allNodeList.OrderByDescending(f => f.Int(order)).ToList();
                    }
                }
            }

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }

        /// <summary>
        /// 获取单表普通树的子树XML
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="curNodeId">当前节点Id</param>
        /// <param name="lv">获取层级</param>
        /// <param name="itself">是否包含本身节点,0不包含,1包含</param>
        /// <returns></returns>
        public ActionResult GetSingleSubTreeXML(string tbName, string curNodeId, int itself)
        {
            int lv = PageReq.GetFormInt("lv") != 0 ? PageReq.GetFormInt("lv") : (PageReq.GetParamInt("lv") != 0 ? PageReq.GetParamInt("lv") : 0);   //展示层级

            TableRule tableEntity = new TableRule(tbName);    //获取表结构

            string primaryKey = tableEntity.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault().Name;  //寻找默认主键

            List<BsonDocument> allNodeList = new List<BsonDocument>();

            if (curNodeId.Trim() != "0" && curNodeId != "")
            {
                BsonDocument curNode = dataOp.FindOneByKeyVal(tbName, primaryKey, curNodeId);

                if (lv == 0)    //获取所有子节点
                {
                    allNodeList = dataOp.FindChildNodes(tbName, curNodeId).ToList();
                }
                else        //获取对应层级的子节点
                {
                    allNodeList = dataOp.FindChildNodes(tbName, curNodeId).Where(t => t.Int("nodeLevel") <= (curNode.Int("nodeLevel") + lv)).ToList();
                }

                if (itself == 1)
                {
                    allNodeList.Add(curNode);
                }
            }
            else
            {
                allNodeList = dataOp.FindAll(tbName).ToList();
            }

            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(allNodeList);

            return new XmlTree(treeList);
        }

        #endregion

        #region 文件相关操作
        /// <summary>
        /// 上传单个文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public JsonResult SaveSingleUploadFile(FormCollection saveForm)
        {
            string tableName = saveForm["tableName"] != null ? saveForm["tableName"] : "";
            string keyName = saveForm["keyName"] != null ? saveForm["keyName"] : "";
            string keyValue = saveForm["keyValue"] != null ? saveForm["keyValue"] : "";
            int fileTypeId = saveForm["fileTypeId"] != null ? int.Parse(saveForm["fileTypeId"]) : 0;
            int fileObjId = saveForm["fileObjId"] != null ? int.Parse(saveForm["fileObjId"]) : 0;
            string localPath = saveForm["localPath"] != null ? saveForm["localPath"] : "";
            int uploadType = saveForm["uploadType  "] != null ? int.Parse(saveForm["uploadType  "]) : 0;
            bool isPreDefine = saveForm["isPreDefine"] != null ? bool.Parse(saveForm["isPreDefine"]) : false;
            bool isCover = saveForm["isCover"] != null ? bool.Parse(saveForm["isCover"]) : false;
            int structId = saveForm["structId"] != null ? int.Parse(saveForm["structId"]) : 0;
            Dictionary<string, string> propDic = new Dictionary<string, string>();
            FileOperationHelper opHelper = new FileOperationHelper();
            InvokeResult<FileUploadSaveResult> result = new InvokeResult<FileUploadSaveResult>();
            #region 通过关联读取对象属性
            if (fileObjId != 0)
            {

                List<BsonDocument> docs = new List<BsonDocument>();
                docs = dataOp.FindAllByKeyVal("FileObjPropertyRelation", "fileTypeId", fileObjId.ToString()).ToList();

                List<string> strList = new List<string>();
                strList = docs.Where(t => t.Int("fileObjId") == fileObjId).Select(t => t.Text("dataKey")).Distinct().ToList();
                foreach (var item in strList)
                {
                    var formValue = saveForm[item];
                    if (formValue != null)
                    {
                        propDic.Add(item, formValue.ToString());
                    }
                }
            }
            FileUploadObject obj = new FileUploadObject();
            obj.fileTypeId = fileTypeId;
            obj.fileObjId = fileObjId;
            obj.localPath = localPath;
            obj.tableName = tableName;
            obj.keyName = keyName;
            obj.keyValue = keyValue;
            obj.uploadType = uploadType;
            obj.isPreDefine = isPreDefine;
            obj.isCover = isCover;
            obj.propvalueDic = propDic;
            obj.structId = structId;
            result = opHelper.UploadSingleFile(obj);
            #endregion
            var ret = opHelper.ResultConver(result);
            return Json(ret);
        }

        /// <summary>
        /// 上传多个文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public string SaveMultipleUploadFiles(FormCollection saveForm)
        {
            string tableName = PageReq.GetForm("tableName");
            tableName = !string.IsNullOrEmpty(PageReq.GetForm("tableName")) ? PageReq.GetForm("tableName") : PageReq.GetForm("tbName");
            string keyName = PageReq.GetForm("keyName");
            string keyValue = PageReq.GetForm("keyValue");
            if (string.IsNullOrEmpty(keyName))
            {
                keyName = saveForm["keyName"];
            }
            if (string.IsNullOrEmpty(keyValue) || keyValue == "0")
            {
                keyValue = saveForm["keyValue"];
            }
            string localPath = PageReq.GetForm("uploadFileList");
            string fileSaveType = saveForm["fileSaveType"] != null ? saveForm["fileSaveType"] : "multiply";
            int fileTypeId = PageReq.GetFormInt("fileTypeId");
            int fileObjId = PageReq.GetFormInt("fileObjId");
            int uploadType = PageReq.GetFormInt("uploadType");
            int fileRel_profId = PageReq.GetFormInt("fileRel_profId");
            int fileRel_stageId = PageReq.GetFormInt("fileRel_stageId");
            int fileRel_fileCatId = PageReq.GetFormInt("fileRel_fileCatId");
            int structId = PageReq.GetFormInt("structId");

            bool isPreDefine = saveForm["isPreDefine"] != null ? bool.Parse(saveForm["isPreDefine"]) : false;

            Dictionary<string, string> propDic = new Dictionary<string, string>();
            FileOperationHelper opHelper = new FileOperationHelper();
            List<InvokeResult<FileUploadSaveResult>> result = new List<InvokeResult<FileUploadSaveResult>>();

            //替换会到之网络路径错误，如：\\192.168.1.150\D\A\1.jpg
            //localPath = localPath.Replace("\\\\", "\\");

            #region 如果保存类型为单个single 则删除旧的所有关联文件
            if (!string.IsNullOrEmpty(fileSaveType))
            {
                if (fileSaveType == "single")
                {
                    //opHelper.DeleteFile(tableName, keyName, keyValue);
                    opHelper.DeleteFile(tableName, keyName, keyValue, fileObjId.ToString());
                }
            }
            #endregion

            #region 通过关联读取对象属性
            if (!string.IsNullOrEmpty(localPath.Trim()))
            {
                string[] fileStr = Regex.Split(localPath, @"\|H\|", RegexOptions.IgnoreCase);
                Dictionary<string, string> filePath = new Dictionary<string, string>();
                Dictionary<string, string> filePathInfo = new Dictionary<string, string>();
                string s = fileSaveType.Length.ToString();
                foreach (string file in fileStr)
                {
                    if (string.IsNullOrEmpty(file)) continue;// 防止空数据插入的情况
                    string[] filePaths = Regex.Split(file, @"\|Y\|", RegexOptions.IgnoreCase);

                    if (filePaths.Length > 0)
                    {
                        string[] subfile = Regex.Split(filePaths[0], @"\|Z\|", RegexOptions.IgnoreCase);
                        if (subfile.Length > 0)
                        {
                            if (!filePath.Keys.Contains(subfile[0]))
                            {
                                if (filePaths.Length == 3)
                                {
                                    filePath.Add(subfile[0], filePaths[1]);
                                    filePathInfo.Add(subfile[0], filePaths[2]);
                                }
                                else if (filePaths.Length == 2 || filePaths.Length > 3)
                                {
                                    filePath.Add(subfile[0], filePaths[1]);
                                }
                                else
                                {
                                    filePath.Add(subfile[0], "");
                                }
                            }
                        }
                    }
                }

                if (fileObjId != 0)
                {

                    List<BsonDocument> docs = new List<BsonDocument>();
                    docs = dataOp.FindAllByKeyVal("FileObjPropertyRelation", "fileObjId", fileObjId.ToString()).ToList();

                    List<string> strList = new List<string>();
                    strList = docs.Select(t => t.Text("filePropId")).Distinct().ToList();
                    var doccList = dataOp.FindAllByKeyValList("FileProperty", "filePropId", strList);
                    foreach (var item in doccList)
                    {
                        var formValue = saveForm[item.Text("dataKey")];
                        if (formValue != null)
                        {
                            propDic.Add(item.Text("dataKey"), formValue.ToString());
                        }
                    }
                }
                #region 文档直接关联属性

                foreach (var tempKey in saveForm.AllKeys)
                {
                    if (!string.IsNullOrEmpty(tempKey) && tempKey.Contains("Property_"))
                    {
                        var formValue = saveForm[tempKey];
                        propDic.Add(tempKey, formValue.ToString());
                    }

                }

                #endregion

                List<FileUploadObject> singleList = new List<FileUploadObject>();   //纯文档上传
                List<FileUploadObject> objList = new List<FileUploadObject>();      //当前传入类型文件上传
                foreach (var str in filePath)
                {
                    FileUploadObject obj = new FileUploadObject();
                    List<string> infoList = new List<string>();
                    Dictionary<string, string> infoDc = new Dictionary<string, string>();
                    if (filePathInfo.ContainsKey(str.Key))
                    {
                        infoList = Regex.Split(filePathInfo[str.Key], @"\|N\|", RegexOptions.IgnoreCase).ToList();
                        foreach (var tempInfo in infoList)
                        {
                            string[] tempSingleInfo = Regex.Split(tempInfo, @"\|-\|", RegexOptions.IgnoreCase);
                            if (tempSingleInfo.Length == 2)
                            {
                                infoDc.Add(tempSingleInfo[0], tempSingleInfo[1]);
                            }
                        }

                    }
                    if (infoDc.ContainsKey("fileTypeId"))
                    {
                        obj.fileTypeId = Convert.ToInt32(infoDc["fileTypeId"]);
                    }
                    else
                    {
                        obj.fileTypeId = fileTypeId;
                    }
                    if (infoDc.ContainsKey("fileObjId"))
                    {
                        obj.fileObjId = Convert.ToInt32(infoDc["fileObjId"]);
                    }
                    else
                    {
                        obj.fileObjId = fileObjId;
                    }
                    if (filePathInfo.ContainsKey(str.Key))
                    {
                        obj.localPath = Regex.Split(str.Key, @"\|N\|", RegexOptions.IgnoreCase)[0];
                    }
                    else
                    {
                        obj.localPath = str.Key;
                    }
                    if (infoDc.ContainsKey("tableName"))
                    {
                        obj.tableName = infoDc["tableName"];
                    }
                    else
                    {
                        obj.tableName = tableName;
                    }
                    if (infoDc.ContainsKey("keyName"))
                    {
                        obj.keyName = infoDc["keyName"];
                    }
                    else
                    {
                        obj.keyName = keyName;
                    }
                    if (infoDc.ContainsKey("keyValue"))
                    {
                        if (infoDc["keyValue"] != "0")
                        {
                            obj.keyValue = infoDc["keyValue"];
                        }
                        else
                        {
                            obj.keyValue = keyValue;
                        }

                    }
                    else
                    {
                        obj.keyValue = keyValue;
                    }
                    if (infoDc.ContainsKey("uploadType"))
                    {
                        if (infoDc["uploadType"] != null && infoDc["uploadType"] != "undefined")
                        {
                            obj.uploadType = Convert.ToInt32(infoDc["uploadType"]);
                        }
                        else
                        {
                            obj.uploadType = uploadType;
                        }
                    }
                    else
                    {
                        obj.uploadType = uploadType;
                    }
                    obj.isPreDefine = isPreDefine;
                    if (infoDc.ContainsKey("isCover"))
                    {
                        if (infoDc["isCover"] == "Yes") { obj.isCover = true; }
                        else
                        {
                            obj.isCover = false;
                        }
                    }
                    else
                    {
                        obj.propvalueDic = propDic;
                    }
                    if (infoDc.ContainsKey("structId"))
                    {
                        obj.structId = Convert.ToInt32(infoDc["structId"]);
                    }
                    else
                    {
                        obj.structId = structId;
                    }
                    obj.rootDir = str.Value;
                    obj.fileRel_profId = fileRel_profId.ToString();
                    obj.fileRel_stageId = fileRel_stageId.ToString();
                    obj.fileRel_fileCatId = fileRel_fileCatId.ToString();

                    if (uploadType != 0 && (obj.rootDir == "null" || obj.rootDir.Trim() == ""))
                    {
                        singleList.Add(obj);
                    }
                    else
                    {
                        objList.Add(obj);
                    }
                }

                result = opHelper.UploadMultipleFiles(objList, (UploadType)uploadType);//(UploadType)uploadType
                if (singleList.Count > 0)
                {
                    //result = opHelper.UploadMultipleFiles(singleList, (UploadType)0);
                    result.AddRange(opHelper.UploadMultipleFiles(singleList, (UploadType)0));
                }
            }
            else
            {
                PageJson jsonone = new PageJson();
                jsonone.Success = false;
                return jsonone.ToString() + "|";

            }
            #endregion

            PageJson json = new PageJson();
            var ret = opHelper.ResultConver(result);
            json.Success = ret.Status == Status.Successful ? true : false;
            var strResult = json.ToString() + "|" + ret.Value;
            return strResult;
        }

        /// <summary>
        /// 上传新版本
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public string SaveNewVersion(FormCollection saveForm)
        {
            InvokeResult<FileUploadSaveResult> result = new InvokeResult<FileUploadSaveResult>();
            FileOperationHelper opHelper = new FileOperationHelper();
            PageJson json = new PageJson();
            int fileId = saveForm["fileId"] != null ? int.Parse(saveForm["fileId"]) : 0;
            string localPath = saveForm["uploadFileList"] != null ? saveForm["uploadFileList"] : "";
            Dictionary<string, string> propDic = new Dictionary<string, string>();

            if (fileId != 0)
            {

                var fileModel = dataOp.FindOneByKeyVal("FileLibrary", "fileId", fileId.ToString());
                int fileObjId = fileModel.Int("fileObjId");
                if (fileObjId != 0)
                {

                    List<BsonDocument> docs = new List<BsonDocument>();
                    docs = dataOp.FindAllByKeyVal("FileObjPropertyRelation", "fileObjId", fileObjId.ToString()).ToList();

                    List<string> strList = new List<string>();
                    strList = docs.Select(t => t.Text("filePropId")).Distinct().ToList();
                    var doccList = dataOp.FindAllByKeyValList("FileProperty", "filePropId", strList);
                    foreach (var item in doccList)
                    {
                        var formValue = saveForm[item.Text("dataKey")];
                        if (formValue != null)
                        {
                            propDic.Add(item.Text("dataKey"), formValue.ToString());
                        }
                    }
                }
                FileUploadVersionObject obj = new FileUploadVersionObject();
                obj.fileId = fileId;
                obj.localPath = localPath;
                obj.propvalueDic = propDic;


                result = opHelper.UploadNewVersion(obj);
            }
            var ret = opHelper.ResultConver(result);
            json.Success = ret.Status == Status.Successful ? true : false;
            var strResult = json.ToString() + "|" + ret.Value;
            return strResult;
        }

        /// <summary>
        /// 设置其他首脑图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public JsonResult SetBrainCoverImage(int id)
        {
            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            result = opHelper.SetBrainCoverImage(id);
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 设置封面图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public JsonResult SetCoverImage(int id)
        {
            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            result = opHelper.SetCoverImage(id);
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 设置首页推送
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public JsonResult SetIndexPush()
        {
            bool flag = false;
            int id = PageReq.GetFormInt("fileRelId");
            string isPush = PageReq.GetForm("isPush");
            if (!string.IsNullOrEmpty(isPush))
            {
                bool.TryParse(isPush, out flag);
            }
            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            result = opHelper.SetIndexPush(id, flag);
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }


        /// <summary>
        /// 更新文件描述
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult UpdateFileDescription(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();
            int fileId = saveForm["fileId"] != null ? int.Parse(saveForm["fileId"]) : 0;

            if (fileId != 0)
            {
                FileOperationHelper op = new FileOperationHelper();
                Dictionary<string, string> propDic = new Dictionary<string, string>();
                foreach (var tempKey in saveForm.AllKeys)
                {
                    if (tempKey.Contains("fileId")) continue;
                    propDic.Add(tempKey, saveForm[tempKey]);

                }
                result = op.UpdateFileDescription(fileId, propDic);

            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 更新文件描述
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult AddFileDescription(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();
            string fileIds = saveForm["fileIds"] != null ? saveForm["fileIds"] : "";
            Dictionary<int, Dictionary<string, string>> propDic = new Dictionary<int, Dictionary<string, string>>();

            if (!string.IsNullOrEmpty(fileIds))
            {
                try
                {
                    string[] fileIdArray = fileIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                    FileOperationHelper op = new FileOperationHelper();
                    Dictionary<string, string[]> prop = new Dictionary<string, string[]>();

                    foreach (var tempKey in saveForm.AllKeys)
                    {
                        if (tempKey.Contains("fileIds")) continue;
                        string propStr = saveForm[tempKey];
                        string[] array = propStr.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                        prop.Add(tempKey, array);
                    }

                    for (int i = 0; i < fileIdArray.Length; i++)
                    {
                        Dictionary<string, string> subDic = new Dictionary<string, string>();
                        foreach (var item in prop)
                        {
                            subDic.Add(item.Key, item.Value[i]);
                        }
                        propDic.Add(int.Parse(fileIdArray[i]), subDic);
                    }

                    result = op.SetFileDescription(propDic);
                }
                catch (Exception ex)
                {
                    result.Status = Status.Failed;
                    result.Message = ex.Message;
                }


            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }


        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public JsonResult DeleFiles(FormCollection saveForm)
        {
            string fileRelIds = saveForm["delFileRelIds"] != null ? saveForm["delFileRelIds"] : "";

            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            try
            {
                string[] fileRelArray;
                if (fileRelIds.Length > 0)
                {
                    fileRelArray = fileRelIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);

                    List<BsonValue> fileRelIdList = new List<BsonValue>();
                    foreach (var tempId in fileRelArray) fileRelIdList.Add(tempId.Trim());

                    if (fileRelArray.Length > 0)
                    {
                        result = opHelper.DeleteFileByRelIdList(fileRelIdList);
                        if (result.Status == Status.Failed) throw new Exception(result.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return Json(TypeConvert.InvokeResultToPageJson(result),JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 通过文件ID删除文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public JsonResult DeleFilesByFileId(FormCollection saveForm)
        {
            string fileIds = saveForm["delFileIds"] != null ? saveForm["delFileIds"] : "";

            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            try
            {
                string[] fileIdArray;
                if (fileIds.Length > 0)
                {
                    fileIdArray = fileIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);

                    List<BsonValue> fileIdList = new List<BsonValue>();
                    foreach (var tempId in fileIdArray) fileIdList.Add(tempId.Trim());

                    if (fileIdArray.Length > 0)
                    {
                        result = opHelper.DeleteFileByFileIdList(fileIdList);
                        if (result.Status == Status.Failed) throw new Exception(result.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 通过文件版本ID删除文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public JsonResult DeleFilesByFileVerId(FormCollection saveForm)
        {
            string fileVerIds = saveForm["delFileIds"] != null ? saveForm["delFileIds"] : "";

            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            try
            {
                string[] fileVerArray;
                if (fileVerIds.Length > 0)
                {
                    fileVerArray = fileVerIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);

                    List<BsonValue> fileVerIdList = new List<BsonValue>();
                    foreach (var tempId in fileVerArray) fileVerIdList.Add(tempId.Trim());

                    if (fileVerArray.Length > 0)
                    {
                        result = opHelper.DeleteFileByFileVerIdList(fileVerIdList);
                        if (result.Status == Status.Failed) throw new Exception(result.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public JsonResult DeleFolder(FormCollection saveForm)
        {
            string fileRelIds = saveForm["delstructIds"] != null ? saveForm["delstructIds"] : "";

            InvokeResult result = new InvokeResult();
            FileOperationHelper opHelper = new FileOperationHelper();
            try
            {
                string[] fileArray;
                if (fileRelIds.Length > 0)
                {
                    fileArray = fileRelIds.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                    if (fileArray.Length > 0)
                    {
                        foreach (var item in fileArray)
                        {
                            result = opHelper.DeleteFolder(int.Parse(item));
                            if (result.Status == Status.Failed)
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
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 判断用户是否能够下载,小于等于0不能下载
        /// </summary>
        /// <returns></returns>
        public int IsUserCanDownLoad()
        {
            return 100;
        }

        /// <summary>
        /// 批量设置文档缩略图地址
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public string SetFileThumbPicPath(string head)
        {
            List<BsonDocument> allFileList = dataOp.FindAllByQuery("FileLibrary", Query.Matches("thumbPicPath", "thum")).ToList();  //所有有缩略图的文件

            foreach (var tempFile in allFileList)
            {
                string oldHead = tempFile.String("thumbPicPath").Split(new string[] { "thum" }, StringSplitOptions.None)[0];   //路径头部

                string newHead = string.IsNullOrEmpty(head) ? "/" : head;

                if (newHead[newHead.Length - 1] != '/') newHead = newHead + "/";

                tempFile["thumbPicPath"] = tempFile.String("thumbPicPath").Replace(oldHead, newHead);
                dataOp.Update("FileLibrary", Query.EQ("fileId", tempFile.String("fileId")), new BsonDocument { { "thumbPicPath", tempFile["thumbPicPath"] } });



            }

            //MongoOperation mongoOp = new MongoOperation();

            //InvokeResult result = mongoOp.Save("FileLibrary", allFileList);

            //return result.Status == Status.Successful ? "Successful" : result.Message;
            return "";
        }

        #endregion

        #region 生命周期事件

        /// <summary>
        /// 生成日志Id
        /// </summary>
        private void GenerateLogId()
        {
            //获取新的ObjId
            ObjectId curLogId = ObjectId.GenerateNewId();

            //将ObjId记录到共享数据中
            if (System.Web.HttpContext.Current != null)
            {
                if (System.Web.HttpContext.Current.Items.Contains("BehaviorLogId")) System.Web.HttpContext.Current.Items["BehaviorLogId"] = curLogId;
                else System.Web.HttpContext.Current.Items.Add("BehaviorLogId", curLogId);
            }
        }

        /// <summary>
        /// 权限验证
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnAuthorization(AuthorizationContext filterContext)
        {
            GenerateLogId();       //生成日志Id



            base.OnAuthorization(filterContext);
        }

        /// <summary>
        /// Action执行之前
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
           
            dataOp.GetStopwatch(System.Web.HttpContext.Current, "action").Start();  //Action计时开始

            base.OnActionExecuting(filterContext);
        }

        /// <summary>
        /// Action执行之后
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            dataOp.GetStopwatch(System.Web.HttpContext.Current, "action").Stop();  //Action计时结束

            base.OnActionExecuted(filterContext);
        }

        /// <summary>
        /// Result执行之前
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {

          
            #region 设置响应流
            if (this.CurrentUserId != -1 && AuthManage.UserType != UserTypeEnum.DebugUser && SysAppConfig.IsPlugIn == false)
            {
                if (filterContext.HttpContext.Response.ContentType == "text/html")
                {
                    filterContext.HttpContext.Response.Filter = new ResponseAuthFilter(Response.Filter, this.CurrentUserId);
                }
            }
            #endregion

            dataOp.GetStopwatch(System.Web.HttpContext.Current, "result").Start();  //result计时开始

            base.OnResultExecuting(filterContext);
        }

        /// <summary>
        /// Result执行之后
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
          
             dataOp.GetStopwatch(System.Web.HttpContext.Current, "result").Stop();  //result计时结束
             dataOp.LogSysBehavior(SysLogType.General, HttpContext);    //当用户登录后 记录系统行为日志
          
           

            base.OnResultExecuted(filterContext);
        }

        #endregion

        #region 系统方法
        /// <summary>
        /// 将页面导出成为PDF文件
        /// </summary>
        /// <returns></returns>
        public ActionResult SavePageToPdf()
        {
            string url = PageReq.GetParam("url");
            string name = PageReq.GetParam("name");
            if (string.IsNullOrEmpty(name))
            {
                name = DateTime.Now.ToString("yyyyMMddHHmmss");
            }
            string savePath = Server.MapPath("/UploadFiles/PDF/");
            if (!System.IO.Directory.Exists(savePath))
            {
                System.IO.Directory.CreateDirectory(savePath);
            }

            string fileName = Path.Combine(savePath, string.Format("{0}.pdf", name));
            url = string.Format("http://{0}/{1}", System.Web.HttpContext.Current.Request.ServerVariables["HTTP_HOST"], url);
            bool HasSucceed = true;

            // HtmlHelper.PageToPdfByteArray(url, fileName, Encoding.GetEncoding("utf-8"));
            // bool HasSucceed = HtmlHelper.Html2PDFSynch(url, fileName,""); 

            if (HasSucceed)
            {
                //讀成串流     
                Stream iStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
                //回傳出檔案     
                return File(iStream, "application/pdf", name + ".pdf");
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 将JSON数据导入数据库
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public ActionResult ImportJsonInfoToDataBase(FormCollection saveForm)
        {
            PageJson json = new PageJson();

            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";
            string jsonUrl = saveForm["jsonUrl"] != null ? saveForm["jsonUrl"] : "";
            string isAdd = saveForm["isAdd"] != null ? saveForm["isAdd"] : "";          //是否追加 0 覆盖, 1 追加
            string isAffect = saveForm["isAffect"] != null ? saveForm["isAffect"] : "";   //是否影响其他表 0 不影响 1 影响

            if (System.IO.File.Exists(@jsonUrl) == false) //如果存在,则读取规则文件
            {
                json.Success = false;
                json.Message = "文件不存在";
                return Json(json);
            }

            if (tbName.Trim() == "")
            {
                json.Success = false;
                json.Message = "表名不能为空";
                return Json(json);
            }

            #region 读取导入数据
            StreamReader objReader = new StreamReader(@jsonUrl);

            string jsonStr = objReader.ReadToEnd();

            objReader.Close();

            List<BsonDocument> allBson = new List<BsonDocument>();

            BsonReader bsonReader = BsonReader.Create(jsonStr);

            while (bsonReader.CurrentBsonType != BsonType.EndOfDocument)
            {
                BsonDocument tempBson = BsonDocument.ReadFrom(bsonReader);

                allBson.Add(tempBson);
            }
            #endregion

            if (isAffect == "1")    //对其他表产生影响
            {
                #region 导入数据

                List<StorageData> saveDataList = new List<StorageData>();   //保存数据 

                if (isAdd != "1")       //覆盖,表中所有内容
                {
                    StorageData delAll = new StorageData();
                    delAll.Name = tbName;
                    delAll.Type = StorageType.Delete;
                    delAll.Query = Query.Exists("_id", true);

                    saveDataList.Add(delAll);
                }

                foreach (var tempBson in allBson)
                {
                    StorageData tempAdd = new StorageData();

                    tempAdd.Name = tbName;
                    tempAdd.Document = tempBson;
                    tempAdd.Type = StorageType.Insert;

                    saveDataList.Add(tempAdd);
                }

                InvokeResult result = dataOp.BatchSaveStorageData(saveDataList);
                json = TypeConvert.InvokeResultToPageJson(result);

                #endregion
            }
            else
            {
                #region 导入数据
                InvokeResult result = new InvokeResult();

                try
                {
                    MongoOperation mongoOp = new MongoOperation();

                    if (isAdd != "1")       //覆盖,表中所有内容
                    {
                        mongoOp.GetCollection(tbName).RemoveAll();
                        //SafeModeResult safeResult = mongoOp.GetCollection(tbName).RemoveAll(SafeMode.True);  //移除表中所有内容
                        //if (safeResult.HasLastErrorMessage) throw new Exception(safeResult.LastErrorMessage);
                    }

                    List<StorageData> saveDataList = new List<StorageData>();   //保存数据 

                    foreach (var tempBson in allBson)
                    {
                        StorageData tempAdd = new StorageData();

                        tempAdd.Name = tbName;
                        tempAdd.Document = tempBson;
                        tempAdd.Type = StorageType.Insert;

                        saveDataList.Add(tempAdd);
                    }

                    dataOp.BatchSaveStorageData(saveDataList);

                    result.Status = Status.Successful;
                }
                catch (Exception ex)
                {
                    result.Status = Status.Failed;
                    result.Message = ex.Message;
                }

                json = TypeConvert.InvokeResultToPageJson(result);

                #endregion
            }

            return Json(json);
        }

        /// <summary>
        /// 重置树形表中的4个关键属性
        /// </summary>
        /// <param name="tbName"></param>
        /// <returns></returns>
        public ActionResult ReSetTableTreeKey(string tbName)
        {
            PageJson json = new PageJson();

            TableRule tableEntity = new TableRule(tbName);    //获取表结构

            string primaryKey = tableEntity.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault().Name;  //寻找默认主键

            if (tbName.Trim() == "" || primaryKey.Trim() == "")
            {
                json.Success = false;
                json.Message = "传入表名有误,或表不在规则文件中!";
                return Json(json);
            }

            List<BsonDocument> allDataList = dataOp.FindAll(tbName).ToList();   //获取表中的所有数据

            List<StorageData> allSaveData = this.ReSetSubNodeTreeKey(tbName, primaryKey, new BsonDocument(), allDataList, new Dictionary<int, string>(), new Dictionary<int, int>());

            InvokeResult result = dataOp.BatchSaveStorageData(allSaveData);

            json = TypeConvert.InvokeResultToPageJson(result);

            return Json(json);
        }

        /// <summary>
        /// 重置树形表的4个关键字
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="primaryKey"></param>
        /// <param name="curNode"></param>
        /// <param name="allDataList"></param>
        /// <param name="newKeyDic"></param>
        /// <param name="newLvDic"></param>
        /// <returns></returns>
        public List<StorageData> ReSetSubNodeTreeKey(string tbName, string primaryKey, BsonDocument curNode, List<BsonDocument> allDataList, Dictionary<int, string> newKeyDic, Dictionary<int, int> newLvDic)
        {
            List<StorageData> allSaveData = new List<StorageData>();

            int curPrimaryId = curNode.Int(primaryKey);
            List<BsonDocument> subNodeList = allDataList.Where(t => t.Int("nodePid") == curPrimaryId).ToList();  //当前级的所有对应子节点

            int curLevel = newLvDic.ContainsKey(curPrimaryId) ? newLvDic[curPrimaryId] : 0;
            string curNodeKey = newKeyDic.ContainsKey(curPrimaryId) ? newKeyDic[curPrimaryId] : "";
            int index = 1;

            foreach (var subNode in subNodeList.OrderBy(t => t.Int(primaryKey)))  //循环子节点,改变子节点的对应值
            {
                int nodeLevel = curLevel + 1;
                string nodeOrder = index.ToString();
                string nodeKey = curNodeKey != "" ? curNodeKey + "." + nodeOrder.PadLeft(6, '0') : nodeOrder.PadLeft(6, '0');

                newLvDic.Add(subNode.Int(primaryKey), nodeLevel);
                newKeyDic.Add(subNode.Int(primaryKey), nodeKey);

                StorageData tempData = new StorageData();
                tempData.Name = tbName;
                tempData.Type = StorageType.Update;
                tempData.Query = Query.EQ(primaryKey, subNode.String(primaryKey));
                tempData.Document = new BsonDocument().Add("nodeLevel", nodeLevel.ToString())
                                                      .Add("nodeOrder", nodeOrder.ToString())
                                                      .Add("nodeKey", nodeKey.ToString());
                allSaveData.Add(tempData);
                allSaveData.AddRange(ReSetSubNodeTreeKey(tbName, primaryKey, subNode, allDataList, newKeyDic, newLvDic));   //递归

                index++;
            }

            return allSaveData;
        }

        

        /// <summary>
        /// 将数据库表的所有字段重置为字符串型
        /// </summary>
        /// <param name="tbName"></param>
        /// <returns></returns>
        public ActionResult ReSetTableDataToString(string tbName)
        {
            PageJson json = new PageJson();
            InvokeResult result = new InvokeResult();

            TableRule table = new TableRule(tbName);

            string primaryKey = table.GetPrimaryKey();

            List<BsonDocument> oldDataList = dataOp.FindAll(tbName).ToList();

            List<StorageData> saveList = new List<StorageData>();

            List<string> filterList = new List<string>() { "_id", primaryKey, "createDate", "createUserId", "order", "underTable", "updateDate", "updateUserId", "nodePid", "nodeOrder", "nodeLevel", "nodeKey" };

            foreach (var tempOld in oldDataList)
            {
                StorageData tempSave = new StorageData();

                tempSave.Name = tbName;
                tempSave.Query = Query.EQ(primaryKey, tempOld.String(primaryKey));

                BsonDocument tempdata = dataOp.FindOneByQuery(tbName, tempSave.Query);

                BsonDocument bson = new BsonDocument();

                foreach (var tempEl in tempOld.Elements)
                {
                    if (filterList.Contains(tempEl.Name)) continue;

                    bson.Add(tempEl.Name, tempEl.Value.ToString());
                }

                tempSave.Document = bson;
                tempSave.Type = StorageType.Update;

                saveList.Add(tempSave);
            }

            result = dataOp.BatchSaveStorageData(saveList);

            json = TypeConvert.InvokeResultToPageJson(result);
            return Json(json);
        }

        /// <summary>
        /// 获取当前数据库所有表信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GetCurDBAllTableJson()
        {
            MongoOperation mongoOp = new MongoOperation();

            List<string> allNameList = mongoOp.GetDataBase().GetCollectionNames().ToList();   //所有表名

            List<Hashtable> retList = new List<Hashtable>();

            List<TableRule> allTableList = TableRule.GetAllTables();

            foreach (var tempName in allNameList)
            {
                Hashtable temp = new Hashtable();

                temp.Add("name", tempName);

                TableRule tempTable = allTableList.Where(t => t.Name == tempName).FirstOrDefault();

                if (tempTable != null)
                {
                    temp.Add("isRule", "1");
                    temp.Add("remark", tempTable.Remark);
                }
                else
                {
                    temp.Add("isRule", "0");
                }

                retList.Add(temp);
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 重置日志日期时间
        /// </summary>
        /// <param name="tbName"></param>
        /// <returns></returns>
        public ActionResult ReSetSysLogTime(string tbName)
        {
            MongoOperation mongoOp = new MongoOperation();
            MongoServer server = mongoOp.GetServer();
            MongoDatabase database = mongoOp.GetDataBase();
            MongoCollection<BsonDocument> logs = database.GetCollection(tbName);
            MongoCursor<BsonDocument> allLogs = logs.FindAll();

            InvokeResult result = new InvokeResult() { Status = Status.Successful };

            try
            {
                using (server.RequestStart(database))
                {
                    foreach (var tempLog in allLogs)
                    {
                        if (tempLog.String("timeSort", "") == "")
                        {
                            var query = Query.EQ("logTime", tempLog.String("logTime"));
                            var update = Update.Set("timeSort", tempLog.Date("logTime").ToString("yyyyMMddHHmmss"))
                                               .Set("logTime", tempLog.Date("logTime").ToString("yyyy-MM-dd HH:mm:ss"));

                            if (tempLog.String("logUserId", "") == "")
                            {
                                update.Set("logUserId", tempLog.String("userId"));
                            }

                            logs.Update(query, update);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        /// <summary>
        /// 重置任意表的任意字段为Int类型
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="columnName"></param>
        /// <returns></returns>
        public ActionResult ReSetColumnToInt(string tbName, string columnName)
        {
            PageJson json = new PageJson();
            InvokeResult result = new InvokeResult();

            MongoOperation mongoOp = new MongoOperation();

            try
            {
                if (mongoOp.GetDataBase().CollectionExists(tbName))
                {
                    List<BsonDocument> bsonList = dataOp.FindAll(tbName).ToList();

                    if (bsonList.Count > 0)
                    {
                        foreach (var tempBson in bsonList)
                        {
                            QueryComplete query = Query.EQ("_id", ObjectId.Parse(tempBson.String("_id")));

                            BsonDocument bson = new BsonDocument();

                            bson.Add(columnName, tempBson.Int(columnName));

                            mongoOp.Save(tbName, query, bson);
                        }
                    }
                }
                result.Status = Status.Successful;
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            json = TypeConvert.InvokeResultToPageJson(result);
            return Json(json);

        }

        /// <summary>
        /// 将数据库中数据导出为文件
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="queryJson"></param>
        public void ExportDataBaseToFile(string tbName, string queryJson)
        {
            string fileName = string.Empty;
            List<BsonDocument> resultList = new List<BsonDocument>();

            if (tbName != "" && queryJson != "")
            {
                QueryDocument query = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<QueryDocument>(queryJson);

                resultList = dataOp.FindAllByQuery(tbName, query).ToList();
                fileName = string.Format("{0}_{1}_{2}.json", tbName, DateTime.Now.ToString("yyyyMMdd"), "A");
            }
            else if (tbName != "")
            {
                resultList = dataOp.FindAll(tbName).ToList();
                fileName = string.Format("{0}_{1}_{2}.json", tbName, DateTime.Now.ToString("yyyyMMdd"), "I");
            }

            List<string> filterList = new List<string>() { "_id", "underTable" };     //多余字段

            StringBuilder fileStr = new StringBuilder();

            foreach (var tempBson in resultList)
            {
                BsonDocument tempData = new BsonDocument();

                if (BsonDocumentExtension.IsNullOrEmpty(tempBson) == false)
                {
                    foreach (var tempElement in tempBson.Elements)
                    {
                        if (filterList.Contains(tempElement.Name)) continue;

                        tempData.Add(tempElement.Name, tempElement.Value);
                    }
                }

                fileStr.Append(tempData.ToString());
            }

            OutputFile("text/plain", fileName, fileStr.ToString());
        }

        /// <summary>
        /// 将html表格导出成为Excel
        /// </summary>
        /// <param name="FileType"></param>
        /// <param name="FileName"></param>
        /// <param name="ExcelContent"></param>
        public void OutputFile(string fileType, string fileName, string fileContent)
        {
            System.Web.HttpContext.Current.Response.Charset = "UTF-8";
            System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
            System.Web.HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8).ToString());
            System.Web.HttpContext.Current.Response.ContentType = fileType;
            System.IO.StringWriter tw = new System.IO.StringWriter();
            System.Web.HttpContext.Current.Response.Output.Write(fileContent.ToString());
            System.Web.HttpContext.Current.Response.Flush();
            System.Web.HttpContext.Current.Response.End();
        }

        #endregion

        #region 复制通用目录
        /// <summary>
        /// 复制通用目录
        /// </summary>
        /// <param name="bookTask"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult CopeGeneralDirectory(string tableName)
        {
            InvokeResult result = new InvokeResult();
            int projId = PageReq.GetParamInt("projId");
            int sourceId = PageReq.GetParamInt("sourceId");//复制来源

            int nodePid = PageReq.GetParamInt("nodePid");
            PageJson json = new PageJson();
            List<BsonDocument> newDir = new List<BsonDocument>();
            List<BsonDocument> oldDir = new List<BsonDocument>();
            BsonDocument projInfo = new BsonDocument();
            projInfo = dataOp.FindOneByQuery("XH_DesignManage_Project", Query.EQ("projId", projId.ToString()));
            string projName = string.Empty;
            if (projInfo != null)
            {
                projName = projInfo.String("name");
            }
            //oldDir=dataOp.FindAllByQuery(tableName,Query.EQ("typeId","1")).ToList();


            TableRule tableEntity = new TableRule(tableName);
            string primaryKey = string.Empty;
            if (tableEntity == null)
            {
                primaryKey = "nodeId";
            }
            else
            {
                primaryKey = tableEntity.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault().Name;
            }
            var entity = new BsonDocument();
            entity.Add("name", projName + "目录");
            entity.Add("projId", projId.ToString());
            entity.Add("isTemplate", "0");
            result = dataOp.Insert(tableName, entity);
            oldDir = dataOp.FindAllByQuery(tableName + "Dir", Query.EQ(primaryKey, sourceId.ToString())).ToList();
            if (result.Status == Status.Successful)
            {
                CopyGeneralDir(newDir, oldDir, nodePid, null, projId, tableName, result.BsonInfo);
            }
            json.Success = result.Status == Status.Successful;
            json.Message = result.Message;

            return this.Json(json); ;


        }
        public void CopyGeneralDir(List<BsonDocument> newDirList, List<BsonDocument> oldDirList, int nodePid, BsonDocument parent, int projId, string tableName, BsonDocument dirIfno)
        {
            var dir = oldDirList.Where(m => m.Int("nodePid") == nodePid).ToList();
            if (dir.Count() == 0)
                return;
            TableRule tableEntity = new TableRule(tableName + "Dir");
            TableRule tableEntity1 = new TableRule(tableName);//模板或项目目录数据项
            string primaryKey = string.Empty;
            string primaryKey1 = string.Empty;
            if (tableEntity1 == null)
            {
                primaryKey = "nodeDirId";
                primaryKey1 = "nodeId";
            }
            else
            {
                primaryKey1 = tableEntity1.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault().Name;
                if (tableEntity == null)
                {
                    primaryKey = primaryKey1.Substring(0, primaryKey1.Length - 2);
                    primaryKey = primaryKey + "Id";
                }
                else
                {
                    primaryKey = tableEntity.ColumnRules.Where(t => t.IsPrimary == true).FirstOrDefault().Name;
                }
            }
            foreach (var tempDir in dir)
            {
                #region  复制目录
                var newTempDir = new BsonDocument();
                newTempDir.Add("projId", projId.ToString());
                newTempDir.Add("src" + primaryKey, tempDir.String(primaryKey));
                newTempDir.Add("name", tempDir.String("name"));
                newTempDir.Add("typeId", "0");
                newTempDir.Add("isFill", tempDir.String("isFill"));
                newTempDir.Add("colsType", tempDir.String("colsType"));
                newTempDir.Add(primaryKey1, dirIfno.String(primaryKey1));
                newTempDir.Add("nodePid", parent != null ? parent.String(primaryKey) : "0");
                #endregion

                var result = dataOp.Insert(tableName + "Dir", newTempDir);
                if (result.Status != Status.Successful)
                {
                    return;
                }
                newTempDir = result.BsonInfo;
                newDirList.Add(newTempDir);
                CopyGeneralDir(newDirList, oldDirList, tempDir.Int(primaryKey), newTempDir, projId, tableName, dirIfno);
            }
        }
        #endregion

        #region 问答系统打分
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ChangeUserScore()
        {
            InvokeResult result = new InvokeResult();

            #region 构建数据
            string tbName = "UserScore";
            string queryStr = "";
            int type = PageReq.GetParamInt("type"); //打分类型
            int score = 0;
            if (type == 1)
            { //新增问题
                score = 5;
            }
            if (type == 2)
            { //回答问题
                score = 5;
            }
            if (type == 3)
            { //采纳问题
                score = 20;
            }
            if (type == 4)
            { //取消采纳
                score = -20;
            }
            if (type == 5)  //删除解答
            {
                score = -5;
            }
            var obj = dataOp.FindOneByQuery("UserScore", Query.EQ("userId", CurrentUserId.ToString()));
            score = score + obj.Int("score");
            if (obj != null)
            {
                queryStr = "db.UserScore.distinct('_id',{'userId':'" + CurrentUserId.ToString() + "'})";
            }
            BsonDocument dataBson = new BsonDocument();
            dataBson.Add("userId", CurrentUserId.ToString());
            dataBson.Add("score", score);
            #endregion

            #region 保存数据
            result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
            #endregion



            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #endregion

        #region  成果查看的统计
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ViewCount()
        {
            InvokeResult result = new InvokeResult();

            #region 构建数据
            string tbName = "ResultView";
            string queryStr = "";
            string tableName = PageReq.GetParam("tb");
            string keyName = PageReq.GetParam("keyName");
            string keyValue = PageReq.GetParam("keyValue");
            int count = 0;
            var obj = dataOp.FindOneByQuery("ResultView", Query.And(Query.EQ("keyName", keyName), Query.EQ("keyValue", keyValue), Query.EQ("tableName", tableName)));
            count = obj.Int("count") + 1;
            if (obj != null)
            {
                queryStr = "db.ResultView.distinct('_id',{'viewId':'" + obj.Text("viewId") + "'})";
            }
            BsonDocument dataBson = new BsonDocument();
            dataBson.Add("count", count);
            dataBson.Add("keyName", keyName);
            dataBson.Add("keyValue", keyValue);
            dataBson.Add("tableName", tableName);
            #endregion

            #region 保存数据
            result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #endregion

        /// <summary>
        /// 保存系统任务
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        public ActionResult SaveTaskAccept(FormCollection saveForm)
        {
            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";
            string queryStr = saveForm["queryStr"] != null ? saveForm["queryStr"] : "";
            string dataStr = saveForm["dataStr"] != null ? saveForm["dataStr"] : "";
            int saveType = PageReq.GetParamInt("saveType");
            BsonDocument dataBson = new BsonDocument();
            if (dataStr.Trim() == "")
            {
                foreach (var tempKey in saveForm.AllKeys)
                {
                    if (tempKey == "tbName" || tempKey == "queryStr" || tempKey.Contains("teamRels")) continue;

                    //dataStr += string.Format("{0}={1}&", tempKey, saveForm[tempKey]);
                    dataBson.Add(tempKey, PageReq.GetForm(tempKey));
                }
            }

            //InvokeResult result = dataOp.Save(tbName, queryStr, dataStr);
            InvokeResult result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
            #region 成果交付物要求
            string systaskId = result.BsonInfo.String("systaskId");
            string teamRels = saveForm["teamRels"] != null ? saveForm["teamRels"] : "";
            List<StorageData> saveList = new List<StorageData>();
            List<string> teamRelArray = teamRels.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
            List<BsonDocument> oldTeamRelList = dataOp.FindAllByKeyVal("SysTaskAccept", "systaskId", systaskId).ToList();   //所有关联
            foreach (var teamRel in teamRelArray) //循环新的关联,已存在则不添加,不存在则添加新的
            {
                string[] infoArr = teamRel.Split(new string[] { ":" }, StringSplitOptions.None);

                if (infoArr.Count() >= 2 && infoArr[0].Trim() != "")  //完整资料才会保存 
                {

                    string name = infoArr[0];
                    string remark = infoArr[1];

                    BsonDocument oldRel = oldTeamRelList.Where(t => t.Text("name") == name && t.Text("remark") == remark).FirstOrDefault();

                    if (oldRel == null || saveType == 2)
                    {
                        StorageData tempData = new StorageData();

                        tempData.Name = "SysTaskAccept";
                        tempData.Document = new BsonDocument().Add("systaskId", systaskId)
                                                              .Add("name", name)
                                                              .Add("remark", remark);
                        tempData.Type = StorageType.Insert;

                        saveList.Add(tempData);
                    }
                }
            }
            if (saveType != 2)  //两种保存数据的方式。 
            {
                foreach (var oldRel in oldTeamRelList)
                {
                    if (!teamRelArray.Contains(string.Format("{0}:{1}", oldRel.String("name"), oldRel.String("remark"))))
                    {
                        StorageData tempData = new StorageData();

                        tempData.Name = "SysTaskAccept";
                        tempData.Query = Query.EQ("acceptId", oldRel.String("acceptId"));
                        tempData.Type = StorageType.Delete;

                        saveList.Add(tempData);
                    }
                }
            }
            dataOp.BatchSaveStorageData(saveList);
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #region  任务交互的日志记录
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult TaskLog()
        {
            InvokeResult result = new InvokeResult();

            #region 构建数据
            string tbName = "SysTaskLog";
            string queryStr = "";
            string acceptId = PageReq.GetParam("acceptId");
            string systaskId = PageReq.GetParam("systaskId");
            string logType = PageReq.GetParam("logType");  //1为任务负责人   2为任务创建人
            var fileObj = dataOp.FindAllByQuery("FileRelation", Query.And(Query.EQ("tableName", "SysTaskAccept"), Query.EQ("keyName", "acceptId"), Query.EQ("keyValue", acceptId))).OrderByDescending(c => c.Text("createDate")).FirstOrDefault(); //查找最新上传文件
            BsonDocument dataBson = new BsonDocument();
            dataBson.Add("fileId", fileObj.Text("fileId"));
            dataBson.Add("acceptId", acceptId);
            dataBson.Add("systaskId", systaskId);
            dataBson.Add("logType", logType);
            #endregion

            #region 保存数据
            result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
            #endregion
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #endregion

        #region 创建表格
        /// <summary>
        ///创建表格
        /// </summary>
        /// <param name="htmlCode"></param>
        /// <param name="sheetName"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public string CreateExcelByHtmlCode(string htmlCode, string sheetName, string fileName)
        {
            PageJson result = new PageJson();
            if (string.IsNullOrEmpty(sheetName))
                sheetName = "sheet1";
            sheetName = Server.UrlDecode(sheetName);
            fileName = Server.UrlDecode(fileName);
            htmlCode = Server.UrlDecode(htmlCode);
            string fullFileName = string.Empty;
            try
            {
                ExcelWriter myExcel = new ExcelWriter(sheetName);
                myExcel.WriteData(htmlCode);
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tempFiles");
                fullFileName = myExcel.SaveAsFile(path, fileName);
            }
            catch
            {
                result.Success = false;
                result.Message = "未知原因导致生成表格失败！";
                return result.ToJsonString();
            }
            result.Success = true;
            result.Message = fullFileName;
            string str = result.ToJsonString();
            str = Regex.Replace(str, @"\\", "/");

            //删除临时生成的文件
            ThreadStart deleTempFile = () =>
            {
                Thread.Sleep(1000 * 30);
                System.IO.File.Delete(fullFileName);
            };
            Thread newThread = new Thread(deleTempFile);
            newThread.Start();
            return str;
        }
        #endregion

        #region 下载文件 +ActionResult GetFile(string filePath, string fileName)
        /// <summary>
        /// 下载文件
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="fileName">下载时的默认文件名称</param>
        /// <returns></returns>
        public ActionResult GetFile(string fullFileName, string downloadName, string contentType)
        {
            Response.ClearContent();
            Response.Clear();
            Response.Buffer = true;
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.UTF8;
            Response.HeaderEncoding = System.Text.Encoding.UTF8;
            Response.ContentType = contentType;

            fullFileName = Server.UrlDecode(fullFileName);
            downloadName = Server.UrlDecode(downloadName);
            if (string.IsNullOrEmpty(downloadName))
                downloadName = "新建文件";
            string ext = Path.GetExtension(fullFileName);
            return File(fullFileName, contentType, Url.Encode(downloadName + ext));
        }
        #endregion

        #region GetExcelFile(string fullFileName, string downloadName) 下载Excel文件
        /// <summary>
        /// 下载Excel文件
        /// </summary>
        /// <param name="fullFileName"></param>
        /// <param name="downloadName"></param>
        /// <returns></returns>
        public ActionResult GetExcelFile(string fullFileName, string downloadName)
        {
            var custCode = SysAppConfig.CustomerCode;
            if (custCode == CustomerCode.QX || custCode == CustomerCode.QXSD)
            {
                Response.ClearContent();
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "UTF-8";
                Response.ContentType = "application/excel";
                Response.ContentEncoding = System.Text.Encoding.GetEncoding(936);
                Response.HeaderEncoding = System.Text.Encoding.UTF8;

                fullFileName = Server.UrlDecode(fullFileName);
                downloadName = Server.UrlDecode(downloadName);
                if (string.IsNullOrEmpty(downloadName))
                    downloadName = "新建文件";
                string ext = Path.GetExtension(fullFileName);
                return File(fullFileName, "application/vnd.ms-excel", Server.UrlEncode(downloadName + ext));
            }
            else
            {
                return GetFile(fullFileName, downloadName, "application/vnd.ms-excel");
            }

        }
        #endregion

        #region  处理旧数据  设置由模板导入的任务预定义交付物 EditType=1
        /// <summary>
        /// 批量设置
        /// </summary>
        /// <returns></returns>
        public ActionResult SetEditType()
        {
            InvokeResult result = new InvokeResult();
            int expLibPlanId = PageReq.GetParamInt("expLibPlanId");
            int curChosePlanId = PageReq.GetParamInt("curChosePlanId");
            var expTaskList = dataOp.FindAllByQuery("XH_DesignManage_Task", Query.EQ("planId", expLibPlanId.ToString())); //获取计划的任务
            var curTaskList = dataOp.FindAllByQuery("XH_DesignManage_Task", Query.EQ("planId", curChosePlanId.ToString())).ToList(); //获取选中的具体项目的任务
            var taskDeliverAll = dataOp.FindAll("Scheduled_deliver");
            var srcTaskAll = dataOp.FindAll("XH_DesignManage_Task");
            var professionalAll = dataOp.FindAll("System_Professional");
            var sysStageAll = dataOp.FindAll("System_Stage");
            var projFilecatAll = dataOp.FindAll("ProjFileCategory");
            try
            {
                foreach (var curTask in curTaskList)
                {
                    var taskDeliver = taskDeliverAll.Where(c => c.Text("taskId") == curTask.Text("srcPrimTaskId"));
                    //dataOp.FindAllByQuery("Scheduled_deliver", Query.EQ("taskId", curTask.Text("taskId")));
                    var srcTask = srcTaskAll.Where(c => c.Text("taskId") == curTask.Text("srcPrimTaskId")).FirstOrDefault();
                    //dataOp.FindOneByQuery("XH_DesignManage_Task", Query.EQ("taskId", curTask.Text("srcPrimTaskId")));
                    if (srcTask == null) continue; //具体项目中，只操作模板导入的任务
                    var srctaskDeliver = taskDeliverAll.Where(c => c.Text("taskId") == srcTask.Text("taskId"));
                    //dataOp.FindAllByQuery("Scheduled_deliver", Query.EQ("taskId", srcTask.Text("taskId"))); //计划模板的交付物
                    foreach (var deliver in srctaskDeliver)
                    {
                        var professional = professionalAll.Where(c => c.Text("profId") == deliver.Text("profId")).FirstOrDefault();
                        //dataOp.FindOneByQuery("System_Professional", Query.EQ("profId", deliver.Text("profId")));
                        var sysStage = sysStageAll.Where(c => c.Text("stageId") == deliver.Text("stageId")).FirstOrDefault();
                        //dataOp.FindOneByQuery("System_Stage", Query.EQ("stageId", deliver.Text("stageId")));
                        var projFilecat = projFilecatAll.Where(c => c.Text("fileCatId") == deliver.Text("fileCatId")).FirstOrDefault();
                        //dataOp.FindOneByQuery("ProjFileCategory", Query.EQ("fileCatId", deliver.Text("fileCatId")));
                        var flag = taskDeliver.Where(c => c.Text("profId") == deliver.Text("profId") && c.Text("stageId") == deliver.Text("stageId") && c.Text("fileCatId") == deliver.Text("fileCatId")).FirstOrDefault();
                        BsonDocument dataBson = new BsonDocument();
                        if (flag != null)
                        { //通过 专业，阶段，属性判断，如果具体项目中任务交付物组合与模板中的组合一致，则判断此交付物组合是由模板导入时创建的
                            dataBson.Add("EditType", "1");
                            dataBson.Add("Remark", deliver.Text("Remark"));
                            dataBson.Add("srcDeliverId", deliver.Text("deliverId"));
                            result = dataOp.Save("Scheduled_deliver", Query.EQ("deliverId", flag.Text("deliverId")), dataBson); //更新旧数据，给旧数据加标记与关联
                        }
                        else
                        {
                            dataBson.Add("EditType", "1");
                            dataBson.Add("srcDeliverId", deliver.Text("deliverId"));
                            dataBson.Add("isForce", "1");
                            dataBson.Add("profId", deliver.Text("profId"));
                            dataBson.Add("stageId", deliver.Text("stageId"));
                            dataBson.Add("fileCatId", deliver.Text("fileCatId"));
                            dataBson.Add("projId", curTask.Text("projId"));
                            dataBson.Add("taskId", curTask.Text("taskId"));
                            dataBson.Add("Remark", deliver.Text("Remark"));
                            result = dataOp.Save("Scheduled_deliver", Query.Null, dataBson); //插入新数据
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }


        /// <summary>
        /// 批量设置更新模板改动
        /// </summary>
        /// <returns></returns>
        public ActionResult CascadeUpdaeDeliverProperty()
        {
            InvokeResult result = new InvokeResult();
            int taskId = PageReq.GetParamInt("taskId");
            int porjId = PageReq.GetParamInt("porjId");
            int type = PageReq.GetParamInt("type");//-1 更新所有0更新未开始审批的任务

            var curTask = dataOp.FindOneByKeyVal("XH_DesignManage_Task", "taskId", taskId.ToString());//模板任务对象
            if (curTask == null)
            {
                result.Status = Status.Failed;
                result.Message = "当前任务不存在";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }

            //dataOp.FindAllByQuery("Scheduled_deliver", Query.EQ("taskId", curTask.Text("taskId")));
            var srcTaskAll = dataOp.FindAll("XH_DesignManage_Task").Where(c => c.Text("srcPrimTaskId") == curTask.Text("taskId")).ToList();//获取从当前任务载入的所有任务
            switch (type)
            {
                case 0:
                    var fileterBusFlowInstanceIds = dataOp.FindAllByKeyVal("BusFlowInstance", "tableName", "XH_DesignManage_Task").Where(c => c.Int("approvalUserId") != 0).Select(c => c.Int("referFieldValue")).ToList();
                    srcTaskAll = srcTaskAll.Where(c => !fileterBusFlowInstanceIds.Contains(c.Int("taskId"))).ToList();//过滤已发起的任务
                    break;
                case -1: break;
                default: break;

            }

            var professionalAll = dataOp.FindAll("System_Professional").ToList();
            var sysStageAll = dataOp.FindAll("System_Stage").ToList();
            var projFilecatAll = dataOp.FindAll("ProjFileCategory").ToList();
            try
            {

                //dataOp.FindOneByQuery("XH_DesignManage_Task", Query.EQ("taskId", curTask.Text("srcPrimTaskId")));

                var taskDeliver = dataOp.FindAllByKeyVal("Scheduled_deliver", "taskId", taskId.ToString()).ToList();//计划模板的交付物
                //dataOp.FindAllByQuery("Scheduled_deliver", Query.EQ("taskId", srcTask.Text("taskId"))); 
                var srcTaskIds = srcTaskAll.Select(c => c.Text("taskId")).ToList();//获取派生任务id列表
                var srcTaskDeliverAll = dataOp.FindAllByKeyValList("Scheduled_deliver", "taskId", srcTaskIds).ToList();//获取派生任务对应交付物列表

                List<StorageData> updateDataList = new List<StorageData>();

                foreach (var deliver in taskDeliver)//模板任务交付物
                {
                    var professional = professionalAll.Where(c => c.Text("profId") == deliver.Text("profId")).FirstOrDefault();
                    //dataOp.FindOneByQuery("System_Professional", Query.EQ("profId", deliver.Text("profId")));
                    var sysStage = sysStageAll.Where(c => c.Text("stageId") == deliver.Text("stageId")).FirstOrDefault();
                    //dataOp.FindOneByQuery("System_Stage", Query.EQ("stageId", deliver.Text("stageId")));
                    var projFilecat = projFilecatAll.Where(c => c.Text("fileCatId") == deliver.Text("fileCatId")).FirstOrDefault();

                    foreach (var srcTask in srcTaskAll)//遍历所有派生任务
                    {

                        //dataOp.FindOneByQuery("ProjFileCategory", Query.EQ("fileCatId", deliver.Text("fileCatId")));
                        var flag = srcTaskDeliverAll.Where(c => c.Int("taskId") == srcTask.Int("taskId") && c.Text("profId") == deliver.Text("profId") && c.Text("stageId") == deliver.Text("stageId") && c.Text("fileCatId") == deliver.Text("fileCatId")).FirstOrDefault();

                        if (flag != null)
                        { //通过 专业，阶段，属性判断，如果具体项目中任务交付物组合与模板中的组合一致，则判断此交付物组合是由模板导入时创建的
                            BsonDocument dataBson = new BsonDocument();
                            dataBson.Add("EditType", "1");
                            dataBson.Add("Remark", deliver.Text("Remark"));
                            dataBson.Add("srcDeliverId", deliver.Text("deliverId"));
                            dataBson.Add("displayName", deliver.Text("displayName"));
                            StorageData update = new StorageData();
                            update.Name = "Scheduled_deliver";
                            update.Query = Query.EQ("deliverId", flag.Text("deliverId"));
                            update.Type = StorageType.Update;
                            update.Document = dataBson;
                            updateDataList.Add(update);

                        }
                        else
                        {
                            StorageData update = new StorageData();
                            BsonDocument dataBson = new BsonDocument();
                            dataBson.Add("EditType", "1");
                            dataBson.Add("srcDeliverId", deliver.Text("deliverId"));
                            dataBson.Add("isForce", "1");
                            dataBson.Add("profId", deliver.Text("profId"));
                            dataBson.Add("stageId", deliver.Text("stageId"));
                            dataBson.Add("fileCatId", deliver.Text("fileCatId"));
                            dataBson.Add("projId", srcTask.Text("projId"));
                            dataBson.Add("taskId", srcTask.Text("taskId"));
                            dataBson.Add("Remark", deliver.Text("Remark"));
                            update.Name = "Scheduled_deliver";
                            update.Type = StorageType.Insert;
                            update.Document = dataBson;
                            updateDataList.Add(update);
                        }
                    }
                }
                if (updateDataList.Count() > 0)
                {
                    dataOp.BatchSaveStorageData(updateDataList);
                    #region 处理备注列表
                    List<StorageData> updateDataNewList = new List<StorageData>();
                    var remarkList = dataOp.FindAll("PredefineFileRemark").ToList();
                    var predefineFileRemarkList = remarkList.Where(c => taskDeliver.Select(x => x.Text("deliverId")).ToList().Contains(c.Text("deliverId"))).ToList();//获取模板任务下组合备注列表
                    var srcTaskDeliverNew = dataOp.FindAllByKeyValList("Scheduled_deliver", "taskId", srcTaskIds).ToList();//获取最新派生任务对应交付物列表
                    foreach (var expRemark in predefineFileRemarkList)//遍历计划模板的备注列表
                    {
                        var srcTempdeliverList = srcTaskDeliverNew.Where(c => c.Text("srcDeliverId") == expRemark.Text("deliverId")).ToList(); //查询派生的组合
                        foreach (var tempDeliver in srcTempdeliverList) //遍历
                        {
                            //查找派生组合备注
                            var remark = remarkList.Where(c => c.Text("deliverId") == tempDeliver.Text("deliverId") && c.Text("srcRemarkId") == expRemark.Text("remarkId")).FirstOrDefault();
                            if (remark != null)
                            {
                                BsonDocument dataBson = new BsonDocument();
                                dataBson.Add("EditType", "1");
                                dataBson.Add("name", expRemark.Text("name"));
                                dataBson.Add("isNeedUpLoad", expRemark.Text("isNeedUpLoad"));
                                dataBson.Add("srcRemarkId", expRemark.Text("remarkId"));
                                StorageData update = new StorageData();
                                update.Name = "PredefineFileRemark";
                                update.Query = Query.EQ("remarkId", remark.Text("remarkId"));
                                update.Type = StorageType.Update;
                                update.Document = dataBson;
                                updateDataNewList.Add(update);
                            }
                            else
                            {
                                StorageData update = new StorageData();
                                BsonDocument dataBson = new BsonDocument();
                                dataBson.Add("EditType", "1");
                                dataBson.Add("name", expRemark.Text("name"));
                                dataBson.Add("isNeedUpLoad", expRemark.Text("isNeedUpLoad"));
                                dataBson.Add("srcRemarkId", expRemark.Text("remarkId"));
                                dataBson.Add("taskId", tempDeliver.Text("taskId"));
                                dataBson.Add("deliverId", tempDeliver.Text("deliverId"));
                                update.Name = "PredefineFileRemark";
                                update.Type = StorageType.Insert;
                                update.Document = dataBson;
                                updateDataNewList.Add(update);

                            }

                        }

                    }
                    if (updateDataNewList.Count() > 0)
                    {
                        dataOp.BatchSaveStorageData(updateDataNewList);
                    }
                    #endregion
                }

            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #endregion

        #region  利用插件PDF导出
        /// <summary>
        ///
        /// </summary>
        public void PDFImport(string keyValue, string url, string tableName)
        {
            try
            {
                if (string.IsNullOrEmpty(keyValue) && string.IsNullOrEmpty(url) && string.IsNullOrEmpty(tableName))
                {
                    throw new Exception("传入参数有误！");
                }
                TableRule rule = new TableRule(tableName);
                string keyName = rule.GetPrimaryKey();
                if (string.IsNullOrEmpty(keyName))
                {
                    throw new Exception("传入参数有误！");
                }
                var entity = dataOp.FindOneByQuery(tableName, Query.EQ(keyName, keyValue));
                url = string.Format("{0}{1}?{2}={3}", SysAppConfig.Domain, url, keyName, keyValue);
                string tmpName = entity.Text("name") + ".pdf";
                string tmpName1 = HttpUtility.UrlEncode(tmpName, System.Text.Encoding.UTF8).Replace("+", "%20"); //主要为了解决包含非英文/数字名称的问题
                string savePath = Server.MapPath("/UploadFiles/temp");
                if (!System.IO.Directory.Exists(savePath))
                {
                    System.IO.Directory.CreateDirectory(savePath);
                }
                savePath = System.IO.Path.Combine(savePath, tmpName1);
                string wkhtmltopdfUrl = Server.MapPath("/bin/wkhtmltopdf.exe");
                Process p = System.Diagnostics.Process.Start(@"" + wkhtmltopdfUrl + "", @"" + url + " " + savePath);
                p.WaitForExit();
                DownloadFileZHTZ(savePath, tmpName);


            }
            catch (Exception ex)
            {

            }
        }
        #endregion

        #region 日志相关
        /// <summary>
        /// 记录文档阅读与下载日志
        /// </summary>
        /// <param name="type">日志类型 1:阅读,2:下载</param>
        /// <param name="fileId">文档Id</param>
        /// <returns></returns>
        public ActionResult LogFileReadAndDown()
        {
            var type = PageReq.GetParamInt("type");
            var fileId = PageReq.GetParamInt("fileId");
            //SysLogType logType = type == 1 ? SysLogType.FileRead : SysLogType.FileDown;

            //InvokeResult result = dataOp.LogSysBehavior(logType, HttpContext);    //记录系统行为日志

            InvokeResult result = new InvokeResult();

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }


        /// <summary>
        /// 读取日志文件
        /// </summary>
        /// <param name="jsonUrl"></param>
        /// <returns></returns>
        private List<BsonDocument> ReadLogFile(string tbName, string jsonUrl)
        {
            StreamReader objReader = new StreamReader(@jsonUrl);

            string jsonStr = objReader.ReadToEnd();

            objReader.Close();

            List<BsonDocument> allBson = new List<BsonDocument>();

            BsonReader bsonReader = BsonReader.Create(jsonStr);

            while (bsonReader.CurrentBsonType != BsonType.EndOfDocument)
            {
                BsonDocument tempBson = BsonDocument.ReadFrom(bsonReader);

                if (tempBson.ContainsColumn("underTable") == false)
                {
                    tempBson.Add("underTable", tbName);
                }
                if (tempBson.ContainsColumn("updateDate") == false)
                {
                    tempBson.Add("updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                }

                if (tempBson.ContainsColumn("updateUserId") == false)
                {
                    tempBson.Add("updateUserId", CurrentUserId.ToString());
                }

                allBson.Add(tempBson);
            }

            return allBson;
        }

        /// <summary>
        /// 恢复日志数据(直接操作数据库)
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="jsonUrl">文件地址</param>
        /// <param name="type">恢复类型 Ins:插入,Del:删除</param>
        /// <returns></returns>
        public ActionResult RecoveryLogData(string tbName, string jsonUrl, string type)
        {
            PageJson json = new PageJson();

            if (System.IO.File.Exists(@jsonUrl) == false) //如果存在,则读取规则文件
            {
                json.Success = false;
                json.Message = "文件不存在";
                return Json(json);
            }

            if (tbName == null || tbName.Trim() == "")
            {
                json.Success = false;
                json.Message = "表名不能为空";
                return Json(json);
            }

            if (type == null || type.Trim() == "")
            {
                json.Success = false;
                json.Message = "类型不能为空";
                return Json(json);
            }

            InvokeResult result = new InvokeResult();

            if (type == "Ins") result = this.InsertLogData(tbName, jsonUrl);
            else if (type == "Del") result = this.DeleteLogData(tbName, jsonUrl);

            json = TypeConvert.InvokeResultToPageJson(result);

            return Json(json);

        }


        /// <summary>
        /// 将用户访问系统的相关数据导出Excel文件
        /// </summary>
        /// <returns></returns>
        public void ExportUserVisitLogToExcel()
        {
            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            //所有供应商信息
            List<BsonDocument> logList = dataOp.FindAllByQuery("SysBehaviorLog", Query.And(
                Query.Matches("path", "AjaxLogin"),
                Query.EQ("method", "POST"),
                Query.Matches("logTime", "2014")
                )).ToList();

            List<BsonValue> userIdList = logList.Select(t => t.GetValue("logUserId")).Distinct().ToList();    //所有相关的用户Id

            List<BsonDocument> userList = dataOp.FindAllByQuery("SysUser", Query.In("userId", userIdList)).ToList();    //所有用到的用户

            List<BsonDocument> userPostList = dataOp.FindAllByQuery("UserOrgPost", Query.In("userId", userIdList)).ToList();    //所有用户岗位关联

            List<BsonValue> postIdList = userPostList.Select(t => t.GetValue("postId")).Distinct().ToList();    //所有岗位Id

            List<BsonDocument> postList = dataOp.FindAllByQuery("OrgPost", Query.In("postId", postIdList)).ToList();        //所有岗位

            List<BsonDocument> orgList = dataOp.FindAll("Organization").ToList();                               //所有岗位部门

            #endregion

            #region 形成对应Html表格

            htmlStr.Append("<html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\">");
            htmlStr.Append("<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">");
            htmlStr.Append("<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name></x:Name><x:WorksheetOptions><x:Selected/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->");
            htmlStr.Append("</head>");
            htmlStr.Append("<body>");
            htmlStr.Append("<table>");

            #region 表头
            htmlStr.Append("<thead>");

            #region 第一层
            htmlStr.Append("<tr>");
            htmlStr.Append("<th>序号</th>");
            htmlStr.Append("<th>用户</th>");
            htmlStr.Append("<th>部门1</th>");
            htmlStr.Append("<th>部门2</th>");
            htmlStr.Append("<th>部门3</th>");
            htmlStr.Append("<th>岗位</th>");
            htmlStr.Append("<th>登陆时间</th>");
            htmlStr.Append("<td>登陆IP</th>");
            htmlStr.Append("<td>浏览器</th>");
            htmlStr.Append("<td>用户名</th>");
            htmlStr.Append("<td>密码</th>");
            htmlStr.Append("</tr>");
            #endregion

            htmlStr.Append("</thead>");
            #endregion

            #region 表身
            htmlStr.Append("<tbody>");

            int index = 1;
            foreach (var tempLog in logList.OrderBy(t => t.String("timeSort")))
            {
                BsonDocument tempUser = tempLog.Int("logUserId") > 0 ? userList.Where(t => t.Int("userId") == tempLog.Int("logUserId")).FirstOrDefault() : null;      //对应用户
                BsonDocument tempPostRel = userPostList.Where(t => t.Int("userId") == tempUser.Int("userId")).FirstOrDefault(); //对应用户岗位关联
                BsonDocument tempPost = postList.Where(t => t.Int("postId") == tempPostRel.Int("postId")).FirstOrDefault();     //对应岗位
                BsonDocument tempOrg3 = orgList.Where(t => t.Int("orgId") == tempPost.Int("orgId")).FirstOrDefault();            //对应第三级部门
                BsonDocument tempOrg2 = tempOrg3.Int("nodePid") != 0 ? orgList.Where(t => t.Int("orgId") == tempOrg3.Int("nodePid")).FirstOrDefault() : null;   //对应第二级部门
                BsonDocument tempOrg1 = (tempOrg2 != null && tempOrg2.Int("nodePid") != 0) ? orgList.Where(t => t.Int("orgId") == tempOrg2.Int("nodePid")).FirstOrDefault() : null;   //对应第二级部门

                htmlStr.Append("<tr>");
                htmlStr.AppendFormat("<td>{0}</td>", index);
                htmlStr.AppendFormat("<td>{0}</td>", tempUser != null ? tempUser.String("name") : "调试管理员");
                htmlStr.AppendFormat("<td>{0}</td>", tempOrg1 != null ? tempOrg1.String("name") : "");
                htmlStr.AppendFormat("<td>{0}</td>", tempOrg2 != null ? tempOrg2.String("name") : "");
                htmlStr.AppendFormat("<td>{0}</td>", tempOrg3 != null ? tempOrg3.String("name") : "");
                htmlStr.AppendFormat("<td>{0}</td>", tempPost.String("name"));
                htmlStr.AppendFormat("<td>{0}</td>", tempLog.String("logTime"));
                htmlStr.AppendFormat("<td>{0}</td>", tempLog.String("ipAddress"));
                htmlStr.AppendFormat("<td>{0}</td>", tempLog.String("browser"));
                htmlStr.AppendFormat("<td>{0}</td>", tempLog.String("userName"));
                htmlStr.AppendFormat("<td>{0}</td>", tempLog.String("password"));

                htmlStr.Append("</tr>");
                index++;
            }

            htmlStr.Append("</tbody>");
            #endregion

            htmlStr.Append("</table>");
            htmlStr.Append("</body>");
            htmlStr.Append("</html>");
            #endregion

            //调用输出Excel表的方法
            ExportToExcel("application/ms-excel", "用户访问日志.xls", htmlStr.ToString());
        }

        /// <summary>
        /// 根据行为日志回滚
        /// </summary>
        /// <param name="behaviorId"></param>
        /// <returns></returns>
        public string SysLogRollback(string behaviorId)
        {
            //读取行为日志
            BsonDocument behaviorLog = dataOp.FindOneByQuery("SysBehaviorLog", Query.EQ("_id", new ObjectId(behaviorId)));

            if (behaviorLog == null)
            {
                Response.Write("该行为日志不存在");
                Response.Write("<br></br>");
                Response.Write("<hr></hr>");
                return "Error!";
            }

            //所有该行为产生的数据日志
            List<BsonDocument> dataLogList = dataOp.FindAllByQuery("SysAssoDataLog", Query.EQ("behaviorId", behaviorId)).ToList();

            //根据3种不同的行为,导出临时的数据Json
            Dictionary<string, int> logTypeDic = new Dictionary<string, int>();
            logTypeDic.Add("beInsert", 3);
            //logTypeDic.Add("Update", 4);
            logTypeDic.Add("beDelete", 5);

            try
            {
                foreach (var tempType in logTypeDic)
                {
                    string dirUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataJson", "SysLogData", behaviorId, tempType.Key);

                    if (System.IO.Directory.Exists(dirUrl))
                    {
                        DirectoryInfo dir = new DirectoryInfo(dirUrl);
                        dir.Delete(true);
                    }

                    Directory.CreateDirectory(dirUrl);

                    //生成日志临时数据文件
                    InvokeResult result = this.GetLogRecoveryFile(dataLogList, tempType.Value, dirUrl);
                    if (result.Status == Status.Failed) throw new Exception(result.Message);
                    else
                    {
                        result = this.BatchRecoveryLogData(dirUrl, tempType.Value);
                        if (result.Status == Status.Failed) throw new Exception(result.Message);
                    }

                    Response.Write("<hr></hr>");
                }
            }
            catch (Exception ex)
            {
                return "Error : " + ex.Message;
            }

            return "Success!!";
        }

        /// <summary>
        /// 从系统日志中生成恢复数据的JSON
        /// </summary>
        /// <param name="dataLogList">数据日志</param>
        /// <param name="logType">日志类型</param>
        /// <param name="dirUrl">保存地址</param>
        /// <returns></returns>
        private InvokeResult GetLogRecoveryFile(List<BsonDocument> dataLogList, int logType, string dirUrl)
        {
            #region 参数初始化
            InvokeResult result = new InvokeResult();

            string dataType = "";

            switch (logType)
            {
                case 3:
                    dataType = "opData";
                    break;
                case 5:
                    dataType = "oldData";
                    break;
            }
            #endregion

            #region 获取日志数据
            //找到所有相关数据日志
            List<BsonDocument> subLogList = dataLogList.Where(t => t.Int("logType") == logType).ToList();

            //日志涉及的所有表
            List<string> tbNameList = subLogList.Select(t => t.String("tableName")).Distinct().ToList();
            #endregion

            #region 按表导出相关的数据JSON文件
            StreamWriter sw = null;

            foreach (var tempName in tbNameList)
            {
                List<BsonDocument> tempLogList = subLogList.Where(t => t.String("tableName") == tempName).ToList();

                string fileUrl = Path.Combine(dirUrl, tempName + ".json");

                try
                {
                    //打开或者新增文件
                    if (!System.IO.File.Exists(fileUrl)) sw = System.IO.File.CreateText(fileUrl);
                    else sw = System.IO.File.AppendText(fileUrl);

                    //将日志数据写入文件中
                    foreach (var tempLog in tempLogList)
                    {
                        sw.Write(tempLog.String(dataType));
                    }
                }
                catch (Exception ex)
                {
                    result.Status = Status.Failed;
                    result.Message = ex.Message;
                }
                finally
                {
                    sw.Flush();
                    sw.Close();
                }

                if (result.Status == Status.Failed) break;
            }
            #endregion

            return result;
        }

        /// <summary>
        /// 从系统日志中生成恢复数据的JSON
        /// </summary>
        /// <param name="behaviorId"></param>
        /// <param name="logType"></param>
        /// <returns></returns>
        public string GetLogRecoveryFile(string behaviorId)
        {
            //读取行为日志
            BsonDocument behaviorLog = dataOp.FindOneByQuery("SysBehaviorLog", Query.EQ("_id", new ObjectId(behaviorId)));

            if (behaviorLog == null)
            {
                Response.Write("该行为日志不存在");
                Response.Write("<br></br>");
                Response.Write("<hr></hr>");
                return "Error!";
            }

            //所有该行为产生的数据日志
            List<BsonDocument> dataLogList = dataOp.FindAllByQuery("SysAssoDataLog", Query.EQ("behaviorId", behaviorId)).ToList();

            //根据3种不同的行为,导出临时的数据Json
            Dictionary<string, int> logTypeDic = new Dictionary<string, int>();
            logTypeDic.Add("beInsert", 3);
            //logTypeDic.Add("Update", 4);
            logTypeDic.Add("beDelete", 5);

            try
            {
                foreach (var tempType in logTypeDic)
                {
                    string dirUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataJson", "SysLogData", behaviorId, tempType.Key);

                    if (System.IO.Directory.Exists(dirUrl) == false) Directory.CreateDirectory(dirUrl);

                    InvokeResult result = this.GetLogRecoveryFile(dataLogList, tempType.Value, dirUrl);
                    if (result.Status == Status.Failed) throw new Exception(result.Message);
                }
            }
            catch (Exception ex)
            {
                return "Error : " + ex.Message;
            }

            return "Success!!";
        }


        /// <summary>
        /// 批量恢复日志数据
        /// </summary>
        /// <param name="dirUrl">日志数据所在文件</param>
        /// <param name="type">日志类型,3为新增,则需要删除,5为删除,则需要新增</param>
        /// <returns></returns>
        private InvokeResult BatchRecoveryLogData(string dirUrl, int type)
        {
            InvokeResult result = new InvokeResult();

            if (System.IO.Directory.Exists(dirUrl))
            {
                try
                {
                    DirectoryInfo dir = new DirectoryInfo(@dirUrl);

                    foreach (var tempFile in dir.GetFiles())    //循环目录中的文件进行数据处理
                    {
                        string tbName = tempFile.Name.Substring(0, tempFile.Name.IndexOf('.'));
                        string fileUrl = tempFile.FullName;

                        Response.Write("-----------开始处理----------<br></br>");
                        Response.Write(string.Format("表名:{0}<br></br>", tbName));
                        Response.Write(string.Format("所在地址:{0}<br></br>", fileUrl));
                        Response.Write(string.Format("处理类型:{0}<br></br>", type == 5 ? "插入被删数据" : "删除插入数据"));

                        if (type == 5) result = this.InsertLogData(tbName, fileUrl);
                        else if (type == 3) result = this.DeleteLogData(tbName, fileUrl);

                        if (result.Status == Status.Successful)
                        {
                            Response.Write("-----------处理完成-----------<br></br>");
                        }
                        else
                        {
                            Response.Write("-----------处理失败-----------<br></br>");
                            Response.Write(string.Format("错误原因:{0}<br></br><br></br>", result.Message));
                        }
                    }
                }
                catch (Exception ex)
                {
                    result.Status = Status.Failed;
                    result.Message = ex.Message;
                }
            }

            return result;
        }

        /// <summary>
        /// 插入日志文件中被删除的数据
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="jsonUrl"></param>
        /// <returns></returns>
        private InvokeResult InsertLogData(string tbName, string jsonUrl)
        {
            InvokeResult result = new InvokeResult();

            MongoOperation mongoOp = new MongoOperation();

            TableRule tableEntity = new TableRule(tbName);    //获取表结构

            try
            {
                List<BsonDocument> allBsonList = this.ReadLogFile(tbName, jsonUrl);

                //插入数据
                mongoOp.GetCollection(tbName).InsertBatch(allBsonList);
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return result;
        }

        /// <summary>
        /// 删除日志文件中新增加的数据
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="jsonUrl"></param>
        /// <returns></returns>
        private InvokeResult DeleteLogData(string tbName, string jsonUrl)
        {
            InvokeResult result = new InvokeResult();

            MongoOperation mongoOp = new MongoOperation();

            TableRule tableEntity = new TableRule(tbName);    //获取表结构

            try
            {
                List<BsonDocument> allBsonList = this.ReadLogFile(tbName, jsonUrl);

                //删除数据
                foreach (var temp in allBsonList)
                {
                    mongoOp.GetCollection(tbName).Remove(Query.EQ(tableEntity.PrimaryKey, temp.String(tableEntity.PrimaryKey)));
                }
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }

            return result;
        }

        /// <summary>
        /// 还原系统误删的数据
        /// </summary>
        /// <returns></returns>
        public string RecoveryProgramDelete()
        {
            //找到所有20140813后的文档删除日志
            List<BsonDocument> tempLogList = dataOp.FindAllByQuery("SysBehaviorLog", Query.And(
                Query.EQ("path", "/Home/DeleFiles"),
                Query.GTE("timeSort", "201408130000"),
                Query.Exists("delFileRelIds", true),
                Query.NE("delFileRelIds", "")
                )).ToList();

            List<BsonDocument> logList = new List<BsonDocument>();

            BsonDocument filePKCounter = dataOp.FindOneByQuery("TablePKCounter", Query.EQ("tbName", "FileLibrary"));

            //进行筛选
            foreach (var tempLog in tempLogList)
            {
                bool flag = false;

                if (tempLog.Int("delFileRelIds") < filePKCounter.Int("count")) flag = true;

                if (flag == true) logList.Add(tempLog);
            }

            //找到所有数据日志
            List<string> logIdList = logList.Select(t => t.String("_id")).ToList();
            List<BsonDocument> dataLogList = dataOp.FindAllByKeyValList("SysAssoDataLog", "behaviorId", logIdList).ToList();

            List<BsonDocument> recoveryDataList = new List<BsonDocument>();

            foreach (var tempLog in logList)
            {
                //获取所有被删除的记录
                List<BsonDocument> tempDataList = dataLogList.Where(t => t.String("behaviorId") == tempLog.String("_id")).ToList();

                foreach (var tempData in tempDataList)
                {
                    if (tempData.String("oldData").Contains(string.Format("\"fileId\" : \"{0}\"", tempLog.Int("delFileRelIds"))))
                    {
                        recoveryDataList.Add(tempData);
                    }
                }
            }

            try
            {
                string dirUrl = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataJson", "SysLogData", "ProgramDelete");

                if (System.IO.Directory.Exists(dirUrl))
                {
                    DirectoryInfo dir = new DirectoryInfo(dirUrl);
                    dir.Delete(true);
                }

                Directory.CreateDirectory(dirUrl);

                InvokeResult result = GetLogRecoveryFile(recoveryDataList, 5, dirUrl);
                if (result.Status == Status.Failed) throw new Exception(result.Message);
                else
                {
                    result = this.BatchRecoveryLogData(dirUrl, 5);
                    if (result.Status == Status.Failed) throw new Exception(result.Message);
                }

                Response.Write("<hr></hr>");
            }
            catch (Exception ex)
            {
                return "Error : " + ex.Message;
            }

            return "Success!!";

        }

        #endregion

        #region 材料库相关导入导出
        /// <summary>
        /// 导出三盛材料库信息
        /// </summary>
        public void ExportSSMatInfoToExcel()
        {
            dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.134/SS");

            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            List<BsonDocument> matList = dataOp.FindAll("Material_Material").ToList();  //材料

            List<BsonDocument> baseCatList = dataOp.FindAll("Material_BaseCat").ToList();   //基类

            List<BsonDocument> categoryList = dataOp.FindAll("Material_Category").ToList(); //类目

            List<BsonDocument> brandList = dataOp.FindAll("Material_Brand").ToList();       //品牌

            List<BsonDocument> supplierList = dataOp.FindAll("Material_Supplier").ToList();    //供应商

            List<BsonDocument> allBaseCatRelList = dataOp.FindAll("XH_Material_BaseCatBrand").ToList(); //所有材料基类关联

            List<BsonDocument> allBaseCatSuList = dataOp.FindAll("XH_Material_BaseCatSupplier").ToList();

            List<BsonDocument> matCityList = dataOp.FindAll("MatCity").ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "基类模板", "品牌管理", "供应商管理" };

            Dictionary<string, string> matAttrList = new Dictionary<string, string>();

            matAttrList.Add("材料编号", "matNum");
            matAttrList.Add("规格", "specification");
            matAttrList.Add("主材供货方式", "supplierManner");
            matAttrList.Add("采购方式", "procurementMethod");
            matAttrList.Add("市场价格", "marketPrice");
            matAttrList.Add("采购价格", "purchasePrice");
            matAttrList.Add("型号", "supplierModel");
            matAttrList.Add("单位", "costUnit");
            matAttrList.Add("是否含施工费", "ConstrCost");
            matAttrList.Add("材料说明", "MaterDesc");
            matAttrList.Add("设计说明", "DesiNote");
            matAttrList.Add("施工说明", "standardsTechnology");

            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "基类模板")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "材料Id");
                    cells.Add(j, 2, "一级类目");
                    cells.Add(j, 3, "二级类目");
                    cells.Add(j, 4, "基类");
                    cells.Add(j, 5, "材料名称");
                    cells.Add(j, 6, "品牌");
                    cells.Add(j, 7, "供应商");
                    cells.Add(j, 8, "城市");

                    int i = 9;

                    foreach (var tempAttr in matAttrList)
                    {
                        cells.Add(j, i, tempAttr.Key);
                        i++;
                    }
                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                            {
                                foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                {
                                    BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                    BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();
                                    BsonDocument tempCity = matCityList.Where(t => t.Int("cityId") == tempMat.Int("cityId")).FirstOrDefault();

                                    cells.Add(j, 1, tempMat.String("matId"));
                                    cells.Add(j, 2, firstCat.String("name"));
                                    cells.Add(j, 3, secondCat.String("name"));
                                    cells.Add(j, 4, tempBase.String("name"));
                                    cells.Add(j, 5, tempMat.String("name"));
                                    cells.Add(j, 6, tempBrand.String("name"));
                                    cells.Add(j, 7, tempSupplier.String("name"));
                                    cells.Add(j, 8, tempCity.String("name"));

                                    i = 9;

                                    foreach (var tempAttr in matAttrList)
                                    {
                                        cells.Add(j, i, tempMat.String(tempAttr.Value));
                                        i++;
                                    }

                                    j++;
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (sheetName == "品牌管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "品牌Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "生产厂商");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in brandList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempRelList = allBaseCatRelList.Where(t => t.Int("brandId") == temp.Int("brandId")).ToList();   //所有关联

                        List<int> tempBaseCatIdList = tempRelList.Select(t => t.Int("baseCatId")).ToList();     //对应基类列表 

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("brandId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("Province"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }

                if (sheetName == "供应商管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "供应商Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "编号");
                    cells.Add(j, 5, "省份");
                    cells.Add(j, 6, "地址");
                    cells.Add(j, 7, "联系人");
                    cells.Add(j, 8, "电话");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in supplierList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempSuList = allBaseCatSuList.Where(c => c.String("supplierId") == temp.String("supplierId")).ToList();
                        List<int> tempBaseCatIdList = tempSuList.Select(t => t.Int("baseCatId")).ToList();

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("supplierId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("SupplierCode"));
                                cells.Add(j, 5, temp.String("Province"));
                                cells.Add(j, 6, temp.String("Address"));
                                cells.Add(j, 7, temp.String("LinkMan"));
                                cells.Add(j, 8, temp.String("TEL"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }


            }

            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("三盛材料库导出", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
        }

        /// <summary>
        /// 导出中海宏扬材料库信息
        /// </summary>
        public void ExportZHHYMatInfoToExcel()
        {
            dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.134/ZHHY");

            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            List<BsonDocument> matList = dataOp.FindAll("XH_Material_Material").ToList();  //材料

            List<BsonDocument> baseCatList = dataOp.FindAll("XH_Material_BaseCat").ToList();   //基类

            List<BsonDocument> categoryList = dataOp.FindAll("XH_Material_Category").ToList(); //类目

            List<BsonDocument> brandList = dataOp.FindAll("XH_Material_Brand").ToList();       //品牌

            List<BsonDocument> supplierList = dataOp.FindAll("XH_Material_Supplier").ToList();    //供应商

            List<BsonDocument> allBaseCatRelList = dataOp.FindAll("XH_Material_BaseCatBrand").ToList(); //所有材料基类关联

            List<BsonDocument> allBaseCatSuList = dataOp.FindAll("XH_Material_BaseCatSupplier").ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "基类模板", "品牌管理", "供应商管理" };

            Dictionary<string, string> matAttrList = new Dictionary<string, string>();

            matAttrList.Add("材料型号", "supplierModel");
            matAttrList.Add("规格", "specification");
            matAttrList.Add("主材供货方式", "supplierManner");
            matAttrList.Add("采购方式", "procurementMethod");
            matAttrList.Add("主材价格", "costPrice");
            matAttrList.Add("单位", "costUnit");
            matAttrList.Add("是否含施工费", "ConstrCost");
            matAttrList.Add("材料说明", "MaterDesc");
            matAttrList.Add("设计说明", "DesiNote");
            matAttrList.Add("施工说明", "standardsTechnology");

            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "基类模板")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "材料Id");
                    cells.Add(j, 2, "一级类目");
                    cells.Add(j, 3, "二级类目");
                    cells.Add(j, 4, "基类");
                    cells.Add(j, 5, "材料名称");
                    cells.Add(j, 6, "品牌");
                    cells.Add(j, 7, "供应商");

                    int i = 8;

                    foreach (var tempAttr in matAttrList)
                    {
                        cells.Add(j, i, tempAttr.Key);
                        i++;
                    }

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                            {
                                foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                {
                                    BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                    BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();

                                    cells.Add(j, 1, tempMat.String("matId"));
                                    cells.Add(j, 2, firstCat.String("name"));
                                    cells.Add(j, 3, secondCat.String("name"));
                                    cells.Add(j, 4, tempBase.String("name"));
                                    cells.Add(j, 5, tempMat.String("name"));
                                    cells.Add(j, 6, tempBrand.String("name"));
                                    cells.Add(j, 7, tempSupplier.String("name"));

                                    i = 8;

                                    foreach (var tempAttr in matAttrList)
                                    {
                                        cells.Add(j, i, tempMat.String(tempAttr.Value));
                                        i++;
                                    }

                                    j++;
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (sheetName == "品牌管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "品牌Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "生产厂商");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in brandList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempRelList = allBaseCatRelList.Where(t => t.Int("brandId") == temp.Int("brandId")).ToList();   //所有关联

                        List<int> tempBaseCatIdList = tempRelList.Select(t => t.Int("baseCatId")).ToList();     //对应基类列表 

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("brandId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("Province"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }

                if (sheetName == "供应商管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "供应商Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "编号");
                    cells.Add(j, 5, "省份");
                    cells.Add(j, 6, "地址");
                    cells.Add(j, 7, "联系人");
                    cells.Add(j, 8, "电话");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in supplierList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempSuList = allBaseCatSuList.Where(c => c.String("supplierId") == temp.String("supplierId")).ToList();
                        List<int> tempBaseCatIdList = tempSuList.Select(t => t.Int("baseCatId")).ToList();

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("supplierId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("SupplierCode"));
                                cells.Add(j, 5, temp.String("Province"));
                                cells.Add(j, 6, temp.String("Address"));
                                cells.Add(j, 7, temp.String("LinkMan"));
                                cells.Add(j, 8, temp.String("TEL"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }


            }

            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("中海弘扬材料库导出", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
        }

        /// <summary>
        /// 导出中海投资材料库信息
        /// </summary>
        public void ExportZHTZMatInfoToExcel()
        {
            dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.134/ZHTZ");

            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            List<BsonDocument> matList = dataOp.FindAll("XH_Material_Material").ToList();  //材料

            List<BsonDocument> baseCatList = dataOp.FindAll("XH_Material_BaseCat").ToList();   //基类

            List<BsonDocument> categoryList = dataOp.FindAll("XH_Material_Category").ToList(); //类目

            List<BsonDocument> brandList = dataOp.FindAll("XH_Material_Brand").ToList();       //品牌

            List<BsonDocument> supplierList = dataOp.FindAll("XH_Material_Supplier").ToList();    //供应商

            List<BsonDocument> allBaseCatRelList = dataOp.FindAll("XH_Material_BaseCatBrand").ToList(); //所有材料基类关联

            List<BsonDocument> allBaseCatSuList = dataOp.FindAll("XH_Material_BaseCatSupplier").ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "基类模板", "品牌管理", "供应商管理" };

            Dictionary<string, string> matAttrList = new Dictionary<string, string>();

            matAttrList.Add("材料编号", "supplierNumber");
            matAttrList.Add("适应部位", "adaptParts");
            matAttrList.Add("系列", "series");
            matAttrList.Add("型号", "supplierModel");
            matAttrList.Add("规格", "specification");
            matAttrList.Add("色/饰面", "colorAndAdornment");
            matAttrList.Add("采购方式", "procurement");
            matAttrList.Add("主材价格", "costPrice");
            matAttrList.Add("是否含施工费", "hasConstructionCosts");
            matAttrList.Add("材料说明", "MaterDesc");
            matAttrList.Add("设计说明", "DesiNote");
            matAttrList.Add("施工说明", "standardsTechnology");

            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "基类模板")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "材料Id");
                    cells.Add(j, 2, "一级类目");
                    cells.Add(j, 3, "二级类目");
                    cells.Add(j, 4, "基类");
                    cells.Add(j, 5, "材料名称");
                    cells.Add(j, 6, "品牌");
                    cells.Add(j, 7, "供应商");

                    int i = 8;

                    foreach (var tempAttr in matAttrList)
                    {
                        cells.Add(j, i, tempAttr.Key);
                        i++;
                    }

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                            {
                                foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                {
                                    BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                    BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();

                                    cells.Add(j, 1, tempMat.String("matId"));
                                    cells.Add(j, 2, firstCat.String("name"));
                                    cells.Add(j, 3, secondCat.String("name"));
                                    cells.Add(j, 4, tempBase.String("name"));
                                    cells.Add(j, 5, tempMat.String("name"));
                                    cells.Add(j, 6, tempBrand.String("name"));
                                    cells.Add(j, 7, tempSupplier.String("name"));

                                    i = 8;

                                    foreach (var tempAttr in matAttrList)
                                    {
                                        cells.Add(j, i, tempMat.String(tempAttr.Value));
                                        i++;
                                    }

                                    j++;
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (sheetName == "品牌管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "品牌Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "生产厂商");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in brandList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempRelList = allBaseCatRelList.Where(t => t.Int("brandId") == temp.Int("brandId")).ToList();   //所有关联

                        List<int> tempBaseCatIdList = tempRelList.Select(t => t.Int("baseCatId")).ToList();     //对应基类列表 

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("brandId"));
                                cells.Add(j, 2, temp.String("name"));
                                if (i == 0) cells.Add(j, 4, temp.String("Province"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }

                if (sheetName == "供应商管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "供应商Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "编号");
                    cells.Add(j, 5, "省份");
                    cells.Add(j, 6, "地址");
                    cells.Add(j, 7, "联系人");
                    cells.Add(j, 8, "电话");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in supplierList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempSuList = allBaseCatSuList.Where(c => c.String("supplierId") == temp.String("supplierId")).ToList();
                        List<int> tempBaseCatIdList = tempSuList.Select(t => t.Int("baseCatId")).ToList();

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("supplierId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("SupplierCode"));
                                cells.Add(j, 5, temp.String("Province"));
                                cells.Add(j, 6, temp.String("Address"));
                                cells.Add(j, 7, temp.String("LinkMan"));
                                cells.Add(j, 8, temp.String("TEL"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }


            }

            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("中海投资材料库导出", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
        }

        /// <summary>
        /// 导出旭辉材料库信息
        /// </summary>
        public void ExportXHMatInfoToExcel()
        {
            dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.134/XHTEST");

            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            List<BsonDocument> matList = dataOp.FindAll("XH_Material_Material").ToList();  //材料

            List<BsonDocument> baseCatList = dataOp.FindAll("XH_Material_BaseCat").ToList();   //基类

            List<BsonDocument> categoryList = dataOp.FindAll("XH_Material_Category").ToList(); //类目

            List<BsonDocument> brandList = dataOp.FindAll("XH_Material_Brand").ToList();       //品牌

            List<BsonDocument> supplierList = dataOp.FindAll("XH_Material_Supplier").ToList();    //供应商

            List<BsonDocument> allBaseCatRelList = dataOp.FindAll("XH_Material_BaseCatBrand").ToList(); //所有材料基类关联

            List<BsonDocument> allBaseCatSuList = dataOp.FindAll("XH_Material_BaseCatSupplier").ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "材料管理", "品牌管理", "供应商管理" };

            Dictionary<string, string> matAttrList = new Dictionary<string, string>();

            matAttrList.Add("材料型号", "supplierModel");
            matAttrList.Add("规格", "specification");
            matAttrList.Add("主材供货方式", "supplierManner");
            matAttrList.Add("采购方式", "procurementMethod");
            matAttrList.Add("主材价格", "costPrice");
            matAttrList.Add("单位", "costUnit");
            matAttrList.Add("是否含施工费", "ConstrCost");
            matAttrList.Add("材料说明", "MaterDesc");
            matAttrList.Add("设计说明", "DesiNote");
            matAttrList.Add("施工说明", "standardsTechnology");

            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "材料管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "材料Id");
                    cells.Add(j, 2, "一级类目");
                    cells.Add(j, 3, "二级类目");
                    cells.Add(j, 4, "基类");
                    cells.Add(j, 5, "材料名称");
                    cells.Add(j, 6, "品牌");
                    cells.Add(j, 7, "供应商");

                    int i = 8;

                    foreach (var tempAttr in matAttrList)
                    {
                        cells.Add(j, i, tempAttr.Key);
                        i++;
                    }

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                            {
                                foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                {
                                    BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                    BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();

                                    cells.Add(j, 1, tempMat.String("matId"));
                                    cells.Add(j, 2, firstCat.String("name"));
                                    cells.Add(j, 3, secondCat.String("name"));
                                    cells.Add(j, 4, tempBase.String("name"));
                                    cells.Add(j, 5, tempMat.String("name"));
                                    cells.Add(j, 6, tempBrand.String("name"));
                                    cells.Add(j, 7, tempSupplier.String("name"));

                                    i = 8;

                                    foreach (var tempAttr in matAttrList)
                                    {
                                        cells.Add(j, i, tempMat.String(tempAttr.Value));
                                        i++;
                                    }

                                    j++;
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (sheetName == "品牌管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "品牌Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "生产厂商");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in brandList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempRelList = allBaseCatRelList.Where(t => t.Int("brandId") == temp.Int("brandId")).ToList();   //所有关联

                        List<int> tempBaseCatIdList = tempRelList.Select(t => t.Int("baseCatId")).ToList();     //对应基类列表 

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("brandId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("Province"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }

                if (sheetName == "供应商管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "供应商Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "编号");
                    cells.Add(j, 5, "省份");
                    cells.Add(j, 6, "地址");
                    cells.Add(j, 7, "联系人");
                    cells.Add(j, 8, "电话");
                    cells.Add(j, 9, "公司网址");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in supplierList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempSuList = allBaseCatSuList.Where(c => c.String("supplierId") == temp.String("supplierId")).ToList();
                        List<int> tempBaseCatIdList = tempSuList.Select(t => t.Int("baseCatId")).ToList();

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("supplierId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("SupplierCode"));
                                cells.Add(j, 5, temp.String("Province"));
                                cells.Add(j, 6, temp.String("Address"));
                                cells.Add(j, 7, temp.String("LinkMan"));
                                cells.Add(j, 8, temp.String("TEL"));
                                cells.Add(j, 9, temp.String("AddressUrl"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }


            }

            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("旭辉材料库导出", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
        }

        /// <summary>
        /// 导出卓越材料库信息
        /// </summary>
        public void ExportZYMatInfoToExcel()
        {
            //dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.230/ZY_TEST");

            //导出表格的StringBuilder变量
            StringBuilder htmlStr = new StringBuilder(string.Empty);

            #region 获取相关展示信息

            List<BsonDocument> matList = dataOp.FindAll("XH_Material_Material").ToList();  //材料

            List<BsonDocument> baseCatList = dataOp.FindAll("XH_Material_BaseCat").ToList();   //基类

            List<BsonDocument> categoryList = dataOp.FindAll("XH_Material_Category").ToList(); //类目

            List<BsonDocument> brandList = dataOp.FindAll("XH_Material_Brand").ToList();       //品牌

            List<BsonDocument> supplierList = dataOp.FindAll("XH_Material_Supplier").ToList();    //供应商

            List<BsonDocument> allBaseCatRelList = dataOp.FindAll("XH_Material_BaseCatBrand").ToList(); //所有材料基类关联

            List<BsonDocument> allBaseCatSuList = dataOp.FindAll("XH_Material_BaseCatSupplier").ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "基类模板", "品牌管理", "供应商管理" };

            Dictionary<string, string> matAttrList = new Dictionary<string, string>();

            matAttrList.Add("材料型号", "model");
            matAttrList.Add("规格", "specification");
            matAttrList.Add("主材供货方式", "supplierManner");
            matAttrList.Add("采购方式", "procurementMethod");
            matAttrList.Add("主材价格", "costPrice");
            matAttrList.Add("单位", "costUnit");
            matAttrList.Add("是否含施工费", "ConstrCost");
            matAttrList.Add("材料说明", "MaterDesc");
            matAttrList.Add("设计说明", "DesiNote");
            matAttrList.Add("施工说明", "standardsTechnology");

            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "基类模板")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "材料Id");
                    cells.Add(j, 2, "一级类目");
                    cells.Add(j, 3, "二级类目");
                    cells.Add(j, 4, "基类");
                    cells.Add(j, 5, "材料名称");
                    cells.Add(j, 6, "品牌");
                    cells.Add(j, 7, "供应商");

                    int i = 8;

                    foreach (var tempAttr in matAttrList)
                    {
                        cells.Add(j, i, tempAttr.Key);
                        i++;
                    }

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                            {
                                foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                {
                                    BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                    BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();

                                    cells.Add(j, 1, tempMat.String("matId"));
                                    cells.Add(j, 2, firstCat.String("name"));
                                    cells.Add(j, 3, secondCat.String("name"));
                                    cells.Add(j, 4, tempBase.String("name"));
                                    cells.Add(j, 5, tempMat.String("name"));
                                    cells.Add(j, 6, tempBrand.String("name"));
                                    cells.Add(j, 7, tempSupplier.String("name"));

                                    i = 8;

                                    foreach (var tempAttr in matAttrList)
                                    {
                                        cells.Add(j, i, tempMat.String(tempAttr.Value));
                                        i++;
                                    }

                                    j++;
                                }
                            }
                        }
                    }
                    #endregion
                }

                if (sheetName == "品牌管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "品牌Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "生产厂商");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in brandList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempRelList = allBaseCatRelList.Where(t => t.Int("brandId") == temp.Int("brandId")).ToList();   //所有关联

                        List<int> tempBaseCatIdList = tempRelList.Select(t => t.Int("baseCatId")).ToList();     //对应基类列表 

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("brandId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("Province"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }

                if (sheetName == "供应商管理")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "供应商Id");
                    cells.Add(j, 2, "名称");
                    cells.Add(j, 3, "所属基类");
                    cells.Add(j, 4, "编号");
                    cells.Add(j, 5, "省份");
                    cells.Add(j, 6, "地址");
                    cells.Add(j, 7, "联系人");
                    cells.Add(j, 8, "电话");

                    #endregion

                    #region 输出指标
                    j++;

                    foreach (var temp in supplierList.OrderByDescending(c => c.String("baseCatIds")))
                    {
                        List<BsonDocument> tempSuList = allBaseCatSuList.Where(c => c.String("supplierId") == temp.String("supplierId")).ToList();
                        List<int> tempBaseCatIdList = tempSuList.Select(t => t.Int("baseCatId")).ToList();

                        int i = 0;

                        foreach (var tempBaseCatId in tempBaseCatIdList.Distinct())
                        {
                            BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempBaseCatId).FirstOrDefault();
                            BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                            BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                            if (i == 0)
                            {
                                cells.Add(j, 1, temp.String("supplierId"));
                                cells.Add(j, 2, temp.String("name"));
                                cells.Add(j, 4, temp.String("SupplierCode"));
                                cells.Add(j, 5, temp.String("Province"));
                                cells.Add(j, 6, temp.String("Address"));
                                cells.Add(j, 7, temp.String("LinkMan"));
                                cells.Add(j, 8, temp.String("TEL"));
                            }

                            cells.Add(j, 3, string.Format("{0}>>{1}>>{2}", firstCat.String("name"), secondCat.String("name"), baseCat.String("name")));

                            i++;
                            j++;
                        }
                    }
                    #endregion
                }


            }

            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("卓越材料库导出", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
        }

        /// <summary>
        /// 建设中(通用材料库导出)
        /// </summary>
        public void ExportMatInfoToExcel()
        {
            Dictionary<string, string> clientDic = new Dictionary<string, string>();
            clientDic.Add("旭辉", "mongodb://sa:dba@192.168.1.134/XHTEST");
            clientDic.Add("三盛", "mongodb://sa:dba@192.168.1.134/SS");
            clientDic.Add("中海弘扬", "mongodb://sa:dba@192.168.1.134/ZHHY");
            clientDic.Add("中海投资", "mongodb://sa:dba@192.168.1.134/ZHTZ");

            XlsDocument xlsDoc = new XlsDocument();

            foreach (var tempClient in clientDic)
            {
                #region 获取输出数据
                string matName = "XH_Material_Material";
                string baseCatName = "XH_Material_BaseCat";
                string categoryName = "XH_Material_Category";
                string brandName = "XH_Material_Brand";
                string supplierName = "XH_Material_Supplier";
                string brandRelName = "XH_Material_BaseCatBrand";
                string supplierRelName = "XH_Material_BaseCatSupplier";

                Dictionary<string, string> matAttrList = new Dictionary<string, string>();  // 材料属性

                if (tempClient.Key == "三盛")
                {
                    #region 表名
                    matName = "Material_Material";
                    baseCatName = "Material_BaseCat";
                    categoryName = "Material_Category";
                    brandName = "Material_Brand";
                    supplierName = "Material_Supplier";
                    brandRelName = "XH_Material_BaseCatBrand";
                    supplierRelName = "XH_Material_BaseCatSupplier";
                    #endregion

                    #region 材料属性
                    matAttrList.Add("材料编号", "matNum");
                    matAttrList.Add("规格", "specification");
                    matAttrList.Add("主材供货方式", "supplierManner");
                    matAttrList.Add("采购方式", "procurementMethod");
                    matAttrList.Add("市场价格", "marketPrice");
                    matAttrList.Add("采购价格", "purchasePrice");
                    matAttrList.Add("型号", "supplierModel");
                    matAttrList.Add("单位", "costUnit");
                    matAttrList.Add("是否含施工费", "ConstrCost");
                    matAttrList.Add("材料说明", "MaterDesc");
                    matAttrList.Add("设计说明", "DesiNote");
                    matAttrList.Add("施工说明", "standardsTechnology");
                    #endregion
                }
                else if (tempClient.Key == "中海弘扬")
                {
                    #region 材料属性
                    matAttrList.Add("材料型号", "supplierModel");
                    matAttrList.Add("规格", "specification");
                    matAttrList.Add("主材供货方式", "supplierManner");
                    matAttrList.Add("采购方式", "procurementMethod");
                    matAttrList.Add("主材价格", "costPrice");
                    matAttrList.Add("单位", "costUnit");
                    matAttrList.Add("是否含施工费", "ConstrCost");
                    matAttrList.Add("材料说明", "MaterDesc");
                    matAttrList.Add("设计说明", "DesiNote");
                    matAttrList.Add("施工说明", "standardsTechnology");
                    #endregion
                }
                else if (tempClient.Key == "中海投资")
                {
                    #region 材料属性
                    matAttrList.Add("材料编号", "supplierNumber");
                    matAttrList.Add("适应部位", "adaptParts");
                    matAttrList.Add("系列", "series");
                    matAttrList.Add("型号", "supplierModel");
                    matAttrList.Add("规格", "specification");
                    matAttrList.Add("色/饰面", "colorAndAdornment");
                    matAttrList.Add("采购方式", "procurement");
                    matAttrList.Add("主材价格", "costPrice");
                    matAttrList.Add("是否含施工费", "hasConstructionCosts");
                    matAttrList.Add("材料说明", "MaterDesc");
                    matAttrList.Add("设计说明", "DesiNote");
                    matAttrList.Add("施工说明", "standardsTechnology");
                    #endregion
                }
                else if (tempClient.Key == "旭辉")
                {
                    #region 材料属性
                    matAttrList.Add("材料型号", "supplierModel");
                    matAttrList.Add("规格", "specification");
                    matAttrList.Add("主材供货方式", "supplierManner");
                    matAttrList.Add("采购方式", "procurementMethod");
                    matAttrList.Add("主材价格", "costPrice");
                    matAttrList.Add("单位", "costUnit");
                    matAttrList.Add("是否含施工费", "ConstrCost");
                    matAttrList.Add("材料说明", "MaterDesc");
                    matAttrList.Add("设计说明", "DesiNote");
                    matAttrList.Add("施工说明", "standardsTechnology");
                    #endregion
                }

                dataOp.SetOperationDataBase(tempClient.Value);

                List<BsonDocument> matList = dataOp.FindAll(matName).ToList();              //材料
                List<BsonDocument> baseCatList = dataOp.FindAll(baseCatName).ToList();      //基类
                List<BsonDocument> categoryList = dataOp.FindAll(categoryName).ToList();    //类目
                List<BsonDocument> brandList = dataOp.FindAll(brandName).ToList();          //品牌
                List<BsonDocument> supplierList = dataOp.FindAll(supplierName).ToList();    //供应商
                List<BsonDocument> brandRelList = dataOp.FindAll(brandRelName).ToList();        //基类品牌关联
                List<BsonDocument> suppRelList = dataOp.FindAll(supplierRelName).ToList();      //基类供应商关联
                #endregion

                List<string> sheetNameList = new List<string>() { tempClient.Key + "材料管理", tempClient.Key + "品牌管理", tempClient.Key + "供应商管理" };

                foreach (var sheetName in sheetNameList)
                {
                    Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                    // 开始填充数据到单元格
                    Cells cells = sheet.Cells;

                    if (sheetName.Contains("材料管理"))
                    {
                        #region 输出标题
                        int j = 1;

                        cells.Add(j, 1, "材料Id");
                        cells.Add(j, 2, "一级类目");
                        cells.Add(j, 3, "二级类目");
                        cells.Add(j, 4, "基类");
                        cells.Add(j, 5, "材料名称");
                        cells.Add(j, 6, "品牌");
                        cells.Add(j, 7, "供应商");

                        int i = 8;

                        foreach (var tempAttr in matAttrList)
                        {
                            cells.Add(j, i, tempAttr.Key);
                            i++;
                        }

                        #endregion

                        #region 输出指标
                        j++;

                        foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                        {
                            foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                            {
                                foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                                {
                                    foreach (var tempMat in matList.Where(t => t.Int("baseCatId") == tempBase.Int("baseCatId")).OrderBy(t => t.Int("order")))
                                    {
                                        BsonDocument tempBrand = brandList.Where(t => t.Int("brandId") == tempMat.Int("brandId")).FirstOrDefault();
                                        BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempMat.Int("supplierId")).FirstOrDefault();

                                        cells.Add(j, 1, tempMat.String("matId"));
                                        cells.Add(j, 2, firstCat.String("name"));
                                        cells.Add(j, 3, secondCat.String("name"));
                                        cells.Add(j, 4, tempBase.String("name"));
                                        cells.Add(j, 5, tempMat.String("name"));
                                        cells.Add(j, 6, tempBrand.String("name"));
                                        cells.Add(j, 7, tempSupplier.String("name"));

                                        i = 8;

                                        foreach (var tempAttr in matAttrList)
                                        {
                                            cells.Add(j, i, tempMat.String(tempAttr.Value));
                                            i++;
                                        }

                                        j++;
                                    }
                                }
                            }
                        }
                        #endregion
                    }
                }
            }
        }

        /// <summary>
        /// 导出材料库目录
        /// </summary>
        public void ExportMatCategoryToExcel()
        {
            Dictionary<string, string> clientDic = new Dictionary<string, string>();
            clientDic.Add("旭辉", "mongodb://sa:dba@192.168.1.134/XHTEST");
            clientDic.Add("三盛", "mongodb://sa:dba@192.168.1.134/SS");
            clientDic.Add("中海弘扬", "mongodb://sa:dba@192.168.1.134/ZHHY");
            clientDic.Add("中海投资", "mongodb://sa:dba@192.168.1.134/ZHTZ");

            XlsDocument xlsDoc = new XlsDocument();

            foreach (var tempClient in clientDic)
            {
                #region 获取输出数据
                string baseCatName = "XH_Material_BaseCat";
                string categoryName = "XH_Material_Category";

                if (tempClient.Key == "三盛")
                {
                    baseCatName = "Material_BaseCat";
                    categoryName = "Material_Category";
                }

                dataOp.SetOperationDataBase(tempClient.Value);

                List<BsonDocument> baseCatList = dataOp.FindAll(baseCatName).ToList();   //基类

                List<BsonDocument> categoryList = dataOp.FindAll(categoryName).ToList(); //类目
                #endregion

                #region 构建输出表格
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(tempClient.Key);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                #region 输出标题
                int j = 1;

                cells.Add(j, 1, "一级类目Id");
                cells.Add(j, 2, "一级类目");
                cells.Add(j, 3, "二级类目Id");
                cells.Add(j, 4, "二级类目");
                cells.Add(j, 5, "基类Id");
                cells.Add(j, 6, "基类");
                #endregion

                #region 输出指标
                j++;

                foreach (var firstCat in categoryList.Where(t => t.Int("nodeLevel") == 1).OrderBy(t => t.String("nodeKey")))
                {
                    foreach (var secondCat in categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId")).OrderBy(t => t.String("nodeKey")))
                    {
                        foreach (var tempBase in baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId")).OrderBy(t => t.Int("order")))
                        {
                            cells.Add(j, 1, firstCat.String("categoryId"));
                            cells.Add(j, 2, firstCat.String("name"));
                            cells.Add(j, 3, secondCat.String("categoryId"));
                            cells.Add(j, 4, secondCat.String("name"));
                            cells.Add(j, 5, tempBase.String("baseCatId"));
                            cells.Add(j, 6, tempBase.String("name"));

                            j++;
                        }
                    }
                }
                #endregion
                #endregion
            }

            #region 输出表格
            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("A2.5材料库类目", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
            #endregion
        }

        /// <summary>
        /// 将制定位置Excel的材料数据导入到数据表
        /// </summary>
        /// <param name="fileUrl"></param>
        public void ImprotMatInfoToDatabase()
        {
            InvokeResult result = new InvokeResult();

            OleDbConnection conn = null;
            OleDbCommand cmd = null;
            OleDbDataAdapter dataList = null;

            try
            {
                #region 现有的相关信息

                dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.134/MatDB");

                List<BsonDocument> categoryList = dataOp.FindAll("MatCategory").ToList();   //材料类目
                List<BsonDocument> baseCatList = dataOp.FindAll("MatBaseCat").ToList();     //材料基类

                //Dictionary<string, string> clientDic = new Dictionary<string, string>();
                //clientDic.Add("XH", "mongodb://sa:dba@192.168.1.134/XHTEST");
                //clientDic.Add("SS", "mongodb://sa:dba@192.168.1.134/SS");
                //clientDic.Add("ZHHY", "mongodb://sa:dba@192.168.1.134/ZHHY");
                //clientDic.Add("ZHTZ", "mongodb://sa:dba@192.168.1.134/ZHTZ");

                //List<BsonDocument> oldMatList = new List<BsonDocument>();
                //foreach(var client in clientDic)
                //{
                //    dataOp.SetOperationDataBase(client.Value); //连接到对应数据库

                //    string matTbName = "XH_Material_Material";

                //    if (client.Key == "SS") matTbName = "Material_Material";

                //    List<BsonDocument> tempMatList = dataOp.FindAll(matTbName).ToList();

                //    foreach (var tempMat in tempMatList)
                //    {
                //        tempMat.Add("_ClientCode", client.Key);
                //    }

                //    oldMatList.AddRange(tempMatList);    //获取材料,并添加到总表
                //}

                #endregion

                #region 解析Excel

                #region 获取工作表

                string fileUrl = Server.MapPath("~/DataJson/matData.xls");
                string connString = "Provider=Microsoft.Ace.OleDb.12.0;Data Source='" + fileUrl + "';Extended Properties='Excel 12.0;HDR=NO;IMEX=1'";
                conn = new OleDbConnection(connString);

                if (conn.State != ConnectionState.Open) conn.Open();

                System.Data.DataTable schemaTable = conn.GetOleDbSchemaTable(System.Data.OleDb.OleDbSchemaGuid.Tables, new Object[] { null, null, null, "TABLE" });

                List<BsonDocument> indexGroupList = dataOp.FindAll("EsElementIndexGroup").ToList();     //所有分组

                //获取所有工作表 
                List<string> sheetNameList = new List<string>();
                foreach (DataRow dr in schemaTable.Rows) sheetNameList.Add(dr[2].ToString().Trim(new char[] { '$', '\'' }));

                #endregion

                //循环每个工作表
                foreach (var tempSheet in sheetNameList)
                {
                    if (tempSheet != "基类模板") continue;

                    #region 读取excel
                    DataSet dsExcel = new DataSet();

                    cmd = new OleDbCommand("select * from [" + tempSheet + "$]", conn);

                    dataList = new OleDbDataAdapter(cmd);

                    dataList.Fill(dsExcel, "[" + tempSheet + "$]");

                    var dataTable = (from m in dsExcel.Tables[0].AsEnumerable() select m).ToList();
                    #endregion

                    #region 构建数据
                    Dictionary<int, string> columnName = new Dictionary<int, string>();     //字段名 
                    for (int j = 0; j < dataTable[0].ItemArray.Count(); j++)
                    {
                        if (dataTable[0].ItemArray[j].ToString() == "") continue;
                        columnName.Add(j, dataTable[0].ItemArray[j].ToString());
                    }

                    int i = 0;

                    foreach (var row in dataTable)
                    {
                        i++;
                        if (i == 1) continue;
                        if (row.ItemArray[1].ToString() == "") continue;

                        string firCatName = row.ItemArray[1].ToString();
                        string secCatName = row.ItemArray[2].ToString();
                        string baseCatName = row.ItemArray[3].ToString();

                        #region 判断是否已存在对应类目基类,不存在则添加

                        BsonDocument firstCat = categoryList.Where(t => t.Int("nodePid") == 0 && t.String("name") == firCatName).FirstOrDefault();

                        if (firstCat == null)   //不存在,这创建1级类目
                        {
                            result = dataOp.Insert("MatCategory", new BsonDocument().Add("name", firCatName).Add("nodePid", "0"));
                            if (result.Status == Status.Failed) throw new Exception(result.Message);

                            firstCat = result.BsonInfo;
                            categoryList.Add(firstCat);
                        }

                        BsonDocument secondCat = categoryList.Where(t => t.Int("nodePid") == firstCat.Int("categoryId") && t.String("name") == secCatName).FirstOrDefault();

                        if (secondCat == null)   //不存在,这创建2级类目
                        {
                            result = dataOp.Insert("MatCategory", new BsonDocument().Add("name", secCatName).Add("nodePid", firstCat.Int("categoryId")));
                            if (result.Status == Status.Failed) throw new Exception(result.Message);

                            secondCat = result.BsonInfo;
                            categoryList.Add(secondCat);
                        }

                        BsonDocument baseCat = baseCatList.Where(t => t.Int("categoryId") == secondCat.Int("categoryId") && t.String("name") == baseCatName).FirstOrDefault();

                        if (baseCat == null) //不存在,这创建基类
                        {
                            result = dataOp.Insert("MatBaseCat", new BsonDocument().Add("name", baseCatName).Add("categoryId", secondCat.Int("categoryId")));
                            if (result.Status == Status.Failed) throw new Exception(result.Message);

                            baseCat = result.BsonInfo;
                            baseCatList.Add(baseCat);
                        }

                        #endregion

                        #region 添加材料信息
                        BsonDocument matInfo = new BsonDocument();

                        for (int j = 0; j < row.ItemArray.Count(); j++)
                        {
                            if (j < 4) continue;

                            if (columnName.ContainsKey(j))
                            {
                                matInfo.Add(columnName[j], row.ItemArray[j].ToString());
                            }
                        }

                        matInfo.Add("baseCatId", baseCat.Int("baseCatId"));
                        matInfo.Add("材料来源", row.ItemArray[0].ToString());

                        result = dataOp.Insert("Material", matInfo);

                        #endregion


                    }
                    #endregion
                }

                #endregion
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
                if (cmd != null && dataList != null)
                {
                    cmd.Dispose();
                    dataList.Dispose();
                }
            }

            if (result.Status == Status.Successful) Response.Write("保存成功!!!!");
            else Response.Write(result.Message);
        }

        public void ImportMatFileToDatabase()
        {
            InvokeResult result = new InvokeResult();

            SqlConnection myCon = null;
            SqlCommand myCom = null;
            SqlDataReader dr = null;
            SqlDataAdapter adapter = null;

            try
            {
                #region 获取旧的文档数据
                Dictionary<string, string> clientConStr = new Dictionary<string, string>();
                clientConStr.Add("旭辉", "mongodb://sa:dba@192.168.1.134/XHTEST");
                clientConStr.Add("三盛", "mongodb://sa:dba@192.168.1.134/SS");
                clientConStr.Add("弘扬", "mongodb://sa:dba@192.168.1.134/ZHHY");
                clientConStr.Add("投资", "mongodb://sa:dba@192.168.1.134/ZHTZ");
                clientConStr.Add("金地", "Data Source=192.168.1.134;User ID=sa;Password=dba;Initial Catalog=JD;");
                clientConStr.Add("方圆", "Data Source=192.168.1.134;User ID=sa;Password=dba;Initial Catalog=FY;");

                List<BsonDocument> oldFileRelList = new List<BsonDocument>();
                List<BsonDocument> oldFileList = new List<BsonDocument>();
                List<BsonDocument> oldMatFileList = new List<BsonDocument>();

                foreach (var tempConStr in clientConStr)
                {
                    bool isA2 = (tempConStr.Key == "金地" || tempConStr.Key == "方圆") ? true : false;

                    if (isA2)
                    {
                        #region 读取A2数据库中的材料文档

                        myCon = new SqlConnection(tempConStr.Value);
                        myCon.Open();

                        DataSet ds = new DataSet();

                        adapter = new SqlDataAdapter("select * from dbo.MaterialDoc", myCon);

                        adapter.Fill(ds);

                        var dataTable = (from m in ds.Tables[0].AsEnumerable() select m).ToList();

                        foreach (var temp in dataTable)
                        {
                            BsonDocument bson = new BsonDocument();

                            bson.Add("name", temp["name"].ToString());
                            bson.Add("ext", temp["ext"].ToString());
                            bson.Add("localPath", temp["localPath"].ToString());
                            bson.Add("guid", temp["guid"].ToString());
                            bson.Add("size", temp["size"].ToString());
                            bson.Add("thumbPicPath", temp["thumbPicPath"].ToString());
                            bson.Add("coverStatus", temp["coverStatus"].ToString());
                            bson.Add("_Cliect", tempConStr.Key);

                            oldMatFileList.Add(bson);
                        }

                        #endregion
                    }
                    else
                    {
                        #region 读取A2.5数据库中的材料文档
                        dataOp.SetOperationDataBase(tempConStr.Value);

                        string tbName = "XH_Material_Material";

                        if (tempConStr.Key == "三盛") tbName = "Material_Material";

                        List<BsonDocument> tempFileRelList = dataOp.FindAllByQuery("FileRelation", Query.EQ("tableName", tbName)).ToList();

                        List<BsonDocument> tempFileList = dataOp.FindAllByQuery("FileLibrary", Query.In("fileId", tempFileRelList.Select(t => t.GetValue("fileId")))).ToList();

                        foreach (var temp in tempFileRelList) temp.Add("_Cliect", tempConStr.Key);
                        foreach (var temp in tempFileList) temp.Add("_Cliect", tempConStr.Key);

                        oldFileRelList.AddRange(tempFileRelList);
                        oldFileList.AddRange(tempFileList);
                        #endregion
                    }
                }
                #endregion

                dataOp.SetOperationDataBase(SysAppConfig.DataBaseConnectionString);
                List<BsonDocument> matList = dataOp.FindAll("Material").ToList();   //所有材料

                #region 循环材料列表,构建文档数据
                foreach (var tempMat in matList)
                {
                    bool isA2 = (tempMat.String("客户来源") == "金地" || tempMat.String("客户来源") == "方圆") ? true : false;

                    #region 获取对应的旧文件记录
                    BsonDocument oldFileRel = new BsonDocument();
                    BsonDocument oldFile = new BsonDocument();

                    if (isA2)
                    {
                        oldFile = oldMatFileList.Where(t => t.String("_Cliect") == tempMat.String("客户来源") && t.Int("matId") == tempMat.Int("材料来源")).FirstOrDefault();
                    }
                    else
                    {
                        oldFileRel = oldFileRelList.Where(t => t.String("_Cliect") == tempMat.String("客户来源") && t.Int("keyValue") == tempMat.Int("材料来源")).FirstOrDefault();
                        oldFile = oldFileList.Where(t => t.String("_Cliect") == tempMat.String("客户来源") && t.Int("fileId") == oldFileRel.Int("fileId")).FirstOrDefault();
                    }
                    #endregion

                    #region 生成文件记录
                    BsonDocument file = new BsonDocument();

                    file.Add("fileObjId", "1");
                    file.Add("name", oldFile.String("name"));
                    file.Add("ext", oldFile.String("ext"));
                    file.Add("localPath", oldFile.String("localPath"));
                    file.Add("version", "1");
                    file.Add("guid", oldFile.String("guid"));
                    file.Add("size", oldFile.String("size"));

                    string tempThum = "";

                    if (oldFile.String("thumbPicPath").Split(new string[] { "thum" }, StringSplitOptions.RemoveEmptyEntries).Count() > 1)
                    {
                        tempThum = string.Format("/thum{0}", oldFile.String("thumbPicPath").Split(new string[] { "thum" }, StringSplitOptions.RemoveEmptyEntries)[1]);
                    }
                    else
                    {
                        tempThum = " /Content/images/Docutype/default_m.png";
                    }

                    file.Add("thumbPicPath", tempThum);

                    result = dataOp.Insert("FileLibrary", file);
                    if (result.Status == Status.Failed) throw new Exception(result.Message);
                    #endregion

                    #region 生成文件关联记录
                    BsonDocument fileRel = new BsonDocument();

                    fileRel.Add("fileId", result.BsonInfo.String("fileId"));
                    fileRel.Add("fileObjId", "1");
                    fileRel.Add("tableName", "Material");
                    fileRel.Add("keyName", "matId");
                    fileRel.Add("keyValue", tempMat.String("matId"));

                    if (isA2) fileRel.Add("isCover", oldFile.String("coverStatus") == "0" ? "" : "true");
                    else fileRel.Add("isCover", oldFileRel.String("isCover"));

                    fileRel.Add("version", "1");

                    result = dataOp.Insert("FileRelation", fileRel);
                    if (result.Status == Status.Failed) throw new Exception(result.Message);
                    #endregion
                }
                #endregion
            }
            catch (Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.Message;
            }
            finally
            {
                #region 关闭连接
                if (myCon != null)
                {
                    myCon.Close();
                }
                if (adapter != null)
                {
                    adapter.Dispose();
                }
                #endregion
            }

            if (result.Status == Status.Successful) Response.Write("保存成功!!!!");
            else Response.Write(result.Message);
        }


        /// <summary>
        /// 导出材料供应商
        /// </summary>
        public void ExportMatSupplierToExcel()
        {
            Dictionary<string, string> clientDic = new Dictionary<string, string>();
            clientDic.Add("旭辉", "mongodb://sa:dba@192.168.1.134/XHTEST");
            clientDic.Add("三盛", "mongodb://sa:dba@192.168.1.134/SS");
            clientDic.Add("中海弘扬", "mongodb://sa:dba@192.168.1.134/ZHHY");
            clientDic.Add("中海投资", "mongodb://sa:dba@192.168.1.134/ZHTZ");

            XlsDocument xlsDoc = new XlsDocument();

            foreach (var tempClient in clientDic)
            {
                #region 初始化定义
                string materialName = "XH_Material_Material";          //材料表名
                string baseCatName = "XH_Material_BaseCat";         //基类表名
                string categoryName = "XH_Material_Category";       //类目表名
                string supplierName = "XH_Material_Supplier";          //材料供应商表名
                string supplierRelName = "XH_Material_BaseCatSupplier";      //供应商与基类关联表名

                if (tempClient.Key == "三盛")
                {
                    materialName = "Material_Material";
                    baseCatName = "Material_BaseCat";
                    categoryName = "Material_Category";
                    supplierName = "Material_Supplier";
                    supplierRelName = "XH_Material_BaseCatSupplier";
                }
                #endregion

                #region 获取输出数据

                dataOp.SetOperationDataBase(tempClient.Value);

                List<BsonDocument> matList = dataOp.FindAll(materialName).ToList();         //所有材料

                List<BsonDocument> baseCatList = dataOp.FindAll(baseCatName).ToList();      //基类

                List<BsonDocument> categoryList = dataOp.FindAll(categoryName).ToList();    //类目

                List<BsonDocument> supplierList = dataOp.FindAll(supplierName).ToList();         //供应商

                List<BsonDocument> supplierRelList = dataOp.FindAll(supplierRelName).ToList();      //供应商关联
                #endregion

                #region 构建输出表格
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(tempClient.Key);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                #region 输出标题
                int j = 1;

                cells.Add(j, 1, "供应商Id");
                cells.Add(j, 2, "供应商名称");
                cells.Add(j, 3, "所属部品子类");
                cells.Add(j, 4, "公司地址");
                cells.Add(j, 5, "联系人");
                cells.Add(j, 6, "电话");
                cells.Add(j, 7, "材料Id");
                cells.Add(j, 8, "材料名称");
                #endregion

                #region 输出指标
                foreach (var tempSupplier in supplierList)
                {
                    j++;

                    #region 供应商信息
                    cells.Add(j, 1, tempSupplier.String("supplierId"));
                    cells.Add(j, 2, tempSupplier.String("name"));
                    cells.Add(j, 4, tempSupplier.String("Address"));
                    cells.Add(j, 5, tempSupplier.String("LinkMan"));
                    cells.Add(j, 6, tempSupplier.String("TEL"));
                    #endregion

                    #region 所属类目基类信息
                    List<BsonDocument> tempRelList = supplierRelList.Where(t => t.Int("supplierId") == tempSupplier.Int("supplierId")).ToList();

                    string baseStr = "";

                    foreach (var tempRel in tempRelList)
                    {
                        BsonDocument baseCat = baseCatList.Where(t => t.Int("baseCatId") == tempRel.Int("baseCatId")).FirstOrDefault();
                        BsonDocument secondCat = categoryList.Where(t => t.Int("categoryId") == baseCat.Int("categoryId")).FirstOrDefault();
                        BsonDocument firstCat = categoryList.Where(t => t.Int("categoryId") == secondCat.Int("nodePid")).FirstOrDefault();

                        baseStr += string.Format("{0}>>{1}>>{2};", firstCat.String("name"), secondCat.String("name"), baseCat.String("name"));
                    }

                    cells.Add(j, 3, baseStr);

                    #endregion

                    #region 拥有材料信息
                    List<BsonDocument> tempMatList = matList.Where(t => t.Int("supplierId") == tempSupplier.Int("supplierId")).ToList();

                    int i = 0;

                    foreach (var tempMat in tempMatList)
                    {
                        if (i != 0) j++;

                        cells.Add(j, 7, tempMat.String("matId"));
                        cells.Add(j, 8, tempMat.String("name"));

                        i++;
                    }
                    #endregion
                }
                #endregion

                #endregion
            }

            #region 输出表格
            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("A2.5材料供应商", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
            #endregion
        }


        #endregion

        #region 公共私有函数
        /// <summary>
        ///  将InvokeResult转成PageJson对象
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        [NonAction]
        private PageJson ConvertToPageJson(InvokeResult result)
        {
            PageJson json = new PageJson();
            json.Success = result.Status == Status.Successful;
            json.Message = result.Message;

            return json;
        }
        /// <summary>
        ///  将InvokeResult转成PageJson对象
        /// </summary>
        /// <param name="formValueString"></param>
        /// <returns></returns>
        [NonAction]
        private Int32[] GetSelectElementIdArray(string formValueString)
        {
            var idList = new List<Int32>();

            if (!string.IsNullOrEmpty(formValueString))
            {
                var valuesArray = formValueString.Split(",".ToCharArray());
                foreach (var valueString in valuesArray)
                {
                    if (string.IsNullOrEmpty(valueString)) continue;
                    idList.Add(Int32.Parse(valueString));
                }
            }

            return idList.ToArray();
        }
        #endregion
        /// <summary>
        /// 将html表格导出成为Excel
        /// </summary>
        /// <param name="FileType"></param>
        /// <param name="FileName"></param>
        /// <param name="ExcelContent"></param>
        public void ExportToExcel(string FileType, string FileName, string ExcelContent)
        {
            System.Web.HttpContext.Current.Response.Charset = "UTF-8";
            System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.UTF8;
            System.Web.HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(FileName, System.Text.Encoding.UTF8).ToString());
            System.Web.HttpContext.Current.Response.ContentType = FileType;
            System.IO.StringWriter tw = new System.IO.StringWriter();
            System.Web.HttpContext.Current.Response.Output.Write(ExcelContent.ToString());
            System.Web.HttpContext.Current.Response.Flush();
            System.Web.HttpContext.Current.Response.End();
        }
        /// <summary>
        /// 中海投资工作函的PDF导出
        /// </summary>
        /// <param name="path"></param>
        /// <param name="name"></param>
        [NonAction]
        public void DownloadFileZHTZ(string path, string name)
        {
            System.IO.FileInfo file = new System.IO.FileInfo(path);
            if (HttpContext.Request.Browser.Type.IndexOf("Firefox") != -1)//火狐浏览器特殊处理
            {
                name = "=?UTF-8?B?" + Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(name)) + "?=";
            }
            else
            {
                name = HttpUtility.UrlEncode(name, System.Text.Encoding.UTF8).Replace("+", "%20");
            }
            Response.Clear();
            Response.ClearHeaders();
            Response.Buffer = false;
            Response.AddHeader("Content-Disposition", "attachment;filename=" + name);
            Response.AddHeader("Content-Length", file.Length.ToString());
            Response.ContentType = "application/pdf";
            Response.WriteFile(path);
            Response.Flush();
            Response.End();
        }

        #region 删除前核对是否已经被使用过
        /// <summary>
        /// 删除前判断是否被引用过
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="queryStr">查询语句</param>
        /// <param name="relTbName">关联表的表名 格式 表名_表名_....（以_下划线隔开）</param>
        /// <param name="relTbField">关联表的字段查询   格式 字段_字段_字段_....（以_下划线隔开）</param>
        /// <returns></returns>
        public JsonResult CheckPropertyIsUsed()
        {
            PageJson json = new PageJson();

            #region 获取参数并处理
            string tbName = PageReq.GetForm("tbName");//表名
            string queryStr = PageReq.GetForm("queryStr");//查询语句
            string relTbName = PageReq.GetForm("relTbName");//关联表的表名 格式 表名_表名_....（以_下划线隔开）
            string relTbField = PageReq.GetForm("relTbField");//关联表的字段查询   格式 字段_字段_字段_....（以_下划线隔开）
            List<string> relTbNameList = relTbName.Split('_').ToList();
            List<string> relTbFieldList = relTbField.Split('_').ToList();
            if (string.IsNullOrEmpty(tbName) || string.IsNullOrEmpty(queryStr) || relTbNameList.Count() != relTbFieldList.Count())
            {
                json.Success = false;
                json.Message = "传入参数有误,请联系管理员!";
            }
            #endregion

            TableRule table = new TableRule(tbName);
            string key = table.GetPrimaryKey();
            BsonDocument entity = dataOp.FindOneByQuery(tbName, TypeConvert.NativeQueryToQuery(queryStr));
            if (entity == null)
            {
                json.Message = "实体已经被删除或不存在,请刷新后重试!";
                json.Success = false;
                return Json(json);
            }
            string dataId = entity.String(key);
            int tableIndex = 0;//关联表和关联字段相对应
            int allCount = 0;//记录被引用的次数
            foreach (var tempRel in relTbNameList)
            {

                if (tempRel == "")
                {
                    continue;
                }
                List<BsonDocument> relData = dataOp.FindAllByQuery(tempRel, Query.EQ(relTbFieldList[tableIndex], dataId)).ToList();
                allCount += relData.Count();
                tableIndex++;


            }
            if (allCount > 0)
            {
                json.Success = false;
                json.Message = "此类型已被" + allCount + "处引用";
            }
            else
            {
                json.Success = true;
                json.Message = "此类型没被引用";
            }

            return Json(json);
        }
        #endregion

        /// <summary>
        /// 分期工程添加工程下的权限用户
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult ProjEngUserRelInsert()
        {
            InvokeResult result = new InvokeResult();
            string tbName = PageReq.GetForm("tbName");//表名
            string ids = PageReq.GetForm("ids");//主键值
            int projEngId = PageReq.GetFormInt("projEngId");//工程ID
            int projId = PageReq.GetFormInt("projId");
            int engId = PageReq.GetFormInt("engId");
            TableRule table = new TableRule(tbName);
            string primaryKey = table.GetPrimaryKey();//获得主键名
            string[] idArray = ids.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            #region 删除旧的全部关联
            result = dataOp.Delete(tbName, "db." + tbName + ".distinct('_id',{'projEngId':'" + projEngId.ToString() + "'})");
            #endregion

            if (idArray.Length > 0 && result.Status == Status.Successful)
            {
                foreach (var item in idArray)
                {
                    BsonDocument doc = new BsonDocument();
                    foreach (var entity in table.ColumnRules.Where(t => t.IsPrimary == false && t.Name != "projEngId").Take(1)) //用户Id
                    {
                        doc.Add(entity.Name, item);
                    }
                    doc.Add("projEngId", projEngId.ToString());
                    doc.Add("projId", projId.ToString());
                    doc.Add("engId", engId.ToString());
                    result = dataOp.Insert(tbName, doc);
                }
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #region 万科日志统计
        /// <summary>
        /// 万科日志统计
        /// </summary>
        public void ExportWKBrowseRetLogToExcel(string startDate, string endDate)
        {
            string conn = @"Data Source=192.168.1.213;User ID=sa;Password=dba;Initial Catalog=wkTest;";
            DataSet dataset = null;
            SqlDataAdapter dataadapter = null;
            SqlConnection connection = null;

            #region 获取对应的业务组织架构Id和名字
            List<BsonDocument> busOrgList = new List<BsonDocument>();

            try
            {
                dataset = new DataSet();
                connection = new SqlConnection(conn);
                string sql = "select businessOrgId,name from BusinessOrganization";
                dataadapter = new SqlDataAdapter(sql, connection);
                dataadapter.Fill(dataset, "BusinessOrganization");

                foreach (DataRow row in dataset.Tables[0].Rows)
                {
                    busOrgList.Add(new BsonDocument()
                        .Add("id", row["businessOrgId"].ToString())
                        .Add("name", row["name"].ToString()));
                }
            }
            catch (Exception ex)
            {
            }
            finally
            {
                connection.Close();
            }
            #endregion

            #region 获取所有成果信息

            List<BsonDocument> retList = new List<BsonDocument>();
            try
            {
                dataset = new DataSet();
                connection = new SqlConnection(conn);
                string sql = "select retId,businessOrgId,name from MetadataResult";
                dataadapter = new SqlDataAdapter(sql, connection);
                dataadapter.Fill(dataset, "MetadataResult");

                foreach (DataRow row in dataset.Tables[0].Rows)
                {
                    retList.Add(new BsonDocument()
                        .Add("id", row["retId"].ToString())
                        .Add("busOrgId", row["businessOrgId"].ToString())
                        .Add("name", row["name"].ToString()));
                }
            }
            catch (Exception ex)
            {
            }
            finally
            {
                connection.Close();
            }

            #endregion

            string conStr = "mongodb://sa:dba@192.168.1.134/WKPIMLOG";

            dataOp.SetOperationDataBase(conStr);

            #region 获取所有日志信息
            List<BsonDocument> logList = dataOp.FindAllByQuery("SystemLog", Query.And(
               Query.Matches("CurrentUrl", "MetadataResultView"),
               Query.GTE("RequestDateTime", DateTime.Parse(startDate)),
               Query.LTE("RequestDateTime", DateTime.Parse(endDate))
               )).ToList();
            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            #region 构建输出表格
            Worksheet sheet = xlsDoc.Workbook.Worksheets.Add("浏览日志");

            // 开始填充数据到单元格
            Cells cells = sheet.Cells;

            #region 输出标题
            int j = 1;

            cells.Add(j, 1, "用户");
            cells.Add(j, 2, "时间");
            cells.Add(j, 3, "地址");
            cells.Add(j, 4, "成果Id");
            cells.Add(j, 5, "公司Id");
            #endregion

            #region 输出指标
            foreach (var tempLog in logList)
            {
                j++;

                NameValueCollection nvcData = TypeConvert.ParamStrToNameValue(tempLog.String("QueryStringParam"));

                string retId = nvcData.AllKeys.Contains("retId") ? nvcData["retId"] : "0";
                BsonDocument ret = retList.Where(t => t.String("id") == retId).FirstOrDefault();

                //nvcData.AllKeys.Contains("partialBusOrgId") ? nvcData["partialBusOrgId"] : "0";
                string busOrgId = ret != null ? ret.String("busOrgId") : "0";
                BsonDocument busOrg = busOrgList.Where(t => t.String("id") == busOrgId).FirstOrDefault();

                cells.Add(j, 1, tempLog.String("UserName"));
                cells.Add(j, 2, tempLog.Date("RequestDateTime").ToString("yyyy-MM-dd"));
                cells.Add(j, 3, tempLog.String("CurrentUrl"));
                cells.Add(j, 4, ret != null ? ret.String("name") : retId);
                cells.Add(j, 5, busOrg != null ? busOrg.String("name") : busOrgId);

            }
            #endregion

            #endregion

            #region 输出表格
            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("万科浏览日志", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
            #endregion
        }
        #endregion

        /// <summary>
        /// 获取简单表的Json列表（有关联表条件）
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="ps">每页条数(默认20,-1不翻页)</param>
        /// <param name="cu">当前页</param>
        /// <param name="qu">查询语句(原生查询)</param>
        /// <param name="of">排序字段</param>
        /// <param name="ot">排序类型(空正序,desc倒序)</param>
        ///  <param name="relName">关联限定表名称</param>
        ///  <param name="relQu">关联限定表查询语句(原生查询)，个数需与表名一样且对称</param>
        /// <returns></returns>
        public ActionResult GetMulTableJson(string tbName, int? ps, int? cu, string qu, string of, string ot, string[] relName, string[] relQu)
        {
            int pageSize = (ps != null && ps.Value != 0) ? ps.Value : 20;
            int current = (cu != null && cu.Value != 0) ? cu.Value : 1;

            string query = qu != null ? qu : "";
            string orderField = of != null ? of : "";
            string orderType = ot != null ? ot : "";
            TableRule tbRule = new TableRule(tbName);
            string primaryKey = tbRule.GetPrimaryKey();

            var queryComp = TypeConvert.NativeQueryToQuery(query);

            List<BsonDocument> allDocList = queryComp != null ? dataOp.FindAllByQuery(tbName, queryComp).ToList() : dataOp.FindAll(tbName).ToList();
            if (relName != null && relQu != null && relName.Count() == relQu.Count())
            {
                for (int i = 0; i < relQu.Count(); i++)
                {
                    string tempRelQuery = relQu[i];
                    string tempRelName = relName[i];
                    var tempQuery = TypeConvert.NativeQueryToQuery(tempRelQuery);
                    List<BsonDocument> tempDocList = tempQuery != null ? dataOp.FindAllByQuery(tempRelName, tempQuery).ToList() : dataOp.FindAll(tempRelName).ToList();
                    if (tempDocList.Count() > 0)
                    {
                        allDocList = allDocList.Where(x => tempDocList.Select(s => s.String(primaryKey)).Distinct().Contains(x.String(primaryKey))).ToList();
                    }
                    else
                    {
                        allDocList = new List<BsonDocument>();
                    }
                }
            }

            int allCount = allDocList.Count();

            if (orderField != null && orderField != "")
            {
                if (orderType != null && orderType == "desc")
                {
                    allDocList = allDocList.OrderByDescending(t => t.String(orderField)).ToList();
                }
                else
                {
                    allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                }
            }

            List<Hashtable> retList = new List<Hashtable>();

            if (pageSize != -1)
            {
                allDocList = allDocList.Skip((current - 1) * pageSize).Take(pageSize).ToList();
            }

            foreach (var tempDoc in allDocList)
            {
                tempDoc.Add("allCount", allCount.ToString());
                tempDoc.Remove("_id");

                retList.Add(tempDoc.ToHashtable());
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }

        #region 乔鑫项目材料,构造,设计单位统计

        public void ExportQXDataStatisticsToExcel()
        {
            #region 数据获取
            //dataOp.SetOperationDataBase("mongodb://sa:dba@192.168.1.230/QXTESTNEW");

            List<BsonValue> userIdList = new List<BsonValue>();
            List<BsonValue> projIdList = new List<BsonValue>();

            //项目设计资料
            List<BsonDocument> packageList = dataOp.FindAll("ProjDocPackage").ToList();         //项目资料包

            projIdList.AddRange(packageList.Where(t => t.ContainsColumn("projId")).Select(t => t.GetValue("projId")));
            userIdList.AddRange(packageList.Select(t => t.GetValue("createUserId")));

            List<BsonDocument> fileRelList = dataOp.FindAllByQuery("FileRelation", Query.And(    //包内文档关联
                Query.EQ("tableName", "ProjDocPackage"),
                Query.EQ("fileObjId", "81")
                )).ToList();

            //项目设计单位
            List<BsonDocument> projSupplierList = dataOp.FindAll("XH_DesignManage_ProjectSupplier").ToList();

            projIdList.AddRange(projSupplierList.Where(t => t.ContainsColumn("projId")).Select(t => t.GetValue("projId")));
            userIdList.AddRange(projSupplierList.Select(t => t.GetValue("createUserId")));

            //项目材料清单
            List<BsonDocument> projMaterialList = dataOp.FindAll("Material_List").ToList();

            projIdList.AddRange(projMaterialList.Where(t => t.ContainsColumn("projId")).Select(t => t.GetValue("projId")));
            userIdList.AddRange(projMaterialList.Select(t => t.GetValue("createUserId")));

            List<BsonDocument> projMatRelList = dataOp.FindAll("Material_ListRelation").ToList();

            //材料库
            List<BsonDocument> materialList = dataOp.FindAll("XH_Material_Material").ToList();

            userIdList.AddRange(materialList.Select(t => t.GetValue("createUserId")));

            //设计单位
            List<BsonDocument> supplierList = dataOp.FindAll("XH_Supplier_Supplier").ToList();

            userIdList.AddRange(supplierList.Select(t => t.GetValue("createUserId")));

            //构造库
            List<BsonDocument> resultList = dataOp.FindAllByQuery("StandardResult_StandardResult", Query.EQ("libId", "5")).ToList();

            userIdList.AddRange(supplierList.Select(t => t.GetValue("createUserId")));

            //用户
            userIdList = userIdList.Distinct().ToList();

            List<BsonDocument> userList = dataOp.FindAllByQuery("SysUser", Query.In("userId", userIdList)).ToList();                    //所有用到的用户列表
            List<BsonDocument> userPostList = dataOp.FindAllByQuery("UserOrgPost", Query.In("userId", userIdList)).ToList();            //用户岗位关联表
            List<BsonValue> postIdList = userPostList.Select(t => t.GetValue("postId")).Distinct().ToList();                            //岗位Id列表
            List<BsonDocument> postList = dataOp.FindAllByQuery("OrgPost", Query.In("postId", postIdList)).ToList();                    //岗位列表
            List<BsonValue> orgIdList = postList.Select(t => t.GetValue("orgId")).Distinct().ToList();                                  //部门Id列表
            List<BsonDocument> orgList = dataOp.FindAllByQuery("Organization", Query.In("orgId", orgIdList)).ToList();                  //部门列表

            //项目
            projIdList = projIdList.Distinct().ToList();

            List<BsonDocument> projList = dataOp.FindAllByQuery("XH_DesignManage_Project", Query.In("projId", projIdList)).ToList();

            #endregion

            XlsDocument xlsDoc = new XlsDocument();

            List<string> sheetNameList = new List<string>() { "项目设计资料", "项目设计单位", "项目材料清单", "材料库", "构造库", "设计单位" };

            #region 构建输出表格
            foreach (var sheetName in sheetNameList)
            {
                Worksheet sheet = xlsDoc.Workbook.Worksheets.Add(sheetName);

                // 开始填充数据到单元格
                Cells cells = sheet.Cells;

                if (sheetName == "项目设计资料")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "项目");
                    cells.Add(j, 2, "创建用户");
                    cells.Add(j, 3, "用户部门");
                    cells.Add(j, 4, "创建时间");
                    cells.Add(j, 5, "资料包名称");
                    cells.Add(j, 6, "拥有文档数");
                    cells.Add(j, 7, "对应url");
                    #endregion

                    #region 输出指标
                    foreach (var tempItem in packageList)
                    {
                        j++;

                        BsonDocument tempUser = userList.Where(t => t.Int("userId") == tempItem.Int("createUserId")).FirstOrDefault();
                        BsonDocument tempPostRel = userPostList.Where(t => t.Int("userId") == tempUser.Int("userId")).FirstOrDefault();
                        BsonDocument tempPost = postList.Where(t => t.Int("postId") == tempPostRel.Int("postId")).FirstOrDefault();
                        BsonDocument tempOrg = orgList.Where(t => t.Int("orgId") == tempPost.Int("orgId")).FirstOrDefault();

                        BsonDocument tempProj = projList.Where(t => t.Int("projId") == tempItem.Int("projId")).FirstOrDefault();
                        List<BsonDocument> tempRelList = fileRelList.Where(t => t.Int("keyValue") == tempItem.Int("packageId")).ToList();

                        cells.Add(j, 1, tempProj.String("name"));
                        cells.Add(j, 2, tempUser.String("name"));
                        cells.Add(j, 3, tempOrg.String("name"));
                        cells.Add(j, 4, tempItem.Date("createDate").ToString("yyyy-MM-dd"));
                        cells.Add(j, 5, tempItem.String("name"));
                        cells.Add(j, 6, tempRelList.Count);
                        cells.Add(j, 7, string.Format("/ProjectDocLibrary/DocPackageDetail/?engId={0}&packageId={1}&downRight=True", tempProj.Int("engId"), tempItem.Int("packageId")));
                    }
                    #endregion
                }

                if (sheetName == "项目设计单位")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "项目");
                    cells.Add(j, 2, "创建用户");
                    cells.Add(j, 3, "用户部门");
                    cells.Add(j, 4, "创建时间");
                    cells.Add(j, 5, "设计单位名称");
                    cells.Add(j, 6, "对应url");
                    #endregion

                    #region 输出指标
                    foreach (var tempItem in projSupplierList)
                    {
                        j++;

                        BsonDocument tempUser = userList.Where(t => t.Int("userId") == tempItem.Int("createUserId")).FirstOrDefault();
                        BsonDocument tempPostRel = userPostList.Where(t => t.Int("userId") == tempUser.Int("userId")).FirstOrDefault();
                        BsonDocument tempPost = postList.Where(t => t.Int("postId") == tempPostRel.Int("postId")).FirstOrDefault();
                        BsonDocument tempOrg = orgList.Where(t => t.Int("orgId") == tempPost.Int("orgId")).FirstOrDefault();

                        BsonDocument tempProj = projList.Where(t => t.Int("projId") == tempItem.Int("projId")).FirstOrDefault();
                        BsonDocument tempSupplier = supplierList.Where(t => t.Int("supplierId") == tempItem.Int("supplierId")).FirstOrDefault();

                        cells.Add(j, 1, tempProj.String("name"));
                        cells.Add(j, 2, tempUser.String("name"));
                        cells.Add(j, 3, tempOrg.String("name"));
                        cells.Add(j, 4, tempItem.Date("createDate").ToString("yyyy-MM-dd"));
                        cells.Add(j, 5, tempSupplier.String("name"));
                        cells.Add(j, 6, string.Format("/DesignManage/ProjectSuppliers?projId={0}", tempProj.Int("projId")));
                    }
                    #endregion
                }

                if (sheetName == "项目材料清单")
                {
                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "项目");
                    cells.Add(j, 2, "创建用户");
                    cells.Add(j, 3, "用户部门");
                    cells.Add(j, 4, "创建时间");
                    cells.Add(j, 5, "名称");
                    cells.Add(j, 6, "拥有材料数");
                    cells.Add(j, 7, "对应url");
                    #endregion

                    #region 输出指标
                    foreach (var tempItem in projMaterialList)
                    {
                        j++;

                        BsonDocument tempUser = userList.Where(t => t.Int("userId") == tempItem.Int("createUserId")).FirstOrDefault();
                        BsonDocument tempPostRel = userPostList.Where(t => t.Int("userId") == tempUser.Int("userId")).FirstOrDefault();
                        BsonDocument tempPost = postList.Where(t => t.Int("postId") == tempPostRel.Int("postId")).FirstOrDefault();
                        BsonDocument tempOrg = orgList.Where(t => t.Int("orgId") == tempPost.Int("orgId")).FirstOrDefault();

                        BsonDocument tempProj = projList.Where(t => t.Int("projId") == tempItem.Int("projId")).FirstOrDefault();
                        List<BsonDocument> tempRelList = projMatRelList.Where(t => t.Int("listId") == tempItem.Int("listId")).ToList();

                        cells.Add(j, 1, tempProj.String("name"));
                        cells.Add(j, 2, tempUser.String("name"));
                        cells.Add(j, 3, tempOrg.String("name"));
                        cells.Add(j, 4, tempItem.Date("createDate").ToString("yyyy-MM-dd"));
                        cells.Add(j, 5, tempItem.String("name"));
                        cells.Add(j, 6, tempRelList.Count);
                        cells.Add(j, 7, string.Format("/DesignManage/ProjMaterialShow?projId={0}", tempProj.Int("projId")));
                    }
                    #endregion
                }

                if (sheetName == "材料库" || sheetName == "构造库" || sheetName == "设计单位")
                {
                    List<BsonDocument> itemList = new List<BsonDocument>();

                    switch (sheetName)
                    {
                        case "材料库":
                            itemList = materialList;
                            break;
                        case "构造库":
                            itemList = resultList;
                            break;
                        case "设计单位":
                            itemList = supplierList;
                            break;

                    }

                    #region 输出标题
                    int j = 1;

                    cells.Add(j, 1, "创建用户");
                    cells.Add(j, 2, "用户部门");
                    cells.Add(j, 3, "创建时间");
                    cells.Add(j, 4, "名称");
                    cells.Add(j, 5, "对应url");
                    #endregion

                    #region 输出指标
                    foreach (var tempItem in itemList)
                    {
                        j++;

                        string url = "";
                        switch (sheetName)
                        {
                            case "材料库":
                                url = "/Material/MaterialShow?matId=" + tempItem.Int("matId");
                                break;
                            case "构造库":
                                url = "/StandardResult/PEMView?retId=" + tempItem.Int("retId");
                                break;
                            case "设计单位":
                                url = "/Supplier/Designsuppliershow?supplierId=" + tempItem.Int("supplierId");
                                break;
                        }

                        BsonDocument tempUser = userList.Where(t => t.Int("userId") == tempItem.Int("createUserId")).FirstOrDefault();
                        BsonDocument tempPostRel = userPostList.Where(t => t.Int("userId") == tempUser.Int("userId")).FirstOrDefault();
                        BsonDocument tempPost = postList.Where(t => t.Int("postId") == tempPostRel.Int("postId")).FirstOrDefault();
                        BsonDocument tempOrg = orgList.Where(t => t.Int("orgId") == tempPost.Int("orgId")).FirstOrDefault();

                        cells.Add(j, 1, tempUser.String("name"));
                        cells.Add(j, 2, tempOrg.String("name"));
                        cells.Add(j, 3, tempItem.Date("createDate").ToString("yyyy-MM-dd"));
                        cells.Add(j, 4, tempItem.String("name"));
                        cells.Add(j, 5, url);

                    }
                    #endregion
                }
            }

            #endregion

            #region 输出表格
            using (MemoryStream ms = new MemoryStream())
            {
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.ContentEncoding = Encoding.UTF8;
                context.Response.Charset = "";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode("侨鑫数据统计", Encoding.UTF8) + ".xls");
                xlsDoc.Save(ms);
                ms.Flush();
                ms.Position = 0;
                context.Response.BinaryWrite(ms.GetBuffer());
                context.Response.End();
            }
            #endregion
        }

        #endregion

        #region 文件或文件夹移动
        /// <summary>
        /// 文件或文件夹移动
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public ActionResult FileMove(FormCollection form)
        {
            const string fileRelTb = "FileRelation";
            const string fileStructTb = "FileStructure";
            const string fileTb = "FileLibrary";

            InvokeResult result = new InvokeResult() { Status = Status.Successful };
            //fileRelId:要移动的文件或目录(0：文件的fileRelId，1：目录的structId)
            var fileRelId = PageReq.GetForm("id");
            int moveType = PageReq.GetFormInt("moveType"); // 0:移动单个文件 1：移动整个文件夹(包括子文件夹)
            string[] filters = new string[] { "id", "moveType" };
            //如果更新数据包含以下字段，则这些字段都不能为空
            string[] checkField = new string[] { "tableName", "keyName", "keyValue" };
            BsonDocument updateBson = new BsonDocument();

            foreach (var key in form.AllKeys.Except(filters))
            {
                updateBson.Add(key, form[key].ToString());
            }

            #region 数据验证

            if (updateBson.IsNullOrEmpty())
            {
                result.Status = Status.Successful;
                result.Message = "更新字段全空，不做任何处理";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            if (checkField.Any(i => updateBson.Names.Contains(i) && string.IsNullOrEmpty(updateBson.Text(i))))
            {
                result.Status = Status.Failed;
                result.Message = "更新字段不能为空";
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }

            //FileRelation只存储最外层文件夹，因此里层文件夹不做判断
            #endregion

            if (moveType == 0)
            {
                var curFileRel = dataOp.FindOneByQuery(fileRelTb, Query.EQ("fileRelId", fileRelId));
                if (curFileRel.IsNullOrEmpty())
                {
                    result.Status = Status.Failed;
                    result.Message = "找不到当前文件关联:" + fileRelId;
                    return Json(TypeConvert.InvokeResultToPageJson(result));
                }
                var curFile = dataOp.FindOneByQuery(fileTb, Query.EQ("fileId", curFileRel.Text("fileId")));
                if (curFile.IsNullOrEmpty())
                {
                    result.Status = Status.Failed;
                    result.Message = "找不到当前文件:" + curFileRel.Text("fileId");
                    return Json(TypeConvert.InvokeResultToPageJson(result));
                }
                result = dataOp.Update(fileRelTb, Query.EQ("fileRelId", fileRelId), updateBson);
                if (result.Status == Status.Successful)
                {
                    result = dataOp.Update(fileTb, Query.EQ("fileId", curFile.Text("fileId")), new BsonDocument().Add("structId", ""));
                }
            }
            else if (moveType == 1)
            {
                var structObj = dataOp.FindOneByQuery(fileStructTb, Query.EQ("structId", fileRelId));
                //找出所有的目录层级
                var allStructs = dataOp.FindAllByQuery(fileStructTb,
                        Query.Matches("nodeKey", "^" + Regex.Escape(structObj.Text("nodeKey")) + ".*")
                    ).ToList();
                //因为旧数据的关系有些没有关联的目录可能nodeKey相同，因此添加以下过滤
                string[] pids = new string[] { structObj.Text("structId") };
                List<BsonDocument> newAllStructs = new List<BsonDocument>();

                while (pids.Count() > 0)
                {
                    var tempStructs = allStructs.Where(i => pids.Contains(i.Text("structId"))).ToList();
                    if (tempStructs.Count() > 0)
                    {
                        newAllStructs.AddRange(tempStructs);
                    }
                    pids = allStructs.Where(i => pids.Contains(i.Text("nodePid"))).Select(i => i.Text("structId")).ToArray();
                }
                allStructs = newAllStructs;

                //所有目录下的文件
                var allFiles = dataOp.FindAllByQuery(fileTb,
                        Query.In("structId", allStructs.Select(i => (BsonValue)(i.Text("structId"))))
                    ).ToList();
                //以上文件以及文件夹对应的关联
                var allFileRels = dataOp.FindAllByQuery(fileRelTb,
                        Query.Or(
                            Query.In("structId", allStructs.Select(i => (BsonValue)(i.Text("structId")))),
                            Query.In("fileId", allFiles.Select(i => (BsonValue)(i.Text("fileId"))))
                        )
                    ).ToList();
                var query = Query.In("fileRelId", allFileRels.Select(i => (BsonValue)(i.Text("fileRelId"))));
                if (structObj.Int("nodePid") == 0)
                {
                    result = dataOp.Update(fileRelTb, query, updateBson);
                }
                else
                {
                    var keystr = structObj.Text("nodeKey").Split(new string[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                    if (keystr.Count() > 0)
                    {
                        var firstKey = keystr[0];
                        var topParent = dataOp.FindOneByQuery(fileStructTb, Query.EQ("nodeKey", firstKey));
                        if (topParent.IsNullOrEmpty())
                        {
                            result.Message = "查找顶层文件夹失败";
                            result.Status = Status.Failed;
                            return Json(TypeConvert.InvokeResultToPageJson(result));
                        }
                        else
                        {
                            var topFileRel = dataOp.FindOneByQuery(fileRelTb, Query.EQ("structId", topParent.Text("structId")));
                            if (topFileRel.IsNullOrEmpty())
                            {
                                result.Message = "顶层文件夹关联信息不存在";
                                result.Status = Status.Failed;
                                return Json(TypeConvert.InvokeResultToPageJson(result));
                            }
                            else
                            {

                                List<StorageData> datalist = new List<StorageData>();
                                foreach (var rel in allFileRels)
                                {
                                    StorageData data = new StorageData();
                                    data.Document = updateBson;
                                    data.Name = fileRelTb;
                                    data.Query = Query.EQ("fileRelId", rel.Text("fileRelId"));
                                    data.Type = StorageType.Update;
                                    datalist.Add(data);
                                }

                                var root = dataOp.FindOneByQuery(fileStructTb, Query.EQ("structId", "0"));

                                foreach (var struc in allStructs.OrderBy(i => i.Text("nodeKey")))
                                {
                                    StorageData data = new StorageData();
                                    var parentNode = new BsonDocument();
                                    var attrBson = new BsonDocument();
                                    if (struc.Int("structId") == structObj.Int("structId"))
                                    {
                                        parentNode = dataOp.FindOneByQuery(fileStructTb, Query.EQ("structId", "0"));
                                    }
                                    else
                                    {
                                        parentNode = allStructs.FirstOrDefault(i => i.Int("structId") == struc.Int("nodePid"));
                                        if (parentNode.IsNullOrEmpty())
                                        {
                                            continue;
                                        }
                                    }
                                    string nodeOrder = "";
                                    string nodeKey = "";
                                    attrBson.Set("nodePid", parentNode.IsNullOrEmpty() ? "0" : parentNode.Text("structId"));
                                    struc.Set("nodePid", parentNode.IsNullOrEmpty() ? "0" : parentNode.Text("structId"));
                                    attrBson.Set("nodeLevel", parentNode.IsNullOrEmpty() ? "1" : (parentNode.Int("nodeLevel") + 1).ToString());
                                    struc.Set("nodeLevel", parentNode.IsNullOrEmpty() ? "1" : (parentNode.Int("nodeLevel") + 1).ToString());
                                    var childNodes = new List<BsonDocument>();
                                    if (struc.Int("structId") == structObj.Int("structId"))
                                    {
                                        childNodes = dataOp.FindAllByQuery(fileStructTb, Query.EQ("nodePid", "0")).ToList();
                                    }
                                    else
                                    {
                                        childNodes = allStructs.Where(i => i.Int("nodePid") == struc.Int("structId")).ToList();
                                    }

                                    if (childNodes.Count() > 0)
                                    {
                                        nodeOrder = (childNodes.Max(i => i.Int("nodeOrder")) + 1).ToString();
                                    }
                                    else
                                    {
                                        nodeOrder = "1";
                                    }

                                    if (!parentNode.IsNullOrEmpty())             //存在父节点
                                    {
                                        nodeKey = parentNode.String("nodeKey") + "." + nodeOrder.PadLeft(6, '0');
                                    }
                                    else                                    //父节点为空(即父节点为根节点)
                                    {
                                        nodeKey = nodeOrder.PadLeft(6, '0');
                                    }
                                    attrBson.Set("nodeOrder", nodeOrder);
                                    attrBson.Set("nodeKey", nodeKey);
                                    struc.Set("nodeOrder", nodeOrder);
                                    struc.Set("nodeKey", nodeKey);
                                    data.Document = attrBson;
                                    data.Name = fileStructTb;
                                    data.Query = Query.EQ("structId", struc.Text("structId"));
                                    data.Type = StorageType.Update;
                                    datalist.Add(data);
                                }
                                dataOp.BatchSaveStorageData(datalist);


                                var oldFileRel = dataOp.FindOneByQuery(fileRelTb, Query.EQ("structId", structObj.Text("structId")));
                                var topParentFileRel = dataOp.FindOneByQuery(fileRelTb, Query.EQ("structId", topParent.Text("structId")));
                                if (oldFileRel.IsNullOrEmpty())
                                {
                                    updateBson.Set("fileId", "0");
                                    updateBson.Add("fileObjId", topParentFileRel.Text("fileObjId"), !updateBson.Contains("fileObjId"));
                                    updateBson.Add("tableName", topParentFileRel.Text("tableName"), !updateBson.Contains("tableName"));
                                    updateBson.Add("keyName", topParentFileRel.Text("keyName"), !updateBson.Contains("keyName"));
                                    updateBson.Add("keyValue", topParentFileRel.Text("keyValue"), !updateBson.Contains("keyValue"));
                                    updateBson.Add("isPreDefine", topParentFileRel.Text("isPreDefine"), !updateBson.Contains("isPreDefine"));
                                    updateBson.Add("isCover", topParentFileRel.Text("isCover"), !updateBson.Contains("isCover"));
                                    updateBson.Add("version", topParentFileRel.Text("version"), !updateBson.Contains("version"));
                                    updateBson.Add("uploadType", topParentFileRel.Text("uploadType"), !updateBson.Contains("uploadType"));
                                    updateBson.Set("structId", structObj.Text("structId"));
                                    dataOp.Insert(fileRelTb, updateBson);

                                }
                            }

                        }
                    }
                }

            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #endregion

        /// <summary>
        /// 替换缩略图地址(跳过日志记录，节省数据处理时间)
        /// </summary>
        /// <returns></returns>
        public string ReplacePath()
        {
            PageJson json = new PageJson();
            List<BsonDocument> allDataList = dataOp.FindAll("FileLibrary").ToList();   //获取表中的所有数据
            List<BsonDocument> updateDataList = new List<BsonDocument>();
            MongoOperation mongoOp = new MongoOperation();
            foreach (var data in allDataList)
            {
                var path = data.Text("thumbPicPath");
                var query = Query.EQ("fileId", data.Text("fileId"));
                if (path.Contains(@"http://jsgl.900950.com:8060/"))
                {
                    var curPath = path.Replace(@"http://jsgl.900950.com:8060/", @"http://jsgl1.900950.com:8060/");
                    data["thumbPicPath"] = curPath;
                    //data.Set("thumbPicPath",curPath);
                    //updateDataList.Add(data);
                    mongoOp.Save("FileLibrary", query, data);
                }
                if (path.Contains(@"http://172.16.1.41:8060/"))
                {
                    var curPath = path.Replace(@"http://172.16.1.41:8060/", @"http://jsgl1.900950.com:8060/");
                    data["thumbPicPath"] = curPath;
                    //data.Set("thumbPicPath",curPath);
                    //updateDataList.Add(data);
                    mongoOp.Save("FileLibrary", query, data);
                }
                if (path.Contains(@"http://27.151.122.65:8060/"))
                {
                    var curPath = path.Replace(@"http://27.151.122.65:8060/", @"http://120.35.35.1:8060/");
                    data["thumbPicPath"] = curPath;
                    //data.Set("thumbPicPath",curPath);
                    //updateDataList.Add(data);
                    mongoOp.Save("FileLibrary", query, data);
                }
            }

            return "完成";
        }

        /// <summary>
        /// 替换缩略图地址(跳过日志记录，节省数据处理时间)
        /// </summary>
        /// <returns></returns>
        public string ReplaceFilePath(string field,string oldStr,string newStr)
        {
            if (field == "" || oldStr == "") {
                return "请设置需要修改的字段及旧字符串";
            }
            PageJson json = new PageJson();
            List<BsonDocument> allDataList = dataOp.FindAll("FileLibrary").ToList();   //获取表中的所有数据
            List<BsonDocument> updateDataList = new List<BsonDocument>();
            MongoOperation mongoOp = new MongoOperation();
            foreach (var data in allDataList)
            {
                var path = data.Text(field);
                var query = Query.EQ("fileId", data.Text("fileId"));
                if (path.Contains(oldStr))
                {
                    var curPath = path.Replace(oldStr,newStr);
                    data[field] = curPath;
                    mongoOp.Save("FileLibrary", query, data);
                }
            }

            return "完成";
        }

       

        #region 更新字段时间
        /// <summary>
        /// 修改更新时间
        /// </summary>
        /// <returns></returns>
        public ActionResult UpdateFieldDate()
        {
            PageJson json = new PageJson();
            string tbName = PageReq.GetParam("tbName");
            string fieldStr = PageReq.GetParam("fieldStr");//需更新字段时间
            string keyValue = PageReq.GetParam("keyValue");//主键值
            string keyName = PageReq.GetParam("keyName");//主键名称
            string connectStr = string.IsNullOrEmpty(PageReq.GetParam("connectStr")) ? SysAppConfig.DataBaseConnectionString : PageReq.GetParam("connectStr");
            DateTime now = DateTime.Now;
            DataOperation cnDataOp = new DataOperation(connectStr, true);
            try
            {
                BsonDocument entityInfo = cnDataOp.FindOneByQuery(tbName, Query.EQ(keyName, keyValue));
                if (entityInfo != null)
                {
                    BsonDocument tempBson = new BsonDocument().Add(fieldStr, now.ToString());
                    var result = cnDataOp.Update(tbName, Query.EQ(keyName, keyValue), tempBson);
                    json.Success = result.Status == Status.Successful;
                    return Json(json);
                }
                else
                {
                    json.Success = false;
                    return Json(json);
                }

            }
            catch (Exception ex)
            {
                json.Success = false;
                return Json(json);
            }
        }
        #endregion
        #region 用户浏览页面算法

        public void UserSkanPage()
        {
            string tbName = PageReq.GetForm("tbName");
            int isUpdate = PageReq.GetFormInt("isUpdate");
            string userId = PageReq.GetForm("userId");
            if (userId == "")
            {
                userId = this.CurrentUserId.ToString();
            }
            int type = PageReq.GetFormInt("type");//记录类型 1：登陆类型记录 2：浏览页面在线时间记录 3：下载记录
            string keyValue = PageReq.GetForm("keyValue");
            int timeMillion = PageReq.GetFormInt("time");//用户停留在页面的时间
            int downFileNum = PageReq.GetFormInt("fileNum");
            string url = PageReq.GetForm("url");
            string field = PageReq.GetForm("field");//记录分值的字段
            TableRule tableRule = new TableRule(tbName);
            if (tableRule == null)
            {
                return;
            }
            string keyName = tableRule.GetPrimaryKey();//获取主键字段
            BsonDocument entityInfo = new BsonDocument();
            if (tbName != null && tbName != "" && keyName != "") {
                entityInfo = dataOp.FindOneByQuery(tbName, Query.EQ(keyName, keyValue));
            }
            BsonDocument log = new BsonDocument();
            log.Add("name", entityInfo.String("name"));
            log.Add("userId", userId);
            log.Add("url", url);
            log.Add("tbName", tbName);
            log.Add("keyValue", keyValue);
            log.Add("keyName", keyName);
            if (type == 1) { }
            else if (type == 2)
            {
                log.Add("timeMillion", timeMillion.ToString());
            }
            else if (type == 3)
            {
                log.Add("downFileNum", downFileNum.ToString());
            }
            log.Add("type", type.ToString());//浏览页面计算积分
            dataOp.Insert("UserSkanLog", log);
            int hot = 1;
            if (isUpdate == 1)
            {
                entityInfo.Set(field, (entityInfo.Int(field) + hot).ToString());
                dataOp.Update(tbName, Query.EQ(keyName, keyValue), entityInfo);
            }
        }
        public void UserDownData()
        {
            string tbName = PageReq.GetParam("tbName");
            string userId = PageReq.GetParam("userId");
            string keyValue = PageReq.GetParam("keyValue");
            int timeMillion = PageReq.GetParamInt("time");//用户停留在页面的时间
            string url = PageReq.GetParam("url");
            string field = PageReq.GetString("field");//记录分值的字段
            TableRule tableRule = new TableRule(tbName);
            string keyName = tableRule.GetPrimaryKey();//获取主键字段
            if (tableRule == null)
            {
                return;
            }
            BsonDocument log = new BsonDocument();
            log.Add("userId", userId);
            log.Add("url", url);
            log.Add("tbName", tbName);
            log.Add("keyValue", keyValue);
            log.Add("keyName", keyName);
            log.Add("timeMillion", timeMillion.ToString());
            log.Add("type", "1");//浏览页面计算积分

            //dataOp.Insert("UserHotInfo", log);
        }

        #endregion
        #region 拷贝文件信息
        /// <summary>
        /// 拷贝文件、版本、关联、关联属性
        /// </summary>
        /// <param name="tbNameDC">表名字典 （新-旧）只有一个值 </param>
        /// <param name="keyName">表主键名字典 （新-旧）只有一个值 </</param>
        /// <param name="keyValueDC">表主键值字典（新-旧）</param>
        /// <param name="fileObjIdDC">关联表类型字典 （新-旧）</param>
        /// <param name="fileTypeIdDC">文件类型字典 （新-旧）</param>
        public void CopyFileListInfo(KeyValuePair<string, string> tbNameDC, KeyValuePair<string, string> keyNameDC, Dictionary<string, string> keyValueDC, Dictionary<string, string> fileObjIdDC, Dictionary<string, string> fileTypeIdDC, params string[] args)
        {
            InvokeResult result = new InvokeResult();
            DataOperation targetDataOp = new DataOperation();
            List<string> noFileField = new List<string>() { "_id", "createUserId", "createDate", "updateUserId", "updateDate", "srcId", "fileTypeId", "fileObjId", "order", "underTable","fileId" };//文件过滤不复制的字段
            List<string> noFileVerField = new List<string>() { "_id", "createUserId", "createDate", "updateUserId", "updateDate", "srcId", "fileId", "order", "underTable", "fileVerId" };
            List<string> noFileRelField = new List<string>() { "_id", "createUserId", "createDate", "updateUserId", "updateDate", "srcId", "fileId", "fileTypeId", "fileObjId", "order", "underTable", "keyValue", "keyName", "tableName","fileRelId" };
            if (keyValueDC.Count == 0 || fileObjIdDC.Count == 0 || fileTypeIdDC.Count == 0) return;
            //当有传入数据库连接字符串（位置在可选参数的第一个）时，数据存取在目标数据库,
            if (args.Length > 0 && !string.IsNullOrEmpty(args[0]) && args[0].IndexOf("mongodb") != -1)
            {
                targetDataOp = new DataOperation(args[0], true);
            }
            
            List<BsonDocument> fileRelList = targetDataOp.FindAllByQuery("FileRelation", Query.And(
                    Query.EQ("tableName", tbNameDC.Key),
                    Query.EQ("keyName", keyNameDC.Key),
                    Query.In("keyValue", BsonArray.Create(keyValueDC.Select(a => a.Key))),
                    Query.In("fileObjId", BsonArray.Create(fileObjIdDC.Select(a => a.Key)))
                )).ToList();
            if (fileRelList.Count > 0)
            {
                Dictionary<string, string> fileIdDC = new Dictionary<string, string>();
                Dictionary<string, string> fileRelIdDC = new Dictionary<string, string>();
                Dictionary<string, string> fileVerDC = new Dictionary<string, string>();
                List<string> fileIds = fileRelList.Select(x => x.String("fileId")).Distinct().ToList();

                //由于fileTypeId=0的在存入的时候没有存入该字段，因此不能用""去判断
                List<BsonDocument> fileList = targetDataOp.FindAllByQuery("FileLibrary", Query.And(
                    Query.In("fileId", BsonArray.Create(fileIds))
                    //Query.In("fileTypeId", TypeConvert.StringListToBsonValueList(fileTypeIdDC.Keys))
               )).Where(a=>fileTypeIdDC.Keys.Contains(a.Text("fileTypeId"))).ToList();

                fileIds = fileList.Select(x => x.String("fileId")).ToList();

                List<BsonDocument> fileVerList = targetDataOp.FindAllByQuery("FileLibVersion",
                 Query.In("fileId", BsonArray.Create(fileIds))).ToList();

                List<StorageData> dataList = new List<StorageData>();
                var insertTRData = new List<BsonDocument>();
                var upTRCount = fileList.Count;
                var trCount = 0;
                var pkTRCountResult = targetDataOp.AdvanceUpPKCount("FileLibrary", upTRCount, ref trCount);
                if (pkTRCountResult.Status == Status.Failed) throw new Exception(pkTRCountResult.Message);
                foreach (var tempFile in fileList)
                {
                    trCount++;
                    BsonDocument tempFileBson = new BsonDocument(){
                        {"fileId",trCount.ToString()},
                        {"createDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //添加时,默认增加创建时间
                        {"updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //更新时间
                        {"createUserId", CurrentUserId.ToString()},                        //创建用户 -1为未登录创建
                        {"updateUserId", CurrentUserId.ToString()},                        //更新用户
                        {"underTable", "FileLibrary"}
                    };
                    foreach (var tempField in tempFile.Elements.Where(a=>!noFileField.Contains(a.Name)))//插入文件
                    {
                        tempFileBson.Set(tempField.Name, tempFile.String(tempField.Name));
                    }
                    tempFileBson.Set("srcId", tempFile.String("fileId"));
                    if (tempFile.String("sourceId") != "")
                    {
                        tempFileBson.Set("sourceId", tempFile.String("sourceId"));//记录最初来源
                    }
                    else  if (tempFile.String("srcId") != "")
                    {
                        tempFileBson.Set("sourceId", tempFile.String("srcId"));//记录最初来源
                    }
                    else if (tempFile.String("fileId") != "")
                    {
                        tempFileBson.Set("sourceId", tempFile.String("fileId"));
                    }
                    tempFileBson.Set("fileTypeId", fileTypeIdDC.ContainsKey(tempFile.String("fileTypeId")) ? fileTypeIdDC[tempFile.String("fileTypeId")] : "");//更改fileTypeId
                    tempFileBson.Set("fileObjId", fileObjIdDC.ContainsKey(tempFile.String("fileObjId")) ? fileObjIdDC[tempFile.String("fileObjId")] : "");//更改fileObjId
                    
                    if (!fileIdDC.ContainsKey(tempFile.String("fileId")))
                    {
                        fileIdDC.Add(tempFile.String("fileId"), trCount.ToString());
                    }
                    insertTRData.Add(tempFileBson);
                }
                if (insertTRData.Count > 0)
                {
                    var temInsertResult = targetDataOp.BatchInsert("FileLibrary", insertTRData);
                    if (temInsertResult.Status == Status.Failed) throw new Exception(temInsertResult.Message);
                }

                insertTRData = new List<BsonDocument>();
                upTRCount = fileRelList.Count;
                trCount = 0;
                pkTRCountResult = targetDataOp.AdvanceUpPKCount("FileRelation", upTRCount, ref trCount);
                if (pkTRCountResult.Status == Status.Failed) throw new Exception(pkTRCountResult.Message);
                foreach (var tempRel in fileRelList)
                {
                    if (fileIds.Contains(tempRel.String("fileId")) && keyValueDC.ContainsKey(tempRel.String("keyValue")))
                    {
                        trCount++;
                        BsonDocument tempFileBson = new BsonDocument(){
                            {"fileRelId",trCount.ToString()},
                            {"createDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //添加时,默认增加创建时间
                            {"updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //更新时间
                            {"createUserId", CurrentUserId.ToString()},                        //创建用户 -1为未登录创建
                            {"updateUserId", CurrentUserId.ToString()},                        //更新用户
                            {"underTable", "FileRelation"}
                        };
                        foreach (var tempField in tempRel.Elements.Where(a=>!noFileRelField.Contains(a.Name)))//插入关联
                        {
                            tempFileBson.Set(tempField.Name, tempRel.String(tempField.Name));
                        }
                        //tempFileBson.Add("fileTypeId", fileTypeIdDC.ContainsKey(tempRel.String("fileType")) ? fileTypeIdDC[tempRel.String("fileType")] : "");//更改fileTypeId
                        tempFileBson.Set("fileObjId", fileObjIdDC.ContainsKey(tempRel.String("fileObjId")) ? fileObjIdDC[tempRel.String("fileObjId")] : "");//更改fileObjId
                        tempFileBson.Set("fileId", fileIdDC[tempRel.String("fileId")]);//更改fileId
                        tempFileBson.Set("tableName", tbNameDC.Value);//更改tableName
                        tempFileBson.Set("keyName", keyNameDC.Value);//更改tableName
                        tempFileBson.Set("keyValue", keyValueDC[tempRel.String("keyValue")]);//更改KeyValue
                        if (!fileRelIdDC.ContainsKey(tempRel.String("fileRelId")))
                        {
                            fileRelIdDC.Add(tempRel.String("fileRelId"), trCount.ToString());
                        }
                        insertTRData.Add(tempFileBson);
                    }
                }
                if (insertTRData.Count > 0)
                {
                    var temInsertResult = targetDataOp.BatchInsert("FileRelation", insertTRData);
                    if (temInsertResult.Status == Status.Failed) throw new Exception(temInsertResult.Message);
                }
                #region 关联表属性
                List<string> noFileRelPropField = new List<string>() { "createUserId", "createDate", "updateUserId", "updateDate", "srcId", "fileId", "fileTypeId", "fileObjId", "order", "underTable", "keyValue", "keyName", "tableName" };
                List<string> fileRelId = fileRelList.Select(x => x.String("fileRelId")).ToList();
                List<BsonDocument> fileRelPropList = targetDataOp.FindAllByQuery("FileRelProperty", 
                    Query.In("fileRelId", BsonArray.Create(fileRelId)))
                    .Where(a => fileRelIdDC.ContainsKey(a.Text("fileRelId"))).ToList();//关联属性信息

                insertTRData = new List<BsonDocument>();
                upTRCount = fileRelPropList.Count;
                trCount = 0;
                pkTRCountResult = targetDataOp.AdvanceUpPKCount("FileRelProperty", upTRCount, ref trCount);
                if (pkTRCountResult.Status == Status.Failed) throw new Exception(pkTRCountResult.Message);
                foreach (var tempRelProp in fileRelPropList)
                {

                    trCount++;
                    BsonDocument tempFileBson = new BsonDocument(){
                        {"filePropertyId",trCount.ToString()},
                        {"createDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //添加时,默认增加创建时间
                        {"updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //更新时间
                        {"createUserId", CurrentUserId.ToString()},                        //创建用户 -1为未登录创建
                        {"updateUserId", CurrentUserId.ToString()},                        //更新用户
                        {"underTable", "FileRelProperty"}
                    };
                    foreach (var tempField in tempRelProp.Elements.Where(a=>!noFileRelPropField.Contains(a.Name)))//插入文件
                    {
                        tempFileBson.Set(tempField.Name, tempRelProp.String(tempField.Name));
                    }
                    tempFileBson.Set("srcId", tempRelProp.String("filePropertyId"));
                    if (tempRelProp.String("sourceId") != "")
                    {
                        tempFileBson.Set("sourceId", tempRelProp.String("sourceId"));//记录最初来源
                    }
                    else if (tempRelProp.String("srcId") != "")
                    {
                        tempFileBson.Set("sourceId", tempRelProp.String("srcId"));//记录最初来源
                    }
                    else if (tempRelProp.String("filePropertyId") != "")
                    {
                        tempFileBson.Set("sourceId", tempRelProp.String("filePropertyId"));
                    }
                    tempFileBson.Set("fileRelId", fileRelIdDC[tempRelProp.String("fileRelId")]);
                    insertTRData.Add(tempFileBson);

                }
                if (insertTRData.Count > 0)
                {
                    var temInsertResult = targetDataOp.BatchInsert("FileRelProperty", insertTRData);
                    if (temInsertResult.Status == Status.Failed) throw new Exception(temInsertResult.Message);
                }
                #endregion

                #region 版本

                fileVerList=fileVerList.FindAll(a=>fileIdDC.ContainsKey(a.Text("fileId")));
                insertTRData = new List<BsonDocument>();
                upTRCount = fileVerList.Count;
                trCount = 0;
                pkTRCountResult = targetDataOp.AdvanceUpPKCount("FileLibVersion", upTRCount, ref trCount);
                if (pkTRCountResult.Status == Status.Failed) throw new Exception(pkTRCountResult.Message);
                foreach (var tempVer in fileVerList)
                {
                    trCount++;
                    BsonDocument tempFileBson = new BsonDocument(){
                        {"fileVerId",trCount.ToString()},
                        {"createDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //添加时,默认增加创建时间
                        {"updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")},      //更新时间
                        {"createUserId", CurrentUserId.ToString()},                        //创建用户 -1为未登录创建
                        {"updateUserId", CurrentUserId.ToString()},                        //更新用户
                        {"underTable", "FileLibVersion"}
                    };
                    foreach (var tempField in tempVer.Elements.Where(a=>!noFileVerField.Contains(a.Name)))//插入文件
                    {
                        tempFileBson.Set(tempField.Name, tempVer.String(tempField.Name));
                    }
                    tempFileBson.Set("srcId", tempVer.String("fileVerId"));
                    if (tempVer.String("sourceId") != "")
                    {
                        tempFileBson.Set("sourceId", tempVer.String("sourceId"));//记录最初来源
                    }
                    else if (tempVer.String("srcId") != "")
                    {
                        tempFileBson.Set("sourceId", tempVer.String("srcId"));//记录最初来源
                    }
                    else if (tempVer.String("fileVerId") != "") 
                    {
                        tempFileBson.Set("sourceId", tempVer.String("fileVerId"));
                    }
                    tempFileBson.Set("fileId", fileIdDC[tempVer.String("fileId")]);//更改fileId
                    insertTRData.Add(tempFileBson);
                }
                if (insertTRData.Count > 0)
                {
                    var temInsertResult = targetDataOp.BatchInsert("FileLibVersion", insertTRData);
                    if (temInsertResult.Status == Status.Failed) throw new Exception(temInsertResult.Message);
                }
                #endregion
            }
        }


        #endregion

        #region 通用导出html导出pdf
        /// <summary>
        /// 通用HTML导出PDF（无登录）
        /// </summary>
        /// <param name="pdfUrl">导出PDF的网页地址</param>
        /// <param name="pdfName">导出PDF的文件名</param>
        public void CommonHtmlToPDF()
        {
            try
            {
                var html = PageReq.GetForm("html");
                var pdfName = PageReq.GetForm("pdfName").CutStr(20, "") + ".pdf";
                var cssLoad = PageReq.GetForm("cssLoad");
                var url = string.Format("{0}/Attachment/HtmlToPDF?cssLoad={1}", "", cssLoad);
                var pdfParams = PageReq.GetForm("pdfParams");//pdf参数 如：页码展示格式 --footer right [page]-[topage]
                string tmpName = HttpUtility.UrlEncode(pdfName, System.Text.Encoding.UTF8).Replace("+", "%20"); //主要为了解决包含非英文/数字名称的问题
                string savePath = Server.MapPath("/UploadFiles/temp");
                if (!System.IO.Directory.Exists(savePath))
                {
                    System.IO.Directory.CreateDirectory(savePath);
                }
                string tempHtmlFileName = string.Format("YINHOOHTMLCODE_{0}", ".txt");
                string tempHtmlPath = System.IO.Path.Combine(savePath, tempHtmlFileName);
                url = string.Format("{0}YinHeYinHe{1}", url, tempHtmlPath);

                string loginUrl = string.Format("{0}/Account/PDF_Login?ReturnUrl={1}", SysAppConfig.PDFDomain, HttpUtility.UrlEncode(url));

                savePath = System.IO.Path.Combine(savePath, tmpName);
                string wkpdf = SysAppConfig.WKhtmltopdfUrl;
                _log.Info("wkpdf: " + wkpdf);
                _log.Info("savePath: " + savePath);


                if (IsContainsZH(loginUrl)) {
                    _log.Warn("loginUrl中不能包含中文，否则会导致无法生成pdf！！！");
                }
                if (IsContainsZH(savePath)) {
                    _log.Warn("savePath中不能包含中文，否则会导致无法生成pdf！！！");
                }


                if (string.IsNullOrWhiteSpace(wkpdf))
                {

                    wkpdf = @"C:\wkhtmltopdf\wkhtmltopdf.exe";
                }
                try
                {
                    _log.Info("tempHtmlPath: " + tempHtmlPath);
                    FileStream fs = new FileStream(tempHtmlPath, FileMode.Create);
                    StreamWriter sw = new StreamWriter(fs);
                    //开始写入
                    //_log.Info(html);
                    sw.Write(html);
                    //清空缓冲区
                    sw.Flush();
                    //关闭流
                    sw.Close();
                    fs.Close();

                    //if (!System.IO.File.Exists(tempHtmlPath)) 
                    //{
                    //    sw = System.IO.File.CreateText(tempHtmlPath);
                    //}


                    //string w = "";
                    //sw.Write(w);
                    //sw.Close();
                    _log.Info("url: " + url);
                    _log.Info("pdfParams: " + pdfParams);
                    _log.Info("loginUrl: " + loginUrl);
                    _log.Info("savePath: " + savePath);
                    //System.Diagnostics.Process p = System.Diagnostics.Process.Start(wkpdf, @"" + pdfParams + " " + loginUrl + " " + savePath);

                    Process p = new Process();
                    p.StartInfo.FileName = wkpdf;
                    p.StartInfo.Arguments = pdfParams + " \"" + loginUrl + "\"  \"" + savePath + "\"";
                    Response.Write(p.StartInfo.Arguments);
                    p.StartInfo.UseShellExecute = false;
                    p.StartInfo.RedirectStandardInput = true;
                    p.StartInfo.RedirectStandardOutput = true;
                    p.StartInfo.RedirectStandardError = true;
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    p.WaitForExit();

                    _log.Info("WaitForExit: " + "ok");
                }
                catch (System.Exception ex)
                {
                    _log.Error(ex.Message);
                }

                DownloadFileZHTZ(savePath, pdfName);

            }
            catch (Exception ex)
            {
                _log.Error(ex.Message);
            }
        }
        #endregion
        #region 同步字段
        public ActionResult CopyFieldByTbName()
        {
            PageJson json = new PageJson();
            string tbName = PageReq.GetParam("tbName");
            string keyName = PageReq.GetParam("keyName");//需更新字段时间
            string fieldStr = PageReq.GetParam("fieldStr");//需更新字段时间
            string fieldNewStr = PageReq.GetParam("fieldNewStr");//需更新字段时间
            var result = new InvokeResult();
            try
            {
                List<StorageData> data = new List<StorageData>();
                List<BsonDocument> listInfo = dataOp.FindAll(tbName).ToList();
                if (listInfo.Count() > 0)
                {
                    foreach (var temp in listInfo)
                    {
                        if (!string.IsNullOrEmpty(temp.String(fieldStr)))
                        {
                            temp.Set(fieldNewStr, temp.String(fieldStr));
                            data.Add(new StorageData()
                            {
                                Document = temp,
                                Name = tbName,
                                Type = StorageType.Update,
                                Query = Query.EQ(keyName, temp.String(keyName))
                            });
                        }
                    }
                    result = dataOp.BatchSaveStorageData(data);
                }
                return Json(TypeConvert.InvokeResultToPageJson(result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                json.Success = false;
                return Json(json);
            }
        }

        #endregion

        #region 简单提交审核的测下审核
        /// <summary>
        /// 简单提交审核接口
        /// </summary>
        /// <param name="tableName">实体表名</param>
        /// <param name="keyName">实体主键</param>
        /// <param name="keyValue">实体主键值</param>
        /// <param name="type">审核类型  1：提交审核  2：审核通过 3:驳回 4:作废</param>
        /// <param name="field">审核字段 </param>
        /// <param name="fieldValue">审核字段值</param>
        ///<param name="remark">说明</param>
        ///<param name="auditType">审批种类</param>
        ///<param name="nominatorId">指定审批人</param>
        ///<param name="libType">申请来源库类型</param>
        ///<param name="url">链接地址</param>
        ///<param name="retName">成果名称（不传默认取表中的name）</param>
        /// <returns></returns>
        public ActionResult SimpleAudit(string tableName, string keyName, string keyValue, string type, string field, string fieldValue, string remark, string libType, string auditType, string nominatorId, string url,string retName)
        {
            PageJson json = new PageJson();
            if (string.IsNullOrEmpty(tableName) || string.IsNullOrEmpty(keyName) || string.IsNullOrEmpty(keyValue) || string.IsNullOrEmpty(type))
            {
                json.Success = false;
                json.Message = "传入参数不正确,请联系管理员！";//
                return Json(json);
            }
            string auditField = string.IsNullOrEmpty(field) ? "isCheck" : field;
            string auditStatus = string.IsNullOrEmpty(fieldValue) ? "1" : fieldValue;
            string remarkValue = string.IsNullOrEmpty(remark) ? "" : remark;
            BsonDocument entity = dataOp.FindOneByQuery(tableName, Query.EQ(keyName, keyValue));
            if (entity == null)
            {
                json.Success = false;
                json.Message = "审核对象不存在,请刷新页面重试或联系管理员！";//
                return Json(json);
            }
            BsonDocument tempEntity = new BsonDocument() { { auditField, auditStatus } };
            //entity.Set(auditField, auditStatus);//更改状态值
            var result = dataOp.Update(tableName, Query.EQ(keyName, keyValue), tempEntity);
            if (result.Status == Status.Successful)
            {
                entity = result.BsonInfo;
                BsonDocument checkInfo = new BsonDocument();
                checkInfo = dataOp.FindOneByQuery("SimpleAudit", Query.And(Query.EQ("tableName", tableName), Query.EQ("keyValue", keyValue), Query.EQ("keyName", keyName), Query.EQ("auditType", auditType), Query.EQ("status", "1")));//查找当前审核信息是否已经有一条未审核记录
                string status = "1";//推送的消息状态   1：申请中  2：通过审核  3：驳回审核 4：撤销审核
                List<string> typeList = new List<string>() { "1", "4" };//创建推送的消息
                if (retName + "" == "")
                {
                    retName = entity.String("name");
                }
                switch (type)
                {
                    case "1":
                    case "4": status = "1"; break;
                    case "6":
                    case "2": status = "2"; break;
                    case "3":
                    case "7": status = "3"; break;
                    case "5":
                    case "8": status = "4"; break;
                    default: break;
                }
                if ((type == "1" || type == "4") && checkInfo == null)//没有推送的消息
                {
                    checkInfo = new BsonDocument();
                    checkInfo.Add("name", retName);
                    checkInfo.Add("libType", libType);//申请来源库类型
                    checkInfo.Add("tableName", tableName);
                    checkInfo.Add("keyName", keyName);
                    checkInfo.Add("keyValue", keyValue);
                    checkInfo.Add("field", auditField);
                    checkInfo.Add("fieldValue", auditStatus);//审核状态 0：未发布  1：提交审核  2：审核通过
                    checkInfo.Add("status", status);//审核状态   1：申请中  2：通过审核  3：驳回审核 4：撤销审核
                    checkInfo.Add("applyUserId", this.CurrentUserId.ToString());//申请人
                    checkInfo.Add("nominatorId", nominatorId);
                    checkInfo.Add("remark", remark);
                    checkInfo.Add("url", url);//
                    checkInfo.Add("auditType", auditType);//1：审批申请  2：作废申请
                    checkInfo = dataOp.Insert("SimpleAudit", checkInfo).BsonInfo;
                }
                else 
                {
                    BsonDocument tempCheckInfo = new BsonDocument() { { "status", status }, { "applyUserId", this.CurrentUserId.ToString() }, { "reason", remark } };
                    checkInfo = dataOp.Update("SimpleAudit",Query.EQ("simpleAduitId",checkInfo.String("simpleAduitId")), tempCheckInfo).BsonInfo;
                }

                BsonDocument checkLog = new BsonDocument();
                checkLog.Add("sumbitUser", this.CurrentUserId.ToString());
                checkLog.Add("name", retName);
                checkLog.Add("tableName", tableName);
                checkLog.Add("keyName", keyName);
                checkLog.Add("keyValue", keyValue);
                checkLog.Add("field", auditField);
                checkLog.Add("fieldValue", auditStatus);//审核状态 0：未发布  1：提交审核  2：审核通过   
                checkLog.Add("remark", remark);
                checkLog.Add("simpleAduitId", checkInfo.String("simpleAduitId"));
                checkLog.Add("type", type);//审核类型  1：提交审核  2：审核通过 3:驳回 4:作废 5:撤销审核
                dataOp.Insert("SimpleAuditLog", checkLog);
                return Json(TypeConvert.InvokeResultToPageJson(result));
            }
            else
            {
                json.Success = false;
                json.Message = "审核不成功，请刷新页面重试或联系管理员！";//
                return Json(json);
            }
        }

        /// <summary>
        /// 申请修改接口
        /// </summary>
        /// <param name="saveForm"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ModificationOperate(FormCollection saveForm)
        {
            InvokeResult result = new InvokeResult();
            string tbName = saveForm["tbName"] != null ? saveForm["tbName"] : "";
            string queryStr = saveForm["queryStr"] != null ? saveForm["queryStr"] : "";
            string dataStr = saveForm["dataStr"] != null ? saveForm["dataStr"] : "";
            string operateTb = saveForm["tableName"] != null ? saveForm["tableName"] : "";//申请对象所在表的表名
            string operatePKName = saveForm["keyName"] != null ? saveForm["keyName"] : ""; //申请对象所在表的主键名
            string operatePKValue = saveForm["keyValue"] != null ? saveForm["keyValue"] : "";//申请对象所在表的主键值
            string operateKeyName = saveForm["ModField"] != null ? saveForm["ModField"] : "";//申请对象所在表的需要修改的字段名
            string operateKeyValue = saveForm["ModFieldValue"] != null ? saveForm["ModFieldValue"] : "";//申请对象所在表的需要修改的字段值
            string remark = saveForm["remark"] != null ? saveForm["remark"] : "";//备注
            BsonDocument dataBson = new BsonDocument();
            if (dataStr.Trim() == "")
            {
                foreach (var tempKey in saveForm.AllKeys)
                {
                    if (tempKey == "tbName" || tempKey == "queryStr" || tempKey.Contains("teamRels")) continue;
                    dataBson.Add(tempKey, PageReq.GetForm(tempKey));
                }
            }
            else
            {
                dataBson = TypeConvert.ParamStrToBsonDocument(dataStr);
            }
            try
            {
                result = dataOp.Save(tbName, queryStr != "" ? TypeConvert.NativeQueryToQuery(queryStr) : Query.Null, dataBson);
                if (result.Status == Status.Successful)
                {
                    //修改申请对象所在表的记录
                    var operateStatus = PageReq.GetFormInt("status") > 1 ? "0" : PageReq.GetForm("status");
                    var operateQuery = Query.EQ(operatePKName, operatePKValue);
                    var operateObj = new BsonDocument(){
                    {operateKeyName, operateKeyValue},
                    {"isModification", operateStatus}
                    };
                    BsonDocument checkLog = new BsonDocument();
                    checkLog.Add("sumbitUser", this.CurrentUserId.ToString());
                    checkLog.Add("tableName", operateTb);
                    checkLog.Add("keyName", operatePKName);
                    checkLog.Add("keyValue", operatePKValue);
                    checkLog.Add("field", operateKeyName);
                    checkLog.Add("fieldValue", operateKeyValue);//审核状态 0：未发布  1：提交审核  2：审核通过   
                    checkLog.Add("remark", remark);
                    checkLog.Add("modificationAuditId", result.BsonInfo.String("modificationAuditId"));
                    result = dataOp.Update(operateTb, operateQuery, operateObj);
                    if (result.Status == Status.Successful) 
                    {
                        string logType = "";
                        switch (PageReq.GetFormInt("status")) 
                        {
                            case 0: logType = "1"; break;
                            case 1: logType = "2"; break;
                            case 2: logType = "3"; break;
                            case 3: logType = "4"; break;
                            case 4: break;
                        }
                        checkLog.Add("name", result.BsonInfo.String("name"));
                        checkLog.Add("type", logType);//审核类型  1 提交申请修改 2 申请修改通过 3 申请修改驳回 4 撤销申请修改
                        dataOp.Insert("ModificationAuditLog", checkLog);
                    }
                }
            }
            catch (System.Exception ex)
            {
                result.Status = Status.Failed;
                result.Message = ex.ToString();
            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }

        #endregion

        #region 人员权限替换
        /// <summary>
        /// 人员权限替换
        /// </summary>
        /// <param name="oldUserId"></param>
        /// <param name="newUserId"></param>
        /// <param name="type"> 0 默认值 </param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UserRightReplace(string oldUserId, string newUserId, string type)
        {
            PageJson json = new PageJson();
            InvokeResult result = new InvokeResult();
            if (string.IsNullOrEmpty(oldUserId) || string.IsNullOrEmpty(newUserId))
            {
                json.Success = false;
                json.Message = "传入参数有误,请联系管理员或刷新后重试!";
                return Json(json);
            }
            #region 查找旧人员所有权限(不包括人员所在的组织架构所赋予的权限)
            List<BsonDocument> oldUserRole = dataOp.FindAllByQuery("SysRoleUser", Query.EQ("userId", oldUserId)).ToList();
            List<StorageData> data = new List<StorageData>();
            if (oldUserRole.Count() > 0)
            {
                foreach (var tempRoleUser in oldUserRole)
                {
                    data.Add(
                        new StorageData()
                        {
                            Type = StorageType.Insert,
                            Name = "SysRoleUser",
                            Document = new BsonDocument().Add("roleId", tempRoleUser.String("roleId")).Add("userId", newUserId)
                        });
                    data.Add(
                        new StorageData()
                        {
                            Type = StorageType.Delete,
                            Name = "SysRoleUser",
                            Query = Query.EQ("roleUserId", tempRoleUser.String("roleUserId"))
                        });

                }
            }
            #endregion
            if (data.Count() > 0)
            {
                result = dataOp.BatchSaveStorageData(data);
            }
            else
            {
                result.Status = Status.Successful;
                result.Message = "权限替换成功！";
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        /// <summary>
        /// 项目角色人员和组织替换
        /// </summary>
        /// <param name="id">旧地块/项目Id</param>
        /// <param name="landOrProj">1：地块  2 项目</param>
        /// <param name="newId">新地块/项目Id</param>
        /// <param name="isBuilt"></param>
        /// <returns></returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ProjectRoleUserAndOrgCopy(string id, string landOrProj, string newId, string isBuilt)
        {
            PageJson json = new PageJson();
            InvokeResult result = new InvokeResult();
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(landOrProj))
            {
                json.Success = false;
                json.Message = "传入参数有误,请联系管理员或刷新后重试!";
                return Json(json);
            }
            string isBuiltIn = isBuilt == null ? "1" : "2";
            #region  从内置角色中查找内置角色
            BsonDocument scheme = dataOp.FindOneByQuery("ProjBuiltInRoleScheme", Query.And(Query.EQ("isDefault", "1"), Query.EQ("typeId", landOrProj)));
            if (scheme == null)
            {
                json.Success = false;
                json.Message = "传入参数有误,请联系管理员或刷新后重试!";
                return Json(json);
            }
            List<BsonDocument> builtInScheme = dataOp.FindAllByQuery("ProjBuiltInRole", Query.EQ("schemeId", scheme.String("schemeId"))).ToList();
            List<string> builtInRoleId = builtInScheme.Select(x => x.String("roleId")).ToList();
            #endregion
            #region 查找旧项目中相对应的角色
            List<BsonDocument> oldProjBuiltInRoleList = dataOp.FindAllByQuery("SysRole", Query.And(Query.EQ("isBuiltIn", "1"), Query.In("srcId", TypeConvert.StringListToBsonValueList(builtInRoleId)), Query.EQ("landOrProjId", id))).ToList();//查找旧项目中所有内置的角色
            var oldRoleIdBson = oldProjBuiltInRoleList.Select(x => (BsonValue)x.String("roleId"));
            List<BsonDocument> oldRoleOrg = dataOp.FindAllByQuery("SysRoleOrg", Query.In("roleId", oldRoleIdBson)).ToList();//查找旧项目中角色对应的组织架构
            List<BsonDocument> oldRoleUser = dataOp.FindAllByQuery("SysRoleUser", Query.In("roleId", oldRoleIdBson)).ToList();//查找旧项目中角色对应的人员
            #endregion
            #region 查找旧项目中相对应的角色
            List<BsonDocument> newProjBuiltInRoleList = dataOp.FindAllByQuery("SysRole", Query.And(Query.EQ("isBuiltIn", "1"), Query.In("srcId", TypeConvert.StringListToBsonValueList(builtInRoleId)), Query.EQ("landOrProjId", newId))).ToList();//查找旧项目中所有内置的角色
            var newRoleIdBson = newProjBuiltInRoleList.Select(x => (BsonValue)x.String("roleId"));
            List<BsonDocument> newRoleOrg = dataOp.FindAllByQuery("SysRoleOrg", Query.In("roleId", newRoleIdBson)).ToList();//查找旧项目中角色对应的组织架构
            List<BsonDocument> newRoleUser = dataOp.FindAllByQuery("SysRoleUser", Query.In("roleId", newRoleIdBson)).ToList();//查找旧项目中角色对应的人员
            #region 更新新项目或地块中的人员和部门
            List<StorageData> data = new List<StorageData>();
            foreach (var tempOld in newRoleOrg)
            {
                data.Add(new StorageData()
                {
                    Type = StorageType.Delete,
                    Name = "SysRoleOrg",
                    Query = Query.EQ("roleOrgId", tempOld.String("roleOrgId"))
                });
            }
            foreach (var tempOld in newRoleUser)
            {
                data.Add(new StorageData()
                {
                    Type = StorageType.Delete,
                    Name = "SysRoleUser",
                    Query = Query.EQ("roleUserId", tempOld.String("roleUserId"))
                });
            }
            foreach (var tempNewRole in newProjBuiltInRoleList)
            {
                BsonDocument tempOldRole = oldProjBuiltInRoleList.Where(x => x.String("srcId") == tempNewRole.String("srcId")).FirstOrDefault();
                if (tempOldRole != null)
                {
                    List<BsonDocument> tempOldOrgList = oldRoleOrg.Where(x => x.String("roleId") == tempOldRole.String("roleId")).ToList();
                    foreach (var tempOld in tempOldOrgList)
                    {
                        data.Add(new StorageData()
                        {
                            Type = StorageType.Insert,
                            Name = "SysRoleOrg",
                            Document = new BsonDocument 
                                { { "orgId", tempOld.String("orgId") } ,
                                 { "roleId", tempNewRole.String("roleId") } 
                                }
                        });
                    }
                    List<BsonDocument> tempOldUserList = oldRoleUser.Where(x => x.String("roleId") == tempOldRole.String("roleId")).ToList();
                    foreach (var tempOld in tempOldUserList)
                    {
                        data.Add(new StorageData()
                        {
                            Type = StorageType.Insert,
                            Name = "SysRoleUser",
                            Document = new BsonDocument { 
                                { "userId", tempOld.String("userId") } ,
                                 { "roleId", tempNewRole.String("roleId") } 
                                }
                        });
                    }
                }
            }

            #endregion
            #endregion
            if (data.Count() > 0)
            {
                result = dataOp.BatchSaveStorageData(data);
            }
            else
            {
                result.Status = Status.Successful;
                result.Message = "角色人员部门替换成功！";
            }

            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #endregion

        #region 获取非树形结构树
        /// <summary>
        ///  获取需展示的目录树
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="queryStr"></param>
        /// <param name="sortField"></param>
        /// <param name="sortType"></param>
        /// <returns></returns>
        public ActionResult GetNoTreeByQuery(string tbName, string queryStr,string sortField,string sortType)
        {
            TableRule tbRule = new TableRule(tbName);

            string tbKey = tbRule.PrimaryKey;
            if (string.IsNullOrEmpty(sortField)) {
            sortField="order";}
            
            List<BsonDocument> catList = dataOp.FindAllByQuery(tbName, TypeConvert.NativeQueryToQuery(queryStr)).OrderBy(x=>x.Int(sortField)).ToList();//获取模板下的目录
            if (sortType == "desc") 
            { 
                catList = catList.OrderByDescending(x=>x.Int(sortField)).ToList(); 
            }
            List<TreeNode> treeList = TreeHelper.GetSingleTreeList(catList);

            return new XmlTree(treeList);
        }

        #endregion

      
        #region 保存关联表数据

       

        #endregion
        #region  行政区域Excel导入
        public ActionResult AdministrativeRegionImport(FormCollection saveForm)
        {
            bool isNew = saveForm["isNew"].Trim().ToLower() == "true";
            string type = saveForm["type"].Trim();
            InvokeResult result = new InvokeResult();
            try
            {
                #region  保存临时文件
                HttpPostedFileBase file = Request.Files[0];
                if (System.IO.Directory.Exists(Server.MapPath("~/ImportExcelFiles/")) == false)
                    System.IO.Directory.CreateDirectory(Server.MapPath("~/ImportExcelFiles/"));
                string tempFileName = Server.MapPath("~/ImportExcelFiles/" + DateTime.Now.ToFileTimeUtc() + ".xls");
                file.SaveAs(tempFileName);
                #endregion

                string connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source='" + tempFileName + "';Extended Properties='Excel 12.0;HDR=YES;IMEX=0'";
                DataSet dsExcel = new DataSet();
                using (OleDbConnection conn = new OleDbConnection(connString))
                {
                    conn.Open();
                    DataTable excelSchema = null;
                    string sql = "select * from [{0}]";
                    var adapter = new OleDbDataAdapter();
                    adapter.SelectCommand = conn.CreateCommand();

                    excelSchema = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables,
                                    new object[] { null, null, null, "TABLE" });
                    foreach (DataRow row in excelSchema.Rows)
                    {
                        var sheet = row["TABLE_NAME"].ToString();
                        sql = string.Format(sql, sheet);
                        adapter.SelectCommand.CommandText = sql;
                        adapter.Fill(dsExcel, sheet);
                    }
                }
                var regionTable = (from m in dsExcel.Tables[0].AsEnumerable()
                                   select m).ToList();
                regionTable.RemoveAll(d => d["编码"] == System.DBNull.Value);

                var allRegionList = dataOp.FindAll("AdministrativeRegion").ToList();
                var newRegionIdList = new List<string>();
                if (type == "1")
                {
                    if (isNew)
                    {
                        foreach (var region in regionTable.OrderBy(t => t["编码"].ToString().Trim()))
                        {
                            string code = region["编码"].ToString().Trim();
                            string name = region["名称"].ToString().Trim();

                            var regionBson = allRegionList.Where(t => t.String("code") == code).FirstOrDefault();
                            int level = 3;
                            if (code.Substring(2, 4) == "0000")
                            {
                                level = 1;
                            }
                            else if (code.Substring(4, 2) == "00")
                            {
                                level = 2;
                            }
                            var tempBson = new BsonDocument().Add("code", code).Add("level", level.ToString()).Add("isUse", "1");
                            if (level == 1)
                            {
                                tempBson.Add("fullName", name).Add("provinceName", name);
                            }
                            else if (level == 2)
                            {
                                string firstCode = code.Substring(0, 2);
                                var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                tempBson.Add("fullName", name).Add("provinceName", provinceName).Add("cityName", name.Replace(provinceName, ""));
                            }
                            else if (level == 3)
                            {
                                string firstCode = code.Substring(0, 2);
                                string secodeCode = code.Substring(2, 2);
                                var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                var cityName = allRegionList.Where(t => t.String("code") == (firstCode + secodeCode + "00")).FirstOrDefault().String("cityName");
                                var countyName = (cityName == "市辖区" || cityName == "县") ? name.Replace(provinceName, "") : name.Replace(provinceName + cityName, "");
                                tempBson.Add("fullName", name).Add("provinceName", provinceName).Add("cityName", cityName).Add("countyName", countyName);
                            }
                            if (regionBson.IsNullOrEmpty())
                            {
                                result = dataOp.Insert("AdministrativeRegion", tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                            else
                            {
                                result = dataOp.Update("AdministrativeRegion", Query.EQ("code", code), tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Remove(regionBson);
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                        }
                        var notUsedIdList = allRegionList.Where(t => !newRegionIdList.Contains(t.String("regionId"))).Select(t => (BsonValue)t.String("region")).ToList();
                        dataOp.Update("AdministrativeRegion", Query.In("regionId", notUsedIdList), new BsonDocument().Add("isUse", "2"));
                    }
                    else
                    {
                        foreach (var region in regionTable.OrderBy(t => t["编码"].ToString().Trim()))
                        {
                            string code = region["编码"].ToString().Trim();
                            string name = region["名称"].ToString().Trim();

                            var regionBson = allRegionList.Where(t => t.String("code") == code).FirstOrDefault();
                            if (regionBson.IsNullOrEmpty())
                            {
                                int level = 3;
                                if (code.Substring(2, 4) == "0000")
                                {
                                    level = 1;
                                }
                                else if (code.Substring(4, 2) == "00")
                                {
                                    level = 2;
                                }
                                var tempBson = new BsonDocument().Add("code", code).Add("level", level.ToString()).Add("isUse", "2");
                                if (level == 1)
                                {
                                    tempBson.Add("fullName", name).Add("provinceName", name);
                                }
                                else if (level == 2)
                                {
                                    string firstCode = code.Substring(0, 2);
                                    var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                    tempBson.Add("fullName", name).Add("provinceName", provinceName).Add("cityName", name.Replace(provinceName, ""));
                                }
                                else if (level == 3)
                                {
                                    string firstCode = code.Substring(0, 2);
                                    string secodeCode = code.Substring(2, 2);
                                    var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                    var cityName = allRegionList.Where(t => t.String("code") == (firstCode + secodeCode + "00")).FirstOrDefault().String("cityName");
                                    var countyName = (cityName == "市辖区" || cityName == "县") ? name.Replace(provinceName, "") : name.Replace(provinceName + cityName, "");
                                    tempBson.Add("fullName", name).Add("provinceName", provinceName).Add("cityName", cityName).Add("countyName", countyName);
                                }
                                result = dataOp.Insert("AdministrativeRegion", tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (isNew)
                    {
                        foreach (var region in regionTable.OrderBy(t => t["编码"].ToString().Trim()))
                        {
                            string code = region["编码"].ToString().Trim();
                            string name = region["名称"].ToString().Trim();

                            var regionBson = allRegionList.Where(t => t.String("code") == code).FirstOrDefault();
                            int level = 3;
                            if (code.Substring(2, 4) == "0000")
                            {
                                level = 1;
                            }
                            else if (code.Substring(4, 2) == "00")
                            {
                                level = 2;
                            }
                            var tempBson = new BsonDocument().Add("code", code).Add("level", level.ToString()).Add("isUse", "1");
                            if (level == 1)
                            {
                                tempBson.Add("fullName", name).Add("provinceName", name);
                            }
                            else if (level == 2)
                            {
                                string firstCode = code.Substring(0, 2);
                                var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                tempBson.Add("fullName", provinceName + name).Add("provinceName", provinceName).Add("cityName", name);
                            }
                            else if (level == 3)
                            {
                                string firstCode = code.Substring(0, 2);
                                string secodeCode = code.Substring(2, 2);
                                var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                var cityName = allRegionList.Where(t => t.String("code") == (firstCode + secodeCode + "00")).FirstOrDefault().String("cityName");
                                cityName = (cityName == "直辖市" || cityName == "县") ? "" : cityName;
                                tempBson.Add("fullName", provinceName + cityName + name).Add("provinceName", provinceName).Add("cityName", cityName).Add("countyName", name);
                            }
                            if (regionBson.IsNullOrEmpty())
                            {
                                result = dataOp.Insert("AdministrativeRegion", tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                            else
                            {
                                result = dataOp.Update("AdministrativeRegion", Query.EQ("code", code), tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Remove(regionBson);
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                        }
                        var notUsedIdList = allRegionList.Where(t => !newRegionIdList.Contains(t.String("regionId"))).Select(t => (BsonValue)t.String("region")).ToList();
                        dataOp.Update("AdministrativeRegion", Query.In("regionId", notUsedIdList), new BsonDocument().Add("isUse", "2"));
                    }
                    else
                    {
                        foreach (var region in regionTable.OrderBy(t => t["编码"].ToString().Trim()))
                        {
                            string code = region["编码"].ToString().Trim();
                            string name = region["名称"].ToString().Trim();

                            var regionBson = allRegionList.Where(t => t.String("code") == code).FirstOrDefault();
                            if (regionBson.IsNullOrEmpty())
                            {
                                int level = 3;
                                if (code.Substring(2, 4) == "0000")
                                {
                                    level = 1;
                                }
                                else if (code.Substring(4, 2) == "00")
                                {
                                    level = 2;
                                }
                                var tempBson = new BsonDocument().Add("code", code).Add("level", level.ToString()).Add("isUse", "2");
                                if (level == 1)
                                {
                                    tempBson.Add("fullName", name).Add("provinceName", name);
                                }
                                else if (level == 2)
                                {
                                    string firstCode = code.Substring(0, 2);
                                    var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                    tempBson.Add("fullName", provinceName + name).Add("provinceName", provinceName).Add("cityName", name);
                                }
                                else if (level == 3)
                                {
                                    string firstCode = code.Substring(0, 2);
                                    string secodeCode = code.Substring(2, 2);
                                    var provinceName = allRegionList.Where(t => t.String("code") == (firstCode + "0000")).FirstOrDefault().String("provinceName");
                                    var cityName = allRegionList.Where(t => t.String("code") == (firstCode + secodeCode + "00")).FirstOrDefault().String("cityName");
                                    cityName = (cityName == "直辖市" || cityName == "县") ? "" : cityName;
                                    tempBson.Add("fullName", provinceName + cityName + name).Add("provinceName", provinceName).Add("cityName", cityName).Add("countyName", name);
                                }
                                result = dataOp.Insert("AdministrativeRegion", tempBson);
                                if (result.Status == Status.Successful)
                                {
                                    allRegionList.Add(result.BsonInfo);
                                    newRegionIdList.Add(result.BsonInfo.String("regionId"));
                                }
                                else
                                {
                                    return Json(TypeConvert.InvokeResultToPageJson(result));
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                result.Status = Status.Failed;
                result.Message = e.Message;
            }
            return Json(TypeConvert.InvokeResultToPageJson(result));
        }
        #endregion

        #region 获取Json数据同时获取关联表个数
        /// <summary>
        /// 获取简单表的Json列表以及外键对应关联数据个数
        /// </summary>
        /// <param name="tbName">表名</param>
        /// <param name="ps">每页条数(默认20,-1不翻页)</param>
        /// <param name="cu">当前页</param>
        /// <param name="qu">查询语句(原生查询)</param>
        /// <param name="of">排序字段</param>
        /// <param name="ot">排序类型(空正序,desc倒序)</param>
        /// <param name="kc">kc(外键0外键对应表0对应关联表字段)</param>
        /// <returns></returns>
        public ActionResult GetSingleTableJsonWithCount(string tbName, int? ps, int? cu, string qu, string of, string ot, string kc)
        {
            int pageSize = (ps != null && ps.HasValue && ps.Value != 0) ? ps.Value : 20;
            int current = (cu != null && cu.HasValue && cu.Value != 0) ? cu.Value : 1;

            string query = qu != null ? qu : "";
            string orderField = of != null ? of : "";
            string orderType = ot != null ? ot : "";
            string keyCount = kc != null ? kc : "";   //同时获取关联数据的个数
            var queryComp = TypeConvert.NativeQueryToQuery(query);

            List<BsonDocument> allDocList = new List<BsonDocument>();
            if (tbName != null && tbName != "")
            {
                allDocList = queryComp != null ? dataOp.FindAllByQuery(tbName, queryComp).ToList() : dataOp.FindAll(tbName).ToList();
            }

            //2015.8.26添加新城控股地产权限判断
            if (SysAppConfig.CustomerCode == CustomerCode.XC)
            {
                allDocList = allDocList.Where(c => AreaTypeIdFilterFunc(c, PageReq.GetParamInt("BusOrgAreaTypeId"))).ToList();
            }
            if (tbName == "Material_Standardization")//现价库添加版本需要过滤isUpdated功能
            {
                allDocList = allDocList.Where(c => c.Int("isUpdated") != 1).ToList();
            }

            int allCount = allDocList.Count();

            if (orderField != null && orderField != "")
            {
                if (orderType != null && orderType == "desc")
                {
                    allDocList = allDocList.OrderByDescending(t => t.String(orderField)).ToList();
                }
                else
                {
                    allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                }
            }


            List<Hashtable> retList = new List<Hashtable>();

            if (pageSize != -1)
            {
                allDocList = allDocList.Skip((current - 1) * pageSize).Take(pageSize).ToList();
            }

            string[] keyCountStr = new string[3];
            var foreignDataDic = new Dictionary<string, IGrouping<string, BsonDocument>>();
            if (keyCount != "")
            {
                keyCountStr = keyCount.Split(new string[] { "0" }, StringSplitOptions.RemoveEmptyEntries);
                IMongoQuery matQuery = Query.In(keyCountStr[2], allDocList.Select(o => (BsonValue)o.String(keyCountStr[0])));
                if (SysAppConfig.CustomerCode == CustomerCode.SS || SysAppConfig.CustomerCode == CustomerCode.LR)   // 三盛过滤历史材料及具体材料
                {
                    matQuery = Query.And(matQuery, Query.EQ("type", "1"), Query.NE("isUpdated", "1"));
                }
                var foreignData = dataOp.FindAllByQuery(keyCountStr[1], matQuery).ToList();
                foreignDataDic = foreignData.GroupBy(t => t.String(keyCountStr[2])).ToDictionary(x => x.Key, y => y);
            }
            foreach (var tempDoc in allDocList)
            {
                tempDoc.Add("allCount", allCount.ToString());
                tempDoc.Remove("_id");
                if (keyCount != "")
                {
                    if (foreignDataDic.ContainsKey(tempDoc.String(keyCountStr[0])))
                    {
                        tempDoc.Add(keyCount, foreignDataDic[tempDoc.String(keyCountStr[0])].Count().ToString());
                    }
                    else
                    {
                        tempDoc.Add(keyCount, "0");
                    }
                }
                retList.Add(tempDoc.ToHashtable());
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }
        #endregion

        /// <summary>
        /// 获取简单表的Json列表 （只返回id和特定字段）
        /// </summary>
        /// <param name="tbName">查找表</param>
        /// <param name="fields">查找字段</param>
        /// <returns></returns>
        public ActionResult GetSingleTableJsonWithFields(string tbName, string fields, int? ps,int? cu, string qu, string of,string ot)
        {
            int pageSize = (ps != null && ps.HasValue && ps.Value != 0) ? ps.Value : 20;
            int current = (cu != null && cu.HasValue && cu.Value != 0) ? cu.Value : 1;
            string query = qu ?? "";
            string orderField = of ?? "";
            string orderType = ot ?? "";

            var queryComp = TypeConvert.NativeQueryToQuery(query);

            List<Hashtable> retList = new List<Hashtable>();
            if (!string.IsNullOrEmpty(tbName))
            {
                var tbRule = new TableRule(tbName);
                var allDocList = queryComp == null ? dataOp.FindAll(tbName).ToList() : dataOp.FindAllByQuery(tbName, queryComp).ToList();
                var fieldList = fields.Split(',').ToList();
                var tempBson = new BsonDocument();

                int allCount = allDocList.Count;

                if (!string.IsNullOrEmpty(orderField))
                {
                    if (orderType != null)
                    {
                        switch (orderType)
                        {
                            case "desc":
                                allDocList = allDocList.OrderByDescending(t => t.String(orderField)).ToList();
                                break;
                            case "int":
                                allDocList = allDocList.OrderBy(t => t.Int(orderField)).ToList();
                                break;
                            case "intd":
                                allDocList = allDocList.OrderByDescending(t => t.Int(orderField)).ToList();
                                break;
                            default:
                                allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                                break;
                        }
                    }
                    else
                    {
                        allDocList = allDocList.OrderBy(t => t.String(orderField)).ToList();
                    }
                }

                if (pageSize != -1)
                {
                    allDocList = allDocList.Skip((current - 1) * pageSize).Take(pageSize).ToList();
                }

                foreach (var tempDoc in allDocList)
                {
                    tempBson = new BsonDocument();
                    tempBson.Add("id", tempDoc.String(tbRule.PrimaryKey));
                    foreach (var field in fieldList)
                    {
                        tempBson.Add(field, tempDoc.String(field));
                    }
                    retList.Add(tempBson.ToHashtable());
                }
            }

            return this.Json(retList, JsonRequestBehavior.AllowGet);
        }

        #region 判断是否包含中文字符
        /// <summary>
        /// 判断是否包含中文字符
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public bool IsContainsZH(string text) { 
            for (int i = 0; i < text.Length; i++)
            {
                if (Regex.IsMatch(text[i].ToString(), @"[\u4e00-\u9fbb]+"))
                {
                    return true;
                }
            }
            return false;
        }
        #endregion 判断是否包含中文字符

        #region 删除用于预览的文件
        public void DelTempFile()
        {
            if (Directory.Exists(Server.MapPath("~/PreviewTempFiles/"))) Directory.Delete(Server.MapPath("~/PreviewTempFiles/"), true);
        }
        #endregion

        #region  快速切换角色（编辑/查看）
        public ActionResult QuickSwichEditViewMode(FormCollection saveForm) 
        {
            PageJson json=new PageJson();
            string url = saveForm["url"] as string;

            if (url == null) 
            {
                json.Success=false;
                json.Message="传入地址有误,请刷新后重试或联系管理员!";
                return Json( json);
            }
            url = Server.UrlDecode(url);
            List<string> addressList = url.Split(new string[] { "#" }, StringSplitOptions.RemoveEmptyEntries).ToList();
            List<IMongoQuery> queryList = new List<IMongoQuery>();
            if (addressList.Count() == 2) 
            {
                string anchorName = addressList[1];
                queryList.Add(Query.EQ("anchorName", anchorName));
            }
            Uri urlObj = new Uri(url);

          
            Dictionary<string, string> paramValueDC = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty( urlObj.Query) ) 
            {
                var tempParam = urlObj.Query;
                // 开始分析参数对    
                Regex re = new Regex(@"(^|&)?(\w+)=([^&]+)(&|$)?", RegexOptions.Compiled);
                MatchCollection mc = re.Matches(tempParam);

                foreach (Match m in mc)
                {
                    paramValueDC.Add(m.Result("$2"), m.Result("$3"));
                }        

            }
            var absolutePathArr = urlObj.AbsolutePath.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
            string controllerName = absolutePathArr[0];
            string ascxName = absolutePathArr[1] as string;
            queryList.Add(Query.EQ("controller", controllerName));
            queryList.Add(Query.EQ("ascxName", ascxName));
            var query = Query.And(queryList.ToArray());

            List<BsonDocument> jumpUrlList=dataOp.FindAllByQuery("EditViewModeSwitch",query).ToList();
            List<BsonDocument> urlBsonList = new List<BsonDocument>();
            foreach (var tempUrl in jumpUrlList) 
            {
                var tempUrlInfo =tempUrl.String("jumpAddress");
                var curFixParamList = tempUrl.String("fixParams").Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);//固定参数
                var curFixParamValue = tempUrl.BsonDocumentList("fixParamsValue").FirstOrDefault();
                foreach (var tempFixValue in curFixParamList)
                {
                    tempUrlInfo = string.Format("{0}&{1}={2}", tempUrlInfo, tempFixValue, curFixParamValue.String(tempFixValue));
                }

                var curDynamicParam = tempUrl.String("dynamicParams").Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);//动态参数;
                foreach (var tempParam in curDynamicParam)
                {
                    if (paramValueDC.ContainsKey(tempParam))
                    {
                        tempUrlInfo = string.Format("{0}&{1}={2}", tempUrlInfo, tempParam, paramValueDC[tempParam]);
                    }
                    else 
                    {

                    }
                }
                
                urlBsonList.Add(new BsonDocument(){
                {"name",tempUrl.String("name")},
                {"isDefault",tempUrl.String("isDefault")}
                ,{"url",   HttpUtility.UrlEncode(tempUrlInfo)},
                {"http",""}});

            }

            if (urlBsonList.Count() == 0)
            {
                json.Success = true;
                json.Message = "无跳转地址！";
            }
            else
            {
                var result = new InvokeResult<List<BsonDocument>>();
                TypeConvert.InvokeResultToPageJson(result);
                json.htInfo = new Hashtable();
                json.htInfo.Add("urlList", urlBsonList.ToJson());
                json.Success = true;
                json.Message = "获取地址成功！";

            }
            return Json(json);
        }
        #endregion
        #region
        /// <summary>
        /// 获取code
        /// </summary>
        /// <returns></returns>
        public ActionResult GetSystemCodeSession()
        {
            PageJson json = new PageJson();
            var systemId = PageReq.GetString("systemId");
            var system = dataOp.FindOneByQuery("CustomerSystem", Query.EQ("systemId", systemId));
            if (string.IsNullOrEmpty(system.String("code")))
            {
                json.Success = false;
                json.Message = "发生未知错误，请联系管理员";
                return Json(json);
            }
            Session["code"] = system.String("code");
            json.Success = true;
            return Json(json);
        }
        #endregion

        #region  查找所有系统所有树形表是否存在相同的nodeKey
        public ActionResult FindAllTreeHasSameNodeKeyTable(string strconn,string dbName) 
        {
            //创建数据库链接  
            MongoServer server = MongoDB.Driver.MongoServer.Create(strconn); 
            string ENTER = "\r\n";  
            //获得数据库  
            MongoDatabase db = server.GetDatabase(dbName);
            var allTableName= db.GetCollectionNames().ToList();
            StringBuilder sb = new StringBuilder("<table class='p-tableborder'><tr><td>表名</td><td>是否有重复nodeKey</td><td><td></tr>");
            List<string> nodeKey = new List<string>();
            foreach (var temp in allTableName) 
            {
                List<BsonDocument> sameBson = new List<BsonDocument>();
                List<BsonDocument> parentNode=new List<BsonDocument>();
                var allData = db.GetCollection(temp);
                var result = allData.FindAllAs<BsonDocument>().ToList();
                bool isTree = false;
                bool isHasSame = false;
                foreach (BsonDocument bson in (List<BsonDocument>)result)  
                {

                    if (bson.Contains("nodeKey")) 
                    { 
                        //sb.Append(temp + ENTER);
                        isTree = true;
                        break;
                    };
                }
                if (isTree) 
                {
                    parentNode = result.Where(x => x.String("nodePid") == "0").ToList();
                    nodeKey = parentNode.Select(x => x.String("nodeKey")).Distinct().ToList();
                    if (parentNode.Count() > nodeKey.Count()) 
                    {
                        sb.Append("<tr class='p-tableborder-title' isHasSame='1' ><td>" + temp + "</td><td>" + "是" + "</td><td><input type='text'  /></td><tr>");
                        isHasSame = true;

                    }
                }
                //if(isHasSame)
                //{
                //    int maxNodeOrder = parentNode.Max(x => x.Int("nodeOrder"));
                //    foreach (var tempNodeKey in nodeKey) 
                //    {
                //        List<BsonDocument> curData = result.Where(x => x.String("nodeKey") == tempNodeKey).ToList();
                //        if (curData.Count > 2)
                //        {
                //            sameBson.AddRange(curData);
                //        }
                //    }
                //    foreach (var tempBson in sameBson) 
                //    {
                //        List<BsonDocument> chlidren = new List<BsonDocument>();
                //        chlidren=result.Where(x => x.String("nodePid") == tempBson.String("")).ToList();
                //    }
                //}

            }
            PageJson json = new PageJson();
            json.Message = sb.ToString();
            json.Success = true;
            return Json(json);

        }
        public JsonResult ModifySameNodeKeyTable(string strconn, string dbName, string tableNameAndKeyName) 
        {
            //创建数据库链接  
            MongoServer server = MongoDB.Driver.MongoServer.Create(strconn);
            string ENTER = "\r\n";
            //获得数据库  
            MongoDatabase db = server.GetDatabase(dbName);
            StringBuilder sb = new StringBuilder("");
            var tableInfo = tableNameAndKeyName.Split(new string[] { "#MZ#" }, StringSplitOptions.RemoveEmptyEntries);
            Dictionary<string, string> tableInfoDC = new Dictionary<string, string>();
            
            foreach (var tempInfo in tableInfo) 
            {
                var singleTableInfo = tempInfo.Split(new string[] { "|MZ|" }, StringSplitOptions.RemoveEmptyEntries);
                if (singleTableInfo.Length == 2) 
                {
                    if (!tableInfoDC.ContainsKey(singleTableInfo[0]))
                    {
                        tableInfoDC.Add(singleTableInfo[0], singleTableInfo[1]);
                    }
                }
            }
            foreach (var tempDC in tableInfoDC)
            {
                List<StorageData> dataList = new List<StorageData>();
                var allData = db.GetCollection(tempDC.Key);
                var result = allData.FindAllAs<BsonDocument>().ToList();
                var parentNode = result.Where(x => x.String("nodePid") == "0").ToList();
                var  nodeKey = parentNode.Select(x => x.String("nodeKey")).Distinct().ToList();  //查找所有父节点nodekey
                int maxNodeOrder = parentNode.Max(x => x.Int("nodeOrder"));
                List<BsonDocument> sameBson = new List<BsonDocument>();
                foreach (var tempNodeKey in nodeKey)
                {
                    List<BsonDocument> curData = result.Where(x => x.String("nodeKey") == tempNodeKey).ToList();
                    if (curData.Count > 1)
                    {
                        sameBson.AddRange(curData);
                    }
                }
                foreach (var tempBson in sameBson)
                {
                    maxNodeOrder++;
                    var curNodeKey= tempBson.String("nodeKey");
                    var newNodeKey = maxNodeOrder.ToString().PadLeft(6, '0');
                    tempBson.Set("nodeKey", newNodeKey);
                    tempBson.Set("nodeOrder", maxNodeOrder.ToString());
                    dataList.Add(new StorageData()
                    {
                        Type = StorageType.Update,
                        Query = Query.EQ(tempDC.Value, tempBson.String(tempDC.Value)),
                        Document = tempBson,
                        Name = tempDC.Key
                    });
                    List<BsonDocument> chlidren = new List<BsonDocument>();
                    chlidren = result.Where(x => x.String("nodePid") == tempBson.String(tempDC.Value)).ToList();
                    if (chlidren.Count()>0) 
                    {
                         dataList.AddRange(RecurModifySame(chlidren, newNodeKey, tempDC.Key, tempDC.Value,result));
                    }
                    MongoCollection<BsonDocument> entityColl = db.GetCollection(tempDC.Key);
                    var  entityList = entityColl.FindAll().ToList();
                    foreach (var temp in dataList)
                    {
                        if (result.Find(x => x.String("_id") == temp.Document.String("_id")).Count()>0)
                        allData.Save(temp.Document);
                    }
                }
            }
            PageJson json = new PageJson();
            json.Message = sb.ToString();
            json.Success = true;
            return Json(json, JsonRequestBehavior.AllowGet); 
        }
        public List<StorageData> RecurModifySame(List<BsonDocument> childList,string nodeKey,string tableName, string keyName,List<BsonDocument> bsonList) 
        {
            List<StorageData> dataList = new List<StorageData>();
            foreach (var tempBson in childList) 
            {
                var curNodeKey= tempBson.String("nodeKey");
                var lastNodeKey = curNodeKey.Substring(6, curNodeKey.Length-6);
                var newNodeKey = nodeKey + lastNodeKey;
                tempBson.Set("nodeKey",newNodeKey);
                dataList.Add(new StorageData()
                {
                    Type = StorageType.Update,
                    Query = Query.EQ(keyName, tempBson.String(keyName)),
                    Document = tempBson,
                    Name = tableName
                });
                List<BsonDocument> chlidren = new List<BsonDocument>();
                chlidren = bsonList.Where(x => x.String("nodePid") == tempBson.String(keyName)).ToList();
                if (chlidren.Count() > 0)
                {
                  dataList.AddRange(RecurModifySame(chlidren, nodeKey, tableName, keyName, bsonList));
                }
            }
            return dataList;
        } 

        #endregion
    }
}
