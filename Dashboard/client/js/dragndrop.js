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

  //console.log('Source : '+ source + ' || Destination : '+ destinationID);

  switch (destinationID) {
    case 'builder_base':
      //console.log('Dropping ' + source + ' onto the development widget.');
      if (source == 'variable_drag') {
        // add variable to widget
        console.log('Adding a variable to widget.');
        var widgetBuilderBase = document.getElementById('builder_base');
        var currentVariable = document.getElementById('variable');
        currentVariable.id = ''; //remove id so it doesnt break the builder

        widgetBuilderBase.appendChild(currentVariable);

      }
      break;
    case 'variable':
      //console.log('Dropping ' + source + ' onto a variable');
      if (source == 'data_drag') {
        console.log('Adding a data source to variable.');
        var currentVariable = document.getElementById('variable');
        currentVariable.children[1].textContent = dataTransfer.data;
        currentVariable.children[currentVariable.children.length - 1].textContent = dataTransfer.data; // actual jsonKey - always last
      }
      break;
    case 'variable_builder':
      //console.log('Dropping ' + source + ' onto a variable_builder');
      if (source == 'variable_template_drag') {
        // adding a blank variable to the builder to be built
        console.log('Adding a variable_template to the variable builder.');

        var variableBuilder = document.getElementById('variable_builder');
        var newVariable = document.getElementById(dataTransfer.data).cloneNode(true);

        if (variableBuilder.children.length == 0) {
          variableBuilder.textContent = ''; //reset text
          newVariable.id = 'variable';
          newVariable.ondragstart = variableDragStart;
          newVariable.ondragover = globalDragOver;
          newVariable.ondblclick = variableDoubleClickHandler;
          variableBuilder.appendChild(newVariable);
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

// global drag over

function globalDragOver(event) { // allow drops onto the variable builder
  event.preventDefault();
}

// double click handler

function variableDoubleClickHandler(event) {
  var keyInput = prompt('Enter a key for the data: ', 'key');
  var variable = document.getElementById(event.target.id);
  variable.children[0].textContent = keyInput;
}

function titleDoubleClickHandler(event){
  var keyInput = prompt('Enter a title for the widget: ', 'Title');
  var title = document.getElementById(event.target.id);
  title.textContent = keyInput;
}

