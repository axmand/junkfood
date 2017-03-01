define(['Utils','Context'], function (Utils,Context) {

    //
    var extend = Utils.self.extend,
        pixelRatio = Utils.self.pixelRatio,
        hitContext = Context.HitContext,
        sceneContext = Context.SceneContext;

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio
        || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio
        || 1,
        _pixelRatio = devicePixelRatio / backingStoreRatio;


    var _canvas = function (config) {
        this.__init(config);
    }

    _canvas.prototype = {
        __init: function (config) {
            config = config || {};
            var pixelRatio = config.pixelRatio || pixelRatio || _pixelRatio;
            this.pixelRatio = pixelRatio;
            this._canvas = document.createElement('canvas');
            // set inline styles
            this._canvas.id = config.id || "";
            this._canvas.style.padding = 0;
            this._canvas.style.margin = 0;
            this._canvas.style.border = 0;
            this._canvas.style.background = 'transparent';
            this._canvas.style.position = 'absolute';
            this._canvas.style.top = (config.x||0).toString()+'px';
            this._canvas.style.left = (config.y||0).toString()+'px';
        },
        setCanvasX:function(val){
            this._canvas.style.top = (val || 0).toString() + 'px';
        },
        setCanvasY:function(val){
            this._canvas.style.left = (val || 0).toString() + 'px';
        },
        getCanvas: function () {
            return this._canvas;
        },
        getContext: function () {
            return this.context;
        },
        getPixelRatio: function () {
            return this.pixelRatio;
        },
        setPixelRatio: function (pixelRatio) {
            this.pixelRatio = pixelRatio;
            this.setSize(this.getWidth(), this.getHeight());
        },
        setWidth: function (width) {
            // take into account pixel ratio
            this.width = this._canvas.width = width * this.pixelRatio;
            this._canvas.style.width = width + 'px';
        },
        setHeight: function (height) {
            // take into account pixel ratio
            this.height = this._canvas.height = height * this.pixelRatio;
            this._canvas.style.height = height + 'px';
        },
        getWidth: function () {
            return this.width;
        },
        getHeight: function () {
            return this.height;
        },
        setSize: function (width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        toDataURL: function (mimeType, quality) {
            try {
                // If this call fails (due to browser bug, like in Firefox 3.6),
                // then revert to previous no-parameter image/png behavior
                return this._canvas.toDataURL(mimeType, quality);
            }
            catch (e) {
                try {
                    return this._canvas.toDataURL();
                }
                catch (err) {
                    Kinetic.Util.warn('Unable to get data URL. ' + err.message);
                    return '';
                }
            }
        }
    };

    var _sceneCanvas = function (config) {
        config = config || {};
        var width = config.width || 0,
            height = config.height || 0;

        _canvas.call(this, config);
        this.context = new sceneContext(this);
        this.setSize(width, height);
    }

    _sceneCanvas.prototype = {
        setWidth: function (width) {
            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;
            _canvas.prototype.setWidth.call(this, width);
            _context.scale(pixelRatio, pixelRatio);
        },
        setHeight: function (height) {
            var pixelRatio = this.pixelRatio,
                _context = this.getContext()._context;
            _canvas.prototype.setHeight.call(this, height);
            _context.scale(pixelRatio, pixelRatio);
        }
    };

    extend(_sceneCanvas, _canvas);

    var _hitCanvas = function (config) {
        config = config || {};
        var width = config.width || 0,
            height = config.height || 0;

        _canvas.call(this, config);
        this.context = new hitContext(this);
        this.setSize(width, height);
    }

    extend(_hitCanvas, _canvas);

    return {
        HitCanvas: _hitCanvas,
        Canvas: _canvas,
        SceneCanvas:_sceneCanvas,
    }

});
