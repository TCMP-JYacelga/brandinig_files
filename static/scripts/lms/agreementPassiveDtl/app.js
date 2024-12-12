var objAgreementMstView = null;
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
	appFolder : 'static/scripts/lms/agreementPassiveDtl/app',
	requires :
	[
		'GCP.view.AgreementPassiveDtlView'
	],
	controllers :
	[
		'GCP.controller.AgreementPassiveDtlController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objAgreementMstView = Ext.create( 'GCP.view.AgreementPassiveDtlView',
		{
			renderTo : 'agreementPassiveDtlDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objAgreementMstView ) )
	{
		objAgreementMstView.hide();
		objAgreementMstView.show();
	}
}
