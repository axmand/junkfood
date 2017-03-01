/**
*   消息管理器
*   @author }{hk date 2014/10/14
*   @class messagecontroller
*/
define(['controllers'], function (controllers) {
    controllers.controller('messagecontroller', ['$scope', function ($scope) {
        $('.demo.sidebar').sidebar('toggle');
        $('.demo.menu .item').tab();
    }]);
});