(function($, window, document, undefined1) {
	'use strict';

    Ext.require([
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.ModelManager'
    ]);

	// Set once data has loaded.
	var dataHasLoaded;

	var gridDataStore = Ext.create('Ext.data.Store', {
		storeId: 'gridDataStore',
		fields: [{
			name: 'actions',
			type: 'string'
		}, {
			name: 'receiverInfo',
			type: 'string'
		}, {
			name: 'paymentAmount',
			type: 'number'
		}, {
			name: 'country',
			type: 'string'
		}, {
			name: 'paymentDetails',
			type: 'string'
		}],
		proxy: {
			type: 'ajax',
			url: window.relativePath + 'json/create_payment_grid.json',
			reader: {
				type: 'json',
				root: 'items'
			},
			autoLoad: true
		}
	});

	//===================
	// Render the widget.
	//===================

	function render(width) {
		var EXT_ELEMENT = Ext.getElementById('ft-create-payment-form');

		// Set the dimensions.
		var ELEMENT_WIDTH = width;

		//================
		// HTML fragments.
		//================

		var _htmlTemplate1 = $('#_htmlTemplate1').html();
		_htmlTemplate1 = $.trim(_htmlTemplate1).replace(/\s+/g, ' ');

		var _htmlTemplate2 = $('#_htmlTemplate2').html();
		_htmlTemplate2 = $.trim(_htmlTemplate2).replace(/\s+/g, ' ');

		var _htmlTemplate3 = $('#_htmlTemplate3').html();
		_htmlTemplate3 = $.trim(_htmlTemplate3).replace(/\s+/g, ' ');

		var _htmlTemplate4 = $('#_htmlTemplate4').html();
		_htmlTemplate4 = $.trim(_htmlTemplate4).replace(/\s+/g, ' ');

		var _htmlTemplate5 = $('#_htmlTemplate5').html();
		_htmlTemplate5 = $.trim(_htmlTemplate5).replace(/\s+/g, ' ');

		//================
		// Build the view.
		//================

		// Top form panel.
		var formPanel = Ext.create('Ext.form.Panel', {
			frame: true,
			header: false,
			height: 156,
			bodyPadding: 0,
			bodyCls: 'ft-create-payment-form-top',
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 100,
				anchor: '100%'
			},
			items: [{
				xtype: 'textfield',
				name: 'effective_date',
				fieldLabel: 'Effective Date: (same for all transactions)',
				value: 'MM-DD-YYYY'
			}, {
				xtype: 'combo',
				fieldLabel: 'Prenote: *',
				store: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
				allowBlank: true,
				value: 'Item 1',
				editable: false,
				forceSelection: true
			}]
		});

		// Bottom form panel.
		var bottomFormPanel = Ext.create('Ext.form.Panel', {
			frame: false,
			header: false,
			bodyPadding: 10,
			bodyCls: 'ft-create-payment-form-bottom',
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 100,
				anchor: '100%'
			},
			layout: 'hbox',
			items: [{
				xtype: 'textareafield',
				name: 'internal_notes',
				flex: 4,
				height: 170,
				fieldLabel: 'Internal Notes:',
				value: '',
				cls: 'ft-internal-notes-textfield'
			}, {
				xtype: 'textareafield',
				name: 'alert',
				flex: 2,
				height: 170,
				fieldLabel: 'Alert:',
				value: '',
				cls: 'ft-alert-textfield'
			}]
		});

		// Checkbox model for grid.
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			listeners: {},
			getHeaderConfig: function() {
				var me = this,
				showCheck = false;
				return {
					isCheckerHd: showCheck,
					text: 'Send',
					width: 38,
					sortable: true,
					draggable: false,
					resizable: false,
					hideable: false,
					menuDisabled: true,
					dataIndex: '',
					cls: showCheck ? Ext.baseCSSPrefix + 'column-header-checkbox ' : '',
					renderer: Ext.Function.bind(me.renderer, me),
					//me.renderEmpty : renders a blank header over a check box column
					editRenderer: me.editRenderer || me.renderEmpty,
					locked: me.hasLockedHeader()
				};
			}
		});

		var s = Ext.data.StoreManager.lookup('gridDataStore');

		// Data grid.
		var dataGrid = Ext.create('Ext.grid.Panel', {
			header: false,
			bodyCls: 'ft-create-payment-grid',
			store: 'gridDataStore',
			features: [
				{
					ftype: 'summary',
					dock: 'bottom'
				}
			],
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 2
				})
			],
			columns: [
				{
					text: 'Receiver Info',
					dataIndex: 'receiverInfo',
					autoSizeColumn: true,
					menuDisabled: true,
					flex: 1,
					summaryRenderer: function() {
						return '<span class="ft-bold-font">'+ s.totalCount + ' Total Receivers</span>';
					}
				},
				{
					text: '',
					dataIndex: 'actions',
					width:30,
					flex: 0
				},
				{
					text: 'Payment Amount',
					dataIndex: 'paymentAmount',
					autoSizeColumn: true,
					menuDisabled: true,
					flex: 1,
					align: 'right',
					editor: {
						xtype: 'textfield',
						allowBlank: true
					},
					renderer: Ext.util.Format.usMoney,
					summaryRenderer: function() {
						return '<span class="ft-bold-font ft-margin-r">' + Ext.util.Format.usMoney(s.sum('paymentAmount')) + '</span>';
					}
				},
				{
					text: '',
					dataIndex: 'country',
					menuDisabled: true,
					width: 60,
					align: 'center',
					flex: 0,
					summaryRenderer: function() {
						return '<span class="ft-bold-font ft-summary-currency">USD</span>';
					}
				},
				{
					text: 'Payment Details',
					dataIndex: 'paymentDetails',
					autoSizeColumn: true,
					menuDisabled: true,
					flex: 1,
					editor: {
						xtype: 'textfield',
						allowBlank: true
					},
					summaryRenderer: function() {
						return '<span class="ft-bold-font">Total Payment</span>';
					}
				}
			],
			height: 320,
			selModel: selModel
		});

		Ext.create('Ext.panel.Panel', {
			header: false,
			id: 'ft-create-payment',
			width: ELEMENT_WIDTH,
			renderTo: EXT_ELEMENT,
			layout: {
				// Arrange child items vertically.
				type: 'vbox',
				// Each takes up full width.
				align: 'stretch',
				padding: 0
			},
			items: [
				{
					xtype: 'container',
					flex: 0,
					height: 50,
					layout: {
						padding: 0,
						type: 'hbox'
					},
					items: [
						{
							xtype: 'panel',
							html: _htmlTemplate1,
							width: '100%',
							height: 50
						}
					]
				},
				{
					xtype: 'container',
					height: 156,
					layout: {
						padding: '20 20 20 20',
						align: 'fit',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'panel',
							flex: 2,
							height: 160,
							header: false,
							items: [
								formPanel
							]
						},
						{
							xtype: 'panel',
							flex: 2,
							height: 160,
							padding: '0 20 0 20',
							header: false,
							items: [
								{
									xtype: 'displayfield',
									value: _htmlTemplate2
								}
							]
						},
						{
							xtype: 'panel',
							flex: 2,
							height: 160,
							header: false,
							items: [
								{
									xtype: 'displayfield',
									value: _htmlTemplate3
								}
							]
						}
					]
				},
				{
					xtype: 'container',
					height: 340,
					layout: {
						padding: '10 0 10 0',
						align: 'fit',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'panel',
							flex: 6,
							header: false,
							items: [
								dataGrid
							]
						}
					]
				},
				{
					xtype: 'container',
					flex: 6,
					height: 35,
					layout: {
						padding: '10 0 0 0',
						align: 'fit',
						type: 'fit'
					},
					items: [
						{
							xtype: 'panel',
							html: _htmlTemplate4
						}
					]
				},
				{
					xtype: 'container',
					flex: 6,
					height: 180,
					layout: {
						padding: '10 0 10 0',
						type: 'hbox'
					},
					items: [
						{
							xtype: 'panel',
							flex: 6,
							header: false,
							items: [
								bottomFormPanel
							]
						}
					]
				},
				{
					xtype: 'container',
					flex: 0,
					height: 50,
					layout: {
						padding: '10 0 10 0',
						type: 'fit'
					},
					items: [
						{
							xtype: 'panel',
							html: _htmlTemplate5,
							height: 90
						}
					]
				}
			]
		});
	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function(e, width) {
		if (dataHasLoaded) {
			render(width);
		}
		else {
			gridDataStore.load(function() {
				dataHasLoaded = true;
				render(width);
			});
		}
	});

// Params: jQuery, window, document.
})(jQuery, this, this.document);
