/*jslint node: true */
/*jslint browser: true*/
/*jslint esversion: 6*/

'use strict';



function init() {
    // on load set up components
    console.log("Dashboard loading...");
    var gridContainer = document.getElementById('grid_container');

    //console.log(createHorizontalContainer());
    //gridContainer.appendChild(createHorizontalContainer());
    var count = 0;
    for(var i=0; i < 3; i++){
        var hContainer = createHorizontalContainer();
        for(var j=0; j < 3; j++){
            hContainer.appendChild(createWidget(++count, "" + count));
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
        div.ondragover = widgetDragOver;
        div.ondrop = dashboardDrop;

        // everything else appended to that div
        var text = document.createElement('p');
        text.textContent = jsonData;
        text.className = "widget_child_elements";
        div.appendChild(text);
        
        return div;
    } else {
        div.className = "widget hidden";
        return div;
    }
}

function toggleBuilder(){
    var panel = document.getElementById('widget_builder');
    panel.style.display = panel.style.display == "block" ? "none" : "block";
}

window.addEventListener("load", init);
