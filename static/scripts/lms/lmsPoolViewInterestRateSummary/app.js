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
	appFolder : 'static/scripts/lms/lmsPoolViewInterestRateSummary/app',
	requires :
	[
		'GCP.view.PoolViewInterestSummaryView'
	],
	controllers :
	[
		'GCP.controller.PoolViewDebitInterestController','GCP.controller.PoolViewCreditInterestController',
		'GCP.controller.PoolViewAppDebitInterestController','GCP.controller.PoolViewAppCreditInterestController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.PoolViewInterestSummaryView',
		{
			renderTo : 'summaryDiv'
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
