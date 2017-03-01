/// <reference path="../../lib/three.js" />
/// <reference path="../../build/require.js" />


/*
*   3d地图对象，相当于mapobj
*
*/
define(['three', 'Graphic3D', 'Hobject'], function (THREE, Graphic3D, Hobject) {
    //@params 
    //{  mapurl:"" , type:"esri" ,zlevel:"",width,height }
    var _thr3D = function (args) {
        //定义所有内置参数
        this.params = {
            //three.js属性，三维场景属性
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({ antialias: true }),
            camera: null,
            directionalLight: new THREE.DirectionalLight(0xffeedd),
            spotLight: new THREE.SpotLight(0xffffff, 2, 1000),
            hemiLight: new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6),
            tileLayer: null,//瓦片层，自管理
            floor:0,
            buildLayer: null,//build层，自管理
            objLayer:null, //obj model层
            //工具栏，插件管理
            toolbar: null,
            //mapobj自身属性
            container:null,
            width: 0,
            height: 0,
            thrMapInteractive: null,  //鼠标操作
            lastCopyElements: null,  //记录上次回调
            layers: [],                         //加到mapobj里的图层数组
            layerindex:0, //作为layerid的索引号
        }
        //
        var that = this;
        this.subscribe = function (copyElements) {
            that.params.lastCopyElements = copyElements;
            for (var i = 0; i < that.params.layers.length; i++) {
                that.params.layers[i].notice(copyElements);
            }
        }
        this.args = args;
        this._hobject =new Hobject.self();
        this._inilization(args); //初始化
        //启动
        this.run();
    }
    _thr3D.prototype.run = function () {
            this.params.thrMapInteractive.update();
        this.params.renderer.render(this.params.scene, this.params.camera);
        var that = this;
        requestAnimationFrame(function () { that.run(); });
    }
    //控制初始化顺序
    _thr3D.prototype._inilization = function (args) {
        this._iniMapObj(args);
        this._iniScene();
        this._iniCamera();
        this._iniRenderer();
        this._iniLight();
        this._iniMapInteractive();
        this._iniGraphic3d();
    }
    //初始化绘图工具类
    _thr3D.prototype._iniGraphic3d = function () {
        var graphic3d = Graphic3D.self;
        this._graphic3d =new graphic3d({
            scene: this.params.scene,
            context: null,
            floor: this.params.floor,
            width: this.params.width,
            height: this.params.height,
        });
    }
    //初始化canvas容器（mapObj）
    _thr3D.prototype._iniMapObj = function (args) {
        this.params.container = document.getElementById(args.mapID);
        this.params.width = this.params.container.clientWidth;
        this.params.height = this.params.container.clientHeight;
        with (this.params.container) {
            style.width = this.params.width + "px";
            style.height = this.params.height + "px";
        }
        document.body.appendChild(this.params.container);
    }
    _thr3D.prototype._iniCamera = function () {
        this.params.camera = new THREE.PerspectiveCamera(45, this.params.width / this.params.height, 1, 10000);
        this.params.camera.position.set(0, 450, 200);
        //this.params.camera.position.set(0, 200, 400);
        this.params.camera.lookAt(this.params.scene.position);
        this.params.camera.updateMatrixWorld();
    }
    _thr3D.prototype._iniScene = function () {
        //this.params.scene.fog = new THREE.Fog(0xffffff, 400, 1150);
        this.params.scene.fog = new THREE.Fog(0xffffff, 1, 3000);
        //this.params.scene.fog.color.setHSL(0.6, 0, 1);
    }
    _thr3D.prototype._iniLight = function () {
        this._addObjToSene(new THREE.AmbientLight(0x787878));
        this.params.hemiLight.position.set(200, 500, 500);
        this._addObjToSene(this.params.hemiLight)

    }
    _thr3D.prototype._iniRenderer = function () {
        this.params.renderer.setSize(this.params.width, this.params.height);
        this.params.renderer.setClearColor(this.params.scene.fog.color, 1);
        //添加到container里
        this.params.container.appendChild(this.params.renderer.domElement);
        this.params.renderer.gammaInput = true;
        this.params.renderer.gammaOutput = true;
        this.params.renderer.shadowMapEnabled = true;
    }
    _thr3D.prototype._iniMapInteractive = function () {
        var that = this;
        var interactive = require('ThrMapInteractive').self;
        var _musUpCbk = function (elements) {
            //重新计算瓦片
            that.params.tileLayer.Move(-1 * elements.z, -1 * elements.x);
            that._graphic3d.addTiles(that.params.tileLayer.tiles);
            that._graphic3d.removeTiles(that.params.tileLayer.deleteTiles);
        }
        this.params.thrMapInteractive = new interactive({
            camera: this.params.camera,
            domElement: this.params.renderer.domElement,
            mouseUpCallback: _musUpCbk,//鼠标up的回调
        });
        this.params.thrMapInteractive.target.set(0, 0, 0);
    }
    //
    _thr3D.prototype._addObjToSene = function (obj3D) {
        this.params.scene.add(obj3D);
    }
    //添加tilemap,选取map类型
    //@param mapargs
    //{mapurl,type,level,loglat:{log,lat}}
    _thr3D.prototype.SetMapLayer = function (tilemaplayer) {
        var that = this;
        this.params.tileLayer = tilemaplayer;
        this.params.tileLayer._mergeargs(this.args);
        //完成后的回调，初始化瓦片
        this.params.tileLayer.complete = function (tiles,deletetiles,proxy) {
            that._graphic3d.setTileProxy(proxy);
            that._graphic3d.addTiles(tiles);
        }
        
        this.params.tileLayer.args.layerID = "mapLayer" + this.params.layerindex++;
        this.params.tileLayer.subscribe = this.subscribe;
        //添加到tile
        this.params.layers.push(this.params.tileLayer);
        this.params.tileLayer.Publish();
    }
    //设置建筑物层
    _thr3D.prototype.SetBuildingLayer = function (buildlayer) {
        var that = this;
        this.params.buildLayer = buildlayer;
        this.params.buildLayer._mergeargs(this.args);
        this.params.buildLayer.args.layerID = "buildlayer" + this.params.layerindex++;
        this.params.layers.push(this.params.buildLayer);
        this.params.buildLayer.subscribe = this.subscribe;
        //@RequestData格式{addData,removeData}
        this.params.buildLayer.complete = function (data)
        {
            var buildinfo = that._hobject.analysisJson.buildingJson(data.addData);
            that._graphic3d.addBuilding(buildinfo);
            that._graphic3d.removeBuilding(data.removeData)
        }
        this.params.buildLayer.Publish();
        this.params.buildLayer.notice(this.params.lastCopyElements);
    }

    _thr3D.prototype.SetObjModelLayer = function (objlayer) {
        var that = this;
        this.params.objLayer = objlayer;
        this.params.objLayer._mergeargs(this.args);
        this.params.objLayer.args.layerID = "buildlayer" + this.params.layerindex++;
        this.params.layers.push(this.params.objLayer);
        this.params.objLayer.subscribe = this.subscribe;
        //@RequestData格式{addData,removeData}
        this.params.objLayer.complete = function (zmesh) {
            that._addObjToSene(zmesh);
        }
        this.params.objLayer.Publish();
        this.params.objLayer.notice(this.params.lastCopyElements)

    }

    return{
        self:_thr3D
    }
});