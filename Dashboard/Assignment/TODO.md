TODO

[Major]
	- Implement last updated time to widget, with dom display
	- Implement a trashcan to remove widgets and items in the builder - [SEMI] - functionality for the builder is there but looks like crap
	- Display Saved widgets in a preview gallery type deal - [DONE]
	- Implement a way to save widgets to the server - [DONE] - need to either check if the filename exists or just save a random name if we can get the view running nicely
	- add img item
	- set Update intervals - [SEMI] - global interval set not widget specific
	- add clock to top bar
	- Make it look good! (WIP)
	- Use iframe to link to github read me to show users how to use the dash, use for any external lins actually (html content)
	- Remove naming on save, instead replace with random name generator, then tell users its saved and they can find it in the widget manager
		- Add option to name it?
		- No chance of searching with this options unless we give each widget a name field, that we can optionally set
	- if a widget extends a certain height cut it off, ONLY in the widget manager - [Important] - its cutting off the options
	- implement interface to loading and saving layouts (functionality complete, see index.js)
	- cycler item - cycle throw multple data's
	- to make a cycler we will need a container type first that can store sub widgets (base it off the widget just change css) - possible container colour #4d6b75
	- add edit this widget button in widget manager, pull into widget builder for editing

	Bugs
		- fix validation of serviceURL, it keeps taking the default value of URL here
		- if we send exactly 9 widgets but there are no more, we will be able to change page but not laod data - widgetmanager.js - [Fixed]
		- add html item (display a small amouint of html as a variable (set innerHTML to content)) - [SEMI-FIXED] - works but the background is lost when drag and dropped


[Minor]
	- Implement the account creation etc if we have time
	- Add manual update button on each widget
	
	- on mouse down dragging widget from widget manager, set widget display to none, and place into dashboard via drag and drop ( ondrop = dashboard drop handler) - done - nice to add a transition effect though

	- spacer item (purely dom (probs a span block with css width options)) - Nice idea but doesnt really work very well, need absolute controll over positioning tbh - Might add a new line spacer

- [Adding a Display item]
	- Create model in factory.js
	- Create the JSON for it and store it in /json/localjson.js
	- Add it as a display item in ToggleBuilder() - builder.js
	- Check no special treatment is required in dragndrop, if it is required, see builderDrop()
	- Finally checky any finalization changes need to be made, i.e extra css added / removed


- Possible colour Scheme - http://paletton.com/#uid=13p0u0kllllpdb4nhgdjpqthtvB

- Poole, GB weathe api
 https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22poole%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

- bbc news rss feed : http://feeds.bbci.co.uk/news/world/europe/rss.xml
- metacritic pc game review rss feed : http://www.metacritic.com/rss/games/pc

- tech radar gaming rss : http://www.techradar.com/rss/news/gaming

- reddit - https://www.reddit.com/r/overwatch/.rss - fixed, using new parser