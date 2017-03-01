/**
*   标绘工具
*   @class Hmap.Tools.SecPlotTool
*/
define(['SecBaseTool', 'SecDrawInteractive', 'SecDrawLayer', 'Hobject', 'DrawProtocol'],
    function (SecBaseTool, SecDrawInteractive, SecDrawLayer, Hobject, DrawProtocol) {

        var extend = Hobject.BaseFunc.extend,
            Command = SecBaseTool.Command,
            CommandItem = SecBaseTool.CommandItem,
            MultiCommandItem = SecBaseTool.MultiCommandItem,
            //
            DRAWTYPE = DrawProtocol.DRAWTYPE;
        /**
        *   二维地图绘制工具
        *   @class Hmap.Tools.SecDrawTool
        *   @param args {Object}
        *   {
        *       graphicLayer:   //mapObj内置garphiclayer
        *       mapID:              //mapObj的id
        *       graphic2d
        *   }
        */
        var _secPlotTool = function (args) {
            this._drawlayer = null;
            SecBaseTool.self.call(this, args);
        }

        extend(_secPlotTool, SecBaseTool.self);

        _secPlotTool.prototype.getType = function () {
            return "SecDrawTool";
        }

        _secPlotTool.prototype._inilization = function () {
            this._drawlayer = new SecDrawLayer({
                layerID:"SecDrawToolPoltLayer",
            });
            this.args.addLayer(this._drawlayer);
            this._secDrawInteractive = this._drawlayer._secDrawInteractive;
        }

        _secPlotTool.prototype._setLayerAtTop = function () {
            this._drawlayer.moveTop();
        }

        _secPlotTool.prototype._setLayerAtBottom = function () {
            this._drawlayer.moveToBottom();
        }

        //创建drawtool
        _secPlotTool.prototype._createTool = function () {
            //此工具是需要工具栏的
            this._createMenu();
            this._inilization();
            var that = this;
            //command集合
            var drawBeelineArrowCmd = new Command(function () {
                that._secDrawInteractive.changeDraw(DRAWTYPE.BeelineArrow);
                that._setLayerAtTop();
            }),
                drawDoubleArrowCmd = new Command(function () {
                    that._secDrawInteractive.changeDraw(DRAWTYPE.DoubleArrow);
                    that._setLayerAtTop();
                }),
                drawCurveArrow = new Command(function () {
                    that._secDrawInteractive.changeDraw(DRAWTYPE.CurveArrow);
                    that._setLayerAtTop();
                }),
                drawSlightnessArrow = new Command(function () {
                    that._secDrawInteractive.changeDraw(DRAWTYPE.SlightnessArrow);
                    that._setLayerAtTop();
                }),
                armyRoute = new Command(function () {
                    that._secDrawInteractive.changeDraw(DRAWTYPE.ArmyRoute);
                    that._setLayerAtTop();
                }),
               arsenalRoute = new Command(function () {
                   that._secDrawInteractive.changeDraw(DRAWTYPE.ArsenalRoute);
                   that._setLayerAtTop();
               }),
               //expertRoute = new Command(function () {
               //    that._secDrawInteractive.changeDraw(DRAWTYPE.ExpertRoute);
               //    that._setLayerAtTop();
               //}),
               //medicalRoute = new Command(function () {
               //    that._secDrawInteractive.changeDraw(DRAWTYPE.MedicalRoute);
               //    that._setLayerAtTop();
               //}),
               // powerRoute = new Command(function () {
               //     that._secDrawInteractive.changeDraw(DRAWTYPE.PowerRoute);
               //     that._setLayerAtTop();
               // }),
               //  proChymicRoute = new Command(function () {
               //      that._secDrawInteractive.changeDraw(DRAWTYPE.ProChymicRoute);
               //      that._setLayerAtTop();
               //  }),
               //  projectRoute = new Command(function () {
               //      that._secDrawInteractive.changeDraw(DRAWTYPE.ProjectRoute);
               //      that._setLayerAtTop();
               //  }),
               //  proSuccorRoute = new Command(function () {
               //      that._secDrawInteractive.changeDraw(DRAWTYPE.ProSuccorRoute);
               //      that._setLayerAtTop();
               //  }),
                moreDeaitlCmd = new Command(function () {
                    alert('更多标绘...');
                });
            //
            var commands = [drawBeelineArrowCmd, drawDoubleArrowCmd, drawCurveArrow, drawSlightnessArrow,
                armyRoute, arsenalRoute,
                //expertRoute, medicalRoute, powerRoute, proChymicRoute, projectRoute, proSuccorRoute,
                moreDeaitlCmd];
            //submenu 项
            items = new MultiCommandItem('标绘',
                ['直细箭头', '双箭头', '单曲箭头', '直箭头',
                 '行军', '武警',
                 //'专家', '医疗', '电力', '防化', '工程', '专业救援',
                 '更多...'],
                commands,
                ['fa-location-arrow', 'fa-level-up', 'fa-share', 'fa-arrow-up',
                    'fa-users', 'fa-pied-piper-alt',
                    //'fa-graduation-cap', 'fa-hospital-o', 'fa-flash', 'fa-h-square', 'fa-building-o', 'fa-recycle',
                    'fa-plus-square']);
            this.cmds.push(items);
        }

        return _secPlotTool;

    });