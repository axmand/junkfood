/**
*   地图标注，使用示例：
*   var marker=new Hmap.BaseType.Marker({
*           content:html
*           position:[x,y]
*           markerStyle:  //MARKER_STYLE枚举
*    });
*   @class Hmap.BaseType.Marker
*/

define(['Hobject', 'GeoElement', 'GeoPoint'], function (Hobject, GeoElement, GeoPoint) {
    
    var MARKER_STYLE = {
        TEXT: 0,                       //文字标记
        TEXTANDGRAPH: 1,     //文字和图形标记
        IMAGE: 2,                    //图像标记
        STAR:3,                    //图形标记
    }

    var extend = Hobject.BaseFunc.extend;

    var _marker = function (opts) {
        var _opts = opts || {};
        GeoElement.call(this);
        this.content = _opts.content;
        this.position = _opts.position;
        this.markerStyle = _opts.style || MARKER_STYLE.STAR;
    }

    extend(_marker, GeoElement);
    
    /**
    *   获取对象类型名称
    *   @method getType
    */
    _marker.prototype.getType = function () {
        return 'Marker';
    }

    return {
        MARKER_STYLE: MARKER_STYLE,
        self:_marker,
    }

});