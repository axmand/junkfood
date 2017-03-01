/**
*   定义简单的数学库
*   @author yellow date:2013/8/1 
*   @class Hmap.Core.Hmath
*/

define(function () {

    //阶乘缓存，
    var factorialCache = [
        1,  //0 的阶乘是1       //0
        1,                              //1
        2,                              //2
        6,                              //3
        24,                             //4
        120,                            //5
        720,                            //6
        5040,                           //7
        40320,                          //8
        362880,                         //9
        3628800,                        //10
        39916800,                       //11
        479001600,                      //12
        6227020800,                     //13
        87178291200,                    //14
        1307674368000,                  //15
        20922789888000,                 //16
        355687428096000,                //17
        6402373705728000,               //18
        121645100408832000,             //19
        2432902008176640000,            //20
    ],
    R = 6381372.083690828;

    var _h2dmath = function () {
        /**
        *   计算矩阵a与矩阵b的余项，返回1.矩阵a的不相同部分2.矩阵b的不相同部分
        *   @method matrixremainder
        *   @param {Array} a  
        *   @param {Array} b  
        *   @return {Object} A 返回:A不相同数组B相同数组 , B 返回:B相同A不相同的数组
        */
        var _matrixremainder = function (a, b) {
            var tempA = []; tempB = [];
            var resultA = [], resultB = [];
            var len = a.length > b.length ? a.length : b.length;
            for (var i = 0; i < len; i++) {
                if (b[i] !== undefined) {
                    tempA[b[i]] = true;
                }
                if (a[i] !== undefined) {
                    tempB[a[i]] = true;
                }
            }
            for (var j = 0; j < len; j++) {
                if (!tempA[a[j]] & a[j] !== undefined) {
                    resultA.push(a[j]);
                }
                if (!tempB[b[j]] & b[j] !== undefined) {
                    resultB.push(b[j]);
                }
            }
            return {
                A: resultA,
                B: resultB
            };
        };
        /**
        *   数组去重
        *   优点：速度快
        *   缺点：不能对形如[[0,1],[2,1]] 多维数组去重
        *   @method deleteRepeat
        *   @param {Array} array 输入待去重数组
        *   @return {Array} array 返回去重后的数组
        */
        var _deleteRepeat = function (array) {
            return array.reverse().join(",").match(/([^,]+)(?!.*\1)/ig).reverse();
        };
        /**
        *   数组去重
        *   优点：数组内的元素可以为复杂对象和素组
        *   缺点：效率相对单元素去重较慢
        *   @method deleteRepeatN 
        *   @param {Array} array 输入待去重数组
        *   @return {Array} array 返回去重后的数组
        */
        var _deleteRepeatN = function (array) {
            var a = [], b = [], len = array.length;
            for (var i = 0; i < len; i++) {
                if (a[array[i]]) {
                    continue;
                }
                else {
                    a[array[i]] = true;
                    b.push(array[i]);
                }
            }
            return b;
        };
        /*
        *   根据对象的标识属性去重
        *   @method deleteRepeatNByAttr
        */
        var _deleteRepeatNByAttr = function (array, attr) {
            var a = [], b = [], len = array.length;
            for (var i = 0; i < len; i++) {
                if (a[array[i][attr]]) {
                    continue;
                }
                else {
                    a[array[i][attr]] = true;
                    b.push(array[i]);
                }
            }
            return b;
        }
        /**
        *   求直线的几分之几点
        *   @method scalePoint
        *   @param {Array} point1  [x,y]
        *   @param {Array} point2  [x,y]
        *   @param {Float} sacle  百分比值
        *   @return {Array} point [x,y]
        */
        var _scalePoint = function (point1, point2, scale) {
            return [point1[0] + (point2[0] - point1[0]) * scale, point1[1] + (point2[1] - point1[1]) * scale];
        }
        /**
        *   计算 point1 和 point2 连线与x轴的夹角
        *   @method angle
        *   @param {Array} point1
        *   @param {Array} point2 
        *   @return {float} raidus 弧度
        */
        var _angle = function (point1, point2) {
            var angle;
            //
            if (point2[0] === point1[0]) {
                if (point2[1] >= point1[1])
                    angle = -Math.PI / 2;
                else
                    angle = Math.PI / 2;
            } else
                angle = Math.atan2(point1[1] - point2[1], point2[0] - point1[0]);//返回正切值是两个指定值商的角度
            if (angle < 0)
                angle += 2 * Math.PI;
            //
            return angle * 180 / Math.PI;
        }
        /**
        *   计算连点连线的(p1,p2)间，点point法线上高度为height的点,
        *   way表示方向
        *   @method vertex
        *   @param point1 {Array}
        *   @param point2 {Array}
        *   @param point {Array}
        *   @param hegith {Number} 法线高度
        *   @param way {Bool} 法线方向
        *   @param degree {Number} 倒角度数，默认法线 90度
        */
        var _vertex = function (point1, point2, point, height, way, degree) {
            var x = 0,
                y = 0,
                angle = _angle(point1, point2) + 90;
            if (angle > 360) angle -= 360;
            var flag = way ? 1 : -1;
            x = point[0] + flag * height * Math.cos(angle * Math.PI / 180);
            y = point[1] - flag * height * Math.sin(angle * Math.PI / 180);
            return [x, y];
        }
        /**
        *   判断point3在point2和point1连线的左侧还是右侧
        *   @method optionWay
        *   @return {bool} true为右侧，false为左侧
        */
        var _optionWay = function (point1, point2, point3) {
            var a = point2[1] - point1[1],
                b = point1[0] - point2[0],
                c = point1[1] * (point2[0] - point1[0]) - point1[0] * (point2[1] - point1[1]);
            var result = a * point3[0] + b * point3[1] + c;
            return result > 0;
        }
        /**
        *   计算两点欧式距离
        *   @method distance
        *   @param {Array} point1 
        *   @param {Array} point2
        *   @return {Number} distance 欧式距离结果
        */
        var _distance = function (point1, point2) {
            return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
        }
        /**
        *   度转弧度
        *   @method toRadians
        *   @param {Number} degree
        *   @reutrn {float} 对应弧度值
        */
        var _toRadians = function (degree) {
            return degree * Math.PI / 180;
        }
        /**
        *   计算两点投影距离
        *   Haversine implementation 方法
        *   @method proDistacne
        *   @method {Array} point1
        *   @method {Array} point2
        *   @retrun {Number} 两点球面距离,单位米
        */
        var _proDistance = function (point1, point2) {
            var lat1 = point1[1], lat2 = point2[1],
                log1 = point1[0], log2 = point2[0],
                deltaLatitude = _toRadians(lat2 - lat1),
                deltaLongitude = _toRadians(log2 - log1);
            //
            lat1 = _toRadians(lat1);
            lat2 = _toRadians(lat2);
            //
            var a = Math.sin(deltaLatitude / 2) *
                Math.sin(deltaLatitude / 2) +
                Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLongitude / 2) *
                Math.sin(deltaLongitude / 2);
            //
            var c = 2 * Math.atan2(Math.sqrt(a),
            Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }
        /**
        *   方位角计算
        *   @method azimuth
        *   @param {Array} point1
        *   @param {Array} point2
        *   @return 方位角弧度
        */
        var _azimuth = function (point1, point2) {
            if (Math.abs(point1[0] - point2[0]) < Math.pow(10, -5)) return 0;
            if (point1[1] === point2[1]) return 0;
            var az = Math.atan((point1[0] - point2[0]) / point1[1] - point2[1]);
            //屏幕像素坐标的y 和 经纬度的y是相反的
            if (point1[1] < point2[1]) az += Math.PI;
            if (az < 0) az += Math.PI * 2;
            return az;
        }
        /**
        *   计算距线段起点距离为l1的一点及该点某侧与该线段垂直距离为l2的点
        *   @method linePerpenPoints
        *   @param {Array} point0 线段起点
        *   @param {Array} point1 线段终点
        *   @param {Number} l1  
        *   @param {Number} l2 
        *   @param {Array} onPoint 
        *   @param {Array} perPoint 
        *   @param {Boolean} left  是否在线段左侧
        *   @reutrn {Array} 
        */
        var _linePerpenPoints = function (point0, point1, l1, l2, onPoint, perPoint, left) {
            var len = _distance(point0, point1),
                r = l1 / len;
            onPoint[0] = point0[0] * (1 - r) + point1[0] * r;
            onPoint[1] = point0[1] * (1 - r) + point1[1] * r;
            //计算距离点onPoint l2的点
            var angle = _azimuth(point1, point0),
                xi = left ? 1 : -1;
            perPoint[0] = onPoint[0] - xi * l2 * Math.cos(angle);
            perPoint[1] = onPoint[1] + xi * l2 * Math.sin(angle);
            return perPoint;
        }
        /**
        *   计算path的总长度
        *   @method pathLength
        *   @param {Array} points 点集合，形如  [ [],[],[],... ]
        *   @return {Number} 总长度（欧式距离）
        */
        var _pathLength = function (points) {
            var tollen = 0;
            for (var i = 0, len = points.length - 1; i < len; i++)
                tollen += _distance(points[i], points[i + 1]);
            return tollen;
        }
        /**
        *   已知曲线上的点，曲线长度，求出在曲线的scale*长度出的点坐标及其索引
        *   @method gainPt
        *   @param {Array} points 形如[ [],[],[]... ] 引用传递，如需要点所在索引，传入此空值 : ref index
        *   @param {Int} length 长度
        *   @param {float} scale 比例
        *   @param {float} index
        *   @return {Array} 
        */
        var _gainPt = function (points, length, scale, index) {
            var ptIndex = 0, gainPoint = [], i;
            var count = points.length,
                lengthNew = length * scale,
                num = 0, disi0 = 0, k = 0, t = 0, x = 0, y = 0, x0 = 0, y0 = 0, x1 = 0, y1 = 0, newdis = 0, tdis = 0;
            pti = [], pti0 = [];
            for (i = 1; i < count; i++) {
                tdis = _distance(points[i], points[i - 1]);
                num += tdis;
                if (num > lengthNew) {
                    pti = points[i];
                    disi0 = (num - tdis) - lengthNew;
                    pti0 = points[i - 1];
                    ptIndex = i - 1;
                    x0 = pti0[0];
                    y0 = pti0[1];
                    x1 = pti[0];
                    y1 = pti[1];
                    k = (y0 - y1) / (x0 - x1);
                    t = disi0 / (Math.sqrt(1 + k * k));
                    x = x0 + t;
                    y = y0 + t * k;
                    gainPoint = [x, y];
                    newdis = disi0 + _distance(points[i - 1], gainPoint);
                    break;
                }
            }
            //传入过索引，就给索引赋值
            index = !!index ? ptIndex : -1;
            return gainPoint;
        }
        /**
        *   计算形如B字母的曲线
        *   @method bTypeline
        *   @param {Array} cpts 控制点集合
        *   @param {Array} 曲线点集合
        */
        var _bTypeline = function (ctps) {
            var px = [], py = [],
                ax = [], ay = [],
                bx = [], by = [],
                cx = [], cy = [],
                k = [], i,
                mat = [[], [], []],   //二维矩阵(3x3)
                amagOld, amag;
            var len = ctps.length;
            for (i = 0; i < len; i++) {
                px[i] = ctps[i][0];
                py[i] = ctps[i][1];
            }
            //vector A
            for (i = 0; i < len - 1; i++) {
                ax[i] = px[i + 1] - px[i];
                ay[i] = py[i + 1] - py[i];
            }
            //k
            amagOld = Math.sqrt(ax[0] * ax[0] + ay[0] * ay[0]);
            for (i = 0; i < len - 2; i++) {
                amag = Math.sqrt(ax[i + 1] * ax[i + 1] + ay[i + 1] * ay[i + 1]);
                k[i] = amagOld / amag;
                amagOld = amag;
            }
            //
            k[len - 2] = 1;
            //matrix
            for (i = 1; i < len - 1; i++) {
                mat[0][i] = 1;
                mat[1][i] = 2 * k[i - 1] * (1 + k[i - 1]);
                mat[2][i] = k[i - 1] * k[i - 1] * k[i];
            }
            mat[1][0] = 2;
            mat[2][0] = k[0];
            mat[0][len - 1] = 1;
            mat[1][len - 1] = 2 * k[len - 2];
            //b vector
            for (i = 1; i < len - 1; i++) {
                bx[i] = 3 * (ax[i - 1] + k[i - 1] * k[i - 1] * ax[i]);
                by[i] = 3 * (ay[i - 1] + k[i - 1] * k[i - 1] * ay[i]);
            }
            bx[0] = 3 * ax[0];
            by[0] = 3 * ay[0];
            bx[len - 1] = 3 * ax[len - 2];
            by[len - 1] = 3 * ay[len - 2];
            //
            _matrixSolve(bx, mat);
            _matrixSolve(by, mat);
            //
            for (i = 0; i < len - 1; i++) {
                cx[i] = k[i] * bx[i + 1];
                cy[i] = k[i] * by[i + 1];
            }
            //
            var count = 0, ndiv, ptx = [], pty = [], t, f, g, h, num;
            for (var i = 0; i < len - 1; i++) {
                num = parseInt(Math.max(Math.abs(ax[i]), Math.abs(ay[i])));
                ndiv = num > 200 ? 200 : num + 1;
                ptx[count] = px[i];
                pty[count] = py[i];
                count++;
                for (var j = 1; j <= ndiv; j++) {
                    t = j / ndiv;
                    f = t * t * (3 - 2 * t);
                    g = t * (t - 1) * (t - 1);
                    h = t * t * (t - 1);
                    ptx[count] = (px[i] + ax[i] * f + bx[i] * g + cx[i] * h);
                    pty[count] = (py[i] + ay[i] * f + by[i] * g + cy[i] * h);
                    count++;
                }
            }
            var bTypeline = [];
            for (var i = 0; i < ptx.length; i++) {
                bTypeline.push([ptx[i], pty[i]]);
            }
            return bTypeline;
        }
        /**
        *   求逆矩阵，存放在b矩阵里
        *   @method matrixSolve
        *   @param {Array} b 结果矩阵
        *   @param {Array} mat 待求解矩阵
        *   @param {Int} 矩阵元素个数
        */
        var _matrixSolve = function (b, mat, len) {
            var len = len || b.length;
            var work = [], workB = [];
            for (var i = 0; i < len; i++) {
                workB[i] = work[i] = b[i] / mat[1][i];
            }
            for (var j = 0; j < 10; j++) {
                work[0] = (b[0] - mat[2][0] * workB[1]) / mat[1][0];
                for (var i = 1; i < len - 1; i++) {
                    work[i] = (b[i] - mat[0][i] * workB[i - 1] - mat[2][i] * workB[i + 1]) / mat[1][i];
                }
                work[len - 1] = (b[len - 1] - mat[0][len - 1] * workB[len - 2]) / mat[1][len - 1];
                for (var i = 0; i < len; i++) {
                    workB[i] = work[i];
                }
            }
            for (var i = 0; i < len; i++) {
                b[i] = work[i];
            }
        }
        /**
        *   计算N的阶乘，20以内采用缓存值
        *   @method factorial
        *   @param {Number} n 
        *   @return {Int} 
        */
        var _factorial = function (n) {
            var num = factorialCache[n];
            if (!!num) return num;
            num = 1;
            for (var i = 1; i <= n; i++) num *= i;
            //不存在则缓存起来，备下次使用
            factorialCache[n] = num;
            return num;
        }
        /**
        *   计算C m n （阶乘）
        *   @param {Int} n 
        *   @param {Int} m
        *   @param {Int} 
        */
        var _binomialFactor = function (n, m) {
            return _factorial(n) / ((_factorial(m) * _factorial(n - m)));
        }
        /**
        *   @计算贝瑟尔曲线
        *   @method bzLine
        *   @param ctps {Array} 贝瑟尔曲线控制点
        */
        var _bzLine = function (ctps) {
            //两个控制点不能计算贝瑟尔曲线
            if (ctps.length < 2) return ctps;
            var n = ctps.length - 1,
                x, y,
            i, j, bsPoints = [],
            step = 0.01;                            //恒定线性值
            for (i = 0; i <= 1; i += step) {
                x = 0;
                y = 0;
                for (j = 0; j <= n; j++) {
                    var num1 = _binomialFactor(n, j);
                    var num2 = Math.pow(i, j);
                    var num3 = Math.pow(1 - i, n - j);
                    x += num1 * num2 * num3 * ctps[j][0];
                    y += num1 * num2 * num3 * ctps[j][1];
                }
                bsPoints.push([x, y]);
            }
            bsPoints.push(ctps[n]);
            return bsPoints;
        }
        /** grid内置函数
         *   author:acmeism
         *   RosettaCodeData-github
         *   @method clipPolygon
         *   @params [Array] subjectPolygon 输入多边形 
         *       形如:"[[50, 150], [200, 50], [350, 150], [350, 300], [250, 300], [200, 250], [150, 350], [100, 250], [100, 200]]"
         *   @params [Array} clipPolygon 裁剪区域矩形，Mask 
         *       形如:"[[100, 100], [300, 100], [300, 300], [100, 300]]"
         *
         */
        var _clipPolygon = function (subjectPolygon, clipPolygon) {
            var cp1, cp2, s, e;
            var inside = function (p) {
                return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0]);
            };
            var intersection = function () {
                var dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]],
                    dp = [s[0] - e[0], s[1] - e[1]],
                    n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                    n2 = s[0] * e[1] - s[1] * e[0],
                    n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
                return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
            };
            var outputList = subjectPolygon;
            cp1 = clipPolygon[clipPolygon.length - 1];
            //
            var i, j, leni,
                lenj = clipPolygon.length;
            for (j = 0; j < lenj; j++) {
                var cp2 = clipPolygon[j],
                    inputList = outputList;
                outputList = [];
                leni = inputList.length;
                s = inputList[leni - 1];
                for (i = 0; i < leni; i++) {
                    var e = inputList[i];
                    if (inside(e)) {
                        if (!inside(s)) {
                            outputList.push(intersection());
                        }
                        outputList.push(e);
                    }
                    else if (inside(s)) {
                        outputList.push(intersection());
                    }
                    s = e;
                }
                cp1 = cp2;
            }
            return outputList;
        }
        /**
         *  Cohen-Sutherland裁剪算法
         *  编码方式如下：
         *  1001 | 1000 | 1010
         * -----------------------
         *  0001 | 0000 | 0010
         * -----------------------
         *  0101 | 0100 | 0110
         *  编码方式
         *  @method clipPolyline
         *  @param {Array} subLineString  被切割折线
         *  @param {Hmap.BaseType.Bound} bound bound.toArray() 裁剪区域边界
         */
        var _clipPolyline = function (subLineString, bound) {
            var TOP = 8, LEFT = 1, RIGTH = 2, BOTTOM = 4; //方位编码
            //根据x,y做编码方位判断
            var encode = function (x, y) {
                var c = 0;
                if (x < xl)
                    c |= LEFT;
                if (x > xr)
                    c |= RIGTH;
                if (y < yb)
                    c |= BOTTOM;
                if (y > yt)
                    c |= TOP;
                return c;
            }
            //
            var clipLine = function (start, end) {
                var code, x, y, //交点坐标
                    x1 = start[0], x2 = end[0], y1 = start[1], y2 = end[1],
                    code1 = encode(x1, y1),
                    code2 = encode(x2, y2);
                //线不全在窗口内,分多次判断
                while (code1 != 0 || code2 != 0) {
                    //1.先在窗口外,返回一个空数组
                    if ((code1 & code2) != 0)
                        return [];
                    code = code1;
                    //找窗口外的点
                    if (code1 == 0) code = code2;
                    //点在左边
                    if ((LEFT & code) != 0) {
                        x = xl;
                        y = y1 + (y2 - y1) * (xl - x1) / (x2 - x1);
                    }
                        //点在右边
                    else if ((RIGTH & code) != 0) {
                        x = xr;
                        y = y1 + (y2 - y1) * (xr - x1) / (x2 - x1);
                    }
                        //点在下面
                    else if ((BOTTOM & code) != 0) {
                        y = yb;
                        x = x1 + (x2 - x1) * (yb - y1) / (y2 - y1);
                    }
                    else if ((TOP & code) != 0) {
                        y = yt;
                        x = x1 + (x2 - x1) * (yt - y1) / (y2 - y1);
                    }
                    //
                    if (code == code1) {
                        x1 = x;
                        y1 = y;
                        code1 = encode(x, y);
                    }
                    else {
                        x2 = x;
                        y2 = y;
                        code2 = encode(x, y);
                    }
                }
                return [[x1, y1], [x2, y2]];
            }
            //正式裁剪
            var clipLines = [], i, temp,
                xl = bound.minX,//左上角x坐标
                xr = bound.maxX,//右下角x坐标
                yt = bound.maxY,//右上角y坐标
                yb = bound.minY,//右下角y坐标
                len = subLineString.length;
            for (i = 0; i < len; i++) {
                var len2 = subLineString[i].length;
                for (var j = 0; j < len2 - 1; j++) {
                    start = subLineString[i][j];
                    end = subLineString[i][j + 1];
                    var cliped = clipLine(start, end);
                    clipLines = clipLines.concat(cliped);
                }
            }
            return clipLines;
        }

        /**
        *   生成guid
        *   @method guid
        */
        var _guid = function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
        }


        return {
            guid: _guid,
            matrixremainder: _matrixremainder,
            deleteRepeatN: _deleteRepeatN,
            deleteRepeat: _deleteRepeat,
            clipPolygon: _clipPolygon,
            clipPolyline: _clipPolyline,
            deleteRepeatNByAttr: _deleteRepeatNByAttr,
            scalePoint: _scalePoint,
            vertex: _vertex,
            angle: _angle,
            optionWay: _optionWay,
            distance: _distance,
            proDistance:_proDistance,
            azimuth: _azimuth,
            linePerpenPoints: _linePerpenPoints,
            pathLength: _pathLength,
            bzLine: _bzLine,
            bTypeline: _bTypeline,
            gainPt: _gainPt
        }

    }

    /**
     * }{ yellow:可以考虑使用Duff环或者Andrew B.King所著的 Duff 改进装置
     *  
     * 任务队列
     * 实现复杂计算任务队列化计算，防止浏览器无响应
     * @class TaskQueue
     * @param option {Object} 
     *  { 
     *      interval ,  时间间隔 
     *      delay,     执行延迟
     *  }
     */
    var _taskQueue = function (option) {
        var _option = option || {};
        this.todo = [];
        this.interval = _option.interval || 25;
        this.delay = _option.delay || 25;
    }

    _taskQueue.prototype.chunk = function (array, process, context, callback) {
        this.todo = this.todo.concat(array);
        this.result = [];
        var that = this, start;
        setTimeout(function () {
            do {
                start = +new Date();  //记录计算起始时间
                var result = process.call(context, that.todo.shift());
                !!result ? that.result.push(result) : null;
            } while (that.todo.length > 0 && (+new Date() - start < that.interval) && that.interval < 16);
            if (that.todo.length > 0) {
                setTimeout(arguments.callee, that.interval);
            }
            else {
                var results = that.result.concat();
                that.result = [];
                !!callback ? callback.call(context, results) : null;
            }
        }, that.delay); //
    }

    _taskQueue.prototype.stop = function () {
        this.todo = [];
    }

    _taskQueue.prototype.isRunning = function () {
        return this.todo.length > 0;
    }

    /**
    *   用法示例 : transition.animate(viewbox, 400,function (index) { },function () { });
    *   传入element,做相应的动作，25ms间隔一次
    *   @class transition
    */
    var _transition = function () {
        this._taskChunk = new _taskQueue({
            interval: 16,
            delay: 16
        });//执行队列
    }

    /**
     *  动画
     *  @method animate
     *  @param timer {Number} 动画总时长
     *  @param step {Function} 每步执行动作
     *  @param callabck {Function} 执行动作结束后回调
     *  @param context {Object} 上下文
     */
    _transition.prototype.animate = function (element, timer, step, callback, context) {
        var len = Math.floor(timer / 16);
        i = 0,
        array = [],
        _context = context || this;
        for (i = 0; i < len; i++) {
            array.push(i);
        }
        //动画队列
        this._taskChunk.chunk(
            array,
            function (index) {
                step.call(_context, index);
            },
            null,
            function () {
                !!callback ? callback.call() : null;
            });
    }

    var mTransition = new _transition();
    //实例化后的单个对象
    var mH2dmath = new _h2dmath();

    return {
        h2dmath: _h2dmath,
        mH2dmath: mH2dmath,
        taskQueue: _taskQueue,
        transition: mTransition,        //实例化后的animation，适合执行单任务用
        sTransition: _transition         //未实例化animation,适合同时执行多任务用
    }
});