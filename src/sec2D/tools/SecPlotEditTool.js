/**
*   标绘编辑工具
*   @class Hmap.Tools.SecPlotEditTool
*/
define(['SecBaseTool', 'Hobject', 'Messenger'], function (SecBaseTool, Hobject, Messenger) {

    var extend = Hobject.BaseFunc.extend,
        hook=Hobject.BaseFunc.hook,
        Command = SecBaseTool.Command,
        CommandItem = SecBaseTool.CommandItem;

    var _secPlotEditTool = function (args) {
        SecBaseTool.self.call(this, args);
    }

    extend(_secPlotEditTool, SecBaseTool.self);

    //创建Dom按钮
    _secPlotEditTool.prototype._createTool = function () {
        var getLayerById = this.args.getLayerById, layer;
        //此工具是需要工具栏的
        this._createMenu();
        var plotEditCmd = new Command(function () {
            layer = layer || getLayerById('SecDrawToolPoltLayer');
            if (!layer) return;
            if (!hook.plotEditFlag) {
                Messenger.getInstance().post('编辑模式启动');
                plotEditItem.setIcon('fa-stop');
                plotEditItem.setText('停止编辑');
                hook.plotEditFlag = true;
            } else {
                Messenger.getInstance().post('编辑模式关闭');
                plotEditItem.setIcon('fa-edit');
                plotEditItem.setText('开始编辑');
                hook.plotEditFlag = false;
            }
        });
        var plotEditItem = new CommandItem('开始编辑', plotEditCmd, 'fa-edit');
        this.cmds.push(plotEditItem);
    }

    _secPlotEditTool.prototype.getType = function () {
        return 'SecPlotEditTool';
    }

    return _secPlotEditTool;

});