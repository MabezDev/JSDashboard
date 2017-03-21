/*jslint node: true */
/*jslint browser: true*/
/*jslint esversion: 6*/

'use strict';

var arrayOfWidgets = [];



function init() {
  // on load set up components
  console.log('Dashboard loading...');
  // //setInterval(updateWidgets, 3000);

  var count = 0;
  var tableRows = document.getElementById(ID.WIDGETGRID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      columns[j].appendChild(createWidget(undefined,++count).dom.base); // all blank widgets
    }
  }
}

function addToDashboard(newWidgetObject) {
  console.log('Looking for free spot in grid...');

  var slotFree = findFreeSlot();
  if (slotFree) {
    console.log("Slot "+ slotFree + " is free!");
    var emptySlot = document.getElementById(slotFree);

    // assign new unique id
    newWidgetObject.dom.base.id = slotFree; // wont alwasy work as files will be loaded in with the same ID's, will need a function to get the next available ID

    // add drag and drop handlers
    newWidgetObject.dom.base.draggable = true;
    newWidgetObject.dom.base.ondragstart = widgetDragStart;
    newWidgetObject.dom.base.ondragover = globalDragOver;
    newWidgetObject.dom.base.ondrop = dashboardDrop;

    // switch into empty slot
    var slotParent = emptySlot.parentNode;
    slotParent.appendChild(newWidgetObject.dom.base); // add it to the dashbaord
    slotParent.removeChild(emptySlot); // remove the empty slot
    
    console.log("------------------------------------");
    console.log("---Adding new widget to Dashboard---");
    console.log("------------------------------------");
    console.log("Object form: ")
    console.log(newWidgetObject);
    console.log("------------------------------------");
    console.log("------------------------------------");
    console.log("JSON String form: ");
    console.log(JSON.stringify(newWidgetObject.toJSON()));
    console.log("------------------------------------");
    console.log("------------------------------------");
    

    arrayOfWidgets.push(newWidgetObject); // add to array of widgets (global in index.js) for updating etc

    updateWidgets();

  } else {
    console.log('Widget grid full! Delete an old widget!');
  }
}

function findFreeSlot(){
  var tableRows = document.getElementById(ID.WIDGETGRID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      var widget = columns[j].children[0];
      if (widget.className.includes(CSS.HIDDEN)) {
        return widget.id;
      }
    }
  }
  return;  
}

function updateWidgets() {
  for (var widget of arrayOfWidgets) {
    console.log('Updating widget with ID: ' + widget.dom.base.id);
    updateWidget(widget);
  }
}

function updateWidget(widgetObject){
  var jsonKeys = [],
  serviceURL = widgetObject.json.serviceURL;

  for(var i=0; i < widgetObject.children.length; i++){
    if(widgetObject.children[i].type == TYPE.VARIABLE 
      || widgetObject.children[i].type == TYPE.VARIABLEUNIT 
      || widgetObject.children[i].type == TYPE.VARIABLEHTML
      || widgetObject.children[i].type == TYPE.VARIABLEDATA ){
      jsonKeys.push(widgetObject.children[i].json.jsonKey);
    }
  }

  if (!serviceURL || jsonKeys.length == 0) {
    console.log("serviceURL is null or there are no JSON keys to update.");
    return;
  }

  var updateRequest = {
    serviceURL: serviceURL,
    jsonKeys: jsonKeys
  };

  var xhr = new XMLHttpRequest(),
    dataFromServer;

  xhr.open('POST', '/api/data/custom/service?type='+widgetObject.json.urlType);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function() {
    if (xhr.status === 200) {
      dataFromServer = JSON.parse(this.responseText);

      for(var j=0; j < dataFromServer.length; j++){
        var returned = dataFromServer[j];
        for(var k=0; k < widgetObject.children.length; k++){
          if(widgetObject.children[k].json.jsonKey === returned.key){
            console.log(widgetObject.children[k].type);
            if(widgetObject.children[k].type == TYPE.VARIABLEHTML){
              widgetObject.children[k].dom.value.innerHTML = returned.value;
            } else { // another type would be image, setting the src would be different
              widgetObject.children[k].dom.value.textContent = returned.value;
            }
          } 
        }
      }

    } else {
      console.log('Failed to service widget.');
    }
  };
  xhr.send(JSON.stringify(updateRequest));

}

window.addEventListener('load', init);
