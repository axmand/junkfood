/**
*   渲染符号管理类，提供符号配置，符号应用
*   @author yellow date 2014/9/12
*   @class Hmap.BaseType.Symbol
*/

define(['Hobject'], function (Hobject) {
    //功能导入
    var extend = Hobject.BaseFunc.extend;

    var _baseSymbol = function (config) {
        this._init(config);
    }

    _baseSymbol.prototype = {
        //通用初始化函数
        _init: function (config) {
            var _config = config || {};
            this.fill = _config.fill || '#13b5b1';                      //填充颜色
            this.stroke = _config.stroke || "#0068b7";                       //边线颜色,必须和填充色一致
            this.strokeWidth = _config.strokeWidth || '1';    //边线宽度
            this.opacity = _config.opacity || '0.8';                //透明度
            //初始化自定义方法
            this.__init(_config);
        },
        //进一步初始化函数，可被覆写
        __init: function (config) {
        },
        //转换成能识别的config设置
        _toConfig: function () {
            return {
                fill: this.fill,
                stroke: this.stroke,
                opacity: this.opacity,
                strokeWidth: this.strokeWidth,
            };
        }
    }

    //线状符号
    var _lineSymbol = function (config) {
        _baseSymbol.call(this, config);
    }

    extend(_lineSymbol, _baseSymbol);

    _lineSymbol.prototype.__init = function (config) {
        this.tension = config.tension || 0; //值为1，则给定一定的弧度绘制间距较大的点
    }

    _lineSymbol.prototype.toConfig = function () {
        var config = this._toConfig();
        config.tension = this.tension;
        return config;
    }

    //面状符号
    var _polygonSymbol = function (config) {
        _baseSymbol.call(this, config);
    }

    extend(_polygonSymbol, _baseSymbol);

    _polygonSymbol.prototype.__init = function (config) {

    }

    _polygonSymbol.prototype.toConfig = function () {
        return this._toConfig();
    }

    //点状符号
    var _pointSymbol = function (config) {
        _baseSymbol.call(this, config);
    }

    extend(_pointSymbol, _baseSymbol);

    _pointSymbol.prototype.__init = function (config) {
        this.radius = config.radius || 4; //点半径
    }

    _pointSymbol.prototype.toConfig = function () {
        var config = this._toConfig();
        config.radius = this.radius;
        return config;
    }

    //default 符号
    var mLineSymbol = new _lineSymbol({ stroke: '#13b5b1', strokeWidth: 2 }),
        mPolyonSymbol = new _polygonSymbol(),
        mPointSymbol = new _pointSymbol({ stroke: 'black', strokeWidth: 1 });

    return {
        //
        lineSymbol: _lineSymbol,
        polygonSymbol: _polygonSymbol,
        pointSymbol: _pointSymbol,
        //
        defaultLineSymbol: mLineSymbol,
        defaultPolygonSymbol: mPolyonSymbol,
        defaultPointSymbol: mPointSymbol,
    }

});