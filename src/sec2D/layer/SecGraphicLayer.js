/**
 *  采用canvas技术制作的矢量绘制图层，
 *  用来绘制一些计算结果，例如克里金插值结果，
 *  只有一个单独的canvas，大小根据矢量对象设置
 *  用途：绘制分析运算结果
 *  @author yellow
 *  @class Hmap.Layer.SecGraphicLayer
 */

define(['SecBaseLayer', 'Hobject', 'Render'], function (SecBaseLayer, Hobject, Render) {

    var extend = Hobject.BaseFunc.extend,
        getId = Hobject.BaseFunc.getId,
        screenPosition;

    var Stage = Render.Stage,
        Raster = Render.Raster,
        Polygon = Render.Polygon,
        Circle = Render.Circle,
        Layer = Render.Layer;

    /**
     * 自定义绘制图层
     * args
     * {
     *      mapData:{
     *           bound：
     *           data:
     *           info:
     *      }
     * }
     */
    var _graphicLayer = function (args) {
        SecBaseLayer.call(this, args);
        var option = args || {};
        this._layer = null;
        if (!!option.mapData && option.mapData.constructor !== Object)
            option.mapData = JSON.parse(option.mapData);
        var mapData = option.mapData || {};
        this.bound = mapData.bound ? JSON.parse(mapData.bound) : null;
        this.graphicData = mapData.data || null;
        this.info = mapData.information || {};
    }

    extend(_graphicLayer, SecBaseLayer);

    /**
    *   添加自定义marker到canvas画布
    *   @method addMarker
    */
    _graphicLayer.prototype.addMarker = function (marker) {

    }

    _graphicLayer.prototype.notice = function (copyElements) {
        var sourceID = copyElements.sourceID;
        if (sourceID === "mousewheel") {
            if (this.bound) {//存在绘制边界，则缩放layer的长宽
                //重绘layer
                var rect = this._calcuteRect();
                this.layer.setWH(rect.width, rect.height);
                //方向
                this.layer.setCanvasXY(rect.y, rect.x);
            }
        }
    }

    _graphicLayer.prototype._calcuteRect = function () {
        if (!!this.bound) {
            var sLoglat = {
                log: this.bound.left,
                lat: this.bound.top,
            };
            var eLoglat = {
                log: this.bound.right,
                lat: this.bound.bottom,
            };
            var ltp = screenPosition(sLoglat),
             rbp = screenPosition(eLoglat),
             width = rbp.x - ltp.x,
             height = rbp.y - ltp.y;
            return {
                width: width,
                height: height,
                x: ltp.x,           //top
                y: ltp.y,            //left
            };
        }
        else {
            return {};
        }
    }

    //创建canvaslayer
    _graphicLayer.prototype._createlayer = function () {
        //1.创建canvas的外包容器,将容器放入
        var _rect = this._calcuteRect(),
            _domlayer = document.createElement('div');
        _domlayer.style.width = this.mapWidth + 'px';
        _domlayer.style.height = this.mapHeight + 'px';
        _domlayer.style.position = "absolute";
        screenPosition = screenPosition || this.args.mapInfo.screenPosition;
        //2.创建stage对象
        this._stage = new Stage({
            id: this.args.layerID,
            container: _domlayer,
            width: this.args.width,
            height: this.args.height,
            //设置buffer区域size,默认为width和height,高速绘制图像
            //bufferSize: 256,
        });
        //3.创建canvas对象
        this._layer = new Layer({
            id: "graphic" + getId(),             //标识位，不重复ID
            width: _rect.width || this.args.width,
            height: _rect.height || this.args.height,
            x: _rect.y || 0,  //x为top
            y: _rect.x || 0,   //y为left
        });
        this._stage.add(this._layer);
        this.domLayer = this._stage.content;
    }

    _graphicLayer.prototype._publish = function () {
        this.complete();
        this.loadcomplete = true;
        var type = this.info.name;
        if (type === "KrigingTask") {
            var raster = new Raster({
                graphicData: this.graphicData,
                symbol: null,
                opacity: 0.6,
            });
            this._layer.add(raster);
            this._layer.draw();
        }
    }

    _graphicLayer.prototype.getType = function () {
        return "SecGraphicLayer"
    }


    return _graphicLayer;

});