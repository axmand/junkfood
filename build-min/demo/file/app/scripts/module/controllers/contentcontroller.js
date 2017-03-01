/**
*   @author }{hk date 2014/10/14
*   @class contentcontrolle
*/
define(['controllers'], function (controllers) {

    controllers.controller('contentcontroller', ['$scope','hook', function ($scope,hook) {

        $('.filter.menu .item').tab();

        $('.ui.rating').rating({ clearable: true });

        $('.ui.dropdown').dropdown();


    }]);

});