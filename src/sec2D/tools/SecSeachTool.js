/**
*   POI搜索工具
*   目前借助于百度地图api
*   @class Hmap.Tools.SecSeachTool
*/

define(['SecBaseTool','Hobject'],function (SecBaseTool,Hobject) {

    var extend = Hobject.BaseFunc.extend,
        SecBaseTool = SecBaseTool.self;

    var _secSearchTool = function (args) {


    }

    extend(_secSearchTool, SecBaseTool);

    _secSearchTool.prototype._inilization = function () {

    }

    _secSearchTool.prototype._createTool = function () {
        this._createMenu();
        this._inilization();
        //

    }


});