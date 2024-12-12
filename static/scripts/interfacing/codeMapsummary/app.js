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
	appFolder : 'static/scripts/interfacing/codeMapsummary/app',
	requires :
	[
		'GCP.view.CodeMapView'
	],
	controllers :
	[
		'GCP.controller.CodeMapController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.CodeMapView',
		{
			renderTo : 'codeMapView'
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