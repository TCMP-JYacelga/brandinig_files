Ext.define( 'GCP.view.LoanInvoiceCreateAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanInvoiceCreateNewAdvFilterType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	callerParent : null,
	// width : 480,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;

		var statusStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'key', 'value'
				],
				data :
				[
					{
						"key" : "3",
						"value" : "Outstanding"
					},
					{
						"key" : "4",
						"value" : "Submitted"
					},
					{
						"key" : "5",
						"value" : "Paid"
					},
					{
						"key" : "7",
						"value" : "Overdue"
					},
					{
						"key" : "6",
						"value" : "Partial Paid"
					},
					{
						"key" : "2",
						"value" : "Rejected"
					},
					{
						"key" : "1",
						"value" : "For Auth"
					},
					{
						"key" : "1",
						"value" : "For My Auth"
					}
				]
			} );
		
		this.items =
		[
			{
				xtype : 'container',
				//cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'parentContainer',
				layout : 'column',
				// margin : 5,
				items :
				[
					{
						xtype : 'container',
						columnWidth : 0.33,
						cls : 'ux_div-padding',
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
								margin : '20 0 0 0',
								cls : 'red ux_font-size14-normal',
								itemId : 'errorLabel',
								heigth : 10,
								hidden : true
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field  ',
								labelSeparator : '',
								fieldLabel : getLabel( "invoiceNumber", "Invoice Number" ),
								labelCls : 'ux_font-size14',
								fieldCls : 'xn-valign-middle xn-form-text ux_normalmargin-top ux_extralargemargin-bottom w12',
								name : 'InvoiceNumber',
								itemId : 'InvoiceNumber',
								cfgUrl : 'services/userseek/invoiceNumberSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'invoiceNumberSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							},
							{
								xtype : 'datefield',
								itemId : 'InvoiceDueDate',
								editable : false,
								fieldLabel : getLabel( 'invoiceDueDate', 'Payment  Due Date' ),
								labelCls : 'ux_font-size14 ux_no-margin',
								fieldCls : ' xn-valign-middle xn-form-text w12 ux_normalmargin-top ux_extralargemargin-bottom',
								allowBlank : true,
								hideTrigger : true,
								labelWidth : 150
							},
							{
								xtype : 'textfield',
								itemId : 'filterCode',
								fieldLabel : getLabel( 'filterName', 'Filter Name' ),
								labelCls : 'ux_font-size14 ux_no-margin',
								fieldCls : ' xn-form-text w12 ux_normalmargin-top ux_extralargemargin-bottom',
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
						cls : 'ux_div-padding',
						margin : '0 0 0 60',
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
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelCls : 'ux_font-size14',
								fieldCls : 'xn-form-text w12 ux_normalmargin-top ux_extralargemargin-bottom',
								labelSeparator : '',
								fieldLabel : getLabel( "obligationIdAct", "Obligation Id" ),
								//width : 168,
								name : 'ObligationIdAct',
								itemId : 'ObligationIdAct',
								cfgUrl : 'services/userseek/obligationIdActSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'obligationIdActSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCRIPTION',
								cfgKeyNode : 'CODE'
							},
							{
								xtype : 'container',
								layout : 'vbox',
								margin : '0 0 0 0',
								items :
								[
									{
										xtype : 'label',
										itemId : 'StatusLbl',
										text : getLabel( 'status', 'Status' ),
										cls : 'ux_font-size14 ux_no-margin'
										//width : 156
									},
									{
										xtype : 'combobox',
										editable : false,
										displayField : 'value',
										itemId : 'Status',
										store : statusStore,
										valueField : 'key',
										width : 168,
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										value : 'All',
										listeners :
										{
											change : function( combo, newValue, oldValue )
											{
												me.fireEvent( "handleRangeFieldsShowHide", newValue === 'bt' ? true
													: false );
											}
										}
									}
								]
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
					'->',
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('btnSearch', 'Search'),
						//margin : '0 10 0 0',
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'loanInvoiceNewViewType' )
							{
								me.fireEvent( 'handleSearchActionGridView', btn );
							}
							else if( me.callerParent == 'loanInvoicestdView' )
							{
								me.fireEvent( 'handleSearchAction', btn );
							}
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						//margin : '0 10 0 0',
						text : getLabel( 'btnSaveAndSearch', 'Save and Search' ),
						itemId : 'saveAndSearchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'loanInvoiceNewViewType' )
							{
								me.fireEvent( 'handleSaveAndSearchGridAction', btn );
							}
							else if( me.callerParent == 'loanInvoicestdView' )
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
							if( me.callerParent == 'loanInvoiceNewViewType' )
							{
								me.fireEvent( 'closeGridViewFilterPopup', btn );
							}
							else if( me.callerParent == 'loanInvoicestdView' )
							{
								me.fireEvent( 'closeFilterPopup', btn );
							}

						}
					},'->'
				]
			}
		];

		this.callParent( arguments );
	},
	getAdvancedFilterValueJson : function( FilterCodeVal, objOfCreateNewFilter )
	{
		var objJson = null;
		var jsonArray = [];

		var invoiceNumber = objOfCreateNewFilter.down( 'textfield[itemId="InvoiceNumber"]' ).getValue();
		if( !Ext.isEmpty( invoiceNumber ) )
		{
			jsonArray.push(
			{
				field : 'InvoiceNumber',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="InvoiceNumber"]' ).getValue(),
				value2 : ''
			} );
		}

		var obligationIdAct = objOfCreateNewFilter.down( 'textfield[itemId="ObligationIdAct"]' ).getValue();
		if( !Ext.isEmpty( obligationIdAct ) )
		{
			jsonArray.push(
			{
				field : 'ObligationIdAct',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="ObligationIdAct"]' ).getValue(),
				value2 : ''
			} );
		}

		var invoiceDueDate = objOfCreateNewFilter.down( 'datefield[itemId="InvoiceDueDate"]' ).getValue();
		if( !Ext.isEmpty( invoiceDueDate ) )
		{
			jsonArray.push(
			{
				field : 'InvoiceDueDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="InvoiceDueDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : ''
			} );
		}

		var status = objOfCreateNewFilter.down( 'combobox[itemId="Status"]' ).getValue();
		if( !Ext.isEmpty( status ) && status != 'All' )
		{
			jsonArray.push(
			{
				field : 'Status',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="Status"]' ).getValue(),
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

		var invoiceNumber = objOfCreateNewFilter.down( 'textfield[itemId="InvoiceNumber"]' ).getValue();
		if( !Ext.isEmpty( invoiceNumber ) )
		{
			jsonArray.push(
			{
				field : 'InvoiceNumber',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="InvoiceNumber"]' ).getValue(),
				value2 : ''
			} );
		}

		var ObligationIdAct = objOfCreateNewFilter.down( 'textfield[itemId="ObligationIdAct"]' ).getValue();
		if( !Ext.isEmpty( ObligationIdAct ) )
		{
			jsonArray.push(
			{
				field : 'ObligationIdAct',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="ObligationIdAct"]' ).getValue(),
				value2 : ''
			} );
		}

		var invoiceDueDate = objOfCreateNewFilter.down( 'datefield[itemId="InvoiceDueDate"]' ).getValue();
		if( !Ext.isEmpty( invoiceDueDate ) )
		{
			jsonArray.push(
			{
				field : 'InvoiceDueDate',
				operator : 'eq',
				value1 : Ext.util.Format.date( objOfCreateNewFilter.down( 'datefield[itemId="InvoiceDueDate"]' )
					.getValue(), 'Y-m-d' ),
				value2 : '',
				dataType: 1,
				displayType:5
			} );
		}

		var status = objOfCreateNewFilter.down( 'combobox[itemId="Status"]' ).getValue();
		if( !Ext.isEmpty( status ) && status != 'All' )
		{
			jsonArray.push(
			{
				field : 'Status',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="Status"]' ).getValue(),
				value2 : ''
			} );
		}
		
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function( objCreateNewFilterPanel )
	{
		objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'textfield[itemId="InvoiceNumber"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="ObligationIdAct"]' ).reset();
		objCreateNewFilterPanel.down( 'datefield[itemId="InvoiceDueDate"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="Status"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="InvoiceNumber"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="ObligationIdAct"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="InvoiceDueDate"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="Status"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="InvoiceNumber"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="ObligationIdAct"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="InvoiceDueDate"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="Status"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
		objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
		objErrorLabel.show();
	}
} );
