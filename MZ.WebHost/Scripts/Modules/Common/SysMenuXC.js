//临时，菜单配置项
var MenuArr = new Array();
var curMenuBusOrgAreaTypeId = 0;
if (typeof (menuBusOrgAreaTypeId) != "undefined") {
    curMenuBusOrgAreaTypeId = menuBusOrgAreaTypeId;
}


MenuArr[0] = [
    { "name": "首页", displayName: "首页", order: 1, "url": "/PersonelWorkCenter/HomeIndex" },
    { "name": "产品系列", displayName: "产品系列", order: 2, "url": "/ProductDevelop/ProductSeriesIndex?BusOrgAreaTypeId=" + (curMenuBusOrgAreaTypeId == "-1" ? "0" : curMenuBusOrgAreaTypeId) },
    { "name": "项目资料管理", displayName: "项目库", order: 3, "url": "/ProjectManage/ProjLandIndex?BusOrgAreaTypeId=" + curMenuBusOrgAreaTypeId },
    { "name": "专业库", displayName: "专业库", order: 4, "url": "/StandardResult/StandardResultLibrary?libId=1&BusOrgAreaTypeId="  +(curMenuBusOrgAreaTypeId == "-1" ? "0" : curMenuBusOrgAreaTypeId) },
    { "name": "变更分析", displayName: "变更分析", order: 5, "url": "/DesignChange/DesignChangeProjectIndex?BusOrgAreaTypeId="  +(curMenuBusOrgAreaTypeId == "-1" ? "0" : curMenuBusOrgAreaTypeId) },
    { "name": "工艺工法库", displayName: "工艺工法库", order: 6, "url": "/TecMethod/Index?libId=4" },
    { "name": "部品材料库", displayName: "部品材料库", order: 7, "url": "/Material/MaterialStorage" },
    { "name": "土地库", displayName: "土地库", order: 8, "url": "/LandManage/LandIndex" },
    { "name": "设计单位管理", displayName: "设计单位管理", order: 9, "url": "/Supplier/Designsupplier?BusOrgAreaTypeId=" +(curMenuBusOrgAreaTypeId == "-1" ? "0" : curMenuBusOrgAreaTypeId) },
    { "name": "设计师之家", displayName: "设计师之家", order: 10, "url": "/DesignerHome/QuestionIndex" },
    { "name": "系统设置", displayName: "系统设置", order: 11, "url": "/HumanResource/UserManage" }
    ];
MenuArr[1] = [
{ "name": "首页", "url": "/DesignManage/NewHome_XC" }
    ];
MenuArr[2] = [
    { "name": "地产产品系列聚合", displayName: "地产产品系列聚合", "url": "/ProductDevelop/ProductSeriesIndex?BusOrgAreaTypeId=0", "visible": IsBusOrgLandArea },
    { "name": "控股产品系列聚合", displayName: "控股产品系列聚合", "url": "/ProductDevelop/ProductSeriesIndex?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupArea },
    { "name": "地产产品系列管理", displayName: "地产产品系列管理", "url": "/ProductDevelop/ProductSeriesManage?isEdit=1&BusOrgAreaTypeId=0", "visible": IsBusOrgLandAreaEdit },
    { "name": "控股产品系列管理", displayName: "控股产品系列管理", "url": "/ProductDevelop/ProductSeriesManage?isEdit=1&BusOrgAreaTypeId=1", "visible": IsBusOrgGroupAreaEdit }
             ];

MenuArr[3] = [
{ "name": "项目聚合", displayName: "项目聚合", "url": "/ProjectManage/ProjLandIndex?BusOrgAreaTypeId=-1", "visible": IsAllControlArea },
{ "name": "地产项目聚合", displayName: "地产项目聚合", "url": "/ProjectManage/ProjLandIndex?BusOrgAreaTypeId=0","visible": IsBusOrgLandArea },
{ "name": "控股项目聚合", displayName: "控股项目聚合", "url": "/ProjectManage/ProjLandIndex?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupArea },
{ "name": "地产项目管理", displayName: "地产项目管理", "url": "/ProjectManage/ProjLandIndex?isEdit=1&BusOrgAreaTypeId=0", "visible": IsBusOrgLandAreaEdit },
{ "name": "控股项目管理", displayName: "控股项目管理", "url": "/ProjectManage/ProjLandIndex?isEdit=1&BusOrgAreaTypeId=1", "visible": IsBusOrgGroupAreaEdit }

    ];
MenuArr[4] = [
{ "name": "地产专业聚合", displayName: "地产专业聚合", "url": "/StandardResult/StandardResultLibrary?BusOrgAreaTypeId=0", "visible": IsBusOrgLandArea },
{ "name": "控股专业聚合", displayName: "控股专业聚合", "url": "/StandardResult/StandardResultLibrary?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupArea },
{ "name": "地产专业管理", displayName: "地产专业管理", "url": "/StandardResult/StandardResultManage?BusOrgAreaTypeId=0", "visible": IsBusOrgLandAreaEdit },
{ "name": "控股专业管理", displayName: "控股专业管理", "url": "/StandardResult/StandardResultManage?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupAreaEdit }
   ];
MenuArr[5] = [

  { "name": "地产设计变更聚合", displayName: "地产设计变更聚合", "url": "/DesignChange/DesignChangeProjectIndex?BusOrgAreaTypeId=0", "visible": IsBusOrgLandArea },
  { "name": "控股设计变更聚合", displayName: "控股设计变更聚合", "url": "/DesignChange/DesignChangeProjectIndex?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupArea},
    { "name": "地产设计变更对比", displayName: "地产设计变更对比", "url": "/DesignChange/DesignChangeContrast?BusOrgAreaTypeId=0", "visible": IsBusOrgLandAreaEdit },
    { "name": "控股设计变更对比", displayName: "控股设计变更对比", "url": "/DesignChange/DesignChangeContrast?BusOrgAreaTypeId=1", "visible": IsBusOrgGroupAreaEdit }
      
 ];
MenuArr[6] = [
{ "name": "工艺工法库展示", "url": "/TecMethod/Index?libId=4" },
{ "name": "工艺工法库管理", "url": "/TecMethod/Index/?isEdit=1&libId=4" }
    ];
MenuArr[7] = [
{ "name": "材料库", "url": "/Material/MaterialStorage" },
{ "name": "苗木库", "url": "/Material/MaterialSeedlings" },
{ "name": "材料库管理", "url": "/Material/MaterialStorage?isEdit=1" },
{ "name": "苗木库管理", "url": "/Material/MaterialSeedlings?isEdit=1" }
];

MenuArr[8] = [
{ "name": "土地展示", "url": "/LandManage/LandIndex" },
{ "name": "土地管理", "url": "/LandManage/LandIndex?isEdit=1" }
    ];

MenuArr[9] = [
{ "name": "地产设计单位管理", displayName: "地产设计单位管理", "url": "/Supplier/Designsupplier?BusOrgAreaTypeId=0" },
{ "name": "控股设计单位管理", displayName: "控股设计单位管理", "url": "/Supplier/Designsupplier?BusOrgAreaTypeId=1" }

   ];

MenuArr[10] = [
{ "name": "设计师园地", displayName: "设计师园地", "url": "/DesignerHome/QuestionIndex" },
{ "name": "专题研究与案例库",displayName: "专题研究与案例库","url":"/DesignerHome/MSCategoryIndex"}
    ];
MenuArr[11] = [
{ "name": "用户管理", "url": "/HumanResource/UserManage" },
{ "name": "部门岗位", "url": "/HumanResource/OrgManage" },
{ "name": "通用岗位", "url": "/HumanResource/ComPostManage" },
{ "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage" },
{ "name": "首页管理", "url": "/PersonelWorkCenter/HomeIndexManage" },
{ "name": "项目资料目录模板", "url": "/DesignManage/CorpExperience" },
{ "name": "待删除项目资料", "url": "/ProjectManage/ProjDocumentPreDelete" },
{ "name": "评价类型", "url": "/Supplier/SupplierEvaluatItem" },
{ "name": "项目资料上传统计", "url": "/ProjectManage/ProjDocumentIndex" },
{ "name": "主数据项目对照", "url": "/ProjectManage/ProjMDLandIndex" }

    ];
// 以上JSON数据中的最后一个请勿添加 “，”逗号会导致IE7 8中解析不出/////////////////////////////////

var hasRightMenuCode = typeof ArrMenuRight != "undefined";
if (hasRightMenuCode && ArrMenuRight[3][1] == true) {
    MenuArr[0][2].url = "/ProjectManage/ProjLandIndex?BusOrgAreaTypeId=" + curMenuBusOrgAreaTypeId;
}
function SetUpMenu(index) {
    //MenuArr[0][index - 1].visible = true;
    var nameArr = "", html = "", hasMenuRight = false, item = null, ligroup = [], newIndex = 0;
    for (var x = 0; x < MenuArr[0].length; x++) {
        item = MenuArr[0][x];
        if (typeof item == "undefined") continue;
        hasMenuRight = hasRightMenuCode == true ? (ArrMenuRight[0][x] == true) : true;
        if (typeof item.displayName == "string") {
            nameArr = item.displayName;
        } else {
            nameArr = item.name.split(",")[0];
        }
       
        if (item.url != "" && hasMenuRight == true) {
            html = "<li><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
        } else {
            html = "<li style='display:none;'><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
        }
        ligroup.push({ html: html, newOrder: (typeof item.order === "number") ? parseInt(item.order) : 0, oldOrder: x });
    }
    ligroup = ligroup.sort(function (x, y) {
        return x.newOrder - y.newOrder;
    });
    html = "";
    for (x = 0, html = ""; x < ligroup.length; x++) {
        item = ligroup[x];
        html += item.html;
        if (item.oldOrder == (index - 1)) {
            newIndex = x;
        }
    }
    $(".nav_lev1").html(html);
    $(".nav_lev1").find("li:eq(" + newIndex + ")").addClass("this");
}

function SetMenu(index, cindex) {

    if (typeof (BusOrgAreaTypeId) != "undefined") {
        if (BusOrgAreaTypeId != -1) {
            if (BusOrgAreaTypeId == 0) {
                cindex = "地产" + cindex;
            } else {
                cindex = "控股" + cindex;
            }
        }

    }

    var nameArr = "", html = "", hasMenuRight = false, item = null, ligroup = [], newIndex;
    if (isNaN(index)) {
        index = findIndex(index);
        if (index == false) index = 0;
    }
    if (isNaN(cindex)) {
        cindex = findCIndex(cindex, index);
        if (cindex == false) cindex = 0;
    }

    SetUpMenu(index);
    if (MenuArr[index]) {
        for (var x = 0; x < MenuArr[index].length; x++) {
            item = MenuArr[index][x];

            if (typeof item == "undefined") continue;
            if (typeof item.displayName == "string") {
                nameArr = item.displayName;
            } else {
                nameArr = item.name.split(",")[0];
            }
            var hasMenuRight = hasRightMenuCode == true ? (ArrMenuRight[index][x] == true) : true;

            if (item.visible == "False") {
                continue;
            }

            if (item.url != "" && hasMenuRight == true) {
                html = "<li><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
            } else {
                html = "<li style='display:none;'><a hidefocus='true' href='" + item.url + "'>" + nameArr + "</a></li>";
            }
            ligroup.push({ html: html, newOrder: (typeof item.order === "number") ? parseInt(item.order) : 0, oldOrder: x });
        }
        ligroup = ligroup.sort(function (x, y) {
            return x.newOrder - y.newOrder;
        });
        html = "";
        for (x = 0, html = ""; x < ligroup.length; x++) {
            item = ligroup[x];
            html += item.html;
            if (item.oldOrder == (cindex - 1)) {
                newIndex = x;
            }
        }
        $(".nav_lev2").html(html);
    }
    if (cindex) { cindex--; $(".nav_lev2").find("li:eq(" + newIndex + ")").addClass("this"); }
}



function findCIndex(str, index) {
    if (MenuArr[index]) {
        for (var x = 0; x < MenuArr[index].length; x++) {
            if (MenuArr[index][x].name == str) {
                return x + 1;
            }
        }
        return false;
    } else { return false; }
}


function findIndex(str) {
    for (var x = 0; x < MenuArr[0].length; x++) {
        var nameArr = MenuArr[0][x].name.split(",");
        if (MenuArr[0][x].name.indexOf(str) != -1) {
            if (MenuArr[0][x].name == str) {
                // MenuArr[0][x].visible = true;
                return x + 1;

            } else {
                for (var y = 0; y < nameArr.length; y++) {
                    if (nameArr[y] == str) {
                        //MenuArr[0][x].name = str;
                        // MenuArr[0][x].visible = true;
                        return x + 1;
                    }
                }
                return false;
            }
        }
    }
}