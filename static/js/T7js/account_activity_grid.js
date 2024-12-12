(function($, window, document, undefined1) {
	'use strict';

	Ext.require([
		'Ext.tab.*',
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.util.*',
		'Ext.toolbar.Paging',
		'Ext.ModelManager'
	]);

	var dataHasLoaded;

	// Dummy data.
	var gridDataStore = Ext.create('Ext.data.Store', {
		storeId: 'gridDataStore',
		fields: [{
			name: 'actions',
			type: 'string'
		}, {
			name: 'date',
			type: 'date'
		}, {
			name: 'typeCode',
			type: 'string'
		}, {
			name: 'custRef',
			type: 'string'
		}, {
			name: 'text',
			type: 'string'
		}, {
			name: 'credit',
			type: 'int'
		}, {
			name: 'debit',
			type: 'int'
		}],
		proxy: {
			type: 'ajax',
			url: window.relativePath + 'json/account_activity_all.json',
			reader: {
				type: 'json',
				root: 'items'
			}
		}
	});

	//===================
	// Render the widget.
	//===================

	function render(width) {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			headerWidth: 32
		});

		var s = Ext.data.StoreManager.lookup('gridDataStore');

		var EXT_ELEMENT = Ext.getElementById('ft-main-grid');

		// Set the dimensions.
		var ELEMENT_WIDTH = width;
		var ELEMENT_HEIGHT = 400;

		// Build the UI.
		Ext.create('Ext.grid.Panel', {
			id: 'ft-grid-ft-main-grid',
			store: 'gridDataStore',
			renderTo: EXT_ELEMENT,
			width: ELEMENT_WIDTH,
			height: ELEMENT_HEIGHT,
			scroll: true,
			flex: 6,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columns: [{
				text: 'Actions',
				dataIndex: 'actions',
				autoSizeColumn: true,
				flex: 0.7,
				editor: {
					xtype: 'textfield',
					allowBlank: true
				},
				summaryRenderer: function() {
					return '<span class="ft-bold-font">List Total: (' + s.totalCount + ') </span>';
				}
			}, {
				text: 'Date',
				dataIndex: 'date',
				autoSizeColumn: true,
				flex: 0.7,
				xtype: 'datecolumn',
				format: 'm/d/Y'
			}, {
				text: 'Type Code',
				dataIndex: 'typeCode',
				autoSizeColumn: true,
				flex: 0.7
			}, {
				text: 'Cust Ref',
				dataIndex: 'custRef',
				autoSizeColumn: true,
				flex: 0.7
			}, {
				text: 'Text',
				dataIndex: 'text',
				autoSizeColumn: true,
				flex: 0.7
			}, {
				text: 'Credit',
				dataIndex: 'credit',
				autoSizeColumn: true,
				flex: 1,
				align: 'right',
				renderer: Ext.util.Format.usMoney,
				summaryRenderer: function() {
					return Ext.util.Format.usMoney(s.sum('credit'));
				}
			}, {
				text: 'Debit',
				dataIndex: 'debit',
				align: 'right',
				autoSizeColumn: true,
				flex: 1,
				renderer: Ext.util.Format.usMoney,
				summaryRenderer: function() {
					return Ext.util.Format.usMoney(s.sum('debit'));
				}
			}],
			selModel: selModel,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: Ext.data.StoreManager.lookup('AccountAndActivityAll'),
				dock: 'bottom',
				displayInfo: true,
				items: [{
					xtype: 'tbseparator'
				}, {
					xtype: 'combo',
					id: 'ft-grid-ft-main-grid-toolbar',
					name: 'pagingSize_store_6',
					width: 49,
					store: ['5', '10', '20', '40', '60'],
					allowBlank: true,
					value: '10',
					editable: false,
					forceSelection: true,
					listConfig: {
						baseCls: 'account_activity_pagingtoolbar-combo',
						itemsCls: 'account_activity_pagingtoolbar-combo-items'
					}
				}]
			}]

			// END: Ext.grid.Panel
		});

		// Trigger the tabs.
		$(document).trigger('activityGridRendered');

		// END: render
	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function(e, width) {
		if (dataHasLoaded) {
			render(width);
		} else {
			gridDataStore.load(function() {
				dataHasLoaded = true;
				render(width);
			});
		}
	});

	// Params: jQuery, window, document.
})(jQuery, this, this.document);