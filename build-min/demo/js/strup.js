$(function () {
    var height = $('#navgate').height();
    var as = $('a'),
        len = as.length,
        ele,i,
        mapContent = $('#mapContent');
    mapContent.height(height || 800);
    for (i = 0; i < len; i++) {
        as[i].onclick = function (evt) {
            var preventFlag = true;
            var name = this.innerText;
            switch (name) {
                case '添加底图':
                    mapContent.attr('src', 'pages/basemap.html');
                    break;
                case '地图标注':
                    mapContent.attr('src', 'pages/markermap.html');
                    break;
                case '地图标绘':
                    mapContent.attr('src', 'pages/plotmap.html');
                    break;
                case '地图缩放、位置、比例尺、工具栏':
                    mapContent.attr('src', 'pages/maptools.html');
                    break;
                case '添加矢量底图':
                    mapContent.attr('src', 'pages/vectormap.html');
                    break;
                case '矢量图层鼠标事件':
                    mapContent.attr('src', 'pages/vectoreventmap.html');
                    break;
                case '连接空间分析服务器':
                    mapContent.attr('src', 'pages/connectServer.html');
                    break;
                case '水质侵蚀度分析':
                    break;
                case '克里金插值': 
                    mapContent.attr('src', 'pages/krigmap.html');
                    break;
                case '缓冲区分析':
                    break;
                case '数据对接':
                    break;
                case '添加arcgis底图':
                    mapContent.attr('src', 'pages/arcgismap.html');
                    break;
                case '添加高德底图':
                    mapContent.attr('src', 'pages/basemap.html');
                    break;
                default:
                    preventFlag = false;
                    break;
            }
            preventFlag ? evt.preventDefault() : null;
        }
    }
});