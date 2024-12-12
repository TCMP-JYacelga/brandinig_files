var objAgreementSweepQueryResultView = null;
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
	appFolder : 'static/scripts/lms/agreementSweepQueryResult/app',
	requires :
	[
		'GCP.view.AgreementSweepQueryResult'
	],
	controllers :
	[
		'GCP.controller.AgreementSweepQueryResultController'
	],
	launch : function()
	{
		objAgreementSweepQueryResultView = Ext.create( 'GCP.view.AgreementSweepQueryResult',
		{
			renderTo : 'agreementSweepQueryResultDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objAgreementSweepQueryResultView ) )
	{
		objAgreementSweepQueryResultView.hide();
		objAgreementSweepQueryResultView.show();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
