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
	appFolder : 'static/scripts/lms/agreementHybridDtl/app',
	requires :
	[
		'GCP.view.AgreementHybridDtlView'
	],
	controllers :
	[
		'GCP.controller.AgreementHybridDtlController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objAgreementMstView = Ext.create( 'GCP.view.AgreementHybridDtlView',
		{
			renderTo : 'agreementHybridDtlDiv'
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
