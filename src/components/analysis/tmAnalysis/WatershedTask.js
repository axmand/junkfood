/*
*   水域监测
*/

define(['BaseTask','Hobject'], function (BaseTask, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    var _watershedTask = function (args) {
        BaseTask.call(this, args);
    }

    extend(_watershedTask, BaseTask);
 
    _watershedTask.prototype.getType = function () {
        return "WatershedTask";
    }

    return _watershedTask;

});