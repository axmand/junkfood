/**
*   显示鼠标所在位置工具
*   占据地图区域右下角
*   @class Hmap.Tools.SecLocationTool
*/
define(['Hobject', 'SecBaseTool', 'EventListener', ],
    function (Hobject, SecBaseTool, EventListener) {

        var extend = Hobject.BaseFunc.extend,
        getOffsetXY = Hobject.BaseFunc.getOffsetXY,
        addListener = EventListener.AddListener,
        SecBaseTool = SecBaseTool.self;

        var mapElement, //地图dom对象
           toolDiv,//tool Div对象
           mapPosition2,
           style;

        var _secLocationTool = function (opts) {
            var _opts = opts || {};
            SecBaseTool.call(this, opts);
        }

        extend(_secLocationTool, SecBaseTool);

        _secLocationTool.prototype._createTool = function () {
            var args = this.args;
            var that = this;
            mapElement = mapElement || args.mapElement;
            mapPosition2 = args.mapPosition2;
            this.mapInfo = args;
            //1.创建1cm长度的border
            this.scaleDiv = document.createElement('div');
            this.scaleDiv.className = 'Jake-ui-locationTool';
            style = this.scaleDiv.style;
            style.width = '85px';
            style.height = '5px';
            //2.标注上数字（实际代表距离）
            this.scaleDiv.textContent = "0,0";
            //3.放入指定位置
            mapElement.appendChild(this.scaleDiv);
            //4.注册窗体的 mousemove事件
            addListener(mapElement, 'mousemove', function (event) {
                var target = event.target || event.srcElement;
                var clientXY = getOffsetXY(event);
                loglat = mapPosition2([clientXY.left, clientXY.top]) || {};//传入数组，运算效率更高
                if (!loglat || isNaN(loglat.log)) return;
                that.scaleDiv.textContent = (loglat.log * 1).toFixed(3) + ',' + (loglat.lat * 1).toFixed(3);
            });
        }

        _secLocationTool.prototype.getType = function () {
            return "SecLocationTool";
        }

        return _secLocationTool;

    });