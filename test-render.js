/// <reference path="require.js" />

require.config({
    baseUrl: "build", // 转换为build.js的时候，需要将build改为 .
    paths: {
        Utils: "../src/components/render/Utils",
        Heat: "../src/components/render/shape/Heat",  //热力图
        Collection: "../src/components/render/type/Collection",
        Transform: "../src/components/render/type/Transform",
        Animation: "../src/components/render/animate/Animation",
        DragAndDrop: '../src/components/render/animate/DragAndDrop',
        EditAndSave: '../src/components/render/animate/EditAndSave',
        Tween: '../src/components/render/animate/Tween',
        Circle: '../src/components/render/shape/Circle',
        Raster: '../src/components/render/shape/Raster',
        Polygon: '../src/components/render/shape/Polygon',
        RePolygon: '../src/components/render/shape/RePolygon',
        Shape: '../src/components/render/shape/Shape',
        Star: '../src/components/render/shape/Star',
        Sprite: '../src/components/render/shape/Sprite',
        Line: '../src/components/render/shape/Line',
        Canvas: '../src/components/render/Canvas',
        Container: '../src/components/render/Container',
        Context: '../src/components/render/Context',
        Factory: '../src/components/render/Factory',
        Layer: '../src/components/render/Layer',
        Node: '../src/components/render/Node',
        Render: '../src/components/render/Render',
        Stage: '../src/components/render/Stage',
    },
    name: "main",
    //optimize:"none",
    out: "../build-min.js"
});

 

require(['Render'], function (Render) {

    var stage = new Render.Stage({
        container: "container",
        width: 600,
        height: 400,
    });
    var layer = new Render.Layer({
        id:"1",
        width: 600,
        height: 400,
    });

    var circle = new Render.Circle({
        x: 200,
        y: 150,
        radius: 70,
        opacity: 0.2,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 3,
        draggable: true,
    });
    var polygon = new Render.Polygon({
        points: [[73, 192], [73, 160], [340, 23], [500, 109], [499, 139], [342, 93]],
        fill: '#00D2FF',
        stroke: 'black',
        //opacity: 0.2,
        strokeWidth: 2,
        draggable: true,
    });

    var thermo = new Render.Heat({
        points: [73, 192, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93],
    });
    circle.on('click', function (evt) {
        circle.setDraggable(true);
    });

    //五角星
    var fiveSides = new Render.Star({
        //radius:30,
        x: 50,
        y: 60,
        opacity:0.8,
        numPoints: 5,
        innerRadius: 5,
        outerRadius:11,
        fill: 'red',
        stroke: 'black',
        strokeWidth:1,
    });
    //polygon.on('click', function (evt) {
    //    polygon.setDraggable(true);
    //});
    //layer.add(thermo);
    layer.add(polygon);
    layer.add(circle);
    layer.add(fiveSides);
    stage.add(layer);
    stage.draw();
    var anim = new Render.Animation(function (frame) {
        circle.setX(30 * Math.sin(frame.time * 2 * Math.PI / 500) + 120);
        layer.draw();
    }, layer);

    anim.start();

});