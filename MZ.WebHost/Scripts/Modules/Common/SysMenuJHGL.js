/*
//新菜单
//
*/
firstMenus = {
    "1": { "name": "个人中心", "url": "/PlanManage/PersonalTaskCenter", "code": "PERSONALCENTER_VIEW", "visible": false, "isShow": true, "order": "1" },
    "2": { "name": "项目库", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG", "visible": false, "isShow": true, "order": "2" },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": false, "isShow": true, "order": "3" }
}

/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "1": {
        "3": { "name": "个人任务中心", "url": "/PlanManage/PersonalTaskCenter", "code": "TASKCENTER_VIEW", "isShow": true },
        "4": { "name": "个人审批中心", "url": "/PlanManage/PersonalFlowCenter", "code": "APPROVALCENTER_VIEW", "isShow": true }
    },
    "2": {
        "1": { "name": "项目库", "url": "/DesignManage/LandIndex?isEdit=0", "code": "PROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "项目库管理", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true },
        "3": { "name": "项目审批人员设置", "url": "/PlanManage/ProjFlowPostUserManageIndex", "code": "PROJAPPROVALPER_VIEW", "isShow": true }
    },
    "8": {
        "1": { "name": "用户管理", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位管理", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位管理", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_VIEW", "isShow": true },
        "4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "6": { "name": "业态设置", "url": "/DesignManage/SysPropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": true },
        "7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": true },
        "8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "CITYMANAGE_VIEW", "isShow": true },
        "9": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "SYSFILECATEGORY_VIEW", "isShow": true },
        "18": { "name": "地铁图", "url": "/SubWayMap/SubwayIndex", "code": "SYSSUBWAYMAP_VIEW", "isShow": true },
        "19": { "name": "决策流程图", "url": "/ContextDiagram/ContextDiagramIndex", "code": "SYSDECISION_VIEW", "isShow": true },
        "17": { "name": "流程模板", "url": "/MZWorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "14": { "name": "计划模板", "url": "/PlanManage/PlanTemplateManage", "code": "PLANTEMPLATE_VIEW", "isShow": true },
        "15": { "name": "计划负责部门管理", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": true },
        "16": { "name": "计划任务统计报表", "url": "/DesignManage/TaskStatisticalReports", "code": "PLANTASKREPORT_VIEW", "isShow": true }
    }
}

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
var FirstMenuOrder = [1, 2, 8];

//展示一级目录
function showFirstMenu() {
    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True" || isAdmin == "True") {
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
                if (hasRightMenuCode || isAdmin == "True") {
                    if (checkRight(menuItem) || isAdmin == "True") {
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
    if (isAdmin == 'True') { return true; }
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True") {
        return true;
    }
    var codes = menuItem.code.split(",");
    if (codes.length == 1 && codes[0] == "") { return true; }
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