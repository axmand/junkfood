/// <reference path="build/main-2d.js" />
//因为采用异步模块化加载，所以启动时采用OnReady方式定义程序入口
Hmap.Ready(function () {
    document.getElementById('mapObj').style.width = (window.innerWidth - 20) + 'px';
    document.getElementById('mapObj').style.height = (window.innerHeight - 30) + 'px';
    /*-----------------2d 地图-------------------*/
    var mapObj = new Hmap.SecMap({
        level: 12,
        //梁子湖
        loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        //loglat: { log: 113.31400575543467764, lat: 30.3552936452193 },
        //loglat: { log: -73.92474, lat: 40.6311 },
        mapID: "mapObj",
        type: "mapabc",
    });

    //高德地图
    var anTileLayer = new Hmap.Layer.SecTileLayer({
        //海口
        type: "mapabc",
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

    //梁子湖水质检测点位Layer
    var lzhsdeLayer = new Hmap.Layer.SecFeatureLayer({
        mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HUBEI/LZH_SDE/FeatureServer/0/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
        jsonType: "esrijson",
    });

    mapObj.addLayer(lzhsdeLayer);

    lzhsdeLayer.connect('click', function (evt, feature) {
        //PH,SS,备注,TP_,TN_
        feature.setPopConfig({
            title: "监测点信息",
            context: '<h>监测点名称:' + feature.properties.Name + '</h><hr/>'
                + '<table>'
                + '<tr>' + '<td>' + 'PH指标:' + '</td>' + '<td>' + feature.properties.PH + '</td>' + '</tr>'
                + '<tr>' + '<td>' + 'TP指标:' + '</td>' + '<td>' + feature.properties.TP_ + '</td>' + '</tr>'
                + '<tr>' + '<td>' + 'TN指标:' + '</td>' + '<td>' + feature.properties.TN_ + '</td>' + '</tr>'
                + '<tr>' + '<td>' + '水深:' + '</td>' + '<td>' + feature.properties.SS + '</td>' + '</tr>'
                + '<tr>' + '<td>' + '备注:' + '</td>' + '<td>' + feature.properties.备注 + '</td>' + '</tr>'
                + '</table>',
        });
        feature.openTip();
    });

});
