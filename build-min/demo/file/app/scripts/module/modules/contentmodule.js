/// <reference path="../../../vendor/hmap.js" />
/**
*   子module,页面主体地图显示区域module
*   @author }{hk date 2014/10/14
*   @class contetnmodule
*/

define(['basemodule', 'objutil', 'hmap'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _contentModule = function (opts) {
        basemodule.call(this, opts || {});
    }

    extend(_contentModule, basemodule);

    _contentModule.prototype.createMap = function () {

        ////这里插入具体map实现代码
        //document.getElementById('mapObj').style.width = (window.innerWidth - 20) + 'px';
        //document.getElementById('mapObj').style.height = (window.innerHeight - 70) + 'px';
        //var mapObj = new Hmap.SecMap({
        //    level: 6,
        //    //梁子湖
        //    //loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        //    //loglat: { log: 113.31400575543467764, lat: 30.3552936452193 },
        //    loglat: { log: 110.02474, lat: 20.0311 },
        //    mapID: "mapObj",
        //    type: "mapabc",
        //});
        //var esriTileLayer = new Hmap.Layer.SecTileLayer({
        //    //mapurl: "http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HAINAN/hainan/MapServer",
        //    mapurl: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
        //    type: "esri",
        //});
        //mapObj.addLayer(esriTileLayer);

    }

    _contentModule.prototype.createLayer = function () {

    }

    _contentModule.prototype.createService = function () {
        this.createMap();
    }

    _contentModule.prototype.createCommand = function () {

    }

    _contentModule.prototype.createView = function () {

    }

    return _contentModule;

});