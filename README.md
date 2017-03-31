# Mashboard

A dashboard completely customizable to you, aslong as there is a json or rss feed, you can display any data you want in a number of unique ways through a set a prebuilt Items.
  
## How to use
  The main focus of the is dashboard is data customization, most dashboards I have seen limit you to certain services, or some of the more basic ones limit you in terms of widget availability. Letting the user specify there serviceURL(Rss feed or JSON feed) and giving them tools to create there own widgets enables a virtually limitless dashboard.

### Widgets
    
Widgets are the base class as it were for items. Every widget has a title and widgets only require a serviceURL if they contain an item that gets data like HTML Content or Key-Value item. Widgets in the Dashboard can be drag and into empty slots and swapped with another. Currently a widget can only get data from *one* serviceURL, but there solutions below if you want to enable more than one service.

### Items
  Items are configured and added to widgets in the Widget Builder, Blank Items are displayed in the item pallette, to configure one drag it to the Item Builder insert a serviceURL and drag and drop json keys (json dot notation paths) of what data you want to be displayed. Some Items like Labels don't display data from the service, instead there value can be set with a click.

#### Standard Items


#### Special Items
