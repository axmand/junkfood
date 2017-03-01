/// <reference path="build-min/js/build-min-2d.js" />
//因为采用异步模块化加载，所以启动时采用OnReady方式定义程序入口
Hmap.Ready(function () {
    document.getElementById('mapObj').style.width = (window.innerWidth - 20) + 'px';
    document.getElementById('mapObj').style.height = (window.innerHeight - 30) + 'px';
    /*-----------------2d 地图-------------------*/
    var mapObj = new Hmap.SecMap({
        level: 10,
        //梁子湖
        loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        mapID: "mapObj",
        type: "mapabc",
    });
    //高德地图
    var anTileLayer = new Hmap.Layer.SecTileLayer({
        type: "mapabc",
    });
    mapObj.addLayer(anTileLayer);
});
