define(['Animation', 'Node', 'Factory', 'Utils'], function (Animation, Node, Factory, Utils) {
    
    var animation = Animation.self,
        factory = Factory.self,
        listenClickTap = Utils.self.listenClickTap,
        node = Node.self;

    var _dd = {
        anim: new animation(),
        isDragging: false,
        offset: {
            x: 0,
            y: 0
        },
        node: null,
        // methods
        _drag: function (evt) {
            var dd = _dd,
                node = dd.node;
            if (node) {
                node._setDragPosition(evt);
                if (!dd.isDragging) {
                    dd.isDragging = true;
                    node.fire('dragstart', evt, true);
                }
                // execute ondragmove if defined
                node.fire('dragmove', evt, true);
            }
        },
        _endDragBefore: function (evt) {
            var dd = _dd,
                node = dd.node,
                nodeType, layer;

            if (node) {
                nodeType = node.nodeType;
                layer = node.getLayer();
                dd.anim.stop();

                // only fire dragend event if the drag and drop
                // operation actually started.
                if (dd.isDragging) {
                    dd.isDragging = false;
                    listenClickTap = false;

                    if (evt) {
                        evt.dragEndNode = node;
                    }
                }

                delete dd.node;

                (layer || node).draw();
            }
        },
        _endDragAfter: function (evt) {
            evt = evt || {};

            var dragEndNode = evt.dragEndNode;

            if (evt && dragEndNode) {
                dragEndNode.fire('dragend', evt, true);
            }
        }
    };

    var origDestroy = node.prototype.destroy;

    node.prototype.startDrag = function () {
        var dd = _dd,
           stage = this.getStage(),
           layer = this.getLayer(),
           pos = stage.getPointerPosition(),
           ap = this.getAbsolutePosition();

        if (pos) {
            if (dd.node) {
                dd.node.stopDrag();
            }

            dd.node = this;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;
            dd.anim.setLayers(layer || this.getLayers());
            dd.anim.start();

            this._setDragPosition();
        }
    };
    node.prototype._setDragPosition = function (evt) {
        var dd = _dd,
          pos = this.getStage().getPointerPosition(),
          dbf = this.getDragBoundFunc(),
          newNodePos = {
              x: pos.x - dd.offset.x,
              y: pos.y - dd.offset.y
          };

        if (dbf !== undefined) {
            newNodePos = dbf.call(this, newNodePos, evt);
        }

        this.setAbsolutePosition(newNodePos);
    };
    node.prototype.stopDrag = function () {
        var dd = _dd,
            evt = {};
        dd._endDragBefore(evt);
        dd._endDragAfter(evt);
    };
    node.prototype.setDraggable = function (draggable) {
        this._setAttr('draggable', draggable);
        this._dragChange();
    };
    node.prototype.destroy = function () {
        var dd = _dd;
        // stop DD
        if (dd.node && dd.node._id === this._id) {
            this.stopDrag();
        }
        origDestroy.call(this);
    };
    node.prototype.isDragging = function () {
        var dd = _dd;
        return dd.node && dd.node._id === this._id && dd.isDragging;
    };
    node.prototype._listenDrag = function () {
        var that = this;

        this._dragCleanup();

        if (this.getClassName() === 'Stage') {
            this.on('contentMousedown contentTouchstart', function (evt) {
                if (!_dd.node) {
                    that.startDrag(evt);
                }
            });
        }
        else {
            this.on('mousedown touchstart', function (evt) {
                if (!_dd.node) {
                    that.startDrag(evt);
                }
            });
        }
    };
    node.prototype._dragChange = function () {
        if (this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();
            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var dd = Kinetic.DD;
            if (stage && dd.node && dd.node._id === this._id) {
                dd.node.stopDrag();
            }
        }
    };
    node.prototype._dragCleanup = function () {
        if (this.getClassName() === 'Stage') {
            this.off('contentMousedown');
            this.off('contentTouchstart');
        } else {
            this.off('mousedown');
            this.off('touchstart');
        }
    };

    factory.addGetterSetter(node, 'dragBoundFunc');
    factory.addGetter(node, 'draggable', false);
    node.prototype.isDraggable = node.prototype.getDraggable;

    var html = document.documentElement;
    html.addEventListener('mouseup', _dd._endDragBefore, true);
    html.addEventListener('touchend', _dd._endDragBefore, true);
    html.addEventListener('mouseup', _dd._endDragAfter, false);
    html.addEventListener('touchend', _dd._endDragAfter, false);

    return {
        self:_dd,
    }
});