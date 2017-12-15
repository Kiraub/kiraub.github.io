
const MAP_W = 100;
const MAP_H = 60;

let canvas = document.getElementById("scatterDataCanvas");
let context = canvas.getContext("2d");
let w, h;

let voronoiDiagram = null;

let liveUpdates = document.getElementById("checkLiveUpdates");
function toggleLiveUpdates() {
    liveUpdates = document.getElementById("checkLiveUpdates").checked;
}

let draggedPoint = null;
let draggedPointSource = null;

let scatterDataList = dataList;

initCanvas();
drawScatterData();

// in case the window is resized, the canvas adapts

function doResize() {
    initCanvas();
    voronoiDiagram = null;
    drawScatterData();
}

// initialize and draw the canvas

function initCanvas() {
    // Width and Height have to be reset to avoid the canvas growing indefinitely
    canvas.height = 0;
    canvas.width  = 0;
    h = canvas.height = canvas.offsetHeight;
    w = canvas.width  = canvas.offsetWidth;
}

function drawScatterData(liveShepard = true) {
    context.beginPath();
    context.rect(0, 0, w, h);
    context.fillStyle = "#ffffff";
    context.fill();

    let data = normalizedData();

    getLayerOrder();
    //console.log(layerOrder);

    let checkShepard = document.getElementById("checkShepard");
    let checkVoronoi = document.getElementById("checkVoronoi");
    let checkPoints = document.getElementById("checkPoints");
    let checkMap = document.getElementById("checkMap");

    // draw backmost first and frontmost last
    var drawNr;
    for( drawNr = layerOrder.length-1; drawNr >= 0; drawNr -= 1) {
        if (liveShepard && checkShepard.checked && layerOrder[drawNr] == "Shepard")
            drawShepardLayer(data);
        if (checkVoronoi.checked && layerOrder[drawNr] == "Voronoi")
            drawVoronoiLayer(data, !checkShepard.checked);
        if (checkPoints.checked && layerOrder[drawNr] == "Points")
            drawPointLayer(data);
        if (checkMap.checked && layerOrder[drawNr] == "Map")
            drawMapLayer(data);
    }
}

function setPixel(image, x, y, color) {
    let index = (x + y * image.width) * 4;
    image.data[index + 0] = color.r;
    image.data[index + 1] = color.g;
    image.data[index + 2] = color.b;
    image.data[index + 3] = Math.floor(255 * color.a);
}

function drawPointLayer(data) {
    let pointsAlpha = document.getElementById("pointsAlpha").value;
    for (let i = 0; i < data.length; ++i) {
        let p = data[i];
        // outline
        context.beginPath();
        context.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        context.lineWidth = 6;
        if (scatterDataList[i] == selectedDataPoint)
            context.strokeStyle = "#eeee00";
        else
            context.strokeStyle = "#00000044";
        context.stroke();
        // inner circle
        context.beginPath();
        context.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        context.lineWidth = 3;
        context.strokeStyle = toColor(p.value, pointsAlpha);
        context.stroke();
    }
}

function drawVoronoiLayer(data, fill) {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    let voronoiAlpha = document.getElementById("voronoiAlpha").value;
    if (voronoiDiagram == null) {
        let voronoi = d3.voronoi()
        voronoi.size([w, h])
        voronoi.x(point => point.x)
        voronoi.y(point => point.y);
        voronoiDiagram = voronoi(data);
    }        
    let polygons = voronoiDiagram.polygons();
    for (let i = 0; i < polygons.length; ++i) {
        let poly = polygons[i];
        context.beginPath();
        for (let j = 0; j < poly.length; ++j) 
            context.lineTo(poly[j][0], poly[j][1]);
        context.lineTo(poly[0][0], poly[0][1]);
        let value = poly.data.value;
        //if (fill) {
            context.fillStyle = toColor(value, voronoiAlpha);
            context.fill();
        //}
        context.stroke();
    }
}

function drawShepardLayer(data) {
    let image = context.createImageData(w, h);
    let shepardAlpha = document.getElementById("shepardAlpha").value;
    for (let x = 0; x < w; ++x)
        for (let y = 0; y < h; ++y) {
            let totalDist = 0;
            let sum = 0;

            for (let i = 0; i < data.length; ++i) {
                let d = data[i];
                let dist = (x - d.x) * (x - d.x) + (y - d.y) * (y - d.y);                
                if (dist < 1) {
                    totalDist = 1;
                    sum = d.value;
                    break;
                }
                totalDist += 1 / dist;
                sum += 1 / dist * d.value;
            }
            let color = toColor(sum / totalDist, shepardAlpha);
            setPixel(image, x, y, color);
        }
    context.putImageData(image, 0, 0);
}

function drawMapLayer(data) {
    console.log("Map layer not implemented yet");
}

function normalizedData() {
    let result = [];
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    for (let i = 0; i < scatterDataList.length; ++i) {
        let x = scatterDataList[i].x * w / MAP_W;
        let y = scatterDataList[i].y * h / MAP_H;
        let value = scatterDataList[i].data[selectedDataIndex];
        result.push({x, y, value});
        if (value < min)
            min = value;
        else if (value > max)
            max = value;
    };
    let delta = max - min;
    for (let i = 0; i < result.length; ++i) 
        result[i].value = (result[i].value - min) / delta;
    return result;
}

// functions for editing data points

function onClick(event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / w * MAP_W;
    let y = (event.clientY - rect.top) / h * MAP_H;

    if (event.ctrlKey)
        addDataPoint(x, y);
    else if(event.shiftKey)
        removeDataPoint(x, y);
    else
        setSelectedDataPoint(getDataPointAt(x, y));

     drawScatterData();
}

function onMouseDown(event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / w * MAP_W;
    let y = (event.clientY - rect.top) / h * MAP_H;

    draggedPoint = getDataPointAt(x, y);
    draggedPointSource = scatterData(x, y, null);
    setSelectedDataPoint(draggedPoint);
    drawScatterData();
}

function onMouseMove(event) {
    if (draggedPoint) {
        voronoiDiagram = null;
        let rect = canvas.getBoundingClientRect();
        draggedPoint.x = (event.clientX - rect.left) / w * MAP_W;
        draggedPoint.y = (event.clientY - rect.top) / h * MAP_H;
        if(liveUpdates) {
            drawScatterData();
        } else {
            drawScatterData(false);
        }
    }
}

function onMouseUp(event) {
    if(draggedPoint) {
        if(countDataPointsAt(draggedPoint.x, draggedPoint.y) > 1) {
            draggedPoint.x = draggedPointSource.x;
            draggedPoint.y = draggedPointSource.y;
            voronoiDiagram = null;
        }
        drawScatterData();
        draggedPoint = null;
    }
}

function onMouseOut(event) {
    if (draggedPoint) {
        draggedPoint = null;
        setSelectedDataPoint(null);
        drawScatterData();
    }
}

function getDataPointAt(x, y) {
    for (let i = 0; i < scatterDataList.length; ++i) {
        let p = scatterDataList[i];
        let dx = p.x - x;
        let dy = p.y - y;
        if (dx*dx + dy*dy < 1)
            return p;
    }
    return null;
}

function countDataPointsAt(x, y) {
    let c = 0;
    for (let i = 0; i < scatterDataList.length; ++i) {
        let p = scatterDataList[i];
        let dx = p.x - x;
        let dy = p.y - y;
        if (dx*dx + dy*dy < 1)
            c += 1;
    }
    return c;
}

function addDataPoint(x, y) {
    let data = new Array(DATA_LEN).fill(0); 
    // randomize
    for (let i = 0; i < DATA_LEN; ++i) {
        let randomValue = 0.5 + Math.random() * 3;
        data[i] = randomValue;
    }
    let p = scatterData(x, y, data);
    scatterDataList.push(p);
    setSelectedDataPoint(p);

    voronoiDiagram = null;
}

function removeDataPoint(x, y) {
    let p = getDataPointAt(x, y);
    if(p) {
        let i = 0;
        for( i = 0; i < scatterDataList.length; i += 1) {
            if( scatterDataList[i].data[0] == p.data[0] &&
            scatterDataList[i].data[1] == p.data[1] ) {

                scatterDataList.splice(i, 1);
                setSelectedDataPoint(null);
                voronoiDiagram = null;
                break;
            }
        }
    }
    else
        console.log("No data point at given coordinates.");
}