
//dashboardDrop - handles drops on the the dashboard screen

function dashboardDrop(event){
    event.preventDefault();

    var dataTransfer = JSON.parse(event.dataTransfer.getData("data"));
    var type = dataTransfer.type;
    var data = dataTransfer.data;

    var destination = document.getElementById(event.target.id);

    console.log("Type: "+type);

	switch(type){
		case "widget_drag":
			console.log("Drop Event: " + data + " -> "+event.target.id);
			var source = document.getElementById(data);

			var tempHTML = destination.innerHTML;
			var tempID = destination.id;

			destination.innerHTML = source.innerHTML;
			destination.id = data;

			source.innerHTML = tempHTML;
			source.id = tempID;
			break;
	}
	
}

//TODO: might be a good idea to have a constants.js that exports vars like id's for dragging and dropping
//TODO: the variales in the item palette should not b on the variable type, but should be a dummy type that passed data to the builder about what tye to start
// building
function builderDrop(event){
	// handles all drops to do with making a widget

	// development widget id: builder_base
	// normal widget id : @incrementing number@
	// variable id : 

	var destinationID = event.target.id;
	var dataTransfer = JSON.parse(event.dataTransfer.getData("data"));
	var source = dataTransfer.source;

	switch(destinationID){
		case "builder_base":
			//console.log("Dropping " + source + " onto the development widget.");
			if(source == "variable_drag"){
				// add variable to widget
				console.log("Adding a variable to widget.");
			}
			break;
		case "variable":
			//console.log("Dropping " + source + " onto a variable");
			if(source == "data_drag"){
				console.log("Adding a data source to variable.");
			}
			break;
		case "variable_builder":
			//console.log("Dropping " + source + " onto a variable_builder");
			if(source == "variable_drag"){
				// adding a blank variable to the builder to be built
				console.log("Adding a variable to the variable builder.");
			}
			break;
	}
}

/*
	IMPORTANT - Every variable and every elemnt inside varibale must contain the 'widget_child_elements' class in there classList
	else the drag and drop api will be broken (due to the poor implementation in HTML5)
*/

// widget srag start

function widgetDragStart(event){
	data = JSON.stringify({
		type : "widget_drag",
		data : event.target.id 
	});
    event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

// data drag start

function variableDataDragStart(event){
	data = JSON.stringify({
		source : "data_drag",
		data : event.target.textContent
	});
	event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}


// variable drag start

function variableDragStart(event){
	data = JSON.stringify({
		source : "variable_drag",
		data : event.target.textContent
	});
	event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

// global drag over

function globalDragOver(event){ // allow drops onto the variable builder
	event.preventDefault();
}