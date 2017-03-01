/// <reference path="require.js" />

require.config({
    baseUrl: "build", // 转换为build.js的时候，需要将build改为 .
    paths: {
        //
        three: "../lib/three",
        jquery: "../lib/jquery",
        two: "../lib/two",
        //plugin
        domReady: "domReady",
        messenger: "../src/plugin/messenger",
        Chart: "../src/plugin/Chart",
        //core
        Hmath: "../src/core/Hmath",
        Hobject: "../src/core/Hobject",
        EventListener: "../src/core/EventListener",
        SocketRequest: "../src/core/SocketRequest",
        //mapcomponents
        EsriTile: "../src/components/map/tile/EsriTile",
        BaseTile: "../src/components/map/tile/BaseTile",
        ANTile: "../src/components/map/tile/ANTile",
        Building: "../src/components/map/building/Building",
        ANBuilding: "../src/components/map/building/ANBuilding",
        //3dmap
        Thr3D: "../src/thr3D/Thr3D",
        ThrMapInteractive: "../src/thr3D/ui/ThrMapInteractive",
        ThrBaseLayer: "../src/thr3D/layer/ThrBaseLayer",
        ThrTileMapLayer: "../src/thr3D/layer/ThrTileMapLayer",
        ThrBuildingLayer: "../src/thr3D/layer/ThrBuildingLayer",
        Graphic3D: "../src/thr3D/graphic/Graphic3D",
        ThrObjLayer: "../src/thr3D/layer/ThrObjLayer",
        //render
        TileRender: '../src/sec2D/graphic/TileRender',
    },
    shim:{
        three:{
            exports:"THREE"
        }
    },
    //waitSeconds: 0,
    name: "main",
    //optimize:"none",
    out: "../build-min.js"
})


//做类映射
var Hmap = {
    SecMap: "",
    ThrMap:"",
    _factory:null,
    Ready: function (factory) {
        this._factory = factory;
    },

    _OnReady: function () {
        var that = this;
        that._checkFactory = setInterval(chkfcy, 100);
        function chkfcy() {
            if (that._factory !== null) {
                clearInterval(that._checkFactory);
                that._factory();
            }
        }
    },
    Tile: {},
    Layer: {}
};

//jquery
var $;

//地图对象
require(['jquery', 'EsriTile', "BaseTile",'ANTile','ANBuilding',
            "EventListener",
            "Hmath", "Thr3D", "three", "ThrBaseLayer",
            "ThrTileMapLayer", "ThrMapInteractive", "Graphic3D",
            "ThrBuildingLayer", 
            "Hobject", "ThrObjLayer"
            ],
    function (
            jquery, EsriTile, BaseTile,ANTile,ANBuilding,
            EventListener,
            Hmath, Thr3D, three, ThrBaseLayer,
            ThrTileMapLayer, ThrMapInteractive, Graphic3D,
            ThrBuildingLayer,
            Hobject,  ThrObjLayer
            ) {
        //
        $ = jquery;
        Hmap.ThrMap = Thr3D.self;
        Hmap.Layer.ThrTileMapLayer = ThrTileMapLayer.self;
        Hmap.Layer.ThrBuildingLayer = ThrBuildingLayer.self;
        Hmap.Layer.ThrObjLayer = ThrObjLayer.self;
        //异步加载完成，回调OnReady函数
        Hmap._OnReady();
    });
