
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
			console.log("Dropping " + source + " onto the development widget.");
			break;
		case "variable":
			console.log("Dropping " + source + " onto a variable");
			break;
		case "variable_builder":
			console.log("Dropping " + source + " onto a variable_builder");
			break;
	}
}

/*
	IMPORTANT - Every variable and every elemnt inside varibale must contain the 'widget_child_elements' class in there classList
	else the drag and drop api will be broken (due to the poor implementation in HTML5)
*/

function widgetDragStart(event){
	data = JSON.stringify({
		type : "widget_drag",
		data : event.target.id 
	});
    event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

function widgetDragOver(event){
    event.preventDefault(); //prevent default allows item to be dropped
}

// data dragndrop

function variableDataDragStart(event){
	data = JSON.stringify({
		source : "data_drag",
		data : event.target.textContent
	});
	event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

function variableDataDragOver(event){
	event.preventDefault();
}


// variable drag handlers

function variableDragStart(event){
	data = JSON.stringify({
		source : "variable_drag",
		data : event.target.textContent
	});
	event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

function variableDragOver(event){
	event.preventDefault();
}

// variable builder handlers

function variableBuilderDragOver(event){
	event.preventDefault();
}