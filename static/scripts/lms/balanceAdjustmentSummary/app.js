var objbalanceAdjustmentSummaryView = null;
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
	appFolder : 'static/scripts/lms/balanceAdjustmentSummary/app',
	requires :
	[
		'GCP.view.BalanceAdjustmentSummaryView'
	],
	controllers :
	[
		'GCP.controller.BalanceAdjustmentSummaryController'
	],
	launch : function()
	{
		objbalanceAdjustmentSummaryView = Ext.create( 'GCP.view.BalanceAdjustmentSummaryView',
		{
			renderTo : 'balanceAdjustmentSummaryView'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objbalanceAdjustmentSummaryView ) )
	{
		objbalanceAdjustmentSummaryView.hide();
		objbalanceAdjustmentSummaryView.show();
	}
}
