'use strict';

//dashboardDrop - handles drops on the the dashboard screen

// currently Dragging dom element is put here for manipulation
var currentItemDragging = undefined;

function dashboardDrop(event) {
  event.preventDefault();

  var dataTransfer = JSON.parse(event.dataTransfer.getData('data'));
  var type = dataTransfer.type;
  var data = dataTransfer.data;

  var destination = document.getElementById(event.target.id);

  console.log('Type: ' + type);
  switch (type) {
    case 'widget_drag':

      if(data == event.target.id) break; 
      console.log('Drop Event: ' + data + ' -> ' + event.target.id);
      var source = document.getElementById(data);

      var tempHTML = destination.innerHTML;
      var tempID = destination.id;

      destination.innerHTML = source.innerHTML;
      destination.id = data;

      source.innerHTML = tempHTML;
      source.id = tempID;

      if(destination.className.includes(CSS.HIDDEN)){
        // we need to swap the classes aroud too
        destination.className = CSS.WIDGET;
        destination.draggable = true;
        destination.ondragstart = widgetDragStart;
        destination.ondragover = globalDragOver;
        destination.ondrop = dashboardDrop;

        source.className = CSS.WIDGET + " " + CSS.HIDDEN;
        source.draggable = false;
      }

      break;
    case 'widget_manager_drag' : 
      console.log("Dropping a widget from the manager to the dash");
      addWidgetToDashboardFromManager(data, event.target.id);
      if(document.getElementById(ID.RESHOWMANAGER).checked){
        toggleSavedWidgetLoader();
      }

      break;
  }

}

function builderDrop(event) {
  // handles all drops to do with making a widget

  var destinationID = event.target.id;
  var dataTransfer = JSON.parse(event.dataTransfer.getData('data'));
  var source = dataTransfer.source;

  // console.log('Source : '+ source + ' || Destination : '+ destinationID);

  switch (source) {
    case 'variable_drag':
      if(destinationID == ID.WIPWIDGET){ // add variable to widget
        currentItem.dom.base.id = ""; // remove id so we don't break the builder
        currentWidget.appendItem(currentItem);
      } else if(destinationID == ID.BUILDERTRASHCAN){
        if(!currentWidget.removeItem(currentItemDragging)){ // if its not in the widget its in the varibale builder
          var parent = currentItemDragging.parentNode;
          parent.removeChild(currentItemDragging);
        } 
      }
      break;
    case 'data_drag':
      currentItem.dom.value.textContent = dataTransfer.data; // just to show the user it has worked
      currentItem.json.jsonKey = dataTransfer.data;
      break;
    case 'item_template_drag': //adding a blank variable to the builder to be built
        
      if(destinationID == ID.VARIABLESLOT){
        var variableBuilder = document.getElementById(ID.VARIABLESLOT);
        if (variableBuilder.children.length == 0) {
          variableBuilder.textContent = ''; //reset text

          switch(dataTransfer.data){
            case ID.BIG_LABEL_DISPLAY :
              currentItem = createLabel(JSON.parse(BIG_LABEL_DISPLAY_JSON)); // currentItem is a global in builder.js
              currentItem.dom.base.ondblclick = labelDoubleClickHandler;
              break;
            case ID.LABEL_DISPLAY :
              currentItem = createLabel(JSON.parse(LABEL_DISPLAY_JSON));
              currentItem.dom.base.ondblclick = labelDoubleClickHandler;
              break;
            case ID.VARIABLE_DISPLAY :
              var json = JSON.parse(VARIABLE_DISPLAY_JSON);
              currentItem = createVariable(json, json.type);
              currentItem.dom.base.ondblclick = variableDoubleClickHandler;
              break;
            case ID.VARIABLE_UNIT_DISPLAY :
              var json = JSON.parse(VARIABLE_UNIT_DISPLAY_JSON);
              currentItem = createVariable(json, json.type);
              currentItem.dom.key.ondblclick = variableDoubleClickHandler;
              currentItem.dom.unit.ondblclick = variableUnitDoubleClickHandler;
              break;
            case ID.VARIABLE_DATA_DISPLAY :
              var json = JSON.parse(VARIABLE_DATA_DISPLAY_JSON);
              currentItem = createVariable(json, json.type);
              break;
            case ID.VARIABLE_HTML_DISPLAY :
              var json = JSON.parse(VARIABLE_HTML_DISPLAY_JSON);
              currentItem = createVariable(json, json.type);
              break;
            case ID.POSITIONAL_DISPLAY :
              var json = JSON.parse(POSITIONAL_DISPLAY_JSON);
              currentItem = createPositionalItem(json);
              break;

              
          }

          currentItem.dom.base.classList.remove(CSS.DISPLAY_SPACING);
          currentItem.dom.base.ondragstart = variableDragStart;
          currentItem.dom.base.ondragover = globalDragOver;
          variableBuilder.appendChild(currentItem.dom.base);

        } else {
          console.log("Slot full");
        }
      }
      break;
  }
}

/*
	IMPORTANT - Every variable and every elemnt inside varibale must contain the 'untargetable' class in there classList
	else the drag and drop api will be broken (due to the poor implementation in HTML5)
*/

// widget drag start

function widgetDragStart(event) {
  var data = JSON.stringify({
    type: 'widget_drag',
    data: event.target.id
  });
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}
// widget drag start

function widgetManagerDragStart(event) {
  var data = JSON.stringify({
    type: 'widget_manager_drag',
    data: event.target.id
  });
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}

// data drag start

function variableDataDragStart(event) {
  var data = JSON.stringify({
    source: 'data_drag',
    data: event.target.textContent
  });
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}


// variable drag start

function variableDragStart(event) {
  var data = JSON.stringify({
    source: 'variable_drag',
    data: event.target.textContent
  });

  currentItemDragging = event.target;
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}

// variable template drag start

function itemTemplateDragStart(event) {
  var data = JSON.stringify({
    source: 'item_template_drag',
    data: event.target.id
  });
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}

// global drag over

function globalDragOver(event) { // allow drops onto the variable builder
  event.preventDefault();
}

// double click handler

function variableDoubleClickHandler(event) {
  var keyInput = prompt('Enter a key for the data: ', 'key');
  if(keyInput){
    currentItem.dom.key.textContent = keyInput;
    currentItem.json.key = keyInput;
  }
}

function variableUnitDoubleClickHandler(event) {
  var keyInput = prompt('Enter a key for the data: ', 'key');
  if(keyInput){
    currentItem.dom.unit.textContent = keyInput;
    currentItem.json.unit = keyInput;
  }
}

function titleDoubleClickHandler(event){
  var keyInput = prompt('Enter a title for the widget: ', 'Title');
  if(keyInput){
    currentWidget.dom.title.textContent = keyInput;
    currentWidget.json.title = keyInput;
  }
}

function labelDoubleClickHandler(event) {
  var keyInput = prompt('Enter label text: ', 'Text');
  if(keyInput){
    currentItem.dom.text.textContent = keyInput;
    currentItem.json.text = keyInput;
  }
}

