Ext.define('GCP.view.LoanInvoicePayPaymentPopup', {
	extend : 'Ext.window.Window',
	xtype : 'loanInvoiceNewPaymentPopupType',
	requires : ['GCP.view.LoanInvoicePayPayment'],
	width : 500,
	height : 350,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;

		this.title = getLabel('createNewInvoicePayment', 'New Loan Invoice Payment');
		me.items = [
						{
							xtype : 'loanInvoiceNewPaymentType',
							callerParent : me.parent
						}
		           ];

		this.callParent(arguments);
	}
});