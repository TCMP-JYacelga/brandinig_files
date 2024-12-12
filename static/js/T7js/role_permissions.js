(function($, window, document, undefined1) {
	'use strict';

	var options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

	var tools = [{
		xtype: 'combo',
		editable: false,
		store: options,
		value: 'Option 1',
		margin: '0 20 0 0',
		flex: 0.5
	}, {
		xtype: 'combo',
		editable: false,
		store: options,
		value: 'Option 1',
		margin: '0 25 0 25',
		flex: 0.5
	}, {
		xtype: 'combo',
		editable: false,
		store: options,
		value: 'Option 1',
		margin: '0 10 0 10',
		flex: 0.5
	}];

	var items = [{
		xtype: 'checkboxgroup',
		columns: 1,
		vertical: true,
		items: [{
			boxLabel: 'Payroll - Hourly Clerks',
			name: 'rb',
			inputValue: '1'
		}, {
			boxLabel: 'Payroll - Salaried',
			name: 'rb',
			inputValue: '2'
		}, {
			boxLabel: 'Payroll - Seasonal',
			name: 'rb',
			inputValue: '3'
		}, {
			boxLabel: 'Payroll - Warehouse',
			name: 'rb',
			inputValue: '4'
		}, {
			boxLabel: 'Payroll - Weekly Staff',
			name: 'rb',
			inputValue: '5'
		}]
	}];

	function render(width) {
		var EXT_ELEMENT = Ext.getElementById('ft-role-permissions');

		// Set the dimensions.
		var ELEMENT_WIDTH = width;

		// Button row.
		var buttonRow = $('#_buttonRow').html();
		buttonRow = $.trim(buttonRow).replace(/\s+/g, ' ');

		// Build the UI.
		var paymentsTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			defaults: {
				bodyStyle: 'background-color:#F9F9F9!important;padding:0px;'
			},
			items: [{
				xtype: 'checkboxgroup',
				columns: 1,
				vertical: false,
				items: [{
					boxLabel: '(CHECK/UNCHECK ALL)',
					name: 'rb',
					inputValue: '1'
				}, {
					boxLabel: 'Payroll - Hourly Clerks',
					name: 'rb',
					inputValue: '2'
				}, {
					boxLabel: 'Payroll - Salaried',
					name: 'rb',
					inputValue: '3'
				}, {
					boxLabel: 'Payroll - Seasonal',
					name: 'rb',
					inputValue: '4'
				}, {
					boxLabel: 'Payroll - Warehouse',
					name: 'rb',
					inputValue: '5'
				}, {
					boxLabel: 'Payroll - Weekly Staff',
					name: 'rb',
					inputValue: '6'
				}]
			}]
		});

		var alertsTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			items: items
		});

		var templatesTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			items: items
		});

		// row 1 right column
		var accountsTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			items: [{
				xtype: 'checkboxgroup',
				columns: 1,
				vertical: true,
				items: [{
					boxLabel: '(CHECK/UNCHECK ALL)',
					name: 'rb',
					inputValue: '1'
				}, {
					boxLabel: '12345678',
					name: 'rb',
					inputValue: '2'
				}, {
					boxLabel: '12345679',
					name: 'rb',
					inputValue: '3'
				}, {
					boxLabel: '12345680',
					name: 'rb',
					inputValue: '4'
				}, {
					boxLabel: '12345678',
					name: 'rb',
					inputValue: '5'
				}, {
					boxLabel: '12345679',
					name: 'rb',
					inputValue: '6'
				}, {
					boxLabel: '12345680',
					name: 'rb',
					inputValue: '7'
				}, {
					boxLabel: '12345678',
					name: 'rb',
					inputValue: '8'
				}]
			}]
		});

		var accountBalancesTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			items: items
		});

		var transactionsTypeCheckboxGroup = Ext.create('Ext.form.Panel', {
			flex: 6,
			items: items
		});

		Ext.create('Ext.data.Store', {
			storeId: 'ft-role-permissions-store',
			fields: ['name', 'email', 'phone'],
			data: {
				'items': [{
					'name': '',
					'view': 'hello',
					'create_edit': '',
					'authorize': ''
				}, {
					'name': 'File Upload',
					'view': '',
					'create_edit': '',
					'authorize': ''
				}, {
					'name': 'File Download',
					'view': '',
					'create_edit': '',
					'authorize': ''
				}, {
					'name': 'ACH Pass Through',
					'view': '',
					'create_edit': '',
					'authorize': ''
				}, {
					'name': 'Positive Pay Pass Through',
					'view': '',
					'create_edit': '',
					'authorize': ''
				}]
			},
			proxy: {
				type: 'memory',
				reader: {
					type: 'json',
					root: 'items'
				}
			}
		});

		var bottomGrid1 = Ext.create('Ext.grid.Panel', {
			header: false,
			store: Ext.data.StoreManager.lookup('ft-role-permissions-store'),
			hideHeaders: true,
			columns: [{
				text: 'Name',
				dataIndex: 'name',
				flex: 2.5
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'view',
				flex: 1.6,
				boxLabel: 'Anchovies'
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'create_edit',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'authorize',
				flex: 1.6
			}]
		});

		var bottomGrid2 = Ext.create('Ext.grid.Panel', {
			header: false,
			store: Ext.data.StoreManager.lookup('ft-role-permissions-store'),
			hideHeaders: true,
			columns: [{
				text: 'Name',
				dataIndex: 'name',
				flex: 2.5
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'viewChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				header: '',
				dataIndex: 'createChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'authorizeChecked',
				flex: 1.6
			}]
		});

		var bottomGrid3 = Ext.create('Ext.grid.Panel', {
			header: false,
			store: Ext.data.StoreManager.lookup('ft-role-permissions-store'),
			hideHeaders: true,
			columns: [{
				text: 'Name',
				dataIndex: 'name',
				flex: 2.5
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'viewChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				header: '',
				dataIndex: 'createChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'authorizeChecked',
				flex: 1.6
			}]
		});

		var bottomGrid4 = Ext.create('Ext.grid.Panel', {
			header: false,
			store: Ext.data.StoreManager.lookup('ft-role-permissions-store'),
			hideHeaders: true,
			columns: [{
				text: 'Name',
				dataIndex: 'name',
				flex: 2.5
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'viewChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				header: '',
				dataIndex: 'createChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'authorizeChecked',
				flex: 1.6
			}]
		});

		Ext.create('Ext.grid.Panel', {
			header: false,
			store: Ext.data.StoreManager.lookup('ft-role-permissions-store'),
			hideHeaders: true,
			columns: [{
				text: 'Name',
				dataIndex: 'name',
				flex: 2.5
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'viewChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				header: '',
				dataIndex: 'createChecked',
				flex: 1.6
			}, {
				xtype: 'checkcolumn',
				dataIndex: 'authorizeChecked',
				flex: 1.6
			}]
		});


		var filterShowing = false;
		var filterBtn = Ext.create('Ext.Button', {
			xtype: 'button',
			text: '',
			id: 'dummyBtn',
			icon: window.relativePath + 'images/funnel-off.png',
			handler: function() {
				if (filterShowing === false) {
					filterPanel.show();
					filterShowing = true;
				} else {
					filterPanel.hide();
					filterShowing = false;
				}
			}
		});

		/* Form Panel */
		var filterPanel = Ext.create('Ext.form.Panel', {
			frame: false,
			header: false,
			id: 'filterPanel',
			width: 360,
			height: 95,
			floating: true,
			y: -105,
			bodyPadding: 0,
			layout: 'hbox',
			bodyCls: 'ft-role-permissions-filter-form',
			fieldDefaults: {
				labelAlign: 'top',
				labelWidth: 100
			},
			items: [{
				xtype: 'combo',
				editable: false,
				fieldLabel: 'Group by:',
				store: ['My Groups 1', 'My Groups 2', 'My Groups 3', 'My Groups 4', 'My Groups 5'],
				allowBlank: true,
				value: 'My Groups 1',
				forceSelection: true,
				flex: 2,
				margin: 10
			}, {
				xtype: 'combo',
				editable: false,
				fieldLabel: 'Group:',
				store: ['My Groups 1', 'My Groups 2', 'My Groups 3', 'My Groups 4', 'My Groups 5'],
				allowBlank: true,
				value: 'My Groups 1',
				forceSelection: true,
				flex: 2,
				margin: 10
			}, {
				xtype: 'textfield',
				name: 'effective_date',
				fieldLabel: 'Search',
				flex: 2,
				margin: 10
			}]
		});

		var leftColumn = Ext.create('Ext.panel.Panel', {
			height: 300,
			defaults: {
				bodyStyle: 'padding:0px;margin:20px;'
			},
			layout: {
				type: 'accordion',
				titleCollapse: false
			},
			items: [{
				title: 'Payment Types (20): All',
				items: [
					paymentsTypeCheckboxGroup
				],
				tools: [{
						xtype: 'combo',
						editable: false,
						width: 136,
						store: options,
						value: 'Option 1',
						margin: '0, 10, 0, 0'
					},
					filterBtn,
					filterPanel
				],
				margin: '0, 0, 10, 0'
			}, {
				title: 'Alerts (4): All',
				items: [
					alertsTypeCheckboxGroup
				],
				tools: [{
					xtype: 'combo',
					editable: false,
					width: 136,
					store: options,
					value: 'Option 1'
				}],
				margin: '0, 0, 10, 0'
			}, {
				title: 'Templates (26)',
				items: [
					templatesTypeCheckboxGroup
				],
				tools: [{
					xtype: 'combo',
					editable: false,
					width: 136,
					store: options,
					value: 'Option 1'
				}],
				margin: '0, 0, 10, 0'
			}]
		});

		var rightColumn = Ext.create('Ext.panel.Panel', {
			height: 300,
			defaults: {
				bodyStyle: 'padding:0px;margin:20px;'
			},
			layout: {
				type: 'accordion',
				titleCollapse: false
			},
			items: [{
				title: 'Accounts (2000)',
				items: [
					accountsTypeCheckboxGroup
				],
				tools: [{
					xtype: 'combo',
					editable: false,
					width: 136,
					store: options,
					value: 'Option 1'
				}],
				margin: '0, 0, 10, 0'
			}, {
				title: 'Account Balances',
				items: [
					accountBalancesTypeCheckboxGroup
				],
				tools: [{
					xtype: 'combo',
					editable: false,
					width: 136,
					store: options,
					value: 'Option 1'
				}],
				margin: '0, 0, 10, 0'
			}, {
				title: 'Transactions (8)',
				items: [
					transactionsTypeCheckboxGroup
				],
				tools: [{
					xtype: 'combo',
					editable: false,
					width: 136,
					store: options,
					value: 'Option 1'
				}],
				margin: '0, 0, 10, 0'
			}]
		});

		var bottomRow = Ext.create('Ext.panel.Panel', {
			height: 400,
			title: 'The role has PERMISSION to:',
			bodyCls: 'ft-role-permissions-bottom-row',
			header: {
				id: 'ft-role-permissions-bottom-row-header',
				xtype: 'header',
				layout: 'stretch',
				titlePosition: 0,
				flex: 3,
				items: [{
					xtype: 'label',
					text: 'View',
					flex: 0.6,
					baseCls: 'ft-role-permissions-header-label'

				}, {
					xtype: 'label',
					text: 'Create/Edit',
					flex: 0.7,
					baseCls: 'ft-role-permissions-header-label'

				}, {
					xtype: 'label',
					text: 'Authorize',
					flex: 0.7,
					baseCls: 'ft-role-permissions-header-label'
				}]
			},
			defaults: {
				bodyStyle: 'padding:0px;margin:0px;'
			},
			layout: {
				type: 'accordion',
				titleCollapse: false
			},
			//instead of 'headerCfg:'
			items: [{
				title: 'Account Balances',
				items: [
					bottomGrid1
				],
				tools: tools
			}, {
				title: 'Transactions (8)',
				items: [
					bottomGrid2
				],
				tools: tools
			}, {
				title: 'File Options (4)',
				items: [
					bottomGrid3
				],
				tools: tools
			}, {
				title: 'Template Summary (6)',
				items: [
					bottomGrid4
				],
				tools: tools
			}]
		});

		Ext.create('Ext.panel.Panel', {
			header: false,
			id: 'container',
			width: ELEMENT_WIDTH,
			renderTo: EXT_ELEMENT,
			layout: {
				type: 'vbox', // Arrange child items vertically
				align: 'stretch', // Each takes up full width
				padding: 0
			},
			items: [{
				xtype: 'container',
				flex: 6,
				layout: {
					padding: '10 0 0 0',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					title: 'The role has ACCESS to:',
					width: '100%',
					height: 49
				}]
			}, {
				xtype: 'container',
				layout: {
					padding: 0,
					align: 'fit',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 3,
					header: false,
					margin: '0, 10, 10, 0',
					items: [
						leftColumn
					]
				}, {
					xtype: 'panel',
					flex: 3,
					margin: '0, 10, 10, 0',
					header: false,
					items: [
						rightColumn
					]
				}]
			}, {
				xtype: 'container',
				layout: {
					padding: 0,
					align: 'fit',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 6,
					header: false,
					items: [
						bottomRow
					]
				}]
			}, {
				xtype: 'container',
				flex: 6,
				layout: {
					padding: '10 0 0 0',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					html: buttonRow,
					width: '100%'
				}]
			}]
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