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
	appFolder : 'static/scripts/lms/agreementFlexibleDtl/app',
	requires :
	[
		'GCP.view.AgreementFlexibleDtlView'
	],
	controllers :
	[
		'GCP.controller.AgreementFlexibleDtlController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objAgreementMstView = Ext.create( 'GCP.view.AgreementFlexibleDtlView',
		{
			renderTo : 'agreementFlexibleDtlDiv'
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
