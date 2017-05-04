/*
//新菜单
//
*/
firstMenus = {
    "5": { "name": "部品材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW", "visible": false, "isShow": true, "order": "5" },
    "2": { "name": "项目库", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "visible": false, "isShow": true, "order": "1" },
    "3": { "name": "系统设置", "url": "/HumanResource/UserManage", "code": "SYSTEMSETTING_VIEW", "visible": false, "isShow": true, "order": "9" }
}

/*
//第一个key值代表属于哪个一级菜单
*/
secondMenus = {
    "5": {
        "3": { "name": "初级材料库", "url": "/PublicMaterial/MaterialStorage", "code": "MATFIRST_VIEW", "isShow": true },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/StaMaterialStorage", "code": "MATSTANDARD_VIEW", "isShow": false },
        "4": { "name": "标准材料库", "url": "/PublicMaterial/LimitMaterialStorage", "code": "MATLIMIT_VIEW", "isShow": true },
        "8": { "name": "材料对比分析", "url": "/PublicMaterial/MaterialCompareIndex", "code": "MATCA_VIEW", "isShow": true },
        "9": { "name": "类目管理", "url": "/PublicMaterial/CatatorySetting", "code": "MATERIALCAT_MANAGE", "isShow": true },
        "10": { "name": "基类管理", "url": "/PublicMaterial/BaseCatSetting", "code": "MATERIALBASE_MANAGE", "isShow": true },
        "11": { "name": "品牌管理", "url": "/PublicMaterial/MaterialBrand", "code": "MATERIALBRAND_VIEW", "isShow": true },
        "12": { "name": "供应商管理", "url": "/PublicMaterial/MatSupplierIndex", "code": "MATERIALPRO_VIEW", "isShow": true },
        "13": { "name": "厂商管理", "url": "/PublicMaterial/MaterialFacturer", "code": "MATFACTURER_VIEW", "isShow": true }
    },
    "2": {
        "1": { "name": "项目库管理", "url": "/DesignManage/LandIndex", "code": "PROJECTLIB_VIEW", "isShow": true }
    },
    "3": {
        "1": { "name": "用户管理", "url": "/HumanResource/UserManage", "code": "USERMANAGE_MANAGE", "isShow": true },
        "2": { "name": "部门岗位管理", "url": "/HumanResource/OrgManage", "code": "ORGMANAGE_MANAGE", "isShow": true },
        "3": { "name": "通用岗位管理", "url": "/HumanResource/ComPostManage", "code": "GENERALPOSITION_MANAGE", "isShow": true },
        "4": { "name": "角色权限", "url": "/SystemSettings/SystemSettingsPage", "code": "ROLERIGHT_MANAGE", "isShow": true },
        "5": { "name": "产品类型设置", "url": "/InformationBank/PropertyManage", "code": "PROERTYMANAGE_MANAGE", "isShow": true },
        "6": { "name": "地块区域设置", "url": "/DesignManage/LandAreaCityManage", "code": "AREACITYMANAGE_MANAGE", "isShow": true },
        "7": { "name": "价值树设置", "url": "/DesignManage/ValueTreeManage", "code": "VALUETREE_MANAGE", "isShow": true },
        "8": { "name": "专业设置", "url": "/DesignManage/SysProfessionalManage", "code": "PROFESSIONALMANAGE_MANAGE", "isShow": true },
        "9": { "name": "流程设置", "url": "/WorkFlowManage/WorkFlowManage", "code": "WORKFLOW_MANAGE", "isShow": true }
    }
}

//var hasRightMenuCode =typeof menuCodes != "undefined", codeObjs; //是否有判断权限的menuCode
var hasRightMenuCode = true,  codeObjs; //是否有判断权限的menuCode
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
var FirstMenuOrder = [2, 5, 3];

//展示一级目录
function showFirstMenu() {
    var _hasSysRight_SS = false; //用来标识用户是否有系统的访问权限
    if (typeof(curIsPlugIn)=="undefined"||curIsPlugIn == "True") {
        _hasSysRight_SS = true;
        hasRightMenuCode = true;
    }
    var html = ""; 
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
    return _hasSysRight_SS;
}

function SetMenu(first, second) {
    var _hasSysRight_SS = showFirstMenu();
    if (!_hasSysRight_SS) {
       window.location.href = "/PublicMatRightPage.html";
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
    if (typeof (curIsPlugIn) == "undefined" || curIsPlugIn == "True") {
        return true;
    }
    var codes = menuItem.code.split(",");
   if (codes.length == 1 && codes[0]=="") { return true; }
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
; (function ($, window, document, undefined) {
    //图片轮播
    $.fn.picCarousel = function (options) {
        return this.each(function () { //this调用当前插件的对象
            var defaults = {
                time:"5", //轮播时间
                limitNum: "4" //超过几张就进行轮播
            }
            var opts = $.extend(defaults,options);

            var $boxDiv = $(this);
            var scrollTimer;
            var $picCon = $boxDiv.find("ul");

//            if ($picCon.children().length > opts.limitNum*1) {
//                $picCon.children().clone().appendTo($picCon);
//            }
            $boxDiv.find("ul").css("width", $boxDiv.find("ul").children().length * ($boxDiv.find("ul").children(":first").width() + 10))
            
            function scroller(obj) {
                var $self = obj.find("ul");
                var lineLeft = $self.find(":first").children().width();
                if ($self.children().length > opts.limitNum*1) {
                    for (var i = 0; i < opts.limitNum*1; i++) {
                        $self.stop().animate({ "marginLeft": -$self.children(":first").width() + "px" }, 100*opts.time, function () {
                            $self.css({ "marginLeft": 0 + "px" }).find("li:first").appendTo($self)
                        });
                    }
                }
            }
            
            function forward(obj) {
                var $self = obj.find("ul");
                var lineLeft = $self.find(":first").children().width();
                if ($self.children().length > opts.limitNum*1) {
                    $self.css({ "marginLeft": -$self.children(":first").width() + "px" })
                        .find("li:last").prependTo($self);
                    $self.stop().animate({ "marginLeft": 0 + "px" }, 500);
                }
            }

            $boxDiv.hover(
              function () {
                  clearInterval(scrollTimer);
                  //左移
                  if ($boxDiv.find("ul").children().length>opts.limitNum*1) {
                      $boxDiv.find(".lbtn").fadeIn();
                      $boxDiv.find(".rbtn").fadeIn();
                  }
                  $boxDiv.find(".lbtn").unbind("click");
                  $boxDiv.find(".lbtn").on("click", function () {
                      scroller($boxDiv);
                  })
                  //右移
                  $boxDiv.find(".rbtn").unbind("click");
                  $boxDiv.find(".rbtn").on("click", function () {
                      forward($boxDiv);
                  })
              }, function () {
                  $boxDiv.find(".lbtn").fadeOut();
                  $boxDiv.find(".rbtn").fadeOut();
                  scrollTimer = setInterval(function () {
                      scroller($boxDiv);
                  }, opts.time*1000)
              }
            ).trigger("mouseleave");
        })
    }
})(jQuery);