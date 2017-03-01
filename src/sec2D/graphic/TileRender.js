/**
*   瓦片渲染器，采用dom元素方式绘制瓦片图层
*   @author yellow
*   @class Hmap.Graphic.TileRender
*/

define(['Hmath', 'Hobject'], function (Hmath, Hobject) {
    var sTransition = Hmath.sTransition,    // 动画
        ua = Hobject.BaseFunc.ua();            //浏览器类型
    var translationFunction = null;             //动画函数
    /**
    *   提供dom元素标签img的操作
    *   @class TileRender
    */
    var _tileRender = function (args) {
        if (!!ua.ie) {
            translationFunction = function (_img) {
                //var transition = new sTransition();
                //transition.animate(_img, 400, function (index) {
                //    var s = Math.sin(index * Math.PI / 50);
                //    _img.style.opacity = s;
                //}, function () {
                //    _img.style.opacity = 1;
                //    delete transition;
                //})
                var style = _img.style,
                setAttribute = style.setAttribute || style.setProperty;
                setAttribute.call(style, '-ms-transition', 'all 0.48s ease');
                setAttribute.call(style, 'opacity', 1);
            }
        } else if (!!ua.chrome) {
            translationFunction = function (_img) {
                var style=_img.style,
                    setAttribute = style.setAttribute || style.setProperty;
                setAttribute.call(style, '-webkit-transition', 'all 0.48s ease');
                setAttribute.call(style, 'opacity', 1);
            }
        }
    }
    /**
    *   添加瓦片
    *   @method addTiles
    *   @parm tiles {Array} 添加的瓦片ID集合
    *   @param domLayer {Dom} 页面div元素
    */
    _tileRender.prototype.addTiles = function (tiles, domLayer) {
        var id = domLayer.id,
            __tile = tiles.shift(),
            //使用documentFragment减少dom重排
            fragment = document.createDocumentFragment();
        while (__tile !== undefined) {
            var img = document.createElement("img"),
                imgId = id + "_" + __tile[3];
            img.id = imgId;
            img.width = img.height = 256;
            img.src = __tile[0];
            img.style.opacity = 0;
            //img.border = '1px solid gray';
            img.onload = function () {
                var _img = this;
                translationFunction(_img);
            }
            img.onerror = function (e) {
                delete this;
            }
            //style
            img.style.verticalAlign = "top";
            img.style.position = "absolute";
            img.style.top = __tile[1] + "px";
            img.style.left = __tile[2] + "px";
            fragment.appendChild(img);
            __tile = tiles.shift();
        };
        domLayer.appendChild(fragment);
    }
    /**
    *   移除瓦片
    *   @method removeTiles
    *   @parm tiles {Array} 移除的瓦片ID集合
    *   @param domLayer {Dom} 页面div元素
    */
    _tileRender.prototype.removeTiles = function (tiles, domLayer) {
        var id = domLayer.id,
            imgID, element;
        var value = tiles.shift();
        while (value !== undefined) {
            imgID = id + "_" + value;
            element = document.getElementById(imgID);
            domLayer.removeChild(element);
            value = tiles.shift();
        }
    }
    /**
    *   移除所有瓦片
    *   @method clearTiles 
    */
    _tileRender.prototype.clearTiles = function (domLayer) {
        while (domLayer.firstChild) {
            var oldNode = domLayer.removeChild(domLayer.firstChild);
            oldNode = null;
        }
    }

    return _tileRender;

});