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
        div.className = "widget";
        div.draggable = true;
        div.ondragstart = handleDragStart;
        div.ondragover = handleDragOver;
        div.ondrop = handleDrop;
        var text = document.createElement('p');
        text.textContent = jsonData;
        div.appendChild(text);

        return div;
    } else {
        
        div.className = "widget hidden";
        return div;
    }
}

function handleDragStart(event){
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.dropEffect = "copy";
}

function handleDragOver(event){
    event.preventDefault(); //prevent default allows item to be dropped
}

function handleDrop(event){
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    console.log("Drop Event: " + data + " -> "+event.target.id);
    var source = document.getElementById(data);
    var destination = document.getElementById(event.target.id);
    var tempHTML = destination.innerHTML;
    var tempID = destination.id;
    
    destination.innerHTML = source.innerHTML;
    destination.id = data;

    source.innerHTML = tempHTML;
    source.id = tempID;
}


window.addEventListener("load", init);
