/**
*   定义maplayer，提供layer的绘制方法，事件注册等
*   @abstract 
*   @class Hmap.Layer.SecBaseLayer
*/
define(function () {

    var _baselayer = function (args) {
        this.args = args || {};
        this.layerID = this.args.layerID;
        this.domLayer = null;
        this.mapObjCallback = null;//向mapObj发出通知，layer与mapObj交互
        this.complete = function () { };  //瓦片初始化完毕的回调
        this.layerInfo = null;
        this.hidden = false;    //记录图层显隐状态
    };

    //提供可被复写的 mouse 事件
    _baselayer.prototype = {
        /**
        *   layer初始化，根据mapObj的参数
        *   @method layerInilization
        */
        layerInilization: function (args) {
            //1.合并args参数
            this._merge(args);
            //2.读取mapElement信息
            this._loadClient();
            //3.获取domLayer
            this._createlayer();
            //4.初始化事件加载/创建特有参数
            this._iniEvent();
            //5.完成回调
            this._publish();
        },
        /**
        *   订阅事件，订阅来自mapObj下发的变动信息
        *   @method notice
        */
        notice: function (copyElements) {
        },
        //show图层
        show: function () {
            this.hidden ? this.domLayer.style.visibility = "visible" : null;
            this.hidden = false;
        },
        //hide图层
        hide: function () {
            !this.hidden ? this.domLayer.style.visibility = "hidden" : null;
            this.hidden = true;
        },
        //返回当前对象的类型,默认返回SecBaseLayer
        getType: function () {
            return "SecBaseLayer";
        },

        //#region 内置实现
        _loadClient: function () {
            this.mapElement = this.args.mapElement;
            this.mapWidth = this.mapElement.offsetWidth;
            this.mapHeight = this.mapElement.offsetHeight;
            this.layerInfo = this.args.layerInfo;
        },
        _createlayer: function () {

        },
        _iniEvent: function () { },
        _publish: function () { },
        /**
        *   args 包含elementID,接受参数
        *   合并args,如有相同项，以当前layer初始化参数为准
        *   @method merge
        */
        _merge: function (args) {
            for (var item in args) {
                if (this.args[item] === undefined) {
                    this.args[item] = args[item];
                }
            }
        },
        //#endregion
    };

    return _baselayer

});