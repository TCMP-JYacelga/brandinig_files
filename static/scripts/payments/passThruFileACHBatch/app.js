var objPassThruACHBatchView = null;
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
	appFolder : 'static/scripts/payments/passThruFileACHBatch/app',
	requires :
	[
		'GCP.view.PassThruFileACHBatchView'
	],
	controllers :
	[
		'GCP.controller.PassThruFileACHBatchController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objPassThruACHBatchView = Ext.create( 'GCP.view.PassThruFileACHBatchView',
		{
			renderTo : 'passThruFileACHBatchDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objPassThruACHBatchView ) )
	{
		objPassThruACHBatchView.hide();
		objPassThruACHBatchView.show();
	}
}
