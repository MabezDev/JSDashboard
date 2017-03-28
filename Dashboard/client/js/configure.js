

function toggleConfigure(){
	var container = document.getElementById(ID.CONFIGURECONTAINER);
	container.style.left = container.style.left == '0px' ? '-200vw' : '0px';
}

function layoutToJSON(){
  var pureJson = [];
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
      }
    }
  }
  return JSON.stringify(pureJson);
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