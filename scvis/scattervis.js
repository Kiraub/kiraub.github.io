"use strict"

const MAP_W = 100;
const MAP_H = 60;
const DATA_LEN = 1;

let canvas = document.getElementById("scatterDataCanvas");
let context = canvas.getContext("2d");
let w, h;  

let scatterDataList = initialScatterData();
let selectedDataIndex = 0;

initCanvas(); 
drawScatterData();

function drawScatterData() {    
    context.rect(0, 0, w, h);
    context.fillStyle = "white";
    context.fill();
        
    let data = normalizedData();        
    
    let checkPoints = document.getElementById("checkPoints");
    if (checkPoints.checked)
        drawPointLayer(data);
      
    let checkVoronoi = document.getElementById("checkVoronoi");
    if (checkVoronoi.checked)
        drawVoronoiLayer(data);
    
    let checkShepard = document.getElementById("checkShepard");
    if (checkShepard.checked)
        drawShepardLayer(data);
    
    let checkMap = document.getElementById("checkMap");
    if (checkMap.checked)
        drawMapLayer(data);    
}

function initCanvas() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;       
}

function resize() {        
    initCanvas();    
    drawScatterData();
}

function onClick(event) {
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / w * MAP_W;
    let y = (event.clientY - rect.top) / h * MAP_H;
    
    if (event.ctrlKey)
        addDataPoint(x, y);
    else
        ;// select existing data point
}

function scatterData(x, y, data) {
    if (data.length != DATA_LEN)
        console.log("provided data has " + data.length + " elements, expected " + DATA_LEN);
    return { x, y, data };
}

function initialScatterData() {       
    let result = [
    scatterData(30, 10, [1.6]),
    scatterData(20, 50, [4.0]),
    scatterData(70, 20, [2.5]),
    scatterData(50, 30, [0.2])
    ];    
    return result;
}

function toColor(value, alpha) {    
    // TODO: fetch scale from color picker    
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
    return { r, g, b, a, toString: function() {        
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
        context.beginPath();
        context.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        context.lineWidth = 3;        
        context.strokeStyle = toColor(p.value, 1).toString();
        context.stroke();
    }
}

function drawVoronoiLayer(data) {
    console.log("Voronoi layer not implemented yet");
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
    data[0] = 0.5 + Math.random() * 3;
    let p = scatterData(x, y, data);
    scatterDataList.push(p);
    drawScatterData();
}
