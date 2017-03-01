/// <reference path="../../../build/require.js" />

/*
*   building图层
*/


define(['ThrBaseLayer'], function (ThrBaseLayer) {

    /*
    *   @params args
    *   {
    *       bind:layer
    *   }
    */
    var _thrBuildingLayer = function (args) {
        ThrBaseLayer.self.call(this,args);
        this.building = null;  //building 数据Layer
        this.bindID = "";
        this.buildData = [];
        this.removebuildData = [];
    }

    _thrBuildingLayer.prototype = new ThrBaseLayer.self();

    _thrBuildingLayer.prototype.Bind = function (tileLayer) {
        this.tileLayer = tileLayer;
    }
    //启动建筑物
    _thrBuildingLayer.prototype.Publish = function () {
        this.bindID = this.args.bind.args.layerID;
        this.building = this._createBuilding(this.args.type);
    }
    //
    _thrBuildingLayer.prototype.notice = function (copyElements) {
        //
        if (this.bindID === copyElements.sourceID) {
            this.building.RequestBuilding(copyElements.copyTiles, callback);
            var that = this;
            //获取build数据后的回调
            function callback(data) {
                //回调给mapObj，让mapObj绘制
                //@RequestData格式{addData,removeData}
                that.complete({addData:data,removeData:copyElements.copyDeleteTiles});
            }
        }
    }
    //
    _thrBuildingLayer.prototype._createBuilding = function (type) {
        var _building;
        switch (type) {
            case this.type.mapabc:
                var ANBuilding = require("ANBuilding").self;
                _building = new ANBuilding(this.args);
                break;
        }
        return _building;
    }
    return {
        self:_thrBuildingLayer
    }

});