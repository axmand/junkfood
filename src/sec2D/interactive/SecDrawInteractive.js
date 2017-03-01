/**
*   used to join drawing events
*   @author yellow date:2013/9/1
*/
define(['EventListener', 'Messenger', 'Hobject', 'DrawProtocol', 'Render', 'Symbol', 'GeoElement', 'PlotElement'],
    function (EventListener, Messenger, Hobject, DrawProtocol, Render, Symbol, GeoElement, PlotElement) {

        var addListener = EventListener.AddListener,            //添加事件
            removeListener = EventListener.RemoveListener,  //移除事件
            extend = Hobject.BaseFunc.extend,                      //继承
            bind = Hobject.BaseFunc.bind,
            hook = Hobject.BaseFunc.hook,
            watch = Hobject.BaseFunc.watch,
            drawProtocolFactory = DrawProtocol.drawProtocolFactory;

        var _layerInfo = null,                                                 //统一的layerInfo对象，可以直接获取
            Animation = Render.Animation;

        var selectedElement = null,                                         //当前选中的PoltElement
            screenPosition,
            mapPosition;

        /**
        *   绘制操作流程定义
        *   所有操作都是一个模式
        *   1.mousedown开始
        *   2.mousemove (控制点足够的时候，实现实时变动橡皮线绘制)
        *   3.mousedown，添加控制点(控制点个数达到上限则不响应mousedown,只响应mousemove实时绘制效果)
        *   4.dbclick结束绘制
        *   @class Hmap.Ui.DrawOperation
        */
        var _drawOperation = function (domlayer, eventCallback) {
            //记录当前绘制方式
            var mDrawType, x0, y0, drag = false;
            var _mousedown = function (event) {
                //左键单击
                if (event.button === 0) {
                    var moveX = event.offsetX - _layerInfo.offx,
                    moveY = event.offsetY - _layerInfo.offy;
                    x0 = x0 || moveX;
                    y0 = y0 || moveY;
                    //
                    if (!drag) {
                        addListener(domlayer, 'mousemove', _mousemove);
                        addListener(domlayer, 'dblclick', _dblclick);
                        drag = true;
                    }
                    //触发绘制
                    eventCallback({
                        eventName: 'mousedown',
                        drawType: mDrawType,
                        x0: x0,                                 //鼠标点下的点x,y
                        y0: y0,
                        moveX: moveX,
                        moveY: moveY,
                    });
                }
            }
            //
            var _mousemove = function (event) {
                //阻止冒泡
                event.cancelBubble = true;
                var moveX = event.offsetX - _layerInfo.offx,
                 moveY = event.offsetY - _layerInfo.offy;
                //
                if (drag) {
                    eventCallback({     //绘制完成返回true
                        x0: x0,
                        y0: y0,
                        moveX: moveX,
                        moveY: moveY,
                        eventName: "mousemove",
                        drawType: mDrawType,
                    });
                }
            }
            //
            var _dblclick = function (event) {
                eventCallback({
                    eventName: "dblclick",
                    drawType: mDrawType,
                });
                _clearEvent();
            }
            //
            var _reSetEvent = function () {
                _clearEvent();
                addListener(domlayer, 'mousedown', _mousedown);
            }
            //
            var _clearEvent = function () {
                mDrawType = "";
                drag = false;
                x0 = y0 = null;
                removeListener(domlayer, 'mousemove', _mousemove);
                removeListener(domlayer, 'dblclick', _dblclick)
                removeListener(domlayer, 'mousedown', _mousedown);
            }
            /**
            *   绘制内容
            *   @method SetDrawType
            *   @param drawType {DrawType}
            */
            var _setDrawType = function (drawType) {
                _clearEvent();
                _reSetEvent();
                mDrawType = drawType;
            }

            return {
                reSetEvent: _reSetEvent,            // 启动/重设 绘制事件
                clearEvent: _clearEvent,             //清除绘制事件
                setDrawType: _setDrawType,     //绘制主体内容
            }
        }

        /*
        *   点击选中plotElement进行编辑
        */
        var _clickFunction = function (plotElement) {
            if (!!hook.plotEditFlag) {
                if (!!selectedElement) selectedElement.stopEdit();
                selectedElement = plotElement;
                selectedElement.startEdit();
            }
        }

        watch(hook, 'plotEditFlag', function (propName, oldValue, newValue) {
            if (newValue === false) {
                !!selectedElement ? selectedElement.stopEdit() : null;
                selectedElement = null;
            }
        })

        /**
        *   二维绘制操作
        *   @class Hmap.Ui.SecDrawInteractive
        *   @param args {Object}
        *   {
        *       domLayer: canvas 的 renderer.domElement
        *       eventCallback:cbk
        *   }
        */
        var _secDrawInteractive = function (args) {
            var that = this;
            //坐标转换
            screenPosition = screenPosition || args.screenPosition;
            mapPosition = mapPosition || args.mapPosition;
            this.mapID = args.mapID;
            //canvas 的 domlayer
            this.domLayer = args.domLayer;
            this.stroeData = args.stroeData;
            //canvas 图层
            this.layer = args.layer;
            //缓存layerInfo，缓存一次后所有实例对象共享
            this.layerInfo = _layerInfo = _layerInfo || args.layerInfo;
            this.anim = new Animation(function (frame) {
                that.layer.draw();//60帧重绘，显示动画效果
            }, this.layer);
            //用于添加事件
            var addAction = this.addAction = function (element) {
                that.anim.stop();
                !element.startEdit ? element.startEdit = function () {
                    element._startEdit(that.anim, that.layer, that.domLayer, screenPosition);
                } : null;
                !element.stopEdit ? element.stopEdit = function () {
                    element._stopEdit(that.anim, that.domLayer, complete);
                } : null;
                //注册点击事件
                for (var i = 0, len = element.drawElement.length; i < len; i++) {
                    element.drawElement[i].once('click', function (evt) {
                        _clickFunction(element);
                    });
                }
            }
            //完成绘制协议，回调用于存储数据
            var complete = function (element) {
                //1.停止事件
                that.drawOperation.clearEvent();
                //2.停止animation
                that.anim.stop();
                //3.cursor改变
                that.domLayer.style.cursor = 'default';
                //4.保存geoElement和poltElement,回传给drawLayer存储起来
                var typeName = element.getType(),
                    resultElement = typeName === 'GeoElement' ? that._cvtGeoElement(element) : that._cvtPlotElement(element);
                //5.回调给drawLayer存储
                that.stroeData(typeName, resultElement);
                //6.添加事件
                addAction(element);
            }
            //绘制协议所需参数
            this.protocolArgs = {
                name: '',
                layer: args.layer,
                complete: complete,
                symbol: null,                //符号类型设置
            }
            //绘制事件
            this.drawOperation = new _drawOperation(this.domLayer, bind(this, this.eventCallabck));
        }

        _secDrawInteractive.prototype.eventCallabck = function (eventElements) {
            var ofx = this.layerInfo.offx, ofy = this.layerInfo.offy, tmpPoints;
            var x = eventElements.moveX + ofx,
                y = eventElements.moveY + ofy,
                movePoint = [x, y];
            if (eventElements.eventName === "mousedown") {
                this.drawProtocol.mousedown(movePoint);
            }
            else if (eventElements.eventName === "mousemove") {
                this.drawProtocol.mousemove(movePoint);
            }
            else if (eventElements.eventName === "dblclick") {
                this.drawProtocol.dbclick();
                this.anim.stop();
            }
        }

        _secDrawInteractive.prototype.changeDraw = function (drawType) {
            this.anim.stop();
            Messenger.getInstance().post('任务 ： 绘制 ' + drawType);
            this.domLayer.style.cursor = 'crosshair';
            this.drawOperation.setDrawType(drawType);
            this.drawProtocol = drawProtocolFactory.create(drawType, this.protocolArgs);
            this.anim.start();
        }

        //#region Geometory 转换函数

        _secDrawInteractive.prototype._cvtPlotElement = function (element, dx, dy) {
            var shapes = element.drawElement,
                len = shapes.length, i = 0;
            //1.存储图形点
            for (; i < len; i++) {
                element.setShapeCoord(this._cvtGeometry(shapes[i], dx, dy)[0], i);
            }
            //2.存储控制点
            var cpts = element.controlPoints, geoCpt;
            j = 0, len2 = cpts.length;
            for (; j < len2; j++) {
                geoCpt = mapPosition(cpts[j]);
                cpts[j] = [geoCpt.log, geoCpt.lat];
            }
            return element;
        }

        _secDrawInteractive.prototype._cvtGeoElement = function (element) {
            var geometry = element.drawElement[0],
                results = this._cvtGeometry(geometry);
            return GeoElement.fromCoords(results[0], results[1], results[2]);
        }

        _secDrawInteractive.prototype._cvtGeometry = function (shape) {
            var type = shape.className,
                    points, coords, symbol;
            switch (type) {
                case 'Polygon':
                    points = shape.attrs.points;
                    points = points.length >= 3 ? points.concat([points[0]]) : null;//闭合多边形
                    symbol = new Symbol.polygonSymbol({
                        fill: shape.attrs.fill,
                        opacity: shape.attrs.opacity,
                        stroke: shape.attrs.stroke,
                        strokeWidth: shape.attrs.strokeWidth,
                    });
                    break;
                case 'Circle':
                    points = [shape.attrs.x, shape.attrs.y];
                    symbol = new Symbol.pointSymbol({
                        radius: shape.attrs.radius,
                        fill: shape.attrs.fill,
                        opacity: shape.attrs.opacity,
                        stroke: shape.attrs.stroke,
                        strokeWidth: shape.attrs.strokeWidth,
                    });
                    break;
                case 'Line':
                    points = shape.attrs.points;
                    symbol = new Symbol.lineSymbol({
                        opacity: shape.attrs.opacity,
                        stroke: shape.attrs.stroke,
                        strokeWidth: shape.attrs.strokeWidth,
                    });
                    break;
                default:
                    break;
            }
            coords = this._cvtCoord(points, type);
            return [coords, symbol, type];
        }

        //坐标转换函数
        _secDrawInteractive.prototype._cvtCoord = function (points, type) {
            var coord = [], loglat, point, i,
                  len = points.length;
            if (type === "Line") {
                for (i = 0; i < len; i++) {
                    loglat = mapPosition(points[i]);
                    !!loglat ? coord.push([loglat.log, loglat.lat]) : null;
                }
            } else if (type === 'Circle') {
                loglat = mapPosition(points);
                coord.push(loglat.log);
                coord.push(loglat.lat);
            } else if (type === 'Polygon') {
                len = points.length;
                for (i = 0; i < len; i++) {
                    loglat = mapPosition(points[i]);
                    !!loglat ? coord.push([loglat.log, loglat.lat]) : null;
                }
            }
            return coord;
        }

        //#endregion

        return _secDrawInteractive;

    });