//模拟数据
var citySite = [
        { lng: "121.36853", lat: "31.414921", id: "60001", name: "正荣国领", address: "上海市宝山区抚远路1211弄" },
        { lng: "121.28576", lat: "31.164213", id: "60002", name: "虹桥正荣府", address: "上海市联民路100弄（虹桥▪正荣府展示中心）" },
        { lng: "121.323057", lat: "31.208046", id: "60003", name: "虹桥正荣中心", address: "上海虹桥商务核心区申虹路666弄8号楼（金扬虹路）" },
        { lng: "121.325276", lat: "30.751524", id: "60004", name: "正荣御首府", address: "上海市 金山区 龙轩路1998弄" },
        { lng: "121.023203", lat: "30.903208", id: "60005", name: "正荣璟圆", address: "上海市枫泾镇泾波路与枫湾路交叉口" }
];
function CommonModuleParam(moduleType, regionId, level) {
    var regionName = "";
    if (regionId != "") {
        $.each(citySite, function (idx, obj) {
            if (obj.id == regionId) {
                regionName = obj.name;
                return false;
            }
        });
    }
    var formData = "mtype=" + moduleType + "&landId=" + regionId + "&landName=" + escape(regionName) + "&level=" + level;
    return formData;
}

//选择户型
function CDHouse(regionId, houseId, area, fangxing) {
    var formData = CommonModuleParam("2", regionId, 2);
    formData += "&Module_2_Id=2&Ret_2_Name=" + escape(area + fangxing) + "&Ret_2_Val=" + houseId;
    $.ajax({
        url: "/ProductCustomized/SaveCustomized",
        type: 'post',
        data: formData,
        dataType: 'json',
        error: function () {
            //$.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
        }
    });
}

//选择房间
function CDRoom(regionId, houseId, area, fangxing, ronmId, room) {
    var formData = CommonModuleParam("2", regionId, 2);
    formData += "&Module_2_Id=2&Ret_2_Name=" + escape(area + fangxing) + "&Ret_2_Val=" + houseId;
    formData += "&Module_3_Id=3&Ret_3_Name=" + escape(area + fangxing) + "&Ret_3_Val=" + houseId;
    $.ajax({
        url: "/ProductCustomized/SaveCustomized",
        type: 'post',
        data: formData,
        dataType: 'json',
        error: function () {
            //$.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
        }
    });
}

//定制房间
function CDRoomModule() {
    var regionId = $("#regionId").val();
    var houseId = $("#houseId").val();
    var houseName = $("#houseName").val();
    var roomId = $("#roomId").val();
    var roomName = $("#roomName").val();
    var level = $("#level").val();
    var moduleId = $("#moduleId").val();
    var retId = $("#retId").val();
    var retName = $("#retName").val();
    var formData = CommonModuleParam("3", regionId, level);
    formData += "&Module_2_Id=2&Ret_2_Name=" + escape(houseName) + "&Ret_2_Val=" + houseId;
    formData += "&Module_3_Id=3&Ret_3_Name=" + escape(roomName) + "&Ret_3_Val=" + roomId;
    formData += "&Module_4_Id=" + moduleId + "&Ret_4_Name=" + escape(retName) + "&Ret_4_Val=" + retId;

    $.ajax({
        url: "/ProductCustomized/SaveCustomized",
        type: 'post',
        data: formData,
        dataType: 'json',
        error: function () {
            //$.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
        }
    });
}

//定制景观
function CDScenery() {
    var regionId = $("#regionId").val();
    var secModuleId = $("#secModuleId").val();
    var secModuleName = $("#secModuleName").val();
    var threeModuleId = $("#threeModuleId").val();
    var threeModuleName = $("#threeModuleName").val();
    var level = $("#level").val();
    var retId = $("#retId").val();
    var retName = $("#retName").val();
    var formData = CommonModuleParam("4", regionId, level);
    formData += "&Module_2_Id=" + secModuleId + "&Ret_2_Name=" + escape(secModuleName) + "&Ret_2_Val=" + secModuleId;
    formData += "&Module_3_Id=" + threeModuleId + "&Ret_3_Name=" + escape(threeModuleName) + "&Ret_3_Val=" + retId;
    $.ajax({
        url: "/ProductCustomized/SaveCustomized",
        type: 'post',
        data: formData,
        dataType: 'json',
        error: function () {
            //$.tmsg("m_jfw", "未知错误，请联系服务器管理员，或者刷新页面重试", { infotype: 2 });
        },
        success: function (data) {
        }
    });
}