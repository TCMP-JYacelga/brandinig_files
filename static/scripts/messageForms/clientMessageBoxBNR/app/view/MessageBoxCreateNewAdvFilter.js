Ext.define('GCP.view.MessageBoxCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageBoxCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 480,
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var comboBoxStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : [{
								"key" : "1",
								"value" : "Send Date"
							}, {
								"key" : "2",
								"value" : "Subject"
							}, {
								"key" : "3",
								"value" : "Status"
							}]
				});
		
		this.items = [{
					xtype : 'label',
					cls : 'red',
					itemId : 'errorLabel',
					heigth : 10,
					hidden : true
				}, {
					xtype : 'datefield',
					itemId : 'FromReplyDate',
					editable :false,
					fieldLabel : getLabel('fromReplyDate', 'From Reply Date'),
					fieldCls :'xn-valign-middle xn-form-text w12',
					allowBlank : true,
					hideTrigger : true,
					labelWidth : 150
				},{
					xtype : 'datefield',
					itemId : 'ToReplyDate',
					editable :false,
					fieldLabel : getLabel('toReplyDate', 'To Reply Date'),
					fieldCls :'xn-valign-middle xn-form-text w12',
					allowBlank : true,
					hideTrigger : true,
					labelWidth : 150
				}, {
					xtype : 'textfield',
					itemId : 'Subject',
					fieldLabel : getLabel('subject', 'Subject'),
					labelWidth : 150
				},{
					xtype : 'textfield',
					itemId : 'ReferenceNo',
					fieldLabel : getLabel('referenceNo', 'Reference No.'),
					labelWidth : 150
				},{
					xtype : 'textfield',
					itemId : 'RepliedBy',
					fieldLabel : getLabel('repliedBy', 'Replied By'),
					labelWidth : 150
				},{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
								xtype : 'label',
								itemId : 'OrderBy',
								text : getLabel('orderBy', 'Order By'),
								cls : 'black',
								width : 156,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'orderByCombo',
								store : comboBoxStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'Send Date',
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
							}]
				},{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
								xtype : 'label',
								itemId : 'ThenBy1',
								text : getLabel('thenBy1', 'Then By1'),
								cls : 'black',
								width : 156,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'thenBy1Combo',
								store : comboBoxStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'Send Date',
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
							}]
				},{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
								xtype : 'label',
								itemId : 'ThenBy2',
								text : getLabel('thenBy2', 'Then By2'),
								cls : 'black',
								width : 156,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'thenBy2Combo',
								store : comboBoxStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'Send Date',
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
							}]
				},{
					xtype : 'textfield',
					itemId : 'filterCode',
					fieldLabel : getLabel('filterName', 'Filter Name'),
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
					xtype : 'label',
					text : getLabel('note',
						'Note : This will also include static filters'),
					//flex : 1,
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
						cls : 'xn-button',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'messageBoxView') {
								me.fireEvent('handleSearchActionGridView', btn);
							} else if (me.callerParent == 'messageBoxstdView') {
								me.fireEvent('handleSearchAction', btn);
							}
						}
					}, {
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'messageBoxView') {
								me.fireEvent('handleSaveAndSearchGridAction',
										btn);
							} else if (me.callerParent == 'messageBoxstdView') {
								me.fireEvent('handleSaveAndSearchAction', btn);
							}

						}
					}, {
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							if (me.callerParent == 'messageBoxView') {
								me.fireEvent('closeGridViewFilterPopup', btn);
							} else if (me.callerParent == 'messageBoxstdView') {
								me.fireEvent('closeFilterPopup', btn);
							}

						}
					}]
		}];

		this.callParent(arguments);
	},
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		
		var fromReplyDate =
		objOfCreateNewFilter.down('datefield[itemId="FromReplyDate"]').getValue();
		if(!Ext.isEmpty(fromReplyDate)) { 
			jsonArray.push({
				field :'FromReplyDate',
				operator :'eq',
				value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="FromReplyDate"]').getValue(),
				'Y-m-d'),
				value2 : ''
			}); 
		}
		
		var toReplyDate =
			objOfCreateNewFilter.down('datefield[itemId="ToReplyDate"]').getValue();
			if(!Ext.isEmpty(toReplyDate)) { 
				jsonArray.push({
					field :'ToReplyDate',
					operator :'eq',
					value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="ToReplyDate"]').getValue(),
					'Y-m-d'),
					value2 : ''
				}); 
			}
		 
		var subject = objOfCreateNewFilter
				.down('textfield[itemId="Subject"]').getValue();
		if (!Ext.isEmpty(subject)) {
			jsonArray.push({
				field : 'Subject',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="Subject"]').getValue(),
				value2 : ''
			});
		}

		var ReferenceNo = objOfCreateNewFilter
				.down('textfield[itemId="ReferenceNo"]').getValue();
		if (!Ext.isEmpty(ReferenceNo)) {
			jsonArray.push({
						field : 'ReferenceNo',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="ReferenceNo"]')
								.getValue(),
						value2 : ''
					});
		}
	
		var RepliedBy = objOfCreateNewFilter.down('textfield[itemId="RepliedBy"]')
				.getValue();
		if (!Ext.isEmpty(RepliedBy)) {
			jsonArray.push({
						field : 'RepliedBy',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="RepliedBy"]').getValue(),
						value2 : ''
					});
		}

		/*var orderBy = objOfCreateNewFilter
				.down('combobox[itemId="OrderBy"]').getValue();
		if (!Ext.isEmpty(orderBy) && orderBy != 'ALL') {
			jsonArray.push({
						field : 'OrderBy',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('combobox[itemId="OrderBy"]')
								.getValue(),
						value2 : ''
					});
		}
		var thenBy1 = objOfCreateNewFilter
		.down('combobox[itemId="ThenBy1"]').getValue();
		if (!Ext.isEmpty(thenBy1) && thenBy1 != 'ALL') {
			jsonArray.push({
						field : 'ThenBy1',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('combobox[itemId="ThenBy1"]')
								.getValue(),
						value2 : ''
					});
		}
		
		var thenBy2 = objOfCreateNewFilter
		.down('combobox[itemId="ThenBy2"]').getValue();
		if (!Ext.isEmpty(thenBy2) && thenBy2 != 'ALL') {
			jsonArray.push({
						field : 'ThenBy2',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('combobox[itemId="ThenBy2"]')
								.getValue(),
						value2 : ''
					});
		}*/
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

		var fromReplyDate =
			objOfCreateNewFilter.down('datefield[itemId="FromReplyDate"]').getValue();
			if(!Ext.isEmpty(fromReplyDate)) { 
				jsonArray.push({
					field :'FromReplyDate',
					operator :'eq',
					value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="FromReplyDate"]').getValue(),
					'Y-m-d'),
					value2 : ''
				}); 
			}
			
			var toReplyDate =
				objOfCreateNewFilter.down('datefield[itemId="ToReplyDate"]').getValue();
				if(!Ext.isEmpty(ToReplyDate)) { 
					jsonArray.push({
						field :'ToReplyDate',
						operator :'eq',
						value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="ToReplyDate"]').getValue(),
						'Y-m-d'),
						value2 : ''
					}); 
				}
			 
			var subject = objOfCreateNewFilter
					.down('textfield[itemId="Subject"]').getValue();
			if (!Ext.isEmpty(subject)) {
				jsonArray.push({
					field : 'Subject',
					operator : 'eq',
					value1 : objOfCreateNewFilter
							.down('textfield[itemId="Subject"]').getValue(),
					value2 : ''
				});
			}

			var ReferenceNo = objOfCreateNewFilter
					.down('textfield[itemId="ReferenceNo"]').getValue();
			if (!Ext.isEmpty(ReferenceNo)) {
				jsonArray.push({
							field : 'ReferenceNo',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('textfield[itemId="ReferenceNo"]')
									.getValue(),
							value2 : ''
						});
			}
		
			var RepliedBy = objOfCreateNewFilter.down('textfield[itemId="RepliedBy"]')
					.getValue();
			if (!Ext.isEmpty(RepliedBy)) {
				jsonArray.push({
							field : 'RepliedBy',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('textfield[itemId="RepliedBy"]').getValue(),
							value2 : ''
						});
			}

			/*var orderBy = objOfCreateNewFilter
					.down('combobox[itemId="OrderBy"]').getValue();
			if (!Ext.isEmpty(orderBy) && orderBy != 'ALL') {
				jsonArray.push({
							field : 'OrderBy',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('combobox[itemId="OrderBy"]')
									.getValue(),
							value2 : ''
						});
			}
			var thenBy1 = objOfCreateNewFilter
			.down('combobox[itemId="ThenBy1"]').getValue();
			if (!Ext.isEmpty(thenBy1) && thenBy1 != 'ALL') {
				jsonArray.push({
							field : 'ThenBy1',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('combobox[itemId="ThenBy1"]')
									.getValue(),
							value2 : ''
						});
			}
			
			var thenBy2 = objOfCreateNewFilter
			.down('combobox[itemId="ThenBy2"]').getValue();
			if (!Ext.isEmpty(thenBy2) && thenBy2 != 'ALL') {
				jsonArray.push({
							field : 'ThenBy2',
							operator : 'eq',
							value1 : objOfCreateNewFilter
									.down('combobox[itemId="ThenBy2"]')
									.getValue(),
							value2 : ''
						});
			}*/
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('datefield[itemId="FromReplyDate"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="ToReplyDate"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="Subject"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="ReferenceNo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="RepliedBy"]').reset();
		/*objCreateNewFilterPanel.down('combobox[itemId="OrderBy"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="ThenBy1"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="ThenBy2"]').reset();*/
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('datefield[itemId="FromReplyDate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="ToReplyDate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="Subject"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReferenceNo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="RepliedBy"]')
		.setDisabled(boolVal);
		/*objCreateNewFilterPanel.down('combobox[itemId="OrderBy"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="ThenBy1"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="ThenBy2"]')
				.setDisabled(boolVal);*/
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="Subject"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReferenceNo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="RepliedBy"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(boolVal);
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down('label[itemId="errorLabel"]');
		objErrorLabel.setText(getLabel('filterCodeLength', 'The max length of Filter Name is 20'));
		objErrorLabel.show();
	}
});