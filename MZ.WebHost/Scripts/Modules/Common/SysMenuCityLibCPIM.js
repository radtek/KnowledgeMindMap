/*
//新菜单
//
*/
var loginName = (typeof logName != "undefined") ? logName : "";

firstMenus = {
    "1": { "name": "首页", "url": "/PersonelWorkCenter/HomeIndex", "code": "SYSHOME_VIEW", "visible": false, "isShow": false },
    "2": { "name": "项目库", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "visible": false, "isShow": false },
    "3": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_UPDATE", "visible": false, "isShow": true },
    "4": { "name": "外部项目库", "url": "/StandardResult/OutSideProjectIndex", "code": "OUTPROJECTLIB_VIEW,OUTPROJECTLIB_ADMIN", "visible": false, "isShow": false },
    "5": { "name": "部品材料库", "url": "/Material/MaterialStorage?isEdit=1", "code": "MATERIALLIB_VIEW,MATERIALLIB_VIEWMAG,SEEDINGLIB_VIEW,SEEDINGLIB_VIEWMAG,MATERIALCONTRAST_VIEW", "visible": false, "isShow": false },
    "6": { "name": "模块库", "url": "/ProductDevelop/ModuleLibrary", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "7": { "name": "项目资料库", "url": "/DesignManage/ProjDocumentIndex", "code": "SYSPROJECTDATALIB_VIEW", "visible": false, "isShow": false },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": true, "isShow": true },
    "9": { "name": "知识库", "url": "/StandardResult/PEMIndex?isEdit=1", "code": "CRAFTSLIB_VIEW,CRAFTSLIB_VIEWMAG", "visible": "false", "isShow": false },
    "10": { "name": "通用标准模块", "url": "/ProductDevelop/ProductCommonModuleIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": false },
    "11": { "name": "土地库", "url": "/ProductSeries/LandLibraryIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": true },
    "12": { "name": "客群库", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "MODULELIB_VIEW", "visible": false, "isShow": true },
    "13": { "name": "主题库", "url": "/ProductSeries/ProductThemeIndex", "code": "MODULELIB_VIEW", "visible": false, "isShow": true },
    "14": { "name": "项目资料系统", "url": "http://59.61.72.35:8010/Account/SSOLogin/?userName=" + loginName, "code": "PRODUCTSERIES_VIEW", "visible": false, "isShow": false }
}

/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "1": {
    //"1": { "name": "个人任务中心", "url": "/PersonelWorkCenter/PersonalTaskCenter", "code": "TASKCENTER_VIEW", "isShow": true },
    //"2": { "name": "个人审批中心", "url": "/WorkFlowCenter/PersonalFlowIndex", "code": "APPROVALCENTER_VIEW", "isShow": true }
    // "1": { "name": "个人任务中心", "url": "/PersonelWorkCenter/PersonalCenter#1", "code": "TASKCENTER_VIEW", "isShow": true },
    // "2": { "name": "个人审批中心", "url": "/PersonelWorkCenter/PersonalCenter#2", "code": "APPROVALCENTER_VIEW", "isShow": true }
    },
    "2": {
            "1": { "name": "项目库聚合", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "isShow": true },
            "2": { "name": "项目库管理", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true }
    //   "2": { "name": "项目库", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEWMAG", "isShow": true }
    },

    "3": {
        "1": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
        "2": { "name": "产品系列管理", "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG,SERIESCUSTOMER_UPDATE,PRODUCTSERIES_ADD,PRODUCTSERIES_UPDATE,PRODUCTSERIES_DEL,SERIESUNITLIST_UPDATE,SERIESPLAN_UPDATE,SERIESUNIT_UPDATE,SERIESFACADE_UPDATE,SERIESLANSCAPE_UPDATE,SERIESPUBLIC_UPDATE,SERIESSAlEROOM_UPDATE,SERIESPARKING_UPDATE,SERIESEQUFAC_UPDATE", "isShow": true }
    },
    "4": {
        "1": { "name": "外部项目库展示", "url": "/StandardResult/OutSideProjectIndex", "code": "OUTPROJECTLIB_VIEW", "isShow": false },
        "2": { "name": "外部项目库管理", "url": "/StandardResult/OutSideProjectIndex?isEdit=1", "code": "OUTPROJECTLIB_ADMIN", "isShow": false }
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
        "4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "DECISIONMANAGE_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "PROJDATATEMPLATE_VIEW", "isShow": true },
        //"6": { "name": "项目资料模板设置", "url": "/DesignManage/ProjPlanManage?isProjDocExpLib=1", "code": "PROJDATATEMPLATE_VIEW", "isShow": false },
        "6": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": false },
        "8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": false },
        //"10": { "name": "城市设置", "url": "/ProductSeries/SysCityManage", "code": "CITYMANAGE_VIEW", "isShow": false },
        //"11": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "SYSFILECATEGORY_VIEW", "isShow": false },
        // "12": { "name": "地铁图", "url": "/SubWayMap/SubwayMapList", "code": "SUBWAYMAP_VIEW", "isShow": true },
        //"13": { "name": "流程模板", "url": "/WorkFlowManage/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": false },
        "14": { "name": "计划模板", "url": "/DesignManage/PlanTemplateIndex", "code": "PLANTEMPLATE_VIEW", "isShow": false },
        "15": { "name": "计划负责部门管理", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": false },
        "16": { "name": "风格设置", "url": "/DesignManage/StyleManage", "code": "SYSSTYLE_VIEW", "isShow": false },
        "17": { "name": "户口本指标管理", "url": "/DesignManage/IndexTemplateManage", "code": "PLANINGINDEX_VIEW", "isShow": false },
        "18": { "name": "流程审批人员", "url": "/DesignManage/ProjFlowPostUserManageIndex", "code": "FLOWTEMPLATE_VIEW", "isShow": false },
        "19": { "name": "首页管理", "url": "/DesignManage/HomeIndexManage", "code": "SYSHOMEMANAGE_VIEW", "isShow": false },
        "20": { "name": "价值树管理", "url": "/ProductDevelop/ModuleTreeManage", "code": "SERIESCONFIG_VIEW", "isShow": false },
        "21": { "name": "产品线业态管理", "url": "/ProductDevelop/ProductLineFormatManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "21": { "name": "系列模板管理", "url": "/ProductSeries/ProductSeriesTemplateSetting", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "22": { "name": "层数管理", "url": "/ProductDevelop/ProductSeriesFloorTypeManage", "code": "FLOORTYPEMANAGE_VIEW", "isShow": false },
        "23": { "name": "建筑类型管理", "url": "/DesignManage/BuildingTypeManage", "code": "BUILDINGMANAGE_VIEW", "isShow": false },
        "24": { "name": "系统档次管理", "url": "/ProductDevelop/SysLevelManage", "code": "SYSLEVELMANAGE_VIEW", "isShow": false },
        "25": { "name": "政府部门要求管理", "url": "/InformationBank/GovRequestTemplateIndex", "code": "GOVREQUESTMANAGE_VIEW", "isShow": false },
        "26": { "name": "目标成本科目管理", "url": "/ProductDevelop/TargetCostSettings", "code": "TARGETCOSTMANAGE_VIEW", "isShow": false },
        "27": { "name": "项目新闻库管理", "url": "/DesignManage/ProjectNewsManage", "code": "XMDSJMANAGE_VIEW", "isShow": false },
        "28": { "name": "产品系列管理", "url": "/ProductSeries/ProductSeriesManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        "29": { "name": "产品品类设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductCategory", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "30": { "name": "模块视图设置", "url": "/ProductSeries/CommonTableManage?tableName=ProductModuleViewType", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "31": { "name": "系统配置项", "url": "/ProductSeries/ProductGlobalConfig", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "32": { "name": "系列主键管理", "url": "/ProductSeries/CommonTableManage?tableName=ProductPrimaryKey", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "33": { "name": "主题库管理", "url": "/ProductSeries/ProductThemeIndexManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": false },
        //"34": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "35": { "name": "户型视图设置", "url": "/ProductSeries/UnitViewTypeManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "36": { "name": "材料同步管理", "url": "/ProductSeries/ProductSeriesMaterialManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "37": { "name": "系列视图管理", "url": "/ProductSeries/CommonTableManage?tableName=ProductSeriesViewType", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
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
var FirstMenuOrder = [1, 3, 11,12,13,10, 2, 6, 9, 4, 5, 7, 8,14];
//二级导航排列顺序
var secondMenuOrder = { "4": [5, 6, 1, 2, 3, 4, 7, 8, 9],
    "5": [4, 3, 5, 6, 7]
}

//导航映射表
var menuTable = {
    "2-1": "2-1",
    "4-5":"4-5"
};


//展示一级目录
function showFirstMenu() {

    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    var html = "";
    for (var k1 = 0; k1 < FirstMenuOrder.length; k1++) {
        var k = FirstMenuOrder[k1];
        var menuItem = firstMenus[k];
        if ((hasRightMenuCode || isAdmin == "True") && menuItem.isShow) {
            if (checkRight(menuItem)) {//开发权限
                _hasSysRight_SS = true;
                if (k1 != 0) {
                    html += "<li key='" + k + "'onmouseover='SetMouseOverMenu(this," + k + ")' onmouseout='SetMouseOutMenu()' ><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                }
                else {
                    html += "<li key='" + k + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
                }
            } else {
                if (k1 != 0) {
                    html += "<li key='" + k + "'onmouseover='SetMouseOverMenu(this," + k + ")' onmouseout='SetMouseOutMenu()' ><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
                }
                else {
                    html += "<li key='" + k + "'><a hidefocus='true' class='p-noright' yh-popover='{content:\"暂无权限\",placement:\"bottom\"}' >" + menuItem.name + "</a></li>";
                }
            }
        }
    }

    //    for (var k in firstMenus) {
    //        var menuItem = firstMenus[k]; 
    //        if ((hasRightMenuCode || isAdmin == "True") && menuItem.isShow) {
    //            if (checkRight(menuItem) || isAdmin == "True") {
    //                _hasSysRight_SS = true;
    //                html += "<li key='" + k + "'><a hidefocus='true' href='" + menuItem.url + "'>" + menuItem.name + "</a></li>";
    //            } else { html += "<li key='" + k + "'><a hidefocus='true' class='gray' >" + menuItem.name + "</a></li>"; }
    //        }
    //    }

    $(".nav_lev1").html(html);
    return _hasSysRight_SS
}


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
                tempMenuArr.push(tempMenus[k])
            }
        }

        var html = "";
        for (j = 0; j < tempMenuArr.length; j++) {
            if (first == 0) {
                continue;
            }
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



////临时，菜单配置项
//var MenuArr = new Array();

//MenuArr[0] = [
//{ "name": "首页", displayName: "首页", order: 1, "url": "#" },
//{ "name": "产品系列", displayName: "产品系列", order: 2, "url": "/ProductDevelop/Index" },
//{ "name": "项目库", displayName: "项目库", order: 3, "url": "http://125.77.255.2:11013/项目库聚合-列表展示.html" },
//{ "name": "产品标准库", displayName: "产品标准库", order: 4, "url": "#" },
//    { "name": "部品材料库", displayName: "部品材料库", order: 5, "url": "/Material/MaterialStorage" },
//    { "name": "项目资料库", displayName: "项目资料库", order: 6, "url": "#" },
////    { "name": "土地库", displayName: "土地库", order: 7, "url": "/LandManage/LandIndex" },
//    {"name": "系统设置", displayName: "系统设置", order: 7, "url": "/HumanResource/UserManage" }
//    ];
////MenuArr[1] = [
////{ "name": "首页", "url": "/DesignManage/NewHome_XC" }
////    ];
//MenuArr[2] = [
//{ "name": "产品系列展示", "url": "/ProductDevelop/ProductSeriesIndex" },
//{ "name": "产品系列管理", "url": "/ProductDevelop/ProductSeriesManage" },
//{ "name": "土地库", "url": "/ProductDevelop/ProductSeriesManage" },
//{ "name": "土地库管理", "url": "/ProductDevelop/ProductSeriesManage" },
//{ "name": "客群库", "url": "/ProductDevelop/ProductSeriesManage" },
//{ "name": "客群库管理", "url": "/ProductDevelop/ProductSeriesManage" }
//    ];
////MenuArr[3] = [
////{ "name": "项目聚合", "url": "/ProjectManage/ProjLandIndex" },
//////{ "name": "项目展示", "url": "/ProjectManage/ProjLandIndex" },
////{ "name": "项目管理", "url": "/ProjectManage/ProjLandIndex?isEdit=1" }
////    ];
////MenuArr[4] = [
////{ "name": "平面标准库", displayName: "平面库", "url": "/StandardResult/StandardResultLibrary?libId=1" },
////{ "name": "立面标准库", displayName: "立面库", "url": "/StandardResult/StandardResultLibrary?libId=3" },
////{ "name": "室内标准库", displayName: "室内库", "url": "/StandardResult/StandardResultLibrary?libId=2" },
////{ "name": "景观标准库", displayName: "景观库", "url": "/StandardResult/LandscapeIndex" },
////{ "name": "专业库管理", "url": "/StandardResult/StandardResultManage" }
////    ];
////MenuArr[5] = [
////{ "name": "知识库展示", "url": "/TecMethod/Index?libId=4" },
////{ "name": "知识库管理", "url": "/TecMethod/Index/?isEdit=1&libId=4" }
////    ];
//MenuArr[5] = [
//{ "name": "材料库", "url": "/Material/MaterialStorage" },
////{ "name": "苗木库", "url": "/Material/MaterialSeedlings" },
//{"name": "材料库管理", "url": "/Material/MaterialStorage?isEdit=1" },
//{ "name": "材料对比", "url": "/Material/MatContrast" }
////{ "name": "苗木库管理", "url": "/Material/MaterialSeedlings?isEdit=1" }
//];

////MenuArr[7] = [
////{ "name": "土地展示", "url": "/LandManage/LandIndex" },
////{ "name": "土地管理", "url": "/LandManage/LandIndex?isEdit=1" }
////    ];
//MenuArr[7] = [
//{ "name": "用户管理", "url": "/HumanResource/UserManage" },
//{ "name": "部门岗位", "url": "/HumanResource/OrgManage" },
//{ "name": "通用岗位", "url": "/HumanResource/ComPostManage" },
//{ "name": "城市管理", "url": "/Material/MatProvinceManage" }
////{ "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage" },
////{ "name": "首页管理", "url": "/PersonelWorkCenter/HomeIndexManage" },
////{ "name": "项目资料目录模板", "url": "/DesignManage/CorpExperience" },
////{ "name": "待删除项目资料", "url": "/ProjectManage/ProjDocumentPreDelete" }
//    ];

//var hasRightMenuCode = typeof ArrMenuRight != "undefined";
//function SetUpMenu(index) {
//    //MenuArr[0][index - 1].visible = true;
//    var nameArr = "", html = "", hasMenuRight = false, item = null, ligroup = [], newIndex = 0;
//    for (var x = 0; x < MenuArr[0].length; x++) {
//        item = MenuArr[0][x];
//        hasMenuRight = hasRightMenuCode == true ? (ArrMenuRight[0][x] == true) : true;
//        if (typeof item.displayName == "string") {
//            nameArr = item.displayName;
//        } else {
//            nameArr = item.name.split(",")[0];
//        }

//        if (item.url != "" && hasMenuRight == true) {
//            html = "<li><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
//        } else {
//            html = "<li style='display:none;'><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
//        }
//        ligroup.push({ html: html, newOrder: (typeof item.order === "number") ? parseInt(item.order) : 0, oldOrder: x });
//    }
//    ligroup = ligroup.sort(function (x, y) {
//        return x.newOrder - y.newOrder;
//    });
//    html = "";
//    for (x = 0, html = ""; x < ligroup.length; x++) {
//        item = ligroup[x];
//        html += item.html;
//        if (item.oldOrder == (index - 1)) {
//            newIndex = x;
//        }
//    }
//    $(".nav_lev1").html(html);
//    $(".nav_lev1").find("li:eq(" + newIndex + ")").addClass("this");
//}

//function SetMenu(index, cindex) {
//    var nameArr = "", html = "", hasMenuRight = false, item = null, ligroup = [], newIndex;
//    if (isNaN(index)) {
//        index = findIndex(index);
//        if (index == false) index = 0;
//    }
//    if (isNaN(cindex)) {
//        cindex = findCIndex(cindex, index);
//        if (cindex == false) cindex = 0;
//    }

//    SetUpMenu(index);
//    if (MenuArr[index]) {
//        for (var x = 0; x < MenuArr[index].length; x++) {
//            item = MenuArr[index][x];
//            if (typeof item.displayName == "string") {
//                nameArr = item.displayName;
//            } else {
//                nameArr = item.name.split(",")[0];
//            }
//            var hasMenuRight = hasRightMenuCode == true ? (ArrMenuRight[index][x] == true) : true;

//            if (item.url != "" && hasMenuRight == true) {
//                html = "<li><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
//            } else {
//                html = "<li style='display:none;'><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
//            }
//            ligroup.push({ html: html, newOrder: (typeof item.order === "number") ? parseInt(item.order) : 0, oldOrder: x });
//        }
//        ligroup = ligroup.sort(function (x, y) {
//            return x.newOrder - y.newOrder;
//        });
//        html = "";
//        for (x = 0, html = ""; x < ligroup.length; x++) {
//            item = ligroup[x];
//            html += item.html;
//            if (item.oldOrder == (cindex - 1)) {
//                newIndex = x;
//            }
//        }
//        $(".nav_lev2").html(html);
//    }
//    if (cindex) { cindex--; $(".nav_lev2").find("li:eq(" + newIndex + ")").addClass("this"); }
//}

//function findCIndex(str, index) {
//    if (MenuArr[index]) {
//        for (var x = 0; x < MenuArr[index].length; x++) {
//            if (MenuArr[index][x].name == str) {
//                return x + 1;
//            }
//        }
//        return false;
//    } else { return false; }
//}


//function findIndex(str) {
//    for (var x = 0; x < MenuArr[0].length; x++) {
//        var nameArr = MenuArr[0][x].name.split(",");
//        if (MenuArr[0][x].name.indexOf(str) != -1) {
//            if (MenuArr[0][x].name == str) {
//                // MenuArr[0][x].visible = true;
//                return x + 1;

//            } else {
//                for (var y = 0; y < nameArr.length; y++) {
//                    if (nameArr[y] == str) {
//                        //MenuArr[0][x].name = str;
//                        // MenuArr[0][x].visible = true;
//                        return x + 1;
//                    }
//                }
//                return false;
//            }
//        }
//    }
//}