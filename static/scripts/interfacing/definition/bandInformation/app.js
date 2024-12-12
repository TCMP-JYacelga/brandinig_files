var objBandInfoView = null;
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
	appFolder : 'static/scripts/interfacing/definition/bandInformation',
	requires :
	[
		'GCP.view.BandInfoView'
	],
	controllers :
	[
		'GCP.controller.BandInfoController'
	],
	launch : function()
	{
		objBandInfoView = Ext.create( 'GCP.view.BandInfoView',
		{
			renderTo : 'bandInfoDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objBandInfoView ) )
	{
		objBandInfoView.hide();
		objBandInfoView.show();
	}
}
