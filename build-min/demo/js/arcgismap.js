/// <reference path="../../js/build-min-2d.js" />
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
        type: Hmap.Layer.TILETYPE.MAPABC,
    });
    //esri地图
    var esriTileLayer = new Hmap.Layer.SecTileLayer({
        mapurl: 'http://www.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
        //mapurl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
        type: Hmap.Layer.TILETYPE.ESRI,
    });
    mapObj.addLayer(esriTileLayer);
});

