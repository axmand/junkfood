/// <reference path="build/main.js" />
//因为采用异步模块化加载，所以启动时采用OnReady方式定义程序入口

Hmap.Ready(function () {

    $("#mapObj").width(window.innerWidth-20);
    $("#mapObj").height(window.innerHeight-20);
    /*-----------------3d 地图-------------------*/
    //@param
    /*{
    *       mapID:
    *       mapurl:
    *       type:
    * }
    */
    var mapObj = new Hmap.ThrMap({
        mapID: "mapObj",
        type:"mapabc",
    });

    ////var thrTilelayer = new Hmap.Layer.ThrTileMapLayer({
    ////    //mapurl: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/",
    ////    //mapurl: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/",
    ////    mapurl: "http://www.water.hubu.edu.cn:8088/ArcGIS/rest/services/HUBEI/HUBEI_NV/MapServer/",
    ////    level:5,
    ////    loglat: { log: 114.25075543467764, lat: 30.6552936452193 },
    ////    type: "esri"
    ////});

    var thrTilelayer = new Hmap.Layer.ThrTileMapLayer({
        level:17,
        //螃蟹甲
        loglat: { log: 114.34475543467764, lat: 30.53052936452193 },
        type: "mapabc"
    });

    var buildingLayer = new Hmap.Layer.ThrBuildingLayer({
        bind: thrTilelayer,
    });

    //var objModelLayer = new Hmap.Layer.ThrObjLayer({
    //    bind:thrTilelayer,
    //});

    mapObj.SetMapLayer(thrTilelayer);
    mapObj.SetBuildingLayer(buildingLayer);
    //mapObj.SetObjModelLayer(objModelLayer);
});
