/// <reference path="../../../build/require.js" />
/*
*   author:yellow date:2013/8/26
*   func:add object json file,location file by given urls
*/

define(['ThrBaseLayer','three'], function (ThrBaseLayer,THREE) {
    //@args {bind:layer}
    var _thrObjLayer = function (args) {
        ThrBaseLayer.self.call(this, args);
        //
        this.tileLayer = null;
        this.bindID = "";
    }

    _thrObjLayer.prototype = new ThrBaseLayer.self();
    
    _thrObjLayer.prototype.Bind = function (tileLayer) {
        this.tileLayer = tileLayer;
    }

    _thrObjLayer.prototype.Publish = function () {
        this.bindID = this.args.bind.args.layerID;

    }

    _thrObjLayer.prototype.notice = function (copyElements) {
        if (this.bindID === copyElements.sourceID) {
            var that = this;
            function callback(zmesh) {
                that.complete(zmesh);
            }
            this.loadObjModel("data/3DObj/xsj.js", callback);
        }
    }

    //
    _thrObjLayer.prototype.loadObjModel = function (jsonURL,loadComplete) {
        var loader = new THREE.JSONLoader();
        var callback = function (geometry, materials) { createScene(geometry, materials, -390, 0,-220, 0) };
        loader.load(jsonURL, callback, "data/3DObj/maps");
        function createScene(geometry, materials, x, y, z, b) {
            //创建场景
            var zmesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            zmesh.position.set(x, y, z);
            zmesh.scale.set(1, 1, 1);
            //成功后回调zmesh
            loadComplete(zmesh);
        }
    }
    


    //
    return {
        self:_thrObjLayer,
    }

});