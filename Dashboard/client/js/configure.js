

function toggleConfigure(){
	var container = document.getElementById(ID.CONFIGURECONTAINER);
  if(container.style.left == "0px"){
    container.style.left = "-200vw";
  } else {
    container.style.left = "0px";
    getLayoutList();
  } 
}

function getLayoutFromServer(name){
  if(!name) return;
  console.log('Requesting layout with id : '+ name);
  var xhr = new XMLHttpRequest();
  var url = '/api/account/layouts/stored/get?name=' + name;

  var isEmpty = true; 
  for(var i = 1; i < 9; i++){
    if(!isSlotFree(ID.WIDGETGRID, i + '')){
      isEmpty = false;
      break;
    }
  }
  if(!isEmpty){
    if(!confirm("Loading a new Dashboard will discard the current one. Do you wish to continue?")) return;
    resetGrid(ID.WIDGETGRID);
  }

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var repsonse = JSON.parse(this.responseText); // raw data
      jsonToLayout(JSON.parse(repsonse.data.layout));
    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
}

function getLayoutList(){
	var xhr = new XMLHttpRequest();
  var url = '/api/account/layouts/stored/list';

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var layoutMetas = JSON.parse(this.responseText); // raw data

      if(layoutMetas.length == 0){
        console.log('No layouts found!'); //TODO make this a message saying to go build some widgets/layouts!
      }
      // now populate list  - ID.LOADLIST
      var layoutList = document.getElementById(ID.LOADLIST);
      layoutList.innerHTML = "";

      for(var layoutMeta of layoutMetas){
        var item = document.createElement('li');
        var contentDiv = document.createElement('div');
        var nameEl = document.createElement('h4');
        var link = document.createElement('a');
        var descriptionEl = document.createElement('p');

        link.textContent = layoutMeta.name;
        link.href = layoutMeta.id;
        link.onclick = function (event) {
          getLayoutFromServer(event.target.pathname.replace('/','')); // remove prefixed slash
          return false; // requied to stop flowwing the link
        }
        nameEl.appendChild(link);
        descriptionEl.textContent = layoutMeta.description;
        contentDiv.appendChild(nameEl);
        contentDiv.appendChild(descriptionEl);
        item.appendChild(contentDiv);


        layoutList.appendChild(item);
      }

    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
}

function saveLayout(){
	var formData = new FormData(document.getElementById(ID.SAVEFORM));
	var name = formData.get('name');
	var description = formData.get('description');
	var layoutData = layoutToJSON();

	if(!name || !description || !layoutData) return false; // return false to stop link following

	var layout = {
		name : name,
		description : description,
		layout : layoutData
	};

	// now save to server

	var xhr = new XMLHttpRequest();
    var url = '/api/account/layouts/stored/save';

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("Layout with name : " + name + " saved successfully!");
        getLayoutList(); //refresh list to show new one added
      } else {
        console.log("XHR failed with code: " + xhr.status);
      }
    };
    xhr.send(JSON.stringify(layout));

  return false; // stops link following
}

function layoutToJSON(){
  var pureJson = [];
  var filledCount = 0;
  var tableRows = document.getElementById(ID.WIDGETGRID).children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      var widget = columns[j].children[0].children[0];
      
      if(isSlotFree(ID.WIDGETGRID, widget.id)){
        pureJson.push({
          type : "HIDDEN"
        });
      } else {
        pureJson.push(getWidgetById(widget.id).toJSON());
        filledCount++;
      }
    }
  }
  if(filledCount > 0)
    return JSON.stringify(pureJson);
  else {
    return; // can't save an empty dashboard
  }
}

function jsonToLayout(jsonArray){
  for(var i=0; i< jsonArray.length; i++){
    var type = jsonArray[i].type;
    if(type == TYPE.WIDGET){
      var widget = createWidget(jsonArray[i]);
      addToDashboard(widget, '' + (i+1)); // add to dash in that slot
    }
  }
}