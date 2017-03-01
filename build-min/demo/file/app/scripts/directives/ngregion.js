/**
*   在页面添加ng-region命令作为多视图绑定标签命令
*   @author }{hk date 2014/10/13
*   @class ngregion
*/

define(['directives'], function (directives) {
    directives.directive('ngRegion',
        ['$rootScope','$http','$compile','$controller','$location','$templateCache',
        function ($rootScope, $http, $compile, $controller, $location, $templateCache) {
            return {
                terminal: true,
                priority: 400,
                transclude: 'element',
                replace: true,
                compile: function (element, attr, linker) {
                    return function (scope, $element, attr) {
                        var currentElement, panel = attr.ngRegion,
                            update = function (region) {
                                var controller = region.controller,
                                    template = region.template,
                                    templateUrl = region.templateUrl;
                                //复制scope内容
                                var cloneScope = function (data) {
                                    var newScope = scope.$new(),
                                    locals = {},
                                    newController = controller;
                                    linker(newScope, function (clone) {
                                        clone.html(data);
                                        $element.parent().append(clone);
                                        if (currentElement)
                                            currentElement.remove();
                                        var link = $compile(clone.contents());
                                        currentElement = clone;
                                        if (newController) {
                                            locals.$scope = newScope;
                                            $controller(newController, locals);
                                            clone.data('$ngControllerController', newController);
                                            clone.children().data('$ngControllerControler', newController);
                                        }
                                        link(newScope);
                                        newScope.$emit('$viewContentLoaded');
                                    });
                                }
                                if (templateUrl) {//http get方式加载
                                    $http.get(templateUrl, { cache: $templateCache }).then(function (response) {
                                        cloneScope(response.data);
                                    });
                                } else if (template) {//js标签直写法
                                    cloneScope(template);
                                }
                            }
                        update($templateCache.get(panel));
                    }
                }
            }
    }]);

    return true;
});