Ext.define( 'GCP.view.LoanInvoiceViewPayment',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'loanInvoiceViewPaymentType',
	width : 800,
	parent : null,
	modal : true,
	title : getLabel( 'viewPayment', 'ViewPayment' ),
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				cls : 'ux_border-bottom',
				width : '100%',
				//title : getLabel( 'viewPayment', 'ViewPayment' ),
				itemId : 'loanInvoiceViewPaymentItemId',
				items :
				[
					{
						xtype : 'container',
						padding : '0 0 0 0',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								text : '',
								flex : 1
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
					padding : '0 0 10 700',
					dock : 'bottom',
					items :
					[
						{
							xtype : 'button',
							cls : 'ux_button-background-color ux_button-padding',
							glyph : 'xf056@fontawesome',
							text : getLabel( 'btnClose', 'Close' ),
							itemId : 'cancelBtn',
							handler : function( btn )
							{
								me.fireEvent( 'closeViewPayPopup', btn );
							}
						}
					]
				}
			];
		this.callParent( arguments );
	}
} );
