/*
//新菜单
//
*/
var loginName = (typeof logName != "undefined") ? logName : "";
var fileLibUrl = A3SysPort + "/Account/SSOLogin/?userName=" + loginName + "&ReturnUrl=";
firstMenus = {
    "1": { "name": "首页", "url": "/DesignManage/HomeIndex", "code": "HOMEPAGE_VIEW,PERSONTASKCENTRE_VIEW,PERSONADUITCENTRE_VIEW,WORKLETTER_VIEW", "visible": false, "isShow": true, "order": "1" },
    "2": { "name": "项目管理", "url": "/DesignManage/LandMapIndex", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG,PROJECTAUDITSTAFF_VIEW", "visible": false, "isShow": true, "order": "3" },
    "3": { "name": "产品线体系", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_VIEWMAG,CUSTOMERLIB_VIEW,CUSTOMERLIB_VIEWMAG,LANDLIB_VIEW,LANDLIB_VIEWMAG,DATABANDTECH_VIEW,MATERIALLIB_VIEW,BASEMATERIAL_VIEW,STAMATERIAL_VIEW,MATCAT_VIEW,MATBASECLASS_VIEW", "visible": false, "isShow": true, "order": "2" },
    "5": { "name": "材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW,MATFIRST_ADD", "visible": false, "isShow": false, "order": "4" },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSET_VIEW", "visible": false, "isShow": true, "order": "9" },
    "14": { "name": "供应商管理", "url": "/Supplier/SupplierIndex", "code": "SUPPLIER_VIEW,SUPPLIER_VIEWMAG", "visible": false, "isShow": true, "order": "5" },
    "16": { "name": "制度流程体系", "url": fileLibUrl + "/FileLib/DocumentIndexXH?docCode=586e21c861607d3008a89233&isEdit=1", "code": "DATABANDINS_VIEW,DATABAND_VIEW,DATABANDFLOW_VIEWMAG,DATABANDGUIDE_VIEW", "visible": false, "isShow": true, "order": "6" },
    "19": { "name": "技术标准体系", "url": fileLibUrl + "/FileLib/TechnicalStandardSystemIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": true, "isShow": false, "order": "9" },
    "17": { "name": "工艺工法库", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c24ea361607d2b70355435&isEdit=1", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": false, "order": "7" },
    "18": { "name": "设计师之家", "url": "/DesignerHome/DesignerHomeIndex", "code": "", "visible": false, "isShow": false, "order": "8" },
    "20": { "name": "设计论剑", "url": "/OutsideProject/OutSideProject", "code": "DESIGNFORUM_VIEW,EXTERNALCASE_VIEW,DESIGNERHOME_VIEW", "visible": true, "isShow": true, "order": "9" },
    "21": { "name": "人才管理体系", "url": fileLibUrl + "/FileLib/DocumentIndexXH?docCode=586e21cf61607d3008a89235&isEdit=1", "code": "DATABANDTALENT_VIEW", "visible": true, "isShow": true, "order": "10" },
    "22": { "name": "专业标准体系", "url": fileLibUrl + "/FileLib/DocumentIndexXH?docCode=586e21cd61607d3008a89234&isEdit=1", "code": "", "visible": true, "isShow": true, "order": "10" },
    "23": { "name": "产品成本体系", "url": "javascript:;", "code": "", "visible": true, "isShow": true, "order": "10" },
    "24": { "name": "地区风采", "url": "javascript:;", "code": "", "visible": true, "isShow": true, "order": "10" }
}

 var amongMenus = {  //三级导航分类
    "16": {
        "1": { "name": "制度流程", "con": [1, 2, 5], "url": fileLibUrl + "/FileLib/SystemStandardsIndex", "code": "DATABANDINS_VIEW,DATABAND_VIEW,DATABANDFLOW_VIEWMAG,DATABANDGUIDE_VIEW", "visible": false, "isShow": false, "order": "6" }
        //"2": { "name": "技术标准", "con": [4], "url": fileLibUrl + "/FileLib/TechnicalStandardSystemIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": true, "isShow": true, "order": "9" }
    },
    "8": {
        "1": { "name": "用户/角色", "con": [1, 2, 3, 45, 4, 5], "code": "USERMANAGE_VIEW,ORGMANAGE_VIEW,COMPOSTMANAGE_VIEW,RIGHTSCH_VIEW,ROLERIGHT_VIEW,CITYSET_VIEW", "isShow": true },
        "2": { "name": "专业/阶段/文档类别/业态", "con": [6, 7, 8, 9], "code": "PROPERTYSET_VIEW,MAJORSET_VIEW,STAGESET_VIEW,FILECATSET_VIEW", "isShow": true },
        "3": { "name": "产品库模板", "con": [21, 29, 30, 31, 32, 38, 39, 40, 41], "code": "PRODUCTTEMPLATEMAG_VIEW,PRODUCTCATSET_VIEW,MODULEVIEWWSET_VIEW,SERIESCONFIG_VIEW,SERIESKEYMAG_VIEW,CUSTOMERFORMULASET_VIEW,CUSTOMERTEMPLATESE_VIEW,LANDTEMPLATESET_VIEW,LANDFORMULASET_VIEW", "isShow": true },
        "4": { "name": "项目设计管理模板", "con": [14, 15, 18, 42, 33], "code": "PLANTEMPLATE_VIEW,PLANORG_VIEW,SUBWAYTEMPLATE_VIEW,DESIGNFEETEMPLATE_VIEW,AREAINDEXMANAGE_VIEW", "isShow": true },
        "5": { "name": "设计资源管理模板", "con": [20], "code": "PROJSUPPARAM_VIEW", "isShow": true },
        "6": { "name": "流程/表单模板", "con": [17], "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "7": { "name": "统计报表", "con": [16], "code": "PLANTASKREPORT_VIEW", "isShow": true },
        "8": { "name": "首页管理", "con": [44], "code": "HOMEPAGEPARAM_VIEW", "isShow": true }
    },
    "3": {
        "1": { "name": "产品系列", "con": [1], "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
        "2": { "name": "产品系列管理", "con": [2], "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG", "isShow": true },
        "3": { "name": "客群库聚合", "con": [3], "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "CUSTOMERLIB_VIEW", "isShow": true },
        "4": { "name": "客群库管理", "con": [4], "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "CUSTOMERLIB_VIEWMAG", "isShow": true },
        "5": { "name": "土地库聚合", "con": [5], "url": "/ProductSeries/LandLibraryIndex", "code": "LANDLIB_VIEW", "isShow": true },
        "6": { "name": "土地库管理", "con": [6], "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "LANDLIB_VIEWMAG", "isShow": true },
        "11": { "name": "部品材料库", "con": [7, 8, 9, 10], "url": "/PublicMaterial/MaterialIndex", "code": "MATERIALLIB_VIEW,BASEMATERIAL_VIEW,STAMATERIAL_VIEW,MATCAT_VIEW,MATBASECLASS_VIEW", "isShow": true },
        "12": { "name": "工艺工法库", "con": [12], "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c24ea361607d2b70355435", "code": "DATABANDTECH_VIEW", "isShow": true }
    }
}
/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "1": {
        "3": { "name": "个人任务中心", "url": "/PlanManage/PersonalTaskCenter", "code": "PERSONTASKCENTRE_VIEW", "isShow": true },
        "4": { "name": "个人审批中心", "url": "/PlanManage/PersonalFlowCenter", "code": "PERSONADUITCENTRE_VIEW", "isShow": true },
        "5": { "name": "工作函", "url": "/MailCenter/Index", "code": "WORKLETTER_VIEW", "isShow": true }
    },
    "2": {
        "1": { "name": "项目库", "url": "/DesignManage/LandMapIndex?isEdit=0", "code": "PROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "项目库管理", "url": "/DesignManage/LandMapIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true },
        "3": { "name": "项目审批人员设置", "url": "/PlanManage/ProjFlowPostUserManageIndex", "code": "PROJECTAUDITSTAFF_VIEW", "isShow": true }
    },
    "3": {
        "1": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
        "2": { "name": "产品系列管理", "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG", "isShow": true },
        "3": { "name": "客群库聚合", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "CUSTOMERLIB_VIEW", "isShow": true },
        "4": { "name": "客群库管理", "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "CUSTOMERLIB_VIEWMAG", "isShow": true },
        "5": { "name": "土地库聚合", "url": "/ProductSeries/LandLibraryIndex", "code": "LANDLIB_VIEW", "isShow": true },
        "6": { "name": "土地库管理", "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "LANDLIB_VIEWMAG", "isShow": true },
        "7": { "name": "基础材料库", "url": "/PublicMaterial/MaterialStorage", "code": "BASEMATERIAL_VIEW", "isShow": true },
        "8": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage?isEdit=1", "code": "STAMATERIAL_VIEW", "isShow": true },
        "9": { "name": "类目管理", "url": "/PublicMaterial/CatatorySetting", "code": "MATCAT_VIEW", "isShow": true },
        "10": { "name": "基类管理", "url": "/PublicMaterial/BaseCatSetting", "code": "MATBASECLASS_VIEW", "isShow": true },
        "11": { "name": "部品材料库", "url": "/PublicMaterial/MaterialIndex", "code": "MATERIALLIB_VIEW", "isShow": true },
        "12": { "name": "工艺工法库", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c24ea361607d2b70355435", "code": "DATABANDTECH_VIEW", "isShow": true }
    },
    "5": {
        "3": { "name": "基础材料库", "url": "/PublicMaterial/MaterialStorage", "code": "BASEMATERIAL_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage?isEdit=1", "code": "STAMATERIAL_VIEW", "isShow": true },
        "9": { "name": "类目管理", "url": "/PublicMaterial/CatatorySetting", "code": "MATCAT_VIEW", "isShow": true },
        "10": { "name": "基类管理", "url": "/PublicMaterial/BaseCatSetting", "code": "MATBASECLASS_VIEW", "isShow": true },
        "11": { "name": "部品材料库", "url": "/PublicMaterial/MaterialIndex", "code": "MATERIALLIB_VIEW", "isShow": true }
    },
    "8": {
        "1": { "name": "用户管理", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位管理", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位管理", "url": "/HumanResource/ComPostManage", "code": "COMPOSTMANAGE_VIEW", "isShow": true },
        "4": { "name": "角色权限", "url": "/Authority/AuthorityManage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "CITYSET_VIEW", "isShow": true },
        "6": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "PROPERTYSET_VIEW", "isShow": true },
        //"7": { "name": "业态设置", "url": "/DesignManage/SysPropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": true },
        "7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "MAJORSET_VIEW", "isShow": true },
        "8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "STAGESET_VIEW", "isShow": true },
        //"10": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "CITYMANAGE_VIEW", "isShow": true },
        "9": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "FILECATSET_VIEW", "isShow": true },
        "18": { "name": "地铁图", "url": "/SubWayMap/SubwayIndex", "code": "SUBWAYTEMPLATE_VIEW", "isShow": true },
        "19": { "name": "决策流程图", "url": "/ContextDiagram/ContextDiagramIndex", "code": "SYSDECISION_VIEW", "isShow": false },
        "17": { "name": "流程模板", "url": "/MZWorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "14": { "name": "计划模板", "url": "/PlanManage/PlanTemplateManage", "code": "PLANTEMPLATE_VIEW", "isShow": true },
        "15": { "name": "计划负责部门管理", "url": "/DesignManage/TaskOrgManage", "code": "PLANORG_VIEW", "isShow": true },
        "16": { "name": "计划任务统计报表", "url": "/DesignManage/TaskStatisticalReports", "code": "PLANTASKREPORT_VIEW", "isShow": true },
        "21": { "name": "系列模板管理", "url": "/ProductSeries/ProductSeriesTemplateSetting", "code": "PRODUCTTEMPLATEMAG_VIEW", "isShow": true },
        "29": { "name": "产品品类设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductCategory", "code": "PRODUCTCATSET_VIEW", "isShow": true },
        "30": { "name": "模块视图设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductModuleViewType", "code": "MODULEVIEWWSET_VIEW", "isShow": true },
        "31": { "name": "产品系列配置项", "url": "/ProductSeries/ProductGlobalConfig", "code": "SERIESCONFIG_VIEW", "isShow": false },
        "32": { "name": "系列主键管理", "url": "/ProductSeries/CommonTableManage?tableName=ProductPrimaryKey", "code": "SERIESKEYMAG_VIEW", "isShow": true },
        "20": { "name": "设计供方参数设置", "url": "/Supplier/SupplierTableManage", "code": "PROJSUPPARAM_VIEW", "isShow": true },
        "38": { "name": "客群公式设置", "url": "/ProductSeries/SegmentCalMethodManage", "code": "CUSTOMERFORMULASET_VIEW", "isShow": false },
        "39": { "name": "客群模板设置", "url": "/ProductSeries/SegmentIndicatorTemplate", "code": "CUSTOMERTEMPLATESE_VIEW", "isShow": true },
        "40": { "name": "土地模板设置", "url": "/ProductSeries/LandIndicatorTemplate", "code": "LANDTEMPLATESET_VIEW", "isShow": true },
        "41": { "name": "土地公式设置", "url": "/ProductSeries/LandLibCalMethodManage", "code": "LANDFORMULASET_VIEW", "isShow": true },
        "42": { "name": "设计费用模板", "url": "/DesignManage/DesignPayModel?type=1", "code": "DESIGNFEETEMPLATE_VIEW", "isShow": true },
        "33": { "name": "面积指标管理", "url": "/DesignManage/IndexTemplateManage", "code": "AREAINDEXMANAGE_VIEW", "isShow": true },
        "44": { "name": "首页管理", "url": "/DesignManage/HomeIndexManage", "code": "HOMEPAGEPARAM_VIEW", "isShow": true },
        "45": { "name": "管理员设置", "url": "/Authority/AuthorityManagerIndex", "code": "RIGHTSCH_VIEW", "isShow": true }
    },
    "14": {
        "1": { "name": "供应商库", "url": "/Supplier/DesignSupplierNew", "code": "SUPPLIER_VIEW", "isShow": true },
        "2": { "name": "供应商库管理", "url": "/Supplier/DesignSupplierNew?isEdit=1", "code": "SUPPLIER_VIEWMAG", "isShow": true },
        "3": { "name": "供应商报表", "url": "/Supplier/SupplierStatisticalReports", "code": "", "isShow": true }
    },
    "16": {
        "1": { "name": "授权及制度", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c2493461607d2b70355430&isEdit=1", "code": "DATABAND_VIEW", "isShow": false },
        "2": { "name": "工作流程", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c249eb61607d2b70355431&isEdit=1", "code": "DATABANDFLOW_VIEWMAG", "isShow": false },
        "3": { "name": "人才标准", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c249ed61607d2b70355433&isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": false },
//        "4": { "name": "工艺工法库", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c24ea361607d2b70355435", "code": "MATERIALBASE_MANAGE", "isShow": true },
        "5": { "name": "工作指引", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57df870f61607d1d101957f8", "code": "DATABANDGUIDE_VIEW", "isShow": false }
        
    },
    "17": {
    },
    "18": {
    },
    "19": {
        "3": { "name": "基础材料库", "url": "/PublicMaterial/MaterialStorage", "code": "BASEMATERIAL_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage?isEdit=1", "code": "STAMATERIAL_VIEW", "isShow": true },
        "9": { "name": "类目管理", "url": "/PublicMaterial/CatatorySetting", "code": "MATCAT_MANAGE", "isShow": true },
        "10": { "name": "基类管理", "url": "/PublicMaterial/BaseCatSetting", "code": "MATBASECLASS_MANAGE", "isShow": true },
        "11": { "name": "工艺工法库", "url": fileLibUrl + "/FileLib/DocumentIndex?docCode=57c24ea361607d2b70355435", "code": "DATABANDTECH_MANAGE", "isShow": true }
     },
     "20": {
         "1": { "name": "外部优秀案例库", "url": "/OutsideProject/OutSideProjectIndex", "code": "EXTERNALCASE_VIEW", "visible": false, "isShow": true, "order": "1" },
         "2": { "name": "设计师之家", "url": "/DesignerHome/DesignerHomeIndex", "code": "DESIGNERHOME_VIEW", "visible": false, "isShow": true, "order": "2" }
     }
}

var menuTable = {
    "12-1": "3-3",
    "12-2": "3-4",
    "11-1": "3-5",
    "11-2": "3-6",
    "5-3":"3-7",
    "5-4": "3-8",
    "5-9":"3-9",
    "5-10":"3-10",
    "17-1": "19-11",
    "4-1":"20-1",
    "4-2":"20-1",
    "18":"20-2",
    "16-3": "21",
    "5-1": "3-7",
    "16-4": "3-12"
};

/***********以****上****最****后****一****项*****勿****加****逗号******************/

//var hasRightMenuCode =typeof menuCodes != "undefined", codeObjs; //是否有判断权限的menuCode
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
var FirstMenuOrder = [1, 2, 16, 22, 3, 23, 5, 21, 14, 17, 19, 18, 20, 24, 8];
var secondMenuOrder = {};

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
    for (var k1 = 0; k1 < FirstMenuOrder.length; k1++) { //一级目录
        var k = FirstMenuOrder[k1];
        var menuItem = firstMenus[k];
        if ((hasRightMenuCode || isAdmin == "True") && menuItem.isShow) {
            if (checkRight(menuItem)) {//开发权限
                _hasSysRight_SS = true;
                html += "<li " + (k == first ? "sk='" + second + "'" : "") + " key='" + k + "' class='p-j-firstMenu " + (k == first ? "this" : "") + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
            } else {
                html += "<li " + (k == first ? "sk='" + second + "'" : "") + " key='" + k + "' class='p-j-firstMenu p-j-noRight " + (k == first ? "this" : "") + "'><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
            }
        }
    }
    $(".nav_lev1").html(html);
    return _hasSysRight_SS;
}

//通过映射表找出实际的导航
function SetMenu(first, second) {
    var key = '';
    if (first != undefined) {
        key += first;
        if (second != undefined) {
            key += '-' + second;
        }
    }
    if (key != '' && (key in menuTable)) {
        var val = menuTable[key].split('-');
        if (val.length == 2) {
            SetMenu2(val[0], val[1]); 
            return;
        } else if (val.length == 1) {
            SetMenu2(val[0]);
            return;
        }
    }
    SetMenu2(first, second);
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
    if (first in amongMenus) { //二级目录
        html = "<div class='p-j-midMenu' style='display:none;'><ul>";
        var tempMenus = amongMenus[first];
        for(var k in tempMenus){
            var mitem = tempMenus[k];
            if (mitem.isShow) {
                if (checkRight(mitem) || isAdmin == "True") {
                    var isSelect = mitem.con.indexOf(second);
                    if (mitem.con.length == 1) {
                        var thirdMenu = secondMenus[first][mitem.con[0]];
                        html += "<li class='pr " + (isSelect > -1 ? "this" : "") + "' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' href='" + thirdMenu.url + "'>" + thirdMenu.name + "</a></li>";
                    } else {
                        html += "<li class='p-j-showThree pr " + (isSelect > -1 ? "this" : "") + "' parentKey='" + first + "' key='" + k + "'><a class='ellipsis' hidefocus='true' " + (mitem.url ? "href='" + mitem.url + "'" : "href = 'javascript:;'") + ">" + mitem.name + "</a></li>";
                    }
                } 
//                else {
//                    if (mitem.con.length == 1) {
//                        var thirdMenu = secondMenus[first][mitem.con[0]];
//                        html += "<li style='display:none;' class='p-j-showThree pr " + (isSelect > -1 ? "this" : "") + "' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' yh-popover='暂无权限' href='javascript:;'>" + thirdMenu.name + "</a></li>";
//                    } else {
//                        html += "<li style='display:none;' class='p-j-showThree p-j-showThree pr " + (isSelect > -1 ? "this" : "") + "' parentKey='" + first + "' key='" + k + "'><a class='ellipsis' hidefocus='true' yh-popover='暂无权限' href='javascript:;'>" + mitem.name + "</a></li>";
//                    }
//                }
            }
        }
        html += "</ul></div>";
    } else if (first in secondMenus) {
        html = "<div class='p-j-secondMenu' style='display:none;'><ul>";
        var tempMenus = secondMenus[first];
        for (var k in tempMenus) {
            var menuItem = tempMenus[k];
            if (menuItem.isShow) {
                if (hasRightMenuCode || isAdmin == "True") {
                    if (checkRight(menuItem) || isAdmin == "True") {
                        html += "<li " + (second == k ? "class='this'" : "") + " key='" + k + "'><a class='ellipsis' hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                    } 
//                    else {
//                        html += "<li style='display:none;' " + (second == k ? "class='this'" : "") + " key='" + k + "'><a class='ellipsis p-noright' hidefocus='true' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
//                    }
                }
            }
        };
        html += "</ul></div>";
        if (tempMenus.length <= 0) html = "";
    }
    $(".nav_lev1").find("li[key=" + first + "]").append(html);
}
//显示二级目录
$(document).on('mouseenter', '.p-j-firstMenu', function () {
    var $obj = $(this), first = $obj.attr('key');
    if ($obj.hasClass('p-j-noRight')) return false; // 一级目录 没权限就不展示 一级以下目录

    if (first in amongMenus) { //三级目录的中间目录
        if ($obj.find('.p-j-midMenu').length == 0) {
            //显示三级导航的二级导航
            var curSecHtml = "<div class='pa p-j-midMenu'><ul>";
            var curSecMenu = amongMenus[first];
            for (var i in curSecMenu) {
                var mitem = curSecMenu[i];
                if (mitem.isShow) {
                    if (hasRightMenuCode || isAdmin == "True") {
                        if (checkRight(mitem) || isAdmin == "True") { //判断权限
                            if (mitem.con.length == 1) {
                                var thirdMenu = secondMenus[first][mitem.con[0]];
                                curSecHtml += "<li class='pr' key='" + mitem.con[0] + "'><a class='ellipsis' hidefocus='true' href='" + thirdMenu.url + "'>" + thirdMenu.name + "</a></li>";
                            } else {
                                curSecHtml += "<li class='p-j-showThree pr' parentKey='" + first + "' key='" + i + "'><a class='ellipsis' hidefocus='true' " + (mitem.url ? "href='" + mitem.url + "'" : "href='javascript:;'") + ">" + mitem.name + "</a></li>";
                            }
                        }
                    }
                }
            }
            curSecHtml += "</ul></div>";
            if ($(curSecHtml).find('li').length > 0) {
                $obj.append(curSecHtml);
            } else {
                return false;
            }
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
                                html += "<li key='" + menuItem.key + "'><a hidefocus='true' class='ellipsis' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                            }
                            //                            else {
                            //                                html += "<li style='display:none;' key='" + menuItem.key + "'><a hidefocus='true' class='ellipsis p-j-noRight' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                            //                            }
                        }
                    }
                }
                if (html != '') {
                    html = "<div class='p-j-secondMenu'><ul class='nav_lev2'>" + html + "</ul></div>";
                }
                if ($(html).find('li').length > 0) {
                    $(html).appendTo($obj);
                } else {
                    return false;
                }
            }
            else {
                return "";
            }
        } else {
            if ($(this).find('.p-j-secondMenu').find('li').length > 0) {
                $(this).find('.p-j-secondMenu').show();
            }
        }
    }
}).on('mouseleave', '.p-j-firstMenu', function () {
    $(this).find('.p-j-secondMenu').hide();
    $(this).find('.p-j-midMenu').hide();
}).on('mouseenter', '.p-j-showThree', function () {//显示 三级目录
    var $this = $(this), key = $this.attr('key'), pKey = $this.attr('parentkey'), thCon;
    if ($this.hasClass('p-j-noRight')) return false; // 二级目录 没权限就不展示 一级以下目录
    if ($this.find('.nav_lev2_box').length == 0) {
        var htmlD = '<div class="p-j-levThree nav_lev2_box pa" style="z-index:10000;width:120px;top:0px;right:120px;"><ul>';
        thCon = amongMenus[pKey][key].con;
        var sm = secondMenus[pKey],
            sk = $this.closest('.p-j-firstMenu').attr('sk');
        for (var j = 0; j < thCon.length; j++) {
            var $sm = sm[thCon[j]];
            if ($sm == undefined) continue;
            if (hasRightMenuCode || isAdmin == "True") {
                if (checkRight($sm) || isAdmin == "True") { //判断权限
                    htmlD += "<li " + (sk == thCon[j] ? "class='this'" : "") + " key='" + thCon[j] + "'><a class='ellipsis' href='" + $sm.url + "'>" + $sm.name + "</a></li>";
                }
            }
        }
        htmlD += "</ul></div>";
        if ($(htmlD).find('li').length == 0) {
            return false
        } else {
            $(htmlD).appendTo($this);
        }
    }
}).on('mouseenter', ".nav_lev1 li a", function () { //显示 显示不全的文字
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
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True") {
        return true;
    }
    var codes = menuItem.code.split(",");
    if (codes.length == 1 && codes[0] == "") { return true; }
    if (codes != "SYSPROJECTDATALIB_VIEW") {
        for (var index in codes) {
            var code = codes[index];
            if (code in codeObjs) {
                return true;
            }
        }
    } else if (codes == "PROJECTLIB_VIEW") {//项目库查看权限
        return checkProjLib(isShowProj);
    }
    else if (codes == "SYSPROJECTDATALIB_VIEW") {//项目资料库权限
        return checkProjLib(isShowProjLib);
    }

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
    $(".p-j-switch").live("click", function () {
        var $this = $(this);
        if ($this.hasClass("icon_tdFold_show")) {
            $this.closest("table").find(".p-j-tdFold").hide();
            $this.toggleClass("icon_tdFold_show icon_tdFold_hide");
            $this.prop("title", "点击展开");
        } else {
            $this.closest("table").find(".p-j-tdFold").show();
            $this.toggleClass("icon_tdFold_show icon_tdFold_hide");
            $this.prop("title", "点击折叠")
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
//控制 底部保存块位置
//$(window).scroll(function () {
//    $saveBar = $('.p-saveBar');
//    if ($saveBar.length > 0 && $saveBar.is(':visible')) {
//        var $footer = $('#yh-layout-footer'),
//            docHeight = document.body.scrollHeight, //页面高度
//            clientHeight = document.body.clientHeight,
//            fHeight = $footer.height(),
//            fTop = $footer.offset().top,
//            toTop = $(window).scrollTop();
//        var seeH = +toTop + clientHeight;
//        if (seeH > fTop) {
//            var rsH = seeH - fTop;
//            $saveBar.css("bottom", rsH);
//        } else {
//            $saveBar.css("bottom", 0);
//        }
//    }
//});
//window.onresize = function () {
//    $saveBar = $('.p-saveBar');
//    if ($saveBar.length > 0 && $saveBar.is(':visible')) {
//        var $footer = $('#yh-layout-footer'),
//            docHeight = document.body.scrollHeight, //页面高度
//            clientHeight = document.body.clientHeight,
//            fHeight = $footer.height(),
//            fTop = $footer.offset().top,
//            toTop = $(window).scrollTop();
//        var seeH = +toTop + clientHeight;
//        if (seeH > fTop) {
//            var rsH = seeH - fTop;
//            $saveBar.css("bottom", rsH);
//        } else {
//            $saveBar.css("bottom", 0);
//        }
//    }
//}