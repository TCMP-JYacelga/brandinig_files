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
	appFolder : 'static/scripts/commonmst/interestProfileEntry/app',
	requires :
	[
		'GCP.view.LMSInterestProfileMainView'
	],
	controllers :
	[
		'GCP.controller.LMSInterestProfileEntryController', 'Ext.ux.gcp.DateHandler'
	],
	launch : function()
	{
		console.log('[IntrestProfileApplication] : Application is loaded.');
		objProfView = Ext.create( 'GCP.view.LMSInterestProfileMainView',
		{
			renderTo : 'interestProfileEntryDiv'
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
