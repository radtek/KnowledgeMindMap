/*
//新菜单
//
*/
firstMenus = {
    "1": { "name": "工作中心", "url": "/PlanManage/PersonalTaskCenter", "code": "PERSONALCENTER_VIEW", "visible": false, "isShow": true, "order": "1" },
    "2": { "name": "项目设计管理", "url": "/DesignManage/LandIndex?isEdit=1", "code": "PROJECTLIB_VIEW,PROJECTLIB_VIEWMAG", "visible": false, "isShow": true, "order": "3" },
    "18": { "name": "设计变更", "url": "/DesignManage/DesignChangeIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": false, "order": "5" },
    "3": { "name": "产品模块管理", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW,PRODUCTSERIES_UPDATE", "visible": false, "isShow": true, "order": "2" },
    "5": { "name": "基础库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW,MATFIRST_ADD", "visible": false, "isShow": true, "order": "4" },
    "8": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": false, "isShow": true, "order": "6" },
    //"14": { "name": "设计供方库", "url": "/Supplier/DesignSupplierNew", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": true, "order": "5" },
    "15": { "name": "标准化单体成果库", "url": "/ProductSeries/StdUnitIndex", "code": "DESIGNPROLIB_VIEWALL,DESIGNPROLIB_VIEWMAG", "visible": false, "isShow": false, "order": "5" }
}

var amongMenus = {  //三级导航分类
    "8": {
        "1": { "name": "系统管理类", "con": [1, 2, 3, 48, 4, 5, 6, 7, 8, 9, 17], "isShow": true },
        "2": { "name": "项目管理类", "con": [18, 19, 14, 15, 16, 47], "isShow": true },
        "3": { "name": "产品管理类", "con": [28, 30, 35, 46], "isShow": true },
        "4": { "name": "基础管理类", "con": [20, 44, 45], "isShow": true }
    }
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
//    "3": {
//        "1": { "name": "产品系列", "url": "/ProductSeries/ProductSeriesIndex", "code": "PRODUCTSERIES_VIEW", "isShow": true },
//        "2": { "name": "产品系列编辑", "url": "/ProductSeries/ProductSeriesManage", "code": "PRODUCTSERIES_VIEWMAG,SERIESCUSTOMER_UPDATE,PRODUCTSERIES_ADD,PRODUCTSERIES_UPDATE,PRODUCTSERIES_DEL,SERIESUNITLIST_UPDATE,SERIESPLAN_UPDATE,SERIESUNIT_UPDATE,SERIESFACADE_UPDATE,SERIESLANSCAPE_UPDATE,SERIESPUBLIC_UPDATE,SERIESSAlEROOM_UPDATE,SERIESPARKING_UPDATE,SERIESEQUFAC_UPDATE", "isShow": true },
//        "7": { "name": "单体库", "url": "/ProductSeries/StdUnitIndex", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
//        "8": { "name": "单体库编辑", "url": "/ProductSeries/StdUnitIndex?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true },
//        "3": { "name": "客群库", "url": "/ProductSeries/SegmentLibraryIndexNew", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
//        "4": { "name": "客群库编辑", "url": "/ProductSeries/SegmentLibraryIndexNew?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
//        "5": { "name": "土地库", "url": "/ProductSeries/LandLibraryIndex", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true },
//        "6": { "name": "土地库编辑", "url": "/ProductSeries/LandLibraryIndex?isEdit=1", "code": "SYSPROJECTDATALIB_VIEW", "isShow": true }
//    },
    "5": {
        "3": { "name": "材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage?isEdit=1", "code": "MATLIMIT_VIEW", "isShow": true },
   //     "9": { "name": "类目编辑", "url": "/PublicMaterial/CatatorySetting", "code": "MATERIALCAT_MANAGE", "isShow": true },
   //     "10": { "name": "基类编辑", "url": "/PublicMaterial/BaseCatSetting", "code": "MATERIALBASE_MANAGE", "isShow": true }
        "11": { "name": "设计供方库", "url": "/Supplier/DesignSupplierNew", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
        "12": { "name": "设计供方库编辑", "url": "/Supplier/DesignSupplierNew?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true },
        "13": { "name": "设计师之家", "url": "/DesignerHome/QuestionIndex", "code": "", "isShow": true }
    },
    "8": {
        "1": { "name": "用户编辑", "url": "/HumanResource/UserManage", "code": "USERMANAGE_VIEW", "isShow": true },
        "2": { "name": "部门岗位编辑", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_VIEW", "isShow": true },
        "3": { "name": "通用岗位编辑", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_VIEW", "isShow": true },
        //"4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "4": { "name": "角色权限", "url": "/Authority/AuthorityManage", "code": "ROLERIGHT_VIEW", "isShow": true },
        "5": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "PROJDATATEMPLATE_VIEW", "isShow": true },
        "6": { "name": "系统业态设置", "url": "/ProductSeries/SysPropertyManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        //"7": { "name": "业态设置", "url": "/DesignManage/SysPropertyManage", "code": "PROERTYMANAGE_VIEW", "isShow": true },
        "7": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_VIEW", "isShow": true },
        "8": { "name": "阶段设置", "url": "/DesignManage/SysStageManage", "code": "SYSSTAGEMANAGE_VIEW", "isShow": true },
        //"10": { "name": "区域城市设置", "url": "/DesignManage/AreaCityManage", "code": "CITYMANAGE_VIEW", "isShow": true },
        "9": { "name": "文档类别设置", "url": "/DesignManage/SysFileCategory", "code": "SYSFILECATEGORY_VIEW", "isShow": true },
        "18": { "name": "地铁图", "url": "/SubWayMap/SubwayIndex", "code": "SYSSUBWAYMAP_VIEW", "isShow": true },
        "19": { "name": "决策流程图", "url": "/ContextDiagram/ContextDiagramIndex", "code": "SYSDECISION_VIEW", "isShow": true },
        "17": { "name": "流程模板", "url": "/MZWorkFlow/WorkFlowManage", "code": "FLOWTEMPLATE_VIEW", "isShow": true },
        "14": { "name": "计划模板", "url": "/PlanManage/PlanTemplateManage", "code": "PLANTEMPLATE_VIEW", "isShow": true },
        "15": { "name": "计划负责部门编辑", "url": "/DesignManage/TaskOrgManage", "code": "PLANCHARGEDEPART_VIEW", "isShow": true },
        "16": { "name": "计划任务统计报表", "url": "/DesignManage/TaskStatisticalReports", "code": "PLANTASKREPORT_VIEW", "isShow": true },
        "21": { "name": "系列模板编辑", "url": "/ProductSeries/ProductSeriesTemplateSetting", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "28": { "name": "模块模板管理", "url": "/ProductSeries/ModLibTemplateSetting", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
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
        "43": { "name": "表单自定义管理", "url": "/PlanManage/InitTableManage", "code": "LINEFORMATMANAGE_VIEW", "isShow": true },
        "44": { "name": "类目编辑", "url": "/PublicMaterial/CatatorySetting", "code": "MATERIALCAT_MANAGE", "isShow": true },
        "45": { "name": "基类编辑", "url": "/PublicMaterial/BaseCatSetting", "code": "MATERIALBASE_MANAGE", "isShow": true },
        "46": { "name": "档次管理", "url": "/ProductSeries/SysLevelManage", "code": "", "isShow": true },
        "47": { "name": "项目阶段管理", "url": "/DesignManage/ProjectDevelopStageManage", "code": "", "isShow": true },
        "48": { "name": "管理员设置", "url": "/Authority/AuthorityManagerIndex", "code": "RIGHTSCH_VIEW", "isShow": true }
    },
//    "14": {
//        "1": { "name": "设计供方库", "url": "/Supplier/DesignSupplierNew", "code": "DESIGNPROLIB_VIEWALL", "isShow": true },
//        "2": { "name": "设计供方库编辑", "url": "/Supplier/DesignSupplierNew?isEdit=1", "code": "DESIGNPROLIB_VIEWMAG", "isShow": true }
//    },
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
var FirstMenuOrder = [1, 2, 3, 18, 5, 8];
var secondMenuOrder = {
    "3": [1, 2, 7, 8, 3, 4, 5, 6]
};

var menuTable = {
    "12-1": "3-3",
    "12-2": "3-4",
    "11-1": "3-5",
    "11-2": "3-6",
    "15-1": "3-7",
    "15-2": "3-8",
    "5-9": "8-44",
    "5-10": "8-45",
    "14-1": "5-11",
    "14-2": "5-12",
    "20-2": "5-13"
};

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