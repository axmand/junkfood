/**
*   func:mapObj event management
*   @authro yellow date:2013/8/22
*   @class Hmap.Ui.SecMapInteractive
*/
define(['EventListener', 'Hobject', 'Hmath'], function (EventListener, Hobject, Hmath) {
    //交互事件
    var interactive = {
        mousedown: '',
        mousewheel: '',
        mousemove: '',
        mouseup: '',
    };
    //
    var AddListener = EventListener.AddListener, //事件注册
        RemoveListener = EventListener.RemoveListener; //移除事件
    //平移坐标
    var _coordInate = function (startX, startY) {
        this.x = startX || 0;
        this.y = startY || 0;
    },//屏幕坐标
        hook = Hobject.BaseFunc.hook,
        transition = Hmath.transition,         // 动画
        getOffsetXY = Hobject.BaseFunc.getOffsetXY,
        ua = Hobject.BaseFunc.ua();           //浏览器类型判断

    /*@param args
    *   {
    *       width:
    *       height:
    *       domLayer:  //mapObj dom element,沿用3d命名
    *       eventCallback:   //事件触发回调
    *   }
    */
    var _mapEvent = function (args) {
        var m = this;
        m.domLayer = args.domLayer;   //mapObj
        m.tileDomLayers = [];
        //element { source }
        m.eventCallback = args.eventCallback || function () { };
        //
        m.width = args.width;
        m.height = args.height;
        //事件自身属性
        m.mouseDown = false;
        m.scrolling = true;             //是否带滑动
        m.scrollTime = 300;
        m.lockEdges = true;
        m.mousePosition = new _coordInate();
        m.mouseLocations = [];   //mouse滑动轨迹
        m.velocity = new _coordInate();
        //wheel相关
        m.wheelInterval = null;
        m.wheelLocations = [];
        m.wheelAnimate = null;
        //viewingBox
        m.viewingBox = document.createElement("div");
        m.viewingBox.style.overflow = "hidden";
        m.viewingBox.id = "viewbox";
        m.viewingBox.style.width = m.width + "px";
        m.viewingBox.style.height = m.height + "px";
        m.viewingBox.style.position = "relative";
        //
        m.map = document.createElement("div");
        m.map.id = "mapLayers";
        m.map.style.position = "absolute";
        m.map.style.width = m.width + "px";
        m.map.style.height = m.height + "px";
        m.viewingBox.appendChild(m.map);
        //
        m.mouseTilePosition = { x: 0, y: 0 };
        m.offset = { x: 0, y: 0 };  //偏移量
        //
        hook.setValue('viewBox', m.viewingBox);
        //
        m.domLayer.appendChild(m.viewingBox);
        //添加图层触发事件，将domlayer添加到图层（viewbox）内
        var _onAddLayer = function (domLayer) {
            //往tilelayer层里加入domlayer（tile层的domlayer）
            m.tileDomLayers.push(domLayer);  
            m.map.appendChild(domLayer);
        };
        //mousemove
        var _mousemove = interactive.mousemove = function (event) {
            var mousePosition = event.mousePosition || m
            var m_x = event.clientX - (event.mousePosition || m.mousePosition).x + parseInt(m.map.style.left || 0),
                  m_y = event.clientY - (event.mousePosition || m.mousePosition).y + parseInt(m.map.style.top || 0);
            m.mousePosition.x = event.clientX;
            m.mousePosition.y = event.clientY;
            _movemap(m_x, m_y);
        };
        //滑动计算
        var _onScrollTimer = function () {
            if (m.mouseDown) {
                m.mouseLocations.unshift(new _coordInate(m.mousePosition.x, m.mousePosition.y));
                if (m.mouseLocations.length > 10) {
                    m.mouseLocations.pop();
                }
            } else {
                var totalTics = m.scrollTime / 10,  //此参数一定要取整
                    fractionRemaining = (totalTics - m.timerCount) / totalTics,
                    xVelocity = parseInt(m.velocity.x * fractionRemaining),
                    yVelocity = parseInt(m.velocity.y * fractionRemaining);
                _movemap(-xVelocity + parseInt(m.map.style.left) || 0, -yVelocity + parseInt(m.map.style.top) || 0);
                //最后一次移动完后重新读取瓦片
                if (m.timerCount == totalTics) {
                    clearInterval(m.timerId);
                    m.timerId = -1;
                    //最后一次移动完后重新读取瓦片
                    var panY = -yVelocity + parseInt(m.map.style.top),
                        panX = -xVelocity + parseInt(m.map.style.left);
                    //mousemove完成后的回调
                    m.eventCallback({
                        x: -1 * panY,
                        y: -1 * panX,
                        eventName: "mouseup",
                    });
                }
                ++m.timerCount;
            }
        };

        var _movemap = function (x, y) {
            //边缘锁定
            if (m.lockEdges) {
                var rightEdge = -m.map.offsetWidth + m.viewingBox.offsetWidth,
                      topEdge = -m.map.offsetHeight + m.viewingBox.offsetHeight;
            }
            m.map.style.left = x + "px";
            m.map.style.top = y + "px";
            m.eventCallback({
                x: -1 * y,
                y: -1 * x,
                eventName: "mousemove",
            });
        };

        var _checkWheel = function () {
            if (m.wheelLocations.length > 0) {
                var zoom = m.wheelLocations.shift() > 0 ? 1 : -1;
                m.wheelLocations.length = 0;
                //执行地图缩放
                m.eventCallback({
                    zoom: zoom,
                    wheelElement: m.wheelElement,
                    eventName: "mousewheel",
                });
                m.wheelInterval = null;
                m.wheelAnimate = null;
            }
        };

        //anim(styles,speed,easing,callback);
        var _zoomAnimate = function (wheelDelta) {
            var i, len = m.tileDomLayers.length, scale = 1, that = this;
            var originX = String(m.wheelElement.clientX) + 'px',
             originY = String(m.wheelElement.clientY) + 'px',
             originXY = originX + " " + originY,
             viewbox = document.getElementById('viewbox'),
             style = viewbox.style;
            //
            var setAttribute = style.setAttribute || style.setProperty;
            setAttribute.call(style, "-webkit-transform-origin", originXY);
            setAttribute.call(style, "-ms-transform-origin", originXY);
            //before Zoom
            m.eventCallback({
                eventName: "beforeMousewheel",
            });
            //IE 下解决方案（30帧，480ms）
            if (!!ua.ie) {
                setAttribute.call(style, '-ms-transition', 'all 0s ease');
                setAttribute.call(style, "-ms-transform", 'scale(1.1)');
                setAttribute.call(style, '-ms-transition', 'none 0s ease');
                setAttribute.call(style, "-ms-transform", 'scale(1)');
                setAttribute.call(style, "-ms-transform-origin", originXY);
                //保证鼠标放大缩小时，不漂移
                setTimeout(function () {
                    setAttribute.call(style, '-ms-transition', 'all 0.48s ease');
                    if (wheelDelta < 0) {
                        scale = 0.5;
                    }
                    else {
                        scale = 2;
                    }
                    var tScale = 'scale(' + scale + ')';
                    setAttribute.call(style, "-ms-transform", tScale);
                    setTimeout(function () {
                        setAttribute.call(style, '-ms-transition', 'none 0s ease');
                        setAttribute.call(style, "-ms-transform", "scale(1)");
                        _checkWheel();
                    }, 480);
                }, 16);
            } else if (!!ua.chrome) {
                //chrome下流畅解决方案
                //先变化一次，把鼠标位置放入正确位置
                setAttribute.call(style, '-webkit-transition', 'all 0s ease');
                setAttribute.call(style, "-webkit-transform", 'scale(1.1)');
                setAttribute.call(style, '-webkit-transition', 'none 0s ease');
                setAttribute.call(style, "-webkit-transform", 'scale(1)');
                setAttribute.call(style, "-webkit-transform-origin", originXY);
                //保证鼠标放大缩小时，不漂移
                setTimeout(function () {
                    setAttribute.call(style, '-webkit-transition', 'all 0.48s ease');
                    if (wheelDelta < 0) {
                        scale = 0.5;
                    }
                    else {
                        scale = 2;
                    }
                    var tScale = 'scale(' + scale + ')';
                    setAttribute.call(style, "-webkit-transform", tScale);
                    setTimeout(function () {
                        setAttribute.call(style, '-webkit-transition', 'none 0s ease');
                        setAttribute.call(style, "-webkit-transform", "scale(1)");
                        _checkWheel();
                    }, 480);
                }, 16);
            }
            return {};
        };
        //阻止浏览器默认行为
        var _preventDefault = function (event) {
            //非IE浏览器
            if (event && event.preventDefault) {
                event.preventDefault();
            } else {
                window.event.returnValue = false;
            }
        };

        AddListener(m.viewingBox, "mousedown", interactive.mousedown = function (event) {
            //保存当前鼠标位置，稍后确定鼠标移动的距离
            m.mousePosition.x = event.clientX;
            m.mousePosition.y = event.clientY;
            m.mouseTilePosition = { x: event.clientX, y: event.clientY };
            //添加mousemove事件,比document相对好控制些
            AddListener(m.viewingBox, "mousemove", _mousemove);
            m.mouseDown = true;
            //滑动scrolling效果
            if (m.scrolling) {
                m.timerCount = 0;
                if (m.timerId !== 0) {
                    clearInterval(m.timerId);
                    m.timerId = 0;
                }
                m.timerId = setInterval(_onScrollTimer, 15);
            }
            _preventDefault(event);
        });

        AddListener(document, 'mouseup', interactive.mouseup = function (event) {
            if (m.mouseDown) {
                var handler = _mousemove;
                RemoveListener(m.viewingBox, 'mousemove', handler);
            }
            m.mouseDown = false;
            if (m.mouseLocations.length > 0) {
                var clickCount = m.mouseLocations.length;
                m.velocity.x = (m.mouseLocations[clickCount - 1].x - m.mouseLocations[0].x) / clickCount;
                m.velocity.y = (m.mouseLocations[clickCount - 1].y - m.mouseLocations[0].y) / clickCount;
                m.mouseLocations.length = 0;
            }
            m.viewingBox.style.cursor = "auto";
        });

        AddListener(m.viewingBox, "mousewheel", interactive.mousewheel = function (event) {
            //支持IE和chrome写法
            var target = event.target || event.srcElement;
            var clientXY = getOffsetXY(event);
            //
            m.wheelElement = {
                target: target,
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                clientX: clientXY.left,   //用于放大缩小
                clientY: clientXY.top,
                x: event.x,
                y: event.y,
            };
            if (!m.wheelInterva & !m.wheelAnimate) {
                m.wheelAnimate = !m.wheelAnimate ? _zoomAnimate(event.wheelDelta) : m.wheelAnimate;
            }
            m.wheelLocations.unshift(event.wheelDelta);
            event.cancelBubble = true;
            _preventDefault(event);
        });

        return {
            addLayer: _onAddLayer,   //添加地图图层绑定支持
            interactive: interactive,
            viewBox: m.viewingBox,
        };
    };

    return _mapEvent;

});