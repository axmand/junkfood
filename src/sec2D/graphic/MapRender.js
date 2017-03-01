/**
*   MapRender模块，绘制geometry基础类
*   @class Hmap.Graphic.MapRender
*/

define(['Render', 'Hobject', 'Symbol'], function (Render, Hobject, Symbol) {
    //渲染引擎对象导入
    var Polygon = Render.Polygon,          //多边形
        Heat = Render.Heat,                      //热力图
        Line = Render.Line,                        //线
        Circle = Render.Circle,                    //点（或者symbol符号）
        Star=Render.Star,                           //星星（默认五角星）
        //
        each = Hobject.BaseFunc.each,
        //
        mLineSymbol = Symbol.defaultLineSymbol,
        mPolygonSymbol = Symbol.defaultPolygonSymbol,
        mPointSymbol = Symbol.defaultPointSymbol;
    //地理坐标转屏幕坐标
    var screenPosition = null;
    /**
    *   渲染器，渲染Geometry
    *   @class Render
    *   @param args
    *   {
    *       stage:         //绘图
    *       layer:
    *       mapInfo:  //地理坐标转屏幕坐标输入loglat{log: ,lat:}
    *   }
    */
    var _render = function (args) {
        var _args = args || {};
        this.mapInfo = _args.mapInfo;
        screenPosition = screenPosition || this.mapInfo.screenPosition;
    }

    _render.prototype.renderGeometry = function (layerElement, features, callback, context) {
        var layer = layerElement.layer,
            level = layerElement.level,
            len = features.length,
            drawElements = [],
            i = 0;
        //绘制完一个feauture执行回调
        var cbk = function (element, cfeature) {
            element.once('mouseenter', function (evt) {
                if (!!context.args) {
                    if (!!cfeature.mouseenter & !context.args.mapInfo.dragging & !cfeature.isEnter) {
                        cfeature._evt = evt;
                        cfeature.mouseenter(evt, cfeature);
                        cfeature.isEnter = true;
                    }
                }
            });
            element.once('mouseleave', function (evt) {
                if (!!context.args) {
                    if (cfeature.isEnter) {
                        cfeature._evt = evt;
                        cfeature.isEnter = false;
                        !!cfeature.mouseleave ? cfeature.mouseleave(evt, cfeature) : null;
                    }
                    else {
                        cfeature._evt = evt;
                        !!cfeature.mouseleave & !context.args.mapInfo.dragging ? cfeature.mouseleave(evt, cfeature) : null;
                    }
                }
            });
            element.once('click', function (evt) {
                cfeature._evt = evt;
                !!cfeature.click ? cfeature.click(evt, cfeature) : null;
            });
            switch (cfeature.getType()) {
                case 'Feature':
                    //如果geoElemets存在，则添加，不存在则创建
                    if (!geometry.geoElements[level]) {
                        geometry.geoElements[level] = [];
                    }
                    geometry.geoElements[level].push(element);
                    break;
                case 'GeoElement':
                    geometry.geoElements[level] = element;
                    break;
                default:
                    break;
            }
            drawElements.push(element);
        };
        //
        for (; i < len; i++) {
            var feature = features[i], geometry = feature.geometry || feature, drawType = geometry.getType(), featureType = feature.getType();
            //构造绘制参数
            var args = {
                layer: layer,
                points: geometry.drawCoordinates,
                callback: cbk,
                feature: feature,
                context: context,
                left: featureType === 'Feature' ? layer.attrs.y + this.mapInfo.domXY.x : null,
                top: featureType === 'Feature' ? layer.attrs.x + this.mapInfo.domXY.y : null,
            };
            switch (drawType) {
                case 'GeoPolygon':
                    this.renderPolygon(args);
                    break;
                case 'GeoPoint':
                    this.renderPoint(args);
                    break;
                case 'GeoLineString':
                    this.renderPolyline(args);
                    break;
                case 'GeoMultiPolygon':
                    this.renderPolygon(args);
                    break;
                default:
                    break;
            }
            //canvasLayer,记录与feature关联的layer
            if (featureType === 'Feature') {
                if (!!feature.canvasLayers) {
                    if (!feature.canvasLayers[level]) {
                        feature.canvasLayers[level] = {};
                    }
                    feature.canvasLayers[level][layer.attrs.id] = layer;
                }
            }
        }
        layer.draw();
        //绘制完毕后回调，通知feturelayer绘制完毕
        !!callback ? callback(features, layerElement, context, drawElements) : null;
    }

    _render.prototype.renderPoint = function (args) {
        var points = args.points,
            layer = args.layer,
            callback = args.callback,
            feature = args.feature,
            context = args.context,
            left = args.left,
            top = args.top,
            config = (feature.applySymbol || mPointSymbol).toConfig();
        var len = points.length, i, j;
        for (i = 0; i < len; i++) {
            var log = points[i][0], lat = points[i][1];
            var sxy = screenPosition({ log: log, lat: lat });
            var point = [sxy.x-left, sxy.y-top];
            //绘制圆形
            config.x = point[0];
            config.y = point[1];
            var circle = new Circle(config);
            layer.add(circle);
            !!callback ? callback(circle, feature) : null;
        }
    }

    _render.prototype.renderPolygon = function (args) {
        var points = args.points,
            layer = args.layer,
            callback = args.callback,
            feature = args.feature,
            context = args.context,
            left = args.left,
            top = args.top,
            config = (feature.applySymbol || mPolygonSymbol).toConfig();//symbol
        var len = points.length, i, j;
        for (i = 0; i < len; i++) {
            //经纬度转换为屏幕点
            var polygonPoints = [];
            var len2 = points[i].length;
            for (j = 0; j < len2; j++) {
                var log = points[i][j][0], lat = points[i][j][1];
                var sxy = screenPosition({ log: log, lat: lat }),
                point = [sxy.x-left, sxy.y-top];
                polygonPoints.push(point);
            }
            //为config添加点集合属性
            config.points = polygonPoints;
            //创建polygon
            var polygon = new Polygon(config);
            layer.add(polygon);
            !!callback ? callback(polygon, feature) : null;
        }
    }

    _render.prototype.renderPolyline = function (args) {
        var points = args.points,
            layer = args.layer,
            callback = args.callback,
            feature = args.feature,
            context = args.context,
            left = args.left,
            top = args.top,
            polylinePoints = [],
            len2,
            config = (feature.applySymbol || mLineSymbol).toConfig();
        var len = points.length, i, j;
        for (i = 0; i < len; i++) {
            len2 = points[i].length;
            for (var j = 0; j < len2; j++) {
                var log = points[i][j][0], lat = points[i][j][1];
                var sxy = screenPosition({ log: log, lat: lat });
                polylinePoints.push([sxy.x - left, sxy.y-top]);
            }
            config.points = polylinePoints;
            var polyline = new Line(config);
            layer.add(polyline);
            !!callback ? callback(polyline, feature) : null;
        }
    }

    /**
    *   渲染marker
    *   @method renderMarker
    *   @param layer {LayerElement} 
    *   {
    *       layer:
    *       level:
    *   }
    *   @param marker {Marker}
    */
    _render.prototype.renderMarkers = function (layerElement, markers) {
        var layer = layerElement.layer,
            level = layerElement.level,
            i, len = markers.length, marker;
        //
        for (i = 0; i < len; i++) {
            marker = markers[i];
            var markerStyle = marker.markerStyle;
            switch (markerStyle) {
                case 0://文字标记
                    break;
                case 1://文字和图形混合标记
                    break;
                case 2://图像标记
                    break;
                case 3://图形标记Star
                    this._renderStar(layer, marker.position, null, marker, this);
                    break;
                default:
                    break;
            }
        }
        //
        layer.draw();
    }

    _render.prototype._renderStar = function (layer, position, callback, marker, context) {
        var top = layer.attrs.x||0,
            left = layer.attrs.y||0,
            config = mPointSymbol.toConfig(),
            sxy = screenPosition({ log: position[0], lat: position[1] });
        //绘制Star
        config.x = sxy.x;
        config.y = sxy.y;
        config.numPoints = 5;
        config.innerRadius = 5;
        config.outerRadius = 11;
        config.fill = 'red';
        config.stroke = 'black';
        config.strokeWidth = 1;
        var star = new Star(config);
        layer.add(star);
        !!callback ? callback(star, feature) : null;
    }

    return _render;
});