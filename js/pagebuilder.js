"use strict"

let sideNavId = "homeSideNav";

initPage();
initMenu();
buildLinks();

// initialization of the page and menu

function initPage() {
    let dt                      = document;
    let hd                      = dt.getElementById("htmlhead");
    let by                      = dt.getElementById("htmlbody");

    let pageHead                = dt.createElement("div");
    pageHead.classList.add("pagehead");
    let centered                = dt.createElement("center");
    pageHead.appendChild(centered);
    let openButton              = dt.createElement("span");
    openButton.style.cursor     = "pointer";
    openButton.style.position   = "absolute";
    openButton.style.left       = "10px";
    openButton.addEventListener("click", openNav());
    openButton.innerHTML        = "&#9776; Open Menu";
    let headline                = dt.createElement("span");
    headline.innerHTML          = hd.getElementsByTagName("title")[0].innerHTML;
    centered.appendChild(openButton);
    centered.appendChild(headline);

    by.appendChild(pageHead);
}

function initMenu() {
    let dt                      = document;
    let bd                      = document.getElementById("htmlbody");

    let sidenav                 = document.createElement("div");
    sidenav.id                  = sideNavId;
}

function buildLinks() {
    //
}

// functions used in the menu

function openNav() {
    document.getElementById(sideNavId).style.width = "400px";
}

function closeNav() {
    document.getElementById(sideNavId).style.width = "0";
}