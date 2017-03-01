/**
*   创建基于socket 连接的GIS分析服务，确定启动分析功能
*   创建一个常连接,所有的socket数据交互同用一个连接
*   @author:yellow date:2013/9/4
*   @class AnalysisServer
*/

define(['SocketRequest'], function (SocketRequest) {
    /*
    *   @params args {Object}
    *    {
	*       url: 规定需要带有 ws:http://**
    *       port: 端口，为整型
    *       complete:  服务连接成功回调
    *       success:    请求分析成功的回调
    *       failure:      请求失败/服务关闭时时候的回调
    *    }
    */
    var _analysis = function (args) {
        var _args = args || {};
        var _url = _args.url,
             _port = _args.port;

        var _socket = null;
        //初始化
        var _taskList = [];                  //待处理session队列
        var _currentTask = null;        //当前处理中的session
        var flag = true;                     //上一次的task是否执行完毕
        var that = this;
        //回调的函数
        var _socketcallback = function (rsp) {
            if (rsp.response === "success") {
                flag = true;
                if(_currentTask!==null) _currentTask.taskComplete(rsp.Geojson);//回调给task处理函数
                _currentTask = null;
            }
                //连接成功
            else if (rsp.response === "connected") {
                //发送请求
            }
                //连接丢失
            else if (rsp.response === "disconnect") {
                //销毁对象
                delete (that._socket);
            }
        }
        //创建socket连接服务
        _socket = new SocketRequest({
            url:_url,
            callback: _socketcallback
        });

        this.addTask = function (task) {
            _taskList.push(task);
        }

        //轮询检查
        function checkTask() {
            if (flag) {
                var _task = _taskList.shift();
                if (_task !== undefined) {
                    flag = false;
                    _currentTask = _task;
                    var content = _currentTask.getTaskContent();
                    _socket.send(content);
                }
            }
        }

        setInterval(checkTask, 2000);

        return {
            addTask:this.addTask,
        }
        
    }

    return _analysis;
    
});