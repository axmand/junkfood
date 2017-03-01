
/**
*   @modules Utils
*/
define(function () {

    //#region collection
    /**
    *   提供索引数组
    *   @class Collection
    */
    var _collection = function () {
        var args = [].slice.call(arguments),
            length = args.length,
            i = 0;
        this.length = length;
        for (; i < length; i++) { this[i] = args[i]; }
        return this;
    }

    _collection.prototype = [];
    
    //#region collection 静态函数

    /**
    *   从数组转换
    *   @method fromArray
    */
    _collection.fromArray = function (arr) {
        var collection = new _collection(),
            len = arr.length,
            n;
        for (n = 0; n < len;n++){
            collection.push(arr[n]);
        }
        return collection;
    }

    _collection._mapMethod = function (methodName) {
        _collection.prototype[methodName] = function () {
            var len = this.length,
                i;
            var args = [].slice.call(arguments);
            for (i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }
            return this;
        };
    }

    _collection.mapMethods = function (constructor) {
        var prot = constructor.prototype;
        for (var methodName in prot) 
            _collection._mapMethod(methodName);
    }

    //#endregion collection 静态函数

    /**
    *   回调函数为 func(element,index)
    *   遍历collection内部对象
    *   @method each
    */
    _collection.prototype.each = function (func) {
        for (var n = 0; n < this.length; n++) {
            func(this[n], n);
        }
    }

    /**
    *   清理对象
    *   @method clear
    */
    _collection.prototype.clear = function () {
        this.length = 0;
    }

    /**
    *   转换成真正的数组对象
    *   @method toArray
    */
    _collection.prototype.toArray = function () {
        var arr = [],
            len = this.length,
            n;
        for (n = 0; n < len; n++) {
            arr.push(this[n]);
        }
        return arr;
    }

    //#endregion

    return {
        self:_collection,     //基础类型对象
    }
});