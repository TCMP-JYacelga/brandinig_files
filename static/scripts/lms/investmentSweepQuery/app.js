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
	appFolder : 'static/scripts/lms/investmentSweepQuery/app',
	requires :
	[
	 	'Ext.ux.gcp.PreferencesHandler',
	 	'GCP.view.InvestmentSweepView'
	],
	controllers :
	[
		'GCP.controller.InvestmentSweepQueryController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.InvestmentSweepView',
		{
			renderTo : 'summaryDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
		var filterButton=objProfileView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});		
