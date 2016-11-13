/*jslint node: true */

'use strict';



function addWidgit(title) {
    var grid = document.getElementById('widget_grid'),
        container = document.createElement('div'),
        titleEl = document.createElement('p');
    
    container.className = "widget_item";
    titleEl.textContent = title;
    container.appendChild(titleEl);
    grid.appendChild(container);
}





function init() {
   // on load set up components
    console.log("Dashboard loading...");
    
    for (var i = 0; i < 5; i++) {
        addWidgit("Testerino"+(i+1));
    }
}


window.addEventListener("load", init);
