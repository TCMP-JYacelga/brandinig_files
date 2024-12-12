Ext.define( 'GCP.view.InstrumentInqCreateNewAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInqCreateNewAdvFilter',
	requires : [],
	callerParent : null,
	width : 470,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
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
				}
			]
		} );

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
				xtype : 'textfield',
				itemId : 'instrumentNmbr',
				fieldLabel : getLabel( 'lblinstrumentcheckno', 'Item No.' ),
				labelCls :'ux_font-size14',
				labelWidth : 150

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
						value : 'Operator',
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
						fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount',
						allowBlank : true,
						itemId : 'instrumentAmount',
						hideTrigger : true
					}
				]
			},
			{
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
			},
			{
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
			{
				xtype : 'textfield',
				itemId : 'rtn',
				fieldLabel : getLabel( 'lblRTN', 'RTN' ),
				labelCls : 'ux_font-size14',
				cls : 'ux_extralargemargin-top',
				labelWidth : 150
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

		var instrumentNmbr = objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue();
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

		var amount = objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue();
		if( !Ext.isEmpty( amount ) )
		{

			jsonArray.push(
			{
				field : 'instrumentAmount',
				operator : objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue(),
				value1 : objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue(),
				value2 : ''
			} );
		}

		var depositDate = objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' ).getValue();
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

		var depositAccount = objOfCreateNewFilter.down( 'textfield[itemId="depositAccount"]' ).getValue();
		if( !Ext.isEmpty( depositAccount ) )
		{
			jsonArray.push(
			{
				field : 'depositAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="depositAccount"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var itemType = objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue();
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
		
		var rtn = objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue();
		if( !Ext.isEmpty( rtn ) )
		{
			jsonArray.push(
			{
				field : 'rtn',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue(),
				value2 : ''
			} );
		}

		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if( FilterCodeVal && !Ext.isEmpty( FilterCodeVal ) )
			objJson.filterCode = filterCode;
		return objJson;
	},

	getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
	{
		var objJson = null;

		var jsonArray = [];

		var instrumentNmbr = objOfCreateNewFilter.down( 'textfield[itemId="instrumentNmbr"]' ).getValue();
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

		var amount = objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue();
		var amtOptr = objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue();
		if( !Ext.isEmpty( amount ) && !Ext.isEmpty( amtOptr ) && amtOptr != 'Operator' )
		{
			jsonArray.push(
			{
				field : 'instrumentAmount',
				operator : objOfCreateNewFilter.down( 'combobox[itemId="rangeCombo"]' ).getValue(),
				value1 : objOfCreateNewFilter.down( 'numberfield[itemId="instrumentAmount"]' ).getValue(),
				value2 : '',
				dataType : 2,
				displayType : 2
			} );

		}

		var depositDate = objOfCreateNewFilter.down( 'datefield[itemId="depositDate"]' ).getValue();
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

		var depositAccount = objOfCreateNewFilter.down( 'textfield[itemId="depositAccount"]' ).getValue();
		if( !Ext.isEmpty( depositAccount ) )
		{
			jsonArray.push(
			{
				field : 'depositAccount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="depositAccount"]' ).getValue(),
				value2 : '',
				dataType : 0,
				displayType : 5
			} );
		}
		
		var itemType = objOfCreateNewFilter.down( 'textfield[itemId="instrumentStatus"]' ).getValue();
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
		
		var rtn = objOfCreateNewFilter.down( 'textfield[itemId="rtn"]' ).getValue();
		if( !Ext.isEmpty( rtn ) )
		{
			jsonArray.push(
			{
				field : 'rtn',
				operator : 'eq',
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
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentNmbr"]' ).reset();
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).reset();
		objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="depositAccount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentNmbr"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'label[itemId="amtLabel"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="depositAccount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentNmbr"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="depositAccount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
	}
} );
