var objLoanInvoiceView = null;
Ext.Loader.setConfig(
{
	enabled : true,
	disableCaching : false,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );
Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/btr/loanInvoice/app',
	requires :
	[
		'GCP.view.LoanInvoiceView'
	],
	controllers :
	[
		'GCP.controller.LoanInvoiceController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objLoanInvoiceView = Ext.create( 'GCP.view.LoanInvoiceView',
		{
			renderTo : 'loanInvoiceNewDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objLoanInvoiceView ) )
	{
		objLoanInvoiceView.hide();
		objLoanInvoiceView.show();
	}
}
