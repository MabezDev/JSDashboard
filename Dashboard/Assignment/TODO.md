TODO

[Major]
	- Implement a trashcan to remove widgets and items in the builder
	- Implement a way to save widgets to the server
	- set Update intervals
	- Make it look good!


[Minor]
	- Implement the account creation etc if we have time



- Poole, GB weathe api
 https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22poole%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys