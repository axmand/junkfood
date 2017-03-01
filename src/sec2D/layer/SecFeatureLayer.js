/**
*   瓦片式矢量图层,用于加载海量数据矢量图层
*   由于使用瓦片加载机制，数据量较少的时候会显得笨拙
*   海量数据定义：
*       矢量数据点数目超过6万，目前支持的数目上限为100万点
*   @author yellow date 2013/9/4
*   @class Hmap.Layer.SecFeatureLayer
*/
define(['SecBaseLayer', 'EsriJson', 'GeoJson', 'EventListener', 'Feature', 'Render', 'MapRender', 'Hobject', 'Hmath', 'TileRender'],
    function (SecBaseLayer, EsriJson, GeoJson, EventListener, Feature, Render, MapRender, Hobject, Hmath, TileRender) {

        var Stage = Render.Stage,
            Polygon = Render.Polygon,
            Circle = Render.Circle,
            Layer = Render.Layer,
            Animation = Render.Animation;

        var mHmath = new Hmath.h2dmath(),
            mTileRender = TileRender;

        var each = Hobject.BaseFunc.each,
            extend = Hobject.BaseFunc.extend;

        //要素类类型导入
        /*@param
        *   {
        *       mapData:          初始化数据   格式为
        *                               ｛   data:   //确定是 esrijson 和 geojson中的一种
        *                                     url:      //  
        *                                     type:   //""
        *                                     info:{
        *                                               date: //创建日期
        *                                               size:  //大小
        *                                            }
        *                               ｝
        *       mapInfo:{  ScreenPosition: //经纬度转换为屏幕坐标  }
        *       popHide:true, //控制pop窗体是否只显示一个
        *       renderType:'map' / 'heat'
        *   }
        */
        var _secFeatureLayer = function (args) {
            SecBaseLayer.call(this, args);
            this.mTaskQueue = new Hmath.taskQueue({ interval: 25, delay: 500,});//动态队列，延迟500ms后，以25ms间隙执行
            this.popHide = args.popHide || true;//指示是否自动隐藏上一个pop弹窗
            this.popDomElements = [];
            this.loadcomplete = false;
            this._mapRender = null;
            this.features = [];              //要素集合
            this.eventQueue = {};        //事件注册队列, 插入 { eventName,arguments }
            this.anim = null;               //动画
            this._screenlayers = {};      //瓦片canvas集合
            this._cacheLayers = {};      //缓存canvas集合
            this._funcs = [];                 //待调用方法
            this._clys = {};                   //待重绘瓦片,按照level缓存
            this._features = [];            //flash中的features集合
            this._bound = null;
            this._tipFeautre = {
                feature: null,
                loglat:null,
            }
        }

        extend(_secFeatureLayer, SecBaseLayer);

        //#region 非绘制方法
        /**
        *   @params options{ jsondata,url,complete }
        */
        _secFeatureLayer.prototype._jsonMap = function (option, callback) {
            var url, info, jsonObject, jsonType; //json需要的参数
            //存在mapData
            if (!!option.mapData) {
                //mapData 对象序列化 (判断对象不为空，和对象的consturctor 为object)
                if (!!option.mapData && option.mapData.constructor !== Object) option.mapData = JSON.parse(option.mapData);
                jsonObject = option.mapData;
                jsonType = this.args.jsonType || 'geojson';
            }
            //存在url
            if (!!option.url) {
                url = option.url;
                jsonType = this.args.jsonType || 'geojson';
            }
            //解析不同json
            if (jsonType === "esrijson") {
                jsonMap = new EsriJson({
                    jsondata: jsonObject,
                    url: url,
                    complete: callback,
                });
            }
            else if (jsonType === "geojson") {
                jsonMap = new GeoJson({
                    jsondata: jsonObject,
                    url: url,
                    complete: callback,
                });
            }
        },

        /**
         * @method layerInilization
         * 包含参数整合，初始化 图层dom，数据解析
         */
        _secFeatureLayer.prototype._publish = function () {
            this.complete();
            this.loadcomplete = true;
            var that = this;
            var completecallback = function (feautres, type) {
                if (type === "GeoJson") {
                    var i = 0, len = feautres.length;
                    while (i < len) {
                        var feature = Feature.fromGeoFeature(feautres[i]);
                        !!feature.geometry ? that.features.push(feature) : null;
                        i++;
                    }
                }
                else if (type === 'EsriJson') {
                    var i = 0, len = feautres.length;
                    while (i < len) {
                        var feature = Feature.fromeEsriFeature(feautres[i]);
                        !!feature ? that.features.push(feature) : null;
                        i++;
                    }
                }
                //features 读取完毕，注入 _openTip和_closeTip
                each(that.features, function (args, name) {
                    args.openTipCallback = function (popDom, clientXY, feature) {
                        that._openTip(popDom, clientXY, feature, that.layerInfo);
                    }//打开提示
                    args.closeTipCallback = function (popDom) {
                        that._closeTip(popDom);
                    }//关闭提示
                    args.flashCallback = function (func, canvasLayers) {
                        that._flash(func,args);
                    }//闪烁
                    args.getLevel = function () {
                        return that.args.mapInfo.tileLevel;
                    }//返回当前图层缩放级别
                });
                //注入鼠标事件
                if (!!that.eventQueue) {
                    each(that.eventQueue, function (args, name) {
                        that[name](args[0]);
                    });
                    that.eventQueue = {};
                }
                //绘制features
                that.draw();
            }
            var option = {
                mapData: this.args.mapData,
                url: this.args.mapUrl,
            }
            this._jsonMap(option, completecallback);
        }
        /*
         * 创建瓦片式canvas层
         */
        _secFeatureLayer.prototype._createlayer = function () {
            //进度条工具
            this.processCircle = this.args.mapInfo.processCircle;
            //1.创建canvas的外包容器,将容器放入   this.secMapInteractive.AddLayer(domlayer); 
            var _domlayer = document.createElement('div');
            _domlayer.style.width = this.mapWidth + 'px';
            _domlayer.style.height = this.mapHeight + 'px';
            _domlayer.style.position = "absolute";
            //2.创建stage对象
            this._stage = new Stage({
                id: this.args.layerID,
                container: _domlayer,
                width: this.args.width,
                height: this.args.height,
                //设置buffer区域size,默认为width和height,高速绘制图像
                bufferSize: 256,
            });
            var elements = this.args.grid.elements,
                element, layer;
            //添加elements
            this.addElements(elements);
            this._mapRender = new MapRender({
                stage: this._stage,
                mapInfo: this.args.mapInfo,
            });
            this.domLayer = this._stage.content;
        }

        //#endregion

        /**
         * mapObject消息接受器,内部使用
         * @method notice
         */
        _secFeatureLayer.prototype.notice = function (copyElements) {
            var sourceID = copyElements.sourceID;
            if (sourceID === "mousemove") {
                if (!isNaN(copyElements.x) || !isNaN(copyElements.y)) {
                    //移动时停止flash，提高显示性能
                    if ((Math.abs(this.layerInfo.offx - this.layerInfo.bfoffx)) > 2 |
                        Math.abs(this.layerInfo.offy - this.layerInfo.bfoffy) > 2) {
                        !!this.anim ? this.anim.stop() : null;
                    }
                }
            } else if (sourceID === "beforeMousewheel") {
                !!this.anim ? this.anim.stop() : null;
            } else if (sourceID === "mouseup") {
                if (!isNaN(copyElements.x) || !isNaN(copyElements.y)) {
                    //变动grid的element
                    var addElements = this.args.grid.addElements,
                        removeElements = this.args.grid.removeElements;
                    var addEdElement = this.addElements(addElements);
                    //2.删除旧的elements
                    this.removeElements(removeElements);
                    //3.实时绘制
                    var args = [];
                    for (var i = 0; i < addEdElement.length; i++) {
                        args.push([this.features, addEdElement[i]]);
                    }
                    //4.执行绘制
                    this._startTaskQueue(args, this._drawGeometry, this, function () {
                        //5.绘制完成后，继续执行animation动画
                        var clys = this._getRefreshLayers();
                        //6.获取需要更新的canvas
                        if (!!this.anim) {
                            this.anim.setLayers(clys);
                            this.anim.start();  //内部机制为：先停止后启动所有任务
                        }
                    });
                }
            } else if (sourceID === "mousewheel") {
                if (!isNaN(copyElements.zoom)) {
                    //停止执行队列
                    this._stopTaskQueue();
                    //缩放图层后，直接清楚layer的缓存
                    this._clear();
                    this.addElements(this.args.grid.elements);
                    this.draw();
                    //更新featuretip的位置
                    !!this._tipFeautre.feature?this._tipFeautre.feature.openTip(this._tipFeautre.loglat):null;
                }
            }
        }

        _secFeatureLayer.prototype._startTaskQueue = function (array, process, context, callback) {
            //显示进度条      
            //this.processCircle.show();
            this.mTaskQueue.chunk(array, process, context, function (results) {
                //context.processCircle.hide();
                !!callback ? callback.call(context, results) : null;
                //将results 加入
                var i, len = results.length, layer;
                for (i = 0; i < len; i++) {
                    layer = results[i];
                    context._stage.add(layer);
                    layer.draw();
                }
            });
        }

        _secFeatureLayer.prototype._stopTaskQueue = function () {
            this.mTaskQueue.stop();  //停止队列
        }

        /**
         * @method _clear
         *  清理render元素
         */
        _secFeatureLayer.prototype._clear = function () {
            var that = this,
                i, len = this.features.length,
                j, len2;
            for (i = 0; i < len; i++) {
                len2 = this.features[i].geometry.geoElements.length;
                for (j = 0; j < len2; j++) {
                    delete this.features[i].geometry.geoElements[j];
                }
                this.features[i].geometry.geoElements.length = 0;
            }
            //清理屏幕可见区域layers
            each(this._screenlayers, function (args, name) {
                args.layer.remove(); //不采用destory方式
                delete that._screenlayers[name];
            });
        }

        /**
         * 添加elements，内部使用
         * @param elements {Element}
         */
        _secFeatureLayer.prototype.addElements = function (elements) {
            var element, layer, addEdElement = [], i, len;
            for (var value in elements) {
                element = elements[value];
                if (!!this._cacheLayers[value]) {
                    //如果是cache的layer，需要加到stage
                    this._cacheLayers[value].layer.setCanvasXY(element.x, element.y);
                    this._screenlayers[value] = this._cacheLayers[value];
                    this._stage.add(this._screenlayers[value].layer);
                }
                else {
                    this._screenlayers[value] = {
                        layer: new Layer({
                            id: value,
                            x: element.x,
                            y: element.y,
                            width: 256,
                            height: 256,
                        }),                                                      //图层
                        cache: {},                                           //缓存对象
                        level: element.level,
                        element: element,                             //瓦片边界
                        geometrys: null,                                 //绘制geometry
                    };
                    this._cacheLayers[value] = this._screenlayers[value];   //缓存layer
                }
                addEdElement.push(this._screenlayers[value]);
                //element下的canvas不需要完全加载到stage,根据绘制按需加载
                //this._stage.add(this._screenlayers[value].layer);
            }
            return addEdElement; //新增的瓦片
        }

        /*
         * 移除elements，内部使用
         * @param array {Array}
         */
        _secFeatureLayer.prototype.removeElements = function (array) {
            var i, len = array.length, domElement;
            for (i = 0; i < len; i++) {
                domElement = document.getElementById(array[i]);
                //1.移除dom元素
                !!domElement && this.domLayer.contains(domElement) ? this.domLayer.removeChild(domElement) : null;
                //2.缓存layers,不移除
                if (!!this._screenlayers[array[i]]) delete this._screenlayers[array[i]];
            }
        }

        /*
        *   绘制前的准备
        *   将featuers按照grid分割后的canvas分割，取当前可视区域绘制
         *  @method draw
         */
        _secFeatureLayer.prototype.draw = function (layers,callabck) {
            //按照瓦片分割，异步加载
            var element, layer, args = [],
                layers = layers || this._screenlayers;
            for (var value in layers) {
                layer = layers[value];
                args.push([this.features, layer]);//绘制geometry
            }
            //启动执行队列
            this._startTaskQueue(args, this._drawGeometry, this, function (results) {
                !!callabck ? callabck.call(this, results) : null;
            });
        }

        /*
         * @param {Feature} features 要素集合
         * @param {Layer} layer canvas瓦片层
         */
        _secFeatureLayer.prototype._drawGeometry = function (features, layer) {
            if (arguments.length === 1) {
                if (!features) return;
                layer = features[1];
                features = features[0];
            }
            var element = layer.element,
                cache = layer.cache,
                feature, len = features.length,
                drawFeatures = [];
            if (!!cache.hasCached) return;
            else {
                for (var i = 0; i < len; i++) {
                    feature = features[i];
                    //判断feature是否在grid内
                    if (element.bound.intersection(feature.geometry.bound)) {
                        //使用element裁剪
                        var j, result = [],
                            bound = element.bound,
                            bounPolygon = bound.toPolygon();    //polygon区域被扩大一圈，用以消除边框线
                        len2 = feature.geometry.coordinates.length,
                        geoType = feature.geometry.getType();
                        feature.geometry.drawCoordinates.length = 0;
                        if (geoType === 'GeoPolygon') { //单个polygon                 
                            for (var j = 0; j < len2; j++) {
                                result[j] = mHmath.clipPolygon(feature.geometry.coordinates[j], bounPolygon);
                            }
                        } else if (geoType === "GeoMultiPolygon") { //polygon集合
                            var polygons = feature.geometry.polygons,
                                polygon,
                                len3 = polygons.length,
                                len4,j,k;
                            for (j = 0; j < len3; j++) {
                                polygon = polygons[j];
                                len4 = polygon.coordinates.length;
                                for (k = 0; k < len4; k++) {
                                    result.push(mHmath.clipPolygon(polygon.coordinates[k], bounPolygon));
                                }
                            }
                        }else if (geoType === 'GeoPoint') {
                            for (var j = 0; j < len2; j++) {
                                result[j] = feature.geometry.coordinates[j];
                            }
                        } else if (geoType === 'GeoLineString') {
                            result[0] = mHmath.clipPolyline(feature.geometry.coordinates, bound);
                        }
                        feature.geometry.drawCoordinates = result;
                        drawFeatures.push(feature);
                    }
                }
            }
            if (drawFeatures.length > 0) {
                this._mapRender.renderGeometry(layer, drawFeatures, this._drawComplete, this);
                return layer.layer;
            }
        }

        /*
         * 矢量图层渲染完毕
         */
        _secFeatureLayer.prototype._drawComplete = function (features, layerElement, context) {
            //绘制完成才会缓存到cache里
            layerElement.cache.hasCached = true;
            //有内容的Layer添加进drawLayer集合里
        }

        //#region 事件处理

        //添加事件绑定
        //connect(eventName,function)
        //callback(feature,geometry)
        //click  mouseenter  mouseleave mouseover 
        _secFeatureLayer.prototype.connect = function (eventName, callback) {
            !!this['_' + eventName] ? this['_' + eventName](callback) : null;
        }

        _secFeatureLayer.prototype._mouseenter = function (callback) {
            if (this.features.length === 0) {
                this.eventQueue['_mouseenter'] = arguments;
                return;
            }
            each(this.features, function (feature) {
                feature.mouseenter = callback;
            }, this);
        }

        _secFeatureLayer.prototype._mouseleave = function (callback) {
            if (this.features.length === 0) {
                this.eventQueue['_mouseleave'] = arguments;
                return;
            }
            each(this.features, function (feature) {
                feature.mouseleave = callback;
            }, this);
        }

        _secFeatureLayer.prototype._click = function (callback) {
            if (this.features.length === 0) {
                this.eventQueue['_click'] = arguments;
                return;
            }
            each(this.features, function (feature) {
                feature.click = callback;
            }, this);
        }

        /*
         * 回调闪烁方法
         */
        _secFeatureLayer.prototype._flash = function (func, feature) {
            //缓存feature相关信息
            this._cacheCanvasLayers(feature);
            //添加任务到执行队列
            this._funcs.push(func);
            //去除重复任务
            this._funcs = mHmath.deleteRepeatNByAttr(this._funcs, 'id');
            var that = this;
            this.anim = this.anim || new Render.Animation(function (frame) {
                var i, len = that._funcs.length;
                for (i = 0; i < len; i++) {
                    that._funcs[i](frame);
                }
            });
            //在当前图层缓存feature
            this._cacheCanvasLayers(feature);
            var clys = this._getRefreshLayers();
            //获取需要更新的canvas
            this.anim.setLayers(clys);
            this.anim.start();//内部机制为：先停止后启动所有任务
        }
        //计算需要更新的layers与当前的屏幕内的layer的重合度，挑出需要更新的canvasLayers
        _secFeatureLayer.prototype._cacheCanvasLayers = function (feature) {
            var level = feature.getLevel();
            //存储被点击过的feature
            this._features.push(feature);
            this._features = mHmath.deleteRepeatNByAttr(this._features, 'id'); //根据id去重
            //1.添加进canvas集合
            var _clys = [], that = this,
                canvasLayers = feature.getCanvasLayers();
            for (var element in canvasLayers) {
                _clys.push(canvasLayers[element]);
            }
            //不刷新不在此图层的layer
            this._clys[level] = (this._clys[level] || []).concat(_clys);
            //2.采用对象内标识符去重，缓存完成
            this._clys[level] = mHmath.deleteRepeatNByAttr(this._clys[level], '_id');
            this._getRefreshLayers();
        }
        //返回当前层级的canvasLayers，需要当前图层已经缓存过feature
        _secFeatureLayer.prototype._getRefreshLayers = function (level) {
            //获取屏幕与feture相交的layers
            var _level = level || this.args.mapInfo.tileLevel;
            //根据 this._screenlayers，计算出重叠的layers
            var clys = this._clys[_level];
            if (!clys) return [];
            var rClys = [], i,
             len = clys.length,
             table = {};
            //将screenLayers转换为 id-layer 的集合
            each(this._screenlayers, function (args, name) {
                table[args.layer._id] = true;
            });
            for (i = 0; i < len; i++) {
                if (table[clys[i]._id]) {
                    rClys.push(clys[i]);
                }
            }
            return rClys;
        }

        _secFeatureLayer.prototype._openTip = function (popDom, clientXY, feature, layerInfo) {
            if (this.popHide) {
                for (var i = 0; i < this.popDomElements.length; i++) {
                    this.domLayer.removeChild(this.popDomElements[i]);
                }
                //清空数组
                this.popDomElements = [];
            }
            this.domLayer.appendChild(popDom);
            var dx = popDom.clientWidth,
                dy = popDom.clientHeight,
                posX, posY;
            //设置到正确的位置
            if (clientXY.top) {
                posX = clientXY.top - dy - layerInfo.offy;
                posY = clientXY.left - dx / 2 - layerInfo.offx;
                this._tipFeautre.loglat = this.args.mapInfo.mapPosition2([clientXY.left, clientXY.top]);
            } else if (clientXY.log) {
                var screenXY = this.args.mapInfo.screenPosition(clientXY);
                posX = screenXY.y - dy;
                posY = screenXY.x - dx / 2;
                this._tipFeautre.loglat = clientXY;
            }
            feature._setTipPosition(posX, posY);
            this.popDomElements.push(popDom);
            //当前显示tip的Feature保存起来,并保存当时的经纬度信息
            this._tipFeautre.feature = feature;
        }
        /**
         *  @_closeTip 关闭泡泡弹窗
         */
        _secFeatureLayer.prototype._closeTip = function (popDom) {
            this.domLayer.removeChild(popDom);
            this.popDomElements = [];
        }

        /**
         * 更新整个layer下的canvas
         * @method update
         */
        _secFeatureLayer.prototype.update = function () {
            this._stage.draw();
        }

        _secFeatureLayer.prototype.getType = function () {
            return 'SecFeatureLayer';
        }
        /**
         * 将featureLayer转换为features一般做此操作用于几何计算
         * @method getFeatures
         */
        _secFeatureLayer.prototype.getFeatures= function () {
            return this.features;
        }

        /**
         *  将features转换为polygons集合
         * @method toPolygon
         */
        _secFeatureLayer.prototype.toPolygons = function () {
            var i, features = this.getFeatures(), len = features.length,
                feature, polygons = [], coordinate;
            for (i = 0; i < len; i++) {
                feature = features[i];
                if (feature.geometry.getType() === "GeoMultiPolygon") {
                    var j, len2 = feature.geometry.polygons.length;
                    for (j = 0; j < len2; j++) {
                        polygons = polygons.concat(this._toPolygon(feature.geometry.polygons[j]));
                    }
                }else if (feature.geometry.getType() === "GeoPolygon") {
                    polygons = polygons.concat(this._toPolygon(feature.geometry));
                }
            }
            return polygons;
        }

        //returen coords
        _secFeatureLayer.prototype._toPolygon = function (geoPolygon) {
            if (geoPolygon.getType() !== "GeoPolygon") return null;
            var j, len2 = geoPolygon.coordinates.length, coordList=[];
            for (j = 0; j < len2; j++) {
                var geoCoord = geoPolygon.coordinates[j];
                var coordsX = [], coordsY = [], coords = [];
                for (var k = 0; k < geoCoord.length; k++) {
                    coordsX.push(geoCoord[k][0]);
                    coordsY.push(geoCoord[k][1]);
                }
                coords.push(coordsX);
                coords.push(coordsY);
                coordList.push(coords);
            }
            return coordList;
        }

        /**
         * 获取Layer边界（Extend）
         * @method getBound
         */
        _secFeatureLayer.prototype.getBound = function () {
            if (!!this._bound)
                return this._bound;
            else {
                var i, geometry, tBound,
                    features=this.getFeatures(),len=features.length, tBound, feature;
                for (i = 1; i < len; i++) {
                    //bound比较函数
                    tBound = features[i].geometry.bound.concat(tBound);
                }
                return this._bound = tBound;
            }
        }

        _secFeatureLayer.prototype.getRect = function () {
            var bound = this._bound || this.getBound();
            var sLoglat = {
                log: bound.left,
                lat: bound.top,
            };
            var eLoglat = {
                log: bound.right,
                lat: bound.bottom,
            };
            var
                ltp = this.args.mapInfo.screenPosition.call(this.args.mapInfo.tileContext, sLoglat),
                rbp = this.args.mapInfo.screenPosition.call(this.args.mapInfo.tileContext, eLoglat),
                width = rbp.x - ltp.x,
                height = rbp.y - ltp.y;
            return{
                width:width,
                height:height,
            }
        }
        //#endregion

        return _secFeatureLayer;

    });