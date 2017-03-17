// 
// Factory for creating objects used withing the dashbaord, widgets, variables etc 
//

function WidgetObject() {
	this.type = TYPE.WIDGET;
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		title  : "",
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		serviceURL : "", 
		title : "",
	};
	this.children = [];
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		console.log("Updating "+ widget.type + " with serviceURL: "+ widget.json.serviceURL);
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {  //specific to a variable but the api will be the same on all items
				base : "",
				title  : "",
			},
			json : { // set these (optional keys that only apply to this type of variable)
				serviceURL : "", 
				title : "",
			} ,
			children : [],
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.title = dom2json(this.dom.title);
		var children = [];
		var jsonVars = this.children; // As we store a reference to the child as object we just call there toJSON function
		for(var i=0; i<jsonVars.length; i++){
			children.push(jsonVars[i].toJSON());
		}
		
		toJSON.json.serviceURL = this.json.serviceURL;
		toJSON.json.title = this.json.title;
		toJSON.children = children;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var title = json2dom(domObjects.title);
		base.appendChild(title);

		
		this.dom.base = base;
		this.dom.title = title;
		this.type = jsonData.type;
		this.json.title = jsonData.json.title;
		this.json.serviceURL = jsonData.serviceURL;
		
		var children = jsonData.children;
		for(var i=0; i<children.length;i++){ 
			if(children[i].type == TYPE.VARIABLE){// check type to create different items like labels etc
				var variable = createVariable(children[i]);
				console.log("Adding item of type "+ TYPE.VARIABLE);
				//this.dom.base.appendChild(variable.dom.base);
				this.appendItem(variable);
			}
		}

		return this;
	};
	this.appendItem = function (itemToAdd) { 
		this.children.push(itemToAdd); // add to children list
		// append there dom content to the widgets
		this.dom.base.appendChild(itemToAdd.dom.base);
	};
	return this;
};

function VariableObject(){
	this.type = TYPE.VARIABLE; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		key  : "",
		value : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		jsonKey : "", 
		key : "", 
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		console.log("Updating "+ variable.type + " with jsonKey: "+ variable.json.jsonKey);
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {
				base : "",
				key  : "",
				value  : ""
			},
			json : {
				jsonKey : "",
				key : ""
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.key = dom2json(this.dom.key);
		toJSON.dom.value = dom2json(this.dom.value);
		toJSON.json.jsonKey = this.json.jsonKey;
		toJSON.json.key = this.json.key;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var key = json2dom(domObjects.key);
		var value = json2dom(domObjects.value);
		base.appendChild(key);
		base.appendChild(value);

		var domElem = {
			base : base,
			key  : key,
			value : value
		}

		this.dom = domElem;
		this.type = jsonData.type;
		this.json.jsonKey = jsonData.json.jsonKey;
		this.json.key = jsonData.json.key;
		return this;
	};
}

function LabelObject(){
	this.type = TYPE.LABEL; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		text  : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable) 
		text : "", 
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		console.log("Updating "+ variable.type + " with text: "+ variable.json.text);
	};
	this.toJSON = function() {
		var toJSON =  {
			type : TYPE.LABEL, // every item must have a type variable
			dom : {  //specific to a variable but the api will be the same on all items
				base : "",
				text  : ""
			},
			json : { // set these (optional keys that only apply to this type of variable) 
				text : "", 
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.text = dom2json(this.dom.text);
		toJSON.json.text = this.json.text;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json

		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var text = json2dom(domObjects.text);
		base.appendChild(text);

		var domElem = {
			base : base,
			text  : text
		}

		this.dom = domElem;
		this.type = jsonData.type;
		this.json.text = jsonData.json.text;

		return this;
	};
}


function createWidget2(jsonData, id){
	if (typeof jsonData === 'string' || jsonData instanceof String) console.error("You passed a string when A Json object was expected.");
	if (!jsonData && !id) console.error("Either Json data OR ID must be defined");

	var newWidget = new WidgetObject();// Object.create(WidgetObject);//Object.create(WidgetObject); // make a copy of the object - Object.create from ECMAScript 5
	if(id){
		var div = document.createElement('div');
		div.id = id;
		// base creation
		div.className = 'widget hidden';
		div.draggable = false;
		// things can be dragged onto empy space
		div.ondragover = globalDragOver;
		div.ondrop = dashboardDrop;

		// blank title
		var text = document.createElement('p');
		text.textContent = "";
		text.className = CSS.DRAGGABLECHILDREN;
		div.appendChild(text);

		// assign to new widget
		newWidget.dom.base = div;
		newWidget.dom.title = text;
	}


	return jsonData ? newWidget.fromJSON(jsonData) : newWidget; //return blank or generate based on json input;
} 

function createVariable(jsonData){
    var variable = new VariableObject();
	return jsonData ? variable.fromJSON(jsonData) : variable; //return blank or generate based on json input
}

function createLabel(jsonData){

	// // label item

 //    var labelElem = document.createElement('div');
 //    labelElem.id = ID.TEMPLATELABEl;
 //    labelElem.draggable = true;
 //    // // implemented in dragndrop.js
 //    // label.ondragstart = variableTemplateDragStart;
 //    // label.ondragover = globalDragOver;
 //    // label.ondrop = builderDrop;

 //    var labelText = document.createElement('h2');
 //    labelText.textContent = "Label";
 //    labelText.className = "widget_child_elements variable";

 //    labelElem.appendChild(labelText);

	var label = new LabelObject();
	return jsonData ? label.fromJSON(jsonData) : label;
}



function json2dom(jsonData){
	var base = document.createElement(jsonData.tag);
	base.className = jsonData.className;
	base.id = jsonData.id;
	base.textContent = jsonData.content;
	base.draggable = jsonData.draggable;
	return base;
}

// to save dom elemnts to json in the future, use elem.nodeName to get the type and then the textContent, className and ID in a mini json object, should be enough info
function dom2json(domElement){
	return {
		tag : domElement.nodeName,
		content : domElement.childNodes[0].nodeType == 3 ? domElement.childNodes[0].textContent : "", //makes sure we only get content from that node and not child nodes
		className : domElement.className,
		id : domElement.id,
		draggable : domElement.draggable
	}
}

