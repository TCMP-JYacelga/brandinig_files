var dtEntryDateVal = null;
Ext.define('GCP.view.NonCMSCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'nonCMSCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 480,
	layout : {
		type : 'vbox'
	},
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
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "0",
						"value" : "Pending Approval"
					},
					{
						"key" : "0.A",
						"value" : "Pending My Approval"
					},
					{
						"key" : "2",
						"value" : "Discarded"
					}, {
						"key" : "3",
						"value" : "Response Awaited"
					}, {
						"key" : "4",
						"value" : "Rejected"
					}, {
						"key" : "5",
						"value" : "Cancelled"
					}, {
						"key" : "6",
						"value" : "Partial Response"
					}, {
						"key" : "7",
						"value" : "Failed"
					}, {
						"key" : "8.13.14",
						"value" : "Processed"
					}]
		});

		this.items = [{
					xtype : 'label',
					cls : 'red',
					itemId : 'errorLabel',
					heigth : 10,
					hidden : true
				}, {
					xtype : 'textfield',
					itemId : 'Reference',
					fieldLabel : getLabel('lblreference', 'Reference'),
					labelCls : 'ux_font-size14',
					margin : '12 0 0 0',
					//cls : 'ux_extralargemargin-bottom',
					fieldCls : 'xn-valign-middle xn-form-text w12',
					labelWidth : 100

				}, {
					xtype : 'textfield',
					itemId : 'CheckNum',
					fieldLabel : getLabel('lblchecknum', 'Check No.'),
					labelCls : 'ux_font-size14',
					fieldCls : 'xn-valign-middle xn-form-text w12',
					margin : '12 0 12 0',
					//cls : 'ux_extralargemargin-bottom',
					labelWidth : 100
				}, {
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 12 0',
					items : [{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel('lblamount', 'Amount')+':',
								cls : 'ux_font-size14',
								width : 105,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								editable : false,
								width : 34,
								displayField : 'value',
								itemId : 'rangeCombo',
								store : rangeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w2 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'eq',
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
								fieldCls : 'xn-valign-middle xn-form-text w9 xn-field-amount',
								allowBlank : true,
								itemId : 'Amount',
								hideTrigger : true
							}]
				},{
					xtype : 'AutoCompleter',
					cfgUrl:'services/userseek/checkAcctNumberAccNameSeek.json',
					itemId : 'Account',
					fieldLabel : getLabel('lblaccount', 'Account'),
					labelCls : 'ux_font-size14',
					fieldCls : 'xn-form-text w12 u xn-form-text w12',
					cls : 'ux_extralargemargin-bottom autoCmplete-field',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'checkAcctNumberAccNameSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgKeyNode : 'CODE'
				},{ 
					xtype  : 'datefield',
					labelCls : 'ux_font-size14',
					itemId : 'EntryDate', 
					editable :false, 
				    fieldLabel: 'Request Date',
				    cls : 'ux_extralargemargin-bottom',
				    fieldCls : 'xn-valign-middle xn-form-text w12',
				    allowBlank : true,
				    hideTrigger : true,
				    labelWidth : 100 ,
				    minValue : clientFromDate,
				    value :  dtEntryDateVal
				},
				{ 
					xtype  : 'datefield',
					itemId : 'CheckDate',
					labelCls : 'ux_font-size14',
					editable :false, 
				    fieldLabel: getLabel('lblchkdate', 'Check Date'),
				    fieldCls : 'xn-valign-middle xn-form-text w12',
				    allowBlank : true,
				    hideTrigger : true,
				    cls : 'ux_extralargemargin-bottom',
				    labelWidth : 100 ,
				    value :  dtEntryDateVal
				},{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 12 0',
					items : [{
						xtype : 'label',
						text : getLabel('status', 'Status')+':',
						width : 105,
						padding : '4 0 0 0',
						cls : 'ux_font-size14'
					}, {
					xtype : 'combobox',
					editable : false,
					displayField : 'value',
					itemId : 'RequestState',
					store : statusStore,
					valueField : 'key',
					width : 168,
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					value : 'All',
					padding : '0 8 0 0',
					listeners : {
						change : function(combo, newValue, oldValue) {
						}
					}
				}]
			   },{
					xtype : 'textfield',
					itemId : 'filterCode',
					labelCls : 'ux_font-size14',
					fieldCls : 'xn-valign-middle xn-form-text w12',
					fieldLabel : getLabel('filterName', 'Filter Name'),
					labelWidth : 100
				},
				{
					xtype : 'label',
					text : getLabel('note',
						'Note : This will also include static filters'),
					//flex : 1,
						cls : 'ux_font-size14-normal',
					padding : '9 0 7 0'
				},
				
				{
					xtype : 'label',
					cls : 'page-heading-bottom-border',
					width : 500,
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
							if (me.callerParent == 'ckmgmtstdView') {
								me.fireEvent('handleSearchAction', btn);
							}
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'ckmgmtstdView') {
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
							if (me.callerParent == 'ckmgmtstdView') {
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

		var Ref = objOfCreateNewFilter
				.down('textfield[itemId="Reference"]').getValue();
		if (!Ext.isEmpty(Ref)) {
			jsonArray.push({
				field : 'Reference',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="Reference"]').getValue(),
				value2 : ''
			});
		}

		var CheckNum = objOfCreateNewFilter
				.down('textfield[itemId="CheckNum"]').getValue();
		if (!Ext.isEmpty(CheckNum)) {
			jsonArray.push({
						field : 'CheckNum',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="CheckNum"]')
								.getValue(),
						value2 : ''
					});
		}
		var acc = objOfCreateNewFilter.down('AutoCompleter[itemId="Account"]')
				.getValue();
		if (!Ext.isEmpty(acc)) {
			jsonArray.push({
						field : 'Account',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('AutoCompleter[itemId="Account"]').getValue(),
						value2 : ''
					});
		}
		var amount = objOfCreateNewFilter.down('numberfield[itemId="Amount"]')
				.getValue();
		if (!Ext.isEmpty(amount)) {

			jsonArray.push({
						field : 'Amount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="Amount"]')
								.getValue(),
						value2 : ''
					});
		}
		
		var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue();
		if( !Ext.isEmpty( statusFilter) && (statusFilter !=="0.A"  && statusFilter !== "All"))
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue(),
				value2 : ''
			} );
		}
		else if( !Ext.isEmpty( statusFilter) && (statusFilter =="0.A"  && statusFilter !== "All"))
		{
			
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue(),
				value2 : ''
			} );
		}
		
	 var entryDate =objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue();
	   if(!Ext.isEmpty(entryDate)) { 
		  jsonArray.push({
			  field :'EntryDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue(),
			  					'Y-m-d'),
			  value2 : ''
		   }); 
	   }
	   var Checkdate =objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue();
	   if(!Ext.isEmpty(Checkdate)) { 
		  jsonArray.push({
			  field :'CheckDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue(),
			  					'Y-m-d'),
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

		var Ref = objOfCreateNewFilter
				.down('textfield[itemId="Reference"]').getValue();
		if (!Ext.isEmpty(Ref)) {
			jsonArray.push({
				field : 'Reference',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="Reference"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var CheckNum = objOfCreateNewFilter
				.down('textfield[itemId="CheckNum"]').getValue();
		if (!Ext.isEmpty(CheckNum)) {
			jsonArray.push({
						field : 'CheckNum',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="CheckNum"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var acc = objOfCreateNewFilter.down('AutoCompleter[itemId="Account"]')
				.getValue();
		if (!Ext.isEmpty(acc)) {
			jsonArray.push({
						field : 'Account',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('AutoCompleter[itemId="Account"]').getValue(),
						value2 : '',
						dataType : 0,
						displayType : 5
					});
		}
		var amount = objOfCreateNewFilter.down('numberfield[itemId="Amount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter
				.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)
				&& amtOptr != 'Operator') {

			jsonArray.push({
						field : 'Amount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="Amount"]')
								.getValue(),
						value2 : '',
						dataType : 2,
						displayType : 2
					});

		}
		
		var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue();
		if( !Ext.isEmpty( statusFilter ) && (statusFilter !=="0.A"  && statusFilter !== "All") && (statusFilter != "8.13.14"  && statusFilter !== "All"))
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue(),
				value2 : ''
			} );
		}
		else if( !Ext.isEmpty( statusFilter) && (statusFilter =="8.13.14"  && statusFilter !== "All") )
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'in',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue()
			} );
		}
		else if( !Ext.isEmpty( statusFilter) && (statusFilter =="0.A"  && statusFilter !== "All") )
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : '0' 
			} );
			jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER
					} );
		}
		
		var entryDate = objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue();
		  if(!Ext.isEmpty(entryDate)) { 
			  jsonArray.push({
				  field :'EntryDate',
				  operator :'eq',
				  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue(),'Y-m-d'),
				  value2 : '',
				  dataType: 1,
				  displayType:5});
	    }
	  var Checkdate = objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue();
	  if(!Ext.isEmpty(Checkdate)) { 
		  jsonArray.push({
			  field :'CheckDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue(),'Y-m-d'),
			  value2 : '',
			  dataType: 1,
			  displayType:5});
      }

		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="Reference"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="CheckNum"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Account"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="RequestState"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="EntryDate"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="CheckDate"]').reset();
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('textfield[itemId="Reference"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="CheckNum"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Account"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="RequestState"]')
		.setDisabled(boolVal);
		objCreateNewFilterPanel.down('label[itemId="amtLabel"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="EntryDate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="CheckDate"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="Reference"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="CheckNum"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Account"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(boolVal);
	}
});