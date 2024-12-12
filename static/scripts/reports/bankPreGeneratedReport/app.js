var objBankPreGeneratedReportView = null;
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
	appFolder : 'static/scripts/reports/bankPreGeneratedReport/app',
	requires :
	[
		'Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.GroupView', 'GCP.view.BankPreGeneratedReportView','Ext.ux.gcp.vtypes.CustomVTypes'
	],
	controllers :
	[
		'GCP.controller.BankPreGeneratedReportController'
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
		objBankPreGeneratedReportView = Ext.create( 'GCP.view.BankPreGeneratedReportView',
		{
			renderTo : 'bankPreGeneratedReportDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objBankPreGeneratedReportView ) )
	{
		objBankPreGeneratedReportView.hide();
		objBankPreGeneratedReportView.show();
	}
}
