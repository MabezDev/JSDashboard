var pageNumber = 1;
var displayWidgetStore = [];
var outOfData = false;

function toggleSavedWidgetLoader(){
	var panel = document.getElementById(ID.SAVED);
  	panel.style.display = panel.style.display == 'block' ? 'none' : 'block';

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
  var displayGrid = document.getElementById(ID.SAVED_GRID);
  var xhr = new XMLHttpRequest();
  var url = '/api/account/widgets/stored/list/content?p=' + pageNumber;

  console.log("Loading page number "+ pageNumber);

  xhr.open('GET', url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var widgets = JSON.parse(this.responseText);
      outOfData = widgets.length < 9;
      displayWidgetStore = [];

      var count = 0;
      var tableRows = displayGrid.children[0].children;
      for(var i=0; i<tableRows.length; i++){
        var columns = tableRows[i].children;
        for(var j=0; j<columns.length; j++){
          columns[j].innerHTML = "";
          if(widgets[count]){
            var widgetFromServer = createWidget(widgets[count]);
            displayWidgetStore.push(widgetFromServer);
            columns[j].appendChild(widgetFromServer.dom.base);
            count++;
          }
        }
      }

    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
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
  if(next){
    if(!outOfData) loadWidgetsIntoManager(++pageNumber);
  } else { // previous page
    if(pageNumber > 1) loadWidgetsIntoManager(--pageNumber);
  }
}

window.onload = function(){
  loadWidgetsIntoManager(pageNumber);
}