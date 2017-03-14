/*jslint node: true */
/*jslint browser: true*/
/*jslint esversion: 6*/

'use strict';



function init() {
  // on load set up components
  console.log('Dashboard loading...');
  // //setInterval(updateWidgets, 3000);

  // updateWidgets();
  var count = 0;
  var tableRows = document.getElementById('widget_grid').children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      if(j == 1){
        columns[j].appendChild(createWidget(++count));
      } else {
        columns[j].appendChild(createWidget(++count, '' + count));
      }
    }
  }
}

function createWidget(id, jsonData, forBuilder) {
  //jsondata should be a object that tells hwo the data should be displayed and where to get it from (have a function inside the object called update())
  // for now its just a title

  var div = document.createElement('div');
  div.id = id;
  if (jsonData) {
    // base creation
    div.className = 'widget';
    div.draggable = true;
    div.ondragstart = widgetDragStart;
    div.ondragover = globalDragOver;
    div.ondrop = dashboardDrop;

    // blank title
    var text = document.createElement('p');
    text.textContent = jsonData;
    text.className = forBuilder ? "" : CSS.DRAGGABLECHILDREN;
    text.id = forBuilder ? ID.WIPWIDGETTITLE : "";
    div.appendChild(text);

    return div;
  } else {
    div.className = 'widget hidden';
    // things can be dragged onto empy space
    div.ondragover = globalDragOver;
    div.ondrop = dashboardDrop;
    return div;
  }
}

function addToDashboard() {
  var wipwidget = document.getElementById(ID.WIPWIDGET);
  var serviceURL = document.getElementById(ID.SERVICEURL).value;

  if (serviceURL) {
    console.log('Looking for free spot in grid...');

    var slotFree = findFreeSlot();
    if (slotFree) {
      // add serviceURL - always the last item
      var hiddenURL = document.createElement('p');
      hiddenURL.style.display = 'none';
      hiddenURL.textContent = serviceURL;
      wipwidget.appendChild(hiddenURL);

      // switch into empty slot
      var emptySlot = document.getElementById(slotFree);
      emptySlot.className = 'widget';
      emptySlot.innerHTML = wipwidget.innerHTML;
      emptySlot.draggable = true;
      emptySlot.ondragstart = widgetDragStart;
      emptySlot.ondragover = globalDragOver;
      emptySlot.ondrop = dashboardDrop;

      purgeVariableHandlers(emptySlot);

      //reset the builder widget
      var currentState = wipwidget.parentNode;
      currentState.removeChild(wipwidget);

      var widget = createWidget(ID.WIPWIDGET, 'Click to set title');
      widget.className = 'widget_blank';
      widget.ondrop = builderDrop;
      widget.children[0].ondblclick = titleDoubleClickHandler;
      widget.children[0].className = "";
      currentState.append(widget);

      updateWidgets();

    } else {
      console.log('Widget grid full! Delete an old widget!');
    }
  } else {
    console.log('ServiceURL cannot be empty!');
  }
}

function purgeVariableHandlers(domWidget){
  var title = domWidget.children[0];
  title.className = CSS.DRAGGABLECHILDREN;
  title.id = "";
  var variables = domWidget.children;
  for (var i = 1; i < variables.length - 1; i++) { //-1 as the last item is the service URL, start at 1 because the first elemtn is the title
    variables[i].draggable = false;
    variables[i].ondragstart = undefined;
    variables[i].ondragover = undefined;
    variables[i].ondrop = undefined;
    variables[i].className = CSS.DRAGGABLECHILDREN; // must be appended to every item that should not be targetable by pointer events
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
  var widgets = getWidgetsAsArray();
  for (var widget of widgets) {
    console.log('Updating widet with ID: ' + widget.id);
    updateWidget(widget);
  }
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
