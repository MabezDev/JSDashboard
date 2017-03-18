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
  var tableRows = document.getElementById('widget_grid').children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      // if(j == 1 && i == 0){
      //   // this is all we need to now to get rolling
      //   var newWidget = createWidget2(JSON.parse(WIDGET_RAW_JSON));
      //   // TODO - check if ID is in use when loaded, if it is give it the next available one
      //   var newWidgetDom = newWidget.dom.base;
      //   newWidgetDom.ondragstart = widgetDragStart;
      //   newWidgetDom.ondragover = globalDragOver;
      //   newWidgetDom.ondrop = dashboardDrop;

      //   var label = createLabel(JSON.parse(LABEL_RAW_JSON));
      //   newWidget.appendItem(label);

      //   columns[j].appendChild(newWidgetDom);
      // } else {
      //   //var newWidget = createWidget2(undefined,++count).dom.base;
      //   columns[j].appendChild(createWidget2(undefined,++count).dom.base);
      // }
      columns[j].appendChild(createWidget2(undefined,++count).dom.base); // all blank widgets
    }
  }
}

function addToDashboard(newWidgetObject) {
  console.log('Looking for free spot in grid...');

  var slotFree = findFreeSlot();
  if (slotFree) {

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
    console.log("JSON String form: ");
    console.log(JSON.stringify(newWidgetObject.toJSON()));
    console.log("------------------------------------");
    

    arrayOfWidgets.push(newWidgetObject); // add to array of widgets (global in index.js) for updating etc

    updateWidgets();

  } else {
    console.log('Widget grid full! Delete an old widget!');
  }
}

function getWidgetsAsArray(){
  var widgetsArray =[];
  var tableRows = document.getElementById('widget_grid').children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      var widget = columns[j].children[0];
      if (!(widget.className.includes(CSS.HIDDEN))) {
        widgetsArray.push(widget);
      }
    }
  }
  return widgetsArray;  
}

function findFreeSlot(){
  var tableRows = document.getElementById('widget_grid').children[0].children;
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
  //var widgets = getWidgetsAsArray();
  console.log("Updating");
  console.log(arrayOfWidgets.length);
  for (var widget of arrayOfWidgets) {
    console.log('Updating widget with ID: ' + widget.dom.base.id);
    updateWidget2(widget);
  }
}

function updateWidget2(widgetObject){
  var jsonKeys = [],
  serviceURL = widgetObject.json.serviceURL;

  for(var i=0; i < widgetObject.children.length; i++){
    if(widgetObject.children[i].type == TYPE.VARIABLE){
      jsonKeys.push(widgetObject.children[i].json.jsonKey);
    }
  }

  if (!serviceURL || jsonKeys.length == 0) return;

  var updateRequest = {
    serviceURL: serviceURL,
    jsonKeys: jsonKeys
  };

  var xhr = new XMLHttpRequest(),
    dataFromServer;

  xhr.open('POST', '/api/data/custom/json');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(JSON.parse(this.responseText)); // json formatted data, in the order requested
      dataFromServer = JSON.parse(this.responseText);

      for(var j=0; j < dataFromServer.length; j++){
        var returned = dataFromServer[j];
        console.log(returned);
        for(var k=0; k < widgetObject.children.length; k++){
          if(widgetObject.children[k].json.jsonKey === returned.key){
            widgetObject.children[k].dom.value.textContent = returned.value;
          } 
        }
      }

    } else {
      console.log('Failed to service widget.');
    }
  };
  xhr.send(JSON.stringify(updateRequest));

}

function updateWidget(domWidget) {
  var jsonKeys = [];

  var variables = domWidget.children;
  var title = variables[0];
  var serviceURL = variables[variables.length - 1].textContent;

  for (var i = 1; i < variables.length - 1; i++) { //-1 as the last item is the service URL, start at 1 because the first elemtn is the title
    var variableChildren = variables[i].children;
    if (variableChildren) {
      var jsonKey = variableChildren[variableChildren.length - 1].textContent;
      jsonKeys.push(jsonKey);
    }
  }

  if (!serviceURL || jsonKeys.length == 0) return;

  var updateRequest = {
    serviceURL: serviceURL,
    jsonKeys: jsonKeys
  };

  var xhr = new XMLHttpRequest(),
    dataFromServer;

  xhr.open('POST', '/api/data/custom/json');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(JSON.parse(this.responseText)); // json formatted data, in the order requested
      dataFromServer = JSON.parse(this.responseText);

      for (var i = 1; i < variables.length - 1; i++) { //-1 as the last item is the service URL, start at 1 because the first elemtn is the title
        var variableChildren = variables[i].children;
        if (variableChildren) {
          variableChildren[1].textContent = dataFromServer[i - 1]; // displayedkey is always the second key
        }
      }

    } else {
      console.log('Failed to service widget.');
    }
  };
  xhr.send(JSON.stringify(updateRequest));

}

function serviceWidgetData(updateRequest) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', '/api/data/custom/json');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(this.responseText)
      return this.responseText; // json formatted data, in the order requested
    } else {
      return;
    }
  };

  xhr.send(JSON.stringify(updateRequest));
}

// function testWidgetService() {
//   var updateRequest = {
//     serviceURL: 'https://query.yahooapis.com/v1/public/yql?q=select%20wind%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22chicago%2C%20il%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
//     jsonKeys: ['query.results.channel.wind.chill']
//   };

//   var xhr = new XMLHttpRequest();

//   xhr.open('POST', '/api/data/custom/json');
//   xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       console.log(JSON.parse(this.responseText)); // json formatted data, in the order requested
//     } else {
//       console.log('Failed to service widget.');
//     }
//   };

//   xhr.send(JSON.stringify(updateRequest));

// }

window.addEventListener('load', init);
