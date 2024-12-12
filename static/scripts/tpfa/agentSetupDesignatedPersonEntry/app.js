var objProfView = null;
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
	appFolder : 'static/scripts/tpfa/agentSetupDesignatedPersonEntry/app',
	requires :
	[
		'GCP.view.AgentSetupDesignatedPersonEntryMainView'
	],
	controllers :
	[
		'GCP.controller.AgentSetupDesignatedPersonEntryController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		console.log('[AgentSetupDesignatedPersonEntryApplication] : Application is loaded.');
		objProfView = Ext.create( 'GCP.view.AgentSetupDesignatedPersonEntryMainView',
		{
			renderTo : 'agentSetupDesignatedPersonsDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfView ) )
	{
		objProfView.hide();
		objProfView.show();
	}
}
