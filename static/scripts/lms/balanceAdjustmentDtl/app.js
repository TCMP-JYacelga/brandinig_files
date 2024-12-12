var objbalanceAdjustmentDtlView = null;
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
	appFolder : 'static/scripts/lms/balanceAdjustmentDtl/app',
	requires :
	[
		'GCP.view.BalanceAdjustmentDtlView'
	],
	controllers :
	[
		'GCP.controller.BalanceAdjustmentDtlController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objbalanceAdjustmentDtlView = Ext.create( 'GCP.view.BalanceAdjustmentDtlView',
		{
			renderTo : 'balanceAdjustmentDtlView'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objbalanceAdjustmentDtlView ) )
	{
		objbalanceAdjustmentDtlView.hide();
		objbalanceAdjustmentDtlView.show();
	}
}
