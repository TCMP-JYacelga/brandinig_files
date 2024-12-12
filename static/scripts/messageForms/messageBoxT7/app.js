var objMessageBoxView = null;
var objMessageChooseForm = null;

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
	appFolder : 'static/scripts/messageForms/messageBoxT7/app',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.MessageBoxView'
	],
	controllers :
	[
		'GCP.controller.MessageBoxController', 'Ext.ux.gcp.DateHandler','GCP.controller.MessageChooseFormController'
	],
	launch : function()
	{
		objMessageBoxView = Ext.create( 'GCP.view.MessageBoxView',
		{
			renderTo : 'messageBoxDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objMessageBoxView ) )
	{
		objMessageBoxView.hide();
		objMessageBoxView.show();
		var filterButton=objMessageBoxView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
	if( !Ext.isEmpty( objMessageChooseForm ) )
	{
		objMessageChooseForm.hide();
		objMessageChooseForm.show();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});
