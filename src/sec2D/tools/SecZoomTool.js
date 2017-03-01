/**
 *  放大缩小工具
 *  @author yellow date 2014/6/23
 *  @class Hmap.Tools.SecZoomTool
 */

define(['SecBaseTool', 'Hobject', 'EventListener'], function (SecBaseTool, Hobject, EventListener) {
    //
    var extend = Hobject.BaseFunc.extend,
        SecBaseTool = SecBaseTool.self,
        addListener=EventListener.AddListener;
    //
    var mapElement = null,
        mapInteractive = null,
        simWheelEvent = null;  //模拟wheel Event

    var _zoomTool = function (opts) {
        this._pack = null;
        simWheelEvent = document.createEvent('HTMLEvents');
        simWheelEvent.initEvent('mousewheel', false, false);
        SecBaseTool.call(this, opts);
    }

    extend(_zoomTool, SecBaseTool);

    _zoomTool.prototype._package = function () {
        var zoomOut = document.createElement('a'),
            zoomIn = document.createElement('a');
        var styles = [zoomOut, zoomIn];
        for (var i = 0, len = styles.length; i < len; i++) {
            styles[i].className = 'button';
            var style = styles[i].style;
            style.height = '39px';
            style.marginTop = '2px';
            style.boxShadow = '3px 3px 5px #888888';
            style.borderRadius = '5px';
            style.backgroundColor = 'white';
        }
        addListener(zoomOut, 'click', function (event) {
            simWheelEvent.wheelDelta = -120;
            mapInteractive.interactive.mousewheel(simWheelEvent);
        });
        addListener(zoomIn, 'click', function (event) {
            simWheelEvent.wheelDelta = 120;
            mapInteractive.interactive.mousewheel(simWheelEvent);
        });
        return {
            zoomIn: zoomIn,
            zoomOut:zoomOut,
        }
    }

    _zoomTool.prototype._createTool = function () {
        var args = this.args;
        mapElement = mapElement || args.mapElement;
        simWheelEvent.offsetX = Math.floor(mapElement.clientWidth / 2);
        simWheelEvent.offsetY = Math.floor(mapElement.clientHeight / 2);
        mapInteractive = mapInteractive || args.mapInteractive;
        var height = mapElement.clientHeight;
        this._pack = this._pack || this._package();
        var zoomin = document.createElement('i'),
            zoomout = document.createElement('i');
        zoomin.className = 'fa fa-plus fa-3x';
        zoomout.className = 'fa fa-minus fa-3x';
        this._pack.zoomIn.appendChild(zoomin);
        this._pack.zoomOut.appendChild(zoomout);
        var zoomDiv = document.createElement('div');
        zoomDiv.className = 'list-group';
        zoomDiv.style.cssText = 'position: relative;' + 'bottom:' + (height-20) + 'px; width:45px; height:90px;left:30px;';
        zoomDiv.appendChild(this._pack.zoomIn);
        zoomDiv.appendChild(this._pack.zoomOut);
        mapElement.appendChild(zoomDiv);
    }


    return _zoomTool;

});