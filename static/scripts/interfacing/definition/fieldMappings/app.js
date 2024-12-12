var objFieldMapping = null;
var objZeroProofing = null;
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
	appFolder : 'static/scripts/interfacing/definition/fieldMappings',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.FieldMappingView','GCP.view.FieldMappingZeroProofView'
	],
	controllers :
	[
		'GCP.controller.FieldMappingController', 'GCP.controller.FieldMappingZeroProofController'
	],
	launch : function()
	{
		objFieldMapping = Ext.create( 'GCP.view.FieldMappingView',
		{
			renderTo : 'fieldMappingDiv'
		} );
		
		objZeroProofing = Ext.create( 'GCP.view.FieldMappingZeroProofView',
		{
			renderTo : 'fieldMappingZeroProofDiv'
		} );
	}
} );
function resizeContentPanel()
{
	/*if( !Ext.isEmpty( objFieldMapping ) )
	{
		objFieldMapping.hide();
		objFieldMapping.show();
	}*/
	
	if( !Ext.isEmpty( objZeroProofing ) )
	{
		objZeroProofing.hide();
		objZeroProofing.show();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
})