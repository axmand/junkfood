/**
*   command管理器
*   @author }{hk date 2014/10/14
*   @class commandmanager
*/

define(function () {
    
    var _commandManager = function () {
        this.commands = {};
    }

    _commandManager.prototype.add = function (command) {
        if (!!command.name) {
            this.commands[command.name] = command;
        }
    }

    _commandManager.prototype.onCreate = function (hook) {
        for (var i in this.commands) {
            this.commands[i].onCreate(hook);
        }
    }

    _commandManager.prototype.active = function (name, param) {
        var command = this.commands[name];
        if (!!command) {
            command.onClick(param);
        }
    }

    _commandManager.prototype.find = function (name) {
        return this.commands[name];
    }

    _commandManager.prototype.getType = function () {
        return 'commandmanager';
    }

    return _commandManager;

});