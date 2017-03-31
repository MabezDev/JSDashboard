

- to write : 
	- mention first draft
	- mention canvas vs dom
	- idea
	- Limitations by choosing dom
	- talk about changing from trying to validate filenames to tags to find it later and generating a filename on the server
	- Talk about not having an account system yet, but possible to implement just not enoiugh time




- How to :
	- Explain all Items briefly
	- How to build widgets
	- Explain the red border around items/widgets without a service URL
	- Give some example sites to scrap data (see todo.md)
	
# Reflection
Overall I am happy with my dashboard but there are few limitations I couldnt overcome due to some of the design choices I made early on. I chose to create all items/widgets using html elements, although this simplified the creation of widgets and items initially later on I lacked absolute control over positionioning, something I would have had if I choose the canvas route.

## What I think went well
The way Objects are stored and the Object structure is fully self contained, thus when It came to save an entire widget I could just call toJSON() on every child object of the widget.

## What could I change to make it better
Although I used some features of ES6 (fat arrow notation <3) Using ES6 Classes would have Shrunk my factory.js file alot by having base classes for items and widgets. Given time (my fault completely) I would have liked to completely remove all tradition xhrs and replace them with fetch on the client and pure promises on the server, I used some promises on the server but cutting out effectivley duplicate code from xhr requests on the client would save so much space and time wasted searching for functions.
