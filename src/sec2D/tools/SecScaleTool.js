/**
 * 比例尺工具
 * @class Hmap.Tools.SecScaleTool 
 */

define(['SecBaseTool', 'Hobject'], function (SecBaseTool, Hobject) {
    //函数导入
    var extend = Hobject.BaseFunc.extend,
        //类型
        SecBaseTool = SecBaseTool.self,
        //常量
        DPI = Hobject.BaseFunc.DPI(),//返回x方向的dpi
        INCH = 2.54,//每英寸代表的厘米数
        MODIFY=2,   //修正数，方便显示用
        MAPSCALE = [       //各缩放层级下地图比例尺
        '-1',                       //0 级不存在
        '295829355.45',     //1
        '147914677.73',     //2
        '73957338.86',      //3
        '36978669.43',      //4
        '18489334.72',      //5
        '9244667.36',       //6
        '4622333.68',       //7
        '2311166.84',       //8
        '1155583.42',       //9
        '577791.71',        //10
        '288895.85',        //11
        '144447.93',        //12
        '72223.96',         //13
        '36111.98',         //14
        '18055.99',         //15
        '9028.00',          //16
        '4514.00',          //17
        '2257.00',          //18
        ];
    var mapElement, //地图dom对象
        toolDiv,//tool Div对象
        style;
    /**
     * 显示比例尺的工具
     * @class Scale
     * @param opts
     */
    var _scale = function (opts) {
        var _opts = opts || {};
        this.pixLen =MODIFY*DPI / INCH; //1厘米长度在地图上所占像素个数
        this.scaleDiv = null;
        SecBaseTool.call(this, opts);
    }

    extend(_scale, SecBaseTool);

    //装载tool
    _scale.prototype._createTool = function () {
        var args = this.args;
        mapElement = mapElement || args.mapElement;
        this.mapInfo = args;
        //1.创建1cm长度的border
        this.scaleDiv = document.createElement('div');
        this.scaleDiv.className = 'Jake-ui-scaleBar';
        style = this.scaleDiv.style;
        style.width = this.pixLen + 'px';
        style.height = '5px';
        //2.标注上数字（实际代表距离）
        this.update({ level: this.mapInfo.tileLevel, sourceID: "mousewheel" });
        //3.放入指定位置
        mapElement.appendChild(this.scaleDiv);
    }

    _scale.prototype.update = function (opts) {
        var sourceID = (opts || {}).sourceID;
        if (sourceID !== 'mousewheel') return;
        //
        var level = opts.level,
            scale = Math.floor(MAPSCALE[level]).toString(),
            len = scale.length,
            mutilpy = 1,
            unit = '米';
        if (len <= 5) {
            unit = '  米';
            mutilpy = 100 / MODIFY;
        } else if (len > 5 & len <= 7) {
            unit = '  千米';
            mutilpy = 100000 / MODIFY;
        } else if (len > 7 & mutilpy <= 9) {
            unit = '  万米';
            mutilpy = 1000000 / MODIFY;
        }
        this.scaleDiv.textContent = (scale * 1 / mutilpy).toFixed(2) + unit; //保留两位小数
    }

    //移除tool
    _scale.prototype.remove = function () {

    }

    _scale.prototype.getType = function () {
        return "SecScaleTool";
    }

    return _scale;

});