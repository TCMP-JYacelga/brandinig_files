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
	appFolder : 'static/scripts/btr/clearedCheckInquiry/app',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.ClearedCheckInquiryView'
	],
	controllers :
	[
		'GCP.controller.ClearedCheckInquiryController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.ClearedCheckInquiryView',
		{
			renderTo : 'clearedCheckInqDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
	}
}
