'use strict';

//dashboardDrop - handles drops on the the dashboard screen

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
        destination.className = "widget";
        destination.draggable = true;
        destination.ondragstart = widgetDragStart;
        destination.ondragover = globalDragOver;
        destination.ondrop = dashboardDrop;

        source.className = "widget hidden";
        source.draggable = false;
      }

      break;
  }

}

function builderDrop(event) {
  // handles all drops to do with making a widget

  var destinationID = event.target.id;
  var dataTransfer = JSON.parse(event.dataTransfer.getData('data'));
  var source = dataTransfer.source;

  console.log('Source : '+ source + ' || Destination : '+ destinationID);

  switch (destinationID) {
    case ID.WIPWIDGET:
      //console.log('Dropping ' + source + ' onto the development widget.');
      if (source == 'variable_drag') {
        // add variable to widget
        console.log('Adding a variable to widget.');
        currentItem.dom.base.id = ""; // remove id so we don't break the builder
        //currentItem.dom.base.className += CSS.DRAGGABLECHILDREN;
        currentWidget.appendItem(currentItem);

      }
      break;
    case ID.VARIABLE_DISPLAY:
      //console.log('Dropping ' + source + ' onto a variable');
      if (source == 'data_drag') {
        console.log('Adding a data source to variable.');
        // var currentVariable = document.getElementById('variable');
        // currentVariable.children[1].textContent = dataTransfer.data;
        // currentVariable.children[currentVariable.children.length - 1].textContent = dataTransfer.data; // actual jsonKey - always last
        currentItem.dom.value.textContent = dataTransfer.data;
        currentItem.json.jsonKey = dataTransfer.data;

      }
      break;
    case ID.VARIABLESLOT:
      //console.log('Dropping ' + source + ' onto a variable_builder');
      if (source == 'variable_template_drag') {
        // adding a blank variable to the builder to be built
        console.log('Adding a variable_template to the variable builder.');

        var variableBuilder = document.getElementById(ID.VARIABLESLOT);
        //var newVariable = document.getElementById(dataTransfer.data).cloneNode(true);

        //console.log(ID: dataTransfer.data);

        if (variableBuilder.children.length == 0) {
          variableBuilder.textContent = ''; //reset text

          switch(dataTransfer.data){
            case ID.LABEL_DISPLAY :
              currentItem = createLabel(JSON.parse(LABEL_DISPLAY_JSON)); // currentItem is a global in builder.js
              currentItem.dom.base.ondblclick = labelDoubleClickHandler;
              break;
            case ID.VARIABLE_DISPLAY :
              currentItem = createVariable(JSON.parse(VARIABLE_DISPLAY_JSON));
              currentItem.dom.base.ondblclick = variableDoubleClickHandler;
              break;
          }


          currentItem.dom.base.ondragstart = variableDragStart;
          currentItem.dom.base.ondragover = globalDragOver;

          variableBuilder.appendChild(currentItem.dom.base);
        } else {
          // ask to replace current widget they are working on
        }

      }
      break;
  }
}

/*
	IMPORTANT - Every variable and every elemnt inside varibale must contain the 'widget_child_elements' class in there classList
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
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}

// variable template drag start

function variableTemplateDragStart(event) {
  var data = JSON.stringify({
    source: 'variable_template_drag',
    data: event.target.id
  });
  event.dataTransfer.setData('data', data);
  event.dataTransfer.dropEffect = 'move';
}

// // for label

// function variableTemplateDragStart(event) {
//   var data = JSON.stringify({
//     source: 'label_template_drag',
//     data: event.target.id
//   });
//   event.dataTransfer.setData('data', data);
//   event.dataTransfer.dropEffect = 'move';
// }

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

