define(['Node', 'Layer', 'Stage', 'Utils'], function (Node, Layer, Stage, Utils) {
    var BATCH_DRAW_STOP_TIME_DIFF = 500,
        node = Node.self,
        layer = Layer.self,
        stage = Stage.self,
        isDragging = Utils.self.isDragging;
        animIdCounter = 0;

    var _animation = function (func, layers) {
        this.func = func;
        this.setLayers(layers);
        this.id = animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: new Date().getTime()
        };
    }

    _animation.prototype = {
        setLayers: function (layers) {
            var lays = [];
            // if passing in no layers
            if (!layers) {
                lays = [];
            }
            else if (layers.length > 0) {
                lays = layers;
            }
            // if passing in a Layer
            else {
                lays = [layers];
            }
            this.layers = lays;
        },
        getLayers: function () {
            return this.layers;
        },
        addLayer: function (layer) {
            var layers = this.layers,
                len, n;

            if (layers) {
                len = layers.length;

                // don't add the layer if it already exists
                for (n = 0; n < len; n++) {
                    if (layers[n]._id === layer._id) {
                        return false;
                    }
                }
            }
            else {
                this.layers = [];
            }

            this.layers.push(layer);
            return true;
        },
        isRunning: function () {
            var a = Kinetic.Animation, animations = a.animations;
            for (var n = 0; n < animations.length; n++) {
                if (animations[n].id === this.id) {
                    return true;
                }
            }
            return false;
        },
        start: function () {
            this.stop();
            this.frame.timeDiff = 0;
            this.frame.lastTime = new Date().getTime();
            _animation._addAnimation(this);
        },
        stop: function () {
            _animation._removeAnimation(this);
        },
        _updateFrameObject: function (time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        },
    }

    //#region 静态变量及函数
    _animation.animations = [];
    _animation.animIdCounter
    _animation.animRunning = false;
    _animation._addAnimation = function (anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    _animation._removeAnimation = function (anim) {
        var id = anim.id, animations = this.animations, len = animations.length;
        for (var n = 0; n < len; n++) {
            if (animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };
    _animation._runFrames = function () {
        var layerHash = {},
         animations = this.animations,
         anim, layers, func, n, i, layersLen, layer, key;
        for (n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;
            anim._updateFrameObject(new Date().getTime());
            layersLen = layers.length;
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];
                if (layer._id !== undefined) {
                    layerHash[layer._id] = layer;
                }
            }
            // if animation object has a function, execute it
            if (func) {
                func.call(anim, anim.frame);
            }
        }
        for (key in layerHash) {
            layerHash[key].draw();
        }
    };
    _animation._animationLoop = function () {
        var that = this;
        if (this.animations.length > 0) {
            this._runFrames();
            _animation.requestAnimFrame(function () {
                that._animationLoop();
            });
        }
        else {
            this.animRunning = false;
        }
    };
    _animation._handleAnimation = function () {
        var that = this;
        if (!this.animRunning) {
            this.animRunning = true;
            that._animationLoop();
        }
    };
    //#endregion

    var RAF = (function () {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || FRAF;
    })();

    function FRAF(callback) {
        window.setTimeout(callback, 1000 / 60);
    }

    _animation.requestAnimFrame = function (callback) {
        var raf =  isDragging ? FRAF : RAF;
        raf(callback);
    };

    var moveTo = node.prototype.moveTo;
    node.prototype.moveTo = function (container) {
        moveTo.call(this, container);
    };

    layer.prototype.batchDraw = function () {
        var that = this;
        if (!this.batchAnim) {
            this.batchAnim = new Kinetic.Animation(function () {
                if (that.lastBatchDrawTime && new Date().getTime() - that.lastBatchDrawTime > BATCH_DRAW_STOP_TIME_DIFF) {
                    that.batchAnim.stop();
                }
            }, this);
        }
        this.lastBatchDrawTime = new Date().getTime();
        if (!this.batchAnim.isRunning()) {
            this.draw();
            this.batchAnim.start();
        }
    }

    stage.prototype.batchDraw = function () {
        this.getChildren().each(function (layer) {
            layer.batchDraw();
        });
    }

    return {
        self:_animation,
    }
});