

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
		        option.ondrop = globalDrop;

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
        console.log("Nothing being worked on, creating blank widget");
    	var widget = createWidget("builder_base","Base widget"); //TODO id must be removed when added to the widget grid
    	widget.className = "widget_blank";
    	console.log(widget);
    	currentState.append(widget);
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