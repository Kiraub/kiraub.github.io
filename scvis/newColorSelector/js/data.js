"use strict"

// The names of the data sets
const DATA_NAMES = ["Depth",
                    "Salt %",
                    "Oxygen %",
                    ];
// The required length of data arrays
let DATA_LEN = DATA_NAMES.length;

const MAP_W = 100;
const MAP_H = 60;

let dataList = [
    scatterData(30, 10, [1.6, 0.037, 10.5]),
    scatterData(20, 50, [4.0, 0.070,  9.8]),
    scatterData(70, 20, [2.5, 0.055, 10.1]),
    scatterData(50, 30, [0.2, 0.041,  8.7]),
]

// coordinates should lay within {0, 0} and {MAP_W, MAP_H}
// and be in counter-clockwise order ({0, 0} is top-left)
const MAP_OUTLINE = [
    {x:  5, y:  5},
    {x:  5, y: 55},
    {x: 90, y: 50},
    {x: 85, y: 25},
    {x: 90, y:  5},
];

/**
    @param:
        x: the x coordinate of the point
        y: the y coordinate of the point
        data: array with length DATA_LEN and values respective to the DATA_NAMES fields
    @return:
        scatterData object
 */
function scatterData(x, y, data) {
    if (data != null && data.length != DATA_LEN)
        console.log("provided data has " + data.length + " elements, expected " + DATA_LEN);
    return { x, y, data };
}

// Functions to open file dialogs and overwrite the data sets

function openFileDialog() {
    let dialog = document.getElementById("fileDialog");
    dialog.click();
}

function updateSelectedFile() {
    let dialog = document.getElementById("fileDialog");
    let jsonFile = dialog.files[0];
    let fileData;
    let reader = new FileReader();
    document.getElementById("selectedFile").innerHTML =  jsonFile.name;
    reader.onload = (function (file) {
        dataList = JSON.parse(reader.result);
        onDataListChange();
    });
    reader.readAsText(jsonFile);
}

function writeFileDialog() {
    let content = JSON.stringify(dataList, null, 4);
    download('data.json', content);
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}