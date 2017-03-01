//过程
// app调用scripts
// scripts 作为 package加载，调用script/main
// main载入module vendor等
// 在$ domready 执行 bootstrap(document) 即可

require.config({
    urlArgs: 'bust=' + (new Date()).getTime(),//调试用，防止缓存
    packages: [
        'scripts',
        {
            name: 'hmap',
            location: 'vendor',
            main: 'hmap',
        }
    ],
    paths: {
        //vendor 外载库
        angular: 'vendor/angular',
        angularRoute: 'vendor/angular-route.min',
        backbone: 'vendor/backbone',
        bootstrap: 'vendor/bootstrap',
        jquery: 'vendor/jquery',
        jqueryAddress: 'vendor/jquery-address',
        underscore: 'vendor/underscore',
        semantic: 'vendor/semantic.min',
    },
    shim: {
        hmap: {
            exports: 'hmap'
        },
        jqery: {
            exports: '$'
        },
        jqueryAddress: {
            deps:['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        semantic: {
            deps:['jquery']
        },
        backbone: {
            deps: ['underscore'],
        },
        angular: {
            deps:['jquery'],
            exports: 'angular'
        },
        angularRoute:{
            deps: ['angular'],
            exports:'angularRoute'
        },
        underscore: {
            exports: '_'
        },
    }
});

require(['jquery', 'jqueryAddress', 'semantic', 'angular', 'angularRoute', 'scripts'], function (jquery, jqueryAddress,bootstrap, angular, angularRoute, scripts) {

    var s = scripts.app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $routeProvider.when('/', {
            templateUrl: 'scripts/module/views/webgispage.html',
            controller: 'webgispagecontroller',
        });
    });

    angular.bootstrap(document, ['wgApp']);
 

});