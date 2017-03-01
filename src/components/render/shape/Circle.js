define(['Shape', 'Utils', 'Factory', 'Node'], function (Shape, Utils, Factory, Node) {

    var shape = Shape.self,
        factory = Factory.self,
        node = Node.self,
        extend = Utils.self.extend;

    var PIx2 = (Math.PI * 2) - 0.0001;  //修正chrome 18 数值计算bug

    var _circle = function (config) {
        this.___init(config);
    }

    _circle.prototype = {
        ___init: function (config) {
            // call super constructor
            shape.call(this, config);
            this.className = 'Circle';
        },
        drawFunc: function (context) {
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, PIx2, false);
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function () {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function () {
            return this.getRadius() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function (width) {
            node.prototype.setWidth.call(this, width);
            this.setRadius(width / 2);
        },
        // implements Shape.prototype.setHeight()
        setHeight: function (height) {
            node.prototype.setHeight.call(this, height);
            this.setRadius(height / 2);
        },
    }

    extend(_circle, shape);

    factory.addGetterSetter(_circle, 'radius', 0);

    return {
        self:_circle,
    }

});