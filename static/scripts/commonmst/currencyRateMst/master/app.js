var objProfileView = null;

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
	appFolder : 'static/scripts/commonmst/currencyRateMst/master/app',
	//	appFolder : 'app',
	requires :
	[
		'GCP.view.CurrencyRateMstView'
	],
	controllers :
	[
		'GCP.controller.CurrencyRateMstController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.CurrencyRateMstView',
		{
			renderTo : 'currencyRateMstDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
	}
}
