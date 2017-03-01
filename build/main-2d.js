/// <reference path="require.js" />
require.config({
    baseUrl: "build", // 转换为build.js的时候，需要将build改为 .
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
        SecMapInteractive: "../src/sec2D/interactive/SecMapInteractive",
        SecDrawInteractive: "../src/sec2D/interactive/SecDrawInteractive",
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
        Stage: '../src/components/render/Stage'
    },
    shim: {
        proj4js: {
            exports: "Proj4js"
        }
    },
    //waitSeconds: 0,
    name: "main-2d",
    //optimize:"none",
    out: "../build-min.js"
});

//类映射
var Hmap = {

    //#region MapObject地图对象

    SecMap: "",

    //#endregion

    //#region 异步回调实现
    _factory: null,
    Ready: function (factory) {
        this._factory = factory;
    },
    _onReady: function () {
        var that = this;
        that._checkFactory = setInterval(chkfcy, 300);
        function chkfcy() {
            if (that._factory !== null) {
                clearInterval(that._checkFactory);
                that._factory();
            }
        }
    },
    //#endregion

    //#region 图层对象
    Layer: {
        //瓦片服务器类型
        TILETYPE: {
            ESRI: '',
            BAIDU: '',
            MAPABC: '',
            TMAP: '',
            BING: ''
        },
        //瓦片图层
        SecTileLayer: "",
        //绘图图层
        SecGraphicLayer: "",
        //要素图层
        SecFeatureLayer: "",
        //交互绘图图层
        SecDrawLayer: ''
    },
    //#endregion

    //#region 地图工具
    Tools: {
        //交互绘制工具
        SecDrawTool: "",
        //比例尺工具
        SecScaleTool: "",
        //放大缩小工具
        SecZoomTool: "",
        //坐标工具
        SecLocationTool: "",
        //打印控件
        SecPrintTool: "",
        //标绘工具
        SecPlotTool: "",
        //标绘编辑工具
        SecPlotEditTool: ''
    },
    //#endregion

    //#region 地理分析
    Analysis: {
        //创建远程分析服务器
        AnalysisServer: "",
        //请求分析
        RequestTask: "",
        //水质侵蚀度分析
        WatershedTask: "",
        //克里金插值分析
        KirgingTask: ""
    },
    //实时分析计算
    RealtimeAnalysis: {
        //实时克里金插值
        KrigingAnalysis: ''
    },
    //#endregion

    //#region 数据对象
    Data: {
        //Esri公司规范的json
        EsriJson: "",
        //OGC标准的json
        GeoJson: ''
    },
    //#endregion

    //#region 地图投影
    Projection: {
        epsg3857: "",
        epsg4326: ""
    },
    //#endregion

    //#region 地图基本类型
    //经纬度坐标
    LogLat: "",
    //屏幕像素坐标
    PixelXY: "",
    //投影坐标
    ProXY: "",
    //#endregion

    //#region 符号
    Symbol: {
        //线状符号
        LineSymbol: '',
        //点状符号
        PointSymbol: '',
        //多边形符号
        PolygonSymbol: ''
    },
    //#endregion

    //#region 标注
    Marker: {
        //图像标注
        MARKER_STYLE: {
            TEXT: '',
            TEXTANDGRAPH: '',
            IMAGE: '',
            STAR: ''
        },
        //矢量标注
        VectorMarker: ""
    },
    //#endregion

    //#region Core
    Core: {
        Hmath: null
    }
    //#endregion

};

//#region 地图对象引入

require(['MapObject', 'EsriTile', "BaseTile",
            "SecBaseLayer", "EventListener", 'SecMapInteractive',
            "Hmath", "ANTile",
            "SecTileLayer", "Hobject",
            "SecGraphicLayer",
            "SecDrawTool", 'SecScaleTool', 'SecZoomTool',
            "SecFeatureLayer", "AnalysisServer",
            "BaseTask", "RequestTask", "WatershedTask", "KirgingTask",
            "EsriJson", "GeoJson", "BaseJson",
            "epsg3857", 'epsg4326', 'Coord',
            'Symbol', 'Jsonp', 'Messenger', 'SecLocationTool',
            'SecPrintTool', 'SecDrawLayer', 'Marker', 'SecPlotTool',
            'PlotEdit', 'SecPlotEditTool'
], function (
            MapObject, EsriTile, BaseTile,
            SecBaseLayer, EventListener, SecMapInteractive,
            Hmath, ANTile,
             SecTileLayer, Hobject,
            SecGraphicLayer,
            SecDrawTool, SecScaleTool, SecZoomTool,
            SecFeatureLayer, AnalysisServer,
            BaseTask, RequestTask, WatershedTask, KirgingTask,
            EsriJson, GeoJson, BaseJson,
            epsg3857, epsg4326, Coord,
            Symbol, Jsonp, Messenger, SecLocationTool,
            SecPrintTool, SecDrawLayer, Marker, SecPlotTool,
            PlotEdit, SecPlotEditTool
            ) {
    //地图对象
    Hmap.SecMap = MapObject;
    //图层
    Hmap.Layer.TILETYPE = SecTileLayer.TILETYPE;
    Hmap.Layer.SecTileLayer = SecTileLayer.self;
    Hmap.Layer.SecGraphicLayer = SecGraphicLayer;
    Hmap.Layer.SecFeatureLayer = SecFeatureLayer;
    Hmap.Layer.SecDrawLayer = SecDrawLayer;
    //服务端分析功能
    Hmap.Analysis.AnalysisServer = AnalysisServer;
    Hmap.Analysis.RequestTask = RequestTask;
    Hmap.Analysis.WatershedTask = WatershedTask;
    Hmap.Analysis.KirgingTask = KirgingTask;
    //实时分析功能
    //投影
    Hmap.Projection.epsg3857 = epsg3857;
    Hmap.Projection.epsg4326 = epsg4326;
    //坐标对象映射
    Hmap.ProXY = Coord.ProXY;
    Hmap.LogLat = Coord.Loglat;
    Hmap.PixelXY = Coord.PixelXY;
    //Json格式映射
    Hmap.Data.GeoJson = GeoJson;
    Hmap.Data.EsriJson = EsriJson;
    //工具插件映射
    Hmap.Tools.SecDrawTool = SecDrawTool;
    Hmap.Tools.SecScaleTool = SecScaleTool;
    Hmap.Tools.SecZoomTool = SecZoomTool;
    Hmap.Tools.SecLocationTool = SecLocationTool;
    Hmap.Tools.SecPrintTool = SecPrintTool;
    Hmap.Tools.SecPlotTool = SecPlotTool;
    Hmap.Tools.SecPlotEditTool = SecPlotEditTool;
    //符号类
    Hmap.Symbol.LineSymbol = Symbol.lineSymbol;
    Hmap.Symbol.PointSymbol = Symbol.pointSymbol;
    Hmap.Symbol.PolygonSymbol = Symbol.polygonSymbol;
    //Marker
    Hmap.Marker.MARKER_STYLE = Marker.MARKER_STYLE;
    Hmap.Marker.VectorMarker = Marker.self;
    //core
    Hmap.Core.Hmath = Hmath.mH2dmath;
    //异步加载完成，回调OnReady函数
    Hmap._onReady();
});

//#endregion 
