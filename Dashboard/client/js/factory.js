// 
// Factory for creating objects used withing the dashbaord, widgets, variables etc 
//

// create any item
function createItem(type, data){
	if(type == TYPE.VARIABLE){// check type to create different items like labels etc
		return createVariable(data, TYPE.VARIABLE);
	} else if(type == TYPE.VARIABLEUNIT) {
		return createVariable(data, TYPE.VARIABLEUNIT);
	} else if(type == TYPE.VARIABLEDATA) {
		return createVariable(data, TYPE.VARIABLEDATA);
	} else if(type == TYPE.VARIABLEHTML) {
		return createVariable(data, TYPE.VARIABLEHTML);
	} else if(type == TYPE.LABEL){
		return createLabel(data, TYPE.LABEL);
	} else if(type == TYPE.POSITIONALOBJECT){
		return createPositionalItem(data);
	} else if(type == TYPE.SECTION){
		return createSectionItem(data);
	} else if(type == TYPE.CYCLE){
		return createCycleItem(data);
	} else {
		console.log("Can't create item of type " + type);
	}
}

/*
	Item creators
*/
function createWidget(jsonData, id){
	if (typeof jsonData === 'string' || jsonData instanceof String) console.error("You passed a string when A Json object was expected.");
	if (!jsonData && !id) console.error("Either Json data OR ID must be defined");

	var newWidget = new WidgetObject();
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
		text.className = CSS.UNTARGETABLECHILDREN;
		div.appendChild(text);

		// assign to new widget
		newWidget.dom.base = div;
		newWidget.dom.title = text;
	}


	return jsonData ? newWidget.fromJSON(jsonData) : newWidget; //return blank or generate based on json input;
} 

function createVariable(jsonData, type){
	if(type == TYPE.VARIABLE){
	    var variable = new VariableObject();
		return jsonData ? variable.fromJSON(jsonData) : variable.fromJSON(JSON.parse(VARIABLE_DISPLAY_JSON));
	} else if(type == TYPE.VARIABLEUNIT){
		var variable = new VariableUnitObject();
		return jsonData ? variable.fromJSON(jsonData) : variable.fromJSON(JSON.parse(VARIABLE_UNIT_DISPLAY_JSON)); 
	} else if(type == TYPE.VARIABLEDATA) {
		var variable = new VariableDataObject();
		return jsonData ? variable.fromJSON(jsonData) : variable.fromJSON(JSON.parse(VARIABLE_DATA_DISPLAY_JSON)); 
	} else if(type == TYPE.VARIABLEHTML) {
		var variable = new VariableHTMLObject();
		return jsonData ? variable.fromJSON(jsonData) : variable.fromJSON(JSON.parse(VARIABLE_HTML_DISPLAY_JSON)); 
	} else {
		console.log("Can't create variable from " + type);
	}
}

function createPositionalItem(jsonData){
	var positionalObject = new PositionalObject();
	return jsonData ? positionalObject.fromJSON(jsonData) : positionalObject.fromJSON(JSON.parse(POSITIONAL_DISPLAY_JSON)); 
}

function createSectionItem(jsonData){
	var sectionItem = new SectionObject();
	return jsonData ? sectionItem.fromJSON(jsonData) : sectionItem.fromJSON(JSON.parse(SECTION_DISPLAY_JSON)); 
}

function createCycleItem(jsonData){
	var cycleItem = new CycleObject();
	return jsonData ? cycleItem.fromJSON(jsonData) : cycleItem.fromJSON(JSON.parse(CYCLE_DISPLAY_JSON)); 
}

function createLabel(jsonData){
	var label = new LabelObject();
	return jsonData ? label.fromJSON(jsonData) : label.fromJSON(JSON.parse(LABEL_DISPLAY_JSON));
}

/*
	Item Objects to be instantiated ONLY! (i.e new WidgetObject())
*/

function WidgetObject() {
	this.type = TYPE.WIDGET;
	this.name = "";
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		title  : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		serviceURL : "", 
		title : "",
		urlType : ""
	};
	this.children = [];
	this.update = function(){
		for(var item of this.children){
		    item.update();
		}
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			name : "",
			dom : {  //specific to a variable but the api will be the same on all items
				base : "",
				title  : ""
			},
			json : { // set these (optional keys that only apply to this type of variable)
				serviceURL : "", 
				title : "",
				urlType : ""
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
		toJSON.json.urlType = this.json.urlType;
		toJSON.name = this.name;
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
		this.name = jsonData.name;
		this.json.title = jsonData.json.title;
		this.json.serviceURL = jsonData.json.serviceURL;
		this.json.urlType = jsonData.json.urlType;

		
		var children = jsonData.children;
		for(var i=0; i<children.length;i++){
			this.appendItem(createItem(children[i].type, children[i]));
		}

		return this;
	};
	this.appendItem = function (itemToAdd) {
		this.children.push(itemToAdd); // add to children list
		this.dom.base.appendChild(itemToAdd.dom.base); // append there dom content to the widgets
	};

	this.removeItem = function (itemToRemoveDomBase) {
		for(var i=0; i < this.children.length; i++){
			if(this.children[i].dom.base === itemToRemoveDomBase){
        		this.dom.base.removeChild(this.children[i].dom.base);
        		this.children = this.children.filter(e => e !== this.children[i]);
        		return true;
			}
			if(this.children[i].type == TYPE.SECTION){ // check sections
				var wasRemoved = this.children[i].removeItem(itemToRemoveDomBase);
				if(wasRemoved) return true;
			}
			if(this.children[i].type == TYPE.CYCLE){ // check cyclers
				var wasRemoved = this.children[i].removeItem(itemToRemoveDomBase);
				if(wasRemoved) return true;
			}
		}
		return false; 
	};
	return this;
}

function CycleObject() {
	var self = this;
	self.type = TYPE.CYCLE;
	self.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
	};
	self.json = { // set these (optional keys that only apply to self type of variable)
		serviceURL : "", // required to cycle standard variables
		urlType : "",
		displayIndex : 0, // what child are we showing
		cycleTime : 60000 // default every min
	};
	self.children = [];
	self.interval = undefined;
	self.update = function(){
		console.log("Updating Cycler");
		for(var item of self.children) item.update();
		// on update cycle to next widget
		if(self.dom.base.children.length > 0){
			self.dom.base.removeChild(self.dom.base.children[0]); //remove the currently displayed item
		}
		// show new one
		self.dom.base.appendChild(self.children[self.json.displayIndex].dom.base);

		self.json.displayIndex++;// increase displayIndex
		self.json.displayIndex = self.json.displayIndex >= self.children.length ? 0 : self.json.displayIndex;
	};
	self.toJSON = function() {
		var toJSON =  {
			type : self.type,
			dom : {  //specific to a variable but the api will be the same on all items
				base : ""
			},
			json : { // set these (optional keys that only apply to self type of variable)
				serviceURL : "", 
				urlType : "",
				cycleTime : 60000
			} ,
			children : [],
		}
		toJSON.dom.base = dom2json(self.dom.base);
		var children = [];
		var jsonVars = self.children; // As we store a reference to the child as object we just call there toJSON function
		for(var i=0; i<jsonVars.length; i++){
			children.push(jsonVars[i].toJSON());
		}
		
		toJSON.json.serviceURL = self.json.serviceURL;
		toJSON.json.urlType = self.json.urlType;
		toJSON.json.cycleTime = self.json.cycleTime;
		toJSON.children = children;
		return toJSON;
	};
	self.fromJSON = function(jsonData) {
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);

		self.dom.base = base;
		self.type = jsonData.type;
		self.json.serviceURL = jsonData.json.serviceURL;
		self.json.urlType = jsonData.json.urlType;
		self.json.cycleTime = jsonData.json.cycleTime;
		self.json.displayIndex = 0;

		var children = jsonData.children;
		for(var i=0; i<children.length;i++){
			self.appendItem(createItem(children[i].type, children[i]));
		}
		return self;
	};
	self.appendItem = function (itemToAdd) {
		self.children.push(itemToAdd); // add to children list
		if(self.dom.base.children.length > 0){
			self.dom.base.removeChild(self.dom.base.children[0]); //remove the currently displayed item
		}
		self.dom.base.appendChild(itemToAdd.dom.base); // append the new items dom content
	};
	self.removeItem = function (itemToRemoveDomBase) {
		for(var i=0; i < self.children.length; i++){
			if(self.children[i].dom.base === itemToRemoveDomBase){
        		self.dom.base.removeChild(self.children[i].dom.base);
        		self.children = self.children.filter(e => e !== self.children[i]);
        		return true;
			}
		}
		return false; 
	};
	self.toggleInterval = function (toggle){
		if(toggle){
			if(!self.interval){
				self.interval = setInterval(self.update, self.json.cycleTime);
			}
		} else {
			clearInterval(self.interval);
			self.interval = undefined;
		}
	};
	return self;
};

function SectionObject() {
	this.type = TYPE.SECTION;
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		serviceURL : "", 
		urlType : ""
	};
	this.children = [];
	this.update = function(){
		for(var item of this.children) item.update();
			console.log('Updating section');
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {  //specific to a variable but the api will be the same on all items
				base : ""
			},
			json : { // set these (optional keys that only apply to this type of variable)
				serviceURL : "", 
				urlType : ""
			} ,
			children : [],
		}
		toJSON.dom.base = dom2json(this.dom.base);
		var children = [];
		var jsonVars = this.children; // As we store a reference to the child as object we just call there toJSON function
		for(var i=0; i<jsonVars.length; i++){
			children.push(jsonVars[i].toJSON());
		}
		
		toJSON.json.serviceURL = this.json.serviceURL;
		toJSON.json.urlType = this.json.urlType;
		toJSON.children = children;
		return toJSON;
	};
	this.fromJSON = function(jsonData) {
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);

		this.dom.base = base;
		this.type = jsonData.type;
		this.json.serviceURL = jsonData.json.serviceURL;
		this.json.urlType = jsonData.json.urlType;
		
		var children = jsonData.children;
		for(var i=0; i<children.length;i++){
			this.appendItem(createItem(children[i].type, children[i]));
		}
		return this;
	};
	this.appendItem = function (itemToAdd) {
		this.children.push(itemToAdd); // add to children list
		this.dom.base.appendChild(itemToAdd.dom.base); // append there dom content to the widgets
	};
	this.removeItem = function (itemToRemoveDomBase) {
		for(var i=0; i < this.children.length; i++){
			if(this.children[i].dom.base === itemToRemoveDomBase){
        		this.dom.base.removeChild(this.children[i].dom.base);
        		this.children = this.children.filter(e => e !== this.children[i]);
        		return true;
			}
		}
		return false; 
	};
	return this;
}

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
		value : ""  
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		this.dom.value.textContent = this.json.value;
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
				key : "",
				value : ""
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
		// console.log("Updating "+ this.type + " with text: "+ this.json.text);
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

function VariableUnitObject(){
	this.type = TYPE.VARIABLEUNIT; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		key  : "",
		value : "",
		unit : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		jsonKey : "", 
		key : "", 
		unit : "",
		value : ""
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		this.dom.value.textContent = this.json.value;
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {
				base : "",
				key  : "",
				value : "",
				unit : ""
			},
			json : {
				jsonKey : "",
				key : "",
				unit : "",
				value : ""
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.key = dom2json(this.dom.key);
		toJSON.dom.value = dom2json(this.dom.value);
		toJSON.dom.unit = dom2json(this.dom.unit);

		toJSON.json.jsonKey = this.json.jsonKey;
		toJSON.json.key = this.json.key;
		toJSON.json.unit = this.json.unit;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var key = json2dom(domObjects.key);
		var value = json2dom(domObjects.value);
		var unit = json2dom(domObjects.unit);

		base.appendChild(key);
		base.appendChild(value);
		base.appendChild(unit);

		var domElem = {
			base : base,
			key  : key,
			value : value,
			unit : unit
		}

		this.dom = domElem;
		this.type = jsonData.type;
		this.json.jsonKey = jsonData.json.jsonKey;
		this.json.key = jsonData.json.key;
		this.json.unit = jsonData.json.unit;
		return this;
	};
}


function VariableDataObject(){
	this.type = TYPE.VARIABLEDATA; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		value : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		jsonKey : "",
		value : ""
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		this.dom.value.textContent = this.json.value;
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {
				base : "",
				value : ""
			},
			json : {
				jsonKey : "",
				value : ""
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.value = dom2json(this.dom.value);

		toJSON.json.jsonKey = this.json.jsonKey;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var value = json2dom(domObjects.value);

		base.appendChild(value);
		

		var domElem = {
			base : base,
			value : value
		}

		this.dom = domElem;
		this.type = jsonData.type;
		this.json.jsonKey = jsonData.json.jsonKey;
		return this;
	};
}

function VariableHTMLObject(){
	this.type = TYPE.VARIABLEHTML; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : "",
		value : ""
	};
	this.json = { // set these (optional keys that only apply to this type of variable)
		jsonKey : "",
		value : ""
	};
	this.update = function(){ // then the update function pushes datachnages in the json them into the dom elements
		this.dom.value.innerHTML = this.json.value;
	};
	this.toJSON = function() {
		var toJSON =  {
			type : this.type,
			dom : {
				base : "",
				value : ""
			},
			json : {
				jsonKey : "",
				value : ""
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		toJSON.dom.value = dom2json(this.dom.value);

		toJSON.json.jsonKey = this.json.jsonKey;
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json
		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);
		var value = json2dom(domObjects.value);

		var html = value.textContent;
		value.textContent = "";
		value.innerHTML = html;

		base.appendChild(value);
		

		var domElem = {
			base : base,
			value : value
		}

		this.dom = domElem;
		this.type = jsonData.type;
		this.json.jsonKey = jsonData.json.jsonKey;
		return this;
	};
}

function PositionalObject(){
	this.type = TYPE.POSITIONALOBJECT; // every item must have a type variable
	this.dom = {  //specific to a variable but the api will be the same on all items
		base : ""
	};
	this.json = {
	};
	this.update = function(){ 
	};
	this.toJSON = function() {
		var toJSON =  {
			type : TYPE.POSITIONALOBJECT, // every item must have a type variable
			dom : {  //specific to a variable but the api will be the same on all items
				base : ""
			},
			json : { // set these (optional keys that only apply to this type of variable) 
			}
		}
		toJSON.dom.base = dom2json(this.dom.base);
		return toJSON;
	};
	this.fromJSON = function(jsonData) { // load into this object
		// reconstruct from json

		var domObjects = jsonData.dom;
		var base = json2dom(domObjects.base);

		var domElem = {
			base : base,
		}
		this.dom = domElem;
		this.type = jsonData.type;

		return this;
	};
}

/*
	Helper functions for converting to and from json and dom elements
*/

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
		content : domElement.childNodes.length > 0 ? (domElement.childNodes[0].nodeType == 3 ? domElement.childNodes[0].textContent : "") : "", //makes sure we only get content from that node and not child nodes
		className : domElement.className,
		id : domElement.id ? domElement.id : "", // stops undefined from showing up in the raw json
		draggable : domElement.draggable
	}
}

