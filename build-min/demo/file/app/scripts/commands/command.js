/**
*   应用command的实际command
*   @author }{hk date 2014/10/14
*   @class command 
*/
define(function () {

    var _command = function (opts) {
        var _opts = opts || {};
        this.name = _opts.name;
        this.title = _opts.title;
        this.enalbed = _opts.enabled || true;
    }

    _command.prototype.onCreate = function (hook) {
        this.hook = hook;
        this.map = hook['map'];
        this.notify = hook['notify'];
    }

    _command.prototype.onClick = function (param) {

    }

    return _command;

})