/**
*
*   提供绘制线的方法
*   @moudules Line
*/
define(['Shape', 'Utils', 'Factory'], function (Shape, Utils, Factory) {
    var Shape = Shape.self,
        Factory = Factory.self,
        getControlPoints = Utils.self._getControlPoints,
        expandPoints = Utils.self._expandPoints,
        extend = Utils.self.extend;

    var _line = function (config) {
        this.___init(config);
    }

    _line.prototype = {
        ___init: function (config) {
            var that = this;
            // call super constructor
            Shape.call(this, config);
            this.className = 'Line';

            this.on('pointsChange.kinetic tensionChange.kinetic closedChange.kinetic', function () {
                this._clearCache('tensionPoints');
            });
        },
        drawFunc: function (context) {
            var points = this.getPoints(),
                length = points.length,
                tension = this.getTension(),
                closed = this.getClosed(),
                tp, len, n, point;

            context.beginPath();
            //点格式为 [[x,y][x1,y1]]
            context.moveTo(points[0][0], points[0][1]);

            // tension
            if (tension !== 0 && length > 2) {
                tp = this.getTensionPoints();
                len = tp.length;
                n = closed ? 0 : 4;

                if (!closed) {
                    context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
                }

                while (n < len - 2) {
                    context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
                }

                if (!closed) {
                    context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
                }
            }
                // no tension
            else {
                for (n =1; n < length; n ++) {
                    context.lineTo(points[n][0], points[n][1]);
                }
            }

            // closed e.g. polygons and blobs
            if (closed) {
                context.closePath();
                context.fillStrokeShape(this);
            }
            // open e.g. lines and splines
            else {
                context.strokeShape(this);
            };
        },
        getTensionPoints: function () {
            return this._getCache('tensionPoints', this._getTensionPoints);
        },
        _getTensionPoints: function () {
            if (this.getClosed()) {
                return this._getTensionPointsClosed();
            }
            else {
                //return expandPoints(this.getPoints(), this.getTension());
                return Utils.self._expandPoints(this.getPoints(), this.getTension());
            }
        },
        _getTensionPointsClosed: function () {
            var p = this.getPoints(),
                len = p.length,
                tension = this.getTension(),
                firstControlPoints = getControlPoints(
                    p[len - 2],
                    p[len - 1],
                    p[0],
                    p[1],
                    p[2],
                    p[3],
                    tension
                ),
                lastControlPoints = getControlPoints(
                    p[len - 4],
                    p[len - 3],
                    p[len - 2],
                    p[len - 1],
                    p[0],
                    p[1],
                    tension
                ),
                middle = expandPoints(p, tension),
                tp = [
                        firstControlPoints[2],
                        firstControlPoints[3]
                ]
                    .concat(middle)
                    .concat([
                        lastControlPoints[0],
                        lastControlPoints[1],
                        p[len - 2],
                        p[len - 1],
                        lastControlPoints[2],
                        lastControlPoints[3],
                        firstControlPoints[0],
                        firstControlPoints[1],
                        p[0],
                        p[1]
                    ]);

            return tp;
        },
    }

    extend(_line, Shape);

    Factory.addGetterSetter(_line, 'closed', false);
    Factory.addGetterSetter(_line, 'tension', 0);
    Factory.addGetterSetter(_line, 'points');

    return {
        self:_line,
    }

});