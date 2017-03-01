/// <reference path="../../../../build/require.js" />
/*
*   mapabc building信息获取
*/
define(["Building"], function (Building) {
    var _anBuilding = function (args) {
        Building.self.call(this, args);
    }

    _anBuilding.prototype = new Building.self();

    //@tileLayer, 数据类型
    _anBuilding.prototype.BindTile = function (tileLayer) {
        //this.buildings,this.delteBuildings

    }

    _anBuilding.prototype.RequestBuilding = function (tilearray,callback) {
        //
        var request = this._assembling(tilearray);
        var url = request.url;
        var position = request.posarray;
        Jsonp.getJson(url, null, function (data) {
            var datalist = data.list;
            //组装data,为data添加x,y
            if (datalist == undefined) {
                return;
            }
            //
            for (var i = 0; i < datalist.length; i++) {
                var element = position[i];
                //datalist[i] = datalist[i] || {};
                var id = datalist[i].index.z + "_" + datalist[i].index.y + "_" + datalist[i].index.x;
                var str = position[id];
                var element = str.split("_");
                datalist[i].index.posX = element[0] * 1; //str需要转换为整数
                datalist[i].index.posY = element[1] * 1;
            }
            if (callback != undefined) {
                callback(datalist);
            }
        });
    }

    //组装成 building数据请求地址
    _anBuilding.prototype._assembling = function (tilearray) {
        var positionXY = {};
        var requestUrl = "http://vector.amap.com/vector/buildings?tiles=";
        var value = tilearray.shift();
        var level;
        while (value != undefined) {
            var id = value[3];
            var params = id.split('_'),x = params[1], y = params[2];
            level=level||params[0];
            //
            requestUrl += y + "," + x + ";";
            positionXY[id]=value[2]+"_"+value[1];
            //
            value = tilearray.shift();
        }
        requestUrl = requestUrl.substring(0, requestUrl.length - 1);
        requestUrl += "&level=" + level;
        return{
            url: requestUrl,
            posarray:positionXY,
        }
    }
   
    return {
        self:_anBuilding,
    }

});