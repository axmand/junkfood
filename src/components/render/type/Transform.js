/**
*   定义二维矩阵变形运算
*   @modules transform
*/

define(function () {

    var _transform = function () {
        this.m = [1, 0, 0,
                       1, 0, 0];
    }

    _transform.prototype = {
        /**
       * 平移 x ,y 距离
       * @method translate
       * @param {Number} x
       * @param {Number} y
       */
        translate: function (x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
        },
        /**
         * 按sx, sy比例 放大/缩小
         * @method scale
         * @param {Number} sx
         * @param {Number} sy
         */
        scale: function (sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
        },
        /**
         * 旋转rad弧度
         * @method rotate
         * @param {Number} rad  Angle in radians
         */
        rotate: function (rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        },
        /**
         * 获取平移的距离
         * @method getTranslation
         * @returns {Object} 2D point(x, y)
         */
        getTranslation: function () {
            return {
                x: this.m[4],
                y: this.m[5]
            };
        },
        /**
         * 斜乘
         * @method skew
         * @param {Number} sx
         * @param {Number} sy
         */
        skew: function (sx, sy) {
            var m11 = this.m[0] + this.m[2] * sy;
            var m12 = this.m[1] + this.m[3] * sy;
            var m21 = this.m[2] + this.m[0] * sx;
            var m22 = this.m[3] + this.m[1] * sx;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        },
        /**
         * 矩阵乘法，类型为 Transform 
         * @method multiply
         * @param {Transform} matrix
         */
        multiply: function (matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
        },
        /**
         * 求逆矩阵
         * @method invert
         */
        invert: function () {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
        },
        /**
         * 返回 Transform 内部 matrix
         * @method getMatrix
         */
        getMatrix: function () {
            return this.m;
        },
        /**
         * 通过Translation 设置shape的绝对位置
         * @method setAbsolutePosition
         * @author ericdrowell
         */
        setAbsolutePosition: function (x, y) {
            var m0 = this.m[0],
                m1 = this.m[1],
                m2 = this.m[2],
                m3 = this.m[3],
                m4 = this.m[4],
                m5 = this.m[5],
                yt = ((m0 * (y - m5)) - (m1 * (x - m4))) / ((m0 * m3) - (m1 * m2)),
                xt = (x - m4 - (m2 * yt)) / m0;

            this.translate(xt, yt);
        }

    }


    return {
        self:_transform,
    }

});