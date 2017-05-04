/*
//新菜单
//
*/
firstMenus = { "1": { "name": "个人中心", "url": "/DesignManage/PersonalTaskCenter", "code": "PROJECTLIB_VIEW", "visible": false, "isShow": true, "order": "1" },
    "2": { "name": "项目库", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "visible": false, "isShow": true, "order": "2" },
    "3": { "name": "产品系列", "url": "/ProductDevelop/ProductSeriesIndex_SS", "code": "PRODUCTDEVPLAT_VIEW", "visible": false, "isShow": true, "order": "3" },
    "4": { "name": "外部项目库", "url": "/StandardResult/OutSideProjectIndex", "code": "OUTPROJECTLIB_VIEW", "visible": false, "isShow": true, "order": "4" },
    "5": { "name": "部品材料库", "url": "/Material/MaterialStorage", "code": "MATERIALLIB_VIEW", "visible": false, "isShow": true, "order": "5" },
    "6": { "name": "专业标准库", "url": "/StandardResult/StandardLibraryIndex", "code": "UNITLIB_VIEW,LANDSCAPELIB_VIEW,DECORATIONLIB_VIEW,FACADELIB_VIEW,CRAFTSLIB_VIEW,DEMAREALIB_VIEW", "visible": false, "isShow": true, "order": "6" },
    "7": { "name": "项目资料库", "url": "/DesignManage/ProjDocumentIndex", "code": "SYSPROJECTDATALIB_VIEW", "visible": false, "isShow": true, "order": "7" },
    "9": { "name": "设计供方库", "url": "/Supplier/Designsupplier", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": true, "order": "8" },
    "10": { "name": "招采系统", "url": "/TenderManage/TenderSortSearch", "code": "BIDPURCHAS_VIEW", "visible": false, "isShow": true, "order": "9" },
    "11": { "name": "成本系统", "url": "/CostManage/CostIndex", "code": "", "visible": false, "isShow": true, "order": "9" },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": false, "isShow": true, "order": "10" }
}

/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "1": {
        "1": { "name": "个人任务中心", "url": "/DesignManage/PersonalTaskCenter", "code": "PROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "个人审批中心", "url": "/WorkFlowCenter/PersonalFlowCenter", "code": "PROJECTLIB_VIEW", "isShow": true }
    },
    "2": {
        "1": { "name": "项目管理", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "设计变更管理", "url": "/DesignManage/DesignChangeIndex", "code": "PROJECTLIB_VIEW", "isShow": true },
        "3": { "name": "项目审批人员设置", "url": "/DesignManage/ProjFlowPostUserManageIndex", "code": "PROJECTLIB_VIEW", "isShow": true }
    },
    "3": {
        "1": { "name": "产品系列", "url": "/ProductDevelop/ProductSeriesIndex_SS", "code": "PRODUCTDEVPLAT_VIEW", "isShow": true },
        "2": { "name": "产品系列管理", "url": "/ProductDevelop/ProductSeriesManage_SS", "code": "PRODUCTWORTH_UPDATE,PRODUCTDEVPLAT_ADD,PRODUCTDEVPLAT_UPDATE,PRODUCTDEVPLAT_DEL,PRODUCTWORTH_UPDATE,PRODUCTCONFIGSTAND_UPDATE", "isShow": true }
    },
    "5": {
        "1": { "name": "类目管理", "url": "/Material/CatatorySetting", "code": "MATERIALCAT_VIEW", "isShow": true },
        "2": { "name": "基类管理", "url": "/Material/BaseCatSetting", "code": "MATERIALBASE_VIEW", "isShow": true },
        "3": { "name": "品牌管理", "url": "/Material/BrandSetting", "code": "MATERIALBRAND_VIEW", "isShow": true },
        "4": { "name": "供应商管理", "url": "/Material/MatSupplierList", "code": "MATERIALPRO_VIEW", "isShow": true },
        "5": { "name": "材料城市", "url": "/Material/MaterialCity", "code": "MATERIALCITY_VIEW", "isShow": true },
        "6": { "name": "应用项目", "url": "/Material/MaterialProject", "code": "MATERIALCITY_VIEW", "isShow": true },
        "7": { "name": "标准材料库", "url": "/MaterialStandardization/SearchMaterial?catid=0", "code": "MATERIALCAT_VIEW", "isShow": true },
        "8": { "name": "材料分析", "url": "/MaterialStatistic/Index", "code": "MATANALYZE_VIEW", "isShow": true },
        "9": { "name": "材料供应商", "url": "/TenderManage/SupplierSortSearch", "code": "MATERIALCAT_VIEW", "isShow": true }
    },
    "6": {
        "1": { "name": "户型库", "url": "/StandardResult/StandardResultLibrary?libId=1", "code": "UNITLIB_VIEW", "isShow": true },
        "2": { "name": "景观库", "url": "/StandardResult/StandardResultLibrary?libId=2", "code": "LANDSCAPELIB_VIEW", "isShow": true },
        "3": { "name": "室内库", "url": "/StandardResult/StandardResultLibrary?libId=3", "code": "DECORATIONLIB_VIEW", "isShow": true },
        "4": { "name": "立面库", "url": "/StandardResult/StandardResultLibrary?libId=4", "code": "FACADELIB_VIEW", "isShow": true },
        "5": { "name": "工艺工法库", "url": "/StandardResult/StandardResultLibrary?libId=6", "code": "CRAFTSLIB_VIEW", "isShow": true },
        //"6": { "name": "规划库", "url": "/StandardResult/StandardResultLibrary?libId=7", "code": "SYSTEMSETTING_VIEW", "isShow": false },
        "7": { "name": "示范区库", "url": "/StandardResult/StandardResultLibrary?libId=10", "code": "DEMAREALIB_VIEW", "isShow": true }
    },
    "7": {
        "1": { "name": "跨EPS项目资料汇总", "url": "/DesignManage/ProjEpsDocManage/", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "9": {
        "1": { "name": "设计供方库", "url": "/Supplier/Designsupplier", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
        "2": { "name": "设计供方库管理", "url": "/Supplier/Designsupplier?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true }
    },
    "10": {
        "1": { "name": "招标", "url": "/TenderManage/TenderSortSearch", "code": "BIDDING_VIEW", "isShow": true },
        "2": { "name": "供应商", "url": "/TenderManage/SupplierSortSearch", "code": "PURCHASINGSUP_VIEW", "isShow": true },
        "3": { "name": "供应商评价", "url": "/TenderManage/SupplierEvaluateIndex", "code": "PURCHASINGSUP_VIEW", "isShow": true }
    }
    ,
    "11": {
        "1": { "name": "成本", "url": "/CostManage/CostIndex", "code": "", "isShow": true }
    }
    ,
    "8": {
        "1": { "name": "用户管理", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位管理", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位管理", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_VIEW", "isShow": true },
        "4": { "name": "决策模板管理", "url": "/PolicyDecision/PolicyDecisionTemplate", "code": "DECISIONMANAGE_VIEW", "isShow": true },
        "5": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "6": { "name": "项目资料模板设置", "url": "/DesignManage/CorpExperience", "code": "PROJDATATEMPLATE_VIEW", "isShow": true },
        "7": { "name": "业态设置", "url": "/InformationBank/PropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": true },
        "8": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": true },
        "9": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": true },
        "10": { "name": "区域城市设置", "url": "/DesignManage/LandAreaCityManage", "code": "AREACITYMANAGE_VIEW", "isShow": true },
        "11": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "SYSFILECATEGORY_VIEW", "isShow": true },
        "12": { "name": "地铁图", "url": "/SubWayMap/SubwayMapList", "code": "SUBWAYMAP_VIEWMAG", "isShow": true },
        "13": { "name": "流程模板", "url": "/WorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "14": { "name": "计划模板", "url": "/DesignManage/PlanTemplateIndex", "code": "PLANTEMPLATE_VIEW", "isShow": true },
        "15": { "name": "计划负责部门管理", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": true },
        "16": { "name": "计划任务统计报表", "url": "/DesignManage/TaskStatisticalReports", "code": "PLANSTATISTICSREPORT_VIEW", "isShow": true },
        "17": { "name": "设计供应商评价项管理", "url": "/Supplier/SupplierEvaluateItemManage", "code": "SYSDESIGNSUPPLIERITEM_VIEW", "isShow": true },
        "18": { "name": "指派人员设置", "url": "/Material/MatAssignUsers", "code": "MATERIALPRO_VIEW", "isShow": true },
         "20": { "name": "标准材料目录", "url": "/MaterialStandardization/CategorySetting", "code": "MATERIALCAT_VIEW", "isShow": true }
        //"19": { "name": "价值树管理", "url": "/ProductDevelop/ModuleTreeManage", "code": "SYSTEMSETTING_VIEW", "isShow": true }
    }
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
var FirstMenuOrder = [1, 2, 3, 6, 4, 5, 7, 9,10,11, 8];

//展示一级目录
function showFirstMenu() {

    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True") {
        _hasSysRight_SS = true;
        hasRightMenuCode = true;
    }


    var html = "";
    //    for (var k in firstMenus) {
    for (var k1 = 0; k1 < FirstMenuOrder.length; k1++) {
        var k = FirstMenuOrder[k1];
        var menuItem = firstMenus[k];
        
        if (hasRightMenuCode && menuItem.isShow) {
            if (checkRight(menuItem)) {
                _hasSysRight_SS = true;
                html += "<li key='" + k + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
            } else { html += "<li key='" + k + "'><a hidefocus='true' class='gray' >" + menuItem.name + "</a></li>"; }
        }
    }

    $(".nav_lev1").html(html);
    return _hasSysRight_SS
}



function SetMenu(first, second) {

    var _hasSysRight_SS = showFirstMenu(); // 
    if (!_hasSysRight_SS) {
        window.location.href = "/RightPage.html";
    }


    if (first in secondMenus) {
        var tempMenus = secondMenus[first];
        var html = "";

        for (var k in tempMenus) {
            var menuItem = tempMenus[k];
            if (menuItem.isShow == true) {
                if (hasRightMenuCode) {
                    if (checkRight(menuItem)) {
                        html += "<li key='" + k + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                    } else {
                        //html += "<li key='" + k + "'><a hidefocus='true' class='gray' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                    }
                }
            }
        };
        $(".nav_lev2").html(html);
    }
    $(".nav_lev1").find("li[key=" + first + "]").addClass("this");
    if (second) {
        $(".nav_lev2").find("li[key=" + second + "]").addClass("this");
    }
}


//判断能否查看
function checkRight(menuItem) {
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True" || menuItem.code=="") {
        return true;
    }
    var codes = menuItem.code.split(",");
    
    if (codes != "SYSPROJECTDATALIB_VIEW" && codes != "PROJECTLIB_VIEW") {
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