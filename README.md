# Mashboard

A dashboard completely customizable to you, aslong as there is a json or rss feed, you can display any data you want in a number of unique ways through a set a prebuilt Items.
  
## How to use
  The main focus of the is dashboard is data customization, most dashboards I have seen limit you to certain services, or some of the more basic ones limit you in terms of widget availability. Letting the user specify there serviceURL(RSS feed or JSON feed) and giving them tools to create there own widgets enables a virtually limitless dashboard. Along with the information below I have prepared a short video demostrating the creation of a basic widget and explores some of the functionality of Mashboard. [![Mashboard Demo](http://img.youtube.com/vi/Dg03zkdhdqc/0.jpg)](http://www.youtube.com/watch?v=Dg03zkdhdqc)

### Widgets
    
Widgets are the base container for items. Every widget has a title. Widgets only require a serviceURL if they contain an item that gets data like HTML-Content Item or Key-Value Item. Widgets in the Dashboard can be drag and into empty slots and swapped with another. Currently a widget can only get data from *one* serviceURL, but there solutions below if you want to enable more than one service. If a widget doesn't have a serviceURL it will have a red border, to check its serviceURL just hover the mouse

### Items
  Items are configured and added to widgets in the Widget Builder, Blank Items are displayed in the item pallette, to configure one drag it to the Item Builder insert a serviceURL and drag and drop json keys (json dot notation paths) of what data you want to be displayed. Some Items like Labels don't display data from the service, instead there value can be set with a click.

#### Special Items
Three of the items are a bit different to the rest.
  ##### New Line
Basically a line break, originally this want ment to have variable sizes but it ended up not working out(see [reflection.md](https://github.com/MabezDev/JSDashboard/blob/master/Dashboard/Assignment/Reflection.md)).
##### Section
The Section Item is basically a widget with no title, it follows the same rule about serviceURL (only required if pulling data)
can be used to nest different serviceURL's into a widget (see My Favourite Subreddits in the widget Manager as an example)
##### Cycler
The Cycler is like the Section but rotates the group of Items attacked to at a set interval (See 3 day weather portsmouth after a minute it should switch to a different day).

### Updates
Currently there is no way to set the Update time, this isnt due to a limitation, it just hasn't been implemented yet. The standard update time is 3minutes currently.

