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
	appFolder : 'static/scripts/interfacing/downloadDefinition/fieldMappings',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.FieldMappingView'
	],
	controllers :
	[
		'GCP.controller.FieldMappingController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.FieldMappingView',
		{
			renderTo : 'fieldMappingDiv'
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
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
})