/*jslint node: true */

'use strict';



function addWidgit(title) {
    var grid = document.getElementById('widget_grid'),
        container = document.createElement('div'),
        titleEl = document.createElement('p');
    
    container.className = "widget_item";
    titleEl.textContent = title;
    container.appendChild(titleEl);
    container.draggable = true; // enable drag and drop in widgets
    container.ondragstart= dragstart_handler;
    container.ondragenter = drop_handler;
    container.ondragover = dragover_handler;
    grid.appendChild(container);
}





function init() {
   // on load set up components
    console.log("Dashboard loading...");
    for (var i = 0; i < 9; i++) {
        addWidgit("Testerino"+(i+1));
    }
}

function dragstart_handler(event){
    console.log("Moved!");
    event.dataTransfer.setData("text/plain", event.target.id);  // wont work as id's are all the same
    //event.dataTransfer.dropEffect = "copy";
}

function dragover_handler(ev) {
 ev.preventDefault();
 // Set the dropEffect to move
 ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("text");
 var elementDropped = document.getElementById(data);
 var elementDroppedOn = ev.target;
 //console.log("Dropped text: "+elementDropped.p.textContent);
 //console.log("DroppedOn text: "+elementDroppedOn.p.textContent);
 //console.log(elementDropped);
 console.log(elementDroppedOn);
}


window.addEventListener("load", init);
