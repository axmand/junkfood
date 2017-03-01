/**
*   标绘图形算法
*   @class Hmap.Plot.Algorithm
*/

define(function () {

    var _plotAlgorithm = function (args) {
        var _args = args || {};
        this.minCpt = _args.minCpt || 0;
        this.maxCpt = _args.maxCpt || 0;
        this.ctps = [];
        this._plotElement = null;
        this._inilization();
    }

    /*
    *   初始化算法对象，设置必要的参数
    *   @_inilization
    */
    _plotAlgorithm.prototype._inilization = function () {

    }

    _plotAlgorithm.prototype.getGraphParts = function (ratio) {

    }

    /**
    *   根据算法和中心点，算出geometrys
    *   @method createGeometrys
    */
    _plotAlgorithm.prototype.createGeometrys = function (mapPosition, movePoint) {

    }

    _plotAlgorithm.prototype.getType = function () {
        return 'PlotAlgorithm';
    }

    /**
    *   访问者模式，访问修改被访问者属性
    *   @method visit
    */
    _plotAlgorithm.prototype.visit = function (plotElement) {
        this._plotElement = plotElement || null;
    }

    return _plotAlgorithm;

});
