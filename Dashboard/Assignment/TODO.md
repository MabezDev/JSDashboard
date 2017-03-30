TODO

[Major]
	- Implement last updated time to widget, with dom display
	- Implement a trashcan to remove widgets and items in the builder - [SEMI] - functionality for the builder is there but looks like crap
	- Display Saved widgets in a preview gallery type deal - [DONE]
	- Implement a way to save widgets to the server - [DONE] - need to either check if the filename exists or just save a random name if we can get the view running nicely
	- add img item
	- set Update intervals - [SEMI] - global interval set not widget specific
	- add clock to top bar
	- cycler item - cycle throw multple data's
	- to make a cycler we will need a container type first that can store items (base it off the widget just change css) - possible container colour #4d6b75
	- add edit this widget button in widget manager, pull into widget builder for editing
	- instead of cycler, give dash board ability to swap widgets with an interval
	- must validate all text boxes to do with name to not include things that will break filnames i.e / . etc
	- add button to set service URL to current item
	- add fade in effect for new dashboard?
	- [Major!] - right click context menu to delete widgets, edit (bring into builder) -done
	- make trash can look good!
	- add red border arround serction/widget if it has no service URL set
	- stop interval on cycler after removal
	- add saved timeout on layout saver like widget saver

	Bugs
		- setting cycle time removes all dom children?
		- can't remove things if we choose to edit from dashboard


[Minor]
	- Implement the account creation etc if we have time
	- Add manual update button on each widget

- [Adding a Display item]
	- Create model in factory.js
	- Create the JSON for it and store it in /json/localjson.js
	- Add it as a display item in ToggleBuilder() - builder.js
	- Check no special treatment is required in dragndrop, if it is required, see builderDrop(), addItemHandlers() and add
	- Finally check any finalization changes need to be made, i.e extra css added / removed


- Possible colour Scheme - http://paletton.com/#uid=13p0u0kllllpdb4nhgdjpqthtvB

- Poole, GB weathe api
 https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22poole%2C%20uk%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

- bbc news rss feed : http://feeds.bbci.co.uk/news/world/europe/rss.xml
- metacritic pc game review rss feed : http://www.metacritic.com/rss/games/pc

- tech radar gaming rss : http://www.techradar.com/rss/news/gaming

- reddit - https://www.reddit.com/r/overwatch/.rss - fixed, using new parser