var objLmsNotionalPoolView = null;

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
	appFolder : 'static/scripts/lms/lmsNotionalPoolView/app',
	requires :
	[
		'GCP.view.LmsNotionalPoolView'
	],
	controllers :
	[
		'GCP.controller.LmsNotionalPoolViewController'
	],
	launch : function()
	{
		objLmsNotionalPoolView = Ext.create( 'GCP.view.LmsNotionalPoolView',
		{
			renderTo : 'lmsNotionalPoolViewDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objLmsNotionalPoolView ) )
	{
		objLmsNotionalPoolView.hide();
		objLmsNotionalPoolView.show();
		var filterButton=objLmsNotionalPoolView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
