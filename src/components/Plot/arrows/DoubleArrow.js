/**
*   双箭头标绘
*   @class Hmap.Plot.Arrows.DobleArrow
*/
define(['PlotAlgorithm', 'Hobject', 'Hmath', 'GeoLineString', 'GeoPolygon'], function (PlotAlgorithm, Hobject, Hmath, GeoLineString, GeoPolygon) {

    var extend = Hobject.BaseFunc.extend,
        //浅拷贝
        copy = Hobject.BaseFunc.copy,           
        //
        mH2dmath = Hmath.mH2dmath,
        optionWay = mH2dmath.optionWay,
        azimuth = mH2dmath.azimuth,
        distance = mH2dmath.distance,
        linePerpenPoints = mH2dmath.linePerpenPoints,
        pathLength = mH2dmath.pathLength,
        bzLine = mH2dmath.bzLine,
        bTypeline = mH2dmath.bTypeline;

    var _doubleArrow = function () {
        var args = {
            minCpt: 3,
            maxCpt: 4,
        }
        PlotAlgorithm.call(this, args);
        //
        this._inilization();
    }
    //继承扩展基础标绘算法
    extend(_doubleArrow, PlotAlgorithm);

    /**
    *   初始化变量参数
    *   @method inilization
    */
    _doubleArrow.prototype._inilization = function () {
        //
        this.m_pWay = false;
        this.m_CtrlPts = [];        //4
        this.pts = null;
        //
        this.onPoint = [];          
        this.ctrlpts = [];      //3
        this.cpts = [];         //3
        this.pv = [];           //5
        this.pv2 = [];          //5
        //
        this.control1 = [];
        this.control2 = [];
        //
        this.lpnt = [];         //4
        this.cpnt = [];         //4
        this.rpnt = [];         //4
        //
        this.leftpt0 = [];    //箭尾节点与箭尖连线的中点向外扩展1/4长度
        this.leftpt1 = [];    //leftpt0与监尾节点连线上距箭尾点1/3长度
        this.leftpt2 = [];    //用于确定箭头的方向
        //
        this.rightpt0 = [];
        this.rightpt1 = [];
        this.rightpt2 = [];
        //
        this.geoPolygon = new GeoPolygon();;
        this.line1 = new GeoLineString();
    }
 
    _doubleArrow.prototype.createGeometrys = function (movePoint) {
        var controlsPoints = this._plotElement.controlPoints,
            len = controlsPoints.length;
        if (len == 1) {//1.动态绘制橡皮线 (控制点加移动点)
            if (!!this._plotElement.shapes[0]) {
                this.line1.replacePoint(movePoint);
            } else {
                this.line1.addPoint(controlsPoints[0]);
                this.line1.addPoint(movePoint);
            }
            this._plotElement.shapes[0] = this.line1;
        } else if (len === 2) {//2.线绘制完毕,动态绘制箭头
            this.line1.replacePoint(controlsPoints[1]); //线两个确定
            //move为第三个控制点
            this.m_CtrlPts = copy(controlsPoints);
            this.m_CtrlPts.push(movePoint);
            //计算出对称的点为第四个控制点，采用四个控制点绘制双箭头
            var k = -1 / ((this.m_CtrlPts[1][1] - this.m_CtrlPts[0][1]) / (this.m_CtrlPts[1][0] - this.m_CtrlPts[0][0])),
                pt1 = _doubleArrow.leftPoint([(this.m_CtrlPts[0][0] + this.m_CtrlPts[1][0]) / 2, (this.m_CtrlPts[0][1] + this.m_CtrlPts[1][1]) / 2], this.m_CtrlPts[2], k);
            //添加第四个控制点
            this.m_CtrlPts.push(pt1);
        } else if (len === 3) {//3.线和箭头绘制完毕,动态绘制第二个箭头
            this.m_CtrlPts = copy(controlsPoints);
            this.m_CtrlPts.push(movePoint);
        } else if (len === 4) {//4.两个箭头的点都设定完毕,直接进行绘制即可
            this.m_CtrlPts = copy(controlsPoints);
        }
        //如果有四个控制点，则进行空心箭头绘制
        if (this.m_CtrlPts.length === 4) this.getGraphParts(1);
    }

    _doubleArrow.prototype.getGraphParts = function (ratio) {
        var cpts = this.m_CtrlPts;
        this.geoPolygon.coordinates = [];
        this.m_pWay = optionWay(cpts[0], cpts[1], cpts[2]);
        var len = distance(cpts[1], cpts[2]);
        if (len === 0) return;
        linePerpenPoints(cpts[1], cpts[2], len / 2, len / 4, this.onPoint, this.leftpt0, this.m_pWay);
        linePerpenPoints(cpts[1], cpts[2], len / 2, len / 10, this.onPoint, this.leftpt1, this.m_pWay);
        len = distance(cpts[1], this.leftpt0);
        linePerpenPoints(cpts[1], this.leftpt0, len / 3, 0, this.leftpt2, this.onPoint, true);
        //绘制右边箭头
        this.ctrlpts[0] = cpts[1];
        this.ctrlpts[1] = this.leftpt1;
        this.ctrlpts[2] =cpts[2];
        len = pathLength(this.ctrlpts);
        //计算B曲线
        this.pts = bTypeline(this.ctrlpts);
        //计算箭头(右边箭头计算完成)
        this.pv = _doubleArrow.helloArrowHead(this.pts[parseInt(this.pts.length * 5 / 6)], cpts[2], len /4.5, Math.PI / 5, Math.PI / 2, Math.PI / 10);
        //计算右边弧线的两个控制点和箭头方向的一个控制点
        len = distance(cpts[0], cpts[3]);
        linePerpenPoints(cpts[0], cpts[3], len / 2, len / 4, this.onPoint, this.rightpt0, !this.m_pWay);
        linePerpenPoints(cpts[0], cpts[3], len / 2, len / 10, this.onPoint, this.rightpt1, !this.m_pWay);
        //
        len = distance(cpts[0], this.rightpt0);
        linePerpenPoints(cpts[0], this.rightpt0, len / 3, 0, this.rightpt2, this.onPoint, true);
        //绘左边箭头
        this.ctrlpts[0] = cpts[0];
        this.ctrlpts[1] = this.rightpt1;
        this.ctrlpts[2] = cpts[3];
        len = pathLength(this.ctrlpts);
        //计算B曲线
        this.pts = bTypeline(this.ctrlpts)
        this.pv2 = _doubleArrow.helloArrowHead(this.pts[parseInt(this.pts.length * 5 / 6)], cpts[3], len/4.5, Math.PI / 5, Math.PI / 2, Math.PI / 10);
        //计算中间弧线两个控制点
        if (this.m_pWay) {
            linePerpenPoints(this.pv2[2], this.pv2[0], distance(cpts[2], cpts[1]), 0, this.control1, this.onPoint, false);
            linePerpenPoints(this.pv[2], this.pv[4], distance(cpts[2], cpts[1]), 0, this.control2, this.onPoint, false);
        } else {
            linePerpenPoints(this.pv2[2], this.pv2[4], 5*distance(this.pv2[2],this.pv2[4]), 0, this.control1, this.onPoint, false);
            linePerpenPoints(this.pv[2], this.pv[0],5* distance(this.pv[2],this.pv[0]), 0, this.control2, this.onPoint, false);
        }
        //将点放入数组，
        if (cpts.length === 4) {
            if (this.m_pWay) {
                this.cpnt[0] = copy(this.pv[4]);
                this.cpnt[1] = copy(this.control2);
                this.cpnt[2] = copy(this.control1);
                this.cpnt[3] = copy(this.pv2[0]);
                this.lpnt[0] = copy(this.pv2[4]);
                this.lpnt[1] = copy(this.rightpt0);
                this.lpnt[2] = copy(this.rightpt2);
                this.lpnt[3] = copy(cpts[0]);
                this.rpnt[0] = copy(cpts[1]);
                this.rpnt[1] = copy(this.leftpt2);
                this.rpnt[2] = copy(this.leftpt0);
                this.rpnt[3] = copy(this.pv[0]);
            }
            else {
                this.cpnt[0] = copy(this.pv2[4]);
                this.cpnt[1] = copy(this.control1);
                this.cpnt[2] = copy(this.control2);
                this.cpnt[3] = copy(this.pv[0]);
                this.rpnt[0] = copy(cpts[0]);
                this.rpnt[1] = copy(this.rightpt2);
                this.rpnt[2] = copy(this.rightpt0);
                this.rpnt[3] = copy(this.pv2[0]);
                this.lpnt[0] = copy(this.pv[4]);
                this.lpnt[1] = copy(this.leftpt0);
                this.lpnt[2] = copy(this.leftpt2);
                this.lpnt[3] = copy(cpts[1]);
            }
            //右翼处理
            var cpts2 = this.rpnt,
                bezierPoints = bzLine(cpts2),
                fromPoint = bezierPoints[0];
            this.geoPolygon.addPoint(bezierPoints);
            //右箭头处理
            this.m_pWay ? this.geoPolygon.addPoint(this.pv) : this.geoPolygon.addPoint(this.pv2);
            //中间弧线处理
            var cpts3 = this.cpnt,
                bezierPoints2 = bzLine(cpts3);
            this.geoPolygon.addPoint(bezierPoints2);
            //左箭头处理
            this.m_pWay ? this.geoPolygon.addPoint(this.pv2) : this.geoPolygon.addPoint(this.pv);
            //左翼处理
            var cpts4 = this.lpnt,
                bezierPoints3 = bzLine(cpts4);
            this.geoPolygon.addPoint(bezierPoints3);
            //闭合
            this.geoPolygon.addPoint(fromPoint);
            this._plotElement.shapes[1] =this._plotElement.shapes[1]||this.geoPolygon;
        }
    }

    /*
    *   求双箭头左翼点
    */
    _doubleArrow.leftPoint = function (point1, point2, k) {
        var b = point1[1] - k * point1[0],
            lx, ly;
        lx = parseInt(2 * (point2[0] + k * point2[1] - k * b) / (k * k + 1) - point2[0]);
        ly = parseInt(2 * (k * point2[0] + k * k * point2[1] + b) / (k * k + 1) - point2[1]);
        return [lx, ly];
    }
    
    /**
    *
    *   计算空心箭头
    *   @method helloArrowHead
    *   @param h {Array} 柄端点
    *   @param o {Array} 顶点位置
    *   @param size {Number} 箭头大小
    *   @param vAngle {Number} 前尖角
    *   @param rAngle {Number} 后尖角
    *   @param hAngle {Number} 后张角
    */
    _doubleArrow.helloArrowHead = function (h,o,size,vAngle,rAngle,hAngle) {
        var pv=[[],[],[],[],[]],  //返回箭头点集合
            ventroAngle = vAngle / 2,
            rearAngle = rAngle / 2,
            hollowAngle = hAngle / 2;
        //以0点为圆心
        var direction = Math.atan2(o[1] - h[1], o[0] - h[0]);
        //
        var cosV = Math.cos(ventroAngle),
            sinV = Math.sin(ventroAngle),
            cosR = Math.cos(rearAngle),
            sinR = Math.sin(rearAngle),
            cosD = Math.cos(direction),
            sinD = Math.sin(direction),
            cosH = Math.cos(hollowAngle),
            sinH = Math.sin(hollowAngle);
        //
        pv[3][0] = parseInt(-size * (cosV * cosD - sinV * sinD));
        pv[3][1] = parseInt(-size * (sinV * cosD + cosV * sinD));

        pv[1][0] = parseInt(-size * (cosV * cosD + sinV * sinD));
        pv[1][1] = parseInt(-size * (sinD * cosV - cosD * sinV));

        pv[2][0] = 0;
        pv[2][1] = 0;

        //双剑柄结合点
        var d = size * (sinR * cosR - cosR * sinV) / (sinR * cosH - cosR * sinH);

        pv[4][0] = parseInt(-d * (cosH * cosD - sinH * sinD));
        pv[4][1] = parseInt(-d * (sinH * cosD + cosH * sinD));

        pv[0][0] = parseInt(-d * (cosD * cosH + sinD * sinH));
        pv[0][1] = parseInt(-d * (sinD * cosH - cosD * sinH));

        var dx = parseInt(o[0] - (pv[0][0] + pv[4][0]) / 2),
            dy = parseInt(o[1] - (pv[0][1] + pv[4][1]) / 2);
        
        for (var i = 0; i < 5; i++) {
            pv[i][0] += o[0];
            pv[i][1] +=o[1];
        }

        return pv;
    }


    _doubleArrow.prototype.getType = function () {
        return 'DoubleArrow';
    }

    return _doubleArrow;

});