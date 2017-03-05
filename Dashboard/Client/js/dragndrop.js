
//global drop function - handles all drops

function globalDrop(event){
    event.preventDefault();

    var dataTransfer = JSON.parse(event.dataTransfer.getData("data"));
    var type = dataTransfer.type;
    var data = dataTransfer.data;

    console.log(event.target);

    var destination = document.getElementById(event.target.id);

    console.log("Type: "+type);

    switch(type){
    	case "widget_to_widget":
		    console.log("Drop Event: " + data + " -> "+event.target.id);
		    var source = document.getElementById(data);
		   
		    var tempHTML = destination.innerHTML;
		    var tempID = destination.id;
		    
		    destination.innerHTML = source.innerHTML;
		    destination.id = data;

		    source.innerHTML = tempHTML;
		    source.id = tempID;
		case "data_to_variable":
			console.log("Data: "+data);
		case "variable_to_widget":
	}
}

// widget dragndrop - TODO using drop mask means we cannot use the id anymore, 
// 	need to figure out a solution to this, maybe there is a better way than drop mask

function widgetDragStart(event){
	data = JSON.stringify({
		type : "widget_to_widget",
		data : event.target.id 
	});
    event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

function widgetDragOver(event){
    event.preventDefault(); //prevent default allows item to be dropped
}

// variable builder dragndrop

function variableDataDragStart(event){
	data = JSON.stringify({
		type : "data_to_variable",
		data : event.target.textContent
	});
	event.dataTransfer.setData("data", data);
    event.dataTransfer.dropEffect = "move";
}

function variableDataDragOver(event){
	event.preventDefault();
}