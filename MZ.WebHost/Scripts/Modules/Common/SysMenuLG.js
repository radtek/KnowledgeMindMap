/*
//新菜单
//
*/
var loginName = (typeof logName != "undefined") ? logName : "";
//var fileLibUrl = "http://59.61.72.35:8013/Account/SSOLogin/?userName=" + loginName + "&ReturnUrl=";
var fileLibUrl = A3SysPort + "/Account/SSOLogin/?userName=" + loginName + "&ReturnUrl=";
firstMenus = {
    //"1": { "name": "首页", "url": "/PersonelWorkCenter/PersonalTaskCenter", "code": "TASKCENTER_VIEW,APPROVALCENTER_VIEW", "visible": false, "isShow": true },
    "1": { "name": "工作中心", "url": "/PlanManage/PersonalFlowCenter", "code": "PERSONADUITCENTRE_VIEW", "visible": false, "isShow": true },
    //    "2": { "name": "项目库", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG", "visible": false, "isShow": true },
    //    "2": { "name": "项目库", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG", "visible": false, "isShow": true },
    "2": { "name": "项目库", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "visible": false, "isShow": true },
    //    "3": { "name": "产品系列", "url": "/ProductDevelop/ProductSeriesManage", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_VIEWMAG,CUSTLIB_VIEW,CUSTLIB_VIEWMAG,LANDLIB_VIEW,LANDLIB_VIEWMAG", "visible": false, "isShow": true },
    "3": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_UPDATE", "visible": false, "isShow": true },
    "4": { "name": "外部项目库", "url": "/DesignManage/LandIndex?isOutside=1", "code": "OUTPROJECTLIB_VIEW,OUTPROJECTLIB_ADMIN", "visible": false, "isShow": true },
    //    "5": { "name": "部品材料库", "url": "/Material/MaterialStorage", "code": "MATERIALLIB_VIEW,MATERIALLIB_VIEWMAG,SEEDINGLIB_VIEW,SEEDINGLIB_VIEWMAG,MATERIALCONTRAST_VIEW", "visible": false, "isShow": true },
    "5": { "name": "部品材料库", "url": "/Material/MaterialStorage?isEdit=1", "code": "MATERIALLIB_VIEW,MATERIALLIB_VIEWMAG,SEEDINGLIB_VIEW,SEEDINGLIB_VIEWMAG,MATERIALCONTRAST_VIEW", "visible": false, "isShow": false },
    "6": { "name": "模块库", "url": "/ProductDevelop/ModuleLibrary", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "7": { "name": "项目资料库", "url": "/DesignManage/ProjDocumentIndex", "code": "SYSPROJECTDATALIB_VIEW", "visible": false, "isShow": false },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": true, "isShow": true },
    //    "9": { "name": "知识库", "url": "/StandardResult/PEMIndex", "code": "CRAFTSLIB_VIEW,CRAFTSLIB_VIEWMAG", "visible": "false", "isShow": true }
    "9": { "name": "知识库", "url": "/StandardResult/PEMIndex?isEdit=1", "code": "CRAFTSLIB_VIEW,CRAFTSLIB_VIEWMAG", "visible": "false", "isShow": false },
    "10": { "name": "通用标准模块", "url": "/ProductDevelop/ProductCommonModuleIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "11": { "name": "土地库", "url": "/ProductSeries/LandLibraryIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "12": { "name": "客群库", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "13": { "name": "主题库", "url": "/ProductSeries/ProductThemeIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": false }
}
var amongMenus = {  //三级导航分类
    "8": {
        "1": { "name": "系统管理类", "con": [1, 2, 3, 4, 5, 6, 13, 17], "isShow": true },
        "2": { "name": "项目管理类", "con": [10,11,23,24,25], "isShow": true },
        "3": { "name": "产品管理类", "con": [16,21,29,32,38,39,40,41], "isShow": true },
        "4": { "name": "基础管理类", "con": [20, 44, 45], "isShow": false }
    }
}
/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "1": {
    //"1": { "name": "个人任务中心", "url": "/PersonelWorkCenter/PersonalTaskCenter", "code": "TASKCENTER_VIEW", "isShow": true },
    //"2": { "name": "个人审批中心", "url": "/WorkFlowCenter/PersonalFlowIndex", "code": "APPROVALCENTER_VIEW", "isShow": true }
    // "1": { "name": "个人任务中心", "url": "/PersonelWorkCenter/PersonalCenter#1", "code": "TASKCENTER_VIEW", "isShow": true },
        "2": { "name": "个人审批中心", "url": "/PlanManage/PersonalFlowCenter", "code": "PERSONADUITCENTRE_VIEW", "isShow": true }
    },
    "2": {
            "1": { "name": "项目库聚合", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "isShow": true },
            "2": { "name": "项目库管理", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true }
    //   "2": { "name": "项目库", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true }
    },

    "3": {
        "1": { "name": "产品系列聚合", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
        "2": { "name": "产品系列管理", "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG,SERIESCUSTOMER_UPDATE,PRODUCTSERIES_ADD,PRODUCTSERIES_UPDATE,PRODUCTSERIES_DEL,SERIESUNITLIST_UPDATE,SERIESPLAN_UPDATE,SERIESUNIT_UPDATE,SERIESFACADE_UPDATE,SERIESLANSCAPE_UPDATE,SERIESPUBLIC_UPDATE,SERIESSAlEROOM_UPDATE,SERIESPARKING_UPDATE,SERIESEQUFAC_UPDATE", "isShow": true },
        "3": { "name": "客群库聚合", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "4": { "name": "客群库管理", "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "5": { "name": "土地库聚合", "url": "/ProductSeries/LandLibraryIndex", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "6": { "name": "土地库管理", "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "4": {
    //        "1": { "name": "外部项目库展示", "url": "/StandardResult/OutSideProjectIndex", "code": "OUTPROJECTLIB_VIEW", "isShow": true },
    //        "2": { "name": "外部项目库管理", "url": "/StandardResult/OutSideProjectIndex?isEdit=1", "code": "OUTPROJECTLIB_ADMIN", "isShow": true }
        "1": { "name": "外部项目聚合", "url": "/DesignManage/LandIndex?isOutside=1", "code": "OUTPROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "外部项目管理", "url": "/DesignManage/LandIndex?isOutside=1&isEdit=1", "code": "OUTPROJECTLIB_ADMIN", "isShow": true }
    },
    "5": {
        //        "1": { "name": "材料库", "url": "/Material/MaterialStorage", "code": "MATERIALLIB_VIEW", "isShow": true },
        //        "2": { "name": "苗木库", "url": "/Material/MaterialSeedlings", "code": "SEEDINGLIB_VIEW", "isShow": true },
        //        "3": { "name": "材料库管理", "url": "/Material/MaterialStorage?isEdit=1", "code": "MATERIALLIB_VIEWMAG", "isShow": true },
        //        "4": { "name": "苗木库管理", "url": "/Material/MaterialSeedlings?isEdit=1", "code": "SEEDINGLIB_VIEWMAG", "isShow": true },

        "3": { "name": "材料库", "url": "/Material/MaterialStorage?isEdit=1", "code": "MATERIALLIB_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/Material/StdMaterialStorage?isEdit=1", "code": "STDMATERIALLIB_VIEW", "isShow": true },
        //"4": { "name": "苗木库", "url": "/Material/MaterialSeedlings?isEdit=1", "code": "SEEDINGLIB_VIEWMAG", "isShow": true },
        "5": { "name": "苗木库", "url": "/Material/SeedlingStorage", "code": "SEEDINGLIB_VIEW", "isShow": true },
        //    "5": { "name": "材料对比", "url": "/Material/MatContrast", "code": "MATERIALCONTRAST_VIEW", "isShow": true },
        "6": { "name": "材料库管理", "url": "/Material/MaterialSetting", "code": "MATERIALLIB_VIEWMAG", "isShow": true },
        "7": { "name": "苗木库管理", "url": "/Material/SeedlingSetting", "code": "SEEDINGLIB_VIEWMAG", "isShow": true }

        //        "1": { "name": "类目管理", "url": "/Material/CatatorySetting", "code": "MATERIALCAT_VIEW", "isShow": true },
        //        "2": { "name": "基类管理", "url": "/Material/BaseCatSetting", "code": "MATERIALBASE_VIEW", "isShow": true },
        //        "3": { "name": "品牌管理", "url": "/Material/BrandSetting", "code": "MATERIALBRAND_VIEW", "isShow": true },
        //        "4": { "name": "供应商管理", "url": "/Material/MatSupplierList", "code": "MATERIALPRO_VIEW", "isShow": true },
        //        "5": { "name": "材料城市", "url": "/Material/MaterialCity", "code": "MATERIALCITY_VIEW", "isShow": true },
        //        "6": { "name": "应用项目", "url": "/Material/MaterialProject", "code": "MATERIALCITY_VIEW", "isShow": true }
    },
    "6": {
    //        "1": { "name": "模块库", "url": "/ProductDevelop/ModuleLibrary", "code": "MODULELIB_VIEW", "isShow": true }
    //        "1": { "name": "户型库", "url": "/StandardResult/StandardResultLibrary?libId=1", "code": "UNITLIB_VIEW", "isShow": true },
    //        "2": { "name": "景观库", "url": "/StandardResult/StandardResultLibrary?libId=2", "code": "LANDSCAPELIB_VIEW", "isShow": true },
    //        "3": { "name": "室内库", "url": "/StandardResult/StandardResultLibrary?libId=3", "code": "DECORATIONLIB_VIEW", "isShow": true },
    //        "4": { "name": "立面库", "url": "/StandardResult/StandardResultLibrary?libId=4", "code": "FACADELIB_VIEW", "isShow": true },
    //        "5": { "name": "知识库", "url": "/StandardResult/StandardResultLibrary?libId=6", "code": "CRAFTSLIB_VIEW", "isShow": true },
    //"6": { "name": "规划库", "url": "/StandardResult/StandardResultLibrary?libId=7", "code": "SYSTEMSETTING_VIEW", "isShow": false },
    //        "7": { "name": "示范区库", "url": "/StandardResult/StandardResultLibrary?libId=10", "code": "DEMAREALIB_VIEW", "isShow": true },
    //        "8": { "name": "产品标准库管理", "url": "/StandardResult/StandardResultLibManage", "code": "STANDARRESULT_ADMIN", "isShow": true }
    },
    "7": {
        "1": { "name": "跨EPS项目资料汇总", "url": "/DesignManage/ProjEpsDocManage/", "code": "SYSPROJECTDATALIB_VIEW", "isShow": false }
    },
    "8": {
        "1": { "name": "用户管理", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位管理", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位管理", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_VIEW", "isShow": true },
        //"4": { "name": "决策模板管理", "url": "/PolicyDecision/PolicyDecisionTemplate", "code": "DECISIONMANAGE_VIEW", "isShow": false },
        "4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "PROJDATATEMPLATE_VIEW", "isShow": true },
        "6": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"7": { "name": "业态设置", "url": "/InformationBank/PropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": false },
        //"7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": false },
        //"8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": false },
        "10": { "name": "资料目录模板管理", "url": (fileLibUrl + encodeURIComponent("/SystemSetting/ProjDocCatTemplateManage")), "code": "", "isShow": true },
        "11": { "name": "项目资料上传统计", "url": (fileLibUrl + encodeURIComponent("/SystemSetting/FileCountIndex")), "code": "", "isShow": true },
        "17": { "name": "流程模板", "url": "/MZWorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        //"14": { "name": "计划模板", "url": "/DesignManage/PlanTemplateIndex", "code": "PLANTEMPLATE_VIEW", "isShow": false },
        //"15": { "name": "计划负责部门管理", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": false },
        "22": { "name": "风格设置", "url": "/DesignManage/StyleManage", "code": "SYSSTYLE_VIEW", "isShow": true },
        //"18": { "name": "流程审批人员", "url": "/DesignManage/ProjFlowPostUserManageIndex", "code": "FLOWTEMPLATE_VIEW", "isShow": false },
        //"19": { "name": "首页管理", "url": "/DesignManage/HomeIndexManage", "code": "SYSHOMEMANAGE_VIEW", "isShow": false },
        //"20": { "name": "价值树管理", "url": "/ProductDevelop/ModuleTreeManage", "code": "SERIESCONFIG_VIEW", "isShow": false },
        //"21": { "name": "产品线业态管理", "url": "/ProductDevelop/ProductLineFormatManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "21": { "name": "系列模板管理", "url": "/ProductSeries/ProductSeriesTemplateSetting", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"22": { "name": "层数管理", "url": "/ProductDevelop/ProductSeriesFloorTypeManage", "code": "FLOORTYPEMANAGE_VIEW", "isShow": false },
        "23": { "name": "资料专业设置", "url": (fileLibUrl + encodeURIComponent("/SystemSetting/ProfessionManage")), "code": "PLANINGINDEX_VIEW", "isShow": false },
        "24": { "name": "资料阶段设置", "url": (fileLibUrl + encodeURIComponent("/SystemSetting/StageManage")), "code": "SYSLEVELMANAGE_VIEW", "isShow": false },
        "25": { "name": "资料类别设置", "url": (fileLibUrl + encodeURIComponent("/SystemSetting/ClassificationManage")), "code": "GOVREQUESTMANAGE_VIEW", "isShow": false },
        //"26": { "name": "目标成本科目管理", "url": "/ProductDevelop/TargetCostSettings", "code": "TARGETCOSTMANAGE_VIEW", "isShow": false },
        //"27": { "name": "项目新闻库管理", "url": "/DesignManage/ProjectNewsManage", "code": "XMDSJMANAGE_VIEW", "isShow": false },
        //"28": { "name": "产品系列管理", "url": "/ProductSeries/ProductSeriesManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "29": { "name": "产品品类设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductCategory", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"30": { "name": "模块视图设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductModuleViewType", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"31": { "name": "系统配置项", "url": "/ProductSeries/ProductGlobalConfig", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "32": { "name": "系列主键管理", "url": "/ProductSeries/CommonTableManage?tableName=ProductPrimaryKey", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"33": { "name": "主题库管理", "url": "/ProductSeries/ProductThemeIndexManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"34": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"35": { "name": "户型视图设置", "url": "/ProductSeries/UnitViewTypeManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"36": { "name": "材料同步管理", "url": "/ProductSeries/ProductSeriesMaterialManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"37": { "name": "系列视图管理", "url": "/ProductSeries/CommonTableManage?tableName=ProductSeriesViewType", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "38": { "name": "客群公式设置", "url": "/ProductSeries/SegmentCalMethodManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "39": { "name": "客群模板设置", "url": "/ProductSeries/SegmentIndicatorTemplate", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "40": { "name": "土地模板设置", "url": "/ProductSeries/LandIndicatorTemplate", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "41": { "name": "土地公式设置", "url": "/ProductSeries/LandLibCalMethodManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true }
    },
    "9": {
    //        "1": { "name": "知识库", "url": "/StandardResult/PEMIndex", "code": "CRAFTSLIB_VIEW", "isShow": true },
    //        "2": { "name": "知识库管理", "url": "/StandardResult/PEMIndex?isEdit=1", "code": "CRAFTSLIB_VIEWMAG", "isShow": true }
    // "2": { "name": "知识库", "url": "/StandardResult/PEMIndex?isEdit=1", "code": "CRAFTSLIB_VIEWMAG", "isShow": true }
    },
    "10": {},
    "11": {
        "1": { "name": "土地库聚合", "url": "/ProductSeries/LandLibraryIndex", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "2": { "name": "土地库管理", "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "12": {
        "1": { "name": "客群库聚合", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "2": { "name": "客群库管理", "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "13": {
        "1": { "name": "主题库聚合", "url": "/ProductSeries/ProductThemeIndex", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "2": { "name": "主题库管理", "url": "/ProductSeries/ProductThemeIndexManage", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "14": {}
}



var hasRightMenuCode = typeof menuCodes != "undefined", codeObjs; //是否有判断权限的menuCode
var hasShowProjLib = typeof isShowProjLib != "undefined";
var hasShowProj = typeof isShowProj != "undefined";

if (!hasShowProjLib) {
    var isShowProjLib = "";
}

if (!hasShowProj) {
    var isShowProj = "";
}

if (typeof menuCodes != "undefined") {
    codeObjs = $.parseJSON(menuCodes);
}
//一级导航排列顺序
var FirstMenuOrder = [1, 3, 11,12,13,10, 2, 6, 9, 4, 5, 7, 8];
//二级导航排列顺序
var secondMenuOrder = { "4": [5, 6, 1, 2, 3, 4, 7, 8, 9],
    "5": [4, 3, 5, 6, 7]
}

var menuTable={
   "12-1":"3-3",
   "12-2":"3-4",
   "11-1":"3-5",
   "11-2":"3-6"
};

function SetMenu(first, second) {
    var key='';
    if (first != undefined) {
        key += first;
        if (second != undefined) {
            key += '-' + second;
        }
    }
    if (key != '' && (key in menuTable)) { 
        var val=menuTable[key].split('-');

        if (val.length == 2) {
            SetMenu2(val[0], val[1]);return;
        } else if (val.length == 1) {
            SetMenu2(val[0]);
            return;
        }
    }
    SetMenu2(first,second);
}



//展示一级目录
function showFirstMenu(first, second) {
    /*隐藏旧的部件*/
    $('#navLev2').hide();
    $('#nav_levnone2').hide();
    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True" || isAdmin == "True") {
        _hasSysRight_SS = true;
        hasRightMenuCode = true;
    }

    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    var html = "";
    for (var k1 = 0; k1 < FirstMenuOrder.length; k1++) {
        var k = FirstMenuOrder[k1];
        var menuItem = firstMenus[k];
        if ((hasRightMenuCode || isAdmin == "True") && menuItem.isShow) {
            if (checkRight(menuItem)) {//开发权限
                _hasSysRight_SS = true;
                html += "<li " + (k == first ? "sk='" + second + "'" : "") + " key='" + k + "' class='p-j-firstMenu " + (k == first ? "this" : "") + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
            } else {
                html += "<li " + (k == first ? "sk='" + second + "'" : "") + " key='" + k + "' class='p-j-firstMenu " + (k == first ? "this" : "") + "'><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
            }
        }
    }
    $(".nav_lev1").html(html);
    return _hasSysRight_SS;
}



//函数入口
function SetMenu2(first, second) {
    var _hasSysRight_SS = showFirstMenu(first, second);
    var html = "",
        activeClass = "";
    if (!_hasSysRight_SS) {
        window.location.href = "/RightPage.html";
    }
    //是否有三级目录
    if (first in amongMenus) {
        html = "<div class='p-j-midMenu'><ul>";
        var tempMenus = amongMenus[first];
        for (var k in tempMenus) {
            var mitem = tempMenus[k];
            if (mitem.isShow) {
                if (hasRightMenuCode || isAdmin == "True") {
                    var isSelect = mitem.con.indexOf(second);
                    if (mitem.con.length == 1) {
                        var thirdMenu = secondMenus[first][mitem.con[0]];
                        html += "<li class='pr " + (isSelect > -1 ? "this" : "") + "' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' href='" + thirdMenu.url + "'>" + thirdMenu.name + "</a></li>";
                    } else {
                        html += "<li class='p-j-showThree pr " + (isSelect > -1 ? "this" : "") + "' parentKey='" + first + "' key='" + k + "'><a class='ellipsis' hidefocus='true' " + (mitem.url ? "href='" + mitem.url + "'" : "href = 'javascript:;'") + ">" + mitem.name + "</a></li>";
                    }
                } else {
                    if (mitem.con.length == 1) {
                        var thirdMenu = secondMenus[first][mitem.con[0]];
                        html += "<li class='pr " + (isSelect > -1 ? "this" : "") + "' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' yh-popover='暂无权限' href='javascript:;'>" + thirdMenu.name + "</a></li>";
                    } else {
                        html += "<li class='p-j-showThree pr " + (isSelect > -1 ? "this" : "") + "' parentKey='" + first + "' key='" + k + "'><a class='ellipsis' hidefocus='true' yh-popover='暂无权限' href='javascript:;'>" + mitem.name + "</a></li>";
                    }
                }
            }
        }
        html += "</ul></div>";
    } else if (first in secondMenus) {
        html = "<div class='p-j-secondMenu'><ul>";
        var tempMenus = secondMenus[first];
        for (var k in tempMenus) {
            var menuItem = tempMenus[k];
            if (menuItem.isShow) {
                if (hasRightMenuCode || isAdmin == "True") {
                    if (checkRight(menuItem) || isAdmin == "True") {
                        html += "<li " + (second == k ? "class='this'" : "") + " key='" + k + "'><a class='ellipsis' hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                    } else {
                        html += "<li " + (second == k ? "class='this'" : "") + " key='" + k + "'><a class='ellipsis p-noright' hidefocus='true' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                    }
                }
            }
        };
        html += "</ul></div>";
        if (tempMenus.length <= 0) html = "";
    }
    $(".nav_lev1").find("li[key=" + first + "]").append(html);
}

function SetMouseOverMenu(obj, first) {
    var liLeft = $(obj).offset().left;
    if ($(obj).hasClass("this") == true) {
        if ($('#navLev2').find("ul").children().length == 0) {
            $('#navLev2').hide();
        } else {
            setTimeout("$('#navLev2').show()", "normal");
        }
        $("#nav_levnone2").hide();
        $(".nav_lev2_box").css("left", liLeft + 2);
    } else {
        setTimeout("$('#nav_levnone2').show()", "normal");
        $("#navLev2").hide();


        if (first in secondMenus) {

            var tempMenus = secondMenus[first];
            var tempMenuArr = [];
            if (first in secondMenuOrder) {
                var secOrderArr = secondMenuOrder[first];
                for (var j = 0; j < secOrderArr.length; j++) {
                    if (secOrderArr[j] in tempMenus) {
                        tempMenus[secOrderArr[j]].key = secOrderArr[j];
                        tempMenuArr.push(secondMenus[first][secOrderArr[j]]);
                    }
                }
            } else {
                for (var k in tempMenus) {
                    tempMenus[k].key = k;
                    tempMenuArr.push(tempMenus[k])
                }
            }


            var tempMenus = secondMenus[first];
            var html = '';
            for (var j = 0; j < tempMenuArr.length; j++) {
                var menuItem = tempMenuArr[j];
                if (menuItem.isShow == true) {
                    if (hasRightMenuCode || isAdmin == "True") {
                        if (checkRight(menuItem) || isAdmin == "True") {
                            html += "<li key='" + menuItem.key + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                        } else {
                            html += "<li key='" + menuItem.key + "'><a hidefocus='true' class='p-noright' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                        }
                    }
                }
            }
            if (html != '') {
                $("#nav_levnone2").css({ "visibility": "visible" });
                html = "<ul class='nav_lev2'>" + html + "</ul>";
            } else {
                $("#nav_levnone2").css({ "visibility": "hidden" });
            }
            //return html;
            $("#nav_levnone2").html("");
            $("#nav_levnone2").html(html);

            $("#nav_levnone2").css("left", liLeft + 2);
            if (html == '') $("#nav_levnone2").css("padding", "0px");

            //$(".nav_lev2").html(html);
        }
        else {
            return "";
        }
    }
    if ($("#nav_levnone2").find("ul").children().length > 9) {
        $("#nav_levnone2").css({ "width": "240px", "z-index": "10000" });

    } else {
        $("#nav_levnone2").css({ "width": "101px", "z-index": "10000" });
    };
    if ($("#navLev2").find("ul").children().length > 9) {
        $("#navLev2").css({ "width": "240px", "z-index": "10000" });

    } else {
        $("#navLev2").css({ "width": "101px", "z-index": "10000" });
    };
}

function SetMouseOutMenu() {
    var showTimer = setTimeout(function () {
        $("#nav_levnone2").hide();
        $("#navLev2").hide();
    }, "slow");

    $("#navLev2").hover(function () {
        clearInterval(showTimer);
    }, function () {
        showTimer = setTimeout(function () {
            $("#navLev2").hide();
        }, "fast");
    });
    $("#nav_levnone2").hover(function () {
        clearInterval(showTimer);
    }, function () {
        showTimer = setTimeout(function () {
            $("#nav_levnone2").hide();
        }, "fast");
    });
}


//显示二级目录
$(document).on('mouseenter', '.p-j-firstMenu', function () {
    var $obj = $(this), first = $obj.attr('key');
    if (first in amongMenus) { //三级目录的中间目录
        if ($obj.find('.p-j-midMenu').length == 0) {
            //显示三级导航的二级导航
            var curSecHtml = "<div class='pa p-j-midMenu'><ul>";
            var curSecMenu = amongMenus[first];
            for (var i in curSecMenu) {
                var mitem = curSecMenu[i];
                if (mitem.isShow) {
                    if (hasRightMenuCode || isAdmin == "True") {
                        if (mitem.con.length == 1) {
                            var thirdMenu = secondMenus[first][mitem.con[0]];
                            curSecHtml += "<li class='pr' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' href='" + thirdMenu.url + "'>" + thirdMenu.name + "</a></li>";
                        } else {
                            curSecHtml += "<li class='p-j-showThree pr' parentKey='" + first + "' key='" + i + "'><a class='ellipsis' hidefocus='true' " + (mitem.url ? "href='" + mitem.url + "'" : "href = 'javascript:;'") + ">" + mitem.name + "</a></li>";
                        }
                    }
                }
            }
            curSecHtml += "</ul></div>";
            $obj.append(curSecHtml);
        } else {
            $obj.find('.p-j-midMenu').show();
        }
    } else {
        if ($obj.find('.p-j-secondMenu').length == 0) {
            if (first in secondMenus) {
                var tempMenus = secondMenus[first];
                var tempMenuArr = [];
                if (first in secondMenuOrder) {
                    var secOrderArr = secondMenuOrder[first];
                    for (var j = 0; j < secOrderArr.length; j++) {
                        if (secOrderArr[j] in tempMenus) {
                            tempMenus[secOrderArr[j]].key = secOrderArr[j];
                            tempMenuArr.push(secondMenus[first][secOrderArr[j]]);
                        }
                    }
                } else {
                    for (var k in tempMenus) {
                        tempMenus[k].key = k;
                        tempMenuArr.push(tempMenus[k]); //当前目录下的二级目录
                    }
                }

                var tempMenus = secondMenus[first];
                var html = '', activeClass = "";
                if ($obj.hasClass("this")) activeClass = "this";
                for (var j = 0; j < tempMenuArr.length; j++) {
                    var menuItem = tempMenuArr[j];
                    if (menuItem.isShow) {
                        if (hasRightMenuCode || isAdmin == "True") {
                            if (checkRight(menuItem) || isAdmin == "True") {
                                html += "<li  key='" + menuItem.key + "'><a hidefocus='true' class='ellipsis' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                            } else {
                                html += "<li key='" + menuItem.key + "'><a hidefocus='true' class='ellipsis p-noright' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                            }
                        }
                    }
                }
                if (html != '') {
                    html = "<div class='p-j-secondMenu'><ul class='nav_lev2'>" + html + "</ul></div>";
                }
                $obj.append(html);
            }
            else {
                return "";
            }
        } else {
            $(this).find('.p-j-secondMenu').show();
        }
    }
}).on('mouseleave', '.p-j-firstMenu', function () {
    $(this).find('.p-j-secondMenu').hide();
    $(this).find('.p-j-midMenu').hide();
}).on('mouseenter', '.p-j-showThree', function () {//显示 三级目录
    var $this = $(this), key = $this.attr('key'), pKey = $this.attr('parentkey'), thCon;
    if ($this.find('.nav_lev2_box').length == 0) {
        var htmlD = '<div class="p-j-levThree nav_lev2_box pa" style="z-index:10000;width:120px;top:0px;right:120px;"><ul>';
        thCon = amongMenus[pKey][key].con;
        var sm = secondMenus[pKey],
            sk = $this.closest('.p-j-firstMenu').attr('sk');
        for (var j = 0; j < thCon.length; j++) {
            var $sm = sm[thCon[j]];
            if ($sm == undefined) continue;
            htmlD += "<li " + (sk == thCon[j] ? "class='this'" : "") + " key='" + thCon[j] + "'><a class='ellipsis' href='" + $sm.url + "'>" + $sm.name + "</a></li>";
        }
        htmlD += "</ul></div>";
        $(htmlD).appendTo($this);
    }
}).on('mouseenter', ".nav_lev1 li a", function () {
    var $this = $(this),
        w = $this.width();
    if (w == 100) {
        var hovera = "<div class='p-j-hoverText' style='position:absolute;left:0px;bottom: 0px;background: #ffffff;"
        hovera += "border:1px solid #808080;height:22px;line-height:22px;padding:0 5px;border-radius:2px;'>" + $this.text() + "</div>";
        if ($this.children(".p-j-hovertext").length <= 0) {
            $this.append(hovera);
        }
        if ($this.parent().children("div").length < 1) {
            $this.children(".p-j-hovertext").css("right", "0px");
        }
    }
}).on('mouseleave', ".nav_lev1 li a", function () {
    var $this = $(this);
    if ($this.find(".p-j-hoverText").length > 0) {
        $this.find(".p-j-hoverText").remove();
    }
});


//判断能否查看
function checkRight(menuItem) {
    if (isAdmin == 'True') { return true; }
    var codes = menuItem.code.split(",");
    if (codes != "PROJECTLIB_VIEW") {
        for (var index in codes) {
            var code = codes[index];
            if (code in codeObjs) {
                return true;
            }
        }
    } else if (codes == "PROJECTLIB_VIEW") {//项目库查看权限
        return checkProjLib(isShowProj);
    }
    //    else if (codes == "SYSPROJECTDATALIB_VIEW") {//项目资料库权限
    //        return checkProjLib(isShowProjLib);
    //    }

    return false;
}

function checkProjLib(right) {
    if (right == 'True') {
        return true;
    } else {
        return false;
    }
}


$(function () {
    $(document).on("mouseenter", ".p-hoverShow", function () {
        var $current = $(this);
        var num = $current.index();
        var cliWid = document.body.clientWidth; //窗口宽度
        var alLeft = $current.offset().left; //弹出层到窗口左边距离
        var liNum = $current.find(".p-hoverShow-itm ul").children().length; //li个数
        if (liNum > 4 && liNum < 16) {
            var divWid = $current.find(".p-hoverShow-itm ul li").width() * 5 + 80; //弹出层div宽度
        } else if (liNum > 15) {
            var divWid = $current.find(".p-hoverShow-itm ul li").width() * 7 + 200; //弹出层div宽度
            $current.find(".p-hoverShow-itm").addClass("w830");
        } else {
            var divWid = $current.find(".p-hoverShow-itm ul li").width() * liNum + 100;
        }
        if (alLeft + divWid > cliWid) {
            $current.find(".p-hoverShow-itm").css({ "left": -divWid / 2 + "px" });
            $current.find(".p-hoverShow-itm").find(".p-alert-arrow").css({ "left": divWid / 2 + "px" });
        }
    });
    if ($('.yh-breadcrumb').length && (! +[1, ])) { //兼容IE8  面包屑
        $('.yh-breadcrumb').find('a').each(function () {
            if ($(this).width() >= 100) {
                $(this).css('width', '100px');
            }
        });
    }
});

//document.write("<script type='text/javascript' src='../../Scripts/Projects/ZY/zhuoyue.js'></script>");
