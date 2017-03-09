

function testService(){
	var serviceUrl = document.getElementById('service_url').value;
	var listElement = document.getElementById('service_output');
	var xhr = new XMLHttpRequest();

	var url = "/api/data/custom/test?url=" + encodeURIComponent(serviceUrl);

	xhr.open("GET", url);
	xhr.onload = function() {
	    if (xhr.status === 200){
			var jsonObj = JSON.parse(this.responseText);
			var dotNotation = listPaths(jsonObj);

			for(var i=0; i<dotNotation.length; i++){
				var option = document.createElement("option");
				option.textContent = dotNotation[i];

				option.draggable = true;
		        option.ondragstart = variableDataDragStart;
		        option.ondragover = globalDragOver;
		        option.ondrop = builderDrop;

				listElement.append(option);
			}
	    } else{
			console.log(xhr.status);
	    }
 	};

	xhr.send();
}


function toggleBuilder(){
    var panel = document.getElementById(ID.BUILDER);
    panel.style.display = panel.style.display == "block" ? "none" : "block";

    var currentState = document.getElementById('current_state_container');
    var widget = document.getElementById(ID.WIPWIDGET);

    if(!widget){ // if there isn't a widget already being built, add a blank one
    	var widget = createWidget(ID.WIPWIDGET,"Base widget"); //TODO id must be removed when added to the widget grid
    	widget.className = "widget_blank";
    	widget.ondrop = builderDrop;
    	currentState.append(widget);
    }

    //create item palette and add items
    var itemContainer = document.getElementById(ID.ITEMCONTAINER); //container

    if(itemContainer.children.length == 0){  
	    var variable = document.createElement("div");
	    variable.id = ID.TEMPLATEVARIABLE;
	    variable.draggable = true;
	    // implemented in dragndrop.js
	    variable.ondragstart = variableTemplateDragStart;
	    variable.ondragover = globalDragOver;
	    variable.ondrop = builderDrop;

	    var key = document.createElement("p");
	    key.textContent = "Key"
	    key.className = "widget_child_elements variable";


	    var value = document.createElement("p");
	    value.textContent = "Value"
	    value.className = "widget_child_elements variable";

	    variable.appendChild(key);
	    variable.appendChild(value);


	    itemContainer.appendChild(variable);
	}

	// create slot for variable to be dropped onto

	var variableContainer = document.getElementById(ID.VARIABLECONTAINER);

	if(variableContainer.children.length == 0){
		var variableSlot = document.createElement("div");
		variableSlot.id = ID.VARIABLESLOT;
		variableSlot.ondragover = globalDragOver;
		variableSlot.ondrop = builderDrop;
		variableSlot.textContent = "Drop here to start";
		variableContainer.appendChild(variableSlot);
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
      if (arguments.callee(o[c], r + "." + c)) {
        list.push(r.substring(1) + "." + c);
      }
    }
    return false;
  })(a);
  return list;
}