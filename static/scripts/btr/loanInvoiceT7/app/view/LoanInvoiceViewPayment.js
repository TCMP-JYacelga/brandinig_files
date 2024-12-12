Ext.define( 'GCP.view.LoanInvoiceViewPayment',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'loanInvoiceViewPaymentType',
	width : 735,
	resizable : false,
	draggable : false,
	cls:'xn-popup',
	parent : null,
	modal : true,
	title : getLabel( 'viewPayment', 'ViewPayment' ),
	closeAction : 'hide',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls:'t7-grid',
				//title : getLabel( 'viewPayment', 'ViewPayment' ),
				itemId : 'loanInvoiceViewPaymentItemId',
				items :
				[
					{
						xtype : 'container',
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
		this.bbar =
		[
				{
					xtype : 'button',
					id : 'cancelBtn',
					tabIndex : '1',
					cls : 'ft-button ft-button-light',
					text : getLabel( 'btnClose', 'Close' ),
					listeners :
						{
							click :function(btn)
							{
								me.fireEvent( 'closeViewPayPopup', btn );
							},
							keypress :function(btn){
								restrictTabKey(event);
							},
							blur :function(btn){
								autoFocusOnFirstElement(event, 'loanInvoiceViewPaymentItemId', false)
							}
						}
				} 
		];
		this.callParent( arguments );
	}
} );
