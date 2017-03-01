/**
*   map object,the map container and analysis tool set   
*   地图对象
*   @author yellow  date:2013/8/2
*   @class Hmap.MapObject
*/
define(['SecMapInteractive', "Hobject", "SecGraphicLayer", 'TileRender', 'Render', 'Grid', 'Hui','Messenger','Hmath'],
    function (SecMapInteractive, Hobject, SecGraphicLayer, TileRender, Render, Grid, Hui,Messenger,Hmath) { 
            //进度条UI
        var processCircle = Hui.processCircle,
            Dialog = Hui.dialog,
            //全局对象缓存
            hook=Hobject.BaseFunc.hook,    
            //事件处理队列
            sTransition = new Hmath.sTransition;
            //功能函数导入
        var copy = Hobject.BaseFunc.copy,
            bind = Hobject.BaseFunc.bind;
        /**
         *  地图核心对象
         * @class mapObj
         * @param args {Object} 
         */
        var _mapObj = function (args) {
            var _args = args || {};
            this.args = {};                                               //重新组装args,防止初始化失败
            this.layers = [];                                             //所有图层集合
            this.tilelayers = [];                                        //瓦片图层
            this.featurelayers = [];                                  //矢量图层
            this.layerindex = 0;                                      //记录layer的index参数，为laye赋ID和z-index
            this._tileRender = null;                                 //瓦片渲染,静态类
            this._grid = null;                                           //统一逻辑瓦片
            this._tools = [];                                             //加载到地图中的tool集合
            //地图对象核心参数,地图初始化完成之后,逐步加载
            this.mapInfo = {
                domXY: { x: 0, y: 0, },                                //dom窗体的top,left
                //默认海口坐标
                loglat: _args.loglat || { log: 110.31400575543467764, lat: 20.0052936452193 },
                dragging: false,
                screenPosition: null,                                 //经纬度转屏幕坐标
                mapPosition2: null,                                     //屏幕坐标转经纬度
                tileContext: null,                                      //绑定瓦片层上下文
                mapCenter: null,                                      //loglat:{log,lat}
                tileLevel: _args.level || 15,                         //地图对象瓦片层级
                processCircle: processCircle,                    //进度条
            };
            this.layerInfo = {
                offx: 0,
                offy: 0,
                bfoffx: 0,  //移动前的x偏移量
                bfoffy: 0,  //移动前y偏移量
            };                                        //统一layer信息（featurelayer）
            var that = this;
            this._inilization(args);                                     //检查与装载参数
        };

        //#region 内部初始化处理函数
        _mapObj.prototype._layerhandle = function (options) {
            var _options = options || {},
                layer = _options.layer,
                domlayer = layer.domLayer,
                data = _options.data,
                layerType = _options.layerType;
            if (layerType === 'SecTileLayer') {
                this._tileRender.addTiles(data, domlayer);
                this.tilelayers.push(layer);
            } else if (layerType === 'SecFeatureLayer' || layerType === 'SecGraphicLayer' ||layerType === 'SecDrawLayer') {
                this.featurelayers.push(layer);
            }
            //交互dom对象
            this.secMapInteractive.addLayer(domlayer);  
            //增加订阅者，所有layer集合
            this.layers.push(layer);
        };
        //内置初始化器
        _mapObj.prototype._inilization = function (args) {
            this._iniargs(args);          //创建map的dom对象
            this._iniEvent();               //注册mapinteractive
            this._iniInternal();           //注册内部对象
        };
        //初始化地图窗体
        _mapObj.prototype._iniargs = function (args) {
            var args = args || {};
            this.args.level = args.level;
            this.args.type = args.type;
            this.args.loglat = args.loglat;
            this.args.mapID = args.mapID;
            this.args.mapElement = document.getElementById(this.args.mapID) || document.createElement('div');         //通过mapID获取mapElement,否则就是获取body作为mapElement
            this.args.mapElement.className = 'Jake-ui-MapObject';
            this.args.width = this.args.mapElement.offsetWidth || 0;      //记录地图宽度
            this.args.height = this.args.mapElement.offsetHeight || 0;    //记录地图高度
            //存放进hook
            hook.setValue('mapElement', this.args.mapElement);
            hook.setValue('width', this.args.width);
            hook.setValue('height', this.args.height);
        };
        //初始化内部组件
        _mapObj.prototype._iniInternal = function () {
            //---------------test---------------
            var dialog = new Dialog();
            dialog.setMapObj(this.args.mapElement);
            //---------------test---------------
            //添加进度条
            processCircle.setPosition(this.args.height / 2 - 64, this.args.width / 2 - 64);
            processCircle.setMapObj(this.args.mapElement);
            //创建grid，提供逻辑瓦片层
            this._grid = new Grid({
                level: this.mapInfo.tileLevel,
                loglat: this.mapInfo.loglat,
                width: this.args.width,
                height: this.args.height,
                domXY: this.mapInfo.domXY,          //dom的top,left
            });
            this.mapInfo.screenPosition = bind(this._grid, this._grid.screenPosition);
            this.mapInfo.mapPosition2 = bind(this._grid, this._grid.mapPosition2);
            //初始化瓦片层render,传入格网矩阵
            this._tileRender = new TileRender({grid: this._grid});
        };
        //注册event
        _mapObj.prototype._iniEvent = function () {
            var that = this;
            //插件触发事件回调
            this._eventcallback = function (eventElements) {
                var i,
                    flen = that.featurelayers.length,   //featureLayer个数
                    tlen = that.tilelayers.length,         //tileLayer个数
                    toollen=that._tools.length;
                switch (eventElements.eventName) {
                    case "mousedown":
                        break;
                    case "mousemove":
                        that.mapInfo.dragging = true;
                        if (!isNaN(eventElements.x) && !isNaN(eventElements.y)) {
                            that.mapInfo.domXY.x = that.layerInfo.offx = -1 * eventElements.y;    //left
                            that.mapInfo.domXY.y = that.layerInfo.offy = -1 * eventElements.x;    //top
                        }
                        for (i = 0; i < flen; i++) {
                            that.featurelayers[i].notice({ x: -1 * eventElements.y, y: -1 * eventElements.x, sourceID: "mousemove" });
                        }
                        break;
                    case "beforeMousewheel":
                        //通知给featureLayer
                        for (i = 0; i < flen; i++) {
                            that.featurelayers[i].notice({ zoom: eventElements.zoom, sourceID: "beforeMousewheel" });
                        }
                        break;
                    case "mousewheel":
                        //更新tileLevel信息
                        var mapWheelInfo= that._grid.zoom(eventElements.zoom, eventElements.wheelElement);
                        that.mapInfo.tileLevel = mapWheelInfo.level;
                        //通知tools做相关更新
                        for (i = 0; i < toollen; i++) {
                            that._tools[i].update({ level: that.mapInfo.tileLevel, sourceID: "mousewheel" });
                        }
                        //更新tileLayer
                        for (i = 0; i < tlen; i++) {
                            //直接使用grid zoom计算的参数给tile使用，节省性能开销
                            that.tilelayers[i].tiles.zoom(eventElements.zoom, eventElements.wheelElement, mapWheelInfo.mapPosition);
                            that._tileRender.clearTiles(that.tilelayers[i].domLayer);
                            that._tileRender.addTiles(that.tilelayers[i].tiles.addTiles, that.tilelayers[i].domLayer);
                        }
                        //更新featureLayer
                        for (i = 0; i < flen; i++) {
                            that.featurelayers[i].notice({ zoom: eventElements.zoom, sourceID: "mousewheel" });
                        }
                        break;
                    case "mouseup":
                        that.mapInfo.dragging = false;
                        len = that.tilelayers.length;
                        //传递的是 -y -x,更新逻辑grid
                        that._grid.move(eventElements.x, eventElements.y);
                        for (i = 0; i < tlen; i++) {
                            //传递过来的x,y实际上是相对于原始点的-y,-x;
                            that.tilelayers[i].tiles.move(eventElements.x, eventElements.y);
                            that._tileRender.addTiles(that.tilelayers[i].tiles.addTiles, that.tilelayers[i].domLayer);
                            that._tileRender.removeTiles(that.tilelayers[i].tiles.deleteTiles, that.tilelayers[i].domLayer);
                        }
                        for (i = 0; i < flen; i++) {
                            that.featurelayers[i].notice({ x: -1 * eventElements.y, y: -1 * eventElements.x, sourceID: "mouseup" });
                        }
                        //共享信息(dom偏移量)
                        if (!isNaN(eventElements.x) && !isNaN(eventElements.y)) {
                            that.mapInfo.domXY.x = that.layerInfo.offx = that.layerInfo.bfoffx = -1 * eventElements.y;    //left
                            that.mapInfo.domXY.y = that.layerInfo.offy = that.layerInfo.bfoffy = -1 * eventElements.x;    //top
                        }
                        break;
                    default:
                        break;
                }
            };
            //{ width,height,domLayer  }
            var eventargs = {
                domLayer: this.args.mapElement,
                width: this.args.width,
                height: this.args.height,
                eventCallback: this._eventcallback, //事件触发回调
            };
            //交互插件
            this.secMapInteractive = new SecMapInteractive(eventargs);
            //提示框插件初始化，并设置实例
            this.messenger = new Messenger({ parentLocation: this.args.mapElement });
            Messenger.setInstance(this.messenger);
        };
        //#endregion

        /**
         *  添加图层到地图对象里
         *  @method addLayer
         *  @param layer {Layer}
         */
        _mapObj.prototype.addLayer = function (layer) {
                //对参数的浅拷贝
            var args = copy(this.args, {
                layerID: this.layerindex++,
                mapInfo: this.mapInfo,
                layerInfo: this.layerInfo,
                grid: this._grid,
            });              
            var that = this;
            layer.complete = function (data) {                     //layer初始化完成后的回调
                that._layerhandle({
                    layerType: layer.getType(),
                    layer: layer,
                    data: data,
                });
            };
            layer.layerInilization(args);                                 //显示初始化调用
        };
        /**
         * 添加工具
         * @method addTool
         * @param tool {Hmap.Tools.**}
         */
        _mapObj.prototype.addTool = function (tool) {
            var args = copy(this.mapInfo, {
                mapElement: this.args.mapElement,
                addLayer: bind(this, this.addLayer),    //添加图层方法
                mapInteractive: this.secMapInteractive,
                getLayerById:bind(this,this.getLayerById),
            });
            tool.load(args);
            this._tools.push(tool);
        };
        /**
        *   通过layerID搜索layer
        *   @method getLayerById
        *   @param id {String}  图层 layerID
        */
        _mapObj.prototype.getLayerById = function (id) {
            for (var i = 0, len = this.layers.length; i < len; i++) {
                if (this.layers[i].layerID === id)
                    return this.layers[i];
            }
            return null;
        }
        /**
        *   移动到指定经纬度
        *   @method moveTo
        *   @param loglat {Loglat} 经纬度
        */
        _mapObj.prototype.moveTo = function (loglat) {
            var _viewBox = this.secMapInteractive.viewBox,    //地图图层容器
                _move = this.secMapInteractive.interactive.mousemove,
                that = this,
                _posX = [0],
                _posY = [0];
            //计算经纬度转换成的屏幕坐标
            clientXY = this.mapInfo.screenPosition(loglat);
            clientXY.x = clientXY.x - this.mapInfo.domXY.x;
            clientXY.y = clientXY.y - this.mapInfo.domXY.y;
            //不用平移
            if (clientXY.x == 0 && clientXY.y == 0) {
                return;
            }
            //
            //}{ yellow 性能优化建议：这里的sin值可以采用Cache索引优化查找表，
            //在第一次运算后不重复运算，提高性能，建议使用数组存放，读取效率会更高
            sTransition.animate(_viewBox, 600, function (index) {
                //
                var s = Math.sin(Math.PI * index / 72); 
                var x = (s * clientXY.x).toFixed(0) - _posX.sum(),
                  y = (s * clientXY.y).toFixed(0) - _posY.sum();
                _move({ clientX: x, clientY: y, mousePosition: { x: "0", y: "0" } });
                //
                _posX.push(x);
                _posY.push(y);
            }, function () {
                var x = clientXY.x - _posX.sum();
                    y = clientXY.y - _posY.sum(),
                _move({ clientX: x, clientY: y, mousePosition: { x: "0", y: "0" } });
                //平移
                that._eventcallback({
                    x: -1 * clientXY.y,
                    y: -1 * clientXY.x,
                    eventName: "mouseup",
                });
                //
                delete transition;
            });
        }
        /**
        *   缩放到指定层级
        *   @method zoomTo
        */
        _mapObj.prototype.zoomTo = function (level) {

        }

        return _mapObj;

    });