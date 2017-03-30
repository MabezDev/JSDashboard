'use strict';

//dashboardDrop - handles drops on the the dashboard screen

// currently Dragging dom element is put here for manipulation
var currentItemDraggingDom = undefined;

function dashboardDrop(event) {
  event.preventDefault();

  var dataTransfer = JSON.parse(event.dataTransfer.getData('data'));
  var type = dataTransfer.type;
  var data = dataTransfer.data;

  if(!event.target.id) return;

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

  var variableBuilder = document.getElementById(ID.VARIABLESLOT);

  // console.log('Source : '+ source + ' || Destination : '+ destinationID);
  var currentItem = findItemByDomReference(document.elementFromPoint(event.clientX, event.clientY));
  console.log(currentItem);

  switch (source) {
    case 'variable_drag':
      if(destinationID == ID.WIPWIDGET){ // add variable to widget
        currentItem = findItemByDomReference(currentItemDraggingDom);
        currentItem.dom.base.id = ""; // remove id so we don't break the builder
        if(currentItem.type == TYPE.SECTION || currentItem.type == TYPE.CYCLE){
          // add service url and type to section
          currentItem.json.serviceURL = document.getElementById(ID.SERVICEURL).value;
          currentItem.json.urlType = (document.getElementById(ID.URLTYPEJSON).checked ? URL.JSON : URL.RSS);
          if(currentItem.type == TYPE.CYCLE){
            currentItem.dom.base.classList.remove('cycle_helper');
            // get the cycle time
            var parentTextNode = currentItem.dom.base.childNodes[0];
            if(parseInt(parentTextNode.textContent)){
              currentItem.json.cycleTime = (parentTextNode.textContent * 1000); //convert seconds to milliseconds
            } else {
              currentItem.json.cycleTime = 60 * 1000; //default 60 seconds
            }
            parentTextNode.textContent = '';
          } else {
            currentItem.dom.base.classList.remove('section_helper');
          }
        }
        currentWidget.appendItem(currentItem);
      } else if(destinationID == ID.BUILDERTRASHCAN){
        if(!currentWidget.removeItem(currentItemDraggingDom)){ // if its not in the widget
          var removed = false;
          for(var item of currentItems){
            if(item.type == TYPE.SECTION || item.type == TYPE.CYCLE){ 
              removed = item.removeItem(currentItemDraggingDom);
              if(removed) break;
            }
          }
          if(!removed){ // its the first item
            var parent = currentItemDraggingDom.parentNode; // its in the varibale builder
            parent.removeChild(currentItemDraggingDom);
          }
        } 
      }
      break;
    case 'data_drag':
      addKeyToItem(destinationID, document.elementFromPoint(event.clientX, event.clientY), dataTransfer.data);
      break;
    case 'item_template_drag': //adding a blank variable to the builder to be built
        
      if(destinationID == ID.VARIABLESLOT){
        var variableBuilder = document.getElementById(ID.VARIABLESLOT);
        if (variableBuilder.children.length == 0) {
          variableBuilder.textContent = ''; //reset text
          //TODO most of this could be replaced with the createItem function in factory.js - can event set up a objet with id's as keys to set the handlers

          var newItem = createItem(dataTransfer.data);
          addItemHandlers(dataTransfer.data,newItem);
          newItem.dom.base.classList.remove(CSS.DISPLAY_SPACING);
          newItem.dom.base.ondragstart = variableDragStart;
          newItem.dom.base.ondragover = globalDragOver;
          variableBuilder.appendChild(newItem.dom.base);
          currentItems.push(newItem);

        } else {
          console.log("Slot full");
        }
      } else if(destinationID == TYPE.SECTION){
        if(currentItem && currentItem.type == TYPE.SECTION){
          console.log('Adding ' + dataTransfer.data + ' to SECTION.');
          var newItem = createItem(dataTransfer.data);
          newItem.dom.base.classList.remove(CSS.DISPLAY_SPACING);
          addItemHandlers(dataTransfer.data,newItem);
          currentItem.appendItem(newItem);
          currentItems.push(newItem);

          
          currentItem.dom.base.classList.add('section_helper');
        }
      } else if(destinationID == TYPE.CYCLE){
        if(currentItem && currentItem.type == TYPE.CYCLE){
          console.log('Adding ' + dataTransfer.data + ' to CYCLE.');
          var newItem = createItem(dataTransfer.data);
          newItem.dom.base.classList.remove(CSS.DISPLAY_SPACING);
          addItemHandlers(dataTransfer.data,newItem);
          currentItem.appendItem(newItem);
          currentItems.push(newItem);

          currentItem.dom.base.classList.add('cycle_helper');
        }
      }
      break;
  }
}

function findItemByDomReference(domBaseObject){
  for(var item of currentItems){
    if(item.dom.base == domBaseObject){
      return item;
    }
  }
}

function addItemHandlers(id, item){
  switch(id){
    // case ID.BIG_LABEL_DISPLAY :
    //   currentItem = createLabel(JSON.parse(BIG_LABEL_DISPLAY_JSON)); // currentItem is a global in builder.js
    //   currentItem.dom.base.onclick = labelDoubleClickHandler;
    //   break;
    case TYPE.LABEL:
      item.dom.text.onclick = getTextInput;
      break;
    case TYPE.VARIABLE :
      item.dom.key.onclick = getTextInput;
      break;
    case TYPE.VARIABLEUNIT :
      item.dom.key.onclick = getTextInput;
      item.dom.unit.onclick = getTextInput;
      break;
    case TYPE.VARIABLEDATA:
      
      break;
    case TYPE.VARIABLEHTML:
      
      break;
    case TYPE.POSITIONALOBJECT :
      
      break;
    case TYPE.SECTION:
      item.dom.base.textContent = '';
      break;
    case TYPE.CYCLE:
      item.dom.base.textContent = 'Double Click to set cycle interval (secs) default 60 ';
      item.dom.base.ondblclick = getTextInputInt;
      break;
    default:
      console.log('Unexpected id ' + id + ' in addDisplayItemHandlers');
  }
}

function addKeyToItem(id, item, key){
  if(!item || !id || !key) return;
  switch(id){
    // case ID.BIG_LABEL_DISPLAY :
    //   currentItem = createLabel(JSON.parse(BIG_LABEL_DISPLAY_JSON)); // currentItem is a global in builder.js
    //   currentItem.dom.base.onclick = labelDoubleClickHandler;
    //   break;
    case TYPE.LABEL:
      item.textContent = key;
      break;
    case TYPE.VARIABLE :
      item.children[1].textContent = key;
      break;
    case TYPE.VARIABLEUNIT :
      item.children[1].textContent = key;
      break;
    case TYPE.VARIABLEDATA:
      item.children[0].textContent = key;
      break;
    case TYPE.VARIABLEHTML:
      item.children[0].textContent = key;
      break;
    case TYPE.POSITIONALOBJECT:
      
      break;
    case TYPE.SECTION:
      
      break;
    default:
      console.log('Unexpected id ' + id + ' in addKeyToItem');
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

  currentItemDraggingDom = event.target;
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

function titleDoubleClickHandler(event){
  var keyInput = prompt('Enter a title for the widget: ', 'Title');
  if(keyInput){
    currentWidget.dom.title.textContent = keyInput;
    currentWidget.json.title = keyInput;
  }
}

function getTextInput(event){
  var input = prompt('Enter text: ', 'Text');
  if(input){
    event.target.textContent = input;
  }
}

function getTextInputInt(event){
  var input = parseInt(prompt('Enter an integer value: ', '60'));
  if(input){
    event.target.textContent = input;
  }
}



