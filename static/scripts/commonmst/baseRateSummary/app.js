var objbaseRateSummaryView = null;
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
	appFolder : 'static/scripts/commonmst/baseRateSummary/app',
	requires :
	[
		'GCP.view.BaseRateSummaryView'
	],
	controllers :
	[
		'GCP.controller.BaseRateSummaryController'
	],
	launch : function()
	{
		objbaseRateSummaryView = Ext.create( 'GCP.view.BaseRateSummaryView',
		{
			renderTo : 'baseRatesMstDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objbaseRateSummaryView ) )
	{
		objbaseRateSummaryView.hide();
		objbaseRateSummaryView.show();
	}
}
