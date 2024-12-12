Ext.define('GCP.view.IncomingWireCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWireCreateNewAdvFilter',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	callerParent : null,
	width : 700,
	//height: 350,
	cls: 'filter-container-cls',
	
	initComponent : function() {
		var me = this;
		var rangeStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : "gt",
								"value" : ">"
							}, {
								"key" : "lt",
								"value" : "<"
							}, {
								"key" : "eq",
								"value" : "="
							}]
				});
		var drCrStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "Dr",
						"value" : "Dr/Debit"
					},{
						"key" : "Cr",
						"value" : "Cr/Credit"
					}]
		});
		this.items = [{
				xtype: 'container',
				width: 'auto',
				layout: 'column',
				items: [{
					xtype: 'container',
					columnWidth: 0.30,
					layout: 'vbox',
					defaults: {
					labelAlign: 'top',
					labelSeparator: ''
					},
					items: [{
						xtype : 'textfield',
						itemId : 'filterCode',
						fieldLabel : getLabel('filterName', 'Filter Name'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						width  :165,
						maxLength : 20,
						enforceMaxLength : true,
						enableKeyEvents : true,
						listeners : {
							keypress:function(text)
							{	
								if(text.value.length === 20)
									me.showErrorMsg();
							}
					 }
				 },{
							xtype: 'AutoCompleter',
							margin : '18 0 0 0',
							cls: 'autoCmplete-field ux_paddingb',
							fieldCls : 'w165',
							itemId: 'receiverAccNmbr',
							name:  'receiverAccNmbr',
							matchFieldWidth: true,
							fieldLabel: getLabel("receivingAccountNo", "Receiving Account"),
							cfgUrl : 'services/userseek/receivingaccounts.json',
							cfgQueryParamName: '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'receivingAccountId',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE'
						},{
						xtype : 'container',
						margin : '18 0 0 0',
						layout : 'vbox',
						items : [{
							xtype : 'label',
							text : getLabel('drCr', 'Debit/Credit')+':',
							cls : 'ux_font-size14',
							width : 165
						}, {
						xtype : 'combobox',
						margin : '6 0 0 0',
						width : 165,
						displayField : 'value',
						itemId : 'drCrFlag',
						store : drCrStore,
						valueField : 'key',
						fieldCls : 'xn-form-field',
						triggerBaseCls : 'xn-form-trigger',
						//matchFieldWidth: true,
						//padding : '0 8 0 0',
						listeners : {
							change : function(combo, newValue, oldValue) {
							}
						}
					}]
				   },{
						xtype: 'AutoCompleter',
						margin : '18 0 0 0',
						cls: 'autoCmplete-field ux_paddingb',
						itemId: 'senderBankName',
						name:  'senderBankName',
						matchFieldWidth: true,
						fieldLabel: getLabel("sendingBank", "Sending Bank"),
						fieldCls : 'w165',
						cfgUrl : 'services/userseek/sendingbankcodes.json',
						cfgQueryParamName: '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'sendingBankId',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE'
					}]
				},{
					xtype: 'container',
					columnWidth: 0.30,
					layout: 'vbox',
					defaults: {
						labelAlign: 'top',
						labelSeparator: ''
					},
					items: [{
						xtype : 'textfield',
						width : 165,
						cls : 'ux_paddingb',
						itemId : 'customerRef',
						fieldLabel : getLabel('customerRef', 'Customer Reference'),
						labelWidth : 150
				    },{
						xtype: 'AutoCompleter',
						margin : '18 0 0 0',
						cls: 'autoCmplete-field ux_paddingb',
						itemId: 'receiverAccName',
						name:  'receiverAccName',
						matchFieldWidth: true,
						fieldLabel: getLabel("receivingAccountName", "Receiving Account Name"),
						fieldCls : 'w165',
						cfgUrl : 'services/userseek/receivingaccounts.json',
						cfgQueryParamName: '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'receiverAccNameId',
						cfgRootNode : 'd.preferences',
					//	cfgDataNode1 : 'DESCR'
							
							
						cfgKeyNode : 'CODE',
						cfgDataNode1 : 'DESCR',
						cfgStoreFields :
						[
							'CODE', 'DESCR'
						]
							
					},{
						xtype: 'AutoCompleter',
						fieldCls : 'w165',
						margin : '18 0 0 0',
						cls: 'autoCmplete-field ux_paddingb',
						itemId: 'receiverBankFiIid',
						name:  'receiverBankFiIid',
						matchFieldWidth: true,
						fieldLabel: getLabel("receivingBankFiId", "Receiving Bank FI ID"),
						cfgUrl : 'services/userseek/receivingbankfiId.json',
						cfgQueryParamName: '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'receiverBankFiIid',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE'
					},{

						xtype : 'textfield',
						margin : '22 0 0 0',
						itemId : 'senderName',
						fieldLabel : getLabel("senderName", "Sender Name"),
						cls : 'ux_paddingb',
						labelWidth : 160,
						width  :165
					}]
				},{
					xtype: 'container',
					columnWidth: 0.40,
					layout: 'vbox',
					defaults: {
						labelAlign: 'top',
						labelSeparator: ''
					},
					items: [{
						xtype : 'container',
						layout : 'vbox',
						labelAlign: 'top',
						items : [{		
							xtype : 'label',
							itemId : 'amtLabel',
							text : getLabel('wireAmount', 'Amount')+':',
							cls : 'black ux_font-size14',
							width : 165
						 },{
							xtype : 'container',
							margin : '4 0 0 0',
							layout : 'hbox',
							items : [{
								xtype : 'combobox',
								width : 40,
								displayField : 'value',
								itemId : 'rangeCombo',
								store : rangeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field',
								triggerBaseCls : 'xn-form-trigger',
								//value : '=',
								matchFieldWidth : true,
								padding : '0 8 0 0',
								labelWidth : 100,
								listeners : {
									change : function(combo, newValue, oldValue) {
										me.fireEvent(
												"handleRangeFieldsShowHide",
												newValue === 'bt'
														? true
														: false);
									}
							}
						  },{
								xtype : 'numberfield',
								//fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount',
								//allowBlank : true,
								itemId : 'paymentAmount',
								hideTrigger : true,
								width  :102
							}]
						}]
						},{
							xtype : 'textfield',
							margin : '18 0 0 0',
							itemId : 'receiverCharges',
							fieldLabel : getLabel('receiverCharges', 'Receiver Charges'),
							width : 165,
							cls : 'ux_paddingb',
							labelWidth : 150
					    },{
							xtype : 'textfield',
							margin : '18 0 0 0',
							itemId : 'fedReference',
							fieldLabel : getLabel('fedReferenceNo', 'FED Reference Number'),
							labelWidth : 150,
							width : 165,
							cls : 'ux_paddingb'
							}]
				}]
		}];

		this.dockedItems = [{
			xtype: 'container',
			height : 10,
			dock: 'top',
			items: [{
					xtype : 'label',
					cls : 'red',
					itemId : 'errorLabel',
					hidden : true
				}]
			},{
			xtype : 'toolbar',
			padding : '25 70 30 10',
			dock : 'bottom',
			items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						glyph : 'xf002@fontawesome',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'incomingWiresView') {
								me.fireEvent('handleSearchActionGridView', btn);
							} 
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'incomingWiresView') {
								me.fireEvent('handleSaveAndSearchGridAction',btn);
							} 
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							if (me.callerParent == 'incomingWiresView') {
								me.fireEvent('closeGridViewFilterPopup', btn);
							} 
						}
					},'->']
		}];

		this.callParent(arguments);
	},
	
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];

		var FedReferenceNo = objOfCreateNewFilter
				.down('textfield[itemId="fedReference"]').getValue();
		if (!Ext.isEmpty(FedReferenceNo)) {
			jsonArray.push({
				field : 'fedReference',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="fedReference"]').getValue(),
				value2 : ''
			});
		}
	
		var drCrFlag = objOfCreateNewFilter
				.down('combobox[itemId="drCrFlag"]').getValue();			
		if (!Ext.isEmpty(drCrFlag)) {
			jsonArray.push({
				field : 'drCrFlag',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('combobox[itemId="drCrFlag"]').getValue(),
				value2 : ''
			});
		}  
		
		
		var CustomerReference = objOfCreateNewFilter.down('textfield[itemId="customerRef"]').getValue();
		if (!Ext.isEmpty(CustomerReference)) {
			jsonArray.push({
						field : 'customerRef',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="customerRef"]')
								.getValue(),
						value2 : ''
					});
		}
		
		var receiverCharges = objOfCreateNewFilter.down('textfield[itemId="receiverCharges"]').getValue();
		if (!Ext.isEmpty(receiverCharges)) {
			jsonArray.push({
						field : 'receiverCharges',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="receiverCharges"]')
								.getValue(),
						value2 : ''
					});
		}
		
		var amount = objOfCreateNewFilter.down('numberfield[itemId="paymentAmount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)) {

			jsonArray.push({
						field : 'paymentAmount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="paymentAmount"]')
								.getValue(),
						value2 : ''						
					});
		}
		
		
		var receivingAccountNo = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverAccNmbr"]')
						.getValue();
		if (!Ext.isEmpty(receivingAccountNo)) {
			jsonArray.push({
						field : 'receiverAccNmbr',
						operator : 'eq',
						value1 : receivingAccountNo,
						value2 : ''
					});
		}
		
		var receivingAccountName = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverAccName"]')
						.getValue();
		if (!Ext.isEmpty(receivingAccountName)) {
			jsonArray.push({
					field : 'receiverAccName',
					operator : 'eq',
					value1 : receivingAccountName,
					value2 : ''
				});
		}
		
		var receivingBankFiId = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverBankFiIid"]')
			.getValue();
		if (!Ext.isEmpty(receivingBankFiId)) {
			jsonArray.push({
				field : 'receiverBankFiIid',
				operator : 'eq',
				value1 : receivingBankFiId,
				value2 : ''
			});
		}
		var sendingBank = objOfCreateNewFilter.down('AutoCompleter[itemId="senderBankName"]')
		.getValue();
		if (!Ext.isEmpty(sendingBank)) {
			jsonArray.push({
				field : 'senderBankName',
				operator : 'eq',
				value1 : sendingBank,
				value2 : ''
			});
		}
		var senderName = objOfCreateNewFilter.down('textfield[itemId="senderName"]').getValue();
		if (!Ext.isEmpty(senderName)) {
			jsonArray.push({
						field : 'senderName',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="senderName"]')
								.getValue(),
						value2 : ''
					});
		}
		
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;
		return objJson;
	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;

		var jsonArray = [];

		var FedReferenceNo = objOfCreateNewFilter
				.down('textfield[itemId="fedReference"]').getValue();
		if (!Ext.isEmpty(FedReferenceNo)) {
			jsonArray.push({
				field : 'fedReference',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="fedReference"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var drCrFlag = objOfCreateNewFilter
				.down('combobox[itemId="drCrFlag"]').getValue();
			
		if (!Ext.isEmpty(drCrFlag)) {	
			jsonArray.push({
				field : 'drCrFlag',
				operator : 'eq',
				value1 : objOfCreateNewFilter
				.down('combobox[itemId="drCrFlag"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}	
				
		
		var CustomerReference = objOfCreateNewFilter
				.down('textfield[itemId="customerRef"]').getValue();
		if (!Ext.isEmpty(CustomerReference)) {
			jsonArray.push({
						field : 'customerRef',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="customerRef"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var receiverCharges = objOfCreateNewFilter
		.down('textfield[itemId="receiverCharges"]').getValue();
		if (!Ext.isEmpty(receiverCharges)) {
			jsonArray.push({
						field : 'receiverCharges',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="receiverCharges"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		
		var paymentAmount = objOfCreateNewFilter.down('numberfield[itemId="paymentAmount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter
				.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(paymentAmount) && !Ext.isEmpty(amtOptr)) {

			jsonArray.push({
						field : 'paymentAmount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="paymentAmount"]')
								.getValue(),
						value2 : ''
					});
		}
		var receivingAccountNo = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverAccNmbr"]')
			.getValue();
		if (!Ext.isEmpty(receivingAccountNo)) {
			jsonArray.push({
						field : 'receiverAccNmbr',
						operator : 'eq',
						value1 : receivingAccountNo,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		var receivingAccountName = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverAccName"]')
					.getValue();
		if (!Ext.isEmpty(receivingAccountName)) {
			jsonArray.push({
						field : 'receiverAccName',
						operator : 'eq',
						value1 : receivingAccountName,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}
		
		var receivingBankFiId = objOfCreateNewFilter.down('AutoCompleter[itemId="receiverBankFiIid"]')
				.getValue();
		if (!Ext.isEmpty(receivingBankFiId)) {
		jsonArray.push({
					field : 'receiverBankFiIid',
					operator : 'eq',
					value1 : receivingBankFiId,
					value2 : '',
					dataType : 0,
					displayType : 0
				});
		}
		var sendingBank = objOfCreateNewFilter.down('AutoCompleter[itemId="senderBankName"]')
				.getValue();
		if (!Ext.isEmpty(sendingBank)) {
		jsonArray.push({
					field : 'senderBankName',
					operator : 'eq',
					value1 : sendingBank,
					value2 : '',
					dataType : 0,
					displayType : 0
				});
		}
		
		var senderName = objOfCreateNewFilter.down('textfield[itemId="senderName"]').getValue();
		if (!Ext.isEmpty(senderName)) {
			jsonArray.push({
				field : 'senderName',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="senderName"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="fedReference"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverAccNmbr"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverAccName"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverBankFiIid"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="senderBankName"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="senderName"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="paymentAmount"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="customerRef"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="receiverCharges"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="drCrFlag"]').reset();
		
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('textfield[itemId="fedReference"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="customerRef"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="receiverCharges"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="paymentAmount"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverAccNmbr"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverAccName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="receiverBankFiIid"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="senderBankName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="senderName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('label[itemId="amtLabel"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="drCrFlag"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="fedReference"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="customerRef"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="receiverCharges"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="paymentAmount"]').setReadOnly(boolVal);
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down('label[itemId="errorLabel"]');
		objErrorLabel.setText(getLabel('filterCodeLength', 'The max length of Filter Name is 20'));
		objErrorLabel.show();
	}
});