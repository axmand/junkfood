/**
*   多边形与矩形裁剪算法
*   Sutherland-Hodgman算法(逐边裁剪法)
*   分割处理策略：将多边形关于矩形窗口的裁剪分解为：
*       多边形关于窗口四边所在直线的裁剪
*       多边形裁剪算法的关键在于，通过裁剪，要保持窗口
*       内多边形的边界部分，而且要将窗框的有关部分按
*       一定次序插入多边形的保留边界之间，从而使裁剪
*       后的多边形的边仍然保持封闭状态。
*   x/offsetX:表示距离屏幕左上角(0,0)的left像素距离(style.left)
*   y/offsetY:表示距离屏幕左上角(0,0)的top像素距离(style.top)
*   地图区域瓦片格网划分
*   grid类 实现功能：
*   1.根据选择的格网类型生成grid格网
*   2.内部转换格网类型
*   {   
*       loglat:{loglat}
*       domXY:{}         //存储dom元素的 top、left偏移
*       level:{num}
*       width:              //地图区域-宽
*       height:             //地图区域-高
*   }
*   @author yellow date 2014/1/16
*   @class Hmap.BaseType.Grid
*/

define(['epsg3857', 'Bound', 'Hmath', 'BaseTile', 'Hobject'],
    function (epsg3857, Bound, Hmath, BaseTile, Hobject) {
            //static，grid默认采用3857投影
        var r = epsg3857.pole(); //地球半周长
        //
        var each = Hobject.BaseFunc.each,
            extend = Hobject.BaseFunc.extend,
            ceil = Math.ceil,
            isArray = Hobject.BaseFunc.isArray,
            isObject=Hobject.BaseFunc.isObject,
            floor = Math.floor,
            atan = Math.atan,
            pow = Math.pow;

        var _grid = function (args) {
            var _args = args || {};
            BaseTile.call(this, _args);
            //初始化mapObj区域长宽
            this.width = _args.width || 0;
            this.height = _args.height || 0;
            //引用传递
            this.domXY = _args.domXY; 
            //elements集合
            this.elements = null;
            this.addElements = null;
            this.removeElements = null;
            this.level = _args.level || 10;
            this._ini();
        }
        /*
        *   继承BaseTile属性
        */
        extend(_grid, BaseTile);
        /*
        *   @method _ini 根据参数初始化格网
        * 格网初始化方式：采用谷歌瓦片编号算法格式化格网
        * 1.计算点与格网的offsetxy
        * 2.计算width,height的瓦片编号，组合成矩阵集合
        * 3.将pi,pj矩阵反算为bound（经纬度边界）存储起来
        * 【需要存储各个缩放层级的地面分辨率，即每个像素代表多少经纬度】
        */
        _grid.prototype._ini = function () {
            var level = this.level,
               loglat = this.args.loglat,
               //1.计算点与格网的offsetxy
               proXY = this.forwardPosition(level, loglat);
            //2计算width,height的瓦片编号，组合成矩阵集合
            //3.将pi,pj矩阵反算为bound（经纬度边界）存储起来
            this.elements = this._calcuteAround({
                level: level,
                pi: proXY.pi,
                pj: proXY.pj,
                absX: -proXY.offsetX, //top
                absY: -proXY.offsetY, //left
            });
        }
        /*
         * 计算element的bound信息
         *  @param {Object} element
         * { pi,pj,level }
         */
        _grid.prototype._calcuteEleBound = function (level, pi, pj) {
            //计算起始经纬度和终止经纬度，得到bound信息即可
            var s_pos = this.inversePosition({
                level: level,
                pi: pi,
                pj: pj,
                offsetX: 0,
                offsetY: 0,
            });
            var e_pos = this.inversePosition({
                level: level,
                pi: pi,
                pj: pj,
                offsetX: 256,
                offsetY: 256,
            });
            //返回矩形边界
            return new Bound(s_pos.lat, s_pos.log, e_pos.lat, e_pos.log);
        }
        /*
        *   构建瓦片区域矩阵
         * @param element {Object} 
         * {level,pi,pj,absX,absY}
         */
        _grid.prototype._calcuteArea = function (element) {
            var midx = this.midx, tpi, tpj, tid, x, y,
                elements = {},
                level = element.level,
                xnum = ceil(this.height / 256 / midx),
                ynum = ceil(this.width / 256 / midx);
            this.info.targetPosition = element;
            var offlayY = element.absY || 0,  //top
                offlayX = element.absX || 0;   //left
            this.info.lastPiPj = {
                pi: 0,      //top,
                pj: 0,       //left
            };
            this.info.lastmatrix.length = 0;
            for (var i = 0; i <= xnum; i++) {
                for (var j = 0; j <= ynum; j++) {
                    tpj = element.pj + i;
                    tpi = element.pi + j;
                    x = offlayY + i * 256;
                    y = offlayX + j * 256;
                    tid = level + "_" + tpj + "_" + tpi;
                    elements[tid] = {
                        bound: this._calcuteEleBound(level, tpi, tpj),
                        pi: tpi,
                        pj: tpj,
                        x: x,
                        y: y,
                        level: level,
                    };
                    this.info.lastmatrix.push([i, j]); //初始化位置矩阵
                }
            }
            return elements;
        }
        /*
         * element{ level,pi,pj,absX,absY}
         */
        _grid.prototype._calcuteAround = function (element) {
            var domX = this.domXY.x,  //left
                domY = this.domXY.y,    //top
                level = element.level,
                absX = element.absX,
                absY = element.absY;
            var top = absY + domY,
                left = absX + domX,
                _t = ceil(top / 256),
                _l = ceil(left / 256);
            var plog = element.pj - _t,
                plat = element.pi - _l,
                poslog = absY - _t * 256,
                poslat = absX - _l * 256;
            //瓦片相对于layer的偏移  }{ 修正
            this.info.lyrOffX = poslat;
            this.info.lyrOffY = poslog;
            return this._calcuteArea({
                level: level,
                pi: plat,
                pj: plog,
                absX: poslat,
                absY: poslog,
            });
        }
        /**
         *  屏幕平移x,y个像素（每次传递数值为：与起点div左上角的距离）
         *  offsetX和offsetY为原始点移动后与div左上角（0，0）的相对位置关系
         *  @method move
         *  @param offsetX {Number} 相对于屏幕(0,0)点偏移left个像素
         *  @param offsetY {Number} 相对于屏幕(0,0)点偏移top个像素
         */
        _grid.prototype.move = function (offsetX, offsetY) {
            var pi = 0, pj = 0;
            var cX = this.info.lastPiPj.pi * 256 + this.info.lyrOffY;
            var cY = this.info.lastPiPj.pj * 256 + this.info.lyrOffX;
            if (offsetX < cX && offsetY < cY) {         //1象限
                pi = -1 * ceil((cX - offsetX) / 256);
                pj = -1 * ceil((cY - offsetY) / 256);
            } else if (offsetX < cX && offsetY > cY) {  //2象限
                pi = -1 * ceil((cX - offsetX) / 256);
                pj = floor((offsetY - cY) / 256);
            } else if (offsetX > cX && offsetY < cY) {   //4象限
                pi = floor((offsetX - cX) / 256);
                pj = -1 * ceil((cY - offsetY) / 256);
            } else if (offsetX > cX && offsetY > cY) {   //3象限
                pi = floor((offsetX - cX) / 256);
                pj = floor((offsetY - cY) / 256);
            }
            var element = this.info.targetPosition,
                level = element.level,                           //pi-lat,pj-log
                plog = element.pj,
                plat = element.pi,
                tpi, tpj, tid;
            //找到i,j编号的瓦片
            var a = this.info.lastmatrix, alen = a.length, b = [], addElements = {}, remvoeElements = [];
            for (var i = 0; i < alen; i++) {
                b.push([a[i][0] + pi, a[i][1] + pj]);
            }
            //result为本次需要载入的新瓦片
            var arrays = this.__h2dmath.matrixremainder(b, a),
                  addtiles = arrays.A,
                  deletetiles = arrays.B;
            offsetY = this.info.lyrOffY || 0;
            offsetX = this.info.lyrOffX || 0;
            //新增tile集合
            var addtile = addtiles.shift();
            while (!!addtile) {
                tpi = plat + addtile[1];
                tpj = plog + addtile[0];
                tid = level + "_" + tpj + "_" + tpi;
                x = (addtile[0] + this.info.lastPiPj.pi) * 256 + offsetY;  //top
                y = (addtile[1] + this.info.lastPiPj.pj) * 256 + offsetX;    //left
                addElements[tid] = {
                    bound: this._calcuteEleBound(level, tpi, tpj),
                    pi: tpi,
                    pj: tpj,
                    x: x,  //top
                    y: y,  //left
                    level: level,
                }
                this.elements[tid] = this.elements[tid] || addElements[tid];//赋值
                addtile = addtiles.shift();
            }
            var deletetile = deletetiles.shift();//删除
            while (deletetile !== undefined) {
                tpi = plat + deletetile[1];
                tpj = plog + deletetile[0];
                tid = level + "_" + tpj + "_" + tpi;
                remvoeElements.push(tid);
                if (!!this.elements[tid]) delete this.elements[tid];
                deletetile = deletetiles.shift();
            }
            this.info.lastPiPj.pi += pi;
            this.info.lastPiPj.pj += pj;
            this.info.targetPosition = {
                level: level,
                pi: plat + pj,
                pj: plog + pi,
                absX: element.absX + pj * 256,
                absY: element.absY + pi * 256,
            };
            this.addElements = addElements;
            this.removeElements = remvoeElements;
        }
        /**
        *   缩放格网,重新计算Element
        *   @method zoom
        *   @param zoom {Number} 缩放参数
        *   @pram wheelEvent {DocumentEvent} 鼠标wheel事件
        */
        _grid.prototype.zoom = function (zoom, wheelEvent) {
            var mapPosition = this.mapPosition(wheelEvent);
            var _zoom = this.level + zoom;
            if (_zoom < this.zoomMin || _zoom > this.zoomMax)
                return false;
            this.level = _zoom;
            var tileposition = this.forwardPosition(_zoom, mapPosition.loglat);
            var level = _zoom,
                plog = tileposition.pj,
                plat = tileposition.pi,
                posX = mapPosition.absXY.x - tileposition.offsetX,
                posY = mapPosition.absXY.y - tileposition.offsetY;
            this.elements = this._calcuteAround({
                level: level,
                pi: plat,
                pj: plog,
                absX: posX,
                absY: posY,
            });
            return {
                level: level,                       //缩放后的层级
                mapPosition:mapPosition //鼠标点的经纬度和距离地图边缘的像素
            }
        }
        /*
         *  计算鼠标所在瓦片编号
         *  x-left,y-top
         */
        _grid.prototype._cvtaget = function (x, y) {
            var ofx = 0, ofy = 0, that = this, id, dx, dy;
            //修正后的算法
            var element, name;
            for (var attr in this.elements) {
                name = attr;
                element = this.elements[name];
                if (!!element) break;
            }
            //
            var disX = x - element.y,
                disY = y - element.x,
                di = Math.floor(disX / 256),
                dj = Math.floor(disY / 256),
                level = element.level;
            id = level + '_' + (element.pj + dj).toString() + '_' + (element.pi + di).toString();
            ofx = disX - di * 256;
            ofy = disY - dj * 256;
            ofx = ofx > 0 ? ofx : (256 + ofx);
            ofy = ofy > 0 ? ofy : (256 + ofy);
            dx = element.x + dj * 256;
            dy = element.y + di * 256;
            //
            return {
                id: id,
                offx: ofx,
                offy: ofy,
                x: dx,
                y:dy,
            }
        }
        /**
        *   屏幕坐标转换为经纬度坐标
        *   内置mousewheel事件调用
        *   @param wheelElement {DocumentEvent} 
        *   @method mapPosition
        */
        _grid.prototype.mapPosition = function (wheelElement) {
            var target = wheelElement.target || {},
                id,
                order, offX, offY, element, offlayX, offlayY,
                level,
                plat,  //pi
                plog; //pj
            var left = this.domXY.x, top = this.domXY.y,
                orderInfo = this._cvtaget(wheelElement.clientX - left, wheelElement.clientY - top);
            id = orderInfo.id;
            if (!id) return;
            order = id.split('_');
            element = this.elements[id];
            offX = orderInfo.offx;
            offY = orderInfo.offy;
            offlayX = orderInfo.y;
            offlayY = orderInfo.x;
            //}
            absX = offlayX + offX;
            absY = offlayY + offY;
            //
            level = order[order.length - 3];
            plog = order[order.length - 2];    //pi
            plat = order[order.length - 1];     //pj
            loglat = this.inversePosition({
                level: level,
                pi: plat,
                pj: plog,
                offsetX: offX,
                offsetY: offY,
            });
            return {
                loglat: loglat,
                absXY: { x: absX, y: absY },
            }
        }
        /**
        *   屏幕像素坐标转换为经纬度坐标
        *   计算clientXY的方法，使用Hmap提供的getOffsetXY，传入
        *   鼠标event事件即可。例如：
        *   clientXY=Hmap.Util.getOffsetXY(evt);
        *   @method mapPosition2 
        *   @param point {Array} [left,top] 
        *   @returens loglat {Loglat} 
        */
        _grid.prototype.mapPosition2 = function (point) {
            var wheelElement = {};
            wheelElement.clientX = point[0];
            wheelElement.clientY = point[1];
            return (this.mapPosition(wheelElement)||{}).loglat;
        }
        /**
         *  }{ yellow 2014/8/29 修正
         * ，给出的坐标是相对于mapObj
         *  div容器左上角的offsetXY位置
         *  传入经纬度坐标，换算为屏幕坐标
         *  换算成屏幕绝对坐标
         *  @method screenPosition
         *  @param loglat {Loglat} 传入经纬度坐标
         */
        _grid.prototype.screenPosition = function (loglat) {
            var level = this.level,
                __lstPt = this.info.targetPosition,
                _domX = __lstPt.absX,
                _domY = __lstPt.absY,
                _x = __lstPt.pj, _y = __lstPt.pi,
                proXY = this.forwardPosition(level, loglat),
                dx = proXY.pj - _x, dy = proXY.pi - _y;
            var absX = dx * 256 + parseInt(_domY) + proXY.offsetY + this.domXY.y,
                absY = dy * 256 + parseInt(_domX) + proXY.offsetX + this.domXY.x;
            return {
                x: absY,    //x为top
                y: absX,    //y为left
            }
        }
        /**
         *  获取当前缩放层级下的resolution
         *  如果不存在此mapScale，则返回-1
         *  @method getResolution
         *  @returns level {Number}
         */
        _grid.getResolution = function (level) {
            return !!this.mapScale[level] ? this.mapScale[level] : -1;
        }
        /**
         *  正算:经纬度坐标投影到瓦片位置关系
         *  @method forwardPosition
         *  @param level {Number} 
         *  @param loglat {Object}
         *  @returns {Object}
         *  {
         *      pi,
         *      pj,
         *      offsetX,
         *      offsetY,
         *  }
         */
        _grid.prototype.forwardPosition = function (level, loglat) {
            var proXY = {};
            if (!!loglat) proXY = epsg3857.forwardMeractor(loglat);
            var x = proXY.x || 0, y = proXY.y || 0;
            //正算：经纬度投影到瓦片位置和瓦片偏移
            var piexl_x = ((x + r) * 256 * pow(2, level)) / (2 * r),
                 piexl_y = ((r - y) * 256 * pow(2, level)) / (2 * r),
                 //瓦片编号
                 pi = floor(piexl_x / 256),
                 pj = floor(piexl_y / 256),
                 //偏离瓦片左上角的x,y像素值
                 offsetX = floor(piexl_x - pi * 256),
                 offsetY = floor(piexl_y - pj * 256);
            return {
                pi: pi,
                pj: pj,
                offsetX: offsetX,
                offsetY: offsetY,
            }
        }
        /**
         * 反算:瓦片相对位置关系反投影到经纬度信息
         * @method inversePosition
         * @param args {Object} 
         * {
         *      level,
         *      pi,
         *      pj,
         *      offsetX,
         *      offsetY,
         * }
         * @returns {Object}
         * {
         *      log,
         *      lat,
         * }
         */
        _grid.prototype.inversePosition = function (args) {
            var level = args.level || this.level,
                pi = args.pi || 0, pj = args.pj || 0,
                offsetX = args.offsetX || 0, offsetY = args.offsetY || 0;//若不指定，默认计算左上角经纬度
            //线性关系，不需要分段计算
            var piexl_x = pi * 256 + offsetX,
                piexl_y = pj * 256 + offsetY;
            var x = (piexl_x * 2 * r) / (256 * pow(2, level)) - r,
                y = r - (piexl_y * 2 * r) / (256 * pow(2, level));
            var log = x * 180 / r;
            var lg = y * 2 * Math.PI / (2 * r);
            var tan = pow(Math.E, lg);
            var lat = 360 * (atan(tan) - Math.PI / 4) / Math.PI;
            return { lat: lat, log: log };
        }
        /**
        *   获取对象类型名
        *   @method getType
        */
        _grid.prototype.getType = function () {
            return "Grid";
        }

        return _grid;

    });