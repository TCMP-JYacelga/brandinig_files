var objMessageSentView = null;
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
	appFolder : 'static/scripts/messageForms/messageSentT7/app',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.MessageSentView'
	],
	controllers :
	[
		'GCP.controller.MessageSentController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		objMessageSentView = Ext.create( 'GCP.view.MessageSentView',
		{
			renderTo : 'messageSentDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objMessageSentView ) )
	{
		objMessageSentView.hide();
		objMessageSentView.show();
		var filterButton=objMessageSentView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});

