/**
*   author:yellow date:2013/8/1
*   base function for map tiles
*   @class Hmap.Tile.BaseTile
*/

define(['Hmath', 'Hobject'], function (Hmath, Hobject) {

    var deepCopy = Hobject.BaseFunc.deepCopy;

    var _baseMapTile = function (args) {
        this.args = args || {};
        this.addTiles = [];      //需要加载的瓦片集合
        this.deleteTiles = [];   //待删除瓦片
        this.mapObjcallback = this.args.mapObjcallback;   //初始化完毕之后回调函数
        this.proxy = "";    //跨域访问代理
        this.midx = this.args.midx || 1;
        this.info = {
            lastmatrix: [],       //上次存储图像位置矩阵，格式为[[0,0],[0,1],...]
            targetPosition: null, // 当前屏幕参考点
            lastPiPj: { pi: 0, pj: 0 },//相对lastmatrix的平移矩阵参数
            unit: null,//地图单位
            len: null,// length/pixel  当前缩放层级下每个像素点代表的当前地图单位下的长度
            level: null,//当前地图缩放层级,
            lyrOffX: 0,//layer和瓦片的相对偏移 left
            lyrOffY: 0,//layer和瓦片的相对偏移top
        };
        //自定义函数库
        this.__h2dmath = Hmath.mH2dmath;
    };
    
    //@basetile定义的方法都是重新计算tile和deletetiles
    _baseMapTile.prototype = {
        /**
        *   打包待添加和删除的瓦片
        *   @method pack
        */
        pack: function (addElements, delElement) { },
        //计算当前瓦片位置
        //this.tiles和this.deleteTiles的值
        load: function (callback) {},
        //根据屏幕x,y偏移量重新计算瓦片
        move: function (offsetX, offsetY) {},
        //放大缩小
        zoom: function (zoom) { },
        //通过经纬度和缩放层级，计算到屏幕的瓦片位置像素点
        //@param {log,lat}
        screenPosition: function (loglat) {},
        //通过屏幕像素点计算经纬度信息
        //@params {x,y,target} target为 tile img对象，x,y为offsetx,offsety
        mapPosition: function (element) {},
        //屏幕上每个像素点代表的长度，比如 度/pix,meter/pix
        //@return {len,unit}
        perPixelLen: function () { },
        subScribe:function(){
            var id,
                copyTiles = deepCopy(this.tiles),  //待添加的瓦片备份
                copyDeleteTiles = deepCopy(this.deleteTiles); //待删除的瓦片备份

            if (this.args.domLayer != undefined) {
                id = this.args.domLayer.id;
            }else{
                id = this.args.layerID;
            }
            //copyElements
            this.mapObjcallback({ copyTiles: copyTiles, copyDeleteTiles: copyDeleteTiles, sourceID: id });
        },
    };

    return _baseMapTile;
 
});
