/**
*   瓦片图层，加载支持wms服务的瓦片，包括
*   arcgis server,geoserver,高德地图,JakMap Server (Jakmap引擎提供的mapServer)
*   @author yellow date:2013/7/10
*   @class Hmap.Layer.SecTileLayer
*/
define(['SecBaseLayer', 'Hobject'], function (SecBaseLayer, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    //支持的瓦片类型枚举
    var TILETYPE = {
        ESRI: "esri",
        BAIDU: "baidu",
        MAPABC: "mapabc",
        TMAP: "tmap",
        BING:'bing',
    };

    var _secTileLayer = function (args) {
        SecBaseLayer.call(this, args);
        this.tiles = null;
    };

    extend(_secTileLayer, SecBaseLayer);

    _secTileLayer.prototype.getType = function () {
        return "SecTileLayer";
    };

    _secTileLayer.prototype._createTiles = function (type) {
        var _tiles, that = this;
        //接收tile变动之后的回调
        function tileCallback(copyTiles, copyDeleteTiles) {
            that.mapObjCallback(copyTiles, copyDeleteTiles);
        }
        //初始化参数
        var args = {
            loglat: this.args.loglat,
            level: this.args.level,
            width: this.args.width,
            height: this.args.height,
            domXY: this.args.mapInfo.domXY,
            //
            mapurl: this.args.mapurl,
            domLayer: this.domLayer,
            mapObjcallback: tileCallback,
        }
        switch (type) {
            case TILETYPE.ESRI:
                var EsriTile = require('EsriTile');
                _tiles = new EsriTile(args);
                break;
            case TILETYPE.MAPABC:
                var ANTile = require('ANTile');
                _tiles = new ANTile(args);
                break;
            default:
                break;
        }
        return _tiles;
    }

    _secTileLayer.prototype._createlayer = function () {
        var _layer = document.createElement("div");
        //设置layer的属性
        _layer.id = this.args.layerID;
        _layer.style.position = "absolute";
        _layer.style.width = this.mapWidth + "px";
        _layer.style.height = this.mapHeight + "px";
        this.domLayer = _layer;
        //tiles为tileslayer
        this.tiles = this._createTiles(this.args.type);
    }

    //layer里提供draw tile方法
    _secTileLayer.prototype._publish = function () {
        this.tiles.load(this.complete);
    };

    return{
        self:_secTileLayer,
        TILETYPE:TILETYPE,
    }

});