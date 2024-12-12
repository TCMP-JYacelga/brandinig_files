var objAgreementNotionalDtlView = null;
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
	appFolder : 'static/scripts/lms/agreementNotionalDtl/app',
	requires :
	[
		'GCP.view.AgreementNotionalDtlView'
	],
	controllers :
	[
		'GCP.controller.AgreementNotionalDtlController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objAgreementNotionalDtlView = Ext.create( 'GCP.view.AgreementNotionalDtlView',
		{
			renderTo : 'agreementNotionalDtlView'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objAgreementNotionalDtlView ) )
	{
		objAgreementNotionalDtlView.hide();
		objAgreementNotionalDtlView.show();
	}
}
