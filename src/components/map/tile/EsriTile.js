/**
*   对arcgis瓦片支持
*   @author yellow date:2013/8/1
*   @class Hmap.Tile.EsriTile
*/

define(["Hmath", 'Grid', 'Hobject'], function (Hmath, Grid, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    var _arcgisTile = function (args) {
        Grid.call(this, args);
        this.proxy = "src/proxy/arcgis/proxy.ashx?";
    };

    extend(_arcgisTile, Grid);

    /**
    *   加载tile
    *   @method load
    */
    _arcgisTile.prototype.load = function (callback) {
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
    _arcgisTile.prototype.move = function (offsetX, offsetY) {
        this.constructor.__super__.move.call(this, offsetX, offsetY);
        this.addTiles = this.pack(this.addElements);
        this.deleteTiles = this.removeElements;
    }

    /**
    *   覆写基类zoom方法
    *   @method zoom 
    *   @param zoom {Number}
    *   @param wheelEvent {Event}   鼠标滚轮事件
    */
    _arcgisTile.prototype.zoom = function (zoom, wheelEvent) {
        this.constructor.__super__.zoom.call(this, zoom, wheelEvent);
        this.addTiles = this.pack(this.elements);
    }

    /**
    *   打包grid，组织成url集合
    *   url+tile/level/y/x
    */
    _arcgisTile.prototype.pack = function (addElements) {
        var addTiles = [], id, level, element;
        for (var value in addElements) {
            element = addElements[value];
            level = level || element.level, pj = element.pj, pi = element.pi;
            src = this.args.mapurl + "/tile/" + level + "/" + pj + "/" + pi;
            id = level + "_" + pj + "_" + pi;
            addTiles.push([src, element.x, element.y, id]);
        }
        return addTiles;
    }

    return _arcgisTile;
});
