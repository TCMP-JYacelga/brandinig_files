Ext.define( 'GCP.view.InstrumentInqCreateNewAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInqCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 500,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;

		var depAccStore = Ext.create('Ext.data.Store', {
			fields : ["depositAccount", "depositAccount"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'depositItemAccountList.srvc'+ '?' + csrfTokenName + '=' + csrfTokenValue,
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.txnlist'
				}
			}
		});			
		
		var rangeStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "gt",
					"value" : "Greater Than"
				},
				{
					"key" : "lt",
					"value" : "Less Than"
				},
				{
					"key" : "eq",
					"value" : "Equal"
				}, {
					"key" : "bt",
					"value" : "Between"
				}
			]
		} );
		var stringRangeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "",
						"value" : "All"
					}, {
						"key" : "in",
						"value" : "In"
					}, {
						"key" : "bt",
						"value" : "Between"
					}]
		});
		var itnRangeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "",
						"value" : "All"
					}, {
						"key" : "bw",
						"value" : "Begins With"
					}, {
						"key" : "ct",
						"value" : "Contains"
					}, {
						"key" : "en",
						"value" : "Ends"
					}, {
						"key" : "eq",
						"value" : "Equal"
					}]
		});	
		
		if(sysParamMultiAcc=='Y')
		{
			this.items =
				[
					{
						xtype : 'label',
						cls : 'red',
						itemId : 'errorLabel',
						height : 10,
						hidden : true
					},
					{
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
					},					
					 
					{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items :
						[
							{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel( 'lblamount', 'Item Amount' ) + ':',
								cls :'ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							},
							{
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
								listeners :
								{
									change : function( combo, newValue, oldValue )
									{
										me.fireEvent( "handleRangeFieldsShowHide", newValue === 'bt' ? true : false );
									}
								}
							},
							{
								xtype : 'numberfield',
								fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
								allowBlank : true,
								itemId : 'instrumentAmount',
								padding : '0 8 0 0',
								hideTrigger : true
							},
							{
								xtype : 'numberfield',
								fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
								allowBlank : true,
								itemId : 'instrumentAmount1',
								hidden : true
							}
						]
					},
		/*			{
						xtype : 'datefield',
						itemId : 'depositDate',
						fieldLabel : getLabel( 'lbldepositdate', 'Deposit Date' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'depositAccount',
						fieldLabel : getLabel( 'lbldepositAccount', 'Deposit Account' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},*/
					  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblItemSeqNo', 'Item Sequence Number'),
									cls : 'black ux_font-size14',
									width : 156,
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
													"handleSequenceRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}										
								},
								{
									xtype : 'textfield',
									itemId : 'instrumentSeqNmbr',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'instrumentSeqNmbr1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  },			
		/*		{
						xtype : 'textfield',
						itemId : 'instrumentStatus',
						fieldLabel : getLabel( 'lblItemType', 'Item Type' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'debitAccount',
						fieldLabel : getLabel( 'lblDebitAccount', 'Debit Account' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
		*/			
					
				  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [
						         {
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel( 'lblRTN', 'Item RTN/ABA' ),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo4',
									store : itnRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0'										
								},		  
								{
									xtype : 'textfield',
									itemId : 'rtn',
									fieldCls : 'xn-form-text w8',
									labelWidth : 150
								} ]
				     },
					{
						xtype : 'textfield',
						itemId : 'filterCode',
						fieldLabel : getLabel( 'filterName', 'Filter Name' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'label',
						text : getLabel( 'note', 'Note : This will also include static filters' ),
						cls : 'ux_font-size14-normal',
						//flex : 1,
						padding : '12 0 7 0'
					},

					{
						xtype : 'label',
						cls : 'page-heading-bottom-border',
						width : '100%',
						padding : '4 0 0 0'
					}
				];			
		}
		else
		{
			this.items =
				[
					{
						xtype : 'label',
						cls : 'red',
						itemId : 'errorLabel',
						height : 10,
						hidden : true
					},{
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
					},	
					{
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
									itemId : 'depSlipNmbr',		
									padding : '0 8 0 0',								
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'depSlipNmbr1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
					  },
					  {
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
					{
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items :
						[
							{
								xtype : 'label',
								itemId : 'amtLabel',
								text : getLabel( 'lblamount', 'Item Amount' ) + ':',
								cls :'ux_font-size14',
								width : 156,
								padding : '4 0 0 0'
							},
							{
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
								listeners :
								{
									change : function( combo, newValue, oldValue )
									{
										me.fireEvent( "handleRangeFieldsShowHide", newValue === 'bt' ? true : false );
									}
								}
							},
							{
								xtype : 'numberfield',
								fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
								allowBlank : true,
								itemId : 'instrumentAmount',
								padding : '0 8 0 0',
								hideTrigger : true
							},
							{
								xtype : 'numberfield',
								fieldCls : 'xn-valign-middle xn-form-text w8 xn-field-amount',
								allowBlank : true,
								itemId : 'instrumentAmount1',
								hidden : true
							}
						]
					},
		/*			{
						xtype : 'datefield',
						itemId : 'depositDate',
						fieldLabel : getLabel( 'lbldepositdate', 'Deposit Date' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'depositAccount',
						fieldLabel : getLabel( 'lbldepositAccount', 'Deposit Account' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},*/
					  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [{
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel('lblItemSeqNo', 'Item Sequence Number'),
									width : 156,
									cls : '',
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
													"handleSequenceRangeFieldsShowHide",
													newValue === 'bt'
															? true
															: false);
										}
									}										
								},
								{
									xtype : 'textfield',
									itemId : 'instrumentSeqNmbr',	
									padding : '0 8 0 0',	
									fieldCls : 'xn-form-text w8'
								},
								{
									xtype : 'textfield',
									itemId : 'instrumentSeqNmbr1',									
									fieldCls : 'xn-form-text w8',
									hidden : true
								}]
				  },			
		/*		{
						xtype : 'textfield',
						itemId : 'instrumentStatus',
						fieldLabel : getLabel( 'lblItemType', 'Item Type' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'debitAccount',
						fieldLabel : getLabel( 'lblDebitAccount', 'Debit Account' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
		*/			
					
				  {
						xtype : 'panel',
						layout : 'hbox',
						margin : '12 0 0 0',
						items : [
						         {
									xtype : 'label',
									itemId : 'amtLabel',
									text : getLabel( 'lblRTN', 'Item RTN/ABA' ),
									cls : 'black ux_font-size14',
									width : 156,
									padding : '4 0 0 0'
								}, 
								 {
									xtype : 'combobox',
									width : 88,
									displayField : 'value',
									itemId : 'stringRangeCombo4',
									store : itnRangeStore,
									valueField : 'key',
									fieldCls : 'xn-form-field w6 inline_block',
									triggerBaseCls : 'xn-form-trigger',
									value : 'All',
									padding : '0 8 0 0'										
								},		  
								{
									xtype : 'textfield',
									itemId : 'rtn',
									fieldCls : 'xn-form-text w8',
									labelWidth : 150
								} ]
				     },
					{
						xtype : 'textfield',
						itemId : 'filterCode',
						fieldLabel : getLabel( 'filterName', 'Filter Name' ),
						labelCls : 'ux_font-size14',
						cls : 'ux_extralargemargin-top',
						labelWidth : 150
					},
					{
						xtype : 'label',
						text : getLabel( 'note', 'Note : This will also include static filters' ),
						cls : 'ux_font-size14-normal',
						//flex : 1,
						padding : '12 0 7 0'
					},

					{
						xtype : 'label',
						cls : 'page-heading-bottom-border',
						width : '100%',
						padding : '4 0 0 0'
					}
				];			
		}
		


		this.dockedItems =
		[
			{
			
			xtype : 'container',
					//height : 10,
					dock : 'top',
					items : [{
								xtype : 'label',
								cls : 'red',
								itemId : 'errorLabel',
								hidden : true
							}]
				},
				{
				xtype : 'toolbar',
				padding : '8 0 0 0',
				dock : 'bottom',
				items :
				['->',
					
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel( 'btnSearch', 'Search' ),
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'instrumentInqStdView' )
							{
								me.fireEvent( 'handleSearchAction', btn );
							}
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel( 'btnSaveAndSearch', 'Save and Search' ),
						itemId : 'saveAndSearchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'instrumentInqStdView' )
							{
								me.fireEvent( 'handleSaveAndSearchAction', btn );
							}

						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'instrumentInqStdView' )
							{
								me.fireEvent( 'closeFilterPopup', btn );
							}

						}
					}
				,'->']
				}]

		this.callParent(arguments);
	},

	getAdvancedFilterValueJson : function( FilterCodeVal, objOfCreateNewFilter )
	{
		var objJson = null;
		var jsonArray = [];

		var depSlipNmbr = objOfCreateNewFilter
		.down('textfield[itemId="depSlipNmbr"]').getValue();
		var depSlipNmbrOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo1"]').getValue();
		var slipNmbrvalue2 = '';
		var depSlipNmbr2 = objOfCreateNewFilter.down('textfield[itemId="depSlipNmbr1"]').getValue();
		if(!Ext.isEmpty(depSlipNmbr2))
		{
			slipNmbrvalue2 = depSlipNmbr2;
		}	
		if (!Ext.isEmpty(depSlipNmbr)) {
			jsonArray.push({
				field : 'depSlipNmbr',
				operator : depSlipNmbrOperator,
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depSlipNmbr"]').getValue(),
				value2 : slipNmbrvalue2
			});
		}	
		
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
		
/*		var instrumentNmbr = objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue();
		if( !Ext.isEmpty( instrumentNmbr ) )
		{
			jsonArray.push(
			{
				field : 'instrumentNmbr',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue(),
				value2 : ''
			} );
		}
*/
		var amount = objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue();
		var amount2 = objOfCreateNewFilter.down('numberfield[itemId="instrumentAmount1"]').getValue();
		var amountvalue2 = '';
		if(!Ext.isEmpty(amount2))
		{
			amountvalue2 = amount2;
		}			
		if( !Ext.isEmpty( amount ) )
		{

			jsonArray.push(
			{
				field : 'instrumentAmount',
				operator : objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue(),
				value1 : objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue(),
				value2 : amountvalue2
			} );
		}

/*		var depositDate = objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' ).getValue();
		if( !Ext.isEmpty( depositDate ) )
		{
			jsonArray.push(
			{
				field : 'depositDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''

			} );
		}
*/
		var depositAccount = objOfCreateNewFilter.down( 'textfield[itemId="AccountNo"]' ).getValue();
		if( !Ext.isEmpty( depositAccount ) )
		{
			if('Select'!=objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue())
			{			
				jsonArray.push(
				{
					field : 'depositAccount',
					operator : 'in',
					value1 : objOfCreateNewFilter.down( 'textfield[itemId="AccountNo"]' ).getValue(),
					value2 : ''
				} );
			}
		}
		
/*		var itemType = objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue();
		if( !Ext.isEmpty( itemType ) )
		{
			jsonArray.push(
			{
				field : 'instrumentStatus',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var debitAccount = objOfCreateNewFilter.down( 'textfield[itemId="debitAccount"]' ).getValue();
		if( !Ext.isEmpty( debitAccount ) )
		{
			jsonArray.push(
			{
				field : 'debitAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="debitAccount"]' ).getValue(),
				value2 : ''
			} );
		}		
*/		
		
		var instSeqNo = objOfCreateNewFilter.down('textfield[itemId="instrumentSeqNmbr"]')
		var seqNoOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo3"]').getValue();
		var seqNovalue2 = '';
		var seqNo2 = objOfCreateNewFilter.down('textfield[itemId="instrumentSeqNmbr1"]').getValue();
		if(!Ext.isEmpty(seqNo2))
		{
			seqNovalue2 = seqNo2;
		}			
		if (!Ext.isEmpty(instSeqNo)) {
			jsonArray.push({
						field : 'itemSeqNmbr',
						operator : seqNoOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="instrumentSeqNmbr"]').getValue(),
						value2 : seqNovalue2,
						dataType : 0,
						displayType : 5
					});
		}			
		
		var rtn = objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue();
		var rtnOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo4"]').getValue();
		if( !Ext.isEmpty( rtn ) )
		{
			jsonArray.push(
			{
				field : 'rtn',
				operator : rtnOperator,
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue(),
				value2 : ''
			} );
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
		
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if( FilterCodeVal && !Ext.isEmpty( FilterCodeVal ) )
			objJson.filterCode = filterCode;
		return objJson;
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
	getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
	{
		var objJson = null;

		var jsonArray = [];
		
		var depSlipNmbr = objOfCreateNewFilter
		.down('textfield[itemId="depSlipNmbr"]').getValue();
		var depSlipNmbrOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo1"]').getValue();
		var slipNmbrvalue2 = '';
		var depSlipNmbr2 = objOfCreateNewFilter.down('textfield[itemId="depSlipNmbr1"]').getValue();
		if(!Ext.isEmpty(depSlipNmbr2))
		{
			slipNmbrvalue2 = depSlipNmbr2;
		}	
		if (!Ext.isEmpty(depSlipNmbr)) {
			jsonArray.push({
				field : 'depSlipNmbr',
				operator : depSlipNmbrOperator,
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="depSlipNmbr"]').getValue(),
				value2 : slipNmbrvalue2
			});
		}	
		
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

/*		var instrumentNmbr = objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue();
		if( !Ext.isEmpty( instrumentNmbr ) )
		{
			jsonArray.push(
			{
				field : 'instrumentNmbr',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			} );
		}
*/
		var amount = objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue();
		var amtOptr = objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue();
		var amount2 = objOfCreateNewFilter.down('numberfield[itemId="instrumentAmount1"]').getValue();
		var amountvalue2 = '';
		if(!Ext.isEmpty(amount2))
		{
			amountvalue2 = amount2;
		}		
		if( !Ext.isEmpty( amount ) && !Ext.isEmpty( amtOptr ) && amtOptr != 'Operator' )
		{
			jsonArray.push(
			{
				field : 'itemAmount',
				operator : objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue(),
				value1 : objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue(),
				value2 : amountvalue2,
				dataType : 2,
				displayType : 2
			} );

		}

/*		var depositDate = objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' ).getValue();
		if( !Ext.isEmpty( depositDate ) )
		{
			jsonArray.push(
			{
				field : 'depositDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : '',
				dataType : 1,
				displayType : 6
			} );
		}
*/
		var depositAccount = objOfCreateNewFilter.down( 'textfield[itemId="AccountNo"]' ).getValue();
		if( !Ext.isEmpty( depositAccount ) )
		{
			if('Select'!=objOfCreateNewFilter.down('textfield[itemId="AccountNo"]').getValue())
			{			
				jsonArray.push(
				{
					field : 'depositAccount',
					operator : 'in',
					value1 : objOfCreateNewFilter.down( 'textfield[itemId="AccountNo"]' ).getValue(),
					value2 : '',
					dataType : 0,
					displayType : 5
				} );
			}
		}
		
/*		var itemType = objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue();
		if( !Ext.isEmpty( itemType ) )
		{
			jsonArray.push(
			{
				field : 'instrumentStatus',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue(),
				value2 : '',
				dataType : 0,
				displayType : 5
			} );
		}
		
		var debitAccount = objOfCreateNewFilter.down( 'textfield[itemId="debitAccount"]' ).getValue();
		if( !Ext.isEmpty( debitAccount ) )
		{
			jsonArray.push(
			{
				field : 'debitAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="debitAccount"]' ).getValue(),
				value2 : '',
				dataType : 0,
				displayType : 5
			} );
		}
		
*/		
		var instSeqNo = objOfCreateNewFilter.down('textfield[itemId="instrumentSeqNmbr"]')
		var seqNoOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo3"]').getValue();
		var seqNovalue2 = '';
		var seqNo2 = objOfCreateNewFilter.down('textfield[itemId="instrumentSeqNmbr1"]').getValue();
		if(!Ext.isEmpty(seqNo2))
		{
			seqNovalue2 = seqNo2;
		}			
		if (!Ext.isEmpty(instSeqNo)) {
			jsonArray.push({
						field : 'itemSeqNmbr',
						operator : seqNoOperator,
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="instrumentSeqNmbr"]').getValue(),
						value2 : seqNovalue2,
						dataType : 0,
						displayType : 5
					});
		}		
		
		var rtn = objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue();
		var rtnOperator = objOfCreateNewFilter.down('combobox[itemId="stringRangeCombo4"]').getValue();
	
		if( !Ext.isEmpty( rtn ) )
		{
			jsonArray.push(
			{
				field : 'rtn',
				operator : rtnOperator,
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue(),
				value2 : '',
				dataType : 0,
				displayType : 5
			} );
		}

		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function( objCreateNewFilterPanel )
	{
		objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).reset();
		//objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).reset();
//		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).reset();
//		objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{		
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'label[itemId="amtLabel"]' ).setDisabled( boolVal );
		//objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).setDisabled( boolVal );
		//objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setDisabled( boolVal );
		//objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).setReadOnly( boolVal );
		//objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).setReadOnly( boolVal );	
		//objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setReadOnly( boolVal );
		//objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
	}
} );
