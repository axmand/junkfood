({
    baseUrl: ".",
    paths: {
        //plugin
        Messenger: "../src/core/Messenger",
        //html2canvas: "../src/plugin/html2canvas",
        //core
        Hui: '../src/core/Hui',
        Hmath: "../src/core/Hmath",
        Hobject: "../src/core/Hobject",
        EventListener: "../src/core/EventListener",
        SocketRequest: "../src/core/SocketRequest",
        Jsonp: "../src/core/Jsonp",
        Hcss: '../src/core/Hcss',
        //control
        //mapcomponents-map-tile
        EsriTile: "../src/components/map/tile/EsriTile",
        BaseTile: "../src/components/map/tile/BaseTile",
        ANTile: "../src/components/map/tile/ANTile",
        //mapcomponents-baseType
        Grid: "../src/components/baseType/Grid",
        Marker: "../src/components/baseType/Marker",
        Coord: "../src/components/baseType/Coord",
        Bound: "../src/components/baseType/Bound",
        Feature: "../src/components/baseType/Feature",
        Symbol: '../src/components/baseType/Symbol',
        GeoElement: '../src/components/baseType/GeoElement',
        //mapcomponents-baseType-geometry
        GeoGeometry: "../src/components/baseType/geometry/GeoGeometry",
        GeoPolygon: "../src/components/baseType/geometry/GeoPolygon",
        GeoLineString: '../src/components/baseType/geometry/GeoLineString',
        GeoPoint: '../src/components/baseType/geometry/GeoPoint',
        GeoMultiPolygon: '../src/components/baseType/geometry/GeoMultiPolygon',
        //mapcomponents-plot 标绘模块组
        DrawProtocol: '../src/components/plot/DrawProtocol',
        PlotElement: '../src/components/plot/PlotElement',
        PlotEdit: '../src/components/plot/PlotEdit',
        PlotAlgorithm: '../src/components/plot/PlotAlgorithm',
        BeelineArrow: '../src/components/plot/arrows/BeelineArrow',
        DoubleArrow: '../src/components/plot/arrows/DoubleArrow',
        CurveArrow: '../src/components/plot/arrows/CurveArrow',
        SlightnessArrow: '../src/components/plot/arrows/SlightnessArrow',
        BaseRoute: '../src/components/plot/routelabel/BaseRoute',
        ArmyRoute: '../src/components/plot/routelabel/ArmyRoute',
        ArsenalRoute: '../src/components/plot/routelabel/ArsenalRoute',
        ExpertRoute: '../src/components/plot/routelabel/ExpertRoute',
        MedicalRoute: '../src/components/plot/routelabel/MedicalRoute',
        PowerRoute: '../src/components/plot/routelabel/PowerRoute',
        ProChymicRoute: '../src/components/plot/routelabel/ProChymicRoute ',
        ProjectRoute: '../src/components/plot/routelabel/ProjectRoute',
        ProSuccorRoute: '../src/components/plot/routelabel/ProSuccorRoute',
        //mapcomponents-projection
        epsg3857: "../src/components/projection/epsg3857",
        epsg4326: "../src/components/projection/epsg4326",
        //mapcomponents-analysis
        AnalysisServer: "../src/components/analysis/AnalysisServer",
        //mapcomponents-analysis-tmAnalysis 
        BaseTask: "../src/components/analysis/BaseTask",
        RequestTask: "../src/components/analysis/tmAnalysis/RequestTask",
        WatershedTask: "../src/components/analysis/tmAnalysis/WatershedTask",
        KirgingTask: "../src/components/analysis/tmAnalysis/KirgingTask",
        //mapcomponents-analysis-rtAnalysis (realtime)
        //jsondata
        BaseJson: "../src/components/jsonMap/BaseJson",
        EsriJson: "../src/components/jsonMap/EsriJson",
        GeoJson: "../src/components/jsonMap/GeoJson",
        //2dmap
        MapObject: "../src/sec2D/MapObject",
        SecMapInteractive: "../src/sec2D/ui/SecMapInteractive",
        SecDrawInteractive: "../src/sec2D/ui/SecDrawInteractive",
        //layer
        SecBaseLayer: "../src/sec2D/layer/SecBaseLayer",
        SecDrawLayer: '../src/sec2D/layer/SecDrawLayer',
        SecTileLayer: "../src/sec2D/layer/SecTileLayer",
        SecGraphicLayer: "../src/sec2D/layer/SecGraphicLayer",
        SecFeatureLayer: "../src/sec2D/layer/SecFeatureLayer",
        //2dmap tool
        SecBaseTool: "../src/sec2D/tools/SecBaseTool",
        SecDrawTool: "../src/sec2D/tools/SecDrawTool",
        SecScaleTool: '../src/sec2D/tools/SecScaleTool',
        SecZoomTool: '../src/sec2D/tools/SecZoomTool',
        SecLocationTool: '../src/sec2D/tools/SecLocationTool',
        SecPrintTool: '../src/sec2D/tools/SecPrintTool',
        SecPlotTool: '../src/sec2D/tools/SecPlotTool',
        SecPlotEditTool: '../src/sec2D/tools/SecPlotEditTool',
        //Render for map
        TileRender: '../src/sec2D/graphic/TileRender',
        MapRender: '../src/sec2D/graphic/MapRender',
        //Render engine
        Utils: "../src/components/render/Utils",
        Heat: "../src/components/render/shape/Heat",  //热力图
        Collection: "../src/components/render/type/Collection",
        Transform: "../src/components/render/type/Transform",
        Animation: "../src/components/render/animate/Animation",
        DragAndDrop: '../src/components/render/animate/DragAndDrop',
        EditAndSave: '../src/components/render/animate/EditAndSave',
        Tween: '../src/components/render/animate/Tween',
        Circle: '../src/components/render/shape/Circle',
        Polygon: '../src/components/render/shape/Polygon',
        RePolygon: '../src/components/render/shape/RePolygon',
        Star: '../src/components/render/shape/Star',
        Raster: '../src/components/render/shape/Raster',
        Shape: '../src/components/render/shape/Shape',
        Sprite: '../src/components/render/shape/Sprite',
        Line: '../src/components/render/shape/Line',
        Canvas: '../src/components/render/Canvas',
        Container: '../src/components/render/Container',
        Context: '../src/components/render/Context',
        Factory: '../src/components/render/Factory',
        Layer: '../src/components/render/Layer',
        Node: '../src/components/render/Node',
        Render: '../src/components/render/Render',
        Stage: '../src/components/render/Stage',
    },
    shim: {
        proj4js: {
            exports: "Proj4js"
        }
    },
    //waitSeconds: 0,
    name: "main",
    //optimize:"none",
    out: "../build-min/js/build-min-2d.js"
})