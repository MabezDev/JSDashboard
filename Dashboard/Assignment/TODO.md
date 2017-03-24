TODO

[Major]
	- Implement last updated time to widget, with dom display
	- Implement a trashcan to remove widgets and items in the builder - [SEMI] - functionality for the builder is there but looks like crap
	- Display Saved widgets in a preview gallery type deal
	- Implement a way to save widgets to the server - [DONE] - need to either check if the filename exists or just save a random name if we can get the view running nicely
	- add img item
	- add html item (display a small amouint of html as a variable (set innerHTML to content)) - [BROKEN] - NEEDS FIXING!
	- set Update intervals - [SEMI] - global interval set not widget specific
	- add clock to top bar
	- spacer item (purely dom (probs a span block with css width options)) - Nice idea but doesnt really work very well, need absolute controll over positioning tbh
	- Make it look good! (WIP)
	- Use iframe to link to github read me to show users how to use the dash
	- on mouse down dragging widget from widget manager, set widget display to none, and place into dashboard via drag and drop ( ondrop = dashboard drop handler) - done - nice to add a transition effect though

	Bugs
		- fix validation of serviceURL, it keeps taking the default value of URL here
		- if we send exactly 9 widgets but there are no more, we will be able to change page but not laod data - widgetmanager.js


[Minor]
	- Implement the account creation etc if we have time


- Possible colour Scheme - http://paletton.com/#uid=13p0u0kllllpdb4nhgdjpqthtvB

- Poole, GB weathe api
 https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22poole%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

- bbc news rss feed : http://feeds.bbci.co.uk/news/world/europe/rss.xml
- metacritic pc game review rss feed : http://www.metacritic.com/rss/games/pc

- tech radar gaming rss : http://www.techradar.com/rss/news/gaming

- reddit - https://www.reddit.com/r/overwatch/.rss - fixed, using new parser