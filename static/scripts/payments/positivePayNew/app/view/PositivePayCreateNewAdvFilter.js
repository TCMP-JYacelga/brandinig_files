Ext.define('GCP.view.PositivePayCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayCreateNewAdvFilter',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	callerParent : null,
	width : 730,
	height: 230,
	cls: 'filter-container-cls ux_no-padding',
	
	initComponent : function() {
		var me = this;
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : "",
								"value" : "ALL"
							}, {
								"key" : "0",
								"value" : "New"
							}, {
								"key" : "1",
								"value" : "Pending Approval"
							},{
								"key" : "3P",
								"value" : "Paid"
							},{
								"key" : "3R",
								"value" : "Return"
							},{
								"key" : "7",
								"value" : "Rejected"
							}]
				});
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
		var desicionStore = Ext.create('Ext.data.Store',{
			fields : ['key', 'value'],
			data : [{
						"key" : "P",
						"value" : "Pay"
					}, {
						"key" : "R",
						"value" : "Return"
					}, {
						"key" : "N",
						"value" : "None"
					}]
		
		
		});
		
		this.items = [{
				xtype: 'container',
				width: 'auto',
				layout: 'column',
				margin : 5,
				defaults: {
					margin: '3 5 0 5'
				},
				items: [{
					xtype: 'container',
					columnWidth: 0.30,
					layout: 'vbox',
					defaults: {
					padding: 3,
					labelAlign: 'top',
					labelSeparator: ''
					},
					items: [{
						xtype : 'textfield',
						itemId : 'filterCode',
						fieldLabel : getLabel('filterName', 'Filter Name'),
						labelCls : 'ux_font-size14',
						fieldCls : 'w12 ux_smallmargin-top',
						labelWidth : 150,
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
				 },
				 { 
						xtype  : 'datefield',
						itemId : 'checkdate', 
						editable :false, 
					    fieldLabel: getLabel('issueDate', 'Issue Date'),  						
					    labelCls : 'ux_font-size14',								
					    fieldCls : 'xn-valign-middle  w12 ux_smallmargin-top ux_no-padding',
					    allowBlank : true,
					    hideTrigger : true,
					    labelWidth : 150,
					    format : !Ext
										.isEmpty(strExtApplicationDateFormat)
										? strExtApplicationDateFormat
										: 'm/d/Y'
					},
					{
						xtype : 'container',
						layout : 'vbox',
						margin : '0 0 6 0',
						items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							width : 156,														
							cls : 'black ux_font-size14 ux_smallmargin-bottom'
							
						}, {
						xtype : 'combobox',
						width : 168,
						displayField : 'value',
						itemId : 'requestStatus',
						store : statusStore,
						valueField : 'key',
						cls : 'trigger-height',	
						labelWidth : 100,						
						fieldCls : 'ux_no-padding ',
						triggerBaseCls : 'xn-form-trigger',
						padding : '0 8 0 0',
						listeners : {
							change : function(combo, newValue, oldValue) {
							}
						}
					}]
				   }]
				},{
					xtype: 'container',
					columnWidth: 0.30,
					layout: 'vbox',
					defaults: {
					padding: 3,
					labelAlign: 'top',
					labelSeparator: ''
					},
					items: [{
							xtype : 'AutoCompleter',
							cls : 'autoCmplete-field',
							fieldCls : 'w12 x-form-empty-field ux_smallmargin-top',
							width : 168,
							itemId : 'accountNmbr',
							name : 'accountNmbr',
							matchFieldWidth : true,
							labelSeparator : '',
							fieldLabel : getLabel( 'accountNmbr', 'Account' ),
							labelCls : 'ux_font-size14',
							cfgUrl : 'services/userseek/accountCustomerSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'accountCustomerSeek',
							cfgRootNode : 'd.preferences',
							cfgKeyNode : 'CODE',
							cfgDataNode1 : 'DESCR',
							cfgStoreFields:['CODE','DESCR']
						},{
						xtype : 'container',
						layout : 'vbox',
						labelAlign: 'top',
						margin : '0 0 5 0',
						items : [{		
							xtype : 'label',
							itemId : 'amtLabel',
							text : getLabel('wireAmount', 'Amount'),
							cls : 'black ux_font-size14',							
							width : 168
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
								triggerBaseCls : 'xn-form-trigger',
								cls : 'trigger-height',											
								fieldCls : 'ux_no-padding',
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
								itemId : 'amount',
								hideTrigger : true,
								fieldCls : 'ux_no-padding',
								width  :120
							}]
						}]
						},{
							xtype : 'textfield',
							itemId : 'receiverName',
							fieldLabel : getLabel('receiverName', 'Payee'),							
							labelCls : 'ux_font-size14 ',
							fieldCls : 'w12 ux_smallmargin-top',							
							//fieldCls : 'w12 xn-form-field',
							//cls : 'ux_normalmargin-top',
							labelWidth : 150
							
						}]
				},{
					xtype: 'container',
					columnWidth: 0.40,
					layout: 'vbox',
					defaults: {
						padding: 3,
						labelAlign: 'top',
						labelSeparator: ''
					},
					items: [{
							xtype : 'textfield',
							itemId : 'checkNmbr',
							fieldLabel : getLabel('checkNmbr', 'Check No.'),
							labelCls: ' ux_font-size14 ',
							fieldCls : ' w12 ux_smallmargin-top',
							labelWidth : 150
							
						 },
						 {
							xtype : 'label',							
							text : getLabel("decision", "Decision"),
							cls : ' ux_font-size14 w12',													
							labelWidth : 150
						},
						{
								xtype : 'combobox',
								width : 170,
								displayField : 'value',
								itemId : 'decision',
								store : desicionStore,
								valueField : 'key',	
								cls : 'trigger-height',
								fieldCls : 'ux_no-padding',								
								triggerBaseCls : 'xn-form-trigger',								
								matchFieldWidth : true,
								padding : '0 8 0 0',
								labelWidth : 100,
								labelCls: ' ux_font-size14',
								listeners : {
									change : function(combo, newValue, oldValue) {
									//	me.fireEvent("handleDecisionField",newValue === 'bt'? true: false);
									}
							}
						  }
						]
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
			padding : '15 100 0 0',
			dock : 'bottom',
			items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						glyph : 'xf002@fontawesome',
						handler : function(btn) {
							if (me.callerParent == 'positivePayView') {
								me.fireEvent('handleSearchActionGridView', btn);
							} 
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						glyph : 'xf00e@fontawesome',
						handler : function(btn) {
							if (me.callerParent == 'positivePayView') {
								me.fireEvent('handleSaveAndSearchGridAction',btn);
							} 
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						glyph : 'xf056@fontawesome',
						handler : function(btn) {
							if (me.callerParent == 'positivePayView') {
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

		var AccountNmbr = objOfCreateNewFilter
				.down('combobox[itemId="accountNmbr"]').getValue();
		if (!Ext.isEmpty(AccountNmbr)) {
			jsonArray.push({
				field : 'accountNmbr',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('combobox[itemId="accountNmbr"]').getValue(),
				value2 : ''
			});
		}

		var ReceiverName = objOfCreateNewFilter.down('textfield[itemId="receiverName"]').getValue();
		if (!Ext.isEmpty(ReceiverName)) {
			jsonArray.push({
						field : 'receiverName',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="receiverName"]')
								.getValue(),
						value2 : ''
					});
		}
		
	  var CheckNmbr = objOfCreateNewFilter.down('textfield[itemId="checkNmbr"]').getValue();
		if (!Ext.isEmpty(CheckNmbr)) {
			jsonArray.push({
						field : 'checkNmbr',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="checkNmbr"]')
								.getValue(),
						value2 : ''
					});
		}
		 var Decision = objOfCreateNewFilter.down('textfield[itemId="decision"]').getValue();
			if (!Ext.isEmpty(Decision)) {
				jsonArray.push({
							field : 'decision',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('textfield[itemId="decision"]')
									.getValue(),
							value2 : ''
						});
		 }
	   var Status = objOfCreateNewFilter.down('combobox[itemId="requestStatus"]').getValue();
		if (!Ext.isEmpty(Status)) {
			 if(Status == "3P")
		     {
				 jsonArray.push({
						field    : 'requestStatus',
						operator : 'eq',
						value1 	 : '3',
						value2   : ''
					});
				 jsonArray.push({
						field    : 'decision',
						operator : 'eq',
						value1 	 : 'P',
						value2   : ''
					});
		     }
			 else  if(Status == "3R")
		     {
				 jsonArray.push({
						field    : 'requestStatus',
						operator : 'eq',
						value1 	 : '3',
						value2   : ''
					});
				 jsonArray.push({
						field    : 'decision',
						operator : 'eq',
						value1 	 : 'R',
						value2   : ''
					});
		     }
			 else
			 {
				jsonArray.push({
						field : 'requestStatus',
						operator : 'eq',
						value1 : objOfCreateNewFilter.down('combobox[itemId="requestStatus"]')
								.getValue(),
						value2 : ''
					});
			 }
	   }
		
	  var Checkdate =objOfCreateNewFilter.down('datefield[itemId="checkdate"]').getValue();
	  if(!Ext.isEmpty(Checkdate)) { 
		  jsonArray.push({
			  field :'checkdate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="checkdate"]').getValue(),
			  					'Y-m-d'),
			  value2 : ''
		   }); 
	  }
	  
	  var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]').getValue();
	  var amtOptr = objOfCreateNewFilter.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)) {
		
			jsonArray.push({
						field : 'amount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="amount"]')
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

		var AccountNmbr = objOfCreateNewFilter.down('combobox[itemId="accountNmbr"]').getValue();
		if (!Ext.isEmpty(AccountNmbr)) {
			jsonArray.push({
				field : 'accountNmbr',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('combobox[itemId="accountNmbr"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var ReceiverName = objOfCreateNewFilter.down('textfield[itemId="receiverName"]').getValue();
		if (!Ext.isEmpty(ReceiverName)) {
			jsonArray.push({
						field : 'receiverName',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="receiverName"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
	
		var CheckNmbr = objOfCreateNewFilter.down('textfield[itemId="checkNmbr"]').getValue();
		if (!Ext.isEmpty(CheckNmbr)) {
			jsonArray.push({
						field : 'checkNmbr',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="checkNmbr"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var Decision = objOfCreateNewFilter.down('textfield[itemId="decision"]').getValue();
		if (!Ext.isEmpty(Decision)) {
			jsonArray.push({
						field : 'decision',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="decision"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var Status = objOfCreateNewFilter.down('combobox[itemId="requestStatus"]').getValue();
		if (!Ext.isEmpty(Status)) {
			 if(Status == "3P")
		     {
				 jsonArray.push({
						field    : 'status',
						operator : 'eq',
						value1 	 : '3',
						value2   : ''
					});
				 jsonArray.push({
						field    : 'decision',
						operator : 'eq',
						value1 	 : 'P',
						value2   : ''
					});
		     }
			 else  if(Status == "3R")
		     {
				 jsonArray.push({
						field    : 'status',
						operator : 'eq',
						value1 	 : '3',
						value2   : ''
					});
				 jsonArray.push({
						field    : 'decision',
						operator : 'eq',
						value1 	 : 'R',
						value2   : ''
					});
		     }
			 else
		     {
				jsonArray.push({
							field : 'status',
							operator : 'eq',
							value1 : objOfCreateNewFilter.down('combobox[itemId="requestStatus"]')
									.getValue(),
							value2 : '',
							dataType : 0,
							displayType : 0
						});
		     }
		}
		
	var Checkdate = objOfCreateNewFilter.down('datefield[itemId="checkdate"]').getValue();
		  if(!Ext.isEmpty(Checkdate)) { 
			  jsonArray.push({
				  field :'checkdate',
				  operator :'eq',
				  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="checkdate"]').getValue(),'Y-m-d'),
				  value2 : '',
				  dataType: 1,
				  displayType:5});
	    }
    var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]').getValue();
	var amtOptr = objOfCreateNewFilter.down('combobox[itemId="rangeCombo"]').getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)) {
			
				jsonArray.push({
							field : 'amount',
							operator : objOfCreateNewFilter
									.down('combobox[itemId="rangeCombo"]')
									.getValue(),
							value1 : objOfCreateNewFilter
									.down('numberfield[itemId="amount"]')
									.getValue(),
							value2 : ''						
						});
			}
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('combobox[itemId="accountNmbr"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="receiverName"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="checkNmbr"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="decision"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="requestStatus"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="amount"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="checkdate"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('combobox[itemId="accountNmbr"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="receiverName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="checkNmbr"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="decision"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="requestStatus"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="amount"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="checkdate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('combobox[itemId="accountNmbr"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="receiverName"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="checkNmbr"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="decision"]').setReadOnly(boolVal);
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down('label[itemId="errorLabel"]');
		objErrorLabel.setText(getLabel('filterCodeLength', 'The max length of Filter Name is 20'));
		objErrorLabel.show();
	}
});