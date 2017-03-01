/// <reference path="../../../../build/require.js" />
/*
*   author:yellow date:2013/8/19
*   func:building tiles,for sample web map
*/


define(function () {
    //building层，实现地图建筑物
    var _building = function (args) {
        this.args = args || {};
        //将tile绑定给build,让Build数据随瓦片获取
        //building数据的装载与卸载使用伪数组
        this.buildings = [];              //待装载
        this.delteBuildings = [];      //待删除
        this.type = {
            mapabc:"mapabc"
        }
    }

    _building.prototype = {
        //@tileLayer 
        //和tile绑定，提取相应的参数
        BindTile: function (tileLaye) {
        }
    }


    return {
        self:_building
    }

});