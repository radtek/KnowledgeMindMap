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
    /// 月计划状态
    /// </summary>
    public enum MissionType
    {
        /// <summary>
        /// 每日
        /// </summary>
        [EnumDescription("每日")]
        Day = 0,
        /// <summary>
        /// 每周
        /// </summary>
        [EnumDescription("每周")]
        Week = 1,
        /// <summary>
        /// 副本
        /// </summary>
        [EnumDescription("进阶")]
        Dungeons = 2,
        /// <summary>
        /// 极限
        /// </summary>
        [EnumDescription("极限")]
        Hell = 3
    }

    /// <summary>
    /// 分类
    /// </summary>
    public enum MissionCategory
    {
        /// <summary>
        /// 每日
        /// </summary>
        [EnumDescription("成就")]
        AchieveMentMission = 0,
        /// <summary>
        /// 愿望
        /// </summary>
        [EnumDescription("愿望")]
        WishMission = 1,

        /// <summary>
        /// 系统
        /// </summary>
        [EnumDescription("系统")]
        SystemhMission = 2,

    }
    //掉落详情
    public class ItemDropContent
    {
        public string color { get; set; }
        public string rareDropItemClass { get; set; }
        public string rarity { get; set; }
        public BsonDocument equipmenItem { get; set; }
    }
    //掉落详情
    public class ItemDropDescFormat
    {
        public string column { get; set; }//列名
        public string preFix { get; set; }//前缀
        public string nextFix { get; set; }//后缀
        public string desc { get; set; }//描述
        public string group { get; set; }//分组
    }


    public class ItemHelper
    {

        #region 构造函数
       
       public const  int DROPCDTIME = 2 * 60;
       public const int EXPERTOBJECTKEYTIME = 1;//0.5天重置
        /// <summary>
        /// 类私有变量
        /// </summary>
        private DataOperation dataOp = null;
        double addition = SysAppConfig.Mission_PointAddition;//10%加成
        double maxAddition = SysAppConfig.Mission_MaxPointAddition;//最高加成70&
        int itemDropSeed = SysAppConfig.Mission_ItemDropSeed;//6000000
        public List<ItemDropDescFormat> equipDescDic = new List<ItemDropDescFormat>();
        private string tableName = "";
        List<BsonDocument> itemDropRateList = null;//发生率
        /// <summary>
        /// 封闭当前默认构造函数
        /// </summary>
        public ItemHelper()
        {
            string WorkPlanManageConnectionString = SysAppConfig.DataBaseConnectionString;
            dataOp = new DataOperation(WorkPlanManageConnectionString, true);
            itemDropRateList = dataOp.FindAll("EquipmentQuality").OrderBy(c => c.Int("itemDropRate")).ToList();
            InitialEquipDesc();
        }

        public ItemHelper(DataOperation _dataOp)
        {
            InitialEquipDesc();
            dataOp = _dataOp;
            itemDropRateList = dataOp.FindAll("EquipmentQuality").OrderBy(c => c.Int("itemDropRate")).ToList();
        }

        public void InitialEquipDesc()
        {
            //equipDescDic.Add("durability","耐久");
            //equipDescDic.Add("cooltime", "冷却");//毫秒
            equipDescDic.Add(new ItemDropDescFormat { column = "remark", desc = "备注", });
            equipDescDic.Add(new ItemDropDescFormat { column = "effect", desc = "效果", });

        }

        public static ItemHelper _()
        {
            return new ItemHelper();
        }

        public static ItemHelper _(DataOperation _dataOp)
        {
            return new ItemHelper(_dataOp);
        }


        /// <summary>
        /// 获取描述
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public string GetEquipmentProperty(BsonDocument item)
        {
            var index = 1;
            var equipDesc = new StringBuilder();
            bool isFinish = false;
            equipDesc.Append("<table>");
            foreach (var property in equipDescDic)
            {
                var propertyName = property.column;
                var curPrefix = "+";
                var curNextfix = property.nextFix;


                if (!string.IsNullOrEmpty(item.Text(propertyName)) && item.Text(propertyName) != "0" && item.Text(propertyName) != "-1")
                {

                    equipDesc.Append("<tr>");

                    var fixValue = item.Text(propertyName);
                    if (!string.IsNullOrEmpty(property.preFix))
                    {
                        curPrefix = property.preFix;
                    }
                    if (property.nextFix == "%%")//攻速类处理
                    {

                        fixValue = (Math.Round(item.Double(propertyName) / 10, 0)).ToString();

                        if (item.Int(propertyName) < 0)
                        {
                            curPrefix = "";
                        }
                        curNextfix = "%";
                    }
                    equipDesc.AppendFormat("<td >{0}</td><td>{1}{2}{3}</td> ", property.desc, curPrefix, fixValue, curNextfix);
                    equipDesc.Append("</tr>");
                    isFinish = true;
                    //equipDesc.AppendFormat("<br/>");

                    index++;

                }

            }
            equipDesc.Append("</table>");

            return equipDesc.ToString();
        }


        /// <summary>
        /// 获取装备售价
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public int GetEquipmentSellPrice(BsonDocument item)
        {
            var sellPoint = item.Int("price");

            switch (item.Int("rarity"))//66假紫
            {
                case 0://白
                    sellPoint = 1;
                    break;
                case 1://蓝
                    sellPoint = 2;
                    break;
                case 2://紫
                    sellPoint = sellPoint / 2000;
                    break;
                case 3://粉
                    sellPoint = sellPoint / 1500;

                    break;
                case 4://传奇
                    sellPoint = sellPoint / 1000;
                    break;
                case 5://ss
                    sellPoint = sellPoint / 500;
                    break;
            }
            return sellPoint;
        }

        /// <summary>
        /// 获取图片地址
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public string GetEquipmentImgDiv(BsonDocument item)
        {
            var ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/68.png";
            switch (item.Int("rarity"))//66假紫
            {
                case 0://白 n
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/62.png";
                    break;
                case 1://蓝 n
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/63.png";
                    break;
                case 2://紫 n
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/64.png";
                    break;
                case 3://粉 R
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/66.png";

                    break;
                case 4://传奇 SR
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/67.png";
                    break;
                case 5://ss SSR
                    ssLandMark = @"/Content/LifeDay/sprite_item/iconmark/68.png";
                    break;
            }

            var fixPath = item.Text("fixUrl");
            if (!string.IsNullOrEmpty(fixPath))
            {
                var imgDivStr = string.Format("<p  style=\" background-image:url('{0}'); width:28px; height:28px; \"> <img style=\" float:left; width:28px; height:28px; \" src=\"{1}\"/></p>", fixPath, ssLandMark);
                return imgDivStr;
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// 获取任务完成加成point
        /// </summary>
        /// <param name="mission"></param>
        public int GetMissionCompointPoint(BsonDocument mission)
        {
            var curMissPoint = mission.Int("completeRewardPoint");
            if (curMissPoint != 0)
            {
                var curAddition = addition * mission.Int("comboHit");//最高加成70%
                if (curAddition >= maxAddition)
                {
                    curAddition = maxAddition;
                }
                curMissPoint = (int)(curMissPoint * (1 + curAddition));
            }
            return curMissPoint;
        }

        /// <summary>
        /// 等级加成
        /// </summary>
        /// <param name="user"></param>
        /// <param name="exp"></param>
        /// <returns></returns>
        public int GetLevleAddionalExp(int curLevel, double exp)
        {

            #region 当前经验值计算
            var missionFixValueExp = 1;
            var threeB = (curLevel - 1) * (curLevel - 1);
            var curMissionExp = (threeB + missionFixValueExp) / 5 * ((curLevel - 1) * 2 + missionFixValueExp);
            #endregion
            if (curMissionExp == 0)
            {
                curMissionExp = 10;//默认10点
            }
            return curMissionExp;
        }

        /// <summary>
        /// 获取任务完成加成exp值，与当前等级挂钩，与金币加成同步
        /// </summary>
        /// <param name="mission"></param>
        public int GetMissionCompleteExp(BsonDocument user, BsonDocument mission)
        {
            var curMissionExp = mission.Double("completeRewardExp");
            if (curMissionExp <= 0)
            {
                #region 当前经验值计算
                curMissionExp = GetLevleAddionalExp(user.Int("level"), curMissionExp);
                #endregion


                if (mission.Int("type") == (int)MissionCategory.AchieveMentMission)
                {
                    switch (mission.Int("missionType"))
                    {
                        case (int)MissionType.Day:

                            break;
                        case (int)MissionType.Week:
                            curMissionExp = curMissionExp * (1 + 0.2);//20%加成
                            break;
                        case (int)MissionType.Dungeons:
                            curMissionExp = curMissionExp * (1 + 0.5);//50%加成
                            break;
                        case (int)MissionType.Hell:
                            curMissionExp = curMissionExp * (1 + 0.2);//20%加成
                            break;
                    }

                }
                else//愿望任务
                {
                    curMissionExp = curMissionExp * 10;//1000%加成
                }
            }



            if (curMissionExp != 0)
            {
                var curAddition = addition * mission.Int("comboHit");//最高加成70%
                if (curAddition >= maxAddition)
                {
                    curAddition = maxAddition;
                }
                curMissionExp = (int)(curMissionExp * (1 + curAddition));
            }
            return int.Parse(Math.Abs(curMissionExp).ToString());
        }

        /// <summary>
        /// 默认为非必需掉物品
        /// </summary>
        /// <param name="rand"></param>
        /// <returns></returns>
        public ItemDropContent EquipmentDropQuality(int level, Random rand)
        {
            return EquipmentDropQuality(level, false, rand);
        }

        /// <summary>
        /// 获取所有Item
        /// </summary>
        /// <returns></returns>
        public List<BsonDocument> GetAllItem()
        {
            List<BsonDocument> allEquipment = null;
            allEquipment = dataOp.FindAll("Expert_Item").ToList();
            return allEquipment;

        }

        /// <summary>
        /// 物品掉落品质
        /// </summary>
        /// <param name="mustDrop"></param>
        /// <param name="rand">传入该对象将次数越多越高几率获得不同物品</param>
        /// <returns></returns>
        public ItemDropContent EquipmentDropQuality(int curUserLevel, bool mustDrop, Random rand)
        {
            if (rand == null)
            {
                rand = new Random();//
            }
            int minItemDropSeed = 0;
            if (mustDrop == true)
            {
                minItemDropSeed = itemDropSeed;
            }
            var equipmentCode = rand.Next(minItemDropSeed, 1000000);

            if (equipmentCode < itemDropSeed) return null;
            var hitEquipment = itemDropRateList.Where(c => c.Int("itemDropRate") > equipmentCode).FirstOrDefault();
            if (hitEquipment != null)
            {
                var minEquipLevel = curUserLevel - 10;
                var maxEquipLevel = curUserLevel + 10;
                if (minEquipLevel < 10)
                {
                    minEquipLevel = 0;
                }
                if (maxEquipLevel > 80)
                {
                    minEquipLevel = 80;
                }

                var fixMaxEquipLevel = maxEquipLevel;

                var color = "white";//默认黑色
                var rareDropItemClass = "";
                switch (hitEquipment.Int("rarity"))
                {
                    case 0://白
                        color = "#ecf0f1";
                        if (maxEquipLevel < 50)
                        {
                            fixMaxEquipLevel = 85;
                        }
                        break;
                    case 1://蓝
                        color = "#3498db";
                        if (maxEquipLevel < 50)
                        {
                            fixMaxEquipLevel = 85;
                        }
                        break;
                    case 2://紫
                        color = "#8e44ad";
                        if (maxEquipLevel < 50)
                        {
                            fixMaxEquipLevel = 85;
                        }
                        break;
                    case 3://粉
                        color = "#C0139E";
                        rareDropItemClass = "raredrop";
                        break;
                    case 4://传奇
                        color = "#e74c3c";
                        rareDropItemClass = "raredrop";
                        //因为
                        if (maxEquipLevel < 50)//可获取50的传奇
                        {
                            fixMaxEquipLevel = 50;
                        }
                        break;
                    case 5://ss
                        color = "#f1c40f";
                        rareDropItemClass = "raredrop";
                        if (maxEquipLevel < 45)//可获取55的ss，等级低也可以获取高级ss
                        {
                            fixMaxEquipLevel = 45;
                        }
                        break;
                }

                //var hitEquipmentList = GetAllItem().Where(c => c.Text("rarity") == hitEquipment.Text("rarity") && c.Int("level") >= minEquipLevel && c.Int("level") <= fixMaxEquipLevel).ToList();
                var hitEquipmentList = GetAllItem().Where(c => c.Text("rarity") == hitEquipment.Text("rarity")).ToList(); //测试用提高概率
                if (hitEquipmentList.Count() <= 0) return null;

                var equipRand = new Random();
                var skipCount = equipRand.Next(hitEquipmentList.Count);
                var curEquipment = hitEquipmentList.Skip(skipCount).FirstOrDefault();

                var itemDropContent = new ItemDropContent() { color = color, rareDropItemClass = rareDropItemClass, rarity = hitEquipment.Text("rarity"), equipmenItem = curEquipment };
                return itemDropContent;
            }
            return null;
        }




        #endregion


        #region 获取今天完成的系统任务
        public List<BsonDocument> GetTodaySystemAchievement(string userId)
        {
            var beginDate = DateTime.Now.ToString("yyyy-MM-dd");
            var endDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
            var personAchievement = dataOp.FindAllByQuery("ExpertPersonAchievement", Query.And(Query.EQ("type", "2"), Query.EQ("userId", userId), Query.GTE("completeDate", beginDate), Query.LTE("completeDate", endDate))).ToList();
            return personAchievement;
        }
        #endregion
        #region 初始化账号



        /// <summary>
        /// 初始化模板任务TODO:加载模板初始化
        /// </summary>
        /// <param name="userId"></param>
        public InvokeResult InitialMissionTemplate(string userId, string missionTemplateId)
        {
            #region 初始化系统任务模板
            InvokeResult result = new InvokeResult();
            var curSystemMissionObj = dataOp.FindOneByQuery("Expert_MissionTemplate", Query.EQ("_id", ObjectId.Parse(missionTemplateId)));
            if (curSystemMissionObj != null)
            {
                var addMission = new BsonDocument().Add("name", curSystemMissionObj.Text("name")).Add("remark", curSystemMissionObj.Text("remark")).Add("status", "0")
                                 .Add("type", "0").Add("missionType", curSystemMissionObj.Text("missionType")).Add("templateType", curSystemMissionObj.Text("type"))
                                 .Add("completeRewardPoint", curSystemMissionObj.Text("completeRewardPoint"))
                                 .Add("failInfluencePoint", curSystemMissionObj.Text("failInfluencePoint"))
                                 .Add("maxCompleteCount", curSystemMissionObj.Text("maxCompleteCount")).Add("userId", userId)
                                 .Add("limitedTime", curSystemMissionObj.Text("limitedTime")).Add("invalidDate", curSystemMissionObj.Text("invalidDate"))
                                 .Add("difficulty", curSystemMissionObj.Text("difficulty")).Add("missionTemplateId", curSystemMissionObj.Text("_id"));

                result = dataOp.Insert("MissionLibrary", addMission);
            }

            #endregion
            return result;
        }



        /// <summary>
        /// 初始化系统任务
        /// </summary>
        /// <param name="userId"></param>
        public void InitialSystemMission(List<string> userIdList)
        {
            #region 初始化系统任务模板
            var addMissionList = new List<BsonDocument>();
            foreach (var userId in userIdList)
            {
                if (string.IsNullOrEmpty(userId))
                {
                    continue;
                }
                var missionQuery = Query.And(Query.EQ("userId", userId), Query.EQ("templateType", "2"));

                var curSystemMissionIds = dataOp.FindAllByQuery("Expert_MissionLibrary", missionQuery).Select(c => c.Text("missionTemplateId")).ToList();
                var allSystemMissionList = dataOp.FindAllByQuery("Expert_MissionTemplate", Query.And(Query.EQ("type", "2"), Query.NotIn("_id", TypeConvert.ToObjectIdList(curSystemMissionIds)))).ToList();
                if (allSystemMissionList.Count() > 0)
                {
                    var addMission = from c in allSystemMissionList
                                     select new BsonDocument().Add("name", c.Text("name")).Add("remark", c.Text("remark")).Add("status", "0")
                                     .Add("type", "0").Add("missionType", c.Text("missionType")).Add("templateType", c.Text("type"))
                                     .Add("completeRewardPoint", c.Text("completeRewardPoint"))
                                     .Add("failInfluencePoint", c.Text("failInfluencePoint"))
                                     .Add("maxCompleteCount", c.Text("maxCompleteCount")).Add("userId", userId)
                                     .Add("limitedTime", c.Text("limitedTime")).Add("invalidDate", c.Text("invalidDate"))
                                     .Add("difficulty", c.Text("difficulty")).Add("missionTemplateId", c.Text("_id"));
                    addMissionList.AddRange(addMission.ToList());
                }
            }
            if (addMissionList.Count() > 0)
            {
                dataOp.QuickInsert("Expert_MissionLibrary", addMissionList);
            }
            #endregion
        }

        #endregion

        #region //获取物品掉落
        /// <summary>
        /// 物品掉落处理
        /// </summary>
        /// <returns></returns>
        public InvokeResult ItemDropAction(string userId, int itemDropCount = 1)
        {
            var result = new InvokeResult() { Status = Status.Failed };
            //// 执行方法后返回对应物品道具掉落
            var itemMessage = new StringBuilder();//物品获得信息
            var rareItemMessage = new StringBuilder();//稀有物品获得信息

            DataOperation dataOp = new DataOperation();
            //var ItemHelper = new ItemHelper(dataOp);
            var isLevelUp = false;
            //缓存
            List<BsonDocument> allEquipment = null;
            allEquipment = dataOp.FindAll("Expert_Item").ToList();

            var curUser = dataOp.FindAllByQuery("SysUser", Query.EQ("userId", userId)).FirstOrDefault();
            if (curUser == null)
            {
                result.Message = "当前用户不存在，请刷新重试";

            }

            var missionStorageDataList = new List<StorageData>();
            var curUserPoint = curUser.Int("point");
            var curUserExp = curUser.Int("exp");
            ///设定每天最大掉落次数
            var hellChallengeCount = SysAppConfig.Mission_HellChallengeCount;
            var validHellChallengeCount = hellChallengeCount - curUser.Int("execExpertItemDropCount");
            validHellChallengeCount = 1;//todo:后续需要修改
            var storageDataList = new List<StorageData>();
            ///掉落物品列表
            List<ItemDropContent> equipmentContentList = new List<ItemDropContent>();
            if (validHellChallengeCount > 0)//可挑战
            {
                curUserPoint += SysAppConfig.Mission_HellChallengePoint;
                //经验获得
                curUserExp += GetMissionCompleteExp(curUser, new BsonDocument().Add("missionType", "1"));
                //获取奖励
                #region 爆率物品更新,每次掉落几个物品，默认为一

                //itemDropCount = SysAppConfig.Mission_HellItemDropCount;

                //if (itemDropCount <= 0)
                //{
                //    itemDropCount = 1;
                //}
                //if (itemDropCount > 8)
                //{
                //    itemDropCount = 8;
                //}
                var rareityRand = new Random();//品质随机
                var curUserLevel = curUser.Int("level");

                for (var index = 1; index <= itemDropCount; index++)
                {
                    var equipmentContent = EquipmentDropQuality(curUser.Int("level"), rareityRand);//独立计算降低出货
                    if (equipmentContent == null) continue;
                    var color = equipmentContent.color;
                    var rareItemClass = equipmentContent.rareDropItemClass;
                    var hitEquipment = equipmentContent.equipmenItem;
                    if (hitEquipment == null) continue;
                    equipmentContentList.Add(equipmentContent);
                    var insertItem = new BsonDocument();
                    insertItem.Add("amount", "1");
                    insertItem.Add("name", hitEquipment.Text("name"));
                    insertItem.Add("itemId", hitEquipment.Text("_id"));
                    insertItem.Add("rarity", hitEquipment.Text("rarity"));
                    insertItem.Add("userId", curUser.Text("userId"));
                    ///个人物品获得
                    storageDataList.Add(new StorageData()
                    {
                        Document = insertItem,
                        Name = "Expert_PersonItem",
                        Type = StorageType.Insert
                    });

                }
                #endregion

                #region 更新个人Exp值
                if (curUser.Int("exp") != curUserExp)
                {
                    //curUserExp = ItemHelper.GetLevleAddionalExp(curUser.Int("level"), curUserExp);

                    if (curUserExp > curUser.Int("exp"))
                        itemMessage.AppendFormat(" +{0}EXP", curUserExp - curUser.Int("exp"));
                    var updateBoson = new BsonDocument();

                    var nextUserLevel = ++curUserLevel;
                    var nexLevel = dataOp.FindOneByKeyVal("PersonLevel", "level", (nextUserLevel).ToString());
                    if (nexLevel != null)
                    {
                        var nexLevelExp = nexLevel.Int("levelExp");
                        while (curUserExp >= nexLevelExp)//升级
                        {
                            if (!isLevelUp)
                            {
                                isLevelUp = true;
                            }
                            updateBoson.Set("level", (nextUserLevel).ToString());
                            curUserExp -= nexLevelExp;//减少经验
                            nextUserLevel++;
                            nexLevel = dataOp.FindOneByKeyVal("PersonLevel", "level", (nextUserLevel).ToString());
                            if (nexLevel != null)
                            {
                                nexLevelExp = nexLevel.Int("levelExp");
                            }
                            else//无法继续升级
                            {
                                curUserExp = nexLevelExp;//最高级exp
                                break;
                            }
                        }
                    }
                    if (nextUserLevel < 0)
                    {
                        nextUserLevel = 0;
                    }
                    updateBoson.Add("exp", curUserExp.ToString());
                    missionStorageDataList.Add(new StorageData()
                    {
                        Document = updateBoson,
                        Name = "SysUser",
                        Query = Query.EQ("userId", curUser.Text("userId")),
                        Type = StorageType.Update
                    });
                }


                #endregion

                #region 更新point值
                if (curUser.Int("point") != curUserPoint)
                {
                    if (curUserPoint > curUser.Int("point"))
                        itemMessage.AppendFormat(",+{0}P", curUserPoint - curUser.Int("point"));
                    missionStorageDataList.Add(new StorageData()
                    {
                        Document = new BsonDocument().Add("point", curUserPoint),
                        Name = "SysUser",
                        Query = Query.EQ("userId", curUser.Text("userId")),
                        Type = StorageType.Update
                    });
                }
                #endregion

                #region 更新execExpertItemDropCount
                missionStorageDataList.Add(new StorageData()
                {
                    Document = new BsonDocument().Add("execExpertItemDropCount", curUser.Int("execExpertItemDropCount") + 1),
                    Name = "SysUser",
                    Query = Query.EQ("userId", curUser.Text("userId")),
                    Type = StorageType.Update
                });
                #endregion
            }
            missionStorageDataList.AddRange(storageDataList);
            if (missionStorageDataList.Count() > 0)
            {
                result = dataOp.BatchSaveStorageData(missionStorageDataList);
            }
            else
            {
                result.Status = Status.Failed;
                result.Message = "无法挑战！请重试";
            }
            if (equipmentContentList.Count() <= 0 && result.Status == Status.Successful)
            {
                result.Message = string.Format("喵~", itemMessage.ToString());
            }
            if (isLevelUp && result.BsonInfo != null)
            {
                result.BsonInfo.Set("isLevelUp", isLevelUp.ToString());
            }
            result.BsonInfo.Set("isLevelUp", "true");

            return result;
        }

        #endregion

        /// <summary>
        /// 当前是否可以掉落物品
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool CanExecDailyItemDrop(string userId)
        {
            return ExecDailyItemDropTimes(userId) > 0;
        }
        /// <summary>
        /// 当前是否可以掉落物品
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public int  ExecDailyItemDropTimes(string userId)
        {
            //设定每天最大掉落次数
            var hellChallengeCount = SysAppConfig.Mission_HellChallengeCount;

            var curUser = dataOp.FindAllByQuery("SysUser", Query.EQ("userId", userId)).FirstOrDefault();
            var itemCount = curUser.Int("execHellChallengeCount");
            //当天获得物品数
           // var ItemCount = dataOp.FindCount("Expert_PersonItem", Query.And(Query.EQ("userId", userId), Query.Matches("createDate", new BsonRegularExpression(DateTime.Now.ToString("yyyy-MM-dd")))));
            //剩余获得次数
            var validDropCount = hellChallengeCount - itemCount;
            //validDropCount = 1; //测试用 无限掉落
            return validDropCount < 0 ? 0 : validDropCount;
        }
        #region 每日掉落
        /// <summary>
        /// 物品掉落处理
        /// </summary>
        /// <returns></returns>
        public InvokeResult DailyItemDrop(string userId, int itemDropCount = 1)
        {
            var result = new InvokeResult() { Status = Status.Successful };
            //// 执行方法后返回对应物品道具掉落
            var expMessage = new StringBuilder(); //经验获得信息
            var rareItemMessage = new StringBuilder(); //稀有物品获得信息

            List<BsonDocument> allEquipment = dataOp.FindAll("Expert_Item").ToList(); //掉落物品列表

            var curUser = dataOp.FindAllByQuery("SysUser", Query.EQ("userId", userId)).FirstOrDefault();
            if (curUser == null)
            {
                result.Message = "当前用户不存在，请刷新重试";
            }

            var curUserPoint = curUser.Int("point");
            var curUserExp = curUser.Int("exp");
             var curUserCoin = curUser.Int("coin");
            ////设定每天最大掉落次数
            //var hellChallengeCount = SysAppConfig.Mission_HellChallengeCount;
            ////当天获得物品数
            //var ItemCount = dataOp.FindCount("Expert_PersonItem", Query.And(Query.EQ("userId", curUser.String("userId")), Query.Matches("createDate", new BsonRegularExpression(DateTime.Now.ToString("yyyy-MM-dd")))));
            ////剩余获得次数
            //var validDropCount = hellChallengeCount - ItemCount;
         
            var storageDataList = new List<StorageData>();
            ///掉落物品列表
            List<ItemDropContent> equipmentContentList = new List<ItemDropContent>();
            var itemResult = new List<BsonDocument>();
            var curUserLevel = curUser.Int("level"); //当前等级
            if (CanExecDailyItemDrop(userId)) //可获得物品
            {
                curUserPoint += SysAppConfig.Mission_HellChallengePoint;

                //获取奖励
                #region 爆率物品更新,每次掉落几个物品，默认为一

                //itemDropCount = SysAppConfig.Mission_HellItemDropCount;

                //if (itemDropCount <= 0)
                //{
                //    itemDropCount = 1;
                //}
                //if (itemDropCount > 8)
                //{
                //    itemDropCount = 8;
                //}
                var rareityRand = new Random();//品质随机

                for (var index = 1; index <= itemDropCount; index++)
                {
                    var equipmentContent = EquipmentDropQuality(curUser.Int("level"), rareityRand);//独立计算降低出货
                    if (equipmentContent == null) continue;
                    var color = equipmentContent.color;
                    var rareItemClass = equipmentContent.rareDropItemClass;
                    var hitEquipment = equipmentContent.equipmenItem;
                    if (hitEquipment == null) continue;
                    equipmentContentList.Add(equipmentContent);
                    var insertItem = new BsonDocument();
                    insertItem.Add("amount", "1");
                    insertItem.Add("name", hitEquipment.Text("name"));
                    insertItem.Add("itemId", hitEquipment.Text("_id"));
                    insertItem.Add("rarity", hitEquipment.Text("rarity"));
                    insertItem.Add("userId", curUser.Text("userId"));
                    //coin增加
                    curUserCoin+=hitEquipment.Int("value");

                    //个人物品获得
                    storageDataList.Add(new StorageData()
                    {
                        Document = insertItem,
                        Name = "Expert_PersonItem",
                        Type = StorageType.Insert
                    });
                    var hitItemObj = itemResult.Where(c => c.Text("itemId") == hitEquipment.Text("_id")).FirstOrDefault();
                    if (hitItemObj == null)
                    {
                        var item = new BsonDocument();
                        item.Add("type", "item");
                        item.Add("itemId", hitEquipment.String("_id"));
                        item.Add("itemName", hitEquipment.String("name"));
                        item.Add("itemRarity", hitEquipment.String("rarity"));
                        item.Add("count", "1");//个数
                        item.Add("userName", curUser.Text("name"));
                        item.Add("dateTime", DateTime.Now.ToString("HH:mm:ss"));
                        result.BsonInfo = item;
                        itemResult.Add(item);
                    }
                    else
                    {
                        hitItemObj.Set("count", hitItemObj.Int("count") + 1);
                    }
                    if (!rareItemMessage.ToString().Contains("道具"))
                    {
                        rareItemMessage.Append("获得了道具");
                    }
                    //更新execExpertItemDropCount
                    storageDataList.Add(new StorageData()
                    {
                        Document = new BsonDocument().Add("execHellChallengeCount", curUser.Int("execHellChallengeCount") + 1),
                        Name = "SysUser",
                        Query = Query.EQ("userId", curUser.Text("userId")),
                        Type = StorageType.Update
                    });

                }
                #endregion
            }

            // 掉落物品才增加经验修复为每次都掉落经验,防止等级上升太快
            if (equipmentContentList.Count> 0)
            {
                var addUserExp = GetMissionCompleteExp(curUser, new BsonDocument().Add("missionType", "1"));
                var random = new Random();
                addUserExp = addUserExp *(1+ random.Next(1, 10) / 100);
                curUserExp += addUserExp;
                if (curUserExp < 0)
                {
                    curUserExp = 0;
                }
            }
            #region 更新个人Exp值
            if (curUser.Int("exp") != curUserExp)
            {
                var updateBoson = new BsonDocument();

                var nextUserLevel = ++curUserLevel;
                var nexLevel = dataOp.FindOneByKeyVal("PersonLevel", "level", (nextUserLevel).ToString());
                if (nexLevel != null)
                {
                    var nexLevelExp = nexLevel.Int("levelExp");
                    while (curUserExp >= nexLevelExp)//升级
                    {
                        updateBoson.Set("level", (nextUserLevel).ToString());
                        curUserExp -= nexLevelExp;//减少经验
                        nextUserLevel++;
                        nexLevel = dataOp.FindOneByKeyVal("PersonLevel", "level", (nextUserLevel).ToString());
                        if (nexLevel != null)
                        {
                            nexLevelExp = nexLevel.Int("levelExp");
                        }
                        else//无法继续升级
                        {
                            curUserExp = nexLevelExp;//最高级exp
                            break;
                        }
                    }
                }
                if (nextUserLevel < 0)
                {
                    nextUserLevel = 0;
                }
                updateBoson.Add("exp", curUserExp.ToString());
                updateBoson.Add("coin", curUserCoin);
                storageDataList.Add(new StorageData()
                {
                    Document = updateBoson,
                    Name = "SysUser",
                    Query = Query.EQ("userId", curUser.Text("userId")),
                    Type = StorageType.Update
                });
            }
            #endregion
            var saveResult = new InvokeResult();
            if (storageDataList.Count() > 0)
            {
                saveResult = dataOp.BatchSaveStorageData(storageDataList);
            }
            else
            {
                result.Status = Status.Failed;
                result.Message = "无法获取！请重试";
            }
            if (itemResult.Count() <= 0 && saveResult.Status == Status.Successful) //经验
            {
                result.BsonInfo = saveResult.BsonInfo;
                result.Message = "获取经验";
            }
            if (itemResult.Count() > 0 && saveResult.Status == Status.Successful) //物品
            {
                var jsonResult = new { message = rareItemMessage.ToString(), itemList = itemResult };
                result.Message = jsonResult.ToJson();
            }

            return result;
        }

        #endregion

       
    }
}
