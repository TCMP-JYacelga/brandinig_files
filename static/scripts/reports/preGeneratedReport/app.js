var objPreGeneratedReportView = null;
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
	appFolder : 'static/scripts/reports/preGeneratedReport/app',
	requires :
	[
		'Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView', 'GCP.view.PreGeneratedReportView','Ext.ux.gcp.vtypes.CustomVTypes'
	],
	controllers :
	[
		'GCP.controller.PreGeneratedReportController'
	],
	init : function( application )
	{
		//Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
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
		objPreGeneratedReportView = Ext.create( 'GCP.view.PreGeneratedReportView',
		{
			renderTo : 'preGeneratedReportDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objPreGeneratedReportView ) )
	{
		objPreGeneratedReportView.hide();
		objPreGeneratedReportView.show();
	}
}
