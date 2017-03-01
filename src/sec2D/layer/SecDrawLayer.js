/*
*   绘制图层，用来完成矢量绘制
*   @author:yellow  date:2013/8/31
*   @class Hmap.Layer.SecDrawlayer
*/

define(['SecBaseLayer', 'Render', 'SecDrawInteractive', 'Hobject', 'GeoElement','MapRender','Symbol'],
    function (SecBaseLayer, Render, SecDrawInteractive, Hobject, GeoElement, MapRender,Symbol) {
        //render 的 stage 类，创建 canvas 绘制舞台
        var Stage = Render.Stage,
            Layer = Render.Layer,
            //事件注册机
            SecDrawInteractive = SecDrawInteractive;    
        var extend = Hobject.BaseFunc.extend,
            bind = Hobject.BaseFunc.bind;
        var screenPosition,
            mapPosition;

        var _secDrawlayer = function (args) {
            SecBaseLayer.call(this, args);
            //GeoElement的集合
            this._geoElements = [];
            //PlotElement的集合
            this._plotElements = [];
            //标绘对象缓存
            this._cache = {};
            //Marker的集合
            this._markers = [];
            //矢量地图渲染器
            this._mapRender = null;
            this._stage = null;      
            this._layer = null;
            this._secDrawInteractive = null;
            this.layer = {
                layer: null,
                level:null,
            };
        };

        extend(_secDrawlayer, SecBaseLayer);

        //#region 内置实现或继承实现

        _secDrawlayer.prototype.notice = function (copyElements) {
            if (copyElements.sourceID === "mousemove") {
                if (!isNaN(copyElements.x) || !isNaN(copyElements.y)) {
               
                }
            } else if (copyElements.sourceID === 'mouseup') { //弹起时，重置canvas位置
                if (!isNaN(copyElements.x) || !isNaN(copyElements.y)) {
                    var left = -1 * copyElements.x, top = -1 * copyElements.y;
                    var children = this._layer.children;
                    this._layer.setCanvasXY(top, left);
                    children.move({ x: copyElements.x - this.layerInfo.bfoffx, y: copyElements.y - this.layerInfo.bfoffy });
                    this._layer.draw();
                }
            } else if (copyElements.sourceID === 'mousewheel') {
                this.layer.level = this.args.mapInfo.tileLevel;
                this.update();
            }
        }

        //绘制geoElements
        _secDrawlayer.prototype._drawGeoElement = function (geoElements) {
            var geoElements = geoElements || this._geoElements,
                len = geoElements.length,
                geoElement, i, drawGeoElements = [], typeName,
                cache;
            for (i = 0; i < len; i++) {
                geoElement = geoElements[i];
                typeName = geoElement.geometry.getType();
                if (typeName === 'GeoPoint') {
                    geoElement.geometry.drawCoordinates = [[geoElement.geometry.coordinates[0], geoElement.geometry.coordinates[1]]];
                } else if (typeName === 'GeoPolygon') {
                    geoElement.geometry.drawCoordinates = geoElement.geometry.coordinates;
                } else if (typeName === 'GeoLineString') {
                    geoElement.geometry.drawCoordinates = [geoElement.geometry.coordinates];
                }
                drawGeoElements.push(geoElement);
            } 
            //重绘
            this._mapRender.renderGeometry(this.layer, drawGeoElements, null, this);
        }

        _secDrawlayer.prototype._drawPlotElement = function (plotElements) {
            var plotElements = plotElements || this._plotElements,
                len = plotElements.length,
                plotElement, i, typeName,
                cache;
            //
            for (i = 0; i < len; i++) {
                var drawGeoElements = [];
                plotElement = plotElements[i];
                var j=0,len2=plotElement.shapes.length,typeName;
                for (; j < len2; j++) {
                    var shape = plotElement.shapes[j];
                    typeName = shape.getType();
                    if (typeName === 'GeoPoint') {
                        shape.drawCoordinates = [[shape.coordinates[0], shape.coordinates[1]]];
                    } else if (typeName === 'GeoPolygon') {
                        shape.drawCoordinates = shape.coordinates;
                    } else if (typeName === 'GeoLineString') {
                        shape.drawCoordinates = [shape.coordinates];
                    }
                    drawGeoElements.push(shape);
                }
                this._mapRender.renderGeometry(this.layer, drawGeoElements, function (features, layerElement, context, drawElements) {
                    plotElement.drawElement = drawElements;
                    context._secDrawInteractive.addAction(plotElement);
                }, this);
            }
            
        }

        _secDrawlayer.prototype._publish = function () {
            this.complete();
        }

        _secDrawlayer.prototype._iniEvent = function () {
            this._secDrawInteractive = new SecDrawInteractive({
                domLayer: this.domLayer,
                mapID: this.args.mapID,
                layerInfo: this.layerInfo,
                stage: this._stage,
                layer: this._layer,
                stroeData: bind(this, this.stroeData),
                screenPosition: screenPosition,
                mapPosition: mapPosition,
            });
        }

        _secDrawlayer.prototype._createlayer = function () {
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
            });
            this._layer = new Layer({
                width: this.mapWidth,
                height: this.mapHeight,
            });
            this._stage.add(this._layer);
            //
            this.layer.layer = this._layer;
            //计算屏幕坐标用
            mapPosition = mapPosition || this.args.mapInfo.mapPosition2;
            screenPosition = screenPosition || this.args.mapInfo.screenPosition;
            this._mapRender = new MapRender({
                stage: this._stage,
                mapInfo: this.args.mapInfo,
            });
            //返回layer的canvas图层
            this.domLayer = this._stage.content;
        }

        _secDrawlayer.prototype._drawMarker = function (marker) {
            var markers = !!marker ? [marker] : this._markers;
            this._mapRender.renderMarkers(this.layer, markers);
        }

        _secDrawlayer.prototype.getType = function () {
            return "SecDrawLayer";
        }

        _secDrawlayer.prototype.moveTop = function () {
            //1.获取父容器
            var parent = this.domLayer.parentNode;
            if (!parent) return;
            var lastChild = document.createElement("div");
            parent.appendChild(lastChild);
            //2.移动到父容器顶端
            //parent.insertBefore(clone, firstChild);
            parent.replaceChild(this.domLayer, lastChild);
        }

        _secDrawlayer.prototype.moveBottom = function () {
            this._layer.moveToBottom();
        }

        //#endregion

        /**
        *   添加自定义marker
        *   @method addMarker
        */
        _secDrawlayer.prototype.addMarker = function (marker) {
            //1.加入marker集合
            this._markers.push(marker);
            //2.绘制当前marker
            this._drawMarker(marker);
        }

        /**
        *   刷新矢量图层
        *   @method update
        */
        _secDrawlayer.prototype.update = function () {
            //绘制
            this.clear();
            //绘制geometry
            this._drawGeoElement();
            //重绘标绘 ploElement
            this._drawPlotElement();
            //绘制marker
            this._drawMarker();
        }

        /**
        *   清理矢量图层内的所有元素
        *   @method clear
        */
        _secDrawlayer.prototype.clear = function () {
            var children = this._layer.children,
                child = children.shift();
            while (child) {
                child.destroy();
                child = children.shift();
            }
        }

        /**
        *   鼠标绘制完成后的回调
        *   如果对象已被缓存，则修改对象即可，不用重新缓存
        *   @method stroeData
        */
        _secDrawlayer.prototype.stroeData = function (tyepName, element) {
            if (!this._cache[element.id]) {
                this._cache[element.id] = element;
                if (tyepName === 'PlotElement') {
                    this._plotElements.push(this._cache[element.id]);
                } else if (tyepName === 'GeoElement') {
                    this._geoElements.push(this._cache[element.id]);
                }
            }
        }

        return _secDrawlayer;

    });
