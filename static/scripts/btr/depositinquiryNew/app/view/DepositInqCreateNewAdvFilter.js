Ext.define('GCP.view.DepositInqCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'depositInqCreateNewAdvFilter',
	requires : ['Ext.menu.Menu','Ext.button.Button'],
	callerParent : null,
	width : 500,
	cls : 'ux_margin-top-12',
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		
		var depAccStore = Ext.create('Ext.data.Store', {
			fields : ["accountId", "depositAccount"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'depositAccountList.srvc'+ '?' + csrfTokenName + '=' + csrfTokenValue,
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.txnlist'
				}
			}
		});		
		
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
							}, {
								"key" : "bt",
								"value" : "Between"
							}]
				});
		var stringRangeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "all",
						"value" : "All"
					}, {
						"key" : "in",
						"value" : "In"
					}, {
						"key" : "bt",
						"value" : "Between"
					}]
		});		

		if(sysParamMultiAcc=='Y')
		{
			this.items = [{
				xtype : 'label',
				cls : 'red',
				itemId : 'errorLabel',
				height : 10,
				hidden : true
			}, {
				xtype : 'container',
				layout : 'hbox',
				margin : '12 0 0 0',
				itemId : 'sendingAccountContainer',
				items : [{
						xtype : 'label',
						itemId : 'accountNoLabel',
						text : getLabel('lbldepaccount', 'Deposit Account : '),
						width : 156,
						cls : 'ux_font-size14'
					},{
						xtype : 'textfield',
						itemId : 'AccountNo',
						name : 'AccountNo',
						width : 156,
						fieldCls : 'xn-form-field ux_font-size14',
						padding : '0 0 8 0',						
						value : getLabel('select', 'Select')
					}, {
						xtype : 'button',
						border : 0,
						height : 25,
						itemId : 'sendingAccountDropDown',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
						iconCls : 'black',
						glyph : 'xf0d7@fontawesome',
						padding : '6 0 0 0',
						menuAlign : 'tr-br',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'sendingAccountMenu',
									width : 220,
									maxHeight : 200,
									items : []
								})
					}]
			},{
				xtype : 'container',
				layout : 'hbox',
				margin : '6 0 6 0',
				itemId : 'postingDateContainer',
				items : [{
						xtype : 'label',
						text : getLabel('lblPostingDate', 'Posting Date'),
						width : 156,
						cls : 'ux_font-size14'
					},{
						xtype : 'label',
						itemId : 'postingDateLabel',						
						cls : 'ux_font-size14'
					},					
					{
						xtype : 'button',
						border : 0,
						filterParamName : 'postingDate',
						itemId : 'postingDate',// Required
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						padding : '0 0 0 0',
						menu : me.createDateFilterMenu()

					},{
								xtype : 'container',
								layout : 'hbox',
								padding : '0 0 0 10',
								itemId : 'postingDateComp',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponent',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'fromDate',
												hideTrigger : true,
												width : 80,
												fieldCls : 'h2',
												padding : '0 3 0 0',
												editable : false,
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'datefield',
												itemId : 'toDate',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 80,
												fieldCls : 'h2',
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											}
										]
									},
									{
										xtype : 'toolbar',
										itemId : 'dateToolBar',
										cls : 'xn-toolbar-small',
										padding : '2 0 0 1',
										items :
										[
											{
												xtype : 'label',
												itemId : 'dateFilterFrom',
												text : dtApplicationDate
											},
											{
												xtype : 'label',
												itemId : 'dateFilterTo'
											}
										]
									}
								]
							}]
				  },{
					xtype : 'panel',
					layout : 'hbox',
					margin : '12 0 0 0',
					items : [{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel('lbldepositslipno', 'Deposit Ticket'),
								cls : 'black ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							}, 
							 {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'stringRangeCombo1',
								store : stringRangeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'All',
								padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleTicketRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}								
							},
							{
								xtype : 'textfield',
								itemId : 'depositTicketNmbr',		
								padding : '0 8 0 0',								
								fieldCls : 'xn-form-text w8'
							},
							{
								xtype : 'textfield',
								itemId : 'depositTicketNmbr1',									
								fieldCls : 'xn-form-text w8',
								hidden : true
							}]
				  },{
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
								}, {
									xtype : 'numberfield',
									fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
									allowBlank : true,
									itemId : 'depositAmount',
									padding : '0 8 0 0',
									hideTrigger : true
								},
								{
									xtype : 'numberfield',
									itemId : 'depositAmount1',									
									fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
									hidden : true
								}]
					},{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblserNo', 'Serial No'),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo2',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleSerialRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}										
								},
								{
									xtype : 'textfield',
									itemId : 'depSeqNmbr',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'depSeqNmbr1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  }, 	
				  /*{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblStoreId', 'Store Id'),
									cls : 'black',
									width : 156,
									cls : 'ux_font-size14',
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo3',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleStoreIdRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}									
								},
								{
									xtype : 'textfield',
									itemId : 'storeId',			
									padding : '0 8 0 0',		
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'storeId1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  },*/
				  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblLockBoxId', 'Lockbox ID'),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo4',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleLockboxIdRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}									
								},
								{
									xtype : 'textfield',
									itemId : 'lockBoxId',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'lockBoxId1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  }, 				  
				  {
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
		}	
		else
		{
			this.items = [{
				xtype : 'label',
				cls : 'red',
				itemId : 'errorLabel',
				height : 10,
				hidden : true
			}, {
				xtype : 'container',
				layout : 'hbox',
				margin : '12 0 0 0',
				itemId : 'sendingAccountContainer',
				items : [{
						xtype : 'label',
						itemId : 'accountNoLabel',
						text : getLabel('lbldepaccount', 'Deposit Account : '),
						width : 156,
						cls : 'ux_font-size14'
					},
					{
						xtype : 'combo',
						fieldCls : 'xn-form-field inline_block',
						triggerBaseCls : 'xn-form-trigger',
						itemId : 'AccountNo',	
						store : depAccStore,
						valueField : 'depositAccount',
						displayField : 'depositAccount',
						name : 'AccountNo',
						editable : false,
						value : 'All'
					} 
			    ]
			},{
				xtype : 'container',
				layout : 'hbox',
				margin : '6 0 6 0',
				itemId : 'postingDateContainer',
				items : [{
						xtype : 'label',
						text : getLabel('lblPostingDate', 'Posting Date'),
						width : 156,
						cls : 'ux_font-size14'
					},{
						xtype : 'label',
						itemId : 'postingDateLabel',						
						cls : 'ux_font-size14'
					},					
					{
						xtype : 'button',
						border : 0,
						filterParamName : 'postingDate',
						itemId : 'postingDate',// Required
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						padding : '0 0 0 0',
						menu : me.createDateFilterMenu()

					},{
								xtype : 'container',
								layout : 'hbox',
								padding : '0 0 0 10',
								itemId : 'postingDateComp',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponent',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'fromDate',
												hideTrigger : true,
												width : 80,
												fieldCls : 'h2',
												padding : '0 3 0 0',
												editable : false,
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'datefield',
												itemId : 'toDate',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 80,
												fieldCls : 'h2',
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											}
										]
									},
									{
										xtype : 'toolbar',
										itemId : 'dateToolBar',
										cls : 'xn-toolbar-small',
										padding : '2 0 0 1',
										items :
										[
											{
												xtype : 'label',
												itemId : 'dateFilterFrom',
												text : dtApplicationDate
											},
											{
												xtype : 'label',
												itemId : 'dateFilterTo'
											}
										]
									}
								]
							}]
				  },{
					xtype : 'panel',
					layout : 'hbox',
					margin : '12 0 0 0',
					items : [{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel('lbldepositslipno', 'Deposit Ticket'),
								cls : 'black ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							}, 
							 {
								xtype : 'combobox',
								width : 88,
								displayField : 'value',
								itemId : 'stringRangeCombo1',
								store : stringRangeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field w6 inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : 'All',
								padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleTicketRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}								
							},
							{
								xtype : 'textfield',
								itemId : 'depositTicketNmbr',		
								padding : '0 8 0 0',								
								fieldCls : 'xn-form-text w8'
							},
							{
								xtype : 'textfield',
								itemId : 'depositTicketNmbr1',									
								fieldCls : 'xn-form-text w8',
								hidden : true
							}]
				  },{
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
								}, {
									xtype : 'numberfield',
									fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
									allowBlank : true,
									itemId : 'depositAmount',
									padding : '0 8 0 0',
									hideTrigger : true
								},
								{
									xtype : 'numberfield',
									itemId : 'depositAmount1',									
									fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
									hidden : true
								}]
					},{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblserNo', 'Serial No'),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo2',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleSerialRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}										
								},
								{
									xtype : 'textfield',
									itemId : 'depSeqNmbr',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'depSeqNmbr1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  }, 	
				  /*{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblStoreId', 'Store Id'),
									cls : 'black',
									width : 156,
									cls : 'ux_font-size14',
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo3',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleStoreIdRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}									
								},
								{
									xtype : 'textfield',
									itemId : 'storeId',			
									padding : '0 8 0 0',		
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'storeId1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  },*/
				  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblLockBoxId', 'Lockbox ID'),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo4',
									store : stringRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0',
									listeners : {
										change : function(combo, newValue, oldValue) {
											me.fireEvent(
													"handleLockboxIdRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}									
								},
								{
									xtype : 'textfield',
									itemId : 'lockBoxId',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'lockBoxId1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  }, 				  
				  {
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
		}	
		


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
	checkInfinity : function(intFilterDays)
	{
		if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	},	
	createDateFilterMenu : function() {
		var me = this;
		var menu = null;
		var intFilterDays = filterDays ? filterDays : '';
		var arrMenuItem = [];

		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});
		if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});
		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;

	},	
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		
		//Deposit Acc No.
		var depositAccount = objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue();
		if (!Ext.isEmpty(depositAccount)) {
			if('Select'!=objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue())
			{			
				jsonArray.push({
							field : 'depositAccount',
							operator : 'in',
							value1 : objOfCreateNewFilter
									.down('textfield[itemId="AccountNo"]')
									.getValue(),
							value2 : ''
						});
			}
		}
		//Posting Date
		var fromPostingDate = objOfCreateNewFilter
				.down('container[itemId=postingDateComp] label[itemId="dateFilterFrom"]');
		var toPostingDate = objOfCreateNewFilter
				.down('container[itemId=postingDateComp] label[itemId="dateFilterTo"]');

		var fromDate = (!Ext.isEmpty(fromPostingDate.text))
				? (fromPostingDate.text.substring(0, fromPostingDate.text.length
								- 3))
				: objOfCreateNewFilter
						.down('container[itemId=postingDateComp] datefield[itemId="fromDate"]')
						.getValue();
		var toDate = (!Ext.isEmpty(toPostingDate.text))
				? toPostingDate.text
				: objOfCreateNewFilter
						.down('container[itemId=postingDateComp] datefield[itemId="toDate"]')
						.getValue();
		if (!Ext.isEmpty(fromDate)) {
			jsonArray.push({
						field : 'postingDate',
						operator : (!Ext.isEmpty(toDate))
								? 'bt'
								: 'eq',
						value1 : Ext.util.Format.date(fromDate,
								'Y-m-d'),
						value2 : (!Ext.isEmpty(toDate))
								? Ext.util.Format
										.date(toDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}	
		
		//Deposti Ticket
		var depositTicketNmbr = objOfCreateNewFilter
				.down('textfield[itemId="depositTicketNmbr"]').getValue();
		var depositTicketNmbrOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo1"]').getValue();
		var slipNmbrvalue2 = '';
		var depositTicketNmbr2 = objOfCreateNewFilter.down('textfield[itemId="depositTicketNmbr1"]').getValue();
		if(!Ext.isEmpty(depositTicketNmbr2))
		{
			slipNmbrvalue2 = depositTicketNmbr2;
		}	
		if (!Ext.isEmpty(depositTicketNmbr)) {
			jsonArray.push({
				field : 'depositTicketNmbr',
				operator : depositTicketNmbrOperator,
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depositTicketNmbr"]').getValue(),
				value2 : slipNmbrvalue2
			});
		}
		
		//DepositAmount
		var amount = objOfCreateNewFilter.down('numberfield[itemId="depositAmount"]').getValue();
		var amount2 = '';
		var amountVal2 = objOfCreateNewFilter.down('numberfield[itemId="depositAmount1"]').getValue();
		if(!Ext.isEmpty(amountVal2))
		{
			amount2 = amountVal2;
		}		
		if (!Ext.isEmpty(amount)) {
		
			jsonArray.push({
						field : 'depositAmount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="depositAmount"]')
								.getValue(),
						value2 : amount2
					});
		}
		
		// Depo Seq No.
		var serNo = objOfCreateNewFilter.down('textfield[itemId="depSeqNmbr"]').getValue();
		var serNoOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo2"]').getValue();
		var serNovalue2 = '';
		var serNo2 = objOfCreateNewFilter.down('textfield[itemId="depSeqNmbr1"]').getValue();
		if(!Ext.isEmpty(serNo2))
		{
			serNovalue2 = serNo2;
		}			
		if (!Ext.isEmpty(serNo)) {
			jsonArray.push({
						field : 'depSeqNmbr',
						operator : serNoOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="depSeqNmbr"]').getValue(),
						value2 : serNovalue2,
						dataType : 0,
						displayType : 5
					});
		}
			
		//Store ID
		/*var storeId = objOfCreateNewFilter.down('textfield[itemId="storeId"]').getValue();
		var storeIdOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo3"]').getValue();
		var storeIdvalue2 = '';
		var storeId2 = objOfCreateNewFilter.down('textfield[itemId="storeId1"]').getValue();
		if(!Ext.isEmpty(storeId2))
		{
			storeIdvalue2 = storeId2;
		}		
		if (!Ext.isEmpty(storeId)) {
			jsonArray.push({
						field : 'storeId',
						operator : storeIdOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="storeId"]').getValue(),
						value2 : storeIdvalue2,
						dataType : 0,
						displayType : 5
					});
		}*/
		//Lockbox ID
		var lockBoxId = objOfCreateNewFilter.down('textfield[itemId="lockBoxId"]').getValue();
		var lockBoxIdOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo4"]').getValue();
		var lockBoxIdvalue2 = '';
		var lockBoxId2 = objOfCreateNewFilter.down('textfield[itemId="lockBoxId1"]').getValue();
		if(!Ext.isEmpty(lockBoxId2))
		{
			lockBoxIdvalue2 = lockBoxId2;
		}			
		if (!Ext.isEmpty(lockBoxId)) {
			jsonArray.push({
						field : 'lockBoxId',
						operator : lockBoxIdOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="lockBoxId"]').getValue(),
						value2 : lockBoxIdvalue2
					});
		}
		
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = filterCode;
		return objJson;
	},
	setSavedFilterDates : function(objCreateNewFilterPanel, fieldName, data) {
		if (!Ext.isEmpty(fieldName) && !Ext.isEmpty(data)) {
			var dateFilterFromRef = null;
			var dateFilterToRef = null;
			var menuRef = null;
			var dateOperator = data.operator;

			if (fieldName === 'postingDate') {
				dateFilterFromRef = objCreateNewFilterPanel
						.down('container[itemId=postingDateComp] label[itemId="dateFilterFrom"]');
				dateFilterToRef = objCreateNewFilterPanel
						.down('container[itemId=postingDateComp] label[itemId="dateFilterTo"]');
				/*menuRef = objCreateNewFilterPanel
						.down('menu[itemId="creationDateMenu"]');*/

			} 

			//menuRef.setDisabled(menuDisableFlag);
			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterFromRef.setText(formattedFromDate);
					dateFilterFromRef.show();
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterFromRef.setText(formattedFromDate + " - ");
					dateFilterFromRef.show();
				}

				var toDate = data.value2;
				if (!Ext.isEmpty(toDate)) {
					var formattedToDate = Ext.util.Format.date(Ext.Date.parse(
									toDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterToRef.setText(formattedToDate);
					dateFilterToRef.show();
				}
			}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}

	},
	
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;

		var jsonArray = [];
		
		// Account No.
		var acc = objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue();		
		if (!Ext.isEmpty(acc)) {
			if('Select'!=objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue())
			{
				jsonArray.push({
							field : 'depositAccount',
							operator : 'in',
							value1 : objOfCreateNewFilter
									.down('textfield[itemId="AccountNo"]').getValue(),
							value2 : '',
							dataType : 0,
							displayType : 5
						});
			}
		}
		//Dep Ticket Number
		var depositTicketNmbr = objOfCreateNewFilter.down('textfield[itemId="depositTicketNmbr"]').getValue();
		var depositTicketNmbrOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo1"]').getValue();
		var slipNmbrvalue2 = '';
		var depositTicketNmbr2 = objOfCreateNewFilter.down('textfield[itemId="depositTicketNmbr1"]').getValue();
		if(!Ext.isEmpty(depositTicketNmbr2))
		{
			slipNmbrvalue2 = depositTicketNmbr2;
		}			
		if (!Ext.isEmpty(depositTicketNmbr)) {
			jsonArray.push({
				field : 'depositTicketNmbr',
				operator : depositTicketNmbrOperator,
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depositTicketNmbr"]').getValue(),
				value2 : slipNmbrvalue2,
				dataType : 0,
				displayType : 0
			});
		}
		// Deposit Amount
		var amount = objOfCreateNewFilter.down('numberfield[itemId="depositAmount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter
				.down('combobox[itemId="rangeCombo"]').getValue();
		var amount2 = '';
		var amountVal2 = objOfCreateNewFilter.down('numberfield[itemId="depositAmount1"]').getValue();
		if(!Ext.isEmpty(amountVal2))
		{
			amount2 = amountVal2;
		}			
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
						value2 : amount2,
						dataType : 2,
						displayType : 2
					});

		}
		
		//DepSeqNum
		var serNo = objOfCreateNewFilter.down('textfield[itemId="depSeqNmbr"]')
		var serNoOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo2"]').getValue();
		var serNovalue2 = '';
		var serNo2 = objOfCreateNewFilter.down('textfield[itemId="depSeqNmbr1"]').getValue();
		if(!Ext.isEmpty(serNo2))
		{
			serNovalue2 = serNo2;
		}			
		if (!Ext.isEmpty(serNo)) {
			jsonArray.push({
						field : 'depSeqNmbr',
						operator : serNoOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="depSeqNmbr"]').getValue(),
						value2 : serNovalue2,
						dataType : 0,
						displayType : 5
					});
		}
			
		
		//Store ID
		/*var storeId = objOfCreateNewFilter.down('textfield[itemId="storeId"]')
		var storeIdOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo3"]').getValue();
		var storeIdvalue2 = '';
		var storeId2 = objOfCreateNewFilter.down('textfield[itemId="storeId1"]').getValue();
		if(!Ext.isEmpty(storeId2))
		{
			storeIdvalue2 = storeId2;
		}		
		if (!Ext.isEmpty(storeId)) {
			jsonArray.push({
						field : 'storeId',
						operator : storeIdOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="storeId"]').getValue(),
						value2 : storeIdvalue2,
						dataType : 0,
						displayType : 5
					});
		}	*/	
		
		//Lockbox ID
		var lockBoxId = objOfCreateNewFilter.down('textfield[itemId="lockBoxId"]')
		var lockBoxIdOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo4"]').getValue();
		var lockBoxIdvalue2 = '';
		var lockBoxId2 = objOfCreateNewFilter.down('textfield[itemId="lockBoxId1"]').getValue();
		if(!Ext.isEmpty(lockBoxId2))
		{
			lockBoxIdvalue2 = lockBoxId2;
		}			
		if (!Ext.isEmpty(lockBoxId)) {
			jsonArray.push({
						field : 'lockBoxId',
						operator : lockBoxIdOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="lockBoxId"]').getValue(),
						value2 : lockBoxIdvalue2,
						dataType : 0,
						displayType : 5
					});
		}
		
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="depositTicketNmbr"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').reset();
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="depSeqNmbr"]').reset();
		
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('textfield[itemId="depositTicketNmbr"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('label[itemId="amtLabel"]').setDisabled(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="depositTicketNmbr"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="depositAmount"]').setReadOnly(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="lockBoxId"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setReadOnly(boolVal);
	}
});