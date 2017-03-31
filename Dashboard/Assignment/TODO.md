TODO

[Major]
	- add img item
	- add clock to top bar - http://davidayala.eu/current-time/
	- must validate all text boxes to do with name to not include things that will break filnames i.e / . etc
	- add saved timeout on layout saver like widget saver
	- add some prebuilt widgets to show off all features

	Bugs
		- setting cycle time removes all dom children?
		- can't remove things if we choose to edit from dashboard


[Minor]
	- Add manual update button on each widget
	- add fade in effect for new dashboard?
	- delete layout button


- [Adding a Display item]
	- Create model in factory.js
	- Create the JSON for it and store it in /json/localjson.js
	- Add it as a display item in ToggleBuilder() - builder.js
	- Check no special treatment is required in dragndrop, if it is required, see builderDrop(), addItemHandlers() and add
	- Finally check any finalization changes need to be made, i.e extra css added / removed

- Poole, GB weathe api
 https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22poole%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

- bbc news rss feed : http://feeds.bbci.co.uk/news/world/europe/rss.xml
- metacritic pc game review rss feed : http://www.metacritic.com/rss/games/pc

- tech radar gaming rss : http://www.techradar.com/rss/news/gaming

- reddit - https://www.reddit.com/r/overwatch/.rss - fixed, using new parser