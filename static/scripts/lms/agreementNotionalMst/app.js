
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
	appFolder : 'static/scripts/lms/agreementNotionalMst/app',
	requires :
	[
		'GCP.view.AgreementNotionalMstView', 'Ext.form.DateField'
	],
	controllers :
	[
		'GCP.controller.AgreementNotionalMstController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objAgreementNotionalView = Ext.create( 'GCP.view.AgreementNotionalMstView',
		{
			renderTo : 'agreementNotionalMstView'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objAgreementNotionalView ) )
	{
		objAgreementNotionalView.hide();
		objAgreementNotionalView.show();
	}
}
