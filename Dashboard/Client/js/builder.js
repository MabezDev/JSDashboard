

function testService(){
	var serviceUrl = document.getElementById('service_url').value;
	var outputBox = document.getElementById('service_output');
	var xhr = new XMLHttpRequest();

	var url = "/api/data/custom/test?url=" + encodeURIComponent(serviceUrl);

	console.log(url);  

	xhr.open("GET", url);
	xhr.onload = function() {
	    if (xhr.status === 200){
			outputBox.value = this.responseText;
			var jsonObj = JSON.parse(this.responseText);
			console.log(jsonObj);
			traverse(jsonObj);
			// outputBox.innerHTML = "<pre><code>" + this.responseText + "</pre></code>";
	    } else{
			console.log(xhr.status);
	    }
 	};

	xhr.send();
}

//TODO find a way f accessing specific keys in a way to allow users to pick and choose data
function traverse(o) {
	var keys = [];
    for (i in o) {
        if (!!o[i] && typeof(o[i])=="object") {
            //console.log(i)
            console.log(keys);
            traverse(o[i]);
        }
        keys.push(i);
    }
}      