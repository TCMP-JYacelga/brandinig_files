var objMainView = null;

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
	appFolder : 'static/scripts/commonmst/bankAdminUser/app',
	requires :
	[
		'GCP.view.BankAdminUserView'
	],
	controllers :
	[
		'GCP.controller.BankAdminUserController'
	],
	launch : function()
	{
		objMainView = Ext.create( 'GCP.view.BankAdminUserView',
		{
			renderTo : 'bankAdminUserDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objMainView ) )
	{
		objMainView.hide();
		objMainView.show();
	}
}
