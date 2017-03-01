/**
*   基于server ，创建独立 task session
*   @class BaseTask
*/

define(function () {
    /**
    *   @param args {Object}
    *   {
    *       data:
    *       taskType:
    *       taskComplete: function
    *   }
    */
    var _baseTask = function (args) {
        this.args = args || {};
        this.args.type = this.getType();                            //当前task的类型
        this.taskComplete = this.args.taskComplete || function () { };      //回调处理task函数
    };

    /*
    *   组织成Json格式，准备发送给服务端
    */
    _baseTask.prototype.getTaskContent = function () {
        return JSON.stringify(this.args);
    };

    _baseTask.prototype.getType = function () {
        return "BaseTask";
    };
   
    return _baseTask;

});