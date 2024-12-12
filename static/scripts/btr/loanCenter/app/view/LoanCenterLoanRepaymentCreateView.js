Ext.define( 'GCP.view.LoanCenterLoanRepaymentCreateView',
{
	extend : 'Ext.form.Panel',
	xtype : 'loanCenterLoanRepaymentCreateViewType',
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
	url : 'newLoanRepaymentRequest.srvc' + "?" + csrfTokenName + "=" + csrfTokenValue,
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
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'accNo', 'Debit A/c' ),
								labelStyle : 'padding-left:10px',
								labelCls : 'required',
								name : 'debitAccNmbr',
								itemId : 'debitAccNmbrFieldItemId',
								cfgUrl : 'services/userseek/loanCenterDebitAccSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'loanCenterDebitAccSeek',
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
										xtype : 'label',
										matchFieldWidth : true,
										//width : 40,
										padding : '3 0 0 10',
										style : 'padding-left:10px',
										cls : 'required',
										text : getLabel( 'amount', 'Amount' )
										
									},
									{
										xtype : 'radiogroup',
										matchFieldWidth : true,
										width : 100,
										itemId : 'amountRadioItemId',
										layout : 'hbox',
										vertical : false,
										columns : 1,
										items :
										[
											{
												boxLabel : getLabel( 'full', 'Full' ),
												name : 'paymentType',
												inputValue : 'F',
												checked : true
											},
											/*{
												xtype : 'label',
												width : 5
											},*/
											{
												boxLabel : getLabel( 'partial', 'Partial' ),
												name : 'paymentType',
												inputValue : 'P'
											}
										]
									}
								]
							},
							{
								xtype : 'textfield',
								matchFieldWidth : true,
								width : 150,
								fieldStyle : 'text-align: right;',
								name : 'requestedAmnt',
								itemId : 'requestedAmntFieldItemId'
							//fieldLabel : getLabel( 'amount', 'Amount' )
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
								cfgExtraParams : [{key : '$filtercode1', value : "FT"}],
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
								name : 'paymentCcy',
								itemId : 'paymentCcyFieldItemId'
							},
							{
								xtype : 'hidden',
								name : 'debitCcy',
								itemId : 'debitCcyFieldItemId'
							},
							{
								xtype : 'hidden',
								name : 'paymentSubType',
								value : 'P'
							},
							{
								xtype : 'hidden',
								name : 'loanAmnt',
								itemId : 'loanAmntFieldItemId'
							}
						]
					}
				]
			},

			{
				xtype : 'label',
				cls : 'page-heading-bottom-border',
				width : 370,
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
								me.fireEvent( 'handleSaveRepaymentAction', btn );
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
								me.fireEvent( 'closeLoanRepaymentViewPopup', btn );
							}
						}
					}
				]
			}
		];

		this.callParent( arguments );
	}
} );
