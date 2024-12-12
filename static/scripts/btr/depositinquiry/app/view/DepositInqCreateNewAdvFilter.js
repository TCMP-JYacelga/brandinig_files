Ext.define('GCP.view.DepositInqCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'depositInqCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 480,
	cls : 'ux_margin-top-12',
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var rangeStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : "gt",
								"value" : "Greater Than"
							}, {
								"key" : "lt",
								"value" : "Less Than"
							}, {
								"key" : "eq",
								"value" : "Equal"
							}]
				});

		this.items = [{
					xtype : 'label',
					cls : 'red',
					itemId : 'errorLabel',
					height : 10,
					hidden : true
				}, {
					xtype : 'textfield',
					itemId : 'depSlipNmbr',
					fieldLabel : getLabel('lbldepositslipno', 'Deposit Ticket'),
					fieldCls : 'w165',
					labelCls : 'ux_font-size14',
					labelWidth : 150

				}, {
					xtype : 'panel',
					layout : 'hbox',
					margin : '12 0 0 0',
					items : [{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel('lblamount', 'Deposit Amount')+':',
								cls : 'black ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'rangeCombo',
								store : rangeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'Operator',
								padding : '0 8 0 0',
								listeners : {
									change : function(combo, newValue, oldValue) {
										me.fireEvent(
												"handleRangeFieldsShowHide",
												newValue === 'bt'
														? true
														: false);
									}
								}
							}, {
								xtype : 'numberfield',
								fieldCls : 'xn-valign-middle xn-form-text w14 xn-field-amount',
								allowBlank : true,
								itemId : 'depositAmount',
								hideTrigger : true
							}]
				},{
					xtype : 'textfield',
					itemId : 'depositAccount',
					fieldLabel : getLabel('lblaccount', 'Deposit Account'),
					fieldCls : 'w165',
					labelCls : 'ux_font-size14',
					cls : 'ux_extralargemargin-top',
					labelWidth : 150
				},{
					xtype : 'textfield',
					itemId : 'lockBoxId',
					fieldLabel : getLabel('lbllockboxid', 'Store ID/Lockbox ID'),
					fieldCls : 'w165',
					labelCls : 'ux_font-size14',
					cls : 'ux_extralargemargin-top',
					labelWidth : 150
				},{
					xtype : 'textfield',
					itemId : 'filterCode',
					fieldLabel : getLabel('filterName', 'Filter Name'),
					fieldCls : 'w165',
					labelCls : 'ux_font-size14',
					cls : 'ux_extralargemargin-top',
					labelWidth : 150
				},
				{
					xtype : 'label',
					text : getLabel('note',
						'Note : This will also include static filters'),
					cls : 'ux_font-size14-normal',
					//flex : 1,
					padding : '12 0 0 0'
				},
				
				{
					xtype : 'label',
					cls : 'page-heading-bottom-border',
					width : '100%',
					padding : '4 0 0 0'
				}];

		this.dockedItems = [{
			xtype : 'toolbar',
			padding : '10 0 0 0',
			dock : 'bottom',
			items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						glyph : 'xf002@fontawesome',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'depInqStdView') {
								me.fireEvent('handleSearchAction', btn);
							}
						}
					}, {
						xtype : 'button',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'depInqStdView') {
								me.fireEvent('handleSaveAndSearchAction', btn);
							}

						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							if (me.callerParent == 'depInqStdView') {
								me.fireEvent('closeFilterPopup', btn);
							}

						}
					},'->']
		}];

		this.callParent(arguments);
	},
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];

		var depSlipNmbr = objOfCreateNewFilter
				.down('textfield[itemId="depSlipNmbr"]').getValue();
		if (!Ext.isEmpty(depSlipNmbr)) {
			jsonArray.push({
				field : 'depSlipNmbr',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depSlipNmbr"]').getValue(),
				value2 : ''
			});
		}

		var amount = objOfCreateNewFilter.down('numberfield[itemId="depositAmount"]').getValue();
		if (!Ext.isEmpty(amount)) {
		
			jsonArray.push({
						field : 'depositAmount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="depositAmount"]')
								.getValue(),
						value2 : ''
					});
		}

		var depositAccount = objOfCreateNewFilter
		.down('textfield[itemId="depositAccount"]').getValue();
		if (!Ext.isEmpty(depositAccount)) {
			jsonArray.push({
						field : 'depositAccount',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="depositAccount"]')
								.getValue(),
						value2 : ''
					});
		}

		var lockBoxId = objOfCreateNewFilter.down('textfield[itemId="lockBoxId"]')
				.getValue();
		if (!Ext.isEmpty(lockBoxId)) {
			jsonArray.push({
						field : 'lockBoxId',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="lockBoxId"]').getValue(),
						value2 : ''
					});
		}


		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = filterCode;
		return objJson;
	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;

		var jsonArray = [];

		var depSlipNmbr = objOfCreateNewFilter
				.down('textfield[itemId="depSlipNmbr"]').getValue();
		if (!Ext.isEmpty(depSlipNmbr)) {
			jsonArray.push({
				field : 'depSlipNmbr',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depSlipNmbr"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		
		var amount = objOfCreateNewFilter.down('numberfield[itemId="depositAmount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter
				.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)
				&& amtOptr != 'Operator') {

			jsonArray.push({
						field : 'depositAmount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="depositAmount"]')
								.getValue(),
						value2 : '',
						dataType : 2,
						displayType : 2
					});

		}
		
		var acc = objOfCreateNewFilter.down('textfield[itemId="depositAccount"]')
		.getValue();
		if (!Ext.isEmpty(acc)) {
			jsonArray.push({
						field : 'depositAccount',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="depositAccount"]').getValue(),
						value2 : '',
						dataType : 0,
						displayType : 5
					});
		}

		var lockBoxId = objOfCreateNewFilter.down('textfield[itemId="lockBoxId"]')
		.getValue();
		if (!Ext.isEmpty(lockBoxId)) {
			jsonArray.push({
						field : 'lockBoxId',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="lockBoxId"]').getValue(),
						value2 : '',
						dataType : 0,
						displayType : 5
					});
		}
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="depSlipNmbr"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="depositAccount"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('textfield[itemId="depSlipNmbr"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('label[itemId="amtLabel"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="depositAccount"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="depSlipNmbr"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="depositAccount"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setReadOnly(boolVal);
	}
});