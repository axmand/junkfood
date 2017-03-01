/**
*   定义绘制协议
*   @class Hmap.Plot.DrawProtocol
*/
define(['Hobject','Symbol','GeoElement','PlotElement','Render', 'BeelineArrow', 'DoubleArrow', 'CurveArrow', 'SlightnessArrow', 'ArmyRoute', 'ArsenalRoute', 'ExpertRoute', 'MedicalRoute', 'PowerRoute', 'ProChymicRoute', 'ProjectRoute', 'ProSuccorRoute'],
    function (Hobject,Symbol,GeoElement,PlotElement, Render, BeelineArrow, DoubleArrow, CurveArrow, SlightnessArrow, ArmyRoute, ArsenalRoute, ExpertRoute, MedicalRoute, PowerRoute, ProChymicRoute, ProjectRoute, ProSuccorRoute) {

            //大致分为四类标绘协议
            //1.路径标绘
        var ROUTEPROTOLS = {
                ArmyRoute: true,                     //行军路线
                ArsenalRoute: true,                 //武警
                ExpertRoute: true,                   //专家系统
                MedicalRoute: true,                //医疗
                PowerRoute: true,                  //电力
                ProChymicRoute: true,           //防化
                ProjectRoute: true,                 //工程
                ProSuccorRoute: true,            //专业救援
            },
            //2.普通绘制
            COMMOMPROTOLS = {
                Polygon: true,                            
                Line: true,
            },
            //单一箭头
            ARROWSINGLEPROTOLS = {
                SlightnessArrow: true,     
            },
            //双箭头
            ARROWTWOPROTOLS = {
                BeelineArrow: true,
                DoubleArrow: true,
                CurveArrow: true,
            };

        //支持的绘制种类
        var DrawType = {
            //基本绘制
            Polygon: "Polygon",                             //测面积
            Line: "Line",                                         //测长度
            //标绘-箭头
            BeelineArrow: 'BeelineArrow',
            DoubleArrow: 'DoubleArrow',
            CurveArrow: 'CurveArrow',
            SlightnessArrow: 'SlightnessArrow',      //单直箭头
            //标绘-路径
            ArmyRoute: 'ArmyRoute',                     //行军路线
            ArsenalRoute: 'ArsenalRoute',              //武警
            ExpertRoute: 'ExpertRoute',                 //专家系统
            MedicalRoute: 'MedicalRoute',            //医疗
            PowerRoute: 'PowerRoute',                 //电力
            ProChymicRoute: 'ProChymicRoute',  //防化
            ProjectRoute: 'ProjectRoute',               //工程
            ProSuccorRoute: 'ProSuccorRoute',     //专业救援
        };

        //标绘算法映射表
        var PLOTTABLE = {
            //标绘-箭头
            BeelineArrow: BeelineArrow,
            DoubleArrow: DoubleArrow,
            CurveArrow: CurveArrow,
            SlightnessArrow: SlightnessArrow,      //单直箭头
            //标绘-路径
            ArmyRoute: ArmyRoute,                     //行军路线
            ArsenalRoute: ArsenalRoute,              //武警
            ExpertRoute: ExpertRoute,                 //专家系统
            MedicalRoute: MedicalRoute,            //医疗
            PowerRoute: PowerRoute,                 //电力
            ProChymicRoute: ProChymicRoute,  //防化
            ProjectRoute: ProjectRoute,               //工程
            ProSuccorRoute: ProSuccorRoute,     //专业救援
        }

        var Polygon = Render.Polygon,
            Circle = Render.Circle,
            Line = Render.Line;

        var drawCallback = function (element) {

        }
        

            //默认符号样式
        var mLineSymbol = Symbol.defaultLineSymbol,
            mPolygonSymbol = Symbol.defaultPolygonSymbol,
            mPointSymbol = Symbol.defaultPointSymbol;

        var extend = Hobject.BaseFunc.extend;

        /**
         *   提供基础的控制点添加操作绘制
         *   drawProtocol 方法需要实现各自的绘制方法
         *   @class drawProtocol
         */
        var _drawProtocol = function (args) {
            var _args = args || {},
                name =this.name= _args.name;
            this.layer = _args.layer;
            //绘制完毕后的事件回调
            this.complete = _args.complete;
            //存在则返回给定name的plotName
            this.plotElement = PLOTTABLE[name] ? new PlotElement({ graphAlgorithm:new PLOTTABLE[name]() }):null;
            this.geoElement = new GeoElement();
        }

        _drawProtocol.prototype.mousedown = function (point) {

        }

        _drawProtocol.prototype.mousemove = function (point) {

        }

        _drawProtocol.prototype.dbclick = function () {

        }

        /**
        *   通用绘制协议
        *   绘制普通图形的流程协议，
        *   主要包括：绘制基础线面等
        *   @class drawCommonProtocol
        *   var protocol=new _drawCommonProtocol({
        *       name:"Circle"   //来自枚举值
        *       layer:
        *       complete:     
        *   });
        */
        var _drawCommonProtocol = function (args) {
            var _args = args || {};
            _drawProtocol.call(this, _args);
        }

        extend(_drawCommonProtocol, _drawProtocol);

        _drawCommonProtocol.prototype.mousedown = function (point) {
            if (!this.geoElement.drawElement[0]) {
                //绘制符号
                var symbol;
                switch (this.name) {
                    case "Polygon":
                        symbol = mPolygonSymbol.toConfig();
                        symbol.points = [point, point, point];
                        this.geoElement.drawElement[0] = new Polygon(symbol);
                        break;
                    case "Line":
                        symbol = mLineSymbol.toConfig();
                        symbol.points = [point, point];
                        this.geoElement.drawElement[0] = new Line(symbol);
                        break;
                    default:
                        break;
                }
                this.layer.add(this.geoElement.drawElement[0]);
            } else {
                //添加节点
                this.geoElement.drawElement[0].getPoints().push(point);
            }
        }

        _drawCommonProtocol.prototype.mousemove = function (point) {
            var points = this.geoElement.drawElement[0].getPoints(),
                count = points.length;
            points[count - 1] = point;
        }

        _drawCommonProtocol.prototype.dbclick = function () {
            this.complete(this.geoElement);
            this.geoElement = null;
        }

        /**
        *   绘制路径标绘通用事件
        *   支持plotAlgorithm种类
        *   shapes数目为4
        *   [routelabel]
        *   var protol=new _drawRouteProtocol({
        *       name:
        *       layer:
        *       complete:           //绘制完毕回调
        *   });
        *   name为plotName
        *   @class DrawRouteProtocol
        */
        var _drawRouteProtocol = function (args) {
            var _args = args || {};
            _drawProtocol.call(this,_args);
        }

        extend(_drawRouteProtocol, _drawProtocol);

        _drawRouteProtocol.prototype.mousedown = function (point) {
            if (!this.plotElement.drawElement[0]) {
                //添加控制点
                this.plotElement.addControlPoint(point);
                //计算图形集合
                this.plotElement.movePoint(point);
                //初始化缓存几何对象集合
                this.plotElement.drawElement = [];
                var lineConfig0 = mLineSymbol.toConfig();
                lineConfig0.points = this.plotElement.shapes[0].coordinates;
                //创建polyline(shapes[0])
                this.plotElement.drawElement[0] = new Line(lineConfig0);
                this.layer.add(this.plotElement.drawElement[0]);    //添加进图层
            } else {
                if (this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt) {                  //控制点个数小于上限，则继续添加控制点
                    this.plotElement.addControlPoint(point);
                }
                //控制点达上限，结束绘制
                if (this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt) {
                    this.complete(this.plotElement);
                    this.plotElement = null;    //置空
                }
            }
        }

        _drawRouteProtocol.prototype.mousemove = function (point) {
            var controlPoints = this.plotElement.controlPoints,
                count = controlPoints.length;
            if (count === 1) {
                var points = this.plotElement.drawElement[0].getPoints(),
                    len = points.length;
                points[len - 1] = point;
            } else if(count>=2) {
                this.plotElement.movePoint(point);
                //曲线绘制
                this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates);
                if (!this.plotElement.drawElement[1]) {
                    //
                    var lineConfig1 = mLineSymbol.toConfig();
                    lineConfig1.points = this.plotElement.shapes[1].coordinates;
                    this.plotElement.drawElement[1] = new Line(lineConfig1);
                    //
                    var lineConfig2 = mLineSymbol.toConfig();
                    lineConfig2.points = this.plotElement.shapes[2].coordinates;
                    this.plotElement.drawElement[2] = new Line(lineConfig2);
                    //
                    var polygonConfig3 = mPointSymbol.toConfig();
                    polygonConfig3.points = this.plotElement.shapes[3].coordinates[0];
                    this.plotElement.drawElement[3] = new Polygon(polygonConfig3);
                    //
                    this.layer.add(this.plotElement.drawElement[1]);
                    this.layer.add(this.plotElement.drawElement[2]);
                    this.layer.add(this.plotElement.drawElement[3]);
                } else {
                    this.plotElement.drawElement[1].setPoints(this.plotElement.shapes[1].coordinates);
                    this.plotElement.drawElement[2].setPoints(this.plotElement.shapes[2].coordinates);
                    this.plotElement.drawElement[3].setPoints(this.plotElement.shapes[3].coordinates[0]);
                }
            }
        }

        _drawRouteProtocol.prototype.dbclick = function () {
            this.complete(this.plotElement);
            this.plotElement = null;
        }

        /**
        *   绘制单个箭头
        *   shape数量为1 ,适用于形如 SlightnessArrow
        *   @class drawSingleArrowProtocol
        */
        var _drawArrowSingleProtocol = function (args) {
            var _args = args || {};
            _drawProtocol.call(this, _args);
        }

        extend(_drawArrowSingleProtocol, _drawProtocol);

        _drawArrowSingleProtocol.prototype.mousedown = function (point) {
            if (!this.plotElement.drawElement[0]) {
                this.plotElement.addControlPoint(point);
            } else {
                if (this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt) {
                    this.plotElement.addControlPoint(point);
                }
                if (this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt) {
                    this.complete(this.plotElement);
                    this.plotElement = null;    //置空
                }
            }
        }

        _drawArrowSingleProtocol.prototype.mousemove = function (point) {
            var controlPoints = this.plotElement.controlPoints,
                count = controlPoints.length;
            if (count === 1) {
                this.plotElement.movePoint(point);
                if (!this.plotElement.drawElement[0]) {
                    var symbol =  mPolygonSymbol.toConfig();
                    symbol.points = this.plotElement.shapes[0].coordinates[0];
                    this.plotElement.drawElement[0] = new Polygon(symbol);
                    //添加进layer
                    this.layer.add(this.plotElement.drawElement[0]);
                } else {
                    this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates[0]);
                }
            }
        }

        _drawArrowSingleProtocol.prototype.dbclick = function () {
            this.complete(this.plotElement);
            this.plotElement = null;
        }

        /**
        *   绘制两个图形组成的箭头
        *   第一个为直线，第二个为箭头polygon
        *   @method drawTwoArrowProtocol 
        */
        var _drawArrowTwoProtocol = function (args) {
            var _args = args || {};
            _drawProtocol.call(this, _args);
        }

        extend(_drawArrowTwoProtocol, _drawProtocol);

        _drawArrowTwoProtocol.prototype.mousedown = function (point) {
            if (!this.plotElement.drawElement[0]) {
                this.plotElement.addControlPoint(point);
                this.plotElement.movePoint(point);
                var lineSymbol = mLineSymbol.toConfig();
                lineSymbol.points = this.plotElement.shapes[0].coordinates;
                this.plotElement.drawElement[0] = new Line(lineSymbol);
                //添加进图层
                this.layer.add(this.plotElement.drawElement[0]);
            } else {
                if (this.plotElement.controlPoints.length < this.plotElement.graphAlgorithm.maxCpt) {
                    this.plotElement.addControlPoint(point);
                }
                if (this.plotElement.controlPoints.length === this.plotElement.graphAlgorithm.maxCpt) {
                    this.complete(this.plotElement);
                    this.plotElement = null;    //置空
                }
            }
        }

        _drawArrowTwoProtocol.prototype.mousemove = function (point) {
            var controlPoints = this.plotElement.controlPoints,
                count = controlPoints.length;
            if (count === 1) {
                //修改线位置
                this.plotElement.movePoint(point);
                this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates);
            } else if(count>=2){
                this.plotElement.movePoint(point);
                if (!this.plotElement.drawElement[1]) {
                    var polygonSymbol = mPolygonSymbol.toConfig();
                    polygonSymbol.points = this.plotElement.shapes[1].coordinates[0];
                    this.plotElement.drawElement[1] = new Polygon(polygonSymbol);
                    this.layer.add(this.plotElement.drawElement[1]);
                } else {
                    this.plotElement.drawElement[1].setPoints(this.plotElement.shapes[1].coordinates[0]);
                }
                //修改线位置
                this.plotElement.drawElement[0].setPoints(this.plotElement.shapes[0].coordinates);
            }
        }

        _drawArrowTwoProtocol.prototype.dbclick = function () {
            this.plotElement = null;
        }

        //
        var _drawProtocolFactory = function () {
          
        }
        /**
        *   根据name,生成对应的drawProtol，必须填入参数args
        *   @method create
        */
        _drawProtocolFactory.create = function (name, args) {
            var drawProtocol;
            args.name = name;
            if (COMMOMPROTOLS[name])
                drawProtocol = new _drawCommonProtocol(args);
            else if (ROUTEPROTOLS[name])
                drawProtocol = new _drawRouteProtocol(args);
            else if (ARROWSINGLEPROTOLS[name])
                drawProtocol = new _drawArrowSingleProtocol(args);
            else if (ARROWTWOPROTOLS[name])
                drawProtocol = new _drawArrowTwoProtocol(args);
            return drawProtocol;
        }

        return {
            drawProtocolFactory: _drawProtocolFactory,
            DRAWTYPE: DrawType,
        }

    });
