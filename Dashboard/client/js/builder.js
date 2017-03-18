
// Holds the wip widget and the item to be added next
var currentItem = undefined;
var currentWidget = undefined;

function testServiceForJSONKeys() {
  var serviceUrl = document.getElementById(ID.SERVICEURL).value;
  var listElement = document.getElementById(ID.SERVICELIST);
  var xhr = new XMLHttpRequest();

  var url = '/api/data/custom/test?url=' + encodeURIComponent(serviceUrl);

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var jsonObj = JSON.parse(this.responseText);
      var dotNotation = listPaths(jsonObj);

      listElement.innerHTML = "";

      for (var i = 0; i < dotNotation.length; i++) {
        var option = document.createElement('option');
        option.textContent = dotNotation[i];

        option.draggable = true;
        option.ondragstart = variableDataDragStart;
        option.ondragover = globalDragOver;
        option.ondrop = builderDrop;

        listElement.append(option);
      }
    } else {
      console.log(xhr.status);
    }
  };

  xhr.send();
}

function addToDashFromBuilder(){
  var wipwidget = document.getElementById(ID.WIPWIDGET);
  var serviceURL = document.getElementById(ID.SERVICEURL).value;
  var urlType = document.getElementById(ID.URLTYPEJSON);

  if (serviceURL) {
      currentWidget.json.serviceURL = serviceURL; // set the service URL
      currentWidget.json.urlType = urlType.checked ? URL.JSON : URL.RSS; 
      
      for(var i=0; i<currentWidget.children.length; i++){ // make sure children are not targetable or draggable
        currentWidget.children[i].dom.base.className = CSS.UNTARGETABLECHILDREN;
        currentWidget.children[i].dom.base.draggable = false;
      }

      currentWidget.dom.title.className = CSS.UNTARGETABLECHILDREN; // stop the double click handler

      currentWidget.dom.title.id = ""; // remove title id so we dont break when building another widget

      //reset the builder widget
      var currentState = wipwidget.parentNode;
      currentState.removeChild(wipwidget); // remove the widget we built from the builder

      addToDashboard(currentWidget);

      addWidgetToBuilder(); // add a blank builder back tot he builder
  } else {
    console.log('ServiceURL cannot be empty!');
  }
}

function toggleBuilder() {
  var panel = document.getElementById(ID.BUILDER);
  panel.style.display = panel.style.display == 'block' ? 'none' : 'block';

  // make sure a builder widget is in place
  addWidgetToBuilder();

  //create item palette and add items
  var itemContainer = document.getElementById(ID.ITEMCONTAINER); //container

  if (itemContainer.children.length < 2) {
    // add a display variable
    var variable = createVariable(JSON.parse(VARIABLE_DISPLAY_JSON), TYPE.VARIABLE);
    // implemented in dragndrop.js
    variable.dom.base.ondragstart = itemTemplateDragStart;
    variable.dom.base.ondragover = globalDragOver;
    variable.dom.base.ondrop = builderDrop;

    itemContainer.appendChild(variable.dom.base);

    // add variable with units

    var variableUnit = createVariable(JSON.parse(VARIABLE_UNIT_DISPLAY_JSON), TYPE.VARIABLEUNIT);

    variableUnit.dom.base.ondragstart = itemTemplateDragStart;
    variableUnit.dom.base.ondragover = globalDragOver;
    variableUnit.dom.base.ondrop = builderDrop;

    itemContainer.appendChild(variableUnit.dom.base);

    // add a display label

    var label = createLabel(JSON.parse(LABEL_DISPLAY_JSON));

    label.dom.base.ondragstart = itemTemplateDragStart;
    label.dom.base.ondragover = globalDragOver;
    label.dom.base.ondrop = builderDrop;

    itemContainer.appendChild(label.dom.base);

    // add a big label

    var bigLabel = createLabel(JSON.parse(BIG_LABEL_DISPLAY_JSON));
    bigLabel.dom.base.ondragstart = itemTemplateDragStart;
    bigLabel.dom.base.ondragover = globalDragOver;
    bigLabel.dom.base.ondrop = builderDrop;

    itemContainer.appendChild(bigLabel.dom.base);
  }

  // create slot for variable to be dropped onto

  var variableContainer = document.getElementById(ID.VARIABLECONTAINER);

  if (variableContainer.children.length == 0) {
    var variableSlot = document.createElement('div');
    variableSlot.id = ID.VARIABLESLOT;
    variableSlot.ondragover = globalDragOver;
    variableSlot.ondrop = builderDrop;
    variableSlot.textContent = 'Drop here to start';
    variableContainer.appendChild(variableSlot);
  }



}

function addWidgetToBuilder(){
  var currentState = document.getElementById(ID.CURRENTSTATECONTAINER);
  var widget = document.getElementById(ID.WIPWIDGET);

  if (!widget) { // if there isn't a widget already being built, add a blank one
    var widget = createWidget(JSON.parse(BUILDER_WIDGET_JSON));
    widget.dom.title.ondblclick = titleDoubleClickHandler; // set click handler on title
    widget.dom.base.ondrop = builderDrop;
    widget.dom.base.ondragover = globalDragOver;
    currentState.append(widget.dom.base);

    currentWidget = widget;
  }
}



function listPaths(a) {
  var list = [];
  (function(o, r) {
    r = r || '';
    if (typeof o != 'object') {
      return true;
    }
    for (var c in o) {
      if (arguments.callee(o[c], r + '.' + c)) {
        list.push(r.substring(1) + '.' + c);
      }
    }
    return false;
  })(a);
  return list;
}
