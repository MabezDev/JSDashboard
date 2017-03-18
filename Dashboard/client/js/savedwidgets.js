

function toggleSavedWidgetLoader(){
	var panel = document.getElementById('saved_widgets');
  	panel.style.display = panel.style.display == 'block' ? 'none' : 'block';

}

function listSaved() {
	var output = document.getElementById('saved_widgets_output');
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

function saveWidget(){

}