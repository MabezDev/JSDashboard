

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
		        option.ondragover = variableDataDragOver;
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
    var panel = document.getElementById('widget_builder');
    panel.style.display = panel.style.display == "block" ? "none" : "block";

    var currentState = document.getElementById('current_state_container');
    var widget = document.getElementById("builder_base");

    if(!widget){ // if there isn't a widget already being built, add a blank one
    	var widget = createWidget("builder_base","Base widget"); //TODO id must be removed when added to the widget grid
    	widget.className = "widget_blank";
    	widget.ondrop = builderDrop;
    	currentState.append(widget);
    }

    //create item palette and add items
    var itemContainer = document.getElementById("item_palette_container"); //container

    if(itemContainer.children.length == 0){  
	    var variable = document.createElement("span");
	    variable.id = "variable";
	    variable.draggable = true;
	    // implement thes in dragndrop.js
	    variable.ondragstart = variableDragStart;
	    variable.ondragover = variableDragOver;
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

	var variableContainer = document.getElementById("variable_builder_container");

	if(variableContainer.children.length == 0){ // TODO build multiple widgets at a time?
		// <div id="variable_builder">
		// <p>Variable building goes here</p>
		// </div>
		var variableSlot = document.createElement("div");
		variableSlot.id = "variable_builder";
		variableSlot.ondragover = variableBuilderDragOver;
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