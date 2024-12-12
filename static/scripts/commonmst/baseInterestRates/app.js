var objBaseInterestRatesView = null;
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
	appFolder : 'static/scripts/commonmst/baseInterestRates/app',
	requires :
	[
		'GCP.view.BaseInterestRatesView'
	],
	controllers :
	[
		'GCP.controller.BaseInterestRatesController'
	],
	launch : function()
	{
		objBaseInterestRatesView = Ext.create( 'GCP.view.BaseInterestRatesView',
		{
			renderTo : 'baseInterestRatesDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objBaseInterestRatesView ) )
	{
		objBaseInterestRatesView.hide();
		objBaseInterestRatesView.show();
	}
}
