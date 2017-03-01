/*
*   author:yellow  date:2013/9/16
*   func:
*/

define(['BaseTask', 'Hobject'], function (BaseTask, Hobject) {

    var extend = Hobject.BaseFunc.extend;

    var _kirgingTask = function (args) {
        BaseTask.call(this, args);
        //初始化参数分析
        this._ini(this.args);
    }

    extend(_kirgingTask, BaseTask);

    //
    _kirgingTask.prototype._ini = function (args) {
        //点features
        var features = args.features,
            polygons = args.polygons,
            attrName = args.attrName,
            bound = args.bound,
            width = args.rect.width,
            height = args.rect.height;
        //
        delete args.features;
        //
        var i, len = features.length, feature, geometry, coord,
            lat = [], log = [], value = [];
        for (i = 0; i < len; i++) {
            feature = features[i];
            geometry = feature.geometry;
            if (geometry.getType() === 'GeoPoint') {
                coord = geometry.coordinates[0];
                log.push(coord[0]);
                lat.push(coord[1]);
                value.push(feature.properties[attrName]);
            }
        }
        this.args = {
            log: log,
            lat: lat,
            value: value,
            polygons: polygons,
            attrName: attrName,
            bound:bound,
            width:width,
            height:height,
            type:this.getType(),
        }
    }

    _kirgingTask.prototype.getType = function () {
        return "KirgingTask";
    }

    return _kirgingTask;

});