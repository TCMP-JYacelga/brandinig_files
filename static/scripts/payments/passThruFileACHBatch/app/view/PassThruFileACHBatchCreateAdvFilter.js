Ext.define( 'GCP.view.PassThruFileACHBatchCreateAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'passThruFileACHBatchCreateNewAdvFilterType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	callerParent : null,
	//width : 550,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		var transactionTypeStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "200",
					"value" : "Mixed"
				},
				{
					"key" : "220",
					"value" : "Credit"
				},
				{
					"key" : "225",
					"value" : "Debit"
				}
			]
		} );

		var batchTypeStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'key', 'value'
				],
				data :
				[
					{
						"key" : "PPD",
						"value" : "PPD"
					},
					{
						"key" : "CCD",
						"value" : "CCD"
					},
					{
						"key" : "CTX",
						"value" : "CTX"
					},
					{
						"key" : "TEL",
						"value" : "TEL"
					},
					{
						"key" : "WEB",
						"value" : "WEB"
					}
				]
			} );
		this.items =
		[
			{
				xtype : 'container',
				cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'parentContainer',
				layout : 'column',
				items :
				[
					{
						xtype : 'container',
						columnWidth : 0.33,
						layout : 'vbox',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'label',
								cls : 'red ux_font-size14-normal',
								itemId : 'errorLabel',
								height : 10,
								hidden : true
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'companyId', 'Company Id' ),
								fieldCls : 'w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								name : 'companyId',
								itemId : 'companyId',
								cfgUrl : 'services/userseek/companyIdSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'companyIdSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							},
							{
								xtype : 'container',
								layout : 'vbox',
								margin : '12 0 12 0',
								items :
								[
									{
										xtype : 'label',
										cls : 'ux_font-size14',
										itemId : 'batchTypeLbl',
										text : getLabel( 'batchType', 'Batch Type' )
									},
									{
										xtype : 'combobox',
										displayField : 'value',
										itemId : 'batchType',
										store : batchTypeStore,
										valueField : 'key',
										width : 196,
										fieldCls : 'xn-form-field inline_block ux_smallmargin-top',
										triggerBaseCls : 'xn-form-trigger ux_smallmargin-top',
										value : 'ALL'
									}
								]
							},
							{
								xtype : 'datefield',
								itemId : 'effectiveEntryDate',
								editable : false,
								fieldLabel : getLabel( 'effectiveEntryDate', 'Effective Entry Date' ),
								labelCls : 'ux_font-size14',
								fieldCls : 'xn-valign-middle xn-form-text w14 ux_smallmargin-top',
								cls : 'ux_extralargemargin-bottom',
								allowBlank : true,
								hideTrigger : true,
								labelWidth : 150
							},
							{
								xtype : 'textfield',
								itemId : 'totalCrAmt',
								labelCls : 'ux_font-size14',
								fieldLabel : getLabel( 'totalCrAmt', 'Total Credit Amount' ),
								fieldCls : 'w14 ux_smallmargin-top',
								cls : 'ux_extralargemargin-bottom',
								labelWidth : 150
							},
							{
								xtype : 'textfield',
								itemId : 'customerName',
								fieldLabel : getLabel( 'customerName', 'Customer Name' ),
								fieldCls : 'w14 ux_smallmargin-top',
								cls : 'ux_extralargemargin-bottom',
								labelCls : 'ux_font-size14',
								labelWidth : 150
							},
							{
								xtype : 'textfield',
								itemId : 'filterCode',
								fieldLabel : getLabel( 'filterName', 'Filter Name' ),
								fieldCls : 'w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								labelWidth : 150,
								maxLength : 20,
								enforceMaxLength : true,
								enableKeyEvents : true,
								listeners :
								{
									keypress : function( text )
									{
										if( text.value.length === 20 )
											me.showErrorMsg();
									}
								}
							}
						]
					},
					{
						xtype : 'container',
						padding : '0 0 0 36',
						columnWidth : 0.33,
						layout : 'vbox',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'label',
								cls : 'red ux_font-size14-normal',
								itemId : 'errorLabeltext',
								heigth : 10,
								hidden : true
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								fieldCls : 'w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								labelSeparator : '',
								fieldLabel : getLabel( 'companyName', 'Company Name' ),
								name : 'companyName',
								itemId : 'companyName',
								cfgUrl : 'services/userseek/companyNameSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgExtraParams : [{key : '$filtercode1', value : ""}],
								cfgRecordCount : -1,
								cfgSeekId : 'companyNameSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							},
							{
								xtype : 'container',
								layout : 'vbox',
								margin : '12 0 12 0',
								items :
								[
									{
										xtype : 'label',
										itemId : 'transactionTypeLbl',
										text : getLabel( 'transactionType', 'Transaction Type' ),
										cls : 'ux_font-size14'
									},
									{
										xtype : 'combobox',
										displayField : 'value',
										itemId : 'transactionType',
										store : transactionTypeStore,
										valueField : 'key',
										fieldCls : 'xn-form-field inline_block ux_smallmargin-top',
										triggerBaseCls : 'xn-form-trigger ux_smallmargin-top',
										value : 'ALL',
										width : 196
									}
								]
							},
							{
								xtype : 'datefield',
								itemId : 'processDate',
								editable : false,
								fieldLabel : getLabel( 'processDate', 'Process Date' ),
								cls : 'ux_extralargemargin-bottom',
								fieldCls : 'xn-valign-middle xn-form-text w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								allowBlank : true,
								hideTrigger : true,
								labelWidth : 150
							},
							{
								xtype : 'textfield',
								fieldCls : 'w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								itemId : 'totalDrAmt',
								fieldLabel : getLabel( 'totalDrAmt', 'Total Debit Amount' ),
								cls : 'ux_extralargemargin-bottom',
								labelWidth : 150
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								fieldCls : 'w14 ux_smallmargin-top',
								labelCls : 'ux_font-size14',
								labelSeparator : '',
								fieldLabel : getLabel( 'sendingAccount', 'Sending Account' ),
								name : 'sendingAccount',
								itemId : 'sendingAccount',
								cfgUrl : 'services/userseek/sendingAccountSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgExtraParams : [{key : '$filtercode1', value : fileId}],
								cfgRecordCount : -1,
								cfgSeekId : 'sendingAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							}
						]
					}
				]
			}
		];

		this.dockedItems =
		[
			{
				xtype : 'toolbar',
				padding : '10 0 0 0',
				dock : 'bottom',
				items :
				[
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('btnSearch', 'Search'),
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'passThruFileACHBatchViewType' )
							{
								me.fireEvent( 'handleSearchActionGridView', btn );
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
							if( me.callerParent == 'passThruFileACHBatchViewType' )
							{
								me.fireEvent( 'handleSaveAndSearchGridAction', btn );
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
							if( me.callerParent == 'passThruFileACHBatchViewType' )
							{
								me.fireEvent( 'closeGridViewFilterPopup', btn );
							}
						}
					}
				]
			}
		];

		this.callParent( arguments );
	},
	getAdvancedFilterValueJson : function( FilterCodeVal, objOfCreateNewFilter )
	{
		var objJson = null;
		var jsonArray = [];

		var companyId = objOfCreateNewFilter.down( 'textfield[itemId="companyId"]' ).getValue();
		if( !Ext.isEmpty( companyId ) )
		{
			jsonArray.push(
			{
				field : 'companyId',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="companyId"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var batchType = objOfCreateNewFilter.down( 'combobox[itemId="batchType"]' ).getValue();
		if( !Ext.isEmpty( batchType ) && batchType != 'ALL' )
		{
			alert(4);
			jsonArray.push(
			{
				field : 'batchType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="batchType"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var effectiveEntryDate = objOfCreateNewFilter.down( 'datefield[itemId="effectiveEntryDate"]' ).getValue();
		if( !Ext.isEmpty( effectiveEntryDate ) )
		{
			jsonArray.push(
			{
				field : 'effectiveEntryDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="effectiveEntryDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''
			} );
		}
		
		var totalCrAmt = objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmt"]' ).getValue();
		if( !Ext.isEmpty( totalCrAmt ) )
		{
			jsonArray.push(
			{
				field : 'totalCrAmt',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmt"]' ).getValue(),
				value2 : ''
			} );
		}

		var customerName = objOfCreateNewFilter.down( 'textfield[itemId="customerName"]' ).getValue();
		if( !Ext.isEmpty( customerName ) )
		{
			jsonArray.push(
			{
				field : 'customerName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="customerName"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var companyName = objOfCreateNewFilter.down( 'textfield[itemId="companyName"]' ).getValue();
		if( !Ext.isEmpty( companyName ) )
		{
			jsonArray.push(
			{
				field : 'companyName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="companyName"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var transactionType = objOfCreateNewFilter.down( 'combobox[itemId="transactionType"]' ).getValue();
		if( !Ext.isEmpty( transactionType ) && transactionType != 'ALL' )
		{
			alert(3);
			jsonArray.push(
			{
				field : 'transactionType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="transactionType"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var processDate = objOfCreateNewFilter.down( 'datefield[itemId="processDate"]' ).getValue();
		if( !Ext.isEmpty( processDate ) )
		{
			jsonArray.push(
			{
				field : 'processDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="processDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''
			} );
		}
		
		var totalDrAmt = objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmt"]' ).getValue();
		if( !Ext.isEmpty( totalDrAmt ) )
		{
			jsonArray.push(
			{
				field : 'totalDrAmt',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmt"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var sendingAccount = objOfCreateNewFilter.down( 'textfield[itemId="sendingAccount"]' ).getValue();
		if( !Ext.isEmpty( sendingAccount ) )
		{
			jsonArray.push(
			{
				field : 'sendingAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="sendingAccount"]' ).getValue(),
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
	getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
	{
		var objJson = null;

		var jsonArray = [];

		var companyId = objOfCreateNewFilter.down( 'textfield[itemId="companyId"]' ).getValue();
		if( !Ext.isEmpty( companyId ) )
		{
			jsonArray.push(
			{
				field : 'companyId',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="companyId"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var batchType = objOfCreateNewFilter.down( 'combobox[itemId="batchType"]' ).getValue();
		if( !Ext.isEmpty( batchType ) && batchType != 'ALL' )
		{
			alert(2);
			jsonArray.push(
			{
				field : 'batchType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="batchType"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var effectiveEntryDate = objOfCreateNewFilter.down( 'datefield[itemId="effectiveEntryDate"]' ).getValue();
		if( !Ext.isEmpty( effectiveEntryDate ) )
		{
			jsonArray.push(
			{
				field : 'effectiveEntryDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="effectiveEntryDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''
			} );
		}
		
		var totalCrAmt = objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmt"]' ).getValue();
		if( !Ext.isEmpty( totalCrAmt ) )
		{
			jsonArray.push(
			{
				field : 'totalCrAmt',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmt"]' ).getValue(),
				value2 : ''
			} );
		}

		var customerName = objOfCreateNewFilter.down( 'textfield[itemId="customerName"]' ).getValue();
		if( !Ext.isEmpty( customerName ) )
		{
			jsonArray.push(
			{
				field : 'customerName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="customerName"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var companyName = objOfCreateNewFilter.down( 'textfield[itemId="companyName"]' ).getValue();
		if( !Ext.isEmpty( companyName ) )
		{
			jsonArray.push(
			{
				field : 'companyName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="companyName"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var transactionType = objOfCreateNewFilter.down( 'combobox[itemId="transactionType"]' ).getValue();
		alert("transactionType"+transactionType);
		if( !Ext.isEmpty( transactionType ) && transactionType != 'ALL' )
		{
			jsonArray.push(
			{
				field : 'transactionType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="transactionType"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var processDate = objOfCreateNewFilter.down( 'datefield[itemId="processDate"]' ).getValue();
		if( !Ext.isEmpty( processDate ) )
		{
			jsonArray.push(
			{
				field : 'processDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="processDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''
			} );
		}
		
		var totalDrAmt = objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmt"]' ).getValue();
		if( !Ext.isEmpty( totalDrAmt ) )
		{
			jsonArray.push(
			{
				field : 'totalDrAmt',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmt"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var sendingAccount = objOfCreateNewFilter.down( 'textfield[itemId="sendingAccount"]' ).getValue();
		if( !Ext.isEmpty( sendingAccount ) )
		{
			jsonArray.push(
			{
				field : 'sendingAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="sendingAccount"]' ).getValue(),
				value2 : ''
			} );
		}

		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function( objCreateNewFilterPanel )
	{
		objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'textfield[itemId="companyId"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="batchType"]' ).reset();
		objCreateNewFilterPanel.down( 'datefield[itemId="effectiveEntryDate"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmt"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="customerName"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="companyName"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="transactionType"]' ).reset();
		objCreateNewFilterPanel.down( 'datefield[itemId="processDate"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmt"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="sendingAccount"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="companyId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="batchType"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="effectiveEntryDate"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmt"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="customerName"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="companyName"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="transactionType"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="processDate"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmt"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="sendingAccount"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="companyId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="batchType"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="effectiveEntryDate"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmt"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="customerName"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="companyName"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="transactionType"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="processDate"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmt"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="sendingAccount"]' ).setReadOnly( boolVal );
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
		objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
		objErrorLabel.show();
	}
} );
