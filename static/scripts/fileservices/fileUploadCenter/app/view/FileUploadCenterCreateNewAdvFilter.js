Ext.define('GCP.view.FileUploadCenterCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadCenterCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 460,
	padding : '0 0 0 10',
	layout : {
		type : 'vbox'
	},
	
	initComponent : function() {
		var me = this;
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
				"key" : "All",
				"value" : "All"
			},{
				"key" : "C",
				"value" : "Completed"
			},{
				"key" : "P",
				"value" : "Partial Successful"
			},{
				"key" : "E",
				"value" : "Aborted"
			},{
				"key" : "N",
				"value" : "New"
			},{
				"key" : "Q",
				"value" : "In Queue"
			},{
				"key" : "T",
				"value" : "Rejected"
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
					cls : 'ux_padding0060 ux_width165',
					itemId : 'filterCode',
					fieldLabel : getLabel('filterName', 'Filter Name'),
					labelCls : 'ux_font-size14',
					labelWidth : 150
				}, {
			    	xtype : 'textfield',
					cls : 'ux_padding0060 ux_width165',
					itemId : 'fileName',
					fieldLabel : getLabel('fileName', 'File Name'),
					labelCls : 'ux_font-size14',
					labelWidth : 150
			    },{
			    	xtype : 'textfield',
					itemId : 'userName',
					cls : ' ux_width165',
					fieldLabel : getLabel('userName', 'User'),
					labelCls : 'ux_font-size14',
					labelWidth : 150
			    },{
			    	xtype  : 'datefield',
					itemId : 'fromDate', 
					editable :false, 
					cls : 'ux_width165',
				    fieldLabel: 'From Date',  
					labelCls : 'ux_font-size14',
				    fieldCls : 'xn-valign-middle xn-form-text w12',
				    allowBlank : true,
				    hideTrigger : true,
				    labelWidth : 150 
			    },{
			    	xtype  : 'datefield',
					itemId : 'toDate', 
					cls : 'ux_width165',
					editable :false, 
				    fieldLabel: 'To Date',
					labelCls : 'ux_font-size14',
				    fieldCls : 'xn-valign-middle xn-form-text w12',
				    allowBlank : true,
				    hideTrigger : true,
				    labelWidth : 150 
			    },{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
								xtype : 'label',
								itemId : 'statusLabel',
								text : getLabel('lblstatus', 'Status')+':',
								//cls : 'black',
								cls : 'ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							}, {
								xtype : 'combobox',
								//width : 88,
								width : 165,
								displayField : 'value',
								itemId : 'statusCombo',
								store : statusStore,
								valueField : 'key',
								//fieldCls : 'xn-form-field w6 inline_block',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'All',
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
								xtype : 'label',
								cls : 'page-heading-bottom-border',
								width : 500,
								padding : '4 0 0 0'
							}];

		this.dockedItems = [{
			xtype : 'toolbar',
			//padding : '10 55 0 0',
			padding : '10 0 0 0',
			dock : 'bottom',
			items : ['->', {
						xtype : 'button',
						//cls : 'xn-button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						glyph : 'xf002@fontawesome',
						text : getLabel('btnSearch', 'Continue'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'fileUploadCenterView') {
								me.fireEvent('handleSearchActionGridView', btn);
							} 
						}
					}, {
						xtype : 'button',
						//cls : 'xn-button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Filter'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'fileUploadCenterView') {
								me.fireEvent('handleSaveAndSearchGridAction',btn);
							} 
						}
					}, 
					{
						xtype : 'button',
						//cls : 'xn-button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf112@fontawesome',
						text : getLabel('btnReset', 'Reset All'),
						itemId : 'resetBtn',
						handler : function(btn) {
							if (me.callerParent == 'fileUploadCenterView') {
								me.fireEvent('handleResetAction',btn);
							} 
						}
					},{
						xtype : 'button',
						//cls : 'xn-button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							if (me.callerParent == 'fileUploadCenterView') {
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

		var fileName = objOfCreateNewFilter
				.down('textfield[itemId="fileName"]').getValue();
		if (!Ext.isEmpty(fileName)) {
			jsonArray.push({
				field : 'fileName',
				operator : 'eq',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="fileName"]').getValue(),
				value2 : ''
			});
		}
		
		var userName = objOfCreateNewFilter.down('textfield[itemId="userName"]').getValue();
		if (!Ext.isEmpty(userName)) {
			jsonArray.push({
						field : 'userName',
						operator : 'eq',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="userName"]')
								.getValue(),
						value2 : ''
					});
		}
		
	  var fromDate =objOfCreateNewFilter.down('datefield[itemId="fromDate"]').getValue();
	  if(!Ext.isEmpty(fromDate)) { 
		  jsonArray.push({
			  field :'fromDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="fromDate"]').getValue(),
			  					'Y-m-d'),
			  value2 : ''
		   }); 
	  }
	  var toDate =objOfCreateNewFilter.down('datefield[itemId="toDate"]').getValue();
	  if(!Ext.isEmpty(toDate)) { 
		  jsonArray.push({
			  field :'toDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="toDate"]').getValue(),
			  					'Y-m-d'),
			  value2 : ''
		   }); 
	  }
	  
	  var statusCombo = objOfCreateNewFilter.down( 'combobox[itemId="statusCombo"]' ).getValue();
		if( !Ext.isEmpty(statusCombo)  && statusCombo != 'All' )
		{
			jsonArray.push(
			{
				field : 'statusCombo',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="statusCombo"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if( FilterCodeVal && !Ext.isEmpty( FilterCodeVal ) )
			objJson.filterCode = FilterCodeVal;
		return objJson;
	  },
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;

		var jsonArray = [];

		var fileName = objOfCreateNewFilter.down('textfield[itemId="fileName"]').getValue();
		if (!Ext.isEmpty(fileName)) {
			jsonArray.push({
				field : 'fileName',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down('textfield[itemId="fileName"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		
		var userName = objOfCreateNewFilter.down('textfield[itemId="userName"]').getValue();
		if (!Ext.isEmpty(userName)) {
			jsonArray.push({
						field : 'userName',
						operator : 'lk',
						value1 : objOfCreateNewFilter.down('textfield[itemId="userName"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var fromDate = objOfCreateNewFilter.down('datefield[itemId="fromDate"]').getValue();
		  if(!Ext.isEmpty(fromDate)) { 
			  jsonArray.push({
				  field :'fromDate',
				  operator :'eq',
				  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="fromDate"]').getValue(),'Y-m-d'),
				  value2 : '',
				  dataType: 1,
				  displayType:5});
	    }
		  
	 var toDate = objOfCreateNewFilter.down('datefield[itemId="toDate"]').getValue();
		  if(!Ext.isEmpty(toDate)) { 
			  jsonArray.push({
				  field :'toDate',
				  operator :'eq',
				  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="toDate"]').getValue(),'Y-m-d'),
				  value2 : '',
				  dataType: 1,
				  displayType:5});
	    }
	  var statusCombo = objOfCreateNewFilter.down( 'combobox[itemId="statusCombo"]' ).getValue();
		if( !Ext.isEmpty( statusCombo )  && statusCombo != 'All')
		{
			jsonArray.push(
			{
				field : 'statusCombo',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="statusCombo"]' ).getValue(),
				value2 : ''
			} );
		}
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="userName"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="fromDate"]').reset();
		objCreateNewFilterPanel.down('datefield[itemId="toDate"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="statusCombo"]').reset();
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="userName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="fromDate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="toDate"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="statusCombo"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="userName"]').setReadOnly(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setReadOnly(boolVal);
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down('label[itemId="errorLabel"]');
		objErrorLabel.setText(getLabel('filterCodeLength', 'The max length of Filter Name is 20'));
		objErrorLabel.show();
	}
});