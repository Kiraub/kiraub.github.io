
let selectedDataPoint = null;
let selectedDataIndex = 0;
let selectedColorScheme = null;

let subMenus;
let openedSym = "&#9207;";
let closedSym = "&#9206;";

initTable();
initDataSelector();
initColorSchemeSelector();
initSubMenus();

// functions to handle the table and selector as well as editing data

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

function initDataSelector() {
    let selector = document.getElementById("dataSelector");
    for (let i = 0; i < DATA_LEN; ++i) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = DATA_NAMES[i];
        selector.appendChild(option);
    }
    selector.value = selectedDataIndex;
}

function initColorSchemeSelector() {
    let selector = document.getElementById("colorSchemeSelector");
    let names = Object.keys(COLOR_SCHEMES);
    names.forEach(name => {
        let scheme = COLOR_SCHEMES[name];
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;
        let stops = COLOR_SCHEMES[name]["7"].join(",");
        option.style.background = "linear-gradient(to right, " + stops + ")";
        selector.appendChild(option);
    });
    selectedColorScheme = new ColorScheme(DEFAULT_SCHEME);
    let stops = COLOR_SCHEMES[DEFAULT_SCHEME]["7"].join(",");
    selector.style.background = "linear-gradient(to right, " + stops + ")";
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
    let selector = document.getElementById("dataSelector");
    selectedDataSet = selector.selectedIndex;

    voronoiDiagram = null;
    drawScatterData();
}

function onColorSchemeChange() {
    let selector = document.getElementById("colorSchemeSelector");
    let value = selector.value;
    selectedColorScheme = new ColorScheme(value);
    let stops = COLOR_SCHEMES[value]["7"].join(",");
    selector.style.background = "linear-gradient(to right, " + stops + ")";

    //voronoiDiagram = null;
    drawScatterData();
}

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

// functions to make the menus collapsable

function openNav() {
    document.getElementById("optionSidenav").style.width = "400px";
}

function closeNav() {
    document.getElementById("optionSidenav").style.width = "0";
}

function initSubMenus() {
    let menus = document.getElementsByClassName("openedMenu");
    subMenus = Array(0);
    let j = 0;
    for( j; j < menus.length; j += 1) {
        menus[j].childNodes.item(1).innerHTML = openedSym + menus[j].childNodes.item(1).innerHTML;
        let id = menus[j].id;
        let openedHeight = menus[j].clientHeight;
        let closedHeight = menus[j].childNodes.item(1).clientHeight + 8;
        menus[j].style.height = String(openedHeight + "px");
        let sub = subMenu(id, openedHeight, closedHeight);
        subMenus.push(sub);
    }
}

function subMenu(id, openedHeight, closedHeight) {
    return {id, openedHeight, closedHeight};
}

function toggleMenu(menuId) {
    let i = 0;
    let menu = document.getElementById(menuId);
    for(i; i < subMenus.length; i += 1) {
        if( subMenus[i].id == menuId) {
            if( menu.classList.contains("closedMenu")) {
                menu.classList.add("openedMenu");
                menu.classList.remove("closedMenu");
                menu.style.height = String(subMenus[i].openedHeight + "px");
                menu.childNodes.item(1).innerHTML = openedSym + menu.childNodes.item(1).innerHTML.slice(1);
            } else {
                menu.classList.remove("openedMenu");
                menu.classList.add("closedMenu");
                menu.style.height = String(subMenus[i].closedHeight + "px");
                menu.childNodes.item(1).innerHTML = closedSym + menu.childNodes.item(1).innerHTML.slice(1);
            }
            return;
        }
    }
}