/**
*   存储绘制单元,用于存储绘制的几何体，
*   功能和Feature类似，不同点：
*   1.只存储几何体对象，
*   2.不包含属性。
*   3.支持图形编辑操作
*   @class Hmap.BaseType.GeoElement
*/
define(['GeoPolygon', 'GeoLineString', 'GeoPoint', 'Hobject', 'Symbol'],
    function (GeoPolygon, GeoLineString, GeoPoint, Hobject, Symbol) {

        var getId = Hobject.BaseFunc.getId;

        var _element = function (args) {
            var _args = args || {};
            this.id = getId();
            this.geometry = _args.geometry || null;                 //存放集合体集合
            //用于存储绘制的复杂图形
            this.drawElement = [];                                          //数组对象
            //记录geoElement符号
            this.applySymbol = _args.applySymbol||null;
            //事件
            this.click = null;
            this.mouseenter = null;
            this.mouseleave = null;
            //缓存绘制此GeoElemnt的 canvas 图层
            this.canvasLayers = {};
            //记录标绘图形在canvav画布的原点
            this.startXY = {
                x: null,
                y:null,
            }
            //其他需要初始化赋值的参数
            this._inilization();
        }

        /*
        *   可被覆写的初始化函数
        *   @abstract _inilization
        */
        _element.prototype._inilization = function () {

        }
        /**
        *   直接从geometry生成geoElement
        *   @method fromGeometry
        */
        _element.fromGeometry = function (geometry, symbol) {
            return new _element({
                geometry: geometry,
                applySymbol: symbol,
            });
        }
        /**
        *   支持点线面直接导入成geoElements
        *   @method fromCoords
        */
        _element.fromCoords = function (coord, symbol, typeName) {
            if (!typeName || !coord) return;
            var geometry;
            if (typeName === 'Line' || typeName === 'GeoLineString') {
                geometry = new GeoLineString({ coordinates: coord });
            } else if (typeName === 'Circe' || typeName === 'GeoPoint') {
                geometry = new GeoPoint({ coordinates: coord });
            } else if (typeName === 'Polygon' || typeName === 'GeoPolygon') {
                geometry = new GeoPolygon({ coordinates: [coord] });
            }
            return new _element({
                geometry: geometry,
                applySymbol:symbol,
            });
        }

        _element.prototype.getType = function () {
            return 'GeoElement';
        }

        return _element;

    });