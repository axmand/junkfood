/**
*   PoltElement的扩展插件，提供编辑操作
*   @class Hmap.Plot.PlotEdit
*/

define(['PlotElement', 'Render', 'Symbol', 'EventListener', 'MapRender','Hobject'],
    function (PlotElement, Render, Symbol, EventListener, MapRender,Hobject) {

        var addListener = EventListener.AddListener,
            removeListener = EventListener.RemoveListener;
        //
        var Polygon = Render.Polygon,
        Animation = Render.Animation,
        Stage=Render.Stage,
        Layer=Render.Layer,
        Line = Render.Line,
        Circle = Render.Circle;
        //
        var defaultLineSymbol = Symbol.defaultLineSymbol,
            defaultPolygonSymbol = Symbol.defaultPolygonSymbol,
            defaultPointSymbol = Symbol.defaultPointSymbol,
        //
        hook = Hobject.BaseFunc.hook,
        getId = Hobject.BaseFunc.getId,
        mAnim,mMapRender;
    
        var _mousedown = function (evt) {
            evt.cancelBubble = true;
        }

        var _mousemove = function (evt) {
            evt.cancelBubble = true;
        }

        var _mousewheel = function (evt) {
            evt.cancelBubble = true;
        }

        //地图锁定
        var lockMap = function (domlayer) {
            addListener(domlayer, 'mousedown', _mousedown);
            addListener(domlayer, 'mousemove', _mousemove);
            addListener(domlayer, 'mousewheel', _mousewheel);
        }
        //地图解锁
        var unlockMap = function (domlayer) {
            removeListener(domlayer, 'mousedown', _mousedown);
            removeListener(domlayer, 'mousemove', _mousemove);
            removeListener(domlayer, 'mousewheel', _mousewheel);
        }

        /**
        *   开始编辑PlotElement
        *   @method startEdit
        */
        PlotElement.prototype._startEdit = function (anim, canvaslayer, domlayer, screenPosition) {
            var that = this,
              width = hook.getValue('width'),
              height = hook.getValue('height'),
              viewBoxDom = hook.getValue('viewBox');
            //
            this.canvaslayer = canvaslayer;
            this.editPoints = [];

            //#region 创建edit canvas 图层 
            var _domlayer = document.createElement('div');
            _domlayer.style.width = width + 'px';
            _domlayer.style.height = height + 'px';
            _domlayer.style.position = "absolute";
            //创建新的图层
            this.editlayer = new Layer({
                width: width,
                height: height,
            });
            this._stage = new Stage({
                container: _domlayer,
                id: getId(),
                width: width,
                height:height,
            });
            this._stage.add(this.editlayer);
            viewBoxDom.appendChild(this._stage.content);
            //创建maprender
            mMapRender = mMapRender || new MapRender({
                mapInfo: {
                    screenPosition: screenPosition,
                }
            })
            //将现有的图形移到editlayer
            mMapRender.renderGeometry({ layer: this.editlayer }, this.toDrawGeoElements(),
                function (features, layerElement, context, drawElements) {
                    //删除原来的坐标
                    var dElement = context.drawElement.shift();
                    while (dElement) {
                        dElement.destroy();
                        dElement = context.drawElement.shift();
                    }
                    context.drawElement = drawElements;
                }, this);
            //#endregion

            //锁定图层
            lockMap(this._stage.content);
            //4.获取controlPoints控制点
            var cpts = this.controlPoints, that = this;
            for (var i = 0, len = cpts.length; i < len; i++) {
                var config = defaultPointSymbol.toConfig();
                var sp = screenPosition({ log: cpts[i][0], lat: cpts[i][1] });  //得到相对于map div offset位置的屏幕坐标点
                var x = sp.x,  //需要在页面绘制，所以换算成
                    y = sp.y;
                //改变控制点，计算用
                cpts[i] = [sp.x,sp.y];
                //控制点显示
                config.x =x;
                config.y =y;
                config.draggable = true;
                config.fill = 'yellow';
                config.radius = 6;
                config.opacity = 1;
                config.id = i;
                var circle = new Circle(config);
                //dragmove
                circle.on('dragmove', function (evt) {
                    //1.更新control Point
                    that.controlPoints[this.attrs.id] = [this.attrs.x, this.attrs.y];
                    //2.计算图形
                    that.movePoint();
                    //3.更新图形
                    var j = 0, len = that.drawElement.length;
                    for (; j < len; j++) {
                        var coodinate = that.shapes[j].getType() === "GeoPolygon" ? that.shapes[j].coordinates[0] : that.shapes[j].coordinates;
                        that.drawElement[j].setPoints(coodinate);
                    }
                    that.editlayer.draw();
                });
                this.editPoints.push(circle);
                this.editlayer.add(circle);
            }
            //重绘layer
            this.editlayer.draw();
        }

        PlotElement.prototype._stopEdit = function (anim, domlayer,complete) {
            //1.停止动画，释放锁定
            //2.移除editlayer图层
            for (var i = 0, len = this.drawElement.length; i < len; i++)
                this.drawElement[i].moveTo(this.canvaslayer);
            this.editlayer.destroy();
            this.canvaslayer.parent.remove(this.editlayer);
            anim.stop();
            this.canvaslayer.draw();
            unlockMap(this._stage.content);
            hook.getValue('viewBox').removeChild(this._stage.content);
            this._stage.destroy();
            //3.保存控制点
            !!complete?complete(this,this.canvaslayer.attrs.y,this.canvaslayer.attrs.x):null;
        }

    });
