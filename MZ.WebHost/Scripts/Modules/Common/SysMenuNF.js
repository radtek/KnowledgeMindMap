//临时，菜单配置项
var MenuArr = new Array();

MenuArr[0] = [
{ "name": "首页", displayName: "首页", order: 1, "url": "/PersonelWorkCenter/HomeIndex" },
    { "name": "项目资料管理", displayName: "项目库", order: 2, "url": "/ProjectManage/ProjLandIndex" },
    { "name": "系统设置", displayName: "系统设置", order: 3, "url": "/HumanResource/UserManage" }
    ];
MenuArr[2] = [
{ "name": "项目聚合", "url": "/ProjectManage/ProjLandIndex" },
{ "name": "项目管理", "url": "/ProjectManage/ProjLandIndex?isEdit=1" }
    ];
MenuArr[3] = [
{ "name": "用户管理", "url": "/HumanResource/UserManage" },
{ "name": "部门管理", "url": "/HumanResource/OrgManage" },
//{ "name": "通用岗位", "url": "/HumanResource/ComPostManage" },
{ "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage" },
{ "name": "项目资料目录模板", "url": "/DesignManage/CorpExperience" },
{ "name": "待删除项目资料", "url": "/ProjectManage/ProjDocumentPreDelete" },
{ "name": "项目资料上传统计", "url": "/ProjectManage/ProjDocumentIndex" }
    ];

var hasRightMenuCode = typeof ArrMenuRight != "undefined";
//if (hasRightMenuCode && ArrMenuRight[3][1] == true) {
//    MenuArr[0][2].url = "/ProjectManage/ProjLandIndex?isEdit=1";
//}
function SetUpMenu(index) {
    //MenuArr[0][index - 1].visible = true;
    var nameArr = "", html = "", hasMenuRight = false, item = null, ligroup = [], newIndex = 0;
    for (var x = 0; x < MenuArr[0].length; x++) {
        item = MenuArr[0][x];
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
    var nameArr = "", html = "", hasMenuRight = false, item = null,ligroup=[],newIndex;
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
            if (typeof item.displayName == "string") {
                nameArr = item.displayName;
            } else {
                nameArr = item.name.split(",")[0];
            }
            var hasMenuRight = hasRightMenuCode == true ? (ArrMenuRight[index][x] == true) : true;
            
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