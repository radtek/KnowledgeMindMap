/*
//新菜单
//
*/
firstMenus = {
    "1": { "name": "个人中心", "url": "/PlanManage/PersonalTaskCenter", "code": "PERSONALCENTER_VIEW", "visible": false, "isShow": true, "order": "1" },
    "2": { "name": "项目设计管理", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG", "visible": false, "isShow": true, "order": "3" },
    "18": { "name": "设计变更", "url": "/DesignManage/DesignChangeIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": false, "order": "5" },
    "3": { "name": "产品库", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_UPDATE", "visible": false, "isShow": true, "order": "2" },
    "5": { "name": "材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW,MATFIRST_ADD", "visible": false, "isShow": true, "order": "4" },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": false, "isShow": true, "order": "6" },
    "14": { "name": "设计资源管理", "url": "/Supplier/DesignSupplierNew", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": true, "order": "5" },
    "15": { "name": "标准化单体成果库", "url": "/ProductSeries/StdUnitIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": false, "order": "5" }
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
        "1": { "name": "项目设计管理", "url": "/DesignManage/LandIndex?isEdit=0", "code": "PROJECTLIB_VIEW", "isShow": true },
        "2": { "name": "项目设计管理编辑", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true },
        "3": { "name": "项目审批人员设置", "url": "/PlanManage/ProjFlowPostUserManageIndex", "code": "PROJAPPROVALPER_VIEW", "isShow": true }
    },
    "3": {
        "1": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
        "2": { "name": "产品系列编辑", "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG,SERIESCUSTOMER_UPDATE,PRODUCTSERIES_ADD,PRODUCTSERIES_UPDATE,PRODUCTSERIES_DEL,SERIESUNITLIST_UPDATE,SERIESPLAN_UPDATE,SERIESUNIT_UPDATE,SERIESFACADE_UPDATE,SERIESLANSCAPE_UPDATE,SERIESPUBLIC_UPDATE,SERIESSAlEROOM_UPDATE,SERIESPARKING_UPDATE,SERIESEQUFAC_UPDATE", "isShow": true },
        "7": { "name": "单体库", "url": "/ProductSeries/StdUnitIndex", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
        "8": { "name": "单体库编辑", "url": "/ProductSeries/StdUnitIndex?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true },
        "3": { "name": "客群库", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "4": { "name": "客群库编辑", "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "5": { "name": "土地库", "url": "/ProductSeries/LandLibraryIndex", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
        "6": { "name": "土地库编辑", "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
    },
    "5": {
        "3": { "name": "材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage?isEdit=1", "code": "MATLIMIT_VIEW", "isShow": true },
        "9": { "name": "类目编辑", "url": "/PublicMaterial/CatatorySetting", "code": "MATERIALCAT_MANAGE", "isShow": true },
        "10": { "name": "基类编辑", "url": "/PublicMaterial/BaseCatSetting", "code": "MATERIALBASE_MANAGE", "isShow": true }
    },
    "8": {
        "1": { "name": "用户编辑", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位编辑", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位编辑", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_VIEW", "isShow": true },
        "4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "PROJDATATEMPLATE_VIEW", "isShow": true },
        "6": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"7": { "name": "业态设置", "url": "/DesignManage/SysPropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": true },
        "7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": true },
        "8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": true },
        //"10": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "CITYMANAGE_VIEW", "isShow": true },
        "9": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "SYSFILECATEGORY_VIEW", "isShow": true },
        "18": { "name": "地铁图", "url": "/SubWayMap/SubwayIndex", "code": "SYSSUBWAYMAP_VIEW", "isShow": true },
        "17": { "name": "决策流程图", "url": "/ContextDiagram/ContextDiagramIndex", "code": "SYSDECISION_VIEW", "isShow": true },
        "13": { "name": "流程模板", "url": "/MZWorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "14": { "name": "计划模板", "url": "/PlanManage/PlanTemplateManage", "code": "PLANTEMPLATE_VIEW", "isShow": true },
        "15": { "name": "计划负责部门编辑", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": true },
        "16": { "name": "计划任务统计报表", "url": "/DesignManage/TaskStatisticalReports", "code": "PLANTASKREPORT_VIEW", "isShow": true },
        "21": { "name": "系列模板编辑", "url": "/ProductSeries/ProductSeriesTemplateSetting", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "29": { "name": "产品品类设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductCategory", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "30": { "name": "模块视图设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductModuleViewType", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "31": { "name": "产品系列配置项", "url": "/ProductSeries/ProductGlobalConfig", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "32": { "name": "系列主键编辑", "url": "/ProductSeries/CommonTableManage?tableName=ProductPrimaryKey", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "20": { "name": "设计供方参数设置", "url": "/Supplier/SupplierTableManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "35": { "name": "户型视图设置", "url": "/ProductSeries/UnitViewTypeManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "38": { "name": "客群公式设置", "url": "/ProductSeries/SegmentCalMethodManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "39": { "name": "客群模板设置", "url": "/ProductSeries/SegmentIndicatorTemplate", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "40": { "name": "土地模板设置", "url": "/ProductSeries/LandIndicatorTemplate", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "41": { "name": "土地公式设置", "url": "/ProductSeries/LandLibCalMethodManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "42": { "name": "设计费用模板", "url": "/DesignManage/DesignPayModel?type=1", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
         "43": { "name": "表单自定义管理", "url": "/PlanManage/InitTableManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true }
    },
    "14": {
        "1": { "name": "设计资源管理", "url": "/Supplier/DesignSupplierNew", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
        "2": { "name": "设计资源管理编辑", "url": "/Supplier/DesignSupplierNew?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true }
    },
    "15": {
        "1": { "name": "单体库", "url": "/ProductSeries/StdUnitIndex", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
        "2": { "name": "单体库编辑", "url": "/ProductSeries/StdUnitIndex?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true }
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
var FirstMenuOrder = [1, 3, 2, 18, 5, 14, 8];
var secondMenuOrder = {
    "3": [1, 2, 7, 8, 3, 4, 5, 6]
};

var menuTable = {
    "12-1": "3-3",
    "12-2": "3-4",
    "11-1": "3-5",
    "11-2": "3-6",
    "15-1":"3-7",
    "15-2":"3-8"
};

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
            SetMenu2(val[0], val[1]); return;
        } else if (val.length == 1) {
            SetMenu2(val[0]);
            return;
        }
    }
    SetMenu2(first, second);
}

//展示一级目录
function showFirstMenu() {
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
                //if (k1 != 0) {
                    html += "<li key='" + k + "' class='p-j-secondMenu'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
//                }
//                else {
//                    html += "<li key='" + k + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
//                }
            } else {
                //if (k1 != 0) {
                    html += "<li key='" + k + "'class='p-j-secondMenu'><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
//                }
//                else {
//                    html += "<li key='" + k + "'><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
//                }
            }
        }
    }
    $(".nav_lev1").html(html);
    return _hasSysRight_SS
}

function SetMenu2(first, second) {
    var _hasSysRight_SS = showFirstMenu(); // 
    if (!_hasSysRight_SS) {
        window.location.href = "/RightPage.html";
    }

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
                tempMenuArr.push(tempMenus[k]);
            }
        }

        var html = "";
        for (var j = 0; j < tempMenuArr.length; j++) {
            var menuItem = tempMenuArr[j];
            if (menuItem.isShow == true) {
                if (hasRightMenuCode || isAdmin == "True") {
                    if (checkRight(menuItem) || isAdmin == "True") {
                        html += "<li key='" + menuItem.key + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                    } else {
                        //html += "<li key='" + k + "'><a hidefocus='true' class='gray' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                        html += "<li key='" + menuItem.key + "'><a hidefocus='true' class='p-noright' yh-popover='暂无权限' href='javascript:void(0)'>" + menuItem.name + "</a></li>";
                    }
                }
            }
        };
        $(".nav_lev2").html(html);
    }
    var $navLev1 = $(".nav_lev1").find("li[key=" + first + "]");
    var liLeft = $navLev1.offset().left;
    $(".nav_lev1").find("li[key=" + first + "]").addClass("this");
    if (second) {
        $(".nav_lev2").find("li[key=" + second + "]").addClass("this");
    }
    $("#navLev2").hide();
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

$(document).on('mouseenter', '.p-j-secondMenu', function () {
    var $obj = $(this), first = $obj.attr('key'),
        liLeft = $obj.offset().left, $cur_nav2 = $("#navLev2"),
        $none_nav2 = $("#nav_levnone2");
    if ($obj.hasClass("this") == true) {
        var childLen = $cur_nav2.find("ul").children().length;
        childLen > 9 ? $cur_nav2.css({ "width": "280px", "z-index": "10000" }) : $cur_nav2.css({ "width": "140px", "z-index": "10000" });
        if (childLen == 0) {
            $cur_nav2.hide();
        } else {
            setTimeout('$("#navLev2").show()', "normal");
        }
        $none_nav2.hide();
        $cur_nav2.css("left", liLeft + 2);
    } else {
        $cur_nav2.hide();
        if (first in secondMenus) {
            setTimeout('$("#nav_levnone2").show()', "normal");
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
                    tempMenuArr.push(tempMenus[k]);
                }
            }

            var tempMenus = secondMenus[first];
            var html = '';
            tempMenuArr.length > 9 ? $none_nav2.css({ "width": "280px" }) : $none_nav2.css({ "width": "140px" });
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
                $none_nav2.css({ "visibility": "visible" });
                html = "<ul class='nav_lev2'>" + html + "</ul>";
            } else {
                $none_nav2.css({ "visibility": "hidden" }).css("padding", "0px");
            }

            $none_nav2.html("").css({ "left": liLeft + 2, "z-index": "10000" }).html(html);
        }
        else {
            return "";
        }
    }
}).on('mouseleave', '.p-j-secondMenu', function () {
    var $cur_nav2 = $("#navLev2"),
        $none_nav2 = $("#nav_levnone2");
    var showTimer = setTimeout(function () {
        $none_nav2.hide();
        $cur_nav2.hide();
    }, "slow");

    $cur_nav2.hover(function () {
        clearInterval(showTimer);
    }, function () {
        showTimer = setTimeout(function () {
            $cur_nav2.hide();
        }, "fast");
    });
    $none_nav2.hover(function () {
        clearInterval(showTimer);
    }, function () {
        showTimer = setTimeout(function () {
            $none_nav2.hide();
        }, "fast");
    });
});

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
});
//document.write("<script type='text/javascript' src='../../Scripts/Projects/ZY/zhuoyue.js'></script>");