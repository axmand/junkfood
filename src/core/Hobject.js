/**
*   对javascript对象，值类型的相关操作
*   提供对象序列化方法、对象clone,copy,deepCopy方法
*   @author yellow date:2013/8/20
*   @class Hmap.Core.Hobject
*/
define(function () {

    //#region underScore - BaseFuc
    var ObjProto = Object.prototype, //
        ArrayProto = Array.prototype,
        hasOwnProperty = ObjProto.hasOwnProperty;
        //ID生成器
    var _idCounter = 0, 
        //判断浏览器类型用
        _sys,                     
        _dpi,
        //sington模式
        _hook = {

            //#region 内置方法

            setValue: function (name,value) {
                _hook[name] = value;
            },

            getValue: function (name) {
                return _hook[name] || null;
            },

            //#endregion

            //标绘编辑开关
            plotEditFlag: false,
            //地图div容器框
            mapElement: null,
            //地图图层容器框
            viewBox: null,
            //地理坐标转屏幕坐标
            screenPosition: null,
            //屏幕坐标转地理坐标
            mapPosition: null,
            //地图相对于原始位置的偏转
            domXY:null,
        };

    /**
    *   提供对象操作方法，类似underScore.js
    *   @class Hobject
    */
    var _hobject = function () {
    }
    /*
     * 为array添加初始化属性,
     */
    _hobject.arrayInilization = (function () {
        ArrayProto.max = ArrayProto.max || function () {
            return Math.max.apply(null, this);
        };   //max
        ArrayProto.min = ArrayProto.min || function () {
            return Math.min.apply(null, this);
        };   //min
        ArrayProto.sum = ArrayProto.sum || function () {
            var i, sum;
            for (i = 0, sum = 0; i < this.length; i++) {
                sum += this[i];
            }
            return sum;
        }
        ArrayProto.mean = ArrayProto.mean || function () {
            return this.sum / this.length;
        };   //求平均值
        ArrayProto.pip = ArrayProto.pip || function (x, y) {
            var i, j, c = false;
            for (i = 0, j = this.length - 1; i < this.length; j = i++) {
                if (((this[i][1] > y) != (this[j][1] > y)) &&
                    (x < (this[j][0] - this[i][0]) * (y - this[i][1]) / (this[j][1] - this[i][1]) + this[i][0])) {
                    c = !c;
                }
            }
            return c;
        };   //判断点与多边形关系
        ArrayProto.rep = ArrayProto.rep || function (n) {
            return Array.apply(null, new Array(n)).map(Number.prototype.valueOf, this[0]);
        };
        ArrayProto.dim = ArrayProto._dim || function (flag) {
            if (!!this._dim & !flag) return this._dim; //计算一次后就缓存起来
            var value = this[0], i = 0;
            if (!value) return i;
            while (!!value) {
                i++;
                value = value[0];
            }
            return this._dim = i;
        }; //计算数组维度
    })();
    /**
     * @method ua
     * 判断浏览器类型
     * 得到浏览器类型和版本号
     */
    _hobject.ua = function () {
        if (!!_sys) return _sys;
        else {
            _sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                _sys.ie = ua.match(/msie ([\d.]+)/) || 'IE 11';
            else if (document.getBoxObjectFor)
                _sys.firefox = ua.match(/firefox\/([\d.]+)/) || 'firefox';
            else if (window.MessageEvent && !document.getBoxObjectFor)
                _sys.chrome = ua.match(/chrome\/([\d.]+)/) || 'chrome';
            else if (window.opera)
                _sys.opera = ua.match(/opera.([\d.]+)/) || 'opera';
            else if (window.openDatabase)
                _sys.safari = ua.match(/version\/([\d.]+)/) || 'safari';
        }
        //返回浏览器判断后的结果
        return _sys;
    }

    /**
    *
    *   @初始化添加对象监听器
    */

    _hobject.watch = function (obj, prop, handler) {
        var oldval = obj[prop], newval = oldval,
                    getter = function () {
                        return newval;
                    },
                    setter = function (val) {
                        oldval = newval;
                        handler.call(this, prop, oldval, val);
                        newval = val;
                    };
        if (delete obj[prop]) {
            if (Object.defineProperty)  // ECMAScript 5
            {
                Object.defineProperty(obj, prop, { get: getter, set: setter });
            }
            else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
                Object.prototype.__defineGetter__.call(obj, prop, getter);
                Object.prototype.__defineSetter__.call(obj, prop, setter);
            }
        }
    }

    _hobject.unwatch = function (obj,prop) {
        var val = obj[prop];
        delete obj[prop];
        obj[prop] = val;
    }

    /**
    *   hook对象，存储全局缓存
    *   @attribute
    */
    _hobject.hook = _hook;

    /**
    *    对数组浅拷贝
    *   @method arrayCopy
    *   @param array {Array} 输入待浅拷贝数组
    *   @return  array {Array} 返回浅拷贝后的数组
    */
    _hobject.arrayCopy = function (array) {
        if (!!_sys.chrome) {
            _hobject.arrayCopy = function (array) {
                var result = null;
                result = array.slice(0);
                return result;
            }
        }//chrome slice效率高
        else {
            _hobject.arrayCopy = function (array) {
                var result = null;
                result = array.concat();
                return result;
            }
        }//其他浏览器concat效率高
        arguments.callee(array);
    };
    /**
    *   内置clone函数
    *   @method copy
    *   @param obj {Object} 输入待浅拷贝对象
    *   @return obj {Object} 返回浅拷贝后的对象
    */
    _hobject.copy = function (obj, opts) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();   //附带拷贝object的method
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        if (!!opts) {
            for (var attr1 in opts) {
                if (opts.hasOwnProperty(attr1)) copy[attr1] = copy[attr1] || opts[attr1];
            }
        }
        return copy;
    }
    /**
    *   深拷贝    
   *    支持 object,array,date
    *   @method deepCopy
    *   @param obj {Object}     输入待深拷贝对象、数组，日期类型
    *   @return obj {Object}    返回深拷贝对象、数组，日期类型
    */
    _hobject.deepCopy = function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (obj === null || "object" != typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = _hobject.deepCopy(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = _hobject.copy(obj[attr]);
                }
            }
            return copy;
        }
        throw new Error("不能深拷贝此对象，对象类型不支持");
    };
    /**
    *   去除文本的首位空格
    *   @method trimText
    *   @param input {String} 待处理文本
    */
    _hobject.trimText = (function (isNative) {
        return function (input) {
            return isNative ? isNative.apply(input) : ((input || '') + '').replace(/^\s+|\s+$/g, '');
        }
    })(String.prototype.trim);
    /**
    * 获取当前设备屏幕DPI  
    * @method getScreenDPI
    */
    _hobject.DPI = function () {
        if (!!_dpi) {
            return _dpi;
        } else {
            var arrDPI = new Array();
            if (window.screen.deviceXDPI != undefined) {
                arrDPI[0] = window.screen.deviceXDPI;
                arrDPI[1] = window.screen.deviceYDPI;
            }
            else {
                var tmpNode = document.createElement("DIV");
                tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
                document.body.appendChild(tmpNode);
                arrDPI[0] = parseInt(tmpNode.offsetWidth);
                arrDPI[1] = parseInt(tmpNode.offsetHeight);
                tmpNode.parentNode.removeChild(tmpNode);
            }
            return _dpi = arrDPI[0]; //比例尺是横向的，只用方向的dpi即可
        }
    }
    /**
    *    分析返回object类型(构造函数名)
    *   @method getObjectClass
    *   @param objClass {Object} 待获取类型
    *   @return str {String} 对象的类型描述
    */
    _hobject.getObjectClass = function (objClass) {
        if (objClass && objClass.constructor) {
            var strFun = objClass.constructor.toString();
            var className = strFun.substr(0, strFun.indexOf('('));
            className = className.replace('function', '');
            return className.replace(/(^\s*)|(\s*$)/ig, '');
        }
        return typeof (objClass);
    };
    /**
     * 判断对象内是否含有属性
     * @method has
     * @param obj 待判断的对象
     * @param key 属性值
     */
    _hobject.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    /**
    *   遍历object对象，返回对象属性集合
    *   @method keys
    */
    _hobject.keys = Object.keys || function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_hobject.has(obj, key)) keys.push(key);
        return keys;
    }
    /**
     * @metohd each 
     * 用法举例
     * each(array,function(index,element){},this);
     */
    _hobject.each = function (obj, iterator, context) {
        if (obj == null) return;
        if (ArrayProto.forEach && obj.forEach === ArrayProto.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            var keys = _hobject.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) return;
            }
        }
    }
    /**
     *  获取event的offset距离
     * @method getOffsetXY
     * @param event {Object} 传入鼠标事件，计算鼠标与地图图框所在区域的位置offsetXY
     */
    _hobject.getOffsetXY = function (event) {
        var target = event.target || event.srcElement || {},
            dx = 0, dy = 0,
            offX = event.offsetX, offY = event.offsetY;
        //容器不为viewbox，则向上取父容器，回溯到viewbox为止
        while (target.id !== 'viewbox' & !!target.id) {
            dx = parseInt(target.style.left) || 0;
            dy = parseInt(target.style.top) || 0;
            offX += dx; //left
            offY += dy; //top
            target = target.parentElement || target.parentNode;
        }
        offX = parseInt(offX);
        offY = parseInt(offY);
        return {
            left: offX,
            top: offY,
        }
    }
    /**
    *   每次获取的ID必然保证不同
    *   @method getId
    */
    _hobject.getId = function () {
        return _idCounter++;
    }
    /**
     * 判断对象是否存在/是否为对象类型
     * @method isObject
     * @param obj
     */
    _hobject.isObject = function (obj) {
        return obj === Object(obj);
    }
    _hobject.isFunction = function (obj) {
        return typeof obj === 'function';
    }
    _hobject.isArray = [].isArray || function (obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }
    /**
     * @method extend
     * @param child {Object}
     * @param parent {Object}
     * 复制对象c1的prototype到c2
     * 扩充方法 添加 ctor 和 __spuer__
     */
    _hobject.extend = function (child, parent) {
        for (var key in parent.prototype) {
            if (!(key in child.prototype)) {
                child.prototype[key] = parent.prototype[key];
            }
        }
        child.__super__ = parent.prototype;
        return child;
    }
    /**
     *  函数绑定  
     *  @method bind
     *  @param obj {Object} 绑定上下文
     *  @param func {Function} 绑定函数
     *  @return 绑定后的函数
     */
    _hobject.bind = function (obj, func) {
        return function () {
            return func.apply(obj, arguments);
        }
    }
    /**
     *  扩展target属性
     * @method merge
     */
    _hobject.merge = function () {
        var target = arguments[0] || {}, //第一个参数为target
            i = 1,
            len = arguments.length,
            options,
            name,//属性名
            deep = false;
        //deep copy
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        //target 为string 或 能被deep copy类型
        if (typeof target !== 'object' && !_hobject.isFunction(target)) {
            target = {};
        }
        //只传一个arguments
        if (len === i) {
            target = this;
            --i;
        }
        //
        for (; i < len; i++) {
            if ((options = arguments[i]) != null) {
                //扩展base对象
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy)
                        continue;
                    if (deep && copy) {
                        var clone = src && _hobject.isArray(src) ? src : [];
                        target[name] = _hobject.merge(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    //注册is+Name函数
    _hobject.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
        _hobject['is' + name] = function (obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    //#endregion

    //#region backbones-event

    //基于backbones 的 event 类
    var _events = function () {
        var eventsShim = function () {
            var eventSplitter = /\s+/;
            var eventsApi = function (obj, action, name, rest) {
                if (!name) return true;
                if (typeof name === 'object') {
                    for (var key in name) {
                        obj[action].apply(obj, [key, name[key]].concat(rest));
                    }
                } else if (eventSplitter.test(name)) {
                    var names = name.split(eventSplitter);
                    for (var i = 0, l = names.length; i < l; i++) {
                        obj[action].apply(obj, [names[i]].concat(rest));
                    }
                } else {
                    return true;
                }
            };
            var triggerEvents = function (events, args) {
                var ev, i = -1, l = events.length;
                switch (args.length) {
                    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
                        return;
                    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
                        return;
                    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
                        return;
                    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
                        return;
                    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
                }
            };
            var Events = {
                on: function (name, callback, context) {
                    if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
                    this._events || (this._events = {});
                    var list = this._events[name] || (this._events[name] = []);
                    list.push({ callback: callback, context: context, ctx: context || this });
                    return this;
                },
                once: function (name, callback, context) {
                    if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
                    var self = this;
                    var once = _.once(function () {
                        self.off(name, once);
                        callback.apply(this, arguments);
                    });
                    once._callback = callback;
                    this.on(name, once, context);
                    return this;
                },
                off: function (name, callabck, context) {
                    var list, ev, events, names, i, l, j, k;
                    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
                    if (!name && !callback && !context) {
                        this._events = {};
                        return this;
                    }

                    names = name ? [name] : _.keys(this._events);
                    for (i = 0, l = names.length; i < l; i++) {
                        name = names[i];
                        if (list = this._events[name]) {
                            events = [];
                            if (callback || context) {
                                for (j = 0, k = list.length; j < k; j++) {
                                    ev = list[j];
                                    if ((callback && callback !== ev.callback &&
                                                                     callback !== ev.callback._callback) ||
                                            (context && context !== ev.context)) {
                                        events.push(ev);
                                    }
                                }
                            }
                            this._events[name] = events;
                        }
                    }

                    return this;
                },
                trigger: function (name) {
                    if (!this._events) return this;
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (!eventsApi(this, 'trigger', name, args)) return this;
                    var events = this._events[name];
                    var allEvents = this._events.all;
                    if (events) triggerEvents(events, args);
                    if (allEvents) triggerEvents(allEvents, arguments);
                    return this;
                },
                listenTo: function (obj, name, callback) {
                    var listeners = this._listeners || (this._listeners = {});
                    var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
                    listeners[id] = obj;
                    obj.on(name, typeof name === 'object' ? this : callback, this);
                    return this;
                },
                stopListening: function (obj, name, callback) {
                    var listeners = this._listeners;
                    if (!listeners) return;
                    if (obj) {
                        obj.off(name, typeof name === 'object' ? this : callback, this);
                        if (!name && !callback) delete listeners[obj._listenerId];
                    } else {
                        if (typeof name === 'object') callback = this;
                        for (var id in listeners) {
                            listeners[id].off(name, callback, this);
                        }
                        this._listeners = {};
                    }
                    return this;
                }
            }

            Events.bind = Events.on;
            Events.unbind = Events.off;
            return Events;
        }
        return eventsShim();    //events 返回
    }

    //backbones Event实例
    var mEvents = new _events();

    //#endregion

    return {
        BaseFunc: _hobject,
        Events: mEvents,    //Event
    }

});