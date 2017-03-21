/*
	This file stores the json data to create template Items for the builder
*/


var BUILDER_WIDGET_JSON = '{\
	"type": "WIDGET",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "widget",\
			"id": "wip_widget",\
			"draggable": true\
		},\
		"title": {\
			"tag": "H3",\
			"content": "Click here to set title",\
			"className": "widget_title widget_title",\
			"id": "wip_widget_title",\
			"draggable": false\
		}\
	},\
	"json": {\
		"serviceURL": "",\
		"title": "Click here to set title",\
		"urlType" : ""\
	},\
	"children": []\
	}';

var VARIABLE_DISPLAY_JSON = '{\
			"type": "VARIABLE",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "item",\
					"id": "variable_display",\
					"draggable": true\
				},\
				"key": {\
					"tag": "P",\
					"content": "Key",\
					"className": "widget_child_elements variable",\
					"id": "",\
					"draggable": false\
				},\
				"value": {\
					"tag": "P",\
					"content": "Value",\
					"className": "widget_child_elements variable",\
					"id": "",\
					"draggable": false\
				}\
			},\
			"json": {\
				"jsonKey": "test",\
				"key": "test2"\
			}\
		}';

var VARIABLE_UNIT_DISPLAY_JSON = '{\
			"type": "VARIABLEWITHUNIT",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "item",\
					"id": "variable_unit_display",\
					"draggable": true\
				},\
				"key": {\
					"tag": "P",\
					"content": "Key",\
					"className": "variable",\
					"id": "",\
					"draggable": false\
				},\
				"value": {\
					"tag": "P",\
					"content": "Value",\
					"className": "widget_child_elements variable",\
					"id": "",\
					"draggable": false\
				},\
				"unit": {\
					"tag": "P",\
					"content": "Unit",\
					"className": "variable",\
					"id": "",\
					"draggable": false\
				}\
			},\
			"json": {\
				"jsonKey": "test",\
				"key": "test2",\
				"unit": "Unit"\
			}\
		}';

var VARIABLE_DATA_DISPLAY_JSON = '{\
			"type": "VARIABLEDATA",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "item",\
					"id": "variable_data_display",\
					"draggable": true\
				},\
				"value": {\
					"tag": "P",\
					"content": "Value",\
					"className": "widget_child_elements variable",\
					"id": "",\
					"draggable": false\
				}\
			},\
			"json": {\
				"jsonKey": ""\
			}\
		}';


var VARIABLE_HTML_DISPLAY_JSON = '{\
			"type": "VARIABLEHTML",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "item",\
					"id": "variable_html_display",\
					"draggable": true\
				},\
				"value": {\
					"tag": "P",\
					"content": "HTML content",\
					"className": "widget_child_elements variable",\
					"id": "",\
					"draggable": false\
				}\
			},\
			"json": {\
				"jsonKey": ""\
			}\
		}';

var LABEL_DISPLAY_JSON = '{\
	"type": "LABEL",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "item",\
			"id": "label_display",\
			"draggable": true\
		},\
		"text": {\
			"tag": "P",\
			"content": "Label",\
			"className": "widget_child_elements variable",\
			"id": "",\
			"draggable": false\
		}\
	},\
	"json": {\
		"text": "Label"\
	}\
}';


var BIG_LABEL_DISPLAY_JSON = '{\
	"type": "LABEL",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "item",\
			"id": "big_label_display",\
			"draggable": true\
		},\
		"text": {\
			"tag": "P",\
			"content": "Big Label",\
			"className": "widget_child_elements variable big_text",\
			"id": "",\
			"draggable": false\
		}\
	},\
	"json": {\
		"text": "Big Label"\
	}\
}';