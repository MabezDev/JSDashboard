/*jslint node: true */
/*jslint browser: true*/
/*jslint esversion: 6*/

'use strict';



function init() {
    // on load set up components
    console.log("Dashboard loading...");
    var gridContainer = document.getElementById(ID.WIDGETGRID);

    //console.log(createHorizontalContainer());
    //gridContainer.appendChild(createHorizontalContainer());
    var count = 0;
    for(var i=0; i < 3; i++){
        var hContainer = createHorizontalContainer();
        for(var j=0; j < 3; j++){
            if(j == 1){ // add some empty spaces
                hContainer.appendChild(createWidget(++count));
            } else {
                hContainer.appendChild(createWidget(++count, "" + count));
            }
        }
        gridContainer.appendChild(hContainer);
    }
}

function createHorizontalContainer(){
    var div = document.createElement('div');
    div.className = "horizontal_section";
    return div;
}

function createWidget(id, jsonData){
    //jsondata should be a object that tells hwo the data should be displayed and where to get it from (have a function inside the object called update())
    // for now its just a title

    var div = document.createElement('div');
    div.id = id;
    if(jsonData){
        // base creation
        div.className = "widget";
        div.draggable = true;
        div.ondragstart = widgetDragStart;
        div.ondragover = globalDragOver;
        div.ondrop = dashboardDrop;

        // everything else appended to that div
        var text = document.createElement('p');
        text.textContent = jsonData;
        text.className = "widget_child_elements";
        div.appendChild(text);
        
        return div;
    } else {
        div.className = "widget hidden";
        div.textContent = "hidden";
        return div;
    }
}
function addToDashboard(){
    var wipwidget = document.getElementById(ID.WIPWIDGET);
    var serviceURL = document.getElementById(ID.SERVICEURL).value;
    
    if(serviceURL){
        console.log("Looking for free spot in grid...");
        
        var slotFree = findFreeSlot();
        if(slotFree){
            // add serviceURL - always the last item
            var hiddenURL = document.createElement("p");
            hiddenURL.style.display = "none";
            hiddenURL.textContent = serviceURL;
            wipwidget.appendChild(hiddenURL);

            // switch into empty slot
            var emptySlot = document.getElementById(slotFree);
            emptySlot.className = "widget";
            emptySlot.innerHTML = wipwidget.innerHTML;
            emptySlot.draggable = true;
            emptySlot.ondragstart = widgetDragStart;
            emptySlot.ondragover = globalDragOver;
            emptySlot.ondrop = dashboardDrop;

        } else {
            console.log("Widget grid full! Delete an old widget!");
        }
    } else {
        console.log("ServiceURL cannot be empty!");
    }
}

function findFreeSlot(){
    var gridContainer = document.getElementById(ID.WIDGETGRID);
    for(var i=0; i < gridContainer.children.length; i++){
        var hSection = gridContainer.children[i];
        for(var j=0; j < hSection.children.length; j++){
            if(hSection.children[j].className.includes(CSS.HIDDEN)){
                return hSection.children[j].id;
            }
        }
    }
    return;
}

window.addEventListener("load", init);
