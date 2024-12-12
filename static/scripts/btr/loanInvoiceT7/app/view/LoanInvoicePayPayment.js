Ext.define( 'GCP.view.LoanInvoicePayPayment',
{
	extend : 'Ext.form.Panel',
	xtype : 'loanInvoiceNewPaymentType',
	requires : 
		[
	       'Ext.ux.gcp.AutoCompleter'
	    ],
	callerParent : null,
	//width : 480,
	layout :
	{
		type : 'vbox'
	},
	standardSubmit : true,
	url : 'newLoanInvoicePaymentRequest.srvc',
	initComponent : function()
	{
		var me = this;
		this.items =
			[
				{
					xtype : 'hidden',
					name : csrfTokenName,
					value : csrfTokenValue
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
							columnWidth : 0.33,
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
									xtype : 'label',
									itemId : 'loanAccountLbl',
									padding : '0 0 20 0',
									fieldLabel : getLabel( 'loanAccount', 'Loan A/C' ),
									labelWidth : 150
								},
								{
									xtype : 'label',
									itemId : 'invoiceLbl',
									padding : '0 0 20 0',
									fieldLabel : getLabel( 'invoiceForInstallmet', 'Invoice For Installment/Interest #' ),
									labelWidth : 150
								},
								{
									xtype : 'container',
									layout : 'hbox',
									margin : '0 80 0 0',
									items :
									[
										 {
											xtype : 'textfield',
											itemId : 'currentAmt',
											fieldLabel : getLabel( 'currentAmtLbl', 'Current Amount :' ),
											labelWidth : 100,
											margin : '0 0 0 0',
											readOnly : true,
											fieldStyle: 'text-align: right;',
											fieldCls : 'w8'
										 }
									]
								},
								{
									xtype : 'container',
									layout : 'hbox',
									margin : '0 80 0 0',
									items :
									[
										 {
											xtype : 'textfield',
											itemId : 'pastAmountDue',
											fieldLabel : getLabel( 'pastAmountDueLbl', 'Past Amount Due :' ),
											labelWidth : 100,
											margin : '0 0 0 0',
											readOnly : true,
											fieldStyle: 'text-align: right;',
											fieldCls : 'w8'
										 }
									]	 
									
								},
								{
									xtype : 'label',
									cls : 'page-heading-bottom-border',
									width : 250,
									padding : '4 0 0 0'
								},
								{
									xtype : 'container',
									layout : 'hbox',
									margin : '0 80 0 0',
									items :
									[
										 {
											xtype : 'textfield',
											itemId : 'totalAmount',
											fieldLabel : getLabel( 'totalAmountLbl', 'Total Amount :' ),
											labelWidth : 100,
											align:'right',
											margin : '0 0 0 0',
											readOnly : true,
											fieldStyle: 'text-align: right;',
											fieldCls : 'w8 '
										 }
									]	 
								},
								{
									xtype : 'label',
									itemId : 'spaceId',
									labelWidth : 150
								}
							]
						}
					]
				},
				{
					xtype : 'container',
					columnWidth : 0.33,
					layout : 'hbox',
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
							fieldLabel : getLabel( "debitAccount", "Account(Debit)" ),
							padding : '0 60 0 0',
							name : 'debitAccount',
							itemId : 'debitAccount',
							cfgUrl : 'services/userseek/debitAccountSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'debitAccountSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE'
						},
						{
							xtype : 'textfield',
							itemId : 'amountId',
							name : 'paymentAmount',
							fieldLabel : getLabel( 'amount', 'Amount' ),
							labelWidth : 150
						},
						{
							xtype : 'textfield',
							itemId : 'accountNumber',
							name :'accountNumber',
							hidden : true
						},
						{
							xtype : 'textfield',
							itemId : 'invoiceNumber',
							name :'invoiceNumber',
							hidden : true
						},
						{
							xtype : 'textfield',
							itemId : 'routingNumber',
							name :'routingNumber',
							hidden : true
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
						cls : 'xn-button',
						text : getLabel( 'btnSubmit', 'Submit' ),
						itemId : 'submitBtn',
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
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'loanInvoiceNewViewType' )
							{
								me.fireEvent( 'closeNewPaymentPopup', btn );
							}
						}
					}
				]
			}
		];

		this.callParent( arguments );
	}
} );
