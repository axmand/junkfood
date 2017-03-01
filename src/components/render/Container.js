
define(['Utils', 'Collection', 'Node', 'Factory'], function (Utils, Collection, Node, Factory) {

    var addMethods = Utils.self.addMethods,
        node = Node.self,
        factory = Factory.self,
        extend=Utils.self.extend,
        collection = Collection.self;

    var SPACE = '',
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

    var _container = function (config) {
        this.__init(config);
    }

    addMethods(_container, {
        __init: function (config) {
            this.children = new collection();
            node.call(this, config);
            this.on(TRANSFORM_CHANGE_STR, function () {
                var stage = this.getStage();
                if (stage) {
                    stage._enableNestedTransforms = true;
                }
            });
        },
        getChildren: function () {
            return this.children;
        },
        hasChildren: function () {
            return this.getChildren().length > 0;
        },
        removeChildren: function () {
            var children = this.children,
                child;

            while (children.length > 0) {
                child = children[0];
                if (child.hasChildren()) {
                    child.removeChildren();
                }
                child.remove();
            }

            return this;
        },
        destroyChildren: function () {
            var children = this.children;
            while (children.length > 0) {
                children[0].destroy();
            }
            return this;
        },
        add: function (child) {
            var children = this.children;
            this._validateAdd(child);
            child.index = children.length;
            child.parent = this;
            children.push(child);
            this._fire('add', {
                child: child
            });
            // chainable
            return this;
        },
        destroy: function () {
            // destroy children
            if (this.hasChildren()) {
                this.destroyChildren();
            }
            // then destroy self
            node.prototype.destroy.call(this);
        },
        find: function (selector) {
            var retArr = [],
                selectorArr = selector.replace(/ /g, '').split(','),
                len = selectorArr.length,
                n, i, sel, arr, node, children, clen;

            for (n = 0; n < len; n++) {
                sel = selectorArr[n];

                // id selector
                if (sel.charAt(0) === '#') {
                    node = this._getNodeById(sel.slice(1));
                    if (node) {
                        retArr.push(node);
                    }
                }
                    // name selector
                else if (sel.charAt(0) === '.') {
                    arr = this._getNodesByName(sel.slice(1));
                    retArr = retArr.concat(arr);
                }
                    // unrecognized selector, pass to children
                else {
                    children = this.getChildren();
                    clen = children.length;
                    for (i = 0; i < clen; i++) {
                        retArr = retArr.concat(children[i]._get(sel));
                    }
                }
            }

            return Kinetic.Collection.toCollection(retArr);
        },
        _getNodeById: function (key) {
            var node = Kinetic.ids[key];

            if (node !== undefined && this.isAncestorOf(node)) {
                return node;
            }
            return null;
        },
        _getNodesByName: function (key) {
            var arr = Kinetic.names[key] || [];
            return this._getDescendants(arr);
        },
        _get: function (selector) {
            var retArr = Kinetic.Node.prototype._get.call(this, selector);
            var children = this.getChildren();
            var len = children.length;
            for (var n = 0; n < len; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            return retArr;
        },
        toObject: function () {
            var obj = Kinetic.Node.prototype.toObject.call(this);

            obj.children = [];

            var children = this.getChildren();
            var len = children.length;
            for (var n = 0; n < len; n++) {
                var child = children[n];
                obj.children.push(child.toObject());
            }

            return obj;
        },
        _getDescendants: function (arr) {
            var retArr = [];
            var len = arr.length;
            for (var n = 0; n < len; n++) {
                var node = arr[n];
                if (this.isAncestorOf(node)) {
                    retArr.push(node);
                }
            }

            return retArr;
        },
        isAncestorOf: function (node) {
            var parent = node.getParent();
            while (parent) {
                if (parent._id === this._id) {
                    return true;
                }
                parent = parent.getParent();
            }

            return false;
        },
        clone: function (obj) {
            // call super method
            var node = Kinetic.Node.prototype.clone.call(this, obj);

            this.getChildren().each(function (no) {
                node.add(no.clone());
            });
            return node;
        },
        getAllIntersections: function (pos) {
            var arr = [];
            this.find('Shape').each(function (shape) {
                if (shape.isVisible() && shape.intersects(pos)) {
                    arr.push(shape);
                }
            });
            return arr;
        },
        _setChildrenIndices: function () {
            this.children.each(function (child, n) {
                child.index = n;
            });
        },
        drawScene: function (canvas) {
            var layer = this.getLayer(),
                clip = this.getClipWidth() && this.getClipHeight(),
                children, n, len;
            if (!canvas && layer) {
                canvas = layer.getCanvas();
            }
            if (this.isVisible()) {
                if (clip) {
                    canvas.getContext()._clip(this);
                }
                else {
                    this._drawChildren(canvas);
                }
            }

            return this;
        },
        _drawChildren: function (canvas) {
            this.children.each(function (child) {
                child.drawScene(canvas);
            });
        },
        drawHit: function () {
            var hasClip = this.getClipWidth() && this.getClipHeight() && this.nodeType !== 'Stage',
                n = 0,
                len = 0,
                children = [],
                hitCanvas;
            if (this.shouldDrawHit()) {
                if (hasClip) {
                    hitCanvas = this.getLayer().hitCanvas;
                    hitCanvas.getContext()._clip(this);
                }
                children = this.children;
                len = children.length;
                for (n = 0; n < len; n++) {
                    children[n].drawHit();
                }
                if (hasClip) {
                    hitCanvas.getContext()._context.restore();
                }
            }
            return this;
        }
    });

    extend(_container,node);

    _container.prototype.get = _container.prototype.find;

    factory.addBoxGetterSetter(_container, 'clip');
    factory.addGetterSetter(_container, 'clipX', 0);
    factory.addGetterSetter(_container, 'clipY', 0);
    factory.addGetterSetter(_container, 'clipWidth', 0);
    factory.addGetterSetter(_container, 'clipHeight', 0);

    return {
        self:_container,
    }
});