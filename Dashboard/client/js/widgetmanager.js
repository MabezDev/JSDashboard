var pageNumber = 1;
var displayWidgetStore = [];
var outOfData = false;

function toggleSavedWidgetLoader(){
	var panel = document.getElementById(ID.SAVED);
  //panel.style.display = panel.style.display == 'block' ? 'none' : 'block';
  //panel.className = panel.className == "saved_display_on" ? "saved_display_off" : "saved_display_on";
  if(panel.style.left == "0px"){
    panel.style.left = "-999em";
  } else {
    panel.style.left = "0px";
    loadWidgetsIntoManager(pageNumber);
  }
  
}

function listSaved() {
	var output = document.getElementById(ID.FILEOUTPUT);
  var xhr = new XMLHttpRequest();
  var url = '/api/account/widgets/stored/list';

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var fileNames = JSON.parse(this.responseText);

      output.innerHTML = "";

      for (var i = 0; i < fileNames.length; i++) {
        var option = document.createElement('option');
        option.textContent = fileNames[i];
        option.ondblclick = loadSavedWidget;

        output.append(option);
      }
    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
}

function loadWidgetsIntoManager(pageNumber){ //9 items on each 'page'
  var xhr = new XMLHttpRequest();
  var url = '/api/account/widgets/stored/list/content?p=' + pageNumber;

  console.log("Loading page number "+ pageNumber);

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      outOfData = false;
      fillDisplay(JSON.parse(this.responseText));
    } else if(xhr.status == 301){
      outOfData = true;
      fillDisplay(JSON.parse(this.responseText));

    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
}

function fillDisplay(widgets){
  var displayGrid = document.getElementById(ID.SAVED_GRID);
  //displayGrid.ondrop = dashboardDrop;

  var count = 0;
  var tableRows = displayGrid.children[0].children;
  for(var i=0; i<tableRows.length; i++){
    var columns = tableRows[i].children;
    for(var j=0; j<columns.length; j++){
      columns[j].children[0].innerHTML = "";
      if(widgets[count]){
        var widgetFromServer = createWidget(widgets[count].data);
        displayWidgetStore.push(widgetFromServer);

        // add drag and drop handlers
        widgetFromServer.dom.base.id = widgets[count].name;

        widgetFromServer.dom.base.ondragstart = widgetManagerDragStart;
        widgetFromServer.dom.base.ondragover = globalDragOver;
        widgetFromServer.dom.base.ondrop = dashboardDrop;
        //widgetFromServer.dom.base.ondragend = dragEndHandler; - TODO cannot drag on to main dashboard like I would like, drops arn't event being triggered
        widgetFromServer.dom.base.ondrag = hideManager;

        columns[j].children[0].appendChild(widgetFromServer.dom.base);
        count++;
      }
    }
  }
}

function addWidgetToDashboardFromManager(domID, targetSlotID){
  for(var widget of displayWidgetStore){
    if(widget.dom.base.id == domID){
      addToDashboard(widget, targetSlotID);
      break;
    }
  }
}

function hideManager(event){
  //console.log(event);
  var panel = document.getElementById(ID.SAVED);
  panel.style.left = "-999em";
}


function loadSavedWidget(event){
  console.log("Loading widget : " + event.target.textContent);

  var fnToLoad = event.target.textContent;

  var xhr = new XMLHttpRequest();
  var url = '/api/account/widgets/stored/get?file='+fnToLoad;

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var widgetJson = JSON.parse(this.responseText);
      var newWidget = createWidget(widgetJson);
      console.log("Imported widget object: ");
      console.log(newWidget);

      addToDashboard(newWidget);

    } else {
      console.log(xhr.status);
    }
  };

  xhr.send();
}

function movePage(next){
  var pageNumberElement = document.getElementById(ID.WIDGETPAGENUMBER);
  if(next){
    console.log(outOfData);
    if(!outOfData) loadWidgetsIntoManager(++pageNumber);
  } else { // previous page
    if(pageNumber > 1) loadWidgetsIntoManager(--pageNumber);
  }
  pageNumberElement.textContent = pageNumber;
}