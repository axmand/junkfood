({
    baseUrl: ".",
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
        //2dmap
        SecBaseLayer: "../src/sec2D/layer/SecBaseLayer",
        SecBuildingLayer: "../src/sec2D/layer/SecBuildingLayer",
        MapObject: "../src/sec2D/MapObject",
        SecMapInteractive: "../src/sec2D/ui/SecMapInteractive",
        SecDrawInteractive: "../src/sec2D/ui/SecDrawInteractive",
        SecTileLayer: "../src/sec2D/layer/SecTileLayer",
        Graphic2D: "../src/sec2D/graphic/Graphic2D",
        SecGraphicLayer: "../src/sec2D/layer/SecGraphicLayer",
        //2dmap tool
        SecBaseTool: "../src/sec2D/tools/SecBaseTool",
        SecDrawTool: "../src/sec2D/tools/SecDrawTool",
        //3dmap
        Thr3D: "../src/thr3D/Thr3D",
        ThrMapInteractive: "../src/thr3D/ui/ThrMapInteractive",
        ThrBaseLayer: "../src/thr3D/layer/ThrBaseLayer",
        ThrTileMapLayer: "../src/thr3D/layer/ThrTileMapLayer",
        ThrBuildingLayer: "../src/thr3D/layer/ThrBuildingLayer",
        Graphic3D: "../src/thr3D/graphic/Graphic3D",
        ThrObjLayer: "../src/thr3D/layer/ThrObjLayer",
    },
    shim: {
        three: {
            exports: "THREE"
        }
    },
    //waitSeconds: 0,
    name: "main-3d",
    //optimize: "none",
    out: "../build-min/js/build-min-3d.js"
})