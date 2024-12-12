(function($, window, document, undefined1) {
	'use strict';

	//============
	// Dummy data.
	//============

	Ext.define('Task', {
		extend: 'Ext.data.Model',
		fields: [
			{
				name: 'account_label',
				type: 'string'
			},
			{
				name: 'opening',
				type: 'number'
			},
			{
				name: 'current',
				type: 'number'
			},
			{
				name: 'previous',
				type: 'number'
			}
		]
	});

	var JSON_STORE = Ext.create('Ext.data.TreeStore', {
		model: 'Task',
		proxy: {
			type: 'ajax',
			// The store will get the content from the *.json file.
			url: window.relativePath + 'json/treegrid.json'
		},
		folderSort: true
	});

	//===================
	// Render the widget.
	//===================

	function render(width) {
		var ID = 'ft-row-expander-grid';
		var EXT_ELEMENT = Ext.getElementById(ID);

		// Set the dimensions.
		var ELEMENT_WIDTH = width;
		var ELEMENT_HEIGHT = 400;

		Ext.create('Ext.tree.Panel', {
			title: 'Cash Position',
			width: ELEMENT_WIDTH,
			height: ELEMENT_HEIGHT,
			renderTo: EXT_ELEMENT,
			collapsible: false,
			useArrows: true,
			rootVisible: false,
			store: JSON_STORE,
			multiSelect: true,
			singleExpand: true,
			layout: {
				// Each takes up full width.
				align: 'stretch',
				padding: 0
			},
			cls: 'ft-row-expander-grid-panel-header ft-expand-transition',
			columns: [
				{
					// This is so we know which column will show the tree.
					// xtype: 'treecolumn',

					// The UI doesn't actually have a label for this field.
					text: '',

					flex: 3,
					sortable: true,
					dataIndex: 'account_label',
					autoSizeColumn: true
				},
				{
					text: 'Current',
					flex: 1,
					sortable: true,
					dataIndex: 'current',
					align: 'right',
					autoSizeColumn: true,
					renderer: Ext.util.Format.usMoney
				},
				{
					text: 'Opening',
					flex: 1,
					dataIndex: 'opening',
					align: 'right',
					sortable: true,
					autoSizeColumn: true,
					renderer: Ext.util.Format.usMoney
				},
				{
					text: 'Previous',
					flex: 1,
					dataIndex: 'previous',
					align: 'right',
					sortable: true,
					autoSizeColumn: true,
					renderer: Ext.util.Format.usMoney
				}
			]
		});

	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function(e, width) {
		render(width);
	});

// Params: jQuery, window, document.
})(jQuery, this, this.document);