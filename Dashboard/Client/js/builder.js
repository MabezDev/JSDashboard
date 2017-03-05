

function testService(){
	var serviceUrl = document.getElementById('service_url').value;
	var outputBox = document.getElementById('service_output');
	var xhr = new XMLHttpRequest();

	var url = "/api/data/custom/test?url=" + encodeURIComponent(serviceUrl);

	console.log(url);  

	xhr.open("GET", url);
	xhr.onload = function() {
	    if (xhr.status === 200){
			outputBox.value = "<pre><code>" + this.responseText + "</pre></code>";
			// outputBox.innerHTML = "<pre><code>" + this.responseText + "</pre></code>";
	    } else{
			console.log(xhr.status);
	    }
 	};

	xhr.send();
}