/**
*   node 层次节点模型
*   @modules node
*/

define(['Utils', 'Factory', 'Collection', 'Transform'],
    function (Utils, Factory, Collection, Transform) {
    //本地类型导入，将类型赋值给对象的prototype
    var addMethods = Utils.self.addMethods,
        factory = Factory.self,
        capitalize= Utils.self._capitalize,
        collection = Collection.self,
        removeId = Utils.self.removeId,
        addId = Utils.self.addId,
        Transform = Transform.self,
        isFunction = Utils.self._isFunction,
        isDragging = Utils.self.isDragging,
        getNewId = Utils.self._getNewId;

    var ABSOLUTE_OPACITY = 'absoluteOpacity',
       ABSOLUTE_TRANSFORM = 'absoluteTransform',
       ADD = 'add',
       B = 'b',
       BEFORE = 'before',
       BLACK = 'black',
       CHANGE = 'Change',
       CHILDREN = 'children',
       DEG = 'Deg',
       DOT = '.',
       EMPTY_STRING = '',
       G = 'g',
       GET = 'get',
       HASH = '#',
       ID = 'id',
       KINETIC = 'kinetic',
       LISTENING = 'listening',
       MOUSEENTER = 'mouseenter',
       MOUSELEAVE = 'mouseleave',
       NAME = 'name',
       OFF = 'off',
       ON = 'on',
       PRIVATE_GET = '_get',
       R = 'r',
       RGB = 'RGB',
       SET = 'set',
       SHAPE = 'Shape',
       SPACE = ' ',
       STAGE = 'stage',
       TRANSFORM = 'transform',
       UPPER_B = 'B',
       UPPER_G = 'G',
       UPPER_HEIGHT = 'Height',
       UPPER_R = 'R',
       UPPER_STAGE = 'Stage',
       UPPER_WIDTH = 'Width',
       UPPER_X = 'X',
       UPPER_Y = 'Y',
       VISIBLE = 'visible',
       X = 'x',
       Y = 'y',

       TRANSFORM_CHANGE_STR = [
           'xChange',
           'yChange',
           'scaleXChange',
           'scaleYChange',
           'skewXChange',
           'skewYChange',
           'rotationChange',
           'offsetXChange',
           'offsetYChange'
       ].join(SPACE);

    var _node = function (config) {
        this._init(config);
    }

    addMethods(_node, {
        _init: function (config) {
            var that = this;
            this._id = getNewId();
            this.eventListeners = {};
            this.attrs = {};
            this.cache = {};
            this.setAttrs(config);
            //
            // event bindings for cache handling
            this.on(TRANSFORM_CHANGE_STR, function () {
                this._clearCache(TRANSFORM);
                that._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
            });
            this.on('visibleChange', function () {
                that._clearSelfAndChildrenCache(VISIBLE);
            });
            this.on('listeningChange', function () {
                that._clearSelfAndChildrenCache(LISTENING);
            });
            this.on('opacityChange', function () {
                that._clearSelfAndChildrenCache(ABSOLUTE_OPACITY);
            });
        },
        clearCache: function () {
            this.cache = {};
        },
        _clearCache: function (attr) {
            delete this.cache[attr];
        },
        _getCache: function (attr, privateGetter) {
            var cache = this.cache[attr];
            // if not cached, we need to set it using the private getter method.
            if (cache === undefined) {
                this.cache[attr] = privateGetter.call(this);
            }
            return this.cache[attr];
        },
        _clearSelfAndChildrenCache: function (attr) {
            var that = this;
            this._clearCache(attr);
            if (this.children) {
                this.getChildren().each(function (node) {
                    node._clearSelfAndChildrenCache(attr);
                });
            }
        },
        on: function (evtStr, handler) {
            var events = evtStr.split(SPACE),
                len = events.length,
                n, event, parts, baseEvent, name;
            /*
            * loop through types and attach event listeners to
            * each one.  eg. 'click mouseover.namespace mouseout'
            * will create three event bindings
            */
            for (n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1] || EMPTY_STRING;
                // create events array if it doesn't exist
                if (!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }
                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }
            return this;
        },
        once:function(evtStr,handler){
            var events = evtStr.split(SPACE),
                  len = events.length,
                  n, event, parts, baseEvent, name;
            /*
            * loop through types and attach event listeners to
            * each one.  eg. 'click mouseover.namespace mouseout'
            * will create three event bindings
            */
            for (n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1] || EMPTY_STRING;
                this.eventListeners[baseEvent] = [];
                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }
            return this;
        },
        off: function (evtStr) {
            var events = evtStr.split(SPACE),
                len = events.length,
                n, i, t, event, parts, baseEvent, name;
            for (n = 0; n < len; n++) {
                event = events[n];
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts[1];
                if (baseEvent) {
                    if (this.eventListeners[baseEvent]) {
                        this._off(baseEvent, name);
                    }
                }
                else {
                    for (t in this.eventListeners) {
                        this._off(t, name);
                    }
                }
            }
            return this;
        },
        remove: function () {
            var parent = this.getParent();
            if (parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
                delete this.parent;
            }
            // every cached attr that is calculated via node tree
            // treversal must be cleared when removing a node
            this._clearSelfAndChildrenCache(STAGE);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
            this._clearSelfAndChildrenCache(VISIBLE);
            this._clearSelfAndChildrenCache(LISTENING);
            this._clearSelfAndChildrenCache(ABSOLUTE_OPACITY);

            return this;
        },
        destroy: function () {
            // remove from ids and names hashes
            removeId(this.getId());
            //}{ hk removeName未写
            //removeName(this.getName(), this._id);

            this.remove();
        },
        getAttr: function (attr) {
            var method = GET + capitalize(attr);
            if (isFunction(this[method])) {
                return this[method]();
            }
                // otherwise get directly
            else {
                return this.attrs[attr];
            }
        },
        getAncestors: function () {
            var parent = this.getParent(),
                ancestors = new collection();

            while (parent) {
                ancestors.push(parent);
                parent = parent.getParent();
            }

            return ancestors;
        },
        getAttrs: function () {
            return this.attrs || {};
        },
        setAttrs: function (config) {
            var key, method;
            if (config) {
                for (key in config) {
                    if (key === CHILDREN) {
                    }
                    else {
                        method = SET + capitalize(key);
                        // use setter if available
                        if (isFunction(this[method])) {
                            this[method](config[key]);
                        }else {
                            this._setAttr(key, config[key]);
                        }
                    }
                }
            }
            return this;
        },
        isListening: function () {
            return this._getCache(LISTENING, this._isListening);
        },
        _isListening: function () {
            var listening = this.getListening(),
                parent = this.getParent();
            if (listening && parent && !parent.isListening()) {
                return false;
            }
            return listening;
        },
        isVisible: function () {
            return this._getCache(VISIBLE, this._isVisible);
        },
        _isVisible: function () {
            var visible = this.getVisible(),
                parent = this.getParent();

            if (visible && parent && !parent.isVisible()) {
                return false;
            }
            return visible;
        },
        show: function () {
            this.setVisible(true);
            return this;
        },
        hide: function () {
            this.setVisible(false);
            return this;
        },
        getZIndex: function () {
            return this.index || 0;
        },
        getAbsoluteZIndex: function () {
            var level = this.getLevel(),
                that = this,
                index = 0,
                nodes, len, n, child;
            function addChildren(children) {
                nodes = [];
                len = children.length;
                for (n = 0; n < len; n++) {
                    child = children[n];
                    index++;

                    if (child.nodeType !== SHAPE) {
                        nodes = nodes.concat(child.getChildren().toArray());
                    }

                    if (child._id === that._id) {
                        n = len;
                    }
                }
                if (nodes.length > 0 && nodes[0].getLevel() <= level) {
                    addChildren(nodes);
                }
            }
            if (that.nodeType !== UPPER_STAGE) {
                addChildren(that.getStage().getChildren());
            }
            return index;
        },
        getLevel: function () {
            var level = 0,
                parent = this.parent;
            while (parent) {
                level++;
                parent = parent.parent;
            }
            return level;
        },
        setPosition: function (pos) {
            this.setX(pos.x);
            this.setY(pos.y);
            return this;
        },
        getPosition: function () {
            return {
                x: this.getX(),
                y: this.getY()
            };
        },
        getAbsolutePosition: function () {
            var absoluteMatrix = this.getAbsoluteTransform().getMatrix(),
                absoluteTransform = new Transform(),
                o = this.getOffset();

            // clone the matrix array
            absoluteTransform.m = absoluteMatrix.slice();

            absoluteTransform.translate(o.x, o.y);

            return absoluteTransform.getTranslation();
        },
        setAbsolutePosition: function (pos) {
            var trans = this._clearTransform(),
                it;

            // don't clear translation
            this.attrs.x = trans.x;
            this.attrs.y = trans.y;
            delete trans.x;
            delete trans.y;

            // unravel transform
            it = this.getAbsoluteTransform();

            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };

            this.setPosition({ x: pos.x, y: pos.y });
            this._setTransform(trans);
            return this;
        },
        _setTransform: function (trans) {
            var key;

            for (key in trans) {
                this.attrs[key] = trans[key];
            }

            this._clearCache(TRANSFORM);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);
        },
        _clearTransform: function () {
            var trans = {
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

            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scaleX = 1;
            this.attrs.scaleY = 1;
            this.attrs.offsetX = 0;
            this.attrs.offsetY = 0;
            this.attrs.skewX = 0;
            this.attrs.skewY = 0;

            this._clearCache(TRANSFORM);
            this._clearSelfAndChildrenCache(ABSOLUTE_TRANSFORM);

            return trans;
        },
        move: function (change) {
            var changeX = change.x,
                changeY = change.y,
                x = this.getX(),
                y = this.getY();

            if (changeX !== undefined) {
                x += changeX;
            }

            if (changeY !== undefined) {
                y += changeY;
            }

            this.setPosition({ x: x, y: y });
            return this;
        },
        _eachAncestorReverse: function (func, includeSelf) {
            var family = [],
                parent = this.getParent(),
                len, n;

            // build family by traversing ancestors
            if (includeSelf) {
                family.unshift(this);
            }
            while (parent) {
                family.unshift(parent);
                parent = parent.parent;
            }

            len = family.length;
            for (n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        rotate: function (theta) {
            this.setRotation(this.getRotation() + theta);
            return this;
        },
        rotateDeg: function (deg) {
            this.setRotation(this.getRotation() + Kinetic.Util._degToRad(deg));
            return this;
        },
        moveToTop: function () {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        moveUp: function () {
            var index = this.index,
                len = this.parent.getChildren().length;
            if (index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        moveDown: function () {
            var index = this.index;
            if (index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        moveToBottom: function () {
            var index = this.index;
            if (index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
            return false;
        },
        setZIndex: function (zIndex) {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
            return this;
        },
        getAbsoluteOpacity: function () {
            return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
        },
        _getAbsoluteOpacity: function () {
            var absOpacity = this.getOpacity();
            if (this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        moveTo: function (newContainer) {
            _node.prototype.remove.call(this);
            newContainer.add(this);
            return this;
        },
        toObject: function () {
            var type = Kinetic.Util,
                obj = {},
                attrs = this.getAttrs(),
                key, val, getter, defaultValue;

            obj.attrs = {};

            // serialize only attributes that are not function, image, DOM, or objects with methods
            for (key in attrs) {
                val = attrs[key];
                if (!type._isFunction(val) && !type._isElement(val) && !(type._isObject(val) && type._hasMethods(val))) {
                    getter = this[GET + Kinetic.Util._capitalize(key)];
                    defaultValue = getter ? getter.call({ attrs: {} }) : null;
                    if (defaultValue != val) {
                        obj.attrs[key] = val;
                    }
                }
            }

            obj.className = this.getClassName();
            return obj;
        },
        toJSON: function () {
            return JSON.stringify(this.toObject());
        },
        getParent: function () {
            return this.parent;
        },
        getLayer: function () {
            var parent = this.getParent();
            return parent ? parent.getLayer() : null;
        },
        getStage: function () {
            return this._getCache(STAGE, this._getStage);
        },
        _getStage: function () {
            var parent = this.getParent();
            if (parent) {
                return parent.getStage();
            }
            else {
                return undefined;
            }
        },
        fire: function (eventType, evt, bubble) {
            // bubble
            if (bubble) {
                this._fireAndBubble(eventType, evt || {});
            }
            // no bubble
            else {
                this._fire(eventType, evt || {});
            }
            return this;
        },
        getAbsoluteTransform: function () {
            return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
        },
        _getAbsoluteTransform: function () {
            // absolute transform
            var am = new Transform(),
                m;

            this._eachAncestorReverse(function (node) {
                m = node.getTransform();
                am.multiply(m);
            }, true);
            return am;
        },
        _getTransform: function () {
            var m = new Transform(),
                x = this.getX(),
                y = this.getY(),
                rotation = this.getRotation(),
                scaleX = this.getScaleX(),
                scaleY = this.getScaleY(),
                skewX = this.getSkewX(),
                skewY = this.getSkewY(),
                offsetX = this.getOffsetX(),
                offsetY = this.getOffsetY();

            if (x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if (rotation !== 0) {
                m.rotate(rotation);
            }
            if (skewX !== 0 || skewY !== 0) {
                m.skew(skewX, skewY);
            }
            if (scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if (offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }

            return m;
        },
        clone: function (obj) {
            // instantiate new node
            var className = this.getClassName(),
                node = new Kinetic[className](this.attrs),
                key, allListeners, len, n, listener;

            // copy over listeners
            for (key in this.eventListeners) {
                allListeners = this.eventListeners[key];
                len = allListeners.length;
                for (n = 0; n < len; n++) {
                    listener = allListeners[n];
                    /*
                     * don't include kinetic namespaced listeners because
                     *  these are generated by the constructors
                     */
                    if (listener.name.indexOf(KINETIC) < 0) {
                        // if listeners array doesn't exist, then create it
                        if (!node.eventListeners[key]) {
                            node.eventListeners[key] = [];
                        }
                        node.eventListeners[key].push(listener);
                    }
                }
            }

            // apply attr overrides
            node.setAttrs(obj);
            return node;
        },
        toDataURL: function (config) {
            config = config || {};

            var mimeType = config.mimeType || null,
                quality = config.quality || null,
                stage = this.getStage(),
                x = config.x || 0,
                y = config.y || 0,
                canvas = new Kinetic.SceneCanvas({
                    width: config.width || this.getWidth() || (stage ? stage.getWidth() : 0),
                    height: config.height || this.getHeight() || (stage ? stage.getHeight() : 0),
                    pixelRatio: 1
                }),
                context = canvas.getContext();

            context.save();

            if (x || y) {
                context.translate(-1 * x, -1 * y);
            }

            this.drawScene(canvas);
            context.restore();

            return canvas.toDataURL(mimeType, quality);
        },
        toImage: function (config) {
            Kinetic.Util._getImage(this.toDataURL(config), function (img) {
                config.callback(img);
            });
        },
        setSize: function (size) {
            this.setWidth(size.width);
            this.setHeight(size.height);
            return this;
        },
        getSize: function () {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        getWidth: function () {
            return this.attrs.width || 0;
        },
        getHeight: function () {
            return this.attrs.height || 0;
        },
        getClassName: function () {
            return this.className || this.nodeType;
        },
        getType: function () {
            return this.nodeType;
        },
        _get: function (selector) {
            return this.nodeType === selector ? [this] : [];
        },
        _off: function (type, name) {
            var evtListeners = this.eventListeners[type],
                i, evtName;
            for (i = 0; i < evtListeners.length; i++) {
                evtName = evtListeners[i].name;
                // the following two conditions must be true in order to remove a handler:
                // 1) the current event name cannot be kinetic unless the event name is kinetic
                //    this enables developers to force remove a kinetic specific listener for whatever reason
                // 2) an event name is not specified, or if one is specified, it matches the current event name
                if ((evtName !== 'kinetic' || name === 'kinetic') && (!name || evtName === name)) {
                    evtListeners.splice(i, 1);
                    if (evtListeners.length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _fireBeforeChangeEvent: function (attr, oldVal, newVal) {
            this._fire([BEFORE, Kinetic.Util._capitalize(attr), CHANGE].join(EMPTY_STRING), {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        _fireChangeEvent: function (attr, oldVal, newVal) {
            this._fire(attr + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        setId: function (id) {
            var oldId = this.getId();
            removeId(oldId);
            addId(this, id);
            this._setAttr(ID, id);
            return this;
        },
        setName: function (name) {
            var oldName = this.getName();
            Kinetic._removeName(oldName, this._id);
            Kinetic._addName(this, name);
            this._setAttr(NAME, name);
            return this;
        },
        setAttr: function () {
            var args = Array.prototype.slice.call(arguments),
                attr = args[0],
                val = args[1],
                method = SET + Kinetic.Util._capitalize(attr),
                func = this[method];

            if (Kinetic.Util._isFunction(func)) {
                func.call(this, val);
            }
                // otherwise set directly
            else {
                this._setAttr(attr, val);
            }
            return this;
        },
        _setAttr: function (key, val) {
            var oldVal;
            if (val !== undefined) {
                oldVal = this.attrs[key];
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _setComponentAttr: function (key, component, val) {
            var oldVal;
            if (val !== undefined) {
                oldVal = this.attrs[key];

                if (!oldVal) {
                    // set value to default value using getAttr
                    this.attrs[key] = this.getAttr(key);
                }

                //this._fireBeforeChangeEvent(key, oldVal, val);
                this.attrs[key][component] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _fireAndBubble: function (eventType, evt, compareShape) {
            var okayToRun = true;

            if (evt && this.nodeType === SHAPE) {
                evt.targetNode = this;
            }

            if (eventType === MOUSEENTER && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }
            else if (eventType === MOUSELEAVE && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }

            if (okayToRun) {
                this._fire(eventType, evt);

                // simulate event bubbling
                if (evt && !evt.cancelBubble && this.parent) {
                    if (compareShape && compareShape.parent) {
                        this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                    }
                    else {
                        this._fireAndBubble.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _fire: function (eventType, evt) {
            var events = this.eventListeners[eventType],
                i;

            if (events) {
                for (i = 0; i < events.length; i++) {
                    events[i].handler.call(this, evt);
                }
            }
        },
        draw: function () {
            this.drawScene();
            this.drawHit();
            return this;
        },
        shouldDrawHit: function () {
            return this.isListening() && this.isVisible() && !isDragging();
        },
        isDraggable: function () {
            return false;
        },
        getTransform: function () {
            return this._getCache(TRANSFORM, this._getTransform);
        }
    });

    //#region node 静态函数

    _node.create = function (json, container) {
        return this._createNode(JSON.parse(json), container);
    }

    _node._createNode = function (obj, container) {
        var className = _node.prototype.getClassName.call(obj),
            children = obj.children,
            no, len, n;

        // if container was passed in, add it to attrs
        if (container) {
            obj.attrs.container = container;
        }

        no = new Kinetic[className](obj.attrs);
        if (children) {
            len = children.length;
            for (n = 0; n < len; n++) {
                no.add(this._createNode(children[n]));
            }
        }

        return no;
    }

    //#endregion

    factory.addGetterSetter(_node, 'x', 0);
    factory.addGetterSetter(_node, 'y', 0);
    factory.addGetterSetter(_node, 'opacity', 1);
    factory.addGetter(_node, 'name');
    factory.addGetter(_node, 'id');
    factory.addRotationGetterSetter(_node, 'rotation', 0);
    factory.addPointGetterSetter(_node, 'scale', 1);
    factory.addPointGetterSetter(_node, 'skew', 0);
    factory.addPointGetterSetter(_node, 'offset', 0);
    factory.addSetter(_node, 'width', 0);
    factory.addSetter(_node, 'height', 0);
    factory.addGetterSetter(_node, 'listening', true);
    factory.addGetterSetter(_node, 'visible', true);

    collection.mapMethods(_node);

    return {
        self:_node,
    }

});