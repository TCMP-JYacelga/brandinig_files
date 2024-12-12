Ext.define( 'GCP.view.LoanCenterLoanRepaymentPopupView',
{
	extend : 'Ext.window.Window',
	xtype : 'loanCenterLoanRepaymentPopupViewType',
	requires :
	[
		'GCP.view.LoanCenterLoanRepaymentCreateView'
	],
	width : 405,
	height : 330,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'loanRepaymentRequest', 'Loan Repayment request' );
		me.items =
		[
			{
				xtype : 'loanCenterLoanRepaymentCreateViewType',
				callerParent : me.parent
			}
		];
		this.callParent( arguments );
	}
} );
