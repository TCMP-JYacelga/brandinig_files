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
	appFolder : 'static/scripts/commonmst/currencyRateMst/detail/app',
	//	appFolder : 'app',
	requires :
	[
		'GCP.view.CurrencyRateDtlView'
	],
	controllers :
	[
		'GCP.controller.CurrencyRateDtlController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.CurrencyRateDtlView',
		{
			renderTo : 'currencyRateDtlDiv'
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
