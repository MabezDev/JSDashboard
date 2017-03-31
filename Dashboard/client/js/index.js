/*jslint node: true */
/*jslint browser: true*/
/*jslint esversion: 6*/

'use strict';

var arrayOfWidgets = [];
var contextMenuOpen = false;

function init() {
  // on load set up components

  var count = 0;
  var tableRows = document.getElementById(ID.WIDGETGRID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      columns[j].children[0].appendChild(createWidget(undefined,++count).dom.base); // all blank widgets
    }
  }

  updateWidgets(); // intially, if loaded from layout
  setInterval(() => {
    updateWidgets();
  }, 180000); // 180000 = every 3mins

  // add context menu resetter
  document.onclick = function(e){
    var menu = document.getElementById('context-menu');
    menu.style.display = 'none';
  }

  // debug css layouts
  //[].forEach.call(document.querySelectorAll("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)});
}

function addToDashboard(newWidgetObject, slotID) {
  var replace = false;
  if(slotID){
    if(!isSlotFree(ID.WIDGETGRID, slotID)){
      if(!confirm("A widget is already in that slot, are you sure you want to replace it? (Cancelling will place the widget in the next free slot)")){
        slotID = findFreeSlot(ID.WIDGETGRID);
      } else {
        replace = true;
      }
    }
  }
  var slotFree = slotID ? slotID : findFreeSlot(ID.WIDGETGRID);
  if (slotFree) {

    console.log("Slot "+ slotFree + " is free!");
    var dropSlot = document.getElementById(slotFree);

    // add drag and drop handlers
    newWidgetObject.dom.base.draggable = true;
    newWidgetObject.dom.base.ondragstart = widgetDragStart;
    newWidgetObject.dom.base.ondragover = globalDragOver;
    newWidgetObject.dom.base.ondrop = dashboardDrop;
    newWidgetObject.dom.base.oncontextmenu = widgetRightClickHandler;

    // get the container
    var slotParent = dropSlot.parentNode;

    if (replace) {
      removeWidgetById(slotFree); // remove old widget
    } else {
      slotParent.removeChild(dropSlot); // remove the empty slot
    }

    // assign new unique id
    newWidgetObject.dom.base.id = slotFree; // wont alwasy work as files will be loaded in with the same ID's, will need a function to get the next available ID

    // switch into empty slot
    slotParent.appendChild(newWidgetObject.dom.base);

    toggleIntervals(newWidgetObject,true);
    
    console.log("------------------------------------");
    console.log("---Adding new widget to Dashboard---");
    console.log("------------------------------------");
    console.log("Object form: ")
    console.log(newWidgetObject);
    console.log("------------------------------------");
    // console.log("------------------------------------");
    // console.log("JSON String form: "); // so we can easily save while testing
    // console.log(JSON.stringify(newWidgetObject.toJSON()));
    // console.log("------------------------------------");
    // console.log("------------------------------------");
    

    arrayOfWidgets.push(newWidgetObject); // add to array of widgets (global in index.js) for updating etc

    updateWidget(newWidgetObject); // service for the first time

  } else {
    console.log('Widget grid full! Delete an old widget!');
  }
}

function toggleIntervals(widgetObject, state){
  for(var child of widgetObject.children){
    if(child.type == TYPE.CYCLE){
        child.toggleInterval(state);
        toggleIntervals(child, state)
    }
  }
}

function finalizeWidget(widget){

  widget.dom.base.title = ''; //reset serviceURL title 
  
  for(var i=0; i<widget.children.length; i++){ // make sure children are not targetable or draggable

    widget.children[i].dom.base.className += " " + CSS.UNTARGETABLECHILDREN;
    widget.children[i].dom.base.draggable = false;

    if(widget.children[i].type == TYPE.SECTION || widget.children[i].type == TYPE.CYCLE){
      finalizeWidget(widget.children[i]);
      if(widget.children[i].type == TYPE.CYCLE){
        widget.children[i].dom.base.className = ' ' +  CSS.CYCLE;
        widget.children[i].dom.base.classList.remove('cycle_helper');
      } else {
        widget.children[i].dom.base.classList.remove('section_helper');
      }
    } else if(widget.children[i].type == TYPE.POSITIONALOBJECT){
      widget.children[i].dom.base.className += ' ' + CSS.HIDDEN;
      widget.children[i].dom.base.textContent = '';
    } else if(widget.children[i].type == TYPE.VARIABLEHTML){
      widget.children[i].dom.value.className.replace(CSS.UNTARGETABLECHILDREN, '');
      widget.children[i].dom.value.className += ' ' + CSS.TARGETABLECHILDREN;
      widget.children[i].json.jsonKey = widget.children[i].dom.value.textContent;
    } else if( widget.children[i].type == TYPE.VARIABLE 
            || widget.children[i].type == TYPE.VARIABLEUNIT 
            || widget.children[i].type == TYPE.VARIABLEDATA ){
      widget.children[i].json.jsonKey = '' + widget.children[i].dom.value.textContent;
    }
  }
  if(widget.dom.title){
    widget.dom.title.className += " " + CSS.UNTARGETABLECHILDREN;// stop the double click handler
    widget.dom.title.id = ""; // remove title id so we dont break when building another widget
  }
  widget.dom.base.id = ""; // remove id so we dont break when building another widget
  return widget;
}

function unfinalizeWidget(widgetOriginal){
  var widget = widgetOriginal;
  widget.dom.base.title =  widget.json.serviceURL; //reset serviceURL title 
  
  for(var i=0; i<widget.children.length; i++){ // make sure children are not targetable or draggable
    widget.children[i].dom.base.className = 'targetable';
    widget.children[i].dom.base.draggable = true;

    if(widget.children[i].type == TYPE.SECTION || widget.children[i].type == TYPE.CYCLE){
      unfinalizeWidget(widget.children[i]);
      widget.children[i].dom.base.className = 'section item display_text';
    } else if(widget.children[i].type == TYPE.POSITIONALOBJECT){
      widget.children[i] = createItem(TYPE.POSITIONALOBJECT);
    } else if(widget.children[i].type == TYPE.VARIABLEHTML){
      widget.children[i].dom.value.textContent = widget.children[i].json.jsonKey;
    } else if( widget.children[i].type == TYPE.VARIABLE 
            || widget.children[i].type == TYPE.VARIABLEUNIT 
            || widget.children[i].type == TYPE.VARIABLEDATA ){
      widget.children[i].dom.value.textContent = widget.children[i].json.jsonKey;
    }
  }
  if(widget.dom.title){
    widget.dom.title.className = 'widget_title';
    widget.dom.title.id = "wip_widget_title";
  }
  if(widget.type == TYPE.WIDGET){
    widget.dom.base.id = "wip_widget";
  }
  return widget;
}

function getWidgetById(domID){
  for(var widget of arrayOfWidgets){
    if(widget.dom.base.id == domID){
      return widget;
    }
  }
}

function removeWidgetById(domId){
  arrayOfWidgets = arrayOfWidgets.filter(e => {
    if(e.dom.base.id == domId){
      for(var child of e.children){
        if(child.type == TYPE.CYCLE){
          child.toggleInterval(false);
        }
      }
    } else {
      return e;
    }
  });

  var widgetToRemove = document.getElementById(domId);
  if(widgetToRemove.parentNode){ // if element has parent remove it ( remove from page )
    widgetToRemove.parentNode.appendChild(createWidget(undefined,domId).dom.base); // replace with blank
    widgetToRemove.parentNode.removeChild(widgetToRemove);
  }
}

function findFreeSlot(gridID){
  var tableRows = document.getElementById(gridID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      var widget = columns[j].children[0].children[0];
      if (widget.className.includes(CSS.HIDDEN)) {
        return widget.id;
      }
    }
  }
  return;  
}

function isSlotFree(gridID, elementID){
  var tableRows = document.getElementById(gridID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      var widget = columns[j].children[0].children[0];
      if(widget.id == elementID){
        return widget.className.includes(CSS.HIDDEN)
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
  if(!widgetObject) return;

  var jsonKeys = [];
  var serviceURL = widgetObject.json.serviceURL;

  for(var i=0; i < widgetObject.children.length; i++){
    if(widgetObject.children[i].type == TYPE.SECTION || widgetObject.children[i].type == TYPE.CYCLE){
      updateWidget(widgetObject.children[i]);
    } else if(widgetObject.children[i].type == TYPE.VARIABLE 
      || widgetObject.children[i].type == TYPE.VARIABLEUNIT 
      || widgetObject.children[i].type == TYPE.VARIABLEHTML
      || widgetObject.children[i].type == TYPE.VARIABLEDATA ){
      jsonKeys.push(widgetObject.children[i].json.jsonKey);
      widgetObject.children[i].dom.value.textContent = "Loading...";
    }
  }

  if (!serviceURL || jsonKeys.length == 0) {
    console.log("serviceURL is null or there are no JSON keys to update for type: " + widgetObject.type);
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
            widgetObject.children[k].json.value = returned.value;
          } 
        }
      }
    } else {
      console.log('Failed to service widget.');
    }

    widgetObject.update(); // updates all child objects, pushing the data we just recieved into the dom
  };
  xhr.send(JSON.stringify(updateRequest));

}

window.addEventListener('load', init);
