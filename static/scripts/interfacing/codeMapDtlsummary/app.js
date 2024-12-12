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
	appFolder : 'static/scripts/interfacing/codeMapDtlsummary/app',
	requires :
	[
		'GCP.view.CodeMapDtlView'
	],
	controllers :
	[
		'GCP.controller.CodeMapDtlController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.CodeMapDtlView',
		{
			renderTo : 'codeMapFormDtlDiv'
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
