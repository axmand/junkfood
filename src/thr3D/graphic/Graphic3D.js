/// <reference path="../../../build/require.js" />
/// <reference path="../../../lib/three.js" />

/*
*   author yellow date:2013/8/14
*   func:draw 3d geometry,use json and so on
*/

define(['three'], function (THREE) {
    //@params args
    /* {
    *        scene:
    *        context:
    *        floor:
    *        tileProxy:  //瓦片代理
    *        width:
    *        height:
    *   }
    */
    var _graphic3d = function (args) {
        this.args = args || {};
        this.scene = args.scene;  //导入scenc
        this.floor = args.floor;
       
        this.width = args.width;
        this.height = args.height;
        //
        this.defaultMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.7, transparent: true });
        this.geometry = [];
        //初始化参数
        //@_argsTile 计算tile加载相关参数
        this._argsTile = {
            skX: this.width /3,       //width方向偏移量
            skY: this.height/3,      //height方向偏移量
            rotX: -Math.PI / 2,        //初始旋转角度
            tileProxy:args.tileProxy, //代理url
        }
    }
    
    //将object添加到scene里
    _graphic3d.prototype._add = function (object) {
        this.scene.add(object)
    }
    //移除 object
    _graphic3d.prototype._remove = function (objectID, object) {
        var element = object || this.scene.getObjectById(objectID);
        this.scene.remove(element);
    }
    //100ms延时队列
    _graphic3d.prototype._chunk = function (array, process, context) {
        setTimeout(function () {
            var item = array.shift();
            process.call(context, item);
            if (array.length > 0) {
                setTimeout(arguments.callee, 100);
            }
        }, 100);
    }
    //---------------------------------------tile grapihc-------------------------------------------------------
    //加载瓦片的具体方法
    //@tile []
    _graphic3d.prototype._loadTile = function (tile) {
        var floor = this.floor;
        var texture = THREE.ImageUtils.loadTexture(this._argsTile.tileProxy + tile[0]);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        var xm = new THREE.MeshBasicMaterial({ map: texture });
        var tilesGeometry = new THREE.PlaneGeometry(256, 256, 1, 1);
        var mesh = new THREE.Mesh(tilesGeometry, xm);
        mesh.id = tile[3];
        mesh.rotation.x = this._argsTile.rotX;
        mesh.position.set(tile[2] - this._argsTile.skX, floor, tile[1] - this._argsTile.skY);
        mesh.scale.set(1, 1, 1);
        this._add(mesh);
    }
    //设置tileproxy
    _graphic3d.prototype.setTileProxy = function (proxyUrl) {
        this._argsTile.tileProxy = proxyUrl;
    }
    //添加tiles
    //@addTiles [ele1,ele2,ele3,...]
    //@ele [,]
    _graphic3d.prototype.addTiles = function (addTiles) {
        var value = addTiles.shift();
        while (value !== undefined) {
            this._loadTile(value);
            value = addTiles.shift();
        }
    }
    //删除指定ID的tile mesh
    //@removeTiles [], id (string) 数组
    _graphic3d.prototype.removeTiles = function (removeTiles) {
        var value = removeTiles.shift();
        while (value !== undefined) {
            this._remove(value);
            value = removeTiles.shift();
        }
    }
    //-------------------------------------------building graphic----------------------------------------------------
    _graphic3d.prototype.addBuilding = function (buildingsInfo) {
        var _BuildingsInfo = buildingsInfo;
        if (_BuildingsInfo.length != 0) {
            var materialTexture = new THREE.MeshPhongMaterial({ color: '#125471', opacity: 0.8, transparent: true });
            var material = new THREE.MeshPhongMaterial({ color: '#E6E6E6', opacity: 0.8, transparent: true });
            //混合材质
            var materials = [materialTexture, material];
            //extrudesetting
            var extrudeSettings = {};
            extrudeSettings.bevelEnabled = false;
            //extrudeSettings.bevelSegments = 0;
            extrudeSettings.bevelSize = 0;
            //extrudeSettings.steps = 10;
            extrudeSettings.back = true;

            var build_tile = _BuildingsInfo.shift();
            while (build_tile != null) {
                for (var index = 0; index < build_tile.length; index++) {
                    var ofunit = 128; //瓦片起算偏移量
                    var build = build_tile[index];
                    var id = build.id;
                    var storey = parseInt(build.floor);
                    var coords = build.coords;
                    var offsetX = build.offsetX;
                    var offsetY = build.offsetY;
                    if (coords.constructor == Array) {
                        var geo = new THREE.Geometry();
                        var shape = new THREE.Shape();
                        for (var j = 0; j < coords.length / 2; j++) {
                            var point = {
                                x: coords[2 * j] + offsetX,
                                y: coords[2 * j + 1] + offsetY
                            }
                            if (j == 0) {
                                shape.moveTo(point.x - this._argsTile.skX - ofunit, -point.y + this._argsTile.skY + ofunit);
                            }
                            else {
                                shape.lineTo(point.x - this._argsTile.skX - ofunit, -point.y + this._argsTile.skY + ofunit);
                                if (j == coords.length) {
                                    shape.closePath();
                                }
                            }
                        }
                        extrudeSettings.amount = storey * 8;
                        extrudeSettings.material = 1;
                        extrudeSettings.extrudeMaterial = 0;

                        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                        var mx = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                        mx.id = id + "_" + index;
                        mx.rotation.x = this._argsTile.rotX;
                        mx.position.set(0, 2, 0);
                        this._add(mx);
                    }
                }
                build_tile = _BuildingsInfo.shift();
            }
        }
    }
    _graphic3d.prototype.removeBuilding = function (removeData) {
        //处理函数
        var that = this;
        var process = function (value) {
            var index = 0;
            var element = that.scene.getObjectById(value + "_" + index);
            while (element != undefined) {
                that._remove("", element);
                index++;
                element = that.scene.getObjectById(value + "_" + index);
            }
        }
        this._chunk(removeData, process, that);
    }
    _graphic3d.prototype.Sphere = function () {

    }
    //生成简单的cube
    _graphic3d.prototype.Tube = function () {
        var geometry= THREE.CubeGeometry(40, 200, 40);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, map: texture }));
        return mesh;
    }

    return {
        self:_graphic3d,
    }

});

