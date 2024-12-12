Ext.define( 'GCP.view.LoanCenterLoanDrawdownPopupView',
{
	extend : 'Ext.window.Window',
	xtype : 'loanCenterLoanDrawdownPopupViewType',
	requires :
	[
		'GCP.view.LoanCenterLoanDrawdownCreateView'
	],
	width : 450,
	height : 350,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'loanDrawdownRequest', 'Loan Drawdown request' );
		me.items =
		[
			{
				xtype : 'loanCenterLoanDrawdownCreateViewType',
				callerParent : me.parent
			}
		];
		this.callParent( arguments );
	}
} );
