/*百度地图支持包*/
//document.write("<script src='http://api.map.baidu.com/getscript?v=2.0&ak=v4ryKM9FjT361YkVCXL59Wy7&services=&t=20150707171040'></script>");
//document.write("<script src='http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js'></script>");
//document.write("<script src='http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js'></script>");
//document.write("<script src='http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js'></script>");

/**
* Baidu地图
*/
(function ($) {
    $.fn.baidumap = function (options) {
        var opts = $.extend({}, $.fn.baidumap.defaults, options);
        $.fn.baidumap.options = opts;
        var map = new BMap.Map(this.attr("id"), {
            minZoom: 5
        });
        var point = new BMap.Point(opts.x, opts.y); // 创建中心点坐标
        map.centerAndZoom(point, opts.zoom);        // 初始化地图，设置中心点坐标和地图级别
        if (opts.enableScrollWheelZoom) {
            map.enableScrollWheelZoom();
        }
        if (opts.enableNavigationControl) {
            map.addControl(new BMap.NavigationControl());
        }
        if (opts.enableOverviewMapControl) {
            map.addControl(new BMap.OverviewMapControl());
        }
        if (opts.enableScaleControl) {
            map.addControl(new BMap.ScaleControl());
        }
        if (opts.enableMapTypeControl) {
            map.addControl(new BMap.MapTypeControl());
        }
        if (opts.enableCopyrightControl) {
            var cr = new BMap.CopyrightControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT
            });
            map.addControl(cr);
            var bs = map.getBounds();
            cr.addCopyright({
                id: 1,
                content: opts.copyrightContent,
                bounds: bs
            });
        }
        $.fn.baidumap.map = map;
        return $.fn.baidumap;
    };
    /*
    * 默认参数设置
    */
    $.fn.baidumap.defaults = {
        x: 108.79643, // 中心点 x坐标
        y: 34.261848, // 中心点y坐标
        zoom: 5, // 缩放级别
        enableScrollWheelZoom: true,       // 启用鼠标滚轮缩放
        enableNavigationControl: true,     // 启用平移缩放控件
        enableOverviewMapControl: false,   // 启用缩略地图控件
        enableScaleControl: true,          // 比例尺控件
        enableMapTypeControl: false        // 切换地图类型的控件
    };
    /*
    * 创建窗口
    */
    $.fn.baidumap.createInfoWindow = function (content) {
        return new BMap.InfoWindow(content);
    };
    /*
    * 海量点  点集合 点样式 点单击事件;
    */
    $.fn.baidumap.loadseaPoint = function (pointList, fn, options) {
        var defaults = { //海量点参数
            //size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_WATERDROP //BMAP_POINT_SHAPE_STAR,BMAP_POINT_SHAPE_SQUARE,
            //color: '#d340c3'
        }
        var opts = $.extend(defaults, options);

        var pointCollection = new BMap.PointCollection(pointList, opts); //初始化点
        if (fn !== undefined) {
            pointCollection.addEventListener('click', function (e) {
                fn(e.point);
            });
        }

        return pointCollection;
    }

    /*
    * 加载弹窗
    */
    $.fn.baidumap.createInfoWindow = function (content, options) {
        return new BMap.InfoWindow(content, options);
    };
    /*
    * 画多边形
    */
    $.fn.baidumap.drawPolygon = function (bmap, callback, overlay) {
        var points = [], polyline, startPoint;

        var drawPolyline = function (e, overlay) {
            var newPoint = new BMap.Point(e.point.lng, e.point.lat);
            if (!points.length) {
                map.clearOverlays(overlay);
                startPoint = new BMap.Marker(newPoint);
                startPoint.addEventListener('click', endDrawPolyline);

                polyline = new BMap.Polyline([
                newPoint
            ], { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 0.5 });

                map.addOverlay(startPoint);
                map.addOverlay(polyline);
            };
            points.push(newPoint);
            polyline.setPath(points);
        }

        var endDrawPolyline = function (e) {
            map.removeEventListener('click', drawPolyline);
            map.removeOverlay(startPoint);
            map.removeOverlay(polyline);

            var polygon = new BMap.Polygon(points, { strokeColor: "blue", strokeWeight: 1, strokeOpacity: 0.5 });
            map.addOverlay(polygon);
            callback(polygon, points);

            if ($(".BMapLib_Drawing_panel").length > 0) {
                drawingManager.close();
            }
        }
        map.addEventListener('click', drawPolyline);
    }
    /*
    * 实例化 画图工具
    */
    $.fn.baidumap.drawingManager = function (map, options) {
        var defaults = {
            isOpen: false,            // 是否开启绘制模式
            enableDrawingTool: true,  // 是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
                offset: new BMap.Size(15, 15), // 偏离值
                scale: 0.8, //工具栏缩放比例
                drawingModes: [
                        BMAP_DRAWING_MARKER,     // 标记工具
                        BMAP_DRAWING_CIRCLE,     // 画圆工具
                        BMAP_DRAWING_POLYGON,    // 多边形工具
                        BMAP_DRAWING_RECTANGLE,  // 矩形工具
                        BMAP_DRAWING_POLYLINE    // 折线工具
                    ]
            },
            circleOptions: {
                strokeColor: "blue",
                strokeWeight: 1,
                strokeOpacity: 0.5
            },
            rectangleOptions: {
                strokeColor: "blue",
                strokeWeight: 1,
                strokeOpacity: 0.5
            }
        }
        var map = map || $.fn.baidumap.map;
        var opts = $.extend(defaults, options);
        var dm = new BMapLib.DrawingManager(map, opts);

        return dm;
    }
    /*
    * 定位到城市
    * @param map 地图对象 city 城市名 ，zoom 缩放级别
    */
    $.fn.baidumap.cityLocation = function (city, map, zoom) {
        //var baiduGeo = new BMap.Geocoder(); //地址解析器
        var zoom = zoom || 12;
        var map = map || $.fn.baidumap.map;

        map.centerAndZoom(city, zoom);
        // baiduGeo.getPoint(city, function (point) {
        //     if (point) {
        //         map.centerAndZoom(city, zoom);
        //     } else {
        //         alert('城市"' + city + '"位置没找到');
        //     }
        // });
    }
    /*
    * 显示行政区轮廓
    * @param org 行政区 options 覆盖物参数列表
    */
    $.fn.baidumap.getBoundary = function (org, options) {
        var defaults = {
            strokeWeight: 1,
            strokeColor: "#ff5500",
            zoomFactor:0 //调整视野后的地图层级
        }
        var opts = $.extend(defaults, options);
        var bdary = new BMap.Boundary();
        var map = map || $.fn.baidumap.map;
        bdary.get(org, function (rs) {       //获取行政区域       
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取"' + org + '"行政区域');
                return;
            }
            var pointArray = [];
            var fillColor = "transparent";
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], opts); //建立多边形覆盖物
                map.addOverlay(ply);         //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            map.setViewport(pointArray, { zoomFactor: opts.zoomFactor });     //调整视野                 
        });
    }
    /**
    * 定位到指定坐标
    * 
    * @param x纬度  y 经度 zoom 缩放级别
    */
    $.fn.baidumap.panTo = function (x, y, zoom) {
        var map = $.fn.baidumap.map;
        map.clearOverlays();
        if (parseInt(x) == 0) {
            return;
        }
        if (x != "") {
            var temp_point = new BMap.Point(x, y);
            map.centerAndZoom(temp_point, parseInt(zoom));
        }
    };
    /**
    * 新建一个图形标记
    * 
    * @param options
    *  标记的属性 exp.{point:位置 BMap.Point值,icon: 图标BMap.Icon值,
    *  label:图标的文本说明}
    * 
    * @returns BMap.Marker
    */
    $.fn.baidumap.createMarker = function (options) {
        var marker = new BMap.Marker(options.point);
        if (options.icon) {
            marker.setIcon(options.icon);
        }
        if (options.label) {
            marker.setLabel(options.label);
        }
        var map = options.map || $.fn.baidumap.map;
        if (options.point.lng > 0)
            map.addOverlay(marker);
        return marker;
    };
    $.fn.baidumap.getPointByCity = function (city) {
        var baiduGeo = new BMap.Geocoder(); //地址解析器
        var ary = [];
        baiduGeo.getPoint($.trim(city), function (point) {
            if (point) {
                ary.push(point);
            } else {
                alert('城市"' + city + '"位置没找到');
            }
        });
        return ary[0];
    }
})(jQuery);