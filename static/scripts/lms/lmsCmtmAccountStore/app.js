var objLmsCmtmAccountStoreView = null;

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
	appFolder : 'static/scripts/lms/lmsCmtmAccountStore/app',
	requires :
	[
		'GCP.view.LmsCmtmAccountStoreView'
	],
	controllers :
	[
		'GCP.controller.LmsCmtmAccountStoreController'
	],
	launch : function()
	{
		objLmsCmtmAccountStoreView = Ext.create( 'GCP.view.LmsCmtmAccountStoreView',
		{
			renderTo : 'lmsCmtmAccountStoreDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objLmsCmtmAccountStoreView ) )
	{
		objLmsCmtmAccountStoreView.hide();
		objLmsCmtmAccountStoreView.show();
	}
}
