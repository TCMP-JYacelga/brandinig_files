Ext.define( 'GCP.view.LoanCenterLoanDrawdownCreateView',
{
	extend : 'Ext.form.Panel',
	xtype : 'loanCenterLoanDrawdownCreateViewType',
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
	standardSubmit : true,
	url : 'newLoanDrawdownRequest.srvc' + "?" + csrfTokenName + "=" + csrfTokenValue,
	initComponent : function()
	{
		var me = this;
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
				cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'parentContainer',
				layout : 'column',
				// margin : 5,
				defaults :
				{
					margin : '3 5 0 5'
				},
				items :
				[
					{
						xtype : 'container',
						columnWidth : 0.50,
						layout : 'vbox',
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'obligationId', 'Obligation ID' ),
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								name : 'loanAccNmbr',
								itemId : 'loanAccNmbrFieldItemId',
								cfgUrl : 'services/userseek/loanCenterLoanAccSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'loanCenterLoanAccSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION', 'CURRENCY'
								]
							},
							{
								xtype : 'container',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'radiogroup',
										matchFieldWidth : true,
										itemId : 'productTypeRadioItemId',
										layout : 'hbox',
										vertical : false,
										columns : 1,
										items :
										[
											{
												boxLabel : getLabel( 'ach', 'ACH' ),
												name : 'productType',
												inputValue : 'GR',
												checked : true
											},
											{
												xtype : 'label',
												width : 10
											},
											{
												boxLabel : getLabel( 'wire', 'Wire' ),
												name : 'productType',
												inputValue : 'LW'
											},
											{
												xtype : 'label',
												width : 10
											},
											{
												boxLabel : getLabel( 'accountTransfer', 'Account Transfer' ),
												name : 'productType',
												inputValue : 'FT'
											}
										]
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'beneCode', 'Receiver' ),
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								name : 'beneCode',
								itemId : 'beneCodeFilterItemId',
								cfgUrl : 'services/userseek/loanCenterReceiverSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'loanCenterReceiverSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							},
							{
								xtype : 'textfield',
								matchFieldWidth : true,
								width : 150,
								fieldStyle : 'text-align: right;',
								name : 'requestedAmnt',
								itemId : 'requestedAmntFieldItemId',
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								fieldLabel : getLabel( 'amount', 'Amount' )
							},
							{
								xtype : 'textfield',
								matchFieldWidth : true,
								width : 150,
								name : 'requestReference',
								itemId : 'requestReferenceFieldItemId',
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								fieldLabel : getLabel( 'reference', 'Reference' )
								
							}
						]
					},
					{
						xtype : 'container',
						columnWidth : 0.50,
						layout : 'vbox',
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'productType', 'Product (of type account transfer)' ),
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								name : 'productCode',
								itemId : 'productCodeFieldItemId',
								cfgUrl : 'services/userseek/loanCenterMyProductSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgExtraParams : [{key : '$filtercode1', value : "GR"}],
								cfgRecordCount : -1,
								cfgSeekId : 'loanCenterMyProductSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE'
							},
							{
								xtype : 'datefield',
								matchFieldWidth : true,
								width : 152,
								name : 'scheduledStrDate',
								itemId : 'scheduledDateFieldItemId',
								editable : false,
								fieldLabel : getLabel( 'scheduledDate', 'Date' ),
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								fieldCls : 'xn-valign-middle xn-form-text',
								allowBlank : true,
								hideTrigger : true
							//labelWidth : 150
							},
							{
								xtype : 'hidden',
								name : 'paymentType',
								value : 'D'
							},
							{
								xtype : 'hidden',
								name : 'paymentSubType',
								value : 'D'
							},
							{
								xtype : 'hidden',
								name : 'paymentCcy',
								itemId : 'paymentCcyFieldItemId'
							},
							{
								xtype : 'hidden',
								name : 'debitCcy',
								itemId : 'debitCcyFieldItemId'
							}
						]
					}
				]
			},
			{
				xtype : 'label',
				cls : 'page-heading-bottom-border',
				width : 420,
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
						cls : 'xn-button',
						text : getLabel( 'btnSave', 'Save' ),
						itemId : 'saveBtnItemId',
						handler : function( btn )
						{
							var form = this.up( 'form' ).getForm();
							if( form.isValid() )
							{
								form.submit(
								{
									success : function( form, action )
									{
										Ext.Msg.alert( 'Success', action.result.msg );
									},
									failure : function( form, action )
									{
										Ext.Msg.alert( 'Failed', action.result.msg );
									}
								} );
							}

							/*
							if( me.callerParent == 'loanCenterViewType' )
							{
								me.fireEvent( 'handleSaveDrawdownAction', btn );
							}
							*/
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'loanCenterViewType' )
							{
								me.fireEvent( 'closeLoanDrawdownViewPopup', btn );
							}
						}
					}
				]
			}
		];

		this.callParent( arguments );
	}
} );
