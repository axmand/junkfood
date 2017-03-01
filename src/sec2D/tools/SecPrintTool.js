/**
*   打印工具
*   @class Hmap.Tools.SecPrintTool
*/
define(['SecBaseTool', 'Hobject'],function (SecBaseTool, Hobject) {

    var extend = Hobject.BaseFunc.extend,
        Command = SecBaseTool.Command,
        CommandItem = SecBaseTool.CommandItem;

        var _secPrintTool = function (args) {
            SecBaseTool.self.call(this, args);
        }

        extend(_secPrintTool, SecBaseTool.self);

        //创建Dom按钮
        _secPrintTool.prototype._createTool = function () {
            //此工具是需要工具栏的
            this._createMenu();
            var printCmd = new Command(function () {
                alert('地图打印功能正在完善');
            });
            var printItem = new CommandItem('地图打印', printCmd,'fa-print');
            this.cmds.push(printItem);
        }

        _secPrintTool.prototype.getType = function () {
            return 'SecPrintTool';
        }

        return _secPrintTool;

    });