define("EventListener", [],
function () {
    var e = function (e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n
    },
    t = function (e, t, n) {
        e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent ? e.detachEvent("on" + t, n) : e["on" + t] = null
    };
    return {
        AddListener: e,
        RemoveListener: t
    }
}),
define("Hobject", [],
function () {
    var e = Object.prototype,
    t = Array.prototype,
    n = e.hasOwnProperty,
    r = 0,
    i, s, o = {
        setValue: function (e, t) {
            o[e] = t
        },
        getValue: function (e) {
            return o[e] || null
        },
        plotEditFlag: !1,
        mapElement: null,
        viewBox: null,
        screenPosition: null,
        mapPosition: null,
        domXY: null
    },
    u = function () { };
    u.arrayInilization = function () {
        t.max = t.max ||
        function () {
            return Math.max.apply(null, this)
        },
        t.min = t.min ||
        function () {
            return Math.min.apply(null, this)
        },
        t.sum = t.sum ||
        function () {
            var e, t;
            for (e = 0, t = 0; e < this.length; e++) t += this[e];
            return t
        },
        t.mean = t.mean ||
        function () {
            return this.sum / this.length
        },
        t.pip = t.pip ||
        function (e, t) {
            var n, r, i = !1;
            for (n = 0, r = this.length - 1; n < this.length; r = n++) this[n][1] > t != this[r][1] > t && e < (this[r][0] - this[n][0]) * (t - this[n][1]) / (this[r][1] - this[n][1]) + this[n][0] && (i = !i);
            return i
        },
        t.rep = t.rep ||
        function (e) {
            return Array.apply(null, new Array(e)).map(Number.prototype.valueOf, this[0])
        },
        t.dim = t._dim ||
        function (e) {
            if (!!this._dim & !e) return this._dim;
            var t = this[0],
            n = 0;
            if (!t) return n;
            while (!!t) n++,
            t = t[0];
            return this._dim = n
        }
    }(),
    u.ua = function () {
        if (!i) {
            i = {};
            var e = navigator.userAgent.toLowerCase();
            return !!window.ActiveXObject || "ActiveXObject" in window ? i.ie = e.match(/msie ([\d.]+)/) || "IE 11" : document.getBoxObjectFor ? i.firefox = e.match(/firefox\/([\d.]+)/) || "firefox" : window.MessageEvent && !document.getBoxObjectFor ? i.chrome = e.match(/chrome\/([\d.]+)/) || "chrome" : window.opera ? i.opera = e.match(/opera.([\d.]+)/) || "opera" : window.openDatabase && (i.safari = e.match(/version\/([\d.]+)/) || "safari"),
            i
        }
        return i
    },
    u.watch = function (e, t, n) {
        var r = e[t],
        i = r,
        s = function () {
            return i
        },
        o = function (e) {
            r = i,
            n.call(this, t, r, e),
            i = e
        };
        delete e[t] && (Object.defineProperty ? Object.defineProperty(e, t, {
            get: s,
            set: o
        }) : Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__ && (Object.prototype.__defineGetter__.call(e, t, s), Object.prototype.__defineSetter__.call(e, t, o)))
    },
    u.unwatch = function (e, t) {
        var n = e[t];
        delete e[t],
        e[t] = n
    },
    u.hook = o,
    u.arrayCopy = function (e) {
        i.chrome ? u.arrayCopy = function (e) {
            var t = null;
            return t = e.slice(0),
            t
        } : u.arrayCopy = function (e) {
            var t = null;
            return t = e.concat(),
            t
        },
        arguments.callee(e)
    },
    u.copy = function (e, t) {
        if (null == e || "object" != typeof e) return e;
        var n = e.constructor();
        for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
        if (!!t) for (var i in t) t.hasOwnProperty(i) && (n[i] = n[i] || t[i]);
        return n
    },
    u.deepCopy = function (e) {
        if (e === null || "object" != typeof e) return e;
        if (e instanceof Date) {
            var t = new Date;
            return t.setTime(e.getTime()),
            t
        }
        if (e instanceof Array) {
            var t = [];
            for (var n = 0,
            r = e.length; n < r; ++n) t[n] = u.deepCopy(e[n]);
            return t
        }
        if (e instanceof Object) {
            var t = {};
            for (var i in e) e.hasOwnProperty(i) && (t[i] = u.copy(e[i]));
            return t
        }
        throw new Error("不能深拷贝此对象，对象类型不支持")
    },
    u.trimText = function (e) {
        return function (t) {
            return e ? e.apply(t) : ((t || "") + "").replace(/^\s+|\s+$/g, "")
        }
    }(String.prototype.trim),
    u.DPI = function () {
        if (!s) {
            var e = new Array;
            if (window.screen.deviceXDPI != undefined) e[0] = window.screen.deviceXDPI,
            e[1] = window.screen.deviceYDPI;
            else {
                var t = document.createElement("DIV");
                t.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden",
                document.body.appendChild(t),
                e[0] = parseInt(t.offsetWidth),
                e[1] = parseInt(t.offsetHeight),
                t.parentNode.removeChild(t)
            }
            return s = e[0]
        }
        return s
    },
    u.getObjectClass = function (e) {
        if (e && e.constructor) {
            var t = e.constructor.toString(),
            n = t.substr(0, t.indexOf("("));
            return n = n.replace("function", ""),
            n.replace(/(^\s*)|(\s*$)/ig, "")
        }
        return typeof e
    },
    u.has = function (e, t) {
        return n.call(e, t)
    },
    u.keys = Object.keys ||
    function (e) {
        if (e !== Object(e)) throw new TypeError("Invalid object");
        var t = [];
        for (var n in e) u.has(e, n) && t.push(n);
        return t
    },
    u.each = function (e, n, r) {
        if (e == null) return;
        if (t.forEach && e.forEach === t.forEach) e.forEach(n, r);
        else if (e.length === +e.length) {
            for (var i = 0,
            s = e.length; i < s; i++) if (n.call(r, e[i], i, e) === breaker) return
        } else {
            var o = u.keys(e);
            for (var i = 0,
            s = o.length; i < s; i++) if (n.call(r, e[o[i]], o[i], e) === {}) return
        }
    },
    u.getOffsetXY = function (e) {
        var t = e.target || e.srcElement || {},
        n = 0,
        r = 0,
        i = e.offsetX,
        s = e.offsetY;
        while (t.id !== "viewbox" & !!t.id) n = parseInt(t.style.left) || 0,
        r = parseInt(t.style.top) || 0,
        i += n,
        s += r,
        t = t.parentElement || t.parentNode;
        return i = parseInt(i),
        s = parseInt(s),
        {
            left: i,
            top: s
        }
    },
    u.getId = function () {
        return r++
    },
    u.isObject = function (e) {
        return e === Object(e)
    },
    u.isFunction = function (e) {
        return typeof e == "function"
    },
    u.isArray = [].isArray ||
    function (e) {
        return Object.prototype.toString.call(e) == "[object Array]"
    },
    u.extend = function (e, t) {
        for (var n in t.prototype) n in e.prototype || (e.prototype[n] = t.prototype[n]);
        return e.__super__ = t.prototype,
        e
    },
    u.bind = function (e, t) {
        return function () {
            return t.apply(e, arguments)
        }
    },
    u.merge = function () {
        var e = arguments[0] || {},
        t = 1,
        n = arguments.length,
        r,
        i,
        s = !1;
        typeof e == "boolean" && (s = e, e = arguments[1] || {},
        t = 2),
        typeof e != "object" && !u.isFunction(e) && (e = {}),
        n === t && (e = this, --t);
        for (; t < n; t++) if ((r = arguments[t]) != null) for (i in r) {
            src = e[i],
            copy = r[i];
            if (e === copy) continue;
            if (s && copy) {
                var o = src && u.isArray(src) ? src : [];
                e[i] = u.merge(s, o, copy)
            } else copy !== undefined && (e[i] = copy)
        }
        return e
    },
    u.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"],
    function (e) {
        u["is" + e] = function (t) {
            return toString.call(t) == "[object " + e + "]"
        }
    });
    var a = function () {
        var e = function () {
            var e = /\s+/,
            t = function (t, n, r, i) {
                if (!r) return !0;
                if (typeof r == "object") for (var s in r) t[n].apply(t, [s, r[s]].concat(i));
                else {
                    if (!e.test(r)) return !0;
                    var o = r.split(e);
                    for (var u = 0,
                    a = o.length; u < a; u++) t[n].apply(t, [o[u]].concat(i))
                }
            },
            n = function (e, t) {
                var n, r = -1,
                i = e.length;
                switch (t.length) {
                    case 0:
                        while (++r < i) (n = e[r]).callback.call(n.ctx);
                        return;
                    case 1:
                        while (++r < i) (n = e[r]).callback.call(n.ctx, t[0]);
                        return;
                    case 2:
                        while (++r < i) (n = e[r]).callback.call(n.ctx, t[0], t[1]);
                        return;
                    case 3:
                        while (++r < i) (n = e[r]).callback.call(n.ctx, t[0], t[1], t[2]);
                        return;
                    default:
                        while (++r < i) (n = e[r]).callback.apply(n.ctx, t)
                }
            },
            r = {
                on: function (e, n, r) {
                    if (!t(this, "on", e, [n, r]) || !n) return this;
                    this._events || (this._events = {});
                    var i = this._events[e] || (this._events[e] = []);
                    return i.push({
                        callback: n,
                        context: r,
                        ctx: r || this
                    }),
                    this
                },
                once: function (e, n, r) {
                    if (!t(this, "once", e, [n, r]) || !n) return this;
                    var i = this,
                    s = _.once(function () {
                        i.off(e, s),
                        n.apply(this, arguments)
                    });
                    return s._callback = n,
                    this.on(e, s, r),
                    this
                },
                off: function (e, n, r) {
                    var i, s, o, u, a, f, l, c;
                    if (!this._events || !t(this, "off", e, [callback, r])) return this;
                    if (!e && !callback && !r) return this._events = {},
                    this;
                    u = e ? [e] : _.keys(this._events);
                    for (a = 0, f = u.length; a < f; a++) {
                        e = u[a];
                        if (i = this._events[e]) {
                            o = [];
                            if (callback || r) for (l = 0, c = i.length; l < c; l++) s = i[l],
                            (callback && callback !== s.callback && callback !== s.callback._callback || r && r !== s.context) && o.push(s);
                            this._events[e] = o
                        }
                    }
                    return this
                },
                trigger: function (e) {
                    if (!this._events) return this;
                    var r = Array.prototype.slice.call(arguments, 1);
                    if (!t(this, "trigger", e, r)) return this;
                    var i = this._events[e],
                    s = this._events.all;
                    return i && n(i, r),
                    s && n(s, arguments),
                    this
                },
                listenTo: function (e, t, n) {
                    var r = this._listeners || (this._listeners = {}),
                    i = e._listenerId || (e._listenerId = _.uniqueId("l"));
                    return r[i] = e,
                    e.on(t, typeof t == "object" ? this : n, this),
                    this
                },
                stopListening: function (e, t, n) {
                    var r = this._listeners;
                    if (!r) return;
                    if (e) e.off(t, typeof t == "object" ? this : n, this),
                    !t && !n && delete r[e._listenerId];
                    else {
                        typeof t == "object" && (n = this);
                        for (var i in r) r[i].off(t, n, this);
                        this._listeners = {}
                    }
                    return this
                }
            };
            return r.bind = r.on,
            r.unbind = r.off,
            r
        };
        return e()
    },
    f = new a;
    return {
        BaseFunc: u,
        Events: f
    }
}),
define("Hmath", [],
function () {
    var e = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368e3, 20922789888e3, 355687428096e3, 6402373705728e3, 0x1b02b9306890000, 243290200817664e4],
    t = function () {
        var t = function (e, t) {
            var n = [];
            tempB = [];
            var r = [],
            i = [],
            s = e.length > t.length ? e.length : t.length;
            for (var o = 0; o < s; o++) t[o] !== undefined && (n[t[o]] = !0),
            e[o] !== undefined && (tempB[e[o]] = !0);
            for (var u = 0; u < s; u++) !n[e[u]] & e[u] !== undefined && r.push(e[u]),
            !tempB[t[u]] & t[u] !== undefined && i.push(t[u]);
            return {
                A: r,
                B: i
            }
        },
        n = function (e) {
            return e.reverse().join(",").match(/([^,]+)(?!.*\1)/ig).reverse()
        },
        r = function (e) {
            var t = [],
            n = [],
            r = e.length;
            for (var i = 0; i < r; i++) {
                if (t[e[i]]) continue;
                t[e[i]] = !0,
                n.push(e[i])
            }
            return n
        },
        i = function (e, t) {
            var n = [],
            r = [],
            i = e.length;
            for (var s = 0; s < i; s++) {
                if (n[e[s][t]]) continue;
                n[e[s][t]] = !0,
                r.push(e[s])
            }
            return r
        },
        s = function (e, t, n) {
            return [e[0] + (t[0] - e[0]) * n, e[1] + (t[1] - e[1]) * n]
        },
        o = function (e, t) {
            var n;
            return t[0] === e[0] ? t[1] >= e[1] ? n = -Math.PI / 2 : n = Math.PI / 2 : n = Math.atan2(e[1] - t[1], t[0] - e[0]),
            n < 0 && (n += 2 * Math.PI),
            n * 180 / Math.PI
        },
        u = function (e, t, n, r, i, s) {
            var u = 0,
            a = 0,
            f = o(e, t) + 90;
            f > 360 && (f -= 360);
            var l = i ? 1 : -1;
            return u = n[0] + l * r * Math.cos(f * Math.PI / 180),
            a = n[1] - l * r * Math.sin(f * Math.PI / 180),
            [u, a]
        },
        a = function (e, t, n) {
            var r = t[1] - e[1],
            i = e[0] - t[0],
            s = e[1] * (t[0] - e[0]) - e[0] * (t[1] - e[1]),
            o = r * n[0] + i * n[1] + s;
            return o > 0
        },
        f = function (e, t) {
            return Math.sqrt(Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2))
        },
        l = function (e, t) {
            if (Math.abs(e[0] - t[0]) < Math.pow(10, -5)) return 0;
            if (e[1] === t[1]) return 0;
            var n = Math.atan((e[0] - t[0]) / e[1] - t[1]);
            return e[1] < t[1] && (n += Math.PI),
            n < 0 && (n += Math.PI * 2),
            n
        },
        c = function (e, t, n, r, i, s, o) {
            var u = f(e, t),
            a = n / u;
            i[0] = e[0] * (1 - a) + t[0] * a,
            i[1] = e[1] * (1 - a) + t[1] * a;
            var c = l(t, e),
            h = o ? 1 : -1;
            s[0] = i[0] - h * r * Math.cos(c),
            s[1] = i[1] + h * r * Math.sin(c)
        },
        h = function (e) {
            var t = 0;
            for (var n = 0,
            r = e.length - 1; n < r; n++) t += f(e[n], e[n + 1]);
            return t
        },
        p = function (e, t, n, r) {
            var i = 0,
            s = [],
            o,
            u = e.length,
            a = t * n,
            l = 0,
            c = 0,
            h = 0,
            p = 0,
            d = 0,
            v = 0,
            m = 0,
            g = 0,
            y = 0,
            b = 0,
            w = 0,
            E = 0;
            pti = [],
            pti0 = [];
            for (o = 1; o < u; o++) {
                E = f(e[o], e[o - 1]),
                l += E;
                if (l > a) {
                    pti = e[o],
                    c = l - E - a,
                    pti0 = e[o - 1],
                    i = o - 1,
                    m = pti0[0],
                    g = pti0[1],
                    y = pti[0],
                    b = pti[1],
                    h = (g - b) / (m - y),
                    p = c / Math.sqrt(1 + h * h),
                    d = m + p,
                    v = g + p * h,
                    s = [d, v],
                    w = c + f(e[o - 1], s);
                    break
                }
            }
            return r = r ? i : -1,
            s
        },
        d = function (e, t) {
            var n = [],
            r = [],
            i = [],
            s = [],
            o = [],
            u = [],
            a = [],
            f = [],
            l = [],
            c,
            h = [[], [], []],
            p,
            d,
            t = t || e.length;
            for (c = 0; c < t; c++) n[c] = e[c][0],
            r[c] = e[c][1];
            for (c = 0; c < t - 1; c++) i[c] = n[c + 1] - n[c],
            s[c] = r[c + 1] - r[c];
            p = Math.sqrt(i[0] * i[0] + s[0] * s[0]);
            for (c = 0; c < t - 2; c++) d = Math.sqrt(i[c + 1] * i[c + 1] + s[c + 1] * s[c + 1]),
            l[c] = p / d,
            p = d;
            l[t - 2] = 1;
            for (c = 1; c < t - 1; c++) h[0][c] = 1,
            h[1][c] = 2 * l[c - 1] * (1 + l[c - 1]),
            h[2][c] = l[c - 1] * l[c - 1] * l[c];
            h[1][0] = 2,
            h[2][0] = l[0],
            h[0][t - 1] = 1,
            h[1][t - 1] = 2 * l[t - 2];
            for (c = 1; c < t - 1; c++) o[c] = 3 * (i[c - 1] + l[c - 1] * l[c - 1] * i[c]),
            u[c] = 3 * (s[c - 1] + l[c - 1] * l[c - 1] * s[c]);
            o[0] = 3 * i[0],
            u[0] = 3 * s[0],
            o[t - 1] = 3 * i[t - 2],
            u[t - 1] = 3 * s[t - 2],
            v(o, h),
            v(u, h);
            for (c = 0; c < t - 1; c++) a[c] = l[c] * o[c + 1],
            f[c] = l[c] * u[c + 1];
            var m = 0,
            g, y = [],
            b = [],
            w,
            E,
            S,
            x,
            T;
            for (var c = 0; c < t - 1; c++) {
                T = parseInt(Math.max(Math.abs(i[c]), Math.abs(s[c]))),
                g = T > 200 ? 200 : T + 1,
                y[m] = n[c],
                b[m] = r[c],
                m++;
                for (var N = 1; N <= g; N++) w = N / g,
                E = w * w * (3 - 2 * w),
                S = w * (w - 1) * (w - 1),
                x = w * w * (w - 1),
                y[m] = n[c] + i[c] * E + o[c] * S + a[c] * x,
                b[m] = r[c] + s[c] * E + u[c] * S + f[c] * x,
                m++
            }
            var C = [];
            for (var c = 0; c < y.length; c++) C.push([y[c], b[c]]);
            return C
        },
        v = function (e, t, n) {
            var n = n || e.length,
            r = [],
            i = [];
            for (var s = 0; s < n; s++) i[s] = r[s] = e[s] / t[1][s];
            for (var o = 0; o < 10; o++) {
                r[0] = (e[0] - t[2][0] * i[1]) / t[1][0];
                for (var s = 1; s < n - 1; s++) r[s] = (e[s] - t[0][s] * i[s - 1] - t[2][s] * i[s + 1]) / t[1][s];
                r[n - 1] = (e[n - 1] - t[0][n - 1] * i[n - 2]) / t[1][n - 1];
                for (var s = 0; s < n; s++) i[s] = r[s]
            }
            for (var s = 0; s < n; s++) e[s] = r[s]
        },
        m = function (t) {
            var n = e[t];
            if (!n) {
                n = 1;
                for (var r = 1; r <= t; r++) n *= r;
                return e[t] = n,
                n
            }
            return n
        },
        g = function (e, t) {
            return m(e) / (m(t) * m(e - t))
        },
        y = function (e) {
            if (e.length < 2) return e;
            var t = e.length - 1,
            n, r, i, s, o = [],
            u = .03;
            for (i = 0; i <= 1; i += u) {
                n = 0,
                r = 0;
                for (s = 0; s <= t; s++) {
                    var a = g(t, s),
                    f = Math.pow(i, s),
                    l = Math.pow(1 - i, t - s);
                    n += a * f * l * e[s][0],
                    r += a * f * l * e[s][1]
                }
                o.push([n, r])
            }
            return o.push(e[t]),
            o
        },
        b = function (e, t) {
            var n, r, i, s, o = function (e) {
                return (r[0] - n[0]) * (e[1] - n[1]) > (r[1] - n[1]) * (e[0] - n[0])
            },
            u = function () {
                var e = [n[0] - r[0], n[1] - r[1]],
                t = [i[0] - s[0], i[1] - s[1]],
                o = n[0] * r[1] - n[1] * r[0],
                u = i[0] * s[1] - i[1] * s[0],
                a = 1 / (e[0] * t[1] - e[1] * t[0]);
                return [(o * t[0] - u * e[0]) * a, (o * t[1] - u * e[1]) * a]
            },
            a = e;
            n = t[t.length - 1];
            var f, l, c, h = t.length;
            for (l = 0; l < h; l++) {
                var r = t[l],
                p = a;
                a = [],
                c = p.length,
                i = p[c - 1];
                for (f = 0; f < c; f++) {
                    var s = p[f];
                    o(s) ? (o(i) || a.push(u()), a.push(s)) : o(i) && a.push(u()),
                    i = s
                }
                n = r
            }
            return a
        },
        w = function (e, t) {
            var n = 8,
            r = 1,
            i = 2,
            s = 4,
            o = function (e, t) {
                var o = 0;
                return e < c && (o |= r),
                e > h && (o |= i),
                t < d && (o |= s),
                t > p && (o |= n),
                o
            },
            u = function (e, t) {
                var u, a, f, l = e[0],
                v = t[0],
                m = e[1],
                g = t[1],
                y = o(l, m),
                b = o(v, g);
                while (y != 0 || b != 0) {
                    if ((y & b) != 0) return [];
                    u = y,
                    y == 0 && (u = b),
                    (r & u) != 0 ? (a = c, f = m + (g - m) * (c - l) / (v - l)) : (i & u) != 0 ? (a = h, f = m + (g - m) * (h - l) / (v - l)) : (s & u) != 0 ? (f = d, a = l + (v - l) * (d - m) / (g - m)) : (n & u) != 0 && (f = p, a = l + (v - l) * (p - m) / (g - m)),
                    u == y ? (l = a, m = f, y = o(a, f)) : (v = a, g = f, b = o(a, f))
                }
                return [[l, m], [v, g]]
            },
            a = [],
            f,
            l,
            c = t.minX,
            h = t.maxX,
            p = t.maxY,
            d = t.minY,
            v = e.length;
            for (f = 0; f < v; f++) {
                var m = e[f].length;
                for (var g = 0; g < m - 1; g++) {
                    start = e[f][g],
                    end = e[f][g + 1];
                    var y = u(start, end);
                    a = a.concat(y)
                }
            }
            return a
        },
        E = function () {
            var e = "";
            for (var t = 1; t <= 32; t++) {
                var n = Math.floor(Math.random() * 16).toString(16);
                e += n;
                if (t == 8 || t == 12 || t == 16 || t == 20) e += "-"
            }
            return e
        };
        return {
            guid: E,
            matrixremainder: t,
            deleteRepeatN: r,
            deleteRepeat: n,
            clipPolygon: b,
            clipPolyline: w,
            deleteRepeatNByAttr: i,
            scalePoint: s,
            vertex: u,
            angle: o,
            optionWay: a,
            distance: f,
            azimuth: l,
            linePerpenPoints: c,
            pathLength: h,
            bzLine: y,
            bTypeline: d,
            gainPt: p
        }
    },
    n = function (e) {
        var t = e || {};
        this.todo = [],
        this.interval = t.interval || 25,
        this.delay = t.delay || 25
    };
    n.prototype.chunk = function (e, t, n, r) {
        this.todo = this.todo.concat(e),
        this.result = [];
        var i = this,
        s;
        setTimeout(function () {
            do {
                s = +(new Date);
                var e = t.call(n, i.todo.shift());
                e ? i.result.push(e) : null
            } while (i.todo.length > 0 && +(new Date) - s < i.interval && i.interval < 16);
            if (i.todo.length > 0) setTimeout(arguments.callee, i.interval);
            else {
                var o = i.result.concat();
                i.result = [],
                r ? r.call(n, o) : null
            }
        },
        i.delay)
    },
    n.prototype.stop = function () {
        this.todo = []
    },
    n.prototype.isRunning = function () {
        return this.todo.length > 0
    };
    var r = function () {
        this._taskChunk = new n({
            interval: 16,
            delay: 16
        })
    };
    r.prototype.animate = function (e, t, n, r, s) {
        var o = Math.floor(t / 16);
        i = 0,
        array = [],
        _context = s || this;
        for (i = 0; i < o; i++) array.push(i);
        this._taskChunk.chunk(array,
        function (e) {
            n.call(_context, e)
        },
        null,
        function () {
            r ? r.call() : null
        })
    };
    var s = new r,
    o = new t;
    return {
        h2dmath: t,
        mH2dmath: o,
        taskQueue: n,
        transition: s,
        sTransition: r
    }
}),
define("SecMapInteractive", ["EventListener", "Hobject", "Hmath"],
function (e, t, n) {
    var r = {
        mousedown: "",
        mousewheel: "",
        mousemove: "",
        mouseup: ""
    },
    i = e.AddListener,
    s = e.RemoveListener,
    o = function (e, t) {
        this.x = e || 0,
        this.y = t || 0
    },
    u = t.BaseFunc.hook,
    a = n.transition,
    f = t.BaseFunc.getOffsetXY,
    l = t.BaseFunc.ua(),
    c = function (e) {
        var t = this;
        t.domLayer = e.domLayer,
        t.tileDomLayers = [],
        t.eventCallback = e.eventCallback ||
        function () { },
        t.width = e.width,
        t.height = e.height,
        t.mouseDown = !1,
        t.scrolling = !0,
        t.scrollTime = 300,
        t.lockEdges = !0,
        t.mousePosition = new o,
        t.mouseLocations = [],
        t.velocity = new o,
        t.wheelInterval = null,
        t.wheelLocations = [],
        t.wheelAnimate = null,
        t.viewingBox = document.createElement("div"),
        t.viewingBox.style.overflow = "hidden",
        t.viewingBox.id = "viewbox",
        t.viewingBox.style.width = t.width + "px",
        t.viewingBox.style.height = t.height + "px",
        t.viewingBox.style.position = "relative",
        t.map = document.createElement("div"),
        t.map.id = "mapLayers",
        t.map.style.position = "absolute",
        t.map.style.width = t.width + "px",
        t.map.style.height = t.height + "px",
        t.viewingBox.appendChild(t.map),
        t.mouseTilePosition = {
            x: 0,
            y: 0
        },
        t.offset = {
            x: 0,
            y: 0
        },
        u.setValue("viewBox", t.viewingBox),
        t.domLayer.appendChild(t.viewingBox);
        var n = function (e) {
            t.tileDomLayers.push(e),
            t.map.appendChild(e)
        },
        a = r.mousemove = function (e) {
            var n = e.mousePosition || t,
            r = e.clientX - (e.mousePosition || t.mousePosition).x + parseInt(t.map.style.left || 0),
            i = e.clientY - (e.mousePosition || t.mousePosition).y + parseInt(t.map.style.top || 0);
            t.mousePosition.x = e.clientX,
            t.mousePosition.y = e.clientY,
            h(r, i)
        },
        c = function () {
            if (t.mouseDown) t.mouseLocations.unshift(new o(t.mousePosition.x, t.mousePosition.y)),
            t.mouseLocations.length > 10 && t.mouseLocations.pop();
            else {
                var e = t.scrollTime / 10,
                n = (e - t.timerCount) / e,
                r = parseInt(t.velocity.x * n),
                i = parseInt(t.velocity.y * n);
                h(-r + parseInt(t.map.style.left) || 0, -i + parseInt(t.map.style.top) || 0);
                if (t.timerCount == e) {
                    clearInterval(t.timerId),
                    t.timerId = -1;
                    var s = -i + parseInt(t.map.style.top),
                    u = -r + parseInt(t.map.style.left);
                    t.eventCallback({
                        x: -1 * s,
                        y: -1 * u,
                        eventName: "mouseup"
                    })
                } ++t.timerCount
            }
        },
        h = function (e, n) {
            if (t.lockEdges) var r = -t.map.offsetWidth + t.viewingBox.offsetWidth,
            i = -t.map.offsetHeight + t.viewingBox.offsetHeight;
            t.map.style.left = e + "px",
            t.map.style.top = n + "px",
            t.eventCallback({
                x: -1 * n,
                y: -1 * e,
                eventName: "mousemove"
            })
        },
        p = function () {
            if (t.wheelLocations.length > 0) {
                var e = t.wheelLocations.shift() > 0 ? 1 : -1;
                t.wheelLocations.length = 0,
                t.eventCallback({
                    zoom: e,
                    wheelElement: t.wheelElement,
                    eventName: "mousewheel"
                }),
                t.wheelInterval = null,
                t.wheelAnimate = null
            }
        },
        d = function (e) {
            var n, r = t.tileDomLayers.length,
            i = 1,
            s = this,
            o = String(t.wheelElement.clientX) + "px",
            u = String(t.wheelElement.clientY) + "px",
            a = o + " " + u,
            f = document.getElementById("viewbox"),
            c = f.style,
            h = c.setAttribute || c.setProperty;
            return h.call(c, "-webkit-transform-origin", a),
            h.call(c, "-ms-transform-origin", a),
            t.eventCallback({
                eventName: "beforeMousewheel"
            }),
            l.ie ? (h.call(c, "-ms-transition", "all 0s ease"), h.call(c, "-ms-transform", "scale(1.1)"), h.call(c, "-ms-transition", "none 0s ease"), h.call(c, "-ms-transform", "scale(1)"), h.call(c, "-ms-transform-origin", a), setTimeout(function () {
                h.call(c, "-ms-transition", "all 0.48s ease"),
                e < 0 ? i = .5 : i = 2;
                var t = "scale(" + i + ")";
                h.call(c, "-ms-transform", t),
                setTimeout(function () {
                    h.call(c, "-ms-transition", "none 0s ease"),
                    h.call(c, "-ms-transform", "scale(1)"),
                    p()
                },
                480)
            },
            16)) : !l.chrome || (h.call(c, "-webkit-transition", "all 0s ease"), h.call(c, "-webkit-transform", "scale(1.1)"), h.call(c, "-webkit-transition", "none 0s ease"), h.call(c, "-webkit-transform", "scale(1)"), h.call(c, "-webkit-transform-origin", a), setTimeout(function () {
                h.call(c, "-webkit-transition", "all 0.48s ease"),
                e < 0 ? i = .5 : i = 2;
                var t = "scale(" + i + ")";
                h.call(c, "-webkit-transform", t),
                setTimeout(function () {
                    h.call(c, "-webkit-transition", "none 0s ease"),
                    h.call(c, "-webkit-transform", "scale(1)"),
                    p()
                },
                480)
            },
            16)),
            {}
        },
        v = function (e) {
            e && e.preventDefault ? e.preventDefault() : window.event.returnValue = !1
        };
        return i(t.viewingBox, "mousedown", r.mousedown = function (e) {
            t.mousePosition.x = e.clientX,
            t.mousePosition.y = e.clientY,
            t.mouseTilePosition = {
                x: e.clientX,
                y: e.clientY
            },
            i(t.viewingBox, "mousemove", a),
            t.mouseDown = !0,
            t.scrolling && (t.timerCount = 0, t.timerId !== 0 && (clearInterval(t.timerId), t.timerId = 0), t.timerId = setInterval(c, 15)),
            v(e)
        }),
        i(document, "mouseup", r.mouseup = function (e) {
            if (t.mouseDown) {
                var n = a;
                s(t.viewingBox, "mousemove", n)
            }
            t.mouseDown = !1;
            if (t.mouseLocations.length > 0) {
                var r = t.mouseLocations.length;
                t.velocity.x = (t.mouseLocations[r - 1].x - t.mouseLocations[0].x) / r,
                t.velocity.y = (t.mouseLocations[r - 1].y - t.mouseLocations[0].y) / r,
                t.mouseLocations.length = 0
            }
            t.viewingBox.style.cursor = "auto"
        }),
        i(t.viewingBox, "mousewheel", r.mousewheel = function (e) {
            var n = e.target || e.srcElement,
            r = f(e);
            t.wheelElement = {
                target: n,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
                clientX: r.left,
                clientY: r.top,
                x: e.x,
                y: e.y
            },
            !t.wheelInterva & !t.wheelAnimate && (t.wheelAnimate = t.wheelAnimate ? t.wheelAnimate : d(e.wheelDelta)),
            t.wheelLocations.unshift(e.wheelDelta),
            e.cancelBubble = !0,
            v(e)
        }),
        {
            addLayer: n,
            interactive: r,
            viewBox: t.viewingBox
        }
    };
    return c
}),
define("SecBaseLayer", [],
function () {
    var e = function (e) {
        this.args = e || {},
        this.layerID = this.args.layerID,
        this.domLayer = null,
        this.mapObjCallback = null,
        this.complete = function () { },
        this.layerInfo = null,
        this.hidden = !1
    };
    return e.prototype = {
        layerInilization: function (e) {
            this._merge(e),
            this._loadClient(),
            this._createlayer(),
            this._iniEvent(),
            this._publish()
        },
        notice: function (e) { },
        show: function () {
            this.hidden ? this.domLayer.style.visibility = "visible" : null,
            this.hidden = !1
        },
        hide: function () {
            this.hidden ? null : this.domLayer.style.visibility = "hidden",
            this.hidden = !0
        },
        getType: function () {
            return "SecBaseLayer"
        },
        _loadClient: function () {
            this.mapElement = document.getElementById(this.args.mapID),
            this.mapWidth = this.mapElement.offsetWidth,
            this.mapHeight = this.mapElement.offsetHeight,
            this.layerInfo = this.args.layerInfo
        },
        _createlayer: function () { },
        _iniEvent: function () { },
        _publish: function () { },
        _merge: function (e) {
            for (var t in e) this.args[t] === undefined && (this.args[t] = e[t])
        }
    },
    e
}),
define("Utils", ["DragAndDrop"],
function () {
    var e = !1,
    t = {},
    n = [],
    r = {},
    i = 100,
    s = undefined,
    o = !1,
    u = 400,
    a = !1,
    f = 0,
    l = "canvas",
    c = "2d",
    h = "[object Array]",
    p = "[object Number]",
    d = "[object String]",
    v = Math.PI / 180,
    m = 180 / Math.PI,
    g = "#",
    y = "",
    b = "0",
    w = "rgb(",
    E = {
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
    S = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/,
    x = {
        _isElement: function (e) {
            return !!e && e.nodeType == 1
        },
        _isFunction: function (e) {
            return !!(e && e.constructor && e.call && e.apply)
        },
        _isObject: function (e) {
            return !!e && e.constructor == Object
        },
        _isArray: function (e) {
            return Object.prototype.toString.call(e) == h
        },
        _isNumber: function (e) {
            return Object.prototype.toString.call(e) == p
        },
        _isString: function (e) {
            return Object.prototype.toString.call(e) == d
        },
        _hasMethods: function (e) {
            var t = [],
            n;
            for (n in e) this._isFunction(e[n]) && t.push(n);
            return t.length > 0
        },
        _isInDocument: function (e) {
            while (e = e.parentNode) if (e == document) return !0;
            return !1
        },
        _simplifyArray: function (e) {
            var t = [],
            n = e.length,
            r,
            i;
            for (r = 0; r < n; r++) i = e[r],
            this._isNumber(i) ? i = Math.round(i * 1e3) / 1e3 : this._isString(i) || (1, i = i.toString()),
            t.push(i);
            return t
        },
        _getImage: function (e, t) {
            var n, r, i, s;
            e ? this._isElement(e) ? t(e) : this._isString(e) ? (n = new Image, n.onload = function () {
                t(n)
            },
            n.src = e) : e.data ? (r = document.createElement(l), r.width = e.width, r.height = e.height, _context = r.getContext(c), _context.putImageData(e, 0, 0), this._getImage(r.toDataURL(), t)) : t(null) : t(null)
        },
        _rgbToHex: function (e, t, n) {
            return ((1 << 24) + (e << 16) + (t << 8) + n).toString(16).slice(1)
        },
        _hexToRgb: function (e) {
            e = e.replace(g, y);
            var t = parseInt(e, 16);
            return {
                r: t >> 16 & 255,
                g: t >> 8 & 255,
                b: t & 255
            }
        },
        getRandomColor: function () {
            var e = (Math.random() * 16777215 << 0).toString(16);
            while (e.length < 6) e = b + e;
            return g + e
        },
        get: function (e, t) {
            return e === undefined ? t : e
        },
        getRGB: function (e) {
            var t;
            return e in E ? (t = E[e], {
                r: t[0],
                g: t[1],
                b: t[2]
            }) : e[0] === g ? this._hexToRgb(e.substring(1)) : e.substr(0, 4) === w ? (t = S.exec(e.replace(/ /g, "")), {
                r: parseInt(t[1], 10),
                g: parseInt(t[2], 10),
                b: parseInt(t[3], 10)
            }) : {
                r: 0,
                g: 0,
                b: 0
            }
        },
        _merge: function (e, t) {
            var n = this._clone(t);
            for (var r in e) this._isObject(e[r]) ? n[r] = this._merge(e[r], n[r]) : n[r] = e[r];
            return n
        },
        cloneObject: function (e) {
            var t = {};
            for (var n in e) this._isObject(e[n]) ? t[n] = this._clone(e[n]) : t[n] = e[n];
            return t
        },
        cloneArray: function (e) {
            return e.slice(0)
        },
        _degToRad: function (e) {
            return e * v
        },
        _radToDeg: function (e) {
            return e * m
        },
        _capitalize: function (e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        },
        error: function (e) {
            throw new Error(KINETIC_ERROR + e)
        },
        warn: function (e) {
            window.console && console.warn && console.warn(KINETIC_WARNING + e)
        },
        extend: function (e, t) {
            for (var n in t.prototype) n in e.prototype || (e.prototype[n] = t.prototype[n])
        },
        addMethods: function (e, t) {
            var n;
            for (n in t) e.prototype[n] = t[n]
        },
        _getNewId: function () {
            return f++
        },
        _getControlPoints: function (e, t, n, r, i, s, o) {
            var u = Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - t, 2)),
            a = Math.sqrt(Math.pow(i - n, 2) + Math.pow(s - r, 2)),
            f = o * u / (u + a),
            l = o * a / (u + a),
            c = n - f * (i - e),
            h = r - f * (s - t),
            p = n + l * (i - e),
            d = r + l * (s - t);
            return [c, h, p, d]
        },
        _expandPoints: function (e, t) {
            var n = e.length,
            r = [],
            i,
            s;
            for (i = 2; i < n - 2; i += 2) s = this._getControlPoints(e[i - 2], e[i - 1], e[i], e[i + 1], e[i + 2], e[i + 3], t),
            r.push(s[0]),
            r.push(s[1]),
            r.push(e[i]),
            r.push(e[i + 1]),
            r.push(s[2]),
            r.push(s[3]);
            return r
        },
        _removeLastLetter: function (e) {
            return e.substring(0, e.length - 1)
        },
        stages: n,
        enableTrace: e,
        traceArrMax: i,
        pixelRatio: s,
        shapes: r,
        listenClickTap: a,
        inDblClickWindow: o,
        dblClickWindow: u,
        isDragging: function () {
            var e = require("DragAndDrop").self;
            return e ? e.isDragging : !1
        },
        addId: function (e, n) {
            n !== undefined && (t[n] = e)
        },
        removeId: function (e) {
            e !== undefined && delete t[e]
        }
    };
    return {
        self: x
    }
}),
define("Factory", ["Utils"],
function (e) {
    var t = "absoluteOpacity",
    n = "absoluteTransform",
    r = "add",
    i = "b",
    s = "before",
    o = "black",
    u = "Change",
    a = "children",
    f = "Deg",
    l = ".",
    c = "",
    h = "g",
    p = "get",
    d = "#",
    v = "id",
    m = "kinetic",
    g = "listening",
    y = "mouseenter",
    b = "mouseleave",
    w = "name",
    E = "off",
    S = "on",
    x = "_get",
    T = "r",
    N = "RGB",
    C = "set",
    k = "Shape",
    L = " ",
    A = "Stage",
    O = "transform",
    M = "B",
    _ = "G",
    D = "Height",
    P = "R",
    H = "Width",
    B = "X",
    j = "Y",
    F = "visible",
    I = "x",
    q = "y",
    R = e.self._capitalize,
    U = e.self._removeLastLetter,
    z = e.self._degToRad,
    W = e.self._radToDeg,
    X = e.self._rgbToHex,
    V = e.self.getRGB,
    $ = {
        addGetterSetter: function (e, t, n) {
            this.addGetter(e, t, n),
            this.addSetter(e, t)
        },
        addPointGetterSetter: function (e, t, n) {
            this.addPointGetter(e, t, n),
            this.addPointSetter(e, t),
            this.addGetter(e, t + B, n),
            this.addGetter(e, t + j, n),
            this.addSetter(e, t + B),
            this.addSetter(e, t + j)
        },
        addBoxGetterSetter: function (e, t, n) {
            this.addBoxGetter(e, t, n),
            this.addBoxSetter(e, t),
            this.addGetter(e, t + B, n),
            this.addGetter(e, t + j, n),
            this.addGetter(e, t + H, n),
            this.addGetter(e, t + D, n),
            this.addSetter(e, t + B),
            this.addSetter(e, t + j),
            this.addSetter(e, t + H),
            this.addSetter(e, t + D)
        },
        addPointsGetterSetter: function (e, t) {
            this.addPointsGetter(e, t),
            this.addPointsSetter(e, t),
            this.addPointAdder(e, t)
        },
        addRotationGetterSetter: function (e, t, n) {
            this.addRotationGetter(e, t, n),
            this.addRotationSetter(e, t)
        },
        addColorGetterSetter: function (e, t) {
            this.addGetter(e, t),
            this.addSetter(e, t),
            this.addColorRGBGetter(e, t),
            this.addColorComponentGetter(e, t, T),
            this.addColorComponentGetter(e, t, h),
            this.addColorComponentGetter(e, t, i),
            this.addColorRGBSetter(e, t),
            this.addColorComponentSetter(e, t, T),
            this.addColorComponentSetter(e, t, h),
            this.addColorComponentSetter(e, t, i)
        },
        addColorRGBGetter: function (e, t) {
            var n = p + R(t) + N;
            e.prototype[n] = function () {
                return V(this.attrs[t])
            }
        },
        addColorComponentGetter: function (e, t, n) {
            var r = p + R(t),
            i = r + R(n);
            e.prototype[i] = function () {
                return this[r + N]()[n]
            }
        },
        addPointsGetter: function (e, t) {
            var n = this,
            r = p + R(t);
            e.prototype[r] = function () {
                var e = this.attrs[t];
                return e === undefined ? [] : e
            }
        },
        addGetter: function (e, t, n) {
            var r = this,
            i = p + R(t);
            e.prototype[i] = function () {
                var e = this.attrs[t];
                return e === undefined ? n : e
            }
        },
        addPointGetter: function (e, t) {
            var n = this,
            r = p + R(t);
            e.prototype[r] = function () {
                var e = this;
                return {
                    x: e[r + B](),
                    y: e[r + j]()
                }
            }
        },
        addBoxGetter: function (e, t) {
            var n = this,
            r = p + R(t);
            e.prototype[r] = function () {
                var e = this;
                return {
                    x: e[r + B](),
                    y: e[r + j](),
                    width: e[r + H](),
                    height: e[r + D]()
                }
            }
        },
        addRotationGetter: function (e, t, n) {
            var r = this,
            i = p + R(t);
            e.prototype[i] = function () {
                var e = this.attrs[t];
                return e === undefined && (e = n),
                e
            },
            e.prototype[i + f] = function () {
                var e = this.attrs[t];
                return e === undefined && (e = n),
                W(e)
            }
        },
        addColorRGBSetter: function (e, t) {
            var n = C + R(t) + N;
            e.prototype[n] = function (e) {
                var n = e && e.r !== undefined ? e.r | 0 : this.getAttr(t + P),
                r = e && e.g !== undefined ? e.g | 0 : this.getAttr(t + _),
                i = e && e.b !== undefined ? e.b | 0 : this.getAttr(t + M);
                this._setAttr(t, d + X(n, r, i))
            }
        },
        addColorComponentSetter: function (e, t, n) {
            var r = C + R(t),
            i = r + R(n);
            e.prototype[i] = function (e) {
                var t = {};
                t[n] = e,
                this[r + N](t)
            }
        },
        addPointsSetter: function (e, t) {
            var n = C + R(t);
            e.prototype[n] = function (e) {
                this._setAttr("points", e)
            }
        },
        addSetter: function (e, t) {
            var n = C + R(t);
            e.prototype[n] = function (e) {
                this._setAttr(t, e)
            }
        },
        addPointSetter: function (e, t) {
            var n = this,
            r = C + R(t);
            e.prototype[r] = function (e) {
                var n = this.attrs[t],
                i = 0,
                s = 0;
                e && (i = e.x, s = e.y, i !== undefined && this[r + B](i), s !== undefined && this[r + j](s), this._fireChangeEvent(t, n, e))
            }
        },
        addBoxSetter: function (e, t) {
            var n = this,
            r = C + R(t);
            e.prototype[r] = function (e) {
                var n = this.attrs[t],
                i,
                s,
                o,
                u;
                e && (i = e.x, s = e.y, o = e.width, u = e.height, i !== undefined && this[r + B](i), s !== undefined && this[r + j](s), o !== undefined && this[r + H](o), u !== undefined && this[r + D](u), this._fireChangeEvent(t, n, e))
            }
        },
        addRotationSetter: function (e, t) {
            var n = this,
            r = C + R(t);
            e.prototype[r] = function (e) {
                this._setAttr(t, e)
            },
            e.prototype[r + f] = function (e) {
                this._setAttr(t, z(e))
            }
        },
        addPointAdder: function (e, t) {
            var n = this,
            i = r + U(R(t));
            e.prototype[i] = function (e) {
                var n = this.attrs[t];
                e && (this.attrs[t].push(e), this._fireChangeEvent(t, n, e))
            }
        }
    };
    return {
        self: $
    }
}),
define("Collection", [],
function () {
    var e = function () {
        var e = [].slice.call(arguments),
        t = e.length,
        n = 0;
        this.length = t;
        for (; n < t; n++) this[n] = e[n];
        return this
    };
    return e.prototype = [],
    e.fromArray = function (t) {
        var n = new e,
        r = t.length,
        i;
        for (i = 0; i < r; i++) n.push(t[i]);
        return n
    },
    e._mapMethod = function (t) {
        e.prototype[t] = function () {
            var e = this.length,
            n, r = [].slice.call(arguments);
            for (n = 0; n < e; n++) this[n][t].apply(this[n], r);
            return this
        }
    },
    e.mapMethods = function (t) {
        var n = t.prototype;
        for (var r in n) e._mapMethod(r)
    },
    e.prototype.each = function (e) {
        for (var t = 0; t < this.length; t++) e(this[t], t)
    },
    e.prototype.clear = function () {
        this.length = 0
    },
    e.prototype.toArray = function () {
        var e = [],
        t = this.length,
        n;
        for (n = 0; n < t; n++) e.push(this[n]);
        return e
    },
    {
        self: e
    }
}),
define("Transform", [],
function () {
    var e = function () {
        this.m = [1, 0, 0, 1, 0, 0]
    };
    return e.prototype = {
        translate: function (e, t) {
            this.m[4] += this.m[0] * e + this.m[2] * t,
            this.m[5] += this.m[1] * e + this.m[3] * t
        },
        scale: function (e, t) {
            this.m[0] *= e,
            this.m[1] *= e,
            this.m[2] *= t,
            this.m[3] *= t
        },
        rotate: function (e) {
            var t = Math.cos(e),
            n = Math.sin(e),
            r = this.m[0] * t + this.m[2] * n,
            i = this.m[1] * t + this.m[3] * n,
            s = this.m[0] * -n + this.m[2] * t,
            o = this.m[1] * -n + this.m[3] * t;
            this.m[0] = r,
            this.m[1] = i,
            this.m[2] = s,
            this.m[3] = o
        },
        getTranslation: function () {
            return {
                x: this.m[4],
                y: this.m[5]
            }
        },
        skew: function (e, t) {
            var n = this.m[0] + this.m[2] * t,
            r = this.m[1] + this.m[3] * t,
            i = this.m[2] + this.m[0] * e,
            s = this.m[3] + this.m[1] * e;
            this.m[0] = n,
            this.m[1] = r,
            this.m[2] = i,
            this.m[3] = s
        },
        multiply: function (e) {
            var t = this.m[0] * e.m[0] + this.m[2] * e.m[1],
            n = this.m[1] * e.m[0] + this.m[3] * e.m[1],
            r = this.m[0] * e.m[2] + this.m[2] * e.m[3],
            i = this.m[1] * e.m[2] + this.m[3] * e.m[3],
            s = this.m[0] * e.m[4] + this.m[2] * e.m[5] + this.m[4],
            o = this.m[1] * e.m[4] + this.m[3] * e.m[5] + this.m[5];
            this.m[0] = t,
            this.m[1] = n,
            this.m[2] = r,
            this.m[3] = i,
            this.m[4] = s,
            this.m[5] = o
        },
        invert: function () {
            var e = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
            t = this.m[3] * e,
            n = -this.m[1] * e,
            r = -this.m[2] * e,
            i = this.m[0] * e,
            s = e * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
            o = e * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = t,
            this.m[1] = n,
            this.m[2] = r,
            this.m[3] = i,
            this.m[4] = s,
            this.m[5] = o
        },
        getMatrix: function () {
            return this.m
        },
        setAbsolutePosition: function (e, t) {
            var n = this.m[0],
            r = this.m[1],
            i = this.m[2],
            s = this.m[3],
            o = this.m[4],
            u = this.m[5],
            a = (n * (t - u) - r * (e - o)) / (n * s - r * i),
            f = (e - o - i * a) / n;
            this.translate(f, a)
        }
    },
    {
        self: e
    }
}),
define("Node", ["Utils", "Factory", "Collection", "Transform"],
function (e, t, n, r) {
    var i = e.self.addMethods,
    s = t.self,
    o = e.self._capitalize,
    u = n.self,
    a = e.self.removeId,
    f = e.self.addId,
    r = r.self,
    l = e.self._isFunction,
    c = e.self.isDragging,
    h = e.self._getNewId,
    p = "absoluteOpacity",
    d = "absoluteTransform",
    v = "add",
    m = "b",
    g = "before",
    y = "black",
    b = "Change",
    w = "children",
    E = "Deg",
    S = ".",
    x = "",
    T = "g",
    N = "get",
    C = "#",
    k = "id",
    L = "kinetic",
    A = "listening",
    O = "mouseenter",
    M = "mouseleave",
    _ = "name",
    D = "off",
    P = "on",
    H = "_get",
    B = "r",
    j = "RGB",
    F = "set",
    I = "Shape",
    q = " ",
    R = "stage",
    U = "transform",
    z = "B",
    W = "G",
    X = "Height",
    V = "R",
    $ = "Stage",
    J = "Width",
    K = "X",
    Q = "Y",
    G = "visible",
    Y = "x",
    Z = "y",
    et = ["xChange", "yChange", "scaleXChange", "scaleYChange", "skewXChange", "skewYChange", "rotationChange", "offsetXChange", "offsetYChange"].join(q),
    tt = function (e) {
        this._init(e)
    };
    return i(tt, {
        _init: function (e) {
            var t = this;
            this._id = h(),
            this.eventListeners = {},
            this.attrs = {},
            this.cache = {},
            this.setAttrs(e),
            this.on(et,
            function () {
                this._clearCache(U),
                t._clearSelfAndChildrenCache(d)
            }),
            this.on("visibleChange",
            function () {
                t._clearSelfAndChildrenCache(G)
            }),
            this.on("listeningChange",
            function () {
                t._clearSelfAndChildrenCache(A)
            }),
            this.on("opacityChange",
            function () {
                t._clearSelfAndChildrenCache(p)
            })
        },
        clearCache: function () {
            this.cache = {}
        },
        _clearCache: function (e) {
            delete this.cache[e]
        },
        _getCache: function (e, t) {
            var n = this.cache[e];
            return n === undefined && (this.cache[e] = t.call(this)),
            this.cache[e]
        },
        _clearSelfAndChildrenCache: function (e) {
            var t = this;
            this._clearCache(e),
            this.children && this.getChildren().each(function (t) {
                t._clearSelfAndChildrenCache(e)
            })
        },
        on: function (e, t) {
            var n = e.split(q),
            r = n.length,
            i,
            s,
            o,
            u,
            a;
            for (i = 0; i < r; i++) s = n[i],
            o = s.split(S),
            u = o[0],
            a = o[1] || x,
            this.eventListeners[u] || (this.eventListeners[u] = []),
            this.eventListeners[u].push({
                name: a,
                handler: t
            });
            return this
        },
        once: function (e, t) {
            var n = e.split(q),
            r = n.length,
            i,
            s,
            o,
            u,
            a;
            for (i = 0; i < r; i++) s = n[i],
            o = s.split(S),
            u = o[0],
            a = o[1] || x,
            this.eventListeners[u] = [],
            this.eventListeners[u].push({
                name: a,
                handler: t
            });
            return this
        },
        off: function (e) {
            var t = e.split(q),
            n = t.length,
            r,
            i,
            s,
            o,
            u,
            a,
            f;
            for (r = 0; r < n; r++) {
                o = t[r],
                u = o.split(S),
                a = u[0],
                f = u[1];
                if (a) this.eventListeners[a] && this._off(a, f);
                else for (s in this.eventListeners) this._off(s, f)
            }
            return this
        },
        remove: function () {
            var e = this.getParent();
            return e && e.children && (e.children.splice(this.index, 1), e._setChildrenIndices(), delete this.parent),
            this._clearSelfAndChildrenCache(R),
            this._clearSelfAndChildrenCache(d),
            this._clearSelfAndChildrenCache(G),
            this._clearSelfAndChildrenCache(A),
            this._clearSelfAndChildrenCache(p),
            this
        },
        destroy: function () {
            a(this.getId()),
            this.remove()
        },
        getAttr: function (e) {
            var t = N + o(e);
            return l(this[t]) ? this[t]() : this.attrs[e]
        },
        getAncestors: function () {
            var e = this.getParent(),
            t = new u;
            while (e) t.push(e),
            e = e.getParent();
            return t
        },
        getAttrs: function () {
            return this.attrs || {}
        },
        setAttrs: function (e) {
            var t, n;
            if (e) for (t in e) t !== w && (n = F + o(t), l(this[n]) ? this[n](e[t]) : this._setAttr(t, e[t]));
            return this
        },
        isListening: function () {
            return this._getCache(A, this._isListening)
        },
        _isListening: function () {
            var e = this.getListening(),
            t = this.getParent();
            return e && t && !t.isListening() ? !1 : e
        },
        isVisible: function () {
            return this._getCache(G, this._isVisible)
        },
        _isVisible: function () {
            var e = this.getVisible(),
            t = this.getParent();
            return e && t && !t.isVisible() ? !1 : e
        },
        show: function () {
            return this.setVisible(!0),
            this
        },
        hide: function () {
            return this.setVisible(!1),
            this
        },
        getZIndex: function () {
            return this.index || 0
        },
        getAbsoluteZIndex: function () {
            function u(a) {
                r = [],
                i = a.length;
                for (s = 0; s < i; s++) o = a[s],
                n++,
                o.nodeType !== I && (r = r.concat(o.getChildren().toArray())),
                o._id === t._id && (s = i);
                r.length > 0 && r[0].getLevel() <= e && u(r)
            }
            var e = this.getLevel(),
            t = this,
            n = 0,
            r,
            i,
            s,
            o;
            return t.nodeType !== $ && u(t.getStage().getChildren()),
            n
        },
        getLevel: function () {
            var e = 0,
            t = this.parent;
            while (t) e++,
            t = t.parent;
            return e
        },
        setPosition: function (e) {
            return this.setX(e.x),
            this.setY(e.y),
            this
        },
        getPosition: function () {
            return {
                x: this.getX(),
                y: this.getY()
            }
        },
        getAbsolutePosition: function () {
            var e = this.getAbsoluteTransform().getMatrix(),
            t = new r,
            n = this.getOffset();
            return t.m = e.slice(),
            t.translate(n.x, n.y),
            t.getTranslation()
        },
        setAbsolutePosition: function (e) {
            var t = this._clearTransform(),
            n;
            return this.attrs.x = t.x,
            this.attrs.y = t.y,
            delete t.x,
            delete t.y,
            n = this.getAbsoluteTransform(),
            n.invert(),
            n.translate(e.x, e.y),
            e = {
                x: this.attrs.x + n.getTranslation().x,
                y: this.attrs.y + n.getTranslation().y
            },
            this.setPosition({
                x: e.x,
                y: e.y
            }),
            this._setTransform(t),
            this
        },
        _setTransform: function (e) {
            var t;
            for (t in e) this.attrs[t] = e[t];
            this._clearCache(U),
            this._clearSelfAndChildrenCache(d)
        },
        _clearTransform: function () {
            var e = {
                x: this.getX(),
                y: this.getY(),
                rotation: this.getRotation(),
                scaleX: this.getScaleX(),
                scaleY: this.getScaleY(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                skewX: this.getSkewX(),
                skewY: this.getSkewY()
            };
            return this.attrs.x = 0,
            this.attrs.y = 0,
            this.attrs.rotation = 0,
            this.attrs.scaleX = 1,
            this.attrs.scaleY = 1,
            this.attrs.offsetX = 0,
            this.attrs.offsetY = 0,
            this.attrs.skewX = 0,
            this.attrs.skewY = 0,
            this._clearCache(U),
            this._clearSelfAndChildrenCache(d),
            e
        },
        move: function (e) {
            var t = e.x,
            n = e.y,
            r = this.getX(),
            i = this.getY();
            return t !== undefined && (r += t),
            n !== undefined && (i += n),
            this.setPosition({
                x: r,
                y: i
            }),
            this
        },
        _eachAncestorReverse: function (e, t) {
            var n = [],
            r = this.getParent(),
            i,
            s;
            t && n.unshift(this);
            while (r) n.unshift(r),
            r = r.parent;
            i = n.length;
            for (s = 0; s < i; s++) e(n[s])
        },
        rotate: function (e) {
            return this.setRotation(this.getRotation() + e),
            this
        },
        rotateDeg: function (e) {
            return this.setRotation(this.getRotation() + Kinetic.Util._degToRad(e)),
            this
        },
        moveToTop: function () {
            var e = this.index;
            return this.parent.children.splice(e, 1),
            this.parent.children.push(this),
            this.parent._setChildrenIndices(),
            !0
        },
        moveUp: function () {
            var e = this.index,
            t = this.parent.getChildren().length;
            return e < t - 1 ? (this.parent.children.splice(e, 1), this.parent.children.splice(e + 1, 0, this), this.parent._setChildrenIndices(), !0) : !1
        },
        moveDown: function () {
            var e = this.index;
            return e > 0 ? (this.parent.children.splice(e, 1), this.parent.children.splice(e - 1, 0, this), this.parent._setChildrenIndices(), !0) : !1
        },
        moveToBottom: function () {
            var e = this.index;
            return e > 0 ? (this.parent.children.splice(e, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : !1
        },
        setZIndex: function (e) {
            var t = this.index;
            return this.parent.children.splice(t, 1),
            this.parent.children.splice(e, 0, this),
            this.parent._setChildrenIndices(),
            this
        },
        getAbsoluteOpacity: function () {
            return this._getCache(p, this._getAbsoluteOpacity)
        },
        _getAbsoluteOpacity: function () {
            var e = this.getOpacity();
            return this.getParent() && (e *= this.getParent().getAbsoluteOpacity()),
            e
        },
        moveTo: function (e) {
            return tt.prototype.remove.call(this),
            e.add(this),
            this
        },
        toObject: function () {
            var e = Kinetic.Util,
            t = {},
            n = this.getAttrs(),
            r,
            i,
            s,
            o;
            t.attrs = {};
            for (r in n) i = n[r],
            !e._isFunction(i) && !e._isElement(i) && (!e._isObject(i) || !e._hasMethods(i)) && (s = this[N + Kinetic.Util._capitalize(r)], o = s ? s.call({
                attrs: {}
            }) : null, o != i && (t.attrs[r] = i));
            return t.className = this.getClassName(),
            t
        },
        toJSON: function () {
            return JSON.stringify(this.toObject())
        },
        getParent: function () {
            return this.parent
        },
        getLayer: function () {
            var e = this.getParent();
            return e ? e.getLayer() : null
        },
        getStage: function () {
            return this._getCache(R, this._getStage)
        },
        _getStage: function () {
            var e = this.getParent();
            return e ? e.getStage() : undefined
        },
        fire: function (e, t, n) {
            return n ? this._fireAndBubble(e, t || {}) : this._fire(e, t || {}),
            this
        },
        getAbsoluteTransform: function () {
            return this._getCache(d, this._getAbsoluteTransform)
        },
        _getAbsoluteTransform: function () {
            var e = new r,
            t;
            return this._eachAncestorReverse(function (n) {
                t = n.getTransform(),
                e.multiply(t)
            },
            !0),
            e
        },
        _getTransform: function () {
            var e = new r,
            t = this.getX(),
            n = this.getY(),
            i = this.getRotation(),
            s = this.getScaleX(),
            o = this.getScaleY(),
            u = this.getSkewX(),
            a = this.getSkewY(),
            f = this.getOffsetX(),
            l = this.getOffsetY();
            return (t !== 0 || n !== 0) && e.translate(t, n),
            i !== 0 && e.rotate(i),
            (u !== 0 || a !== 0) && e.skew(u, a),
            (s !== 1 || o !== 1) && e.scale(s, o),
            (f !== 0 || l !== 0) && e.translate(-1 * f, -1 * l),
            e
        },
        clone: function (e) {
            var t = this.getClassName(),
            n = new Kinetic[t](this.attrs),
            r,
            i,
            s,
            o,
            u;
            for (r in this.eventListeners) {
                i = this.eventListeners[r],
                s = i.length;
                for (o = 0; o < s; o++) u = i[o],
                u.name.indexOf(L) < 0 && (n.eventListeners[r] || (n.eventListeners[r] = []), n.eventListeners[r].push(u))
            }
            return n.setAttrs(e),
            n
        },
        toDataURL: function (e) {
            e = e || {};
            var t = e.mimeType || null,
            n = e.quality || null,
            r = this.getStage(),
            i = e.x || 0,
            s = e.y || 0,
            o = new Kinetic.SceneCanvas({
                width: e.width || this.getWidth() || (r ? r.getWidth() : 0),
                height: e.height || this.getHeight() || (r ? r.getHeight() : 0),
                pixelRatio: 1
            }),
            u = o.getContext();
            return u.save(),
            (i || s) && u.translate(-1 * i, -1 * s),
            this.drawScene(o),
            u.restore(),
            o.toDataURL(t, n)
        },
        toImage: function (e) {
            Kinetic.Util._getImage(this.toDataURL(e),
            function (t) {
                e.callback(t)
            })
        },
        setSize: function (e) {
            return this.setWidth(e.width),
            this.setHeight(e.height),
            this
        },
        getSize: function () {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            }
        },
        getWidth: function () {
            return this.attrs.width || 0
        },
        getHeight: function () {
            return this.attrs.height || 0
        },
        getClassName: function () {
            return this.className || this.nodeType
        },
        getType: function () {
            return this.nodeType
        },
        _get: function (e) {
            return this.nodeType === e ? [this] : []
        },
        _off: function (e, t) {
            var n = this.eventListeners[e],
            r,
            i;
            for (r = 0; r < n.length; r++) {
                i = n[r].name;
                if ((i !== "kinetic" || t === "kinetic") && (!t || i === t)) {
                    n.splice(r, 1);
                    if (n.length === 0) {
                        delete this.eventListeners[e];
                        break
                    }
                    r--
                }
            }
        },
        _fireBeforeChangeEvent: function (e, t, n) {
            this._fire([g, Kinetic.Util._capitalize(e), b].join(x), {
                oldVal: t,
                newVal: n
            })
        },
        _fireChangeEvent: function (e, t, n) {
            this._fire(e + b, {
                oldVal: t,
                newVal: n
            })
        },
        setId: function (e) {
            var t = this.getId();
            return a(t),
            f(this, e),
            this._setAttr(k, e),
            this
        },
        setName: function (e) {
            var t = this.getName();
            return Kinetic._removeName(t, this._id),
            Kinetic._addName(this, e),
            this._setAttr(_, e),
            this
        },
        setAttr: function () {
            var e = Array.prototype.slice.call(arguments),
            t = e[0],
            n = e[1],
            r = F + Kinetic.Util._capitalize(t),
            i = this[r];
            return Kinetic.Util._isFunction(i) ? i.call(this, n) : this._setAttr(t, n),
            this
        },
        _setAttr: function (e, t) {
            var n;
            t !== undefined && (n = this.attrs[e], this.attrs[e] = t, this._fireChangeEvent(e, n, t))
        },
        _setComponentAttr: function (e, t, n) {
            var r;
            n !== undefined && (r = this.attrs[e], r || (this.attrs[e] = this.getAttr(e)), this.attrs[e][t] = n, this._fireChangeEvent(e, r, n))
        },
        _fireAndBubble: function (e, t, n) {
            var r = !0;
            t && this.nodeType === I && (t.targetNode = this),
            e === O && n && this._id === n._id ? r = !1 : e === M && n && this._id === n._id && (r = !1),
            r && (this._fire(e, t), t && !t.cancelBubble && this.parent && (n && n.parent ? this._fireAndBubble.call(this.parent, e, t, n.parent) : this._fireAndBubble.call(this.parent, e, t)))
        },
        _fire: function (e, t) {
            var n = this.eventListeners[e],
            r;
            if (n) for (r = 0; r < n.length; r++) n[r].handler.call(this, t)
        },
        draw: function () {
            return this.drawScene(),
            this.drawHit(),
            this
        },
        shouldDrawHit: function () {
            return this.isListening() && this.isVisible() && !c()
        },
        isDraggable: function () {
            return !1
        },
        getTransform: function () {
            return this._getCache(U, this._getTransform)
        }
    }),
    tt.create = function (e, t) {
        return this._createNode(JSON.parse(e), t)
    },
    tt._createNode = function (e, t) {
        var n = tt.prototype.getClassName.call(e),
        r = e.children,
        i,
        s,
        o;
        t && (e.attrs.container = t),
        i = new Kinetic[n](e.attrs);
        if (r) {
            s = r.length;
            for (o = 0; o < s; o++) i.add(this._createNode(r[o]))
        }
        return i
    },
    s.addGetterSetter(tt, "x", 0),
    s.addGetterSetter(tt, "y", 0),
    s.addGetterSetter(tt, "opacity", 1),
    s.addGetter(tt, "name"),
    s.addGetter(tt, "id"),
    s.addRotationGetterSetter(tt, "rotation", 0),
    s.addPointGetterSetter(tt, "scale", 1),
    s.addPointGetterSetter(tt, "skew", 0),
    s.addPointGetterSetter(tt, "offset", 0),
    s.addSetter(tt, "width", 0),
    s.addSetter(tt, "height", 0),
    s.addGetterSetter(tt, "listening", !0),
    s.addGetterSetter(tt, "visible", !0),
    u.mapMethods(tt),
    {
        self: tt
    }
}),
define("Container", ["Utils", "Collection", "Node", "Factory"],
function (e, t, n, r) {
    var i = e.self.addMethods,
    s = n.self,
    o = r.self,
    u = e.self.extend,
    a = t.self,
    f = "",
    l = ["xChange", "yChange", "scaleXChange", "scaleYChange", "skewXChange", "skewYChange", "rotationChange", "offsetXChange", "offsetYChange"].join(f),
    c = function (e) {
        this.__init(e)
    };
    return i(c, {
        __init: function (e) {
            this.children = new a,
            s.call(this, e),
            this.on(l,
            function () {
                var e = this.getStage();
                e && (e._enableNestedTransforms = !0)
            })
        },
        getChildren: function () {
            return this.children
        },
        hasChildren: function () {
            return this.getChildren().length > 0
        },
        removeChildren: function () {
            var e = this.children,
            t;
            while (e.length > 0) t = e[0],
            t.hasChildren() && t.removeChildren(),
            t.remove();
            return this
        },
        destroyChildren: function () {
            var e = this.children;
            while (e.length > 0) e[0].destroy();
            return this
        },
        add: function (e) {
            var t = this.children;
            return this._validateAdd(e),
            e.index = t.length,
            e.parent = this,
            t.push(e),
            this._fire("add", {
                child: e
            }),
            this
        },
        destroy: function () {
            this.hasChildren() && this.destroyChildren(),
            s.prototype.destroy.call(this)
        },
        find: function (e) {
            var t = [],
            n = e.replace(/ /g, "").split(","),
            r = n.length,
            i,
            s,
            o,
            u,
            a,
            f,
            l;
            for (i = 0; i < r; i++) {
                o = n[i];
                if (o.charAt(0) === "#") a = this._getNodeById(o.slice(1)),
                a && t.push(a);
                else if (o.charAt(0) === ".") u = this._getNodesByName(o.slice(1)),
                t = t.concat(u);
                else {
                    f = this.getChildren(),
                    l = f.length;
                    for (s = 0; s < l; s++) t = t.concat(f[s]._get(o))
                }
            }
            return Kinetic.Collection.toCollection(t)
        },
        _getNodeById: function (e) {
            var t = Kinetic.ids[e];
            return t !== undefined && this.isAncestorOf(t) ? t : null
        },
        _getNodesByName: function (e) {
            var t = Kinetic.names[e] || [];
            return this._getDescendants(t)
        },
        _get: function (e) {
            var t = Kinetic.Node.prototype._get.call(this, e),
            n = this.getChildren(),
            r = n.length;
            for (var i = 0; i < r; i++) t = t.concat(n[i]._get(e));
            return t
        },
        toObject: function () {
            var e = Kinetic.Node.prototype.toObject.call(this);
            e.children = [];
            var t = this.getChildren(),
            n = t.length;
            for (var r = 0; r < n; r++) {
                var i = t[r];
                e.children.push(i.toObject())
            }
            return e
        },
        _getDescendants: function (e) {
            var t = [],
            n = e.length;
            for (var r = 0; r < n; r++) {
                var i = e[r];
                this.isAncestorOf(i) && t.push(i)
            }
            return t
        },
        isAncestorOf: function (e) {
            var t = e.getParent();
            while (t) {
                if (t._id === this._id) return !0;
                t = t.getParent()
            }
            return !1
        },
        clone: function (e) {
            var t = Kinetic.Node.prototype.clone.call(this, e);
            return this.getChildren().each(function (e) {
                t.add(e.clone())
            }),
            t
        },
        getAllIntersections: function (e) {
            var t = [];
            return this.find("Shape").each(function (n) {
                n.isVisible() && n.intersects(e) && t.push(n)
            }),
            t
        },
        _setChildrenIndices: function () {
            this.children.each(function (e, t) {
                e.index = t
            })
        },
        drawScene: function (e) {
            var t = this.getLayer(),
            n = this.getClipWidth() && this.getClipHeight(),
            r,
            i,
            s;
            return !e && t && (e = t.getCanvas()),
            this.isVisible() && (n ? e.getContext()._clip(this) : this._drawChildren(e)),
            this
        },
        _drawChildren: function (e) {
            this.children.each(function (t) {
                t.drawScene(e)
            })
        },
        drawHit: function () {
            var e = this.getClipWidth() && this.getClipHeight() && this.nodeType !== "Stage",
            t = 0,
            n = 0,
            r = [],
            i;
            if (this.shouldDrawHit()) {
                e && (i = this.getLayer().hitCanvas, i.getContext()._clip(this)),
                r = this.children,
                n = r.length;
                for (t = 0; t < n; t++) r[t].drawHit();
                e && i.getContext()._context.restore()
            }
            return this
        }
    }),
    u(c, s),
    c.prototype.get = c.prototype.find,
    o.addBoxGetterSetter(c, "clip"),
    o.addGetterSetter(c, "clipX", 0),
    o.addGetterSetter(c, "clipY", 0),
    o.addGetterSetter(c, "clipWidth", 0),
    o.addGetterSetter(c, "clipHeight", 0),
    {
        self: c
    }
}),
define("Context", ["Utils"],
function (e) {
    var t = e.self.enableTrance,
    n = e.self.traceArrMax,
    r = e.self.extend,
    i = e.self._isArray,
    s = ",",
    o = "(",
    u = ")",
    a = "([",
    f = "])",
    l = ";",
    c = "()",
    h = "",
    p = "=",
    d = "set",
    v = ["arc", "arcTo", "beginPath", "bezierCurveTo", "clearRect", "clip", "closePath", "createLinearGradient", "createPattern", "createRadialGradient", "drawImage", "fill", "fillText", "getImageData", "createImageData", "lineTo", "moveTo", "putImageData", "quadraticCurveTo", "rect", "restore", "rotate", "save", "scale", "setLineDash", "setTransform", "stroke", "strokeText", "transform", "translate"],
    m = function (e) {
        this.__init(e)
    };
    m.prototype = {
        __init: function (e) {
            this.canvas = e,
            this._context = e._canvas.getContext("2d"),
            t && (this.traceArr = [], this._enableTrace())
        },
        fillShape: function (e) {
            e.getFillEnabled() && this._fill(e)
        },
        strokeShape: function (e) {
            e.getStrokeEnabled() && this._stroke(e)
        },
        fillStrokeShape: function (e) {
            var t = e.getFillEnabled();
            t && this._fill(e),
            e.getStrokeEnabled() && this._stroke(e)
        },
        getTrace: function (e) {
            var t = this.traceArr,
            n = t.length,
            r = "",
            h, d, v, m;
            for (h = 0; h < n; h++) d = t[h],
            v = d.method,
            v ? (m = d.args, r += v, e ? r += c : i(m[0]) ? r += a + m.join(s) + f : r += o + m.join(s) + u) : (r += d.property, e || (r += p + d.val)),
            r += l;
            return r
        },
        clearTrace: function () {
            this.traceArr = []
        },
        _trace: function (e) {
            var t = this.traceArr,
            r;
            t.push(e),
            r = t.length,
            r >= n && t.shift()
        },
        reset: function () {
            var e = this.getCanvas().getPixelRatio();
            this.setTransform(1 * e, 0, 0, 1 * e, 0, 0)
        },
        getCanvas: function () {
            return this.canvas
        },
        clear: function (e) {
            var t = this.getCanvas(),
            n,
            r;
            e ? this.clearRect(e.x || 0, e.y || 0, e.width || 0, e.height || 0) : this.clearRect(0, 0, t.getWidth(), t.getHeight())
        },
        _applyLineCap: function (e) {
            var t = e.getLineCap();
            t && this.setAttr("lineCap", t)
        },
        _applyOpacity: function (e) {
            var t = e.getAbsoluteOpacity();
            t !== 1 && this.setAttr("globalAlpha", t)
        },
        _applyLineJoin: function (e) {
            var t = e.getLineJoin();
            t && this.setAttr("lineJoin", t)
        },
        _applyAncestorTransforms: function (e) {
            var t = e.getStage(),
            n;
            t && t._enableNestedTransforms ? n = e.getAbsoluteTransform().getMatrix() : n = e.getTransform().getMatrix(),
            this.transform(n[0], n[1], n[2], n[3], n[4], n[5])
        },
        _clip: function (e) {
            var t = e.getClipX(),
            n = e.getClipY(),
            r = e.getClipWidth(),
            i = e.getClipHeight();
            this.save(),
            this._applyAncestorTransforms(e),
            this.beginPath(),
            this.rect(t, n, r, i),
            this.clip(),
            this.reset(),
            e._drawChildren(this.getCanvas()),
            this.restore()
        },
        setAttr: function (e, t) {
            this._context[e] = t
        },
        arc: function () {
            var e = arguments;
            this._context.arc(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        beginPath: function () {
            this._context.beginPath()
        },
        bezierCurveTo: function () {
            var e = arguments;
            this._context.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        clearRect: function () {
            var e = arguments;
            this._context.clearRect(e[0], e[1], e[2], e[3])
        },
        clip: function () {
            this._context.clip()
        },
        closePath: function () {
            this._context.closePath()
        },
        createImageData: function () {
            var e = arguments;
            if (e.length === 2) return this._context.createImageData(e[0], e[1]);
            if (e.length === 1) return this._context.createImageData(e[0])
        },
        createLinearGradient: function () {
            var e = arguments;
            return this._context.createLinearGradient(e[0], e[1], e[2], e[3])
        },
        createPattern: function () {
            var e = arguments;
            return this._context.createPattern(e[0], e[1])
        },
        createRadialGradient: function () {
            var e = arguments;
            return this._context.createRadialGradient(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        fillRect: function (e, t, n, r) {
            return this._context.fillRect(e, t, n, r)
        },
        drawImage: function () {
            var e = arguments,
            t = this._context;
            e.length === 3 ? t.drawImage(e[0], e[1], e[2]) : e.length === 5 ? t.drawImage(e[0], e[1], e[2], e[3], e[4]) : e.length === 9 && t.drawImage(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8])
        },
        fill: function () {
            this._context.fill()
        },
        fillStyle: function () {
            var e = arguments;
            this._context.fillStyle = e[0]
        },
        fillText: function () {
            var e = arguments;
            this._context.fillText(e[0], e[1], e[2])
        },
        getImageData: function () {
            var e = arguments;
            return this._context.getImageData(e[0], e[1], e[2], e[3])
        },
        lineTo: function () {
            var e = arguments;
            this._context.lineTo(e[0], e[1])
        },
        moveTo: function () {
            var e = arguments;
            this._context.moveTo(e[0], e[1])
        },
        rect: function () {
            var e = arguments;
            this._context.rect(e[0], e[1], e[2], e[3])
        },
        putImageData: function () {
            var e = arguments;
            this._context.putImageData(e[0], e[1], e[2])
        },
        quadraticCurveTo: function () {
            var e = arguments;
            this._context.quadraticCurveTo(e[0], e[1], e[2], e[3])
        },
        restore: function () {
            this._context.restore()
        },
        rotate: function () {
            var e = arguments;
            this._context.rotate(e[0])
        },
        save: function () {
            this._context.save()
        },
        scale: function () {
            var e = arguments;
            this._context.scale(e[0], e[1])
        },
        setLineDash: function () {
            var e = arguments,
            t = this._context;
            this._context.setLineDash ? t.setLineDash(e[0]) : "mozDash" in t ? t.mozDash = e[0] : "webkitLineDash" in t && (t.webkitLineDash = e[0])
        },
        setTransform: function () {
            var e = arguments;
            this._context.setTransform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        stroke: function () {
            this._context.stroke()
        },
        strokeText: function () {
            var e = arguments;
            this._context.strokeText(e[0], e[1], e[2])
        },
        transform: function () {
            var e = arguments;
            this._context.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        translate: function () {
            var e = arguments;
            this._context.translate(e[0], e[1])
        },
        _enableTrace: function () {
            var e = this,
            t = v.length,
            n = Kinetic.Util._simplifyArray,
            r = this.setAttr,
            i, s;
            for (i = 0; i < t; i++) (function (t) {
                var r = e[t],
                i;
                e[t] = function () {
                    return s = n(Array.prototype.slice.call(arguments, 0)),
                    i = r.apply(e, arguments),
                    e._trace({
                        method: t,
                        args: s
                    }),
                    i
                }
            })(v[i]);
            e.setAttr = function () {
                r.apply(e, arguments),
                e._trace({
                    property: arguments[0],
                    val: arguments[1]
                })
            }
        }
    };
    var g = function (e) {
        m.call(this, e)
    };
    g.prototype = {
        _fillColor: function (e) {
            var t = e.getFill();
            this.setAttr("fillStyle", t),
            e._fillFunc(this)
        },
        _fillPattern: function (e) {
            var t = e.getFillPatternImage(),
            n = e.getFillPatternX(),
            r = e.getFillPatternY(),
            i = e.getFillPatternScale(),
            s = e.getFillPatternRotation(),
            o = e.getFillPatternOffset(),
            u = e.getFillPatternRepeat(); (n || r) && this.translate(n || 0, r || 0),
            s && this.rotate(s),
            i && this.scale(i.x, i.y),
            o && this.translate(-1 * o.x, -1 * o.y),
            this.setAttr("fillStyle", this.createPattern(t, u || "repeat")),
            this.fill()
        },
        _fillLinearGradient: function (e) {
            var t = e.getFillLinearGradientStartPoint(),
            n = e.getFillLinearGradientEndPoint(),
            r = e.getFillLinearGradientColorStops(),
            i = this.createLinearGradient(t.x, t.y, n.x, n.y);
            if (r) {
                for (var s = 0; s < r.length; s += 2) i.addColorStop(r[s], r[s + 1]);
                this.setAttr("fillStyle", i),
                this.fill()
            }
        },
        _fillRadialGradient: function (e) {
            var t = e.getFillRadialGradientStartPoint(),
            n = e.getFillRadialGradientEndPoint(),
            r = e.getFillRadialGradientStartRadius(),
            i = e.getFillRadialGradientEndRadius(),
            s = e.getFillRadialGradientColorStops(),
            o = this.createRadialGradient(t.x, t.y, r, n.x, n.y, i);
            for (var u = 0; u < s.length; u += 2) o.addColorStop(s[u], s[u + 1]);
            this.setAttr("fillStyle", o),
            this.fill()
        },
        _fill: function (e) {
            var t = e.getFill(),
            n = e.getFillPatternImage(),
            r = e.getFillLinearGradientColorStops(),
            i = e.getFillRadialGradientColorStops(),
            s = e.getFillPriority();
            t && s === "color" ? this._fillColor(e) : n && s === "pattern" ? this._fillPattern(e) : r && s === "linear-gradient" ? this._fillLinearGradient(e) : i && s === "radial-gradient" ? this._fillRadialGradient(e) : t ? this._fillColor(e) : n ? this._fillPattern(e) : r ? this._fillLinearGradient(e) : i && this._fillRadialGradient(e)
        },
        _stroke: function (e) {
            var t = e.getStroke(),
            n = e.getStrokeWidth(),
            r = e.getDashArray(),
            i = e.getStrokeScaleEnabled();
            e.hasStroke() && (i || (this.save(), this.setTransform(1, 0, 0, 1, 0, 0)), this._applyLineCap(e), r && e.getDashArrayEnabled() && this.setLineDash(r), this.setAttr("lineWidth", n || 2), this.setAttr("strokeStyle", t || "black"), e._strokeFunc(this), i || this.restore())
        },
        _applyShadow: function (e) {
            var t = Kinetic.Util,
            n = e.getAbsoluteOpacity(),
            r = t.get(e.getShadowColor(), "black"),
            i = t.get(e.getShadowBlur(), 5),
            s = t.get(e.getShadowOpacity(), 0),
            o = t.get(e.getShadowOffset(), {
                x: 0,
                y: 0
            });
            s && this.setAttr("globalAlpha", s * n),
            this.setAttr("shadowColor", r),
            this.setAttr("shadowBlur", i),
            this.setAttr("shadowOffsetX", o.x),
            this.setAttr("shadowOffsetY", o.y)
        }
    },
    r(g, m);
    var y = function (e) {
        m.call(this, e)
    };
    return y.prototype = {
        _fill: function (e) {
            this.save(),
            this.setAttr("fillStyle", e.colorKey),
            e._fillFuncHit(this),
            this.restore()
        },
        _stroke: function (e) {
            var t = e.getStroke(),
            n = e.getStrokeWidth();
            if (t || n) this._applyLineCap(e),
            this.setAttr("lineWidth", n || 2),
            this.setAttr("strokeStyle", e.colorKey),
            e._strokeFuncHit(this)
        }
    },
    r(y, m),
    {
        HitContext: y,
        Context: m,
        SceneContext: g
    }
}),
define("Canvas", ["Utils", "Context"],
function (e, t) {
    var n = e.self.extend,
    r = e.self.pixelRatio,
    i = t.HitContext,
    s = t.SceneContext,
    o = document.createElement("canvas"),
    u = o.getContext("2d"),
    a = window.devicePixelRatio || 1,
    f = u.webkitBackingStorePixelRatio || u.mozBackingStorePixelRatio || u.msBackingStorePixelRatio || u.oBackingStorePixelRatio || u.backingStorePixelRatio || 1,
    l = a / f,
    c = function (e) {
        this.__init(e)
    };
    c.prototype = {
        __init: function (e) {
            e = e || {};
            var t = e.pixelRatio || t || l;
            this.pixelRatio = t,
            this._canvas = document.createElement("canvas"),
            this._canvas.id = e.id || "",
            this._canvas.style.padding = 0,
            this._canvas.style.margin = 0,
            this._canvas.style.border = 0,
            this._canvas.style.background = "transparent",
            this._canvas.style.position = "absolute",
            this._canvas.style.top = (e.x || 0).toString() + "px",
            this._canvas.style.left = (e.y || 0).toString() + "px"
        },
        setCanvasX: function (e) {
            this._canvas.style.top = (e || 0).toString() + "px"
        },
        setCanvasY: function (e) {
            this._canvas.style.left = (e || 0).toString() + "px"
        },
        getCanvas: function () {
            return this._canvas
        },
        getContext: function () {
            return this.context
        },
        getPixelRatio: function () {
            return this.pixelRatio
        },
        setPixelRatio: function (e) {
            this.pixelRatio = e,
            this.setSize(this.getWidth(), this.getHeight())
        },
        setWidth: function (e) {
            this.width = this._canvas.width = e * this.pixelRatio,
            this._canvas.style.width = e + "px"
        },
        setHeight: function (e) {
            this.height = this._canvas.height = e * this.pixelRatio,
            this._canvas.style.height = e + "px"
        },
        getWidth: function () {
            return this.width
        },
        getHeight: function () {
            return this.height
        },
        setSize: function (e, t) {
            this.setWidth(e),
            this.setHeight(t)
        },
        toDataURL: function (e, t) {
            try {
                return this._canvas.toDataURL(e, t)
            } catch (n) {
                try {
                    return this._canvas.toDataURL()
                } catch (r) {
                    return Kinetic.Util.warn("Unable to get data URL. " + r.message),
                    ""
                }
            }
        }
    };
    var h = function (e) {
        e = e || {};
        var t = e.width || 0,
        n = e.height || 0;
        c.call(this, e),
        this.context = new s(this),
        this.setSize(t, n)
    };
    h.prototype = {
        setWidth: function (e) {
            var t = this.pixelRatio,
            n = this.getContext()._context;
            c.prototype.setWidth.call(this, e),
            n.scale(t, t)
        },
        setHeight: function (e) {
            var t = this.pixelRatio,
            n = this.getContext()._context;
            c.prototype.setHeight.call(this, e),
            n.scale(t, t)
        }
    },
    n(h, c);
    var p = function (e) {
        e = e || {};
        var t = e.width || 0,
        n = e.height || 0;
        c.call(this, e),
        this.context = new i(this),
        this.setSize(t, n)
    };
    return n(p, c),
    {
        HitCanvas: p,
        Canvas: c,
        SceneCanvas: h
    }
}),
define("Layer", ["Utils", "Container", "Factory", "Canvas", "Node"],
function (e, t, n, r, i) {
    var s = e.self.addMethods,
    o = n.self,
    u = r.SceneCanvas,
    a = r.HitCanvas,
    f = t.self,
    l = e.self.shapes,
    c = e.self._rgbToHex,
    i = i.self,
    h = e.self._isInDocument,
    p = e.self.extend,
    d = "#",
    v = "beforeDraw",
    m = "draw",
    g = [{
        x: 0,
        y: 0
    },
    {
        x: -1,
        y: 0
    },
    {
        x: -1,
        y: -1
    },
    {
        x: 0,
        y: -1
    },
    {
        x: 1,
        y: -1
    },
    {
        x: 1,
        y: 0
    },
    {
        x: 1,
        y: 1
    },
    {
        x: 0,
        y: 1
    },
    {
        x: -1,
        y: 1
    }],
    y = g.length,
    b = function (e) {
        this.___init(e)
    };
    return s(b, {
        ___init: function (e) {
            this.nodeType = "Layer",
            this.canvas = new u(e),
            this.hitCanvas = new a(e),
            f.call(this, e)
        },
        setCanvasXY: function (e, t) {
            this.setX(e),
            this.setY(t),
            this.canvas.setCanvasX(e),
            this.canvas.setCanvasY(t),
            this.hitCanvas.setCanvasX(e),
            this.hitCanvas.setCanvasY(t)
        },
        setWH: function (e, t) {
            this.canvas.setWidth(e),
            this.hitCanvas.setWidth(e),
            this.canvas.setHeight(t),
            this.hitCanvas.setHeight(t)
        },
        _validateAdd: function (e) {
            var t = e.getType();
            t !== "Group" && t !== "Shape" && Kinetic.Util.error("You may only add groups and shapes to a layer.")
        },
        getIntersection: function (e) {
            var t, n, r, i;
            if (!this.isVisible()) return null;
            for (n = 0; n < y; n++) {
                r = g[n],
                t = this._getIntersection({
                    x: e.x + r.x,
                    y: e.y + r.y
                }),
                i = t.shape;
                if (i) return i;
                if (!t.antialiased) return null
            }
        },
        _getIntersection: function (e) {
            var t = this.hitCanvas.context._context.getImageData(e.x, e.y, 1, 1).data,
            n = t[3],
            r,
            i;
            return n === 255 ? (r = c(t[0], t[1], t[2]), i = l[d + r], {
                shape: i
            }) : n > 0 ? {
                antialiased: !0
            } : {}
        },
        drawScene: function (e) {
            return e = e || this.getCanvas(),
            this._fire(v, {
                node: this
            }),
            this.getClearBeforeDraw() && e.getContext().clear(),
            f.prototype.drawScene.call(this, e),
            this._fire(m, {
                node: this
            }),
            this
        },
        drawHit: function () {
            var e = this.getLayer();
            return e && e.getClearBeforeDraw() && e.getHitCanvas().getContext().clear(),
            f.prototype.drawHit.call(this),
            this
        },
        getCanvas: function () {
            return this.canvas
        },
        getHitCanvas: function () {
            return this.hitCanvas
        },
        getContext: function () {
            return this.getCanvas().getContext()
        },
        clear: function (e) {
            var t = this.getContext(),
            n = this.getHitCanvas().getContext();
            return t.clear(e),
            n.clear(e),
            this
        },
        setVisible: function (e) {
            return i.prototype.setVisible.call(this, e),
            e ? (this.getCanvas()._canvas.style.display = "block", this.hitCanvas._canvas.style.display = "block") : (this.getCanvas()._canvas.style.display = "none", this.hitCanvas._canvas.style.display = "none"),
            this
        },
        setZIndex: function (e) {
            Kinetic.Node.prototype.setZIndex.call(this, e);
            var t = this.getStage();
            return t && (t.content.removeChild(this.getCanvas()._canvas), e < t.getChildren().length - 1 ? t.content.insertBefore(this.getCanvas()._canvas, t.getChildren()[e + 1].getCanvas()._canvas) : t.content.appendChild(this.getCanvas()._canvas)),
            this
        },
        moveToTop: function () {
            i.prototype.moveToTop.call(this);
            var e = this.getStage();
            e && (e.content.removeChild(this.getCanvas()._canvas), e.content.appendChild(this.getCanvas()._canvas))
        },
        moveUp: function () {
            if (Kinetic.Node.prototype.moveUp.call(this)) {
                var e = this.getStage();
                e && (e.content.removeChild(this.getCanvas()._canvas), this.index < e.getChildren().length - 1 ? e.content.insertBefore(this.getCanvas()._canvas, e.getChildren()[this.index + 1].getCanvas()._canvas) : e.content.appendChild(this.getCanvas()._canvas))
            }
        },
        moveDown: function () {
            if (Kinetic.Node.prototype.moveDown.call(this)) {
                var e = this.getStage();
                if (e) {
                    var t = e.getChildren();
                    e.content.removeChild(this.getCanvas()._canvas),
                    e.content.insertBefore(this.getCanvas()._canvas, t[this.index + 1].getCanvas()._canvas)
                }
            }
        },
        moveToBottom: function () {
            if (i.prototype.moveToBottom.call(this)) {
                var e = this.getStage();
                if (e) {
                    var t = e.getChildren();
                    e.content.removeChild(this.getCanvas()._canvas),
                    e.content.insertBefore(this.getCanvas()._canvas, t[1].getCanvas()._canvas)
                }
            }
        },
        getLayer: function () {
            return this
        },
        remove: function () {
            var e = this.getStage(),
            t = this.getCanvas(),
            n = t._canvas;
            return i.prototype.remove.call(this),
            e && n && h(n) && e.content.removeChild(n),
            this
        },
        getStage: function () {
            return this.parent
        }
    }),
    p(b, f),
    o.addGetterSetter(b, "clearBeforeDraw",
    function () {
        return !0
    }),
    {
        self: b
    }
}),
define("Stage", ["Utils", "Container", "Factory", "Node", "Canvas"],
function (e, t, n, r, i) {
    function ut(e, t) {
        e.content.addEventListener(t,
        function (n) {
            e[nt + t](n)
        },
        !1)
    }
    var s = e.self.addMethods,
    o = e.self._getNewId,
    u = e.self._isInDocument,
    a = e.self.stages,
    f = e.self.extend,
    l = n.self,
    c = r.self,
    h = e.self.inDblClickWindow,
    p = i.SceneCanvas,
    d = i.HitCanvas,
    v = e.self.isDragging,
    m = e.self.dblClickWindow,
    g = e.self.listenClickTap,
    y = t.self,
    b = "Stage",
    w = "string",
    E = "px",
    S = "mouseout",
    x = "mouseleave",
    T = "mouseover",
    N = "mouseenter",
    C = "mousemove",
    k = "mousedown",
    L = "mouseup",
    A = "click",
    O = "dblclick",
    M = "touchstart",
    _ = "touchend",
    D = "tap",
    P = "dbltap",
    H = "touchmove",
    B = "contentMouseout",
    j = "contentMouseleave",
    F = "contentMouseover",
    I = "contentMouseenter",
    q = "contentMousemove",
    R = "contentMousedown",
    U = "contentMouseup",
    z = "contentClick",
    W = "contentDblclick",
    X = "contentTouchstart",
    V = "contentTouchend",
    $ = "contentTap",
    J = "contentDbltap",
    K = "contentTouchmove",
    Q = "contentBuffersize",
    G = "div",
    Y = "relative",
    Z = "inline-block",
    et = "render-content",
    tt = " ",
    nt = "_",
    rt = "container",
    it = "",
    st = [k, C, L, S, M, H, _, T],
    ot = st.length,
    at = function (e) {
        this.___init(e)
    };
    return s(at, {
        ___init: function (e) {
            this.nodeType = b,
            y.call(this, e),
            this._id = o(),
            this._buildDOM(),
            this._bindContentEvents(),
            this._enableNestedTransforms = !1,
            a.push(this)
        },
        _validateAdd: function (e) {
            if (e.getType() !== "Layer") throw "Stage对象只能添加Layer类型"
        },
        setBufferSize: function (e) {
            this._setAttr(Q, e)
        },
        setContainer: function (e) {
            return typeof e === w && (e = document.getElementById(e)),
            this._setAttr(rt, e),
            this
        },
        draw: function () {
            return c.prototype.draw.call(this),
            this
        },
        setHeight: function (e) {
            return c.prototype.setHeight.call(this, e),
            this._resizeDOM(),
            this
        },
        setWidth: function (e) {
            return c.prototype.setWidth.call(this, e),
            this._resizeDOM(),
            this
        },
        clear: function () {
            var e = this.children,
            t = e.length,
            n;
            for (n = 0; n < t; n++) e[n].clear();
            return this
        },
        destroy: function () {
            var e = this.content;
            y.prototype.destroy.call(this),
            e && u(e) && this.getContainer().removeChild(e)
        },
        getPointerPosition: function () {
            return this.pointerPos
        },
        getStage: function () {
            return this
        },
        getContent: function () {
            return this.content
        },
        toDataURL: function (e) {
            function a(r) {
                var i = u[r],
                f = i.toDataURL(),
                l = new Image;
                l.onload = function () {
                    o.drawImage(l, 0, 0),
                    r < u.length - 1 ? a(r + 1) : e.callback(s.toDataURL(t, n))
                },
                l.src = f
            }
            e = e || {};
            var t = e.mimeType || null,
            n = e.quality || null,
            r = e.x || 0,
            i = e.y || 0,
            s = new Kinetic.SceneCanvas({
                width: e.width || this.getWidth(),
                height: e.height || this.getHeight(),
                pixelRatio: 1
            }),
            o = s.getContext()._context,
            u = this.children; (r || i) && o.translate(-1 * r, -1 * i),
            a(0)
        },
        toImage: function (e) {
            var t = e.callback;
            e.callback = function (e) {
                Kinetic.Util._getImage(e,
                function (e) {
                    t(e)
                })
            },
            this.toDataURL(e)
        },
        getIntersection: function (e) {
            var t = this.getChildren(),
            n = t.length,
            r = n - 1,
            i,
            s;
            for (i = r; i >= 0; i--) {
                if (e.id === "") return s = t[i].getIntersection(e),
                s ? s : null;
                if (t[i].attrs.id === e.id) return s = t[i].getIntersection(e),
                s ? s : null
            }
        },
        _resizeDOM: function () {
            if (this.content) {
                var e = this.getWidth(),
                t = this.getHeight(),
                n = this.getChildren(),
                r = n.length,
                i = this.getAttr(Q),
                s,
                o;
                this.content.style.width = e + E,
                this.content.style.height = t + E,
                this.bufferCanvas.setSize(i || e, i || t),
                this.bufferHitCanvas.setSize(i || e, i || t);
                for (s = 0; s < r; s++) o = n[s],
                o.getCanvas().setSize(e, t),
                o.hitCanvas.setSize(e, t),
                o.draw()
            }
        },
        add: function (e) {
            return y.prototype.add.call(this, e),
            this.content.appendChild(e.canvas._canvas),
            this
        },
        getParent: function () {
            return null
        },
        getLayer: function () {
            return null
        },
        getLayers: function () {
            return this.getChildren()
        },
        _bindContentEvents: function () {
            var e = this,
            t;
            for (t = 0; t < ot; t++) ut(this, st[t])
        },
        _mouseover: function (e) {
            this._fire(F, e)
        },
        _mouseout: function (e) {
            this._setPointerPosition(e);
            var t = this.targetShape;
            t && !v() && (t._fireAndBubble(S, e), t._fireAndBubble(x, e), this.targetShape = null),
            this.pointerPos = undefined,
            this._fire(B, e)
        },
        _mousemove: function (e) {
            this._setPointerPosition(e);
            var t = require("DragAndDrop").self;
            shape = this.getIntersection(this.getPointerPosition()),
            shape && shape.isListening() ? !v() && (!this.targetShape || this.targetShape._id !== shape._id) ? (this.targetShape && (this.targetShape._fireAndBubble(S, e, shape), this.targetShape._fireAndBubble(x, e, shape)), shape._fireAndBubble(T, e, this.targetShape), shape._fireAndBubble(N, e, this.targetShape), this.targetShape = shape) : shape._fireAndBubble(C, e) : this.targetShape && !v() && (this.targetShape._fireAndBubble(S, e), this.targetShape._fireAndBubble(x, e), this.targetShape = null),
            this._fire(q, e),
            t && t._drag(e),
            e.preventDefault && e.preventDefault()
        },
        _mousedown: function (e) {
            this._setPointerPosition(e);
            var t = this.getIntersection(this.getPointerPosition());
            g = !0,
            t && t.isListening() && (this.clickStartShape = t, t._fireAndBubble(k, e)),
            this._fire(R, e),
            e.preventDefault && e.preventDefault()
        },
        _mouseup: function (e) {
            this._setPointerPosition(e);
            var t = this,
            n = this.getIntersection(this.getPointerPosition()),
            r = !1;
            h ? (r = !0, h = !1) : h = !0,
            setTimeout(function () {
                h = !1
            },
            m);
            if (n && n.isListening()) {
                n._fireAndBubble(L, e);
                if (!this.clickStartShape) return;
                g && n._id === this.clickStartShape._id && (n._fireAndBubble(A, e), r && n._fireAndBubble(O, e))
            }
            this._fire(U, e),
            g && (this._fire(z, e), r && this._fire(W, e)),
            g = !1,
            e.preventDefault && e.preventDefault()
        },
        _touchstart: function (e) {
            this._setPointerPosition(e);
            var t = this.getIntersection(this.getPointerPosition());
            Kinetic.listenClickTap = !0,
            t && t.isListening() && (this.tapStartShape = t, t._fireAndBubble(M, e), t.isListening() && e.preventDefault && e.preventDefault()),
            this._fire(X, e)
        },
        _touchend: function (e) {
            this._setPointerPosition(e);
            var t = this,
            n = this.getIntersection(this.getPointerPosition());
            fireDblClick = !1,
            Kinetic.inDblClickWindow ? (fireDblClick = !0, Kinetic.inDblClickWindow = !1) : Kinetic.inDblClickWindow = !0,
            setTimeout(function () {
                Kinetic.inDblClickWindow = !1
            },
            Kinetic.dblClickWindow),
            n && n.isListening() && (n._fireAndBubble(_, e), Kinetic.listenClickTap && n._id === this.tapStartShape._id && (n._fireAndBubble(D, e), fireDblClick && n._fireAndBubble(P, e)), n.isListening() && e.preventDefault && e.preventDefault()),
            Kinetic.listenClickTap && (this._fire(V, e), fireDblClick && this._fire(J, e)),
            Kinetic.listenClickTap = !1
        },
        _touchmove: function (e) {
            this._setPointerPosition(e);
            var t = Kinetic.DD,
            n = this.getIntersection(this.getPointerPosition());
            n && n.isListening() && (n._fireAndBubble(H, e), n.isListening() && e.preventDefault && e.preventDefault()),
            this._fire(K, e),
            t && t._drag(e)
        },
        _setPointerPosition: function (e) {
            var e = e ? e : window.event,
            t = this._getContentPosition(),
            n = e.srcElement || e.target,
            r = n.id,
            i = e.offsetX,
            s = e.clientX,
            o = null,
            u = null,
            a;
            e.touches !== undefined ? e.touches.length === 1 && (a = e.touches[0], o = a.clientX - t.left, u = a.clientY - t.top) : i !== undefined ? (o = i, u = e.offsetY) : Kinetic.UA.browser === "mozilla" ? (o = e.layerX, u = e.layerY) : s !== undefined && t && (o = s - t.left, u = e.clientY - t.top),
            o !== null && u !== null && (this.pointerPos = {
                x: o,
                y: u,
                id: r
            })
        },
        _getContentPosition: function () {
            var e = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : {
                top: 0,
                left: 0
            };
            return {
                top: e.top,
                left: e.left
            }
        },
        _buildDOM: function () {
            var e = this.getContainer();
            e.innerHTML = it,
            this.content = document.createElement(G),
            this.content.id = this.attrs.id,
            this.content.style.position = "absolute",
            this.content.style.display = Z,
            this.content.className = et,
            this.content.setAttribute("role", "presentation"),
            e.appendChild(this.content),
            this.bufferCanvas = new p({
                pixelRatio: 1
            }),
            this.bufferHitCanvas = new d,
            this._resizeDOM()
        },
        _onContent: function (e, t) {
            var n = e.split(tt),
            r = n.length,
            i,
            s;
            for (i = 0; i < r; i++) s = n[i],
            this.content.addEventListener(s, t, !1)
        }
    }),
    f(at, y),
    l.addGetter(at, "container"),
    {
        self: at
    }
}),
define("Animation", ["Node", "Layer", "Stage", "Utils"],
function (e, t, n, r) {
    function c(e) {
        window.setTimeout(e, 1e3 / 60)
    }
    var i = 500,
    s = e.self,
    o = t.self,
    u = n.self,
    a = r.self.isDragging;
    animIdCounter = 0;
    var f = function (e, t) {
        this.func = e,
        this.setLayers(t),
        this.id = animIdCounter++,
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: (new Date).getTime()
        }
    };
    f.prototype = {
        setLayers: function (e) {
            var t = [];
            e ? e.length > 0 ? t = e : t = [e] : t = [],
            this.layers = t
        },
        getLayers: function () {
            return this.layers
        },
        addLayer: function (e) {
            var t = this.layers,
            n, r;
            if (t) {
                n = t.length;
                for (r = 0; r < n; r++) if (t[r]._id === e._id) return !1
            } else this.layers = [];
            return this.layers.push(e),
            !0
        },
        isRunning: function () {
            var e = Kinetic.Animation,
            t = e.animations;
            for (var n = 0; n < t.length; n++) if (t[n].id === this.id) return !0;
            return !1
        },
        start: function () {
            this.stop(),
            this.frame.timeDiff = 0,
            this.frame.lastTime = (new Date).getTime(),
            f._addAnimation(this)
        },
        stop: function () {
            f._removeAnimation(this)
        },
        _updateFrameObject: function (e) {
            this.frame.timeDiff = e - this.frame.lastTime,
            this.frame.lastTime = e,
            this.frame.time += this.frame.timeDiff,
            this.frame.frameRate = 1e3 / this.frame.timeDiff
        }
    },
    f.animations = [],
    f.animIdCounter,
    f.animRunning = !1,
    f._addAnimation = function (e) {
        this.animations.push(e),
        this._handleAnimation()
    },
    f._removeAnimation = function (e) {
        var t = e.id,
        n = this.animations,
        r = n.length;
        for (var i = 0; i < r; i++) if (n[i].id === t) {
            this.animations.splice(i, 1);
            break
        }
    },
    f._runFrames = function () {
        var e = {},
        t = this.animations,
        n, r, i, s, o, u, a, f;
        for (s = 0; s < t.length; s++) {
            n = t[s],
            r = n.layers,
            i = n.func,
            n._updateFrameObject((new Date).getTime()),
            u = r.length;
            for (o = 0; o < u; o++) a = r[o],
            a._id !== undefined && (e[a._id] = a);
            i && i.call(n, n.frame)
        }
        for (f in e) e[f].draw()
    },
    f._animationLoop = function () {
        var e = this;
        this.animations.length > 0 ? (this._runFrames(), f.requestAnimFrame(function () {
            e._animationLoop()
        })) : this.animRunning = !1
    },
    f._handleAnimation = function () {
        var e = this;
        this.animRunning || (this.animRunning = !0, e._animationLoop())
    };
    var l = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || c
    }();
    f.requestAnimFrame = function (e) {
        var t = a ? c : l;
        t(e)
    };
    var h = s.prototype.moveTo;
    return s.prototype.moveTo = function (e) {
        h.call(this, e)
    },
    o.prototype.batchDraw = function () {
        var e = this;
        this.batchAnim || (this.batchAnim = new Kinetic.Animation(function () {
            e.lastBatchDrawTime && (new Date).getTime() - e.lastBatchDrawTime > i && e.batchAnim.stop()
        },
        this)),
        this.lastBatchDrawTime = (new Date).getTime(),
        this.batchAnim.isRunning() || (this.draw(), this.batchAnim.start())
    },
    u.prototype.batchDraw = function () {
        this.getChildren().each(function (e) {
            e.batchDraw()
        })
    },
    {
        self: f
    }
}),
define("DragAndDrop", ["Animation", "Node", "Factory", "Utils"],
function (e, t, n, r) {
    var i = e.self,
    s = n.self,
    o = r.self.listenClickTap,
    u = t.self,
    a = {
        anim: new i,
        isDragging: !1,
        offset: {
            x: 0,
            y: 0
        },
        node: null,
        _drag: function (e) {
            var t = a,
            n = t.node;
            n && (n._setDragPosition(e), t.isDragging || (t.isDragging = !0, n.fire("dragstart", e, !0)), n.fire("dragmove", e, !0))
        },
        _endDragBefore: function (e) {
            var t = a,
            n = t.node,
            r, i;
            n && (r = n.nodeType, i = n.getLayer(), t.anim.stop(), t.isDragging && (t.isDragging = !1, o = !1, e && (e.dragEndNode = n)), delete t.node, (i || n).draw())
        },
        _endDragAfter: function (e) {
            e = e || {};
            var t = e.dragEndNode;
            e && t && t.fire("dragend", e, !0)
        }
    },
    f = u.prototype.destroy;
    u.prototype.startDrag = function () {
        var e = a,
        t = this.getStage(),
        n = this.getLayer(),
        r = t.getPointerPosition(),
        i = this.getAbsolutePosition();
        r && (e.node && e.node.stopDrag(), e.node = this, e.offset.x = r.x - i.x, e.offset.y = r.y - i.y, e.anim.setLayers(n || this.getLayers()), e.anim.start(), this._setDragPosition())
    },
    u.prototype._setDragPosition = function (e) {
        var t = a,
        n = this.getStage().getPointerPosition(),
        r = this.getDragBoundFunc(),
        i = {
            x: n.x - t.offset.x,
            y: n.y - t.offset.y
        };
        r !== undefined && (i = r.call(this, i, e)),
        this.setAbsolutePosition(i)
    },
    u.prototype.stopDrag = function () {
        var e = a,
        t = {};
        e._endDragBefore(t),
        e._endDragAfter(t)
    },
    u.prototype.setDraggable = function (e) {
        this._setAttr("draggable", e),
        this._dragChange()
    },
    u.prototype.destroy = function () {
        var e = a;
        e.node && e.node._id === this._id && this.stopDrag(),
        f.call(this)
    },
    u.prototype.isDragging = function () {
        var e = a;
        return e.node && e.node._id === this._id && e.isDragging
    },
    u.prototype._listenDrag = function () {
        var e = this;
        this._dragCleanup(),
        this.getClassName() === "Stage" ? this.on("contentMousedown contentTouchstart",
        function (t) {
            a.node || e.startDrag(t)
        }) : this.on("mousedown touchstart",
        function (t) {
            a.node || e.startDrag(t)
        })
    },
    u.prototype._dragChange = function () {
        if (this.attrs.draggable) this._listenDrag();
        else {
            this._dragCleanup();
            var e = this.getStage(),
            t = Kinetic.DD;
            e && t.node && t.node._id === this._id && t.node.stopDrag()
        }
    },
    u.prototype._dragCleanup = function () {
        this.getClassName() === "Stage" ? (this.off("contentMousedown"), this.off("contentTouchstart")) : (this.off("mousedown"), this.off("touchstart"))
    },
    s.addGetterSetter(u, "dragBoundFunc"),
    s.addGetter(u, "draggable", !1),
    u.prototype.isDraggable = u.prototype.getDraggable;
    var l = document.documentElement;
    return l.addEventListener("mouseup", a._endDragBefore, !0),
    l.addEventListener("touchend", a._endDragBefore, !0),
    l.addEventListener("mouseup", a._endDragAfter, !1),
    l.addEventListener("touchend", a._endDragAfter, !1),
    {
        self: a
    }
}),
define("EditAndSave", ["Animation", "Node", "Factory", "Utils"],
function (e, t, n, r) {
    var i = e.self,
    s = n.self,
    o = r.self.listenClickTap,
    u = t.self,
    a = function () { };
    return {
        self: a
    }
}),
define("Tween", ["Animation"],
function (e) {
    var t = e.self,
    n = {
        node: 1,
        duration: 1,
        easing: 1,
        onFinish: 1,
        yoyo: 1
    },
    r = 1,
    i = 2,
    s = 3,
    o = 0,
    u = function (e) {
        var r = this,
        i = e.node,
        s = i._id,
        l = e.duration || 1,
        c = e.easing || f.Linear,
        h = !!e.yoyo,
        p, d, v, m;
        this.node = i,
        this._id = o++,
        this.anim = new t(function () {
            r.tween.onEnterFrame()
        },
        i.getLayer() || i.getLayers()),
        this.tween = new a(p,
        function (e) {
            r._tweenFunc(e)
        },
        c, 0, 1, l * 1e3, h),
        this._addListeners(),
        u.attrs[s] || (u.attrs[s] = {}),
        u.attrs[s][this._id] || (u.attrs[s][this._id] = {}),
        u.tweens[s] || (u.tweens[s] = {});
        for (p in e) n[p] === undefined && this._addAttr(p, e[p]);
        this.reset(),
        this.onFinish = e.onFinish,
        this.onReset = e.onReset
    };
    u.attrs = {},
    u.prototype = {
        _addAttr: function (e, t) {
            var n = this.node,
            r = n._id,
            i, s, o, u, a, f, l;
            o = Kinetic.Tween.tweens[r][e],
            o && delete Kinetic.Tween.attrs[r][o][e],
            i = n.getAttr(e);
            if (Kinetic.Util._isArray(t)) {
                s = [],
                a = t.length;
                for (u = 0; u < a; u++) s.push(t[u] - i[u])
            } else s = t - i;
            Kinetic.Tween.attrs[r][this._id][e] = {
                start: i,
                diff: s
            },
            Kinetic.Tween.tweens[r][e] = this._id
        },
        _tweenFunc: function (e) {
            var t = this.node,
            n = Kinetic.Tween.attrs[t._id][this._id],
            r,
            i,
            s,
            o,
            u,
            a,
            f,
            l,
            c;
            for (r in n) {
                i = n[r],
                s = i.start,
                o = i.diff;
                if (Kinetic.Util._isArray(s)) {
                    u = [],
                    f = s.length;
                    for (a = 0; a < f; a++) u.push(s[a] + o[a] * e)
                } else u = s + o * e;
                t.setAttr(r, u)
            }
        },
        _addListeners: function () {
            var e = this;
            this.tween.onPlay = function () {
                e.anim.start()
            },
            this.tween.onReverse = function () {
                e.anim.start()
            },
            this.tween.onPause = function () {
                e.anim.stop()
            },
            this.tween.onFinish = function () {
                e.onFinish && e.onFinish()
            },
            this.tween.onReset = function () {
                e.onReset && e.onReset()
            }
        },
        play: function () {
            return this.tween.play(),
            this
        },
        reverse: function () {
            return this.tween.reverse(),
            this
        },
        reset: function () {
            var e = this.node;
            return this.tween.reset(),
            (e.getLayer() || e.getLayers()).draw(),
            this
        },
        seek: function (e) {
            var t = this.node;
            return this.tween.seek(e * 1e3),
            (t.getLayer() || t.getLayers()).draw(),
            this
        },
        pause: function () {
            return this.tween.pause(),
            this
        },
        finish: function () {
            var e = this.node;
            return this.tween.finish(),
            (e.getLayer() || e.getLayers()).draw(),
            this
        },
        destroy: function () {
            var e = this.node._id,
            t = this._id,
            n = Kinetic.Tween.tweens[e],
            r;
            this.pause();
            for (r in n) delete Kinetic.Tween.tweens[e][r];
            delete Kinetic.Tween.attrs[e][t]
        }
    };
    var a = function (e, t, n, r, i, s, o) {
        this.prop = e,
        this.propFunc = t,
        this.begin = r,
        this._pos = r,
        this.duration = s,
        this._change = 0,
        this.prevPos = 0,
        this.yoyo = o,
        this._time = 0,
        this._position = 0,
        this._startTime = 0,
        this._finish = 0,
        this.func = n,
        this._change = i - this.begin,
        this.pause()
    };
    a.prototype = {
        fire: function (e) {
            var t = this[e];
            t && t()
        },
        setTime: function (e) {
            e > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : e < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = e, this.update())
        },
        getTime: function () {
            return this._time
        },
        setPosition: function (e) {
            this.prevPos = this._pos,
            this.propFunc(e),
            this._pos = e
        },
        getPosition: function (e) {
            return e === undefined && (e = this._time),
            this.func(e, this.begin, this._change, this.duration)
        },
        play: function () {
            this.state = i,
            this._startTime = this.getTimer() - this._time,
            this.onEnterFrame(),
            this.fire("onPlay")
        },
        reverse: function () {
            this.state = s,
            this._time = this.duration - this._time,
            this._startTime = this.getTimer() - this._time,
            this.onEnterFrame(),
            this.fire("onReverse")
        },
        seek: function (e) {
            this.pause(),
            this._time = e,
            this.update(),
            this.fire("onSeek")
        },
        reset: function () {
            this.pause(),
            this._time = 0,
            this.update(),
            this.fire("onReset")
        },
        finish: function () {
            this.pause(),
            this._time = this.duration,
            this.update(),
            this.fire("onFinish")
        },
        update: function () {
            this.setPosition(this.getPosition(this._time))
        },
        onEnterFrame: function () {
            var e = this.getTimer() - this._startTime;
            this.state === i ? this.setTime(e) : this.state === s && this.setTime(this.duration - e)
        },
        pause: function () {
            this.state = r,
            this.fire("onPause")
        },
        getTimer: function () {
            return (new Date).getTime()
        }
    };
    var f = {
        BackEaseIn: function (e, t, n, r, i, s) {
            var o = 1.70158;
            return n * (e /= r) * e * ((o + 1) * e - o) + t
        },
        BackEaseOut: function (e, t, n, r, i, s) {
            var o = 1.70158;
            return n * ((e = e / r - 1) * e * ((o + 1) * e + o) + 1) + t
        },
        BackEaseInOut: function (e, t, n, r, i, s) {
            var o = 1.70158;
            return (e /= r / 2) < 1 ? n / 2 * e * e * (((o *= 1.525) + 1) * e - o) + t : n / 2 * ((e -= 2) * e * (((o *= 1.525) + 1) * e + o) + 2) + t
        },
        ElasticEaseIn: function (e, t, n, r, i, s) {
            var o = 0;
            return e === 0 ? t : (e /= r) == 1 ? t + n : (s || (s = r * .3), !i || i < Math.abs(n) ? (i = n, o = s / 4) : o = s / (2 * Math.PI) * Math.asin(n / i), -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s)) + t)
        },
        ElasticEaseOut: function (e, t, n, r, i, s) {
            var o = 0;
            return e === 0 ? t : (e /= r) == 1 ? t + n : (s || (s = r * .3), !i || i < Math.abs(n) ? (i = n, o = s / 4) : o = s / (2 * Math.PI) * Math.asin(n / i), i * Math.pow(2, -10 * e) * Math.sin((e * r - o) * 2 * Math.PI / s) + n + t)
        },
        ElasticEaseInOut: function (e, t, n, r, i, s) {
            var o = 0;
            return e === 0 ? t : (e /= r / 2) == 2 ? t + n : (s || (s = r * .3 * 1.5), !i || i < Math.abs(n) ? (i = n, o = s / 4) : o = s / (2 * Math.PI) * Math.asin(n / i), e < 1 ? -0.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s) + t : i * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s) * .5 + n + t)
        },
        BounceEaseOut: function (e, t, n, r) {
            return (e /= r) < 1 / 2.75 ? n * 7.5625 * e * e + t : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t
        },
        BounceEaseIn: function (e, t, n, r) {
            return n - f.BounceEaseOut(r - e, 0, n, r) + t
        },
        BounceEaseInOut: function (e, t, n, r) {
            return e < r / 2 ? f.BounceEaseIn(e * 2, 0, n, r) * .5 + t : f.BounceEaseOut(e * 2 - r, 0, n, r) * .5 + n * .5 + t
        },
        EaseIn: function (e, t, n, r) {
            return n * (e /= r) * e + t
        },
        EaseOut: function (e, t, n, r) {
            return -n * (e /= r) * (e - 2) + t
        },
        EaseInOut: function (e, t, n, r) {
            return (e /= r / 2) < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t
        },
        StrongEaseIn: function (e, t, n, r) {
            return n * (e /= r) * e * e * e * e + t
        },
        StrongEaseOut: function (e, t, n, r) {
            return n * ((e = e / r - 1) * e * e * e * e + 1) + t
        },
        StrongEaseInOut: function (e, t, n, r) {
            return (e /= r / 2) < 1 ? n / 2 * e * e * e * e * e + t : n / 2 * ((e -= 2) * e * e * e * e + 2) + t
        },
        Linear: function (e, t, n, r) {
            return n * e / r + t
        }
    };
    return {
        self: u
    }
}),
define("Shape", ["Utils", "Node", "Factory"],
function (e, t, n) {
    function i(e) {
        e.fill()
    }
    function s(e) {
        e.stroke()
    }
    function o(e) {
        e.fill()
    }
    function u(e) {
        e.stroke()
    }
    function a() {
        this._clearCache(r)
    }
    var r = "hasShadow",
    f = e.self.addMethods,
    l = e.self.extend,
    c = n.self,
    h = e.self.getRandomColor,
    p = e.self.shapes,
    d = t.self,
    v = function (e) {
        this.__init(e)
    };
    return f(v, {
        __init: function (e) {
            this.nodeType = "Shape",
            this._fillFunc = i,
            this._strokeFunc = s,
            this._fillFuncHit = o,
            this._strokeFuncHit = u;
            var t = p,
            n;
            for (; ;) {
                n = h();
                if (n && !(n in t)) break
            }
            this.colorKey = n,
            t[n] = this,
            d.call(this, e),
            this._setDrawFuncs(),
            this.on("shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic shadowEnabledChanged.kinetic", a)
        },
        hasChildren: function () {
            return !1
        },
        getChildren: function () {
            return []
        },
        getContext: function () {
            return this.getLayer().getContext()
        },
        getCanvas: function () {
            return this.getLayer().getCanvas()
        },
        hasShadow: function () {
            return this._getCache(r, this._hasShadow)
        },
        _hasShadow: function () {
            return this.getShadowEnabled() && this.getShadowOpacity() !== 0 && !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY())
        },
        hasFill: function () {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops())
        },
        hasStroke: function () {
            return !!this.getStroke() || !!this.getStrokeWidth()
        },
        _get: function (e) {
            return this.className === e || this.nodeType === e ? [this] : []
        },
        intersects: function (e) {
            var t = this.getStage(),
            n = t.bufferHitCanvas,
            r;
            return n.getContext().clear(),
            this.drawScene(n),
            r = n.context.getImageData(e.x | 0, e.y | 0, 1, 1).data,
            r[3] > 0
        },
        enableFill: function () {
            return this._setAttr("fillEnabled", !0),
            this
        },
        disableFill: function () {
            return this._setAttr("fillEnabled", !1),
            this
        },
        enableStroke: function () {
            return this._setAttr("strokeEnabled", !0),
            this
        },
        disableStroke: function () {
            return this._setAttr("strokeEnabled", !1),
            this
        },
        enableStrokeScale: function () {
            return this._setAttr("strokeScaleEnabled", !0),
            this
        },
        disableStrokeScale: function () {
            return this._setAttr("strokeScaleEnabled", !1),
            this
        },
        enableShadow: function () {
            return this._setAttr("shadowEnabled", !0),
            this
        },
        disableShadow: function () {
            return this._setAttr("shadowEnabled", !1),
            this
        },
        enableDashArray: function () {
            return this._setAttr("dashArrayEnabled", !0),
            this
        },
        disableDashArray: function () {
            return this._setAttr("dashArrayEnabled", !1),
            this
        },
        destroy: function () {
            return d.prototype.destroy.call(this),
            delete p[this.colorKey],
            this
        },
        _useBufferCanvas: function () {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasFill() && this.hasStroke()
        },
        drawScene: function (e) {
            var t = e || this.getLayer().getCanvas(),
            n = t.getContext(),
            r = this.getDrawFunc(),
            i = this.hasShadow(),
            s,
            o,
            u;
            if (r && this.isVisible()) if (this._useBufferCanvas()) {
                s = this.getStage();
                if (!s) return;
                o = s.bufferCanvas,
                u = o.getContext(),
                u.clear(),
                u.save(),
                u._applyLineJoin(this),
                u._applyAncestorTransforms(this),
                r.call(this, u),
                u.restore(),
                n.save(),
                i && (n.save(), n._applyShadow(this), n.drawImage(o._canvas, 0, 0), n.restore()),
                n._applyOpacity(this),
                n.drawImage(o._canvas, 0, 0),
                n.restore()
            } else n.save(),
            n._applyLineJoin(this),
            n._applyAncestorTransforms(this),
            i && (n.save(), n._applyShadow(this), r.call(this, n), n.restore()),
            n._applyOpacity(this),
            r.call(this, n),
            n.restore();
            return this
        },
        drawHit: function () {
            var e = this.getAttrs(),
            t = e.drawHitFunc || e.drawFunc,
            n = this.getLayer().hitCanvas,
            r = n.getContext();
            return t && this.shouldDrawHit() && (r.save(), r._applyLineJoin(this), r._applyAncestorTransforms(this), t.call(this, r), r.restore()),
            this
        },
        _setDrawFuncs: function () {
            !this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc),
                !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
        }
    }),
    l(v, d),
    c.addColorGetterSetter(v, "stroke"),
    c.addGetterSetter(v, "lineJoin"),
    c.addGetterSetter(v, "lineCap"),
    c.addGetterSetter(v, "strokeWidth"),
    c.addGetterSetter(v, "drawFunc"),
    c.addGetterSetter(v, "drawHitFunc"),
    c.addGetterSetter(v, "dashArray"),
    c.addColorGetterSetter(v, "shadowColor"),
    c.addGetterSetter(v, "shadowBlur"),
    c.addGetterSetter(v, "shadowOpacity"),
    c.addPointGetterSetter(v, "shadowOffset", 0),
    c.addGetterSetter(v, "fillPatternImage"),
    c.addColorGetterSetter(v, "fill"),
    c.addGetterSetter(v, "fillPatternX", 0),
    c.addGetterSetter(v, "fillPatternY", 0),
    c.addGetterSetter(v, "fillLinearGradientColorStops"),
    c.addGetterSetter(v, "fillRadialGradientStartRadius", 0),
    c.addGetterSetter(v, "fillRadialGradientEndRadius", 0),
    c.addGetterSetter(v, "fillRadialGradientColorStops"),
    c.addGetterSetter(v, "fillPatternRepeat"),
    c.addGetterSetter(v, "fillEnabled", !0),
    c.addGetterSetter(v, "strokeEnabled", !0),
    c.addGetterSetter(v, "shadowEnabled", !0),
    c.addGetterSetter(v, "dashArrayEnabled", !0),
    c.addGetterSetter(v, "strokeScaleEnabled", !0),
    c.addGetterSetter(v, "fillPriority", "color"),
    c.addPointGetterSetter(v, "fillPatternOffset", 0),
    c.addPointGetterSetter(v, "fillPatternScale", 1),
    c.addPointGetterSetter(v, "fillLinearGradientStartPoint", 0),
    c.addPointGetterSetter(v, "fillLinearGradientEndPoint", 0),
    c.addPointGetterSetter(v, "fillRadialGradientStartPoint", 0),
    c.addPointGetterSetter(v, "fillRadialGradientEndPoint", 0),
    c.addRotationGetterSetter(v, "fillPatternRotation", 0),
    {
        self: v
    }
}),
define("Circle", ["Shape", "Utils", "Factory", "Node"],
function (e, t, n, r) {
    var i = e.self,
    s = n.self,
    o = r.self,
    u = t.self.extend,
    a = Math.PI * 2 - 1e-4,
    f = function (e) {
        this.___init(e)
    };
    return f.prototype = {
        ___init: function (e) {
            i.call(this, e),
            this.className = "Circle"
        },
        drawFunc: function (e) {
            e.beginPath(),
            e.arc(0, 0, this.getRadius(), 0, a, !1),
            e.closePath(),
            e.fillStrokeShape(this)
        },
        getWidth: function () {
            return this.getRadius() * 2
        },
        getHeight: function () {
            return this.getRadius() * 2
        },
        setWidth: function (e) {
            o.prototype.setWidth.call(this, e),
            this.setRadius(e / 2)
        },
        setHeight: function (e) {
            o.prototype.setHeight.call(this, e),
            this.setRadius(e / 2)
        }
    },
    u(f, i),
    s.addGetterSetter(f, "radius", 0),
    {
        self: f
    }
}),
define("Polygon", ["Shape", "Utils", "Factory"],
function (e, t, n) {
    var e = e.self,
    n = n.self,
    r = t.self.extend,
    i = function (e) {
        this.___init(e)
    };
    return i.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.className = "Polygon"
        },
        drawFunc: function (e) {
            var t = this.getPoints(),
            n = t.length;
            if (n === 0) return;
            e.beginPath(),
            e.moveTo(t[0][0], t[0][1]);
            for (var r = 1; r < n; r++) e.lineTo(t[r][0], t[r][1]);
            e.closePath(),
            e.fillStrokeShape(this)
        }
    },
    r(i, e),
    n.addPointsGetterSetter(i, "points"),
    {
        self: i
    }
}),
define("Heat", ["Shape", "Utils", "Factory"],
function (e, t, n) {
    var e = e.self,
    n = n.self,
    r = t.self.extend,
    i = function (e) {
        var t = {
            data: [],
            heatmap: e,
            radius: 40,
            element: {},
            canvas: {},
            acanvas: {},
            ctx: {},
            actx: {},
            legend: null,
            visible: !0,
            width: 256,
            height: 256,
            max: 1,
            gradient: !1,
            opacity: 180,
            premultiplyAlpha: !1,
            debug: !1
        };
        this.get = function (e) {
            return t[e]
        },
        this.set = function (e, n) {
            t[e] = n
        }
    };
    i.prototype = {
        setDataSet: function () { }
    };
    var s = function (e) {
        this.___init(e)
    };
    return s.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.store = new i(this),
            this.config = null
        },
        _configure: function (e) {
            var t = this.store;
            return t.set("radius", e.radius || 40),
            t.set("element", e.element instanceof Object ? e.element : document.getElementById(e.element)),
            t.set("visible", e.visible != null ? e.visible : !0),
            t.set("max", e.max || 1),
            t.set("gradient", e.gradient || {
                .45: "rgb(0,0,255)",
                .55: "rgb(0,255,255)",
                .65: "rgb(0,255,0)",
                .95: "yellow",
                1: "rgb(255,0,0)"
            }),
            t.set("opacity", parseInt(255 / (100 / e.opacity), 10) || 180),
            t.set("width", e.canvas.width || 256),
            t.set("height", e.canvas.height || 256),
            t.set("debug", e.debug || !0),
            e
        },
        drawAlpha: function (e, t, n, r) {
            var i = this.store,
            s = i.get("radius"),
            o = 1.5 * s,
            u = i.get("context"),
            a = i.get("max"),
            f = e - o >> 0,
            l = t - o >> 0,
            c = e + o >> 0,
            h = t + o >> 0;
            u._context.shadowColor = "rgba(0,0,0," + (n ? n / i.get("max") : "0.1") + ")",
            u._context.shadowOffsetX = 15e3,
            u._context.shadowOffsetY = 15e3,
            u._context.shadowBlur = 15,
            u.arc(e - 15e3, t - 15e3, s, 0, Math.PI * 2, !0)
        },
        initColorPalette: function (e) {
            var t = this.store,
            n = e._context,
            r = t.get("gradient");
            grad = n.createLinearGradient(0, 0, 1, 256),
            testData = n.getImageData(0, 0, 1, 1),
            testData.data[0] = testData.data[3] = 64,
            testData.data[1] = testData.data[2] = 0,
            n.putImageData(testData, 0, 0),
            testData = n.getImageData(0, 0, 1, 1),
            t.set("premultiplyAlpha", testData.data[0] < 60 || testData.data[0] > 70);
            for (var i in r) grad.addColorStop(i, r[i]);
            n.fillStyle = grad,
            n.fillRect(0, 0, 1, 256),
            t.set("gradient", n.getImageData(0, 0, 1, 256).data),
            t.set("colorPalette", !0)
        },
        colorize: function (e, t) {
            var n = this.store,
            r = n.get("width"),
            i = n.get("radius"),
            s = n.get("height"),
            o = n.get("context"),
            u = n.get("acontext"),
            a = i * 3,
            f = n.get("premultiplyAlpha"),
            l = n.get("gradient"),
            c = n.get("opacity"),
            h,
            p,
            d,
            v,
            m,
            g,
            y,
            b,
            w,
            E;
            e != null && t != null && (e + a > r && (e = r - a), e < 0 && (e = 0), t < 0 && (t = 0), t + a > s && (t = s - a), h = e, p = t, v = e + a, d = t + a),
            m = u.getImageData(h, p, v - h, d - p),
            g = m.data,
            y = g.length;
            for (var S = 3; S < y; S += 4) {
                b = g[S],
                w = b * 4;
                if (!w) continue;
                E = b < c ? b : c,
                g[S - 3] = l[w],
                g[S - 2] = l[w + 1],
                g[S - 1] = l[w + 2],
                f && (g[S - 3] /= 255 / E, g[S - 2] /= 255 / E, g[S - 1] /= 255 / E),
                g[S] = E
            }
            m.data = g,
            o.putImageData(m, h, p)
        },
        drawFunc: function (e) {
            var t = this.store;
            this.config = this.config || this._configure(e),
            t.get("context") ? null : t.set("context", e),
            t.get("acontext") ? null : t.set("acontext", this.getContext()),
            e.beginPath();
            var n = this.getPoints(),
            r,
            i,
            s = n.length;
            for (r = 0; r < s; r++) i = n[r],
            this.drawAlpha(i.x, i.y, i.value, !0);
            e.closePath(),
            e.fill()
        }
    },
    r(s, e),
    n.addPointsGetterSetter(s, "points"),
    {
        self: s
    }
}),
define("Line", ["Shape", "Utils", "Factory"],
function (e, t, n) {
    var e = e.self,
    n = n.self,
    r = t.self._getControlPoints,
    i = t.self._expandPoints,
    s = t.self.extend,
    o = function (e) {
        this.___init(e)
    };
    return o.prototype = {
        ___init: function (t) {
            var n = this;
            e.call(this, t),
            this.className = "Line",
            this.on("pointsChange.kinetic tensionChange.kinetic closedChange.kinetic",
            function () {
                this._clearCache("tensionPoints")
            })
        },
        drawFunc: function (e) {
            var t = this.getPoints(),
            n = t.length,
            r = this.getTension(),
            i = this.getClosed(),
            s,
            o,
            u,
            a;
            e.beginPath(),
            e.moveTo(t[0][0], t[0][1]);
            if (r !== 0 && n > 2) {
                s = this.getTensionPoints(),
                o = s.length,
                u = i ? 0 : 4,
                i || e.quadraticCurveTo(s[0], s[1], s[2], s[3]);
                while (u < o - 2) e.bezierCurveTo(s[u++], s[u++], s[u++], s[u++], s[u++], s[u++]);
                i || e.quadraticCurveTo(s[o - 2], s[o - 1], t[n - 2], t[n - 1])
            } else for (u = 1; u < n; u++) e.lineTo(t[u][0], t[u][1]);
            i ? (e.closePath(), e.fillStrokeShape(this)) : e.strokeShape(this)
        },
        getTensionPoints: function () {
            return this._getCache("tensionPoints", this._getTensionPoints)
        },
        _getTensionPoints: function () {
            return this.getClosed() ? this._getTensionPointsClosed() : t.self._expandPoints(this.getPoints(), this.getTension())
        },
        _getTensionPointsClosed: function () {
            var e = this.getPoints(),
            t = e.length,
            n = this.getTension(),
            s = r(e[t - 2], e[t - 1], e[0], e[1], e[2], e[3], n),
            o = r(e[t - 4], e[t - 3], e[t - 2], e[t - 1], e[0], e[1], n),
            u = i(e, n),
            a = [s[2], s[3]].concat(u).concat([o[0], o[1], e[t - 2], e[t - 1], o[2], o[3], s[0], s[1], e[0], e[1]]);
            return a
        }
    },
    s(o, e),
    n.addGetterSetter(o, "closed", !1),
    n.addGetterSetter(o, "tension", 0),
    n.addGetterSetter(o, "points"),
    {
        self: o
    }
}),
define("Sprite", ["Shape", "Utils", "Factory", "Animation"],
function (e, t, n, r) {
    var e = e.self,
    i = t.self.extend,
    r = r.self,
    n = n.self,
    s = function (e) {
        this.___init(e)
    };
    return s.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.className = "Sprite",
            this.anim = new r,
            this.on("animationChange.kinetic",
            function () {
                this.setIndex(0)
            }),
            this.setDrawFunc(this._drawFunc),
            this.setDrawHitFunc(this._drawHitFunc)
        },
        _drawFunc: function (e) {
            var t = this.getAnimation(),
            n = this.getIndex(),
            r = this.getAnimations()[t][n],
            i = this.getImage();
            i && e.drawImage(i, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height)
        },
        _drawHitFunc: function (e) {
            var t = this.getAnimation(),
            n = this.getIndex(),
            r = this.getAnimations()[t][n];
            e.beginPath(),
            e.rect(0, 0, r.width, r.height),
            e.closePath(),
            e.fillShape(this)
        },
        _useBufferCanvas: function () {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke()
        },
        start: function () {
            var e = this,
            t = this.getLayer();
            this.anim.setLayers(t),
            this.interval = setInterval(function () {
                e._updateIndex()
            },
            1e3 / this.getFrameRate()),
            this.anim.start()
        },
        stop: function () {
            this.anim.stop(),
            clearInterval(this.interval)
        },
        _updateIndex: function () {
            var e = this.getIndex(),
            t = this.getAnimation(),
            n = this.getAnimations(),
            r = n[t],
            i = r.length;
            e < i - 1 ? this.setIndex(e + 1) : this.setIndex(0)
        }
    },
    {
        self: s
    }
}),
define("RePolygon", ["Shape", "Utils", "Factory", "Collection"],
function (e, t, n, r) {
    var e = e.self,
    n = n.self,
    r = r.self,
    i = t.self.extend,
    s = function (e) {
        this.___init(e)
    };
    return s.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.className = "RePolygon"
        },
        drawFunc: function (e) {
            var t = this.attrs.sides,
            n = this.attrs.radius,
            r, i, s;
            e.beginPath(),
            e.moveTo(0, 0 - n);
            for (r = 1; r < t; r++) i = n * Math.sin(r * 2 * Math.PI / t),
            s = -1 * n * Math.cos(r * 2 * Math.PI / t),
            e.lineTo(i, s);
            e.closePath(),
            e.fillStrokeShape(this)
        }
    },
    i(s, e),
    n.addGetterSetter(s, "radius", 0),
    n.addGetterSetter(s, "sides", 0),
    {
        self: s
    }
}),
define("Star", ["Shape", "Utils", "Factory", "Collection"],
function (e, t, n, r) {
    var e = e.self,
    n = n.self,
    r = r.self,
    i = t.self.extend,
    s = function (e) {
        this.___init(e)
    };
    return s.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.className = "Star"
        },
        drawFunc: function (e) {
            var t = this.attrs.innerRadius,
            n = this.attrs.outerRadius,
            r = this.attrs.numPoints;
            e.beginPath(),
            e.moveTo(0, 0 - n);
            for (var i = 1; i < r * 2; i++) {
                var s = i % 2 === 0 ? n : t,
                o = s * Math.sin(i * Math.PI / r),
                u = -1 * s * Math.cos(i * Math.PI / r);
                e.lineTo(o, u)
            }
            e.closePath(),
            e.fillStrokeShape(this)
        }
    },
    i(s, e),
    n.addGetterSetter(s, "numPoints", 5),
    n.addGetterSetter(s, "innerRadius", 0),
    n.addGetterSetter(s, "outerRadius", 0),
    {
        self: s
    }
}),
define("Raster", ["Shape", "Utils", "Factory"],
function (e, t, n) {
    var e = e.self,
    n = n.self,
    r = t.self.extend,
    i = ["#000000", "#2892C6", "#67A7B3", "#C0D48C", "#FBB344", "#F25623"],
    s = function (e) {
        this.___init(e)
    };
    return s.prototype = {
        ___init: function (t) {
            e.call(this, t),
            this.className = "Raster"
        },
        drawFunc: function (e) {
            var t = this.getGraphicData(),
            n = 4,
            r = n / 2,
            s,
            o = t.length;
            e.beginPath();
            for (s = 0; s < o; s++) {
                var u = t[s],
                a = u[0],
                f = u[1],
                l = i[u[2]];
                e.fillStyle(l),
                e.fillRect(a - r, f - r, n, n)
            }
            e.closePath(),
            e.fillStrokeShape(this)
        }
    },
    r(s, e),
    n.addGetterSetter(s, "graphicData", {}),
    n.addGetterSetter(s, "symbol", {}),
    {
        self: s
    }
}),
define("Render", ["DragAndDrop", "EditAndSave", "Utils", "Collection", "Transform", "Tween", "Circle", "Polygon", "Canvas", "Container", "Animation", "Context", "Factory", "Layer", "Node", "Render", "Stage", "Heat", "Line", "Sprite", "RePolygon", "Star", "Raster"],
function (e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S) {
    var x = n.self.stages,
    T = "1.0.0",
    N = {
        traceArrMax: n.self.traceArrMax,
        dblClickWindow: n.self.dblClickWindow,
        pixelRatio: n.self.pixelRatio
    },
    C = function () {
        var e = navigator.userAgent.toLowerCase(),
        t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {
            browser: t[1] || "",
            version: t[2] || "0"
        }
    }(),
    k = m.self,
    L = l.self,
    A = o.self,
    O = g.self,
    M = y.self,
    _ = p.self,
    D = w.self,
    P = u.self,
    H = E.self,
    B = S.self,
    j = b.self;
    return {
        Stage: k,
        Animation: L,
        Circle: A,
        Heat: O,
        Layer: _,
        Line: M,
        Polygon: P,
        Sprite: j,
        Raster: B,
        RegularPolygon: D,
        Star: H,
        Stages: x,
        Setting: N,
        Version: T,
        UA: C
    }
}),
define("SecGraphicLayer", ["SecBaseLayer", "Hobject", "Render"],
function (e, t, n) {
    var r = t.BaseFunc.extend,
    i = t.BaseFunc.getId,
    s, o = n.Stage,
    u = n.Raster,
    a = n.Polygon,
    f = n.Circle,
    l = n.Layer,
    c = function (t) {
        e.call(this, t);
        var n = t || {};
        this._layer = null,
        !!n.mapData && n.mapData.constructor !== Object && (n.mapData = JSON.parse(n.mapData));
        var r = n.mapData || {};
        this.bound = r.bound ? JSON.parse(r.bound) : null,
        this.graphicData = r.data || null,
        this.info = r.information || {}
    };
    return r(c, e),
    c.prototype.addMarker = function (e) { },
    c.prototype.notice = function (e) {
        var t = e.sourceID;
        if (t === "mousewheel" && this.bound) {
            var n = this._calcuteRect();
            this.layer.setWH(n.width, n.height),
            this.layer.setCanvasXY(n.y, n.x)
        }
    },
    c.prototype._calcuteRect = function () {
        if (!this.bound) return {};
        var e = {
            log: this.bound.left,
            lat: this.bound.top
        },
        t = {
            log: this.bound.right,
            lat: this.bound.bottom
        },
        n = s(e),
        r = s(t),
        i = r.x - n.x,
        o = r.y - n.y;
        return {
            width: i,
            height: o,
            x: n.x,
            y: n.y
        }
    },
    c.prototype._createlayer = function () {
        var e = this._calcuteRect(),
        t = document.createElement("div");
        t.style.width = this.mapWidth + "px",
        t.style.height = this.mapHeight + "px",
        t.style.position = "absolute",
        s = s || this.args.mapInfo.screenPosition,
        this._stage = new o({
            id: this.args.layerID,
            container: t,
            width: this.args.width,
            height: this.args.height
        }),
        this._layer = new l({
            id: "graphic" + i(),
            width: e.width || this.args.width,
            height: e.height || this.args.height,
            x: e.y || 0,
            y: e.x || 0
        }),
        this._stage.add(this._layer),
        this.domLayer = this._stage.content
    },
    c.prototype._publish = function () {
        this.complete(),
        this.loadcomplete = !0;
        var e = this.info.name;
        if (e === "KrigingTask") {
            var t = new u({
                graphicData: this.graphicData,
                symbol: null,
                opacity: .6
            });
            this._layer.add(t),
            this._layer.draw()
        }
    },
    c.prototype.getType = function () {
        return "SecGraphicLayer"
    },
    c
}),
define("TileRender", ["Hmath", "Hobject"],
function (e, t) {
    var n = e.sTransition,
    r = t.BaseFunc.ua(),
    i = null,
    s = function (e) {
        r.ie ? i = function (e) {
            var t = e.style,
            n = t.setAttribute || t.setProperty;
            n.call(t, "-ms-transition", "all 0.48s ease"),
            n.call(t, "opacity", 1)
        } : !r.chrome || (i = function (e) {
            var t = e.style,
            n = t.setAttribute || t.setProperty;
            n.call(t, "-webkit-transition", "all 0.48s ease"),
            n.call(t, "opacity", 1)
        })
    };
    return s.prototype.addTiles = function (e, t) {
        var n = t.id,
        r = e.shift(),
        s = document.createDocumentFragment();
        while (r !== undefined) {
            var o = document.createElement("img"),
            u = n + "_" + r[3];
            o.id = u,
            o.width = o.height = 256,
            o.src = r[0],
            o.style.opacity = 0,
            o.onload = function () {
                var e = this;
                i(e)
            },
            o.onerror = function (e) {
                delete this
            },
            o.style.verticalAlign = "top",
            o.style.position = "absolute",
            o.style.top = r[1] + "px",
            o.style.left = r[2] + "px",
            s.appendChild(o),
            r = e.shift()
        }
        t.appendChild(s)
    },
    s.prototype.removeTiles = function (e, t) {
        var n = t.id,
        r, i, s = e.shift();
        while (s !== undefined) r = n + "_" + s,
        i = document.getElementById(r),
        t.removeChild(i),
        s = e.shift()
    },
    s.prototype.clearTiles = function (e) {
        while (e.firstChild) {
            var t = e.removeChild(e.firstChild);
            t = null
        }
    },
    s
}),
define("Coord", [],
function () {
    var e = function (e, t) {
        this.log = e || 0,
        this.lat = t || 0
    };
    e.fromArray = function (t) {
        if (Object.prototype.toString.call(t) === "[object Array]") return new e(t[0], t[1])
    },
    e.prototype.toArray = function () {
        return [this.log, this.lat]
    },
    e.prototype.getType = function () {
        return "Loglat"
    };
    var t = function (e, t) {
        this.x = e || 0,
        this.y = t || 0
    };
    t.fromArray = function (e) {
        if (Object.prototype.toString.call(e) === "[object Array]") return new t(e[0], e[1])
    },
    t.prototype.toArray = function () {
        return [this.x, this.y]
    },
    t.prototype.getType = function () {
        return "ProXY"
    };
    var n = function () { };
    return n.prototype.getType = function () {
        return "PixelXY"
    },
    {
        Loglat: e,
        ProXY: t,
        PixelXY: n
    }
}),
define("epsg3857", ["Coord"],
function (e) {
    var t = 20037508.3427892,
    n = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100", "OSGEO:41001"],
    r = function () {
        this.pole = function () {
            return t
        },
        this.inverseMeractor = function (n) {
            var r = 180 * n.x / t,
            i = 180 / Math.PI * (2 * Math.atan(Math.exp(n.y / t * Math.PI)) - Math.PI / 2);
            return new e.Loglat(r, i)
        },
        this.forwardMeractor = function (n) {
            var r = n.log * t / 180,
            i = Math.log(Math.tan((90 + n.lat) * Math.PI / 360)) / Math.PI * t,
            s = Math.max(-t, Math.min(i, t));
            return new e.ProXY(r, s)
        }
    };
    r.prototype.getResolution = function () {
        return {
            value: 111,
            unit: "平方千米"
        }
    },
    r.prototype.getType = function () {
        return "EPSG:3857"
    };
    var i = new r;
    return i
}),
define("Bound", [],
function () {
    var e = 3857,
    n = function (t, n, r, i, s) {
        this.proCode = s || e,
        this.proCode === e ? (this.top = t, this.left = n, this.bottom = r, this.right = i) : (this.top = t || 20037508.3427892, this.left = n || -20037508.3427892, this.bottom = r || -20037508.3427892, this.right = i || 20037508.3427892),
        this._cExtremum()
    };
    return n.prototype._cExtremum = function () {
        this.minX = this.left,
        this.minY = this.bottom,
        this.maxX = this.right,
        this.maxY = this.top,
        this.resoltionX = (this.right - this.left) / 256,
        this.resoltionY = (this.top - this.bottom) / 256,
        this.resoltionDX = this.resoltionX * 5,
        this.resoltionDY = this.resoltionY * 5
    },
    n.fromArray = function (e) {
        if (Object.prototype.toString.call(e) === "[object Array]") return new n(e[0], e[1], e[2], e[3])
    },
    n.prototype.toArray = function () {
        return [this.top, this.left, this.bottom, this.right]
    },
    n.prototype.concat = function (e) {
        if (!e) return new n(this.top, this.left, this.bottom, this.right);
        var t = this.bottom < e.bottom ? this.bottom : e.bottom,
        r = this.top < e.top ? e.top : this.top,
        i = this.left < e.left ? this.left : e.left,
        s = this.right < e.right ? e.right : this.right;
        return new n(r, i, t, s)
    },
    n.prototype.toPolygon = function () {
        return l = this.left - this.resoltionDX,
        r = this.right + this.resoltionDX,
        b = this.bottom - this.resoltionDY,
        t = this.top + this.resoltionDY,
        [[l, t], [l, b], [r, b], [r, t]]
    },
    n.prototype.intersection = function (e) {
        var t = this.maxX + this.resoltionDX,
        n = this.maxY + this.resoltionDY,
        r = this.minX - this.resoltionDX,
        i = this.minY - this.resoltionDY,
        s = Math.max(r, e.minX),
        o = Math.max(i, e.minY),
        u = Math.min(t, e.maxX),
        a = Math.min(n, e.maxY),
        f = s > u || o > a;
        return !f
    },
    n.prototype.clip = function (e) { },
    n.prototype.center = function () {
        return [(this.right + this.left) / 2, (this.top + this.bottom) / 2]
    },
    n
}),
define("BaseTile", ["Hmath", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.deepCopy,
    r = function (t) {
        this.args = t || {},
        this.addTiles = [],
        this.deleteTiles = [],
        this.mapObjcallback = this.args.mapObjcallback,
        this.proxy = "",
        this.midx = this.args.midx || 1,
        this.info = {
            lastmatrix: [],
            targetPosition: null,
            lastPiPj: {
                pi: 0,
                pj: 0
            },
            unit: null,
            len: null,
            level: null,
            lyrOffX: 0,
            lyrOffY: 0
        },
        this.__h2dmath = new e.h2dmath
    };
    return r.prototype = {
        pack: function (e, t) { },
        load: function (e) { },
        move: function (e, t) { },
        zoom: function (e) { },
        screenPosition: function (e) { },
        mapPosition: function (e) { },
        perPixelLen: function () { },
        subScribe: function () {
            var e, t = n(this.tiles),
            r = n(this.deleteTiles);
            this.args.domLayer != undefined ? e = this.args.domLayer.id : e = this.args.layerID,
            this.mapObjcallback({
                copyTiles: t,
                copyDeleteTiles: r,
                sourceID: e
            })
        }
    },
    r
}),
define("Grid", ["epsg3857", "Bound", "Hmath", "BaseTile", "Hobject"],
function (e, t, n, r, i) {
    var s = e.pole(),
    o = i.BaseFunc.each,
    u = i.BaseFunc.extend,
    a = Math.ceil,
    f = i.BaseFunc.isArray,
    l = i.BaseFunc.isObject,
    c = Math.floor,
    h = Math.atan,
    p = Math.pow,
    d = function (e) {
        var t = e || {};
        r.call(this, t),
        this.width = t.width || 0,
        this.height = t.height || 0,
        this.domXY = t.domXY,
        this.elements = null,
        this.addElements = null,
        this.removeElements = null,
        this.level = t.level || 10,
        this._ini()
    };
    return u(d, r),
    d.prototype._ini = function () {
        var e = this.level,
        t = this.args.loglat,
        n = this.forwardPosition(e, t);
        this.elements = this._calcuteAround({
            level: e,
            pi: n.pi,
            pj: n.pj,
            absX: -n.offsetX,
            absY: -n.offsetY
        })
    },
    d.prototype._calcuteEleBound = function (e, n, r) {
        var i = this.inversePosition({
            level: e,
            pi: n,
            pj: r,
            offsetX: 0,
            offsetY: 0
        }),
        s = this.inversePosition({
            level: e,
            pi: n,
            pj: r,
            offsetX: 256,
            offsetY: 256
        });
        return new t(i.lat, i.log, s.lat, s.log)
    },
    d.prototype._calcuteArea = function (e) {
        var t = this.midx,
        n, r, i, s, o, u = {},
        f = e.level,
        l = a(this.height / 256 / t),
        c = a(this.width / 256 / t);
        this.info.targetPosition = e;
        var h = e.absY || 0,
        p = e.absX || 0;
        this.info.lastPiPj = {
            pi: 0,
            pj: 0
        },
        this.info.lastmatrix.length = 0;
        for (var d = 0; d <= l; d++) for (var v = 0; v <= c; v++) r = e.pj + d,
        n = e.pi + v,
        s = h + d * 256,
        o = p + v * 256,
        i = f + "_" + r + "_" + n,
        u[i] = {
            bound: this._calcuteEleBound(f, n, r),
            pi: n,
            pj: r,
            x: s,
            y: o,
            level: f
        },
        this.info.lastmatrix.push([d, v]);
        return u
    },
    d.prototype._calcuteAround = function (e) {
        var t = this.domXY.x,
        n = this.domXY.y,
        r = e.level,
        i = e.absX,
        s = e.absY,
        o = s + n,
        u = i + t,
        f = a(o / 256),
        l = a(u / 256),
        c = e.pj - f,
        h = e.pi - l,
        p = s - f * 256,
        d = i - l * 256;
        return this.info.lyrOffX = d,
        this.info.lyrOffY = p,
        this._calcuteArea({
            level: r,
            pi: h,
            pj: c,
            absX: d,
            absY: p
        })
    },
    d.prototype.move = function (e, t) {
        var n = 0,
        r = 0,
        i = this.info.lastPiPj.pi * 256 + this.info.lyrOffY,
        s = this.info.lastPiPj.pj * 256 + this.info.lyrOffX;
        e < i && t < s ? (n = -1 * a((i - e) / 256), r = -1 * a((s - t) / 256)) : e < i && t > s ? (n = -1 * a((i - e) / 256), r = c((t - s) / 256)) : e > i && t < s ? (n = c((e - i) / 256), r = -1 * a((s - t) / 256)) : e > i && t > s && (n = c((e - i) / 256), r = c((t - s) / 256));
        var o = this.info.targetPosition,
        u = o.level,
        f = o.pj,
        l = o.pi,
        h, p, d, v = this.info.lastmatrix,
        m = v.length,
        g = [],
        b = {},
        w = [];
        for (var E = 0; E < m; E++) g.push([v[E][0] + n, v[E][1] + r]);
        var S = this.__h2dmath.matrixremainder(g, v),
        T = S.A,
        N = S.B;
        t = this.info.lyrOffY || 0,
        e = this.info.lyrOffX || 0;
        var C = T.shift();
        while (!!C) h = l + C[1],
        p = f + C[0],
        d = u + "_" + p + "_" + h,
        x = (C[0] + this.info.lastPiPj.pi) * 256 + t,
        y = (C[1] + this.info.lastPiPj.pj) * 256 + e,
        b[d] = {
            bound: this._calcuteEleBound(u, h, p),
            pi: h,
            pj: p,
            x: x,
            y: y,
            level: u
        },
        this.elements[d] = this.elements[d] || b[d],
        C = T.shift();
        var k = N.shift();
        while (k !== undefined) h = l + k[1],
        p = f + k[0],
        d = u + "_" + p + "_" + h,
        w.push(d),
        !this.elements[d] || delete this.elements[d],
        k = N.shift();
        this.info.lastPiPj.pi += n,
        this.info.lastPiPj.pj += r,
        this.info.targetPosition = {
            level: u,
            pi: l + r,
            pj: f + n,
            absX: o.absX + r * 256,
            absY: o.absY + n * 256
        },
        this.addElements = b,
        this.removeElements = w
    },
    d.prototype.zoom = function (e, t) {
        var n = this.mapPosition(t),
        r = this.level + e;
        if (r < this.zoomMin || r > this.zoomMax) return !1;
        this.level = r;
        var i = this.forwardPosition(r, n.loglat),
        s = r,
        o = i.pj,
        u = i.pi,
        a = n.absXY.x - i.offsetX,
        f = n.absXY.y - i.offsetY;
        return this.elements = this._calcuteAround({
            level: s,
            pi: u,
            pj: o,
            absX: a,
            absY: f
        }),
        {
            level: s,
            mapPosition: n
        }
    },
    d.prototype._cvtaget = function (e, t) {
        var n = 0,
        r = 0,
        i = this,
        s, o, u, a, f;
        for (var l in this.elements) {
            f = l,
            a = this.elements[f];
            if (!!a) break
        }
        var c = e - a.y,
        h = t - a.x,
        p = Math.floor(c / 256),
        d = Math.floor(h / 256),
        v = a.level;
        return s = v + "_" + (a.pj + d).toString() + "_" + (a.pi + p).toString(),
        n = c - p * 256,
        r = h - d * 256,
        n = n > 0 ? n : 256 + n,
        r = r > 0 ? r : 256 + r,
        o = a.x + d * 256,
        u = a.y + p * 256,
        {
            id: s,
            offx: n,
            offy: r,
            x: o,
            y: u
        }
    },
    d.prototype.mapPosition = function (e) {
        var t = e.target || {},
        n = t.id || "",
        r, i, s, o, u, a, f, l, c, h = this.domXY.x,
        p = this.domXY.y,
        d = this._cvtaget(e.clientX - h, e.clientY - p);
        n = d.id;
        if (!n) return;
        return r = n.split("_"),
        o = this.elements[n],
        i = d.offx,
        s = d.offy,
        u = d.y,
        a = d.x,
        absX = u + i,
        absY = a + s,
        f = r[r.length - 3],
        c = r[r.length - 2],
        l = r[r.length - 1],
        loglat = this.inversePosition({
            level: f,
            pi: l,
            pj: c,
            offsetX: i,
            offsetY: s
        }),
        {
            loglat: loglat,
            absXY: {
                x: absX,
                y: absY
            }
        }
    },
    d.prototype.mapPosition2 = function (e) {
        var t = {};
        return t.clientX = e[0],
        t.clientY = e[1],
        (this.mapPosition(t) || {}).loglat
    },
    d.prototype.screenPosition = function (e) {
        var t = this.level,
        n = this.info.targetPosition,
        r = n.absX,
        i = n.absY,
        s = n.pj,
        o = n.pi,
        u = this.forwardPosition(t, e),
        a = u.pj - s,
        f = u.pi - o,
        l = a * 256 + parseInt(i) + u.offsetY + this.domXY.y,
        c = f * 256 + parseInt(r) + u.offsetX + this.domXY.x;
        return {
            x: c,
            y: l
        }
    },
    d.getResolution = function (e) {
        return this.mapScale[e] ? this.mapScale[e] : -1
    },
    d.prototype.forwardPosition = function (t, n) {
        var r = {}; !n || (r = e.forwardMeractor(n));
        var i = r.x || 0,
        o = r.y || 0,
        u = (i + s) * 256 * p(2, t) / (2 * s),
        a = (s - o) * 256 * p(2, t) / (2 * s),
        f = c(u / 256),
        l = c(a / 256),
        h = c(u - f * 256),
        d = c(a - l * 256);
        return {
            pi: f,
            pj: l,
            offsetX: h,
            offsetY: d
        }
    },
    d.prototype.inversePosition = function (e) {
        var t = e.level || this.level,
        n = e.pi || 0,
        r = e.pj || 0,
        i = e.offsetX || 0,
        o = e.offsetY || 0,
        u = n * 256 + i,
        a = r * 256 + o,
        f = u * 2 * s / (256 * p(2, t)) - s,
        l = s - a * 2 * s / (256 * p(2, t)),
        c = f * 180 / s,
        d = l * 2 * Math.PI / (2 * s),
        v = p(Math.E, d),
        m = 360 * (h(v) - Math.PI / 4) / Math.PI;
        return {
            lat: m,
            log: c
        }
    },
    d.prototype.getType = function () {
        return "Grid"
    },
    d
}),
define("Hui", [],
function () {
    var e = function () {
        this._init()
    };
    e.prototype._init = function () {
        var e, t = 10,
        n = "blockG",
        r;
        this.circularG = document.createElement("div"),
        this.circularG.id = "facebookG",
        this.circularG.style.zIndex = 1e4,
        this.circularG.style.position = "absolute";
        for (e = 1; e <= t; e++) {
            var i = document.createElement("div");
            i.id = n + "_" + e.toString(),
            i.className = "facebook_blockG",
            this.circularG.appendChild(i)
        }
    },
    e.prototype.setMapObj = function (e) {
        this.mapObj = e || window.HTMLBodyElement,
        this.circularG.style.display = "none",
        this.mapObj.appendChild(this.circularG)
    },
    e.prototype.setPosition = function (e, t) {
        this.circularG.style.top = (e || 0).toString() + "px",
        this.circularG.style.left = (t || 0).toString() + "px"
    },
    e.prototype.show = function () {
        this.circularG.style.display = "block"
    },
    e.prototype.hide = function () {
        this.circularG.style.display = "none"
    };
    var t = new e,
    n = function () {
        this.modal = document.createElement("div"),
        this.modal_dialog = document.createElement("div"),
        this.modal_content = document.createElement("div"),
        this.modal_header = document.createElement("div"),
        this.modal_body = document.createElement("div"),
        this.modal_footer = document.createElement("div"),
        this._inilization(),
        this._default()
    };
    return n.prototype._inilization = function () {
        this.modal.className = "modal fade",
        this.modal_content.className = "modal-content",
        this.modal_dialog.className = "modal-dialog",
        this.modal_header.className = "modal-header",
        this.modal_body.className = "modal-body",
        this.modal_footer.className = "modal-footer",
        this.modal_content.appendChild(this.modal_header),
        this.modal_content.appendChild(this.modal_body),
        this.modal_content.appendChild(this.modal_footer),
        this.modal_dialog.appendChild(this.modal_content),
        this.modal.appendChild(this.modal_dialog)
    },
    n.prototype._default = function () {
        var e = document.createElement("h4");
        e.nodeValue = "标题栏",
        e.className = "modal-title",
        this.modal_header.appendChild(e)
    },
    n.prototype.setMapObj = function (e) {
        this.mapObj = e || window.HTMLBodyElement,
        document.body.appendChild(this.modal)
    },
    {
        processCircle: t,
        dialog: n
    }
}),
define("Messenger", ["Hobject"],
function (e) {
    var t = e.BaseFunc.extend,
    n = e.BaseFunc.isObject,
    r = e.BaseFunc.result,
    i = e.BaseFunc.merge,
    s = {
        extraClasses: "messenger messenger-fixed messenger-on-top messenger-on-left",
        theme: "future",
        maxMessages: 1,
        parentLocation: "body"
    },
    o = {
        extraClasses: "messenger-message message alert ",
        hideAfer: 3e3,
        message: "",
        type: "info",
        scroll: !0,
        closeButtonText: "&times;"
    },
    u = null,
    a = "",
    f = null,
    l = function (e) {
        var t = e || {};
        t = i(s, t),
        this.optExtraClasses = "",
        this.msgOptExtraClasses = null,
        this.theme = " messenger-theme-",
        this.parent = null,
        this.hideAfter = null,
        this.ul = null,
        this.history = [],
        this.maxMessages = null,
        this.inilization(t)
    };
    return l.prototype.inilization = function (e) {
        this.parent = n(e.parentLocation) ? e.parentLocation : document.getElementById(e.parentLocation) || document.getElementsByTagName(e.parentLocation)[0],
        this.theme += e.theme,
        this.maxMessages = e.maxMessages || 1,
        this.optExtraClasses += e.extraClasses,
        this.ul = document.createElement("ul"),
        this.ul.className = this.optExtraClasses + this.theme,
        this.ul.style.border = "0px solid black";
        var t = document.createElement("div");
        t.style.height = "38px",
        t.appendChild(this.ul),
        this.parent.appendChild(t)
    },
    l.prototype._reserveMessageSlot = function (e) {
        var t = document.createElement("li");
        t.className = "messenger-message-slot";
        var n = this.template({
            message: e
        });
        t.appendChild(n),
        this.history.push(n),
        this.ul.appendChild(t)
    },
    l.prototype.template = function (e) {
        var t = document.createElement("div");
        e = i(o, e),
        this.msgOptExtraClasses = this.msgOptExtraClasses || e.extraClasses,
        this.hideAfter = e.hideAfer || 3e3;
        var n = e.type + " message-" + e.type + " alert-" + e.type,
        r = this.msgOptExtraClasses + n;
        t.className = r;
        var s = document.createElement("div");
        s.className = "messenger-message-inner",
        s.innerText = e.message;
        var u = document.createElement("div");
        u.className = "messenger-spinner";
        for (var a = 1; a <= 2; a++) {
            var f = document.createElement("span");
            f.className = a === 1 ? "messenger-spinner-side messenger-spinner-side-left" : "messenger-spinner-side messenger-spinner-side-right";
            var l = document.createElement("span");
            f.appendChild(l),
            u.appendChild(f)
        }
        return t.appendChild(s),
        t.appendChild(u),
        t
    },
    l.prototype.post = function (e) {
        var t = this;
        clearTimeout(f),
        this.history[this.history.length - 1] ? this._hide(this.history[this.history.length - 1]) : null,
        this._reserveMessageSlot(e),
        f = setTimeout(function () {
            t._hide()
        },
        this.hideAfter)
    },
    l.prototype._show = function () { },
    l.prototype._hide = function (e) {
        e = e ? e : this.history[this.history.length - 1],
        e.className += " messenger-hidden"
    },
    l.setInstance = function (e) {
        u = e
    },
    l.getInstance = function () {
        return u
    },
    l
}),
define("MapObject", ["SecMapInteractive", "Hobject", "SecGraphicLayer", "TileRender", "Render", "Grid", "Hui", "Messenger", "Hmath"],
function (e, t, n, r, i, s, o, u, a) {
    var f = o.processCircle,
    l = o.dialog,
    c = t.BaseFunc.hook,
    h = new a.sTransition,
    p = t.BaseFunc.copy,
    d = t.BaseFunc.bind,
    v = function (e) {
        var t = e || {};
        this.args = {},
        this.layers = [],
        this.tilelayers = [],
        this.featurelayers = [],
        this.layerindex = 0,
        this._tileRender = null,
        this._grid = null,
        this._tools = [],
        this.mapInfo = {
            domXY: {
                x: 0,
                y: 0
            },
            loglat: t.loglat || {
                log: 110.31400575543468,
                lat: 20.0052936452193
            },
            dragging: !1,
            screenPosition: null,
            mapPosition2: null,
            tileContext: null,
            mapCenter: null,
            tileLevel: t.level || 15,
            processCircle: f
        },
        this.layerInfo = {
            offx: 0,
            offy: 0,
            bfoffx: 0,
            bfoffy: 0
        };
        var n = this;
        this._inilization(e)
    };
    return v.prototype._layerhandle = function (e) {
        var t = e || {},
        n = t.layer,
        r = n.domLayer,
        i = t.data,
        s = t.layerType;
        s === "SecTileLayer" ? (this._tileRender.addTiles(i, r), this.tilelayers.push(n)) : (s === "SecFeatureLayer" || s === "SecGraphicLayer" || s === "SecDrawLayer") && this.featurelayers.push(n),
        this.secMapInteractive.addLayer(r),
        this.layers.push(n)
    },
    v.prototype._inilization = function (e) {
        this._iniargs(e),
        this._iniEvent(),
        this._iniInternal()
    },
    v.prototype._iniargs = function (e) {
        e = e || {},
        this.args.level = e.level,
        this.args.type = e.type,
        this.args.loglat = e.loglat,
        this.args.mapID = e.mapID,
        this.args.mapElement = document.getElementById(this.args.mapID) || document.body,
        this.args.mapElement.className = "Jake-ui-MapObject",
        this.args.width = this.args.mapElement.offsetWidth || 0,
        this.args.height = this.args.mapElement.offsetHeight || 0,
        c.setValue("mapElement", this.args.mapElement),
        c.setValue("width", this.args.width),
        c.setValue("height", this.args.height)
    },
    v.prototype._iniInternal = function () {
        var e = new l;
        e.setMapObj(this.args.mapElement),
        f.setPosition(this.args.height / 2 - 64, this.args.width / 2 - 64),
        f.setMapObj(this.args.mapElement),
        this._grid = new s({
            level: this.mapInfo.tileLevel,
            loglat: this.mapInfo.loglat,
            width: this.args.width,
            height: this.args.height,
            domXY: this.mapInfo.domXY
        }),
        this.mapInfo.screenPosition = d(this._grid, this._grid.screenPosition),
        this.mapInfo.mapPosition2 = d(this._grid, this._grid.mapPosition2),
        this._tileRender = new r({
            grid: this._grid
        })
    },
    v.prototype._iniEvent = function () {
        var t = this;
        this._eventcallback = function (e) {
            var n, r = t.featurelayers.length,
            i = t.tilelayers.length,
            s = t._tools.length;
            switch (e.eventName) {
                case "mousedown":
                    break;
                case "mousemove":
                    t.mapInfo.dragging = !0,
                    !isNaN(e.x) && !isNaN(e.y) && (t.mapInfo.domXY.x = t.layerInfo.offx = -1 * e.y, t.mapInfo.domXY.y = t.layerInfo.offy = -1 * e.x);
                    for (n = 0; n < r; n++) t.featurelayers[n].notice({
                        x: -1 * e.y,
                        y: -1 * e.x,
                        sourceID: "mousemove"
                    });
                    break;
                case "beforeMousewheel":
                    for (n = 0; n < r; n++) t.featurelayers[n].notice({
                        zoom: e.zoom,
                        sourceID: "beforeMousewheel"
                    });
                    break;
                case "mousewheel":
                    var o = t._grid.zoom(e.zoom, e.wheelElement);
                    t.mapInfo.tileLevel = o.level;
                    for (n = 0; n < s; n++) t._tools[n].update({
                        level: t.mapInfo.tileLevel,
                        sourceID: "mousewheel"
                    });
                    for (n = 0; n < i; n++) t.tilelayers[n].tiles.zoom(e.zoom, e.wheelElement, o.mapPosition),
                    t._tileRender.clearTiles(t.tilelayers[n].domLayer),
                    t._tileRender.addTiles(t.tilelayers[n].tiles.addTiles, t.tilelayers[n].domLayer);
                    for (n = 0; n < r; n++) t.featurelayers[n].notice({
                        zoom: e.zoom,
                        sourceID: "mousewheel"
                    });
                    break;
                case "mouseup":
                    t.mapInfo.dragging = !1,
                    len = t.tilelayers.length,
                    t._grid.move(e.x, e.y);
                    for (n = 0; n < i; n++) t.tilelayers[n].tiles.move(e.x, e.y),
                    t._tileRender.addTiles(t.tilelayers[n].tiles.addTiles, t.tilelayers[n].domLayer),
                    t._tileRender.removeTiles(t.tilelayers[n].tiles.deleteTiles, t.tilelayers[n].domLayer);
                    for (n = 0; n < r; n++) t.featurelayers[n].notice({
                        x: -1 * e.y,
                        y: -1 * e.x,
                        sourceID: "mouseup"
                    }); !isNaN(e.x) && !isNaN(e.y) && (t.mapInfo.domXY.x = t.layerInfo.offx = t.layerInfo.bfoffx = -1 * e.y, t.mapInfo.domXY.y = t.layerInfo.offy = t.layerInfo.bfoffy = -1 * e.x);
                    break;
                default:
            }
        };
        var n = {
            domLayer: this.args.mapElement,
            width: this.args.width,
            height: this.args.height,
            eventCallback: this._eventcallback
        };
        this.secMapInteractive = new e(n),
        this.messenger = new u({
            parentLocation: this.args.mapID
        }),
        u.setInstance(this.messenger)
    },
    v.prototype.addLayer = function (e) {
        var t = p(this.args, {
            layerID: this.layerindex++,
            mapInfo: this.mapInfo,
            layerInfo: this.layerInfo,
            grid: this._grid
        });
        e.mapObjCallback = this._subscribe;
        var n = this;
        e.complete = function (t) {
            n._layerhandle({
                layerType: e.getType(),
                layer: e,
                data: t
            })
        },
        e.layerInilization(t)
    },
    v.prototype.addTool = function (e) {
        var t = p(this.mapInfo, {
            mapElement: this.args.mapElement,
            addLayer: d(this, this.addLayer),
            mapInteractive: this.secMapInteractive,
            getLayerById: d(this, this.getLayerById)
        });
        e.load(t),
        this._tools.push(e)
    },
    v.prototype.getLayerById = function (e) {
        for (var t = 0,
        n = this.layers.length; t < n; t++) if (this.layers[t].layerID === e) return this.layers[t];
        return null
    },
    v.prototype.moveTo = function (e) {
        var t = this.secMapInteractive.viewBox,
        n = this.secMapInteractive.interactive.mousemove,
        r = this,
        i = [0],
        s = [0];
        clientXY = this.mapInfo.screenPosition(e),
        clientXY.x = clientXY.x - this.mapInfo.domXY.x,
        clientXY.y = clientXY.y - this.mapInfo.domXY.y;
        if (clientXY.x == 0 && clientXY.y == 0) return;
        h.animate(t, 600,
        function (e) {
            var t = Math.sin(Math.PI * e / 72),
            r = (t * clientXY.x).toFixed(0) - i.sum(),
            o = (t * clientXY.y).toFixed(0) - s.sum();
            n({
                clientX: r,
                clientY: o,
                mousePosition: {
                    x: "0",
                    y: "0"
                }
            }),
            i.push(r),
            s.push(o)
        },
        function () {
            var e = clientXY.x - i.sum();
            y = clientXY.y - s.sum(),
            n({
                clientX: e,
                clientY: y,
                mousePosition: {
                    x: "0",
                    y: "0"
                }
            }),
            r._eventcallback({
                x: -1 * clientXY.y,
                y: -1 * clientXY.x,
                eventName: "mouseup"
            }),
            delete transition
        })
    },
    v.prototype.zoomTo = function (e) { },
    v
}),
define("EsriTile", ["Hmath", "Grid", "Hobject"],
function (e, t, n) {
    var r = n.BaseFunc.extend,
    i = function (e) {
        t.call(this, e),
        this.proxy = "src/proxy/arcgis/proxy.ashx?"
    };
    return r(i, t),
    i.prototype.load = function (e) {
        var t = this.pack(this.elements);
        e ? e(t) : null
    },
    i.prototype.move = function (e, t) {
        this.constructor.__super__.move.call(this, e, t),
        this.addTiles = this.pack(this.addElements),
        this.deleteTiles = this.removeElements
    },
    i.prototype.zoom = function (e, t) {
        this.constructor.__super__.zoom.call(this, e, t),
        this.addTiles = this.pack(this.elements)
    },
    i.prototype.pack = function (e) {
        var t = [],
        n,
        r,
        i;
        for (var s in e) i = e[s],
        r = r || i.level,
        pj = i.pj,
        pi = i.pi,
        src = this.args.mapurl + "/tile/" + r + "/" + pj + "/" + pi,
        n = r + "_" + pj + "_" + pi,
        t.push([src, i.x, i.y, n]);
        return t
    },
    i
}),
define("ANTile", ["BaseTile", "Hobject", "Grid"],
function (e, t, n) {
    var r = t.BaseFunc.extend,
    i = function (e) {
        n.call(this, e),
        this.args.mapurl = this.args.mapurl || "http://webrd01.is.autonavi.com/appmaptile?",
        this.proxy = "src/proxy/autonavi/proxy.ashx?"
    };
    return r(i, n),
    i.prototype.load = function (e) {
        var t = this.pack(this.elements);
        e ? e(t) : null
    },
    i.prototype.move = function (e, t) {
        this.constructor.__super__.move.call(this, e, t),
        this.addTiles = this.pack(this.addElements),
        this.deleteTiles = this.removeElements
    },
    i.prototype.zoom = function (e, t) {
        this.constructor.__super__.zoom.call(this, e, t),
        this.addTiles = this.pack(this.elements)
    },
    i.prototype.pack = function (e) {
        var t = [],
        n,
        r,
        i;
        for (var s in e) i = e[s],
        r = r || i.level,
        pj = i.pj,
        pi = i.pi,
        src = this.args.mapurl + "x=" + pi + "&y=" + pj + "&z=" + r + "&lang=zh_cn&size=1&scale=1&style=8",
        n = r + "_" + pj + "_" + pi,
        t.push([src, i.x, i.y, n]);
        return t
    },
    i
}),
define("SecTileLayer", ["SecBaseLayer", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = {
        ESRI: "esri",
        BAIDU: "baidu",
        MAPABC: "mapabc",
        TMAP: "tmap",
        BING: "bing"
    },
    i = function (t) {
        e.call(this, t),
        this.tiles = null
    };
    return n(i, e),
    i.prototype.getType = function () {
        return "SecTileLayer"
    },
    i.prototype._createTiles = function (e) {
        function i(e, t) {
            n.mapObjCallback(e, t)
        }
        var t, n = this,
        s = {
            loglat: this.args.loglat,
            level: this.args.level,
            width: this.args.width,
            height: this.args.height,
            domXY: this.args.mapInfo.domXY,
            mapurl: this.args.mapurl,
            domLayer: this.domLayer,
            mapObjcallback: i
        };
        switch (e) {
            case r.ESRI:
                var o = require("EsriTile");
                t = new o(s);
                break;
            case r.MAPABC:
                var u = require("ANTile");
                t = new u(s);
                break;
            default:
        }
        return t
    },
    i.prototype._createlayer = function () {
        var e = document.createElement("div");
        e.id = this.args.layerID,
        e.style.position = "absolute",
        e.style.width = this.mapWidth + "px",
        e.style.height = this.mapHeight + "px",
        this.domLayer = e,
        this.tiles = this._createTiles(this.args.type)
    },
    i.prototype._publish = function () {
        this.tiles.load(this.complete)
    },
    {
        self: i,
        TILETYPE: r
    }
}),
define("SecBaseTool", ["EventListener", "Hobject"],
function (e, t) {
    var n = e.AddListener,
    r = e.RemoveListener,
    i = t.BaseFunc.isArray,
    s = [],
    o = 0,
    u = null,
    a = 105,
    f = function (e) {
        var t = document.createElement("div"),
        n = t.style;
        t.id = "mapTool",
        t.className = "button glow button-rounded",
        n.position = "absolute",
        n.marginRight = "9px",
        n.zIndex = 99,
        n.width = e.offsetWidth - 24 + "px",
        n.height = "41px",
        n.opacity = .9,
        e.insertBefore(t, e.firstChild);
        var r = function (e) {
            if (i(e)) for (var n = 0,
            r = e.length; n < r; n++) t.appendChild(e[n].btnDiv)
        },
        s = function (e) { };
        return {
            add: r,
            remove: s
        }
    },
    l = function (e, t, r) {
        var i = document.createElement("ul");
        i.style.marginLeft = "-40px",
        i.style.listStyleType = "none";
        var s = function () {
            i.style.display = ""
        },
        o = function () {
            i.style.display = "none"
        };
        for (var u = 0,
        a = e.length; u < a; u++) {
            var f = document.createElement("li"),
            l = document.createElement("a"),
            c = document.createElement("i");
            c.className = "fa " + r[u] + " fa-fw",
            l.appendChild(c),
            l.innerHTML += t[u],
            l.style.width = "80px",
            l.style.marginTop = "3px",
            l.className = "button button-rounded button-flat-primary",
            function (t) {
                n(l, "click",
                function () {
                    e[t].execute()
                })
            }(u),
            f.appendChild(l),
            i.appendChild(f)
        }
        return o(),
        {
            ul: i,
            show: s,
            hide: o
        }
    },
    c = function (e) {
        this.args = e || {},
        this.mapInfo = e,
        this.cmds = []
    };
    c.prototype.load = function (e) {
        this.merge(e),
        this._createTool(),
        this._iniInteraction(),
        s.push(this)
    },
    c.prototype._createTool = function () { },
    c.prototype._createMenu = function () {
        u = u || new f(this.args.mapElement)
    },
    c.prototype._iniInteraction = function () {
        u ? u.add(this.cmds) : null
    },
    c.prototype.remove = function () { },
    c.prototype.update = function () { },
    c.prototype.getType = function () {
        return "SecBaseTool"
    },
    c.prototype.merge = function (e) {
        for (var t in e) this.args[t] === undefined && (this.args[t] = e[t])
    };
    var h = function (e) {
        this.action = e
    };
    h.prototype.execute = function () {
        this.action()
    };
    var p = function (e, t, r) {
        var i = r || "fa-pencil",
        s = document.createElement("div");
        s.style.position = "absolute",
        s.style.top = "3px",
        s.style.right = (o * a).toString().concat("px"),
        s.style.width = "110px",
        s.style.height = "34px",
        s.style.zIndex = 99,
        o++;
        var u = document.createElement("a");
        u.className = "button button-rounded button-flat-primary",
        u.style.width = "80px",
        u.style.height = "34px";
        var f = document.createElement("i");
        f.className = "fa " + i + " fa-fw",
        u.appendChild(f),
        u.innerHTML += e,
        s.appendChild(u),
        n(u, "click",
        function (e) {
            t.execute()
        });
        var l = function (t) {
            var n = u.innerHTML;
            n = n.slice(0, n.length - e.length),
            e = t,
            n += e,
            u.innerHTML = n
        },
        c = function (e) {
            var t = u.innerHTML;
            t = t.split(" "),
            t[2] = e,
            u.innerHTML = t.join(" ")
        };
        return {
            btnDiv: s,
            setText: l,
            setIcon: c
        }
    },
    d = function (e, t, n, r) {
        var i = !1,
        s = new h(function () {
            i ? (u.hide(), i = !1) : (u.show(), i = !0)
        }),
        o = new p(e, s, "fa-toggle-down"),
        u = new l(n, t, r);
        return o.btnDiv.appendChild(u.ul),
        {
            btnDiv: o.btnDiv
        }
    };
    return {
        self: c,
        Command: h,
        CommandItem: p,
        MultiCommandItem: d
    }
}),
define("Symbol", ["Hobject"],
function (e) {
    var t = e.BaseFunc.extend,
    n = function (e) {
        this._init(e)
    };
    n.prototype = {
        _init: function (e) {
            var t = e || {};
            this.fill = t.fill || "#13b5b1",
            this.stroke = t.stroke || "#0068b7",
            this.strokeWidth = t.strokeWidth || "1",
            this.opacity = t.opacity || "0.8",
            this.__init(t)
        },
        __init: function (e) { },
        _toConfig: function () {
            return {
                fill: this.fill,
                stroke: this.stroke,
                opacity: this.opacity,
                strokeWidth: this.strokeWidth
            }
        }
    };
    var r = function (e) {
        n.call(this, e)
    };
    t(r, n),
    r.prototype.__init = function (e) {
        this.tension = e.tension || 0
    },
    r.prototype.toConfig = function () {
        var e = this._toConfig();
        return e.tension = this.tension,
        e
    };
    var i = function (e) {
        n.call(this, e)
    };
    t(i, n),
    i.prototype.__init = function (e) { },
    i.prototype.toConfig = function () {
        return this._toConfig()
    };
    var s = function (e) {
        n.call(this, e)
    };
    t(s, n),
    s.prototype.__init = function (e) {
        this.radius = e.radius || 4
    },
    s.prototype.toConfig = function () {
        var e = this._toConfig();
        return e.radius = this.radius,
        e
    };
    var o = new r({
        stroke: "#13b5b1",
        strokeWidth: 2
    }),
    u = new i,
    a = new s({
        stroke: "black",
        strokeWidth: 1
    });
    return {
        lineSymbol: r,
        polygonSymbol: i,
        pointSymbol: s,
        defaultLineSymbol: o,
        defaultPolygonSymbol: u,
        defaultPointSymbol: a
    }
}),
define("GeoGeometry", ["epsg3857"],
function (e) {
    var t = function (t) {
        var n = t || {};
        this.dimension = n.dimension || 2,
        this.projection = n.projection || e,
        this.coordinates = n.coordinates || [],
        this.proNum = this.projection.getType(),
        this.geoElements = {},
        this.drawCoordinates = [],
        this._inilization()
    };
    return t.prototype.pnpoly = function () { },
    t.prototype._inilization = function () {
        this.bound = this._iniBound(),
        this.center = this._iniCenter()
    },
    t.prototype._iniCenter = function () { },
    t.prototype._iniBound = function () { },
    t.prototype.geoLength = function () { },
    t.prototype.geoArea = function () { },
    t.fromGeometry = function (e) { },
    t.fromEsriGeometry = function (e) { },
    t.fromCoord = function (e) { },
    t.fromCoordinates = function (e) { },
    t.prototype.addPoint = function (e) { },
    t.prototype.replacePoint = function (e, t) { },
    t.prototype.getType = function () {
        return "GeoGeometry"
    },
    t
}),
define("GeoPolygon", ["GeoGeometry", "Bound", "Hobject"],
function (e, t, n) {
    var r = n.BaseFunc.extend,
    i = function (t) {
        e.call(this, t),
        this.area = null
    };
    return r(i, e),
    i.fromGeoGeometry = function (e) {
        return new i({
            coordinates: e.coordinates
        })
    },
    i.fromEsriGeometry = function (e) {
        return new i({
            coordinates: e
        })
    },
    i.fromCoordinates = function (e) {
        return new i({
            coordinates: e
        })
    },
    i.prototype._iniBound = function () {
        var e = this.coordinates.length,
        n, r, i, s, o, u, a, f, l = 0,
        c = 0,
        h = 0;
        for (n = 0; n < e; n++) {
            s = this.coordinates[n],
            i = s.length,
            h += i;
            for (r = 0; r < i; r++) {
                var p = s[r][0],
                d = s[r][1];
                l += p,
                c += d,
                o ? (o = o > d ? o : d, a = a < d ? a : d, u = u < p ? u : p, f = f > p ? f : p) : (u = f = p, o = a = d)
            }
        }
        return new t(o, u, a, f)
    },
    i.prototype._iniCenter = function () { },
    i.prototype.geoArea = function () {
        if (!this.area) {
            var e = this.coordinates.length,
            t, n, r, i = this.coordinates[0];
            t = this._calcuteArea(i);
            for (r = 1; r < e; r++) n = this._calcuteArea(this.coordinates[r]),
            t -= n;
            return t
        }
        return this.area
    },
    i.prototype._calcuteArea = function (e) {
        var t = e.length,
        n = 0,
        r, i, s;
        if (!!e && t > 3) {
            r = 0;
            while (!i && r < t) i = e[r++];
            if (!!i) {
                !s && t > r && (s = e[--t]);
                if (s != null) {
                    var o = s[0] * i[1] - i[0] * s[1];
                    while (r <= t) s = e[r],
                    o += s[0] * i[1] - i[0] * s[1],
                    i = s,
                    r++;
                    n += o
                }
            }
        }
        return Math.abs(n / 2)
    },
    i.prototype.addPoint = function (e) {
        var t = e.dim() > 1 ? e : [e];
        this.coordinates.dim() === 0 ? this.coordinates.push(t) : this.coordinates.dim() === 3 && (this.coordinates[0] = this.coordinates[0].concat(t))
    },
    i.prototype.getType = function () {
        return "GeoPolygon"
    },
    i
}),
define("GeoLineString", ["GeoGeometry", "Bound", "Hobject"],
function (e, t, n) {
    var r = n.BaseFunc.extend,
    i = n.BaseFunc.isArray,
    s = function (t) {
        var n = t || {};
        e.call(this, n)
    };
    return r(s, e),
    s.fromGeoGeometry = function (e) {
        return new s({
            coordinates: [e.coordinates]
        })
    },
    s.fromEsriGeometry = function (e) {
        return new s({
            coordinates: e
        })
    },
    s.prototype._iniBound = function () {
        var e = this.coordinates.length,
        n, r, i, s, o, u, a, f;
        for (n = 0; n < e; n++) r = this.coordinates[n],
        s = r[1],
        i = r[0],
        o ? (o = o > s ? o : s, f = f < s ? f : s, u = u < i ? u : i, a = a > i ? a : i) : (o = f = s, u = a = i);
        return new t(o, u, f, a)
    },
    s.prototype._iniCenter = function () {
        return this.bound.center()
    },
    s.prototype.geoLength = function () {
        var e = 0,
        t = this.coordinates.length - 1,
        n, r, i;
        for (n = 0; n < t; n++) r = this.coordinates[n],
        i = this.coordinates[n + 1],
        e += Math.sqrt(Math.pow(r[0] - i[0], 2) + Math.pow(r[1] - i[1], 2));
        return e
    },
    s.prototype.addPoint = function (e) {
        i(e) ? this.coordinates.push(e) : null
    },
    s.prototype.replacePoint = function (e, t) {
        if (!!e) {
            var n = t === 0 ? 0 : this.coordinates.length - 1;
            this.coordinates[n] = e
        }
    },
    s.prototype.getType = function () {
        return "GeoLineString"
    },
    s
}),
define("GeoPoint", ["GeoGeometry", "Bound", "Hobject"],
function (e, t, n) {
    var r = n.BaseFunc.extend,
    i = function (t) {
        var n = t || {};
        e.call(this, n)
    };
    return r(i, e),
    i.fromGeoGeometry = function (e) {
        return new i({
            coordinates: e.coordinates
        })
    },
    i.fromEsriGeometry = function (e) {
        return new i({
            coordinates: [[e.x, e.y]]
        })
    },
    i.fromCoord = function (e) {
        return new i({
            coordinates: e
        })
    },
    i.prototype._iniBound = function () {
        var e, n = this.coordinates.length,
        r = 0,
        i = 0,
        s = 0,
        o = 0;
        return this.coordinates.length === 1 && (r = o = this.coordinates[0][1], i = s = this.coordinates[0][0]),
        new t(r, i, o, s)
    },
    i.prototype.getType = function () {
        return "GeoPoint"
    },
    i
}),
define("GeoElement", ["GeoPolygon", "GeoLineString", "GeoPoint", "Hobject", "Symbol"],
function (e, t, n, r, i) {
    var s = r.BaseFunc.getId,
    o = function (e) {
        var t = e || {};
        this.id = s(),
        this.geometry = t.geometry || null,
        this.drawElement = [],
        this.applySymbol = t.applySymbol || null,
        this.click = null,
        this.mouseenter = null,
        this.mouseleave = null,
        this.canvasLayers = {},
        this.startXY = {
            x: null,
            y: null
        },
        this._inilization()
    };
    return o.prototype._inilization = function () { },
    o.fromGeometry = function (e, t) {
        return new o({
            geometry: e,
            applySymbol: t
        })
    },
    o.fromCoords = function (r, i, s) {
        if (!s || !r) return;
        var u;
        if (s === "Line" || s === "GeoLineString") u = new t({
            coordinates: r
        });
        else if (s === "Circe" || s === "GeoPoint") u = new n({
            coordinates: r
        });
        else if (s === "Polygon" || s === "GeoPolygon") u = new e({
            coordinates: [r]
        });
        return new o({
            geometry: u,
            applySymbol: i
        })
    },
    o.prototype.getType = function () {
        return "GeoElement"
    },
    o
}),
define("PlotElement", ["GeoElement", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        var n = t || {};
        this.graphAlgorithm = n.graphAlgorithm,
        this.shapes = [],
        this.controlPoints = [],
        e.call(this, n)
    };
    return n(r, e),
    r.prototype.setGraphAlgorithm = function (e) {
        this.graphAlgorithm = e,
        this.accept(this.graphAlgorithm)
    },
    r.prototype.addControlPoint = function (e) {
        this.controlPoints.length < this.graphAlgorithm.maxCpt && this.controlPoints.push(e)
    },
    r.prototype.movePoint = function (e) {
        this.graphAlgorithm.createGeometrys(e)
    },
    r.prototype._inilization = function () {
        this.accept(this.graphAlgorithm)
    },
    r.prototype.accept = function (e) {
        e.visit(this)
    },
    r.prototype.getType = function () {
        return "PlotElement"
    },
    r.prototype.toDrawGeoElements = function () {
        var e, t = [];
        for (var n = 0,
        r = this.shapes.length; n < r; n++) {
            var i = this.shapes[n];
            e = i.getType(),
            e === "GeoPoint" ? i.drawCoordinates = [[i.coordinates[0], i.coordinates[1]]] : e === "GeoPolygon" ? i.drawCoordinates = i.coordinates : e === "GeoLineString" && (i.drawCoordinates = [i.coordinates]),
            t.push(i)
        }
        return t
    },
    r.prototype.setShapeCoord = function (e, t) {
        var n = this.shapes[t];
        if (!!n) {
            var r = n.getType();
            r === "GeoLineString" ? n.coordinates = e : r === "GeoPolygon" && (n.coordinates[0] = e)
        }
    },
    r
}),
define("PlotAlgorithm", [],
function () {
    var e = function (e) {
        var t = e || {};
        this.minCpt = t.minCpt || 0,
        this.maxCpt = t.maxCpt || 0,
        this.ctps = [],
        this._plotElement = null,
        this._inilization()
    };
    return e.prototype._inilization = function () { },
    e.prototype.getGraphParts = function (e) { },
    e.prototype.createGeometrys = function (e, t) { },
    e.prototype.getType = function () {
        return "PlotAlgorithm"
    },
    e.prototype.visit = function (e) {
        this._plotElement = e || null
    },
    e
}),
define("BeelineArrow", ["PlotAlgorithm", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    n = n,
    i = i,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.vertex,
    l = u.angle,
    c = function () {
        var t = {
            minCpt: 2,
            maxCpt: 3
        };
        e.call(this, t),
        this.arrowLine = new n,
        this.p1 = null,
        this.p2 = null
    };
    return s(c, e),
    c.prototype.createGeometrys = function (e) {
        var t = this._plotElement.controlPoints;
        t.length === 1 ? this._plotElement.shapes[0] ? this.arrowLine.replacePoint(e) : (this.arrowLine.addPoint(t[0]), this.arrowLine.addPoint(e), this._plotElement.shapes[0] = this.arrowLine) : t.length >= 2 && (this.p1 = o(t[0]), this.p2 = o(e || t[1]), this.arrowLine.replacePoint(this.p1, 0), this.arrowLine.replacePoint(this.p2), this.getGraphParts(1))
    },
    c.prototype.getGraphParts = function (e) {
        var t = this.arrowLine.geoLength(),
        n = t * e * 4 / 210,
        r = a(this.p1, this.p2, 12.7 / 13),
        s = a(r, this.p2, 2.5),
        o = new i,
        u = f(this.p1, this.p2, r, n * 1, !0),
        l = f(this.p1, this.p2, r, n * 1, !1),
        c = s,
        h = this.p2;
        o.addPoint([u, c, l, h, u]),
        this._plotElement.shapes[1] = o
    },
    c
}),
define("DoubleArrow", ["PlotAlgorithm", "Hobject", "Hmath", "GeoLineString", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = n.mH2dmath,
    a = u.optionWay,
    f = u.azimuth,
    l = u.distance,
    c = u.linePerpenPoints,
    h = u.pathLength,
    p = u.bzLine,
    d = u.bTypeline,
    v = function () {
        var t = {
            minCpt: 3,
            maxCpt: 4
        };
        e.call(this, t),
        this._inilization()
    };
    return s(v, e),
    v.prototype._inilization = function () {
        this.m_pWay = !1,
        this.m_CtrlPts = [],
        this.pts = null,
        this.onPoint = [],
        this.ctrlpts = [],
        this.cpts = [],
        this.pv = [],
        this.pv2 = [],
        this.control1 = [],
        this.control2 = [],
        this.lpnt = [],
        this.cpnt = [],
        this.rpnt = [],
        this.leftpt0 = [],
        this.leftpt1 = [],
        this.leftpt2 = [],
        this.rightpt0 = [],
        this.rightpt1 = [],
        this.rightpt2 = [],
        this.geoPolygon = new i,
        this.line1 = new r
    },
    v.prototype.createGeometrys = function (e) {
        var t = this._plotElement.controlPoints,
        n = t.length;
        if (n == 1) this._plotElement.shapes[0] ? this.line1.replacePoint(e) : (this.line1.addPoint(t[0]), this.line1.addPoint(e)),
        this._plotElement.shapes[0] = this.line1;
        else if (n === 2) {
            this.line1.replacePoint(t[1]),
            this.m_CtrlPts = o(t),
            this.m_CtrlPts.push(e);
            var r = -1 / ((this.m_CtrlPts[1][1] - this.m_CtrlPts[0][1]) / (this.m_CtrlPts[1][0] - this.m_CtrlPts[0][0])),
            i = v.leftPoint([(this.m_CtrlPts[0][0] + this.m_CtrlPts[1][0]) / 2, (this.m_CtrlPts[0][1] + this.m_CtrlPts[1][1]) / 2], this.m_CtrlPts[2], r);
            this.m_CtrlPts.push(i)
        } else n === 3 ? (this.m_CtrlPts = o(t), this.m_CtrlPts.push(e)) : n === 4 && (this.m_CtrlPts = o(t));
        this.m_CtrlPts.length === 4 && this.getGraphParts(1)
    },
    v.prototype.getGraphParts = function (e) {
        var t = this.m_CtrlPts;
        this.geoPolygon.coordinates = [],
        this.m_pWay = a(t[0], t[1], t[2]);
        var n = l(t[1], t[2]);
        if (n === 0) return;
        c(t[1], t[2], n / 2, n / 4, this.onPoint, this.leftpt0, this.m_pWay),
        c(t[1], t[2], n / 2, n / 10, this.onPoint, this.leftpt1, this.m_pWay),
        n = l(t[1], this.leftpt0),
        c(t[1], this.leftpt0, n / 3, 0, this.leftpt2, this.onPoint, !0),
        this.ctrlpts[0] = t[1],
        this.ctrlpts[1] = this.leftpt1,
        this.ctrlpts[2] = t[2],
        n = h(this.ctrlpts),
        this.pts = d(this.ctrlpts),
        this.pv = v.helloArrowHead(this.pts[parseInt(this.pts.length * 5 / 6)], t[2], n / 4.5, Math.PI / 5, Math.PI / 2, Math.PI / 10),
        n = l(t[0], t[3]),
        c(t[0], t[3], n / 2, n / 4, this.onPoint, this.rightpt0, !this.m_pWay),
        c(t[0], t[3], n / 2, n / 10, this.onPoint, this.rightpt1, !this.m_pWay),
        n = l(t[0], this.rightpt0),
        c(t[0], this.rightpt0, n / 3, 0, this.rightpt2, this.onPoint, !0),
        this.ctrlpts[0] = t[0],
        this.ctrlpts[1] = this.rightpt1,
        this.ctrlpts[2] = t[3],
        n = h(this.ctrlpts),
        this.pts = d(this.ctrlpts),
        this.pv2 = v.helloArrowHead(this.pts[parseInt(this.pts.length * 5 / 6)], t[3], n / 4.5, Math.PI / 5, Math.PI / 2, Math.PI / 10),
        this.m_pWay ? (c(this.pv2[2], this.pv2[0], l(t[2], t[1]), 0, this.control1, this.onPoint, !1), c(this.pv[2], this.pv[4], l(t[2], t[1]), 0, this.control2, this.onPoint, !1)) : (c(this.pv2[2], this.pv2[4], 5 * l(this.pv2[2], this.pv2[4]), 0, this.control1, this.onPoint, !1), c(this.pv[2], this.pv[0], 5 * l(this.pv[2], this.pv[0]), 0, this.control2, this.onPoint, !1));
        if (t.length === 4) {
            this.m_pWay ? (this.cpnt[0] = o(this.pv[4]), this.cpnt[1] = o(this.control2), this.cpnt[2] = o(this.control1), this.cpnt[3] = o(this.pv2[0]), this.lpnt[0] = o(this.pv2[4]), this.lpnt[1] = o(this.rightpt0), this.lpnt[2] = o(this.rightpt2), this.lpnt[3] = o(t[0]), this.rpnt[0] = o(t[1]), this.rpnt[1] = o(this.leftpt2), this.rpnt[2] = o(this.leftpt0), this.rpnt[3] = o(this.pv[0])) : (this.cpnt[0] = o(this.pv2[4]), this.cpnt[1] = o(this.control1), this.cpnt[2] = o(this.control2), this.cpnt[3] = o(this.pv[0]), this.rpnt[0] = o(t[0]), this.rpnt[1] = o(this.rightpt2), this.rpnt[2] = o(this.rightpt0), this.rpnt[3] = o(this.pv2[0]), this.lpnt[0] = o(this.pv[4]), this.lpnt[1] = o(this.leftpt0), this.lpnt[2] = o(this.leftpt2), this.lpnt[3] = o(t[1]));
            var r = this.rpnt,
            i = p(r),
            s = i[0];
            this.geoPolygon.addPoint(i),
            this.m_pWay ? this.geoPolygon.addPoint(this.pv) : this.geoPolygon.addPoint(this.pv2);
            var u = this.cpnt,
            f = p(u);
            this.geoPolygon.addPoint(f),
            this.m_pWay ? this.geoPolygon.addPoint(this.pv2) : this.geoPolygon.addPoint(this.pv);
            var m = this.lpnt,
            g = p(m);
            this.geoPolygon.addPoint(g),
            this.geoPolygon.addPoint(s),
            this._plotElement.shapes[1] = this._plotElement.shapes[1] || this.geoPolygon
        }
    },
    v.leftPoint = function (e, t, n) {
        var r = e[1] - n * e[0],
        i,
        s;
        return i = parseInt(2 * (t[0] + n * t[1] - n * r) / (n * n + 1) - t[0]),
        s = parseInt(2 * (n * t[0] + n * n * t[1] + r) / (n * n + 1) - t[1]),
        [i, s]
    },
    v.helloArrowHead = function (e, t, n, r, i, s) {
        var o = [[], [], [], [], []],
        u = r / 2,
        a = i / 2,
        f = s / 2,
        l = Math.atan2(t[1] - e[1], t[0] - e[0]),
        c = Math.cos(u),
        h = Math.sin(u),
        p = Math.cos(a),
        d = Math.sin(a),
        v = Math.cos(l),
        m = Math.sin(l),
        g = Math.cos(f),
        y = Math.sin(f);
        o[3][0] = parseInt(-n * (c * v - h * m)),
        o[3][1] = parseInt(-n * (h * v + c * m)),
        o[1][0] = parseInt(-n * (c * v + h * m)),
        o[1][1] = parseInt(-n * (m * c - v * h)),
        o[2][0] = 0,
        o[2][1] = 0;
        var b = n * (d * p - p * h) / (d * g - p * y);
        o[4][0] = parseInt(-b * (g * v - y * m)),
        o[4][1] = parseInt(-b * (y * v + g * m)),
        o[0][0] = parseInt(-b * (v * g + m * y)),
        o[0][1] = parseInt(-b * (m * g - v * y));
        var w = parseInt(t[0] - (o[0][0] + o[4][0]) / 2),
        E = parseInt(t[1] - (o[0][1] + o[4][1]) / 2);
        for (var S = 0; S < 5; S++) o[S][0] += t[0],
        o[S][1] += t[1];
        return o
    },
    v.prototype.getType = function () {
        return "DoubleArrow"
    },
    v
}),
define("CurveArrow", ["PlotAlgorithm", "Hobject", "Hmath", "GeoLineString", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = n.mH2dmath,
    o = t.BaseFunc.extend,
    u = t.BaseFunc.copy,
    a = s.bzLine,
    f = s.scalePoint,
    l = s.vertex,
    c = s.gainPt,
    h = s.pathLength,
    p = function () {
        var t = {
            minCpt: 2,
            maxCpt: 5
        };
        e.call(this, t),
        this.arrowLine = new r,
        this.arrowPolygon = new i,
        this._inilization()
    };
    return o(p, e),
    p.prototype._inilization = function () {
        this.bzPoints = null
    },
    p.prototype.createGeometrys = function (e) {
        var t = this._plotElement.controlPoints,
        n = t.length;
        if (t.length === 1) this._plotElement.shapes[0] ? this.arrowLine.replacePoint(e) : (this.arrowLine.addPoint(t[0]), this.arrowLine.addPoint(e), this._plotElement.shapes[0] = this.arrowLine);
        else if (n < this.maxCpt) {
            var r = u(t);
            r.push(e);
            var i = a(r);
            this.arrowLine.coordinates = this.bzPoints = i,
            this.getGraphParts(1)
        } else if (n === this.maxCpt) {
            var r = u(t),
            i = a(r);
            this.arrowLine.coordinates = this.bzPoints = i,
            this.getGraphParts(1)
        }
    },
    p.prototype.getGraphParts = function (e) {
        var t = [],
        n = [],
        r,
        i,
        s,
        o,
        a,
        p,
        d = h(this.bzPoints),
        v = d * e * 4 / 210;
        t = c(this.bzPoints, d, 12.7 / 13, r),
        n = c(this.bzPoints, d, .96555, i);
        var m = u(this.bzPoints[this.bzPoints.length - 1]);
        n = f(t, m, 2.5),
        s = l(m, t, t, v, !0),
        o = l(m, t, t, v, !1),
        a = n,
        p = m;
        var g = [s, a, o, p, s];
        this.arrowPolygon.coordinates = [g],
        this._plotElement.shapes[1] = this._plotElement.shapes[1] || this.arrowPolygon
    },
    p
}),
define("SlightnessArrow", ["PlotAlgorithm", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.vertex,
    c = u.angle,
    h = function () {
        var t = {
            minCpt: 2,
            maxCpt: 2
        };
        e.call(this, t),
        this.arrowPolygon = new i,
        this._inilization()
    };
    return s(h, e),
    h.prototype._inilization = function () {
        this.p1 = null,
        this.p2 = null
    },
    h.prototype.createGeometrys = function (e) {
        var t = this._plotElement.controlPoints,
        n = t.length;
        n === 1 ? (this.p1 = t[0], this.p2 = e, this.getGraphParts(1)) : n === 2 && (this.p1 = t[0], this.p2 = t[1], this.getGraphParts(1))
    },
    h.prototype.getGraphParts = function (e) {
        var t = f(this.p1, this.p2),
        n = t * e,
        r = a(this.p1, this.p2, .83),
        i = a(this.p1, this.p2, .9),
        s = l(this.p1, this.p2, this.p1, n / 8, !0),
        o = l(this.p1, this.p2, this.p1, n / 8, !1),
        u = l(this.p1, this.p2, r, n / 15, !0),
        c = l(this.p1, this.p2, r, n / 15, !1),
        h = l(this.p1, this.p2, i, n / 65, !0),
        p = l(this.p1, this.p2, i, n / 65, !1),
        d = this.p2,
        v = [s, h, u, d, c, p, o, s];
        this.arrowPolygon.coordinates = [v],
        this._plotElement.shapes[0] = this._plotElement.shapes[0] || this.arrowPolygon
    },
    h
}),
define("BaseRoute", ["PlotAlgorithm", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        var t = {
            minCpt: 3,
            maxCpt: 3
        };
        e.call(this, t),
        this._inilization()
    };
    return s(v, e),
    v.prototype._inilization = function () {
        this.points = null,
        this.pline4 = null,
        this.pline6 = null,
        this.bzpoints = null,
        this.line = new n,
        this.triangle = new n,
        this.rect = new n,
        this.arrow = new i
    },
    v.prototype.createGeometrys = function (e) {
        var t = this._plotElement.controlPoints,
        n = t.length;
        n === 1 ? (this.line.addPoint(t[0]), this.line.addPoint(e), this._plotElement.shapes[0] = this.line) : n < this.maxCpt ? (this.points = o(t), this.points.push(e), this.bzpoints = c(this.points), this.line.coordinates = this.bzpoints, this.getGraphParts(1)) : n === this.maxCpt && (this.points = o(t), this.bzpoints = c(this.points), this.line.coordinates = this.bzpoints, this.getGraphParts(1))
    },
    v.prototype.getGraphParts = function (e) {
        var t, n, r, i, s, u, f, c, d, v, m, g, y;
        y = o(this.bzpoints);
        var b = l(this.bzpoints),
        w = b * e * 4 / 210;
        i = h(y, b, 1 / 31),
        t = o(y[0]);
        var E = w;
        this.pline4 = h(y, b, 12.8 / 13);
        var S = y[y.length - 1];
        this.pline6 = a(this.pline4, S, 2.5),
        d = p(i, t, t, E, !1),
        m = p(i, t, t, E, !0),
        v = p(t, d, d, 2 * E, !0),
        g = p(t, m, m, 2 * E, !1);
        var x = [d, v, g, m, d];
        this.rect.coordinates = x,
        this._plotElement.shapes[1] = this._plotElement.shapes[1] || this.rect,
        this.signal(E, d, m, v, g);
        var T, N, C, k;
        T = p(S, this.pline4, this.pline4, w, !0),
        N = this.pline6,
        C = p(S, this.pline4, this.pline4, w, !1),
        k = S;
        var L = [T, N, C, k, T];
        this.arrow.coordinates = [L],
        this._plotElement.shapes[3] = this._plotElement.shapes[3] || this.arrow
    },
    v.prototype.signal = function (e, t, n, r, i) { },
    v
}),
define("ArmyRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .2),
        o = a(t, n, .8),
        u = p(t, s, s, 1.6 * e, !1),
        f = p(t, s, s, .6 * e, !1),
        l = p(t, o, o, e, !1),
        c = [u, f, l, u];
        this.triangle.coordinates = c,
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("ArsenalRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .2),
        o = a(t, n, .8),
        u = p(t, s, s, 1.6 * e, !1),
        f = p(t, o, s, 1.3 * e, !1),
        l = p(t, s, o, e, !1),
        c = p(t, o, o, e * .7, !1),
        h = p(t, s, o, e * .4, !1),
        d = [u, f, l, c, h];
        this.triangle.coordinates = d,
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("ExpertRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .2),
        o = a(t, n, .8),
        u = p(t, s, s, .6 * e, !1),
        f = p(t, this.points[0], this.points[0], .6 * e, !1),
        l = p(t, o, o, .6 * e, !1),
        c = p(t, s, s, 1.4 * e, !1),
        h = p(t, this.points[0], this.points[0], 1.4 * e, !1),
        d = p(t, o, o, 1.4 * e, !1),
        v = [u, f, l, c, h, d];
        this.triangle.coordinates = [v],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("MedicalRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .2),
        o = a(t, n, .8),
        u = p(t, t, this.points[0], e, !1),
        f = p(this.points[0], u, u, .8 * e, !1),
        l = p(this.points[0], u, u, e, !0),
        c = p(f, u, u, .8 * e, !1),
        h = p(f, u, u, .8 * e, !0),
        d = [l, u, l, f, l, c, l, h];
        this.triangle.coordinates = [d],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("PowerRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .3),
        o = a(t, n, .7),
        u = p(t, s, s, .2 * e, !1),
        f = p(t, s, s, e, !1),
        l = p(t, o, o, .18 * e, !1),
        c = p(t, o, o, e, !1),
        h = [l, f, c, u];
        this.triangle.coordinates = [h],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("ProChymicRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .3),
        o = a(t, n, .7),
        u = p(t, s, s, .2 * e, !1),
        f = p(t, s, s, e, !1),
        l = p(t, o, o, .18 * e, !1),
        c = p(t, o, o, e, !1),
        h = [l, f, c, u];
        this.triangle.coordinates = [h],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("ProjectRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .2),
        o = a(t, n, .8),
        u = p(t, s, s, .6 * e, !1),
        f = p(t, s, s, e, !1),
        l = p(t, o, o, .4 * e, !1),
        c = p(t, s, s, 1.4 * e, !1),
        h = p(t, o, o, e, !1),
        d = p(t, o, o, 1.6 * e, !1),
        v = [u, f, l, c, h, d];
        this.triangle.coordinates = [v],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("ProSuccorRoute", ["BaseRoute", "Hobject", "GeoLineString", "Hmath", "GeoPolygon"],
function (e, t, n, r, i) {
    var s = t.BaseFunc.extend,
    o = t.BaseFunc.copy,
    u = new r.h2dmath,
    a = u.scalePoint,
    f = u.distance,
    l = u.pathLength,
    c = u.bzLine,
    h = u.gainPt,
    p = u.vertex,
    d = u.angle,
    v = function () {
        e.call(this)
    };
    return s(v, e),
    v.prototype.signal = function (e, t, n, r, i) {
        var s = a(t, n, .3),
        o = a(t, n, .7),
        u = p(t, this.points[0], this.points[0], 1.6 * e, !1),
        f = p(t, s, s, e, !1),
        l = p(t, o, o, e, !1),
        c = p(t, this.points[0], this.points[0], .4 * e, !1),
        h = [u, f, c, l, u];
        this.triangle.coordinates = [h],
        this._plotElement.shapes[2] = this._plotElement.shapes[2] || this.triangle
    },
    v
}),
define("DrawProtocol", ["Hobject", "Symbol", "GeoElement", "PlotElement", "Render", "BeelineArrow", "DoubleArrow", "CurveArrow", "SlightnessArrow", "ArmyRoute", "ArsenalRoute", "ExpertRoute", "MedicalRoute", "PowerRoute", "ProChymicRoute", "ProjectRoute", "ProSuccorRoute"],
function (e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m) {
    var g = {
        ArmyRoute: !0,
        ArsenalRoute: !0,
        ExpertRoute: !0,
        MedicalRoute: !0,
        PowerRoute: !0,
        ProChymicRoute: !0,
        ProjectRoute: !0,
        ProSuccorRoute: !0
    },
    y = {
        Polygon: !0,
        Line: !0
    },
    b = {
        SlightnessArrow: !0
    },
    w = {
        BeelineArrow: !0,
        DoubleArrow: !0,
        CurveArrow: !0
    },
    E = {
        Polygon: "Polygon",
        Line: "Line",
        BeelineArrow: "BeelineArrow",
        DoubleArrow: "DoubleArrow",
        CurveArrow: "CurveArrow",
        SlightnessArrow: "SlightnessArrow",
        ArmyRoute: "ArmyRoute",
        ArsenalRoute: "ArsenalRoute",
        ExpertRoute: "ExpertRoute",
        MedicalRoute: "MedicalRoute",
        PowerRoute: "PowerRoute",
        ProChymicRoute: "ProChymicRoute",
        ProjectRoute: "ProjectRoute",
        ProSuccorRoute: "ProSuccorRoute"
    },
    S = {
        BeelineArrow: s,
        DoubleArrow: o,
        CurveArrow: u,
        SlightnessArrow: a,
        ArmyRoute: f,
        ArsenalRoute: l,
        ExpertRoute: c,
        MedicalRoute: h,
        PowerRoute: p,
        ProChymicRoute: d,
        ProjectRoute: v,
        ProSuccorRoute: m
    },
    x = i.Polygon,
    T = i.Circle,
    N = i.Line,
    C = function (e) { },
    k = t.defaultLineSymbol,
    L = t.defaultPolygonSymbol,
    A = t.defaultPointSymbol,
    O = e.BaseFunc.extend,
    M = function (e) {
        var t = e || {},
        i = this.name = t.name;
        this.layer = t.layer,
        this.complete = t.complete,
        this.plotElement = S[i] ? new r({
            graphAlgorithm: new S[i]
        }) : null,
        this.geoElement = new n
    };
    M.prototype.mousedown = function (e) { },
    M.prototype.mousemove = function (e) { },
    M.prototype.dbclick = function () { };
    var _ = function (e) {
        var t = e || {};
        M.call(this, t)
    };
    O(_, M),
    _.prototype.mousedown = function (e) {
        if (!this.geoElement.drawElement[0]) {
            var t;
            switch (this.name) {
                case "Polygon":
                    t = L.toConfig(),
                    t.points = [e, e, e],
                    this.geoElement.drawElement[0] = new x(t);
                    break;
                case "Line":
                    t = k.toConfig(),
                    t.points = [e, e],
                    this.geoElement.drawElement[0] = new N(t);
                    break;
                default:
            }
            this.layer.add(this.geoElement.drawElement[0])
        } else this.geoElement.drawElement[0].getPoints().push(e)
    },
    _.prototype.mousemove = function (e) {
        var t = this.geoElement.drawElement[0].getPoints(),
        n = t.length;
        t[n - 1] = e
    },
    _.prototype.dbclick = function () {
        this.complete(this.geoElement),
        this.geoElement = null
    };
    var D = function (e) {
        var t = e || {};
        M.call(this, t)
    };
    O(D, M),
    D.prototype.mousedown = function (e) {
        if (!this.plotElement.drawElement[0]) {
            this.plotElement.addControlPoint(e),
            this.plotElement.movePoint(e),
            this.plotElement.drawElement = [];
            var t = k.toConfig();
            t.points = this.plotElement.shapes[0].coordinates,
            this.plotElement.drawElement[0] = new N(t),
            this.layer.add(this.plotElement.drawElement[0])
        } else this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt && this.plotElement.addControlPoint(e),
        this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt && (this.complete(this.plotElement), this.plotElement = null)
    },
    D.prototype.mousemove = function (e) {
        var t = this.plotElement.controlPoints,
        n = t.length;
        if (n === 1) {
            var r = this.plotElement.drawElement[0].getPoints(),
            i = r.length;
            r[i - 1] = e
        } else if (n >= 2) {
            this.plotElement.movePoint(e),
            this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates);
            if (!this.plotElement.drawElement[1]) {
                var s = k.toConfig();
                s.points = this.plotElement.shapes[1].coordinates,
                this.plotElement.drawElement[1] = new N(s);
                var o = k.toConfig();
                o.points = this.plotElement.shapes[2].coordinates,
                this.plotElement.drawElement[2] = new N(o);
                var u = A.toConfig();
                u.points = this.plotElement.shapes[3].coordinates[0],
                this.plotElement.drawElement[3] = new x(u),
                this.layer.add(this.plotElement.drawElement[1]),
                this.layer.add(this.plotElement.drawElement[2]),
                this.layer.add(this.plotElement.drawElement[3])
            } else this.plotElement.drawElement[1].setPoints(this.plotElement.shapes[1].coordinates),
            this.plotElement.drawElement[2].setPoints(this.plotElement.shapes[2].coordinates),
            this.plotElement.drawElement[3].setPoints(this.plotElement.shapes[3].coordinates[0])
        }
    },
    D.prototype.dbclick = function () {
        this.complete(this.plotElement),
        this.plotElement = null
    };
    var P = function (e) {
        var t = e || {};
        M.call(this, t)
    };
    O(P, M),
    P.prototype.mousedown = function (e) {
        this.plotElement.drawElement[0] ? (this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt && this.plotElement.addControlPoint(e), this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt && (this.complete(this.plotElement), this.plotElement = null)) : this.plotElement.addControlPoint(e)
    },
    P.prototype.mousemove = function (e) {
        var t = this.plotElement.controlPoints,
        n = t.length;
        if (n === 1) {
            this.plotElement.movePoint(e);
            if (!this.plotElement.drawElement[0]) {
                var r = L.toConfig();
                r.points = this.plotElement.shapes[0].coordinates[0],
                this.plotElement.drawElement[0] = new x(r),
                this.layer.add(this.plotElement.drawElement[0])
            } else this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates[0])
        }
    },
    P.prototype.dbclick = function () {
        this.complete(this.plotElement),
        this.plotElement = null
    };
    var H = function (e) {
        var t = e || {};
        M.call(this, t)
    };
    O(H, M),
    H.prototype.mousedown = function (e) {
        if (!this.plotElement.drawElement[0]) {
            this.plotElement.addControlPoint(e),
            this.plotElement.movePoint(e);
            var t = k.toConfig();
            t.points = this.plotElement.shapes[0].coordinates,
            this.plotElement.drawElement[0] = new N(t),
            this.layer.add(this.plotElement.drawElement[0])
        } else this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt && this.plotElement.addControlPoint(e),
        this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt && (this.complete(this.plotElement), this.plotElement = null)
    },
    H.prototype.mousemove = function (e) {
        var t = this.plotElement.controlPoints,
        n = t.length;
        if (n === 1) this.plotElement.movePoint(e),
        this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates);
        else if (n >= 2) {
            this.plotElement.movePoint(e);
            if (!this.plotElement.drawElement[1]) {
                var r = L.toConfig();
                r.points = this.plotElement.shapes[1].coordinates[0],
                this.plotElement.drawElement[1] = new x(r),
                this.layer.add(this.plotElement.drawElement[1])
            } else this.plotElement.drawElement[1].setPoints(this.plotElement.shapes[1].coordinates[0]);
            this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates)
        }
    },
    H.prototype.dbclick = function () {
        this.plotElement = null
    };
    var B = function () { };
    return B.create = function (e, t) {
        var n;
        return t.name = e,
        y[e] ? n = new _(t) : g[e] ? n = new D(t) : b[e] ? n = new P(t) : w[e] && (n = new H(t)),
        n
    },
    {
        drawProtocolFactory: B,
        DRAWTYPE: E
    }
}),
define("SecDrawInteractive", ["EventListener", "Messenger", "Hobject", "DrawProtocol", "Render", "Symbol", "GeoElement", "PlotElement"],
function (e, t, n, r, i, s, o, u) {
    var a = e.AddListener,
    f = e.RemoveListener,
    l = n.BaseFunc.extend,
    c = n.BaseFunc.bind,
    h = n.BaseFunc.hook,
    p = n.BaseFunc.watch,
    d = r.drawProtocolFactory,
    v = null,
    m = i.Animation,
    g = null,
    y, b, w = function (e, t) {
        var n, r, i, s = !1,
        o = function (o) {
            if (o.button === 0) {
                var f = o.offsetX - v.offx,
                c = o.offsetY - v.offy;
                r = r || f,
                i = i || c,
                s || (a(e, "mousemove", u), a(e, "dblclick", l), s = !0),
                t({
                    eventName: "mousedown",
                    drawType: n,
                    x0: r,
                    y0: i,
                    moveX: f,
                    moveY: c
                })
            }
        },
        u = function (e) {
            e.cancelBubble = !0;
            var o = e.offsetX - v.offx,
            u = e.offsetY - v.offy;
            s && t({
                x0: r,
                y0: i,
                moveX: o,
                moveY: u,
                eventName: "mousemove",
                drawType: n
            })
        },
        l = function (e) {
            t({
                eventName: "dblclick",
                drawType: n
            }),
            h()
        },
        c = function () {
            h(),
            a(e, "mousedown", o)
        },
        h = function () {
            n = "",
            s = !1,
            r = i = null,
            f(e, "mousemove", u),
            f(e, "dblclick", l),
            f(e, "mousedown", o)
        },
        p = function (e) {
            h(),
            c(),
            n = e
        };
        return {
            reSetEvent: c,
            clearEvent: h,
            setDrawType: p
        }
    },
    E = function (e) {
        !h.plotEditFlag || (!g || g.stopEdit(), g = e, g.startEdit())
    };
    p(h, "plotEditFlag",
    function (e, t, n) {
        n === !1 && (g ? g.stopEdit() : null, g = null)
    });
    var S = function (e) {
        var t = this;
        y = y || e.screenPosition,
        b = b || e.mapPosition,
        this.mapID = e.mapID,
        this.domLayer = e.domLayer,
        this.stroeData = e.stroeData,
        this.layer = e.layer,
        this.layerInfo = v = v || e.layerInfo,
        this.anim = new m(function (e) {
            t.layer.draw()
        },
        this.layer);
        var n = this.addAction = function (e) {
            t.anim.stop(),
            e.startEdit ? null : e.startEdit = function () {
                e._startEdit(t.anim, t.layer, t.domLayer, y)
            },
            e.stopEdit ? null : e.stopEdit = function () {
                e._stopEdit(t.anim, t.domLayer, r)
            };
            for (var n = 0,
            i = e.drawElement.length; n < i; n++) e.drawElement[n].once("click",
            function (t) {
                E(e)
            })
        },
        r = function (e) {
            t.drawOperation.clearEvent(),
            t.anim.stop(),
            t.domLayer.style.cursor = "default";
            var r = e.getType(),
            i = r === "GeoElement" ? t._cvtGeoElement(e) : t._cvtPlotElement(e);
            t.stroeData(r, i),
            n(e)
        };
        this.protocolArgs = {
            name: "",
            layer: e.layer,
            complete: r,
            symbol: null
        },
        this.drawOperation = new w(this.domLayer, c(this, this.eventCallabck))
    };
    return S.prototype.eventCallabck = function (e) {
        var t = this.layerInfo.offx,
        n = this.layerInfo.offy,
        r, i = e.moveX + t,
        s = e.moveY + n,
        o = [i, s];
        e.eventName === "mousedown" ? this.drawProtocol.mousedown(o) : e.eventName === "mousemove" ? this.drawProtocol.mousemove(o) : e.eventName === "dblclick" && (this.drawProtocol.dbclick(), this.anim.stop())
    },
    S.prototype.changeDraw = function (e) {
        this.anim.stop(),
        t.getInstance().post("任务 ： 绘制 " + e),
        this.domLayer.style.cursor = "crosshair",
        this.drawOperation.setDrawType(e),
        this.drawProtocol = d.create(e, this.protocolArgs),
        this.anim.start()
    },
    S.prototype._cvtPlotElement = function (e, t, n) {
        var r = e.drawElement,
        i = r.length,
        s = 0;
        for (; s < i; s++) e.setShapeCoord(this._cvtGeometry(r[s], t, n)[0], s);
        var o = e.controlPoints,
        u;
        j = 0,
        len2 = o.length;
        for (; j < len2; j++) u = b(o[j]),
        o[j] = [u.log, u.lat];
        return e
    },
    S.prototype._cvtGeoElement = function (e) {
        var t = e.drawElement[0],
        n = this._cvtGeometry(t);
        return o.fromCoords(n[0], n[1], n[2])
    },
    S.prototype._cvtGeometry = function (e) {
        var t = e.className,
        n, r, i;
        switch (t) {
            case "Polygon":
                n = e.attrs.points,
                n = n.length >= 3 ? n.concat([n[0]]) : null,
                i = new s.polygonSymbol({
                    fill: e.attrs.fill,
                    opacity: e.attrs.opacity,
                    stroke: e.attrs.stroke,
                    strokeWidth: e.attrs.strokeWidth
                });
                break;
            case "Circle":
                n = [e.attrs.x, e.attrs.y],
                i = new s.pointSymbol({
                    radius: e.attrs.radius,
                    fill: e.attrs.fill,
                    opacity: e.attrs.opacity,
                    stroke: e.attrs.stroke,
                    strokeWidth: e.attrs.strokeWidth
                });
                break;
            case "Line":
                n = e.attrs.points,
                i = new s.lineSymbol({
                    opacity: e.attrs.opacity,
                    stroke: e.attrs.stroke,
                    strokeWidth: e.attrs.strokeWidth
                });
                break;
            default:
        }
        return r = this._cvtCoord(n, t),
        [r, i, t]
    },
    S.prototype._cvtCoord = function (e, t) {
        var n = [],
        r,
        i,
        s,
        o = e.length;
        if (t === "Line") for (s = 0; s < o; s++) r = b(e[s]),
        r ? n.push([r.log, r.lat]) : null;
        else if (t === "Circle") r = b(e),
        n.push(r.log),
        n.push(r.lat);
        else if (t === "Polygon") {
            o = e.length;
            for (s = 0; s < o; s++) r = b(e[s]),
            r ? n.push([r.log, r.lat]) : null
        }
        return n
    },
    S
}),
define("MapRender", ["Render", "Hobject", "Symbol"],
function (e, t, n) {
    var r = e.Polygon,
    i = e.Heat,
    s = e.Line,
    o = e.Circle,
    u = e.Star,
    a = t.BaseFunc.each,
    f = n.defaultLineSymbol,
    l = n.defaultPolygonSymbol,
    c = n.defaultPointSymbol,
    h = null,
    p = function (e) {
        var t = e || {};
        this.mapInfo = t.mapInfo,
        h = h || this.mapInfo.screenPosition
    };
    return p.prototype.renderGeometry = function (e, t, n, r) {
        var i = e.layer,
        s = e.level,
        o = t.length,
        u = [],
        a = 0,
        f = function (e, t) {
            e.once("mouseenter",
            function (e) {
                !r.args || !!t.mouseenter & !r.args.mapInfo.dragging & !t.isEnter && (t._evt = e, t.mouseenter(e, t), t.isEnter = !0)
            }),
            e.once("mouseleave",
            function (e) {
                !r.args || (t.isEnter ? (t._evt = e, t.isEnter = !1, t.mouseleave ? t.mouseleave(e, t) : null) : (t._evt = e, !!t.mouseleave & !r.args.mapInfo.dragging ? t.mouseleave(e, t) : null))
            }),
            e.once("click",
            function (e) {
                t._evt = e,
                t.click ? t.click(e, t) : null
            });
            switch (t.getType()) {
                case "Feature":
                    c.geoElements[s] || (c.geoElements[s] = []),
                    c.geoElements[s].push(e);
                    break;
                case "GeoElement":
                    c.geoElements[s] = e;
                    break;
                default:
            }
            u.push(e)
        };
        for (; a < o; a++) {
            var l = t[a],
            c = l.geometry || l,
            h = c.getType(),
            p = l.getType(),
            d = {
                layer: i,
                points: c.drawCoordinates,
                callback: f,
                feature: l,
                context: r,
                left: p === "Feature" ? i.attrs.y + this.mapInfo.domXY.x : null,
                top: p === "Feature" ? i.attrs.x + this.mapInfo.domXY.y : null
            };
            switch (h) {
                case "GeoPolygon":
                    this.renderPolygon(d);
                    break;
                case "GeoPoint":
                    this.renderPoint(d);
                    break;
                case "GeoLineString":
                    this.renderPolyline(d);
                    break;
                case "GeoMultiPolygon":
                    this.renderPolygon(d);
                    break;
                default:
            }
            p === "Feature" && (!l.canvasLayers || (l.canvasLayers[s] || (l.canvasLayers[s] = {}), l.canvasLayers[s][i.attrs.id] = i))
        }
        i.draw(),
        n ? n(t, e, r, u) : null
    },
    p.prototype.renderPoint = function (e) {
        var t = e.points,
        n = e.layer,
        r = e.callback,
        i = e.feature,
        s = e.context,
        u = e.left,
        a = e.top,
        f = (i.applySymbol || c).toConfig(),
        l = t.length,
        p,
        d;
        for (p = 0; p < l; p++) {
            var v = t[p][0],
            m = t[p][1],
            g = h({
                log: v,
                lat: m
            }),
            y = [g.x - u, g.y - a];
            f.x = y[0],
            f.y = y[1];
            var b = new o(f);
            n.add(b),
            r ? r(b, i) : null
        }
    },
    p.prototype.renderPolygon = function (e) {
        var t = e.points,
        n = e.layer,
        i = e.callback,
        s = e.feature,
        o = e.context,
        u = e.left,
        a = e.top,
        f = (s.applySymbol || l).toConfig(),
        c = t.length,
        p,
        d;
        for (p = 0; p < c; p++) {
            var v = [],
            m = t[p].length;
            for (d = 0; d < m; d++) {
                var g = t[p][d][0],
                y = t[p][d][1],
                b = h({
                    log: g,
                    lat: y
                }),
                w = [b.x - u, b.y - a];
                v.push(w)
            }
            f.points = v;
            var E = new r(f);
            n.add(E),
            i ? i(E, s) : null
        }
    },
    p.prototype.renderPolyline = function (e) {
        var t = e.points,
        n = e.layer,
        r = e.callback,
        i = e.feature,
        o = e.context,
        u = e.left,
        a = e.top,
        l = [],
        c,
        p = (i.applySymbol || f).toConfig(),
        d = t.length,
        v,
        m;
        for (v = 0; v < d; v++) {
            c = t[v].length;
            for (var m = 0; m < c; m++) {
                var g = t[v][m][0],
                y = t[v][m][1],
                b = h({
                    log: g,
                    lat: y
                });
                l.push([b.x - u, b.y - a])
            }
            p.points = l;
            var w = new s(p);
            n.add(w),
            r ? r(w, i) : null
        }
    },
    p.prototype.renderMarkers = function (e, t) {
        var n = e.layer,
        r = e.level,
        i, s = t.length,
        o;
        for (i = 0; i < s; i++) {
            o = t[i];
            var u = o.markerStyle;
            switch (u) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    this._renderStar(n, o.position, null, o, this);
                    break;
                default:
            }
        }
        n.draw()
    },
    p.prototype._renderStar = function (e, t, n, r, i) {
        var s = e.attrs.x || 0,
        o = e.attrs.y || 0,
        a = c.toConfig(),
        f = h({
            log: t[0],
            lat: t[1]
        });
        a.x = f.x,
        a.y = f.y,
        a.numPoints = 5,
        a.innerRadius = 5,
        a.outerRadius = 11,
        a.fill = "red",
        a.stroke = "black",
        a.strokeWidth = 1;
        var l = new u(a);
        e.add(l),
        n ? n(l, feature) : null
    },
    p
}),
define("SecDrawLayer", ["SecBaseLayer", "Render", "SecDrawInteractive", "Hobject", "GeoElement", "MapRender", "Symbol"],
function (e, t, n, r, i, s, o) {
    var u = t.Stage,
    a = t.Layer,
    n = n,
    f = r.BaseFunc.extend,
    l = r.BaseFunc.bind,
    c, h, p = function (t) {
        e.call(this, t),
        this._geoElements = [],
        this._plotElements = [],
        this._cache = {},
        this._markers = [],
        this._mapRender = null,
        this._stage = null,
        this._layer = null,
        this._secDrawInteractive = null,
        this.layer = {
            layer: null,
            level: null
        }
    };
    return f(p, e),
    p.prototype.notice = function (e) {
        if (e.sourceID === "mousemove") !isNaN(e.x) || !isNaN(e.y);
        else if (e.sourceID === "mouseup") {
            if (!isNaN(e.x) || !isNaN(e.y)) {
                var t = -1 * e.x,
                n = -1 * e.y,
                r = this._layer.children;
                this._layer.setCanvasXY(n, t),
                r.move({
                    x: e.x - this.layerInfo.bfoffx,
                    y: e.y - this.layerInfo.bfoffy
                }),
                this._layer.draw()
            }
        } else e.sourceID === "mousewheel" && (this.layer.level = this.args.mapInfo.tileLevel, this.update())
    },
    p.prototype._drawGeoElement = function (e) {
        var e = e || this._geoElements,
        t = e.length,
        n, r, i = [],
        s,
        o;
        for (r = 0; r < t; r++) n = e[r],
        s = n.geometry.getType(),
        s === "GeoPoint" ? n.geometry.drawCoordinates = [[n.geometry.coordinates[0], n.geometry.coordinates[1]]] : s === "GeoPolygon" ? n.geometry.drawCoordinates = n.geometry.coordinates : s === "GeoLineString" && (n.geometry.drawCoordinates = [n.geometry.coordinates]),
        i.push(n);
        this._mapRender.renderGeometry(this.layer, i, null, this)
    },
    p.prototype._drawPlotElement = function (e) {
        var e = e || this._plotElements,
        t = e.length,
        n, r, i, s;
        for (r = 0; r < t; r++) {
            var o = [];
            n = e[r];
            var u = 0,
            a = n.shapes.length,
            i;
            for (; u < a; u++) {
                var f = n.shapes[u];
                i = f.getType(),
                i === "GeoPoint" ? f.drawCoordinates = [[f.coordinates[0], f.coordinates[1]]] : i === "GeoPolygon" ? f.drawCoordinates = f.coordinates : i === "GeoLineString" && (f.drawCoordinates = [f.coordinates]),
                o.push(f)
            }
            this._mapRender.renderGeometry(this.layer, o,
            function (e, t, r, i) {
                n.drawElement = i,
                r._secDrawInteractive.addAction(n)
            },
            this)
        }
    },
    p.prototype._publish = function () {
        this.complete()
    },
    p.prototype._iniEvent = function () {
        this._secDrawInteractive = new n({
            domLayer: this.domLayer,
            mapID: this.args.mapID,
            layerInfo: this.layerInfo,
            stage: this._stage,
            layer: this._layer,
            stroeData: l(this, this.stroeData),
            screenPosition: c,
            mapPosition: h
        })
    },
    p.prototype._createlayer = function () {
        var e = document.createElement("div");
        e.style.width = this.mapWidth + "px",
        e.style.height = this.mapHeight + "px",
        e.style.position = "absolute",
        this._stage = new u({
            id: this.args.layerID,
            container: e,
            width: this.args.width,
            height: this.args.height
        }),
        this._layer = new a({
            width: this.mapWidth,
            height: this.mapHeight
        }),
        this._stage.add(this._layer),
        this.layer.layer = this._layer,
        h = h || this.args.mapInfo.mapPosition2,
        c = c || this.args.mapInfo.screenPosition,
        this._mapRender = new s({
            stage: this._stage,
            mapInfo: this.args.mapInfo
        }),
        this.domLayer = this._stage.content
    },
    p.prototype._drawMarker = function (e) {
        var t = e ? [e] : this._markers;
        this._mapRender.renderMarkers(this.layer, t)
    },
    p.prototype.getType = function () {
        return "SecDrawLayer"
    },
    p.prototype.moveTop = function () {
        var e = this.domLayer.parentNode;
        if (!e) return;
        var t = document.createElement("div");
        e.appendChild(t),
        e.replaceChild(this.domLayer, t)
    },
    p.prototype.moveBottom = function () {
        this._layer.moveToBottom()
    },
    p.prototype.addMarker = function (e) {
        this._markers.push(e),
        this._drawMarker(e)
    },
    p.prototype.update = function () {
        this.clear(),
        this._drawGeoElement(),
        this._drawPlotElement(),
        this._drawMarker()
    },
    p.prototype.clear = function () {
        var e = this._layer.children,
        t = e.shift();
        while (t) t.destroy(),
        t = e.shift()
    },
    p.prototype.stroeData = function (e, t) {
        this._cache[t.id] || (this._cache[t.id] = t, e === "PlotElement" ? this._plotElements.push(this._cache[t.id]) : e === "GeoElement" && this._geoElements.push(this._cache[t.id]))
    },
    p
}),
define("SecDrawTool", ["SecBaseTool", "SecDrawInteractive", "SecDrawLayer", "Hobject", "DrawProtocol"],
function (e, t, n, r, i) {
    var s = r.BaseFunc.extend,
    o = e.Command,
    u = e.CommandItem,
    a = i.DRAWTYPE,
    f = function (t) {
        this._drawlayer = null,
        e.self.call(this, t)
    };
    return s(f, e.self),
    f.prototype.getType = function () {
        return "SecDrawTool"
    },
    f.prototype._inilization = function () {
        this._drawlayer = new n,
        this.args.addLayer(this._drawlayer),
        this._secDrawInteractive = this._drawlayer._secDrawInteractive
    },
    f.prototype._setLayerAtTop = function () {
        this._drawlayer.moveTop()
    },
    f.prototype._setLayerAtBottom = function () {
        this._drawlayer.moveToBottom()
    },
    f.prototype._createTool = function () {
        this._createMenu(),
        this._inilization();
        var e = this,
        t = new o(function () {
            e._secDrawInteractive.changeDraw(a.Polygon),
            e._setLayerAtTop()
        }),
        n = new o(function () {
            e._secDrawInteractive.changeDraw(a.Line),
            e._setLayerAtTop()
        }),
        r = new u("测面积", t, "fa-crop"),
        i = new u("测距离", n, "fa-steam");
        this.cmds.push(r),
        this.cmds.push(i)
    },
    f
}),
define("SecScaleTool", ["SecBaseTool", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    e = e.self,
    r = t.BaseFunc.DPI(),
    i = 2.54,
    s = 2,
    o = ["-1", "295829355.45", "147914677.73", "73957338.86", "36978669.43", "18489334.72", "9244667.36", "4622333.68", "2311166.84", "1155583.42", "577791.71", "288895.85", "144447.93", "72223.96", "36111.98", "18055.99", "9028.00", "4514.00", "2257.00"],
    u,
    a,
    f,
    l = function (t) {
        var n = t || {};
        this.pixLen = s * r / i,
        this.scaleDiv = null,
        e.call(this, t)
    };
    return n(l, e),
    l.prototype._createTool = function () {
        var e = this.args;
        u = u || e.mapElement,
        this.mapInfo = e,
        this.scaleDiv = document.createElement("div"),
        this.scaleDiv.className = "Jake-ui-scaleBar",
        f = this.scaleDiv.style,
        f.width = this.pixLen + "px",
        f.height = "5px",
        this.update({
            level: this.mapInfo.tileLevel,
            sourceID: "mousewheel"
        }),
        u.appendChild(this.scaleDiv)
    },
    l.prototype.update = function (e) {
        var t = (e || {}).sourceID;
        if (t !== "mousewheel") return;
        var n = e.level,
        r = Math.floor(o[n]).toString(),
        i = r.length,
        u = 1,
        a = "米";
        i <= 5 ? (a = "  米", u = 100 / s) : i > 5 & i <= 7 ? (a = "  千米", u = 1e5 / s) : i > 7 & u <= 9 && (a = "  万米", u = 1e6 / s),
        this.scaleDiv.textContent = (r * 1 / u).toFixed(2) + a
    },
    l.prototype.remove = function () { },
    l.prototype.getType = function () {
        return "SecScaleTool"
    },
    l
}),
define("SecZoomTool", ["SecBaseTool", "Hobject", "EventListener"],
function (e, t, n) {
    var r = t.BaseFunc.extend,
    e = e.self,
    i = n.AddListener,
    s = null,
    o = null,
    u = null,
    a = function (t) {
        this._pack = null,
        u = document.createEvent("HTMLEvents"),
        u.initEvent("mousewheel", !1, !1),
        e.call(this, t)
    };
    return r(a, e),
    a.prototype._package = function () {
        var e = document.createElement("a"),
        t = document.createElement("a"),
        n = [e, t];
        for (var r = 0,
        s = n.length; r < s; r++) {
            n[r].className = "button";
            var a = n[r].style;
            a.height = "39px",
            a.marginTop = "2px",
            a.boxShadow = "3px 3px 5px #888888",
            a.borderRadius = "5px",
            a.backgroundColor = "white"
        }
        return i(e, "click",
        function (e) {
            u.wheelDelta = -120,
            o.interactive.mousewheel(u)
        }),
        i(t, "click",
        function (e) {
            u.wheelDelta = 120,
            o.interactive.mousewheel(u)
        }),
        {
            zoomIn: t,
            zoomOut: e
        }
    },
    a.prototype._createTool = function () {
        var e = this.args;
        s = s || e.mapElement,
        u.offsetX = Math.floor(s.clientWidth / 2),
        u.offsetY = Math.floor(s.clientHeight / 2),
        o = o || e.mapInteractive;
        var t = s.clientHeight;
        this._pack = this._pack || this._package();
        var n = document.createElement("i"),
        r = document.createElement("i");
        n.className = "fa fa-plus fa-3x",
        r.className = "fa fa-minus fa-3x",
        this._pack.zoomIn.appendChild(n),
        this._pack.zoomOut.appendChild(r);
        var i = document.createElement("div");
        i.className = "list-group",
        i.style.cssText = "position: relative;bottom:" + (t - 20) + "px; width:45px; height:90px;left:30px;",
        i.appendChild(this._pack.zoomIn),
        i.appendChild(this._pack.zoomOut),
        s.appendChild(i)
    },
    a
}),
define("Jsonp", ["require", "exports", "module"],
function (e, t) {
    var n = function () { };
    n.prototype = {
        now: function () {
            return (new Date).getTime()
        },
        rand: function () {
            return Math.random().toString().substr(2)
        },
        removeElem: function (e) {
            var t = e.parentNode;
            t && t.nodeType !== 11 && t.removeChild(e)
        },
        parseData: function (e) {
            var t = "";
            if (typeof e == "string") t = e;
            else if (typeof e == "object") for (var n in e) t += "&" + n + "=" + encodeURIComponent(e[n]);
            return t += "&_time=" + this.now(),
            t = t.substr(1),
            t
        },
        getJson: function (e, t, n) {
            var r, i = this;
            e = e + (e.indexOf("?") === -1 ? "?" : "&") + this.parseData(t);
            var s = /callback=(\w+)/.exec(e);
            s && s[1] ? r = s[1] : (r = "jsonp_" + this.now() + "_" + this.rand(), e += s ? "" : "&callback=?", e = e.replace("callback=?", "callback=" + r), e = e.replace("callback=%3F", "callback=" + r));
            var o = document.createElement("script");
            o.type = "text/javascript",
            o.src = e,
            o.id = "id_" + r,
            window[r] = function (e) {
                window[r] = undefined;
                var t = document.getElementById("id_" + r);
                i.removeElem(t),
                n(e)
            };
            var u = document.getElementsByTagName("head");
            u && u[0] && u[0].appendChild(o)
        }
    };
    var r = new n;
    return r
}),
define("BaseJson", ["Jsonp"],
function (e) {
    var t = function (e) {
        var t = e || {};
        this.url = t.url || null,
        this.info = t.info,
        this.jsonData = t.jsondata || null,
        this.complete = t.complete,
        this.jsonData ? this.jsonComplete(this.jsonData, this.getType()) : !this.url || this.loadJson(this.url)
    };
    return t.prototype.loadJson = function (t) {
        var n = this;
        e.getJson(t, null,
        function (e) {
            n.jsonComplete(e, n.getType())
        })
    },
    t.prototype.jsonComplete = function (e, t) {
        this.complete(e, t)
    },
    t.prototype.getType = function () {
        return "BaseJson"
    },
    t
}),
define("EsriJson", ["BaseJson", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        e.call(this, t)
    };
    return n(r, e),
    r.prototype.jsonComplete = function (e, t) {
        var n = e.features || [];
        this.complete(n, t)
    },
    r.prototype.getType = function () {
        return "EsriJson"
    },
    r
}),
define("GeoJson", ["BaseJson", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        this.GeoType = {
            Point: "Point",
            LineString: "LineString",
            Polygon: "Polygon",
            MultiPoint: "MultiPoint",
            MultiLineString: "MultiLineString",
            MultiPolygon: "MultiPolygon"
        },
        this.complete = t.complete ||
        function () { },
        this.JsonInfo = {},
        this.Features = null,
        e.call(this, t)
    };
    return n(r, e),
    r.prototype.jsonComplete = function (e, t) {
        var n = e.data || e;
        this.Features = n.features,
        this.JsonInfo = n.info || "N/A",
        this.complete(this.Features, t)
    },
    r.prototype.getType = function () {
        return "GeoJson"
    },
    r
}),
define("GeoMultiPolygon", ["Hobject", "GeoGeometry", "Bound", "GeoPolygon"],
function (e, t, n, r) {
    var i = e.BaseFunc.extend,
    s = function (e) {
        this.polygons = [],
        t.call(this, e)
    };
    return i(s, t),
    s.prototype._iniCenter = function () { },
    s.prototype._iniBound = function () {
        var e, t = this.coordinates.length,
        n, i;
        for (e = 0; e < t; e++) coord = this.coordinates[e],
        n = r.fromCoordinates(coord),
        i = i ? i.concat(n.bound) : n.bound,
        this.polygons.push(n);
        return i
    },
    s.prototype.geoArea = function () {
        var e, t = this.polygons.length,
        n, r = 0;
        for (e = 0; e < t; e++) n = this.polygons[e],
        r += n.geoArea();
        return r * this.projection.getResolution().value * this.projection.getResolution().value + this.projection.getResolution().unit
    },
    s.fromGeoGeometry = function (e) {
        return new s({
            coordinates: e.coordinates
        })
    },
    s.fromEsriGeometry = function (e) {
        return new s({
            coordinates: [e]
        })
    },
    s.prototype.getType = function () {
        return "GeoMultiPolygon"
    },
    s
}),
define("Feature", ["GeoPolygon", "GeoLineString", "GeoPoint", "Hobject", "Symbol", "GeoMultiPolygon"],
function (e, t, n, r, i, s) {
    var o = e,
    u = t,
    a = s,
    f = n,
    l = Math.min,
    c = Math.max,
    h = Math.floor,
    p = r.BaseFunc.getOffsetXY,
    d = r.BaseFunc.getId,
    v = r.BaseFunc.each,
    m = function (e) {
        var t = e || {};
        this.id = d(),
        this.geometry = t.geometry,
        this.properties = t.properties,
        this.fileds = null,
        this.click = null,
        this.mouseenter = null,
        this.mouseleave = null,
        this.openTipCallback = null,
        this.closeTipCallback = null,
        this.flashCallback = null,
        this.isEnter = !1,
        this.canvasLayers = {},
        this.pop = this._iniPopOver(),
        this._evt = null,
        this.anim = null,
        this.applySymbol = null
    };
    return m.fromGeoFeature = function (e) {
        var t, n;
        return e.geometry.type === "Polygon" ? t = o.fromGeoGeometry(e.geometry) : e.geometry.type === "MultiPolygon" ? t = a.fromGeoGeometry(e.geometry) : e.geometry.type === "Point" ? t = f.fromGeoGeometry(e.geometry) : e.geometry.type === "LineString" ? t = u.fromGeoGeometry(e.geometry) : e.geometry.type === "MultiLineString" && (t = u.fromGeoGeometry(e.geometry)),
        n = e.properties,
        new m({
            geometry: t,
            properties: n
        })
    },
    m.fromeEsriFeature = function (e) {
        var t, n;
        return e.geometry.rings ? t = a.fromEsriGeometry(e.geometry.rings) : !e.geometry.x || !e.geometry.y ? !e.geometry.paths || (t = u.fromEsriGeometry(e.geometry.paths)) : t = f.fromEsriGeometry(e.geometry),
        n = e.attributes,
        new m({
            geometry: t,
            properties: n
        })
    },
    m.prototype.update = function () {
        var e = this.getCanvasLayers();
        e ? v(e,
        function (e, t) {
            e.draw()
        }) : null
    },
    m.prototype._iniPopOver = function () {
        var e = document.createElement("div");
        e.className = "popover fade top in",
        e.style.display = "block";
        var t = document.createElement("div");
        t.className = "arrow";
        var n = document.createElement("h3");
        n.className = "popover-title";
        var r = document.createElement("div");
        return r.className = "popover-content",
        e.appendChild(t),
        e.appendChild(n),
        e.appendChild(r),
        {
            title: n,
            content: r,
            popDom: e
        }
    },
    m.prototype.flash = function () {
        var e = this.getGeoType(),
        t = 123,
        n = 75,
        r = 75,
        i = this,
        s,
        o,
        u;
        if (e === "GeoLineString") u = function (e) {
            for (s = 0; s < o; s++) i.geometry.geoElements[s].setX(30 * Math.sin(e.time * 2 * Math.PI / 500))
        };
        else if (e === "GeoPoint") u = function (e) {
            u = function (e) {
                for (s = 0; s < o; s++) i.geometry.geoElements[s].setFill("#" + (30 * Math.sin(e.time * 2 * Math.PI / 500)).toString(16))
            }
        };
        else if (e === "GeoPolygon" || e === "GeoMultiPolygon") u = function (e) {
            var u = 50 * Math.sin(e.time * Math.PI / 250),
            a = l(c(0, h(t + u)), 255);
            _sg = l(c(0, h(n + u)), 255),
            _sb = l(c(0, h(r + u)), 255);
            var f = "#" + a.toString(16) + _sg.toString(16) + _sb.toString(16),
            p = i.getGeometrys();
            if (!!p) {
                o = p.length;
                for (s = 0; s < o; s++) p[s].setFill(f),
                p[s].setStroke(f)
            }
        };
        u.id = this.id,
        this.flashCallback(u, this.getCanvasLayers())
    },
    m.prototype.getGeometrys = function (e) {
        return this.geometry.geoElements[e || this.getLevel()]
    },
    m.prototype.getCanvasLayers = function (e) {
        return this.canvasLayers[e || this.getLevel()]
    },
    m.prototype.getFields = function () {
        return this.fileds ? this.fileds : (this.fileds = [], v(this.properties,
        function (e, t) {
            this.fileds.push(t)
        }), this.fileds)
    },
    m.prototype.setPopConfig = function (e) {
        var t = e || {},
        n = t.title || "",
        r = t.context || "";
        this.pop.title.textContent = n,
        this.pop.content.innerHTML = r
    },
    m.prototype.openTip = function (e) {
        var t;
        if (e) t = e;
        else {
            if (!this._evt) return;
            t = p(this._evt)
        }
        this.openTipCallback(this.pop.popDom, t, this)
    },
    m.prototype.closeTip = function () {
        this.closeTipCallback(this.pop.popDom)
    },
    m.prototype._setTipPosition = function (e, t) {
        this.pop.popDom.style.top = String(e) + "px",
        this.pop.popDom.style.left = String(t) + "px"
    },
    m.prototype.setSymbol = function (e) {
        this.applySymbol = e
    },
    m.prototype.resetSymbol = function () {
        this.applySymbol = null
    },
    m.prototype.getType = function () {
        return "Feature"
    },
    m.prototype.getGeoType = function () {
        return this.geometry.getType()
    },
    m.prototype.geoArea = function () {
        return this.geometry.geoArea()
    },
    m
}),
define("SecFeatureLayer", ["SecBaseLayer", "EsriJson", "GeoJson", "EventListener", "Feature", "Render", "MapRender", "Hobject", "Hmath", "TileRender"],
function (e, t, n, r, i, s, o, u, a, f) {
    var l = s.Stage,
    c = s.Polygon,
    h = s.Circle,
    p = s.Layer,
    d = s.Animation,
    v = new a.h2dmath,
    m = f,
    g = u.BaseFunc.each,
    y = u.BaseFunc.extend,
    b = function (t) {
        e.call(this, t),
        this.mTaskQueue = new a.taskQueue({
            interval: 25,
            delay: 500
        }),
        this.popHide = t.popHide || !0,
        this.popDomElements = [],
        this.loadcomplete = !1,
        this._mapRender = null,
        this.features = [],
        this.eventQueue = {},
        this.anim = null,
        this._screenlayers = {},
        this._cacheLayers = {},
        this._funcs = [],
        this._clys = {},
        this._features = [],
        this._bound = null,
        this._tipFeautre = {
            feature: null,
            loglat: null
        }
    };
    return y(b, e),
    b.prototype._jsonMap = function (e, r) {
        var i, s, o, u; !e.mapData || (!!e.mapData && e.mapData.constructor !== Object && (e.mapData = JSON.parse(e.mapData)), o = e.mapData, u = this.args.jsonType || "geojson"),
        !e.url || (i = e.url, u = this.args.jsonType || "geojson"),
        u === "esrijson" ? jsonMap = new t({
            jsondata: o,
            url: i,
            complete: r
        }) : u === "geojson" && (jsonMap = new n({
            jsondata: o,
            url: i,
            complete: r
        }))
    },
    b.prototype._publish = function () {
        this.complete(),
        this.loadcomplete = !0;
        var e = this,
        t = function (t, n) {
            if (n === "GeoJson") {
                var r = 0,
                s = t.length;
                while (r < s) {
                    var o = i.fromGeoFeature(t[r]);
                    o.geometry ? e.features.push(o) : null,
                    r++
                }
            } else if (n === "EsriJson") {
                var r = 0,
                s = t.length;
                while (r < s) {
                    var o = i.fromeEsriFeature(t[r]);
                    o ? e.features.push(o) : null,
                    r++
                }
            }
            g(e.features,
            function (t, n) {
                t.openTipCallback = function (t, n, r) {
                    e._openTip(t, n, r, e.layerInfo)
                },
                t.closeTipCallback = function (t) {
                    e._closeTip(t)
                },
                t.flashCallback = function (n, r) {
                    e._flash(n, t)
                },
                t.getLevel = function () {
                    return e.args.mapInfo.tileLevel
                }
            }),
            !e.eventQueue || (g(e.eventQueue,
            function (t, n) {
                e[n](t[0])
            }), e.eventQueue = {}),
            e.draw()
        },
        n = {
            mapData: this.args.mapData,
            url: this.args.mapUrl
        };
        this._jsonMap(n, t)
    },
    b.prototype._createlayer = function () {
        this.processCircle = this.args.mapInfo.processCircle;
        var e = document.createElement("div");
        e.style.width = this.mapWidth + "px",
        e.style.height = this.mapHeight + "px",
        e.style.position = "absolute",
        this._stage = new l({
            id: this.args.layerID,
            container: e,
            width: this.args.width,
            height: this.args.height,
            bufferSize: 256
        });
        var t = this.args.grid.elements,
        n, r;
        this.addElements(t),
        this._mapRender = new o({
            stage: this._stage,
            mapInfo: this.args.mapInfo
        }),
        this.domLayer = this._stage.content
    },
    b.prototype.notice = function (e) {
        var t = e.sourceID;
        if (t === "mousemove") (!isNaN(e.x) || !isNaN(e.y)) && Math.abs(this.layerInfo.offx - this.layerInfo.bfoffx) > 2 | Math.abs(this.layerInfo.offy - this.layerInfo.bfoffy) > 2 && (this.anim ? this.anim.stop() : null);
        else if (t === "beforeMousewheel") this.anim ? this.anim.stop() : null;
        else if (t === "mouseup") {
            if (!isNaN(e.x) || !isNaN(e.y)) {
                var n = this.args.grid.addElements,
                r = this.args.grid.removeElements,
                i = this.addElements(n);
                this.removeElements(r);
                var s = [];
                for (var o = 0; o < i.length; o++) s.push([this.features, i[o]]);
                this._startTaskQueue(s, this._drawGeometry, this,
                function () {
                    var e = this._getRefreshLayers(); !this.anim || (this.anim.setLayers(e), this.anim.start())
                })
            }
        } else t === "mousewheel" && (isNaN(e.zoom) || (this._stopTaskQueue(), this._clear(), this.addElements(this.args.grid.elements), this.draw(), this._tipFeautre.feature ? this._tipFeautre.feature.openTip(this._tipFeautre.loglat) : null))
    },
    b.prototype._startTaskQueue = function (e, t, n, r) {
        this.mTaskQueue.chunk(e, t, n,
        function (e) {
            r ? r.call(n, e) : null;
            var t, i = e.length,
            s;
            for (t = 0; t < i; t++) s = e[t],
            n._stage.add(s),
            s.draw()
        })
    },
    b.prototype._stopTaskQueue = function () {
        this.mTaskQueue.stop()
    },
    b.prototype._clear = function () {
        var e = this,
        t, n = this.features.length,
        r, i;
        for (t = 0; t < n; t++) {
            i = this.features[t].geometry.geoElements.length;
            for (r = 0; r < i; r++) delete this.features[t].geometry.geoElements[r];
            this.features[t].geometry.geoElements.length = 0
        }
        g(this._screenlayers,
        function (t, n) {
            t.layer.remove(),
            delete e._screenlayers[n]
        })
    },
    b.prototype.addElements = function (e) {
        var t, n, r = [],
        i,
        s;
        for (var o in e) t = e[o],
        this._cacheLayers[o] ? (this._cacheLayers[o].layer.setCanvasXY(t.x, t.y), this._screenlayers[o] = this._cacheLayers[o], this._stage.add(this._screenlayers[o].layer)) : (this._screenlayers[o] = {
            layer: new p({
                id: o,
                x: t.x,
                y: t.y,
                width: 256,
                height: 256
            }),
            cache: {},
            level: t.level,
            element: t,
            geometrys: null
        },
        this._cacheLayers[o] = this._screenlayers[o]),
        r.push(this._screenlayers[o]);
        return r
    },
    b.prototype.removeElements = function (e) {
        var t, n = e.length,
        r;
        for (t = 0; t < n; t++) r = document.getElementById(e[t]),
        !!r && this.domLayer.contains(r) ? this.domLayer.removeChild(r) : null,
        !this._screenlayers[e[t]] || delete this._screenlayers[e[t]]
    },
    b.prototype.draw = function (e, t) {
        var n, r, i = [],
        e = e || this._screenlayers;
        for (var s in e) r = e[s],
        i.push([this.features, r]);
        this._startTaskQueue(i, this._drawGeometry, this,
        function (e) {
            t ? t.call(this, e) : null
        })
    },
    b.prototype._drawGeometry = function (e, t) {
        if (arguments.length === 1) {
            if (!e) return;
            t = e[1],
            e = e[0]
        }
        var n = t.element,
        r = t.cache,
        i, s = e.length,
        o = [];
        if (!!r.hasCached) return;
        for (var u = 0; u < s; u++) {
            i = e[u];
            if (n.bound.intersection(i.geometry.bound)) {
                var a, f = [],
                l = n.bound,
                c = l.toPolygon();
                len2 = i.geometry.coordinates.length,
                geoType = i.geometry.getType(),
                i.geometry.drawCoordinates.length = 0;
                if (geoType === "GeoPolygon") for (var a = 0; a < len2; a++) f[a] = v.clipPolygon(i.geometry.coordinates[a], c);
                else if (geoType === "GeoMultiPolygon") {
                    var h = i.geometry.polygons,
                    p, d = h.length,
                    m, a, g;
                    for (a = 0; a < d; a++) {
                        p = h[a],
                        m = p.coordinates.length;
                        for (g = 0; g < m; g++) f.push(v.clipPolygon(p.coordinates[g], c))
                    }
                } else if (geoType === "GeoPoint") for (var a = 0; a < len2; a++) f[a] = i.geometry.coordinates[a];
                else geoType === "GeoLineString" && (f[0] = v.clipPolyline(i.geometry.coordinates, l));
                i.geometry.drawCoordinates = f,
                o.push(i)
            }
        }
        if (o.length > 0) return this._mapRender.renderGeometry(t, o, this._drawComplete, this),
        t.layer
    },
    b.prototype._drawComplete = function (e, t, n) {
        t.cache.hasCached = !0
    },
    b.prototype.connect = function (e, t) {
        this["_" + e] ? this["_" + e](t) : null
    },
    b.prototype._mouseenter = function (e) {
        if (this.features.length === 0) {
            this.eventQueue._mouseenter = arguments;
            return
        }
        g(this.features,
        function (t) {
            t.mouseenter = e
        },
        this)
    },
    b.prototype._mouseleave = function (e) {
        if (this.features.length === 0) {
            this.eventQueue._mouseleave = arguments;
            return
        }
        g(this.features,
        function (t) {
            t.mouseleave = e
        },
        this)
    },
    b.prototype._click = function (e) {
        if (this.features.length === 0) {
            this.eventQueue._click = arguments;
            return
        }
        g(this.features,
        function (t) {
            t.click = e
        },
        this)
    },
    b.prototype._flash = function (e, t) {
        this._cacheCanvasLayers(t),
        this._funcs.push(e),
        this._funcs = v.deleteRepeatNByAttr(this._funcs, "id");
        var n = this;
        this.anim = this.anim || new s.Animation(function (e) {
            var t, r = n._funcs.length;
            for (t = 0; t < r; t++) n._funcs[t](e)
        }),
        this._cacheCanvasLayers(t);
        var r = this._getRefreshLayers();
        this.anim.setLayers(r),
        this.anim.start()
    },
    b.prototype._cacheCanvasLayers = function (e) {
        var t = e.getLevel();
        this._features.push(e),
        this._features = v.deleteRepeatNByAttr(this._features, "id");
        var n = [],
        r = this,
        i = e.getCanvasLayers();
        for (var s in i) n.push(i[s]);
        this._clys[t] = (this._clys[t] || []).concat(n),
        this._clys[t] = v.deleteRepeatNByAttr(this._clys[t], "_id"),
        this._getRefreshLayers()
    },
    b.prototype._getRefreshLayers = function (e) {
        var t = e || this.args.mapInfo.tileLevel,
        n = this._clys[t];
        if (!n) return [];
        var r = [],
        i,
        s = n.length,
        o = {};
        g(this._screenlayers,
        function (e, t) {
            o[e.layer._id] = !0
        });
        for (i = 0; i < s; i++) o[n[i]._id] && r.push(n[i]);
        return r
    },
    b.prototype._openTip = function (e, t, n, r) {
        if (this.popHide) {
            for (var i = 0; i < this.popDomElements.length; i++) this.domLayer.removeChild(this.popDomElements[i]);
            this.popDomElements = []
        }
        this.domLayer.appendChild(e);
        var s = e.clientWidth,
        o = e.clientHeight,
        u, a;
        if (t.top) u = t.top - o - r.offy,
        a = t.left - s / 2 - r.offx,
        this._tipFeautre.loglat = this.args.mapInfo.mapPosition2([t.left, t.top]);
        else if (t.log) {
            var f = this.args.mapInfo.screenPosition(t);
            u = f.y - o,
            a = f.x - s / 2,
            this._tipFeautre.loglat = t
        }
        n._setTipPosition(u, a),
        this.popDomElements.push(e),
        this._tipFeautre.feature = n
    },
    b.prototype._closeTip = function (e) {
        this.domLayer.removeChild(e),
        this.popDomElements = []
    },
    b.prototype.update = function () {
        this._stage.draw()
    },
    b.prototype.getType = function () {
        return "SecFeatureLayer"
    },
    b.prototype.getFeatures = function () {
        return this.features
    },
    b.prototype.toPolygons = function () {
        var e, t = this.getFeatures(),
        n = t.length,
        r,
        i = [],
        s;
        for (e = 0; e < n; e++) {
            r = t[e];
            if (r.geometry.getType() === "GeoMultiPolygon") {
                var o, u = r.geometry.polygons.length;
                for (o = 0; o < u; o++) i = i.concat(this._toPolygon(r.geometry.polygons[o]))
            } else r.geometry.getType() === "GeoPolygon" && (i = i.concat(this._toPolygon(r.geometry)))
        }
        return i
    },
    b.prototype._toPolygon = function (e) {
        if (e.getType() !== "GeoPolygon") return null;
        var t, n = e.coordinates.length,
        r = [];
        for (t = 0; t < n; t++) {
            var i = e.coordinates[t],
            s = [],
            o = [],
            u = [];
            for (var a = 0; a < i.length; a++) s.push(i[a][0]),
            o.push(i[a][1]);
            u.push(s),
            u.push(o),
            r.push(u)
        }
        return r
    },
    b.prototype.getBound = function () {
        if (!this._bound) {
            var e, t, n, r = this.getFeatures(),
            i = r.length,
            n,
            s;
            for (e = 1; e < i; e++) n = r[e].geometry.bound.concat(n);
            return this._bound = n
        }
        return this._bound
    },
    b.prototype.getRect = function () {
        var e = this._bound || this.getBound(),
        t = {
            log: e.left,
            lat: e.top
        },
        n = {
            log: e.right,
            lat: e.bottom
        },
        r = this.args.mapInfo.screenPosition.call(this.args.mapInfo.tileContext, t),
        i = this.args.mapInfo.screenPosition.call(this.args.mapInfo.tileContext, n),
        s = i.x - r.x,
        o = i.y - r.y;
        return {
            width: s,
            height: o
        }
    },
    b
}),
define("SocketRequest", ["Messenger"],
function (e) {
    var t = function (t) {
        var n = "MozWebSocket" in window ? "MozWebSocket" : "WebSocket" in window ? "WebSocket" : null;
        if (n == null) {
            e.getInstance().post("浏览器不支持websockte");
            return
        }
        var r = t.url,
        i = t.callback,
        s = new window[n](r),
        o = "";
        s.onmessage = function (t) {
            var n = t.data;
            n.indexOf("!e") !== -1 && n.indexOf("!s") !== -1 ? o = n.slice(2, n.length - 2) : n.indexOf("!e") === -1 && n.indexOf("!s") !== -1 ? (o = n.slice(2, n.length), e.getInstance().post("数据传输中...")) : n.indexOf("!e") === -1 && n.indexOf("!s") === -1 ? o += n : n.indexOf("!e") !== -1 && n.indexOf("!s") === -1 && (o += n.slice(0, n.length - 2)),
            n.indexOf("!e") !== -1 && (e.getInstance().post("数据传输完成"), i({
                Geojson: o || "{}",
                response: "success"
            }))
        },
        s.onopen = function () {
            e.getInstance().post("连接成功"),
            i({
                response: "connected"
            })
        },
        s.onclose = function () {
            e.getInstance().post("连接关闭"),
            i({
                response: "disconnect"
            })
        },
        this.send = function (t) {
            if (!s) e.getInstance().post("连接关闭"),
            i({
                response: "disconnect"
            });
            else try {
                s.send(t)
            } catch (n) {
                e.getInstance().post("数据传输出现异常")
            }
        }
    },
    n = function (e) {
        var t = e.url,
        n = e.callback;
        this._connect = null,
        this.iniSocket(t, n)
    };
    return n.prototype.iniSocket = function (e, n) {
        var r = function (e) {
            n(e)
        };
        this._connect = new t({
            url: e,
            callback: r
        })
    },
    n.prototype.send = function (t) {
        e.getInstance().post("向服务端提交数据...");
        var n = 1010,
        r, i, s = Math.ceil(t.length / n);
        for (i = 0; i < s; i++) {
            var o = i * n;
            r = null,
            i === 0 && (r = "!s" + t.slice(o, o + n)),
            i === s - 1 && (r = r !== null ? r + "!e" : t.slice(o, o + n) + "!e"),
            r === null && (r = t.slice(o, o + n)),
            this._connect.send !== undefined && this._connect.send(r)
        }
    },
    n
}),
define("AnalysisServer", ["SocketRequest"],
function (e) {
    var t = function (t) {
        function c() {
            if (a) {
                var e = o.shift();
                if (e !== undefined) {
                    a = !1,
                    u = e;
                    var t = u.getTaskContent();
                    s.send(t)
                }
            }
        }
        var n = t || {},
        r = n.url,
        i = n.port,
        s = null,
        o = [],
        u = null,
        a = !0,
        f = this,
        l = function (e) {
            e.response === "success" ? (a = !0, u !== null && u.taskComplete(e.Geojson), u = null) : e.response !== "connected" && e.response === "disconnect" && delete f._socket
        };
        return s = new e({
            url: r,
            callback: l
        }),
        this.addTask = function (e) {
            o.push(e)
        },
        setInterval(c, 2e3),
        {
            addTask: this.addTask
        }
    };
    return t
}),
define("BaseTask", [],
function () {
    var e = function (e) {
        this.args = e || {},
        this.args.type = this.getType(),
        this.taskComplete = this.args.taskComplete ||
        function () { }
    };
    return e.prototype.getTaskContent = function () {
        return JSON.stringify(this.args)
    },
    e.prototype.getType = function () {
        return "BaseTask"
    },
    e
}),
define("RequestTask", ["BaseTask", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        e.call(this, t)
    };
    return n(r, e),
    r.prototype.getType = function () {
        return "RequestTask"
    },
    r
}),
define("WatershedTask", ["BaseTask", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        e.call(this, t)
    };
    return n(r, e),
    r.prototype.getType = function () {
        return "WatershedTask"
    },
    r
}),
define("KirgingTask", ["BaseTask", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = function (t) {
        e.call(this, t),
        this._ini(this.args)
    };
    return n(r, e),
    r.prototype._ini = function (e) {
        var t = e.features,
        n = e.polygons,
        r = e.attrName,
        i = e.bound,
        s = e.rect.width,
        o = e.rect.height;
        delete e.features;
        var u, a = t.length,
        f, l, c, h = [],
        p = [],
        d = [];
        for (u = 0; u < a; u++) f = t[u],
        l = f.geometry,
        l.getType() === "GeoPoint" && (c = l.coordinates[0], p.push(c[0]), h.push(c[1]), d.push(f.properties[r]));
        this.args = {
            log: p,
            lat: h,
            value: d,
            polygons: n,
            attrName: r,
            bound: i,
            width: s,
            height: o,
            type: this.getType()
        }
    },
    r.prototype.getType = function () {
        return "KirgingTask"
    },
    r
}),
define("epsg4326", ["epsg3857"],
function (e) {
    var t = [85.05112878],
    n = 111194.872221777,
    r = function (t) {
        this.toEpsg3857 = function () {
            return e.self.forwardMeractor
        },
        this.fromEpsg3857 = function () {
            return e.self.inverseMeractor
        },
        this.getMeterPerDegree = function () {
            return n
        },
        this.toPixelXY = function () { }
    };
    r.prototype.getType = function () {
        return "EPSG:4326"
    };
    var i = new r;
    return i
}),
define("SecLocationTool", ["Hobject", "SecBaseTool", "EventListener"],
function (e, t, n) {
    var r = e.BaseFunc.extend,
    i = e.BaseFunc.getOffsetXY,
    s = n.AddListener,
    t = t.self,
    o, u, a, f, l = function (e) {
        var n = e || {};
        t.call(this, e)
    };
    return r(l, t),
    l.prototype._createTool = function () {
        var e = this.args,
        t = this;
        o = o || e.mapElement,
        a = e.mapPosition2,
        this.mapInfo = e,
        this.scaleDiv = document.createElement("div"),
        this.scaleDiv.className = "Jake-ui-locationTool",
        f = this.scaleDiv.style,
        f.width = "85px",
        f.height = "5px",
        this.scaleDiv.textContent = "0,0",
        o.appendChild(this.scaleDiv),
        s(o, "mousemove",
        function (e) {
            var n = e.target || e.srcElement,
            r = i(e);
            loglat = a([r.left, r.top]) || {};
            if (!loglat || isNaN(loglat.log)) return;
            t.scaleDiv.textContent = (loglat.log * 1).toFixed(3) + "," + (loglat.lat * 1).toFixed(3)
        })
    },
    l.prototype.getType = function () {
        return "SecLocationTool"
    },
    l
}),
define("SecPrintTool", ["SecBaseTool", "Hobject"],
function (e, t) {
    var n = t.BaseFunc.extend,
    r = e.Command,
    i = e.CommandItem,
    s = function (t) {
        e.self.call(this, t)
    };
    return n(s, e.self),
    s.prototype._createTool = function () {
        this._createMenu();
        var e = new r(function () {
            alert("地图打印功能正在完善")
        }),
        t = new i("地图打印", e, "fa-print");
        this.cmds.push(t)
    },
    s.prototype.getType = function () {
        return "SecPrintTool"
    },
    s
}),
define("Marker", ["Hobject", "GeoElement", "GeoPoint"],
function (e, t, n) {
    var r = {
        TEXT: 0,
        TEXTANDGRAPH: 1,
        IMAGE: 2,
        STAR: 3
    },
    i = e.BaseFunc.extend,
    s = function (e) {
        var n = e || {};
        t.call(this),
        this.content = n.content,
        this.position = n.position,
        this.markerStyle = n.style || r.STAR
    };
    return i(s, t),
    s.prototype.getType = function () {
        return "Marker"
    },
    {
        MARKER_STYLE: r,
        self: s
    }
}),
define("SecPlotTool", ["SecBaseTool", "SecDrawInteractive", "SecDrawLayer", "Hobject", "DrawProtocol"],
function (e, t, n, r, i) {
    var s = r.BaseFunc.extend,
    o = e.Command,
    u = e.CommandItem,
    a = e.MultiCommandItem,
    f = i.DRAWTYPE,
    l = function (t) {
        this._drawlayer = null,
        e.self.call(this, t)
    };
    return s(l, e.self),
    l.prototype.getType = function () {
        return "SecDrawTool"
    },
    l.prototype._inilization = function () {
        this._drawlayer = new n({
            layerID: "SecDrawToolPoltLayer"
        }),
        this.args.addLayer(this._drawlayer),
        this._secDrawInteractive = this._drawlayer._secDrawInteractive
    },
    l.prototype._setLayerAtTop = function () {
        this._drawlayer.moveTop()
    },
    l.prototype._setLayerAtBottom = function () {
        this._drawlayer.moveToBottom()
    },
    l.prototype._createTool = function () {
        this._createMenu(),
        this._inilization();
        var e = this,
        t = new o(function () {
            e._secDrawInteractive.changeDraw(f.BeelineArrow),
            e._setLayerAtTop()
        }),
        n = new o(function () {
            e._secDrawInteractive.changeDraw(f.DoubleArrow),
            e._setLayerAtTop()
        }),
        r = new o(function () {
            e._secDrawInteractive.changeDraw(f.CurveArrow),
            e._setLayerAtTop()
        }),
        i = new o(function () {
            e._secDrawInteractive.changeDraw(f.SlightnessArrow),
            e._setLayerAtTop()
        }),
        s = new o(function () {
            e._secDrawInteractive.changeDraw(f.ArmyRoute),
            e._setLayerAtTop()
        }),
        u = new o(function () {
            e._secDrawInteractive.changeDraw(f.ArsenalRoute),
            e._setLayerAtTop()
        }),
        l = new o(function () {
            alert("更多标绘...")
        }),
        c = [t, n, r, i, s, u, l];
        items = new a("标绘", ["直细箭头", "双箭头", "单曲箭头", "直箭头", "行军", "武警", "更多..."], c, ["fa-location-arrow", "fa-level-up", "fa-share", "fa-arrow-up", "fa-users", "fa-pied-piper-alt", "fa-plus-square"]),
        this.cmds.push(items)
    },
    l
}),
define("PlotEdit", ["PlotElement", "Render", "Symbol", "EventListener", "MapRender", "Hobject"],
function (e, t, n, r, i, s) {
    var o = r.AddListener,
    u = r.RemoveListener,
    a = t.Polygon,
    f = t.Animation,
    l = t.Stage,
    c = t.Layer,
    h = t.Line,
    p = t.Circle,
    d = n.defaultLineSymbol,
    v = n.defaultPolygonSymbol,
    m = n.defaultPointSymbol,
    g = s.BaseFunc.hook,
    y = s.BaseFunc.getId,
    b, w, E = function (e) {
        e.cancelBubble = !0
    },
    S = function (e) {
        e.cancelBubble = !0
    },
    x = function (e) {
        e.cancelBubble = !0
    },
    T = function (e) {
        o(e, "mousedown", E),
        o(e, "mousemove", S),
        o(e, "mousewheel", x)
    },
    N = function (e) {
        u(e, "mousedown", E),
        u(e, "mousemove", S),
        u(e, "mousewheel", x)
    };
    e.prototype._startEdit = function (e, t, n, r) {
        var s = this,
        o = g.getValue("width"),
        u = g.getValue("height"),
        a = g.getValue("viewBox");
        this.canvaslayer = t,
        this.editPoints = [];
        var f = document.createElement("div");
        f.style.width = o + "px",
        f.style.height = u + "px",
        f.style.position = "absolute",
        this.editlayer = new c({
            width: o,
            height: u
        }),
        this._stage = new l({
            container: f,
            id: y(),
            width: o,
            height: u
        }),
        this._stage.add(this.editlayer),
        a.appendChild(this._stage.content),
        w = w || new i({
            mapInfo: {
                screenPosition: r
            }
        }),
        w.renderGeometry({
            layer: this.editlayer
        },
        this.toDrawGeoElements(),
        function (e, t, n, r) {
            var i = n.drawElement.shift();
            while (i) i.destroy(),
            i = n.drawElement.shift();
            n.drawElement = r
        },
        this),
        T(this._stage.content);
        var h = this.controlPoints,
        s = this;
        for (var d = 0,
        v = h.length; d < v; d++) {
            var b = m.toConfig(),
            E = r({
                log: h[d][0],
                lat: h[d][1]
            }),
            S = E.x,
            x = E.y;
            h[d] = [E.x, E.y],
            b.x = S,
            b.y = x,
            b.draggable = !0,
            b.fill = "yellow",
            b.radius = 6,
            b.opacity = 1,
            b.id = d;
            var N = new p(b);
            N.on("dragmove",
            function (e) {
                s.controlPoints[this.attrs.id] = [this.attrs.x, this.attrs.y],
                s.movePoint();
                var t = 0,
                n = s.drawElement.length;
                for (; t < n; t++) {
                    var r = s.shapes[t].getType() === "GeoPolygon" ? s.shapes[t].coordinates[0] : s.shapes[t].coordinates;
                    s.drawElement[t].setPoints(r)
                }
                s.editlayer.draw()
            }),
            this.editPoints.push(N),
            this.editlayer.add(N)
        }
        this.editlayer.draw()
    },
    e.prototype._stopEdit = function (e, t, n) {
        for (var r = 0,
        i = this.drawElement.length; r < i; r++) this.drawElement[r].moveTo(this.canvaslayer);
        this.editlayer.destroy(),
        this.canvaslayer.parent.remove(this.editlayer),
        e.stop(),
        this.canvaslayer.draw(),
        N(this._stage.content),
        g.getValue("viewBox").removeChild(this._stage.content),
        this._stage.destroy(),
        n ? n(this, this.canvaslayer.attrs.y, this.canvaslayer.attrs.x) : null
    }
}),
define("SecPlotEditTool", ["SecBaseTool", "Hobject", "Messenger"],
function (e, t, n) {
    var r = t.BaseFunc.extend,
    i = t.BaseFunc.hook,
    s = e.Command,
    o = e.CommandItem,
    u = function (t) {
        e.self.call(this, t)
    };
    return r(u, e.self),
    u.prototype._createTool = function () {
        var e = this.args.getLayerById,
        t;
        this._createMenu();
        var r = new s(function () {
            t = t || e("SecDrawToolPoltLayer");
            if (!t) return;
            i.plotEditFlag ? (n.getInstance().post("编辑模式关闭"), u.setIcon("fa-edit"), u.setText("开始编辑"), i.plotEditFlag = !1) : (n.getInstance().post("编辑模式启动"), u.setIcon("fa-stop"), u.setText("停止编辑"), i.plotEditFlag = !0)
        }),
        u = new o("开始编辑", r, "fa-edit");
        this.cmds.push(u)
    },
    u.prototype.getType = function () {
        return "SecPlotEditTool"
    },
    u
});

var Hmap = {
    SecMap: "",
    Layer: {
        TILETYPE: {
            ESRI: "",
            BAIDU: "",
            MAPABC: "",
            TMAP: "",
            BING: ""
        },
        SecTileLayer: "",
        SecGraphicLayer: "",
        SecFeatureLayer: "",
        SecDrawLayer: ""
    },
    Tools: {
        SecDrawTool: "",
        SecScaleTool: "",
        SecZoomTool: "",
        SecLocationTool: "",
        SecPrintTool: "",
        SecPlotTool: "",
        SecPlotEditTool: ""
    },
    Analysis: {
        AnalysisServer: "",
        RequestTask: "",
        WatershedTask: "",
        KirgingTask: ""
    },
    RealtimeAnalysis: {
        KrigingAnalysis: ""
    },
    Data: {
        EsriJson: "",
        GeoJson: ""
    },
    Projection: {
        epsg3857: "",
        epsg4326: ""
    },
    LogLat: "",
    PixelXY: "",
    ProXY: "",
    Symbol: {
        LineSymbol: "",
        PointSymbol: "",
        PolygonSymbol: ""
    },
    Marker: {
        MARKER_STYLE: {
            TEXT: "",
            TEXTANDGRAPH: "",
            IMAGE: "",
            STAR: ""
        },
        VectorMarker: ""
    }
};
define(["MapObject", "EsriTile", "BaseTile", "SecBaseLayer", "EventListener", "SecMapInteractive", "Hmath", "ANTile", "SecTileLayer", "Hobject", "SecGraphicLayer", "SecDrawTool", "SecScaleTool", "SecZoomTool", "SecFeatureLayer", "AnalysisServer", "BaseTask", "RequestTask", "WatershedTask", "KirgingTask", "EsriJson", "GeoJson", "BaseJson", "epsg3857", "epsg4326", "Coord", "Symbol", "Jsonp", "Messenger", "SecLocationTool", "SecPrintTool", "SecDrawLayer", "Marker", "SecPlotTool", "PlotEdit", "SecPlotEditTool"],
function (e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H) {
    Hmap.SecMap = e,
    Hmap.Layer.TILETYPE = a.TILETYPE,
    Hmap.Layer.SecTileLayer = a.self,
    Hmap.Layer.SecGraphicLayer = l,
    Hmap.Layer.SecFeatureLayer = d,
    Hmap.Layer.SecDrawLayer = M,
    Hmap.Analysis.AnalysisServer = v,
    Hmap.Analysis.RequestTask = g,
    Hmap.Analysis.WatershedTask = y,
    Hmap.Analysis.KirgingTask = b,
    Hmap.Projection.epsg3857 = x,
    Hmap.Projection.epsg4326 = T,
    Hmap.ProXY = N.ProXY,
    Hmap.LogLat = N.Loglat,
    Hmap.PixelXY = N.PixelXY,
    Hmap.Data.GeoJson = E,
    Hmap.Data.EsriJson = w,
    Hmap.Tools.SecDrawTool = c,
    Hmap.Tools.SecScaleTool = h,
    Hmap.Tools.SecZoomTool = p,
    Hmap.Tools.SecLocationTool = A,
    Hmap.Tools.SecPrintTool = O,
    Hmap.Tools.SecPlotTool = D,
    Hmap.Tools.SecPlotEditTool = H,
    Hmap.Symbol.LineSymbol = C.lineSymbol,
    Hmap.Symbol.PointSymbol = C.pointSymbol,
    Hmap.Symbol.PolygonSymbol = C.polygonSymbol,
    Hmap.Marker.MARKER_STYLE = _.MARKER_STYLE,
    Hmap.Marker.VectorMarker = _.self;
});