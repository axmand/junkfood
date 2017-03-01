/**
*      
*   @modules Stage
*/

define(['Utils', 'Container', 'Factory', 'Node', 'Canvas'],
    function (Utils, Container, Factory, Node, Canvas) {

    var addMethods = Utils.self.addMethods,
        getNewId = Utils.self._getNewId,
        isInDocument = Utils.self._isInDocument,
        stages = Utils.self.stages,
        extend = Utils.self.extend,
        factory = Factory.self,
        node = Node.self,
        inDblClickWindow = Utils.self.inDblClickWindow,
        sceneCanvas = Canvas.SceneCanvas,
        hitCanvas = Canvas.HitCanvas,
        isDragging = Utils.self.isDragging,
        dblClickWindow = Utils.self.dblClickWindow,
        listenClickTap = Utils.self.listenClickTap,
        container = Container.self;

    var STAGE = 'Stage',
       STRING = 'string',
       PX = 'px',

       MOUSEOUT = 'mouseout',
       MOUSELEAVE = 'mouseleave',
       MOUSEOVER = 'mouseover',
       MOUSEENTER = 'mouseenter',
       MOUSEMOVE = 'mousemove',
       MOUSEDOWN = 'mousedown',
       MOUSEUP = 'mouseup',
       CLICK = 'click',
       DBL_CLICK = 'dblclick',
       TOUCHSTART = 'touchstart',
       TOUCHEND = 'touchend',
       TAP = 'tap',
       DBL_TAP = 'dbltap',
       TOUCHMOVE = 'touchmove',

       CONTENT_MOUSEOUT = 'contentMouseout',
       CONTENT_MOUSELEAVE = 'contentMouseleave',
       CONTENT_MOUSEOVER = 'contentMouseover',
       CONTENT_MOUSEENTER = 'contentMouseenter',
       CONTENT_MOUSEMOVE = 'contentMousemove',
       CONTENT_MOUSEDOWN = 'contentMousedown',
       CONTENT_MOUSEUP = 'contentMouseup',
       CONTENT_CLICK = 'contentClick',
       CONTENT_DBL_CLICK = 'contentDblclick',
       CONTENT_TOUCHSTART = 'contentTouchstart',
       CONTENT_TOUCHEND = 'contentTouchend',
       CONTENT_TAP = 'contentTap',
       CONTENT_DBL_TAP = 'contentDbltap',
       CONTENT_TOUCHMOVE = 'contentTouchmove',
       CONTENT_BUFFERSIZE='contentBuffersize',

       DIV = 'div',
       RELATIVE = 'relative',
       INLINE_BLOCK = 'inline-block',
       RENDER_CONTENT = 'render-content',
       SPACE = ' ',
       UNDERSCORE = '_',
       CONTAINER = 'container',
       EMPTY_STRING = '',
       EVENTS = [MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEOUT, TOUCHSTART, TOUCHMOVE, TOUCHEND, MOUSEOVER],

       // cached variables
       eventsLength = EVENTS.length;

    function addEvent(ctx, eventName) {
        ctx.content.addEventListener(eventName, function (evt) {
            ctx[UNDERSCORE + eventName](evt);
        }, false);
    }

    var _stage = function (config) {
        this.___init(config);
    }

    addMethods(_stage, {
        ___init: function (config) {
            this.nodeType = STAGE;
            container.call(this, config);
            this._id = getNewId();
            this._buildDOM();
            this._bindContentEvents();
            this._enableNestedTransforms = false;
            stages.push(this);
        },
        _validateAdd: function (child) {
            if (child.getType() !== 'Layer') {
                 throw 'Stage对象只能添加Layer类型';
            }
        },
        setBufferSize:function(size){
            this._setAttr(CONTENT_BUFFERSIZE, size);
        },
        setContainer: function (container) {
            if (typeof container === STRING) {
                container = document.getElementById(container);
            }
            this._setAttr(CONTAINER, container);
            return this;
        },
        draw: function () {
            node.prototype.draw.call(this);
            return this;
        },
        setHeight: function (height) {
            node.prototype.setHeight.call(this, height);
            this._resizeDOM();
            return this;
        },
        setWidth: function (width) {
            node.prototype.setWidth.call(this, width);
            this._resizeDOM();
            return this;
        },
        clear: function () {
            var layers = this.children,
                len = layers.length,
                n;

            for (n = 0; n < len; n++) {
                layers[n].clear();
            }
            return this;
        },
        destroy: function () {
            var content = this.content;
            container.prototype.destroy.call(this);

            if (content && isInDocument(content)) {
                this.getContainer().removeChild(content);
            }
        },
        getPointerPosition: function () {
            return this.pointerPos;
        },
        getStage: function () {
            return this;
        },
        getContent: function () {
            return this.content;
        },
        toDataURL: function (config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                x = config.x || 0,
                y = config.y || 0,
                canvas = new Kinetic.SceneCanvas({
                    width: config.width || this.getWidth(),
                    height: config.height || this.getHeight(),
                    pixelRatio: 1
                }),
                _context = canvas.getContext()._context,
                layers = this.children;

            if (x || y) {
                _context.translate(-1 * x, -1 * y);
            }

            function drawLayer(n) {
                var layer = layers[n],
                    layerUrl = layer.toDataURL(),
                    imageObj = new Image();

                imageObj.onload = function () {
                    _context.drawImage(imageObj, 0, 0);

                    if (n < layers.length - 1) {
                        drawLayer(n + 1);
                    }
                    else {
                        config.callback(canvas.toDataURL(mimeType, quality));
                    }
                };
                imageObj.src = layerUrl;
            }
            drawLayer(0);
        },
        toImage: function (config) {
            var cb = config.callback;
            config.callback = function (dataUrl) {
                Kinetic.Util._getImage(dataUrl, function (img) {
                    cb(img);
                });
            };
            this.toDataURL(config);
        },
        /*
         * }{ bug 和所有的图层进行判断，性能很差
         *  修正，只对给定图层做path判定，减少循环次数
         */
        getIntersection: function (pos) {
            //存在id，则使用id搜索鼠标所指Layer
            var layers = this.getChildren(),
                len = layers.length,
                end = len - 1,
                n, shape;

            for (n = end; n >= 0; n--) {
                //判断与tpos的相交判断关系
                if (pos.id !== "") {
                    if (layers[n].attrs.id === pos.id) {
                        shape = layers[n].getIntersection(pos);
                        if (shape) {
                            return shape;
                        }
                        return null;
                    }
                } else {
                    shape = layers[n].getIntersection(pos);
                    if (shape) {
                        return shape;
                    }
                    return null;
                }
            }
        },
        _resizeDOM: function () {
            if (this.content) {
                var width = this.getWidth(),
                    height = this.getHeight(),
                    layers = this.getChildren(),
                    len = layers.length,
                    bufferSize = this.getAttr(CONTENT_BUFFERSIZE),
                    n, layer;
                // set content dimensions
                this.content.style.width = width + PX;
                this.content.style.height = height + PX;
                //}{ 设置绘图区域大小为256*256，(bufferwidth和bufferheigth)
                //采用过大的canvas，会在chrome里造成卡顿
                this.bufferCanvas.setSize(bufferSize || width, bufferSize||height);
                this.bufferHitCanvas.setSize(bufferSize || width, bufferSize||height);
                // set layer dimensions
                for (n = 0; n < len; n++) {
                    layer = layers[n];
                    layer.getCanvas().setSize(width, height);
                    layer.hitCanvas.setSize(width, height);
                    layer.draw();
                }
            }
        },
        add: function (layer) {
            container.prototype.add.call(this, layer);
            //设置大小
            //}{ hk 修正重绘draw卡顿情况，降低性能消耗
            //layer.draw();
            //显示canvas
            this.content.appendChild(layer.canvas._canvas);
            //hit探测canvas
            //this.content.appendChild(layer.hitCanvas._canvas);
            return this;
        },
        getParent: function () {
            return null;
        },
        getLayer: function () {
            return null;
        },
        getLayers: function () {
            return this.getChildren();
        },
        _bindContentEvents: function () {
            var that = this,n;
            for (n = 0; n < eventsLength; n++) {
                addEvent(this, EVENTS[n]);
            }
        },
        _mouseover: function (evt) {
            this._fire(CONTENT_MOUSEOVER, evt);
        },
        _mouseout: function (evt) {
            this._setPointerPosition(evt);
            var targetShape = this.targetShape;

            if (targetShape && !isDragging()) {
                targetShape._fireAndBubble(MOUSEOUT, evt);
                targetShape._fireAndBubble(MOUSELEAVE, evt);
                this.targetShape = null;
            }
            this.pointerPos = undefined;

            this._fire(CONTENT_MOUSEOUT, evt);
        },
        _mousemove: function (evt) {
            this._setPointerPosition(evt);
            var dd = require('DragAndDrop').self;
            shape = this.getIntersection(this.getPointerPosition());

            if (shape && shape.isListening()) {
                if (!isDragging() && (!this.targetShape || this.targetShape._id !== shape._id)) {
                    if (this.targetShape) {
                        this.targetShape._fireAndBubble(MOUSEOUT, evt, shape);
                        this.targetShape._fireAndBubble(MOUSELEAVE, evt, shape);
                    }
                    shape._fireAndBubble(MOUSEOVER, evt, this.targetShape);
                    shape._fireAndBubble(MOUSEENTER, evt, this.targetShape);
                    this.targetShape = shape;
                }
                else {
                    shape._fireAndBubble(MOUSEMOVE, evt);
                }
            }
            /*
             * if no shape was detected, clear target shape and try
             * to run mouseout from previous target shape
             */
            else {
                if (this.targetShape && !isDragging()) {
                    this.targetShape._fireAndBubble(MOUSEOUT, evt);
                    this.targetShape._fireAndBubble(MOUSELEAVE, evt);
                    this.targetShape = null;
                }
            }
            // content event
            this._fire(CONTENT_MOUSEMOVE, evt);
            if (dd) {
                dd._drag(evt);
            }
            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mousedown: function (evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            listenClickTap = true;

            if (shape && shape.isListening()) {
                this.clickStartShape = shape;
                shape._fireAndBubble(MOUSEDOWN, evt);
            }

            // content event
            this._fire(CONTENT_MOUSEDOWN, evt);

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _mouseup: function (evt) {
            this._setPointerPosition(evt);
            var that = this,
                shape = this.getIntersection(this.getPointerPosition()),
                fireDblClick = false;

            if (inDblClickWindow) {
                fireDblClick = true;
                inDblClickWindow = false;
            }
            else {
                inDblClickWindow = true;
            }
            setTimeout(function () {
                inDblClickWindow = false;
            }, dblClickWindow);
            if (shape && shape.isListening()) {
                shape._fireAndBubble(MOUSEUP, evt);
                if (!this.clickStartShape) return;
                // detect if click or double click occurred
                if (listenClickTap && shape._id === this.clickStartShape._id) {
                    shape._fireAndBubble(CLICK, evt);
                    if (fireDblClick) {
                        shape._fireAndBubble(DBL_CLICK, evt);
                    }
                }
            }
            // content events
            this._fire(CONTENT_MOUSEUP, evt);
            if (listenClickTap) {
                this._fire(CONTENT_CLICK, evt);
                if (fireDblClick) {
                    this._fire(CONTENT_DBL_CLICK, evt);
                }
            }

            listenClickTap = false;

            // always call preventDefault for desktop events because some browsers
            // try to drag and drop the canvas element
            if (evt.preventDefault) {
                evt.preventDefault();
            }
        },
        _touchstart: function (evt) {
            this._setPointerPosition(evt);
            var shape = this.getIntersection(this.getPointerPosition());

            Kinetic.listenClickTap = true;

            if (shape && shape.isListening()) {
                this.tapStartShape = shape;
                shape._fireAndBubble(TOUCHSTART, evt);

                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content event
            this._fire(CONTENT_TOUCHSTART, evt);
        },
        _touchend: function (evt) {
            this._setPointerPosition(evt);
            var that = this,
                shape = this.getIntersection(this.getPointerPosition());
            fireDblClick = false;

            if (Kinetic.inDblClickWindow) {
                fireDblClick = true;
                Kinetic.inDblClickWindow = false;
            }
            else {
                Kinetic.inDblClickWindow = true;
            }

            setTimeout(function () {
                Kinetic.inDblClickWindow = false;
            }, Kinetic.dblClickWindow);

            if (shape && shape.isListening()) {
                shape._fireAndBubble(TOUCHEND, evt);

                // detect if tap or double tap occurred
                if (Kinetic.listenClickTap && shape._id === this.tapStartShape._id) {
                    shape._fireAndBubble(TAP, evt);

                    if (fireDblClick) {
                        shape._fireAndBubble(DBL_TAP, evt);
                    }
                }
                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            // content events
            if (Kinetic.listenClickTap) {
                this._fire(CONTENT_TOUCHEND, evt);
                if (fireDblClick) {
                    this._fire(CONTENT_DBL_TAP, evt);
                }
            }

            Kinetic.listenClickTap = false;
        },
        _touchmove: function (evt) {
            this._setPointerPosition(evt);
            var dd = Kinetic.DD,
                shape = this.getIntersection(this.getPointerPosition());

            if (shape && shape.isListening()) {
                shape._fireAndBubble(TOUCHMOVE, evt);

                // only call preventDefault if the shape is listening for events
                if (shape.isListening() && evt.preventDefault) {
                    evt.preventDefault();
                }
            }
            this._fire(CONTENT_TOUCHMOVE, evt);

            // start drag and drop
            if (dd) {
                dd._drag(evt);
            }
        },
        _setPointerPosition: function (evt) {
            var evt = evt ? evt : window.event,
                contentPosition = this._getContentPosition(),
                targte = evt.srcElement || evt.target,  //当前鼠标所在的canvas瓦片
                id = targte.id,                                    //canvas瓦片id
                offsetX = evt.offsetX,
                clientX = evt.clientX,
                x = null,
                y = null,
                touch;

            // touch events
            if (evt.touches !== undefined) {
                // currently, only handle one finger
                if (evt.touches.length === 1) {
                    touch = evt.touches[0];
                    // get the information for finger #1
                    x = touch.clientX - contentPosition.left;
                    y = touch.clientY - contentPosition.top;
                }
            }
                // mouse events
            else {
                // if offsetX is defined, assume that offsetY is defined as well
                if (offsetX !== undefined) {
                    x = offsetX;
                    y = evt.offsetY;
                }
                    // we unforunately have to use UA detection here because accessing
                    // the layerX or layerY properties in newer veresions of Chrome
                    // throws a JS warning.  layerX and layerY are required for FF
                    // when the container is transformed via CSS.
                else if (Kinetic.UA.browser === 'mozilla') {
                    x = evt.layerX;
                    y = evt.layerY;
                }
                    // if clientX is defined, assume that clientY is defined as well
                else if (clientX !== undefined && contentPosition) {
                    x = clientX - contentPosition.left;
                    y = evt.clientY - contentPosition.top;
                }
            }

            if (x !== null && y !== null) {
                this.pointerPos = {
                    x: x,
                    y: y,
                    id:id,
                };
            }
        },
        _getContentPosition: function () {
            var rect = this.content.getBoundingClientRect ? this.content.getBoundingClientRect() : { top: 0, left: 0 };
            return {
                top: rect.top,
                left: rect.left
            };
        },
        _buildDOM: function () {
            var container = this.getContainer();
            // clear content inside container
            container.innerHTML = EMPTY_STRING;
            // content
            this.content = document.createElement(DIV);
            this.content.id = this.attrs.id;                            //layer 的 id
            //this.content.style.zIndex = this.attrs.id;      //显示顺序
            //this.content.style.position = RELATIVE;
            this.content.style.position = 'absolute';
            this.content.style.display = INLINE_BLOCK;
            this.content.className = RENDER_CONTENT;
            this.content.setAttribute('role', 'presentation');
            container.appendChild(this.content);
            // the buffer canvas pixel ratio must be 1 because it is used as an 
            // intermediate canvas before copying the result onto a scene canvas.
            // not setting it to 1 will result in an over compensation
            this.bufferCanvas = new sceneCanvas({
                pixelRatio: 1
            });
            this.bufferHitCanvas = new hitCanvas();
            this._resizeDOM();
        },
        _onContent: function (typesStr, handler) {
            var types = typesStr.split(SPACE),
                len = types.length,
                n, baseEvent;

            for (n = 0; n < len; n++) {
                baseEvent = types[n];
                this.content.addEventListener(baseEvent, handler, false);
            }
        }
    });

    extend(_stage, container);

    factory.addGetter(_stage, 'container');

    return {
        self:_stage,
    }

});