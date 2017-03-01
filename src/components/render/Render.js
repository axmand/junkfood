
/**
*
*   主入口，外界只需引入此模块即可使用内部功能
*   @modules Render
*/

define(['DragAndDrop', 'EditAndSave','Utils', 'Collection', 'Transform', 'Tween',
             'Circle', 'Polygon',  'Canvas', 'Container','Animation',
             'Context', 'Factory', 'Layer', 'Node', 'Render', 'Stage',
             'Heat', 'Line', 'Sprite', 'RePolygon', 'Star', 'Raster'
            ], 
    function (DragAndDrop, EditAndSave,Utils, Collection, Transform, Tween,
                   Circle, Polygon, Canvas, Container,Animation,
                   Context, Factory, Layer, Node, Render, Stage,
                   Heat, Line, Sprite, RePolygon, Star, Raster
            ) {

        var _stages = Utils.self.stages, //stage集合{Array}
            _version="1.0.0";//版本号

        var _setting={
        traceArrMax:Utils.self.traceArrMax,              //动画轨迹记录数上限
        dblClickWindow:Utils.self.dblClickWindow,   //双击window时间间隔
        pixelRatio:Utils.self.pixelRatio,                      //像素比率，在不同的设备上比率不同
    };
     
        // 检测浏览器类型
        var UA = (function () {
            var ua = navigator.userAgent.toLowerCase(),
                match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                              /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                              /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                              /(msie) ([\w.]+)/.exec(ua) ||
                              ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                              [];

            return {
                browser: match[1] || '',
                version: match[2] || '0'
            };

    })();

        //#region 映射绘制对象

        var _stage = Stage.self,
            _animation = Animation.self,
            _circle = Circle.self,
            _heat = Heat.self,
            _line = Line.self,
            _layer = Layer.self,
            _regularPolygon = RePolygon.self,
            _polygon = Polygon.self,
            _star = Star.self,
            _raster = Raster.self,
            _sprite = Sprite.self;
        //#endregion

        return {

            //#region 类型
            Stage: _stage,
            Animation: _animation,
            Circle: _circle,
            Heat: _heat,
            Layer:_layer,
            Line: _line,
            Polygon: _polygon,
            Sprite: _sprite,
            Raster:_raster,
            RegularPolygon: _regularPolygon,
            Star: _star,
            //#endregion

            //#region 变量
            Stages: _stages,
            Setting: _setting,
            Version: _version,
            UA: UA,
            //#endregion

        };

});