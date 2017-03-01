/**
*
*   
*
*/
define(['Shape', 'Utils', 'Factory', 'Animation'], function (Shape, Utils, Factory, Animation) {
    var Shape=Shape.self,
        extend = Utils.self.extend,
        Animation = Animation.self,
        Factory=Factory.self;

    var _sprite = function (config) {
        this.___init(config);
    }

    _sprite.prototype = {
        ___init: function (config) {
            Shape.call(this, config);
            this.className = 'Sprite';

            this.anim = new Animation();
            this.on('animationChange.kinetic', function () {
                // reset index when animation changes
                this.setIndex(0);
            });

            this.setDrawFunc(this._drawFunc);
            this.setDrawHitFunc(this._drawHitFunc);
        },
        _drawFunc: function (context) {
            var anim = this.getAnimation(),
                index = this.getIndex(),
                f = this.getAnimations()[anim][index],
                image = this.getImage();

            if (image) {
                context.drawImage(image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
            }
        },
        _drawHitFunc: function (context) {
            var anim = this.getAnimation(),
                index = this.getIndex(),
                f = this.getAnimations()[anim][index];

            context.beginPath();
            context.rect(0, 0, f.width, f.height);
            context.closePath();
            context.fillShape(this);
        },
        _useBufferCanvas: function () {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke();
        },
        start: function () {
            var that = this;
            var layer = this.getLayer();

            /*
             * animation object has no executable function because
             *  the updates are done with a fixed FPS with the setInterval
             *  below.  The anim object only needs the layer reference for
             *  redraw
             */
            this.anim.setLayers(layer);

            this.interval = setInterval(function () {
                that._updateIndex();
            }, 1000 / this.getFrameRate());

            this.anim.start();
        },
        stop: function () {
            this.anim.stop();
            clearInterval(this.interval);
        },
        _updateIndex: function () {
            var index = this.getIndex(),
                animation = this.getAnimation(),
                animations = this.getAnimations(),
                anim = animations[animation],
                len = anim.length;

            if (index < len - 1) {
                this.setIndex(index + 1);
            }
            else {
                this.setIndex(0);
            }
        },
    }

    return {
        self:_sprite,
    }

});