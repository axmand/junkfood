/// <reference path="build/main-2d.js" />
//因为采用异步模块化加载，所以启动时采用OnReady方式定义程序入口
Hmap.Ready(function () {
    document.getElementById('mapObj').style.width = (window.innerWidth - 20) + 'px';
    document.getElementById('mapObj').style.height = (window.innerHeight - 30) + 'px';
    //document.getElementById('mapObj').style.marginLeft = '180px';

    //$("#mapObj").width(window.innerWidth-20);
    //$("#mapObj").height(window.innerHeight-20);
    //////投影变换
    //var map = new Hmap.LogLat(110.83400575543467764, 31.3152936452193);
    //var proXY = new Hmap.ProXY.fromArray([12337853.609566841, 3673869.327498704]);
    ////大地坐标转投影坐标
    //var s0 = Hmap.Projection.epsg3857.forwardMeractor(map);
    ////投影坐标转大地坐标
    //var s1 = Hmap.Projection.epsg3857.inverseMeractor(proXY);

    /*-----------------2d 地图-------------------*/
    var mapObj = new Hmap.SecMap({
        level: 12,
        //梁子湖
        loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        mapID: "mapObj",
        type: "mapabc",
    });

    //高德地图
    var anTileLayer = new Hmap.Layer.SecTileLayer({
        //海口
        type: "mapabc",
        //mapurl: 'http://202.114.148.206:8090/JakMapServer?',
    });
    mapObj.addLayer(anTileLayer);

    //比例尺工具
    var scaleTool = new Hmap.Tools.SecScaleTool();
    mapObj.addTool(scaleTool);

    //屏幕经纬度工具
    var locationTool = new Hmap.Tools.SecLocationTool();
    mapObj.addTool(locationTool);

    //缩放工具
    var zoomTool = new Hmap.Tools.SecZoomTool();
    mapObj.addTool(zoomTool);

    //绘图工具
    var drawTool = new Hmap.Tools.SecDrawTool();
    mapObj.addTool(drawTool);

    //打印工具
    var printTool = new Hmap.Tools.SecPrintTool();
    mapObj.addTool(printTool);
});
