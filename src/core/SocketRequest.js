/**
*   author:yellow date:2013/9/11
*   func:Socket 请求模块
*   @class Hmap.Core.SocketRequest
*/


define(['Messenger'], function (Messenger) {

    var _connectSocketServer = function (args) {
        var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
        if (support == null) {
            Messenger.getInstance().post("浏览器不支持websockte");
            return;
        }
        var _url = args.url,
            _callback = args.callback,
            ws = new window[support](_url),
            _msgtext = "";

        ws.onmessage = function (evt) {
            var _value = evt.data;
                //开头结尾都存在
            if (_value.indexOf("!e") !== -1 && _value.indexOf("!s") !== -1) {
                _msgtext = _value.slice(2, _value.length - 2);
            }
                //只开头不结尾
            else if (_value.indexOf("!e") === -1 && _value.indexOf("!s") !== -1) {
                _msgtext = _value.slice(2, _value.length);
                //消息提示为数据传输中
                Messenger.getInstance().post("数据传输中...");
            }
                //既不是开头也不是结尾
            else if (_value.indexOf("!e") === -1 && _value.indexOf("!s") === -1) {
                _msgtext += _value;
            }
                //只结尾
            else if (_value.indexOf("!e") !== -1 && _value.indexOf("!s") === -1) {
                _msgtext += _value.slice(0, _value.length - 2);
            }
                //结尾
            if (_value.indexOf("!e") !== -1) {
                //消息提示为数据传输中
                Messenger.getInstance().post("数据传输完成");
                _callback({ Geojson: _msgtext || "{}", response: "success", });
            }
        };

        ws.onopen = function () {
            Messenger.getInstance().post("连接成功");
            _callback({ response: "connected" });
        };

        ws.onclose = function () {
            Messenger.getInstance().post("连接关闭");
            _callback({ response: "disconnect" });
        };

        this.send = function (msg) {
            if (!!ws) {
                try {
                    ws.send(msg);
                }
                catch (e) {
                    Messenger.getInstance().post('数据传输出现异常');
                }
            }
            else {
                Messenger.getInstance().post("连接关闭");
                _callback({ response: "disconnect" });
            }
        }
    }

    var _socketRequest = function (args) {
        var _url = args.url;
        var _callback = args.callback;
        this._connect = null;
        this.iniSocket(_url, _callback);
    }

    _socketRequest.prototype.iniSocket = function (url, callabck) {
        var _callback = function (state) {
            callabck(state);
        }
        this._connect = new _connectSocketServer({
            url: url,
            callback: _callback,
        });
    }

    _socketRequest.prototype.send = function (msg) {
        Messenger.getInstance().post("向服务端提交数据...");
        //在这里对msg解析，拆分，防止数据一次性send导致socket失效，1024个字节为一个单位，
        //因为中文占2个字节，所以字符串长度最大为512
        //同时，对不完整的字符要进行拆分组合，占用字头字尾
        //字头  !s    字尾  !e  512-4/2  510个字长
        var _size = 1010;
        var _msg, i, len = Math.ceil(msg.length / _size);
        for (i = 0; i < len; i++) {
            var start = i * _size;
            _msg = null;
            if (i === 0)
                _msg = "!s" + msg.slice(start, start + _size);
            if (i === len - 1)
                _msg = _msg !== null ? _msg + "!e" : msg.slice(start, start + _size) + "!e";
            if (_msg === null)
                _msg = msg.slice(start, start + _size);
            if (this._connect.send !== undefined) this._connect.send(_msg);
        }
    }

    return _socketRequest;

});
