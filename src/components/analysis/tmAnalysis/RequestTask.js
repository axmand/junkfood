/*
*   author:yellow date:2013/9/16
*   func: use websocket complete requestTask
*/

define(['BaseTask', 'Hobject'], function (BaseTask, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    var _requestTask = function (args) {
        BaseTask.call(this,args);
    }

    extend(_requestTask, BaseTask);

    _requestTask.prototype.getType = function () {
        return "RequestTask";
    }

    return _requestTask;

});