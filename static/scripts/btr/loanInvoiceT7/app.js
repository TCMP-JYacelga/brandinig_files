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
	appFolder : 'static/scripts/btr/loanInvoiceT7/app',
	requires :
	[
		'GCP.view.LoanInvoiceView','Ext.ux.data.PagingMemoryProxy'
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
function resizeLoanInvoiceContentPanel()
{
	if( !Ext.isEmpty( objLoanInvoiceView ) )
	{
		objLoanInvoiceView.hide();
		objLoanInvoiceView.show();
		var filterButton=objLoanInvoiceView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeLoanInvoiceContentPanel();
});