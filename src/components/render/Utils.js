/**
*   使用underscore部分功能剪辑编写
*   (cherry-picked utilities from underscore.js)
*   @modules Utils
*/

define(function () {
    //功能设置
    var enableTrace = false,  //路径功能
        ids = {},
        stages = [],
        shapes = {},
        traceArrMax = 100,  //记录数上限
        pixelRatio = undefined,
        inDblClickWindow = false,//双击结束编辑等操作
        dblClickWindow=400,
        listenClickTap = false,
        idCounter = 0;

    var CANVAS = 'canvas',
        CONTEXT_2D = '2d',
        OBJECT_ARRAY = '[object Array]',
        OBJECT_NUMBER = '[object Number]',
        OBJECT_STRING = '[object String]',
        PI_OVER_DEG180 = Math.PI / 180,
        DEG180_OVER_PI = 180 / Math.PI,
        HASH = '#',
        EMPTY_STRING = '',
        ZERO = '0',
        RGB_PAREN = 'rgb(',
        COLORS = {
          aqua: [0, 255, 255],
          lime: [0, 255, 0],
          silver: [192, 192, 192],
          black: [0, 0, 0],
          maroon: [128, 0, 0],
          teal: [0, 128, 128],
          blue: [0, 0, 255],
          navy: [0, 0, 128],
          white: [255, 255, 255],
          fuchsia: [255, 0, 255],
          olive: [128, 128, 0],
          yellow: [255, 255, 0],
          orange: [255, 165, 0],
          gray: [128, 128, 128],
          purple: [128, 0, 128],
          green: [0, 128, 0],
          red: [255, 0, 0],
          pink: [255, 192, 203],
          cyan: [0, 255, 255],
          transparent: [255, 255, 255, 0]
        },
        RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;

    var _utils = {
        _isElement: function (obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction: function (obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isObject: function (obj) {
            return (!!obj && obj.constructor == Object);
        },
        _isArray: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_ARRAY;
        },
        _isNumber: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_NUMBER;
        },
        _isString: function (obj) {
            return Object.prototype.toString.call(obj) == OBJECT_STRING;
        },
        /*
         * other utils
         */
        _hasMethods: function (obj) {
            var names = [],
                key;

            for (key in obj) {
                if (this._isFunction(obj[key])) {
                    names.push(key);
                }
            }
            return names.length > 0;
        },
        _isInDocument: function (el) {
            while (el = el.parentNode) {
                if (el == document) {
                    return true;
                }
            }
            return false;
        },
        //}{ 简化arr
        _simplifyArray: function (arr) {
            var retArr = [],
                len = arr.length,
                n, val;
            for (n = 0; n < len; n++) {
                val = arr[n];
                if (this._isNumber(val)) {
                    val = Math.round(val * 1000) / 1000; //四舍五入？？？ 相当于 value+0.5 取整,修补chorme 18的bug
                }
                else if (!this._isString(val)) {1
                    val = val.toString();
                }

                retArr.push(val);
            }
            return retArr;
        },
        /*
         * arg can be an image object or image data
         */
        _getImage: function (arg, callback) {
            var imageObj, canvas, context, dataUrl;
            // if arg is null or undefined
            if (!arg) {
                callback(null);
            }
                // if arg is already an image object
            else if (this._isElement(arg)) {
                callback(arg);
            }
                // if arg is a string, then it's a data url
            else if (this._isString(arg)) {
                imageObj = new Image();
                imageObj.onload = function () {
                    callback(imageObj);
                };
                imageObj.src = arg;
            }
                //if arg is an object that contains the data property, it's an image object
            else if (arg.data) {
                canvas = document.createElement(CANVAS);
                canvas.width = arg.width;
                canvas.height = arg.height;
                _context = canvas.getContext(CONTEXT_2D);
                _context.putImageData(arg, 0, 0);
                this._getImage(canvas.toDataURL(), callback);
            }
            else {
                callback(null);
            }
        },
        //}{ rgb图像转 hex 图像
        _rgbToHex: function (r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        //}{ hex 转换 rgb
        _hexToRgb: function (hex) {
            hex = hex.replace(HASH, EMPTY_STRING);
            var bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        },
        /**
         * return random hex color
         * @method
         * @memberof Kinetic.Util.prototype
         */
        getRandomColor: function () {
            var randColor = (Math.random() * 0xFFFFFF << 0).toString(16);
            while (randColor.length < 6) {
                randColor = ZERO + randColor;
            }
            return HASH + randColor;
        },
        /**
         * return value with default fallback
         * @method
         * @memberof Kinetic.Util.prototype
         */
        get: function (val, def) {
            if (val === undefined) {
                return def;
            }
            else {
                return val;
            }
        },
        /**
         * get RGB components of a color
         * @method
         * @memberof Kinetic.Util.prototype
         * @param {String} color
         * @example
         * // each of the following examples return {r:0, g:0, b:255}<br>
         * var rgb = Kinetic.Util.getRGB('blue');<br>
         * var rgb = Kinetic.Util.getRGB('#0000ff');<br>
         * var rgb = Kinetic.Util.getRGB('rgb(0,0,255)');
         */
        getRGB: function (color) {
            var rgb;
            // color string
            if (color in COLORS) {
                rgb = COLORS[color];
                return {
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2]
                };
            }
                // hex
            else if (color[0] === HASH) {
                return this._hexToRgb(color.substring(1));
            }
                // rgb string
            else if (color.substr(0, 4) === RGB_PAREN) {
                rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
                return {
                    r: parseInt(rgb[1], 10),
                    g: parseInt(rgb[2], 10),
                    b: parseInt(rgb[3], 10)
                };
            }
                // default
            else {
                return {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        // o1 takes precedence over o2
        _merge: function (o1, o2) {
            var retObj = this._clone(o2);
            for (var key in o1) {
                if (this._isObject(o1[key])) {
                    retObj[key] = this._merge(o1[key], retObj[key]);
                }
                else {
                    retObj[key] = o1[key];
                }
            }
            return retObj;
        },
        cloneObject: function (obj) {
            var retObj = {};
            for (var key in obj) {
                if (this._isObject(obj[key])) {
                    retObj[key] = this._clone(obj[key]);
                }
                else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        cloneArray: function (arr) {
            return arr.slice(0);
        },
        _degToRad: function (deg) {
            return deg * PI_OVER_DEG180;
        },
        _radToDeg: function (rad) {
            return rad * DEG180_OVER_PI;
        },
        _capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        error: function (str) {
            throw new Error(KINETIC_ERROR + str);
        },
        warn: function (str) {
            /*
             * IE9 on Windows7 64bit will throw a JS error
             * if we don't use window.console in the conditional
             */
            if (window.console && console.warn) {
                console.warn(KINETIC_WARNING + str);
            }
        },

        //}{ 对象 prototype 属性扩展
        extend: function (c1, c2) {
            for (var key in c2.prototype) {
                if (!(key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        /**
         * adds methods to a constructor prototype
         * @method
         * @memberof Kinetic.Util.prototype
         * @param {Function} constructor
         * @param {Object} methods
         */
        addMethods: function (constructor, methods) {
            var key;

            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
        //获取id
        _getNewId: function () {
            return idCounter++;
        },
        //
        _getControlPoints: function (x0, y0, x1, y1, x2, y2, t) {
            var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)),
                d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
                fa = t * d01 / (d01 + d12),
                fb = t * d12 / (d01 + d12),
                p1x = x1 - fa * (x2 - x0),
                p1y = y1 - fa * (y2 - y0),
                p2x = x1 + fb * (x2 - x0),
                p2y = y1 + fb * (y2 - y0);

            return [p1x, p1y, p2x, p2y];
        },
        _expandPoints: function (p, tension) {
            var len = p.length,
                allPoints = [],
                n, cp;

            for (n = 2; n < len - 2; n += 2) {
                cp = this._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
                allPoints.push(cp[0]);
                allPoints.push(cp[1]);
                allPoints.push(p[n]);
                allPoints.push(p[n + 1]);
                allPoints.push(cp[2]);
                allPoints.push(cp[3]);
            }

            return allPoints;
        },
        //}{ 移除字符串最后一个字符
        _removeLastLetter: function (str) {
            return str.substring(0, str.length - 1);
        },
        //#region 设置初始化
        stages: stages,
        enableTrace: enableTrace,
        traceArrMax: traceArrMax,
        pixelRatio: pixelRatio,
        shapes: shapes,
        listenClickTap: listenClickTap,
        inDblClickWindow: inDblClickWindow,
        dblClickWindow:dblClickWindow,
        //#endregion
        isDragging: function () {
            var dd = require('DragAndDrop').self;
            if (!dd) {
                return false;
            }
            else {
                return dd.isDragging;
            }
        },
        addId: function (node, id) {
            if (id !== undefined) {
                ids[id] = node;
            }
        },
        removeId: function (id) {
            if (id !== undefined) {
                delete ids[id];
            }
        },
    };

    return {
        self: _utils,
    }
});