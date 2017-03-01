/**
*   要素类型，包含geometry，attribute（fields）,能直接转换转换为GeoJson等格式
*   @author yellow date 2014/9/12
*   @class Hmap.BaseType.Feature
*/

define(['GeoPolygon', 'GeoLineString', 'GeoPoint', 'Hobject', 'Symbol','GeoMultiPolygon'],
    function (GeoPolygon, GeoLineString, GeoPoint, Hobject, Symbol, GeoMultiPolygon) {
        var polygon = GeoPolygon,
            lineString = GeoLineString,
            multiPolygon = GeoMultiPolygon,
            point = GeoPoint,
            //
            min = Math.min,
            max = Math.max,
            floor = Math.floor,
            //方法导入
            getOffsetXY = Hobject.BaseFunc.getOffsetXY,
            getId = Hobject.BaseFunc.getId,   //获取不重复的ID
            each = Hobject.BaseFunc.each;

        var _feature = function (args) {
            var _args = args || {};
            //feautre的bound来自于geometry
            this.id = getId();
            //集合对象集合
            this.geometry = _args.geometry;
            //属性表
            this.properties = _args.properties;
            //存储字段器
            this.fileds = null;
            //feature暴露事件处理函数
            this.click = null;
            this.mouseenter = null;
            this.mouseleave = null;
            //openTip回调
            this.openTipCallback = null;
            //closeTip回调
            this.closeTipCallback = null;
            //flash回调
            this.flashCallback = null;
            //此feature是否被选中
            this.isEnter = false;
            //canvas图层，更新feature所使用的canvas即可
            this.canvasLayers = {};
            //泡泡窗dom元素集合
            this.pop = this._iniPopOver();
            //传入event，获取鼠标事件
            this._evt = null;
            //动画
            this.anim = null;
            //应用样式
            this.applySymbol = null;
            //获取容纳feature的layer
            this.parentLayer = null;
        }
        /**
        *   从geojson要素生成feature
        *   @method fromGeoFeature
        */
        _feature.fromGeoFeature = function (feature) {
            var geometry, properties;
            //分解feature
            if (feature.geometry.type === 'Polygon') {
                geometry = polygon.fromGeoGeometry(feature.geometry);
            } else if (feature.geometry.type === "MultiPolygon") {
                geometry = multiPolygon.fromGeoGeometry(feature.geometry);
            }else if (feature.geometry.type === 'Point') {
                geometry = point.fromGeoGeometry(feature.geometry);
            }else if (feature.geometry.type === 'LineString') {
                geometry = lineString.fromGeoGeometry(feature.geometry);
            } else if (feature.geometry.type === 'MultiLineString') {
                geometry = lineString.fromGeoGeometry(feature.geometry);
            }
            properties = feature.properties;
            return new _feature({ geometry: geometry, properties: properties });
        }
        /**
         * 从esrijson中生成feature
         * @method fromeEsriFeature
         */
        _feature.fromeEsriFeature = function (feature) {
            var geometry, properties;
            //分解feature
            if (!!feature.geometry.rings) { //multipolygon
                geometry = multiPolygon.fromEsriGeometry(feature.geometry.rings);
            } else if (!!feature.geometry.x && !!feature.geometry.y) {  //point
                geometry = point.fromEsriGeometry(feature.geometry);
            } else if (!!feature.geometry.paths) {  //线
                geometry = lineString.fromEsriGeometry(feature.geometry.paths);
            }
            properties = feature.attributes;
            return new _feature({ geometry: geometry, properties: properties });
        }
        /**
         * 更新render
         * @method update
         */
        _feature.prototype.update = function () {
            var _canLayers = this.getCanvasLayers();
            !!_canLayers ? each(_canLayers, function (args, name) {args.draw();}) : null;
        };
        // 默认方向为下的泡泡窗
        _feature.prototype._iniPopOver = function () {
            //泡泡主窗体
            var popDom = document.createElement('div');
            popDom.className = 'popover fade top in';
            popDom.style.display = "block";
            //箭头
            var arrow = document.createElement('div');
            arrow.className = 'arrow';
            //标题
            var h3 = document.createElement('h3');
            h3.className = 'popover-title';
            //内容
            var content = document.createElement('div');
            content.className = 'popover-content';
            popDom.appendChild(arrow);
            popDom.appendChild(h3);
            popDom.appendChild(content);
            //
            return {
                title: h3,
                content: content,
                popDom: popDom,
            }
        }
        /**
        *   呼吸灯式闪烁效果
        *   @method flash
        */
        _feature.prototype.flash = function () {
            //1.判断geometry
            var geoType = this.getGeoType(),
                sR = 123, sG = 75, sB = 75,  //初始颜色值
                that = this, i, len,
                flashFunc;//注入flash函数
            if (geoType === 'GeoLineString') {
                flashFunc = function (frame) {
                    for (i = 0; i < len; i++)
                        that.geometry.geoElements[i].setX(30 * Math.sin(frame.time * 2 * Math.PI / 500));
                }
            }
            else if (geoType === 'GeoPoint') {
                flashFunc = function (frame) {
                    flashFunc = function (frame) {
                        for (i = 0; i < len; i++)
                            that.geometry.geoElements[i].setFill('#' + (30 * Math.sin(frame.time * 2 * Math.PI / 500)).toString(16));
                    }
                }
            }
            else if (geoType === 'GeoPolygon'||geoType==="GeoMultiPolygon") {
                flashFunc = function (frame) {
                    var speed = 50 * Math.sin(frame.time * Math.PI / 250),
                    _sr = min(max(0, floor(sR + speed)), 255);
                    _sg = min(max(0, floor(sG + speed)), 255);
                    _sb = min(max(0, floor(sB + speed)), 255);
                    var color = '#' + _sr.toString(16) + _sg.toString(16) + _sb.toString(16);
                    var _geoElements = that.getGeometrys();
                    if (!!_geoElements) {
                        len = _geoElements.length;
                        for (i = 0; i < len; i++) {
                            _geoElements[i].setFill(color);
                            _geoElements[i].setStroke(color); //设置边线
                        }
                    }
                }
            }
            flashFunc.id = this.id;
            //回调给featureLayer,在Layer里添加animation
            this.flashCallback(flashFunc, this.getCanvasLayers());
        }
        /**
         *  获取指定缩放级别下的geometrys（GeoElements）集合
         *  默认获取当前缩放级别下的geometry
         *  @method getGeometrys
         *  @param level {Number}  缩放级别
         */
        _feature.prototype.getGeometrys = function (level) {
            return this.geometry.geoElements[level || this.getLevel()];
        }
        /**
         * 获取当前缩放级别下的canvasLayer，用于update
         */
        _feature.prototype.getCanvasLayers = function (level) {
            return this.canvasLayers[level || this.getLevel()];
        }
        /**
        *   @method getFields
        *   @return {Array}
        *    返回field集合
        */
        _feature.prototype.getFields = function () {
            if (!!this.fileds) return this.fileds;
            this.fileds = [];
            each(this.properties, function (args, name) {
                this.fileds.push(name);
            });
            return this.fileds;
        }
        /**
         * @method popConfig
         * 设置pop窗显示属性
         * @params options {Object}
         * {
         *      title:
         *      context:
         * }
         */
        _feature.prototype.setPopConfig = function (options) {
            var _options = options || {},
                title = _options.title || "",
                context = _options.context || "";
            this.pop.title.textContent = title;
            this.pop.content.innerHTML = context;
        }
        /**
         * 弹出tip窗
         *  @method openTip
         */
        _feature.prototype.openTip = function (loglat) {
            var clientXY;
            //计算feature的屏幕坐标或者事件坐标
            if (loglat) {
                clientXY = loglat;
            }else if (this._evt) {
                clientXY = getOffsetXY(this._evt);
            } else {
                return;
            }
            //回调,设置top，left 位置
            this.openTipCallback(this.pop.popDom, clientXY, this);
        }
        /**
         * 关闭tip窗口
         * @method closeTip
         */
        _feature.prototype.closeTip = function () {
            this.closeTipCallback(this.pop.popDom);
        }
        //设置气泡窗的位置(top,left)
        _feature.prototype._setTipPosition = function (top, left) {
            this.pop.popDom.style.top = String(top) + 'px';
            this.pop.popDom.style.left = String(left) + 'px';
        }
        //设置Symbol样式,根据geometry设置symbol
        _feature.prototype.setSymbol = function (symbol) {
            this.applySymbol = symbol;
        }
        //重置Symbol样式
        _feature.prototype.resetSymbol = function () {
            this.applySymbol = null;
        }

        _feature.prototype.getType = function () {
            return "Feature";
        }

        _feature.prototype.getGeoType = function () {
            return this.geometry.getType();
        }

        /**
        *   计算feature的地理面积
        *   @method geoArea
        */
        _feature.prototype.geoArea = function () {
            return this.geometry.geoArea();
        }

        return _feature;

    });
