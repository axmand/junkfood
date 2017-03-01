/// <reference path="../../../build/require.js" />

/*
*   author:yellow date:2013/8/8
*   func: create tile layer 
*
*/

define(['ThrBaseLayer'], function (ThrBaseLayer) {
    //@param args
    //{mapurl,type,level}
    var _tilelayer = function (args) {
        //指定修正指数
        args.midx = args.midx || 1.5;
        ThrBaseLayer.self.call(this, args);
        this.tileslayer = null;
        this.complete = null;  //回调
        //
        this.tiles = [];                          // tiles
        this.deleteTiles = [];                // deleteTiles
    }
    
    _tilelayer.prototype = new ThrBaseLayer.self();

    _tilelayer.prototype._createTiles = function (type) {
        switch (type)
        {
            case "esri":
                var esriTile = require('EsriTile').self;
                this.tileslayer = new esriTile(this.args);
                break;
            case "mapabc":
                var anTile = require('ANTile').self;
                this.tileslayer = new anTile(this.args);
            default:
                break;
        }
    }

    _tilelayer.prototype.Move = function (offsetX, offsetY) {
        this.tileslayer.Move(offsetX, offsetY);
    }

    //rewrite publish
    _tilelayer.prototype.Publish = function () {
        var that = this;
        //初始化tilelayer
        this._createTiles(this.args.type);
        //计算tilelayer
        this.tileslayer.Load(callback);
        //回调
        function callback(tiles,deletatiles,proxy) {
            that.tiles = tiles;
            that.deleteTiles = deletatiles;
            if (that.complete !== null) {
                that.complete(tiles, deletatiles,proxy);
            }
            that.complete = null;
        }
        //
    }

    return {
        self:_tilelayer
    }

});