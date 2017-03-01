/// <reference path="../../../build/require.js" />
/// <reference path="../../../lib/three.js" />

/*
 *   author:yellow date:2013/8/28
 *   
 *
 */

define(['three'], function (three) {
    /*
    * @param args
    *  {
    *       camera:camera
    *       domElement:renderer.domElement
    *       mouseUpCallback:
    *       zoomCallabck:
    *       
    *   }
    */
    var _mapInteractive = function (args) {
        //操作状态
        var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };
        
        this.object = args.camera;
        this.domElement = (args.domElement !== undefined) ? args.domElement : document;
        mouseUpCallback = args.mouseUpCallback || function () { };//视角操作回调-鼠标弹起
        zoomCallback = args.zoomCallabck || function () { };//视角操作回调-缩放
        //记录初始摄像机位置
        var _camSrcePos = {
            x: this.object.position.x,
            y: this.object.position.y,
            z: this.object.position.z
        }
        //
        var _this = this;
        this.enabled = true;
        this.screen = { left: 0, top: 0, width: 0, height: 0 };
        this.rotateSpeed = 1.0;
        this.zoomSpeed = 1.2;
        this.panSpeed = 0.3;
        this.noRotate = false;
        this.noZoom = false;
        this.noPan = false;
        this.noRoll = false;
        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];
        // internals
        this.target = new THREE.Vector3();
        var lastPosition = new THREE.Vector3();
        var _state = STATE.NONE,
              _prevState = STATE.NONE,
              _eye = new THREE.Vector3(),
              _rotateStart = new THREE.Vector3(),
              _rotateEnd = new THREE.Vector3(),
              _zoomStart = new THREE.Vector2(),
              _zoomEnd = new THREE.Vector2(),
              _touchZoomDistanceStart = 0,
              _touchZoomDistanceEnd = 0,
              _panStart = new THREE.Vector2(),
              _panEnd = new THREE.Vector2();
        //重置数据
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();
        // events
        var changeEvent = { type: 'change' };
        // methods
        this.handleResize = function () {
            if (this.domElement === document) {
                this.screen.left = 0;
                this.screen.top = 0;
                this.screen.width = window.innerWidth;
                this.screen.height = window.innerHeight;
            }
            else {
                this.screen = this.domElement.getBoundingClientRect();
            }
        };
        this.handleEvent = function (event) {
            if (typeof this[event.type] == 'function') {
                this[event.type](event);
            }
        };
        this.getMouseOnScreen = function (clientX, clientY) {
            return new THREE.Vector2(
                (clientX - _this.screen.left) / _this.screen.width,
                (clientY - _this.screen.top) / _this.screen.height
            );
        };
        this.getMouseProjectionOnBall = function (clientX, clientY) {
            var mouseOnBall = new THREE.Vector3(
                (clientX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * .5),
                (_this.screen.height * 0.5 + _this.screen.top - clientY) / (_this.screen.height * .5),
                0.0
            );
            var length = mouseOnBall.length();
            if (_this.noRoll) {
                if (length < Math.SQRT1_2) {
                    mouseOnBall.z = Math.sqrt(1.0 - length * length);
                }
                else {
                    mouseOnBall.z = .5 / length;
                }
            }
            else if (length > 1.0) {
                mouseOnBall.normalize();
            }
            else {
                mouseOnBall.z = Math.sqrt(1.0 - length * length);
            }
            _eye.copy(_this.object.position).sub(_this.target);
            var projection = _this.object.up.clone().setLength(mouseOnBall.y);
            projection.add(_this.object.up.clone().cross(_eye).setLength(mouseOnBall.x));
            projection.add(_eye.setLength(mouseOnBall.z));
            return projection;
        };
        this.rotateCamera = function () {
            var angle = Math.acos(_rotateStart.dot(_rotateEnd) / _rotateStart.length() / _rotateEnd.length());
            if (angle) {
                var axis = (new THREE.Vector3()).crossVectors(_rotateStart, _rotateEnd).normalize(),
                      quaternion = new THREE.Quaternion();
                      angle *= _this.rotateSpeed;
                      quaternion.setFromAxisAngle(axis, -angle);
                      _eye.applyQuaternion(quaternion);
                      _this.object.up.applyQuaternion(quaternion);
                      _rotateEnd.applyQuaternion(quaternion);
                      if (_this.staticMoving) {
                          _rotateStart.copy(_rotateEnd);
                      }
                      else {
                          quaternion.setFromAxisAngle(axis, angle * (_this.dynamicDampingFactor - 1.0));
                          _rotateStart.applyQuaternion(quaternion);
                      }
            }
        };
        this.zoomCamera = function () {
            if (_state === STATE.TOUCH_ZOOM) {
                var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd,
                      _touchZoomDistanceStart = _touchZoomDistanceEnd;
                _eye.multiplyScalar(factor);
            }
            else {
                var factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;
                if (factor !== 1.0 && factor > 0.0) {
                    _eye.multiplyScalar(factor);
                    if (_this.staticMoving) {
                        _zoomStart.copy(_zoomEnd);
                    }
                    else {
                        _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
                    }
                }
            }
        };
        this.panCamera = function () {
            var mouseChange = _panEnd.clone().sub(_panStart);
            if (mouseChange.lengthSq()) {
                mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);
                var pan = _eye.clone().cross(_this.object.up).setLength(mouseChange.x);
                //修正
                var vectorZ = new THREE.Vector3(0, 0, -1);
                vectorZ = vectorZ.add(_this.object.up);
                vectorZ = vectorZ.add(new THREE.Vector3(0, -1, 0));
                //
                pan.add(vectorZ.setLength(mouseChange.y));
                _this.object.position.add(pan);
                _this.target.add(pan);
                if (_this.staticMoving) {
                    _panStart = _panEnd;
                }
                else {
                    _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
                }
            }
        };
        this.checkDistances = function () {
            if (!_this.noZoom || !_this.noPan) {
                if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
                    _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
                }
                if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
                    _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
                }
            }
        };
        this.update = function () {
            _eye.subVectors(_this.object.position, _this.target);
            if (!_this.noRotate) {
                _this.rotateCamera();
            }
            if (!_this.noZoom) {
                _this.zoomCamera();
            }
            if (!_this.noPan) {
                _this.panCamera();
            }
            _this.object.position.addVectors(_this.target, _eye);
            _this.checkDistances();
            _this.object.lookAt(_this.target);  //target (0,0,0)
            if (lastPosition.distanceToSquared(_this.object.position) > 0) {
                _this.dispatchEvent(changeEvent);
                lastPosition.copy(_this.object.position);
            }
        };
        this.reset = function () {
            _state = STATE.NONE;
            _prevState = STATE.NONE;
            _this.target.copy(_this.target0);
            _this.object.position.copy(_this.position0);
            _this.object.up.copy(_this.up0);
            _eye.subVectors(_this.object.position, _this.target);
            _this.object.lookAt(_this.target);
            _this.dispatchEvent(changeEvent);
            lastPosition.copy(_this.object.position);
        };
        //dom event listeners
        function keydown(event) {
            if (_this.enabled === false) return;
            window.removeEventListener('keydown', keydown);
            _prevState = _state;
            if (_state !== STATE.NONE) return;
            else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) _state = STATE.ROTATE;
            else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) _state = STATE.ZOOM;
            else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) _state = STATE.PAN;
        }
        function keyup(event) {
            if (_this.enabled === false) return;
            _state = _prevState;
            window.addEventListener('keydown', keydown, false);
        }
        function viewdown(params) {
            _rotateStart = _this.getMouseProjectionOnBall(params.clientX, params.clientY);
            _rotateEnd.copy(_rotateStart)
        }
        function viewmove(params) {
            _rotateEnd = _this.getMouseProjectionOnBall(params.clientX, params.clientY);
        }
        function mousedown(event) {
            if (_this.enabled === false) return;
            event.preventDefault();
            event.stopPropagation();
            if (_state === STATE.NONE) _state = event.button;
            if (_state === STATE.ROTATE && !_this.noRotate) {
                _rotateStart = _this.getMouseProjectionOnBall(event.clientX, event.clientY);
                _rotateEnd.copy(_rotateStart)
            }
            else if (_state === STATE.ZOOM && !_this.noZoom) {
                _zoomStart = _this.getMouseOnScreen(event.clientX, event.clientY);
                _zoomEnd.copy(_zoomStart);
            }
            else if (_state === STATE.PAN && !_this.noPan) {
                _panStart = _this.getMouseOnScreen(event.clientX, event.clientY);
                _panEnd.copy(_panStart)
            }
            document.addEventListener('mousemove', mousemove, false);
            document.addEventListener('mouseup', mouseup, false);
        }
        function mousemove(event) {
            if (_this.enabled === false) return;
            event.preventDefault();
            event.stopPropagation();
            if (_state === STATE.ROTATE && !_this.noRotate) {
                //关闭鼠标左键旋转camera
                //_rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );
            }
            else if (_state === STATE.ZOOM && !_this.noZoom) _zoomEnd = _this.getMouseOnScreen(event.clientX, event.clientY);
            else if (_state === STATE.PAN && !_this.noPan) _panEnd = _this.getMouseOnScreen(event.clientX, event.clientY);
        }
        function createDomElement(elementID, cssName, position) {
            var element = document.createElement("div");
            with (element) {
                id = elementID;
                className = cssName;
                style.left = position.left + "px";
                style.top = position.top + "px";
            }
            return element;
        }
        //事件回调
        function mouseup(event) {
            if (_this.enabled === false) return;
            event.preventDefault();
            event.stopPropagation();
            _state = STATE.NONE;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            //mouse up 回调
            var x = _camSrcePos.x - _this.object.position.x;
            var z = _camSrcePos.z - _this.object.position.z;
            mouseUpCallback({x:x,z:z});
        }
        function mousewheel(event) {
            if (_this.enabled === false) return;
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta) delta = event.wheelDelta / 40; // WebKit / Opera / Explorer 9
            else if (event.detail) delta = - event.detail / 3;   // Firefox
            _zoomStart.y += delta * 0.01;
        }
        function touchstart(event) {
            if (_this.enabled === false) return;
            switch (event.touches.length) {
                case 1:
                    _state = STATE.TOUCH_ROTATE;
                    _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                case 2:
                    _state = STATE.TOUCH_ZOOM;
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
                    break;
                case 3:
                    _state = STATE.TOUCH_PAN;
                    _panStart = _panEnd = _this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                default:
                    _state = STATE.NONE;
            }
        }
        function touchmove(event) {
            if (_this.enabled === false) return;
            event.preventDefault();
            event.stopPropagation();
            switch (event.touches.length) {
                case 1:
                    _rotateEnd = _this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                case 2:
                    var dx = event.touches[0].pageX - event.touches[1].pageX;
                    var dy = event.touches[0].pageY - event.touches[1].pageY;
                    _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy)
                    break;
                case 3:
                    _panEnd = _this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                default:
                    _state = STATE.NONE;
            }
        }
        function touchend(event) {
            if (_this.enabled === false) return;
            switch (event.touches.length) {
                case 1:
                    _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY);
                    break;
                case 2:
                    _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
                    break;
                case 3:
                    _panStart = _panEnd = _this.getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY);
                    break;
            }

            _state = STATE.NONE;

        }
        this.createViewControlTool = function () {
            var container = this.domElement.parentElement;
            var widthHf = container.clientWidth / 2;
            var height = container.clientHeight - 90;
            var array = [];
            //
            var up = createDomElement("view-up", "ui-yellow-clover-itemnomal ui-yellow-clover-up", { top: height - 45, left: widthHf });
            var down = createDomElement("view-down", "ui-yellow-clover-itemnomal ui-yellow-clover-down", { top: height + 45, left: widthHf });
            var left = createDomElement("view-left", "ui-yellow-clover-itemnomal ui-yellow-clover-left", { top: height, left: widthHf - 45 });
            var right = createDomElement("view-right", "ui-yellow-clover-itemnomal ui-yellow-clover-right", { top: height, left: widthHf + 45 });
            //
            array.push(up); array.push(down); array.push(left); array.push(right);
            var that = this;

            var viewX = widthHf + 8;
            var viewY = container.clientHeight / 2 + 8;

            function cameraUP() {
                viewdown({ clientX: viewX, clientY: viewY });
                viewmove({ clientX: viewX, clientY: viewY - 2 });
                _thr3dObj.params.camera.updateMatrixWorld();
            }
            function cameraDown() {
                viewdown({ clientX: viewX, clientY: viewY });
                viewmove({ clientX: viewX, clientY: viewY + 2 });
                _thr3dObj.params.camera.updateMatrixWorld();
            }
            function cameraLeft() {
                viewdown({ clientX: viewX, clientY: viewY });
                viewmove({ clientX: viewX + 4, clientY: viewY });
                _thr3dObj.params.camera.updateMatrixWorld();
            }
            function cameraRight() {
                viewdown({ clientX: viewX, clientY: viewY });
                viewmove({ clientX: viewX - 4, clientY: viewY });
                _thr3dObj.params.camera.updateMatrixWorld();
            }
            //
            var upsetinterval, downsetinterval, leftsetinterval, rightsetinterval;
            //
            for (var i = 0; i < array.length; i++) {
                array[i].onmousedown = function () {
                    //1.模拟mousedown事件
                    switch (this.id) {
                        case "view-up":
                            upsetinterval = setInterval(cameraUP, 17);
                            break;
                        case "view-down":
                            downsetinterval = setInterval(cameraDown, 17);
                            break;
                        case "view-left":
                            leftsetinterval = setInterval(cameraLeft, 17);
                            break;
                        case "view-right":
                            rightsetinterval = setInterval(cameraRight, 17);
                            break;
                        default:
                            break;
                    }

                }
                array[i].onmouseup = function () {
                    clearInterval(upsetinterval);
                    clearInterval(downsetinterval);
                    clearInterval(leftsetinterval);
                    clearInterval(rightsetinterval);
                }
            }
            container.appendChild(up); container.appendChild(down); container.appendChild(left); container.appendChild(right);
        }
        this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
        this.domElement.addEventListener('mousedown', mousedown, false);
        this.domElement.addEventListener('mousewheel', mousewheel, false);
        this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox
        this.domElement.addEventListener('touchstart', touchstart, false);
        this.domElement.addEventListener('touchend', touchend, false);
        this.domElement.addEventListener('touchmove', touchmove, false);
        window.addEventListener('keydown', keydown, false);
        window.addEventListener('keyup', keyup, false);
        this.handleResize();
        //创建视角调整功能盘
        this.createViewControlTool();
    }
    //只创建three.EventDispatcher 的prototype
    _mapInteractive.prototype = Object.create(three.EventDispatcher.prototype);
    return {
        self: _mapInteractive
    }
});