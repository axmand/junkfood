/**
*   func:engine suitable for autonavi(mapabc)
*   modified at 2014/8/25
*   @author yellow ,liu bing date:2013/8/18
*   @class Hmap.Tile.AnTile
*/

define(['BaseTile', 'Hobject','Grid'], function (BaseTile, Hobject,Grid) {

    var extend = Hobject.BaseFunc.extend;

    var _anTile = function (args) {
        Grid.call(this, args);
        //导航地图
        this.args.mapurl = this.args.mapurl || "http://webrd01.is.autonavi.com/appmaptile?";
        //卫星影像
        //this.args.mapurl = this.args.mapurl || "http://webst02.is.autonavi.com/appmaptile?";
        //自定义服务器地址
        //this.args.mapurl = this.args.mapurl || "http://202.114.148.206:8090/JakMapServer?";
        this.proxy = "src/proxy/autonavi/proxy.ashx?";
    };
    //
    extend(_anTile, Grid);

    /**
    *   加载tile
    *   @method load
    */
    _anTile.prototype.load = function (callback) {
        //计算需要加载的tile
        var tileArry = this.pack(this.elements);
        !!callback ? callback(tileArry) : null;
    }

    /**
    *   地图移动时，重新计算
    *   @method move
    *   @parm offsetX {Number} left 方向坐标偏移量
    *   @parm offsetY {Number} top 方向坐标偏移量
    */
    _anTile.prototype.move = function (offsetX, offsetY) {
        this.constructor.__super__.move.call(this,offsetX, offsetY);
        this.addTiles = this.pack(this.addElements);
        this.deleteTiles = this.removeElements;
    }

    /**
    *   覆写基类zoom方法
    *   @method zoom 
    *   @param zoom {Number}
    *   @param wheelEvent {Event}   鼠标滚轮事件
    */
    _anTile.prototype.zoom = function (zoom, wheelEvent) {
        this.constructor.__super__.zoom.call(this, zoom, wheelEvent);
        this.addTiles = this.pack(this.elements);
    }

    /**
    *   打包grid，组织成url集合
    *   x=  y= z=
    */
    _anTile.prototype.pack = function (addElements) {
        var addTiles = [], id, level,element;
        for (var value in addElements) {
            element = addElements[value];
            level =level||element.level, pj = element.pj, pi = element.pi;
            src = this.args.mapurl + "x=" + pi + "&y=" + pj + "&z=" + level + "&lang=zh_cn&size=1&scale=1&style=8";
            id = level + "_" + pj + "_" + pi;
            addTiles.push([src, element.x, element.y, id]);
        }
        return addTiles;
    }

    return _anTile;
  
});