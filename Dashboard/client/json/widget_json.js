var WIDGET_RAW_JSON = '{\
	"type": "WIDGET",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "widget",\
			"id": "77",\
			"draggable": true\
		},\
		"title": {\
			"tag": "P",\
			"content": "title",\
			"className": "widget_child_elements",\
			"id": "",\
			"draggable": false\
		}\
	},\
	"json": {\
		"serviceURL": "",\
		"title": ""\
	},\
	"children": [\
		{\
			"type": "VARIABLE",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "widget_child_elements",\
					"id": "variable",\
					"draggable": false\
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
		}\
	]\
}';

var LABEL_RAW_JSON = '{"type":"LABEL","dom":{"base":{"tag":"DIV","content":"","className":"widget_child_elements","id":"undefined","draggable":true},"text":{"tag":"H2","content":"Label","className":"widget_child_elements variable","id":"","draggable":false}},"json":{"text":"Label"}}';

var VARIABLE_DISPLAY_JSON = '{\
			"type": "VARIABLE",\
			"dom": {\
				"base": {\
					"tag": "DIV",\
					"content": "",\
					"className": "",\
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
			"tag": "P",\
			"content": "Click here to set title",\
			"className": "",\
			"id": "wip_widget_title",\
			"draggable": false\
		}\
	},\
	"json": {\
		"serviceURL": "",\
		"title": "Click here to set title"\
	},\
	"children": []\
	}';


var LABEL_DISPLAY_JSON = '{\
	"type": "LABEL",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "",\
			"id": "label_display",\
			"draggable": true\
		},\
		"text": {\
			"tag": "H2",\
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

// json for a label inside a widget on the dash
var LABEL_JSON = '{\
	"type": "LABEL",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "",\
			"className": "widget_child_elements",\
			"id": "undefined",\
			"draggable": false\
		},\
		"text": {\
			"tag": "H2",\
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