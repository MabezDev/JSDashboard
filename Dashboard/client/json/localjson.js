/*
	This file stores the json data to create template Items for the builder
*/

var layoutTest = '[{"type":"HIDDEN"},{"type":"HIDDEN"},{"type":"WIDGET","dom":{"base":{"tag":"DIV","content":"","className":"widget","id":"3","draggable":true},"title":{"tag":"H3","content":"/r/Overwatch","className":"widget_title widget_title untargetable","id":"","draggable":false}},"json":{"serviceURL":"https://www.reddit.com/r/overwatch/.rss","title":"/r/Overwatch","urlType":"RSS"},"children":[{"type":"VARIABLE","dom":{"base":{"tag":"DIV","content":"","className":"untargetable","id":"","draggable":false},"key":{"tag":"P","content":"Top : ","className":"untargetable variable","id":"","draggable":false},"value":{"tag":"P","content":"[ALL] Overwatch Patch Notes – March 21, 2017","className":"untargetable variable","id":"","draggable":false}},"json":{"jsonKey":"feed.entries.1.title","key":"Top : ","value":""}}]},{"type":"HIDDEN"},{"type":"WIDGET","dom":{"base":{"tag":"DIV","content":"","className":"widget","id":"5","draggable":true},"title":{"tag":"H3","content":"/r/Overwatch","className":"widget_title widget_title untargetable","id":"","draggable":false}},"json":{"serviceURL":"https://www.reddit.com/r/overwatch/.rss","title":"/r/Overwatch","urlType":"RSS"},"children":[{"type":"VARIABLE","dom":{"base":{"tag":"DIV","content":"","className":"untargetable","id":"","draggable":false},"key":{"tag":"P","content":"Top : ","className":"untargetable variable","id":"","draggable":false},"value":{"tag":"P","content":"[ALL] Overwatch Patch Notes – March 21, 2017","className":"untargetable variable","id":"","draggable":false}},"json":{"jsonKey":"feed.entries.1.title","key":"Top : ","value":""}}]},{"type":"HIDDEN"},{"type":"HIDDEN"},{"type":"HIDDEN"},{"type":"HIDDEN"}]';


var BUILDER_WIDGET_JSON = '{\
	"type": "WIDGET",\
	"name": "",\
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
					"className": "item display_spacing",\
					"id": "variable_display",\
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
					"className": "untargetable variable",\
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
					"className": "item display_spacing",\
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
					"className": "untargetable variable",\
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
					"className": "item display_spacing",\
					"id": "variable_data_display",\
					"draggable": true\
				},\
				"value": {\
					"tag": "P",\
					"content": "Value",\
					"className": "untargetable variable",\
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
					"className": "item display_spacing",\
					"id": "variable_html_display",\
					"draggable": true\
				},\
				"value": {\
					"tag": "DIV",\
					"content": "HTML Content",\
					"className": "untargetable variable display_text",\
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
			"className": "item display_spacing",\
			"id": "label_display",\
			"draggable": true\
		},\
		"text": {\
			"tag": "P",\
			"content": "Label",\
			"className": "untargetable variable",\
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
			"className": "item display_spacing",\
			"id": "big_label_display",\
			"draggable": true\
		},\
		"text": {\
			"tag": "P",\
			"content": "Big Label",\
			"className": "untargetable variable big_text",\
			"id": "",\
			"draggable": false\
		}\
	},\
	"json": {\
		"text": "Big Label"\
	}\
}';

var POSITIONAL_DISPLAY_JSON = '{\
	"type": "POSITIONALOBJECT",\
	"dom": {\
		"base": {\
			"tag": "DIV",\
			"content": "New Line",\
			"className": "item spacer-1 display_spacing display_text",\
			"id": "positional_display",\
			"draggable": true\
		}\
	},\
	"json": {\
	}\
}';