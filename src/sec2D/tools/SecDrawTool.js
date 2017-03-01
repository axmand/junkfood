/**
*   测量工具，测量长度和面积
*   @class Hmap.Tools.SecDrawTool
*/
define(['SecBaseTool', 'SecDrawInteractive', 'SecDrawLayer', 'Hobject', 'DrawProtocol'],
    function (SecBaseTool, SecDrawInteractive, SecDrawLayer, Hobject, DrawProtocol) {

        var extend = Hobject.BaseFunc.extend,
            Command = SecBaseTool.Command,
            CommandItem = SecBaseTool.CommandItem,
            //支持的绘制类型
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
        var _secDrawTool = function (args) {
            this._drawlayer = null;
            SecBaseTool.self.call(this, args);
        }

        extend(_secDrawTool, SecBaseTool.self);

        _secDrawTool.prototype.getType = function () {
            return "SecDrawTool";
        }

        _secDrawTool.prototype._inilization = function () {
            this._drawlayer = new SecDrawLayer();
            this.args.addLayer(this._drawlayer);
            this._secDrawInteractive = this._drawlayer._secDrawInteractive;
        }
        /*
        *   调整drawLayer到最顶层
        *   
        */
        _secDrawTool.prototype._setLayerAtTop = function () {
            this._drawlayer.moveTop();
        }
        /*
        *   
        */
        _secDrawTool.prototype._setLayerAtBottom = function () {
            this._drawlayer.moveToBottom();
        }
        //创建drawtool
        _secDrawTool.prototype._createTool = function () {
            //此工具是需要工具栏的
            this._createMenu();
            this._inilization();
            var that = this;
            //command集合
            var drawPolygonCmd = new Command(function () {
                that._secDrawInteractive.changeDraw(DRAWTYPE.Polygon);
                that._setLayerAtTop();
            }),
                drawPolylineCmd = new Command(function () {
                    that._secDrawInteractive.changeDraw(DRAWTYPE.Line);
                    that._setLayerAtTop();
                });
            var drawPolygonItem = new CommandItem('测面积', drawPolygonCmd, 'fa-crop'),
                drawPolylineItem = new CommandItem('测距离', drawPolylineCmd, 'fa-steam');
            //
            this.cmds.push(drawPolygonItem);
            this.cmds.push(drawPolylineItem);
            //距离量算代码
            //var s = Hmap.Core.Hmath.proDistance([121.60, 30.2], [114.60, 22.2]);
        }

        return _secDrawTool;

    });