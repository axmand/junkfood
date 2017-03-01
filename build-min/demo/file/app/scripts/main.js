/**
*   app package目录打包
*   @author }{hk date 2014/10/13
*   @package scripts
*/

require.config({
    paths: {
        //commands
        command: 'scripts/commands/command',
        commandmanager: 'scripts/commands/commandmanager',
        //module-modules
        basemodule: 'scripts/module/modules/basemodule',
        compositemodule: 'scripts/module/modules/compositemodule',
        contentmodule: 'scripts/module/modules/contentmodule',
        footmodule: 'scripts/module/modules/footmodule',
        headmodule: 'scripts/module/modules/headmodule',
        navmodule: 'scripts/module/modules/navmodule',
        messagemodule: 'scripts/module/modules/messagemodule',
        webgiscomposite: 'scripts/module/modules/webgiscomposite', //具体应用组合
        //module-model
        commandmodel: 'scripts/module/model/commandmodel',
        //module-controllers
        contentcontroller: 'scripts/module/controllers/contentcontroller',
        footcontroller: 'scripts/module/controllers/footcontroller',
        headcontroller: 'scripts/module/controllers/headcontroller',
        navcontroller: 'scripts/module/controllers/navcontroller',
        webgispagecontroller: 'scripts/module/controllers/webgispagecontroller',
        messagecontroller: 'scripts/module/controllers/messagecontroller',
        //controller
        controllers: 'scripts/controllers/controllers',
        //filters
        filters: 'scripts/filters/filters',
        //directives
        directives: 'scripts/directives/directives',
        ngregion: 'scripts/directives/ngregion',
        //utils
        objutil: 'scripts/utils/objutil'
    }

});

//模块载入,启动app应用框架
define(['jquery','angular','angularRoute','basemodule', 'compositemodule', 'contentmodule', 'footmodule', 'headmodule', 'navmodule','messagemodule', 'webgiscomposite','webgispagecontroller',
    'contentcontroller', 'footcontroller', 'headcontroller', 'navcontroller', 'controllers', 'filters', 'directives', 'ngregion','command','commandmanager','messagecontroller'],
    function (jquery,angular,angularRoute,basemodule, compositemodule, contentmodule, footmodule, headmodule, navmodule,messagemodule, webgiscomposite,webgispagecontroller,
        contentcontroller, footcontroller, headcontroller, navcontroller, controllers, filters, directives, ngregion, command, commandmanager, messagecontroller) {
        
        var app = angular.module('wgApp', ['controllers', 'directives', 'filters','ngRoute']);

        app.addService = function (name, service) {
            app.factory(name, function () {
                return service;
            });
        }

        app.addView = function (name, url, controller) {
            this.run(function ($templateCache) {
                $templateCache.put(name, { templateUrl: url, controller: controller });
            });
        }

        var opts = { hook: {}, app: app ,cmds:new commandmanager() };

        var component = new webgiscomposite(opts);

        component.add(new headmodule(opts));
        component.add(new contentmodule(opts));
        component.add(new navmodule(opts));
        component.add(new footmodule(opts));

        component.inilization();

        return {
            app: app,
            component: component,
        }

});