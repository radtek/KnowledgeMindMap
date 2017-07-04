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


namespace MZ.BusinessLogicLayer
{

    /// <summary>
    /// 操作枚举
    /// </summary>
    public enum MindMapOperateType
    {
        /// <summary>
        /// 搜索关键字
        /// </summary>
        [EnumDescription("搜索")]
        Search = 0,
        /// <summary>
        /// 搜索关键字
        /// </summary>
        [EnumDescription("编辑脉络图")]
        EditMindMap = 1,
        /// <summary>
        /// 搜索关键字
        /// </summary>
        [EnumDescription("查看脉络图")]
        ViewMindMap =2,
        /// <summary>
        /// 查看文章
        /// </summary>
        [EnumDescription("查看文章")]
        ViewArticle = 3,
        /// <summary>
        /// 编辑文章
        /// </summary>
        [EnumDescription("编辑文章")]
        EditArticle = 4,
        /// <summary>
        /// 查看文章
        /// </summary>
        [EnumDescription("创建标签")]
        CreateLabel = 5,
        /// <summary>
        /// 上传文档
        /// </summary>
        [EnumDescription("查看标签")]
        ViewLabel = 6,
        /// <summary>
        /// 上传文档
        /// </summary>
        [EnumDescription("上传文档")]
        UpLoad =7,
        /// <summary>
        /// 收藏
        /// </summary>
        [EnumDescription("收藏")]
        Favoriate =8,
        /// <summary>
        /// 收藏
        /// </summary>
        [EnumDescription("点赞")]
        Praise = 9,
        /// <summary>
        /// 搜索关键字
        /// </summary>
        [EnumDescription("删除脉络图")]
        DeleteMindMap = 10,
        
    }

    /// <summary>
    /// 知识脉络图
    /// </summary>
    public class MindMapBll
    {
        #region 构造函数
        /// <summary>
        /// 类私有变量
        /// </summary>
        private DataOperation dataOp = null;

        /// <summary>
        /// 封闭当前默认构造函数
        /// </summary>
        public MindMapBll()
        {
            dataOp = new DataOperation();
        }

        /// <summary>
        /// 封闭当前默认构造函数
        /// </summary>
        private MindMapBll(DataOperation ctx)
        {
            dataOp = ctx;
        }


        /// <summary>
        /// 构造器
        /// </summary>
        /// <returns></returns>
        public static MindMapBll _()
        {
            return new MindMapBll();
        }

        /// <summary>
        /// 构造器
        /// </summary>
        /// <returns></returns>
        public static MindMapBll _(DataOperation ctx)
        {
            return new MindMapBll(ctx);
        }
        #endregion

        #region 查询
        /// <summary>
        /// 通过Id查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public BsonDocument FindMindMapById(string id)
        {
            var query=Query.And(Query.NE("deleteStatus","1"),Query.EQ("mindMapId", id));
            return dataOp.FindOneByQuery("MindMapLibrary", query);
        }
        /// <summary>
        /// 通过name查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool HasExistMindMapName(string id,string name)
        {
            var query = Query.And(Query.NE("deleteStatus", "1"), Query.NE("mindMapId", id), Query.EQ("name", name));
            return dataOp.FindCount("MindMapLibrary", query) > 0;
        }
       
       
        /// <summary>
        /// 通过Id查找脉络图轨迹
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelTraceById(string mindMapId)
        {
            return dataOp.FindAllByQuery("MindMapLabelTrace", Query.EQ("mindMapId", mindMapId)).ToList();
        }
        /// <summary>
        /// 通过Id查找脉络图轨迹
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelTraceById(params string[] mindMapIds)
        {
            return dataOp.FindAllByQuery("MindMapLabelTrace", Query.In("mindMapId", mindMapIds.Select(c=>(BsonValue)c))).ToList();
        }

        /// <summary>
        /// 查找标签所属脉络图Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> FindMindMapIdsByLabelId(string labelId)
        {
            var existQuery1 =  Query.EQ("preLabelId", labelId);
            var existQuery2 =  Query.EQ("sucLabelId", labelId);
            //判断是否已经关联
            var result = dataOp.FindAllByQuery("MindMapLabelTrace", Query.Or(existQuery1, existQuery2)).SetFields("mindMapId").Select(c=>c.Text("mindMapId")).ToList();
            return result;
        }

        /// <summary>
        /// 查找已经建立关联标签所属脉络图Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> FindMindMapIdsByLabelId(string preLabelId, string sucLabelId)
        {
            var existQuery1 = Query.And(Query.EQ("preLabelId", preLabelId), Query.EQ("sucLabelId", sucLabelId));
            var existQuery2 = Query.And(Query.EQ("sucLabelId", preLabelId), Query.EQ("preLabelId", sucLabelId));
            //判断是否已经关联
            var result = dataOp.FindAllByQuery("MindMapLabelTrace", Query.Or(existQuery1, existQuery2)).SetFields("mindMapId").Select(c => c.Text("mindMapId")).ToList();
            return result;
        }
        /// <summary>
        /// 查看是否存在关联
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool ExistMindMapLabelRelation(string preLabelId, string sucLabelId)
        {
            var existQuery1 = Query.And(Query.EQ("preLabelId", preLabelId), Query.EQ("sucLabelId", sucLabelId));
            var existQuery2 = Query.And(Query.EQ("sucLabelId", preLabelId), Query.EQ("preLabelId", sucLabelId));
            //判断是否已经关联
            var existRelationCount = dataOp.FindCount("MindMapLabelTrace", Query.Or(existQuery1, existQuery2));
            return existRelationCount>0;
        }
        
        /// <summary>
        /// 查看是否存在关联
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool ExistMindMapLabelRelation(string mindMapId,string preLabelId, string sucLabelId)
        {
            var existQuery1 = Query.And(Query.EQ("preLabelId", preLabelId), Query.EQ("sucLabelId", sucLabelId));
            var existQuery2 = Query.And(Query.EQ("sucLabelId", preLabelId), Query.EQ("preLabelId", sucLabelId));
            //判断是否已经关联
            var existRelationCount = dataOp.FindCount("MindMapLabelTrace", Query.And(Query.EQ("mindMapId", mindMapId), Query.Or(existQuery1, existQuery2)));
            return existRelationCount > 0;
        }
       
        /// <summary>
        /// 通过关键字查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapByKeyWord(string keyWord)
        {
            if (string.IsNullOrEmpty(keyWord)) return new List<BsonDocument>();
            var query=Query.And(Query.NE("deleteStatus","1"),Query.Or(Query.Matches("labelCollection", new Regex(keyWord,RegexOptions.IgnoreCase))));
            return dataOp.FindAllByQuery("MindMapLibrary", query).ToList();
        }

        /// <summary>
        /// 通过关键字查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapList()
        {
            return dataOp.FindAllByQuery("MindMapLibrary",Query.NE("deleteStatus","1")).OrderByDescending(c=>c.Date("createDate")).ToList();
        }
        /// <summary>
        /// 通过用户查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapByUserId(string userId)
        {
            var query=Query.And(Query.NE("deleteStatus","1"), Query.EQ("userId", userId));
            return dataOp.FindAllByQuery("MindMapLibrary", query).ToList();
        }

        /// <summary>
        /// 通过获取标签列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public  BsonDocument  FindMindMapLabelCollectionByLabId(string labId)
        {
            return dataOp.FindOneByQuery("MindMapLabelCollection", Query.EQ("labelId", labId));
        }
        /// <summary>
        /// 通过获取标签列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelCollectionByLabIds(List<string> labIds)
        {
            return dataOp.FindAllByQuery("MindMapLabelCollection", Query.In("labelId", labIds.Select(c=>(BsonValue)c))).ToList();
        }

        /// <summary>
        /// 通过获取标签忽略大小写
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public BsonDocument  FindMindMapLabelCollectionByName(string name)
        {
            var query = Query.And(Query.NE("deleteStatus", "1"), Query.Or(Query.EQ("name", GetFullMathNameRegex(name))));
            var hitLabel = dataOp.FindOneByQuery("MindMapLabelCollection", query);
            return hitLabel;
        }

        /// <summary>
        /// 通过name查找标签忽略大小写
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool HasExistMindMapLabelCollection(string id, string name)
        {
            var query = Query.And(Query.NE("deleteStatus", "1"), Query.NE("labelId", id), Query.Or(Query.EQ("name",  GetFullMathNameRegex(name))));
            var hitLabelCount = dataOp.FindCount("MindMapLabelCollection", query);
            return hitLabelCount > 0;
        }
        private Regex GetFullMathNameRegex(string name)
        {
            return new Regex(@"^" + name + @"$", RegexOptions.IgnoreCase);
        }

        private Regex GetMatchNameRegex(string name)
        {
            return new Regex(@"" + name + @"", RegexOptions.IgnoreCase);
        }
        /// <summary>
        /// 通过获取标签列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelCollectionByName(List<string> nameList)
        {
            QueryComplete query= null;
            foreach (var name in nameList)
            {
                if (query == null)
                {
                    query = Query.EQ("name", GetFullMathNameRegex(name));
                }
                else
                {
                    query = Query.Or(Query.EQ("name", GetFullMathNameRegex(name)), query);
                }
            }
            if(query!=null){
            return dataOp.FindAllByQuery("MindMapLabelCollection", query).ToList();
            }else
            {
            return new List<BsonDocument>();
            }
        }

        /// <summary>
        /// 通过获取标签列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelCollectionByKeyWord(string  keyWord)
        {
            if (string.IsNullOrEmpty(keyWord)) return new List<BsonDocument>();
            var query = Query.And(Query.NE("deleteStatus", "1"), Query.Or(Query.Matches("name", new Regex(keyWord, RegexOptions.IgnoreCase))));
            return dataOp.FindAllByQuery("MindMapLabelCollection", query).ToList();
            
        }
        /// <summary>
        /// 通过关键字查找脉络图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapLabelCollectionByKeyWord(string keyWord,int top)
        {
            if (string.IsNullOrEmpty(keyWord)) return new List<BsonDocument>();
            return dataOp.FindLimitFieldsByQuery("MindMapLabelCollection", Query.Matches("name", new Regex(keyWord, RegexOptions.IgnoreCase)), new SortByDocument(), 0, top, new string[] { "name", "labelId" }).ToList();
        }

        /// <summary>
        /// 获取作为中心的节点,可能有多个？
        /// </summary>
        /// <param name="mindMapId"></param>
        /// <returns></returns>
        public string GetMindMapCenterLabelId(string mindMapId)
        {
            var mindMap=FindMindMapById(mindMapId);
            var centerLabelId = mindMap.Text("centerLabelId");
            if (string.IsNullOrEmpty(centerLabelId))
            { 
                var firstObj= dataOp.FindAllByQuery("MindMapLabelTrace", Query.And(Query.EQ("isFirst","1"),Query.EQ("mindMapId", mindMapId))).OrderBy(c=>c.Date("createDate")).FirstOrDefault();
                if (firstObj != null)
                {
                    centerLabelId = firstObj.Text("preLabelId");
                }
            }
            return centerLabelId;
        }

        /// <summary>
        /// 获取作为中心的节点,可能有多个？
        /// </summary>
        /// <param name="mindMapId"></param>
        /// <returns></returns>
        public List<string> GetMindMapCenterLabelId(List<BsonDocument>LabelList, string keyWord)
        {
            if (!string.IsNullOrEmpty(keyWord))
            {
                var hitResult = LabelList.Where(c => c.Text("name").ToLower().Contains(keyWord.ToLower())).ToList();
                #region 关键字匹配到中心标签，进行热门标签索引
                UpdateLabelSearchCount(hitResult);
                #endregion
                return hitResult.Select(c => c.Text("labelId")).ToList();
            }
            else
            {
                return new List<string>();
            }
        }

        /// <summary>
        /// 获取脉络图中所有的标签节点
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <returns></returns>
        public List<string> GetMindMapLabelCollection(string mindMapId)
        {
            ///获取脉络图边
            var hitMapLabelList = dataOp.FindAllByQuery("MindMapLabelTrace", Query.EQ("mindMapId", mindMapId)).OrderBy(c => c.Date("createDate")).ToList();
            ///获取涉及的标签列表
            var hitsucLabelIds = hitMapLabelList.Select(c => c.Text("sucLabelId")).ToList();
            var hitpreLabelIds = hitMapLabelList.Select(c => c.Text("preLabelId")).ToList();
            var allLabelIds = new List<string>();
            allLabelIds.AddRange(hitsucLabelIds);
            allLabelIds.AddRange(hitpreLabelIds);
            return allLabelIds;
        }
        /// <summary>
        /// 获取脉络图中所有的标签节点
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <returns></returns>
        public List<string> GetMindMapLabelCollection(params string[] mindMapIds)
        {
            ///获取脉络图边
            var hitMapLabelList = dataOp.FindAllByQuery("MindMapLabelTrace", Query.In("mindMapId", mindMapIds.Select(c=>(BsonValue)c))).OrderBy(c => c.Date("createDate")).ToList();
            ///获取涉及的标签列表
            var hitsucLabelIds = hitMapLabelList.Select(c => c.Text("sucLabelId")).ToList();
            var hitpreLabelIds = hitMapLabelList.Select(c => c.Text("preLabelId")).ToList();
            var allLabelIds = new List<string>();
            allLabelIds.AddRange(hitsucLabelIds);
            allLabelIds.AddRange(hitpreLabelIds);
            return allLabelIds;
        }

        /// <summary>
        /// 获取相邻的标签节点
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <param name="centerLabelId">中心节点</param>
        /// <returns></returns>
        public List<string> GetNextMindMapLabelCollectionByLabelId(string mindMapId,string centerLabelId)
        {
            return GetNextMindMapLabelCollectionByLabelId(new List<string>() { mindMapId }, centerLabelId);
        }
        /// <summary>
        /// 获取相邻的标签节点
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <param name="centerLabelId">中心节点</param>
        /// <returns></returns>
        public List<string> GetNextMindMapLabelCollectionByLabelId(List<string> mindMapIds, string centerLabelId)
        {
            var hitsucLabelIds =new List<string>();
            var hitpreLabelIds =new List<string>();
            QueryComplete preQuery=null;
            QueryComplete sucQuery=null;
            if (mindMapIds!=null&&mindMapIds.Count > 0)
            {
                var mindMapQuery = Query.In("mindMapId", mindMapIds.Select(c => (BsonValue)c));
                preQuery = Query.And(mindMapQuery, Query.EQ("preLabelId", centerLabelId));
                sucQuery = Query.And(mindMapQuery, Query.EQ("sucLabelId", centerLabelId));
            }
            else
            {
                preQuery = Query.EQ("preLabelId", centerLabelId);
                sucQuery = Query.EQ("sucLabelId", centerLabelId);
            }
            //获取想关联节点
            var preResult = dataOp.FindAllByQuery("MindMapLabelTrace", preQuery).OrderBy(c => c.Date("createDate")).ToList();
            var sucResult = dataOp.FindAllByQuery("MindMapLabelTrace", sucQuery).OrderBy(c => c.Date("createDate")).ToList();
            ///获取涉及的标签列表
            hitsucLabelIds = preResult.Select(c => c.Text("sucLabelId")).ToList();
            hitpreLabelIds = sucResult.Select(c => c.Text("preLabelId")).ToList();
          
            var allLabelIds = new List<string>();
            allLabelIds.AddRange(hitsucLabelIds);
            allLabelIds.AddRange(hitpreLabelIds);
            return allLabelIds;
        }
        /// <summary>
        /// 获取相邻的标签节点,过滤已经存在的标签ID
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <param name="centerLabelId">中心节点</param>
        /// <returns></returns>
        public List<string> GetNextMindMapLabelCollectionByLabelId(string mindMapId, string centerLabelId, List<string> filterIds)
        {
            ///获取脉络图边
            var allLabelIds=GetNextMindMapLabelCollectionByLabelId(mindMapId, centerLabelId);
            allLabelIds = allLabelIds.Where(c => !filterIds.Contains(c)).ToList();
            return allLabelIds;
        }


        /// <summary>
        /// 获取3级相邻的标签节点,过滤已经存在的标签ID
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <param name="centerLabelId">中心节点</param>
        /// <returns></returns>
        public List<BsonDocument> InitialMindMapLabelCollectionByLabelId(string mindMapId, string centerLabelId)
        {
            List<BsonDocument> resultList = new List<BsonDocument>();
            List<string> filterIds = new List<string>();
            filterIds.Add(centerLabelId);
            resultList.Add(new BsonDocument().Add("labelId", centerLabelId).Add("type", "1"));
            ///获取脉络图边
            var allLabelIds = GetNextMindMapLabelCollectionByLabelId(mindMapId, centerLabelId, filterIds);
            resultList.AddRange(allLabelIds.Select(c => new BsonDocument().Add("labelId", c).Add("type", "2").Add("pid", centerLabelId)));
            filterIds.AddRange(allLabelIds);
            //二级关联
            foreach (var secLablId in allLabelIds.Where(c=>centerLabelId!=c))
            {
                var secLabelIds = GetNextMindMapLabelCollectionByLabelId(mindMapId, secLablId, filterIds);//遍历二级关系
                resultList.AddRange(secLabelIds.Select(c => new BsonDocument().Add("labelId", c).Add("type", "3").Add("pid", secLablId)));
                filterIds.AddRange(secLabelIds);
            }
            return resultList;
        }

        /// <summary>
        /// 获取3级相邻的标签节点,过滤已经存在的标签ID
        /// </summary>
        /// <param name="mindMapId">脉络图id</param>
        /// <param name="centerLabelIds">中心节点集合</param>
        /// <returns></returns>
        public List<BsonDocument> InitialMindMapLabelCollectionByLabelId(string mindMapId, List<string> centerLabelIds)
        {
            var hitMindMapTraceList = new List<BsonDocument>();//获取所有脉络图需要出现的标签节点
            foreach (var centerLabId in centerLabelIds)
            {
                var hitResult =  InitialMindMapLabelCollectionByLabelId(mindMapId, centerLabId);//找出所有三级关联关系点
                hitMindMapTraceList.AddRange(hitResult);
            }
            return hitMindMapTraceList.Distinct().ToList();
        }

        #region 文章相关

        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByKeyWord(string name)
        {
            if (string.IsNullOrEmpty(name)) return new List<BsonDocument>();
            //,Query.Matches("content", new Regex(name,RegexOptions.IgnoreCase))
            //获取文章标签列表
            var allArticleList = dataOp.FindAllByQuery("MindMapArticle", Query.Or(Query.Matches("name", new Regex(name,RegexOptions.IgnoreCase)))).SetFields("name", "articleId", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre").OrderByDescending(c => c.Int("socre")).ToList();
            return allArticleList;
        }
        /// <summary>
        /// 通过分页获取对应文章
        /// </summary>
        /// <param name="articleIds"></param>
        /// <param name="pageNum"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public List<BsonDocument> FindhitArticleListByArticleIds(List<string> articleIds, int pageNum, int pageSize, string sortType="score")
        {
            var getDataNum = (pageNum-1) * pageSize;
            //var hitArticleList = dataOp.FindAllByQuery("MindMapArticle", Query.In("articleId", articleIds.Select(c => (BsonValue)c))).SetFields().Distinct().Skip(getDataNum).Take(pageSize).OrderByDescending(c => c.Int("socre")).ToList();
            var sortByDoc=new SortByDocument { { sortType, -1 } };
            var hitArticleList = dataOp.FindLimitFieldsByQuery("MindMapArticle", Query.In("articleId", articleIds.Select(c => (BsonValue)c)), sortByDoc, getDataNum, pageSize, new string[] { "name", "articleId", "createUserId", "createDate", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre" }).ToList();
            return hitArticleList;
        }
        

        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByIds(List<string> articleIds)
        {
            //获取文章标签列表
            var allArticleList = dataOp.FindAllByQuery("MindMapArticle", Query.In("articleId", articleIds.Select(c => (BsonValue)c))).SetFields("name", "articleId", "createUserId", "createDate", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre").OrderByDescending(c => c.Int("socre")).ToList();
            return allArticleList;
        }

        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByLabIds(string labId)
        {
            return FindMindMapArticleByLabIds(new List<string> { labId });
        }
        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByLabIds(string labId,int top)
        {
            return FindMindMapArticleByLabIds(new List<string> { labId },top);
        }

        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByLabIds(List<string> labIds)
        {
            //获取文章标签列表
            var allArticleRelList = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.In("labelId", labIds.Select(c=>(BsonValue)c))).ToList();
            var allArticleList = dataOp.FindAllByQuery("MindMapArticle", Query.In("articleId", allArticleRelList.Select(c => (BsonValue)c.Text("articleId")))).SetFields("name", "articleId", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre").OrderByDescending(c => c.Int("socre")).ToList();
            return allArticleList;
        }

        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> FindMindMapArticleIdsByLabIds(List<string> labIds)
        {
            //获取文章标签列表
            var allArticleRelList = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.In("labelId", labIds.Select(c => (BsonValue)c))).Select(c=>c.Text("articleId")).ToList();

            return allArticleRelList;
        }
        /// <summary>
        /// 通过标签获取关联的文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<BsonDocument> FindMindMapArticleByLabIds(List<string> labIds,int top)
        {
            //获取文章标签列表
            var allArticleRelList = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.In("labelId", labIds.Select(c => (BsonValue)c))).ToList();
            SortByDocument sort = new SortByDocument { { "score", -1 } };
            var allArticleList = dataOp.FindLimitByQuery("MindMapArticle", Query.In("articleId", allArticleRelList.Select(c => (BsonValue)c.Text("articleId"))), sort,0,top).SetFields("name", "articleId", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre").ToList();
            return allArticleList;
        }
        /// <summary>
        /// 是否点赞过
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool HasUserPrised(string userId,string articleId)
        {
            return dataOp.FindCount("MindMapArticlePrise", Query.And(Query.EQ("articleId", articleId), Query.EQ("userId", userId), Query.NE("deleteStatus","1"))) > 0;
        }

        /// <summary>
        /// 是否点收藏过
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool HasUserFaoriated(string userId, string articleId)
        {
            return dataOp.FindCount("MindMapArticleFavoriate", Query.And(Query.EQ("articleId", articleId), Query.EQ("userId", userId), Query.NE("deleteStatus", "1"))) > 0;
        }

        /// <summary>
        /// 收藏的文章列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> FindUserFavoriateArticleIds(string userId)
        {
            var articleIds = dataOp.FindAllByQuery("MindMapArticleFavoriate", Query.And(Query.EQ("userId", userId), Query.NE("deleteStatus", "1"))).SetFields("articleId").Select(c => c.Text("articleId")).ToList();
            return articleIds;
        }
       
        /// <summary>
        /// 收藏的文章列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<string> FindUserUpLoadArticleIds(string userId)
        {
            var articleIds = dataOp.FindAllByQuery("MindMapArticle", Query.EQ("createUserId", userId)).SetFields("articleId").Select(c => c.Text("articleId")).ToList();
            return articleIds;
        }

        /// <summary>
        /// 获取文章排行
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<BsonDocument> GetArticleRank(int top)
        {
            SortByDocument sort = new SortByDocument { { "socre", -1 } };
            var allArticleList = dataOp.FindLimitByQuery("MindMapArticle", null, sort, 0, top).SetFields("name", "articleId", "updateUserId", "updateDate", "viewCount", "replyCount", "favoriateCount", "priseCount", "socre").ToList();
            return allArticleList;
        }

        /// <summary>
        /// 获取用户排行
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<BsonDocument> GetUserRank(int top)
        {
            SortByDocument sort = new SortByDocument { { "weightCount", -1 } };
            var allArticleList = dataOp.FindLimitFieldsByQuery("SysUser", Query.And(Query.NE("status", "2"), Query.GT("weightCount", 0)), sort, 0, top, new string[] { "name", "userId", "weightCount", "viewCount", "replyCount", "favoriateCount", "priseCount" }).ToList();
            return allArticleList;
        }


        /// <summary>
        /// 获取用户金币排行
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<BsonDocument> GetUserCoinRank(int top)
        {
            SortByDocument sort = new SortByDocument { { "coin", -1 } };
            var allArticleList = dataOp.FindLimitFieldsByQuery("SysUser", Query.And(Query.NE("status", "2"), Query.GT("coin", 0)), sort, 0, top, new string[] { "name", "userId", "weightCount", "viewCount", "replyCount", "favoriateCount", "priseCount", "coin" }).ToList();
            return allArticleList;
        }

        /// <summary>
        /// 获取部门排行
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<BsonDocument> GetDepartRank(int top)
        {
            var allProfList = dataOp.FindAll("System_Professional").ToList();
            SortByDocument sort = new SortByDocument { };
            var allUserList = dataOp.FindFieldsByQuery("SysUser", Query.NE("status", "2"), new string[] { "profId", "weightCount", "viewCount", "replyCount", "favoriateCount", "priseCount", "articleCount" }).ToList();
            foreach (var sysProf in allProfList)
            {
                var hitUserList = allUserList.Where(c => c.Text("profId") == sysProf.Text("profId")).ToList();
                if (hitUserList.Count > 0)
                {
                    sysProf.Set("viewCount", hitUserList.Sum(c => c.Int("viewCount")));
                    sysProf.Set("replyCount", hitUserList.Sum(c => c.Int("replyCount")));
                    sysProf.Set("favoriateCount", hitUserList.Sum(c => c.Int("favoriateCount")));
                    sysProf.Set("priseCount", hitUserList.Sum(c => c.Int("priseCount")));
                    sysProf.Set("articleCount", hitUserList.Sum(c => c.Int("articleCount")));
                    sysProf.Set("weightCount", GetArticleWeighCount(sysProf));
                }
            }
            return allProfList.OrderByDescending(c=>c.Double("weightCount")).ToList();
        }
        #endregion
        
        #region 文章统计Count
        /// <summary>
        /// 获取文章评论个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public int GetArticleViewCount(string articleId)
        {
            var operateTypeStr=((int)MindMapOperateType.ViewArticle).ToString();
            var count = dataOp.FindCount("MindMapLog", Query.And(Query.EQ("articleId", articleId), Query.EQ("operateType", operateTypeStr)));
           return count;
        }
        /// <summary>
        /// 获取文章评论个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public int GetArticleFavoriatedCount(string articleId)
        {
            var count = dataOp.FindCount("MindMapArticleFavoriate", Query.And(Query.EQ("articleId", articleId), Query.NE("deleteStatus", "1")));
            return count;
        }
        /// <summary>
        /// 获取文章评论个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public int GetArticlePrisedCount(string articleId)
        {
            var count = dataOp.FindCount("MindMapArticlePrise", Query.And(Query.EQ("articleId", articleId), Query.NE("deleteStatus", "1")));
            return count;
        }
        /// <summary>
        /// 获取文章评论个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public int GetArticleCommentCount(string articleId)
        {
            var comments = dataOp.FindAllByQueryStr("EvaluationComment", string.Format("objectId=1&tableName=MindMapArticle&keyValue={0}", articleId)).OrderByDescending(t => t.Date("updateDate")).ToList();
            var commentCount = comments.Count();
            return commentCount;
        }
        #endregion

        #region 评论相关
        /// <summary>
        /// 获取文章评论个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public string  GetArticleCommentUrl(string articleId)
        {
            return string.Format("/Evaluation/LFComment?tableName=MindMapArticle&keyName=articleId&keyValue={0}&objectId=1&math={1}", articleId, DateTime.Now.Ticks);
            
        }
        #endregion
        #region 关联搜索相关 相关的文档

         
        /// <summary>
        /// 文章推荐相关推荐，通过文章的标签推荐 基于用户投票的排名算法
        /// </summary>
        /// <returns></returns>
        public List<BsonDocument> SearchArticleRecommend(string articleId,int top)
        {
            //获取关联的标签
            var relLabelIds = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.EQ("articleId", articleId)).Select(c => c.Text("labelId")).ToList();
            var relLabelList =  FindMindMapLabelCollectionByLabIds(relLabelIds);
            //获取标签关联的文章列表 按照Score排序;或者收藏好评排序
            var hitArticleList = FindMindMapArticleByLabIds(relLabelList.Select(c => c.Text("labelId")).ToList(),top);
            return hitArticleList;
        }
        /// <summary>
        /// 相关搜索，根据搜索关键字搜索相关的文档+其他人在搜索的时候紧跟着搜索的东西
        /// </summary>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public List<string> SearchKeyWordRecomend(string keyWord,int skip)
        {
            if (string.IsNullOrEmpty(keyWord)) return new List<string>();
            var hitMatchLabelList=FindMindMapLabelCollectionByKeyWord(keyWord, skip);
            var centerLabIds = hitMatchLabelList.Select(c => c.Text("labelId")).ToList();
            var hitMatchLabelIds = new List<string>();
            foreach (var centerLabId in centerLabIds)
            {
                    var hitResult =  GetNextMindMapLabelCollectionByLabelId(new List<string>(), centerLabId);//找出所有三级关联关系点
                    hitMatchLabelIds.AddRange(hitResult);
             }
            hitMatchLabelIds.AddRange(centerLabIds);
            var hitKeyWordList = FindMindMapLabelCollectionByLabIds(hitMatchLabelIds).Select(c => c.Text("name")).ToList();
            //优先用户关联搜索
            var hitUserKeyWordList = SearchKeyWordRecommendByUser(keyWord, skip);
            hitUserKeyWordList.AddRange(hitKeyWordList);
            return hitUserKeyWordList.Distinct().Take(skip).ToList();

        }
        /// <summary>
        /// 基于用户浏览的排名算法，用户搜索这个还搜索过什么
        /// </summary>
        public List<string> SearchKeyWordRecommendByUser(string keyWord,int skip)
        {
            if (string.IsNullOrEmpty(keyWord)) return new List<string>();
            var query = Query.And(Query.EQ("operateType", "0"), Query.EQ("isKeyWordChange", "1"), Query.Or(Query.Matches("keyWord", new Regex(keyWord, RegexOptions.IgnoreCase)), Query.Matches("oldKeyWord", new Regex(keyWord, RegexOptions.IgnoreCase))));
            SortByDocument sort = new SortByDocument { { "createDate", -1 } };//最近的
            var hitLog = dataOp.FindLimitFieldsByQuery("MindMapLog", query, sort, 0, 100, new string[] { "keyWord", "oldKeyWord" }).ToList();
            var oldKeyWordList = hitLog.Where(c => c.Text("keyWord") == keyWord && c.Text("oldKeyWord") != keyWord).Select(c => c.Text("oldKeyWord")).ToList();
            var keyWordList = hitLog.Where(c => c.Text("oldKeyWord") == keyWord && c.Text("keyWord") != keyWord).Select(c => c.Text("keyWord")).ToList();
            var result = new List<string>();
            result.AddRange(keyWordList);
            result.AddRange(oldKeyWordList);
            //分组
            var q = from p in result
                    group p by p into g
                    select new { name=g.Key,count=g.Count()};
            var hitResult= q.OrderByDescending(c => c.count).Take(skip).Select(c=>c.name).ToList();
            return hitResult;
        }

       
        #endregion


        #endregion

        #region  操作
        #region 脉络图操作
         /// <summary>
         /// 快速创建脉络图
         /// </summary>
         /// <param name="articleId"></param>
         /// <returns></returns>
        public InvokeResult QuickCreateMindMap(string mindMapId,BsonDocument curMindMapObj)
        {
                var result = new InvokeResult();
                if (HasExistMindMapName(mindMapId, curMindMapObj.Text("name")))
                {
                    result.Status = Status.Failed;
                    result.Message = "存在重名";
                    return result;
                }
                var hitMindMapObj = FindMindMapById(mindMapId);
               
                if (hitMindMapObj == null)
                {
                    result = dataOp.Insert("MindMapLibrary", curMindMapObj);
                }
                else
                {
                    result = dataOp.Update("MindMapLibrary", Query.EQ("mindMapId", mindMapId), curMindMapObj);
                }
            return result;
        }

        /// <summary>
        /// 快速创建脉络图
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public InvokeResult QuickDeleteMindMap(string mindMapId)
        {
            var result = new InvokeResult();
            
            var hitMindMapObj = FindMindMapById(mindMapId);

            if (hitMindMapObj != null)
            {
                BsonDocument curMindMapObj = new BsonDocument();
                curMindMapObj.Add("deleteStatus", "1");
                result = dataOp.Update("MindMapLibrary", Query.EQ("mindMapId", mindMapId), curMindMapObj);
            }
            return result;
        }

        #endregion
        #region 文章操作
        /// <summary>
        ///  更新用户状态
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void UpdateUserArticleStatus(string userId)
        {
            var hitArticle = dataOp.FindFieldsByQuery("MindMapArticle", Query.EQ("createUserId", userId), new string[] {"articleId","viewCount", "replyCount", "favoriateCount", "priseCount","score" }).ToList();
            var updateBosnDocument=new BsonDocument();
            if (hitArticle.Count > 0)
            {
                updateBosnDocument.Add("articleCount", hitArticle.Count);
                updateBosnDocument.Add("viewCount", hitArticle.Sum(c => c.Int("viewCount")));
                updateBosnDocument.Add("replyCount", hitArticle.Sum(c => c.Int("replyCount")));
                updateBosnDocument.Add("favoriateCount", hitArticle.Sum(c => c.Int("favoriateCount")));
                updateBosnDocument.Add("priseCount", hitArticle.Sum(c => c.Int("priseCount")));
                updateBosnDocument.Set("weightCount", GetArticleWeighCount(updateBosnDocument));
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "SysUser", Document = updateBosnDocument, Query = Query.EQ("userId", userId), Type = Yinhe.ProcessingCenter.DataRule.StorageType.Update });
                QuickStartDBChangeProcess();
            }
        }

        /// <summary>
        /// 更新文章
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapArticle(string articleId, BsonDocument updateBson)
        {
            var result = new InvokeResult();
            if (string.IsNullOrEmpty(updateBson.Text("name")))
            {
                result.Status = Status.Failed;
                result.Message = "请文章或者标题不能为空";
                return result;
            }
            var curArticle = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
          
            if (curArticle == null)
            {
                curArticle = updateBson;
                result = dataOp.Insert("MindMapArticle", curArticle);
                //更新用户文章量
                UpdateUserArticleStatus(curArticle.Text("createUserId"));
            }
            else
            {
                result = dataOp.Update("MindMapArticle", Query.EQ("_id", ObjectId.Parse(curArticle.Text("_id"))), updateBson);
            }
            return result;
        }
        
        /// <summary>
        /// 文章收藏或者取消
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapArticleFavoriate(string userId,string articleId)
        {
            var result = new InvokeResult();
            var curArticle = dataOp.FindOneByQuery("MindMapArticleFavoriate", Query.And(Query.EQ("articleId", articleId),Query.EQ("userId",userId)));
            if (curArticle == null)
            {
                 curArticle=new BsonDocument();
                 curArticle.Add("articleId",articleId);
                 curArticle.Add("userId",userId);
                 DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticleFavoriate", Document = curArticle, Type = StorageType.Insert });
            }
            else
            {
                if(curArticle.Text("deleteStatus")=="1"){
                  curArticle.Set("deleteStatus","0");
                }else{
                    curArticle.Set("deleteStatus", "1");
                }
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticleFavoriate", Document = curArticle, Type = StorageType.Update });
            }
            StartDBChangeQueue(null);
            UpdateMindMapArticleStaticCount(articleId);
            UpdateUserArticleStatus(userId);
            #region 添加操作日志
            LogOperation(new BsonDocument().Add("articleId",articleId).Add("status",curArticle.Text("deleteStatus")).Add("userId",userId),MindMapOperateType.Favoriate);
            #endregion
            return result;
        }

        /// <summary>
        /// 文章点赞或者取消
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapArticlePrise(string userId, string articleId)
        {
            var result = new InvokeResult();
            var curArticle = dataOp.FindOneByQuery("MindMapArticlePrise", Query.And(Query.EQ("articleId", articleId),Query.EQ("userId",userId)));
            if (curArticle == null)
            {
                 curArticle=new BsonDocument();
                 curArticle.Add("articleId",articleId);
                 curArticle.Add("userId",userId);
                 DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticlePrise", Document = curArticle, Type = StorageType.Insert });
            }
            else
            {
                if(curArticle.Text("deleteStatus")=="1"){
                    curArticle.Set("deleteStatus", "0");
                }else{
                    curArticle.Set("deleteStatus", "1");
                }
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticlePrise", Document = curArticle, Type = StorageType.Update });
            }
            StartDBChangeQueue(null);
            UpdateMindMapArticleStaticCount(articleId);
            UpdateUserArticleStatus(userId);
            //添加操作日志
            LogOperation(new BsonDocument().Add("articleId",articleId).Add("status",curArticle.Text("deleteStatus")).Add("userId",userId),MindMapOperateType.Praise);
            return result;
        }
        #endregion

        #region 标签保存
         /// <summary>
        /// 更新标签
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelColleciton(string labelId, BsonDocument updateBson)
        {
            var name=updateBson.Text("name");
            if (HasExistMindMapLabelCollection(labelId,name))
            {
                return new InvokeResult() { Message = "已存在相同的标签名称", Status = Status.Failed };
            }
            updateBson.Set("textLen",StringExtension.TextLength(name));
            var mResult = dataOp.Update("MindMapLabelCollection", Query.EQ("labelId",labelId),updateBson);
            return mResult;
        }
        #endregion
        #region 文章标签关联操作
        /// <summary>
        /// 将文章标签进行关联操作
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="labelIds"></param>
        /// <param name="addLabelNames"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapArticleLabel(string articleId, List<string> labelIds, List<string> addLabelNames)
        {
            var result = new InvokeResult();
            var allArticleRelQuery = dataOp.FindAllByQuery("MindMapArticleLabelRelation", Query.EQ("articleId", articleId));
            var existsLabelIds = allArticleRelQuery.Select(c => c.Text("labelId")).ToList();//当前文章关联的标签
            var addLabelIds = new List<string>();
            ///选择标签初始化
            labelIds = SelectMindMapLabelPush(labelIds, addLabelNames);
            var deleteLabelIds = existsLabelIds.Where(c => !labelIds.Contains(c)).ToList();//需要删除关联的标签
            addLabelIds = labelIds.Where(c => !existsLabelIds.Contains(c)).Distinct().ToList();//需要新增的标签名
            var storageDataList = new List<StorageData>();
            //删除关联 是否用标示位
            if (deleteLabelIds.Count() > 0)
            { 
              var query=Query.EQ("articleId",articleId);
              storageDataList.AddRange(deleteLabelIds.Select(d =>
                  new StorageData()
                  {
                      Query = Query.And(query, Query.EQ("labelId", d)),
                      Name = "MindMapArticleLabelRelation",
                      Type = StorageType.Delete
                  }));
            }
            //增加关联
            if (addLabelIds.Count() > 0)
            {
                
                var hitUpdateList = addLabelIds.Select(d =>
                    new StorageData()
                    {
                        Document = new BsonDocument().Add("articleId", articleId).Add("labelId", d),
                        Name = "MindMapArticleLabelRelation",
                        Type = StorageType.Insert
                    }).ToList();
                storageDataList.AddRange(hitUpdateList);
              
            }
            if (storageDataList.Count() > 0)
            {
                result = dataOp.BatchSaveStorageData(storageDataList);
            }
            return result;
        }
        #endregion

        #region 设置标签关联，并更新脉络图
        /// <summary>
        /// 判断传进来的标签Id与标签名称，不存在则新增，并返回标签id列表
        /// </summary>
        /// <param name="labelIds">现有标签Id</param>
        /// <param name="addLabelNames">选择新增的标签名称</param>
        /// <returns></returns>
        public List<string> SelectMindMapLabelPush(List<string> labelIds, List<string> addLabelNames)
        {
            //通过标签名判断是否已存在的标签，有则生成标签Id，可能有某种该名字已存在并且在存在的列表中，而labelIds却没有该字段
            var hitNameLabelList = FindMindMapLabelCollectionByName(addLabelNames);
            var hitNameLabelIds = hitNameLabelList.Select(c => c.Text("labelId"));
            if (hitNameLabelIds.Count() > 0)
            {
                labelIds.AddRange(hitNameLabelIds);
            }
            //新增标签Colleciton
            var hitLabelNames = hitNameLabelList.Select(c => c.Text("name")).ToList();
            var needAddLabelNameList = addLabelNames.Where(c => !hitLabelNames.Any(d => d.ToLower() == c.ToLower())).Select(c => new BsonDocument().Add("name", c.Trim()).Add("level", "1").Add("textLen", StringExtension.TextLength(c))).ToList();
            var mResult = dataOp.QuickInsert("MindMapLabelCollection", needAddLabelNameList);
            if (mResult.Status == Status.Successful)
            {
                ///重新读取标签
                var newNameLabelList = FindMindMapLabelCollectionByName(needAddLabelNameList.Select(c => c.Text("name")).ToList());
                var hitNewNameLabelIds = newNameLabelList.Select(c => c.Text("labelId"));
                if (hitNewNameLabelIds.Count() > 0)
                {
                    labelIds.AddRange(hitNewNameLabelIds);
                }
            }
            return labelIds.Distinct().ToList();
        }


        /// <summary>
        /// 更新脉络图索引字段,将字段名添加入索引
        /// </summary>
        /// <param name="curMindMapId"></param>
        /// <param name="curLabel"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelIndex(string curMindMapId, BsonDocument curLabel)
        {
            var result = new InvokeResult();
            var curLabelArray=new BsonArray();
            curLabelArray.Add(curLabel.Text("name"));
            result = dataOp.UpdateArrayToAddOnly("MindMapLibrary", Query.EQ("mindMapId", curMindMapId), "labelCollection", curLabelArray);
            return result;
        }

        /// <summary>
        /// 更新脉络图索引字段,将字段名添加入索引
        /// </summary>
        /// <param name="curMindMapId"></param>
        /// <param name="curLabel"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelIndexAsync(string curMindMapId, BsonArray curLabelArray)
        {
            var result = new InvokeResult();
            DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLibrary", Document = new BsonDocument().Add("labelCollection", curLabelArray), Type = StorageType.Update, Query = Query.EQ("mindMapId", curMindMapId) });
            QuickStartDBChangeProcess();
            return result;
        }

        /// <summary>
        /// 更新脉络图索引字段,将字段名添加入索引
        /// </summary>
        /// <param name="curMindMapId"></param>
        /// <param name="curLabel"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelIndexAddAll(string curMindMapId, BsonArray curLabelArray)
        {
            var result = new InvokeResult();
            result = dataOp.UpdateArrayToAddAll("MindMapLibrary", Query.EQ("mindMapId", curMindMapId), "labelCollection", curLabelArray);
            return result;
        }
        /// <summary>
        /// 更新脉络图索引字段,将字段名索引删除标签
        /// </summary>
        /// <param name="curMindMapId"></param>
        /// <param name="curLabel"></param>
        /// <returns></returns>
        public InvokeResult DeleteMindMapLabelIndex(string curMindMapId, BsonDocument curLabel)
        {
            var result = new InvokeResult();
            var curMindMapObj = FindMindMapById(curMindMapId);
            if (curMindMapObj != null)
            {
                var curLabelCollection = curMindMapObj["labelCollection"].AsBsonArray;
                //更新索引
                if (curLabelCollection.Contains(curLabel.Text("name")))
                {
                    curLabelCollection.Remove(curLabel.Text("name"));
                    result = dataOp.Update("MindMapLibrary", Query.EQ("mindMapId", curMindMapId), new BsonDocument().Add("labelCollection", curLabelCollection));
                }
               
            }
            return result;
        }
        /// <summary>
        /// 设置标签关联
        /// 1.新增标签关联需要添加到对应的脉络图索引中去
        /// 2.已有脉络图关联的标签A与也有自己脉络图关联的标签B 进行关联的时候如何进行判断，需要设置为一张脉络图还是更新各自脉络图关联
        /// </summary>
        /// <param name="preLabelId">前置节点</param>
        /// <param name="sucLabelId">后继结点</param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelTrace(string preLabelId,string sucLabelId)
        {
            var result = new InvokeResult();
            var curPreLabel = FindMindMapLabelCollectionByLabId(preLabelId);
            var curSucLabel = FindMindMapLabelCollectionByLabId(sucLabelId);
            if (curPreLabel == null || curSucLabel==null)
            {
                result.Status = Status.Failed;
                result.Message = "标签不存在";
                return result;
            }
            var preMindMapIds=FindMindMapIdsByLabelId(preLabelId);//查找所属的脉络图
            var sucMindMapIds = FindMindMapIdsByLabelId(sucLabelId);//查找所属的脉络图

            var existMindMapIds = FindMindMapIdsByLabelId(preLabelId, sucLabelId);//共同建立过关联的脉络图Id
            //更新各自脉络图对应节点
            var hitMindmapIds = new List<string>();
            hitMindmapIds.AddRange(preMindMapIds.Where(c => !existMindMapIds.Contains(c)));
            hitMindmapIds.AddRange(sucMindMapIds.Where(c => !existMindMapIds.Contains(c)));
            if (hitMindmapIds.Count < 0)
            {
                result.Status = Status.Failed;
                result.Message = "标签没有对应的脉络图，请先创建脉络图";
                return result;
            }
            List<StorageData> updateList = new List<StorageData>(); 
            //处理未建立关联的脉络图轨迹,并添加索引关键字
            foreach (var curMindMapId in hitMindmapIds.Distinct())
            { 
                var addDoc=new BsonDocument();
                addDoc.Add("mindMapId",curMindMapId);
                addDoc.Add("preLabelId",preLabelId);
                addDoc.Add("sucLabelId", sucLabelId);
                addDoc.Add("referType","1");
                updateList.Add(new StorageData() { Name = "MindMapLabelTrace", Document = addDoc, Type = StorageType.Insert });
                
            }
            result = dataOp.BatchSaveStorageData(updateList);
            UpdateMindMapLabelCollection(hitMindmapIds);
            return result;
        }

        /// <summary>
        /// 设置标签关联只更新匹配的脉络图Id
        /// 1.新增标签关联需要添加到对应的脉络图索引中去
        /// 2.已有脉络图关联的标签A与也有自己脉络图关联的标签B 进行关联的时候如何进行判断，需要设置为一张脉络图还是更新各自脉络图关联
        /// </summary>
        /// <param name="preLabelId">前置节点</param>
        /// <param name="sucLabelId">后继结点</param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelTrace(List<string> mindMapIds,string preLabelId, List<string> sucLabelIds)
        {
                var result = new InvokeResult();
                List<StorageData> updateList = new List<StorageData>();
                var allRelMindMapIds = new List<string>();
                foreach(var sucLabelId in sucLabelIds){
                if (mindMapIds.Count() <= 0) return UpdateMindMapLabelTrace(preLabelId, sucLabelId);
              
                var curPreLabel = FindMindMapLabelCollectionByLabId(preLabelId);
                var curSucLabel = FindMindMapLabelCollectionByLabId(sucLabelId);
                if (curPreLabel == null || curSucLabel == null)
                {
                    result.Status = Status.Failed;
                    result.Message = "标签不存在";
                    return result;
                }
                var preMindMapIds = FindMindMapIdsByLabelId(preLabelId);//查找所属的脉络图
                var sucMindMapIds = FindMindMapIdsByLabelId(sucLabelId);//查找所属的脉络图

                var existMindMapIds = FindMindMapIdsByLabelId(preLabelId, sucLabelId);//共同建立过关联的脉络图Id
                //更新各自脉络图对应节点
                var hitMindmapIds = mindMapIds;
                hitMindmapIds.AddRange(preMindMapIds.Where(c => !existMindMapIds.Contains(c) && mindMapIds.Contains(c)));
                hitMindmapIds.AddRange(sucMindMapIds.Where(c => !existMindMapIds.Contains(c) && mindMapIds.Contains(c)));
                if (hitMindmapIds.Count < 0)
                {
                    result.Status = Status.Failed;
                    result.Message = "标签没有对应的脉络图，请先创建脉络图";
                    return result;
                }
                //处理未建立关联的脉络图轨迹,并添加索引关键字
                var needAddLabelList = new BsonArray();
                foreach (var curMindMapId in hitMindmapIds.Distinct())
                {
                    var addDoc = new BsonDocument();
                    addDoc.Add("mindMapId", curMindMapId);
                    addDoc.Add("preLabelId", preLabelId);
                    addDoc.Add("sucLabelId", sucLabelId);
                    addDoc.Add("referType", "1");
                    updateList.Add(new StorageData() { Name = "MindMapLabelTrace", Document = addDoc, Type = StorageType.Insert });
                }
                allRelMindMapIds.AddRange(hitMindmapIds);
            }
             result = dataOp.BatchSaveStorageData(updateList);
            // 批量更新 脉络图索引
            UpdateMindMapLabelCollection(allRelMindMapIds);
 
            return result;
        }
        /// <summary>
        /// 批量跟新多个节点
        /// </summary>
        /// <param name="mindMapIds"></param>
        /// <param name="preLabelId"></param>
        /// <param name="sucLabelIds"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelTrace(List<string> mindMapIds, string preLabelId, string sucLabelIds)
        {
            return UpdateMindMapLabelTrace(mindMapIds, preLabelId, new List<string>(){sucLabelIds});
        }

        
        /// <summary>
        /// 脉络图节点替换
        /// </summary>
        /// <param name="mindMapIds"></param>
        /// <param name="oldLabelId"></param>
        /// <param name="newLabelId"></param>
        /// <returns></returns>
        public InvokeResult ReplaceMindMapLabelTrace(List<string> mindMapIds, string oldLabelId, string newLabelId)
        {
            var hitMindMapTrace = FindMindMapLabelTraceById(mindMapIds.ToArray());//
            var needDeleteIds = hitMindMapTrace.Where(c => (c.Text("preLabelId") == oldLabelId && c.Text("sucLabelId") == newLabelId) || c.Text("sucLabelId") == oldLabelId && c.Text("preLabelId") == newLabelId).Select(c => c.Text("_Id")).ToList();
            foreach (var deleteId in needDeleteIds)
            {
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLabelTrace", Type = StorageType.Delete, Query = Query.EQ("_id", ObjectId.Parse(deleteId)) });
            }
            var hitPreLabelIds = hitMindMapTrace.Where(c => c.Text("preLabelId") == oldLabelId && !needDeleteIds.Contains(c.Text("_id"))).Select(c => c.Text("_Id")).ToList();
            foreach (var prelabelId in hitPreLabelIds)
            {
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLabelTrace", Document = new BsonDocument().Add("preLabelId", newLabelId), Type = StorageType.Update, Query = Query.EQ("_id", ObjectId.Parse(prelabelId)) });
            }
            var hitSucLabelIds = hitMindMapTrace.Where(c => c.Text("sucLabelId") == oldLabelId && !needDeleteIds.Contains(c.Text("_id"))).Select(c => c.Text("_Id")).ToList();
            foreach (var sucLabelId in hitSucLabelIds)
            {
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLabelTrace", Document = new BsonDocument().Add("sucLabelId", newLabelId), Type = StorageType.Update, Query = Query.EQ("_id", ObjectId.Parse(sucLabelId)) });
            }
            QuickStartDBChangeProcess();
            var result = new InvokeResult() { Status=Status.Successful};
            return result;
        }
        

        /// <summary>
        /// 将涉及脉络图关联的索引进行删除
        /// </summary>
        /// <param name="mindMapIds"></param>
        /// <param name="preLabelId"></param>
        /// <param name="sucLabelId"></param>
        /// <returns></returns>
        public InvokeResult DeleteMindMapLabelTrace(List<string> mindMapIds, string preLabelId, string sucLabelId)
        {
            var result = new InvokeResult();
            
            var curPreLabel = FindMindMapLabelCollectionByLabId(preLabelId);
            var curSucLabel = FindMindMapLabelCollectionByLabId(sucLabelId);
            if (curPreLabel == null || curSucLabel == null)
            {
                result.Status = Status.Failed;
                result.Message = "标签不存在";
                return result;
            }

            var hitMindmapIds = FindMindMapIdsByLabelId(preLabelId, sucLabelId);//共同建立过关联的脉络图Id
            if(mindMapIds.Count>0)
            {
               hitMindmapIds=hitMindmapIds.Where(c=>mindMapIds.Contains(c)).ToList();
            }
            //更新各自脉络图对应节点
            List<StorageData> updateList = new List<StorageData>();
            var allMindTrace = FindMindMapLabelTraceById(hitMindmapIds.ToArray());
            //处理未建立关联的脉络图轨迹,并添加索引关键字
            foreach (var curMindMapId in hitMindmapIds.Distinct())
            {
                //var existQuery1 = Query.And(Query.EQ("preLabelId", preLabelId), Query.EQ("sucLabelId", sucLabelId));
                //var existQuery2 = Query.And(Query.EQ("sucLabelId", preLabelId), Query.EQ("preLabelId", sucLabelId));
                //var delQuery=Query.Or(existQuery1,existQuery2);
               
                //当所有的引用都不存在了才进行删除
                var hitMindTrace = allMindTrace.Where(c => c.Text("mindMapId") == curMindMapId).ToList();
                var hitDelTrace = hitMindTrace.Where(c => (c.Text("preLabelId") == preLabelId && c.Text("sucLabelId") == sucLabelId) || (c.Text("preLabelId") == sucLabelId && c.Text("sucLabelId") == preLabelId)).ToList();
                if (hitDelTrace.Count > 0)
                {
                    foreach (var trace in hitDelTrace)
                    {
                        hitMindTrace.Remove(trace);
                        updateList.Add(new StorageData() { Name = "MindMapLabelTrace", Query = Query.EQ("_id", ObjectId.Parse(trace.Text("_id"))), Type = StorageType.Delete });
                    }
                    var preLabelIds = hitMindTrace.Select(c => c.Text("preLabelId"));
                    var sucLabelIds = hitMindTrace.Select(c => c.Text("sucLabelId"));
                    if (!preLabelIds.Contains(preLabelId) && !sucLabelIds.Contains(preLabelId))
                    {
                        DeleteMindMapLabelIndex(curMindMapId, curPreLabel);//删除标签索引
                    }
                    if (!preLabelIds.Contains(sucLabelId) && !sucLabelIds.Contains(sucLabelId))
                    {
                        DeleteMindMapLabelIndex(curMindMapId, curSucLabel);//删除标签索引
                    }
                }
            }
            result = dataOp.BatchSaveStorageData(updateList);
            //hitMindmapIds
            //UpdateMindMapLabelCollection(allRelMindMapIds);
            return result;
        }


         /// <summary>
        /// 将涉及脉络图关联的索引进行删除
        /// </summary>
        /// <param name="mindMapIds"></param>
        /// <param name="preLabelId"></param>
        /// <param name="sucLabelId"></param>
        /// <returns></returns>
        public InvokeResult DeleteMindMapLabelTrace(List<string> mindMapIds, string preLabelId, List<string> sucLabelIds)
        { 
            var result=new InvokeResult();
            foreach (var sucLabelId in sucLabelIds)
            {
                result = DeleteMindMapLabelTrace(mindMapIds, preLabelId, sucLabelId);
               if(result.Status!=Status.Successful)
               {
                 return result;
               }
            }
            return result;
        }
        #endregion

        #region 标签热门匹配
        #region 热门标签统计
        public void UpdateLabelSearchCount(List<BsonDocument> labelList)
        {
            foreach (var label in labelList)
            {
                var curSearchCount = label.Int("searchCount") + 1;
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLabelCollection", Document = new BsonDocument().Add("searchCount", curSearchCount), Type = StorageType.Update, Query=Query.EQ("labelId", label.Text("labelId")) });
            }
            QuickStartDBChangeProcess();
        }
        #endregion
        #endregion

        #region 历史操作日志 搜索关键字文档 上传文档 查看文档 评论回复
        /// <summary>
        /// 添加日志
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        public void LogOperation(BsonDocument doc, MindMapOperateType operateType)
        {
            var operateTypeStr=((int)operateType).ToString();
            doc.Set("operateType", operateTypeStr);
            LogOperation(new List<BsonDocument>() { doc });
             
        }
        /// <summary>
        /// 添加日志
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        public void LogOperation(List<BsonDocument> docList)
        {
            foreach(var doc in docList){
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapLog", Document = doc, Type = StorageType.Insert });
            }
            QuickStartDBChangeProcess();
        }

        /// <summary>
        /// 添加日志
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        public void QuickStartDBChangeProcess()
        {
            ThreadPool.QueueUserWorkItem(StartDBChangeQueue, "开始异步执行日志");
             
        }
       
        /// <summary>
        /// 开始执行保存队列
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        private void StartDBChangeQueue(object  obj)
        {
            var result = new InvokeResult();
            List<StorageData> updateList = new List<StorageData>();
            string connStr = SysAppConfig.DataBaseConnectionString;
            MongoOperation _mongoDBOp = new MongoOperation(connStr);
            var curDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            while (DBChangeQueue.Instance.Count > 0)
            {

                var temp = DBChangeQueue.Instance.DeQueue();
                if (temp != null)
                {
                    var insertDoc = temp.Document;

                    switch (temp.Type)
                    {
                        case StorageType.Insert:
                            if (insertDoc.Contains("createDate") == false) insertDoc.Add("createDate", curDate);      //添加时,默认增加创建时间
                            if (insertDoc.Contains("createUserId") == false) insertDoc.Add("createUserId", "1");
                            //更新用户
                            result = _mongoDBOp.Save(temp.Name, insertDoc);
                            break;
                        case StorageType.Update:
                            // insertDoc.Set("updateDate", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));      //更新时间
                            // insertDoc.Set("updateUserId", "1");
                            result = _mongoDBOp.Save(temp.Name, temp.Query, insertDoc);
                            break;
                        case StorageType.Delete:
                            result = _mongoDBOp.Delete(temp.Name, temp.Query);
                            break;
                    }
                    //logInfo1.Info("");
                    if (result.Status == Status.Failed) throw new Exception(result.Message);

                }

            }
            if (DBChangeQueue.Instance.Count > 0)
            {
                StartDBChangeQueue(obj);
            }
        }
        #endregion
        #endregion

        #region 服务
        /// <summary>
        /// Score=(p-1)/(T+2)g
        /// 其中，动态评分机制 防止分数高的一直占据首页
        ///  P表示帖子的得票数，减去1是为了忽略发帖人的投票。
        ///  T表示距离发帖的时间（单位为小时），加上2是为了防止最新的帖子导致分母过小（之所以选择2，可能是因为从原始文章出现在其他网站，到转贴至Hacker News，平均需要两个小时）。
        ///  G表示"重力因子"（gravityth power），即将帖子排名往下拉的力量，默认值为1.8，后文会详细讨论这个值。
        ///从这个公式来看，决定帖子排名有三个因素：
        ///第一个因素是得票数P。
        ///在其他条件不变的情况下，得票越多，排名越高。
        /// </summary>
        /// <returns></returns>
        public int UpdateArticleScoreService()
        {
            
            var latestStaticCount=1;///过滤掉一些长期没有看的文章
            var allCount = dataOp.FindCount("MindMapArticle", Query.GT("viewCount", 10));
            var allArticle = new List<BsonDocument>();
            if (allCount <= 1000)
            {
                allArticle = dataOp.FindAll("MindMapArticle").SetFields("articleId", "createDate", "weightCount", "viewCount", "replyCount", "priseCount", "favoriateCount","createUserId").ToList();
            }
            else {
                allArticle = dataOp.FindAllByQuery("MindMapArticle", Query.GT("weightCount", latestStaticCount)).SetFields("articleId", "createDate", "weightCount", "viewCount", "replyCount", "priseCount", "favoriateCount","createUserId").ToList();
            }
            //2017.5.11对自己上传的文章的得分汇总，每天定时变化，
            //var userList = new List<BsonDocument>();
            foreach (var article in allArticle)
            {
              
                var socre = GenerateArticleScore(article);
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticle", Document = new BsonDocument().Add("socre",  socre),Query=Query.EQ("articleId",article.Text("articleId")), Type = StorageType.Update });
                
                //#region 用户文章分数汇总
                //var hitUserObj = userList.Where(c => c.Text("userId") == article.Text("createUserId")).FirstOrDefault();
                //if (hitUserObj == null)
                //{
                //    hitUserObj = new BsonDocument().Add("userId", article.Text("createUserId")).Add("articleScore", socre);
                //    userList.Add(hitUserObj);
                //}
                //else
                //{
                //    hitUserObj.Set("articleScore",hitUserObj.Double("articleScore") + socre);
                //   // hitUserObj.Set("articleCount", hitUserObj.Int("articleCount") + 1);
                //}
                //#endregion
            }


            /////更新用户文章数 与
            //if (userList.Count() > 0)
            //{
            //    userList.ForEach(c => DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "SysUser", Document = new BsonDocument().Add("articleScore", c.Double("articleScore")), Query = Query.EQ("userId", c.Text("userId")), Type = StorageType.Update }));
            //}
            QuickStartDBChangeProcess();
            return allArticle.Count();
       }
        /// <summary>
        ///  更新用户得分
        /// </summary>
        public int UpdateUserCoinService()
        {
            var EPersonItemList = dataOp.FindFieldsByQuery("Expert_PersonItem",null,new string[]{"itemId","userId"}).ToList();
            var hitUserIds = EPersonItemList.Select(c => c.Text("userId")).Distinct().ToList();
            var itemHelper = new ItemHelper();
            var allItem = itemHelper.GetAllItem();
           
            foreach (var userId in hitUserIds)
            {
                var sumMoney = 0;
                var hitItemList = EPersonItemList.Where(c => c.Text("userId") == userId).Select(c => c.Text("itemId")).ToList();
                foreach (var itemId in hitItemList)
                {
                    var hitItem = allItem.Where(c => itemId == c.Text("_id")).FirstOrDefault();
                    if (hitItem == null) continue;
                    sumMoney += hitItem.Int("value");
                }
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "SysUser", Document = new BsonDocument().Add("coin", sumMoney), Query = Query.EQ("userId", userId), Type = StorageType.Update });
            }
           
            QuickStartDBChangeProcess();
            return hitUserIds.Count();
        }

        /// <summary>
        /// 生成文章得分
        /// </summary>
        /// <returns></returns>
        public double GenerateArticleScore(BsonDocument doc)
        {   
          var viewCount = doc.Double("viewCount");
          var replyCount =doc.Double("replyCount");
          var priseCount = doc.Double("priseCount");
          var favoriateCount = doc.Double("favoriateCount");
          var G = 1.8;//重力因子
          var P = viewCount + replyCount + priseCount + favoriateCount;
          var T = (DateTime.Now - doc.Date("createDate")).Hours;
          var socre = (P - 1) / Math.Pow(T + 2, G);
          return socre;
        }

        /// <summary>
        /// 更新统计个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapArticleStaticCount(string articleId)
        {
            var result = new InvokeResult();
            var curArticle = dataOp.FindOneByQuery("MindMapArticle", Query.EQ("articleId", articleId));
            if (curArticle != null)
            {
                var viewCount = GetArticleViewCount(articleId);
                var replyCount = GetArticleCommentCount(articleId);
                var priseCount = GetArticlePrisedCount(articleId);
                var favoriateCount = GetArticleFavoriatedCount(articleId);
                curArticle.Set("viewCount", viewCount);
                curArticle.Set("replyCount", replyCount);
                curArticle.Set("priseCount", priseCount);
                curArticle.Set("favoriateCount", favoriateCount);
                //设置权重
                curArticle.Set("weightCount", GetArticleWeighCount(curArticle));
                DBChangeQueue.Instance.EnQueue(new StorageData() { Name = "MindMapArticle", Document = curArticle, Type = StorageType.Update });
            }
            return result;
        }
        /// <summary>
        /// 获取权重值
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        public double GetArticleWeighCount(BsonDocument doc)
        { 
          var viewCount = doc.Double("viewCount");
          var replyCount =doc.Double("replyCount");
          var priseCount = doc.Double("priseCount");
          var favoriateCount = doc.Double("favoriateCount");
          var articleCount = doc.Double("articleCount");//文章数，用户对象拥有
          return viewCount * 0.1 + replyCount * 0.1 + priseCount * 0.3 + favoriateCount * 0.4+articleCount*0.1;
        }

        #region 定时更新脉络图索引

        /// <summary>
        /// 更新统计个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelCollection()
        {
            var result = new InvokeResult();
            var query = Query.And(Query.NE("deleteStatus", "1"));
            var allMindMapLibraryList = dataOp.FindAllByQuery("MindMapLibrary", query).ToList();
            foreach (var mindMap in allMindMapLibraryList)
            {
                UpdateMindMapLabelCollection(mindMap.Text("mindMapId"));
                
             }
            return result;
        }
        /// <summary>
        /// 更新统计个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelCollection(List<string> mindMapIds)
        {
            var result = new InvokeResult();
            foreach (var mindMapId in mindMapIds.Distinct())
            {
                result = UpdateMindMapLabelCollection(mindMapId);
            }
            return result;
        }
         
        /// <summary>
        /// 更新统计个数
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="updateBson"></param>
        /// <returns></returns>
        public InvokeResult UpdateMindMapLabelCollection(string mindMapId)
        {
                var result = new InvokeResult();
                var hitLabellIds = GetMindMapLabelCollection(mindMapId);
                var hitLabelColleciton = dataOp.FindAllByQuery("MindMapLabelCollection", Query.In("labelId", hitLabellIds.Select(c => (BsonValue)c))).SetFields("name").Select(c => c.Text("name")).ToList();
                var array = new BsonArray(hitLabelColleciton);
                result = UpdateMindMapLabelIndexAsync(mindMapId, array);
                return result;
        }
        #endregion
        #endregion
    }
}
