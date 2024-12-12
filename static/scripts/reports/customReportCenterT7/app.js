var objCustomReportCenterView = null;
var objChooseReportForm = null;
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
	appFolder : 'static/scripts/reports/customReportCenterT7/app',
	requires :
	[
		'Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView'
	],
	controllers :
	[
		'GCP.controller.CustomReportCenterController'
	],
	init : function( application )
	{
		//Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		prefHandler = Ext.create( 'Ext.ux.gcp.PreferencesHandler' );
		prefHandler.init( application );
	},
	launch : function()
	{
		Ext.Ajax.timeout = Ext.isEmpty( requestTimeout ) ? 600000 : parseInt( requestTimeout,10 ) * 1000 * 60;

		Ext.Ajax.on( 'requestexception', function( con, resp, op, e )
		{
			if( resp.status == 403 )
			{
				// window.location='logoutUser.action';
				location.reload();
			}
		} );
		objCustomReportCenterView = Ext.create( 'GCP.view.CustomReportCenterView',
		{
			renderTo : 'customReportCenterDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objCustomReportCenterView ) )
	{
		objCustomReportCenterView.hide();
		objCustomReportCenterView.show();
		var filterButton=objCustomReportCenterView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
	/*if( !Ext.isEmpty( objChooseReportForm ) )
	{
		objChooseReportForm.hide();
		objChooseReportForm.show();
	}*/
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	
