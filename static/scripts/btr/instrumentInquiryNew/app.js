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
	appFolder : 'static/scripts/btr/instrumentInquiryNew/app',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.InstrumentInquiryView'
	],
	controllers :
	[
		'GCP.controller.InstrumentInquiryController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.InstrumentInquiryView',
		{
			renderTo : 'instrumentInqDiv'
		} );
	}
} );
function resizeContentPanel() {
	if (!Ext.isEmpty(objSummaryView)) {
		objSummaryView.hide();
		objSummaryView.show();
		var filterButton=objSummaryView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});
