/**
*   矩形边界
*   @author yellow date:2013/11/27
*   @class Hmap.BaseType.Bound
*/

define(function () {

    var _procCode = 3857;

    var _bound = function (top, left, bottom, right, proCode) {
        this.proCode = proCode || _procCode;
        if (this.proCode === _procCode) {
            //}{ yellow javascript bug 若值为0，则系统认为其类型 undefined
            //修改此bug 方法一. value+0.0000001;
            //                方法二. value为string
            this.top = top;
            this.left = left;
            this.bottom = bottom;
            this.right = right;
        }
        else {
            this.top = top || 20037508.3427892;
            this.left = left || -20037508.3427892;
            this.bottom = bottom || -20037508.3427892;
            this.right = right || 20037508.3427892;
        } 
        //判断属于 南-北-东-西 半求后得到矩形的max点和min点
        this._cExtremum();
    }

    //计算bound的极值
    _bound.prototype._cExtremum=function(){
        this.minX=this.left;
        this.minY=this.bottom;
        this.maxX=this.right;
        this.maxY = this.top;
        //计算分辨率(经、纬度方向分别计算)
        this.resoltionX = (this.right - this.left) / 256;
        this.resoltionY = (this.top - this.bottom) / 256;
        //常用值，2个单位分辨率
        this.resoltionDX = this.resoltionX * 5;
        this.resoltionDY = this.resoltionY * 5;
    }

    _bound.fromArray = function (array) {
        if (Object.prototype.toString.call(array) === '[object Array]') {
            return new _bound(array[0], array[1], array[2], array[3]);
        }
    }
    
    _bound.prototype.toArray = function () {
        return [this.top, this.left, this.bottom, this.right];
    }
    /**
     * 取两个bound的并集，返回新的bound
     * @method concat
     */
    _bound.prototype.concat = function (bound) {
        //传入的bound对象为空，则返回本bound的复制值
        if (!bound)
            return new _bound(this.top, this.left, this.bottom, this.right);
        //
        var _bottom = this.bottom < bound.bottom ? this.bottom : bound.bottom,
           _top = this.top < bound.top ? bound.top : this.top,
           _left = this.left < bound.left ? this.left : bound.left,
           _right = this.right < bound.right ? bound.right : this.right;
        return new _bound(_top,_left, _bottom, _right);
    }
    /**
     *  转换为polygon数组
     *  扩充绘制区域，扩充范围为10个像素
     * @method toPolygon 
     * @param percent {Object} 边线扩充百分比,默认为10px
     * @returns {Array} [[],[],[],[]]
     */
    _bound.prototype.toPolygon = function () {
        //根据正负经纬度计算，2个像素扩充度另行计算
        l = this.left - this.resoltionDX;
        r = this.right + this.resoltionDX;
        b = this.bottom - this.resoltionDY;
        t = this.top + this.resoltionDY;
        return [[l, t], [l, b], [r, b], [r, t]];
    }
    /**
     *  判断当前bound与被比较bound是否相交
     *  边框扩大2个像素比率经纬度
     *  @method intersection 
     *  @return {Boolean} 返回判断结果
     */
    _bound.prototype.intersection = function (bound) {
        //
        var _maxX = this.maxX +this.resoltionDX,
            _maxY = this.maxY+this.resoltionDY,
            _minX = this.minX -this.resoltionDX,
            _minY = this.minY -this.resoltionDY;
        //
        var minx = Math.max(_minX, bound.minX),
            miny = Math.max(_minY, bound.minY),
            maxx = Math.min(_maxX, bound.maxX),
            maxy = Math.min(_maxY, bound.maxY);
        //公式一：判断矩形相交
        var flag = (minx > maxx) || (miny > maxy);//两个矩形不相交
        //公式二：计算公共部分矩形面积（过于消耗性能）
        //公式三：两个矩形的重心距离在X和Y轴上都小于两个矩形长或宽的一半之和.分两次判断
        return !flag;
    }
    /**
     * 
     */
    _bound.prototype.clip=function(bound){

    }
    /**
    *   获取bound中心点坐标
    *   @method center
    */
    _bound.prototype.center = function () {
        return [(this.right+this.left)/2,(this.top+this.bottom)/2];
    }

    return _bound;
    
});