/// <reference path="build/main-2d.js" />
//因为采用异步模块化加载，所以启动时采用OnReady方式定义程序入口
Hmap.Ready(function () {
    document.getElementById('mapObj').style.width = (window.innerWidth -200) + 'px';
    document.getElementById('mapObj').style.height = (window.innerHeight - 70) + 'px';

    document.getElementById('mapObj').style.marginLeft = '100px';
    document.getElementById('mapObj').style.marginTop = '30px';

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
        level: 6,
        //梁子湖
        //loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        //loglat: { log: 113.31400575543467764, lat: 30.3552936452193 },
        loglat: { log: 114.31400575543467764, lat: 30.3552936452193 },
        mapID: "mapObj",
        type: "mapabc"
    });

    //esri地图
    var esriTileLayer = new Hmap.Layer.SecTileLayer({
        //mapurl: "http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HAINAN/hainan/MapServer",
        mapurl:'http://www.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
        type: "esri"
    });
    mapObj.addLayer(esriTileLayer);

    ////高德地图
    //var anTileLayer = new Hmap.Layer.SecTileLayer({
    //    //海口
    //    type: "mapabc",
    //    mapurl: 'http://localhost:8090/JakMapServer?',
    //});
    //mapObj.addLayer(anTileLayer);

    //var drawTool = new Hmap.Tools.SecDrawTool();
    //mapObj.addTool(drawTool);

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

    var plotTool = new Hmap.Tools.SecPlotTool();
    mapObj.addTool(plotTool);

    var plotEditTool = new Hmap.Tools.SecPlotEditTool();
    mapObj.addTool(plotEditTool);

    ////svg 矢量图层
    //var secSvgFeatureLayer = new Hmap.Layer.SecSvgFeatureLayer();
    //mapObj.addLayer(secSvgFeatureLayer);

    //var featureLayer = new Hmap.Layer.SecFeatureLayer();
    //mapObj.addLayer(featureLayer);

    //创建serveranalysis
    var analysisServer = new Hmap.Analysis.AnalysisServer({
        //url: "ws://202.114.148.206:8080/",
        url: "ws://192.168.1.3:8080/",
        //url: "ws://59.68.79.2:8080/",
    });

    var geoJsonRequestTask = new Hmap.Analysis.RequestTask({
        data: "polyline",
        taskComplete: function (data) {
            var featureLayer = new Hmap.Layer.SecFeatureLayer({
                mapData: data,
                jsonType: "geojson"
            });
            mapObj.addLayer(featureLayer);
        }
    });

    analysisServer.addTask(geoJsonRequestTask);
    //var esriJsonRequestTask = new Hmap.Analysis.RequestTask({
    //    data: "geojson",
    //    //data: "esrijson",
    //    taskComplete: function (data) {
    //        data = JSON.parse(data);
    //        var featureLayer = new Hmap.Layer.SecFeatureLayer({geometrycollection:data});
    //        mapObj.addLayer(featureLayer);
    //        //var geoJson =new Hmap.Data.GeoJson({jsondata:data,});
    //    }
    //});

    //梁子湖水质检测点位Layer
    var lzhsdeLayer = new Hmap.Layer.SecFeatureLayer({
        mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HUBEI/LZH_SDE/FeatureServer/0/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
        jsonType: 'esrijson',
    });

    var lzhsdeLayer2 = new Hmap.Layer.SecFeatureLayer({
        mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HUBEI/LZH_SDE/FeatureServer/4/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
        jsonType: 'esrijson',
    });

    lzhsdeLayer2.connect('mouseenter', function (evt, feature) {
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

    mapObj.addLayer(lzhsdeLayer);

    //var layter11 = new Hmap.Layer.SecFeatureLayer({
    //    mapUrl: 'http://202.114.148.239:8888/ArcGIS/rest/services/Test01/MapServer/0/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=1%3D1&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=&f=pjson',
    //    jsonType: "esrijson",
    //});

    //mapObj.addLayer(layter11);

    //梁子湖边界
    //var boundary = new Hmap.Layer.SecFeatureLayer({
    //    mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HUBEI/Boundary/FeatureServer/0/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
    //    jsonType: "esrijson",
    //});

    //boundary.connect('click', function (evt, feature) {
    //    alert(feature.geoArea());
    //});

    //mapObj.addLayer(boundary);

    //var world = new Hmap.Layer.SecFeatureLayer({
    //    mapUrl: 'http://localhost:2796/build-min/demo/data/world.txt',
    //    jsonType: "geojson",
    //});

    //mapObj.addLayer(world);

    //mapObj.addLayer(lzhsdeLayer);

    // var button = document.getElementById('chazhi');

    // button.onclick = function () {
    //     var krigingTask = new Hmap.Analysis.KirgingTask({
    //         features: lzhsdeLayer.getFeatures(),
    //         polygons: boundary.toPolygons(),
    //         bound: boundary.getBound(),
    //         rect:boundary.getRect(),
    //         attrName: 'TN_',  //用PH属性值做插值
    //         taskComplete: function (data) {
    //             var graphicLayer = new Hmap.Layer.SecGraphicLayer({
    //                 mapData: data,
    //             });
    //             mapObj.addLayer(graphicLayer);
    //         }
    //     });
    //     analysisServer.addTask(krigingTask);
    // }

    lzhsdeLayer.connect('mouseenter', function (evt, feature) {
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
    //lzhsdeLayer.connect('mouseleave', function (evt, feature) {
    //    //feature.closeTip();
    //});

    var drawlayer = new Hmap.Layer.SecDrawLayer();
    mapObj.addLayer(drawlayer);


    navigator.geolocation.getCurrentPosition(function (coord) {

        var marker = new Hmap.Marker.VectorMarker({
            content: "marker实现",
            position: [coord.coords.longitude, coord.coords.latitude],
            markerStyle: Hmap.Marker.MARKER_STYLE.STAR, //胖胖的五角星
        });

        drawlayer.addMarker(marker);

    });

    var marker1 = new Hmap.Marker.VectorMarker({
        content: "marker实现",
        position: [121.60, 30.2],
        markerStyle: Hmap.Marker.MARKER_STYLE.STAR, //胖胖的五角星
    });
    var marker2 = new Hmap.Marker.VectorMarker({
        content: "marker实现",
        position: [114.60, 22.2],
        markerStyle: Hmap.Marker.MARKER_STYLE.STAR, //胖胖的五角星
    });

    drawlayer.addMarker(marker1);

    drawlayer.addMarker(marker2);

     //var geoJsonRequestTask3 = new Hmap.Analysis.RequestTask({
     //    data: "world",
     //    taskComplete: function (data) {
     //        var worldFeaturelayer = new Hmap.Layer.SecFeatureLayer({
     //            mapData: data,
     //        });

     //        worldFeaturelayer.connect('mouseenter', function (evt, feature) {

     //            for (var element in feature.geometry.geoElements) {
     //                for (var i = 0; i < feature.geometry.geoElements[element].length; i++) {
     //                    feature.geometry.geoElements[element][i].setFill('#FF0000');
     //                    //feature.geometry.geoElements[element][i].setStroke('#FF0000');
     //                }
     //            }

     //            //for (var i = 0; i < feature.geometry.geoElements.length; i++) {
     //            //    feature.geometry.geoElements[i].setFill('#FF0000');
     //            //    feature.geometry.geoElements[i].setStroke('#FF0000');
     //            //}
     //            feature.update();
     //        });
     //        worldFeaturelayer.connect('mouseleave', function (evt, feature) {
     //            for (var element in feature.geometry.geoElements) {
     //                for (var i = 0; i < feature.geometry.geoElements[element].length; i++) {
     //                    feature.geometry.geoElements[element][i].setFill('#00D2FF');
     //                    //feature.geometry.geoElements[element][i].setStroke('#00D2FF');
     //                }
     //            }
     //            //for (var i = 0; i < feature.geometry.geoElements.length; i++) {
     //            //    feature.geometry.geoElements[i].setFill('#00D2FF');
     //            //    feature.geometry.geoElements[i].setStroke('#00D2FF');
     //            //}
     //            feature.update();
     //        });
     //        worldFeaturelayer.connect('click', function (evt, feature) {
     //            //alert(feature.geoArea());
     //            feature.openTip();
     //        });

     //        mapObj.addLayer(worldFeaturelayer)
     //    }
     //});

    //analysisServer.addTask(geoJsonRequestTask3);

    //var featureLayer,heatmapLayer;
    //var geoJsonRequestTask = new Hmap.Analysis.RequestTask({
    //    //data: "geojson-polygon",
    //    //data: "geojson-line",
    //    //data: "geojson-point",
    //    taskComplete: function (data) {
    //        featureLayer = new Hmap.Layer.SecFeatureLayer({
    //            mapData: data,
    //        });
    //        //heatmapLayer = new Hmap.Layer.SecHeatmapLayer({
    //        //    mapData:data,
    //        //});
    //        //featureLayer = new Hmap.Layer.SecFeatureLayer({
    //        //    mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HAINAN/haikou_datong_programme/FeatureServer/0/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
    //        //    jsonType:"esrijson",
    //        //});
    //        mapObj.addLayer(featureLayer);
    //        //mapObj.addLayer(heatmapLayer);
    //        //
    //        featureLayer.connect('click', function (evt, feature) {
    //            //feature.setPopConfig({
    //            //    title: "颜色",
    //            //    context: '<br/><hr>'
    //            //    +feature.properties.规划名称+'<br/>'
    //            //    + feature.properties.Name + '<br/>'
    //            //    //+ feature.getGeometrys()
    //            //});
    //            //feature.openTip();
    //            //闪烁
    //            feature.flash();
    //        });
    //        featureLayer.connect('mouseenter', function (evt, feature) {
    //            //for (var i = 0; i < feature.geometry.geoElements.length; i++) {
    //            //    feature.geometry.geoElements[i].setFill('#FF00AA');
    //            //    feature.geometry.geoElements[i].setStroke('#FF00AA');
    //            //}
    //            //feature.update();
    //        });
    //        featureLayer.connect('mouseleave', function (evt, feature) {
    //            //for (var i = 0; i < feature.geometry.geoElements.length; i++) {
    //            //    feature.geometry.geoElements[i].setFill('#00D2FF');
    //            //    feature.geometry.geoElements[i].setStroke('#00D2FF');
    //            //}
    //            //feature.update();
    //        });
    //    }
    //});

    //analysisServer.addTask(geoJsonRequestTask);

    //var featureLayer2;
    //var geoJsonRequestTask2 = new Hmap.Analysis.RequestTask({
    //    //data: "geojson-polygon",
    //    data: "geojson-line",
    //    //data: "geojson-point",
    //    taskComplete: function (data) {
    //        featureLayer2 = new Hmap.Layer.SecFeatureLayer({ mapData: data });
    //        //featureLayer = new Hmap.Layer.SecFeatureLayer({
    //        //    mapUrl: 'http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HAINAN/haikou_datong_programme/FeatureServer/0/query?objectIds=&where=1%3D1&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&outSR=&returnIdsOnly=false&f=pjson',
    //        //    jsonType:"esrijson",
    //        //});
    //        mapObj.addLayer(featureLayer2);
    //        //
    //        featureLayer2.connect('click', function (evt, feature) {
    //            feature.setPopConfig({
    //                title: "颜色",
    //                context: feature.properties.color,
    //            });
    //            feature.openTip();
    //        });
    //        //featureLayer2.connect('mouseenter', function (evt, feature) {
    //        //    for (var i = 0; i < feature.geometry.geoElements.length; i++) {
    //        //        feature.geometry.geoElements[i].setFill('#FF0000');
    //        //        feature.geometry.geoElements[i].setStroke('#FF0000');
    //        //    }
    //        //    feature.update();
    //        //});
    //        //featureLayer2.connect('mouseleave', function (evt, feature) {
    //        //    for (var i = 0; i < feature.geometry.geoElements.length; i++) {
    //        //        feature.geometry.geoElements[i].setFill('#00D2FF');
    //        //        feature.geometry.geoElements[i].setStroke('#00D2FF');
    //        //    }
    //        //    feature.update();
    //        //});

    //    }
    //});

    //analysisServer.addTask(geoJsonRequestTask2);


    //var watershedTask = new Hmap.Analysis.WatershedTask({
    //    data: {
    //        reclassify: [2500, 8000, 15000]  //重分类标准
    //    },
    //    taskComplete: function (data) {
    //        var featureLayer = new Hmap.Layer.SecFeatureLayer({ mapData: data });
    //        mapObj.addLayer(featureLayer);
    //        //featureLayer.onmousemove(function (element) {
    //        //    alert(element);
    //        //});
    //    }
    //});

    //analysisServer.AddTask(watershedTask);

    //$.ajax({
    //    type: 'GET',
    //    url: 'http://202.114.148.205:8100/JakMap',
    //    data: {id: "11" },
    //    success: function (data) {
    //        var s = data;
    //    }
    //});

    //var KirgingTask = new Hmap.Analysis.KirgingTask({
    //    data: "{克里金插值}",
    //    taskComplete: function (data) {
    //        //alert(data);
    //    }
    //});

    //analysisServer.AddTask(KirgingTask);

    //创建graphic layer 绘图图层
    //var graphicLayer = new Hmap.Layer.SecGraphicLayer();
    //mapObj.addLayer(graphicLayer);
    ////创建建筑物图层，同时指定建筑物图层与瓦片图层绑定
    //var buildingLayer = new Hmap.Layer.SecBuildingLayer({
    //    bind:anTileLayer
    //});
    ////注意，建筑物图层要在瓦片图层后加，遵循arcgis图层加载顺序原则

    //mapObj.addLayer(buildingLayer);

});
