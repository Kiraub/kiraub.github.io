"use strict"

const MAP_W = 100;
const MAP_H = 60;
const DATA_NAMES = ["Depth",
                    "Salt %",
                    "Oxygen %",
                   ];
const DATA_LEN = DATA_NAMES.length;

let canvas = document.getElementById("scatterDataCanvas");
let context = canvas.getContext("2d");
let w, h;

let scatterDataList = initialScatterData();
let selectedDataPoint = null;
let selectedDataIndex = 0;

// cache results
let voronoiDiagram = null;

initCanvas(); 
initTable();
initSelector();
drawScatterData();

function doResize() {
    initCanvas();

    voronoiDiagram = null;
    drawScatterData();
}

function drawScatterData() {
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
        if (checkShepard.checked && layerOrder[drawNr] == "Shepard")
            drawShepardLayer(data);
        if (checkVoronoi.checked && layerOrder[drawNr] == "Voronoi")
            drawVoronoiLayer(data, !checkShepard.checked);
        if (checkPoints.checked && layerOrder[drawNr] == "Points")
            drawPointLayer(data);
        if (checkMap.checked && layerOrder[drawNr] == "Map")
            drawMapLayer(data);
    }
}

function initCanvas() {
    /* Width and Height have to be reset to avoid the canvas growing indefinitely */
    canvas.height = 0;
    canvas.width  = 0;

    h = canvas.height = canvas.offsetHeight;
    w = canvas.width  = canvas.offsetWidth;
}

function initTable() {
    let table = document.getElementById("data-table");
    for (let i = 0; i < DATA_LEN; ++i) {
        let row = table.insertRow(i + 1);
        row.insertCell(0).innerHTML = DATA_NAMES[i];

        let input = document.createElement("input");
        input.id = "input" + i;
        input.type = "number";
        input.className = "number-input";
        input.placeholder = "--";
        input.disabled = true;
        input.value = "";
        input.step = "any";
        input.onchange = function() { onDataChange(i, input); };
        row.insertCell(1).appendChild(input);
    }
}

function initSelector() {
    let selector = document.getElementById("data-selector");
    for (let i = 0; i < DATA_LEN; ++i) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = DATA_NAMES[i];
        selector.appendChild(option);
    }
    selector.value = selectedDataIndex;
}

function onDataChange(dataIndex, input) {
    if (selectedDataPoint == null) {
        console.log("this should not happen");
        return;
    }
    let value = parseFloat(input.value);
    if (value)
        selectedDataPoint.data[selectedDataIndex] = value;

    voronoiDiagram = null;
    drawScatterData();
}

function onDataSetChange() {
    let selector = document.getElementById("data-selector");
    selectedDataIndex = selector.selectedIndex;

    voronoiDiagram = null;
    drawScatterData();
}

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

// functions for dragging data points
let draggedPoint = null;
function onMouseDown(event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / w * MAP_W;
    let y = (event.clientY - rect.top) / h * MAP_H;

    draggedPoint = getDataPointAt(x, y);
    setSelectedDataPoint(draggedPoint);
    drawScatterData();
}

function onMouseMove(event) {
    if (draggedPoint) {
        let rect = canvas.getBoundingClientRect();
        draggedPoint.x = (event.clientX - rect.left) / w * MAP_W;
        draggedPoint.y = (event.clientY - rect.top) / h * MAP_H;

        voronoiDiagram = null;
        drawScatterData();
    }
}

function onMouseUp(event) {
    draggedPoint = null;
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

function scatterData(x, y, data) {
    if (data.length != DATA_LEN)
        console.log("provided data has " + data.length + " elements, expected " + DATA_LEN);
    return { x, y, data };
}

function initialScatterData() {
    let result = [
    scatterData(30, 10, [1.6, 0.037, 10.5]),
    scatterData(20, 50, [4.0, 0.070,  9.8]),
    scatterData(70, 20, [2.5, 0.055, 10.1]),
    scatterData(50, 30, [0.2, 0.041,  8.7]),
    ];
    return result;
}

function toColor(value, alpha) {
    //TODO fetch scale from color picker    
    let scale = (value) => {
        let r = value * value;
        r = Math.floor(255 * r);
        let g = 2 * value * (1 - value);
        g = Math.floor(255 * g);
        let b = (1 - value) * (1 - value);
        b = Math.floor(255 * b);

        return rgba(r, g, b, alpha);
    }

    value = Math.max(Math.min(value, 1), 0);
    return scale(value);
}

function rgba(r, g, b, a) {
    return { r, g, b, a,
        toString: function() {
            return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        }
    };
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

function drawPointLayer(data) {
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
        context.strokeStyle = toColor(p.value, 1.0);
        context.stroke();
    }
}

function drawVoronoiLayer(data, fill) {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;

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
        if (fill) {
            context.fillStyle = toColor(value, 0.5);
            context.fill();
        }
        context.stroke();
    }
}

function drawShepardLayer(data) {
    let image = context.createImageData(w, h);

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
            let color = toColor(sum / totalDist, 1.0);
            setPixel(image, x, y, color);
        }
    context.putImageData(image, 0, 0);
}

function setPixel(image, x, y, color) {
    let index = (x + y * image.width) * 4;
    image.data[index + 0] = color.r;
    image.data[index + 1] = color.g;
    image.data[index + 2] = color.b;
    image.data[index + 3] = Math.floor(255 * color.a);
}

function drawMapLayer(data) {
    console.log("Map layer not implemented yet");
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

function setSelectedDataPoint(p) {
    selectedDataPoint = p;
    for (let i = 0; i < DATA_LEN; ++i) {
        let input = document.getElementById("input" + i);
        if (p) {
            input.disabled = false;
            input.value = p.data[i].toFixed(2);
        }
        else {
            input.disabled = true;
            input.value = "";
        }
    }
}


// ###### Sidenav related functions #######

// Functions to handle the re-ordering of layers per drag and drop

var items = document.querySelectorAll('.drag');
[].forEach.call(
    items,
    function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }
);

var layerOrder = null;
function getLayerOrder() {
    layerOrder = Array();
    var layerNr = 0;
    var layers = document.getElementsByClassName("drag");
    for(layerNr = 0; layerNr < layers.length; layerNr += 1) {
        layerOrder.push(layers[layerNr].innerHTML.replace(/\s/g, ""));
    }
}

var dragSource = null;

function handleDragStart(e) {
    this.style.borderLeft = "2px solid white";
    this.style.paddingLeft = "10px";

    dragSource = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
    if (dragSource != this) {
        this.style.borderLeft = "2px dotted white";
        this.style.paddingLeft = "5px";
    }
}

function handleDragLeave(e) {
    this.classList.remove('over');
    if (dragSource != this) {
        this.style.borderLeft = "0px";
        this.style.paddingLeft = "0px";
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    dragSource.style.borderLeft = "0px";
    dragSource.style.paddingLeft = "0px";
    if (dragSource != this) {
        dragSource.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        drawScatterData();
    }
    return false;
}

function handleDragEnd(e) {
    [].forEach.call(items, function (item) {
        item.classList.remove('over');
        item.style.borderLeft = "0px";
        item.style.paddingLeft = "0px";
    });
}