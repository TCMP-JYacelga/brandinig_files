Ext.define( 'GCP.view.LoanInvoiceViewInfo',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'loanInvoiceViewInfoType',
	width : 400,
	//height : 420,
	parent : null,
	modal : true,
	title : getLabel( 'viewInvoice', 'View Record' ),
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				itemId : 'loanInvoiceViewInfoItemId',
				items :
				[
					{
						xtype : 'textfield',
						itemId : 'ViewLoanAccount',
						fieldLabel : getLabel( 'loanAccountDesc', 'Loan Account' ),
						labelCls : 'ux_font-size14',
						labelWidth : 150,
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewLoanAccountName',
						fieldLabel : getLabel( 'loanAccountName', 'Account Name' ),
						labelWidth : 150,
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewInvoiceNumber',
						fieldLabel : getLabel( 'invoiceNumber', 'Invoice Number' ),
						labelWidth : 150,
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewDueDate',
						fieldLabel : getLabel( 'DueDate', 'Due Date' ),
						labelWidth : 150,
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewRouting',
						fieldLabel : getLabel( 'Routing', 'Routing#' ),
						labelWidth : 150,
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewCurrentAmountDue',
						fieldLabel : getLabel( 'CurrentAmountDue', 'Current Amount Due' ),
						labelWidth : 150,
						margin : '0 0 12 10',
						fieldStyle: 'text-align: right;',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewPastAmountDue',
						fieldLabel : getLabel( 'PastAmountDue', 'Past Amount Due' ),
						labelWidth : 150,
						fieldStyle: 'text-align: right;',
						margin : '0 0 12 10',
						editable : false,
						disabled: true
					},
					{
						xtype : 'textfield',
						labelCls : 'ux_font-size14',
						itemId : 'ViewTotalAmountDue',
						fieldLabel : getLabel( 'TotalAmountDue', 'Total Amount Due' ),
						labelWidth : 150,
						margin : '10 10 10 10',
						fieldStyle: 'text-align: right;',
						editable : false,
						disabled: true
					}
				]
			}	
		];
		this.dockedItems =
			[
				{
					xtype : 'toolbar',
					padding : '10 10 10 280',
					dock : 'bottom',
					items :
					[
						{
							xtype : 'button',
							itemId : 'btnCancel',
							text : 'Cancel',
							cls : 'ux_button-background-color ux_button-padding',
							glyph : 'xf056@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								me.close();
							}
						}
					]
				}
			];
		this.callParent( arguments );
	}
	
} );
