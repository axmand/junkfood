/*
*   func:GIS projection,define transform and dynamic transform projection
*   @class projection
*   @author:yellow date:2013/10/14
*/

define(['proj4js'],function () {
    
    var _baseProjection = function (projCode,options) {
        this.proj = null;                           //pro4js对象
        this.projCode = null;                   //投影编码
        titleRegEx = /\+title=[^\+]*/;      //从proj4js的expression里取到tiltle
        //默认投影
        this.defaults = {
            "EPSG:4326": {
                units: "degrees",
                maxExtent: [-180, -90, 180, 90],
                yx:true,
            },
            "CRS:84": {
                units: "degrees",
                maxExtent:[-180,-90,180,90],
            },
            "EPSG:900913": {
                units: "m",
                maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            },
        }
        //投影变形空对象，容纳自定义投影集合
        this.transforms={};
    }

    _baseProjection.prototype.initialize = function (projCode, options) {
        //Geo object
        this.projCode = projCode;
        if (typeof Proj4js == 'object') this.proj = new Proj4js.Proj(projCode);
    }

    _baseProjection.prototype.getCode = function () {
        return this.proj ? this.proj.srsCode : this.projCode;
    }

    _baseProjection.prototype.getUnits = function () {
        return this.proj ? this.proj.units : null;
    }

    _baseProjection.prototype.toString = function () {
        return this.getCode();
    }

    _baseProjection.prototype.equals = function (projection) {
        var p = projection, equals = false;
        if (p) {
            if (!(p instanceof _baseProjection)) p = new _baseProjection(p);
        }
        return equals;
    }

    _baseProjection.prototype.destory = function () {
        delete this.proj;
        delete this.projCode;
    }

    _baseProjection.prototype.getType = function () {
        return "BaseProjection";
    }

    /*
    *   投影变换部分
    */

    //增加投影变换
    _baseProjection.prototype.addTransform = function (from, to, method) {
        if (method === this.nullTransform) {
            var defaults = this.defaults[form];
            if (defaults && !this.defaults[to])
                this.defaults[to] = defaults;
        }
        if (!this.transforms[from])
            this.transforms[from] = {};
        this.transforms[from][to] = method;
    }

    //投影变换
    _baseProjection.prototype.transform = function (point, source, dest) {
        if (source && dest) {
            if (!(source instanceof _baseProjection))
                source = new _baseProjection(source);
            if(!(dest instanceof _baseProjection))
                dest = new _baseProjection(dest);
            if (source.proj && dest.proj)
                point = Proj4js.transform(source.proj, dest.proj, point);
            else {
                var sourceCode = source.getCode(), destCode = dest.getCode();
                var transforms = this.transforms;
                if (transforms[sourceCode] && transforms[sourceCode][destCode])
                    transforms[sourceCode][destCode](point);
            }
            //
        }
        return point;
    }

    //不转换点
    _baseProjection.prototype.nullTransform = function (point) {
        return point;
    }

    return _baseProjection;

});