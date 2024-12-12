Ext.define( 'GCP.view.LoanCenterAdvFilterCreateView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanCenterAdvFilterCreateViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	callerParent : null,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		var comboBoxStore;
		
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

		if( isSiTabSelected == 'Y' )
		{
			comboBoxStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'key', 'value'
				],
				data :
				[
					{
						"key" : "0.N",
						"value" : getLabel( 'lblAuth', 'Pending Approval' )
					},
					{
						"key" : "0.N.A",
						"value" : getLabel( 'lblMyAuth', 'Pending My Approval' )
					},
					{
						"key" : "1.Y",
						"value" : getLabel( 'lblModified', 'Modified' )
					},
					{
						"key" : "2.N",
						"value" : getLabel( 'lblDiscarded', 'Discarded' )
					},
					{
						"key" : "3.Y",
						"value" : getLabel( 'lblActive', 'Active' )
					},
					{
						"key" : "3.N",
						"value" : getLabel( 'lblActive', 'Disabled' )
					},
					{
						"key" : "4.N",
						"value" : getLabel( 'lblEnableRequest', 'Enable Request' )
					},
					{
						"key" : "5.Y",
						"value" : getLabel( 'lblDisableRequest', 'Disable Request' )
					},
					{
						"key" : "7.N",
						"value" : getLabel( 'lblNewRejected', 'New Rejected' )
					},
					{
						"key" : "8.Y",
						"value" : getLabel( 'lblModifyRejected', 'Modify Rejected' )
					},
					{
						"key" : "9.Y",
						"value" : getLabel( 'lblDisableReqRejected', 'Disable Request Rejected' )
					},
					{
						"key" : "9.N",
						"value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
					}
				]
			} );
		}
		else
		{
			comboBoxStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'key', 'value'
				],
				data :
				[
					{
						"key" : "0",
						"value" : getLabel( 'lblAuth', 'For Auth' )
					},
					{
						"key" : "0.A",
						"value" : getLabel( 'lblMyAuth', 'For My Auth' )
					},
					{
						"key" : "1",
						"value" : getLabel( 'lblModified', 'Modified' )
					},
					{
						"key" : "2",
						"value" : getLabel( 'lblDiscarded', 'Discarded' )
					},
					{
						"key" : "3",
						"value" : getLabel( 'lblPending', 'Awaiting Response' )
					},
					{
						"key" : "4",
						"value" : getLabel( 'lblRejected', 'Rejected' )
					},
					{
						"key" : "5",
						"value" : getLabel( 'lblHostSubmitted', 'Host - Submitted' )
					},
					{
						"key" : "6",
						"value" : getLabel( 'lblHostFailed', 'Host - Failed' )
					},
					{
						"key" : "7",
						"value" : getLabel( 'lblHostRejected', 'Host - Rejected' )
					},
					{
						"key" : "8",
						"value" : getLabel( 'lblHostProcessed', 'Processed' )
					}

				]
			} );
		}

		this.items =
		[
			{
				xtype : 'label',
				cls : 'red',
				itemId : 'errorLabelItemId',
				heigth : 10,
				hidden : true
			},

			{
				xtype : 'container',
				//cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'parentContainer',
				layout : 'column',
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
								xtype : 'textfield',
								matchFieldWidth : true,
								cls : 'ux_paddingb',
								fieldCls : 'xn-form-text w12 x-form-empty-field ',
								itemId : 'requestReferenceFilterItemId',
								fieldLabel : getLabel( 'reference', 'Reference' )
							// labelWidth : 150
							},
							{
								xtype : 'AutoCompleter',
								cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								margin : '18 0 0 0',
								itemId : 'obligorIDFilterItemId',
								name : 'obligorIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel : getLabel( 'loanObligorID', 'Obligor ID' ),
								cfgUrl : 'services/userseek/loanCenterClientObligorIDSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'obligorIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'DESCRIPTION',
								cfgDataNode1 : 'CODE',
								cfgStoreFields:['CODE','DESCRIPTION']
							},
							{
								xtype : 'textfield',
								margin : '18 0 0 0',
								matchFieldWidth : true,
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								cls : 'ux_paddingb',
								itemId : 'accountNameFilterItemId',
								fieldLabel : getLabel( 'accName', 'Account Name' ),
								// labelWidth : 150,
								maxLength : 20,
								enforceMaxLength : true,
								enableKeyEvents : true
							},
							{
								xtype : 'panel',
								// layout : 'hbox',
								margin : '18 0 0 0',
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'requestStatus', 'Status' ),
										cls : 'ux_font-size14'
									},
									{
										xtype : 'combobox',
										editable : false,
										padding : '6 0 0 0',
										width : 168,
										matchFieldWidth : true,
										displayField : 'value',
										itemId : 'requestStatusFilterItemId',
										store : comboBoxStore,
										valueField : 'key',
										fieldCls : 'xn-form-field  inline_block',
										triggerBaseCls : 'xn-form-trigger',
										value : 'All'
									}
								]
							}
						]
					},
					{
						xtype : 'container',
						cls : 'ux_div-padding',
						columnWidth : 0.33,
						margin : '0 0 0 60',
						layout : 'vbox',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'textfield',
								matchFieldWidth : true,
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								cls : 'ux_paddingb',
								itemId : 'filterCodeFilterItemId',
								fieldLabel : getLabel( 'filterName', 'Filter Name' ),
								// labelWidth : 150,
								maxLength : 20,
								enforceMaxLength : true,
								enableKeyEvents : true
							},
							{
								xtype : 'AutoCompleter',
								margin : '18 0 0 0',
								cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								itemId : 'obligationIDFilterItemId',
								name : 'obligationIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel : getLabel( 'loanObligationID', 'Obligation ID' ),
								cfgUrl : 'services/userseek/loanCenterClientObligationIDSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'obligationIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'DESCRIPTION',
								cfgDataNode1 : 'CODE',
								cfgStoreFields:['CODE','DESCRIPTION']
							},/*
							{
								xtype : 'textfield',
								margin : '18 0 0 0',
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								cls : 'ux_paddingb',
								itemId : 'requestedAmntFilterItemId',
								fieldLabel : getLabel( 'accAmount', 'Amount' ),
								// labelWidth : 150,
								maxLength : 20,
								enforceMaxLength : true,
								enableKeyEvents : true
							},*/
							{
								xtype : 'panel',
								layout : 'vbox',
								margin : '13 0 0 0',
								items : [{
											xtype : 'label',
											itemId : 'amtLabel',
											text : getLabel( 'accAmount', 'Amount' ),
											cls : 'frmLabel',
											width : 105,
											padding : '0 0 0 0'
										}, {xtype : 'panel',
											layout : 'hbox',
											margin : '1 0 0 0',
											items : [{
														xtype : 'combobox',
														editable : false,
														width : 34,
														displayField : 'value',
														itemId : 'operatorAmntFilterItemId',
														store : rangeStore,
														valueField : 'key',
														fieldCls : 'xn-form-field w2 inline_block',
														triggerBaseCls : 'xn-form-trigger',
														value : 'eq',
														padding : '0 8 0 0'
													}, {
														xtype : 'numberfield',
														fieldCls : 'xn-valign-middle xn-form-text w9 xn-field-amount',
														allowBlank : true,
														itemId : 'requestedAmntFilterItemId',
														hideTrigger : true,
														maxLength : 20,
														enforceMaxLength : true,
														enableKeyEvents : true
													}]
										}]
							}
						]
					}
				]
			},

			{
				xtype : 'label',
				text : getLabel( 'note', 'Note : This will also include static filters' ),
				cls : 'ux_font-size14-normal',
				// flex : 1,
				padding : '9 0 7 0'
			},
			{
				xtype : 'label',
				cls : 'page-heading-bottom-border',
				width : 520,
				padding : '4 0 0 0'
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
						glyph : 'xf002@fontawesome',
						text : getLabel( 'btnSearch', 'Search' ),
						itemId : 'searchBtnItemId',
						handler : function( btn )
						{
							if( me.callerParent == 'loanCenterViewType' )
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
						text : getLabel( 'btnSaveAndSearch', 'Save and Search' ),
						itemId : 'saveAndSearchBtnItemId',
						handler : function( btn )
						{
							if( me.callerParent == 'loanCenterViewType' )
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
						itemId : 'cancelBtnItemId',
						handler : function( btn )
						{
							if( me.callerParent == 'loanCenterViewType' )
							{
								me.fireEvent( 'closeGridViewAdvFilterPopup', btn );
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

		var referenceFilter = objOfCreateNewFilter.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( referenceFilter ) )
		{
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var obligorIDFilter = objOfCreateNewFilter.down( 'combobox[itemId="obligorIDFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( obligorIDFilter ) )
		{
			jsonArray.push(
			{
				field : 'obligorID',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="obligorIDFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var accNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="accountNameFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( accNameFilter ) )
		{
			jsonArray.push(
			{
				field : 'accountName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="accountNameFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var loanAccountFilter = objOfCreateNewFilter.down( 'combobox[itemId="obligationIDFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( loanAccountFilter ) )
		{
			jsonArray.push(
			{
				field : 'obligationID',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="obligationIDFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var loanAmount = objOfCreateNewFilter.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( loanAmount ) )
		{
			var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="operatorAmntFilterItemId"]' )
						.getValue();
			jsonArray.push(
			{
				field : 'requestedAmnt',
				operator : amountOptFilter,
				value1 : loanAmount,
				value2 : ''
			} );
		}

		var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="requestStatusFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
		{
			jsonArray.push(
			{
				field : 'requestStatus',
				operator : 'eq',
				value1 : statusFilter,
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

		if( isSiTabSelected == 'Y' )
		{
			jsonArray.push(
			{
				field : 'siEnabled',
				operator : 'eq',
				value1 : isSiTabSelected,
				value2 : ''
			} );
		}

		var referenceFilter = objOfCreateNewFilter.down( 'textfield[itemId="requestReferenceFilterItemId"]' )
			.getValue();
		if( !Ext.isEmpty( referenceFilter ) )
		{
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var obligorIDFilter = objOfCreateNewFilter.down( 'combobox[itemId="obligorIDFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( obligorIDFilter ) )
		{
			jsonArray.push(
			{
				field : 'obligorID',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="obligorIDFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var accNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="accountNameFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( accNameFilter ) )
		{
			jsonArray.push(
			{
				field : 'accountName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="accountNameFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var loanAccountFilter = objOfCreateNewFilter.down( 'combobox[itemId="obligationIDFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( loanAccountFilter ) )
		{
			jsonArray.push(
			{
				field : 'obligationID',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="obligationIDFilterItemId"]' ).getValue(),
				value2 : ''
			} );
		}

		var loanAmount = objOfCreateNewFilter.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).getValue();
		if( !Ext.isEmpty( loanAmount ) )
		{
			var amountOptFilter = objOfCreateNewFilter.down( 'combobox[itemId="operatorAmntFilterItemId"]' )
						.getValue();
			jsonArray.push(
			{
				field : 'requestedAmnt',
				operator : amountOptFilter,
				value1 : loanAmount,
				value2 : ''
			} );
		}

		var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="requestStatusFilterItemId"]' ).getValue();

		if( isSiTabSelected == 'Y' )
		{
			if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
			{
				var temp = statusFilter.split( "." );
				jsonArray.push(
				{
					field : 'siRequestState',
					operator : 'eq',
					value1 : temp[ 0 ],
					value2 : ''
				} );
				jsonArray.push(
				{
					field : 'siValidFlag',
					operator : 'eq',
					value1 : temp[ 1 ],
					value2 : ''
				} );
				if( temp.length == 3 )
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER,
						value2 : ''
					} );
				}

			}
		}
		else
		{
			if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
			{
				if( statusFilter == '0.A' )
				{
					var temp = statusFilter.split( "." );
					jsonArray.push(
					{
						field : 'requestStatus',
						operator : 'eq',
						value1 : temp[ 0 ],
						value2 : ''
					} );

					jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER,
						value2 : ''
					} );
				}
				else
				{
					jsonArray.push(
					{
						field : 'requestStatus',
						operator : 'eq',
						value1 : statusFilter,
						value2 : ''
					} );
				}
			}
		}

		objJson = jsonArray;
		return objJson;
	},

	resetAllFields : function( objCreateNewFilterPanel )
	{
		objCreateNewFilterPanel.down( 'label[itemId="errorLabelItemId"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="obligorIDFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="accountNameFilterItemId"]' ).reset();

		objCreateNewFilterPanel.down( 'combobox[itemId="obligationIDFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="operatorAmntFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="requestStatusFilterItemId"]' ).reset();
	},

	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="obligorIDFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="accountNameFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="obligationIDFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="operatorAmntFilterItemId"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="requestStatusFilterItemId"]' ).setDisabled( boolVal );
	},

	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="obligorIDFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="accountNameFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="obligationIDFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).setReadOnly( boolVal );
		//objCreateNewFilterPanel.down( 'combobox[itemId="operatorAmntFilterItemId"]' ).setReadOnly( boolVal );
		//objCreateNewFilterPanel.down( 'combobox[itemId="requestStatusFilterItemId"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setReadOnly( boolVal );
	},

	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down( 'label[itemId="errorLabelItemId"]' );
		objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
		objErrorLabel.show();
	}
} );
