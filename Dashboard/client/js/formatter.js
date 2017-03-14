'use strict';

//from DOM element we need to get this: 
/*
	widget = {
		title : "Temperature Widget 2k16",
		serviceURL : "yahoo.weather.api/search......",
		variables = [
						{ key: "Temp", jsonKey: "weather.temperature" , type : "tuple"},
						{ key: "Humid", jsonKey : "weather.humidity" , type : "array_plot" } // type is the type of variable
					]
	}
*/


function domWidgetToJSON(domWidget){ // probably be used for saving - need a function to convert back
  var variables = domWidget.children;
  var title = variables[0].textContent;
  var serviceURL = variables[variables.length - 1].textContent;
  var variablesArray = [];

  for (var i = 1; i < variables.length - 1; i++) { //-1 as the last item is the service URL, start at 1 because the first elemtn is the title
    var variableChildren = variables[i].children;
    console.log(variableChildren);
    if (variableChildren) {
      var key = variableChildren[0].textContent;
      var jsonKey = variableChildren[variableChildren.length - 1].textContent;
      var type = variableChildren[variableChildren.length - 2].textContent;
      var jsonVariable = {
        key : key,
        jsonKey : jsonKey,
        type : type
      };
      variablesArray.push(jsonVariable);
    }
  }

  var widget = {
    title : title,
    variables : variablesArray,
    serviceURL : serviceURL
  }

  return widget;
}
