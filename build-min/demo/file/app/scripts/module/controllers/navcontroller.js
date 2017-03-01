/**
*
*/
define(['controllers'], function (controllers) {

    controllers.controller('navcontroller', ['$scope', function ($scope) {
        $('.ui.sidebar').sidebar('attach events', '.launch.button');
    }]);

});