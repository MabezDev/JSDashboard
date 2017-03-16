// 
// Factory for creating objects used withing the dashbaord, widgets, variables etc 
//


function createWidget2(jsonData){
	var widget = {
		type : TYPE.WIDGET,
		dom : {  //specific to a variable but the api will be the same on all items
			base : "",
			title  : "",
			variables : ""
		},
		json : { // set these (optional keys that only apply to this type of variable)
			serviceURL : "", 
			title : "", 
		} ,
		update : function(){ // then the update function pushes datachnages in the json them into the dom elements
			console.log("Updating "+ widget.type + " with serviceURL: "+ widget.json.serviceURL);
		},
		toJSON : function() {
			var toJSON =  {
				type : this.type,
				dom : {  //specific to a variable but the api will be the same on all items
					base : "",
					title  : "",
					variables : ""
				},
				json : { // set these (optional keys that only apply to this type of variable)
					serviceURL : "", 
					title : "", 
				} ,
			}
			toJSON.dom.base = dom2json(this.dom.base);
			toJSON.dom.key = dom2json(this.dom.title);
			var variables = [];
			for(var i=0; i<this.dom.variables.length; i++){
				variables.push(dom2json(this.dom.variables[i]));
			}
			toJSON.dom.value = dom2json(variables);

			toJSON.json.serviceURL = this.json.serviceURL;
			toJSON.json.title = this.json.title;
			return toJSON;
		},
		fromJSON : function(jsonData) { // load into this object
			// reconstruct from json
			var domObjects = jsonData.dom;
			var base = json2dom(domObjects.base);
			var title = json2dom(domObjects.key);
			base.appendChild(title);
			var domVars = domObjects.variables;
			for(var i=0; i<domVars.length;i++){
				base.appendChild(json2dom(domVars[i]));
			}

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
		}
	}
} 

function createVariable(jsonData){
	// write this in json fromJSON to create a dummy one for the builder

    // variable.draggable = true; // this needs to added when its a builder template variable
    // // implemented in dragndrop.js
    // variable.ondragstart = variableTemplateDragStart;
    // variable.ondragover = globalDragOver;
    // variable.ondrop = builderDrop;

	var variable = {
		type : TYPE.VARIABLE, // every item must have a type variable
		dom : {  //specific to a variable but the api will be the same on all items
			base : "",
			key  : "",
			value : ""
		},
		json : { // set these (optional keys that only apply to this type of variable)
			jsonKey : "", 
			key : "", 
		} ,
		update : function(){ // then the update function pushes datachnages in the json them into the dom elements
			console.log("Updating "+ variable.type + " with jsonKey: "+ variable.json.jsonKey);
		},
		toJSON : function() {
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
		},
		fromJSON : function(jsonData) { // load into this object
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
		}
	};

	return jsonData ? variable.fromJSON(jsonData) : variable; //return blank or generate based on json input
}

function json2dom(jsonData){
	var base = document.createElement(jsonData.tag);
	base.className = jsonData.className;
	base.id = jsonData.id;
	base.textContent = jsonData.content;
	base.draggable = jsonData.draggable;
	return base;
}

// function createLabel(){

// }

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

